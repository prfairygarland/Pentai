import React, { useEffect, useState } from 'react'

import './rewardManagement.scss'
import { CButton, CFormCheck, CFormInput, CFormSelect, CFormTextarea } from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import DatePicker from 'react-date-picker'
import { ALL_CONSTANTS, API_ENDPOINT } from 'src/utils/config'
import { getApi, postApi } from 'src/utils/Api'
import { enqueueSnackbar } from 'notistack'
import ProductManagementRegistration from './ProductManagementRegistration'

const LuckyDrawEventRegistration = ({ eventId = '' }) => {
  const [title, setTitle] = useState('')
  const [startDate, setStartDate] = useState('')
  const [startHour, setStartHour] = useState('')
  const [startMins, setStartMins] = useState('')
  const [endDate, setEndDate] = useState('')
  const [endHour, setEndHour] = useState('')
  const [endMins, setEndMins] = useState('')
  const [announcementMode, setAnnouncementMode] = useState('atTheEnd')
  const [announcementDate, setAnnouncementDate] = useState('')
  const [announcementHour, setAnnouncementHour] = useState('')
  const [announcementMins, setAnnouncementMins] = useState('')
  const [participationLimitMode, setParticipationLimitMode] = useState('noLimit')
  const [participationPoints, setParticipationPoints] = useState(100)
  const [participationLimit, setParticipationLimit] = useState('')
  const [description, setDescription] = useState('')
  const [winnerDescription, setWinnerDescription] = useState('')
  const [uploadedImage, setUploadedImage] = useState('')
  const [rewardId, setRewardId] = useState('')
  const [rewardQuantity, setRewardQuantity] = useState(1)
  const [productList, setProductList] = useState([])
  const [productModal, setProductModal] = useState(false)

  const navigate = useNavigate()

  const setStartDateHandler = (event) => {
    if (new Date(event).getFullYear() <= 2020) {
      let d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear()
      if (month.length < 2) month = '0' + month
      if (day.length < 2) day = '0' + day
      setStartDate([year, month, day].join('-'))
    } else {
      let d = new Date(event),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear()
      if (month.length < 2) month = '0' + month
      if (day.length < 2) day = '0' + day
      setStartDate([year, month, day].join('-'))
    }
  }

  const startTimeHandler = (e) => {
    setStartHour(e.target.value.split(':')[0])
    setStartMins(e.target.value.split(':')[1])
  }

  const setEndDateHandler = (event) => {
    let eventValue = event
    if (new Date(event).getFullYear() <= 2020) {
      eventValue = null
    }
    let d = new Date(eventValue),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear()
    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day
    setEndDate([year, month, day].join('-'))
    if (announcementMode === 'atTheEnd') {
      setAnnouncementDate([year, month, day].join('-'))
    }
  }

  const endTimeHandler = (e) => {
    setEndHour(e.target.value.split(':')[0])
    setEndMins(e.target.value.split(':')[1])
    if (announcementMode === 'atTheEnd') {
      setAnnouncementHour(e.target.value.split(':')[0])
      setAnnouncementMins(e.target.value.split(':')[1])
    }
  }

  const setAnnouncementDateHandler = (event) => {
    if (event === 'atTheEnd') {
      setAnnouncementDate(endDate)
      return
    }
    let d = new Date(event),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear()
    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day
    setAnnouncementDate([year, month, day].join('-'))
  }

  const announcementTimeHandler = (e) => {
    setAnnouncementHour(e === 'atTheEnd' ? endHour : e.target.value.split(':')[0])
    setAnnouncementMins(e === 'atTheEnd' ? endMins : e.target.value.split(':')[1])
  }

  const backToListing = () => {
    navigate('../LuckyDrawEventManagement')
  }

  const updateLuckyDrawEvent = () => {
    enqueueSnackbar(`Data updated successfully!`, { variant: 'success' })
    navigate('../LuckyDrawEventManagement')
  }

  const validateForm = () => {
    if (!title) {
      enqueueSnackbar(`please enter title!`, { variant: 'error' })
      return
    } else if (startDate === '') {
      enqueueSnackbar('Please select start date', { variant: 'error' })
      return false
    } else if (startHour === '') {
      enqueueSnackbar('Please select start time', { variant: 'error' })
      return false
    } else if (endDate === '') {
      enqueueSnackbar('Please select end date', { variant: 'error' })
      return false
    } else if (endHour === '') {
      enqueueSnackbar('Please select end time', { variant: 'error' })
      return false
    } else if (new Date() > new Date(startDate + 'T' + startHour + ':' + startMins)) {
      console.log('new Date() :: ', new Date())
      console.log('new  :: ', new Date(startDate + 'T' + startHour + ':' + startMins))
      enqueueSnackbar('Start time can not be earlier than current time', { variant: 'error' })
      return false
    } else if (announcementDate === '') {
      enqueueSnackbar('Please select announcement date', { variant: 'error' })
      return false
    } else if (announcementHour === '') {
      enqueueSnackbar('Please select announcement time', { variant: 'error' })
      return false
    } else if (
      endHour &&
      new Date(startDate + 'T' + startHour + ':' + startMins) >
        new Date(endDate + 'T' + endHour + ':' + endMins)
    ) {
      enqueueSnackbar('End time can not be earlier than start time', { variant: 'error' })
      return false
    } else if (
      announcementMode !== 'atTheEnd' &&
      new Date(endDate + 'T' + endHour + ':' + endMins) >=
        new Date(announcementDate + 'T' + announcementHour + ':' + announcementMins)
    ) {
      enqueueSnackbar('Announcement time can not be earlier than end time', { variant: 'error' })
      return false
    } else if (uploadedImage === '') {
      enqueueSnackbar('Please select image', { variant: 'error' })
      return false
    } else if (!participationPoints) {
      enqueueSnackbar('Please enter participation points', { variant: 'error' })
      return false
    } else if (isNaN(participationPoints)) {
      enqueueSnackbar('Please enter number in participation points', { variant: 'error' })
      return false
    } else if (Number(participationPoints) < 0) {
      enqueueSnackbar('Participation points must be 0 or greater', { variant: 'error' })
      return false
    } else if (!rewardId) {
      enqueueSnackbar('Please select reward!', { variant: 'error' })
      return false
    } else if (!rewardQuantity) {
      enqueueSnackbar('Please enter reward quantity', { variant: 'error' })
      return false
    } else if (isNaN(rewardQuantity)) {
      enqueueSnackbar('Please enter number in reward quantity', { variant: 'error' })
      return false
    } else if (Number(rewardQuantity) < 1) {
      enqueueSnackbar('Reward quantity must be greater than 0', { variant: 'error' })
      return false
    } else if (!description) {
      enqueueSnackbar('Please enter description', { variant: 'error' })
      return false
    } else if (!winnerDescription) {
      enqueueSnackbar('Please enter winner description', { variant: 'error' })
      return false
    } else {
      enqueueSnackbar('Validation forn Only Participation Limit Is Pending', { variant: 'success' })
      saveLuckyDrawEvent()
    }
  }

  const saveLuckyDrawEvent = async () => {
    const formData = new FormData()
    formData.append('images', uploadedImage)
    const changedImage = await postApi(API_ENDPOINT.uploadImage, formData)
    const imagePath = await changedImage?.data?.data[0]?.path
    const body = {
      title,
      start: new Date(new Date(startDate + 'T' + startHour + ':' + startMins)).toISOString(),
      end: new Date(new Date(endDate + 'T' + endHour + ':' + endMins)).toISOString(),
      participationPoints,
      description,
      winnerDescription,
      rewardText: '',
      rewardId,
      rewardQuantity,
      image: imagePath,
      limitPerDay:
        participationLimitMode === 'noLimit'
          ? null
          : participationLimitMode === 'oncePerUser'
          ? null
          : participationLimit,
      limitPerUser:
        participationLimitMode === 'noLimit'
          ? null
          : participationLimitMode === 'oncePerUser'
          ? 1
          : null,
      announcementTime: new Date(new Date(endDate + 'T' + endHour + ':' + endMins)).toISOString(),
    }
    try {
      const res = await postApi(API_ENDPOINT.createRewardLuckyDraw, body)
      if (res?.data?.status === 201) {
        enqueueSnackbar(`Data saved successfully!`, { variant: 'success' })
        backToListing()
      } else {
        enqueueSnackbar(`Enter all fields`, { variant: 'error' })
      }
    } catch (error) {
      enqueueSnackbar(`Something Went wrong!`, { variant: 'error' })
    }
  }

  const getAllProducts = async () => {
    try {
      const res = await getApi(API_ENDPOINT.getAllProducts)

      if (res.status === 200) {
        setProductList([{ value: '', label: 'Product' }, ...res?.data])
      }
    } catch (error) {
      console.log(error)
    }
  }

  async function urlToBlob(url) {
    const response = await fetch(url)
    const blob = await response.blob()
    return blob
  }

  const urlToFile = async (url) => {
    if (!url) return
    const blob = await urlToBlob(ALL_CONSTANTS.BASE_URL + url)
    const fileName = url
    return new File([blob], fileName, { type: blob.type })
  }

  const getEventDetails = async () => {
    try {
      const res = await getApi(API_ENDPOINT.getLuckyDrawDetails + '?eventId=' + eventId)
      console.log('res :: ', res)

      if (res.status === 201) {
        setTitle(res?.data?.title)
        let startDateTime = new Date(res?.data?.startTime),
          startMonth = '' + (startDateTime.getMonth() + 1),
          startDay = '' + startDateTime.getDate(),
          startYear = startDateTime.getFullYear()
        if (startMonth.length < 2) startMonth = '0' + startMonth
        if (startDay.length < 2) startDay = '0' + startDay
        setStartDate([startYear, startMonth, startDay].join('-'))
        if (startDateTime.getHours() < 10) {
          setStartHour('0' + startDateTime.getHours())
        } else {
          setStartHour(startDateTime.getHours())
        }
        if (startDateTime.getMinutes() < 10) {
          setStartMins('0' + startDateTime.getMinutes())
        } else {
          setStartMins(startDateTime.getMinutes())
        }
        if (res?.data?.endTime) {
          let endDateTime = new Date(res?.data?.endTime),
            endMonth = '' + (endDateTime.getMonth() + 1),
            endDay = '' + endDateTime.getDate(),
            endYear = endDateTime.getFullYear()
          if (endMonth.length < 2) endMonth = '0' + endMonth
          if (endDay.length < 2) endDay = '0' + endDay
          setEndDate([endYear, endMonth, endDay].join('-'))
          if (endDateTime.getHours() < 10) {
            setEndHour('0' + endDateTime.getHours())
          } else {
            setEndHour(endDateTime.getHours())
          }
          if (endDateTime.getMinutes() < 10) {
            setEndMins('0' + endDateTime.getMinutes())
          } else {
            setEndMins(endDateTime.getMinutes())
          }
        }
        const file = await urlToFile(res?.data?.image)
        setUploadedImage(file)
        setParticipationPoints(res?.data?.participationPoints)
        setDescription(res?.data?.description)
        setWinnerDescription(res?.data?.winnerDescription)
        setRewardId(res?.data?.reward?.id)
        setRewardQuantity(res?.data?.reward?.quantity)

        const allRewards = []
        const rewardsFromDB = res?.data?.rewards
        rewardsFromDB.forEach((element) => {
          allRewards.push({ type: 'product', label: element.name, value: element.id })
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  const addNewProduct = () => {
    setProductModal(true)
  }

  useEffect(() => {
    getAllProducts()
  }, [])

  useEffect(() => {
    if (!productModal) {
      getAllProducts()
    }
  }, [productModal])

  useEffect(() => {
    if (eventId) {
      getEventDetails()
    }
  }, [eventId])
  return (
    <>
      <main>
        {!eventId && (
          <div className="pageTitle mb-3 pb-2">
            <h2>Lucky Draw Event Registration</h2>
          </div>
        )}
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
                    placeholder="Enter title"
                    name="title"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value.substring(0, 42))
                    }}
                  />
                  <span className="txt-byte-information justify-content-start">
                    {title.length} / 42
                  </span>
                </div>
              </div>
            </div>
            <div className="form-outline form-white  d-flex ">
              <div className="formWrpLabel">
                <label className="fw-bolder ">
                  Period <span className="mandatory-red-asterisk">*</span>
                </label>
              </div>
              <div className="formWrpInpt ">
                <div className="d-flex formradiogroup mb-2 gap-1 w-100 align-items-center">
                  <DatePicker
                    value={startDate}
                    minDate={new Date()}
                    onChange={(event) => setStartDateHandler(event)}
                  />
                  <input
                    type="time"
                    name="time"
                    id="time"
                    className="time-picker"
                    value={`${startHour}:${startMins}`}
                    onChange={(e) => startTimeHandler(e)}
                  />
                  ~&nbsp;&nbsp;&nbsp;
                  <DatePicker
                    value={endDate}
                    minDate={new Date()}
                    onChange={(event) => setEndDateHandler(event)}
                  />
                  <input
                    type="time"
                    name="time"
                    id="time"
                    className="time-picker"
                    value={`${endHour}:${endMins}`}
                    onChange={(e) => endTimeHandler(e)}
                  />
                </div>
              </div>
            </div>
            <div className="form-outline form-white  d-flex ">
              <div className="formWrpLabel">
                <label className="fw-bolder ">
                  Time of Announcement <span className="mandatory-red-asterisk">*</span>
                </label>
              </div>
              <div className="formWrpInpt ">
                <div className="d-flex formradiogroup mb-2 gap-1 w-100 align-items-center">
                  <CFormCheck
                    className="d-flex gap-2"
                    type="radio"
                    name="announcement"
                    id="exampleRadios1"
                    label={`${' '} At the end of the event`}
                    defaultChecked={announcementMode === 'atTheEnd'}
                    onClick={() => {
                      setAnnouncementMode('atTheEnd')
                      setAnnouncementDateHandler('atTheEnd')
                      announcementTimeHandler('atTheEnd')
                    }}
                    value="yes"
                  />
                  &nbsp;&nbsp;&nbsp;
                  <CFormCheck
                    className="d-flex gap-2"
                    type="radio"
                    name="announcement"
                    id="exampleRadios2"
                    label="Manual input"
                    defaultChecked={announcementMode === 'manual'}
                    onClick={() => setAnnouncementMode('manual')}
                    value="no"
                  />
                  ~&nbsp;&nbsp;&nbsp;
                  <DatePicker
                    value={announcementDate}
                    minDate={new Date()}
                    onChange={(event) => setAnnouncementDateHandler(event)}
                    disabled={announcementMode === 'atTheEnd'}
                  />
                  <input
                    type="time"
                    name="time"
                    id="time"
                    className="time-picker"
                    value={`${announcementHour}:${announcementMins}`}
                    onChange={(e) => announcementTimeHandler(e)}
                    disabled={announcementMode === 'atTheEnd'}
                  />
                </div>
              </div>
            </div>
            <div className="form-outline form-white  d-flex ">
              <div className="formWrpLabel">
                <label className="fw-bolder ">
                  Image <span className="mandatory-red-asterisk">*</span>
                </label>
              </div>
              <div className="formWrpInpt ">
                <div className="upload-img-btn-and-info flex-column">
                  <div className="upload-container-btn">
                    <label
                      className="btn btn-primary"
                      style={{ paddingLeft: 20 }}
                      htmlFor="imageFiles"
                    >
                      Upload
                      <input
                        type="file"
                        name="imageFiles"
                        id="imageFiles"
                        style={{ display: 'none' }}
                        accept=".png, .jpg, .jpeg, .gif"
                        onChange={(e) => setUploadedImage(e.target.files[0])}
                      />
                    </label>
                  </div>
                  {uploadedImage && (
                    <div className="upload-images-container uploadImgWrap">
                      <div className="thubmnail-img-container">
                        <img src={URL.createObjectURL(uploadedImage)} alt="" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="d-flex col-md-12">
              <div className="form-outline form-white d-flex col-md-12">
                <div className="formWrpLabel">
                  <label className="fw-bolder ">
                    Participation Points <span className="mandatory-red-asterisk">*</span>
                  </label>
                </div>
                <div className="push-notification-container gap-3 align-items-center">
                  <CFormInput
                    type="text"
                    name="title"
                    value={participationPoints}
                    onChange={(e) => {
                      setParticipationPoints(e.target.value)
                    }}
                    style={{ width: 150, textAlign: 'center' }}
                  />{' '}
                  Points
                </div>
              </div>
            </div>
            <div className="d-flex col-md-12">
              <div className="form-outline form-white d-flex col-md-12">
                <div className="formWrpLabel">
                  <label className="fw-bolder ">
                    Participation limit <span className="mandatory-red-asterisk">*</span>
                  </label>
                </div>
                <div className="push-notification-container gap-3 align-items-center">
                  <CFormCheck
                    className="d-flex gap-2"
                    type="radio"
                    name="participationLimit"
                    id="exampleRadios1"
                    label={`${' '} No Limit`}
                    defaultChecked={participationLimitMode === 'noLimit'}
                    onClick={
                      ((e) => e.stopPropagation(), () => setParticipationLimitMode('noLimit'))
                    }
                    value="yes"
                  />
                  &nbsp;&nbsp;&nbsp;
                  <CFormCheck
                    className="d-flex gap-2"
                    type="radio"
                    name="participationLimit"
                    id="exampleRadios2"
                    label="Once per user"
                    defaultChecked={participationLimitMode === 'oncePerUser'}
                    onClick={
                      ((e) => e.stopPropagation(), () => setParticipationLimitMode('oncePerUser'))
                    }
                    value="no"
                  />
                  &nbsp;&nbsp;&nbsp;
                  <CFormCheck
                    className="d-flex gap-2"
                    type="radio"
                    name="participationLimit"
                    id="exampleRadios2"
                    label="Manual input"
                    defaultChecked={participationLimitMode === 'manual'}
                    onClick={
                      ((e) => e.stopPropagation(), () => setParticipationLimitMode('manual'))
                    }
                    value="no"
                  />
                  <CFormInput
                    type="text"
                    name="title"
                    value={participationLimitMode === 'manual' ? participationLimit : ''}
                    disabled={participationLimitMode !== 'manual'}
                    onChange={(e) => {
                      setParticipationLimit(e.target.value)
                    }}
                    style={{ width: 150, textAlign: 'center' }}
                  />{' '}
                  time(s) a day
                </div>
              </div>
            </div>
            <div className="d-flex col-md-12">
              <div className="form-outline form-white d-flex col-md-12">
                <div className="formWrpLabel">
                  <label className="fw-bolder ">
                    Reward <span className="mandatory-red-asterisk">*</span>
                  </label>
                </div>
                <div className="push-notification-container gap-3 align-items-center">
                  <div>
                    <CFormSelect
                      className="me-2"
                      aria-label="Default select example"
                      options={productList}
                      onChange={(e) => setRewardId(e.target.value)}
                      value={rewardId}
                    />
                  </div>
                  {rewardId === '' && (
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        addNewProduct()
                      }}
                    >
                      Registration +
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="d-flex col-md-12">
              <div className="form-outline form-white d-flex col-md-12">
                <div className="formWrpLabel">
                  <label className="fw-bolder ">
                    Reward Quantity <span className="mandatory-red-asterisk">*</span>
                  </label>
                </div>
                <div className="push-notification-container gap-3 align-items-center">
                  <CFormInput
                    type="text"
                    name="title"
                    value={rewardQuantity}
                    onChange={(e) => {
                      setRewardQuantity(e.target.value)
                    }}
                    style={{ width: 150, textAlign: 'center' }}
                  />{' '}
                  Points
                </div>
              </div>
            </div>
            <div className="form-outline form-white  d-flex ">
              <div className="formWrpLabel">
                <label className="fw-bolder ">
                  Description<span className="mandatory-red-asterisk">*</span>
                </label>
              </div>
              <div className="formWrpInpt">
                <div className="d-flex formradiogroup mb-2 gap-3">
                  <CFormTextarea
                    id="exampleFormControlTextarea1"
                    rows={3}
                    placeholder="Enter Description"
                    name="content"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></CFormTextarea>
                </div>
              </div>
            </div>
            <div className="form-outline form-white  d-flex ">
              <div className="formWrpLabel">
                <label className="fw-bolder ">
                  Winner Description<span className="mandatory-red-asterisk">*</span>
                </label>
              </div>
              <div className="formWrpInpt">
                <div className="d-flex formradiogroup mb-2 gap-3">
                  <CFormTextarea
                    id="exampleFormControlTextarea1"
                    rows={3}
                    placeholder="Enter Winner Description"
                    name="content"
                    value={winnerDescription}
                    onChange={(e) => setWinnerDescription(e.target.value)}
                  ></CFormTextarea>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="save-cancel-btn-container gap-3 my-3">
          <CButton className="btn btn-black" color="dark" onClick={backToListing}>
            Cancel
          </CButton>
          {!eventId && (
            <CButton className="btn " onClick={validateForm}>
              Save
            </CButton>
          )}
          {eventId && (
            <CButton className="btn " onClick={updateLuckyDrawEvent}>
              Update
            </CButton>
          )}
        </div>
      </main>
      <ProductManagementRegistration
        show={productModal}
        setShow={setProductModal}
        productData={{}}
        setProduct={setRewardId}
      />
    </>
  )
}

export default LuckyDrawEventRegistration
