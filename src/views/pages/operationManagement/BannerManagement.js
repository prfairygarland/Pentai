import { CButton, CFormCheck, CFormInput, CModal, CModalBody, CModalHeader, CModalTitle } from '@coreui/react'
import React, { useCallback, useMemo, useState } from 'react'
import DatePicker from 'react-date-picker'
import ReactTable from 'src/components/common/ReactTable'

const BannerManagement = () => {

    const [banner, setBanner] = useState(true)

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

    const bannerList = [
        { id: 1 }
    ]

    const columns = useMemo(() => [
        {
            Header: 'Order',
            accessor: '',
            // Cell: ({ row }) => <p><CIcon icon={cilMenu} size='sm' /></p>
        },
        {
            Header: 'No',
            accessor: '',
            // Cell: ({ row }) => {
            //     return currentPage * itemsPerPage + (row?.index + 1)
            // }
        },
        {
            Header: 'Thumbnail Image',
            accessor: '',
            // Cell: ({ row }) =>
            //     <img alt="" crossOrigin='anonymous' src={imageUrl + row?.original?.image} style={{ width: '100%', height: '100px' }}></img>

        },
        {
            Header: 'Title',
            accessor: 'title',
            // Cell: ({ row }) => <p style={{cursor:'pointer'}} onClick={() => editClubBannerHandler(row.original.id)}>{row.original.title}</p>
        },
        {
            Header: 'Posting Period',
            accessor: '',
            // Cell: ({ row }) => <p>{row.original.isExpired === 'no' ? `${moment(row.original.startDateTime).format("YYYY-MM-DD HH:mm")}~${moment(row.original.endDateTime).format("YYYY-MM-DD HH:mm:ss")}` : 'No expiration date'} </p>,

        },
        {
            Header: 'Status',
            accessor: 'status',
            // Cell: ({ row }) => <p>{row.original.status}</p>,
        },
        {
            Header: 'Type',
            accessor: 'type',
            // Cell: ({ row }) => <p>{row.original.type}</p>,

        },
        {
            Header: 'Action',
            accessor: 'button',
            Cell: ({ row }) => <a className='mx-3 primTxt '>Delete</a>

        },
    ], [])
    const [bannerSetting, setBannerSetting] = useState({ autoSlideBanner: 'yes' })
    return (
        <div>
            <div className='d-flex justify-content-between  pageTitle mb-3 pb-2'>
                <h2>Banner Management</h2>
                <CButton>Create</CButton>
            </div>
            <div className='d-flex align-items-center '>
                <div>
                    <label className='fw-bold'>Auto Slide Banner</label>
                </div>
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
            <div className='my-3'>
                <ReactTable columns={columns} data={bannerList} showCheckbox={false} onSelectionChange={handleSelectionChange} />
            </div>
            <CModal
                visible={banner}
                className='modal-lg'
                alignment='center'
                backdrop='static'
                aria-labelledby='LiveDemoExampleLabel'
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
                                        // value={bannerTitle}
                                        // onChange={(e) => {
                                        //     setBannerTitle(e.target.value)
                                        // }}
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

                                            />

                                            <input
                                                type="time"
                                                name="time"
                                                id="time"
                                                className="time-picker"
                                                style={{ marginRight: 0 }}
                                            // value={`${bannerStartHours}:${bannerStartMins}`}
                                            // onChange={(e) => bannerStartTimeHandler(e)}
                                            />
                                        </div>
                                        -
                                        <div className='d-flex '>
                                            <DatePicker
                                            // value={bannerEndDate}
                                            // onChange={(event) => handleBannerEndDate(event)}
                                            />

                                            <input
                                                type="time"
                                                name="time"
                                                id="time"
                                                className="time-picker"
                                            // value={`${bannerEndHours}:${bannerEndMins}`}
                                            // onChange={(e) => bannerEndTimeHandler(e)}
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
                                        <div className="upload-images-container uploadImgWrap">
                                            <div className="thubmnail-img-container">
                                                <img alt="NA" />
                                            </div>
                                        </div>
                                        <div className="upload-container-btn">
                                            <div>
                                                <p>※ You can upload 1 image only.
                                                    · Image Size: 660 x 220 px
                                                    · Maximum File Size:
                                                    · File Type :</p>
                                            </div>
                                            <label className="label-btn" style={{ paddingLeft: 20 }} htmlFor="imageFiles">
                                                Upload
                                                <input
                                                    type="file"
                                                    name="imageFiles"
                                                    id="imageFiles"
                                                    style={{ display: 'none' }}
                                                    accept=".png, .jpg, .jpeg, .gif"
                                                // onChange={(e) => setUploadedBannerImage(e.target.files[0])}
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
                                            // defaultChecked={imageType === 'bannerImageOnly'}
                                            // onClick={() => {
                                            //     setImageType('bannerImageOnly')
                                            //     setLinkToUrl('')
                                            //     setPopupImage('')
                                            // }}
                                            // value={true}
                                            label="Banner Image Only"
                                        />
                                    </div>
                                    <div className="push-notification-container gap-3 p-2 align-items-center">
                                        <CFormCheck
                                            type="radio"
                                            name="imageType"
                                            // defaultChecked={imageType === 'linkTo'}
                                            // onClick={() => {
                                            //     setImageType('linkTo')
                                            //     setPopupImage('')
                                            // }}
                                            // value={false}
                                            label="Link To"
                                        />
                                        <CFormInput
                                            type="text"
                                            placeholder="Enter URL"
                                            name="title"
                                            // value={linkToUrl}
                                            // disabled={imageType !== 'linkTo'}
                                            // onChange={(e) => {
                                            //     setLinkToUrl(e.target.value)
                                            // }}
                                            style={{ flex: 1 }}
                                        />
                                    </div>
                                    <div className="d-flex  gap-3 p-2">
                                        <CFormCheck
                                            type="radio"
                                            name="imageType"
                                            // defaultChecked={imageType === 'popUpImage'}
                                            // onClick={() => {
                                            //     setImageType('popUpImage')
                                            //     setLinkToUrl('')
                                            // }}
                                            // value={false}
                                            label="Pop-up Image"
                                        />
                                        <label
                                            className="label-btn"
                                            color="dark"
                                            htmlFor="popupImg"
                                        // style={{ display: `${imageType === 'popUpImage' ? '' : 'none'}` }}
                                        >
                                            Upload
                                            <input
                                                type="file"
                                                name="popupImg"
                                                id="popupImg"
                                                style={{ display: 'none', disabled: 'true' }}
                                                accept=".png, .jpg, .jpeg, .gif"
                                            // onChange={(e) => setPopupImage(e.target.files[0])}
                                            />
                                        </label>

                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </CModalBody>
            </CModal>
        </div>
    )
}

export default BannerManagement