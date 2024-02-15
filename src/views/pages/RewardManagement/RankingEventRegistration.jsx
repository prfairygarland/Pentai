import React, { useEffect, useState } from 'react'

import './rewardManagement.scss'
import { CButton, CFormInput, CFormSelect, CFormTextarea } from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import DatePicker from 'react-date-picker'
import { API_ENDPOINT } from 'src/utils/config'
import { getApi, postApi } from 'src/utils/Api'
import { enqueueSnackbar } from 'notistack'

const RankingEventRegistration = ({ eventId = '' }) => {
  const [uploadedImage, setUploadedImage] = useState('')
  const [title, setTitle] = useState('')
  const [fromStar, setFromStar] = useState(1)
  const [toStar, setToStar] = useState(5)
  const [startDate, setStartDate] = useState('')
  const [startHour, setStartHour] = useState('')
  const [startMins, setStartMins] = useState('')
  const [endDate, setEndDate] = useState('')
  const [endHour, setEndHour] = useState('')
  const [endMins, setEndMins] = useState('')
  const [participationPoints, setParticipationPoints] = useState(100)
  const [participationLimit, setParticipationLimit] = useState(1)
  const [description, setDescription] = useState('')
  const [winnerDescription, setWinnerDescription] = useState('')
  const [rewardCount, setRewardCount] = useState(1)
  const [rewards, setRewards] = useState([])

  const [productList, setProductList] = useState([])
  const navigate = useNavigate()

  const fromToStars = [
    { value: 1, label: 1 },
    { value: 2, label: 2 },
    { value: 3, label: 3 },
    { value: 4, label: 4 },
    { value: 5, label: 5 },
  ]

  const setStartDateHandler = (event) => {
    let d = new Date(event),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear()
    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day
    setStartDate([year, month, day].join('-'))
  }

  const startTimeHandler = (e) => {
    setStartHour(e.target.value.split(':')[0])
    setStartMins(e.target.value.split(':')[1])
  }

  const setEndDateHandler = (event) => {
    let d = new Date(event),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear()
    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day
    setEndDate([year, month, day].join('-'))
  }

  const endTimeHandler = (e) => {
    setEndHour(e.target.value.split(':')[0])
    setEndMins(e.target.value.split(':')[1])
  }

  const backToListing = () => {
    navigate('../RankingEventManagement')
  }

  const updateRankingEvent = () => {
    enqueueSnackbar(`Data updated successfully!`, { variant: 'success' })
    navigate('../RankingEventManagement')
  }

  const saveRankingEvent = async () => {
    const formData = new FormData()
    formData.append('images', uploadedImage)
    const changedImage = await postApi(API_ENDPOINT.uploadImage, formData)
    const imagePath = await changedImage?.data?.data[0]?.path
    const body = {
      title,
      start: new Date(new Date(startDate + 'T' + startHour + ':' + startMins)).toISOString(),
      end: new Date(new Date(endDate + 'T' + endHour + ':' + endMins)).toISOString(),
      image: imagePath,
      participationPoints,
      description,
      rewards,
      minStars: fromStar,
      maxStars: toStar,
      winnerDescription,
    }
    try {
      const res = await postApi(API_ENDPOINT.createRewardRanking, body)
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
        setProductList(res?.data)
        setRewardsHandler(0, res?.data[0].value)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const addRewardOption = () => {
    setRewardsHandler(rewardCount)
    setRewardCount((prev) => prev + 1)
  }

  const setRewardsHandler = (index, value = productList[0].value) => {
    const allRewards = [...rewards]
    allRewards[index] = { type: 'product', productId: Number(value) }
    setRewards(allRewards)
  }

  useEffect(() => {
    getAllProducts()
  }, [])

  return (
    <>
      <main>
        {!eventId && (
          <div className="pageTitle mb-3 pb-2">
            <h2>Ranking Event Registration</h2>
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
                    Range of stars per participation*{' '}
                    <span className="mandatory-red-asterisk">*</span>
                  </label>
                </div>
                <div className="push-notification-container gap-3 align-items-center">
                  <CFormSelect
                    className="me-2"
                    aria-label="Default select example"
                    options={fromToStars}
                    onChange={(e) => setFromStar(e.target.value)}
                    value={fromStar}
                  />
                  ~
                  <CFormSelect
                    className="me-2"
                    aria-label="Default select example"
                    options={fromToStars}
                    onChange={(e) => setToStar(e.target.value)}
                    value={toStar}
                  />
                </div>
              </div>
            </div>
            <div className="form-outline form-white  d-flex ">
              <div className="formWrpLabel">
                <label className="fw-bolder ">Reward</label>
              </div>
              <div className="formWrpInpt">
                <div className="d-flex formradiogroup mb-2 gap-3">
                  1st:{' '}
                  <CFormSelect
                    className="me-2"
                    aria-label="Default select example"
                    options={productList}
                    onChange={(e) => setRewardsHandler(0, e.target.value)}
                    value={rewards[0]?.value}
                  />
                </div>
                {rewardCount >= 2 && (
                  <div className="d-flex formradiogroup mb-2 gap-3">
                    2nd:{' '}
                    <CFormSelect
                      className="me-2"
                      aria-label="Default select example"
                      options={productList}
                      onChange={(e) => setRewardsHandler(1, e.target.value)}
                      value={rewards[1].value}
                    />
                  </div>
                )}
                {rewardCount === 3 && (
                  <div className="d-flex formradiogroup mb-2 gap-3">
                    3rd:{' '}
                    <CFormSelect
                      className="me-2"
                      aria-label="Default select example"
                      options={productList}
                      onChange={(e) => setRewardsHandler(2, e.target.value)}
                      value={rewards[2].value}
                    />
                  </div>
                )}
                {rewardCount < 3 && (
                  <div className="d-flex formradiogroup mb-2 gap-3">
                    <CButton onClick={addRewardOption}>Add Reward +</CButton>
                  </div>
                )}
              </div>
            </div>
            <div className="form-outline form-white  d-flex ">
              <div className="formWrpLabel">
                <label className="fw-bolder ">Description</label>
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
                <label className="fw-bolder ">Winner Description</label>
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
            <CButton className="btn " onClick={saveRankingEvent}>
              Save
            </CButton>
          )}
          {eventId && (
            <CButton className="btn " onClick={updateRankingEvent}>
              Update
            </CButton>
          )}
        </div>
      </main>
    </>
  )
}

export default RankingEventRegistration
