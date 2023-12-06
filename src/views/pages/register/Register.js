import React from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { Formik, Form, Field } from 'formik'


const Register = () => {
  return (
   <div>
      <section className="vh-100 bg-image">
        <div className="mask d-flex align-items-center h-100 gradient-custom-3">
          <div className="container h-50" style={{ marginTop: '-220px' }}>
            <div className="row d-flex justify-content-center align-items-center h-50">
              <div className="col-md-7">
                <div className="card" style={{ borderRadius: '15px' }}>
                  <div className="card-body p-5">
                    <h2 className="text-uppercase text-center mb-3" style={{marginTop:'-15px'}}>CREATE AN ACCOUNT</h2>
                    <Formik
                      initialValues={{
                        name: '',
                        username: '',
                        email: '',
                        mobileno: '',
                        address:'',
                        city:'',
                        state:'',
                        zipcode:'',
                        password: '',
                        conpassword: '',
                      }}
                      onSubmit={(values, re) => {
                        // same shape as initial values
                        console.log(values);

                      }}
                    >
                      {({ errors, touched, isValidating }) => (
                        <Form>
                          <div className="row">
                            <div className="col-md-6">
                              <div className="form-outline mb-3">
                                <label className="form-label mainLable" htmlFor="form3Example1cg">Name</label>
                                <Field type="text" id="form3Example1cg" className="form-control form-control-lg"
                                  name="name" />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-outline mb-3">
                                <label className="form-label mainLable" htmlFor="form3Example3cg">Username</label>
                                <Field type="text" id="form3Example3cg" className="form-control form-control-lg"
                                  name="username" />
                              </div>
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-6">
                              <div className="form-outline mb-3">
                                <label className="form-label mainLable" htmlFor="form3Example3cg">Email</label>
                                <Field type="text" id="form3Example3cg" className="form-control form-control-lg"
                                  name="email" />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-outline mb-3">
                                <label className="form-label mainLable" htmlFor="form3Example3cg">Mobile number</label>
                                <div className='input-group inputNew'>
                                  <div className="input-group-prepend d-flex">
                                    <span className="input-group-text numClass" id="basic-addon1">+ 91</span>
                                    <Field type="tel" id="form3Example3cg" className="form-control form-control-lg testMob"
                                      name="mobileno" />
                                  </div>
                                </div>


                              </div>
                            </div>

                          </div>
                          <div className="row">
                            <div className="col-md-12 mb-3">
                              <label htmlFor="validationTooltip03" className='mainLable'>Address</label>
                              <Field as="textarea" type="text" className="form-control" id="validationTooltip03" name='address' />
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-6 mb-3">
                              <label htmlFor="validationTooltip03" className='mainLable'>City</label>
                              <Field type="text" className="form-control" id="validationTooltip03" name='city' />
                              {errors.city && touched.city ? (<p className='error mainLable'>{errors.city}</p>) : null}
                            </div>
                            <div className="col-md-3 mb-3">
                              <label htmlFor="validationTooltip04" className='mainLable'>State</label>
                              <Field type="text" className="form-control" id="validationTooltip04" name='state' />
                            </div>
                            <div className="col-md-3 mb-3">
                              <label htmlFor="validationTooltip05" className='mainLable'>Zip</label>
                              <Field type="text" className="form-control" id="validationTooltip05" name='zipcode' />
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-6">
                              <div className="form-outline mb-3">
                                <label className="form-label mainLable" htmlFor="form3Example4cg">Password</label>
                                {/* <div className="d-flex"> */}
                                <Field id="form3Example4cg" className="form-control form-control-lg"
                                  minLength="4" name="password" />
                                {/* <FontAwesomeIcon id="pass" icon={faEye} /> */}
                                {/* </div> */}

                              </div>
                            </div>

                            <div className="col-md-6">
                              <div className="form-outline mb-3">
                                <label className="form-label mainLable" htmlFor="form3Example4cg">Confirm Password</label>
                                {/* <div className="d-flex"> */}
                                <Field id="form3Example4cg" className="form-control form-control-lg"
                                  minLength="4" name="conpassword" />
                                {/* <FontAwesomeIcon id="pass" icon={faEye} /> */}
                                {/* </div> */}
                              </div>
                            </div>
                          </div>



                          <div className="d-flex justify-content-center">
                            <button type="submit"
                              className="btn btn-success btn-block btn-lg gradient-custom-4 text-body">Register</button>
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
    </div>
  )
}

export default Register
