import {
  CButton,
  CFooter,
  CForm,
  CFormCheck,
  CFormInput,
  CFormSelect,
  CFormSwitch,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'
import React, { useEffect, useMemo, useState } from 'react'
import './boardManagement.scss'
import ReactTable from 'src/components/common/ReactTable'
import { ALL_CONSTANTS, API_ENDPOINT } from 'src/utils/config'
import { deleteApi, getApi, postApi, putApi } from 'src/utils/Api'
import ReactPaginate from 'react-paginate'
import { paginationItemPerPageOptions } from 'src/utils/constant'
import DatePicker from 'react-date-picker'
import { enqueueSnackbar } from 'notistack'
import ConfirmationModal from 'src/utils/ConfirmationModal';
import CIcon from '@coreui/icons-react'
import * as icon from '@coreui/icons'
import { useTranslation } from 'react-i18next';


const ClubBoard = () => {

  const [modalProps, setModalProps] = useState({})

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
  const [clubHistoryData, setClubHistoryData] = useState([])
  const [clubHistoryInfoPopup, setClubHistoryInfoPopup] = useState(false)


  const [addModifyClubBannerModal, setAddModifyClubBannerModal] = useState(false)
  const [bannerUpdateId, setBannerUpdateId] = useState('')
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



  const { i18n } = useTranslation();
  const translationObject = i18n.getDataByLanguage(i18n.language);
  const multiLangObj = translationObject?.translation?.communityBoardManagement

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
        Header: <p className="text-center">{multiLangObj?.headerNo}</p>,
        accessor: 'number',
        Cell: ({ row }) => {
          return currentPage * itemsPerPage + (row.index + 1)
        },
      },
      {
        Header: <p className="text-center">{multiLangObj?.headerTitle}</p>,
        accessor: 'PostTypes',
        Cell: ({ row }) => (
          <a
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
          </a>
        ),
      },
      {
        Header: <p className="text-center">{multiLangObj?.headerRegistrationPeriod}</p>,
        accessor: 'regPeriod',
        Cell: ({ row }) => (
          <p role="button" className="text-center">
            {new Date(row.original.registrationPeriodStart).toLocaleDateString()} -{' '}
            {new Date(row.original.registrationPeriodEnd).toLocaleDateString()}
          </p>
        ),
      },
      {
        Header: <p className="text-center">{multiLangObj?.firstDeadline}</p>,
        accessor: 'firstDeadline',
        Cell: ({ row }) => (
          <p role="button" className="text-center">
            {new Date(row.original.firstDeadline).toLocaleDateString()}
          </p>
        ),
      },
      {
        Header: <p className="text-center">{multiLangObj?.headerRecruitmentPeriod}</p>,
        accessor: 'recPeriod',
        Cell: ({ row }) => (
          <p role="button" className="text-center">
            {new Date(row.original.recruitmentPeriodStart).toLocaleDateString()} -{' '}
            {new Date(row.original.recruitmentPeriodEnd).toLocaleDateString()}
          </p>
        ),
      },
      {
        Header: <p className="text-center">{multiLangObj?.headerFinalDeadline}</p>,
        accessor: 'finalDeadline',
        Cell: ({ row }) => (
          <p  className="text-center">
            {new Date(row.original.finalDeadline).toLocaleDateString()}
          </p>
        ),
      },
      {
        Header: <p className="text-center">{multiLangObj?.headerMinPartiLimit}</p>,
        accessor: 'minPart',
        Cell: ({ row }) => (
          <p className="text-center">
            {row.original.minParticipants}
          </p>
        ),
      },
      {
        Header: <p className="text-center">{multiLangObj?.headerMaxSameGrpLimit}</p>,
        accessor: 'maxLimit',
        Cell: ({ row }) => (
          <p className="text-center">
            {row.original.maxParticipantsPerGroup}
          </p>
        ),
      },
      {
        Header: <p className="text-center">{multiLangObj?.headerNoOdClubActs}</p>,
        accessor: 'clubAct',
        Cell: ({ row }) => (
          <p className="text-center">
            -
          </p>
        ),
      },
      {
        Header: <p className="text-center">{multiLangObj?.headerTotalNoOfPart}</p>,
        accessor: 'totNoOfPart',
        Cell: ({ row }) => (
          <p className="text-center">
            -
          </p>
        ),
      },
      {
        Header: <p className="text-center">{multiLangObj?.headerClubActList}</p>,
        accessor: 'clubActList',
        Cell: ({ row }) => (
          <a
            role="button"
            onClick={() => viewActivityList(row.original.id)}
            className="blueTxt text-center"
          >
            View
          </a>
        ),
      },
    ],
    [currentPage, itemsPerPage],
  )

    const clubHistoryDataColumns = useMemo(
      () => [
        {
          Header: <p className="text-center">{multiLangObj?.headerNo}</p>,
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

    const clubViewHandler = (clubId) => {
      getClubHistoryData(clubId)
      setClubHistoryInfoPopup(true)
    }

    const getClubHistoryData = async (clubId) => {
      try {
        let url = `${API_ENDPOINT.get_club_history}?clubId=${clubId}`
        const response = await getApi(url)
        if (response.status === 200) {
          setClubHistoryData(response.getClubHistory)
        }
      } catch (error) {
      }
    }

  const clubActivityListColumns = useMemo(
    () => [
      {
        Header: <p className="text-center">{multiLangObj?.headerNo}</p>,
        accessor: 'number',
        Cell: ({ row }) => {
          return currentPageOfClubActivity * itemsPerPageOfClubActivity + (row.index + 1)
        },
      },
      {
        Header: <p className="text-center">{multiLangObj?.club}</p>,
        accessor: 'club',
        Cell: ({ row }) => <p className="text-center">{row.original.clubName} </p>,
      },
      {
        Header: <p className="text-center">{multiLangObj?.activity}</p>,
        accessor: 'activity',
        Cell: ({ row }) => <p className="text-center">{row.original.activity} </p>,
      },
      {
        Header: <p className="text-center">{multiLangObj?.host}</p>,
        accessor: 'host',
        Cell: ({ row }) => <p className="text-center">{row.original.host} </p>,
      },
      {
        Header: <p className="text-center">{multiLangObj?.noOfPart}</p>,
        accessor: 'noOfParticipants',
        Cell: ({ row }) => <p className="text-center">{row.original.participants} </p>,
      },
      {
        Header: <p className="text-center">{multiLangObj?.history}</p>,
        accessor: 'history',
        Cell: ({ row }) => (
          <a
            role="button"
            onClick={() => clubViewHandler(row.original.recruitmentId)}
            className="blueTxt"
          >
            View
          </a>
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
      setModalProps({
        isModalOpen: false
      })
    }

    const cancelClubBannerModalHandler = (isOpen) => {
      setModalProps({
        isModalOpen: isOpen,
        title: `${multiLangObj?.confirmation}`,
        content: `${multiLangObj?.areYouSureToClose}`,
        cancelBtn: 'No',
        cancelBtnHandler: cancelConfirmation,
        successBtn: 'Yes',
        successBtnHandler: () => cancelBannerModalHandler(),
        modalCloseHandler: cancelClubBannerModalHandler,
      })
    }

    const validateClubBannerHandler = () => {
      if(bannerTitle.trim() === '') {
        enqueueSnackbar(multiLangObj?.pleaseEnterTitle, { variant: 'error' })
        return false
      } else if(bannerStartDate === '') {
        enqueueSnackbar(multiLangObj?.pleaseSelectStartDate, { variant: 'error' })
        return false
      } else if(bannerStartHours === '00' && bannerStartMins === '00') {
        enqueueSnackbar(multiLangObj?.pleaseSelectStartTime, { variant: 'error' })
        return false
      } else if(!bannerUpdateId && new Date() > new Date(bannerStartDate + 'T' + bannerStartHours + ':' + bannerStartMins)) {
        enqueueSnackbar(multiLangObj?.startTimeCannotEarlierThanCurrent, { variant: 'error' })
        return false
      } else if(bannerEndDate === '') {
        enqueueSnackbar(multiLangObj?.pleaseSelectEndDate, { variant: 'error' })
        return false
      } else if(bannerEndHours === '00' && bannerEndMins === '00') {
        enqueueSnackbar(multiLangObj?.pleaseSelectEndTime, { variant: 'error' })
        return false
      } else if(!bannerUpdateId && new Date(bannerStartDate + 'T' + bannerStartHours + ':' + bannerStartMins) > new Date(bannerEndDate + 'T' + bannerEndHours + ':' + bannerEndMins)) {
        enqueueSnackbar(multiLangObj?.endTimeCannotEarlierThanStart, { variant: 'error' })
        return false
      } else if(uploadedBannerImage === '') {
        enqueueSnackbar(multiLangObj?.pleaseUploadBannerImage, { variant: 'error' })
        return false
      } else if(imageType === 'linkTo' && linkToUrl === '') {
        enqueueSnackbar(multiLangObj?.pleaseEnterURLForLinkToPost, { variant: 'error' })
        return false
      } else if(imageType === 'popUpImage' && popupImage === '') {
        enqueueSnackbar(multiLangObj?.pleaseAddPopupImageForBanner, { variant: 'error' })
        return false
      } else {
        confirmationSaveClubBannerModalHandler(true)
      }
    }

    const confirmationSaveClubBannerModalHandler = (isOpen) => {
      setModalProps({
        isModalOpen: isOpen,
        title: multiLangObj?.confirmation,
        content: multiLangObj?.areYouSureToClose,
        cancelBtn: 'No',
        cancelBtnHandler: cancelConfirmation,
        successBtn: 'Yes',
        successBtnHandler: () => saveClubBannerHandler(),
        modalCloseHandler: confirmationSaveClubBannerModalHandler,
      })
    }

    const saveClubBannerHandler = async () => {
      try {
        const formData = new FormData()
        formData.append('title', bannerTitle)
        formData.append('startDateTime', new Date(bannerStartDate + 'T' + bannerStartHours + ':' + bannerStartMins))
        formData.append('endDateTime', new Date(bannerEndDate + 'T' + bannerEndHours + ':' + bannerEndHours))
        formData.append('image', uploadedBannerImage)
        formData.append('type', imageType)
        if(imageType === 'linkTo') {
          formData.append('linkUrl', linkToUrl)
        }
        if(imageType === 'popUpImage') {
          formData.append('popUpImage', popupImage)
        }
        let res = ''
        if(bannerUpdateId) {
          formData.append('id', bannerUpdateId)
          res = await putApi(API_ENDPOINT.update_club_banner, formData)
        } else {
          res = await postApi(API_ENDPOINT.create_club_banner, formData)
        }
        if(res.status === 200) {
          if(res?.data?.status === 409) {
            enqueueSnackbar(res?.data?.msg, { variant: 'error' })
          } else if(res?.data?.status !== 200) {
              enqueueSnackbar(res?.data?.error, { variant: 'error' })
          } else {
            bannerUpdateId ?
            enqueueSnackbar(multiLangObj?.clubBannerUpdatedSuccessfully, { variant: 'success' }) :
            enqueueSnackbar(multiLangObj?.clubBannerSavedSuccessfully, { variant: 'success' })
          }
          getClubBanners()
        }
      } catch (error) {
        console.log(error)
      }
      setAddModifyClubBannerModal(false)
      setModalProps({
        isModalOpen: false
      })
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
      let url = `${API_ENDPOINT.get_club_banners}?offset=${currentPageClubBanner+1}&limit=${itemsPerPageClubBanner}`
      const res = await getApi(url)
      if (res.status === 200) {
        setClubBannerData(res.data)
        setTotalclubBannerDataCount(res.totalCount)
        setTotalPagesClubBanner(Math.ceil(res.totalCount / Number(itemsPerPageClubBanner)))
      }
    } catch (error) {
      console.log(error)
    }
  }

  const confirmDeleteBannerHandler = (isOpen, id) => {
    setModalProps({
      isModalOpen: isOpen,
      title: multiLangObj?.confirmation,
      content: multiLangObj?.areYouSureToDeleteBanner,
      cancelBtn: 'No',
      cancelBtnHandler: cancelConfirmation,
      successBtn: 'Yes',
      successBtnHandler: () => deleteBannerHandler(id),
      modalCloseHandler: confirmDeleteBannerHandler,
    })
  }

  const deleteBannerHandler = async (id) => {
    try {
      let url = `${API_ENDPOINT.delete_club_banner}?id=${id}`
      const res = await deleteApi(url)
      if (res?.data?.status === 200) {
        getClubBanners()
        enqueueSnackbar(multiLangObj?.bannerDeletedSuccessfully, { variant: 'success' })
      } else {
        enqueueSnackbar(multiLangObj?.somethingWentWrong, { variant: 'success' })
      }
    } catch (error) {
      console.log(error)
    }
    setModalProps({
      isModalOpen: false
    })
  }

  const clubBannerDataColumns = useMemo(
    () => [
      {
        Header: <p className="text-center">{multiLangObj?.headerNo}</p>,
        accessor: 'number',
        Cell: ({ row }) => {
          return currentPageClubBanner * itemsPerPageClubBanner + (row.index + 1)
        },
      },
      {
        Header: <p className="text-center">{multiLangObj?.thumbnailImg}</p>,
        accessor: 'regPeriod',
        Cell: ({ row }) => (
          <div className='tdImg'>
            <img
              crossOrigin="anonymous"
              
              src={ALL_CONSTANTS.BASE_URL + row.original.image}
              alt=""
            />
          </div>
        ),
      },
      {
        Header: <p className="text-center">{multiLangObj?.headerTitle}</p>,
        accessor: 'firstDeadline',
        Cell: ({ row }) => (
          <a role="button" className="text-center" onClick={() => editClubBannerHandler(row.original.id)}>
            {row.original.title}
          </a>
        ),
      },
      {
        Header: <p className="text-center">{multiLangObj?.postingPeriod}</p>,
        accessor: 'recPeriod',
        Cell: ({ row }) => (
          <p className="text-center">
            {new Date(row.original.startDateTime).toLocaleString()} -{' '}
            {new Date(row.original.endDateTime).toLocaleString()}
          </p>
        ),
      },
      {
        Header: <p className="text-center">{multiLangObj?.status}</p>,
        accessor: 'finalDeadline',
        Cell: ({ row }) => (
          <p className="text-center">
            {row.original.status}
          </p>
        ),
      },
      {
        Header: <p className="text-center">{multiLangObj?.type}</p>,
        accessor: 'minPart',
        Cell: ({ row }) => (
          <p className="text-center">
            {row.original.type}
          </p>
        ),
      },
      {
        Header: <p className="text-center">{multiLangObj?.action}</p>,
        accessor: 'maxLimit',
        Cell: ({ row }) => (
          <a className='primTxt text-center' onClick={() => confirmDeleteBannerHandler(true, row.original.id)}>
          
            Delete
          </a>
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

  async function urlToBlob(url) {
    const response = await fetch(url)
    const blob = await response.blob()
    return blob
  }

  const urlsToFiles = async (url) => {
    if (!url) return
      const blob = await urlToBlob(ALL_CONSTANTS.BASE_URL + url)
      const fileName = url
      return new File([blob], fileName, { type: blob.type })
  }

  const editClubBannerHandler = async (id) => {
    try {
      let url = `${API_ENDPOINT.get_club_banner_details}?id=${id}`
      const res = await getApi(url)
      if (res.status === 200) {
        setBannerTitle(res?.data?.title)

        const startTime = new Date(res?.data?.startDateTime)
        let month = '' + (startTime.getMonth() + 1),
          day = '' + startTime.getDate(),
          year = startTime.getFullYear()
        if (month.length < 2) month = '0' + month
        if (day.length < 2) day = '0' + day
        setBannerStartDate([year, month, day].join('-'))
        if (startTime.getHours() + 1 < 10) {
          setBannerStartHours('0' + startTime.getHours())
        } else {
          setBannerStartHours(startTime.getHours())
        }
        if (startTime.getMinutes() < 10) {
          setBannerStartMins('0' + startTime.getMinutes())
        } else {
          setBannerStartMins(startTime.getMinutes())
        }

        const endTime = new Date(res?.data?.endDateTime)
          month = '' + (endTime.getMonth() + 1)
          day = '' + endTime.getDate()
          year = endTime.getFullYear()
        if (month.length < 2) month = '0' + month
        if (day.length < 2) day = '0' + day
        setBannerEndDate([year, month, day].join('-'))
        if (endTime.getHours() + 1 < 10) {
          setBannerEndHours('0' + endTime.getHours())
        } else {
          setBannerEndHours(endTime.getHours())
        }
        if (endTime.getMinutes() < 10) {
          setBannerEndMins('0' + endTime.getMinutes())
        } else {
          setBannerEndMins(endTime.getMinutes())
        }

        const bannerImage = await urlsToFiles(res?.data?.image)
        setUploadedBannerImage(bannerImage)
        setImageType(res?.data?.type)
        setLinkToUrl(res?.data?.linkUrl)
        const popUpImage = await urlsToFiles(res?.data?.popUpImage)
        setPopupImage(popUpImage)
        setBannerUpdateId(res?.data?.id)
        setAddModifyClubBannerModal(true)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const addNewClubBannerHandler = () => {
    setBannerUpdateId('')
    setBannerTitle('')
    setBannerStartDate('')
    setBannerStartHours('00')
    setBannerStartMins('00')
    setBannerEndDate('')
    setBannerEndHours('00')
    setBannerEndMins('00')
    setUploadedBannerImage('')
    setImageType('bannerImageOnly')
    setLinkToUrl('')
    setPopupImage('')
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
          enqueueSnackbar(multiLangObj?.clubPQUpdatedSuccessfully, { variant: 'success' })
        } else {
          enqueueSnackbar(multiLangObj?.clubPQUpdatedSuccessfully, {
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
      setModalProps({
        isModalOpen: false
      })
  }

  const cancelPeriodModalHandler = () => {
    setAddModifyClubPeriodModal(false)
      setModalProps({
        isModalOpen: false
      })
  }

    const validateClubPeriodHandler = () => {
      if(clubTitle.trim() === '') {
        enqueueSnackbar(multiLangObj?.pleaseEnterTitle, { variant: 'error' })
        return false
      } else if(registrationStart === '') {
        enqueueSnackbar(multiLangObj?.pleaseSelectRegistrationStartDate, { variant: 'error' })
        return false
      } else if(registrationEnd === '') {
        enqueueSnackbar(multiLangObj?.pleaseSelectRegistrationStartDate, { variant: 'error' })
        return false
      } else if(recruitmentStart === '') {
        enqueueSnackbar(multiLangObj?.pleaseSelectRecruitmentStartDate, { variant: 'error' })
        return false
      } else if(recruitmentEnd === '') {
        enqueueSnackbar(multiLangObj?.pleaseSelectRecruitmentStartDate, { variant: 'error' })
        return false
      } else {
        confirmationSaveModalHandler(true)
      }
    }

    const confirmationSaveModalHandler = (isOpen) => {
      setModalProps({
        isModalOpen: isOpen,
        title: multiLangObj?.confirmation,
        content: multiLangObj?.areYouSureToSave,
        cancelBtn: 'No',
        cancelBtnHandler: cancelConfirmation,
        successBtn: 'Yes',
        successBtnHandler: () => saveClubPeriodHandler(),
        modalCloseHandler: confirmationSaveModalHandler,
      })
    }

    const confirmationCloseModalHandler = (isOpen) => {
      setModalProps({
        isModalOpen: isOpen,
        title: multiLangObj?.confirmation,
        content: multiLangObj?.areYouSureToClose,
        cancelBtn: 'No',
        cancelBtnHandler: cancelConfirmation,
        successBtn: 'Yes',
        successBtnHandler: () => cancelPeriodModalHandler(),
        modalCloseHandler: confirmationCloseModalHandler,
      })
    }

    const cancelConfirmation = () => {
      setModalProps({
        isModalOpen: false
      })
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
      <div className='toggleContainer flex-column  p-0'>
    <div className='d-flex justify-content-between align-items-center w-100 p-2'>
    <h5>Club Period/Qualification</h5>
        <CFormSwitch id="club_period_qualification" className='cFormSwitch' onClick={handleShowClubPeriodToggle} defaultChecked={showClubPeriod}/>
    </div>

        {showClubPeriod && <div className='w-100 pb-0   p-3' style={{borderTopWidth:1, borderTopColor:'#ccc', borderTopStyle:'solid'}}>
       <div className='d-flex justify-content-end'>
       <CForm className="d-flex w-50">
          <CFormInput className="me-sm-2" placeholder="Search" size="sm" value={searchTxt} onChange={(e) => setSearchTxt(e.target.value)}/>
          <CButton  className="my-2 my-sm-0 " type="button" onClick={getClubRegistrationPeriodsBySearch}>
            Search
          </CButton>
        </CForm>
       </div>
        <CForm className="d-flex justify-content-between align-items-center my-3">
        {totalclubPeriodDataCount > 0 && <p >Total&nbsp;:&nbsp; {totalclubPeriodDataCount}</p>}
          <CButton className="my-2 my-sm-0 " type="button" onClick={addNewClubPeriodHandler}>
            Add
          </CButton>
        </CForm>
       
        <ReactTable
          columns={clubPeriodDataColumns}
          data={clubPeriodData}
          showCheckbox={false}
          onSelectionChange={() => {}}
        />
        <div className="d-flex w-100 justify-content-center my-3  gap-3">
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
            <div className="d-flex align-items-center gap-2 ">
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
        <CModal className='modal-lg'
          alignment="center"
          scrollable
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
            {clubActivityListData.length > 0 && <ReactTable
              columns={clubActivityListColumns}
              data={clubActivityListData}
              onSelectionChange={() => {
                console.log('no action')
              }}
              showCheckbox={false}
            />}
          {clubActivityListData?.length > 0 && (
            <div className="d-flex w-100 justify-content-center gap-3 align-items-center my-3">
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
              <div className="d-flex align-items-center gap-2">
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
            </div>
          )}
          <div className='noDataAvailable'>
          <p className='text-center'>
            {clubActivityListData.length === 0 && <>No Data Available</>}
            </p>
          </div>
          </CModalBody>
        </CModal>
        <CModal className='modal-md'
          alignment="center"
          visible={addModifyClubPeriodModal}
          onClose={() => {
            setAddModifyClubPeriodModal(false)
          }}
          backdrop="static"
          scrollable
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
                className="txt-poll-title mb-2"
                name="pollTitle"
                
                value={clubTitle}
                onChange={(e) => {
                  setClubTitle(e.target.value)
                }}
              />
              <div className="deadline-container align-items-center">
                  <h5>Club Period Setting</h5>
              </div>
              <div className="deadline-container mb-1">
                <div className="deadline-label w-50">Registration Period</div>
               
              </div>
              <div className='d-flex align-items-center w-100 gap-2  mb-3' >
                  <DatePicker
                    value={registrationStart}
                    onChange={(event) => handleRegistrationStartChange(event)}
                  />
                
                  <DatePicker
                    value={registrationEnd}
                    onChange={(event) => handleRegistrationEndChange(event)}
                  />
                
                 {multiLangObj?.firstDeadline}
                  {multiLangObj?.yyyyMmDd}
                  </div>
            <div className="deadline-container align-items-center mb-1">
              <div className="deadline-label w-50">Recruitment Period</div>
            
            </div>
            <div className='d-flex align-items-center w-100 gap-2 mb-3'>
                  <DatePicker
                    value={recruitmentStart}
                    onChange={(event) => handleRecruitStartChange(event)}
                  />
               
                  <DatePicker
                    value={recruitmentEnd}
                    onChange={(event) => handleRecruitEndChange(event)}
                  />
               
                last Deadline
               YYYY.MM.DD
               
              </div>
              <div className="deadline-container">
                  <h5>No. of Participants Setting</h5>
              </div>
              <div className="deadline-container align-items-center justify-content-between w-100">
                <div className="deadline-label w-50">Min. participant limit</div>
                <div className='d-flex justify-content-between align-items-center w-50'>
                <h5 style={{flex:1}}>Over</h5>
               
               <CFormSelect
               className='ms-2'
                     style={{width:100}}
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
              <div className="deadline-container justify-content-between  align-items-center  w-100">
                <div className="deadline-label w-50">Max. same group limit</div>
                <div  className='d-flex justify-content-between align-items-center  w-50'>
                 <h5 style={{flex:1}}> No More Than</h5>
               
                  <CFormSelect
                        className='ms-2'
                        style={{width:100}}
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
                </div>
              </div>
            
          </CModalBody>
          <CModalFooter className="d-flex justify-content-center gap-2">
          
                <CButton onClick={cancelPeriodModalHandler} className='btn-black'>Cancel</CButton>
                <CButton onClick={validateClubPeriodHandler}>{periodId ? 'Update' : 'Save'}</CButton>
              
          </CModalFooter>
        </CModal>
      </div>}
      </div>
      
      <div className='toggleContainer flex-column p-0'>
        <div className='d-flex justify-content-between align-items-center w-100 p-2'>
        <h5>Club Banner</h5> 
        <CFormSwitch id="club_banner" className="cFormSwitch" onClick={handleShowClubBannerToggle} defaultChecked={showClubBanner}/>
        </div>
        {showClubBanner &&
       <div className='w-100 pb-0 p-3' style={{borderTopWidth:1, borderTopColor:'#ccc', borderTopStyle:'solid'}}>
      <div className='d-flex justify-content-between align-items-center w-100 mb-3'>
      {totalclubBannerDataCount > 0 && <p style={{ margin: 0 }}>Total&nbsp;:&nbsp; {totalclubBannerDataCount}</p>}
      <CForm className=" mt-2">
          <CButton  className="my-2 my-sm-0 " type="button" onClick={addNewClubBannerHandler}>
            Add
          </CButton>
        </CForm>
      
      </div>
        <ReactTable
          columns={clubBannerDataColumns}
          data={clubBannerData}
          showCheckbox={false}
          onSelectionChange={() => {}}
        />
        <div className="d-flex w-100 justify-content-center gap-3 align-items-center my-3">
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
            <div className="d-flex align-items-center gap-2 ">
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
        
        <CModal className='modal-lg'
          alignment="center"
          visible={addModifyClubBannerModal}
          scrollable
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
                  <div className="upload-image-main-container flex-row align-items-center gap-2">
                   
                      <div className='d-flex align-items-center gap-2'>
                        <DatePicker
                          value={bannerStartDate}
                          minDate={new Date()}
                          onChange={(event) => handleBannerStartDate(event)}
                          style={{width:100}}
                        />
                     
                        <input
                          type="time"
                          name="time"
                          id="time"
                          className="time-picker m-0 p-1"
                          value={`${bannerStartHours}:${bannerStartMins}`}
                          onChange={(e) => bannerStartTimeHandler(e)}
                        />
                      </div>
                      -
                      <div  className='d-flex align-items-center gap-2'>
                        <DatePicker
                          value={bannerEndDate}
                          minDate={new Date()}
                          onChange={(event) => handleBannerEndDate(event)}
                          style={{width:100}}
                        />
                     
                        <input
                          type="time"
                          name="time"
                          id="time"
                          className="time-picker  m-0 p-1"
                          value={`${bannerEndHours}:${bannerEndMins}`}
                          onChange={(e) => bannerEndTimeHandler(e)}
                        />
                      </div>
                    
                  </div>
                </div>
                <div className="form-outline form-white  d-flex ">
                  <div className="formWrpLabel">
                    <label className="fw-bolder ">Upload Image</label>
                  </div>
                  <div className="upload-image-main-container">
                    <div className="upload-img-btn-and-info flex-column">
                      <div className="upload-container-btn">
                        <label className="btn btn-primary" style={{paddingLeft:20}}  htmlFor="imageFiles">
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
                      {uploadedBannerImage && <div className="upload-images-container uploadImgWrap">
                          <div className='thubmnail-img-container'>
                            <img src={URL.createObjectURL(uploadedBannerImage)} alt="" />
                          </div>
                      </div>}
                    </div>
                  </div>
                </div>
                <div className="form-outline form-white  d-flex ">
                  <div className="formWrpLabel">
                    <label className="fw-bolder ">Banner Type</label>
                  </div>
                  <div className="upload-image-main-container">
                  <div className="push-notification-container gap-3 px-0 py-2">
                    <CFormCheck
                      type="radio"
                      name="imageType"
                      defaultChecked={imageType === 'bannerImageOnly'}
                      onClick={() => {setImageType('bannerImageOnly'); setLinkToUrl(''); setPopupImage('')}}
                      label="Banner Image Only"
                      value={true}
                    />
                  </div>
                  <div className="push-notification-container gap-3 align-items-center  px-0 py-2">
                   <div className='text-nowrap'>
                   <CFormCheck
                      type="radio"
                      name="imageType"
                      defaultChecked={imageType === 'linkTo'}
                      onClick={() => {setImageType('linkTo'); setPopupImage('')}}
                      label="Link To"
                      value={false}
                    />
                   </div>
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
                  <div className="push-notification-container gap-3 align-items-center px-0 py-2">
                    <CFormCheck
                      type="radio"
                      name="imageType"
                      defaultChecked={imageType === 'popUpImage'}
                      onClick={() => {setImageType('popUpImage'); setLinkToUrl('')}}
                      label="Pop-up Image"
                      value={false}
                    />
                    <label className="btn btn-primary w-25"  htmlFor="popupImg" style={{display: `${imageType === 'popUpImage' ? '' : 'none'}`, maxWidth:150}}>
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
                  {imageType === 'popUpImage' && popupImage && <div className="upload-images-container uploadImgWrap">
                      <div className='thubmnail-img-container' style={{height:'auto'}}>
                        <img src={URL.createObjectURL(popupImage)} alt="" />
                      </div>
                  </div>}
                  </div>
                </div>
              </div>
            </div>
           
          </CModalBody>
          <CModalFooter className="d-flex justify-content-center gap-2">
              <CButton onClick={cancelBannerModalHandler} className='btn-black'>Cancel</CButton>
              <CButton onClick={validateClubBannerHandler}>{periodId ? 'Update' : 'Save'}</CButton>
            </CModalFooter>
        </CModal>
      </div>}
      </div>
      
    </div>
  )
}

export default ClubBoard
