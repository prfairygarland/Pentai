import { CButton, CFormCheck, CFormInput, CFormSelect, CFormTextarea } from '@coreui/react'
import React from 'react'
import DatePicker from 'react-date-picker'

const CreatePushNotificationRegistration = () => {
  return (
    <div>
        <div className='d-flex justify-content-between  pageTitle mb-3 pb-2'>
                <h2>Push Notification Registration</h2>
            </div>
            <div className="card-body mb-5 ">
                        <div className="formWraper">
                            <div className="form-outline form-white   d-flex ">
                                <div className="formWrpLabel">
                                    <label className="fw-bolder ">
                                        Classification<span className="mandatory-red-asterisk">*</span>
                                    </label>
                                </div>
                                <div className="formWrpInpt">
                                    <div className="d-flex formradiogroup mb-2 gap-3">
                                        <CFormSelect
                                            type="text"
                                            placeholder="Library"
                                            name="title"
                                            // value={data?.curationType}
                                            options={[
                                                { label: 'Select', value: '' },
                                                { label: 'General', value: 'general' },
                                                { label: 'Urgent', value: 'urgent' },
                                            ]}
                                            // onChange={handleCurationType}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="form-outline form-white   d-flex ">
                                <div className="formWrpLabel">
                                    <label className="fw-bolder ">
                                        Title<span className="mandatory-red-asterisk">*</span>
                                    </label>
                                </div>
                                <div className="formWrpInpt">
                                    <div className="d-flex formradiogroup mb-2 gap-3">
                                        <CFormInput
                                            type="text"
                                            placeholder=""
                                            name="code"
                                            // value={data.title}
                                            // onChange={handleChangeTitle}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="form-outline form-white  d-flex ">
                <div className="formWrpLabel">
                  <label className="fw-bolder ">
                   Content <span className="mandatory-red-asterisk">*</span>
                  </label>
                </div>
                <div className="formWrpInpt">
                  <div className="d-flex formradiogroup mb-2 gap-3">
                    <CFormTextarea
                      id="exampleFormControlTextarea1"
                      rows={3}
                    //   placeholder={multiLangObj?.enterContentHere}
                      name="content"
                    //   value={data.content}
                    //   onChange={(e) => handleInputChange(e)}
                    ></CFormTextarea>
                  </div>
                 
                </div>
              </div>
                            <div className="form-outline form-white  d-flex ">
                                <div className="formWrpLabel">
                                    <label className="fw-bolder ">
                                        Send Date<span className="mandatory-red-asterisk">*</span>
                                        </label>
                                </div>
                                <div className="d-flex w-100 p-2 gap-5 align-items-center">
                                    <CFormCheck 
                                    type='radio'
                                     label="immediate"
                                    />
                                    <div className='d-flex w-100 gap-2 align-items-center'>
                                        {/* <div> */}
                                            <CFormCheck 
                                             label="Send date"
                                             type='radio'
                                            />
                                            <DatePicker
                                                // value={bannerStartDate}
                                                // minDate={new Date()}
                                                // onChange={(event) => handleBannerStartDate(event)}
                                            />
                                            <input
                                                type="time"
                                                name="time"
                                                id="time"
                                                className="time-picker"
                                                // value={`${bannerStartHours}:${bannerStartMins}`}
                                                // onChange={(e) => bannerStartTimeHandler(e)}
                                            />
                                        {/* </div> */}

                                        -&nbsp;&nbsp;
                                        <div>
                                            <DatePicker
                                                // value={bannerEndDate}
                                                // minDate={new Date()}
                                                // onChange={(event) => handleBannerEndDate(event)}
                                            />

                                            <input
                                                type="time"
                                                name="time"
                                                id="time"
                                                className="time-picker"
                                                // value={`${bannerEndHours}:${bannerEndMins}`}
                                                // onChange={(e) => bannerEndTimeHandler(e)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex ">
                                <div className="form-outline form-white d-flex w-100">
                                    <div className="formWrpLabel">
                                        <label className="fw-bolder ">
                                            Target<span className="mandatory-red-asterisk">*</span>
                                            </label>
                                    </div>
                                    <div className='w-100 p-3'>

                                        <div style={{ width: '100%' }} className="push-notification-container  gap-3 p-0 pb-2">
                                            <CFormCheck
                                                type="radio"
                                                name="isVisible"
                                                // checked={data.noLink}
                                                // onChange={handleChangeNoLink}
                                                // value={data.noLink} 
                                                label="All users"
                                            />
                                         
                                        </div>
                                        <div  className='gap-3'>
                                            <div className='d-flex p-0 pb-2 gap-3'>
                                                <CFormCheck
                                                    type="radio"
                                                    name="isVisible"
                                                    label="Select target"
                                                />
                                                <CButton>Add</CButton>
                                                
                                            </div>
                                            <div className='w-100' style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                                <CFormInput type='text'  placeholder='Enter title' />
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                {/* <div className="form-outline form-white d-flex col-md-6">
                            </div> */}
                            </div>
                        </div>
                    </div>
    </div>
  )
}

export default CreatePushNotificationRegistration