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
} from '@coreui/react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { LoginApi, postApi } from 'src/utils/Api'
import { useState, useEffect, useCallback } from 'react'
import { API_ENDPOINT } from 'src/utils/config'
import Loader from 'src/components/common/Loader'
import { enqueueSnackbar } from 'notistack'
import { useTranslation } from 'react-i18next'


const Login = () => {

  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const translationObject = i18n.getDataByLanguage(i18n.language);
  const multiLang = translationObject?.translation?.Login

  const [validCredential, setValidCredential] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  return (
    <>
      {isLoading && <Loader />}
      <section className="bg-light min-vh-100 d-flex flex-row align-items-center">
        <div className='container'>
          <div className="row justify-content-center">
            <h2 className='d-flex justify-content-center mb-3'>{multiLang?.PTK_APP_Admin}</h2>
            <div className="row justify-content-center">
              <div className='col-md-5' >
                <div className="card p-2">
                  <div className='card-body'>
                    <Formik
                      initialValues={{
                        username: '',
                        password: '',
                        remembermecheck: false
                      }}
                      validationSchema={Yup.object().shape({
                        username: Yup.string().required('Please enter your ID'),
                        password: Yup.string().min(10).required('Please enter your Password')
                      })}
                      onSubmit={async (values, re) => {
                        let value = {
                          username: values.username,
                          password: values.password
                        }
                        setIsLoading(true)
                        try {
                          const res = await postApi(API_ENDPOINT.login_api, value)
                          if (res.data.status == 200) {
                            if (values.remembermecheck == true) {
                              localStorage.setItem('token', res.data.token)
                              localStorage.setItem('userdata', JSON.stringify(res.data.userdata))
                              localStorage.setItem('roleWisePermission', JSON.stringify(res.data.rolePermissions))
                              setIsLoading(false)
                              setValidCredential(false)
                              navigate('../Dashboard', {
                                state: {
                                  enqueueSnackbarMsg: multiLang?.Login_succesfull,
                                  variant: 'success',
                                },
                              })
                              // navigate("/Dashboard")
                            } else {
                              sessionStorage.setItem('sessionToken', res.data.token)
                              sessionStorage.setItem('sessionUserdata', JSON.stringify(res.data.userdata))
                              sessionStorage.setItem('roleWisePermission', JSON.stringify(res.data.rolePermissions))
                              setIsLoading(false)
                              setValidCredential(false)
                              navigate('../Dashboard', {
                                state: {
                                  enqueueSnackbarMsg: multiLang?.Login_succesfull,
                                  variant: 'success',
                                },
                              })
                            }
                          } else {
                            setIsLoading(false)
                            setValidCredential(true)
                            enqueueSnackbar(`${res?.data?.errors[0]?.msg}`, { variant: 'error' })
                          }
                        } catch (error) {
                          setIsLoading(false)
                          console.log(error)
                        }
                      }}
                    >
                      {({ isValid, dirty, errors, touched, isValidating }) => (
                        <Form>
                          <h2 className='logHead'>{multiLang?.Login}</h2>
                          <div className="form-outline form-white mb-4 mt-4">
                            <label className="fw-bolder p-1">{multiLang?.ID}</label>
                            <Field placeholder="Enter your ID" autoComplete="id" type="text" id="typeEmailX" className="form-control form-control-md mb-3" name="username" />
                            {errors?.username && touched?.username ? (<p className='text-danger'>{errors?.username}</p>) : null}
                          </div>

                          <div className="form-outline form-white mb-4">
                            <label className="fw-bolder p-1">{multiLang?.Password}</label>
                            <Field placeholder='Enter your password' type="password" id="typePasswordX" className="form-control form-control-md" name="password" />
                            {errors.password && touched.password ? (<p className='text-danger'>{errors.password}</p>) : null}
                            <div className='mt-2'>
                              <Field type="checkbox" name="remembermecheck" />
                              <label style={{ marginLeft: '10px' }}>
                                {multiLang?.Remember_me}
                              </label>
                            </div>
                          </div>
                          <div>
                            {validCredential && <p className='text-danger text-center'>{multiLang?.Login_error}</p>}

                            <button className="btn btn-primary btn-lg px-3 col-md-12" type="submit" disabled={!isValid || !dirty}>{multiLang?.Login}</button>
                            <p className='mt-3 mb-0'>{multiLang?.Forget_password_instruction}</p>

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

export default Login
