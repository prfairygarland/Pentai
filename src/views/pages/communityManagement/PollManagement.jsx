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
import React, { useState } from 'react'
import './PollManagement.scss'
import DatePicker from 'react-date-picker'

const PollManagement = ({ isPollOpen, setModal, data = '', changePollDataHandle }) => {
  const defaultOptions = ['', '']
  const [options, setOptions] = useState(defaultOptions)
  const [pollTitle, setPollTitle] = useState('')
  const [isNoOfParticipationChecked, setIsNoOfParticipationChecked] = useState(false)
  const [isAllowSecretVotingChecked, setIsAllowSecretVotingChecked] = useState(false)
  const [noOfParticipants, setNoOfParticipants] = useState(1)
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
    setNoOfParticipants(1)
    setDeadlineDate('')
    setModal(false)
  }

  const handleIsNoOfParticipationChecked = () => {
    if (isNoOfParticipationChecked) {
      setNoOfParticipants(1)
    } else {
      setNoOfParticipants(2)
    }
    setIsNoOfParticipationChecked(!isNoOfParticipationChecked)
  }

  const handleParticipantChange = (e) => {
    if (isNoOfParticipationChecked) {
      if ((noOfParticipants > 2 && e === -1) || (noOfParticipants < options.length && e === 1)) {
        setNoOfParticipants(Number(noOfParticipants + e))
      }
      if (
        e?.target?.value &&
        !isNaN(e.target.value) &&
        e.target.value.length > 0 &&
        e.target.value.length < 3
      ) {
        setNoOfParticipants(Number(e.target.value))
      }
      if (e?.target?.value === '' && e.target.value.length === 0) {
        setNoOfParticipants(2)
      }
    }
  }

  const setOptionValue = (value, index) => {
    const availOptions = [...options]
    availOptions[index] = value
    setOptions(availOptions)
  }

  const removeOption = (index) => {
    const availOptions = [...options]
    availOptions.splice(index, 1)
    setOptions(availOptions)
  }

  const addNewOptionHandler = () => {
    if (options.length < 10) {
      const modifiedOptions = [...options]
      modifiedOptions.push('')
      setOptions(modifiedOptions)
    }
  }
  const saveHandler = () => {
    const date = new Date(deadlineDate + 'T' + selectedHours + ':' + selectedMins)
    const pollData = {
      pollEnabled: true,
      pollTitle: pollTitle,
      pollAllowSecretVoting: isAllowSecretVotingChecked,
      pollMaxSelections: noOfParticipants,
      pollEndTimestamp: date.toUTCString(),
    }
    options.forEach((opt, index) => {
      pollData[`pollOptions[${index}]`] = opt
    })
    changePollDataHandle({ ...pollData })
    handleClose()
  }
  return (
    <div>
      <CModal
        alignment="center"
        visible={isPollOpen}
        onClose={() => handleClose()}
        aria-labelledby="LiveDemoExampleLabel"
      >
        <CModalHeader onClose={() => handleClose()}>
          <CModalTitle>Poll</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div>
            <CFormInput
              type="text"
              placeholder="Enter Poll Title"
              name="pollTitle"
              value={pollTitle}
              onChange={(e) => {
                setPollTitle(e.target.value)
              }}
            />
          </div>
          {options &&
            options.map((opt, index) => (
              <div key={index} className="option-container">
                <CFormInput
                  type="text"
                  placeholder="Please Enter Option"
                  value={opt}
                  onChange={(e) => {
                    setOptionValue(e.target.value, index)
                  }}
                />
                {index > 1 && <CButton onClick={() => removeOption(index)}>-</CButton>}
              </div>
            ))}
          <CButton onClick={addNewOptionHandler}>Add New Option</CButton>
          <div className="no-of-participants-container">
            <div>
              <CFormCheck
                id="allowSecretVoting"
                label="Allow Secret Voting"
                checked={isAllowSecretVotingChecked}
                onClick={() => setIsAllowSecretVotingChecked(!isAllowSecretVotingChecked)}
              />
            </div>
          </div>
          <div className="no-of-participants-container">
            <div>
              <CFormCheck
                id="allowMultiSelect"
                label="Allow multi-select"
                checked={isNoOfParticipationChecked}
                onClick={handleIsNoOfParticipationChecked}
              />
            </div>
            <div className="participant-change-container">
              <CButton onClick={() => handleParticipantChange(-1)}>-</CButton>
              <CFormInput
                className="txt-participant-change"
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
          <div className="d-flex justify-content-end">
            <CButton onClick={saveHandler}>Save</CButton>
          </div>
        </CModalBody>
      </CModal>
    </div>
  )
}

export default PollManagement
