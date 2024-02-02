import {
  CButton,
  CFormInput,
  CFormSelect,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import AllReservationListing from './AllReservationListing'
import MyReservationListing from './MyReservationListing'
import { API_ENDPOINT } from 'src/utils/config'
import { getApi } from 'src/utils/Api'

const MeetingRoomsReservationStatus = () => {
  const [currentTab, setCurrentTab] = useState('All Reservation')
  const [showBookMeetingRoom, setShowBookMeetingRoom] = useState(false)
  const arrTimes = [
    '00:00',
    '00:30',
    '01:00',
    '01:30',
    '02:00',
    '02:30',
    '03:00',
    '03:30',
    '04:00',
    '04:30',
    '05:00',
    '05:30',
    '06:00',
    '06:30',
    '07:00',
    '07:30',
    '08:00',
    '08:30',
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
    '17:30',
    '18:00',
    '18:30',
    '19:00',
    '19:30',
    '20:00',
    '20:30',
    '21:00',
    '21:30',
    '22:00',
    '22:30',
    '23:00',
    '23:30',
    '24:00',
  ]

  const setTab = (tab) => {
    setCurrentTab(tab)
  }

  const { i18n } = useTranslation()
  const translationObject = i18n.getDataByLanguage(i18n.language)
  const multiLangObj = translationObject?.translation?.meetingRoomsReservationManagement

  const bookMeetingRoomsHandler = async () => {
    //admin/meeting/roomList
    try {
      const res = await getApi(API_ENDPOINT.get_all_meeting_rooms)
      console.log(res?.data)
      if (res.status === 200) {
        // setMeetingRoomDetails(res?.data)
        // setShowMeetingRoomDetails(true)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <main>
        <div className="mb-3">
          <div>
            <div className="pageTitle mb-3 pb-2">
              <h2>{multiLangObj?.meetingRoomReservationStatus}</h2>
            </div>

            <div className="d-flex justify-content-end mb-2">
              <CButton onClick={() => setShowBookMeetingRoom(true)}>
                {multiLangObj?.btnBookMeetingRooms}
              </CButton>
            </div>
            <div className="camp-tab-cont d-flex mb-3">
              <div className="nav nav-tabs" id="nav-tab" role="tablist">
                <button
                  className={`primary-btn ${currentTab == 'All Reservation' && 'active'}`}
                  id="edit-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#edit"
                  type="button"
                  role="tab"
                  aria-selected="true"
                  onClick={() => setTab('All Reservation')}
                >
                  {multiLangObj?.allReservation}
                </button>
                <button
                  className={`primary-btn ${currentTab == 'My Reservation' && 'active'}`}
                  id="review-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#review"
                  type="button"
                  role="tab"
                  aria-selected="false"
                  onClick={() => setTab('My Reservation')}
                >
                  {multiLangObj?.myReservation}
                </button>
              </div>
            </div>
            {currentTab === 'All Reservation' && <AllReservationListing />}
            {currentTab === 'My Reservation' && <MyReservationListing />}
          </div>
        </div>
        <CModal
          alignment="center"
          visible={showBookMeetingRoom}
          backdrop="static"
          onClose={() => setShowBookMeetingRoom(false)}
          aria-labelledby="LiveDemoExampleLabel"
        >
          <CModalHeader onClose={() => setShowBookMeetingRoom(false)}>
            <CModalTitle id="StaticBackdropExampleLabel">Booking Meeting Rooms</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <div className="card-body">
              <div className="formWraper">
                <div className="form-outline form-white  d-flex ">
                  <div className="formWrpLabel">
                    <label className="fw-bolder ">Meeting Room</label>
                  </div>
                  <CFormSelect
                    size="sm"
                    name="boardId"
                    className="board-dropdown"
                    onChange={(e) => {
                      alert(e)
                    }}
                  >
                    {[
                      { id: '001', name: 'Zero - One' },
                      { id: '002', name: 'Zero - Two' },
                    ].map((option, index) => (
                      <option key={option.id} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </CFormSelect>
                </div>
                <div className="form-outline form-white  d-flex ">
                  <div className="formWrpLabel">
                    <label className="fw-bolder ">Room Title Room</label>
                  </div>
                  <CFormInput
                    type="text"
                    placeholder="Enter Poll Title"
                    className="txt-poll-title"
                    name="pollTitle"
                    onChange={(e) => {
                      alert(e.target.value.substring(0, 62))
                    }}
                  />
                  <span className="txt-byte-information">{} / 62 byte</span>
                </div>
                <div className="form-outline form-white  d-flex ">
                  <div className="formWrpLabel">
                    <label className="fw-bolder ">Date & Time</label>
                  </div>
                  <div className="upload-image-main-container">
                    <div className="upload-img-btn-and-info">Date & Time</div>
                  </div>
                </div>
                <div className="form-outline form-white  d-flex ">
                  <div className="formWrpLabel">
                    <label className="fw-bolder ">All Day</label>
                  </div>
                </div>
                <div
                  className="form-outline form-white  d-flex "
                  style={{ width: '463px', flexflow: 'wrap' }}
                >
                  {arrTimes.map((time) => (
                    <label
                      className="fw-bolder "
                      key={time}
                      style={{ cursor: 'pointer', margin: '4px' }}
                    >
                      {time}
                    </label>
                  ))}
                </div>
              </div>
              <div className="d-flex justify-content-end">
                <CButton onClick={() => {}}>Book</CButton>
              </div>
            </div>
          </CModalBody>
        </CModal>
      </main>
    </>
  )
}

export default MeetingRoomsReservationStatus
