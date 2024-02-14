import { cilMenu } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CButton, CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle, CFormCheck, CFormSelect, CModal } from '@coreui/react'
import moment from 'moment/moment';
import React, { useMemo, useState } from 'react'
import { useEffect } from 'react';
import DatePicker from 'react-date-picker';
import ReactPaginate from 'react-paginate';
import { useNavigate } from 'react-router-dom';
import Loader from 'src/components/common/Loader';
import ReactTable from 'src/components/common/ReactTable';
import { getApi } from 'src/utils/Api';

const PushNotificationManagement = () => {

  const [isLoading, setIsLoading] = useState(false)
  const [pushNotificationList, setPushNotificationList] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  const [itemsPerPage, setItemPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [searchFilter, setSearchFilter] = useState(0)
  const [filterData, setFilterData] = useState({
    title: '',
    classification: '',
    status: '',
    startDate: '',
    endDate: ''
  })

  const navigate = useNavigate()

  const perPageValue = [
    { label: '10', value: 10 },
    { label: '30', value: 30 },
    { label: '50', value: 50 },
    { label: '100', value: 100 }

  ]

  const Classification = [
    { label: 'All', value: '' },
    { label: 'General', value: 'general' },
    { label: 'Urgent', value: 'urgent' }
  ]

  const Status = [
    { label: 'All', value: '' },
    { label: 'Stand By', value: 'standBy' },
    { label: 'confirmed', value: 'confirmed' },
    { label: 'Cancelled', value: 'cancelled' }
  ]

  const handleTitleChange = (event) => {
    setFilterData((prev) => {
      return {
        ...prev,
        title: event.target.value
      }
    })
  }

  const handleClassificationChange = (event) => {
    setFilterData((prev) => {
      return {
        ...prev,
        classification: event.target.value
      }
    })
  }

  const handleStatusChange = (event) => {
    setFilterData((prev) => {
      return {
        ...prev,
        status: event.target.value
      }
    })
  }


  const handleStartdateChange = (event) => {
    setFilterData((prev) => {
      return {
        ...prev,
        startDate: event
      }
    })
  }

  const handleEnddateChange = (event) => {
    setFilterData((prev) => {
      return {
        ...prev,
        endDate: event
      }
    })
  }






  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected)
  }

  const handleSelectionChange = () => {
    // setIsLoading(true)
  }



  const getPushNotificationList = async () => {
    let url = `http://192.168.9.175:3000/api/admin/Operation/pushNotificationList?pageNo=${currentPage + 1}&limit=${itemsPerPage}`

    if (filterData.classification) {
      url = url + `&classification=${filterData.classification}`
    }
    if (filterData.status) {
      url = url + `&status=${filterData.status}`
    }
    if (filterData.startDate) {
      url = url + `&startSendDate=${moment(filterData.startDate).format("YYYY-MM-DD")}`
    }
    if (filterData.endDate) {
      url = url + `&endSendDate=${moment(filterData.startDate).format("YYYY-MM-DD")}`
    }
    if (filterData.title) {
      url = url + `&title=${filterData.title}`
    }

    const response = await getApi(url)
    console.log('response::', response)
    if (response?.status === 200) {
      setPushNotificationList(response?.data)
      setTotalCount(response?.totalCount )
      setTotalPages(Math.ceil(response?.totalCount / Number(itemsPerPage)))
    }

    console.log('pushNotificationList', pushNotificationList)
  }


  console.log('filter', filterData)


  const SearchFilter = async () => {
    // let url = `http://192.168.9.175:3000/api/admin/Operation/pushNotificationList?pageNo=${currentPage + 1}&limit=${itemsPerPage}`

    // if (filterData.classification) {
    //   url = url + `&classification=${filterData.classification}`
    // }
    // if (filterData.status) {
    //   url = url + `&status=${filterData.status}`
    // }
    // if (filterData.startDate) {
    //   url = url + `&startSendDate=${moment(filterData.startDate).format("YYYY-MM-DD")}`
    // }
    // if (filterData.endDate) {
    //   url = url + `&endSendDate=${moment(filterData.startDate).format("YYYY-MM-DD")}`
    // }
    // if (filterData.title) {
    //   url = url + `&title=${filterData.title}`
    // }

    // const response = await getApi(url)
    // console.log('response::', response)
    // if (response?.status === 200) {
    //   setPushNotificationList(response?.data)
    //   setTotalPages(Math.ceil(100 / Number(itemsPerPage)))
    // }

    // getPushNotificationList()
    setSearchFilter((prev) => prev + 1)

  }

  useEffect(() => {
    getPushNotificationList()
  }, [itemsPerPage, currentPage, filterData.status])



  const columns = useMemo(() => [

    {
      Header: 'No',
      accessor: '',
      Cell: ({ row }) => {
        return currentPage * itemsPerPage + (row?.index + 1)
      }
    },
    {
      Header: 'Classification',
      accessor: '',
      Cell: ({ row }) =>
        <p className='text-center'>{row?.original?.classification}</p>

    },
    {
      Header: 'Title',
      accessor: 'title',
      Cell: ({ row }) => <p>{row?.original?.title}</p>
    },
    {
      Header: 'Send Date',
      accessor: '',
      Cell: ({ row }) => <p className='text-center'>{row?.original?.createdAt ? moment(row?.original?.createdAt).format('YYYY-MM-DD HH:mm') : '-'}</p>
    },
    {
      Header: 'Status',
      accessor: '',
      Cell: ({ row }) => <p className='text-center'>{row?.original?.status}</p>
    },
    {
      Header: 'Action',
      accessor: '',
      Cell: ({ row }) => <p className='text-center '><a className='mx-3 primTxt'>cancel</a></p>
    },
  ], [])

  return (
    <div>
      <div className='d-flex justify-content-between  pageTitle mb-3 pb-2'>
        <h2>Push Notification Management</h2>
        <CButton onClick={() => navigate('createPushNotificationRegistration')}>Create</CButton>
      </div>
      {isLoading && <Loader />} <div>
        <div className='container bg-light p-3 mb-3'>
          <div className='d-flex mb-3'>
            <div className="d-flex align-items-center me-5 ">
              <label className="fw-medium me-3 " style={{ 'white-space': 'nowrap' }}>
                Classification
              </label>
              <CFormSelect
                className="me-2"
                aria-label="Default select example"
                options={Classification}
                onChange={handleClassificationChange}
                value={filterData.classification}
              />
            </div>
            <div className='d-flex align-items-center'>
              <div className="d-flex align-items-center me-5 ">
                <label className="fw-medium me-3 " style={{ 'white-space': 'nowrap' }}>
                  Status
                </label>
                <CFormSelect
                  className="me-2"
                  aria-label="Default select example"
                  options={Status}
                  onChange={handleStatusChange}
                  value={filterData.status}
                />
              </div>
              <div className="d-flex align-items-center">
                <label className="me-3 fw-medium">Send Date</label>
                <div className="d-flex p-2 gap-3 ">
                  <DatePicker value={filterData.startDate} onChange={handleStartdateChange} />
                  <DatePicker value={filterData.endDate} onChange={handleEnddateChange} />
                </div>
              </div>
            </div>

          </div>
          <div className='d-flex  align-items-center justify-content-between  gap-3 pe-3'>
            <div className='d-flex  align-items-center gap-3 w-100'>
              <div className=''>
                <label>Title</label>
              </div>
              <div className="col-md-8">
                <div className="d-flex form-inline w-100">
                  <input className="form-control mr-sm-10 me-2" value={filterData.title} onChange={handleTitleChange} type="search" placeholder="Search" aria-label="Search" />
                </div>
              </div>
            </div>
            <CButton onClick={SearchFilter} className="btn btn-primary my-2 my-sm-0" type="submit" >Search</CButton>
          </div>
        </div>
        <div>
          <div className='d-flex justify-content-between align-items-center mb-3'>
            <p style={{ margin: 0 }}>Total : {totalCount}</p>
          </div>
        </div>
        <div>

          <ReactTable columns={columns} data={pushNotificationList} showCheckbox={false} totalCount={10} onSelectionChange={handleSelectionChange} />
          {pushNotificationList?.length > 0 &&
            <div className='d-flex w-100 justify-content-center my-3 gap-3'>
              <div className='d-flex gap-3'>
                <div className='userlist-pagination'>
                  <div className='userlist-pagination dataTables_paginate'>
                    <ReactPaginate
                      breakLabel={'...'}
                      marginPagesDisplayed={1}
                      previousLabel={<button>Previous</button>}
                      nextLabel={<button>Next</button>}
                      pageCount={totalPages}
                      onPageChange={handlePageChange}
                      forcePage={currentPage}
                      renderOnZeroPageCount={null}
                      pageRangeDisplayed={4}
                    />
                  </div>

                </div>
                <div className='d-flex align-items-center gap-2 '>
                  <label>Show</label>
                  <CFormSelect
                    className=''
                    aria-label=""
                    value={itemsPerPage}
                    options={perPageValue}
                    onChange={(event) => {
                      setItemPerPage(parseInt(event?.target?.value));
                      setCurrentPage(0)
                    }}
                  />
                  <label>List</label>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export default PushNotificationManagement