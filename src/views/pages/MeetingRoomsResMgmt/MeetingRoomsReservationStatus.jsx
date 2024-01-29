import { CButton, CModal, CModalBody, CModalHeader, CModalTitle } from '@coreui/react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import AllReservationListing from './AllReservationListing'
import MyReservationListing from './MyReservationListing'
import { API_ENDPOINT } from 'src/utils/config'
import { getApi } from 'src/utils/Api'

const MeetingRoomsReservationStatus = () => {
  const [currentTab, setCurrentTab] = useState('All Reservation')
  const [showBookMeetingRoom, setShowBookMeetingRoom] = useState(false)

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
        <div className="container p-3 mb-3">
          <div>
            <div>Meeting Room Reservation Status</div>
            <div>
              <CButton onClick={() => setShowBookMeetingRoom(true)}>
                {multiLangObj?.btnBookMeetingRooms}
              </CButton>
            </div>
            <div className="camp-tab-cont d-flex">
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
          <CModalHeader onClose={() => setShowBookMeetingRoom(false)} />
          <CModalBody>
            <div className="card-body">
              <div className="formWraper">
                <div className="form-outline form-white  d-flex ">
                  <div className="formWrpLabel">
                    <label className="fw-bolder ">Meeting Room</label>
                  </div>
                  <div className="upload-image-main-container">
                    <div className="upload-img-btn-and-info">Data</div>
                  </div>
                </div>
              </div>
            </div>
          </CModalBody>
        </CModal>
      </main>
    </>
  )
}

export default MeetingRoomsReservationStatus
