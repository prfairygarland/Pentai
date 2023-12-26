import {
  CButton,
  CFormCheck,
  CFormInput,
  CFormSelect,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import './RecruitManagement.scss'
import DatePicker from 'react-date-picker'

const RecruitManagement = ({ isRecruitOpen, setModal, data = '', changeRecruitDataHandle }) => {
  const [isNoOfParticipationChecked, setIsNoOfParticipationChecked] = useState(false)
  const [isNoOfRaffleChecked, setIsNoOfRaffleChecked] = useState(false)
  const [noOfParticipants, setNoOfParticipants] = useState(1)
  const [noOfRaffle, setNoOfRaffle] = useState(1)
  const [deadlineDate, setDeadlineDate] = useState('')
  const [selectedHours, setSelectedHours] = useState('00')
  const [selectedMins, setSelectedMins] = useState('00')
  const hours = [
    '00',
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '20',
    '21',
    '22',
    '23',
  ]

  const mins = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55']

  const handleDeadlineDate = (event) => {
    let d = new Date(event),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear()
    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day
    setDeadlineDate([year, month, day].join('-'))
  }

  const handleClose = () => {
    setNoOfParticipants(0)
    setNoOfRaffle(0)
    setDeadlineDate('')
    setModal(false)
  }

  const handleIsNoOfParticipationChecked = () => {
    if (isNoOfParticipationChecked) {
      setNoOfParticipants(1)
    }
    setIsNoOfParticipationChecked(!isNoOfParticipationChecked)
  }

  const handleParticipantChange = (e) => {
    if (isNoOfParticipationChecked) {
      if ((noOfParticipants > 0 && e === -1) || (noOfParticipants < 999 && e === 1)) {
        setNoOfParticipants(Number(noOfParticipants + e))
      }
      if (
        e?.target?.value &&
        !isNaN(e.target.value) &&
        e.target.value.length > 0 &&
        e.target.value.length < 4
      ) {
        setNoOfParticipants(Number(e.target.value))
      }
      if (e?.target?.value === '' && e.target.value.length === 0) {
        setNoOfParticipants(0)
      }
    }
  }

  const handleIsNoOfRaffleChecked = () => {
    if (isNoOfRaffleChecked) {
      setNoOfRaffle(1)
    }
    setIsNoOfRaffleChecked(!isNoOfRaffleChecked)
  }
  const handleRaffleChange = (e) => {
    if (isNoOfRaffleChecked) {
      if ((noOfRaffle > 0 && e === -1) || (noOfRaffle < 999 && e === 1)) {
        setNoOfRaffle(Number(noOfRaffle + e))
      }
      if (
        e?.target?.value &&
        !isNaN(e.target.value) &&
        e.target.value.length > 0 &&
        e.target.value.length < 4
      ) {
        setNoOfRaffle(Number(e.target.value))
      }
      if (e?.target?.value === '' && e.target.value.length === 0) {
        setNoOfRaffle(0)
      }
    }
  }

  const saveHandler = () => {
    const date = new Date(deadlineDate + 'T' + selectedHours + ':' + selectedMins)
    changeRecruitDataHandle({
      recruitmentEnabled: true,
      recruitmentAllowRaffle: isNoOfRaffleChecked,
      recruitmentMaxParticipants: noOfParticipants,
      recruitmentDeadline: date.toUTCString(),
      recruitmentRaffleMaxWinners: noOfRaffle,
    })
    handleClose()
  }
  return (
    <div>
      <CModal
        alignment="center"
        visible={isRecruitOpen}
        onClose={() => handleClose()}
        aria-labelledby="LiveDemoExampleLabel"
      >
        <CModalHeader onClose={() => handleClose()}>
          <CModalTitle>Recruit</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="deadline-container">
            <div className="deadline-label">Deadline</div>
            <div>
              <DatePicker
                value={deadlineDate}
                minDate={new Date()}
                onChange={(event) => handleDeadlineDate(event)}
              />
            </div>
            <div>
              <CFormSelect
                size="sm"
                name="boardId"
                className="board-dropdown"
                onChange={(e) => {
                  setSelectedHours(e.target.value)
                }}
              >
                {hours.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </CFormSelect>
            </div>
            <div>
              <CFormSelect
                size="sm"
                name="boardId"
                className="board-dropdown"
                onChange={(e) => {
                  setSelectedMins(e.target.value)
                }}
              >
                {mins.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </CFormSelect>
            </div>
          </div>
          <div className="horizontal-line"></div>
          <div className="no-of-participants-container">
            <div>
              <CFormCheck
                id="flexCheckDefault"
                label="Max no. of participants"
                checked={isNoOfParticipationChecked}
                onClick={handleIsNoOfParticipationChecked}
              />
            </div>
            <div>
              <CButton onClick={() => handleParticipantChange(-1)}>-</CButton>
              <CFormInput
                disabled={!isNoOfParticipationChecked}
                type="text"
                placeholder=""
                name="title"
                value={noOfParticipants}
                onChange={(e) => {
                  handleParticipantChange(e)
                }}
              />
              <CButton onClick={() => handleParticipantChange(1)}>+</CButton>
            </div>
          </div>
          <div className="no-of-participants-container">
            <div>
              <CFormCheck
                id="flexCheckDefault"
                label="Raffle"
                checked={isNoOfRaffleChecked}
                onClick={handleIsNoOfRaffleChecked}
              />
            </div>
            <div>
              <div>
                <CButton onClick={() => handleRaffleChange(-1)}>-</CButton>
                <CFormInput
                  disabled={!isNoOfRaffleChecked}
                  type="text"
                  placeholder=""
                  name="title"
                  value={noOfRaffle}
                  onChange={(e) => {
                    handleRaffleChange(e)
                  }}
                />
                <CButton onClick={() => handleRaffleChange(1)}>+</CButton>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-end">
            <CButton onClick={saveHandler}>Save</CButton>
          </div>
        </CModalBody>
      </CModal>
    </div>
  )
}

export default RecruitManagement
