import { CNav, CNavItem, CNavLink } from '@coreui/react'
import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import LuckyDrawEventRegistration from './LuckyDrawEventRegistration'

const LuckyDrawEventDetails = () => {
  const [activeTab, setActiveTab] = useState('')
  const location = useLocation()

  const handleTabClick = (value) => {
    setActiveTab(value)
  }

  return (
    <>
      <div>
        <main>
          <div className="pageTitle mb-3 pb-2">
            <h2>Lucky Draw Event Details</h2>
          </div>
          <div className="d-flex justify-content-between mb-2">
            <div>
              <CNav variant="underline" className="d-flex gap3 tabNav">
                <CNavItem>
                  <CNavLink
                    role="button"
                    className={activeTab === '' ? 'active' : ''}
                    onClick={() => handleTabClick('')}
                  >
                    Event Details
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink
                    role="button"
                    className={activeTab === 'partiDetails' ? 'active' : ''}
                    onClick={() => handleTabClick('partiDetails')}
                  >
                    Participation Details
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink
                    role="button"
                    className={activeTab === 'winner' ? 'active' : ''}
                    onClick={() => handleTabClick('winner')}
                  >
                    Winner
                  </CNavLink>
                </CNavItem>
              </CNav>
            </div>
          </div>
        </main>
      </div>
      {activeTab === '' && <LuckyDrawEventRegistration eventId={location?.state?.eventId} />}
      {activeTab === 'partiDetails' && <>Participation</>}
      {activeTab === 'winner' && <>Winner</>}
    </>
  )
}

export default LuckyDrawEventDetails
