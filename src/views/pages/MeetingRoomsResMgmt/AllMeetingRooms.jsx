import {
  CButton,
  CFormSelect,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CNavItem,
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
} from '@coreui/react'
import { enqueueSnackbar } from 'notistack'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import ReactPaginate from 'react-paginate'
import Loader from 'src/components/common/Loader'
import ReactTable from 'src/components/common/ReactTable'
import { deleteApi, getApi, getUserListExportData } from 'src/utils/Api'
import { ALL_CONSTANTS, API_ENDPOINT } from 'src/utils/config'
import { paginationItemPerPageOptions } from 'src/utils/constant'
import AddBuilding from './AddBuilding'
import AddFloor from './AddFloor'
import CIcon from '@coreui/icons-react'
import { cibZeit } from '@coreui/icons'
import { useTranslation } from 'react-i18next'
import AddRoom from './AddRoom'

const AllMeetingRooms = () => {
  const initialData = {
    search: '',
    itemStatus: '',
    visibility: '',
  }

  const [buildingLists, setBuildingLists] = useState([])
  const [floorList, setFloorList] = useState([])
  const [roomList, setRoomList] = useState([])
  const [allMeetingData, setAllMeetingData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [filterData, setFilterData] = useState(initialData)
  const [totalCount, setTotalCount] = useState(0)
  const [deleteVisible, setDeleteVisible] = useState(false)
  const [getModal, setModal] = useState('allList')
  const [ids, setIds] = useState(null)
  const [sideBarId, setSidebarId] = useState(null)
  const [sideSubBarId, setSideSubbarId] = useState(null)
  const [buildingId, setBuildingId] = useState(null)
  const [buildingName, setBuildingName] = useState(null)
  const [floorId, setFloorId] = useState(null)
  const [roomId, setRoomId] = useState(null)
  const [subCatIds, setSubCatIds] = useState(null)
  const [subItemIds, setItemIds] = useState(null)
  const [getState, setState] = useState(false)
  const [iconSet, setIcon] = useState(null)
  const [iconCatSet, setCatIcon] = useState(null)
  const [iconSubCatSet, setSubCatIcon] = useState(null)
  const [iconModSet, setModIcon] = useState(null)
  const [roomDeleteId, setRoomDeleteId] = useState('')

  const { i18n } = useTranslation()
  const translationObject = i18n.getDataByLanguage(i18n.language)
  const multiLangObj = translationObject?.translation?.meetingRoomsReservationManagement

  const handleChange = (id) => {
    if (id === null) {
      setFloorList([])
      setIcon(null)
      setCatIcon(null)
      setSubCatIcon(null)
      setModIcon(null)
    } else {
      setIcon(id)
    }
  }

  const handleCatIcon = async (id) => {
    if (id === null) {
      setRoomList([])
      setCatIcon(null)
      setSubCatIcon(null)
      setModIcon(null)
    } else {
      setCatIcon(id)
    }
  }

  useEffect(() => {
    setFloorList([])
    getBuildings()
    handleAllMeetingData()
    setModal('allList')
  }, [getState])

  useEffect(() => {
    handleAllMeetingData()
  }, [filterData.itemStatus, filterData.visibility, itemsPerPage, currentPage])

  useEffect(() => {
    if (filterData?.search === '') {
      handleAllMeetingData()
    }
  }, [filterData.search])

  const deleteRoom = async () => {
    setIsLoading(true)
    try {
      let url = API_ENDPOINT.delete_meeting_room
      const response = await deleteApi(url, `?id=${roomDeleteId}`)
      if (response?.status === 200) {
        enqueueSnackbar('Delete succefully', { variant: 'success' })
        setIds(null)
        setIcon(null)
      }
    } catch (error) {
      enqueueSnackbar('Something Went Wrong', { variant: 'error' })
      console.log(error)
    } finally {
      handleAllMeetingData()
      setIsLoading(false)
    }
  }
  const columns = useMemo(() => [
    {
      Header: multiLangObj?.location,
      accessor: 'location',
      Cell: ({ row }) => (
        <p className="text-center">{`${
          row.original.buildingName ? row.original.buildingName : '-'
        }`}</p>
      ),
    },
    {
      Header: multiLangObj?.floor,
      accessor: 'subCategoryName',
      Cell: ({ row }) => (
        <p className="text-center">{`${row.original.floorName ? row.original.floorName : '-'}`}</p>
      ),
    },
    {
      Header: multiLangObj?.meetingRoomName,
      accessor: 'modalName',
      Cell: ({ row }) => (
        <p className="text-center">{`${
          row.original.meetingRoomName ? row.original.meetingRoomName : '-'
        }`}</p>
      ),
    },
    {
      Header: multiLangObj?.meetingRoomCode,
      accessor: 'itemNumber',
      Cell: ({ row }) => (
        <p className="text-center">{`${
          row.original.meetingCode ? row.original.meetingCode : '-'
        }`}</p>
      ),
    },
    {
      Header: multiLangObj?.roomStatus,
      accessor: 'itemStatus',
      Cell: ({ row }) => (
        <p className="text-center">{`${
          row.original.itemStatus ? row.original.itemStatus : '-'
        }`}</p>
      ),
    },
    {
      Header: 'Action',
      Cell: ({ row }) => (
        <div className="d-flex gap-4">
          <a
            onClick={() => (
              setBuildingId(row.original.buildingId),
              handleSetModal('addRoom', row.original.roomId),
              setFloorId(row.original.floorId)
            )}
            className="greenTxt"
          >
            Modify
          </a>
          <a
            onClick={() => (setDeleteVisible(true), setRoomDeleteId(row.original.roomId))}
            className="primTxt"
          >
            Delete
          </a>
        </div>
      ),
    },
  ])

  const getBuildings = async () => {
    try {
      const res = await getApi(API_ENDPOINT.building_lists)
      if (res.status === 200) {
        setBuildingLists(res?.data)
      } else {
        setBuildingLists([])
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getFloorList = async (id) => {
    setSidebarId(id)
    try {
      const res = await getApi(API_ENDPOINT.floor_lists + '?buildingId=' + id)
      if (res.status === 200) {
        setFloorList(res?.data)
      } else {
        setFloorList([])
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getRoomList = async (id) => {
    setSideSubbarId(id)
    try {
      const res = await getApi(API_ENDPOINT.room_lists + '?floorId=' + id)
      if (res.status === 200) {
        setRoomList(res?.data)
      } else {
        setRoomList()
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleTabClick = async (id) => {
    console.log('id =>', id)
  }

  const handleSelectionChange = useCallback((selectedRowsIds) => {}, [])

  const handleAllMeetingData = async () => {
    setIsLoading(true)
    try {
      let url =
        API_ENDPOINT.get_all_meeting_rooms_records +
        `?offset=${currentPage + 1}&limit=${itemsPerPage}`

      if (filterData?.search) {
        url = url + `&search=${filterData?.search}`
      }
      if (filterData?.itemStatus !== 'All' && filterData?.itemStatus !== '') {
        url = url + `&itemStatus=${filterData?.itemStatus}`
      }
      if (filterData?.visibility !== 'All' && filterData?.visibility !== '') {
        url = url + `&visibility=${filterData?.visibility}`
      }

      const res = await getApi(url)
      if (res?.status === 200) {
        setAllMeetingData(res?.data)
        setTotalCount(res?.totalCount)
        setTotalPages(Math.ceil(res.totalCount / Number(itemsPerPage)))
        setIsLoading(false)
      } else {
        setAllMeetingData(res?.data)
        setTotalCount(res?.totalCount)
        setIsLoading(false)
      }
    } catch (error) {
      setIsLoading(false)
      console.error('Error fetching data:', error)
    }
  }

  const handleAllMeetingStatusChange = (e) => {
    const value = e.target.value
    setFilterData((prev) => {
      return {
        ...prev,
        // rentalStatus: value.toLowerCase()
        itemStatus: value,
      }
    })
  }

  const handleAllaupplieVisibility = (e) => {
    const value = e.target.value
    // const id = e.target.selectedIndex
    setFilterData((prev) => {
      return {
        ...prev,
        visibility: value,
      }
    })
  }

  const handleSearch = (e) => {
    const value = e.target.value
    setFilterData((prev) => {
      return {
        ...prev,
        search: value,
      }
    })
  }

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected)
  }

  const exportData = async () => {
    setIsLoading(true)
    try {
      let url =
        API_ENDPOINT.get_all_meeting_rooms_export +
        `?offset=${currentPage + 1}&limit=${itemsPerPage}`

      if (filterData?.search) {
        url = url + `&search=${filterData?.search}`
      }
      if (filterData?.itemStatus !== 'All' && filterData?.itemStatus !== '') {
        url = url + `&itemStatus=${filterData?.itemStatus}`
      }
      if (filterData?.visibility !== 'All' && filterData?.visibility !== '') {
        url = url + `&visibility=${filterData?.visibility}`
      }

      const res = await getUserListExportData(url)

      if (res.filePath) {
        const downloadLink = res.filePath
        const link = document.createElement('a')
        link.href = ALL_CONSTANTS.BASE_URL + '/' + downloadLink
        link.setAttribute('download', `exported_data_${new Date().getTime()}.xlsx`)

        link.click()
        enqueueSnackbar('Data export successfull', { variant: 'success', autoHideDuration: 3000 })

        setIsLoading(false)
      } else {
        enqueueSnackbar('Something went wrong', { variant: 'error', autoHideDuration: 3000 })
        setIsLoading(false)
      }
    } catch (error) {}
  }

  const handleSetModal = async (type, add) => {
    if (type === 'allList') {
      setModal('allList')
      setFilterData({
        search: '',
        itemStatus: '',
        visibility: '',
      })
      setItemsPerPage(5)
      setCurrentPage(0)
    } else if (type === 'addBuilding') {
      if (add === 'add') {
        setIds(null)
      } else {
        setBuildingId(add)
      }
      setModal('addBuilding')
    } else if (type === 'addFloor') {
      if (add === 'add') {
        setIds(null)
      } else {
        setFloorId(add)
      }
      setModal('addFloor')
    } else if (type === 'addRoom') {
      if (add === 'add') {
        setIds(null)
      } else {
        setRoomId(add)
      }
      setModal('addRoom')
    }
  }

  return (
    <div>
      <div className="pageTitle mb-3 pb-2">
        <h2>All Meeting Rooms</h2>
      </div>
      <div className="d-flex justify-content-between  mb-4">
        {isLoading && <Loader />}
        <div className="col-md-4">
          <CSidebar className="w-100">
            {/* <CSidebarBrand
              className=" black-text d-flex justify-content-start p-3 ps-0"
              style={{ color: 'black', background: 'none' }}
            >
              <h6>All Meetings</h6>
            </CSidebarBrand> */}
            <CSidebarBrand
              className=" black-text d-flex justify-content-between mb-2 pe-1"
              style={{
                color: 'black',
                borderBottom: '1px solid #000',
                background: 'none',
                alignItems: 'center',
              }}
            >
              <p role="button" onClick={() => handleSetModal('allList')}>
                {multiLangObj?.allMeetingRooms}
              </p>
              <CButton
                className="text-center btn-sm suppplyBtn"
                style={{
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                }}
                onClick={() => handleSetModal('addBuilding', 'add')}
              >
                {multiLangObj?.addBuilding}
              </CButton>
            </CSidebarBrand>
            <CSidebarNav
              className="pe-1"
              style={{ color: 'black', maxHeight: '500px', overflow: 'auto' }}
            >
              {buildingLists.map((tab) => (
                <CNavItem className="mb-3" key={tab?.id} onClick={() => handleTabClick(tab?.id)}>
                  <div className="d-flex w-100">
                    <div className="d-flex w-100 flex-column ">
                      <div className="d-flex w-100 justify-content-between">
                        <div className="d-flex align-items-center gap-1">
                          {iconSet !== tab?.id && (
                            <CIcon
                              style={{ transform: 'rotate(90deg)' }}
                              onClick={() => (handleChange(tab?.id), getFloorList(tab?.id))}
                              icon={cibZeit}
                              size="sm"
                            />
                          )}
                          {iconSet === tab?.id && (
                            <CIcon
                              style={{ transform: 'rotate(180deg)' }}
                              onClick={() => {
                                handleChange(null)
                              }}
                              icon={cibZeit}
                              size="sm"
                            />
                          )}
                          <p
                            role="button"
                            onClick={() => (
                              setIds(tab?.id), handleSetModal('addBuilding', tab?.id)
                            )}
                          >
                            {tab?.name}
                          </p>
                        </div>
                        <div>
                          <CButton
                            className="btn-sm suppplyBtn"
                            onClick={() => (
                              setBuildingId(tab?.id),
                              setBuildingName(tab?.name),
                              handleSetModal('addFloor', 'add')
                            )}
                          >
                            {multiLangObj?.addFloor}
                          </CButton>
                        </div>
                      </div>
                      <div>
                        {sideBarId === tab?.id && (
                          <div>
                            {floorList?.map((catTab) => (
                              <CNavItem style={{ marginTop: '20px' }} key={catTab?.id}>
                                <div className="d-flex justify-content-between ms-2 mt-2">
                                  <div className="d-flex align-items-center gap-1">
                                    {iconCatSet !== catTab?.id && (
                                      <CIcon
                                        style={{ transform: 'rotate(90deg)' }}
                                        onClick={() => {
                                          handleCatIcon(catTab?.id)
                                          getRoomList(catTab?.id)
                                        }}
                                        icon={cibZeit}
                                        size="sm"
                                      />
                                    )}
                                    {iconCatSet === catTab?.id && (
                                      <CIcon
                                        style={{ transform: 'rotate(180deg)' }}
                                        onClick={() => {
                                          handleCatIcon(null)
                                        }}
                                        icon={cibZeit}
                                        size="sm"
                                      />
                                    )}
                                    <p
                                      role="button"
                                      onClick={() => (
                                        setIds(catTab?.id), handleSetModal('addFloor', catTab?.id)
                                      )}
                                    >
                                      {catTab?.name}
                                    </p>
                                  </div>
                                  <div>
                                    <CButton
                                      className="btn-sm suppplyBtn"
                                      onClick={() => (
                                        setBuildingId(tab?.id),
                                        handleSetModal('addRoom', 'add'),
                                        setFloorId(catTab?.id)
                                      )}
                                    >
                                      {multiLangObj?.addRoom}
                                    </CButton>
                                  </div>
                                </div>
                                <div>
                                  {sideSubBarId === catTab?.id && (
                                    <div>
                                      {roomList?.map((subCatTab) => (
                                        <CNavItem style={{ marginTop: '20px' }} key={subCatTab?.id}>
                                          <div className="d-flex justify-content-between ms-3 mt-2">
                                            <div className="d-flex align-items-center gap-1">
                                              <p
                                                role="button"
                                                onClick={() => (
                                                  setBuildingId(tab?.id),
                                                  handleSetModal('addRoom', subCatTab?.id),
                                                  setFloorId(catTab?.id)
                                                )}
                                              >
                                                {subCatTab?.name}
                                              </p>
                                            </div>
                                          </div>
                                        </CNavItem>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </CNavItem>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CNavItem>
              ))}
            </CSidebarNav>
          </CSidebar>
        </div>
        {getModal === 'allList' && (
          <div className="mb-4 ps-3 col-md-8">
            <div className="clearfix">
              <CButton className="float-end mx-2 mb-2 btn-success" onClick={exportData}>
                {multiLangObj?.export}
              </CButton>
            </div>
            <div className="d-flex justify-content-between align-items-center my-4">
              <div className="mx-1 d-flex mt-3">
                <input
                  className="form-control me-3"
                  value={filterData.search}
                  onChange={handleSearch}
                  placeholder="Search"
                />
                <CButton onClick={handleAllMeetingData}>Search</CButton>
              </div>
              <div className="d-flex gap-1">
                <div>
                  <p style={{ fontWeight: 'bolder', paddingLeft: '23px' }}>Item Status</p>
                  <CFormSelect
                    className="mx-4"
                    style={{ width: '170px' }}
                    value={filterData?.itemStatus}
                    options={[
                      { label: 'All', value: 'All' },
                      {
                        label: 'Available',
                        value: 'available',
                      },
                      {
                        label: 'Unavailable',
                        value: 'unAvailable',
                      },
                    ]}
                    onChange={handleAllMeetingStatusChange}
                  />
                </div>
                <div>
                  <p style={{ fontWeight: 'bolder' }}>Visibility</p>
                  <CFormSelect
                    style={{ width: '170px' }}
                    value={filterData?.visibility}
                    options={[
                      { label: 'All', value: 'All' },
                      {
                        label: 'Visible',
                        value: 'visible',
                      },
                      {
                        label: 'Hidden',
                        value: 'hide',
                      },
                    ]}
                    onChange={handleAllaupplieVisibility}
                  />
                </div>
              </div>
            </div>
            <div className="mb-2">
              <p style={{ fontSize: 'medium' }}>Total: {totalCount > 0 ? totalCount : '0'}</p>
            </div>
            <ReactTable
              showCheckbox={false}
              columns={columns}
              data={allMeetingData}
              totalCount={10}
              onSelectionChange={handleSelectionChange}
            />
            <div className="my-3 d-flex justify-content-center align-items-center">
              {allMeetingData.length > 0 && (
                <div className="d-flex gap-3">
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
                        // renderOnZeroPageCount={null}
                        pageRangeDisplayed={4}
                      />
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <label>{multiLangObj?.show}</label>
                    <CFormSelect
                      className=""
                      aria-label=""
                      value={itemsPerPage}
                      options={paginationItemPerPageOptions}
                      onChange={(event) => {
                        setItemsPerPage(parseInt(event?.target?.value))
                        setCurrentPage(0)
                      }}
                    />
                    <label>{multiLangObj?.lists}</label>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        <CModal
          backdrop="static"
          visible={deleteVisible}
          onClose={() => setDeleteVisible(false)}
          aria-labelledby="StaticBackdropExampleLabel"
        >
          <CModalHeader>
            <CModalTitle id="StaticBackdropExampleLabel">{multiLangObj?.deleteRoom}</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <p>{multiLangObj?.areYouSureToDeleteRoom}</p>
          </CModalBody>
          <CModalFooter>
            <CButton color="primary" onClick={() => (setDeleteVisible(false), deleteRoom())}>
              {multiLangObj?.delete}
            </CButton>
            <CButton color="secondary" onClick={() => setDeleteVisible(false)}>
              {multiLangObj?.cancel}
            </CButton>
          </CModalFooter>
        </CModal>

        {getModal === 'addBuilding' && (
          <AddBuilding
            setModal={setState}
            getMod={getState}
            Modal={setModal}
            getId={ids}
            buildingId={buildingId}
            removeIds={setIds}
            getVal={setIcon}
          />
        )}
        {getModal === 'addFloor' && (
          <AddFloor
            setModal={setState}
            getMod={getState}
            Modal={setModal}
            buildingId={buildingId}
            buildingName={buildingName}
            removeIds={setIds}
            getVal={setIcon}
            floorId={floorId}
          />
        )}
        {getModal === 'addRoom' && (
          <AddRoom
            setModal={setState}
            getMod={getState}
            Modal={setModal}
            buildingId={buildingId}
            removeIds={setIds}
            getVal={setIcon}
            floorId={floorId}
            roomId={roomId}
          />
        )}
      </div>
    </div>
  )
}

export default AllMeetingRooms
