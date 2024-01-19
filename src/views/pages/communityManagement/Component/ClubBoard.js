import {
  CButton,
  CForm,
  CFormCheck,
  CFormInput,
  CFormSelect,
  CFormSwitch,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'
import React, { useEffect, useMemo, useState } from 'react'
import './boardManagement.scss'
import ReactTable from 'src/components/common/ReactTable'
import { ALL_CONSTANTS, API_ENDPOINT } from 'src/utils/config'
import { getApi, postApi } from 'src/utils/Api'
import ReactPaginate from 'react-paginate'
import { paginationItemPerPageOptions } from 'src/utils/constant'
import DatePicker from 'react-date-picker'
import { enqueueSnackbar } from 'notistack'

const ClubBoard = () => {
  const [showClubPeriod, setShowClubPeriod] = useState(false)
  const [showClubBanner, setShowClubBanner] = useState(false)
  const [clubActivityListPopup, setClubActivityListPopup] = useState(false)
  const [totalPages, setTotalPages] = useState(0)
  const [clubPeriodData, setClubPeriodData] = useState({})
  const [totalclubPeriodDataCount, setTotalclubPeriodDataCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [viewActivityRegistrationId, setViewActivityRegistrationId] = useState('')
  const [addModifyClubPeriodModal, setAddModifyClubPeriodModal] = useState(false)
  const [currentPageOfClubActivity, setCurrentPageOfClubActivity] = useState(0)
  const [itemsPerPageOfClubActivity, setItemsPerPageOfClubActivity] = useState(5)
  const [totalPagesOfClubActivity, setTotalPagesOfClubActivity] = useState(0)

  const [periodId, setPeriodId] = useState('')
  const [clubTitle, setClubTitle] = useState('')
  const [registrationStart, setRegistrationStart] = useState('')
  const [registrationEnd, setRegistrationEnd] = useState('')
  const [recruitmentStart, setRecruitmentStart] = useState('')
  const [recruitmentEnd, setRecruitmentEnd] = useState('')
  const [minParticipants, setMinParticipants] = useState(1)
  const [maxParticipantsPerGroup, setMaxParticipantsPerGroup] = useState(10)
  const [searchTxt, setSearchTxt] = useState('')
  const [clubActivityListData, setClubActivityListData] = useState({})

  const [addModifyClubBannerModal, setAddModifyClubBannerModal] = useState(false)
  const [bannerTitle, setBannerTitle] = useState('')
  const [bannerStartDate, setBannerStartDate] = useState('')
  const [bannerStartHours, setBannerStartHours] = useState('00')
  const [bannerStartMins, setBannerStartMins] = useState('00')
  const [bannerEndDate, setBannerEndDate] = useState('')
  const [bannerEndHours, setBannerEndHours] = useState('00')
  const [bannerEndMins, setBannerEndMins] = useState('00')
  const [uploadedBannerImage, setUploadedBannerImage] = useState('')
  const [imageType, setImageType] = useState('bannerImageOnly')
  const [linkToUrl, setLinkToUrl] = useState('')
  const [popupImage, setPopupImage] = useState('')
  const [clubBannerData, setClubBannerData] = useState({})
  const [totalclubBannerDataCount, setTotalclubBannerDataCount] = useState(0)
  const [currentPageClubBanner, setCurrentPageClubBanner] = useState(0)
  const [itemsPerPageClubBanner, setItemsPerPageClubBanner] = useState(5)
  const [totalPagesClubBanner, setTotalPagesClubBanner] = useState(0)
  const [clubBannerImagesFromDB, setClubBannerImagesFromDB] = useState([])

  const getClubRegistrationPeriodsBySearch = async (id) => {
    if (searchTxt.trim() === '') {
      getClubRegistrationPeriods()
      return false
    }
    try {
      let url = `${API_ENDPOINT.get_search_club_registration_periods}?pageNo=${
        currentPage + 1
      }&limit=${itemsPerPage}&term=${searchTxt}`
      const res = await getApi(url)
      if (res.status === 200) {
        setClubPeriodData(res.results)
        setTotalclubPeriodDataCount(res.totalCount)
        setTotalPages(Math.ceil(res.totalCount / Number(itemsPerPage)))
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getClubRegistrationPeriods = async () => {
    try {
      let url = `${API_ENDPOINT.get_club_registration_periods}?pageNo=${
        currentPage + 1
      }&limit=${itemsPerPage}`
      const res = await getApi(url)

      if (res.status === 200) {
        setClubPeriodData(res.data)
        setTotalclubPeriodDataCount(res.totalCount)
        setTotalPages(Math.ceil(res.totalCount / Number(itemsPerPage)))
      }
    } catch (error) {
      console.log(error)
    }
  }

  const modifyClubPeriodHandler = (
    id,
    title,
    registrationStart,
    registrationEnd,
    recruitmentStart,
    recruitmentEnd,
    minParticipants,
    maxParticipantsPerGroup,
  ) => {
    setPeriodId(id)
    setAddModifyClubPeriodModal(true)
    setClubTitle(title)
    setRegistrationStart(registrationStart)
    setRegistrationEnd(registrationEnd)
    setRecruitmentStart(recruitmentStart)
    setRecruitmentEnd(recruitmentEnd)
    setMinParticipants(minParticipants)
    setMaxParticipantsPerGroup(maxParticipantsPerGroup)
  }

  const clubPeriodDataColumns = useMemo(
    () => [
      {
        Header: <p className="text-center">No</p>,
        accessor: 'number',
        Cell: ({ row }) => {
          return currentPage * itemsPerPage + (row.index + 1)
        },
      },
      {
        Header: <p className="text-center">Title</p>,
        accessor: 'PostTypes',
        Cell: ({ row }) => (
          <p
            role="button"
            onClick={() =>
              modifyClubPeriodHandler(
                row.original.id,
                row.original.title,
                row.original.registrationPeriodStart,
                row.original.registrationPeriodEnd,
                row.original.recruitmentPeriodStart,
                row.original.recruitmentPeriodEnd,
                row.original.minParticipants,
                row.original.maxParticipantsPerGroup,
              )
            }
            className="text-center"
          >
            {row.original.title}
          </p>
        ),
      },
      {
        Header: <p className="text-center">Registration Period</p>,
        accessor: 'regPeriod',
        Cell: ({ row }) => (
          <p role="button" className="text-center">
            {new Date(row.original.registrationPeriodStart).toLocaleDateString()} -{' '}
            {new Date(row.original.registrationPeriodEnd).toLocaleDateString()}
          </p>
        ),
      },
      {
        Header: <p className="text-center">1st Deadline</p>,
        accessor: 'firstDeadline',
        Cell: ({ row }) => (
          <p role="button" className="text-center">
            {new Date(row.original.firstDeadline).toLocaleDateString()}
          </p>
        ),
      },
      {
        Header: <p className="text-center">Recruitment Period</p>,
        accessor: 'recPeriod',
        Cell: ({ row }) => (
          <p role="button" className="text-center">
            {new Date(row.original.recruitmentPeriodStart).toLocaleDateString()} -{' '}
            {new Date(row.original.recruitmentPeriodEnd).toLocaleDateString()}
          </p>
        ),
      },
      {
        Header: <p className="text-center">Final Deadline</p>,
        accessor: 'finalDeadline',
        Cell: ({ row }) => (
          <p role="button" className="text-center">
            {new Date(row.original.finalDeadline).toLocaleDateString()}
          </p>
        ),
      },
      {
        Header: <p className="text-center">Min. participant limit</p>,
        accessor: 'minPart',
        Cell: ({ row }) => (
          <p role="button" className="text-center">
            {row.original.minParticipants}
          </p>
        ),
      },
      {
        Header: <p className="text-center">Max. same group limit</p>,
        accessor: 'maxLimit',
        Cell: ({ row }) => (
          <p role="button" className="text-center">
            {row.original.maxParticipantsPerGroup}
          </p>
        ),
      },
      {
        Header: <p className="text-center">No. Club Activities</p>,
        accessor: 'clubAct',
        Cell: ({ row }) => (
          <p role="button" className="text-center">
            -
          </p>
        ),
      },
      {
        Header: <p className="text-center">Total No. of Participants</p>,
        accessor: 'totNoOfPart',
        Cell: ({ row }) => (
          <p role="button" className="text-center">
            -
          </p>
        ),
      },
      {
        Header: <p className="text-center">Club activity list</p>,
        accessor: 'clubActList',
        Cell: ({ row }) => (
          <p
            role="button"
            onClick={() => viewActivityList(row.original.id)}
            className="text-center"
          >
            View
          </p>
        ),
      },
    ],
    [currentPage, itemsPerPage],
  )

  const clubActivityListColumns = useMemo(
    () => [
      {
        Header: <p className="text-center">No</p>,
        accessor: 'number',
        // Cell: ({ row }) => {
        //   return <p className="text-center">{row.index + 1}</p>
        // },
        Cell: ({ row }) => {
          return currentPageOfClubActivity * itemsPerPageOfClubActivity + (row.index + 1)
        },
      },
      {
        Header: <p className="text-center">Club</p>,
        accessor: 'club',
        Cell: ({ row }) => <p className="text-center">{row.original.clubName} </p>,
      },
      {
        Header: <p className="text-center">Activity</p>,
        accessor: 'activity',
        Cell: ({ row }) => <p className="text-center">{row.original.activity} </p>,
      },
      {
        Header: <p className="text-center">Host</p>,
        accessor: 'host',
        Cell: ({ row }) => <p className="text-center">{row.original.host} </p>,
      },
      {
        Header: <p className="text-center">No. of Participants</p>,
        accessor: 'noOfParticipants',
        Cell: ({ row }) => <p className="text-center">{row.original.participants} </p>,
      },
      {
        Header: <p className="text-center">History</p>,
        accessor: 'history',
        Cell: ({ row }) => (
          <p
            role="button"
            onClick={() => alert('Work In Progress : ' + row.original.recruitmentId)}
            className="text-center"
          >
            View
          </p>
        ),
      },
    ],
    [currentPageOfClubActivity, itemsPerPageOfClubActivity],
  )

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected)
  }

  const handlePageChangeClubBanner = (selectedPage) => {
    setCurrentPageClubBanner(selectedPage.selected)
  }

  const handlePageChangeOfClubActivity = (selectedPage) => {
    setCurrentPageOfClubActivity(selectedPage.selected)
  }

  const handleShowClubPeriodToggle = () => {
    setShowClubPeriod((prev) => !prev)
  }

  const handleShowClubBannerToggle = () => {
    setShowClubBanner((prev) => !prev)
  }

  const cancelBannerModalHandler = () => {
    setAddModifyClubBannerModal(false)
  }

  const validateClubBannerHandler = () => {
    if (bannerTitle.trim() === '') {
      enqueueSnackbar('Please enter title', { variant: 'error' })
      return false
    } else if (bannerStartDate === '') {
      enqueueSnackbar('Please select start date', { variant: 'error' })
      return false
    } else if (bannerStartHours === '00' && bannerStartMins === '00') {
      enqueueSnackbar('Please select start time', { variant: 'error' })
      return false
    } else if (bannerEndDate === '') {
      enqueueSnackbar('Please select end date', { variant: 'error' })
      return false
    } else if (bannerEndHours === '00' && bannerEndMins === '00') {
      enqueueSnackbar('Please select end time', { variant: 'error' })
      return false
    } else if (uploadedBannerImage === '') {
      enqueueSnackbar('Please upload banner image', { variant: 'error' })
      return false
    } else if (imageType === 'linkTo' && linkToUrl === '') {
      enqueueSnackbar('Please enter url', { variant: 'error' })
      return false
    } else if (imageType === 'popUpImage' && popupImage === '') {
      enqueueSnackbar('Please upload popup image', { variant: 'error' })
      return false
    } else {
      saveClubBannerHandler()
    }
  }

  const saveClubBannerHandler = async () => {
    try {
      const formData = new FormData()
      formData.append('title', bannerTitle)
      formData.append(
        'startDateTime',
        new Date(bannerStartDate + 'T' + bannerStartHours + ':' + bannerStartMins),
      )
      formData.append(
        'endDateTime',
        new Date(bannerEndDate + 'T' + bannerEndHours + ':' + bannerEndHours),
      )
      formData.append('image', uploadedBannerImage)
      formData.append('type', imageType)
      if (imageType === 'linkTo') {
        formData.append('linkUrl', linkToUrl)
      }
      if (imageType === 'popUpImage') {
        formData.append('popUpImage', popupImage)
      }
      const res = await postApi(API_ENDPOINT.create_club_banner, formData)
      if (res.status === 200) {
        enqueueSnackbar('Club Banner Added Successfully', { variant: 'success' })
      }
      setAddModifyClubBannerModal(false)
    } catch (error) {
      console.log(error)
    }
  }

  const handleBannerStartDate = (event) => {
    let d = new Date(event),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear()
    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day
    setBannerStartDate([year, month, day].join('-'))
  }

  const bannerStartTimeHandler = (e) => {
    setBannerStartHours(e.target.value.split(':')[0])
    setBannerStartMins(e.target.value.split(':')[1])
  }

  const handleBannerEndDate = (event) => {
    let d = new Date(event),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear()
    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day
    setBannerEndDate([year, month, day].join('-'))
  }

  const bannerEndTimeHandler = (e) => {
    setBannerEndHours(e.target.value.split(':')[0])
    setBannerEndMins(e.target.value.split(':')[1])
  }

  const getClubBanners = async () => {
    try {
      let url = `${API_ENDPOINT.get_club_banners}?offset=${currentPage + 1}&limit=${itemsPerPage}`
      const res = await getApi(url)

      if (res.status === 200) {
        setClubBannerData(res.data)

        //     const images = await urlsToFiles(respData?.images)
        // setUploadedImages(images)
        // const files = await urlsToFiles(respData?.attachments)
        // setUploadedFiles(files)

        setTotalclubBannerDataCount(res.totalCount)
        setTotalPagesClubBanner(Math.ceil(res.totalCount / Number(itemsPerPageClubBanner)))
      }
    } catch (error) {
      console.log(error)
    }
  }

  async function urlToBlob(url) {
    const response = await fetch(url)
    const blob = await response.blob()
    return blob
  }

  const urlToFiles = async (url) => {
    console.log(url)
    const blob = await urlToBlob(ALL_CONSTANTS.BASE_URL + url)
    const fileName = url
    return new File([blob], fileName, { type: blob.type })
  }

  const getImageUrl = async (image) => {
    return await urlToFiles(image)
  }

  const clubBannerDataColumns = useMemo(
    () => [
      {
        Header: <p className="text-center">No</p>,
        accessor: 'number',
        Cell: ({ row }) => {
          return currentPageClubBanner * itemsPerPageClubBanner + (row.index + 1)
        },
      },
      {
        Header: <p className="text-center">Thumbnail Image</p>,
        accessor: 'regPeriod',
        Cell: ({ row }) => (
          <div style={{ width: '150px', height: '100px' }}>
            <img
              crossOrigin="anonymous"
              style={{ width: '150px', height: '100px' }}
              src={ALL_CONSTANTS.BASE_URL + row.original.image}
              alt=""
            />
          </div>
        ),
      },
      {
        Header: <p className="text-center">Title</p>,
        accessor: 'firstDeadline',
        Cell: ({ row }) => (
          <p role="button" className="text-center">
            {row.original.title}
          </p>
        ),
      },
      {
        Header: <p className="text-center">Posting Period</p>,
        accessor: 'recPeriod',
        Cell: ({ row }) => (
          <p role="button" className="text-center">
            {new Date(row.original.startDateTime).toLocaleString()} -{' '}
            {new Date(row.original.endDateTime).toLocaleString()}
          </p>
        ),
      },
      {
        Header: <p className="text-center">Status</p>,
        accessor: 'finalDeadline',
        Cell: ({ row }) => (
          <p role="button" className="text-center">
            {row.original.status}
          </p>
        ),
      },
      {
        Header: <p className="text-center">Type</p>,
        accessor: 'minPart',
        Cell: ({ row }) => (
          <p role="button" className="text-center">
            {row.original.type}
          </p>
        ),
      },
      {
        Header: <p className="text-center">Action</p>,
        accessor: 'maxLimit',
        Cell: ({ row }) => (
          <p role="button" className="text-center">
            Delete
          </p>
        ),
      },
    ],
    [currentPageClubBanner, itemsPerPageClubBanner],
  )

  const viewActivityList = async (id = viewActivityRegistrationId) => {
    if (viewActivityRegistrationId === '' && id === '') {
      return false
    }
    if (!viewActivityRegistrationId) {
      setViewActivityRegistrationId(id)
    }
    setClubActivityListPopup(true)
    try {
      let url = `${API_ENDPOINT.get_club_activity_list}?pageNo=${
        currentPageOfClubActivity + 1
      }&limit=${itemsPerPageOfClubActivity}&registrationId=${id}`
      const res = await getApi(url)
      if (res.status === 200) {
        setClubActivityListData(res.data)
        setTotalPagesOfClubActivity(Math.ceil(res.totalCount / Number(itemsPerPageOfClubActivity)))
      }
    } catch (error) {
      console.log(error)
    }
  }

  const addNewClubBannerHandler = () => {
    setAddModifyClubBannerModal(true)
  }

  const addNewClubPeriodHandler = () => {
    setPeriodId('')
    setClubTitle('')
    setRegistrationStart('')
    setRegistrationEnd('')
    setRecruitmentStart('')
    setRecruitmentEnd('')
    setMinParticipants(1)
    setMaxParticipantsPerGroup(10)
    setAddModifyClubPeriodModal(true)
  }
  const saveClubPeriodHandler = async () => {
    try {
      const body = {
        title: clubTitle,
        registrationStart: new Date(registrationStart),
        registrationEnd: new Date(registrationEnd),
        recruitmentStart: new Date(recruitmentStart),
        recruitmentEnd: new Date(recruitmentEnd),
        minParticipants: minParticipants,
        maxParticipantsPerGroup: maxParticipantsPerGroup,
      }
      let res = ''
      if (periodId) {
        body.periodId = periodId
        res = await postApi(API_ENDPOINT.update_club_registration_period, body)
      } else {
        res = await postApi(API_ENDPOINT.create_club_registration_period, body)
      }

      if (res.status === 200) {
        if (periodId) {
          enqueueSnackbar('Club  Period/Qualification Updated Successfully', { variant: 'success' })
        } else {
          enqueueSnackbar('Club  Period/Qualification Registered Successfully', {
            variant: 'success',
          })
        }
        setPeriodId('')
        setClubTitle('')
        setRegistrationStart('')
        setRegistrationEnd('')
        setRecruitmentStart('')
        setRecruitmentEnd('')
        setMinParticipants(1)
        setMaxParticipantsPerGroup(10)
        setAddModifyClubPeriodModal(false)
        setSearchTxt('')
        getClubRegistrationPeriods()
      }
    } catch (error) {
      console.log(error)
    }
  }

  const cancelPeriodModalHandler = () => {
    setAddModifyClubPeriodModal(false)
  }

  const validateClubPeriodHandler = () => {
    if (clubTitle.trim() === '') {
      enqueueSnackbar('Please enter title', { variant: 'error' })
      return false
    } else if (registrationStart === '') {
      enqueueSnackbar('Please select registration start date', { variant: 'error' })
      return false
    } else if (registrationEnd === '') {
      enqueueSnackbar('Please select registration end date', { variant: 'error' })
      return false
    } else if (recruitmentStart === '') {
      enqueueSnackbar('Please select recruitment start date', { variant: 'error' })
      return false
    } else if (recruitmentEnd === '') {
      enqueueSnackbar('Please select recruitment end date', { variant: 'error' })
      return false
    } else {
      saveClubPeriodHandler()
    }
  }

  const handleRegistrationStartChange = (event) => {
    let d = new Date(event),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear()
    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day
    setRegistrationStart([year, month, day].join('-'))
  }

  const handleRegistrationEndChange = (event) => {
    let d = new Date(event),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear()
    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day
    setRegistrationEnd([year, month, day].join('-'))
  }

  const handleRecruitStartChange = (event) => {
    let d = new Date(event),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear()
    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day
    setRecruitmentStart([year, month, day].join('-'))
  }

  const handleRecruitEndChange = (event) => {
    let d = new Date(event),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear()
    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day
    setRecruitmentEnd([year, month, day].join('-'))
  }
  useEffect(() => {
    if (searchTxt.trim() === '') {
      getClubRegistrationPeriods()
    } else {
      getClubRegistrationPeriodsBySearch()
    }
  }, [currentPage, itemsPerPage])

  useEffect(() => {
    getClubBanners()
  }, [currentPageClubBanner, itemsPerPageClubBanner])

  useEffect(() => {
    viewActivityList()
  }, [currentPageOfClubActivity, itemsPerPageOfClubActivity])
  return (
    <div>
      <div className="toggleContainer">
        <div>Club Period/Qualification</div>
        <div>
          <CFormSwitch
            id="club_period_qualification"
            className="cFormSwitch"
            onClick={handleShowClubPeriodToggle}
            defaultChecked={showClubPeriod}
          />
        </div>
      </div>
      {showClubPeriod && (
        <div>
          <CForm className="d-flex">
            <CFormInput
              className="me-sm-2"
              placeholder="Search"
              size="sm"
              value={searchTxt}
              onChange={(e) => setSearchTxt(e.target.value)}
            />
            <CButton
              color="dark"
              className="my-2 my-sm-0"
              type="button"
              onClick={getClubRegistrationPeriodsBySearch}
            >
              Search
            </CButton>
          </CForm>
          <CForm className="d-flex justify-content-end mt-2">
            <CButton
              color="dark"
              className="my-2 my-sm-0 ps-3 pe-4"
              type="button"
              onClick={addNewClubPeriodHandler}
            >
              Add
            </CButton>
          </CForm>
          {totalclubPeriodDataCount > 0 && (
            <p style={{ margin: 0 }}>Total&nbsp;:&nbsp; {totalclubPeriodDataCount}</p>
          )}
          <ReactTable
            columns={clubPeriodDataColumns}
            data={clubPeriodData}
            showCheckbox={false}
            onSelectionChange={() => {}}
          />
          <div className="d-flex w-100 justify-content-center gap-3">
            {clubPeriodData?.length > 0 && (
              <div className="userlist-pagination">
                <div className="userlist-pagination dataTables_paginate">
                  <ReactPaginate
                    breakLabel={'...'}
                    marginPagesDisplayed={1}
                    previousLabel={<button>Previous</button>}
                    nextLabel={<button>Next</button>}
                    pageCount={totalPagesClubBanner}
                    onPageChange={handlePageChange}
                    forcePage={currentPage}
                    renderOnZeroPageCount={null}
                    pageRangeDisplayed={4}
                  />
                </div>
              </div>
            )}
            {clubPeriodData?.length > 0 && (
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
          <CModal
            className="modal-lg"
            alignment="center"
            visible={clubActivityListPopup}
            onClose={() => {
              setClubActivityListPopup(false)
            }}
            backdrop="static"
            aria-labelledby="LiveDemoExampleLabel"
          >
            <CModalHeader
              onClose={() => {
                setClubActivityListPopup(false)
              }}
            >
              <CModalTitle className="p-1">Club Activity List</CModalTitle>
            </CModalHeader>
            <CModalBody>
              {clubActivityListData.length > 0 && (
                <ReactTable
                  columns={clubActivityListColumns}
                  data={clubActivityListData}
                  onSelectionChange={() => {
                    console.log('no action')
                  }}
                  showCheckbox={false}
                />
              )}
              <div className="d-flex w-100 justify-content-center gap-3">
                {clubActivityListData?.length > 0 && (
                  <div className="userlist-pagination">
                    <div className="userlist-pagination dataTables_paginate">
                      <ReactPaginate
                        breakLabel={'...'}
                        marginPagesDisplayed={1}
                        previousLabel={<button>Previous</button>}
                        nextLabel={<button>Next</button>}
                        pageCount={totalPagesOfClubActivity}
                        onPageChange={handlePageChangeOfClubActivity}
                        forcePage={currentPageOfClubActivity}
                        renderOnZeroPageCount={null}
                        pageRangeDisplayed={4}
                      />
                    </div>
                  </div>
                )}
                {clubActivityListData?.length > 0 && (
                  <div className="d-flex align-items-center gap-2 mt-2">
                    <label>Show</label>
                    <CFormSelect
                      className=""
                      aria-label=""
                      options={paginationItemPerPageOptions}
                      onChange={(event) => {
                        setItemsPerPageOfClubActivity(parseInt(event?.target?.value))
                        setCurrentPageOfClubActivity(0)
                      }}
                    />
                    <label>Lists</label>
                  </div>
                )}
              </div>
              {clubActivityListData.length === 0 && <>No Data Available</>}
            </CModalBody>
          </CModal>

          <CModal
            className="modal-md"
            alignment="center"
            visible={addModifyClubPeriodModal}
            onClose={() => {
              setAddModifyClubPeriodModal(false)
            }}
            backdrop="static"
            aria-labelledby="LiveDemoExampleLabel"
          >
            <CModalHeader
              onClose={() => {
                setAddModifyClubPeriodModal(false)
              }}
            >
              <CModalTitle className="p-1">Club Period/Qualification Registration</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <CFormInput
                type="text"
                placeholder="Enter Title Here"
                className="txt-poll-title"
                name="pollTitle"
                value={clubTitle}
                onChange={(e) => {
                  setClubTitle(e.target.value)
                }}
              />
              <div className="deadline-container mt-2">
                <h5>Club Period Setting</h5>
              </div>
              <div className="deadline-container">
                <div className="deadline-label">Registration Period</div>
              </div>
              <div className="d-flex gap-3  mb-2">
                <div>
                  <DatePicker
                    value={registrationStart}
                    onChange={(event) => handleRegistrationStartChange(event)}
                  />
                </div>
                <div>
                  <DatePicker
                    value={registrationEnd}
                    onChange={(event) => handleRegistrationEndChange(event)}
                  />
                </div>
                <div>
                  <div>1st Deadline</div>
                  <div>YYYY.MM.DD</div>
                </div>
              </div>
              <div className="deadline-container">
                <div className="deadline-label">Recruitment Period</div>
              </div>
              <div className="d-flex gap-3 mb-2">
                <div>
                  <DatePicker
                    value={recruitmentStart}
                    onChange={(event) => handleRecruitStartChange(event)}
                  />
                </div>
                <div>
                  <DatePicker
                    value={recruitmentEnd}
                    onChange={(event) => handleRecruitEndChange(event)}
                  />
                </div>
                <div>
                  <div>last Deadline</div>
                  <div>YYYY.MM.DD</div>
                </div>
              </div>
              <div className="deadline-container">
                <h5>No. of Participants Setting</h5>
              </div>
              <div className="deadline-container">
                <div className="deadline-label w-50">Min. participant limit</div>

                <div className="d-flex gap-3 align-items-center">
                  <div className="">Over</div>
                  <CFormSelect
                    options={[
                      { label: '1', value: '1' },
                      { label: '2', value: '2' },
                      { label: '3', value: '3' },
                      { label: '4', value: '4' },
                      { label: '5', value: '5' },
                      { label: '6', value: '6' },
                      { label: '7', value: '7' },
                      { label: '8', value: '8' },
                      { label: '9', value: '9' },
                      { label: '10', value: '10' },
                    ]}
                    value={minParticipants}
                    onChange={(e) => setMinParticipants(e.target.value)}
                  />
                </div>
              </div>
              <div className="deadline-container">
                <div className="deadline-label w-50">Max. same group limit</div>

                <div className="d-flex gap-3 align-items-center">
                  <span style={{ whitespace: 'nowrap' }}>No More Than</span>
                  <CFormSelect
                    className="w-50"
                    options={[
                      { label: '10', value: '10' },
                      { label: '20', value: '20' },
                      { label: '30', value: '30' },
                      { label: '40', value: '40' },
                      { label: '50', value: '50' },
                      { label: '60', value: '60' },
                      { label: '70', value: '70' },
                      { label: '80', value: '80' },
                      { label: '90', value: '90' },
                      { label: '100', value: '100' },
                    ]}
                    value={maxParticipantsPerGroup}
                    onChange={(e) => setMaxParticipantsPerGroup(e.target.value)}
                  />
                  <span>%</span>
                </div>
              </div>
              <div className="d-flex justify-content-center gap-3 mt-5">
                <CButton onClick={cancelHandler}>Cancel</CButton>
                <CButton onClick={saveHandler}>{periodId ? 'Update' : 'Save'}</CButton>
              </div>
            </CModalBody>
          </CModal>
        </div>
      )}
      <div className="toggleContainer">
        <div>Club Banner</div>
        <div>
          <CFormSwitch
            id="club_banner"
            className="cFormSwitch"
            onClick={handleShowClubBannerToggle}
            defaultChecked={showClubBanner}
          />
        </div>
      </div>
      {showClubBanner && (
        <div>
          <CForm className="d-flex justify-content-end mt-2">
            <CButton
              color="dark"
              className="my-2 my-sm-0 ps-3 pe-4"
              type="button"
              onClick={addNewClubBannerHandler}
            >
              Add
            </CButton>
          </CForm>
          {totalclubBannerDataCount > 0 && (
            <p style={{ margin: 0 }}>Total&nbsp;:&nbsp; {totalclubBannerDataCount}</p>
          )}
          <ReactTable
            columns={clubBannerDataColumns}
            data={clubBannerData}
            showCheckbox={false}
            onSelectionChange={() => {}}
          />
          <div className="d-flex w-100 justify-content-center gap-3">
            {clubBannerData?.length > 0 && (
              <div className="userlist-pagination">
                <div className="userlist-pagination dataTables_paginate">
                  <ReactPaginate
                    breakLabel={'...'}
                    marginPagesDisplayed={1}
                    previousLabel={<button>Previous</button>}
                    nextLabel={<button>Next</button>}
                    pageCount={totalPagesClubBanner}
                    onPageChange={handlePageChangeClubBanner}
                    forcePage={currentPageClubBanner}
                    renderOnZeroPageCount={null}
                    pageRangeDisplayed={4}
                  />
                </div>
              </div>
            )}
            {clubPeriodData?.length > 0 && (
              <div className="d-flex align-items-center gap-2 mt-2">
                <label>Show</label>
                <CFormSelect
                  className=""
                  aria-label=""
                  options={paginationItemPerPageOptions}
                  onChange={(event) => {
                    setItemsPerPageClubBanner(parseInt(event?.target?.value))
                    setCurrentPageClubBanner(0)
                  }}
                />
                <label>Lists</label>
              </div>
            )}
          </div>

          <CModal
            className="modal-lg"
            alignment="center"
            visible={addModifyClubBannerModal}
            onClose={() => {
              setAddModifyClubBannerModal(false)
            }}
            backdrop="static"
            aria-labelledby="LiveDemoExampleLabel"
          >
            <CModalHeader
              onClose={() => {
                setAddModifyClubBannerModal(false)
              }}
            >
              <CModalTitle className="p-1">Banner Registration</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <div className="card-body">
                <div className="formWraper">
                  <div className="form-outline form-white  d-flex ">
                    <div className="formWrpLabel">
                      <label className="fw-bolder ">
                        Banner Title <span className="mandatory-red-asterisk">*</span>
                      </label>
                    </div>
                    <div className="formWrpInpt">
                      <div className="d-flex formradiogroup mb-2 gap-3">
                        <CFormInput
                          type="text"
                          placeholder="Enter Title Here"
                          name="title"
                          value={bannerTitle}
                          onChange={(e) => {
                            setBannerTitle(e.target.value)
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="form-outline form-white  d-flex ">
                    <div className="formWrpLabel">
                      <label className="fw-bolder ">Posting Period</label>
                    </div>
                    <div className="upload-image-main-container">
                      <div className="upload-img-btn-and-info">
                        <div>
                          <DatePicker
                            value={bannerStartDate}
                            minDate={new Date()}
                            onChange={(event) => handleBannerStartDate(event)}
                          />
                        </div>
                        <div>
                          <input
                            type="time"
                            name="time"
                            id="time"
                            className="time-picker"
                            value={`${bannerStartHours}:${bannerStartMins}`}
                            onChange={(e) => bannerStartTimeHandler(e)}
                          />
                        </div>
                        -&nbsp;&nbsp;
                        <div>
                          <DatePicker
                            value={bannerEndDate}
                            minDate={new Date()}
                            onChange={(event) => handleBannerEndDate(event)}
                          />
                        </div>
                        <div>
                          <input
                            type="time"
                            name="time"
                            id="time"
                            className="time-picker"
                            value={`${bannerEndHours}:${bannerEndMins}`}
                            onChange={(e) => bannerEndTimeHandler(e)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="form-outline form-white  d-flex ">
                    <div className="formWrpLabel">
                      <label className="fw-bolder ">Upload Image</label>
                    </div>
                    <div className="upload-image-main-container">
                      <div className="upload-img-btn-and-info">
                        <div className="upload-container-btn">
                          <label className="label-btn" color="dark" htmlFor="imageFiles">
                            Upload
                            <input
                              type="file"
                              name="imageFiles"
                              id="imageFiles"
                              style={{ display: 'none' }}
                              accept=".png, .jpg, .jpeg, .gif"
                              onChange={(e) => setUploadedBannerImage(e.target.files[0])}
                            />
                          </label>
                        </div>
                        {uploadedBannerImage && (
                          <div className="upload-images-container uploadImgWrap">
                            <div className="thubmnail-img-container">
                              <img src={URL.createObjectURL(uploadedBannerImage)} alt="" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="form-outline form-white  d-flex ">
                    <div className="formWrpLabel">
                      <label className="fw-bolder ">Banner Type</label>
                    </div>
                    <div className="upload-image-main-container">
                      <div className="push-notification-container gap-3">
                        <CFormCheck
                          type="radio"
                          name="imageType"
                          defaultChecked={imageType === 'bannerImageOnly'}
                          onClick={() => {
                            setImageType('bannerImageOnly')
                            setLinkToUrl('')
                            setPopupImage('')
                          }}
                          label="Banner Image Only"
                          value={true}
                        />
                      </div>
                      <div className="push-notification-container gap-3">
                        <CFormCheck
                          type="radio"
                          name="imageType"
                          defaultChecked={imageType === 'linkTo'}
                          onClick={() => {
                            setImageType('linkTo')
                            setPopupImage('')
                          }}
                          label="Link To"
                          value={false}
                        />
                        <CFormInput
                          type="text"
                          placeholder="Enter URL"
                          name="title"
                          value={linkToUrl}
                          disabled={imageType !== 'linkTo'}
                          onChange={(e) => {
                            setLinkToUrl(e.target.value)
                          }}
                        />
                      </div>
                      <div className="push-notification-container gap-3">
                        <CFormCheck
                          type="radio"
                          name="imageType"
                          defaultChecked={imageType === 'popUpImage'}
                          onClick={() => {
                            setImageType('popUpImage')
                            setLinkToUrl('')
                          }}
                          label="Pop-up Image"
                          value={false}
                        />
                        <label
                          className="label-btn"
                          color="dark"
                          htmlFor="popupImg"
                          style={{ display: `${imageType === 'popUpImage' ? '' : 'none'}` }}
                        >
                          Upload
                          <input
                            type="file"
                            name="popupImg"
                            id="popupImg"
                            style={{ display: 'none', disabled: 'true' }}
                            accept=".png, .jpg, .jpeg, .gif"
                            onChange={(e) => setPopupImage(e.target.files[0])}
                          />
                        </label>
                      </div>
                      {imageType === 'popUpImage' && popupImage && (
                        <div className="upload-images-container uploadImgWrap">
                          <div className="thubmnail-img-container">
                            <img src={URL.createObjectURL(popupImage)} alt="" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-evenly">
                <CButton onClick={cancelBannerModalHandler}>Cancel</CButton>
                <CButton onClick={validateClubBannerHandler}>
                  {periodId ? 'Update' : 'Save'}
                </CButton>
              </div>
            </CModalBody>
          </CModal>
        </div>
      )}
    </div>
  )
}

export default ClubBoard
