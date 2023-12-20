import { CFormCheck } from '@coreui/react'
import React from 'react'

const UserInformationSettings = () => {

  return (
    <section className="d-flex flex-row align-items-center">
      <div className='container'>
        <div className="row justify-content-center">
          <div className="row justify-content-center">
            <div className='col-md-12' >
              <div className="card p-2 mb-2">
                <h4>Account Settings
                </h4>
                <div className='card-body'>
                  <div className='formWraper'>
                    <div className="form-outline form-white  d-flex ">
                      <div className='formWrpLabel'>
                        <label className="fw-bolder ">Password Reset Cycle</label>
                      </div>
                      <div className='formWrpInpt'>
                        <div className='d-flex formradiogroup mb-2 gap-3' >
                          <CFormCheck type="radio" name="club_board" id="exampleRadios1" label="Every 6months" />
                          <CFormCheck type="radio" name="club_board" id="exampleRadios2" label="Every 3months" />
                        </div>
                      </div>
                    </div>

                    <div className="form-outline form-white  d-flex ">
                      <div className='formWrpLabel'>
                        <label className="fw-bolder ">Displayed Username Type</label>
                      </div>
                      <div className='formWrpInpt'>
                        <div className='d-flex formradiogroup mb-2 gap-3' >
                          <CFormCheck type="radio" name="club_board" id="exampleRadios1" label="Name" />
                          <CFormCheck type="radio" name="club_board" id="exampleRadios2" label="English Name" />
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
              <div className="card p-2 mt-5">
                <h4>User Privacy Settings
                </h4>
                <div className='card-body'>
                  <div className='formWraper'>
                    <div className="form-outline form-white  d-flex ">
                      <div className='formWrpLabel'>
                        <label className="fw-bolder ">Username Blocking</label>
                      </div>
                      <div className='formWrpInpt'>
                        <div className='d-flex formradiogroup mb-2 gap-3' >
                          <CFormCheck type="radio" name="club_board" id="exampleRadios1" label="No Blocking" />
                          <CFormCheck type="radio" name="club_board" id="exampleRadios2" label="Partial Blocking" />
                          <CFormCheck type="radio" name="club_board" id="exampleRadios2" label="Total Blocking" />
                        </div>
                      </div>
                    </div>

                    <div className="form-outline form-white  d-flex ">
                      <div className='formWrpLabel'>
                        <label className="fw-bolder ">Profile Photo Disclosure</label>

                      </div>
                      <div className='formWrpInpt'>
                        <div className='d-flex formradiogroup mb-2 gap-3' >
                          <CFormCheck type="radio" name="club_board" id="exampleRadios1" label="Grant" />
                          <CFormCheck type="radio" name="club_board" id="exampleRadios2" label="Deny" />
                        </div>
                      </div>
                    </div>

                    <div className="form-outline form-white  d-flex ">
                      <div className='formWrpLabel'>
                        <label className="fw-bolder ">User Profile Disclosure</label>

                      </div>
                      <div className='formWrpInpt'>
                        <div className='d-flex formradiogroup mb-2 gap-3' >
                          <CFormCheck type="radio" name="club_board" id="exampleRadios1" label="Grant" />
                          <CFormCheck type="radio" name="club_board" id="exampleRadios2" label="Deny" />
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
            <div className='px-4 mt-4 d-flex justify-content-center mb-3'>
              <button className="btn btn-primary btn-md  " type="submit">Save</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default UserInformationSettings

