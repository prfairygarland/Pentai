import { CButton, CImage, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import ReactPaginate from 'react-paginate';
import { Link, Navigate, useParams } from 'react-router-dom'
import ReactTable from 'src/components/common/ReactTable';
import { getBookRental, getOprationClub, getSupplyRental, getUserDetail } from 'src/utils/Api';
import { ALL_CONSTANTS } from 'src/utils/config';
import { imageUrl } from '../BookRentalStatus';
import moment from 'moment/moment';

const RentalStatus = ({ RentalStatusData, setRentalStatusData, setUserInfoPopup, type }) => {
    const [name, setName] = useState('Ak')
    const [visible, setVisible] = useState(false)

    function myFunction() {
        setName('NA')
    }

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
                        {type === 'supplyRentDetalils' ?
                          <div className='formWrpLabel'>
                            <label className="fw-bolder ">item Image</label>
                          </div>
                          :
                          <div className='formWrpLabel'>
                            <label className="fw-bolder ">Book Cover Image</label>
                          </div>
                        }
                                            <div className='formWrpInpt'>
                                                { }
                                                <CImage alt='NA' rounded src={RentalStatusData?.image} width={150} height={150} />
                                            </div>
                                        </div>
                                        <div className='d-flex col-md-12'>
                                            <div className="form-outline form-white d-flex col-md-6">
                                                <div className='formWrpLabel'>
                                                    <label className="fw-bolder ">Book Genre</label>
                                                </div>
                                                <div className='formWrpInpt'>{RentalStatusData?.genreBane ? RentalStatusData?.genreBane : 'NA'}
                                                </div>
                                            </div>
                                            <div className="form-outline form-white  d-flex  col-md-6">
                                                <div className='formWrpLabel'>
                                                    <label className="fw-bolder ">Author</label>
                                                </div>
                                                <div className='formWrpInpt'>
                                                    {RentalStatusData?.author ? RentalStatusData?.author : 'NA'}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-outline form-white  d-flex ">
                                            <div className='formWrpLabel'>
                                                <label className="fw-bolder ">Book Title</label>
                                            </div>
                                            <div className='formWrpInpt'>{RentalStatusData?.title ? RentalStatusData?.title : ''}</div>
                                        </div>



                                        <div className="form-outline form-white d-flex ">
                                            <div className='formWrpLabel'>
                                                <label className="fw-bolder ">ISBN</label>
                                            </div>
                                            <div className='formWrpInpt'>{RentalStatusData?.SIBNCode ? RentalStatusData.SIBNCode : 'NA'}
                                            </div>
                                        </div>

                                        <div className="form-outline form-white d-flex ">
                                            <div className='formWrpLabel'>
                                                <label className="fw-bolder ">User Name</label>
                                            </div>
                                            <div className='formWrpInpt'>{RentalStatusData?.userName ? RentalStatusData.userName : 'NA'}
                                            </div>
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
                                                <div className='formWrpInpt'>
                                                    {RentalStatusData?.requestWeekRental ? RentalStatusData?.requestWeekRental : 'NA'}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-outline form-white d-flex ">
                                            <div className='formWrpLabel'>
                                                <label className="fw-bolder ">Rental status</label>
                                            </div>
                                            <div className='formWrpInpt'>{RentalStatusData?.status ? RentalStatusData?.status : 'NA'}
                                            </div>
                                        </div>

                                        <div className='d-flex col-md-12'>
                                            <div className="form-outline form-white d-flex col-md-6">
                                                <div className='formWrpLabel'>
                                                    <label className="fw-bolder ">Rental start Time</label>
                                                </div>
                                                <div className='formWrpInpt'>
                                                    {RentalStatusData?.startDateTime ? `${moment(RentalStatusData?.startDateTime).format("YYYY-MM-DD HH:mm:ss")}` : 'NA'}
                                                </div>
                                            </div>
                                            <div className="form-outline form-white  d-flex  col-md-6">
                                                <div className='formWrpLabel'>
                                                    <label className="fw-bolder ">Rental Extended Time</label>
                                                </div>
                                                <div className='formWrpInpt'>
                                                    {RentalStatusData?.endDateTime && RentalStatusData.isExtended === 'yes' ? `${moment(RentalStatusData?.endDateTime).format("YYYY-MM-DD HH:mm:ss")}` : '-'}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-outline form-white d-flex ">
                                            <div className='formWrpLabel'>
                                                <label className="fw-bolder ">Returned Time</label>
                                            </div>
                                            <div className='formWrpInpt'>{RentalStatusData?.returnDate ? `${moment(RentalStatusData?.returnDate).format("YYYY-MM-DD HH:mm:ss")}` : '-'}
                                            </div>
                                        </div>
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
                                </div>
                            </div>
                        </div>
                        {/* </div> */}

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
                                <CButton  color="secondary" onClick={() => setVisible(false)}>
                                    Cancel
                                </CButton>
                                <CButton className='px-4' color="primary" onClick={handleChangeRentalStatus}>Yes</CButton>
                            </CModalFooter>
                        </CModal>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default RentalStatus
