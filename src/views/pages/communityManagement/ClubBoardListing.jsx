import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { API_ENDPOINT } from 'src/utils/config'
import { getApi, postApi } from 'src/utils/Api'
import * as icon from '@coreui/icons'
import './clubBoardListing.scss'
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
import {
  classificationsTypeOptions,
  clubStatusOptions,
  paginationItemPerPageOptions,
  postTypeOptions,
  reportedOptions,
} from 'src/utils/constant'
import Loader from 'src/components/common/Loader'
import CIcon from '@coreui/icons-react'
import { useTranslation } from 'react-i18next'

const ClubBoardListing = () => {
  const initialFilter = {
    searchstring: '',
    startdate: '',
    enddate: '',
    clubStatus: 'Active',
    classification: '',
    reported: '',
    department: 'club',
  }

  const [postData, setPostData] = useState([])
  const [clubData, setClubData] = useState([])
  const [clubHistoryData, setClubHistoryData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [totalPages, setTotalPages] = useState(0)
  const [totalDataCount, setTotalDataCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [filterData, setFilterData] = useState(initialFilter)
  const [filterApplied, setFilterApplied] = useState(0)
  const [clubHistoryInfoPopup, setClubHistoryInfoPopup] = useState(false)
  const [userInfoData, setUserInfoData] = useState({})
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [selectedBoard, setSelectedBoard] = useState('club')
  const { i18n } = useTranslation()
  const translationObject = i18n.getDataByLanguage(i18n.language)
  const multiLangObj = translationObject?.translation?.communityClubManagement

  const boardTypes = [
    { label: multiLangObj?.club, value: 'club' },
    { label: multiLangObj?.post, value: 'post' },
  ]
  const navigate = useNavigate()

  useEffect(() => {
    if (selectedBoard === 'post') {
      getPostSearchData()
    } else if (selectedBoard === 'club') {
      getClubSearchData()
    }
  }, [itemsPerPage, currentPage, filterApplied])

  const handleBoardChange = async (event) => {
    setSelectedBoard(event.target.value)
    if (event.target.value === 'post') {
      getPostSearchData()
    } else if (event.target.value === 'club') {
      getClubSearchData()
    }
    setFilterData((prev) => {
      return {
        ...prev,
        department: 'club',
      }
    })
    setCurrentPage(0)
    setFilterData(initialFilter)
    setFilterApplied(0)
  }

  const getPostSearchData = async () => {
    setIsLoading(true)
    try {
      let url = `${API_ENDPOINT.get_club_posts}?pageNo=${currentPage + 1}&limit=${itemsPerPage}`

      if (filterData?.startdate && filterData.enddate) {
        const startDate = filterData?.startdate?.split('T')[0] + `T00:00:00.000Z`
        const endDate = filterData?.enddate?.split('T')[0] + `T23:59:59.000Z`
        url = url + `&startDate=${startDate}&endDate=${endDate}`
      }
      console.log('filterData.department :: ', filterData.department)
      if (filterData.searchstring) {
        if (filterData.department === 'host') {
          url = url + `&hostName=${filterData.searchstring}`
        } else if (filterData.department === 'club') {
          url = url + `&clubName=${filterData.searchstring}`
        } else if (filterData.department === 'title') {
          url = url + `&title=${filterData.searchstring}`
        }
      }

      if (filterData?.postType) {
        url = url + `&postType=${filterData.postType}`
      }

      if (filterData?.classification) {
        url = url + `&postStatuses=${filterData.classification}`
      }

      if (filterData?.reported > 0) {
        url = url + `&reported=${filterData.reported}`
      }

      const response = await getApi(url)

      console.log('getSearchClubPostData :: ', response)
      if (response.status === 200) {
        setPostData(response.data)
        setTotalDataCount(response.totalCount)
        setTotalPages(Math.ceil(response.totalCount / Number(itemsPerPage)))
        setIsLoading(false)
      } else {
        setIsLoading(false)
      }
    } catch (error) {
      setIsLoading(false)
    }
  }

  const getClubHistoryData = async (clubId) => {
    setIsLoading(true)
    try {
      let url = `${API_ENDPOINT.get_club_history}?clubId=${clubId}`
      const response = await getApi(url)
      if (response.status === 200) {
        console.log(response)
        setClubHistoryData(response.getClubHistory)
      }
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
    }
  }

  const getClubSearchData = async () => {
    setIsLoading(true)
    try {
      let url = `${API_ENDPOINT.get_club_board}?pageNo=${currentPage + 1}&limit=${itemsPerPage}`

      if (filterData.searchstring) {
        if (filterData.department === 'host') {
          url = url + `&hostName=${filterData.searchstring}`
        } else {
          url = url + `&clubName=${filterData.searchstring}`
        }
      }

      if (filterData?.clubStatus) {
        url = url + `&status=${filterData.clubStatus}`
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

      const response = await getApi(url)

      console.log('getSearchClubBoardData :: ', response)
      if (response.status === 200) {
        setClubData(response.data)
        setTotalDataCount(response.totalCount)
        setTotalPages(Math.ceil(response.totalCount / Number(itemsPerPage)))
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

  const handleClubStatusChange = (event) => {
    const value = event?.target?.value

    setFilterData((prev) => {
      return {
        ...prev,
        clubStatus: value,
      }
    })
  }

  const handlePostTypeChange = (event) => {
    const value = event?.target?.value
    setFilterData((prev) => {
      return {
        ...prev,
        postType: value,
      }
    })
  }

  const handleReportedChange = (event) => {
    const value = event?.target?.value
    setFilterData((prev) => {
      return {
        ...prev,
        reported: value,
      }
    })
  }
  const handleClassificationChange = (event) => {
    const value = event?.target?.value
    setFilterData((prev) => {
      return {
        ...prev,
        classification: value,
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
      filterData.clubStatus ||
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

  const changeHideShow = async (clubId, currentStatus) => {
    try {
      const body = `clubId=${clubId}&isDisplay=${currentStatus === 0 ? 1 : 0}`
      const response = await postApi(API_ENDPOINT.hide_show_club_change, body)

      console.log('hide_show_club_change :: ', response)
      getClubSearchData()
    } catch (error) {
      setIsLoading(false)
    }
  }
  const resetFilter = useCallback(() => {
    // if (filterApplied > 0) {
    setCurrentPage(0)
    setFilterApplied(0)
    setFilterData({
      department: '',
      searchstring: '',
      startdate: '',
      enddate: '',
      classification: '',
      reported: '',
      postType: '',
      clubStatus: 'Active',
    })
    setStartDate('')
    setEndDate('')
    // }
  }, [])

  const [selectedRows, setSelectedRows] = useState([])
  const handleSelectionChange = useCallback((selectedRowsIds) => {
    const getIds = selectedRowsIds.map((item) => {
      return item.clubId
    })
    setSelectedRows(getIds)
  }, [])

  const deleteHandler = async () => {
    console.log(selectedRows)
    try {
      const body = `clubId=[${selectedRows}]`
      const response = await postApi(API_ENDPOINT.delete_selected_clubs, body)
      console.log('delete_selected_clubs :: ', response)
      getClubSearchData()
    } catch (error) {
      setIsLoading(false)
    }
  }

  const clubViewHandler = (clubId) => {
    getClubHistoryData(clubId)
    setClubHistoryInfoPopup(true)
  }

  const viewPostHistoryHandler = (id) => {
    navigate('/BulletinBoard/CommunityReportHistory', {
      state: {
        postId: id,
      },
    })
  }

  const redirectToPostDetailHandler = (e, postId) => {
    e.preventDefault()
    navigate('/ClubBoard/ClubBoardPostDetails', {
      state: {
        postId: postId,
      },
    })
  }

  const postDatacolumns = useMemo(
    () => [
      {
        Header: <p className="text-center">{multiLangObj?.no}</p>,
        accessor: 'number',
        Cell: ({ row }) => {
          return currentPage * itemsPerPage + (row.index + 1)
        },
      },
      {
        Header: <p className="text-center">{multiLangObj?.postType}</p>,
        accessor: 'PostTypes',
        Cell: ({ row }) => (
          <p className="text-center">{`${
            row.original.PostTypes.charAt(0).toUpperCase() + row.original.PostTypes.slice(1)
          }`}</p>
        ),
      },
      {
        Header: <p className="text-center">{multiLangObj?.classification}</p>,
        accessor: 'postStatuses',
        Cell: ({ row }) => (
          <p className="text-center">{`${
            row.original.postStatuses.charAt(0).toUpperCase() + row.original.postStatuses.slice(1)
          }`}</p>
        ),
      },
      {
        Header: <p className="text-center">{multiLangObj?.reportedPost}</p>,
        accessor: 'reportedPost',
        Cell: ({ row }) => (
          <p className="text-center">{`${row.original.reportsPostCount ? 'Y' : 'N'}`}</p>
        ),
      },
      {
        Header: <p className="text-center">{multiLangObj?.club}</p>,
        accessor: 'club',
        Cell: ({ row }) => <p className="text-center">{`${row.original.ClubName}`}</p>,
      },
      {
        Header: <p className="text-center">{multiLangObj?.title}</p>,
        accessor: 'PostTitle',
        Cell: ({ row }) => (
          <div className="d-flex gap-1">
            {row.original.isAnnouncement > 0 && <i className="icon-announce"></i>}
            <Link
              onClick={(e) => redirectToPostDetailHandler(e, row.original.postId)}
              style={{
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
            >
              {row.original.PostTitle}
            </Link>
            <div className="d-flex gap-1">
              {row.original.attachments != null ? (
                <CIcon style={{ width: '10px' }} size="lg" />
              ) : (
                ''
              )}
              {row.original.images != null ? <CIcon style={{ width: '10px' }} size="lg" /> : ''}
            </div>
          </div>
        ),
      },
      {
        Header: <p className="text-center">{multiLangObj?.host}</p>,
        accessor: 'englishname',
        Cell: ({ row }) => (
          <p
            className="text-center club-host-name"
            onClick={() => redirectToUserDetailHandler(row.original.createdBy)}
          >
            {row.original.englishname ? row.original.englishname : <span>{'-'}</span>}
          </p>
        ),
      },
      {
        Header: <p className="text-center">{multiLangObj?.date}</p>,
        accessor: 'createdAt',
        Cell: ({ row }) => <p>{moment(row.original.createdAt).format('YYYY-MM-DD HH:mm:ss')} </p>,
      },
      {
        Header: <p className="text-center">{multiLangObj?.likes}</p>,
        accessor: 'likes',
        Cell: ({ row }) => (
          <p className="text-center">{`${row.original.likes ? row.original.likes : 0}`}</p>
        ),
      },
      {
        Header: <p className="text-center">{multiLangObj?.comments}</p>,
        accessor: 'comments',
        Cell: ({ row }) => (
          <p className="text-center">{`${row.original.comments ? row.original.comments : 0}`}</p>
        ),
      },
      {
        Header: <p className="text-center">{multiLangObj?.views}</p>,
        accessor: 'views',
        Cell: ({ row }) => (
          <p className="text-center">{`${row.original.views ? row.original.views : 0}`}</p>
        ),
      },
      {
        Header: <p className="text-center">{multiLangObj?.noOfReportedComments}</p>,
        accessor: 'reportsCommentsCount',
        Cell: ({ row }) => (
          <p className="text-center">
            {row.original.reportsCommentsCount ? row.original.reportsCommentsCount : 0}
          </p>
        ),
      },
      {
        Header: <p className="text-center">{multiLangObj?.history}</p>,
        accessor: 'history',
        Cell: ({ row }) => (
          <p
            role="button"
            onClick={() => viewPostHistoryHandler(row.original.postId)}
            className="text-center"
          >
            {multiLangObj?.view}
          </p>
        ),
      },
    ],
    [currentPage, itemsPerPage],
  )

  const clubDatacolumns = useMemo(
    () => [
      {
        Header: <p className="text-center">{multiLangObj?.no}</p>,
        accessor: 'number',
        Cell: ({ row }) => {
          return <p className="text-center">{currentPage * itemsPerPage + (row.index + 1)}</p>
        },
      },
      {
        Header: <p className="text-center">{multiLangObj?.clubStatus}</p>,
        accessor: 'clubStatus',
        Cell: ({ row }) => <p className="text-center">{row.original.clubStatus} </p>,
      },
      {
        Header: <p className="text-center">{multiLangObj?.club}</p>,
        accessor: 'clubName',
        Cell: ({ row }) => (
          <p
            className={
              row.original.clubStatus === 'Active'
                ? 'active-club'
                : row.original.clubStatus === 'Inactive'
                ? 'inactive-club'
                : 'deleted-club'
            }
            onClick={() => redirectToClubDetailHandler(row.original.clubId)}
          >
            {row.original.clubName}{' '}
          </p>
        ),
      },
      {
        Header: <p className="text-center">{multiLangObj?.host}</p>,
        accessor: 'host',
        Cell: ({ row }) => (
          <p
            className="text-center club-host-name"
            onClick={() => redirectToUserDetailHandler(row.original.createdBy)}
          >
            {row.original.englishName}
          </p>
        ),
      },
      {
        Header: <p className="text-center">{multiLangObj?.hideShow}</p>,
        accessor: 'hideShow',
        Cell: ({ row }) =>
          row.original.isClubDisplay ? (
            <p className="text-center">
              <CIcon
                icon={icon.cilLockUnlocked}
                size="s"
                style={{ cursor: 'pointer' }}
                onClick={() => changeHideShow(row.original.clubId, row.original.isClubDisplay)}
              />
            </p>
          ) : (
            <p className="text-center">
              <CIcon
                icon={icon.cilLockLocked}
                size="s"
                style={{ cursor: 'pointer' }}
                onClick={() => changeHideShow(row.original.clubId, row.original.isClubDisplay)}
              />
            </p>
          ),
      },
      {
        Header: <p className="text-center">{multiLangObj?.history}</p>,
        accessor: 'views',
        Cell: ({ row }) => (
          <p className="text-center">
            <Link
              onClick={(e) => clubViewHandler(row.original.clubId)}
              className="text-dark text-center"
              style={{ cursor: 'pointer' }}
            >
              {multiLangObj?.view}
            </Link>
          </p>
        ),
      },
    ],
    [currentPage, itemsPerPage],
  )

  const clubHistoryDataColumns = useMemo(
    () => [
      {
        Header: <p className="text-center">{multiLangObj?.no}</p>,
        accessor: 'number',
        Cell: ({ row }) => {
          return <p className="text-center">{row.index + 1}</p>
        },
      },
      {
        Header: <p className="text-center">{multiLangObj?.classification}</p>,
        accessor: 'classification',
        Cell: ({ row }) => <p className="text-center">{row.original.classification} </p>,
      },
      {
        Header: <p className="text-center">{multiLangObj?.date}</p>,
        accessor: 'date',
        Cell: ({ row }) => (
          <p className="text-center">{new Date(row.original.date).toLocaleString()} </p>
        ),
      },
    ],
    [],
  )

  const redirectToClubDetailHandler = (clubId) => {
    navigate('./ClubDetails', {
      state: {
        clubId: clubId,
      },
    })
  }
  const redirectToUserDetailHandler = (userId) => {
    navigate('/User/UserDetails', {
      state: {
        userId: userId,
      },
    })
  }
  return (
    <>
      {isLoading && <Loader />}
      <main>
        <div>
          <div className="d-flex justify-content-between align-items-center">
            <p>{multiLangObj?.clubBoardManagement}</p>
          </div>
          <div className="d-flex p-3 h-100 w-100 bg-light rounded mt-2">
            <div className="d-flex align-items-center w-25 ms-2 align-items-center">
              <p className="fw-medium me-3" style={{ 'white-space': 'nowrap' }}>
                {multiLangObj?.board}
              </p>
              <CFormSelect
                size="sm"
                className="mb-2"
                onChange={(e) => {
                  handleBoardChange(e)
                }}
              >
                {boardTypes.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    selected={option.value === selectedBoard}
                  >
                    {option.label}
                  </option>
                ))}
              </CFormSelect>
            </div>
          </div>
          {selectedBoard === 'club' && (
            <>
              <div className="d-flex p-4  flex-column bg-light rounded mt-3">
                <div className="d-flex align-items-center w-100">
                  <div className="d-flex align-items-center me-5">
                    <label className="me-3 fw-medium">{multiLangObj?.search}</label>
                    <CFormSelect
                      className="w-50 me-2"
                      aria-label="Default select example"
                      options={[
                        { label: multiLangObj?.club, value: 'club' },
                        { label: multiLangObj?.host, value: 'host' },
                      ]}
                      onChange={handleDepartmentChange}
                      value={filterData.department}
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
                      {multiLangObj?.clubStatus}
                    </label>
                    <CFormSelect
                      className="me-2"
                      aria-label="Default select example"
                      options={[...clubStatusOptions]}
                      onChange={handleClubStatusChange}
                      value={filterData.clubStatus}
                    />
                  </div>
                </div>
                <div className="d-flex gap-3 mt-3">
                  <CButton onClick={handleSearchfilter}>{multiLangObj?.search}</CButton>
                  <CButton onClick={resetFilter}>{multiLangObj?.reset}</CButton>
                </div>
              </div>
              <div className="d-flex flex-column mt-3 p-3">
                <div className="d-flex justify-content-end gap-3 mt-3">
                  <CButton onClick={deleteHandler}>{multiLangObj?.delete}</CButton>
                </div>
                {totalDataCount > 0 && (
                  <p style={{ margin: 0 }}>
                    {multiLangObj?.total}&nbsp;:&nbsp; {totalDataCount}
                  </p>
                )}
                <ReactTable
                  columns={clubDatacolumns}
                  data={clubData}
                  showCheckbox={true}
                  onSelectionChange={handleSelectionChange}
                />
                <div className="d-flex w-100 justify-content-center gap-3">
                  {clubData.length > 0 && (
                    <div className="userlist-pagination">
                      <div className="userlist-pagination dataTables_paginate">
                        <ReactPaginate
                          breakLabel={'...'}
                          marginPagesDisplayed={1}
                          previousLabel={<button>{multiLangObj?.previous}</button>}
                          nextLabel={<button>{multiLangObj?.next}</button>}
                          pageCount={totalPages}
                          onPageChange={handlePageChange}
                          forcePage={currentPage}
                          renderOnZeroPageCount={null}
                          pageRangeDisplayed={4}
                        />
                      </div>
                    </div>
                  )}
                  {clubData.length > 0 && (
                    <div className="d-flex align-items-center gap-2 mt-2">
                      <label>{multiLangObj?.show}</label>
                      <CFormSelect
                        className=""
                        aria-label=""
                        options={paginationItemPerPageOptions}
                        onChange={(event) => {
                          setItemsPerPage(parseInt(event?.target?.value))
                          setCurrentPage(0)
                        }}
                      />
                      <label>{multiLangObj?.lists}</label>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
          {selectedBoard === 'post' && (
            <>
              <div className="d-flex p-4  flex-column bg-light rounded mt-3">
                <div className="d-flex align-items-center w-100">
                  <div className="d-flex align-items-center me-5">
                    <label className="me-3 fw-medium">{multiLangObj?.search}</label>
                    <CFormSelect
                      className="w-50 me-2"
                      aria-label="Default select example"
                      options={[
                        { label: multiLangObj?.club, value: 'club' },
                        { label: multiLangObj?.host, value: 'host' },
                        { label: multiLangObj?.title, value: 'title' },
                      ]}
                      onChange={handleDepartmentChange}
                      value={filterData.department}
                    />
                    <CFormInput
                      type="text"
                      value={filterData?.searchstring}
                      onChange={handleDepartmentSearchChange}
                      id="inputPassword2"
                    />
                  </div>
                  <div className="d-flex align-items-center">
                    <label className="me-3 fw-medium">{multiLangObj?.date}</label>
                    <div className="d-flex p-2 gap-3">
                      <DatePicker value={startDate} onChange={handleStartDate} />
                      <DatePicker value={endDate} onChange={handleEndDate} />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center w-100 mt-4">
                  <div className="d-flex align-items-center me-5 ">
                    <label className="fw-medium me-3 " style={{ 'white-space': 'nowrap' }}>
                      {multiLangObj?.postType}
                    </label>
                    <CFormSelect
                      className="me-2"
                      aria-label="Default select example"
                      options={[{ label: 'All', value: '' }, ...postTypeOptions]}
                      onChange={handlePostTypeChange}
                      value={filterData.postType}
                    />
                  </div>
                  <div className="d-flex align-items-center me-5 ">
                    <label className="fw-medium me-3 " style={{ 'white-space': 'nowrap' }}>
                      {multiLangObj?.classification}
                    </label>
                    <CFormSelect
                      className="me-2"
                      aria-label="Default select example"
                      options={[
                        { label: 'All', value: '' },
                        ...(classificationsTypeOptions[filterData.postType] || []),
                      ]}
                      onChange={handleClassificationChange}
                      value={filterData.classification}
                      disabled={!filterData.postType}
                    />
                  </div>
                  <div className="d-flex align-items-center me-5 ">
                    <label className="fw-medium me-3 " style={{ 'white-space': 'nowrap' }}>
                      {multiLangObj?.reported}
                    </label>
                    <CFormSelect
                      className="me-2"
                      aria-label="Default select example"
                      options={[{ label: 'All', value: '' }, ...reportedOptions]}
                      onChange={handleReportedChange}
                      value={filterData.reported}
                    />
                  </div>
                </div>
                <div className="d-flex gap-3 mt-3">
                  <CButton onClick={handleSearchfilter}>{multiLangObj?.search}</CButton>
                  <CButton onClick={resetFilter}>{multiLangObj?.reset}</CButton>
                </div>
              </div>
              <div className="d-flex flex-column mt-3 p-3">
                {totalDataCount > 0 && (
                  <p style={{ margin: 0 }}>
                    {multiLangObj?.total}&nbsp;:&nbsp; {totalDataCount}
                  </p>
                )}
                <ReactTable
                  columns={postDatacolumns}
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
                          previousLabel={<button>{multiLangObj?.previous}</button>}
                          nextLabel={<button>{multiLangObj?.next}</button>}
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
                      <label>{multiLangObj?.show}</label>
                      <CFormSelect
                        className=""
                        aria-label=""
                        options={paginationItemPerPageOptions}
                        onChange={(event) => {
                          setItemsPerPage(parseInt(event?.target?.value))
                          setCurrentPage(0)
                        }}
                      />
                      <label>{multiLangObj?.lists}</label>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Club History Modal */}
        <CModal
          alignment="center"
          visible={clubHistoryInfoPopup}
          onClose={() => {
            setClubHistoryInfoPopup(false)
            setUserInfoData({})
          }}
          backdrop="static"
          aria-labelledby="LiveDemoExampleLabel"
        >
          <CModalHeader
            onClose={() => {
              setClubHistoryInfoPopup(false)
              setUserInfoData({})
            }}
          >
            <CModalTitle className="p-1">{multiLangObj?.clubHistory}</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <ReactTable
              columns={clubHistoryDataColumns}
              data={clubHistoryData}
              onSelectionChange={() => {
                console.log('no action')
              }}
              showCheckbox={false}
            />
          </CModalBody>
        </CModal>
      </main>
    </>
  )
}

export default ClubBoardListing
