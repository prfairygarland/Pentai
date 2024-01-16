import { CButton, CImage, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import ReactPaginate from 'react-paginate';
import { Link, Navigate, useParams } from 'react-router-dom'
import ReactTable from 'src/components/common/ReactTable';
import { getBookRental, getOprationClub, getSupplyRental, getUserDetail } from 'src/utils/Api';
import { ALL_CONSTANTS } from 'src/utils/config';
import { imageUrl } from '../supplyRentalStatus';
import moment from 'moment/moment';

const SupplyRentalUserDetals = ({ userInfoData, type }) => {



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
                        <label className="fw-bolder ">Profile Image</label>
                      </div>
                      <div className='formWrpInpt'>
                        {userInfoData?.imageUrl != null ?
                          <CImage alt='NA' rounded crossorigin="anonymous" src={imageUrl + userInfoData?.userImage} width={150} height={150} />
                          : '-'
                        }
                        {/* <CImage alt='NA' rounded crossorigin="anonymous" src={imageUrl + userInfoData?.userImage} width={150} height={150} /> */}
                      </div>
                    </div>

                    <div className="form-outline form-white  d-flex ">
                      <div className='formWrpLabel'>
                        <label className="fw-bolder ">Employee No.</label>
                      </div>
                      <div className='formWrpInpt'>{userInfoData?.employeeCode ? userInfoData?.employeeCode : ''}</div>
                    </div>

                    <div className='d-flex col-md-12'>
                      <div className="form-outline form-white d-flex col-md-6">
                        <div className='formWrpLabel'>
                          <label className="fw-bolder ">Name</label>
                        </div>
                        <div className='formWrpInpt'>{userInfoData?.koreanName ? userInfoData?.koreanName : 'NA'}
                        </div>
                      </div>

                      <div className="form-outline form-white  d-flex  col-md-6">
                        <div className='formWrpLabel'>
                          <label className="fw-bolder ">English Name</label>
                        </div>
                        <div className='formWrpInpt'>
                          {userInfoData?.englishName ? userInfoData?.englishName : 'NA'}
                        </div>
                      </div>
                    </div>

                    <div className="form-outline form-white d-flex ">
                      <div className='formWrpLabel'>
                        <label className="fw-bolder ">Email</label>
                      </div>
                      <div className='formWrpInpt'>{userInfoData?.email ? userInfoData.email : 'NA='}
                      </div>
                    </div>

                    <div className='d-flex col-md-12'>
                      <div className="form-outline form-white d-flex col-md-6">
                        <div className='formWrpLabel'>
                          <label className="fw-bolder ">Company</label>
                        </div>
                        <div className='formWrpInpt'>{userInfoData?.companyName ? userInfoData?.companyName : 'NA'}
                        </div>
                      </div>
                      <div className="form-outline form-white  d-flex  col-md-6">
                        <div className='formWrpLabel'>
                          <label className="fw-bolder ">Division</label>
                        </div>
                        <div className='formWrpInpt'>
                          {userInfoData?.divisionName ? userInfoData?.divisionName : 'NA'}
                        </div>
                      </div>
                    </div>

                    <div className='d-flex col-md-12'>
                      <div className="form-outline form-white d-flex col-md-6">
                        <div className='formWrpLabel'>
                          <label className="fw-bolder ">Group</label>
                        </div>
                        <div className='formWrpInpt'>
                          {userInfoData?.groupName ? userInfoData?.groupName : 'NA'}
                        </div>
                      </div>
                      <div className="form-outline form-white  d-flex  col-md-6">
                        <div className='formWrpLabel'>
                          <label className="fw-bolder ">Team</label>
                        </div>
                        <div className='formWrpInpt'>
                          {userInfoData?.teamName ? userInfoData?.teamName : 'NA'}
                        </div>
                      </div>
                    </div>


                    <div className="form-outline form-white d-flex ">
                      <div className='formWrpLabel'>
                        <label className="fw-bolder ">Last Access
                        </label>
                      </div>
                      <div className='formWrpInpt'>
                        {userInfoData?.lastLoginAt ? userInfoData?.lastLoginAt : 'NA'}
                      </div>
                    </div>

                    <div className="form-outline d-flex">
                      <div className='formWrpLabel'>
                        <label className="fw-bolder ">Rental Info.
                        </label>
                      </div>
                      <div className='d-flex'>
                        <div className=''>
                          <div className='formWrpLabel'>
                            <label className="fw-bolder">Supply Rental :{userInfoData.suppliesCount ? userInfoData.suppliesCount : '0'} </label>
                          </div>
                          <div className="border-end px-1">
                            {userInfoData.suppliesInfo?.map((data, i) => (
                              <div className='d-flex justify-content-between py-1' key={i}>
                                <div className='d-flex gap-2'>
                                  <p className=''>{data.name ? data?.name : 'NA'}</p>
                                  <p>{data.itemNumber ? data?.itemNumber : 'NA'}</p>
                                </div>
                                <li className='w-50 text-center'> {data?.startDateTime ? `${moment(data?.startDateTime).format("YYYY-MM-DD")}
                                                                  ${moment(data?.endDateTime).format("YYYY-MM-DD")}`
                                  : 'NA'}</li>
                              </div>

                            ))}
                          </div>
                        </div>
                        <div className='    '>
                          <div className='formWrpLabel'>
                            <label className="fw-bolder">Book Rental :{userInfoData.bookRentalCount ? userInfoData.bookRentalCount : '0'} </label>
                          </div>
                          <div className="border-start px-1">
                            {userInfoData.bookRentalInfo?.map((data, i) => (
                              <div className='d-flex justify-content-between py-1' key={i}>
                                <div className='d-flex gap-2'>
                                  <p className='text-center w-50'>{data.title ? data?.title : 'NA'}</p>
                                  <p>{data.SIBNCode ? data?.SIBNCode : 'NA'}</p>
                                </div>
                                <li className='w-50 text-center'> {data?.startDateTime ? `${moment(data?.startDateTime).format("YYYY-MM-DD")} ${moment(data?.endDateTime).format("YYYY-MM-DD")}`
                                  : 'NA'}</li>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* </div> */}
          </div>
        </div>
      </section>
    </div>
  )
}

export default SupplyRentalUserDetals
