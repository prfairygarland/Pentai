import { CButton, CImage, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import ReactPaginate from 'react-paginate';
import { Link, Navigate, useParams } from 'react-router-dom'
import ReactTable from 'src/components/common/ReactTable';
import { getBookRental, getOprationClub, getSupplyRental, getUserDetail } from 'src/utils/Api';
import { ALL_CONSTANTS } from 'src/utils/config';
import { imageUrl } from '../supplyRentalStatus';
import moment from 'moment/moment';
import { useTranslation } from 'react-i18next';

const SupplyRentalUserDetals = ({ userInfoData, type }) => {

  const { t, i18n } = useTranslation();
  const translationObject = i18n.getDataByLanguage(i18n.language);
  const multiLang = translationObject?.translation?.supplyRentalManagement


  return (
    <div className='popMiddl'>

      <div className="row justify-content-center">
        {/* <div className="row justify-content-center"> */}
        <div className='col-md-12' >
          <div className="card p-2">
            <div className='card-body p-0 lableWidthMin'>
              <div className='formWraper'>
                <div className="form-outline form-white  d-flex ">
                  <div className='formWrpLabel'>
                    <label className="fw-bolder ">{multiLang?.profileImage}</label>
                  </div>
                  <div className='formWrpInpt'>
                    {userInfoData?.userImage != null ?
                      <CImage alt='NA' rounded crossorigin="anonymous" src={imageUrl + userInfoData?.userImage} width={150} height={150} />
                      : '-'
                    }
                    {/* <CImage alt='NA' rounded crossorigin="anonymous" src={imageUrl + userInfoData?.userImage} width={150} height={150} /> */}
                  </div>
                </div>

                <div className="form-outline form-white  d-flex ">
                  <div className='formWrpLabel'>
                    <label className="fw-bolder ">{multiLang?.employeeNo}</label>
                  </div>
                  <div className='formWrpInpt'>{userInfoData?.employeeCode ? userInfoData?.employeeCode : ''}</div>
                </div>

                <div className='d-flex col-md-12'>
                  <div className="form-outline form-white d-flex col-md-6">
                    <div className='formWrpLabel'>
                      <label className="fw-bolder ">{multiLang?.name}</label>
                    </div>
                    <div className='formWrpInpt'>{userInfoData?.koreanName ? userInfoData?.koreanName : 'NA'}
                    </div>
                  </div>

                  <div className="form-outline form-white  d-flex  col-md-6">
                    <div className='formWrpLabel'>
                      <label className="fw-bolder ">{multiLang?.englishName}</label>
                    </div>
                    <div className='formWrpInpt'>
                      {userInfoData?.englishName ? userInfoData?.englishName : 'NA'}
                    </div>
                  </div>
                </div>

                <div className="form-outline form-white d-flex ">
                  <div className='formWrpLabel'>
                    <label className="fw-bolder ">{multiLang?.email}</label>
                  </div>
                  <div className='formWrpInpt'>{userInfoData?.email ? userInfoData.email : 'NA='}
                  </div>
                </div>

                <div className='d-flex col-md-12'>
                  <div className="form-outline form-white d-flex col-md-6">
                    <div className='formWrpLabel'>
                      <label className="fw-bolder ">{multiLang?.company}</label>
                    </div>
                    <div className='formWrpInpt'>{userInfoData?.companyName ? userInfoData?.companyName : 'NA'}
                    </div>
                  </div>
                  <div className="form-outline form-white  d-flex  col-md-6">
                    <div className='formWrpLabel'>
                      <label className="fw-bolder ">{multiLang?.division}</label>
                    </div>
                    <div className='formWrpInpt'>
                      {userInfoData?.divisionName ? userInfoData?.divisionName : 'NA'}
                    </div>
                  </div>
                </div>

                <div className='d-flex col-md-12'>
                  <div className="form-outline form-white d-flex col-md-6">
                    <div className='formWrpLabel'>
                      <label className="fw-bolder ">{multiLang?.group}</label>
                    </div>
                    <div className='formWrpInpt'>
                      {userInfoData?.groupName ? userInfoData?.groupName : 'NA'}
                    </div>
                  </div>
                  <div className="form-outline form-white  d-flex  col-md-6">
                    <div className='formWrpLabel'>
                      <label className="fw-bolder ">{multiLang?.team}</label>
                    </div>
                    <div className='formWrpInpt'>
                      {userInfoData?.teamName ? userInfoData?.teamName : 'NA'}
                    </div>
                  </div>
                </div>


                <div className="form-outline form-white d-flex ">
                  <div className='formWrpLabel'>
                    <label className="fw-bolder ">{multiLang?.lastAccess}
                    </label>
                  </div>
                  <div className='formWrpInpt'>
                    {userInfoData?.lastLoginAt ? userInfoData?.lastLoginAt : 'NA'}
                  </div>
                </div>

                <div className="form-outline d-flex">
                  <div className='formWrpLabel'>
                    <label className="fw-bolder ">{multiLang?.rentalInfo}
                    </label>
                  </div>
                  <div className='d-flex'>
                    <div className='col-md-6'>
                      <div className='formWrpLabel' style={{ maxWidth: '100%' }}>
                        <label className="fw-bolder">{multiLang?.supplyRental} :{userInfoData.suppliesCount ? userInfoData.suppliesCount : '0'} </label>
                      </div>
                      <div className="border-end px-1">
                        {userInfoData.suppliesInfo?.map((data, i) => (
                          <div className='d-flex justify-content-between py-1 gap-2' key={i}>
                            <div className='d-flex w-50'>
                              <p >{data.name ? data?.name : 'NA'} {data.itemNumber ? data?.itemNumber : 'NA'}</p>
                            </div>
                            <span className='w-50'> {data?.startDateTime ? `${moment(data?.startDateTime).format("YYYY-MM-DD")}
                                                                  ${moment(data?.endDateTime).format("YYYY-MM-DD")}`
                              : 'NA'}</span>
                          </div>

                        ))}
                      </div>
                    </div>
                    <div className='col-md-6'>
                      <div className='formWrpLabel' style={{ maxWidth: '100%' }}>
                        <label className="fw-bolder">{multiLang?.bookRental} :{userInfoData.bookRentalCount ? userInfoData.bookRentalCount : '0'} </label>
                      </div>
                      <div className="border-start px-1">
                        {userInfoData.bookRentalInfo?.map((data, i) => (
                          <div className='d-flex justify-content-between py-1  gap-2' key={i}>
                            <div className='d-flex w-50'>
                              <p >{data.title ? data?.title : 'NA'} {data.SIBNCode ? data?.SIBNCode : 'NA'}</p>
                            </div>
                            <span className='w-50'> {data?.startDateTime ? `${moment(data?.startDateTime).format("YYYY-MM-DD")} ${moment(data?.endDateTime).format("YYYY-MM-DD")}`
                              : 'NA'}</span>
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
  )
}

export default SupplyRentalUserDetals
