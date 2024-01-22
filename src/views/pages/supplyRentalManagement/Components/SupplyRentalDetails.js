import { CButton, CFormCheck, CFormTextarea, CImage, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import ReactPaginate from 'react-paginate';
import { Link, Navigate, useParams } from 'react-router-dom'
import ReactTable from 'src/components/common/ReactTable';
import { getBookRental, getOprationClub, getSupplyRental, getUserDetail, putApi } from 'src/utils/Api';
import { ALL_CONSTANTS, API_ENDPOINT } from 'src/utils/config';
import { imageUrl } from '../supplyRentalStatus';
import moment from 'moment/moment';

const SupplyRentalDetails = ({ endModal, RentalStatusData, setRentalStatusData, setUserInfoPopup, type }) => {
  const [name, setName] = useState('Ak')
  const [visible, setVisible] = useState(false)
  const [rentalVisible, setRentalVisible] = useState(false)
  const [returnVisible, setReturnVisible] = useState(false)
  const [selectedCheckbox, setSelectedCheckbox] = useState(RentalStatusData?.longTerm !== 'no' ? 'Rental' : 'Provide');
  const handleCheckboxChange = (checkbox) => {
    // Update the selected checkbox state
    setSelectedCheckbox(checkbox);
  };


  const handleChangeRentalStatus = () => {
    setRentalStatusData((prev) => {
      return {
        ...prev,
        status: 'returned'
      }
    })
    setVisible(false)
    // setUserInfoPopup(false)
  }

  const confirmSupply = async (type, id) => {

    const formData = new FormData()

    let data = {
      id: id,
      status: type
    }

    const res = await putApi(API_ENDPOINT.get_supply_confirm, data)

    // const res = await putApi('http://192.168.10.46:3000/admin/supplies/rental/requestConfirm', data)


    if (res.status === 200) {
      endModal(false)
    } else {
      endModal(false)
    }


  }


  return (
    <div className=''>
      <section className="d-flex flex-row align-items-center">
        <div className='container'>
          <div className="row justify-content-center">
            {/* <div className="row justify-content-center"> */}
            <div className='col-md-12' >
              <div className="card p-2">
                <div className='card-body p-0'>
                  <div className='formWraper'>
                    <div className="form-outline form-white  d-flex ">

                      <div className='formWrpLabel'>
                        <label className="fw-bolder ">item Image</label>
                      </div>

                      <div className='formWrpInpt'>
                        <CImage alt='NA' rounded src={RentalStatusData?.image} width={150} height={150} />
                      </div>
                    </div>

                    <div className="form-outline form-white  d-flex ">
                      <div className='formWrpLabel'>
                        <label className="fw-bolder ">Supply Type</label>
                      </div>
                      <div className='formWrpInpt'>{RentalStatusData?.supplyType ? RentalStatusData?.supplyType : '-'}</div>
                    </div>

                    <div className='d-flex col-md-12'>
                      <div className="form-outline form-white d-flex col-md-6">
                        <div className='formWrpLabel'>
                          <label className="fw-bolder ">Model Name</label>
                        </div>
                        <div className='formWrpInpt'>{RentalStatusData?.modelName ? RentalStatusData?.modelName : 'NA'}
                        </div>
                      </div>
                      <div className="form-outline form-white  d-flex  col-md-6">
                        <div className='formWrpLabel'>
                          <label className="fw-bolder ">Item Number</label>
                        </div>
                        <div className='formWrpInpt'>
                          {RentalStatusData?.itemNumber ? RentalStatusData?.itemNumber : 'NA'}
                        </div>
                      </div>
                    </div>

                    <div className="form-outline form-white  d-flex ">
                      <div className='formWrpLabel'>
                        <label className="fw-bolder ">User Name</label>
                      </div>
                      <div className='formWrpInpt'>{RentalStatusData?.userName ? RentalStatusData?.userName : '-'}</div>
                    </div>





                    <div className='d-flex col-md-12'>
                      <div className="form-outline form-white d-flex col-md-6">
                        <div className='formWrpLabel'>
                          <label className="fw-bolder ">Rental Duration</label>
                        </div>
                        <div className='formWrpInpt'>{`${moment(RentalStatusData?.startDateTime).format("YYYY-MM-DD")}-${moment(RentalStatusData?.endDateTime).format("YYYY-MM-DD")}`}
                        </div>
                      </div>
                      <div className="form-outline form-white  d-flex  col-md-6">
                        <div className='formWrpLabel'>
                          <label className="fw-bolder ">Requested Rental week</label>
                        </div>
                        {RentalStatusData?.longTerm !== 'yes' &&
                          <div className='formWrpInpt'>
                            {RentalStatusData?.weeksDifference ? RentalStatusData?.weeksDifference : 'NA'}
                          </div>
                        }
                      </div>
                    </div>

                    <div className="form-outline form-white d-flex ">
                      <div className='formWrpLabel'>
                        <label className="fw-bolder ">Rental status</label>
                      </div>
                      <div className='formWrpInpt'>{RentalStatusData?.rentalStatus ? RentalStatusData?.rentalStatus : 'NA'}
                      </div>
                    </div>

                    <div className='d-flex col-md-12'>
                      <div className="form-outline form-white d-flex col-md-6">
                        <div className='formWrpLabel'>
                          <label className="fw-bolder ">Rental Request
                            Time</label>
                        </div>
                        <div className='formWrpInpt'>
                          {RentalStatusData?.startDateTime ? `${moment(RentalStatusData?.startDateTime).format("YYYY-MM-DD HH:mm:ss")}` : 'NA'}
                        </div>
                      </div>
                      <div className="form-outline form-white  d-flex  col-md-6">
                        <div className='formWrpLabel'>
                          <label className="fw-bolder ">Rental Confirmed
                            Time</label>
                        </div>
                        <div className='formWrpInpt'>
                          {RentalStatusData?.rentalConfirmDateTime ? `${moment(RentalStatusData?.rentalConfirmDateTime).format("YYYY-MM-DD HH:mm:ss")}` : '-'}
                        </div>
                      </div>
                    </div>

                    <div className='d-flex col-md-12'>
                      <div className="form-outline form-white d-flex col-md-6">
                        <div className='formWrpLabel'>
                          <label className="fw-bolder ">Return Request
                            Time</label>
                        </div>
                        <div className='formWrpInpt'>
                          {RentalStatusData?.returnRequestDateTime ? `${moment(RentalStatusData?.returnRequestDateTime).format("YYYY-MM-DD HH:mm:ss")}` : 'NA'}
                        </div>
                      </div>
                      <div className="form-outline form-white  d-flex  col-md-6">
                        <div className='formWrpLabel'>
                          <label className="fw-bolder ">Returned
                            Time</label>
                        </div>
                        <div className='formWrpInpt'>
                          {RentalStatusData?.returnDate ? `${moment(RentalStatusData?.returnDate).format("YYYY-MM-DD HH:mm:ss")}` : '-'}
                        </div>
                      </div>
                    </div>
                    <div className="form-outline form-white d-flex">
                      <div className='formWrpLabel'>
                        <label className="fw-bolder ">Reason remarks</label>
                      </div>
                      <div className='formWrpInpt clearfix d-flex'>
                        <CFormTextarea
                          id="exampleFormControlTextarea1"
                          rows={1}
                          value={RentalStatusData?.reasonRemark}
                        ></CFormTextarea>
                        <button disabled className='mx-2 px-3 py-2 rounded border-1 float-end'>Save</button>
                      </div>
                    </div>

                    <div className="form-outline form-white d-flex ">
                      <div className='formWrpLabel'>
                        <label className="fw-bolder ">Request as provided</label>
                      </div>
                      <div className='formWrpInpt'>{RentalStatusData?.rentalStatus ? RentalStatusData?.rentalStatus : 'NA'}
                      </div>
                    </div>



                    {RentalStatusData?.status === 'pending' &&
                      <div>
                        <div className="form-outline form-white d-flex justify-content-center">
                          <div className='p-3'>
                            <label className="fw-bolder">Rental Request Confirmation</label>
                          </div>
                        </div>
                        <div className="form-outline form-white d-flex">
                          <div className='formWrpLabel'>
                            <label className="fw-bolder ">Rental Request Confirmation</label>
                          </div>
                          <div className='formWrpInpt clearfix d-flex justify-content-between'>
                            <div className='d-flex formradiogroup mb-2 gap-3'>
                              <CFormCheck type="radio" name="club_board" id="exampleRadios1" label="Rental" checked={selectedCheckbox === 'Rental'} onChange={() => handleCheckboxChange('Rental')} />
                              <CFormCheck type="radio" name="club_board" id="exampleRadios2" label="Provide" checked={selectedCheckbox === 'Provide'} onChange={() => handleCheckboxChange('Provide')} />
                            </div>
                            <div>
                              <button className='mx-2 px-3 py-2 rounded border-1 float-end' onClick={() => setRentalVisible(!rentalVisible)}>confirm</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    }

                    {RentalStatusData?.status === 'returned' &&
                      <div className="form-outline form-white d-flex">
                        <div className='formWrpLabel'>
                          <label className="fw-bolder ">Return Request Confirmation</label>
                        </div>
                        <div className='formWrpInpt clearfix d-flex justify-content-end'>
                          <div className='d-flex formradiogroup mb-2 gap-3'>

                          </div>
                          <div>
                            <button className='mx-2 px-3 py-2 rounded border-1 float-end' onClick={() => setReturnVisible(!returnVisible)}>confirm</button>
                          </div>
                        </div>
                      </div>
                    }
                    {RentalStatusData?.status !== 'cancel' && RentalStatusData?.status !== 'handOver' &&
                      <div>
                        <div className="form-outline form-white d-flex justify-content-center">
                          <div className='p-3'>
                            <label className="fw-bolder">Change Rental status</label>
                          </div>
                        </div>
                        <div className="form-outline form-white d-flex">
                          <div className='formWrpLabel'>
                            <label className="fw-bolder ">End Rental</label>
                          </div>
                          <div className='formWrpInpt clearfix'>
                            <button onClick={() => setVisible(!visible)} className='mx-2 px-3 py-2 rounded border-1 float-end'>confirm</button>
                          </div>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              </div>
            </div>
            {/* </div> */}
            <CModal
              visible={rentalVisible}
              onClose={() => setRentalVisible(false)}
              aria-labelledby="LiveDemoExampleLabel"
            >
              <CModalHeader onClose={() => setRentalVisible(false)}>
                <CModalTitle id="LiveDemoExampleLabel">Rental Request Confirm</CModalTitle>
              </CModalHeader>
              <CModalBody className='text-center'>
                <p>The user requested the rental type as Provided. Are you sure you want to reject the request and confirm the rental type as Rental?
                </p>
              </CModalBody>
              <CModalFooter className='d-flex justify-content-center gap-md-4 border-0 '>
                <CButton className='px-4' color="primary" onClick={() => confirmSupply(selectedCheckbox, RentalStatusData.id)} >Yes</CButton>
                <CButton color="secondary" onClick={() => setRentalVisible(false)}>
                  Cancel
                </CButton>
              </CModalFooter>
            </CModal>
            <CModal
              visible={visible}
              onClose={() => setVisible(false)}
              aria-labelledby="LiveDemoExampleLabel"
            >
              <CModalHeader onClose={() => setVisible(false)}>
                <CModalTitle id="LiveDemoExampleLabel">Change Rental Status</CModalTitle>
              </CModalHeader>
              <CModalBody className='text-center'>
                <p>Are you sure you want to change the rental
                  status to Returned
                </p>
              </CModalBody>
              <CModalFooter className='d-flex justify-content-center gap-md-4 border-0 '>
                <CButton color="secondary" onClick={() => setVisible(false)}>
                  Cancel
                </CButton>
                <CButton className='px-4' color="primary" onClick={() => confirmSupply('Returned', RentalStatusData.id)}>Yes</CButton>
              </CModalFooter>
            </CModal>
            <CModal
              visible={returnVisible}
              onClose={() => setReturnVisible(false)}
              aria-labelledby="LiveDemoExampleLabel"
            >
              <CModalHeader onClose={() => setReturnVisible(false)}>
                <CModalTitle id="LiveDemoExampleLabel">Rental Request Confirm</CModalTitle>
              </CModalHeader>
              <CModalBody className='text-center'>
                <p>Are you sure?
                </p>
              </CModalBody>
              <CModalFooter className='d-flex justify-content-center gap-md-4 border-0 '>
                <CButton className='px-4' color="primary" onClick={() => confirmSupply('Returned', RentalStatusData.id)} >Yes</CButton>
                <CButton color="secondary" onClick={() => setReturnVisible(false)}>
                  Cancel
                </CButton>
              </CModalFooter>
            </CModal>
          </div>
        </div>
      </section >
    </div >
  )
}

export default SupplyRentalDetails
