import {
  CButton,
  CFormInput,
  CFormSelect,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'
import React, { useEffect, useMemo, useState } from 'react'
import DatePicker from 'react-date-picker'
import { Link } from 'react-router-dom'
import ReactTable from 'src/components/common/ReactTable'
import { getApi } from 'src/utils/Api'
import { ALL_CONSTANTS, API_ENDPOINT } from 'src/utils/config'
import moment from 'moment/moment'
import ReactPaginate from 'react-paginate'
import { paginationItemPerPageOptions } from 'src/utils/constant'
import Loader from 'src/components/common/Loader'

const MyReservationListing = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [meetingData, setMeetingData] = useState('')
  const [filterObj, setFilterObj] = useState({})
  const [searchTxt, setSearchTxt] = useState('')
  const [searchBuilding, setSearchBuilding] = useState('')
  const [searchFloor, setSearchFloor] = useState('')
  const [totalDataCount, setTotalDataCount] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [showMeetingRoomDetails, setShowMeetingRoomDetails] = useState(false)
  const [meetingRoomDetails, setMeetingRoomDetails] = useState({})
  const [showUserDetails, setShowUserDetails] = useState(false)
  const [userDetails, setUserDetails] = useState({})
  const [userDetailImage, setUserDetailImage] = useState('')
  const [showMeetingReservationInfo, setShowMeetingReservationInfo] = useState(false)
  const [meetingReservationInfo, setMeetingReservationInfo] = useState({})

  const [buildings, setBuildings] = useState([{ id: '', name: 'All' }])
  const [floors, setFloors] = useState([{ id: '', name: 'All' }])
  const [allDays, setAllDays] = useState([
    { value: '', name: 'All' },
    { value: 'yes', name: 'Yes - All Day' },
    { value: 'no', name: 'No - All Day' },
  ])
  const [current, setCurrent] = useState([
    { value: '', name: 'All' },
    { value: 'current', name: 'Current' },
    { value: 'past', name: 'Past' },
  ])

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected)
  }

  const showMeetingReservationInfoHandler = async (reservationId) => {
    try {
      const res = await getApi(API_ENDPOINT.reservation_details + '?reservationId=' + reservationId)
      if (res.status === 200) {
        setMeetingReservationInfo(res?.data)
        setShowMeetingReservationInfo(true)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const showMeetingRoomDetailsHandler = async (meetingId) => {
    try {
      const res = await getApi(API_ENDPOINT.meeting_details + '?meetingRoomId=' + meetingId)
      if (res.status === 200) {
        setMeetingRoomDetails(res?.data)
        setShowMeetingRoomDetails(true)
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
  const showUserDetailsHandler = async (userId) => {
    try {
      const res = await getApi(API_ENDPOINT.user_details + '?userId=' + userId)
      if (res.status === 200) {
        setUserDetails(res?.data)
        const userImage = await urlsToFiles(res?.data?.userImage)
        setUserDetailImage(userImage)
        setShowUserDetails(true)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const meetingColumns = useMemo(
    () => [
      {
        Header: 'Start Time',
        accessor: 'startTime',
        Cell: ({ row }) => (
          <p className="text-center">{`${moment(row.original.startDateTime).format(
            'YYYY-MM-DD HH:mm:ss',
          )}`}</p>
        ),
      },
      {
        Header: 'End Time',
        accessor: 'endTime',
        Cell: ({ row }) => (
          <p className="text-center">{`${moment(row.original.endDateTime).format(
            'YYYY-MM-DD HH:mm:ss',
          )}`}</p>
        ),
      },
      {
        Header: 'Location',
        accessor: 'location',
        Cell: ({ row }) => <p className="text-center">{`${row.original.buildingName}`}</p>,
      },
      {
        Header: 'Floor',
        accessor: 'floor',
        Cell: ({ row }) => <p className="text-center">{`${row.original.floorName}`}</p>,
      },
      {
        Header: 'Meeting Room Name',
        accessor: 'meetingRoomName',
        Cell: ({ row }) => (
          <Link
            onClick={() => {
              showMeetingRoomDetailsHandler(row.original.roomId)
            }}
            style={{ cursor: 'pointer' }}
          >
            {row.original.roomName}{' '}
          </Link>
        ),
      },
      {
        Header: 'Meeting Room Code',
        accessor: 'meetingRoomCode',
        Cell: ({ row }) => <p className="text-center">{`${row.original.roomCode}`}</p>,
      },
      {
        Header: 'Title',
        accessor: 'title',
        Cell: ({ row }) => <p className="text-center">{`${row.original.meetingTitle}`}</p>,
      },
      {
        Header: 'User Name',
        accessor: 'userName',
        Cell: ({ row }) => (
          <Link
            onClick={() => {
              showUserDetailsHandler(row.original.userId)
            }}
            style={{ cursor: 'pointer' }}
          >
            {row.original.englishName}{' '}
          </Link>
        ),
      },
      {
        Header: 'All Day',
        accessor: 'allDay',
        Cell: ({ row }) => (
          <p className="text-center">{`${row.original.allDay === 0 ? 'No' : 'Yes'}`}</p>
        ),
      },
      {
        Header: 'View',
        accessor: 'view',
        Cell: ({ row }) => (
          <a
            onClick={() => {
              showMeetingReservationInfoHandler(row.original.id)
            }}
            className="  blueTxt"
          >
            View
          </a>
        ),
      },
    ],
    [currentPage, itemsPerPage],
  )

  const handleDateChange = (event, filterObjKey) => {
    let d = new Date(event),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear()
    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day
    if (year === 1970) {
      setFilterObj((prev) => {
        return { ...prev, [filterObjKey]: undefined }
      })
    } else {
      setFilterObj((prev) => {
        return { ...prev, [filterObjKey]: [year, month, day].join('-') }
      })
    }

    // getMeetingList()
  }

  const getBuildings = async () => {
    try {
      const res = await getApi(API_ENDPOINT.building_lists)
      if (res.status === 200) {
        const buildings = res?.data
        setBuildings([{ id: '', name: 'All' }, ...buildings])
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getFloorsFromBuildingId = async (buildId) => {
    if (!buildId) {
      setFloors([{ id: '', name: 'All' }])
      setFilterObj((prev) => {
        return { ...prev, buildingId: '', floorId: '' }
      })
      return
    }
    try {
      const res = await getApi(API_ENDPOINT.floor_lists + '?buildingId=' + buildId)
      if (res.status === 200) {
        const floors = res?.data
        setFloors([{ id: '', name: 'All' }, ...floors])
      }
    } catch (error) {
      console.log(error)
    }
    setFilterObj((prev) => {
      return { ...prev, buildingId: buildId, floorId: '' }
    })
    getMeetingList()
  }

  const getMeetingList = async () => {
    setIsLoading(true)
    let url = API_ENDPOINT.meeting_lists
    url += `?pageNo=${currentPage + 1}&pageSize=${itemsPerPage}&myReservationsOnly=1`
    console.log('filterObj?.buildingId :: ', filterObj?.buildingId)
    if (filterObj?.buildingId) {
      url += `&buildingId=${filterObj?.buildingId}`
    }
    if (filterObj?.floorId) {
      url += `&floorId=${filterObj?.floorId}`
    }
    if (searchTxt) {
      url += `&searchTerm=${searchTxt}`
    }
    if (filterObj?.searchStartDate && filterObj?.searchEndDate) {
      url += `&start=${filterObj?.searchStartDate}T00:00:00.000Z&end=${filterObj?.searchEndDate}T23:59:59.999Z`
    }
    if (filterObj?.allDay) {
      url += `&allDay=${filterObj?.allDay}`
    }
    if (filterObj?.status) {
      url += `&status=${filterObj?.status}`
    }
    try {
      const res = await getApi(url)
      if (res.status === 200) {
        console.log(res?.data)
        setMeetingData(res?.data)
        setTotalDataCount(res?.total)
        setTotalPages(Math.ceil(res.total / Number(itemsPerPage)))
      } else {
        setTotalDataCount(0)
        setMeetingData([])
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getMeetingList()
  }, [itemsPerPage, currentPage, filterObj])

  useEffect(() => {
    if (searchTxt === '') {
      getMeetingList()
    }
  }, [searchTxt])

  useEffect(() => {
    getBuildings()
  }, [])
  return (
    <>
      {isLoading && <Loader />}
      <div className="mb-3 d-flex justify-content-end">
        <DatePicker
          value={filterObj?.searchStartDate}
          onChange={(event) => handleDateChange(event, 'searchStartDate')}
        />
        &nbsp; - &nbsp;
        <DatePicker
          value={filterObj?.searchEndDate}
          onChange={(event) => handleDateChange(event, 'searchEndDate')}
        />
      </div>
      <div className="mb-3 d-flex justify-content-between">
        <div style={{ width: '30%', display: 'flex' }}>
          <CFormInput
            type="text"
            placeholder="Search"
            value={searchTxt}
            onChange={(e) => setSearchTxt(e.target.value)}
          />
          &nbsp;&nbsp;
          <CButton onClick={getMeetingList}>Search</CButton>
        </div>
        <div style={{ width: '70%', display: 'flex' }}>
          <CFormSelect
            style={{ width: '23%' }}
            size="sm"
            name="boardId"
            className="board-dropdown"
            onChange={(e) => {
              setSearchBuilding(e.target.value)
              getFloorsFromBuildingId(e.target.value)
            }}
            value={searchBuilding}
          >
            {buildings.map((option, index) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </CFormSelect>
          &nbsp;
          <CFormSelect
            style={{ width: '23%' }}
            size="sm"
            name="boardId"
            className="board-dropdown"
            onChange={(e) => {
              setSearchFloor(e.target.value)
              setFilterObj((prev) => {
                return { ...prev, floorId: e.target.value }
              })
            }}
            disabled={!searchBuilding}
          >
            {floors.map((option, index) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </CFormSelect>
          &nbsp;
          <CFormSelect
            style={{ width: '23%' }}
            size="sm"
            name="boardId"
            className="board-dropdown"
            onChange={(e) => {
              setFilterObj((prev) => {
                return { ...prev, allDay: e.target.value }
              })
            }}
          >
            {allDays.map((option, index) => (
              <option key={option.value} value={option.value}>
                {option.name}
              </option>
            ))}
          </CFormSelect>
          &nbsp;
          <CFormSelect
            style={{ width: '23%', marginRight: 0 }}
            size="sm"
            name="boardId"
            className="board-dropdown"
            onChange={(e) => {
              setFilterObj((prev) => {
                return { ...prev, status: e.target.value }
              })
            }}
          >
            {current.map((option, index) => (
              <option key={option.value} value={option.value}>
                {option.name}
              </option>
            ))}
          </CFormSelect>
        </div>
      </div>
      <div className="mb-2">
        {totalDataCount > 0 && <p style={{ margin: 0 }}>Total&nbsp;:&nbsp; {totalDataCount}</p>}
      </div>
      {meetingData && (
        <ReactTable
          columns={meetingColumns}
          data={meetingData}
          showCheckbox={false}
          onSelectionChange={() => {}}
        />
      )}
      <div className="d-flex w-100 justify-content-center align-items-center my-3 gap-3">
        {meetingData.length > 0 && (
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
        {meetingData.length > 0 && (
          <div className="d-flex align-items-center gap-2">
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
        alignment="center"
        visible={showMeetingRoomDetails}
        backdrop="static"
        onClose={() => setShowMeetingRoomDetails(false)}
        aria-labelledby="LiveDemoExampleLabel"
      >
        <CModalHeader onClose={() => setShowMeetingRoomDetails(false)}>
          <CModalTitle>Meeting Room Information</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="card-body">
            <div className="formWraper">
              <div className="form-outline form-white  d-flex ">
                <div className="formWrpLabel">
                  <label className="fw-bolder ">Meeting Room Name</label>
                </div>
                <div className="upload-image-main-container">
                  <div className="upload-img-btn-and-info">{meetingRoomDetails?.roomName}</div>
                </div>
              </div>
              <div className="form-outline form-white  d-flex ">
                <div className="formWrpLabel">
                  <label className="fw-bolder ">Location</label>
                </div>
                <div className="upload-image-main-container">
                  <div className="upload-img-btn-and-info">{meetingRoomDetails?.locationName}</div>
                </div>
              </div>
              <div className="form-outline form-white  d-flex ">
                <div className="formWrpLabel">
                  <label className="fw-bolder ">Floor</label>
                </div>
                <div className="upload-image-main-container">
                  <div className="upload-img-btn-and-info">{meetingRoomDetails?.floorName}</div>
                </div>
              </div>
              <div className="form-outline form-white  d-flex ">
                <div className="formWrpLabel">
                  <label className="fw-bolder ">Meeting Room Code</label>
                </div>
                <div className="upload-image-main-container">
                  <div className="upload-img-btn-and-info">
                    {meetingRoomDetails?.meetingCode ? meetingRoomDetails?.meetingCode : '-'}
                  </div>
                </div>
              </div>
              <div className="form-outline form-white  d-flex ">
                <div className="formWrpLabel">
                  <label className="fw-bolder ">Capacity</label>
                </div>
                <div className="upload-image-main-container">
                  <div className="upload-img-btn-and-info">{meetingRoomDetails?.capacity}</div>
                </div>
              </div>
              <div className="form-outline form-white  d-flex ">
                <div className="formWrpLabel">
                  <label className="fw-bolder ">Available Equipment</label>
                </div>
                <div className="upload-image-main-container">
                  <div className="upload-img-btn-and-info">
                    {meetingRoomDetails?.equipmentInfo?.map((item) => item?.name).join(', ')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CModalBody>
      </CModal>

      {userDetailImage && (
        <CModal
          alignment="center"
          size="lg"
          visible={showUserDetails}
          backdrop="static"
          onClose={() => setShowUserDetails(false)}
          aria-labelledby="LiveDemoExampleLabel"
        >
          <CModalHeader onClose={() => setShowUserDetails(false)}>
            <CModalTitle>User Information</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <div className="card-body">
              <div className="formWraper">
                <div className="form-outline form-white  d-flex ">
                  <div className="formWrpLabel">
                    <label className="fw-bolder ">Profile Image</label>
                  </div>
                  <div className="room-image-container">
                    <img
                      style={{ width: '100px', height: '100px' }}
                      src={URL.createObjectURL(userDetailImage)}
                      alt=""
                    />
                  </div>
                </div>
                <div className="form-outline form-white  d-flex ">
                  <div className="formWrpLabel">
                    <label className="fw-bolder ">Employee No.</label>
                  </div>
                  <div className="upload-image-main-container">
                    <div className="upload-img-btn-and-info">{userDetails?.employeeCode}</div>
                  </div>
                </div>
                <div className="form-outline form-white  d-flex ">
                  <div className="formWrpLabel">
                    <label className="fw-bolder ">Name :</label>
                  </div>
                  <div className="upload-image-main-container">
                    <div className="upload-img-btn-and-info">{userDetails?.koreanName}</div>
                  </div>
                </div>
                <div className="form-outline form-white  d-flex ">
                  <div className="formWrpLabel">
                    <label className="fw-bolder ">English Name :</label>
                  </div>
                  <div className="upload-image-main-container">
                    <div className="upload-img-btn-and-info">{userDetails?.englishName}</div>
                  </div>
                </div>
                <div className="form-outline form-white  d-flex ">
                  <div className="formWrpLabel">
                    <label className="fw-bolder ">Email</label>
                  </div>
                  <div className="upload-image-main-container">
                    <div className="upload-img-btn-and-info">{userDetails?.email}</div>
                  </div>
                </div>
                <div className="form-outline form-white  d-flex ">
                  <div className="formWrpLabel">
                    <label className="fw-bolder ">Company</label>
                  </div>
                  <div className="upload-image-main-container">
                    <div className="upload-img-btn-and-info">{userDetails?.companyName}</div>
                  </div>
                </div>
                <div className="form-outline form-white  d-flex ">
                  <div className="formWrpLabel">
                    <label className="fw-bolder ">Division</label>
                  </div>
                  <div className="upload-image-main-container">
                    <div className="upload-img-btn-and-info">{userDetails?.divisionName}</div>
                  </div>
                </div>
                <div className="form-outline form-white  d-flex ">
                  <div className="formWrpLabel">
                    <label className="fw-bolder ">Group</label>
                  </div>
                  <div className="upload-image-main-container">
                    <div className="upload-img-btn-and-info">{userDetails?.groupName}</div>
                  </div>
                </div>
                <div className="form-outline form-white  d-flex ">
                  <div className="formWrpLabel">
                    <label className="fw-bolder ">Team</label>
                  </div>
                  <div className="upload-image-main-container">
                    <div className="upload-img-btn-and-info">{userDetails?.teamName}</div>
                  </div>
                </div>
                <div className="form-outline form-white  d-flex ">
                  <div className="formWrpLabel">
                    <label className="fw-bolder ">Last Access</label>
                  </div>
                  <div className="upload-image-main-container">
                    <div className="upload-img-btn-and-info">{userDetails?.lastLoginAt}</div>
                  </div>
                </div>
                <div className="form-outline form-white  d-flex ">
                  <div className="formWrpLabel">
                    <label className="fw-bolder ">Reservation Information</label>
                  </div>
                  <div className="upload-image-main-container">
                    <div className="upload-img-btn-and-info">
                      <b>Meeting Room Reservation : {userDetails?.reservationCount}</b>
                      <br />
                      <br />
                    </div>
                    <div>
                      {userDetails?.reservationInfo.map((info) => (
                        <div key={info?.startDateTime}>
                          {info?.roomName} - {info?.title} - {info?.startDateTime.split('T')[0]}{' '}
                          {info?.startDateTime.split('T')[1].split('.')[0]} -{' '}
                          {info?.endDateTime.split('T')[1].split('.')[0]}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CModalBody>
        </CModal>
      )}

      <CModal
        alignment="center"
        visible={showMeetingReservationInfo}
        backdrop="static"
        onClose={() => setShowMeetingReservationInfo(false)}
        aria-labelledby="LiveDemoExampleLabel"
      >
        <CModalHeader onClose={() => setShowMeetingReservationInfo(false)}>
          <CModalTitle>Meeting Reservation Information</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="card-body">
            <div className="formWraper">
              <div className="form-outline form-white  d-flex ">
                <div className="upload-image-main-container">
                  <div className="upload-img-btn-and-info">{meetingReservationInfo?.roomName}</div>
                </div>
              </div>
              <div className="form-outline form-white  d-flex ">
                <div className="formWrpLabel">
                  <label className="fw-bolder ">Title</label>
                </div>
                <div className="upload-image-main-container">
                  <div className="upload-img-btn-and-info">{meetingReservationInfo?.title}</div>
                </div>
              </div>
              <div className="form-outline form-white  d-flex ">
                <div className="formWrpLabel">
                  <label className="fw-bolder ">Date & Time</label>
                </div>
                <div className="upload-image-main-container">
                  <div className="upload-img-btn-and-info">
                    {moment(meetingReservationInfo?.startDateTime).format('YYYY/MM/DD') +
                      ' - ' +
                      moment(meetingReservationInfo?.endDateTime).format('YYYY/MM/DD')}
                  </div>
                </div>
              </div>
              <div className="form-outline form-white  d-flex ">
                <div className="formWrpLabel">
                  <label className="fw-bolder ">Reserved User</label>
                </div>
                <div className="upload-image-main-container">
                  <div className="upload-img-btn-and-info">{meetingReservationInfo?.userName}</div>
                </div>
              </div>{' '}
            </div>
          </div>
        </CModalBody>
      </CModal>
    </>
  )
}

export default MyReservationListing
