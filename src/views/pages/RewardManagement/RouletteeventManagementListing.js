import { CButton, CFormSelect, CNav, CNavItem, CNavLink } from '@coreui/react'
import moment from 'moment'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import DatePicker from 'react-date-picker'
import { useTranslation } from 'react-i18next'
import ReactPaginate from 'react-paginate'
import { NavLink, useNavigate } from 'react-router-dom'
import Loader from 'src/components/common/Loader'
import ReactTable from 'src/components/common/ReactTable'
import { getApi } from 'src/utils/Api'
import { ALL_CONSTANTS, API_ENDPOINT } from 'src/utils/config'
import { paginationItemPerPageOptions } from 'src/utils/constant'

const RouletteeventManagementListing = () => {

  const initialData = {
    search: '',
    Status: '',
    startDate: '',
    endDate: ''
  }

  const { t, i18n } = useTranslation();
  const translationObject = i18n.getDataByLanguage(i18n.language);
  const multiLang = translationObject?.translation?.RouletteeventManagementListing
  const [filterData, setFilterData] = useState(initialData)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('');
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [RouletteEvents, setRouletteEvents] = useState([])

  const navigate = useNavigate();

  const perPageValue = [
    { label: '10', value: 10 },
    { label: '30', value: 30 },
    { label: '50', value: 50 },
    { label: '100', value: 100 }

  ]

  useEffect(() => {
    getRouletteEvents()
  }, [activeTab, itemsPerPage, currentPage, filterData.Status, filterData.startDate, filterData.endDate,])

  useEffect(() => {
    if (filterData?.search === '') {
      getRouletteEvents()
    }
  }, [filterData.search])


  const columns = useMemo(() => [

    {
      Header: multiLang?.status,
      accessor: 'status',
      Cell: ({ row }) => <p style={{ textTransform: 'capitalize' }} className='text-center'>{row.original.stauts ? row.original.stauts : '-'}</p>
    },
    {
      Header: multiLang?.title,
      accessor: 'title',
      // Cell: ({ row }) => <a className='Livetitle' style={{ cursor: 'pointer' }}> {row.original.title ? row.original.title : '-'}</a>
      Cell: ({ row }) => <a className='Livetitle' style={{ cursor: 'pointer' }} onClick={() => viewHandler(row?.original?.id)}> {row.original.title ? row.original.title : '-'}</a>
    },
    {
      Header: multiLang?.period,
      accessor: 'scheduledAt',
      Cell: ({ row }) => <p style={{ maxWidth: 150, whiteSpace: 'normal' }}>{row.original.startTime ? `${moment(row.original.startTime).format("YYYY-MM-DD HH:mm")} ~ 
                                                      ${moment(row.original.endTime).format("YYYY-MM-DD HH:mm")}` : '-'}</p>
    },
    {
      Header: multiLang?.creator,
      accessor: 'authorId',
      Cell: ({ row }) => <p className='text-center'>{row.original.authorName ? row.original.authorName : '-'}</p>
    },
    {
      Header: multiLang?.participantsPoints,
      accessor: 'participants',
      Cell: ({ row }) => <><p className='text-center'>{row.original.participationPoints ? `${(row?.original?.participationPoints)}
                                                         ` : ''}</p><p className='text-center'>{row.original.participationPoints ? `
                                                      (${(row?.original?.participants * row?.original?.participationPoints)} P)` : '-'}</p></>
    },
    {
      Header: multiLang?.eventCost,
      accessor: 'likes',
      Cell: ({ row }) => <p className='text-center'>{row.original.eventCost ? row.original.eventCost + " " + 'KRW' : '-'}</p>
    }

  ], [currentPage, itemsPerPage])

  const getRouletteEvents = async () => {
    setIsLoading(true)
    try {
      let url = API_ENDPOINT.get_RouletteEvents + `?pageNo=${currentPage + 1}&pageSize=${itemsPerPage}`

      if (filterData?.search) {
        url = url + `&searchTerm=${filterData?.search}`
      }

      if (filterData?.startDate) {
        url = url + `&startDate=${filterData?.startDate}`
      }

      if (filterData?.endDate) {
        url = url + `&endDate=${filterData?.endDate}`
      }

      if (activeTab !== '') {
        url = url + `&status=${activeTab}`
      }

      const response = await getApi(url)
      console.log('data get =>', response);
      if (response?.status === 201) {
        setRouletteEvents(response?.data)
        setTotalPages(Math.ceil(30 / Number(itemsPerPage)))
        setIsLoading(false)
      } else {
        setRouletteEvents([])
        setIsLoading(false)
      }
    } catch (error) {
      setIsLoading(false)
      console.log(error)
    }
  }

  const viewHandler = (id) => {
    navigate("/RouletteEventDetails", {
      state: {
        eventId: id
      }
    })
  }


  const handleTabClick = (value) => {
    console.log('value =>', value);
    setFilterData({
      search: '',
      Status: '',
      startDate: '',
      endDate: ''
    })
    setItemsPerPage(10);
    setCurrentPage(0)
    setActiveTab(value);
  };

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
    if (event != null) {
      // const value = moment(event).format("YYYY-MM-DD")
      const value = event.toISOString()
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

    if (event != null) {
      // const value = moment(event).format("YYYY-MM-DD")
      const value = event.toISOString()
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

  const handleSelectionChange = useCallback((selectedRowsIds) => {
  }, []);

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected)
  }

  return (
    <div className='mb-5'>
      {isLoading && <Loader />}
      <main>
        <div className="pageTitle mb-3 pb-2">
          <h2> {multiLang?.rouletteeventManagement}
          </h2>
        </div>
        <div className='d-flex justify-content-between mb-2'>
          <div>
            <CNav variant="underline" className='d-flex gap3 tabNav'>
              <CNavItem >
                <CNavLink role='button' className={activeTab === '' ? 'active' : ''} onClick={() => handleTabClick('')}>
                  {multiLang?.all}
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink role='button' className={activeTab === 'upcoming' ? 'active' : ''} onClick={() => handleTabClick('upcoming')}>{multiLang?.upcoming}</CNavLink>
              </CNavItem>
              <CNavItem >
                <CNavLink role='button' className={activeTab === 'ongoing' ? 'active' : ''} onClick={() => handleTabClick('ongoing')}>{multiLang?.ongoing}</CNavLink>
              </CNavItem>
              <CNavItem >
                <CNavLink role='button' className={activeTab === 'closed' ? 'active' : ''} onClick={() => handleTabClick('closed')}>{multiLang?.closed}</CNavLink>
              </CNavItem>
              <CNavItem >
                <CNavLink role='button' className={activeTab === 'canceled' ? 'active' : ''} onClick={() => handleTabClick('cancelled')}>{multiLang?.cancelled}</CNavLink>
              </CNavItem>
            </CNav>
          </div>
          <div>
            <NavLink to='../RouletteEventManagementRegistration'><CButton className='btn-success'>{multiLang?.registration}</CButton></NavLink>
          </div>
        </div>
        <div className='d-flex justify-content-between mb-2 mt-3'>

          <div className='mx-1 d-flex'>
            <input className='form-control me-3' placeholder='Title' value={filterData.search} onChange={handleSearch} />
            <CButton onClick={getRouletteEvents}>{multiLang?.search}</CButton>
          </div>

          <div className='d-flex p-2 gap-3 align-items-center'>
            <p>{multiLang?.startTime}</p>
            <DatePicker value={filterData.startDate} onChange={handleStartDate} />
            <DatePicker value={filterData.endDate} onChange={handleEndDate} />
          </div>
        </div>
        <ReactTable showCheckbox={false} columns={columns} data={RouletteEvents} totalCount={10} onSelectionChange={handleSelectionChange} />
        {RouletteEvents.length > 0 &&
          <div className='d-flex w-100 justify-content-center mt-3  gap-3'>
            <div className='d-flex gap-3'>
              <div className='userlist-pagination'>
                <div className='userlist-pagination dataTables_paginate'>
                  <ReactPaginate
                    breakLabel={'...'}
                    marginPagesDisplayed={1}
                    previousLabel={<button>{multiLang?.Previous}</button>}
                    nextLabel={<button>{multiLang?.Next}</button>}
                    pageCount={totalPages}
                    onPageChange={handlePageChange}
                    forcePage={currentPage}
                    renderOnZeroPageCount={null}
                    pageRangeDisplayed={4}
                  />
                </div>

              </div>
              <div className='d-flex align-items-center gap-2'>
                <label>{multiLang?.Show}</label>
                <CFormSelect
                  className=''
                  aria-label=""
                  value={itemsPerPage}
                  options={perPageValue}
                  onChange={(event) => {
                    setItemsPerPage(parseInt(event?.target?.value));
                    setCurrentPage(0)
                  }}
                />
                <label>{multiLang?.Lists}</label>
              </div>
            </div>
          </div>
        }
      </main>
    </div>
  )
}

export default RouletteeventManagementListing
