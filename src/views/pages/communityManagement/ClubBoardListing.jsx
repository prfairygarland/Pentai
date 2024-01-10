import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { API_ENDPOINT } from 'src/utils/config'
import { getApi } from 'src/utils/Api'
import * as icon from '@coreui/icons'
import {
  CButton,
  CFormInput,
  CFormSelect,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'
import moment from 'moment/moment'
import DatePicker from 'react-date-picker'
import ReactPaginate from 'react-paginate'
import { Link, useNavigate } from 'react-router-dom'
import ReactTable from 'src/components/common/ReactTable'
import { clubStatusOptions, paginationItemPerPageOptions } from 'src/utils/constant'
import Loader from 'src/components/common/Loader'
import { enqueueSnackbar } from 'notistack'
import CIcon from '@coreui/icons-react'

const ClubBoardListing = () => {
  const [boardSelectOptions, setBoardSelectOptions] = useState([
    { label: 'Club', value: 'club' },
    { label: 'Post', value: 'post' },
  ])
  const navigate = useNavigate()
  const initialFilter = {
    department: 'title',
    searchstring: '',
    startdate: '',
    enddate: '',
    posttype: '',
    classification: '',
    reported: '',
  }

  const [boardDetails, setBoardDetails] = useState({})
  const [postData, setPostData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [totalPages, setTotalPages] = useState(0)
  const [totalDataCount, setTotalDataCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [filterData, setFilterData] = useState(initialFilter)
  const [filterApplied, setFilterApplied] = useState(0)
  const [userInfoPopup, setUserInfoPopup] = useState(false)
  const [userInfoData, setUserInfoData] = useState({})
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  useEffect(() => {
    getSearchData()
  }, [itemsPerPage, currentPage, filterApplied])

  const handleSelectBoardChange = async (event) => {
    setCurrentPage(0)
    setFilterData(initialFilter)
    setFilterApplied(0)
  }

  const getSearchData = async () => {
    setIsLoading(true)
    try {
      let url = `${API_ENDPOINT.get_club_board_posts}?pageNo=${
        currentPage + 1
      }&limit=${itemsPerPage}`

      if (filterData.searchstring) {
        if (filterData.department === 'writter') {
          url = url + `&writer=${filterData.searchstring}`
        } else {
          url = url + `&title=${filterData.searchstring}`
        }
      }

      if (filterData?.posttype) {
        url = url + `&postType=${filterData.posttype}`
      }

      if (filterData?.classification) {
        url = url + `&postStatuses=${filterData.classification}`
      }

      if (filterData?.reported > 0) {
        url = url + `&reported=${filterData.reported}`
      }

      if (filterData?.startdate && filterData.enddate) {
        const startDate = filterData?.startdate?.split('T')[0] + `T00:00:00.000Z`
        const endDate = filterData?.enddate?.split('T')[0] + `T23:59:59.000Z`
        url = url + `&startDate=${startDate}&endDate=${endDate}`
      }

      const responce = await getApi(url)

      console.log('getSearchData :: ', responce)
      if (responce.status === 200) {
        setPostData(responce.data)
        setTotalDataCount(responce.totalCount)
        setTotalPages(Math.ceil(responce.totalCount / Number(itemsPerPage)))
        setIsLoading(false)
      } else {
        setIsLoading(false)
      }
    } catch (error) {
      setIsLoading(false)
    }
  }

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected)
  }

  const handleDepartmentChange = (event) => {
    const value = event?.target?.value

    setFilterData((prev) => {
      return {
        ...prev,
        department: value,
      }
    })
  }

  const handleDepartmentSearchChange = (event) => {
    const value = event?.target?.value

    setFilterData((prev) => {
      return {
        ...prev,
        searchstring: value,
      }
    })
  }
  const handleStartDate = (event) => {
    setStartDate(event)
    const value = moment(event).add(1, 'd').toISOString()

    setFilterData((prev) => {
      return {
        ...prev,
        startdate: value,
      }
    })
  }

  const handleEndDate = (event) => {
    setEndDate(event)
    const value = moment(event).add(1, 'd').toISOString()
    setFilterData((prev) => {
      return {
        ...prev,
        enddate: value,
      }
    })
  }

  const handlePostTypeChange = (event) => {
    const value = event?.target?.value

    setFilterData((prev) => {
      return {
        ...prev,
        posttype: value,
      }
    })
  }

  const handleSearchfilter = () => {
    if (
      (filterData.startdate && !filterData.enddate) ||
      (!filterData.startdate && filterData.enddate)
    ) {
      return
    }

    if (
      (filterData.searchstring && filterData.department) ||
      (filterData.startdate && filterData.enddate) ||
      filterData.posttype ||
      filterData.classification ||
      filterData.reported > 0
    ) {
      setCurrentPage(0)
      setFilterApplied((prev) => prev + 1)
    } else {
      setFilterApplied(0)
      return
    }
  }

  const resetFilter = useCallback(() => {
    // if (filterApplied > 0) {
    setCurrentPage(0)
    setFilterApplied(0)
    setFilterData({
      department: 'title',
      searchstring: '',
      startdate: '',
      enddate: '',
      posttype: '',
      classification: '',
      reported: '',
    })
    // }
  }, [])

  const handleShowWritterInfo = async (id) => {
    setIsLoading(true)
    let url = API_ENDPOINT.get_postuserdetail + `?userId=${id}`

    try {
      const response = await getApi(url)
      if (response.status === 200) {
        setUserInfoPopup(true)
        setUserInfoData(response.getBoardData[0])
        setIsLoading(false)
      } else {
        setIsLoading(false)
      }
    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }
  }

  const handleSelectionChange = useCallback((selectedRowsIds) => {
    // setSelectedRows([...selectedRows, selectedRowsIds]);
    // const getIds = selectedRowsIds.map((item) => {
    //   return item.id.toString();
    // })
    // setDataIds(getIds)
  }, [])

  const columns = useMemo(
    () => [
      {
        Header: 'No',
        accessor: '',
        Cell: ({ row }) => {
          return currentPage * itemsPerPage + (row.index + 1)
        },
      },
      {
        Header: 'Club',
        accessor: 'clubName',
        Cell: ({ row }) => <p>{row.original.clubName} </p>,
      },
      {
        Header: 'Host',
        accessor: 'englishName',
        Cell: ({ row }) => <p className="text-center">{row.original.englishName}</p>,
      },
      {
        Header: 'Hide',
        accessor: 'isDisplay',
        Cell: ({ row }) =>
          row.original.isDisplay ? (
            <CIcon icon={icon.cilLockUnlocked} size="lg" />
          ) : (
            <CIcon icon={icon.cilLockLocked} size="lg" />
          ),
      },
      {
        Header: 'History',
        accessor: 'views',
        Cell: ({ row }) => (
          <p className="text-center">{`${row.original.views ? row.original.views : 0}`}</p>
        ),
      },
    ],
    [currentPage, itemsPerPage],
  )

  return (
    <>
      {isLoading && <Loader />}
      <main>
        <div>
          <div className="d-flex justify-content-between align-items-center">
            <p>Club Board Management</p>
          </div>
          <div className="d-flex p-3 h-100 w-100 bg-light rounded mt-2">
            <div className="d-flex align-items-center w-25 ms-2 align-items-center">
              <p className="fw-medium me-3" style={{ 'white-space': 'nowrap' }}>
                Board
              </p>
              <CFormSelect
                className="mb-2"
                aria-label="Default select example"
                options={boardSelectOptions}
                onChange={(e) => handleSelectBoardChange(e)}
              />
            </div>
          </div>
          <div className="d-flex p-4  flex-column bg-light rounded mt-3">
            <div className="d-flex align-items-center w-100">
              <div className="d-flex align-items-center me-5">
                <label className="me-3 fw-medium">Search</label>
                <CFormSelect
                  className="w-50 me-2"
                  aria-label="Default select example"
                  options={[
                    { label: 'Club', value: 'club' },
                    { label: 'Host', value: 'host' },
                  ]}
                  onChange={handleDepartmentChange}
                />
                <CFormInput
                  type="text"
                  value={filterData?.searchstring}
                  onChange={handleDepartmentSearchChange}
                  id="inputPassword2"
                />
              </div>
              <div className="d-flex align-items-center">
                <label className="me-3 fw-medium">Date</label>
                <div className="d-flex p-2 gap-3">
                  <DatePicker value={startDate} onChange={handleStartDate} />
                  <DatePicker value={endDate} onChange={handleEndDate} />
                </div>
              </div>
            </div>
            <div className="d-flex align-items-center w-100 mt-4">
              <div className="d-flex align-items-center me-5 ">
                <label className="fw-medium me-3 " style={{ 'white-space': 'nowrap' }}>
                  Post Type
                </label>
                <CFormSelect
                  className="me-2"
                  aria-label="Default select example"
                  options={[...clubStatusOptions]}
                  onChange={handlePostTypeChange}
                  value={filterData.posttype}
                />
              </div>
            </div>
            <div className="d-flex gap-3 mt-3">
              <CButton onClick={handleSearchfilter}>Search</CButton>
              <CButton onClick={resetFilter}>Reset</CButton>
            </div>
          </div>
          <div className="d-flex flex-column mt-3 p-3">
            {totalDataCount > 0 && <p style={{ margin: 0 }}>Total&nbsp;:&nbsp; {totalDataCount}</p>}
            <ReactTable
              columns={columns}
              data={postData}
              showCheckbox={false}
              onSelectionChange={handleSelectionChange}
            />
            <div className="d-flex w-100 justify-content-center gap-3">
              {postData.length > 0 && (
                <div className="userlist-pagination">
                  <div className="userlist-pagination dataTables_paginate">
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
              )}
              {postData.length > 0 && (
                <div className="d-flex align-items-center gap-2 mt-2">
                  <label>Show</label>
                  <CFormSelect
                    className=""
                    aria-label=""
                    options={paginationItemPerPageOptions}
                    onChange={(event) => {
                      setItemsPerPage(parseInt(event?.target?.value))
                      setCurrentPage(0)
                    }}
                  />
                  <label>Lists</label>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal */}
        <CModal
          alignment="center"
          visible={userInfoPopup}
          onClose={() => {
            setUserInfoPopup(false)
            setUserInfoData({})
          }}
          backdrop="static"
          aria-labelledby="LiveDemoExampleLabel"
        >
          <CModalHeader
            onClose={() => {
              setUserInfoPopup(false)
              setUserInfoData({})
            }}
          >
            <CModalTitle className="p-1">User Information</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <div className="">
              <p>Username : {userInfoData.englishName ? userInfoData.englishName : '-'}</p>
              <p>Group/Team : {userInfoData.teamName ? userInfoData.teamName : '-'} </p>
              <p>E-mail address : {userInfoData.email ? userInfoData.email : '-'}</p>
            </div>
          </CModalBody>
        </CModal>
      </main>
    </>
  )
}

export default ClubBoardListing
