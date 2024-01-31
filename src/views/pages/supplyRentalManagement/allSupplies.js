import { CButton, CDropdown, CFormSelect, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CNavItem, CNavLink, CSidebar, CSidebarBrand, CSidebarNav } from '@coreui/react'
import { enqueueSnackbar } from 'notistack'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import ReactPaginate from 'react-paginate'
import Loader from 'src/components/common/Loader'
import ReactTable from 'src/components/common/ReactTable'
import { getApi, getUserListExportData } from 'src/utils/Api'
import { API_ENDPOINT } from 'src/utils/config'
import { paginationItemPerPageOptions } from 'src/utils/constant'
import AddSupplyType from './Components/AddSupplyType'
import AddCategory from './Components/AddCategory'
import AddSubCategory from './Components/AddSubCategory'
import AddModel from './Components/AddModel'
import AddItem from './Components/AddItem'
import { Navigate, useNavigate } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cibZeit, cilCaretBottom, cilCaretRight } from '@coreui/icons'
import { useTranslation } from 'react-i18next'

const AllSupplies = () => {

  const { t, i18n } = useTranslation();
  const translationObject = i18n.getDataByLanguage(i18n.language);
  const multiLang = translationObject?.translation?.supplyRentalManagementAllSupplies

  const initialData = {
    search: '',
    itemStatus: '',
    visibility: '',
  }

  const [mainCategoryData, setMainCategoryData] = useState([])
  const [categoryData, setCategoryData] = useState([])
  const [subCategoryData, setSubCategoryData] = useState([])
  const [modelData, setModelData] = useState([])
  const [itemData, setItemData] = useState([])
  const [allSuppliesData, setAllSuppliesData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [filterData, setFilterData] = useState(initialData)
  const [totalCount, setTotalCount] = useState(0)
  const [deleteVisible, setDeleteVisible] = useState(false)
  const [getModal, setModal] = useState('allList')
  const [ids, setIds] = useState(null)
  const [suppyId, setSuppyId] = useState(null)
  const [catId, setCatId] = useState(null)
  const [modalId, setModalId] = useState(null)
  const [itemName, setItemName] = useState('')
  const navigate = useNavigate()
  const [sideBarId, setSidebarId] = useState(null)
  const [sideSubBarId, setSideSubbarId] = useState(null)
  const [sideModelId, setSideModelbarId] = useState(null)
  const [sideItemId, setSideItembarId] = useState(null)
  const [catIds, setCatIds] = useState(null)
  const [subCatIds, setSubCatIds] = useState(null)
  const [subModalIds, setModalIds] = useState(null)
  const [subItemIds, setItemIds] = useState(null)
  const [getState, setState] = useState(false)
  const [iconSet, setIcon] = useState(null)
  const [iconCatSet, setCatIcon] = useState(null)
  const [iconSubCatSet, setSubCatIcon] = useState(null)
  const [iconModSet, setModIcon] = useState(null)
  const [mainID, setMainID] = useState(null)
  const [categoryId, setCategoryId] = useState(null)
  const [subCategoryId, setSubCategoryId] = useState(null)
  const [getModalId, setGetModalId] = useState(null)


  const handleChange = (id) => {
    if (id === null) {
      setCategoryData([]);
      setSubCategoryData([]);
      setModelData([]);
      setItemData([]);
      setIcon(null)
      setCatIcon(null);
      setSubCatIcon(null);
      setModIcon(null);
    } else {
      setIcon(id);
    }
  };

  const handleCatIcon = async (id) => {
    if (id === null) {
      setSubCategoryData([]);
      setModelData([]);
      setItemData([]);
      setCatIcon(null)
      setSubCatIcon(null);
      setModIcon(null);
    } else {
      setCatIcon(id);
    }
  }

  const handleSubCatIcon = async (id) => {
    if (id === null) {
      setModelData([]);
      setItemData([]);
      setSubCatIcon(null);
      setModIcon(null);
    } else {
      setSubCatIcon(id);
    }
  }

  const handleModalIcon = async (id) => {
    if (id === null) {
      setItemData([]);
      setModIcon(null);
    } else {
      setModIcon(id);
    }
  }

  // useEffect(() => {
  //   setCategoryData([])
  //   setSubCategoryData([])
  //   setModelData([])
  //   getMainCategoryList();
  // }, [getModal])
  useEffect(() => {
    setCategoryData([])
    setSubCategoryData([])
    setModelData([])
    setItemData([])
    getMainCategoryList();
    handleAllSupplyRentaldata()
    setModal('allList')
  }, [getState])

  useEffect(() => {
    handleAllSupplyRentaldata()
  }, [filterData.itemStatus, filterData.visibility, itemsPerPage, currentPage])

  useEffect(() => {
    if (filterData?.search === '') {
      handleAllSupplyRentaldata()
    }
  }, [filterData.search])

  const columns = useMemo(() => [
    {
      Header: 'Supply Type',
      accessor: 'supplyType',
      Cell: ({ row }) => (
        <p className="text-center">{`${row.original.supplyType ? row.original.supplyType : '-'}`}</p>
      )

    },
    {
      Header: 'Subcategory',
      accessor: 'subCategoryName',
      Cell: ({ row }) => (
        <p className="text-center">{`${row.original.subCategoryName ? row.original.subCategoryName : '-'}`}</p>
      )
    },
    {
      Header: 'Model Name',
      accessor: 'modalName',
      Cell: ({ row }) => (
        <p className="text-center">{`${row.original.modalName ? row.original.modalName : '-'}`}</p>
      )
    },
    {
      Header: 'Item Number',
      accessor: 'itemNumber',
      Cell: ({ row }) => (
        <p className="text-center">{`${row.original.itemNumber ? row.original.itemNumber : '-'}`}</p>
      ),
    },
    {
      Header: 'Item Status',
      accessor: 'itemStatus',
      Cell: ({ row }) => (
        <p className="text-center">{`${row.original.itemStatus ? row.original.itemStatus : '-'}`}</p>
      ),
    },
    {
      Header: 'Action',
      Cell: ({ row }) => <div className='d-flex gap-4'>
        <a onClick={() => { handleSetModal('addItem'); setItemIds(row.original.id) }} className='greenTxt'>Modify</a>
        <a onClick={() => setDeleteVisible(true)} className='primTxt'>Delete</a>

      </div>
    }

  ])

  const getMainCategoryList = async () => {
    try {
      let url = API_ENDPOINT.get_main_category_list
      const response = await getApi(url)

      if (response?.status === 200) {
        setMainCategoryData(response?.data)
        // setUserInfoPopup(true)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getCategoryList = async (id) => {
    try {
      setSidebarId(id)
      let url = API_ENDPOINT.get_category_list + `?mainCategoryId=${id}`
      const response = await getApi(url)

      if (response?.status === 200) {
        setCategoryData(response?.data)
        // setUserInfoPopup(true)
      } else if (response?.status === 404) {
        setCategoryData(response?.data)
        setIcon(null)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getSubCategoryList = async (id) => {
    try {
      setSideSubbarId(id)
      let url = API_ENDPOINT.get_sub_category_list + `?categoryId=${id}`
      const response = await getApi(url)

      if (response?.status === 200) {
        setSubCategoryData(response?.data)
        // setUserInfoPopup(true)
      } else if (response?.status === 404) {
        setSubCategoryData(response?.data)
        setCatIcon(null)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getModalList = async (id) => {
    try {
      setSideModelbarId(id)
      let url = API_ENDPOINT.get_model_list + `?subCategoryId=${id}`
      const response = await getApi(url)

      if (response?.status === 200) {
        setModelData(response?.data)
        // setUserInfoPopup(true)
      } else if (response?.status === 404) {
        setModelData(response?.data)
        setSubCatIcon(null)
      }
    } catch (error) {
      console.log(error)
    }
  }


  const getItemList = async (Cid, Sid, Mid) => {
    try {
      setSideItembarId(Mid)
      let url = API_ENDPOINT.get_item_list + `?categoryId=${Cid}&subCategoryId=${Sid}&supplyModelId=${Mid}`
      const response = await getApi(url)

      if (response?.status === 200) {
        setItemData(response?.data)
        // setUserInfoPopup(true)
      } else if (response?.status === 404) {
        setItemData(response?.data)
        setModIcon(null)
      }
    } catch (error) {
      console.log(error)
    }
  }



  const handleTabClick = async (id) => {
    console.log('id =>', id);
  }

  const handleSelectionChange = useCallback((selectedRowsIds) => {
  }, []);

  const handleAllSupplyRentaldata = async () => {
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

      console.log('get All res =>', res.status);

      if (res?.status === 200) {
        setAllSuppliesData(res?.data)
        setTotalCount(res?.totalCount)
        setTotalPages(Math.ceil(res.totalCount / Number(itemsPerPage)))
        setIsLoading(false)

      } else if (res?.status === 404) {
        setAllSuppliesData(res?.data)
        setTotalCount(res?.totalCount)
        setIsLoading(false)
      }
    } catch (error) {
      setIsLoading(false)
      console.error('Error fetching data:', error);
    }
  }

  const handleAllSupplieRentalStatusChange = (e) => {
    const value = e.target.value
    setFilterData((prev) => {
      return {
        ...prev,
        // rentalStatus: value.toLowerCase()
        itemStatus: value
      }
    })
  }

  const handleAllaupplieVisibility = (e) => {
    const value = e.target.value
    // const id = e.target.selectedIndex
    setFilterData((prev) => {
      return {
        ...prev,
        visibility: value
      }
    })
  }

  const handleSearch = (e) => {
    const value = e.target.value
    console.log('value =>', value);
    setFilterData((prev) => {
      return {
        ...prev,
        search: value
      }
    })
  }

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected)
  }

  const exportData = async () => {
    setIsLoading(true)
    try {
      let url = API_ENDPOINT.get_all_supplies_export + `?offset=${currentPage + 1}&limit=${itemsPerPage}`

      if (filterData?.search) {
        url = url + `&search=${filterData?.search}`
      }
      if (filterData?.itemStatus !== 'All' && filterData?.itemStatus !== '') {
        url = url + `&itemStatus=${filterData?.itemStatus}`
      }
      if (filterData?.visibility !== 'All' && filterData?.visibility !== '') {
        url = url + `&visibility=${filterData?.visibility}`
      }

      console.log('url check =>', url);

      const res = await getUserListExportData(url)
      console.log('res =>', res);

      if (res.filePath) {
        const downloadLink = res.filePath;
        const link = document.createElement('a');
        link.href = 'https://ptkapi.experiencecommerce.com/' + downloadLink;
        link.setAttribute('download', `exported_data_${new Date().getTime()}.xlsx`);

        link.click();
        enqueueSnackbar('Data export successfull', { variant: 'success', autoHideDuration: 3000, })

        setIsLoading(false)
      } else {
        enqueueSnackbar('Something went wrong', { variant: 'error', autoHideDuration: 3000, })
        setIsLoading(false)
        console.log('No data found');
      }

    } catch (error) {

    }
  }

  const handleSetModal = async (type, add) => {

    if (type === 'allList') {
      setModal('allList')
      setFilterData({
        search: '',
        itemStatus: '',
        visibility: ''
      })
      setItemsPerPage(5)
      setCurrentPage(0)

    } else if (type === 'addSupplyType') {
      // setMainCategoryData([...mainCategoryData, { id: mainCategoryData.length + 1, name: 'New' }])
      if (add === 'add') {
        setIds(null)
      }
      setModal('addSupplyType')
    } else if (type === 'addCategory') {
      if (add === 'add') {
        setCatIds(null)
      }
      setModal('addCategory')
    } else if (type === 'addSubCategory') {
      if (add === 'add') {
        setSubCatIds(null)
      }
      setModal('addSubCategory')
    } else if (type === 'addModal') {
      if (add === 'add') {
        console.log('chck')
        setModalIds(null)
      }
      console.log('test =>', subModalIds);


      setModal('addModal')
    } else if (type === 'addItem') {
      if (add === 'add') {
        setItemIds(null)
        console.log('supplyID =>', mainID);
      } else {
        setMainID(null)
      }
      setModal('addItem')
    }
  }

  return (
    <div>
    <div className='d-flex justify-content-between  mb-4'>
      {isLoading && <Loader />}
      <div className='col-md-4'>
        <CSidebar className='w-100 pe-3'>
          <CSidebarBrand className=' black-text d-flex justify-content-start p-3' style={{ color: 'black', background: 'none' }}><h5>{multiLang?.categoryHierarchy}</h5></CSidebarBrand>
          <CSidebarBrand className=' black-text d-flex justify-content-between mb-2' style={{ color: 'black', borderBottom: '1px solid #000', background: 'none', alignItems: 'center' }}>
            <p role='button' onClick={() => handleSetModal('allList')}>{multiLang?.allSupplies}</p>
            <CButton className='text-center btn-sm' style={{
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            }} onClick={() => handleSetModal('addSupplyType', 'add')}>{multiLang?.addSupply}</CButton>
          </CSidebarBrand>
          <CSidebarNav style={{ color: 'black', padding: '3px', maxHeight: '500px', overflow: 'auto' }}>
            {mainCategoryData.map((tab) => (
              <CNavItem className='mb-3' key={tab.id} onClick={() => (handleTabClick(tab.id))}>
                <div className='d-flex w-100'>
                  <div className='d-flex w-100 flex-column '>
                    <div className='d-flex w-100 justify-content-between'>
                      <div className='d-flex align-items-center gap-1'>
                        {iconSet !== tab.id && <CIcon style={{ transform: 'rotate(90deg)' }} onClick={() => (handleChange(tab.id), getCategoryList(tab.id))} icon={cibZeit} size="sm" />}
                        {iconSet === tab.id && <CIcon style={{ transform: 'rotate(180deg)' }} onClick={() => { handleChange(null) }} icon={cibZeit} size="sm" />}
                        <p role='button' onClick={() => (setIds(tab.id), handleSetModal('addSupplyType'))}>{tab.name}</p>
                      </div>
                      <div>
                        <CButton className='btn-sm' onClick={() => { setSuppyId(tab.id); handleSetModal('addCategory', 'add') }}>{multiLang?.addCategory}</CButton>
                      </div>
                    </div>
                    <div>
                      {sideBarId === tab.id &&
                        <div>
                          {categoryData?.map((catTab) => (
                            <CNavItem style={{ marginTop: '20px' }} key={catTab.id}>
                              <div className='d-flex justify-content-between ms-2 mt-2'>
                                <div className='d-flex align-items-center gap-1'>
                                  {iconCatSet !== catTab.id && <CIcon style={{ transform: 'rotate(90deg)' }} onClick={() => { handleCatIcon(catTab.id); getSubCategoryList(catTab.id) }} icon={cibZeit} size="sm" />}
                                  {iconCatSet === catTab.id && <CIcon style={{ transform: 'rotate(180deg)' }} onClick={() => { handleCatIcon(null); }} icon={cibZeit} size="sm" />}
                                  <p role='button' onClick={() => (setSuppyId(tab.id), setCatIds(catTab.id), handleSetModal('addCategory'))}>{catTab.name}</p>
                                </div>
                                <div>
                                  <CButton className='btn-sm' onClick={() => { setCatId(catTab.id); handleSetModal('addSubCategory', 'add') }}>{multiLang?.addSubCategory}</CButton>
                                </div>
                              </div>
                              <div>
                                {sideSubBarId === catTab.id &&
                                  <div>
                                    {subCategoryData?.map((subCatTab) => (
                                      <CNavItem style={{ marginTop: '20px' }} key={subCatTab.id}>
                                        <div className='d-flex justify-content-between ms-3 mt-2'>
                                          <div className='d-flex align-items-center gap-1'>
                                            {iconSubCatSet !== subCatTab.id && <CIcon style={{ transform: 'rotate(90deg)' }} onClick={() => { handleSubCatIcon(subCatTab.id); getModalList(subCatTab.id) }} icon={cibZeit} size="sm" />}
                                            {iconSubCatSet === subCatTab.id && <CIcon style={{ transform: 'rotate(180deg)' }} onClick={() => { handleSubCatIcon(null); }} icon={cibZeit} size="sm" />}
                                            <p role='button' onClick={() => (setCatId(catTab.id), setSubCatIds(subCatTab.id), handleSetModal('addSubCategory'))}>{subCatTab.name}</p>
                                          </div>
                                          <div>
                                            <CButton className='btn-sm' onClick={() => { setModalId(subCatTab.id); handleSetModal('addModal', 'add') }}>{multiLang?.addModel}</CButton>
                                          </div>
                                        </div>
                                        {sideModelId === subCatTab.id &&
                                          <div>
                                            {modelData?.map((modalTab) => (
                                              <CNavItem style={{ marginTop: '20px' }} key={modalTab.id}>
                                                <div className='d-flex justify-content-between ms-4 mt-2'>
                                                  <div className='d-flex align-items-center gap-1'>
                                                    {iconModSet !== modalTab.id && <CIcon style={{ transform: 'rotate(90deg)' }} onClick={() => { handleModalIcon(modalTab.id); getItemList(catTab.id, subCatTab.id, modalTab.id) }} icon={cibZeit} size="sm" />}
                                                    {iconModSet === modalTab.id && <CIcon style={{ transform: 'rotate(180deg)' }} onClick={() => { handleModalIcon(null) }} icon={cibZeit} size="sm" />}

                                                    <p role='button' onClick={() => (setModalId(subCatTab.id), setModalIds(modalTab.id), handleSetModal('addModal'))}>{modalTab.name}</p>
                                                  </div>
                                                  <div>
                                                    <CButton className='btn-sm' onClick={() => { setCategoryId(catTab.id); setSubCategoryId(subCatTab.id); setMainID(tab.id); setItemName(modalTab.name); setGetModalId(modalTab.id); handleSetModal('addItem', 'add') }}>{multiLang?.addItem}</CButton>
                                                  </div>
                                                </div>
                                                {sideItemId === modalTab.id &&
                                                  <div>
                                                    {itemData?.map((itemTab) => (
                                                      <CNavItem style={{ marginTop: '20px' }} key={itemTab.id}>
                                                        <div className='d-flex justify-content-between ms-5 mt-2'>
                                                          <div className='d-flex align-items-center gap-1'>
                                                            {/* <CIcon onClick={() => (getItemList(catTab.id, subCatTab.id, itemTab.id))} icon={cibZeit} size="sm" /> */}
                                                            <p role='button' onClick={() => { setItemName(modalTab.name); setItemIds(itemTab.id); handleSetModal('addItem') }}>{itemTab.itemNumber}</p>
                                                          </div>
                                                          {/* <div>
                                                            <CButton className='btn-sm' onClick={() => handleSetModal('addSubCategory')}>{multiLang?.addSub}</CButton>
                                                          </div> */}
                                                        </div>
                                                      </CNavItem>
                                                    ))}
                                                  </div>
                                                }
                                              </CNavItem>
                                            ))}
                                          </div>
                                        }
                                      </CNavItem>
                                    ))}
                                  </div>
                                }
                              </div>
                            </CNavItem>
                          ))}
                        </div>
                      }
                    </div>
                  </div>

                </div>
              </CNavItem>
            ))}

          </CSidebarNav>

        </CSidebar>
      </div>
      {getModal === 'allList' &&
        <div className='mb-4 col-md-8'>
          <div className='clearfix'>
            <CButton className='float-end mx-2 mb-2 btn-success' onClick={exportData}>{multiLang?.export}</CButton>
          </div>
          <div className='d-flex justify-content-between align-items-center my-4'>
            <div className='mx-1 d-flex'>
              <input className=' me-3 form-control' placeholder='Search' value={filterData.search} onChange={handleSearch} />
              <CButton onClick={handleAllSupplyRentaldata}>{multiLang?.search}</CButton>
            </div>
            <div className='d-flex me-5 gap-1'>
              <CFormSelect
                className='mx-4'
                style={{ width: '170px' }}
                value={filterData?.itemStatus}
                options={[
                  { label: multiLang?.all, value: 'All' },
                  {
                    label: multiLang?.available, value: 'Available'
                  },
                  {
                    label: multiLang?.unAvailable, value: 'Unavailable'
                  }
                ]}
                onChange={handleAllSupplieRentalStatusChange}
              />
              <CFormSelect
                style={{ width: '170px' }}
                value={filterData?.visibility}
                options={[
                  { label: multiLang?.all, value: 'All' },
                  {
                    label: multiLang?.visible, value: 'visible'
                  },
                  {
                    label: multiLang?.hidden, value: 'hide'
                  }
                ]}
                onChange={handleAllaupplieVisibility}
              />
            </div>

          </div>
          <div className='mb-4'>
            <p style={{ fontSize: 'medium' }}>{multiLang?.total}: {totalCount > 0 ? totalCount : '0'}</p>
          </div>
          <ReactTable showCheckbox={false} columns={columns} data={allSuppliesData} totalCount={10} onSelectionChange={handleSelectionChange} />
          {allSuppliesData.length > 0 &&
            <div className='d-flex my-3 justify-content-center align-items-center gap-3'>
              <div className='userlist-pagination'>
                <div className='userlist-pagination dataTables_paginate'>
                  <ReactPaginate
                    breakLabel={'...'}
                    marginPagesDisplayed={1}
                    previousLabel={<button>{multiLang?.previous}</button>}
                    nextLabel={<button>{multiLang?.next}</button>}
                    pageCount={totalPages}
                    onPageChange={handlePageChange}
                    forcePage={currentPage}
                    // renderOnZeroPageCount={null}
                    pageRangeDisplayed={4}
                  />
                </div>

              </div>
              <div className='d-flex align-items-center gap-2 '>
                <label>{multiLang?.show}</label>
                <CFormSelect
                  className=''
                  aria-label=""
                  value={itemsPerPage}
                  options={paginationItemPerPageOptions}
                  onChange={(event) => {
                    setItemsPerPage(parseInt(event?.target?.value));
                    setCurrentPage(0)
                  }}
                />
                <label>{multiLang?.lists}</label>
              </div>
            </div>
          }
        </div>
      }
      <CModal
        backdrop="static"
        visible={deleteVisible}
        onClose={() => setDeleteVisible(false)}
        aria-labelledby="StaticBackdropExampleLabel"
      >
        <CModalHeader>
          <CModalTitle id="StaticBackdropExampleLabel">{multiLang?.deleteBoard}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>{multiLang?.deleteBoardPopUp}</p>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" >
            {multiLang?.delete}
          </CButton>
          <CButton color="primary" onClick={() => setDeleteVisible(false)}>{multiLang?.cancel}</CButton>
        </CModalFooter>
      </CModal>

      {getModal === 'addSupplyType' &&

        <AddSupplyType setModal={setState} getMod={getState} Modal={setModal} getId={ids} removeIds={setIds} getVal={setIcon} />

      }

      {getModal === 'addCategory' &&

        <AddCategory setModal={setState} getMod={getState} Modal={setModal} getMainCatId={suppyId} getCatId={catIds} removeCatIds={setCatIds} getVal={setIcon} setCat={setCatIcon} />

      }

      {getModal === 'addSubCategory' &&

        <AddSubCategory setModal={setState} getMod={getState} Modal={setModal} getMainSubCatId={catId} getSubCatId={subCatIds} removeSubCatIds={setSubCatIds} getVal={setIcon} setCat={setCatIcon} setSubIcon={setSubCatIcon} />

      }

      {getModal === 'addModal' &&
        <AddModel setModal={setState} getMod={getState} Modal={setModal} getMainModalId={modalId} getModalId={subModalIds} removeModalIds={setModalIds} getVal={setIcon} setCat={setCatIcon} setSubIcon={setSubCatIcon} setModalIcon={setModIcon} />
      }

      {getModal === 'addItem' &&
        <AddItem setModal={setState} getMod={getState} Modal={setModal} modalName={itemName} supplyID={mainID} setMainIds={setMainID} getVal={setIcon} setCat={setCatIcon} setSubIcon={setSubCatIcon} setModalIcon={setModIcon} getItemId={subItemIds} removeItemIds={setItemIds} getCatId={categoryId} setCatId={setCategoryId} getSubCatId={subCategoryId} setSubCatId={setSubCategoryId} getModId={getModalId} setModId={setGetModalId} />
      }



    </div>
  </div>
  )
}

export default AllSupplies
