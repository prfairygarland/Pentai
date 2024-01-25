import { CButton } from '@coreui/react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import AllReservationListing from './AllReservationListing'
import MyReservationListing from './MyReservationListing'

const MeetingRoomsReservationStatus = () => {
  const [currentTab, setCurrentTab] = useState('All Reservation')

  const setTab = (tab) => {
    setCurrentTab(tab)
  }

  const { i18n } = useTranslation()
  const translationObject = i18n.getDataByLanguage(i18n.language)
  const multiLangObj = translationObject?.translation?.meetingRoomsReservationManagement

  return (
    <>
      <main>
        <div className="container p-3 mb-3">
          <div>
            <div>Meeting Room Reservation Status</div>
            <div>
              <CButton onClick={() => alert('WIP')}>{multiLangObj?.btnBookMeetingRooms}</CButton>
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
      </main>
    </>
  )
}

export default MeetingRoomsReservationStatus
