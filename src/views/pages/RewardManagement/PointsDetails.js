import { CButton, CFormCheck, CFormInput, CFormTextarea, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CNav, CNavItem, CNavLink } from '@coreui/react';
import moment from 'moment';
import { enqueueSnackbar } from 'notistack';
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import DatePicker from 'react-date-picker';
import { useTranslation } from 'react-i18next';
import ReactPaginate from 'react-paginate';
import { NavLink, useLocation } from 'react-router-dom';
import Loader from 'src/components/common/Loader';
import ReactTable from 'src/components/common/ReactTable';
import { getApi, postApi } from 'src/utils/Api';
import { API_ENDPOINT } from 'src/utils/config';

const PointsDetails = () => {

  const initialData = {
    startDate: '',
    endDate: ''
  }

  const { t, i18n } = useTranslation();
  const translationObject = i18n.getDataByLanguage(i18n.language);
  const multiLang = translationObject?.translation?.PointDetails
  const [isLoading, setIsLoading] = useState(false);
  const [visible, setVisible] = useState(false)
  const [reason, setReason] = useState('')
  const [points, setPoints] = useState(null);
  const [type, setType] = useState(true)
  const [pointId, setPointId] = useState();
  const location = useLocation()
  const [userData, setUserData] = useState([])
  const [filterData, setFilterData] = useState(initialData)
  const [activeTab, setActiveTab] = useState('');
  const [pointHistoryData, setPointHistory] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)

  useEffect(() => {
    setPointId(location?.state?.pointId)
    getPointDetails()
  }, [])

  useEffect(() => {
    getPointHistory()
  }, [activeTab, filterData.startDate, filterData.endDate, currentPage])

  const columns = useMemo(() => [
    {
      Header: multiLang?.E_mail,
      accessor: 'time',
      Cell: ({ row }) => <p>{row.original.time ? moment(row.original.time).format('YYYY-MM-DD HH:mm:ss') : '-'}</p>
    },
    {
      Header: multiLang?.add,
      accessor: 'totalCredits',
      Cell: ({ row }) => <p>{row.original.totalCredits ? row.original.totalCredits : '-'}</p>
    },
    {
      Header: multiLang?.deduct,
      accessor: 'totalDebits',
      Cell: ({ row }) => <p>{row.original.totalDebits ? row.original.totalDebits : '-'}</p>

    },
    {
      Header: multiLang?.point,
      accessor: 'totalPoints',
      Cell: ({ row }) => <p>{row.original.totalPoints ? row.original.totalPoints : '-'}</p>
    },
    {
      Header: multiLang?.activity,
      accessor: 'activityName',
      Cell: ({ row }) => <p>{row.original.activityName ? row.original.activityName : '-'}</p>
    },
    {
      Header: multiLang?.reason,
      accessor: 'reason',
      Cell: ({ row }) => <p>{row.original.reason ? row.original.reason : '-'}</p>
    },
  ], [currentPage, t])

  const getPointHistory = async () => {
    setIsLoading(true)
    try {
      let url = API_ENDPOINT.pointHistory + `?id=${location?.state?.pointId}&pageNo=${currentPage + 1}`

      if (filterData?.startDate) {
        url = url + `&startDate=${moment(filterData?.startDate).add(1, 'd').toISOString().split('T')[0] + `T00:00:00.000Z`}`
      }

      if (filterData?.endDate) {
        url = url + `&endDate=${moment(filterData?.endDate).add(1, 'd').toISOString().split('T')[0] + `T23:59:59.000Z`}`
      }

      if (activeTab !== '') {
        url = url + `&type=${activeTab}`
      }

      const response = await getApi(url)
      console.log('data get =>', response);
      if (response?.status === 201) {
        setPointHistory(response.data)
        setTotalPages(Math.ceil(response.totalCount / Number(5)));
        setIsLoading(false)
      } else {

        setIsLoading(false)
      }
    } catch (error) {
      setIsLoading(false)
      console.log(error)
    }
  }

  const handleSelectionChange = useCallback((selectedRowsIds) => {
  }, []);

  const handleChange = (e) => {
    // Remove non-numeric characters
    const sanitizedValue = e.target.value.replace(/[^0-9]/g, '');
    setPoints(sanitizedValue);

  };

  const getPointDetails = async () => {
    console.log('point id =>', location?.state?.pointId);

    try {
      let url = API_ENDPOINT.getPointDetail + `?id=${location?.state?.pointId}`

      const response = await getApi(url)
      if (response.status == 201) {
        setUserData(response.data)
        setIsLoading(false)
      } else {
        setIsLoading(false)

      }

    } catch (error) {
      // setIsLoading(false)
    }
  }

  const resetValues = async () => {
    setPoints(null)
    setReason('')
    setType(true)
  }

  const validate = async () => {
    if (points === null) {
      enqueueSnackbar('Please enter points', { variant: 'error' })
    } else if (points === '') {
      enqueueSnackbar('Please enter points', { variant: 'error' })
    } else if (reason === '') {
      enqueueSnackbar('Please enter reason', { variant: 'error' })
    } else {
      handleChangePoint()
    }
  }


  const handleChangePoint = async () => {
    setIsLoading(true)
    let url = API_ENDPOINT.changePoint
    try {
      let data = {
        id: location?.state?.pointId,
        type: type === true ? 'add' : 'deduct',
        points: points,
        reason: reason
      }
      let responce = await postApi(url, data)

      console.log('res =>', responce);

      if (responce.status === 200) {
        resetValues()
        setVisible(false)
        enqueueSnackbar(multiLang?.successMsg, { variant: 'success' })
        setIsLoading(false)
        getPointDetails()
      } else {
        setVisible(false)
        setIsLoading(false)
        getPointDetails()
      }

    } catch {

    }
  }

  const handleTabClick = (value) => {
    console.log('value =>', value);
    setFilterData({
      startDate: '',
      endDate: ''
    })
    setActiveTab(value);
  };

  const handleStartDate = (event) => {
    if (event != null) {
      // const value = moment(event).format("YYYY-MM-DD")
      const value = event.toISOString()
      console.log('val', value)
      setFilterData((prev) => {
        return {
          ...prev,
          startDate: value
        }
      })
    } else {
      setFilterData((prev) => {
        return {
          ...prev,
          startDate: ''
        }
      })
    }
  }

  const handleEndDate = (event) => {

    if (event != null) {
      // const value = moment(event).format("YYYY-MM-DD")
      const value = event.toISOString()
      console.log('val', value)
      setFilterData((prev) => {
        return {
          ...prev,
          endDate: value
        }
      })
    } else {
      setFilterData((prev) => {
        return {
          ...prev,
          endDate: ''
        }
      })
    }
  }


  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected)
  }

  return (
    <div>
      {isLoading && <Loader />}
      <div className='pageTitle mb-3 pb-2'>
        <h2>{multiLang?.PointDetail}</h2>
      </div>
      <div className="formWraper">
        <div className="d-flex col-md-12">
          <div className="form-outline form-white d-flex col-md-6">
            <div className="formWrpLabel">
              <label className="fw-bolder ">{multiLang?.name}</label>
            </div>
            <div className="formWrpInpt">
              {userData[0]?.koreanName}
            </div>
          </div>
          <div className="form-outline form-white  d-flex  col-md-6">
            <div className="formWrpLabel">
              <label className="fw-bolder ">{multiLang?.English_Name}</label>
            </div>
            <div className="formWrpInpt">
              {userData[0]?.englishName}
            </div>
          </div>
        </div>
        <div className="d-flex col-md-12">
          <div className="form-outline form-white d-flex col-md-6">
            <div className="formWrpLabel">
              <label className="fw-bolder ">{multiLang?.E_mail}</label>
            </div>
            <div className="formWrpInpt">
              <p>
                {userData[0]?.email}
              </p>
            </div>
          </div>
          <div className="form-outline form-white  d-flex  col-md-6">
            <div className="formWrpLabel">
              <label className="fw-bolder ">{multiLang?.department}</label>
            </div>
            <div className="formWrpInpt">
              {userData[0]?.departmentHierarchy}
            </div>
          </div>
        </div>
        <div className="d-flex col-md-12">
          <div className="form-outline form-white d-flex col-md-6">
            <div className="formWrpLabel">
              <label className="fw-bolder ">{multiLang?.point}</label>
            </div>
            <div className="formWrpInpt d-flex gap-3 align-items-center">
              <p>{userData[0]?.availablePoints}</p>
              <CButton onClick={() => setVisible(!visible)}>{multiLang?.changePoints}</CButton>
            </div >
          </div >
        </div >
      </div >

      <div>
        <div className='pageTitle mt-5 mb-3 pb-2'>
          <h2>{multiLang?.pointHistory}</h2>
        </div>
        <div className='d-flex justify-content-between mb-2'>
          <div>
            <CNav variant="underline" className='d-flex gap3 tabNav'>
              <CNavItem >
                <CNavLink role='button' className={activeTab === '' ? 'active' : ''} onClick={() => handleTabClick('')}>
                  {multiLang?.all}
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink role='button' className={activeTab === 'add' ? 'active' : ''} onClick={() => handleTabClick('add')}>{multiLang?.add}</CNavLink>
              </CNavItem>
              <CNavItem >
                <CNavLink role='button' className={activeTab === 'deduct' ? 'active' : ''} onClick={() => handleTabClick('deduct')}>{multiLang?.deduct}</CNavLink>
              </CNavItem>
              <CNavItem >
                <DatePicker value={filterData.startDate} onChange={handleStartDate} />
              </CNavItem>
              <CNavItem >
                <DatePicker value={filterData.endDate} onChange={handleEndDate} />
              </CNavItem>
            </CNav>
          </div>
        </div>
        <div className='pointsDetailTable'>
          <ReactTable showCheckbox={false} columns={columns} data={pointHistoryData} totalCount={10} onSelectionChange={handleSelectionChange} />
        </div>
        <div>
          <div className='d-flex justify-content-center align-items-center mt-3 mb-2 gap-3'>
            {pointHistoryData.length > 0 &&
              <div className='d-flex gap-4'>
                <div className='userlist-pagination'>
                  <div className='userlist-pagination dataTables_paginate'>
                    <ReactPaginate
                      breakLabel={'...'}
                      marginPagesDisplayed={1}
                      previousLabel={<button>{multiLang?.previous}</button>}
                      nextLabel={<button>{multiLang?.next}</button>}
                      pageCount={totalPages}
                      onPageChange={handlePageChange}
                      forcePage={currentPage}
                      renderOnZeroPageCount={null}
                      pageRangeDisplayed={1}
                    />
                  </div>
                </div>
              </div>
            }

          </div>
        </div>
        <div className='d-flex justify-content-center mt-3 mb-3'>
          <NavLink to={'/PointManagement'}>
            <CButton className='btn-black'>List</CButton>
          </NavLink>
        </div>
      </div >

      <div>
        <CModal
          backdrop="static"
          visible={visible}
          onClose={() => (resetValues(), setVisible(false))}
          aria-labelledby="StaticBackdropExampleLabel"
        >
          <CModalHeader>
            <CModalTitle id="StaticBackdropExampleLabel">{multiLang?.changePoints}</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <div className="card-body">
              <div className="formWraper">
                <div className="form-outline form-white  d-flex ">
                  <div className="formWrpLabel">
                    <label className="fw-bolder ">
                      {multiLang?.type}
                    </label>
                  </div>
                  <div className="formWrpInpt">
                    <div className="formradiogroup mb-2 gap-3">
                      <div className="push-notification-container gap-3">
                        <CFormCheck type="radio" name="add" id="exampleRadios1" label={multiLang?.add}
                          defaultChecked={type}
                          onClick={() => setType(true)}
                          value={true}
                        />
                        <CFormCheck type="radio" name="deduct" id="exampleRadios2" label={multiLang?.deduct}
                          defaultChecked={!type}
                          onClick={() => setType(false)}
                          value={false}
                        />
                      </div>
                      <div className='d-flex align-items-center gap-3'>
                        <CFormInput
                          className='text-center'
                          type="text"
                          placeholder={multiLang?.enterNumber}
                          name='Points'
                          value={points}
                          onChange={(e) => handleChange(e)}
                        />
                        <p className='w-100'>{multiLang?.points}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form-outline form-white  d-flex ">
                  <div className="formWrpLabel">
                    <label className="fw-bolder ">
                      {multiLang?.reason}
                    </label>
                  </div>
                  <div className="formWrpInpt">
                    <div className="d-flex formradiogroup mb-2 gap-3">
                      <CFormTextarea
                        type="text"
                        placeholder="Enter reason"
                        name="title"
                        value={reason}
                        onChange={(e) => {
                          setReason(e.target.value.substring(0, 100))
                        }}
                      />
                      <span className="txt-byte-information justify-content-start">
                        {reason?.length} / 100
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CModalBody>
          <CModalFooter className='d-flex justify-content-center'>
            <CButton className='btn-black' onClick={() => (resetValues(), setVisible(false))}>
              {multiLang?.close}
            </CButton>
            <CButton color="primary" onClick={() => validate()}>{multiLang?.save}</CButton>
          </CModalFooter>
        </CModal >
      </div >
    </div >
  )
}

export default PointsDetails
