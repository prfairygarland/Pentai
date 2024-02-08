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

const LiveManagement = () => {

  const initialData = {
    search: '',
    Status: '',
    startDate: '',
    endDate: ''
  }

  const { t, i18n } = useTranslation();
  const translationObject = i18n.getDataByLanguage(i18n.language);
  const multiLang = translationObject?.translation
  const [filterData, setFilterData] = useState(initialData)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('');
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [liveStreamsData, setLiveStreamsData] = useState([])
  const navigate = useNavigate();


  const perPageValue = [
    { label: '10', value: 10 },
    { label: '30', value: 30 },
    { label: '50', value: 50 },
    { label: '100', value: 100 }

  ]

  useEffect(() => {
    getLiveStreamsData()
  }, [activeTab, itemsPerPage, currentPage, filterData.Status, filterData.startDate, filterData.endDate,])

  useEffect(() => {
    if (filterData?.search === '') {
      getLiveStreamsData()
    }
  }, [filterData.search])


  const columns = useMemo(() => [
    {
      Header: multiLang?.LiveManagement?.Image,
      accessor: '',
      Cell: ({ row }) => (
        <div style={{ width: '150px', height: '100px' }}>
          <img
            crossOrigin="anonymous"
            style={{ width: '150px', height: '100px' }}
            src={ALL_CONSTANTS.BASE_URL + '/' + row.original.background}
            alt=""
          />
        </div>
      ),

    },
    {
      Header: multiLang?.LiveManagement?.Status,
      accessor: 'status',
      Cell: ({ row }) => <p style={{ textTransform: 'capitalize' }}>{row.original.status ? row.original.status : '-'}</p>
    },
    {
      Header: multiLang?.LiveManagement?.Title,
      accessor: 'title',
      Cell: ({ row }) => <p style={{ cursor: 'pointer' }} onClick={() => viewHandler(row.original.id)}> {row.original.title ? row.original.title : '-'}</p>
    },
    {
      Header: multiLang?.LiveManagement?.Scheduled_start_time,
      accessor: 'scheduledAt',
      Cell: ({ row }) => <p>{row.original.scheduledAt ? moment(row.original.scheduledAt).format('YYYY-MM-DD HH:mm:ss') : '-'}</p>
    },
    {
      Header: multiLang?.LiveManagement?.Creator,
      accessor: 'authorId',
      Cell: ({ row }) => <p>{row.original.authorName ? row.original.authorName : '-'}</p>
    },
    {
      Header: multiLang?.LiveManagement?.UV,
      accessor: 'participants',
      Cell: ({ row }) => <p>{row.original.participants ? row.original.participants : '-'}</p>
    },
    {
      Header: multiLang?.LiveManagement?.Like,
      accessor: 'likes',
      Cell: ({ row }) => <p>{row.original.likes ? row.original.likes : '-'}</p>
    },
    {
      Header: multiLang?.LiveManagement?.Console,
      accessor: '',
      Cell: ({ row }) =>
        <div>
          {row.original.status !== 'cancelled' && row.original.status !== 'ended' &&
            <CButton>Console</CButton>
          }
        </div>
    },
    {
      Header: ' ',
      accessor: '',
      Cell: ({ row }) =>
        <div>
          <p>{row.original?.quiz === 1 ? 'QUIZ' : ''}</p>
          <p>{row.original?.private === 1 ? 'SECRET' : ''}</p>
        </div>
    }

  ], [currentPage, itemsPerPage])

  const viewHandler = (id) => {
    navigate("./LiveRegistration", {
      state: {
        streamId: id
      }
    })
  }

  const getLiveStreamsData = async () => {
    setIsLoading(true)
    try {
      let url = API_ENDPOINT.getLiveStreams + `?pageNo=${currentPage + 1}&pageSize=${itemsPerPage}`

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
        setLiveStreamsData(response?.data)
        setTotalPages(Math.ceil(response?.data[0]?.totalResults / Number(itemsPerPage)))
        setIsLoading(false)
      } else {
        setLiveStreamsData([])
        setIsLoading(false)
      }
    } catch (error) {
      setIsLoading(false)
      console.log(error)
    }
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
      <h2>Live Management</h2>
      </div>
        <div className='d-flex justify-content-between mb-2'>
          <div>
            <CNav variant="underline" className='d-flex gap3 tabNav'>
              <CNavItem >
                <CNavLink role='button' className={activeTab === '' ? 'active' : ''} onClick={() => handleTabClick('')}>
                  {multiLang?.LiveManagement?.All}
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink role='button' className={activeTab === 'ready' ? 'active' : ''} onClick={() => handleTabClick('ready')}>{multiLang?.LiveManagement?.Ready}</CNavLink>
              </CNavItem>
              <CNavItem >
                <CNavLink role='button' className={activeTab === 'onair' ? 'active' : ''} onClick={() => handleTabClick('onair')}>{multiLang?.LiveManagement?.On_Air}</CNavLink>
              </CNavItem>
              <CNavItem >
                <CNavLink role='button' className={activeTab === 'ended' ? 'active' : ''} onClick={() => handleTabClick('ended')}>{multiLang?.LiveManagement?.Ended}</CNavLink>
              </CNavItem>
              <CNavItem >
                <CNavLink role='button' className={activeTab === 'cancelled' ? 'active' : ''} onClick={() => handleTabClick('cancelled')}>{multiLang?.LiveManagement?.Cancel}</CNavLink>
              </CNavItem>
            </CNav>
          </div>
          <div>
            <NavLink to='./LiveRegistration'><CButton className='btn-success'>{multiLang?.LiveManagement?.Registration}</CButton></NavLink>
          </div>
        </div>
        <div className='d-flex justify-content-between mb-2 mt-3'>

          <div className='mx-1 d-flex'>
            <input className='form-control me-3' placeholder='Search' value={filterData.search} onChange={handleSearch} />
            <CButton onClick={getLiveStreamsData}>{multiLang?.LiveManagement?.Search}</CButton>
          </div>

          <div className='d-flex p-2 gap-3'>
            <DatePicker value={filterData.startDate} onChange={handleStartDate} />
            <DatePicker value={filterData.endDate} onChange={handleEndDate} />
          </div>
        </div>
        <ReactTable showCheckbox={false} columns={columns} data={liveStreamsData} totalCount={10} onSelectionChange={handleSelectionChange} />

        {liveStreamsData.length > 0 &&
        <div className='d-flex w-100 justify-content-center my-3 gap-3'>
          <div className='d-flex gap-3'>
            <div className='userlist-pagination'>
              <div className='userlist-pagination dataTables_paginate'>
                <ReactPaginate
                  breakLabel={'...'}
                  marginPagesDisplayed={1}
                  previousLabel={<button>{multiLang?.LiveManagement?.Previous}</button>}
                  nextLabel={<button>{multiLang?.LiveManagement?.Next}</button>}
                  pageCount={totalPages}
                  onPageChange={handlePageChange}
                  forcePage={currentPage}
                    renderOnZeroPageCount={null}
                  pageRangeDisplayed={4}
                />
              </div>

            </div>
            <div className='d-flex align-items-center gap-2 '>
              <label>{multiLang?.LiveManagement?.Show}</label>
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
              <label>{multiLang?.LiveManagement?.Lists}</label>
            </div>
          </div>
        </div>
        }
      </main>
    </div>
  )
}

export default LiveManagement
