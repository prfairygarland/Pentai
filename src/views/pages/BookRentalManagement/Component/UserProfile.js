import { CButton, CImage, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import ReactPaginate from 'react-paginate';
import { Link, Navigate, useParams } from 'react-router-dom'
import ReactTable from 'src/components/common/ReactTable';
import { getBookRental, getOprationClub, getSupplyRental, getUserDetail } from 'src/utils/Api';
import { ALL_CONSTANTS } from 'src/utils/config';
import { imageUrl } from '../BookRentalStatus';
import moment from 'moment/moment';

const UserProfile = ({ userInfoData }) => {

    const { id } = useParams();


    return (
        <div className=''>
            <section className="d-flex flex-row align-items-center">
               
                    <div className=" w-100">
                      
                       
                            <div className="card p-2">
                                <div className='card-body p-0'>
                                    <div className='formWraper'>
                                        <div className="form-outline form-white  d-flex ">
                                            <div className='formWrpLabel'>
                                                <label className="fw-bolder ">Profile Image</label>
                                            </div>
                                            <div className='formWrpInpt'>
                                            <div className='profileImg'>
                                                <CImage alt='NA' crossorigin="anonymous" src={imageUrl + userInfoData?.userImage} />
                                                </div>
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
                                                    <label className="fw-bolder ">EnglishName</label>
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
                                                <label className="fw-bolder ">Status</label>
                                            </div>
                                            <div className='formWrpInpt'>{userInfoData?.status == 1 ? 'Active' : 'Inactive'}
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

                                        <div className="form-outline d-flex w-100">
                                            <div className='formWrpLabel'>
                                                <label className="fw-bolder ">Rental Info.
                                                </label>
                                            </div>
                                            <div className='d-flex w-100'>
                                                <div className='w-100'>
                                                    <div className='formWrpLabel' style={{maxWidth:'100%'}}>
                                                        <label className="fw-bolder">Supply Rental :{userInfoData.suppliesCount ? userInfoData.suppliesCount : 'NA'} </label>
                                                    </div>
                                                    <div className="border-end px-1">
                                                        {userInfoData.suppliesInfo?.map((data, i) => (
                                                            <div className='d-flex justify-content-between py-1' key={i}>
                                                                <p className=''>{data.name ? data?.name : 'NA'}</p>
                                                                <p className='w-50 text-center'> {data?.startDateTime ? `${moment(data?.startDateTime).format("YYYY-MM-DD")} 
                                                                  ${moment(data?.endDateTime).format("YYYY-MM-DD")}`
                                                                    : 'NA'}</p>
                                                            </div>

                                                        ))}
                                                    </div>
                                                </div>
                                                <div className='w-100'>
                                                    <div className='formWrpLabel' style={{maxWidth:'100%'}}>
                                                        <label className="fw-bolder">Book Renatl :{userInfoData.bookRentalCount ? userInfoData.bookRentalCount : 'NA'} </label>
                                                    </div>
                                                    <div className="border-start px-1">
                                                        {userInfoData.bookRentalInfo?.map((data, i) => (
                                                            <div className='d-flex justify-content-between py-1' key={i}>
                                                                <p className='text-center w-50'>{data.title ? data?.title : 'NA'}</p>
                                                                <p className='w-50 text-center'> {data?.startDateTime ? `${moment(data?.startDateTime).format("YYYY-MM-DD")} ${moment(data?.endDateTime).format("YYYY-MM-DD")}`
                                                                    : 'NA'}</p>
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
                
            </section>
        </div>
    )
}

export default UserProfile