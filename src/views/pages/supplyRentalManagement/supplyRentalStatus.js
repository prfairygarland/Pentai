import { CButton, CFormSelect, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CNav, CNavItem, CNavLink } from '@coreui/react'
import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import DatePicker from 'react-date-picker'
import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom';
import Loader from 'src/components/common/Loader';
import ReactTable from 'src/components/common/ReactTable';
import { getApi, getUserListExportData, putApi } from 'src/utils/Api';
import { API_ENDPOINT } from 'src/utils/config';
import { paginationItemPerPageOptions } from 'src/utils/constant';
import UserProfile from '../BookRentalManagement/Component/UserProfile';
import RentalStatus from '../BookRentalManagement/Component/RentalStatus';
import SupplyRentalUserDetals from './Components/SupplyRentalUserDetails';
import SupplyRentalDetails from './Components/SupplyRentalDetails';
import SupplyRentalHistory from './Components/SupplyRentalHistory';
import { useDispatch, useSelector } from 'react-redux';
import { rentalHistory } from 'src/state/SideBar/sideBarAction';
import { enqueueSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
export let imageUrl = 'https://ptkapi.experiencecommerce.com'


const SupplyRentalStatus = () => {

  const { t, i18n } = useTranslation();
  const translationObject = i18n.getDataByLanguage(i18n.language);
  const multiLang = translationObject?.translation?.supplyRentalManagement

  const initialData = {
    search: '',
    rentalStatus: '',
    supplyType: '',
    startDate: '',
    endDate: ''
  }

  const [activeTab, setActiveTab] = useState('');
  const [supplyRentalAllData, setSupplyRentalAllData] = useState([])
  const [supplyRentalRequestData, setSupplyRentalRequestData] = useState([])
  const [supplyReturnRequestData, setSupplyReturnRequestData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [filterData, setFilterData] = useState(initialData)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [suppliesType, setSuppliesType] = useState()
  const [popUp, setPopUp] = useState('')
  const [userInfoData, setUserInfoData] = useState({})
  const [userInfoPopup, setUserInfoPopup] = useState(false)
  const [RentalDetailsData, setRentalDetailsData] = useState({})
  const [supplyRentalHistoryData, setSupplyRentalHistoryData] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [currentHistoryPage, setCurrentHistoryPage] = useState(0)
  const [HistotalPages, setHisTotalPages] = useState(0)
  const [detailsPage, setDetailPage] = useState(false)
  const [page, setPage] = useState(1)
  const [confirmId, setConfirmId] = useState('')
  const [getsupplyIdAndid, setGetsupplyIdAndid] = useState({ supplyRentalId: null, id: null })



  const AllSupplyRentalColumns = useMemo(() => [
    {
      Header: multiLang?.supplyType,
      accessor: 'supplyType',
      Cell: ({ row }) => (
        <p className="text-center">{`${row.original.supplyType ? row.original.supplyType : '-'}`}</p>
      ),
    },
    {
      Header: multiLang?.modelName,
      accessor: 'modelName',
      Cell: ({ row }) => (
        <p className="text-center">{`${row.original.modelName ? row.original.modelName : '-'}`}</p>
      ),
    },
    {
      Header: multiLang?.itemNumber,
      accessor: 'itemNumber',
      Cell: ({ row }) => (
        <p className="text-center">{`${row.original.itemNumber ? row.original.itemNumber : '-'}`}</p>
      ),
    },
    {
      Header: multiLang?.rentalStatus,
      accessor: 'rentalStatus',
      Cell: ({ row }) => (
        <p className={row.original.rentalStatus === 'Rental Request' ? 'text-center text-success' : (row.original.rentalStatus === 'Renting (Overdue)' ? 'text-center text-danger' : (row.original.rentalStatus === 'Return Request' ? 'text-center getColour' : 'text-center'))}>{`${row.original.rentalStatus ? row.original.rentalStatus : '-'}`}</p>
      ),
    },
    {
      Header: multiLang?.userName,
      accessor: 'userName',
      Cell: ({ row }) => <Link onClick={() => { handleShowUserInfo(row.original.userId); setPopUp('userDetails') }} style={{ cursor: 'pointer' }}>{row.original.userName} </Link>,
    },
    {
      Header: multiLang?.rentalDuration,
      accessor: 'startDateTime',
      Cell: ({ row }) => (
        <p>
          {row.original.startDateTime
            ? ((moment(row.original.startDateTime).format('YYYY-MM-DD')) + ' - ' + (moment(row.original.endDateTime).format('YYYY-MM-DD')))
            : '-'}
        </p>
      ),
    },
    {
      Header: multiLang?.rentalDetails,
      accessor: '',
      Cell: ({ row }) => <button onClick={() => { setUserInfoPopup(true); setPopUp('RentalD'); handleShowRentalDetails(row.original.id) }} className='mx-3 px-3 py-2 rounded border-1'>{multiLang?.view}</button>
    },
    {
      Header: multiLang?.rentalHistory,
      accessor: '',
      Cell: ({ row }) => <button onClick={() => { handleRentalHistoryClick(row.original?.suppliesRentalId, row.original?.id) }} className='mx-3 px-3 py-2 rounded border-1'>{multiLang?.view}</button>
    }

  ], [])


  const RentalRequestSupplyColumns = useMemo(() => [
    {
      Header: multiLang?.supplyType,
      accessor: 'supplyType',
      Cell: ({ row }) => (
        <p className="text-center">{`${row.original.supplyType ? row.original.supplyType : '-'}`}</p>
      ),
    },
    {
      Header: multiLang?.modelName,
      accessor: 'modelName',
      Cell: ({ row }) => (
        <p className="text-center">{`${row.original.modelName ? row.original.modelName : '-'}`}</p>
      ),
    },
    {
      Header: multiLang?.itemNumber,
      accessor: 'itemNumber',
      Cell: ({ row }) => (
        <p className="text-center">{`${row.original.itemNumber ? row.original.itemNumber : '-'}`}</p>
      ),
    },
    {
      Header: multiLang?.rentalStatus,
      accessor: 'rentalStatus',
      Cell: ({ row }) => (
        <p className="text-center text-success">{`${row.original.rentalStatus ? row.original.rentalStatus : '-'}`}</p>
      ),
    },
    {
      Header: multiLang?.userName,
      accessor: 'userName',
      Cell: ({ row }) => <Link onClick={() => { handleShowUserInfo(row.original.userId); setPopUp('userDetails') }} style={{ cursor: 'pointer' }}>{row.original.userName} </Link>,
    },
    {
      Header: 'Rental Request Time',
      accessor: 'startDateTime',
      Cell: ({ row }) => (
        <p>
          {row.original.startDateTime
            ? moment(row.original.startDateTime).format('YYYY-MM-DD HH:mm:ss')
            : '-'}
        </p>
      ),
    },
    {
      Header: 'Rental Details',
      accessor: '',
      Cell: ({ row }) => <button onClick={() => { setUserInfoPopup(true); setPopUp('RentalD'); handleShowRentalDetails(row.original.id) }} className='mx-3 px-3 py-2 rounded border-1'>View</button>
    },
    {
      Header: 'Rental Confirm',
      accessor: '',
      // Cell: ({ row }) => <button>Confirm</button>
      // onClick={() => { { confirmSupply('Rental', row.original.id) } }}
      Cell: ({ row }) =>
        <div>
          <button className='mx-3 px-3 py-2 rounded border-1' onClick={() => handleConfirmRentalSupply(row.original.id)} style={{ cursor: 'pointer' }}>Confirm</button>

        </div>


    }

  ], [])

  const ReturnRequestSupplyColumns = useMemo(() => [
    {
      Header: multiLang?.supplyType,
      accessor: 'supplyType',
      Cell: ({ row }) => (
        <p className="text-center">{`${row.original.supplyType ? row.original.supplyType : '-'}`}</p>
      ),
    },
    {
      Header: multiLang?.modelName,
      accessor: 'modelName',
      Cell: ({ row }) => (
        <p className="text-center">{`${row.original.modelName ? row.original.modelName : '-'}`}</p>
      ),
    },
    {
      Header: multiLang?.itemNumber,
      accessor: 'itemNumber',
      Cell: ({ row }) => (
        <p className="text-center">{`${row.original.itemNumber ? row.original.itemNumber : '-'}`}</p>
      ),
    },
    {
      Header: multiLang?.rentalStatus,
      accessor: 'rentalStatus',
      Cell: ({ row }) => (
        <p className="text-center getColour">{`${row.original.rentalStatus ? row.original.rentalStatus : '-'}`}</p>
      ),
    },
    {
      Header: multiLang?.userName,
      accessor: 'userName',
      Cell: ({ row }) => <Link onClick={() => { handleShowUserInfo(row.original.userId); setPopUp('userDetails') }} style={{ cursor: 'pointer' }}>{row.original.userName} </Link>,
    },
    {
      Header: multiLang?.returnRequestTime,
      accessor: 'returnDate',
      Cell: ({ row }) => (
        <p>
          {row.original.returnDate
            ? moment(row.original.returnDate).format('YYYY-MM-DD HH:mm:ss')
            : '-'}
        </p>
      ),
    },
    {
      Header: multiLang?.rentalDetails,
      accessor: '',
      Cell: ({ row }) => <button onClick={() => { setUserInfoPopup(true); setPopUp('RentalD'); handleShowRentalDetails(row.original.id) }} className='mx-3 px-3 py-2 rounded border-1'>{multiLang?.view}</button>
    },
    {
      Header: multiLang?.returnConfirm,
      accessor: '',
      // Cell: ({ row }) => <button>Confirm</button>
      Cell: ({ row }) => <button className='mx-3 px-3 py-2 rounded border-1' onClick={() => { confirmSupply('Returned', row.original.id) }} style={{ cursor: 'pointer' }}>Confirm</button>,
    }

  ], [])

  const columns = useMemo(() => [
    {
      Header: multiLang?.no,
      accessor: '',
      // Cell: ({ row }) => <p>{row.original.id}</p>
      Cell: ({ row }) => {
        return (currentHistoryPage - 1) * itemsPerPage + (row.index + 1)
      }
    },
    {
      Header: multiLang?.userName,
      accessor: 'user Name',
      Cell: ({ row }) => <p>{row.original.userName}</p>
    },
    {
      Header: multiLang?.rentalRequestedDate,
      accessor: 'Rental Date',
      Cell: ({ row }) => <p>{moment(row.original.startDateTime).format("YYYY-MM-DD")} - {moment(row.original.endDateTime).format("YYYY-MM-DD")} </p>
    },
    {
      Header: multiLang?.returnedDate,
      accessor: 'Returned Date',
      Cell: ({ row }) => <p>{row.original.returnDate ? moment(row.original.returnDate).format("YYYY-MM-DD") : '-'}</p>
    },
    {
      Header: multiLang?.rentalStatus,
      accessor: 'Rental',
      Cell: ({ row }) => <p>{row.original.status}</p>
    },

  ], [])


  const confirmSupply = async (type, id) => {

    try {
      let data = {
        id: id,
        status: type
      }

      const res = await putApi(API_ENDPOINT.get_supply_confirm, data)

      console.log('res =>', res)

      if (res?.status === 200) {
        handleSupplyRenatalData()
      }

    } catch (error) {

    }

  }

  const handleRentalHistoryClick = async (supplyRentalId, id) => {
    setUserInfoPopup(true);
    setPopUp('RenatlH')
    handleShowRentalHistory(1, supplyRentalId, id)
    setGetsupplyIdAndid({ supplyRentalId: supplyRentalId, id: id })
  }

  const handleHistoryPageChange = (selectedPage) => {
    setCurrentHistoryPage(selectedPage.selected)
    handleShowRentalHistory(selectedPage.selected + 1, getsupplyIdAndid.supplyRentalId, getsupplyIdAndid.id)
  }

  const historyExportData = async (supplyRentalId, pageNoData) => {
    setIsLoading(true)
    try {
      let url = API_ENDPOINT.get_supply_rental_history_export + `?offset=${pageNoData}&supplyRentalId=${supplyRentalId}`



      console.log('url check =>', url);

      const res = await getUserListExportData(url)
      console.log('res =>', res);

      if (res.filePath) {
        const downloadLink = res.filePath;
        const link = document.createElement('a');
        link.href = 'https://ptkapi.experiencecommerce.com/' + downloadLink;
        link.setAttribute('download', `exported_data_${new Date().getTime()}.xlsx`);

        link.click();
        enqueueSnackbar(multiLang?.dataExportSuccessfull, { variant: 'success', autoHideDuration: 3000, })
        setIsLoading(false)
      } else {
        enqueueSnackbar('Something went wrong', { variant: 'error', autoHideDuration: 3000, })
        setIsLoading(false)
        console.log('No data found');
      }

    } catch (error) {

    }
  }

  const handleConfirmRentalSupply = async (id) => {
    setDetailPage(true)
    setConfirmId(id)
  }

  const handleSelectionChange = useCallback((selectedRowsIds) => {
  }, []);

  const handleShowUserInfo = async (userId) => {
    let url = API_ENDPOINT.get_supply_userdetails + `?userId=${userId}`

    try {
      const response = await getApi(url)
      if (response?.status === 200) {
        setUserInfoData(response?.data)
        setUserInfoPopup(true)
      }
    } catch (error) {
      console.log(error)
    }
  }

  console.log('page no', page);

  const handleShowRentalDetails = async (id) => {
    let url = API_ENDPOINT.get_supply_rentaldetails + `?id=${id}`
    try {
      const response = await getApi(url)
      if (response?.status === 200) {
        setRentalDetailsData(response.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleShowRentalHistory = async (pageNo, rentalId, id) => {
    let url = API_ENDPOINT.get_supply_rental_history + `?supplyRentalId=${rentalId}&offset=${pageNo}`
    setCurrentHistoryPage(pageNo)
    try {
      const response = await getApi(url)
      if (response?.status === 200) {
        setSupplyRentalHistoryData(response?.data)
        setTotalCount(response?.totalCount)
        setHisTotalPages(Math.ceil(response.totalCount / Number(itemsPerPage)));
      }
    } catch (error) {
      console.log(error)
    }
    handleShowRentalDetails(id)
  }

  const getSupplyType = async () => {
    try {
      let url = API_ENDPOINT.get_supply_category_list
      const res = await getApi(url)
      if (res?.status === 200) {
        setSuppliesType(res.data)
      }

      if (res?.status === 200) {
        const data = await res?.data?.map((op) => {
          return { 'label': op?.name, 'value': op?.id }

        })
        setSuppliesType((pre) => {
          return [{ label: multiLang?.all, value: 0 }, ...data]
        })
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const handleTabClick = (value) => {
    console.log('value =>', value);
    setFilterData({
      search: '',
      rentalStatus: '',
      supplyType: '',
      startDate: '',
      endDate: ''
    })
    setItemsPerPage(5);
    setCurrentPage(0)
    setActiveTab(value);
    try {

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    handleSupplyRenatalData()
  }, [activeTab, filterData.rentalStatus, filterData.supplyType, filterData.startDate, filterData.endDate, itemsPerPage, currentPage, userInfoPopup])

  useEffect(() => {
    getSupplyType()
  }, [])

  const handleSupplyRenatalData = async () => {
    try {
      if (activeTab === '') {
        handleAllSupplyRentaldata()
        setSupplyRentalRequestData([])
        setSupplyReturnRequestData([])
      } else if (activeTab === 'rentalRequest') {
        handleRentalRequestSupplyRentaldata()
        setSupplyReturnRequestData([])
        setSupplyRentalAllData([])
      } else if (activeTab === 'returnRequest') {
        handleReturnRequestSupplyRentaldata()
        setSupplyRentalAllData([])
        setSupplyRentalRequestData([])
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const exportData = async () => {
    setIsLoading(true)
    try {
      let url = API_ENDPOINT.get_supply_export + `?offset=${currentPage + 1}&limit=${itemsPerPage}`

      if (activeTab !== '') {
        url = url + `&rentalStatus=${activeTab}`
      }

      if (filterData?.search) {
        url = url + `&search=${filterData?.search}`
      }
      if (filterData?.rentalStatus !== 'All' && filterData?.rentalStatus !== '') {
        url = url + `&status=${filterData?.rentalStatus}`
      }
      if (filterData.supplyType) {
        url = url + `&categoryId=${filterData.supplyType}`
      }
      if (filterData?.startDate && filterData?.endDate) {
        url = url + `&startDate=${moment(filterData.startDate).format("YYYY-MM-DD")}&endDate=${moment(filterData.endDate).format("YYYY-MM-DD")}`
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
        enqueueSnackbar(multiLang?.dataExportSuccessfull, { variant: 'success', autoHideDuration: 3000, })
        setIsLoading(false)
      } else {
        enqueueSnackbar('Something went wrong', { variant: 'error', autoHideDuration: 3000, })
        setIsLoading(false)
        console.log('No data found');
      }

    } catch (error) {

    }
  }

  const handleAllSupplyRentaldata = async () => {
    setIsLoading(true)
    try {


      let url = API_ENDPOINT.get_supply_list + `?offset=${currentPage + 1}&limit=${itemsPerPage}`

      if (filterData?.search) {
        url = url + `&search=${filterData?.search}`
      }
      if (filterData?.rentalStatus !== 'All' && filterData?.rentalStatus !== '') {
        url = url + `&status=${filterData?.rentalStatus}`
      }
      if (filterData.supplyType) {
        url = url + `&categoryId=${filterData.supplyType}`
      }
      if (filterData?.startDate && filterData?.endDate) {
        url = url + `&startDate=${moment(filterData.startDate).format("YYYY-MM-DD")}&endDate=${moment(filterData.endDate).format("YYYY-MM-DD")}`
      }

      const res = await getApi(url)

      console.log('get All res =>', res.status);

      if (res?.status === 200) {
        setSupplyRentalAllData(res.data)
        setTotalPages(Math.ceil(res.totalCount / Number(itemsPerPage)))
        setIsLoading(false)

      } else {
        setSupplyRentalAllData([])
        setIsLoading(false)
      }
    } catch (error) {
      setIsLoading(false)
      console.error('Error fetching data:', error);
    }
  }

  const handleRentalRequestSupplyRentaldata = async () => {
    setIsLoading(true)
    try {

      let url = API_ENDPOINT.get_supply_list + `?rentalStatus=${activeTab}&offset=${currentPage + 1}&limit=${itemsPerPage}`

      if (filterData?.search) {
        url = url + `&search=${filterData?.search}`
      }
      if (filterData?.rentalStatus !== 'All' && filterData?.rentalStatus !== '') {
        url = url + `&status=${filterData?.rentalStatus}`
      }
      if (filterData.supplyType) {
        url = url + `&categoryId=${filterData.supplyType}`
      }
      if (filterData?.startDate && filterData?.endDate) {
        url = url + `&startDate=${moment(filterData.startDate).format("YYYY-MM-DD")}&endDate=${moment(filterData.endDate).format("YYYY-MM-DD")}`
      }

      const res = await getApi(url)

      console.log('get ret res =>', res);


      if (res?.status === 200) {
        setSupplyRentalRequestData(res.data)
        setTotalPages(Math.ceil(res.totalCount / Number(itemsPerPage)))
        setIsLoading(false)

      } else {
        setSupplyRentalRequestData([])
        setIsLoading(false)
      }
    } catch (error) {
      setIsLoading(false)
      console.error('Error fetching data:', error);
    }
  }



  const handleReturnRequestSupplyRentaldata = async () => {
    setIsLoading(true)
    try {
      let url = API_ENDPOINT.get_supply_list + `?rentalStatus=${activeTab}&offset=${currentPage + 1}&limit=${itemsPerPage}`

      if (filterData?.search) {
        url = url + `&search=${filterData?.search}`
      }
      if (filterData?.rentalStatus) {
        url = url + `&status=${filterData?.rentalStatus !== 'All' && filterData?.rentalStatus !== ''}`
      }
      if (filterData.supplyType) {
        url = url + `&categoryId=${filterData.supplyType}`
      }
      if (filterData?.startDate && filterData?.endDate) {
        url = url + `&startDate=${moment(filterData.startDate).format("YYYY-MM-DD")}&endDate=${moment(filterData.endDate).format("YYYY-MM-DD")}`
      }

      const res = await getApi(url)

      console.log('get rent res =>', res);

      if (res.status === 200) {
        setSupplyReturnRequestData(res.data)
        setTotalPages(Math.ceil(res.totalCount / Number(itemsPerPage)))
        setIsLoading(false)

      } else {
        setSupplyReturnRequestData([])
        setIsLoading(false)
      }
    } catch (error) {
      setIsLoading(false)
      console.error('Error fetching data:', error);
    }
  }

  const handleSupplyType = (e) => {
    const value = e.target.value
    // const id = e.target.selectedIndex
    setFilterData((prev) => {
      return {
        ...prev,
        supplyType: value
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

  const handleStartDate = (event) => {
    console.log('event =>', event);
    if (event != null) {
      const value = moment(event).format("YYYY-MM-DD")
      console.log('val', value)
      setFilterData((prev) => {
        return {
          ...prev,
          startDate: value
        }
      })
    } else {
      setFilterData((prev) => {
        return {
          ...prev,
          startDate: ''
        }
      })
    }
  }

  const handleEndDate = (event) => {
    const value = moment(event).format("YYYY-MM-DD")
    console.log('val', value)
    if (event != null) {
      const value = moment(event).format("YYYY-MM-DD")
      console.log('val', value)
      setFilterData((prev) => {
        return {
          ...prev,
          endDate: value
        }
      })
    } else {
      setFilterData((prev) => {
        return {
          ...prev,
          endDate: ''
        }
      })
    }
  }

  const handleRentalStatusChange = (e) => {
    const value = e.target.value
    setFilterData((prev) => {
      return {
        ...prev,
        // rentalStatus: value.toLowerCase()
        rentalStatus: value
      }
    })
  }

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected)
  }

  useEffect(() => {
    if (filterData?.search === '') {
      handleSupplyRenatalData()
    }
  }, [filterData.search])


  return (
    <div className='mb-5'>
      {isLoading && <Loader />}
      <main>
        <div className='mb-2'>
          <CNav variant="underline" className='d-flex gap3 tabNav'>
            <CNavItem >
              <CNavLink role='button' className={activeTab === '' ? 'active' : ''} onClick={() => handleTabClick('')}>
                {multiLang?.all}
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink role='button' className={activeTab === 'rentalRequest' ? 'active' : ''} onClick={() => handleTabClick('rentalRequest')}>{multiLang?.rentalRequest}</CNavLink>
            </CNavItem>
            <CNavItem >
              <CNavLink role='button' className={activeTab === 'returnRequest' ? 'active' : ''} onClick={() => handleTabClick('returnRequest')}>{multiLang?.returnRequest}</CNavLink>
            </CNavItem>
          </CNav>
        </div>
        <div className='clearfix'>
          <CButton className='float-end mx-2' onClick={() => exportData()}>{multiLang?.export}</CButton>
        </div>
        <div className='d-flex justify-content-between align-items-center my-4'>
          <div className='mx-1 d-flex'>
            <input className='px-4 me-3' value={filterData.search} onChange={handleSearch} />
            <CButton onClick={handleSupplyRenatalData}>{multiLang?.search}</CButton>
          </div>
          <div className='d-flex me-5 gap-1'>
            <CFormSelect
              className='mx-4'
              style={{ width: '170px' }}
              value={filterData?.rentalStatus}
              options={[
                { label: multiLang?.all, value: 'All' },
                {
                  label: multiLang?.rentalRequested, value: 'Rental Request'
                },
                {
                  label: multiLang?.renting, value: 'Renting'
                },
                { label: multiLang?.rentingProvided, value: 'Renting (Provided)' },
                { label: multiLang?.rentingOverdue, value: 'renting (Overdue)' },
                { label: multiLang?.returnedRequested, value: 'Return Request' },
                { label: multiLang?.returned, value: 'returned' }

              ]}
              onChange={handleRentalStatusChange}
            />
            <CFormSelect
              style={{ width: '170px' }}
              options={suppliesType}
              value={filterData?.supplyType}
              onChange={handleSupplyType}
            />
          </div>
          <div className='d-flex p-2 gap-3'>
            <DatePicker value={filterData.startDate} onChange={handleStartDate} />
            <DatePicker value={filterData.endDate} onChange={handleEndDate} />
          </div>
        </div>
        <div>
          {activeTab === '' &&
            <div>
              <ReactTable showCheckbox={false} columns={AllSupplyRentalColumns} data={supplyRentalAllData} totalCount={10} onSelectionChange={handleSelectionChange} />
            </div>
          }
          {activeTab === 'rentalRequest' &&
            <ReactTable showCheckbox={false} columns={RentalRequestSupplyColumns} data={supplyRentalRequestData} totalCount={10} onSelectionChange={handleSelectionChange} />
          }
          {activeTab === 'returnRequest' &&
            <ReactTable showCheckbox={false} columns={ReturnRequestSupplyColumns} data={supplyReturnRequestData} totalCount={10} onSelectionChange={handleSelectionChange} />
          }
        </div>

        <div className='d-flex w-100 justify-content-center gap-3'>
          {(supplyRentalAllData.length > 0 || supplyRentalRequestData.length > 0 || supplyReturnRequestData.length > 0) &&
            <div className='d-flex gap-3'>
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
              <div className='d-flex align-items-center gap-2 mt-2'>
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
        <CModal
          alignment="center"
          visible={userInfoPopup}
          size='lg'
          onClose={() => {
            setUserInfoPopup(false)
            setUserInfoData({})
            setRentalDetailsData({})
            setGetsupplyIdAndid({ supplyRentalId: null, id: null })
          }}
          backdrop="static"
          aria-labelledby="LiveDemoExampleLabel">
          <CModalHeader onClose={() => {
            setUserInfoPopup(false)
            setUserInfoData({})
            setRentalDetailsData({})
            setGetsupplyIdAndid({ supplyRentalId: null, id: null })
          }}>
            {popUp === 'userDetails' && <CModalTitle className='p-1'>{multiLang?.userInformation}</CModalTitle>}
            {popUp === 'RentalD' && <CModalTitle className='p-1'>{multiLang?.rentalDetails}</CModalTitle>}
            {popUp === 'RenatlH' && <CModalTitle className='p-1'>{multiLang?.rentalHistory}</CModalTitle>}



          </CModalHeader>
          <CModalBody>
          {popUp === 'userDetails' ?
            <SupplyRentalUserDetals userInfoData={userInfoData} type={'supply'} />
            : ''}
          {
            popUp === 'RentalD' ?
              <SupplyRentalDetails endModal={setUserInfoPopup} RentalStatusData={RentalDetailsData} setRentalDetailsData={setRentalDetailsData} setUserInfoPopup={setUserInfoPopup} type={'supplyRentDetalils'} /> : ''
          }
          {
            popUp === 'RenatlH' ?
              // <SupplyRentalHistory setCurrentPage={setCurrentPage} currentPage={currentPage} handleShowRentalHistory={handleShowRentalHistory} RentalHistoryData={supplyRentalHistoryData} page={page} setPage={setPage} RentalStatusData={RentalDetailsData} totalCount={totalCount} HistotalPages={HistotalPages} />

              <div>
                <div className='p-md-4'>
                  <div className='d-flex align-content-center g-2'>
                    <p style={{ fontSize: 'medium' }}>{multiLang?.modelName}:</p>
                    <p style={{ fontSize: 'medium', paddingLeft: 5, fontWeight: '600' }}>{RentalDetailsData?.modelName}</p>
                  </div>
                  <div className='d-flex align-content-center g-2'>
                    <p>{multiLang?.itemNumber}: </p>
                    <p style={{ fontSize: 'medium', paddingLeft: 5, fontWeight: '600' }}>{RentalDetailsData?.itemNumber}</p>
                  </div>
                  <div className='d-flex justify-content-between py-md-3 '>
                    <p style={{ fontSize: 'medium' }}>{multiLang?.total}: {totalCount > 0 ? totalCount : '-'}</p>
                    <button className='mx-3 px-3 py-2 rounded border-1' onClick={() => historyExportData(getsupplyIdAndid.supplyRentalId, currentHistoryPage)}>{multiLang?.export}</button>
                  </div>
                </div>
                <ReactTable columns={columns} data={supplyRentalHistoryData} showCheckbox={false} onSelectionChange={handleSelectionChange} />
                {supplyRentalHistoryData.length > 0 &&
                  <div className='userlist-pagination py-3'>
                    <div className='userlist-pagination dataTables_paginate'>
                      <ReactPaginate
                        breakLabel={'...'}
                        marginPagesDisplayed={1}
                        previousLabel={<button>{multiLang?.previous}</button>}
                        nextLabel={<button>{multiLang?.next}</button>}
                        pageCount={HistotalPages}
                        onPageChange={handleHistoryPageChange}
                        forcePage={currentHistoryPage - 1}
                        // renderOnZeroPageCount={null}
                        pageRangeDisplayed={4}
                      />
                    </div>

                  </div>
                }
              </div>

              : ''
          }
          </CModalBody>
        </CModal >
      </main>

      <div>
        <CModal
          visible={detailsPage}
          onClose={() => (setConfirmId(''), setDetailPage(false))}
          aria-labelledby="LiveDemoExampleLabel"
        >
          <CModalHeader onClose={() => (setConfirmId(''), setDetailPage(false))}>
            <CModalTitle id="LiveDemoExampleLabel">{multiLang?.rentalConfirm}</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <p>{multiLang?.rentalConfirmPopUp}</p>
          </CModalBody>
          <CModalFooter>
            <CButton onClick={() => { setUserInfoPopup(true); setPopUp('RentalD'); handleShowRentalDetails(confirmId) }} color="primary">{multiLang?.goToRentalDetails}</CButton>
          </CModalFooter>
        </CModal>
      </div>

    </div>
  )
}

export default SupplyRentalStatus

