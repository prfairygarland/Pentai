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
import { getApi, getUserListExportData } from 'src/utils/Api'
import { API_ENDPOINT } from 'src/utils/config'
import { paginationItemPerPageOptions } from 'src/utils/constant'
import AddBuilding from './AddBuilding'
import AddFloor from './AddFloor'
import CIcon from '@coreui/icons-react'
import { cibZeit } from '@coreui/icons'
import { useTranslation } from 'react-i18next'

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
  const [subCatIds, setSubCatIds] = useState(null)
  const [subItemIds, setItemIds] = useState(null)
  const [getState, setState] = useState(false)
  const [iconSet, setIcon] = useState(null)
  const [iconCatSet, setCatIcon] = useState(null)
  const [iconSubCatSet, setSubCatIcon] = useState(null)
  const [iconModSet, setModIcon] = useState(null)

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

  const columns = useMemo(() => [
    {
      Header: multiLangObj?.location,
      accessor: 'location',
      Cell: ({ row }) => (
        <p className="text-center">{`${
          row.original.supplyType ? row.original.supplyType : '-'
        }`}</p>
      ),
    },
    {
      Header: multiLangObj?.floor,
      accessor: 'subCategoryName',
      Cell: ({ row }) => (
        <p className="text-center">{`${
          row.original.subCategoryName ? row.original.subCategoryName : '-'
        }`}</p>
      ),
    },
    {
      Header: multiLangObj?.meetingRoomName,
      accessor: 'modalName',
      Cell: ({ row }) => (
        <p className="text-center">{`${row.original.modalName ? row.original.modalName : '-'}`}</p>
      ),
    },
    {
      Header: multiLangObj?.meetingRoomCode,
      accessor: 'itemNumber',
      Cell: ({ row }) => (
        <p className="text-center">{`${
          row.original.itemNumber ? row.original.itemNumber : '-'
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
          <CButton
            onClick={() => {
              handleSetModal('addItem')
              setItemIds(row.original.id)
            }}
          >
            Modify
          </CButton>
          <CButton onClick={() => setDeleteVisible(true)}>Delete</CButton>
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
      let url = API_ENDPOINT.get_all_supplies + `?offset=${currentPage + 1}&limit=${itemsPerPage}`

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
      } else if (res?.status === 404) {
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
        API_ENDPOINT.get_all_supplies_export + `?offset=${currentPage + 1}&limit=${itemsPerPage}`

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
        link.href = 'https://ptkapi.experiencecommerce.com/' + downloadLink
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
      }
      setModal('addBuilding')
    } else if (type === 'addFloor') {
      if (add === 'add') {
        setIds(null)
      }
      setModal('addFloor')
    }
  }

  return (
    <div>
      <div className="d-flex justify-content-between gap-4 mb-4">
        {isLoading && <Loader />}
        <div className="col-md-3">
          <CSidebar>
            <CSidebarBrand
              className=" black-text d-flex justify-content-start p-3"
              style={{ color: 'black', background: 'none' }}
            >
              <h6>All Meetings</h6>
            </CSidebarBrand>
            <CSidebarBrand
              className=" black-text d-flex justify-content-between mb-2"
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
                className="text-center btn-sm"
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
              style={{ color: 'black', padding: '3px', maxHeight: '500px', overflow: 'auto' }}
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
                            onClick={() => (setIds(tab?.id), handleSetModal('addBuilding'))}
                          >
                            {tab?.name}
                          </p>
                        </div>
                        <div>
                          <CButton
                            className="btn-sm"
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
                                        setBuildingId(tab?.id),
                                        setBuildingName(tab?.name),
                                        handleSetModal('addFloor', 'add'),
                                        setBuildingId(catTab?.id)
                                      )}
                                    >
                                      {catTab?.name}
                                    </p>
                                  </div>
                                  <div>
                                    <CButton
                                      className="btn-sm"
                                      onClick={() => {
                                        handleSetModal('addSubCategory', 'add')
                                      }}
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
                                                  setSubCatIds(subCatTab?.id),
                                                  handleSetModal('addSubCategory')
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
          <div className="mb-4 col-md-9">
            <div className="clearfix">
              <CButton className="float-end mx-2 mb-2" onClick={exportData}>
                {multiLangObj?.export}
              </CButton>
            </div>
            <div className="d-flex justify-content-between align-items-center my-4">
              <div className="mx-1 d-flex">
                <input className="px-4 me-3" value={filterData.search} onChange={handleSearch} />
                <CButton onClick={handleAllMeetingData}>Search</CButton>
              </div>
              <div className="d-flex me-5 gap-1">
                <CFormSelect
                  className="mx-4"
                  style={{ width: '170px' }}
                  value={filterData?.itemStatus}
                  options={[
                    { label: 'All', value: 'All' },
                    {
                      label: 'Available',
                      value: 'Available',
                    },
                    {
                      label: 'Unavailable',
                      value: 'Unavailable',
                    },
                  ]}
                  onChange={handleAllMeetingStatusChange}
                />
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
            <div className="mb-4">
              <p style={{ fontSize: 'medium' }}>Total: {totalCount > 0 ? totalCount : '0'}</p>
            </div>
            <ReactTable
              showCheckbox={false}
              columns={columns}
              data={allMeetingData}
              totalCount={10}
              onSelectionChange={handleSelectionChange}
            />
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
                <div className="d-flex align-items-center gap-2 mt-2">
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
        )}
        <CModal
          backdrop="static"
          visible={deleteVisible}
          onClose={() => setDeleteVisible(false)}
          aria-labelledby="StaticBackdropExampleLabel"
        >
          <CModalHeader>
            <CModalTitle id="StaticBackdropExampleLabel">{multiLangObj?.deleteBoard}</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <p>{multiLangObj?.areYouSureToDeleteRoom}</p>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setDeleteVisible(false)}>
              {multiLangObj?.delete}
            </CButton>
            <CButton color="primary" onClick={() => setDeleteVisible(false)}>
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
            removeIds={setIds}
            getVal={setIcon}
          />
        )}
        {getModal === 'addFloor' && (
          <AddFloor
            setModal={setState}
            getMod={getState}
            Modal={setModal}
            getId={ids}
            buildingId={buildingId}
            buildingName={buildingName}
            removeIds={setIds}
            getVal={setIcon}
          />
        )}
      </div>
    </div>
  )
}

export default AllMeetingRooms
