import { CButton, CFormCheck, CFormInput, CFormSelect, CFormSwitch, CFormTextarea, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import { enqueueSnackbar } from 'notistack'
import React, { useRef, useState } from 'react'
import { useEffect } from 'react'
import DatePicker from 'react-date-picker'
import Loader from 'src/components/common/Loader'
import { deleteApi, postApi, putApi } from 'src/utils/Api'
import { API_ENDPOINT } from 'src/utils/config'
import { boolean } from 'yup'

const ItemNumber = ({ bookItemDetail, setIconSubSet, setIconSubBookSet, setSideSubBookBarId, setSideBarId, setIconSet, bookDisplay, setFilteredData, bookItemId, setDeleted, setCategories, bookId }) => {

  const [isLoading, setIsLoading] = useState(false)
  const [image, setImage] = useState(null);
  const [postImage, setPostImage] = useState(null)
  const [deleteVisible, setdeleteVisible] = useState(false)
  const inputRef = useRef(null)
  const [data, setData] = useState({
    ISBN: '',
    ItemNumber: '',
    title: ' ',
    author: '',
    itemStatus: '',
    itemRegDate: '',
    itemImage: null,
    RentalDuration: '',
    ExtendDuration: '',
    visibility: false,
    PointOfPickAndReturn: '',
    customSetting: false
  })

  useEffect(() => {
    setIsLoading(true)
    if (bookItemId) {
      setData({
        id: bookItemDetail.id,
        ISBN: bookItemDetail?.SIBNCode ? bookItemDetail?.SIBNCode : '',
        ItemNumber: bookItemDetail?.itemNumber ? bookItemDetail?.itemNumber : '',
        title: bookItemDetail?.title ? bookItemDetail?.title : '',
        author: bookItemDetail?.author ? bookItemDetail?.author : '',
        itemStatus: bookItemDetail?.itemStatus ? bookItemDetail?.itemStatus : '',
        itemRegDate: bookItemDetail.registeredDate ? bookItemDetail.registeredDate : '',
        itemImage: bookItemDetail?.image ? bookItemDetail?.image : null,
        RentalDuration: bookItemDetail?.rentableDurationWeek ? bookItemDetail?.rentableDurationWeek : '',
        ExtendDuration: bookItemDetail?.extendDurationWeek ? bookItemDetail?.extendDurationWeek : '',
        visibility: bookItemDetail?.visibility,
        PointOfPickAndReturn: bookItemDetail?.pickUpAndReturn ? bookItemDetail?.pickUpAndReturn : '',
        customSetting: bookItemDetail?.customSetting === 'no' ? false : true
      })
      setIsLoading(false)
    }
    else {
      setData({
        id: bookDisplay.id,
        ISBN: bookDisplay?.SIBNCode,
        ItemNumber: '',
        title: bookDisplay?.title,
        author: bookDisplay?.author,
        itemStatus: bookDisplay?.itemStatus,
        itemRegDate: bookDisplay?.registeredDate ? bookDisplay?.registeredDate : '',
        itemImage: bookDisplay?.image ? bookDisplay?.image : null,
        RentalDuration: '',
        ExtendDuration: '',
        visibility: false,
        PointOfPickAndReturn: bookItemDetail?.pickUpAndReturn ? bookItemDetail?.pickUpAndReturn : '',
        customSetting: false
      })
      setIsLoading(false)
    }

  }, [bookItemDetail, bookItemId, bookDisplay])

  const handleChangeISBN = (e) => {
    setData((prev) => {
      return {
        ...prev,
        ISBN: e.target.value
      }
    })
  }

  const handleChangeItemNumbr = (e) => {
    setData((prev) => {
      return {
        ...prev,
        ItemNumber: e.target.value
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

  const handleChangeAuthor = (e) => {
    setData((prev) => {
      return {
        ...prev,
        author: e.target.value
      }
    })
  }

  const handleChangeItemStatus = (e) => {
    setData((prev) => {
      return {
        ...prev,
        itemStatus: e.target.value
      }
    })
  }

  const handleChangeItemRegDate = (e) => {
    setData((prev) => {
      return {
        ...prev,
        itemRegDate: e.toISOString()
      }
    })
  }

  // const handleChangeISBN = (e) =>{
  //     setData((prev) =>{
  //         return {
  //             ...prev,
  //             ISBN: e.target.value
  //         }
  //     })
  // }

  const handleChangeRentalDuration = (e) => {
    setData((prev) => {
      return {
        ...prev,
        RentalDuration: e.target.value
      }
    })
  }

  const handleChangeExtendDuratiion = (e) => {
    setData((prev) => {
      return {
        ...prev,
        ExtendDuration: e.target.value
      }
    })
  }

  const handleChangeVisibility = (e) => {
    setData((prev) => {
      return {
        ...prev,
        visibility: e.target.value
      }
    })
  }

  const handleChangePickUpPoint = (e) => {
    setData((prev) => {
      return {
        ...prev,
        PointOfPickAndReturn: e.target.value
      }
    })
  }

  const handleChangeCustomSetting = (e) => {
    setData((prev) => {
      return {
        ...prev,
        customSetting: !data.customSetting
      }
    })
  }

  const handleImageChange = (e) => {
    inputRef.current.click()
  }

  const handleUpload = async (e) => {
    if (e.target.files[0].type === 'image/png' || e.target.files[0].type === 'image/jpg' || e.target.files[0].type === 'image/jpeg' || e.target.files[0].type === 'image/gif') {
      setImage(URL.createObjectURL(e.target.files[0]))
      const formData = new FormData()
      formData.append('images', e.target.files[0])
      let url = API_ENDPOINT.uploadImages
      const res = await postApi(url, formData)
      setPostImage(res?.data?.processedImageUrls[0]?.imageUrl)
    }

  }

  // updating existing bookItem or Creating new bookItem
  const handleUpdateBookItem = async () => {

    let updateurl = `${API_ENDPOINT.update_bookListItem}`

    let craeteUrl = `${API_ENDPOINT.create_bookListItem}?id=${bookId}`

    const body = {
      id: data.id ? data.id : bookItemId,
      bookId: bookId,
      itemNumber: data?.ItemNumber,
      registeredDate: data?.itemRegDate ? data?.itemRegDate : '',
      itemStatus: data?.itemStatus ? data?.itemStatus : 'available',
      customSetting: data?.customSetting === true ? 'yes' : 'no',
      rentableDurationWeek: data?.RentalDuration,
      extendDurationWeek: data?.ExtendDuration,
      visibility: data?.visibility === true ? 'visible' : 'hide',
      pickUpAndReturn: data?.PointOfPickAndReturn ? data.PointOfPickAndReturn : '',
      title: data?.title,
      author: data?.author,
      SIBNCode: data?.ISBN,
      image: data?.itemImage
    }


    if (data.title.trim() === '') {
      enqueueSnackbar('Please enter Book title', { variant: 'error' })
      return false
    }
    if (data.ItemNumber === '') {
      enqueueSnackbar('Please enter book item number', { variant: 'error' })
      return false
    }
    if (data.author === '') {
      enqueueSnackbar('Please enter author name', { variant: 'error' })
      return false
    }
    if (data.itemStatus === '') {
      enqueueSnackbar('Please enter item status', { variant: 'error' })
      return false
    }
    if (data.itemRegDate === '') {
      enqueueSnackbar('Please enter register date', { variant: 'error' })
      return false
    }
    if (data.itemImage === null) {
      enqueueSnackbar('Please select item image', { variant: 'error' })
      return false
    }
    if (data.customSetting) {
      if (data.RentalDuration < 1) {
        enqueueSnackbar('Please enter valid renatl weeks', { variant: 'error' })
        return false
      }
      if (data.ExtendDuration < 1) {
        enqueueSnackbar('Please enter valid extend weeks', { variant: 'error' })
        return false
      }
      if (data.PointOfPickAndReturn === '') {
        enqueueSnackbar('Please enter point of pick and return', { variant: 'error' })
        return false
      }
    }

    const filterbody = Object.fromEntries(Object.entries(body).filter(([key, value]) => (key !== 'id' && key !== 'title' && key !== 'author' && key !== 'SIBNCode' && key !== 'image')))

    if (bookItemId) {
      const res = await putApi(updateurl, body)
      if (res?.data?.status === 200) {
        enqueueSnackbar("BookItem updated successfully", { variant: "success" })
        // setDeleted((prev) => prev + 1)
        setCategories('AllBooks')
        setIconSet(null)
        setIconSubSet(null)
        setIconSubBookSet(null)
        setSideBarId(null)
        setSideSubBookBarId(null)
      }
      else {
        enqueueSnackbar("Failed to update", { variant: "error" })
      }
    }
    else {
      try {
        const res = await postApi(craeteUrl, filterbody)
        if (res?.data?.status === 200) {
          enqueueSnackbar("BookItem created successfully", { variant: "success" })
          setDeleted((prev) => prev + 1)
          setCategories('AllBooks')
          setIconSet(null)
          setIconSubSet(null)
          setIconSubBookSet(null)
          setSideBarId(null)
          setSideSubBookBarId(null)
        }
        else {
          enqueueSnackbar("failed to create", { variant: "error" })
        }
      } catch (error) {
        console.log(error?.messgae)
      }
    }
  }

  const deleteBookItem = async () => {
    let url = `${API_ENDPOINT.delete_bookItem}?id=`

    try {

      const res = await deleteApi(url, bookItemId)
      if (res.data.status === 200) {
        enqueueSnackbar("BookItem deleted successfully", { variant: "success" })
        setDeleted((prev) => prev + 1)
        setdeleteVisible(false)
        setCategories('AllBooks')
        setIconSet(null)
        setIconSubSet(null)
        setIconSubBookSet(null)
        setSideBarId(null)
        setSideSubBookBarId(null)
      }
      else {
        enqueueSnackbar("Failed to deleted", { variant: "error" })
      }
    } catch (error) {
      console.log(error.message)
    }


  }

  const handleCancel = () => {
    setCategories('AllBooks')
    setDeleted((prev) => prev + 1)
    setFilteredData({
      title: '',
      bookGenre: '',
      itemStatus: '',
      visibility: '',
      status: ''
    })
    setIconSet(null)
    setIconSubSet(null)
    setIconSubBookSet(null)
    setSideBarId(null)
    setSideSubBookBarId(null)
  }

  const imgUrl = data?.itemImage?.includes('https://ptkapi.experiencecommerce.com')
  const imageProps = imgUrl ? { crossOrigin: 'anonymous' } : {}

  return (
    <div className='col-md-8'>
      {/* <h1>Item Number</h1> */}
      <div>
        {isLoading && <Loader />}
        <div>
          <div className='d-flex justify-content-between align-item-center mb-3'>
            <h4 className="me-3">Item Number</h4>
            <CButton onClick={() => setdeleteVisible(true)} className='btn-black'>Delete</CButton>
          </div>

          <div className="card-body">
            <div className="formWraper">
              <div className="form-outline form-white   d-flex ">
                <div className="formWrpLabel" >
                  <label className="fw-bolder ">
                    ISBN
                  </label>
                </div>
                <div className="formWrpInpt d-flex">
                  <div className="d-flex formradiogroup mb-2 gap-3">
                    <CFormInput
                      type='text'
                      value={data.ISBN}
                      onChange={handleChangeISBN}
                    />
                  </div>
                </div>
              </div>
              <div className="form-outline form-white   d-flex ">
                <div className="formWrpLabel" >
                  <label className="fw-bolder ">
                    Item Number
                  </label>
                </div>
                <div className="formWrpInpt d-flex">
                  <div className="d-flex formradiogroup mb-2 gap-3">
                    <CFormInput
                      type="text"
                      placeholder=""
                      name='itemNumber'
                      value={data.ItemNumber}
                      onChange={handleChangeItemNumbr}
                    //   value={addItemData.itemNumber}
                    //   onChange={(e) => {
                    //     handleInputChange(e)
                    //   }}
                    />
                  </div>
                </div>
              </div>

              <div className="form-outline form-white d-flex ">
                <div className='d-flex w-100'>
                  <div className="formWrpLabel" >
                    <label className="fw-bolder ">
                      Book Title
                    </label>
                  </div>
                  <div className="formWrpInpt d-flex">
                    <div className="d-flex formradiogroup mb-2 gap-3">
                      <CFormInput
                        // className='mx-4'
                        // style={{ width: '170px' }}
                        type='text'
                        value={data.title}
                        onChange={handleChangeTitle}
                      />
                    </div>
                  </div>
                </div>
                <div className='d-flex  w-100'>
                  <div className="formWrpLabel" >
                    <label className="fw-bolder ">
                      Author
                    </label>
                  </div>
                  <div className="formWrpInpt d-flex">
                    <div className="d-flex formradiogroup mb-2 gap-3">
                      <CFormInput
                        value={data.author}
                        onChange={handleChangeAuthor}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="form-outline form-white d-flex ">
                <div className='d-flex w-100'>
                  <div className="formWrpLabel" >
                    <label className="fw-bolder ">
                      Item Status
                    </label>
                  </div>
                  <div className="formWrpInpt d-flex">
                    <div className="d-flex formradiogroup mb-2 gap-3 w-100">
                      <CFormSelect

                        // style={{ width: '170px' }}
                        name='itemStatus'
                        value={data.itemStatus}
                        options={[
                          { label: 'select', value: '' },
                          {
                            label: 'Available', value: 'available'
                          },
                          {
                            label: 'Unavailable', value: 'unavailable'
                          },
                        ]}
                        onChange={handleChangeItemStatus}
                      />
                    </div>
                  </div>
                </div>
                <div className='d-flex w-100'>
                  <div className="formWrpLabel" >
                    <label className="fw-bolder ">
                      Item Registered Date
                    </label>
                  </div>
                  <div className="formWrpInpt d-flex">
                    <div className="d-flex formradiogroup mb-2 gap-3 w-100">
                      <DatePicker
                        value={data.itemRegDate}
                        minDate={new Date()}
                        onChange={handleChangeItemRegDate}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="form-outline form-white   d-flex ">
                <div className="formWrpLabel">
                  <label className="fw-bolder ">
                    Item Image
                  </label>
                </div>
                <div className="formWrpInpt d-flex">
                  <div className='addItemImage'>
                    {data.itemImage ? <img alt='' {...imageProps} src={data?.itemImage}  /> : <img alt='' src='https://www.beelights.gr/assets/images/empty-image.png'  />}
                    <input style={{ display: 'none' }} type="file" name="upload" accept=".png, .jpg, .jpeg" ref={inputRef} onChange={handleUpload} />
                  </div>
                  {/* <div className='ms-4'>
                    <ul>
                      <li>※ You can upload 1 image only</li>
                      <li>Maximum File Size : 00</li>
                      <li>File type : png , jpg , jpeg , gif</li>
                    </ul>
                    <button className='mt-2' style={{ background: '#4f5d73', height: '40px', width: '80px', cursor: 'pointer', borderRadius: 8, color: 'white' }} onClick={handleImageChange}>Upload</button>
                  </div> */}
                </div>
              </div>
              <div className="form-outline formWrpLabel form-white d-flex justify-content-end bg-light">
                <p style={{ padding: '2%' }}>Custom Settings</p>
                <CFormSwitch
                  className="mx-1 me-2 mt-1"
                  color="success"
                  shape="pill"
                  variant="opposite"
                  checked={data.customSetting}
                  onChange={handleChangeCustomSetting}
                // value={data.customSetting}
                />
              </div>

                            <div style={!data.customSetting ? { pointerEvents: 'none', opacity: 0.6 } : null}>
                                <div className="form-outline form-white  d-flex ">
                                    <div className="formWrpLabel" >
                                        <label className="fw-bolder ">
                                            Rental Duration
                                        </label>
                                    </div>
                                    <div className="formWrpInpt">
                                        <div className="d-flex formradiogroup mb-2 align-items-center   gap-5">
                                            <p>
                                                Max. Rentable Weeks
                                            </p>
                                            <p>
                                                <CFormInput placeholder='0' type='number' className='text-center' name='rentalDuration'
                                                    value={data.RentalDuration}
                                                    onChange={handleChangeRentalDuration}

                          style={{ width: '30%' }} />
                      </p>
                    </div>
                  </div>
                </div>
                <div className="form-outline form-white  d-flex ">
                  <div className="formWrpLabel" >
                    <label className="fw-bolder ">
                      Extend Duration
                    </label>
                  </div>
                  <div className="formWrpInpt">
                    <div className="d-flex formradiogroup mb-2 align-items-center   gap-5">
                      <p>
                        Max. Rentable Weeks
                      </p>
                      <p>
                        <CFormInput placeholder='0' type='number' name='rentalDuration'
                          value={data.ExtendDuration}
                          onChange={handleChangeExtendDuratiion}
                          style={{ width: '30%' }} />
                      </p>
                    </div>
                  </div>
                </div>
                <div className='formWrpLabel' />
                <div className="d-flex col-md-12">
                  <div className="form-outline form-white d-flex w-100">
                    <div className="formWrpLabel" >
                      <label className="fw-bolder ">Visibility</label>
                    </div>
                    <div className="push-notification-container gap-3">
                      <CFormCheck type="radio" name="visibility" id="exampleRadios1" label="Visible"
                        defaultChecked={data.visibility}
                        onClick={() => setData((prev) => ({ ...prev, visibility: true }))}
                        value={true}
                        checked={data.visibility}
                      />
                      <CFormCheck type="radio" name="visibility" id="exampleRadios2" label="Hide"
                        // defaultChecked={!addItemData.visibility}
                        onClick={() => setData((prev) => ({ ...prev, visibility: false }))}
                        value={false}
                        checked={!data.visibility}
                      />
                    </div>
                  </div>

                </div>
                <div className="form-outline form-white  d-flex ">
                  <div className="formWrpLabel" >
                    <label className="fw-bolder">
                      Point of pick and return
                    </label>
                  </div>
                  <div className="formWrpInpt">
                    <div className="d-flex formradiogroup mb-2 gap-3">
                      <CFormInput
                        type="text"
                        placeholder="Enter name, Location"
                        name='pickUpAndReturn'
                        value={data.PointOfPickAndReturn}
                        onChange={handleChangePickUpPoint}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='d-flex justify-content-center gap-4 my-3'>
          <CButton onClick={handleCancel} className='btn-black'>Cancel</CButton>
          <CButton onClick={handleUpdateBookItem}>Save</CButton>
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
            <CButton className='btn-black' onClick={deleteBookItem}>Delete</CButton>
            <CButton className='btn-black' onClick={() => setdeleteVisible(false)} color="secondary" >
              Cancel
            </CButton>
          </CModalFooter>
        </CModal>
      </div>
    </div>
  )
}

export default ItemNumber
