import { cilMenu } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CButton, CFormCheck, CFormInput, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import DatePicker from 'react-date-picker'
import ReactTable from 'src/components/common/ReactTable'
import { deleteApi, getApi, postApi, putApi } from 'src/utils/Api'
import { API_ENDPOINT } from 'src/utils/config'
import { imageUrl } from '../BookRentalManagement/BookRentalStatus'
import moment from 'moment/moment'
import Loader from 'src/components/common/Loader'
import { enqueueSnackbar } from 'notistack'
import emptyImg from '../../../assets/images/empty-image.png'
import { node } from 'prop-types'
const BannerManagement = () => {


    const [isLoading, setIsLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(0)
    const [itemsPerPage, setItemPerPage] = useState(5)
    const [banner, setBanner] = useState(false)
    const [bannerId, setBannerId] = useState(null)
    const [bannerList, setBannerList] = useState([])
    const [bannerSetting, setBannerSetting] = useState({isEnabled:true})
    const [bannerTitle, setBannerTitle] = useState('')
    const [bannerStartDate, setBannerStartDate] = useState('')
    const [bannerStartHours, setBannerStartHours] = useState('00')
    const [bannerStartMins, setBannerStartMins] = useState('00')
    const [bannerEndDate, setBannerEndDate] = useState('')
    const [bannerEndHours, setBannerEndHours] = useState('00')
    const [bannerEndMins, setBannerEndMins] = useState('00')
    const [uploadedBannerImage, setUploadedBannerImage] = useState('')
    const [imageType, setImageType] = useState('bannerImageOnly')
    const [linkToUrl, setLinkToUrl] = useState('')
    const [popupImage, setPopupImage] = useState('')
    const [bannerUpdateId, setBannerUpdateId] = useState('')
    const [deleteVisible, setDeleteVisible] = useState(false)
    const [deleteId, setDeleteId] = useState(null)
    const [maxDate, setMaxDate] = useState('')


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


    //get list of banners
    const handleGetbannerList = async () => {
        setIsLoading(true)
        try {
            const response = await getApi(API_ENDPOINT.get_OperationMangementBannerLis)
            if (response?.status === 200) {
                setBannerList(response?.data)
                setIsLoading(false)
            }
        } catch (error) {
            console.log(error)
            
        }
        finally{
            setIsLoading(false)
        }
    }


    //autoSlideBanner
    const GetAutoSlideBanner = async () => {
        const response = await getApi(API_ENDPOINT.get_OperationMangementAutoSlide)
        if (response?.status === 200) {
            setBannerSetting(response?.data)
            // setBannerId(response?.data?.id)
        }
    }

    useEffect(() => {
        handleGetbannerList()
        GetAutoSlideBanner()
    }, [bannerUpdateId])

    useEffect(() => {
        let maxDate = new Date()
        maxDate.setMonth(new Date().getMonth() + 1)
        setMaxDate(maxDate)
        // if (location?.state?.streamId !== undefined) {
        //   getStreamDetails()
        // }
      }, [])

    const updateBannerSlider = async (val) => {
        setBannerSetting((prev) =>{
            return {
                ...prev, 
                isEnabled: val === 1 ? true : false
            }
        })
        setIsLoading(true)
        let url = API_ENDPOINT.update_OperationManagementAutoSlide

        const body = {
            id: bannerSetting?.id,
            isEnabled: val === 1 ? true : false
        }


        try {
            const response = await putApi(url, body)
            console.log(response)
            if (response?.status === 200) {
                if (response?.data?.status === 200) {
                    enqueueSnackbar('AutoSlide updated successfully', { variant: 'success' })
                    setIsLoading(false)
                    await GetAutoSlideBanner()
                }
                else {
                    enqueueSnackbar('Failed to update AutoSlide', { variant: 'error' })
                }
            }
        } catch (error) {
            console.log(error)
        }
        finally {
            setIsLoading(false)
        }
    }

    const handleBannerStartDate = (event) => {
        if(event!=null){
            let d = new Date(event),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear()
            if (month.length < 2) month = '0' + month
            if (day.length < 2) day = '0' + day
            setBannerStartDate([year, month, day].join('-'))
        }
        else{
            setBannerStartDate('')
        }
    }

    const bannerStartTimeHandler = (e) => {
        setBannerStartHours(e.target.value.split(':')[0])
        setBannerStartMins(e.target.value.split(':')[1])
    }

    const handleBannerEndDate = (event) => {
        if(event!=null){
            let d = new Date(event),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear()
            if (month.length < 2) month = '0' + month
            if (day.length < 2) day = '0' + day
            setBannerEndDate([year, month, day].join('-'))
        }
        else{
            setBannerEndDate('')
        }
    }

    const bannerEndTimeHandler = (e) => {
        setBannerEndHours(e.target.value.split(':')[0])
        setBannerEndMins(e.target.value.split(':')[1])
    }

    const deleteBannerHandler = async (id) => {
        try {
            let url = `${API_ENDPOINT.delete_OperationManagementBanner}?id=`
            const res = await deleteApi(url, id)
            if (res?.data?.status === 200) {
                handleGetbannerList()
                enqueueSnackbar('Banner Deleted Successfully', { variant: 'success' })
                setDeleteVisible(false)
            } else {
                enqueueSnackbar('Something went wrong, please try later!', { variant: 'error' })
            }
        } catch (error) {
            console.log(error)
        }
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
        setBanner(true)
    }

    const editClubBannerHandler = async (id) => {

        const response = await getApi(API_ENDPOINT.get_OperationMangementBannerLis)
        let res = await response?.data?.find((item) => item?.id.toString() === id.toString())
        // let res = url
        if (res) {
            setBannerTitle(res?.title)
            const startTime = new Date(res?.startDateTime)
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

            const endTime = new Date(res?.endDateTime)
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
            const bannerImage = await urlsToFiles(res?.thumbnail)
            setUploadedBannerImage(bannerImage)
            setImageType(res?.type)
            setLinkToUrl(res?.url)
            const popUpImage = await urlsToFiles(res?.image)
            setPopupImage(popUpImage)
            setBannerUpdateId(res?.id)
            setBanner(true)
        }

    }

    const validateClubPeriodHandler = () => {
        if (bannerTitle.trim() === '') {
            enqueueSnackbar("Please enter title", { variant: 'error' })
            return false
        } else if (bannerStartDate === '') {
            enqueueSnackbar('Please select Start date', { variant: 'error' })
            return false
        } else if (bannerStartHours === '00' && bannerStartMins === '00') {
            enqueueSnackbar('Please select End date', { variant: 'error' })
            return false
        } else if (!bannerUpdateId && new Date() > new Date(bannerStartDate + 'T' + bannerStartHours + ':' + bannerStartMins)) {
            enqueueSnackbar("Start time cannot be earlier than current time", { variant: 'error' })
            return false
        } else if (bannerEndDate === '') {
            enqueueSnackbar('Please select end date', { variant: 'error' })
            return false
        } else if (bannerEndHours === '00' && bannerEndMins === '00') {
            enqueueSnackbar('Please select end time', { variant: 'error' })
            return false
        } else if (!bannerUpdateId && new Date(bannerStartDate + 'T' + bannerStartHours + ':' + bannerStartMins) > new Date(bannerEndDate + 'T' + bannerEndHours + ':' + bannerEndMins)) {
            enqueueSnackbar("End time cannot be earlier than start time", { variant: 'error' })
            return false
        } else if (uploadedBannerImage === '') {
            enqueueSnackbar("Please upload a banner image", { variant: 'error' })
            return false
        } else if (imageType === 'linkTo' && linkToUrl === '') {
            enqueueSnackbar("Please enter URL for Link to post", { variant: 'error' })
            return false
        } else if (imageType === 'popUpImage' && popupImage === '') {
            enqueueSnackbar("Please add pop-up image for banner", { variant: 'error' })
            return false
        } else {
            saveBannerManagement()
        }
      }


    const saveBannerManagement = async () => {
        setIsLoading(true)
        try {
            const formData = new FormData()
            formData.append('title', bannerTitle)
            formData.append('startDateTime', new Date(bannerStartDate + 'T' + bannerStartHours + ':' + bannerStartMins))
            formData.append('endDateTime', new Date(bannerEndDate + 'T' + bannerEndHours + ':' + bannerEndHours))
            formData.append('image', uploadedBannerImage)
            formData.append('type', imageType)
            // formData.append('imageOrder', 1)
            if (imageType === 'linkTo') {
                formData.append('linkUrl', linkToUrl)
            }
            if (imageType === 'popUpImage') {
                formData.append('popUpImage', popupImage)
            }
           
            let res = ''
            if (bannerUpdateId) {
                formData.append('id', bannerUpdateId)
                res = await putApi(API_ENDPOINT.update_OperationManagementBanner, formData)
            } else {
                res = await postApi(API_ENDPOINT.create_OperationManagementBanner, formData)
            }
            if (res.status === 200) {
                setBanner(false)
                if (res?.data?.status === 400) {
                    enqueueSnackbar(res?.data?.msg, { variant: 'error' })
                } else if (res?.data?.status !== 200) {
                    enqueueSnackbar(res?.data?.error, { variant: 'error' })
                } else {
                    bannerUpdateId ?
                        enqueueSnackbar('Banner Updated Successfully', { variant: 'success' }) :
                        enqueueSnackbar('Banner Added Successfully', { variant: 'success' })
                    setIsLoading(false)
                }
                setBanner(false)
                handleGetbannerList()
            }
        } catch (error) {

        }
    }


    const columns = useMemo(() => [
        {
            Header: 'Order',
            accessor: '',
            Cell: ({ row }) => <p className='text-center'><CIcon icon={cilMenu} size='sm' /></p>
        },
        {
            Header: 'No',
            accessor: '',
            Cell: ({ row }) => {
                return <p className='text-center'>{currentPage * itemsPerPage + (row?.index + 1)}</p>
            }
        },
        {
            Header: 'Thumbnail Image',
            accessor: '',
            Cell: ({ row }) =>
                <img alt="" crossOrigin='anonymous' src={imageUrl + row?.original?.thumbnail} style={{ width: '100%', height: '100px' }}></img>

        },
        {
            Header: 'Title',
            accessor: 'title',
            Cell: ({ row }) => <a style={{ cursor: 'pointer' }} onClick={() => setBanner(true)}>{row?.original?.title}</a>
        },
        {
            Header: 'Posting Period',
            accessor: '',
            Cell: ({ row }) => <p>{`${moment(row?.original?.startDateTime).format("YYYY-MM-DD HH:mm")}~${moment(row?.original?.endDateTime).format("YYYY-MM-DD HH:mm")}`} </p>,

        },
        {
            Header: 'Status',
            accessor: 'status',
            Cell: ({ row }) => <p>{row?.original?.status}</p>,
        },
        {
            Header: 'Type',
            accessor: 'type',
            Cell: ({ row }) => <p>{row?.original?.type}</p>,

        },
        {
            Header: 'Action',
            accessor: 'button',
            Cell: ({ row }) => <a onClick={() => { setDeleteId(row.original.id); setDeleteVisible(true) }} className='mx-3 primTxt '>Delete</a>

        },
    ], [])


    return (
        <div>
            <div className='d-flex justify-content-between  pageTitle mb-3 pb-2'>
                <h2>Banner Management</h2>
                <CButton onClick={handleNewBookBannaer} className='btn-success'>Create</CButton>
            </div>
            {isLoading && <Loader />}
            <div className='d-flex align-items-center '>
                <div>
                    <label className='fw-bold'>Auto Slide Banner</label>
                </div>
                <div className="push-notification-container gap-3 py-0">
                    <CFormCheck className='d-flex gap-2' type="radio" name="visibility" id="exampleRadios1" label="Yes"
                        defaultChecked={bannerSetting.isEnabled}
                        // checked={bannerSetting.isEnabled}
                        onClick={() => updateBannerSlider(1)}
                        value={true}
                    />
                    <CFormCheck className='d-flex gap-2' type="radio" name="visibility" id="exampleRadios2" label="No"
                        defaultChecked={!bannerSetting.isEnabled}
                        // checked={!bannerSetting.isEnabled}
                        onClick={() => updateBannerSlider(0)}
                        value={false}
                    />
                </div>
            </div>
            <div className='my-3'>
                <ReactTable columns={columns} data={bannerList} showCheckbox={false} onSelectionChange={handleSelectionChange} />
            </div>
            <CModal
                scrollable
                visible={banner}
                className='modal-lg'
                alignment='center'
                backdrop='static'
                aria-labelledby='LiveDemoExampleLabel'
                onClose={() => setBanner(false)}
            >
                <CModalHeader>
                    <CModalTitle className='p-1'>Banner Registration</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <div className="card-body">
                        <div className="formWraper">
                            <div className="form-outline form-white  d-flex ">
                                <div className="formWrpLabel">
                                    <label className="fw-bolder ">
                                        Title <span className="mandatory-red-asterisk">*</span>
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
                                    <label className="fw-bolder ">
                                        Posting Period<span className="mandatory-red-asterisk">*</span>
                                    </label>
                                </div>
                                <div className="p-2">
                                    <div className='d-flex align-items-center gap-1' >
                                        <div className='d-flex' >
                                            <DatePicker
                                                value={bannerStartDate}
                                                onChange={(event) => handleBannerStartDate(event)}
                                                minDate={new Date()}
                                                maxDate={maxDate}
                                                
                                            />

                                            <input
                                                type="time"
                                                name="time"
                                                id="time"
                                                className="time-picker"
                                                style={{ marginRight: 0 }}
                                                value={`${bannerStartHours}:${bannerStartMins}`}
                                                onChange={(e) => bannerStartTimeHandler(e)}
                                            />
                                        </div>
                                        -
                                        <div className='d-flex '>
                                            <DatePicker
                                                value={bannerEndDate}
                                                onChange={(event) => handleBannerEndDate(event)}
                                                minDate={new Date()}
                                                //  maxDate={maxDate}
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
                                    <div>
                                    </div>
                                </div>
                            </div>
                            <div className="form-outline form-white  d-flex ">
                                <div className="formWrpLabel">
                                    <label className="fw-bolder ">
                                        Banner Image<span className="mandatory-red-asterisk">*</span>
                                    </label>
                                </div>
                                <div className="upload-image-main-container">
                                    <div className="upload-img-btn-and-info">
                                        {uploadedBannerImage ? (
                                            <div className="upload-images-container uploadImgWrap w-50" style={{borderWidth:0}} >
                                                <div className="thubmnail-img-container" style={{maxWidth:300}} >
                                                    <img src={URL.createObjectURL(uploadedBannerImage)} alt="NA" />
                                                </div>
                                            </div>
                                        ) : <div className="upload-images-container uploadImg Wrap w-50" style={{borderWidth:0}}>
                                            <div className="thubmnail-img-container" style={{maxWidth:300}}>
                                                <img alt='' src={emptyImg} style={{ height: '100%', width: '100%' }} />
                                            </div>
                                        </div>}
                                        <div className="upload-container-btn">
                                            <div>
                                                <p>※ You can upload 1 image only. <br></br>
                                                    · Image Size: 660 x 220 px <br></br>
                                                    · Maximum File Size: <br></br>
                                                    · File Type :</p>
                                            </div>
                                            <label className="btn btn-primary mt-3" style={{ paddingLeft: 20 }} htmlFor="imageFiles">
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


                                    </div>
                                </div>
                            </div>
                            <div className="form-outline form-white  d-flex ">
                                <div className="formWrpLabel">
                                    <label className="fw-bolder ">Banner Type</label>
                                </div>
                                <div className="d-flex flex-column w-100">
                                    <div className="push-notification-container gap-3 p-2">
                                        <CFormCheck
                                            type="radio"
                                            name="imageType"
                                            className='gap-2'
                                            defaultChecked={imageType === 'bannerImageOnly'}
                                            onClick={() => {
                                                setImageType('bannerImageOnly')
                                                setLinkToUrl('')
                                                setPopupImage('')
                                            }}
                                            value={true}
                                            label="Banner Image Only"
                                        />
                                    </div>
                                    <div className="push-notification-container gap-3 p-2 align-items-center">
                                        <CFormCheck
                                            type="radio"
                                            name="imageType"
                                            className='gap-2'
                                            defaultChecked={imageType === 'linkTo'}
                                            onClick={() => {
                                                setImageType('linkTo')
                                                setPopupImage('')
                                            }}
                                            value={false}
                                            label="Link To"
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
                                            style={{ flex: 1 }}
                                        />
                                    </div>
                                    <div className="d-flex  gap-3 p-2">
                                        <CFormCheck
                                            type="radio" className='gap-2'
                                            name="imageType"
                                            defaultChecked={imageType === 'popUpImage'}
                                            onClick={() => {
                                                setImageType('popUpImage')
                                                setLinkToUrl('')
                                            }}
                                            value={false}
                                            label="Pop-up Image"
                                        />
                                        <div className='w-25'>
                                            <label
                                                className="btn btn-primary "

                                                htmlFor="popupImg"
                                                style={{ display: `${imageType === 'popUpImage' ? '' : 'none'}`, paddingLeft: 20 }}
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

                                    </div>
                                    {imageType === 'popUpImage' && popupImage && (
                                        <div className="upload-images-container uploadImgWrap " >
                                            <div className="thubmnail-img-container p-3" style={{ height: 500, maxWidth: "100%", borderWidth: 0, marginRight: 0 }}>
                                                <img src={URL.createObjectURL(popupImage)} alt="" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </CModalBody>
                <CModalFooter>
                    <div className="d-flex justify-content-center gap-3 w-100 ">
                        <CButton className='btn-black' onClick={() => setBanner(false)}>Cancel</CButton>
                        <CButton
                            onClick={validateClubPeriodHandler}
                        >
                            {bannerUpdateId ? 'Update' : 'Save'}
                        </CButton>
                    </div>
                </CModalFooter>
            </CModal>
            <CModal
                visible={deleteVisible}
                onClose={() => setDeleteVisible(false)}
                aria-labelledby="LiveDemoExampleLabel"
            >
                <CModalHeader onClose={() => setDeleteVisible(false)}>
                    <CModalTitle id="LiveDemoExampleLabel">Trying to delete the respective banner</CModalTitle>
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

export default BannerManagement