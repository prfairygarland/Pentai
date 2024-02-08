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
  CTooltip,
} from '@coreui/react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { LoginApi, postApi } from 'src/utils/Api'
import { useState, useEffect, useCallback } from 'react'
import { API_ENDPOINT } from 'src/utils/config'
import Loader from 'src/components/common/Loader'
import { enqueueSnackbar } from 'notistack'
import CIcon from '@coreui/icons-react'
import { cilInfo } from '@coreui/icons'


const SixMonthPasswordChange = () => {

  const navigate = useNavigate();

  const [validCredential, setValidCredential] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setError] = useState('')


  const vars = {
    '--my-css-var': 10,
    '--my-another-css-var': "red",
    '--cui-tooltip-max-width': '300px',
  }

  return (
    <>
      {isLoading && <Loader />}
      <section className="bg-light min-vh-100 d-flex flex-row align-items-center">
        <div className='container'>
          <div className="row justify-content-center">
            <div className="row justify-content-center">
              <div className='col-md-5' >
                <div className="card p-2">
                  <div className='card-body'>
                    <Formik
                      initialValues={{
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                      }}
                      validationSchema={Yup.object().shape({
                        currentPassword: Yup.string().min(10).max(20).required("Please enter your current password"),
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
                        confirmPassword: Yup.string().required('Confirm Password is required field').oneOf([Yup.ref('newPassword')], "Password must match"),
                      })}
                      onSubmit={async (values, re) => {
                        setError('')
                        console.log('value =>', values);
                        setIsLoading(true)
                        try {
                          // const res = await postApi(API_ENDPOINT.change_password_api, values)

                          // if (res.data.status == 200) {
                          //   setIsLoading(false)
                          //   navigate('/Login')
                          //   setError('')
                          // } else if (res.data.status == 400) {
                          //   setIsLoading(false)
                          //   setError(res.data.msg)
                          // } else if (res.data.status == 420) {
                          //   setIsLoading(false)
                          //   setError(res.data.msg)
                          // } else {
                          //   setIsLoading(false)
                          // }
                        } catch (error) {
                          console.log(error)
                        }

                      }}
                    >
                      {({ isValid, dirty, errors, touched, isValidating }) => (
                        <Form>
                          <h3 className='logHead'>Change Password</h3>
                          <p>The password must be changed every six months.</p>
                          <div className="form-outline form-white mb-4 mt-4">
                            <label className="fw-bolder p-1">Current Password</label>
                            <Field placeholder="Enter your current password" autoComplete="id" type="password" id="typeEmailX" className="form-control form-control-md mb-3" name="currentPassword" />
                            {errors.currentPassword && touched.currentPassword ? (<p className='text-danger'>{errors.currentPassword}</p>) : null}
                          </div>

                          <div className="form-outline form-white mb-4">
                            <label className="fw-bolder p-1">New Password</label>
                            <CTooltip style={vars}
                              content="- For two combinations of uppercase, lowercase, number, and special characters: at least 10 digits

                                            - For three combinations of uppercase, lowercase, number, and special characters: at least 8 digits

                                            - The same character or number cannot be repeated more than 4 digits.

                                            - Cannot use more than four consecutive characters or numbers repeatedly."
                              placement="bottom"
                            >
                              <CIcon className='ms-1' icon={cilInfo} size="sm" />
                            </CTooltip>
                            <Field placeholder='Enter your new password' type="password" id="typePasswordX" className="form-control form-control-md" name="password" />
                            {errors.newPassword && touched.newPassword ? (<p className='text-danger'>{errors.newPassword}</p>) : null}

                          </div>
                          <div className="form-outline form-white mb-4 mt-4">
                            <label className="fw-bolder p-1">Confirm new paswword</label>
                            <Field placeholder="Re-enter your new password" autoComplete="id" type="password" id="typeEmailX" className="form-control form-control-md mb-3" name="confirmPassword" />
                            {errors.confirmPassword && touched.confirmPassword ? (<p className='text-danger'>{errors.confirmPassword}</p>) : null}
                          </div>
                          <div>

                            <button className="btn btn-primary btn-lg px-3 col-md-12" type="submit" disabled={!isValid || !dirty}>Update Password</button>

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

export default SixMonthPasswordChange
