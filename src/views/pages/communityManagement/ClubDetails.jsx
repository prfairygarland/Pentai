import {
  CButton,
  CFormInput,
  CFormSelect,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'
import './clubBoardListing.scss'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import DatePicker from 'react-date-picker'
import ReactPaginate from 'react-paginate'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import moment from 'moment/moment'
import ReactTable from 'src/components/common/ReactTable'
import {
  classificationsTypeOptions,
  paginationItemPerPageOptions,
  postTypeOptions,
  reportedOptions,
} from 'src/utils/constant'
import CIcon from '@coreui/icons-react'
import { ALL_CONSTANTS, API_ENDPOINT } from 'src/utils/config'
import Loader from 'src/components/common/Loader'
import { getApi, postApi } from 'src/utils/Api'
import { useTranslation } from 'react-i18next'

const ClubDetails = () => {
  const initialFilter = {
    searchstring: '',
    startdate: '',
    enddate: '',
    department: 'club',
    classification: '',
    reported: '',
  }
  const [isLoading, setIsLoading] = useState(false)
  const [filterApplied, setFilterApplied] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [postData, setPostData] = useState([])
  const [clubData, setClubData] = useState({})
  const [totalDataCount, setTotalDataCount] = useState(0)
  const [filterData, setFilterData] = useState(initialFilter)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [clubHistoryData, setClubHistoryData] = useState([])
  const [clubHistoryInfoPopup, setClubHistoryInfoPopup] = useState(false)
  const { i18n } = useTranslation()
  const translationObject = i18n.getDataByLanguage(i18n.language)
  const multiLangObj = translationObject?.translation?.communityClubManagement

  const location = useLocation()
  const navigate = useNavigate()

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
        postType: value,
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

  const handleReportedChange = (event) => {
    const value = event?.target?.value
    setFilterData((prev) => {
      return {
        ...prev,
        reported: value,
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
      filterData.classification ||
      filterData.postType ||
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
      department: 'club',
      searchstring: '',
      startdate: '',
      enddate: '',
      classification: '',
      reported: '',
    })
    // }
  }, [])

  const viewPostHistoryHandler = (id) => {
    navigate('../ClubBoard/CommunityReportHistory', {
      state: {
        postId: id,
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
              to={`/BulletinBoardPostDetails/${row.original.postId}/${row.original.boardId}`}
              style={{
                // width: '200px',
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
          <Link className=" text-center" style={{ curser: 'pointer' }}>
            {row.original.englishname ? row.original.englishname : <p>{'-'}</p>}
          </Link>
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

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected)
  }

  const getPostSearchData = async () => {
    setIsLoading(true)
    try {
      let url = `${API_ENDPOINT.get_club_posts}?pageNo=${
        currentPage + 1
      }&limit=${itemsPerPage}&clubId=${location.state.clubId}`

      if (filterData?.startdate && filterData.enddate) {
        const startDate = filterData?.startdate?.split('T')[0] + `T00:00:00.000Z`
        const endDate = filterData?.enddate?.split('T')[0] + `T23:59:59.000Z`
        url = url + `&startDate=${startDate}&endDate=${endDate}`
      }
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

  const getClubDetails = async () => {
    try {
      const response = await getApi(
        `${API_ENDPOINT.get_club_details}?clubId=${location.state.clubId}`,
      )
      if (response.status === 200) {
        setClubData(response.getClubdetails)
      } else {
        console.log('error while getting club details - clubDetails.jsx')
      }
    } catch (error) {
      console.log('error while getting club details - clubDetails.jsx')
    }
  }

  const getClubHistoryData = async (clubId) => {
    setIsLoading(true)
    try {
      let url = `${API_ENDPOINT.get_club_history}?clubId=${clubId}`
      const response = await getApi(url)
      if (response.status === 200) {
        setClubHistoryData(response.getClubHistory)
      }
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
    }
  }

  const clubViewHandler = (clubId) => {
    getClubHistoryData(clubId)
    setClubHistoryInfoPopup(true)
  }

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

  const changeHideShow = async () => {
    try {
      const body = `clubId=${clubData?.clubId}&isDisplay=${clubData?.isClubDisplay === 0 ? 1 : 0}`
      const response = await postApi(API_ENDPOINT.hide_show_club_change, body)
      console.log('hide_show_club_change - response :: ', response)
      getClubDetails()
    } catch (error) {
      console.log('error in clubDetail : hide_show_club_change')
    }
  }

  const deleteClubHandler = async () => {
    try {
      const body = `clubId=[${clubData?.clubId}]`
      const response = await postApi(API_ENDPOINT.delete_selected_clubs, body)
      console.log('delete_selected_clubs - response:: ', response)
      navigate('../ClubBoard')
    } catch (error) {
      console.log('error in clubDetail : delete_selected_clubs')
    }
  }

  useEffect(() => {
    getPostSearchData()
  }, [itemsPerPage, currentPage, filterApplied])

  useEffect(() => {
    getClubDetails()
  }, [])

  return (
    <>
      {isLoading && <Loader />}
      <div className="d-flex gap-3 justify-content-end mt-3">
        <CButton onClick={changeHideShow}>
          {clubData?.isClubDisplay === 0 ? multiLangObj?.show : multiLangObj?.hide}
        </CButton>
        <CButton onClick={deleteClubHandler}>{multiLangObj?.delete}</CButton>
      </div>
      <div className="d-flex p-4  flex-column bg-light rounded mt-3">
        <div className="d-flex align-items-center w-100">
          <div className="d-flex align-items-center me-5">
            <label className="me-1 fw-medium">{multiLangObj?.clubName} : </label>
            <div className="d-flex p-1 gap-3">
              <p>{clubData?.clubName}</p>
            </div>
          </div>
          <div className="d-flex align-items-center me-5 p-2">
            <label className="me-1 fw-medium">{multiLangObj?.clubStatus} : </label>
            <div className="d-flex p-1 gap-3">
              <p>{clubData?.clubStatus}</p>
            </div>
          </div>
          <div className="d-flex align-items-center me-5 p-2">
            <label className="me-1 fw-medium">{multiLangObj?.host} : </label>
            <div className="d-flex p-1 gap-3">
              <p>{clubData?.englishName}</p>
            </div>
          </div>
          <div className="d-flex align-items-center me-5 p-2">
            <label className="me-1 fw-medium">{multiLangObj?.createdDate} : </label>
            <div className="d-flex p-1 gap-3">
              <p>{new Date(clubData?.clubCreatedAt).toLocaleString()}</p>
            </div>
          </div>
          <div className="d-flex align-items-center me-5 p-2">
            <label className="me-1 fw-medium">{multiLangObj?.history} : </label>
            <div className="d-flex p-1 gap-3">
              <p>
                <Link
                  onClick={(e) => clubViewHandler(clubData?.clubId)}
                  className=" text-center"
                  style={{ cursor: 'pointer' }}
                >
                  {multiLangObj?.view}
                </Link>
              </p>
            </div>
          </div>
        </div>
        <div className="d-flex align-items-center w-100">
          <div className="club-detail-image-container">
            {/* <img crossOrigin="anonymous" src={ALL_CONSTANTS.BASE_URL + clubData?.ImageUrl} alt="" /> */}
            <img
              crossOrigin="anonymous"
              src="https://fastly.picsum.photos/id/526/536/354.jpg?hmac=-6FnJp37nGNgiMrQrNJUM_NT_RlXwexONZX-VN-6UqA"
              alt=""
            />
          </div>
          <div className="d-flex align-items-center me-5 p-3">
            <p>{clubData?.clubDescription}</p>
          </div>
        </div>
      </div>
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
          onSelectionChange={() => {}}
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
        {/* Club History Modal */}
        <CModal
          alignment="center"
          visible={clubHistoryInfoPopup}
          onClose={() => {
            setClubHistoryInfoPopup(false)
          }}
          backdrop="static"
          aria-labelledby="LiveDemoExampleLabel"
        >
          <CModalHeader
            onClose={() => {
              setClubHistoryInfoPopup(false)
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
      </div>
    </>
  )
}

export default ClubDetails
