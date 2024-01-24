import { CButton, CFormCheck, CFormInput, CFormSelect } from '@coreui/react'
import { enqueueSnackbar } from 'notistack'
import React, { useEffect, useState } from 'react'
import DatePicker from 'react-date-picker'
import { deleteApi, postApi, putApi } from 'src/utils/Api'
import { API_ENDPOINT } from 'src/utils/config'

const CurationForm = ({ setStateUpdate, curation, setCategories, categoryDetails, categoryID }) => {

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

    console.log('curationData', data)
    console.log("curraction =>", categoryDetails)

    useEffect(() => {
        setData((prev) => {
            return {
                ...prev,
                curationType: curation
            }
        })
    }, [curation])

    useEffect(() => {
        if (categoryID) {
            setData({
                curationType: categoryDetails?.curationType,
                title: categoryDetails?.categoryName,
                // displayPeriod: categoryDetails?.,
                isExpired: categoryDetails?.isExpired === 'yes' ? false : 'no',
                startDateTime: categoryDetails?.startDateTime,
                endDateTime: categoryDetails?.endDateTime,
                noLink: false,
                link1Name: categoryDetails?.linkName1,
                link1: categoryDetails?.linkUrl1,
                link2Name: categoryDetails?.linkName2,
                link2: categoryDetails?.linkUrl2,
                visibility: categoryDetails?.visibility,
            })
            
            categoryDetails?.startDateTime ? setBannerStartDate(categoryDetails?.startDateTime) : setBannerStartDate('')
            categoryDetails?.endDateTime ? setBannerEndDate(categoryDetails?.endDateTime) : setBannerEndDate('')
        }
        else{
            setData({
                curationType: '',
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
        }

    }, [categoryDetails, categoryID])





    const handleBannerStartDate = (event) => {
        let d = new Date(event),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear()
        if (month.length < 2) month = '0' + month
        if (day.length < 2) day = '0' + day
        setBannerStartDate([year, month, day].join('/'))
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
        setBannerEndDate([year, month, day].join('/'))
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

        const body = {
            name: data.title,
            curation: data.curationType,
            isExpired: data.isExpired === true ? 'yes' : 'no',
            startDateTime: data.isExpired === true ? "" : bannerStartDate,
            endDateTime: data.isExpired === true ? "" : bannerEndDate,
            linkName1: data.noLink === false ? data.link1Name : "",
            linkUrl1: data.noLink === false ? data.link1 : "",
            linkName2: data.noLink === false ? data.link2Name : "",
            linkUrl2: data.noLink === false ? data.link2 : ""
        }

        const filterData = Object.fromEntries(Object.entries(body).filter(([key, value]) => value !== ""))

        console.log('body', filterData)
        const res = await postApi(url, filterData)
        console.log('resStaus', res)
        if (res?.data?.status === 200) {
            enqueueSnackbar("Category created successfully", { variant: "success" })
            setStateUpdate((prev) => prev + 1)
        }
        else {
            enqueueSnackbar("Failed to craete category", { variant: "error" })
        }
    }

    const handleDeleteCategory = async () => {
        let url = `${API_ENDPOINT.delete_category}?id=`

        const res = await deleteApi(url)
        if (res.status === 200) {
            console.log('category deleted')
        }
        else {
            console.log('caught an error')
        }
    }

    const handleUpdateCategories = async () => {
        let url = `${API_ENDPOINT.update_category}`

        const body = {
            id: categoryID,
            name: data.title,
            curation: data.curationType,
            isExpired: data.isExpired === true ? 'yes' : 'no',
            startDateTime: data.isExpired === true ? "" : bannerStartDate,
            endDateTime: data.isExpired === true ? "" : bannerEndDate,
            linkName1: data.link1Name ? data.link1Name : "",
            linkUrl1: data.link1 ? data.link1 : "",
            linkName2: data.link2Name ? data.link2Name : "",
            linkUrl2: data.link2 ? data.link2 : ""
        }

        const filterData = Object.fromEntries(Object.entries(body).filter(([key, value]) => value !== ""))

        console.log('updatebody', filterData)
        const res = await putApi(url, filterData)
        console.log('resStaus', res)
        if (res?.data?.status === 200) {
            enqueueSnackbar("Category updated successfully", { variant: "success" })
            setStateUpdate((prev) => prev + 1)
        }
        else {
            enqueueSnackbar("Failed to update category", { variant: "error" })
        }
    }

    return (
        <div>
            {/* <h1>Curation form</h1> */}
            <div style={{ width: '100%', borderRadius: '0' }}>
                <div className="card p-2">
                    <div className="dropdown-container">
                        <label className="me-3">Curation</label>
                    </div>
                    <div className='clearfix '>
                        <CButton onClick={handleDeleteCategory} className='float-end'>Delete</CButton>
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
                                <div className="upload-image-main-container">
                                    <div style={data.isExpired ? { pointerEvents: 'none', opacity: 0.4 } : null} className="upload-img-btn-and-info">
                                        <div>
                                            <DatePicker
                                                value={bannerStartDate}
                                                minDate={new Date()}
                                                onChange={(event) => handleBannerStartDate(event)}
                                            />
                                        </div>
                                        <div>
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
                                        </div>
                                        <div>
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
                                            checked={data.isExpired}
                                            // value={}
                                            onChange={handleChangeExpire}
                                        />
                                        <p>No Expiration Date
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex col-md-12">
                                <div className="form-outline form-white d-flex">
                                    <div className="formWrpLabel">
                                        <label className="fw-bolder ">Link Menu</label>
                                    </div>
                                    <div className='col-md-12'>

                                        <div style={{ width: '100%' }} className="push-notification-container gap-3">
                                            <CFormCheck
                                                type="checkbox"
                                                name="isVisible"
                                                checked={data.noLink}
                                                onChange={handleChangeNoLink}
                                                value={data.noLink}
                                            />
                                            <p>None</p>
                                        </div>
                                        <div style={data.noLink ? { pointerEvents: 'none', opacity: 0.4 } : null} className='gap-3'>
                                            <div className='push-notification-container gap-3'>
                                                <CFormCheck
                                                    type="checkbox"
                                                    name="isVisible"
                                                />
                                                <p>Link (Max 2 link)</p>
                                            </div>
                                            <div style={{ margin: '10%', display: 'flex', flexDirection: 'column', gap: 10 }}>
                                                <CFormInput type='text' value={data.link1Name} onChange={handleLinkName1} placeholder='Enter title' />
                                                <CFormInput type='text' value={data.link1} onChange={handleLink1} placeholder='Enter URL' />
                                            </div>
                                            <div style={{ margin: '10%', display: 'flex', flexDirection: 'column', gap: 10 }}>
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
                    <CButton onClick={categoryID ?  handleUpdateCategories : handleCreateCategories}>Save</CButton>
                </div>
            </div>
        </div>
    )
}

export default CurationForm