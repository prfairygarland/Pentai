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
import './PollManagement.scss'
import DatePicker from 'react-date-picker'
import { enqueueSnackbar } from 'notistack'

const PollManagement = ({ isPollOpen, setModal, pollModifyData = '', changePollDataHandle }) => {
  const [options, setOptions] = useState(['', ''])
  const [pollTitle, setPollTitle] = useState('')
  const [isNoOfParticipationChecked, setIsNoOfParticipationChecked] = useState(false)
  const [isAllowSecretVotingChecked, setIsAllowSecretVotingChecked] = useState(false)
  const [noOfParticipants, setNoOfParticipants] = useState(1)
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
    setPollTitle('')
    setOptions(['', ''])
    setIsAllowSecretVotingChecked(false)
    setIsNoOfParticipationChecked(false)
    setNoOfParticipants(1)
    setDeadlineDate('')
    setSelectedHours('00')
    setSelectedMins('00')
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
    if (isNoOfParticipationChecked) {
      setNoOfParticipants(2)
    } else {
      setNoOfParticipants(1)
    }
  }

  const addNewOptionHandler = () => {
    if (options.length < 10) {
      const modifiedOptions = [...options]
      modifiedOptions.push('')
      setOptions(modifiedOptions)
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
    if (pollTitle.trim() === '') {
      enqueueSnackbar('Please enter poll title', { variant: 'error' })
      return
    }
    if (options.some((opt) => opt.trim() === '')) {
      enqueueSnackbar('Options cannot be empty - Empty space(s) not allowed', { variant: 'error' })
      return
    }
    const pollData = {
      pollEnabled: true,
      pollTitle: pollTitle,
      pollAllowSecretVoting: isAllowSecretVotingChecked,
      pollMaxSelections: noOfParticipants,
      pollEndTimestamp: selectedDate,
      pollDisplayOptions: options,
    }
    options.forEach((opt, index) => {
      pollData[`pollOptions[${index}]`] = opt
    })
    changePollDataHandle({ ...pollData })
    handleClose()
  }

  useEffect(() => {
    let currentDateTime
    if (pollModifyData?.pollEnabled) {
      currentDateTime = new Date(pollModifyData?.pollEndTimestamp)
      setPollTitle(pollModifyData?.pollTitle)
      setOptions(pollModifyData?.pollDisplayOptions.map((opt) => (opt?.title ? opt?.title : opt)))
      setIsNoOfParticipationChecked(pollModifyData?.pollMaxSelections > 1 ? true : false)
      setNoOfParticipants(pollModifyData?.pollMaxSelections)
      setIsAllowSecretVotingChecked(pollModifyData?.pollAllowSecretVoting)
    } else {
      currentDateTime = new Date()
    }
    let month = '' + (currentDateTime.getMonth() + 1),
      day = '' + currentDateTime.getDate(),
      year = currentDateTime.getFullYear()
    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day
    setDeadlineDate([year, month, day].join('-'))
    const hours = pollModifyData?.pollEnabled
      ? currentDateTime.getHours()
      : currentDateTime.getHours() + 1
    if (hours + 1 < 10) {
      setSelectedHours('0' + hours)
    } else {
      setSelectedHours(hours)
    }
    if (currentDateTime.getMinutes() < 10) {
      setSelectedMins('0' + currentDateTime.getMinutes())
    } else {
      setSelectedMins(currentDateTime.getMinutes())
    }
  }, [isPollOpen])
  return (
    <div>
      <CModal
        alignment="center"
        visible={isPollOpen}
        backdrop="static"
        onClose={() => handleClose()}
        aria-labelledby="LiveDemoExampleLabel"
      >
        <CModalHeader onClose={() => handleClose()}>
          <CModalTitle>Poll</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="txt-poll-title-container">
            <CFormInput
              type="text"
              placeholder="Enter Poll Title"
              className="txt-poll-title"
              name="pollTitle"
              value={pollTitle}
              onChange={(e) => {
                setPollTitle(e.target.value.substring(0, 62))
              }}
            />
            <span className="txt-byte-information">{pollTitle.length} / 62 byte</span>
          </div>
          {options &&
            options.map((opt, index) => (
              <div key={index} className="option-container">
                <CFormInput
                  type="text"
                  placeholder="Please Enter Option"
                  value={opt?.title ? opt?.title : opt}
                  onChange={(e) => {
                    setOptionValue(e.target.value.substring(0, 50), index)
                  }}
                />
                {index > 1 && <CButton onClick={() => removeOption(index)}>-</CButton>}
                <span className="txt-byte-information">
                  {options[index]?.title ? options[index]?.title?.length : options[index]?.length} /
                  50 byte
                </span>
              </div>
            ))}
          <CButton onClick={addNewOptionHandler}>Add New Option</CButton>
          <div className="no-of-participants-container">
            <div>
              <CFormCheck
                className="gap-2"
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
                className="gap-2"
                id="allowMultiSelect"
                label="Allow multi-select"
                checked={isNoOfParticipationChecked}
                onClick={handleIsNoOfParticipationChecked}
              />
            </div>
            <div className="participant-change-container minMaxBtn">
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
          <div className="d-flex justify-content-end">
            <CButton onClick={saveHandler}>Save</CButton>
          </div>
        </CModalBody>
      </CModal>
    </div>
  )
}

export default PollManagement
