import {
  CButton,
  CFormInput,
  CFormSelect,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CSpinner,
} from '@coreui/react'
import moment from 'moment/moment'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import DatePicker from 'react-date-picker'
import ReactPaginate from 'react-paginate'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import ReactTable from 'src/components/common/ReactTable'
import { getApi } from 'src/utils/Api'
import { API_ENDPOINT } from 'src/utils/config'
import {
  postTypeOptions,
  classificationsOptions,
  reportedOptions,
  paginationItemPerPageOptions,
  classificationsTypeOptions,
} from 'src/utils/constant'
import Loader from 'src/components/common/Loader'
import { enqueueSnackbar } from 'notistack'
import CIcon from '@coreui/icons-react'
import { cilCircle, cilDescription, cilFile, cilImage } from '@coreui/icons'

const BoardPostListing = () => {
  const location = useLocation()
  const initialFilter = {
    department: 'title',
    searchstring: '',
    startdate: '',
    enddate: '',
    posttype: '',
    classification: '',
    reported: '',
  }

  const [boardSelectOptions, setBoeardSelectOptions] = useState([{ label: 'All', value: '' }])
  const [boardID, setBoardID] = useState(0)
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
  const navigate = useNavigate()
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  useEffect(() => {
    getBoardDropDownData()
    if (location?.state?.enqueueSnackbarMsg) {
      enqueueSnackbar(location.state.enqueueSnackbarMsg, { variant: location.state.variant })
    }
  }, [])

  useEffect(() => {
    getPostData(boardID)
  }, [itemsPerPage, currentPage, filterApplied, boardID])

  const handleSelectBoardChange = async (event) => {
    const value = parseInt(event.target.value)

    setCurrentPage(0)
    setBoardID(value)
    setFilterData(initialFilter)
    setFilterApplied(0)
    if (value) {
      const boardInfo = await getBoardDataByID(value)
      setBoardDetails(boardInfo.getBoardData[0])
    } else {
      setBoardDetails({})
    }
    // getPostData(value)
  }

  const getBoardDropDownData = async () => {
    setIsLoading(true)
    try {
      let url = `${API_ENDPOINT.get_boards}`

      const responce = await getApi(url)

      if (responce.status === 200) {
        const boardData = responce.getBoardData.map((ele) => {
          return { label: ele.name, value: ele.id }
        })

        setBoeardSelectOptions((prev) => {
          return [{ label: 'All', value: 0 }, ...boardData]
        })
        setIsLoading(false)
      } else {
        setIsLoading(false)
      }
    } catch (error) {
      setIsLoading(false)
      console.log(error)
    }
  }

  const getPostData = async (boardId) => {
    console.log('filterData', filterData)
    setIsLoading(true)
    try {
      let url = `${API_ENDPOINT.get_bulletinboard_posts}?pageNo=${
        currentPage + 1
      }&limit=${itemsPerPage}`

      if (boardId >= 0) {
        url = url + `&boardId=${boardId}`
      }

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

      console.log('getPostData', responce)
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

  const getBoardDataByID = async (id) => {
    let data = []
    try {
      let url = API_ENDPOINT.get_boarddata_byID + `?boardId=${id}`

      const response = await getApi(url)
      console.log(response)
      if (response.status === 200) {
        data = response
      }
    } catch (error) {
      console.log(error)
    }
    return data
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
    console.log('startdate', event)
    setStartDate(event)
    const value = moment(event).add(1, 'd').toISOString()
    console.log('value', value)

    setFilterData((prev) => {
      return {
        ...prev,
        startdate: value,
      }
    })
  }

  const handleEndDate = (event) => {
    console.log('enddate', event)
    setEndDate(event)
    const value = moment(event).add(1, 'd').toISOString()
    console.log('value', value)
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
    const value = event?.target?.value != '' ? parseInt(event?.target?.value) : ''

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
      console.log('start end ceck')
      return
    }

    if (
      (filterData.searchstring && filterData.department) ||
      (filterData.startdate && filterData.enddate) ||
      filterData.posttype ||
      filterData.classification ||
      filterData.reported > 0
    ) {
      // setFilterApplied(false)
      console.log('if')
      setCurrentPage(0)
      setFilterApplied((prev) => prev + 1)
    } else {
      console.log('else')
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
    // console.log('userid', id, type)
    setIsLoading(true)
    let url = API_ENDPOINT.get_postuserdetail + `?userId=${id}`

    try {
      const response = await getApi(url)
      console.log('response', response)
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

  const modifyPostHandler = (e, row) => {
    e.preventDefault()
    if (row.original.userId === JSON.parse(localStorage.getItem('userdata')).id) {
      navigate('./updatePost', {
        state: {
          postId: row?.original?.postId,
          boardID: row?.original?.boardId,
        },
      })
    } else {
      enqueueSnackbar('Not allowed to change!', { variant: 'error' })
    }
  }

  const [selectedRows, setSelectedRows] = useState([])
  const handleSelectionChange = useCallback((selectedRowsIds) => {
    // setSelectedRows([...selectedRows, selectedRowsIds]);
    // console.log('selected rows type =>', typeof selectedRowsIds);
    // const getIds = selectedRowsIds.map((item) => {
    //   console.log('ites =>', item);
    //   return item.id.toString();
    // })
    // console.log('getIds', getIds)
    // console.log('getIds =>', typeof getIds);
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
        Header: 'Type',
        accessor: 'PostTypes',
        Cell: ({ row }) => (
          <p className="text-center">{`${
            row.original.PostTypes.charAt(0).toUpperCase() + row.original.PostTypes.slice(1)
          }`}</p>
        ),
      },
      {
        Header: 'Classification',
        accessor: 'postStatuses',
        Cell: ({ row }) => (
          <p className="text-center">{`${
            row.original.postStatuses.charAt(0).toUpperCase() + row.original.postStatuses.slice(1)
          }`}</p>
        ),
      },
      {
        Header: 'Reported Post',
        accessor: 'englishName',
        Cell: ({ row }) => (
          <p className="text-center">{`${row.original.reportsPostCount ? 'Y' : 'N'}`}</p>
        ),
      },
      {
        Header: 'Title',
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
                <CIcon style={{ width: '10px' }} icon={cilFile} size="lg" />
              ) : (
                ''
              )}
              {row.original.images != null ? (
                <CIcon style={{ width: '10px' }} icon={cilImage} size="lg" />
              ) : (
                ''
              )}
              {/* {<CIcon style={{ width: '10px', color: 'red' }} icon={cilCircle
          } size="lg" />} */}
            </div>
          </div>
        ),
      },
      {
        Header: 'Writter',
        accessor: 'englishname',
        Cell: ({ row }) => (
          <Link
            onClick={() => handleShowWritterInfo(row.original.userId)}
            className="text-dark text-center"
            style={{ curser: 'pointer' }}
          >
            {row.original.englishName ? row.original.englishName : <p>{'-'}</p>}
          </Link>
        ),
      },
      {
        Header: 'Date',
        accessor: 'createdAt',
        Cell: ({ row }) => <p>{moment(row.original.createdAt).format('YYYY-MM-DD HH:mm:ss')} </p>,
      },
      {
        Header: 'Likes',
        accessor: 'likes',
        Cell: ({ row }) => (
          <p className="text-center">{`${row.original.likes ? row.original.likes : 0}`}</p>
        ),
      },
      {
        Header: 'Comments',
        accessor: 'comments',
        Cell: ({ row }) => (
          <p className="text-center">{`${row.original.comments ? row.original.comments : 0}`}</p>
        ),
      },
      {
        Header: 'Views',
        accessor: 'views',
        Cell: ({ row }) => (
          <p className="text-center">{`${row.original.views ? row.original.views : 0}`}</p>
        ),
      },
      {
        Header: 'No of Reported Comments',
        accessor: 'reportsCommentsCount',
        Cell: ({ row }) => (
          <p className="text-center">
            {row.original.reportsCommentsCount ? row.original.reportsCommentsCount : 0}
          </p>
        ),
      },
      {
        Header: 'History',
        Cell: ({ row }) => (
          <p
            role="button"
            onClick={() => viewPostHistoryHandler(row.original.postId)}
            className="text-center"
          >
            View
          </p>
        ),
      },
      {
        Header: 'Modify',
        Cell: ({ row }) => (
          <Link
            onClick={(e) => modifyPostHandler(e, row)}
            className="text-dark text-center"
            style={{ curser: 'pointer' }}
          >
            Edit
          </Link>
        ),
      },
    ],
    [currentPage, itemsPerPage],
  )

  const createPostHandler = () => {
    navigate('./createPost', {
      state: {
        boardID: boardID,
        redirectTo: 'BulletinBoard',
      },
    })
  }

  const viewPostHistoryHandler = (id) => {
    navigate('./CommunityReportHistory', {
      state: {
        postId: id,
      },
    })
  }

  return (
    <>
      {isLoading && <Loader />}
      <main>
        <div>
          <div className="d-flex justify-content-between align-items-center">
            <p>Bulletin Board Information</p>
            <CButton onClick={createPostHandler}>Create a post</CButton>
          </div>
          <div className="d-flex p-3 justify-content-between h-100 w-100 bg-light rounded mt-2">
            <div className="d-flex align-items-center w-25 ms-2 align-items-center">
              <p className="fw-medium me-3" style={{ 'white-space': 'nowrap' }}>
                Board
              </p>
              <CFormSelect
                className="mb-2"
                aria-label="Default select example"
                options={boardSelectOptions}
                onChange={handleSelectBoardChange}
              />
            </div>
            <div className="d-flex align-items-center  ms-2 align-items-center">
              <p className="fw-medium me-1">Usage status :</p>
              <p>{boardDetails?.usageStatus ? boardDetails?.usageStatus : '-'}</p>
            </div>
            <div className="d-flex align-items-center  ms-2 align-items-center">
              <p className="fw-medium me-1">Permissions to write :</p>
              <p>
                {boardDetails?.isAdminOnly === 0 || boardDetails?.isAdminOnly === 1
                  ? boardDetails?.isAdminOnly === 0
                    ? 'All'
                    : 'Admin only'
                  : '-'}
              </p>
            </div>
            <div className="d-flex align-items-center me-2 align-items-center">
              <p className="fw-medium me-1">Anonymous Board :</p>
              <p>
                {boardDetails?.annonymousBoard === 0 || boardDetails?.annonymousBoard === 1
                  ? boardDetails?.annonymousBoard === 0
                    ? 'No'
                    : 'Yes'
                  : '-'}
              </p>
            </div>
          </div>
          <div className="d-flex p-4  flex-column bg-light rounded mt-3">
            <div className="d-flex align-items-center w-100">
              <div className="d-flex align-items-center me-5">
                <label className="me-3 fw-medium">Department</label>
                <CFormSelect
                  className="w-50 me-2"
                  aria-label="Default select example"
                  options={boardDetails?.annonymousBoard === 0 ? [
                    { label: 'Title', value: 'title' },
                    { label: 'Writter', value: 'writter' },
                  ] : [{ label: 'Title', value: 'title' },]}
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
                  options={[{ label: 'All', value: '' }, ...postTypeOptions]}
                  onChange={handlePostTypeChange}
                  value={filterData.posttype}
                />
              </div>
              <div className="d-flex align-items-center me-5">
                <label className="fw-medium  me-3">Classification</label>
                <CFormSelect
                  className="me-2"
                  aria-label="Default select example"
                  options={[
                    { label: 'All', value: '' },
                    ...(classificationsTypeOptions[filterData.posttype] || []),
                  ]}
                  onChange={handleClassificationChange}
                  value={filterData.classification}
                  disabled={!filterData.posttype}
                />
              </div>
              <div className="d-flex align-items-center me-5">
                <label className="fw-medium me-3">Reported</label>
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
            <div className="UserInfoList">
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

export default BoardPostListing
