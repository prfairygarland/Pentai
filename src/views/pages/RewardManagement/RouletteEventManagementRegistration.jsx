import React, { useEffect, useState } from 'react'

import './rewardManagement.scss'
import {
  CButton,
  CFormCheck,
  CFormInput,
  CFormSelect,
  CFormSwitch,
  CFormTextarea,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import DatePicker from 'react-date-picker'
import { API_ENDPOINT } from 'src/utils/config'
import { getApi, postApi } from 'src/utils/Api'
import { enqueueSnackbar } from 'notistack'

const RouletteEventManagementRegistration = ({ eventId = '' }) => {
  const [title, setTitle] = useState('')
  const [startDate, setStartDate] = useState('')
  const [startHour, setStartHour] = useState('')
  const [startMins, setStartMins] = useState('')
  const [endDate, setEndDate] = useState('')
  const [endHour, setEndHour] = useState('')
  const [endMins, setEndMins] = useState('')
  const [participationPoints, setParticipationPoints] = useState(100)
  const [participationLimit, setParticipationLimit] = useState(1)
  const [description, setDescription] = useState('')

  const [productList, setProductList] = useState([])
  const [rewardSettings, setRewardSettings] = useState([])
  const navigate = useNavigate()

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
    navigate('../RouletteEventManagement')
  }

  const updateRouletteEvent = () => {
    enqueueSnackbar(`Data updated successfully!`, { variant: 'success' })
    navigate('../RouletteEventManagement')
  }

  const saveRouletteEvent = async () => {
    const rewardsBody = []
    rewardSettings.forEach((reward) => {
      if (reward.prodId === 'points') {
        rewardsBody.push({
          type: 'points',
          points: reward.points ? reward.points : 10,
          quantity: reward.quantity ? reward.quantity : 10,
          limitPerDay: reward.limitPerDay ? reward.limitPerDay : 1,
        })
      } else if (reward.prodId === 'noLuck') {
        rewardsBody.push({ type: 'noLuck' })
      } else {
        rewardsBody.push({
          type: 'product',
          productId: reward.prodId,
          quantity: reward.quantity ? reward.quantity : 10,
          limitPerDay: reward.limitPerDay ? reward.limitPerDay : 1,
        })
      }
    })
    const body = {
      title,
      start: new Date(new Date(startDate + 'T' + startHour + ':' + startMins)).toISOString(),
      end: new Date(new Date(endDate + 'T' + endHour + ':' + endMins)).toISOString(),
      participationPoints,
      description,
      limitPerDay: participationLimit,
      rewards: rewardsBody,
    }
    try {
      const res = await postApi(API_ENDPOINT.createRewardRoulette, body)
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

  const setProductId = (event, index) => {
    const currentRewardSettings = [...rewardSettings]
    currentRewardSettings[index].productPrice = productList.filter((prod) => {
      return prod.value === Number(event.target.value)
    })[0]?.price
    currentRewardSettings[index].prodId = event.target.value
    setRewardSettings(currentRewardSettings)
  }

  const setPoints = (event, index) => {
    const currentRewardSettings = [...rewardSettings]
    currentRewardSettings[index].points = event.target.value
    setRewardSettings(currentRewardSettings)
  }

  const setQuantity = (e, index) => {
    let sanitizedValue = e.target.value.replace(/[^0-9]/g, '')
    if (Number(sanitizedValue.charAt(0)) === 0) {
      sanitizedValue = sanitizedValue.slice(1)
    }
    if (sanitizedValue.length === 0) {
      const currentRewardSettings = [...rewardSettings]
      currentRewardSettings[index].quantity = 0
      setRewardSettings(currentRewardSettings)
      calculateProbability()
    } else if (sanitizedValue.length <= 4) {
      const currentRewardSettings = [...rewardSettings]
      currentRewardSettings[index].quantity = sanitizedValue
      setRewardSettings(currentRewardSettings)
      calculateProbability()
    }
  }

  const calculateProbability = () => {
    const totalQty = rewardSettings.reduce((acc, current) => {
      return (acc += Number(current.quantity))
    }, 0)
    const currentRewardSettings = [...rewardSettings]
    rewardSettings.forEach((reward, index) => {
      if (index < 7) {
        currentRewardSettings[index].probability = Number(
          (Number(reward.quantity) / totalQty) * 87.5,
        ).toFixed(1)
      }
    })
    setRewardSettings(currentRewardSettings)
  }

  const setLimitPerDayToggle = (index) => {
    const currentRewardSettings = [...rewardSettings]
    if (currentRewardSettings[index].limitPerDay === '') {
      currentRewardSettings[index].limitPerDay = '1'
    } else {
      currentRewardSettings[index].limitPerDay = ''
    }
    setRewardSettings(currentRewardSettings)
  }

  const setLimitPerDay = (value, index) => {
    if (value.length >= 1 && value.length <= 3) {
      const currentRewardSettings = [...rewardSettings]
      currentRewardSettings[index].limitPerDay = value
      setRewardSettings(currentRewardSettings)
    }
  }

  const getAllProducts = async () => {
    try {
      const res = await getApi(API_ENDPOINT.getAllProducts)

      if (res.status === 200) {
        setProductList([
          { label: 'Product', value: 'product' },
          { label: 'Points', value: 'points' },
          { label: 'No Luck', value: 'noLuck' },
          ...res?.data,
        ])
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getAllProducts()
    setProductList([
      { label: 'Product', value: 'product' },
      { label: 'Points', value: 'points' },
      { label: 'No Luck', value: 'noLuck' },
      { value: 1, label: 'Product 1' },
      { value: 2, label: 'Product 2' },
      { value: 3, label: 'Product 3' },
      { value: 4, label: 'Product 4' },
    ])
    setRewardSettings([
      {
        prodId: 'product',
        productPrice: '',
        points: '',
        quantity: '10',
        probability: '12.5',
        limitPerDay: '',
      },
      {
        prodId: 'product',
        productPrice: '',
        points: '',
        quantity: '10',
        probability: '12.5',
        limitPerDay: '',
      },
      {
        prodId: 'product',
        productPrice: '',
        points: '',
        quantity: '10',
        probability: '12.5',
        limitPerDay: '',
      },
      {
        prodId: 'product',
        productPrice: '',
        points: '',
        quantity: '10',
        probability: '12.5',
        limitPerDay: '',
      },
      {
        prodId: 'product',
        productPrice: '',
        points: '',
        quantity: '10',
        probability: '12.5',
        limitPerDay: '',
      },
      {
        prodId: 'product',
        productPrice: '',
        points: '',
        quantity: '10',
        probability: '12.5',
        limitPerDay: '',
      },
      {
        prodId: 'product',
        productPrice: '',
        points: '',
        quantity: '10',
        probability: '12.5',
        limitPerDay: '',
      },
      { prodId: 'product', productPrice: '', points: '', quantity: '', probability: '12.5' },
    ])
  }, [])

  const getEventDetails = async () => {
    try {
      const res = await getApi(API_ENDPOINT.getRouletteDetails + '?eventId=' + eventId)

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
        setParticipationPoints(res?.data?.participationPoints)
        setParticipationLimit(res?.data?.participationLimitPerDay)
        setDescription(res?.data?.description)
        const rewardsBody = []
        res?.data?.rewards?.forEach((reward, index) => {
          if (reward.rewardType === 'points') {
            rewardsBody.push({
              type: 'points',
              prodId: 'points',
              productPrice: reward.price,
              points: reward.points,
              quantity: index === 7 ? '' : reward.quantity,
              probability: reward.probability,
              limitPerDay: reward.limitPerDay,
            })
          } else if (reward.rewardType === 'noLuck') {
            rewardsBody.push({ type: 'noLuck', prodId: 'noLuck' })
          } else {
            rewardsBody.push({
              type: 'product',
              prodId: reward.id,
              productPrice: reward.price,
              points: reward.points,
              quantity: index === 7 ? '' : reward.quantity,
              probability: reward.probability,
              limitPerDay: reward.limitPerDay,
            })
          }
        })
        setRewardSettings(rewardsBody)
        console.log('data :: ', res?.data?.rewards)
      }
    } catch (error) {
      console.log(error)
    }
  }

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
            <h2>Roulette event Registration</h2>
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
            <div className="d-flex col-md-12">
              <div className="form-outline form-white d-flex col-md-6">
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
              <div className="form-outline form-white d-flex col-md-6">
                <div className="formWrpLabel">
                  <label className="fw-bolder ">
                    Participation limit (days) <span className="mandatory-red-asterisk">*</span>
                  </label>
                </div>
                <div className="push-notification-container gap-3">
                  <CFormInput
                    type="text"
                    name="title"
                    value={participationLimit}
                    onChange={(e) => {
                      setParticipationLimit(e.target.value)
                    }}
                    style={{ width: 100, textAlign: 'center' }}
                  />
                </div>
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
          </div>
        </div>

        <h4 className="mt-3">Rewards Settings</h4>
        <div className="table-responsive ptk-table ">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th></th>
                <th>Reward</th>
                <th width="130">Quantity</th>
                <th width="170">Probability</th>
                <th width="170">Limit per day</th>
              </tr>
            </thead>
            <tbody>
              {rewardSettings.map((item, index) => (
                <tr key={index}>
                  <td>
                    Reward {index + 1}
                    {index === 7 && (
                      <>
                        <br />
                        (default reward)
                      </>
                    )}
                  </td>
                  <td>
                    <div className="d-flex align-items-center gap-3">
                      <div className="w-50">
                        <CFormSelect
                          className="me-2"
                          aria-label="Default select example"
                          options={productList}
                          onChange={(e) => setProductId(e, index)}
                          value={item.prodId}
                        />
                      </div>
                      <div className="w-50 d-flex justify-content-start">
                        {item.prodId === 'product' && (
                          <button className="btn btn-primary" onClick={() => alert('WIP')}>
                            Registration +
                          </button>
                        )}
                        {item.prodId !== 'product' &&
                          item.prodId !== 'points' &&
                          item.prodId !== 'noLuck' && <p>{item.productPrice} KRW</p>}
                        {item.prodId === 'points' && (
                          <div className="pointsWrap d-flex align-items-center ">
                            <input
                              className="form-control me-2 w-50"
                              value={item.points}
                              onChange={(e) => setPoints(e, index)}
                            />
                            <span>P</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex align-items-center justify-content-center">
                      <input
                        className="form-control"
                        value={item.quantity}
                        disabled={index === 7}
                        onChange={(e) => setQuantity(e, index)}
                        style={{ width: 100 }}
                      />
                    </div>
                  </td>
                  <td>
                    <div className="d-flex align-items-center gap-2 justify-content-center">
                      <input
                        className="form-control"
                        value={item.probability}
                        disabled
                        style={{ width: 100 }}
                      />
                      <span>%</span>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex align-items-center gap-2 ">
                      <CFormSwitch
                        id="club_banner"
                        className="cFormSwitch"
                        onClick={() => setLimitPerDayToggle(index)}
                        defaultChecked={item.limitPerDay}
                      />
                      {item.limitPerDay && (
                        <input
                          type="number"
                          min={1}
                          className="form-control"
                          value={item.limitPerDay}
                          style={{ width: 100 }}
                          onChange={(event) => setLimitPerDay(event.target.value, index)}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <p>
            <b>* When the specified quantity is run out, earn a Reward 8.</b>
          </p>
        </div>
        <div className="save-cancel-btn-container gap-3 my-3">
          <CButton className="btn btn-black" color="dark" onClick={backToListing}>
            Cancel
          </CButton>
          {!eventId && (
            <CButton className="btn " onClick={saveRouletteEvent}>
              Save
            </CButton>
          )}
          {eventId && (
            <CButton className="btn " onClick={updateRouletteEvent}>
              Update
            </CButton>
          )}
        </div>
      </main>
    </>
  )
}

export default RouletteEventManagementRegistration
