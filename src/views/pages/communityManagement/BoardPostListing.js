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
import { useTranslation } from 'react-i18next';


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

  const { i18n } = useTranslation();
  const translationObject = i18n.getDataByLanguage(i18n.language);
  const multiLangObj = translationObject?.translation?.communityBulletinAndWelfare

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
        classification: ''
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
      return
    }

    if (filterData.searchstring.trim().length === 1) {
      enqueueSnackbar(multiLangObj?.pleaseEnterAtleastTwoChars, { variant: 'error' })
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
    setStartDate('')
    setEndDate('')
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

  const modifyPostHandler = (e, row) => {
    e.preventDefault()
    if (row.original.userId === JSON.parse(localStorage.getItem('userdata')).id) {
      navigate('./updatePost', {
        state: {
          postId: row?.original?.postId,
          boardID: row?.original?.boardId,
          redirectTo: 'BulletinBoard',
        },
      })
    } else {
      enqueueSnackbar(multiLangObj?.notAllowedToChange, { variant: 'error' })
    }
  }

  const [selectedRows, setSelectedRows] = useState([])
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
        Header: multiLangObj?.no,
        accessor: '',
        Cell: ({ row }) => {
          return currentPage * itemsPerPage + (row.index + 1)
        },
      },
      {
        Header: multiLangObj?.type,
        accessor: 'PostTypes',
        Cell: ({ row }) => (
          <p className="text-center">{`${
            row.original.PostTypes.charAt(0).toUpperCase() + row.original.PostTypes.slice(1)
          }`}</p>
        ),
      },
      {
        Header: multiLangObj?.classification,
        accessor: 'postStatuses',
        Cell: ({ row }) => (
          <p className="text-center">{`${
            row.original.postStatuses.charAt(0).toUpperCase() + row.original.postStatuses.slice(1)
          }`}</p>
        ),
      },
      {
        Header: multiLangObj?.reportedPost,
        accessor: 'englishName',
        Cell: ({ row }) => (
          <p className="text-center">{`${row.original.reportsPostCount ? 'Y' : 'N'}`}</p>
        ),
      },
      {
        Header: multiLangObj?.title,
        accessor: 'PostTitle',
        Cell: ({ row }) => (
          <div className="d-flex gap-1 align-items-center">
            {row.original.lessParticipantsDeadline === 1 ? <div className='participant-mark'></div> : ''}
            {row.original.isAnnouncement > 0 && <i className="icon-announce"></i>}
            <Link
              to={`/BulletinBoardPostDetails/${row.original.postId}/${row.original.boardId}`}
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
                <CIcon style={{ width: '10px' }} icon={cilFile} size="lg" />
              ) : (
                ''
              )}
              {row.original.images != null ? (
                <CIcon style={{ width: '10px' }} icon={cilImage} size="lg" />
              ) : (
                ''
              )}
            </div>
          </div>
        ),
      },
      {
        Header: multiLangObj?.writter,
        accessor: 'englishname',
        Cell: ({ row }) => (
          row.original.englishName === 'anonymous' ? <p>{row.original.englishName.charAt(0).toUpperCase() + row.original.englishName.slice(1)}</p> :
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
        Header: multiLangObj?.date,
        accessor: 'createdAt',
        Cell: ({ row }) => <p>{moment(row.original.createdAt).format('YYYY-MM-DD HH:mm:ss')} </p>,
      },
      {
        Header: multiLangObj?.likes,
        accessor: 'likes',
        Cell: ({ row }) => (
          <p className="text-center">{`${row.original.likes ? row.original.likes : 0}`}</p>
        ),
      },
      {
        Header: multiLangObj?.comments,
        accessor: 'comments',
        Cell: ({ row }) => (
          <p className="text-center">{`${row.original.comments ? row.original.comments : 0}`}</p>
        ),
      },
      {
        Header: multiLangObj?.views,
        accessor: 'views',
        Cell: ({ row }) => (
          <p className="text-center">{`${row.original.views ? row.original.views : 0}`}</p>
        ),
      },
      {
        Header: multiLangObj?.noOfReportedComments,
        accessor: 'reportsCommentsCount',
        Cell: ({ row }) => (
          <p className="text-center">
            {row.original.reportsCommentsCount ? row.original.reportsCommentsCount : 0}
          </p>
        ),
      },
      {
        Header: multiLangObj?.history,
        Cell: ({ row }) => (
          <a
            role="button"
            onClick={() => viewPostHistoryHandler(row.original.postId)}
            className="blueTxt text-center"
          >
           {multiLangObj?.view}
          </a>
        ),
      },
      {
        Header: multiLangObj?.modify,
        Cell: ({ row }) => (
          <Link
            onClick={(e) => modifyPostHandler(e, row)}
            className="greenTxt   text-center"
            style={{ curser: 'pointer' }}
          >
            {multiLangObj?.edit}
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
      <div className="pageTitle mb-3 pb-2">
          <h2>{multiLangObj?.bulletinBoardInfo}</h2>
        </div>
        <div>
          <div className="d-flex justify-content-end align-items-center">

            <CButton onClick={createPostHandler} className='btn-success'>{multiLangObj?.createPost}</CButton>
          </div>
          <div className="d-flex p-3 justify-content-between h-100 w-100 bg-light  mt-2">
            <div className="d-flex align-items-center w-25 ms-2 align-items-center">
              <p className="fw-medium me-3" style={{ 'white-space': 'nowrap' }}>
                {multiLangObj?.board}
              </p>
              <CFormSelect

                aria-label="Default select example"
                options={boardSelectOptions}
                onChange={handleSelectBoardChange}
              />
            </div>
            <div className="d-flex align-items-center  ms-2 align-items-center">
              <p className="fw-medium me-1">{multiLangObj?.usageStatus} :</p>
              <p>{boardDetails?.usageStatus ? boardDetails?.usageStatus : '-'}</p>
            </div>
            <div className="d-flex align-items-center  ms-2 align-items-center">
              <p className="fw-medium me-1">{multiLangObj?.permissionToWrite} :</p>
              <p>
                {boardDetails?.isAdminOnly === 0 || boardDetails?.isAdminOnly === 1
                  ? boardDetails?.isAdminOnly === 0
                    ? 'All'
                    : 'Admin only'
                  : '-'}
              </p>
            </div>
            <div className="d-flex align-items-center me-2 align-items-center">
              <p className="fw-medium me-1">{multiLangObj?.annonymousBoard} :</p>
              <p>
                {boardDetails?.annonymousBoard === 0 || boardDetails?.annonymousBoard === 1
                  ? boardDetails?.annonymousBoard === 0
                    ? 'No'
                    : 'Yes'
                  : '-'}
              </p>
            </div>
          </div>
          <div className="d-flex p-4  flex-column bg-light  mt-3">
            <div className="d-flex align-items-center w-100">
              <div className="d-flex align-items-center me-5">
                <label className="me-3 fw-medium">{multiLangObj?.department}</label>
                <CFormSelect
                  className="w-50 me-2"
                  aria-label="Default select example"
                  options={boardDetails?.annonymousBoard === 0 || boardID === 0 ? [
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
                  placeholder='Search'
                />
              </div>
              <div className="d-flex align-items-center">
                <label className="me-3 fw-medium">{multiLangObj?.date}</label>
                <div className="d-flex p-2 gap-3 ">
                  <DatePicker value={startDate} onChange={handleStartDate} />
                  <DatePicker value={endDate} onChange={handleEndDate} />
                </div>
              </div>
            </div>
            <div className="d-flex align-items-center w-100 mt-2">
              <div className="d-flex align-items-center me-5 ">
                <label className="fw-medium me-3 " style={{ 'white-space': 'nowrap' }}>
                  {multiLangObj?.postType}
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
                <label className="fw-medium  me-3">{multiLangObj?.classification}</label>
                <CFormSelect
                  className="me-2"
                  aria-label="Default select example"
                  options={filterData.posttype === '' ? [{ label: 'All', value: '' }, ...(classificationsTypeOptions['default'] || [])] : [
                    { label: 'All', value: '' },
                    ...(classificationsTypeOptions[filterData.posttype] || []),
                  ]}
                  onChange={handleClassificationChange}
                  value={filterData.classification}
                  disabled={!filterData.posttype}
                />
              </div>
              <div className="d-flex align-items-center me-5">
                <label className="fw-medium me-3">{multiLangObj?.reported}</label>
                <CFormSelect
                  className="me-2"
                  aria-label="Default select example"
                  options={[{ label: 'All', value: '' }, ...reportedOptions]}
                  onChange={handleReportedChange}
                  value={filterData.reported}
                />
              </div>
            </div>
            <div className="d-flex gap-3 mt-3 justify-content-end">
              <CButton onClick={handleSearchfilter}>{multiLangObj?.search}</CButton>
              <CButton onClick={resetFilter} className='btn-black'>{multiLangObj?.reset}</CButton>
            </div>
          </div>
          <div className="d-flex flex-column mt-3 p-3">
           <div className='mb-3'>
           {totalDataCount > 0 && <p style={{ margin: 0 }}>{multiLangObj?.total}&nbsp;:&nbsp; {totalDataCount}</p>}
           </div>
            <ReactTable
              columns={columns}
              data={postData}
              showCheckbox={false}
              onSelectionChange={handleSelectionChange}
            />
            <div className="d-flex w-100 justify-content-center align-items-center my-3 gap-3">
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
                <div className="d-flex align-items-center gap-2 ">
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
            <CModalTitle className="p-1">{multiLangObj?.userInfo}</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <div className="UserInfoList">
              <p><b>{multiLangObj?.userName} :</b> {userInfoData.englishName ? userInfoData.englishName : '-'}</p>
              <p><b>{multiLangObj?.grpTeam} :</b> {userInfoData.teamName ? userInfoData.teamName : '-'} </p>
              <p><b>{multiLangObj?.emailAdd} :</b> {userInfoData.email ? userInfoData.email : '-'}</p>
            </div>
          </CModalBody>
        </CModal>
      </main>
    </>
  )
}

export default BoardPostListing
