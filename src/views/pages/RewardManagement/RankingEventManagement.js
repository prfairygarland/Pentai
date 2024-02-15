import React from 'react'
import { CButton } from '@coreui/react'
import { useNavigate } from 'react-router-dom'

const RankingEventManagement = () => {
  const navigate = useNavigate()
  const registrationHandler = () => {
    navigate('../RankingEventRegistration')
  }
  return (
    <>
      <div>
        <CButton className="btn-success" onClick={registrationHandler}>
          Registration
        </CButton>
      </div>
      <div>Listing</div>
    </>
  )
}

export default RankingEventManagement
