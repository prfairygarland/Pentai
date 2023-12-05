import React from 'react'
import { Link,useNavigate } from 'react-router-dom'
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
import { LoginApi } from 'src/api/Api'
import { useState, useEffect, useCallback } from 'react'


const Login = () => {

  const navigate = useNavigate();

const [validCredential, setValidCredential] = useState(false)


  return (
    <>
      <section className="bg-light min-vh-100 d-flex flex-row align-items-center">
        <div className='container'>
          <div className="row justify-content-center">
            <h2 className='d-flex justify-content-center mb-5'>PTK APP Admin</h2>
            <div className="row justify-content-center">
              <div className='col-md-6' >
                <div className="card p-5">
                  <div className='card-body'>
                    <Formik
                      initialValues={{
                        username: '',
                        password: ''
                      }}
                      validationSchema={Yup.object().shape({
                        username: Yup.string().required('Please enter your ID'),
                        password: Yup.string().min(10).required('Please enter your Password')
                      })}
                      onSubmit={async (values, re) => {
                        LoginApi(values).then((data) => {
                          console.log('data =>', data.userdata);
                          if (data.status == 200) {
                            localStorage.setItem('token', data.token)
                            localStorage.setItem('userdata',JSON.stringify(data.userdata))
                            setValidCredential(false)
                             navigate("/Dashboard")
                          } else {
                            setValidCredential(true)
                          }
                        })
                      }}
                    >
                      {({ isValid, dirty, errors, touched, isValidating }) => (
                        <Form>
                          <h2>Login</h2>
                          <div className="form-outline form-white mb-4 mt-4">
                            <label className="fw-bolder">ID</label>
                            <Field placeholder="Enter your ID" autoComplete="id" type="text" id="typeEmailX" className="form-control form-control-lg mb-3" name="username"  />
                            {errors?.username && touched?.username ? (<p className='text-danger'>{errors?.username}</p>) : null}
                          </div>

                          <div className="form-outline form-white mb-4">
                            <label className="fw-bolder">Password</label>
                            <Field placeholder='Password' type="password" id="typePasswordX" className="form-control form-control-lg" name="password" />
                            {errors.password && touched.password ? (<p className='text-danger'>{errors.password}</p>) : null}
                            <div className='mt-2'>
                              <Field type="checkbox" name="termsAndConditions" />
                              <label style={{ marginLeft: '10px' }}>
                                ID remember
                              </label>
                              {errors.termsAndConditions && <p>{errors.termsAndConditions}</p>}
                            </div>
                          </div>
                          <div>
                            {validCredential &&  <p className='text-danger text-center'>Please check your ID and password</p>}

                            <button className="btn btn-primary btn-lg px-5 col-md-12" type="submit" disabled={!isValid || !dirty}>Login</button>
                            <p className='mt-3'>If you forgot your password, please mail to Administrator.(master@ptk.com)</p>
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
