import { CButton, CCol, CFormCheck, CFormInput } from '@coreui/react'
import React from 'react'

const ButtingBorad = () => {
  console.log('bulating board')
  return (
    <section>
      <div className='d-flex w-100'>
        <div className='w-50'>
          <div className='d-flex justify-content-end p-3 gap-2'>
            <CButton type="submit" className=" text-white bg-dark">
              Add
            </CButton>
            <CButton type="submit" className=" text-white bg-dark">
              Delete
            </CButton>
          </div>
          <div className='d-flex justify-content-center'>
            <CCol xs="auto" className='w-100' style={{ width: 'auto' }}>
              <CFormInput type="text" id="inputPassword2" placeholder="Search" />
            </CCol>
          </div>
          <div className='d-flex justify-content-center'>
            dragable list here
          </div>
        </div>
        <div className='w-75 p-4'>
          <div>
            <div className='w-100 bg-light p-3' style={{ height: '100vh' }}>
              <div>
                <div className='formWraper mt-3'>
                  <div className="form-outline d-flex w-100">
                    <div className='m-auto'>
                      <label className="fw-bolder p-2">Point settings</label>
                    </div>
                    <div className='formWrpInpt bg-white '>
                      <div className='d-flex'>
                        <CFormCheck id="flexCheckDefault" className='text-center' label="Points per post" />
                          <CFormInput type="number" className='h-25 w-25 ' id="inputPassword2" placeholder="0" /> <span>Points</span>
                       
                      </div>
                      <div className='d-flex '>
                        <CFormCheck id="flexCheckDefault" className='text-center' label="Points per comment" />
                          <CFormInput type="number" className='h-25 w-25 me-2' id="inputPassword2" placeholder="1~999" /> <span>Points</span>
                       
                      </div>
                    </div>
                  </div>
                </div>
                <div className='prohabitinfo mt-2'>
                  <p>※ Guide for setting points​</p>
                  <p>1. Points are only applied to bulletin board.​</p>
                  <p>2. If enabled, users will get set points per post, comment.​</p>
                  <p>3. If users delete their own post, comment they got points from, the points will be retrieved.</p>
                </div>
              </div>
              <div className=''>

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ButtingBorad
