import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormLabel,
  CInputGroup,
  CInputGroupText,
  CFormCheck,
  CRow,
  CTooltip
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilInfo } from '@coreui/icons'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { changePassWordApi } from 'src/utils/Api'
import { useState, useEffect, useCallback } from 'react'



const ChangePassword = () => {

  const navigate = useNavigate();

  const vars = {
    '--my-css-var': 10,
    '--my-another-css-var': "red",
    '--cui-tooltip-max-width': '300px',
  }

  const [showError, setError] = useState('')


  return (
    <>
      <section className="d-flex flex-row align-items-center">
        <div className='container'>
          <div className="row justify-content-center">
            <div className="row justify-content-center">
              <div className='col-md-12' >
                <div className="card p-2">
                  <div className='card-body'>
                    <Formik
                      initialValues={{
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                      }}
                      validationSchema={Yup.object().shape({
                        currentPassword: Yup.string().min(10).max(20).required("Please enter your password"),
                        newPassword: Yup.string().matches(/^(?=(?:.*[A-Z]){2})(?=(?:.*[a-z]){2})(?=(?:.*\d){2})(?=(?:.*[@$!%*?&#]){2})[A-Za-z\d@$!%*?&#]{10,}$/, 'Must meet password requirements')
                          .max(20, 'Password is too long')
                          .test('no-repeated-chars', 'Cannot repeat the same character or number more than 4 times', value => {
                            const repeatingCharsRegex = /(.)\1{3,}/;
                            return !repeatingCharsRegex.test(value);
                          })
                          .test('no-consecutive-chars', 'Cannot use more than four consecutive characters or numbers repeatedly', value => {
                            const consecutiveCharsRegex = /(.)(?=.*\1{3})/;
                            return !consecutiveCharsRegex.test(value);
                          }),
                        confirmPassword: Yup.string().required().oneOf([Yup.ref('newPassword')], "Password must match"),
                      })}
                      onSubmit={async (values, re) => {
                        setError('')
                        console.log('value =>', values);
                        changePassWordApi(values).then((data) => {
                          if (data.status == 200) {
                            navigate('/Login')
                            setError('')
                          } else if (data.status == 400) {
                            setError(data.msg)
                          } else if (data.status == 420) {
                            setError(data.msg)
                          } else {

                          }
                        }).catch((error) => {
                          console.log('error =>', error);
                        })
                      }}
                    >
                      {({ isValid, dirty, errors, touched, isValidating }) => (
                        <Form>
                          <div className='formWraper'>
                            <div className="form-outline form-white  d-flex ">
                              <div className='formWrpLabel'>
                                <label className="fw-bolder ">Current Password</label>
                              </div>
                              <div className='formWrpInpt'>
                                <Field placeholder='current password' type="password" id="typePasswordX" className="form-control form-control-md" name="currentPassword" />
                                {errors.currentPassword && touched.currentPassword ? (<p className='text-danger'>{errors.currentPassword}</p>) : null}
                              </div>
                            </div>

                            <div className="form-outline form-white  d-flex ">
                              <div className='formWrpLabel'>
                                <label className="fw-bolder ">New Password</label>
                                <CTooltip style={vars}
                                  content="- For two combinations of uppercase, lowercase, number, and special characters: at least 10 digits

                                            - For three combinations of uppercase, lowercase, number, and special characters: at least 8 digits

                                            - The same character or number cannot be repeated more than 4 digits.

                                            - Cannot use more than four consecutive characters or numbers repeatedly."
                                  placement="bottom"
                                >
                                  <CIcon icon={cilInfo} size="lg" />
                                </CTooltip>
                              </div>
                              <div className='formWrpInpt'>
                                <Field placeholder='new password' type="password" id="typePasswordX" className="form-control form-control-md" name="newPassword" />
                                {errors.newPassword && touched.newPassword ? (<p className='text-danger'>{errors.newPassword}</p>) : null}
                              </div>
                            </div>

                            <div className="form-outline form-white  d-flex">
                              <div className='formWrpLabel'>
                                <label className="fw-bolder ">Confirm new paswword</label>
                              </div>
                              <div className='formWrpInpt'>
                                <Field placeholder='confirm new password' type="password" id="typePasswordX" className="form-control form-control-md" name="confirmPassword" />
                                {errors.confirmPassword && touched.confirmPassword ? (<p className='text-danger'>{errors.confirmPassword}</p>) : null}
                              </div>
                            </div>
                          </div>
                          {showError && <p className='text-danger text-center'>{showError}</p>}
                          <div className='px-4 mt-4 d-flex justify-content-center'>
                            <button className="btn btn-primary btn-md  " type="submit" disabled={!isValid || !dirty}>Save</button>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default ChangePassword
