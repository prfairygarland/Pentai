import { CButton, CFormCheck, CFormInput, CFormSelect, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import { enqueueSnackbar } from 'notistack'
import React, { useEffect, useState } from 'react'
import DatePicker from 'react-date-picker'
import { deleteApi, postApi, putApi } from 'src/utils/Api'
import { API_ENDPOINT } from 'src/utils/config'

const CurationForm = ({ setStateUpdate, setCuration, curation, setCategories, categoryDetails, categoryID }) => {

    const [bannerStartDate, setBannerStartDate] = useState('')
    const [bannerStartHours, setBannerStartHours] = useState('00')
    const [bannerStartMins, setBannerStartMins] = useState('00')
    const [bannerEndDate, setBannerEndDate] = useState('')
    const [bannerEndHours, setBannerEndHours] = useState('00')
    const [bannerEndMins, setBannerEndMins] = useState('00')
    const [data, setData] = useState({
        curationType: '',
        title: '',
        displayPeriod: '',
        isExpired: true,
        isExpired: true,
        startDateTime: '',
        endDateTime: '',
        noLink: false,
        link1Name: '',
        link1: '',
        link2Name: '',
        link2: '',
        visibility: false
    })
    const [deleteVisible, setdeleteVisible] = useState(false)

    let startTime
    let endTime

    useEffect(() => {
        if (categoryID) {
            setData({
                curationType: categoryDetails?.curationType,
                title: categoryDetails?.categoryName,
                isExpired: categoryDetails?.isExpired === 'no' ? false : true,
                isExpired: categoryDetails?.isExpired === 'no' ? false : true,
                link1Name: categoryDetails?.linkName1,
                link1: categoryDetails?.linkUrl1,
                link2Name: categoryDetails?.linkName2,
                link2: categoryDetails?.linkUrl2,
                visibility: categoryDetails?.visibility,
            })

            startTime = new Date(categoryDetails?.startDateTime)
            endTime = new Date(categoryDetails?.endDateTime)
            if (!isNaN(startTime)) {
                let month = '' + (startTime.getMonth() + 1),
                    day = '' + startTime.getDate(),
                    year = startTime.getFullYear()
                if (month.length < 2) month = '0' + month
                if (day.length < 2) day = '0' + day
                setBannerStartDate([year, month, day].join('-'))
                if (startTime.getHours() + 1 < 10) {
                    setBannerStartHours('0' + startTime.getHours())
                } else {
                    setBannerStartHours(startTime.getHours())
                }
                if (startTime.getMinutes() < 10) {
                    setBannerStartMins('0' + startTime.getMinutes())
                } else {
                    setBannerStartMins(startTime.getMinutes())
                }
            }
            if (!isNaN(endTime)) {
                let emonth = '' + (endTime.getMonth() + 1),
                    eday = '' + endTime.getDate(),
                    eyear = endTime.getFullYear()
                if (emonth.length < 2) emonth = '0' + emonth
                if (eday.length < 2) eday = '0' + eday
                setBannerEndDate([eyear, emonth, eday].join('-'))
                if (endTime.getHours() + 1 < 10) {
                    setBannerEndHours('0' + endTime.getHours())
                } else {
                    setBannerEndHours(endTime.getHours())
                }
                if (endTime.getMinutes() < 10) {
                    setBannerEndMins('0' + endTime.getMinutes())
                } else {
                    setBannerEndMins(endTime.getMinutes())
                }
            }
        }
        else {
            setData({
                curationType: curation,
                title: '',
                displayPeriod: '',
                isExpired: false,
                startDateTime: '',
                endDateTime: '',
                noLink: false,
                link1Name: '',
                link1: '',
                link2Name: '',
                link2: '',
                visibility: false
            })
            setBannerStartDate('')
            setBannerEndDate('')
        }

    }, [categoryDetails, categoryID, curation])





    const handleBannerStartDate = (event) => {
        let d = new Date(event),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear()
        if (month.length < 2) month = '0' + month
        if (day.length < 2) day = '0' + day
        setBannerStartDate([year, month, day].join('-'))
    }

    const bannerStartTimeHandler = (e) => {
        setBannerStartHours(e.target.value.split(':')[0])
        setBannerStartMins(e.target.value.split(':')[1])
    }

    const handleBannerEndDate = (event) => {
        let d = new Date(event),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear()
        if (month.length < 2) month = '0' + month
        if (day.length < 2) day = '0' + day
        setBannerEndDate([year, month, day].join('-'))
    }

    const bannerEndTimeHandler = (e) => {
        setBannerEndHours(e.target.value.split(':')[0])
        setBannerEndMins(e.target.value.split(':')[1])
    }

    const handleCurationType = (e) => {
        setData((prev) => {
            return {
                ...prev,
                curationType: e.target.value
            }
        })
    }

    const handleChangeTitle = (e) => {
        setData((prev) => {
            return {
                ...prev,
                title: e.target.value
            }
        })
    }

    const handleChangeExpire = (e) => {
        setData((prev) => {
            return {
                ...prev,
                isExpired: Boolean(!data.isExpired)
            }
        })
    }

    const handleLinkName1 = (e) => {
        setData((prev) => {
            return {
                ...prev,
                link1Name: e.target.value
            }
        })
    }

    const handleLink1 = (e) => {
        setData((prev) => {
            return {
                ...prev,
                link1: e.target.value
            }
        })
    }

    const handleLink2 = (e) => {
        setData((prev) => {
            return {
                ...prev,
                link2: e.target.value
            }
        })
    }

    const handleLinkName2 = (e) => {
        setData((prev) => {
            return {
                ...prev,
                link2Name: e.target.value
            }
        })
    }

    const handleChangeNoLink = (e) => {
        setData((prev) => {
            return {
                ...prev,
                noLink: Boolean(!data.noLink)
            }
        })
    }

    const handleCreateCategories = async () => {
        let url = `${API_ENDPOINT.create_categories}`
        let startDateTime = ""
        let endDateTime = ""
        let linkName1 = ""
        let linkUrl1 = ""
        let linkName2 = ""
        let linkUrl2 = ""
        if (!data.isExpired) {
            startDateTime = new Date(bannerStartDate + 'T' + bannerStartHours + ':' + bannerStartMins);
            endDateTime = new Date(bannerEndDate + 'T' + bannerEndHours + ':' + bannerEndHours);
        }
        if (!data.noLink) {
            linkName1 = data.link1Name ? data.link1Name : '';
            linkUrl1 = data.link1 ? data.link1 : ''
            linkName2 = data.link2Name ? data.link2Name : '';
            linkUrl2 = data.link2 ? data.link2 : ''
        }

        const body = {
            name: data.title,
            curation: data.curationType,
            isExpired: data.isExpired === true ? 'yes' : 'no',
            startDateTime: startDateTime,
            endDateTime: endDateTime,
            linkName1: linkName1,
            linkUrl1: linkUrl1,
            linkName2: linkName2,
            linkUrl2: linkUrl2
        }

        if (data.title.trim() === '') {
            enqueueSnackbar('Please enter the title', { variant: 'error' })
            return false
        }
        if (!data.isExpired) {
            if (bannerStartDate === '') {
                enqueueSnackbar('Please enter start date', { variant: 'error' })
                return false
            }
            if (bannerEndDate === '') {
                enqueueSnackbar('Please enter end date', { variant: 'error' })
                return false
            }
        }
        if (!data.noLink) {
            if (data.link1Name === '') {
                enqueueSnackbar('Please enter link Name', { variant: 'error' })
                return false
            }
            if (data.link1 === '')
                enqueueSnackbar('Please enter link', { variant: 'error' })
            return false
        }

        const filterData = Object.fromEntries(Object.entries(body).filter(([key, value]) => value !== ""))

        const res = await postApi(url, filterData)
        if (res?.data?.status === 200) {
            enqueueSnackbar("Category created successfully", { variant: "success" })
            setStateUpdate((prev) => prev + 1)
            setCategories('AllCuration')
        }
        else {
            enqueueSnackbar("Failed to create category", { variant: "error" })
        }
    }

    const handleDeleteCategory = async () => {
        let url = `${API_ENDPOINT.delete_category}?id=`

        const res = await deleteApi(url, categoryID)
        if (res?.data?.status === 200) {
            setStateUpdate((prev) => prev + 1)
            enqueueSnackbar('category deleted', { variant: 'success' })
            setdeleteVisible(false)
            setCategories('AllCuration')
        }
        else {
            enqueueSnackbar('failed to deleted category', { variant: 'error' })
        }
    }

    const handleUpdateCategories = async () => {
        let url = `${API_ENDPOINT.update_category}`

        let startDateTime = ""
        let endDateTime = ""
        if (!data.isExpired) {
            startDateTime = new Date(bannerStartDate + 'T' + bannerStartHours + ':' + bannerStartMins);
            endDateTime = new Date(bannerEndDate + 'T' + bannerEndHours + ':' + bannerEndMins);
        }

        const body = {
            id: categoryID,
            name: data.title,
            curation: data.curationType,
            isExpired: data.isExpired === true ? 'yes' : 'no',
            startDateTime: startDateTime,
            endDateTime: endDateTime,
            linkName1: data.link1Name ? data.link1Name : "",
            linkUrl1: data.link1 ? data.link1 : "",
            linkName2: data.link2Name ? data.link2Name : "",
            linkUrl2: data.link2 ? data.link2 : ""
        }


        if (data.title.trim() === '') {
            enqueueSnackbar('Please enter the title', { variant: 'error' })
            return false
        }
        if (!data.isExpired) {
            if (bannerStartDate === '') {
                enqueueSnackbar('Please enter start date', { variant: 'error' })
                return false
            }
            if (bannerEndDate === '') {
                enqueueSnackbar('Please enter end date', { variant: 'error' })
                return false
            }
        }
        if (!data.noLink) {
            if (data.link1Name === '') {
                enqueueSnackbar('Please enter link Name', { variant: 'error' })
                return false
            }
            if (data.link1 === '')
                enqueueSnackbar('Please enter link', { variant: 'error' })
            return false
        }

        const filterData = Object.fromEntries(Object.entries(body).filter(([key, value]) => value !== ""))

        const res = await putApi(url, filterData)
        if (res?.data?.status === 200) {
            enqueueSnackbar("Category updated successfully", { variant: "success" })
            setStateUpdate((prev) => prev + 1)
            setCategories('AllCuration')
        }
        else {
            enqueueSnackbar("Failed to update category", { variant: "error" })
        }
    }

    return (
        <div className='col-md-8'>
            {/* <h1>Curation form</h1> */}
            <div style={{ width: '100%', borderRadius: '0' }}>
                <div className="card p-2">
                    <div className="dropdown-container">
                        {/* <label className="me-3">Curation</label> */}
                    </div>
                    <div className='clearfix '>
                        <CButton onClick={() => setdeleteVisible(true)} className='float-end btn-black'>Delete</CButton>
                    </div>
                    <div className="card-body">
                        <div className="formWraper">
                            <div className="form-outline form-white   d-flex ">
                                <div className="formWrpLabel">
                                    <label className="fw-bolder ">
                                        Curation Type
                                    </label>
                                </div>
                                <div className="formWrpInpt">
                                    <div className="d-flex formradiogroup mb-2 gap-3">
                                        <CFormSelect
                                            type="text"
                                            placeholder="Library"
                                            name="title"
                                            value={data?.curationType}
                                            options={[
                                                { label: 'Individual', value: 'individual' },
                                                { label: 'series', value: 'series' },
                                            ]}
                                            onChange={handleCurationType}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="form-outline form-white   d-flex ">
                                <div className="formWrpLabel">
                                    <label className="fw-bolder ">
                                        Title
                                    </label>
                                </div>
                                <div className="formWrpInpt">
                                    <div className="d-flex formradiogroup mb-2 gap-3">
                                        <CFormInput
                                            type="text"
                                            placeholder=""
                                            name="code"
                                            value={data.title}
                                            onChange={handleChangeTitle}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="form-outline form-white  d-flex ">
                                <div className="formWrpLabel">
                                    <label className="fw-bolder ">Display Period</label>
                                </div>
                                <div className="p-2">
                                    <div style={data.isExpired ? { pointerEvents: 'none', opacity: 0.4 } : null} >
                                        <div>
                                            <DatePicker
                                                value={bannerStartDate}
                                                minDate={new Date()}
                                                onChange={(event) => handleBannerStartDate(event)}
                                            />
                                            <input
                                                type="time"
                                                name="time"
                                                id="time"
                                                className="time-picker"
                                                value={`${bannerStartHours}:${bannerStartMins}`}
                                                onChange={(e) => bannerStartTimeHandler(e)}
                                            />
                                        </div>

                                        -&nbsp;&nbsp;
                                        <div>
                                            <DatePicker
                                                value={bannerEndDate}
                                                minDate={new Date()}
                                                onChange={(event) => handleBannerEndDate(event)}
                                            />

                                            <input
                                                type="time"
                                                name="time"
                                                id="time"
                                                className="time-picker"
                                                value={`${bannerEndHours}:${bannerEndMins}`}
                                                onChange={(e) => bannerEndTimeHandler(e)}
                                            />
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: 10, marginTop: '5%' }}>
                                        <CFormCheck
                                            type="checkbox"
                                            defaultChecked={data.isExpired}
                                            // checked={data.isExpired}
                                            value={data.isExpired}
                                            onChange={handleChangeExpire}
                                            label="No Expiration Date"
                                        />
                                        
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex ">
                                <div className="form-outline form-white d-flex w-100">
                                    <div className="formWrpLabel">
                                        <label className="fw-bolder ">Link Menu</label>
                                    </div>
                                    <div className='w-100 p-3'>

                                        <div style={{ width: '100%' }} className="push-notification-container  gap-3 p-0 pb-2">
                                            <CFormCheck
                                                type="checkbox"
                                                name="isVisible"
                                                checked={data.noLink}
                                                onChange={handleChangeNoLink}
                                                value={data.noLink} 
                                                label="None"
                                            />
                                         
                                        </div>
                                        <div style={data.noLink ? { pointerEvents: 'none', opacity: 0.4 } : null} className='gap-3'>
                                            <div className='push-notification-container p-0 pb-2 gap-3'>
                                                <CFormCheck
                                                    type="checkbox"
                                                    name="isVisible"
                                                    label="Link (Max 2 link)"
                                                />
                                                
                                            </div>
                                            <div className='w-100' style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                                <CFormInput type='text' value={data.link1Name} onChange={handleLinkName1} placeholder='Enter title' />
                                                <CFormInput type='text' value={data.link1} onChange={handleLink1} placeholder='Enter URL' />

                                                <CFormInput type='text' value={data.link2Name} onChange={handleLinkName2} placeholder='Enter title' />
                                                <CFormInput type='text' value={data.link2} onChange={handleLink2} placeholder='Enter URL' />
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                {/* <div className="form-outline form-white d-flex col-md-6">
                            </div> */}
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '5%', gap: 10 }}>
                    <CButton onClick={() => setCategories('AllCuration')} style={{ marginRight: '2%', background: '#ccc', border: 'none' }}>Cancel</CButton>
                    <CButton onClick={categoryID ? handleUpdateCategories : handleCreateCategories}>Save</CButton>
                </div>
                <CModal
                    backdrop="static"
                    visible={deleteVisible}
                    onClose={() => setdeleteVisible(false)}
                    aria-labelledby="StaticBackdropExampleLabel"
                >
                    <CModalHeader>
                        <CModalTitle id="StaticBackdropExampleLabel">Delete</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <p>Are you sure you want to delete this category?
                            <br />
                            All categories and items belonging will be deleted.</p>
                    </CModalBody>
                    <CModalFooter>
                        <CButton onClick={handleDeleteCategory} color="primary">Delete</CButton>
                        <CButton onClick={() => setdeleteVisible(false)} color="secondary">
                            Cancel
                        </CButton>
                    </CModalFooter>
                </CModal>
            </div>
        </div>

    )
}

export default CurationForm