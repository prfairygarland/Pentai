import {
  CButton,
  CFormCheck,
  CFormInput,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import './RecruitManagement.scss'
import DatePicker from 'react-date-picker'
import { enqueueSnackbar } from 'notistack'

const RecruitManagement = ({ isRecruitOpen, setModal, data = '', changeRecruitDataHandle }) => {
  const [isNoOfParticipationChecked, setIsNoOfParticipationChecked] = useState(false)
  const [isNoOfRaffleChecked, setIsNoOfRaffleChecked] = useState(false)
  const [noOfParticipants, setNoOfParticipants] = useState(1)
  const [noOfRaffle, setNoOfRaffle] = useState(1)
  const [deadlineDate, setDeadlineDate] = useState('')
  const [selectedHours, setSelectedHours] = useState('00')
  const [selectedMins, setSelectedMins] = useState('00')

  const handleDeadlineDate = (event) => {
    let d = new Date(event),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear()
    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day
    setDeadlineDate([year, month, day].join('-'))
  }

  const timeHandler = (e) => {
    setSelectedHours(e.target.value.split(':')[0])
    setSelectedMins(e.target.value.split(':')[1])
  }
  const handleClose = () => {
    setIsNoOfParticipationChecked(false)
    setIsNoOfRaffleChecked(false)
    setNoOfParticipants(1)
    setNoOfRaffle(1)
    setDeadlineDate('')
    setModal(false)
  }

  const handleIsNoOfParticipationChecked = () => {
    if (isNoOfParticipationChecked) {
      setNoOfParticipants(1)
    }
    setNoOfRaffle(1)
    setIsNoOfParticipationChecked(!isNoOfParticipationChecked)
  }

  const handleParticipantChange = (e) => {
    if (isNoOfParticipationChecked) {
      setNoOfRaffle(1)
      if ((noOfParticipants > 1 && e === -1) || (noOfParticipants < 999 && e === 1)) {
        setNoOfParticipants(Number(noOfParticipants + e))
      }
      if (
        e?.target?.value &&
        !isNaN(e.target.value) &&
        e.target.value.length > 0 &&
        e.target.value.length < 4 &&
        e?.target?.value > 0
      ) {
        setNoOfParticipants(Number(e.target.value))
      }
      if (e?.target?.value === '0' || (e?.target?.value === '' && e.target.value.length === 0)) {
        setNoOfParticipants(1)
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
      const maxLimit = isNoOfParticipationChecked ? noOfParticipants : 1000
      if ((noOfRaffle > 1 && e === -1) || (noOfRaffle < maxLimit - 1 && e === 1)) {
        setNoOfRaffle(Number(noOfRaffle + e))
      }
      if (
        e?.target?.value &&
        !isNaN(e.target.value) &&
        e.target.value.length > 0 &&
        e.target.value.length < 4 &&
        e?.target?.value > 0 &&
        e?.target?.value < maxLimit
      ) {
        setNoOfRaffle(Number(e.target.value))
      }
      if (e?.target?.value === '0' || (e?.target?.value === '' && e.target.value.length === 0)) {
        setNoOfRaffle(1)
      }
    }
  }

  const saveHandler = () => {
    const currentDate = new Date()
    const selectedDate = new Date(deadlineDate + 'T' + selectedHours + ':' + selectedMins)
    currentDate.setHours(currentDate.getHours() + 1)
    if (currentDate >= selectedDate) {
      enqueueSnackbar('The deadline can not be earlier than an hour from now', { variant: 'error' })
      return
    }
    changeRecruitDataHandle({
      recruitmentEnabled: true,
      recruitmentAllowRaffle: isNoOfRaffleChecked,
      recruitmentMaxParticipants: noOfParticipants,
      recruitmentDeadline: selectedDate,
      recruitmentRaffleMaxWinners: noOfRaffle,
    })
    handleClose()
  }

  useEffect(() => {
    let currentDateTime = new Date(),
      month = '' + (currentDateTime.getMonth() + 1),
      day = '' + currentDateTime.getDate(),
      year = currentDateTime.getFullYear()
    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day
    setDeadlineDate([year, month, day].join('-'))
    if (currentDateTime.getHours() + 1 < 10) {
      setSelectedHours('0' + (currentDateTime.getHours() + 1))
    } else {
      setSelectedHours(currentDateTime.getHours() + 1)
    }
    if (currentDateTime.getMinutes() < 10) {
      setSelectedMins('0' + currentDateTime.getMinutes())
    } else {
      setSelectedMins(currentDateTime.getMinutes())
    }
  }, [])
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
            <div className="deadline-label">
              Deadline<span className="mandatory-red-asterisk">*</span>
            </div>
            <div>
              <DatePicker
                value={deadlineDate}
                minDate={new Date()}
                onChange={(event) => handleDeadlineDate(event)}
              />
            </div>
            <div>
              <input
                type="time"
                name="time"
                id="time"
                className="time-picker"
                value={`${selectedHours}:${selectedMins}`}
                onChange={(e) => timeHandler(e)}
              />
            </div>
          </div>
          <div className="horizontal-line"></div>
          <div className="no-of-participants-container">
            <div>
              <CFormCheck
                id="noOfParticipants"
                label="Max no. of participants"
                checked={isNoOfParticipationChecked}
                onClick={handleIsNoOfParticipationChecked}
              />
            </div>
            <div className="participants-raffle-inc-dec">
              <CButton onClick={() => handleParticipantChange(-1)}>-</CButton>
              <CFormInput
                className="txt-participant-raffle"
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
                id="noOfRaffle"
                label="Raffle"
                checked={isNoOfRaffleChecked}
                onClick={handleIsNoOfRaffleChecked}
              />
            </div>
            <div>
              <div className="participants-raffle-inc-dec">
                <CButton onClick={() => handleRaffleChange(-1)}>-</CButton>
                <CFormInput
                  className="txt-participant-raffle"
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
