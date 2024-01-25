import { CButton, CFormCheck, CFormInput, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import ReactTable from 'src/components/common/ReactTable'
import { deleteApi, getApi, postApi, putApi } from 'src/utils/Api'
import { ALL_CONSTANTS, API_ENDPOINT } from 'src/utils/config'
import { imageUrl } from './BookRentalStatus'
import CIcon from '@coreui/icons-react'
import { cilLineWeight, cilList, cilListRich, cilLockUnlocked, cilMenu } from '@coreui/icons'
import moment from 'moment/moment'
import DatePicker from 'react-date-picker'
import { enqueueSnackbar } from 'notistack'

const BookRentalBanner = () => {
    const [modalProps, setModalProps] = useState({})
    const [bannerSetting, setBannerSetting] = useState({})
    const [itemsPerPage, setItemsPerPage] = useState(5)
    const [currentPage, setCurrentPage] = useState(0)
    const [bannerList, setbannerList] = useState([])
    const [addModifyClubBannerModal, setAddModifyClubBannerModal] = useState(false)
    const [bannerTitle, setBannerTitle] = useState('')
    const [bannerStartDate, setBannerStartDate] = useState('')
    const [bannerStartHours, setBannerStartHours] = useState('00')
    const [bannerStartMins, setBannerStartMins] = useState('00')
    const [bannerEndDate, setBannerEndDate] = useState('')
    const [bannerEndHours, setBannerEndHours] = useState('00')
    const [bannerEndMins, setBannerEndMins] = useState('00')
    const [uploadedBannerImage, setUploadedBannerImage] = useState('')
    const [isExpiration, setIsExpiration] = useState(false)
    const [imageType, setImageType] = useState('bannerImageOnly')
    const [linkToUrl, setLinkToUrl] = useState('')
    const [popupImage, setPopupImage] = useState('')
    // const [clubBannerData, setClubBannerData] = useState({})
    const [bannerUpdateId, setBannerUpdateId] = useState('')
    const [deleteVisible, setDeleteVisible] = useState(false)
    const [deleteId, setDeleteId] = useState(null)

    const getBannerList = async () => {
        let url = `${API_ENDPOINT.get_bannerList}?limit=${itemsPerPage}&offset=${currentPage + 1}`

        const res = await getApi(url)
        if (res.status === 200) {
            setbannerList(res?.data)
        }

    }

    console.log('bannerList', bannerList)


    async function urlToBlob(url) {
        const response = await fetch(url)
        const blob = await response.blob()
        return blob
    }

    const urlsToFiles = async (url) => {
        if (!url) return
        const blob = await urlToBlob(imageUrl + url)
        const fileName = url
        return new File([blob], fileName, { type: blob.type })
    }

    const getBannerDetail = async () => {
        let url = `${API_ENDPOINT.get_banner_CategoryDetail}`

        const res = await getApi(url)
        if (res?.status === 200) {
            setBannerSetting(res.data)
            //   enqueueSnackbar('Banner updated success', { variant: 'success' })
        }
        else {
            //   enqueueSnackbar('Failed to Updated Banner ', { variant: 'error' })
        }
    }

    useEffect(() => {
        getBannerDetail()
    }, [])


    const updateBanner = async () => {
        let url = `${API_ENDPOINT.update_bannerCategory}`

        const body = {
            id: bannerSetting?.id,
            displayBannerWidget: bannerSetting?.displayBannerWidget,
            autoSlideBanner: bannerSetting?.autoSlideBanner,
            maxBannerNumber: bannerSetting?.maxBannerNumber
        }


        const res = await putApi(url, body)
        if (res?.data?.status === 200) {
            enqueueSnackbar('Banner updated success', { variant: 'success' })
            getBannerDetail()
        }
        else {
            enqueueSnackbar('Failed to Updated Banner ', { variant: 'error' })
        }
    }

    const editClubBannerHandler = async (id) => {
        try {
            let url = `${API_ENDPOINT.get_bannerDetails}?id=${id}`
            const res = await getApi(url)
            if (res?.status === 200) {
                setBannerTitle(res?.data?.title)
                const startTime = new Date(res?.data?.startDateTime)
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

                const endTime = new Date(res?.data?.endDateTime)
                month = '' + (endTime.getMonth() + 1)
                day = '' + endTime.getDate()
                year = endTime.getFullYear()
                if (month.length < 2) month = '0' + month
                if (day.length < 2) day = '0' + day
                setBannerEndDate([year, month, day].join('-'))
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

                const bannerImage = await urlsToFiles(res?.data?.image)
                setUploadedBannerImage(bannerImage)
                setImageType(res?.data?.type)
                setLinkToUrl(res?.data?.linkUrl)
                const popUpImage = await urlsToFiles(res?.data?.popUpImage)
                setPopupImage(popUpImage)
                setBannerUpdateId(res?.data?.id)
                setAddModifyClubBannerModal(true)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const validateClubBannerHandler = () => {
        if (bannerTitle.trim() === '') {
            enqueueSnackbar('Please enter title', { variant: 'error' })
            return false
        } else if (bannerStartDate === '') {
            enqueueSnackbar('Please select start date', { variant: 'error' })
            return false
        } else if (bannerStartHours === '00' && bannerStartMins === '00') {
            enqueueSnackbar('Please select start time', { variant: 'error' })
            return false
        } else if (!bannerUpdateId && new Date() > new Date(bannerStartDate + 'T' + bannerStartHours + ':' + bannerStartMins)) {
            enqueueSnackbar('Start time cannot be earlier than current time', { variant: 'error' })
            return false
        } else if (bannerEndDate === '') {
            enqueueSnackbar('Please select end date', { variant: 'error' })
            return false
        } else if (bannerEndHours === '00' && bannerEndMins === '00') {
            enqueueSnackbar('Please select end time', { variant: 'error' })
            return false
        } else if (!bannerUpdateId && new Date(bannerStartDate + 'T' + bannerStartHours + ':' + bannerStartMins) > new Date(bannerEndDate + 'T' + bannerEndHours + ':' + bannerEndMins)) {
            enqueueSnackbar('End time cannot be earlier than start time', { variant: 'error' })
            return false
        } else if (uploadedBannerImage === '') {
            enqueueSnackbar('Please upload a banner image', { variant: 'error' })
            return false
        } else if (imageType === 'linkTo' && linkToUrl === '') {
            enqueueSnackbar('Please enter URL for Link to post', { variant: 'error' })
            return false
        } else if (imageType === 'popUpImage' && popupImage === '') {
            enqueueSnackbar('Please add pop-up image for banner', { variant: 'error' })
            return false
        } else {
            confirmationSaveClubBannerModalHandler(true)
        }
    }

    const confirmationSaveClubBannerModalHandler = (isOpen) => {
        setModalProps({
            isModalOpen: isOpen,
            title: 'Confirmation',
            content: 'Are you sure you want to save?',
            cancelBtn: 'No',
            cancelBtnHandler: cancelConfirmation,
            successBtn: 'Yes',
            successBtnHandler: () => saveClubBannerHandler(),
            modalCloseHandler: confirmationSaveClubBannerModalHandler,
        })
    }

    const saveClubBannerHandler = async () => {
        try {
            const formData = new FormData()
            formData.append('bannerCategoryId', bannerSetting.id)
            formData.append('title', bannerTitle)
            formData.append('image', uploadedBannerImage)
            formData.append('type', imageType)
            formData.append('imageOrder', 1)
            formData.append('isExpired', isExpiration === true ? 'yes' : 'no')
            if(isExpiration === 'no'){
                formData.append('startDateTime', new Date(bannerStartDate + 'T' + bannerStartHours + ':' + bannerStartMins))
                formData.append('endDateTime', new Date(bannerEndDate + 'T' + bannerEndHours + ':' + bannerEndHours))
            }
            if (imageType === 'linkTo') {
                formData.append('linkUrl', linkToUrl)
            }
            if (imageType === 'popUpImage') {
                formData.append('popUpImage', popupImage)
            }

            let res = ''
            let body = formData
            if (bannerUpdateId) {
                formData.append('id', bannerUpdateId)
                res = await putApi(API_ENDPOINT.update_banner, formData)
            } else {
                res = await postApi(API_ENDPOINT.create_banner, formData)
            }
            if (res.status === 200) {
                if (res?.data?.status === 409) {
                    enqueueSnackbar(res?.data?.msg, { variant: 'error' })
                } else if (res?.data?.status !== 200) {
                    enqueueSnackbar(res?.data?.error, { variant: 'error' })
                } else {
                    bannerUpdateId ?
                        enqueueSnackbar('Banner Updated Successfully', { variant: 'success' }) :
                        enqueueSnackbar('Banner Added Successfully', { variant: 'success' })
                }
                getBannerList()
            }
        } catch (error) {
            console.log(error)
        }
        setAddModifyClubBannerModal(false)
        setModalProps({
            isModalOpen: false
        })
    }

    const cancelConfirmation = () => {
        setModalProps({
            isModalOpen: false
        })
    }

    const cancelBannerModalHandler = () => {
        setAddModifyClubBannerModal(false)
        setModalProps({
            isModalOpen: false
        })
    }

    const handleNewBookBannaer = () => {
        setBannerUpdateId('')
        setBannerTitle('')
        setBannerStartDate('')
        setBannerStartHours('')
        setBannerStartMins('')
        setBannerEndDate('')
        setBannerEndHours('')
        setBannerEndMins('')
        setUploadedBannerImage('')
        setImageType('bannerImageOnly')
        setLinkToUrl('')
        setPopupImage('')
        setAddModifyClubBannerModal(true)
    }

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


    const cancelClubBannerModalHandler = (isOpen) => {
        setModalProps({
            isModalOpen: isOpen,
            title: 'Confirmation',
            content: 'Are you sure you want to close?',
            cancelBtn: 'No',
            cancelBtnHandler: cancelConfirmation,
            successBtn: 'Yes',
            successBtnHandler: () => cancelBannerModalHandler(),
            modalCloseHandler: cancelClubBannerModalHandler,
        })
    }

    const confirmDeleteBannerHandler = (isOpen, id) => {
        // alert('hello')
        setModalProps({
            isModalOpen: isOpen,
            title: 'Confirmation',
            content: 'Are you sure to delete banner?',
            cancelBtn: 'No',
            cancelBtnHandler: cancelConfirmation,
            successBtn: 'Yes',
            successBtnHandler: () => deleteBannerHandler(id),
            modalCloseHandler: confirmDeleteBannerHandler,
        })
    }

    const deleteBannerHandler = async (id) => {
        try {
            let url = `${API_ENDPOINT.delete_banner}?id=`
            const res = await deleteApi(url, id)
            if (res?.data?.status === 200) {
                getBannerList()
                enqueueSnackbar('Banner Deleted Successfully', { variant: 'success' })
                setDeleteVisible(false)
            } else {
                enqueueSnackbar('Something went wrong, please try later!', { variant: 'success' })
            }
        } catch (error) {
            console.log(error)
        }
        setModalProps({
            isModalOpen: false
        })
    }

    useEffect(() => {
        getBannerList()
    }, [])

    const handleMaxBannerChange = (e) => {
        setBannerSetting((prev) => {
            return {
                ...prev,
                maxBannerNumber: e.target.value
            }
        })
    }

    const handleSelectionChange = useCallback((selectedRowsIds) => {
        // setSelectedRows([...selectedRows, selectedRowsIds]);
        // console.log('selected rows type =>', typeof selectedRowsIds);

        // const getIds = selectedRowsIds.map((item) => {
        //   console.log('ites =>', item);
        //   return item.id.toString();
        // })
        // console.log('getIds', getIds)
        // console.log('getIds =>', typeof getIds);
        // setDataIds(getIds)

    }, []);

    const columns = useMemo(() => [
        {
            Header: 'Order',
            accessor: '',
            Cell: ({ row }) => <p><CIcon icon={cilMenu} size='sm' /></p>
        },
        {
            Header: 'No',
            accessor: '',
            Cell: ({ row }) => {
                return currentPage * itemsPerPage + (row?.index + 1)
            }
        },
        {
            Header: 'Thumbnail Image',
            accessor: '',
            Cell: ({ row }) =>
                <img alt="" crossOrigin='anonymous' src={imageUrl + row?.original?.image} style={{ width: '100%', height: '100px' }}></img>

        },
        {
            Header: 'Title',
            accessor: 'title',
            Cell: ({ row }) => <p onClick={() => editClubBannerHandler(row.original.id)}>{row.original.title}</p>
        },
        {
            Header: 'Posting Period',
            accessor: '',
            Cell: ({ row }) => <p>{row.original.isExpired === 'no' && (row.original.startDateTime && row.original.endDateTime) ? `${moment(row.original.startDateTime).format("YYYY-MM-DD HH:mm")}~${moment(row.original.endDateTime).format("YYYY-MM-DD HH:mm:ss")}` : 'No expiration date'} </p>,

        },
        {
            Header: 'Status',
            accessor: 'status',
            Cell: ({ row }) => <p>{row.original.status}</p>,
        },
        {
            Header: 'Type',
            accessor: 'type',
            Cell: ({ row }) => <p>{row.original.type}</p>,

        },
        {
            Header: 'Usage Status',
            accessor: '',
            Cell: ({ row }) => <p>{row.original.usageStatus ? row.original.usageStatus : 'NA'}</p>
        },
        {
            Header: 'Action',
            accessor: 'button',
            Cell: ({ row }) => <CButton className='mx-3 rounded border-1 btn-black' onClick={() => { setDeleteId(row.original.id); setDeleteVisible(true) }}>Delete</CButton>

        },
    ], [])


    return (
        <div>
            <header>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', border: '1px', width: '100%', height: '20%', background: '#ccc' }}>
                    <div>
                        <label>Display Banner widget</label>
                    </div>
                    <div>
                        <div className="push-notification-container gap-3">
                            <CFormCheck className='d-flex gap-2' type="radio" name="banner" id="exampleRadios1" label={`${' '} Yes`}
                                defaultChecked={bannerSetting.displayBannerWidget === 'yes'}
                                onClick={() => setBannerSetting((prev) => ({ ...prev, displayBannerWidget: 'yes' }))}
                                value='yes'
                            />
                            <CFormCheck className='d-flex gap-2' type="radio" name="banner" id="exampleRadios2" label="No"
                                defaultChecked={bannerSetting.displayBannerWidget === 'no'}
                                onClick={() => setBannerSetting((prev) => ({ ...prev, displayBannerWidget: 'no' }))}
                                value='no'
                            />
                        </div>
                    </div>
                    <div>
                        <label>Auto Slide Banner</label>
                    </div>
                    <div>
                        <div className="push-notification-container gap-3">
                            <CFormCheck className='d-flex gap-2' type="radio" name="visibility" id="exampleRadios1" label="Yes"
                                defaultChecked={bannerSetting.autoSlideBanner === "yes"}
                                onClick={() => setBannerSetting((prev) => ({ ...prev, autoSlideBanner: 'yes' }))}
                                value='yes'
                            />
                            <CFormCheck className='d-flex gap-2' type="radio" name="visibility" id="exampleRadios2" label="No"
                                defaultChecked={bannerSetting.autoSlideBanner === "no"}
                                onClick={() => setBannerSetting((prev) => ({ ...prev, autoSlideBanner: 'no' }))}
                                value='no'
                            />
                        </div>
                    </div>
                    <div>
                        <label>Max Banner Number</label>
                    </div>
                    <div>
                        <div className="">
                            <CFormInput style={{ width: '80px', height: '40px' }} type="number" name="visibility" id="exampleRadios1"
                                onChange={handleMaxBannerChange}
                                value={bannerSetting.maxBannerNumber}
                            />
                        </div>
                    </div>
                    <div>
                        <CButton onClick={updateBanner}>Save</CButton>
                    </div>
                </div>
            </header>
            <div className='clearfix my-4 '>
                <CButton className='float-end ' onClick={handleNewBookBannaer}>New Banner</CButton>
            </div>
            <div style={{ marginTop: '3%' }}>
                <ReactTable columns={columns} data={bannerList} showCheckbox={false} onSelectionChange={handleSelectionChange} />
            </div>
            <CModal
                className="modal-lg"
                alignment="center"
                visible={addModifyClubBannerModal}
                onClose={() => {
                    setAddModifyClubBannerModal(false)
                }}
                backdrop="static"
                aria-labelledby="LiveDemoExampleLabel"
            >
                <CModalHeader
                    onClose={() => {
                        setAddModifyClubBannerModal(false)
                    }}
                >
                    <CModalTitle className="p-1">Banner Registration</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <div className="card-body">
                        <div className="formWraper">
                            <div className="form-outline form-white  d-flex ">
                                <div className="formWrpLabel">
                                    <label className="fw-bolder ">Thumbnail Image</label>
                                </div>
                                <div className="upload-image-main-container">
                                    <div className="upload-img-btn-and-info">
                                        <div className="upload-container-btn">
                                            <label className="label-btn" color="dark" htmlFor="imageFiles">
                                                Upload
                                                <input
                                                    type="file"
                                                    name="imageFiles"
                                                    id="imageFiles"
                                                    style={{ display: 'none' }}
                                                    accept=".png, .jpg, .jpeg, .gif"
                                                    onChange={(e) => setUploadedBannerImage(e.target.files[0])}
                                                />
                                            </label>
                                        </div>
                                        {uploadedBannerImage && (
                                            <div className="upload-images-container uploadImgWrap">
                                                <div className="thubmnail-img-container">
                                                    <img src={URL.createObjectURL(uploadedBannerImage)} alt="NA" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="form-outline form-white  d-flex ">
                                <div className="formWrpLabel">
                                    <label className="fw-bolder ">
                                        Banner Title <span className="mandatory-red-asterisk">*</span>
                                    </label>
                                </div>
                                <div className="formWrpInpt">
                                    <div className="d-flex formradiogroup mb-2 gap-3">
                                        <CFormInput
                                            type="text"
                                            placeholder="Enter Title Here"
                                            name="title"
                                            value={bannerTitle}
                                            onChange={(e) => {
                                                setBannerTitle(e.target.value)
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="form-outline form-white  d-flex ">
                                <div className="formWrpLabel">
                                    <label className="fw-bolder ">Display Period</label>
                                </div>
                                <div className="upload-image-main-container">
                                    <div style={isExpiration ? { pointerEvents: 'none', opacity: '0.5' } : null} className="upload-img-btn-and-info">
                                        <div>
                                            <DatePicker
                                                value={bannerStartDate}
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
                                    <div>

                                    </div>
                                    <div className="push-notification-container gap-3">
                                        <CFormCheck
                                            type="radio"
                                            name="noExpiration"
                                            defaultChecked={isExpiration}
                                            onClick={() => setIsExpiration(!isExpiration)}
                                            label="No expiration Date"
                                            value={isExpiration}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="form-outline form-white  d-flex ">
                                <div className="formWrpLabel">
                                    <label className="fw-bolder ">Banner Type</label>
                                </div>
                                <div className="upload-image-main-container">
                                    <div className="push-notification-container gap-3">
                                        <CFormCheck
                                            type="radio"
                                            name="imageType"
                                            defaultChecked={imageType === 'bannerImageOnly'}
                                            onClick={() => {
                                                setImageType('bannerImageOnly')
                                                setLinkToUrl('')
                                                setPopupImage('')
                                            }}
                                            label="Banner Image Only"
                                            value={true}
                                        />
                                    </div>
                                    <div className="push-notification-container gap-3">
                                        <CFormCheck
                                            type="radio"
                                            name="imageType"
                                            defaultChecked={imageType === 'linkTo'}
                                            onClick={() => {
                                                setImageType('linkTo')
                                                setPopupImage('')
                                            }}
                                            label="Link To"
                                            value={false}
                                        />
                                        <CFormInput
                                            type="text"
                                            placeholder="Enter URL"
                                            name="title"
                                            value={linkToUrl}
                                            disabled={imageType !== 'linkTo'}
                                            onChange={(e) => {
                                                setLinkToUrl(e.target.value)
                                            }}
                                        />
                                    </div>
                                    <div className="push-notification-container gap-3">
                                        <CFormCheck
                                            type="radio"
                                            name="imageType"
                                            defaultChecked={imageType === 'popUpImage'}
                                            onClick={() => {
                                                setImageType('popUpImage')
                                                setLinkToUrl('')
                                            }}
                                            label="Pop-up Image"
                                            value={false}
                                        />
                                        <label
                                            className="label-btn"
                                            color="dark"
                                            htmlFor="popupImg"
                                            style={{ display: `${imageType === 'popUpImage' ? '' : 'none'}` }}
                                        >
                                            Upload
                                            <input
                                                type="file"
                                                name="popupImg"
                                                id="popupImg"
                                                style={{ display: 'none', disabled: 'true' }}
                                                accept=".png, .jpg, .jpeg, .gif"
                                                onChange={(e) => setPopupImage(e.target.files[0])}
                                            />
                                        </label>
                                    </div>
                                    {imageType === 'popUpImage' && popupImage && (
                                        <div className="upload-images-container uploadImgWrap">
                                            <div className="thubmnail-img-container">
                                                <img src={URL.createObjectURL(popupImage)} alt="" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex justify-content-center gap-5 my-2 ">
                        <CButton onClick={() => setAddModifyClubBannerModal(false)}>Cancel</CButton>
                        <CButton onClick={saveClubBannerHandler}>
                            {bannerUpdateId ? 'Update' : 'Save'}
                        </CButton>
                    </div>
                </CModalBody>
            </CModal>
            <CModal
                visible={deleteVisible}
                onClose={() => setDeleteVisible(false)}
                aria-labelledby="LiveDemoExampleLabel"
            >
                <CModalHeader onClose={() => setDeleteVisible(false)}>
                    <CModalTitle id="LiveDemoExampleLabel">Delete the category</CModalTitle>
                </CModalHeader>
                <CModalBody className='text-center'>
                    <p>Are you sure you want to delete
                    </p>
                </CModalBody>
                <CModalFooter className='d-flex justify-content-center gap-md-4 border-0 '>
                    <CButton color="secondary" onClick={() => setDeleteVisible(false)}>
                        Cancel
                    </CButton>
                    <CButton className='px-4' color="primary" onClick={() => deleteBannerHandler(deleteId)}>Yes</CButton>
                </CModalFooter>
            </CModal>
        </div>
    )
}

export default BookRentalBanner