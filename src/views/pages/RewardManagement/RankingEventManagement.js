import React, { useEffect, useMemo, useState } from 'react'
import { CButton, CFormSelect, CFormSwitch, CNav, CNavItem, CNavLink } from '@coreui/react'
import { NavLink, useNavigate } from 'react-router-dom'
import Loader from 'src/components/common/Loader'
import ReactPaginate from 'react-paginate'
import ReactTable from 'src/components/common/ReactTable'
import DatePicker from 'react-date-picker'
import { API_ENDPOINT } from 'src/utils/config'
import { getApi } from 'src/utils/Api'
import { imageUrl } from '../BookRentalManagement/BookRentalStatus'
import moment from 'moment/moment'

const RankingEventManagement = () => {
  const navigate = useNavigate()
  const registrationHandler = () => {
    navigate('../RankingEventRegistration')
  }

  const initialData = {
    search: '',
    Status: '',
    startDate: '',
    endDate: ''
  }

  const [filterData, setFilterData] = useState(initialData)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('');
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [RankingEvents, setRankingEvents] = useState([])

  const perPageValue = [
    { label: '10', value: 10 },
    { label: '30', value: 30 },
    { label: '50', value: 50 },
    { label: '100', value: 100 }

  ]

  async function urlToBlob(url) {
    const response = await fetch(url)
    const blob = await response.blob()
    return blob
  }

  const urlsToFiles = async (url) => {
    if (!url) return
    const blob = await urlToBlob(imageUrl + url)
    const fileName = url
    return new File([blob], fileName, { type: blob.type })
  }

  useEffect(() => {
    getRankingEvents()
  }, [activeTab, itemsPerPage, currentPage, filterData.Status, filterData.startDate, filterData.endDate,])

  useEffect(() => {
    if (filterData?.search === '') {
      getRankingEvents()
    }
  }, [filterData.search])

  const getRankingEvents = async () => {
    setIsLoading(true)
    try {
      let url = API_ENDPOINT.getRankingEvent + `?pageNo=${currentPage + 1}&pageSize=${itemsPerPage}`

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
        setRankingEvents(response?.data)
        setTotalPages(Math.ceil(30 / Number(itemsPerPage)))
        setIsLoading(false)
      } else {
        setRankingEvents([])
        setIsLoading(false)
      }
    } catch (error) {
      setIsLoading(false)
      console.log(error)
    }
  }

  useEffect(() => {
    getRankingEvents()
  }, [])

  const viewHandler = (id) => {
    navigate("/RankingEventDetails", {
      state: {
        eventId: id
      }
    })
  }

  const columns = useMemo(() => [

    {
      Header: "Image",
      accessor: 'image',
      Cell: ({ row }) => <img crossOrigin='anonymous' src={row?.original?.image ? imageUrl + row?.original?.image : null} alt="NA" />
    },
    {
      Header: "Status",
      accessor: 'status',
      Cell: ({ row }) => <p style={{ textTransform: 'capitalize' }} className='text-center'>{row.original.stauts ? row.original.stauts : '-'}</p>
    },
    {
      Header: "Title",
      accessor: 'title',
      Cell: ({ row }) => <a className='Livetitle' style={{ cursor: 'pointer' }} onClick={() => viewHandler(row?.original?.id)}> {row.original.title ? row.original.title : '-'}</a>
    },
    {
      Header: "Period",
      accessor: 'scheduledAt',
      Cell: ({ row }) => <p>{row.original.startTime ? `${moment(row.original.startTime).format("YYYY-MM-DD HH:mm")} ~ 
                                                             ${moment(row.original.endTime).format("YYYY-MM-DD HH:mm")}` : '-'}</p>
    },
    {
      Header: "Announcement",
      accessor: 'announcement',
      Cell: ({ row }) => <p>{row.original.announcementTime ? `${moment(row.original.announcementTime).format("YYYY-MM-DD HH:mm")}` : '-'}</p>
    },
    {
      Header: "Creator",
      accessor: 'creator',
      Cell: ({ row }) => <p className='text-center'>{row.original.authorName ? row.original.authorName : '-'}</p>
    },
    {
      Header: "Participants" + " " + "(Points)",
      accessor: 'participants',
      Cell: ({ row }) => <><p className='text-center'>{row.original.participationPoints ? `${(row?.original?.participationPoints)}
                                                                 ` : ''}</p><p className='text-center'>{row.original.participationPoints ? `
                                                             (${(row?.original?.participants * row?.original?.participationPoints)} P)` : '-'}</p></>
    },
    {
      Header: "Event Cost",
      accessor: 'likes',
      Cell: ({ row }) => <p className='text-center'>{row.original.eventCost ? row.original.eventCost + " " + 'KRW' : '-'}</p>
    }

  ], [currentPage, itemsPerPage])

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

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected)
  }

  return (
    <>
      <div className='mb-5'>
        {isLoading && <Loader />}
        <main>
          <div className="pageTitle mb-3 pb-2">
            <h2>Ranking event Management
            </h2>
          </div>
          <div className='d-flex justify-content-between mb-2'>
            <div>
              <CNav variant="underline" className='d-flex gap3 tabNav'>
                <CNavItem >
                  <CNavLink role='button' className={activeTab === '' ? 'active' : ''} onClick={() => handleTabClick('')}>
                    All
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink role='button' className={activeTab === 'upcoming' ? 'active' : ''} onClick={() => handleTabClick('upcoming')}>Upcoming</CNavLink>
                </CNavItem>
                <CNavItem >
                  <CNavLink role='button' className={activeTab === 'ongoing' ? 'active' : ''} onClick={() => handleTabClick('ongoing')}>Ongoing</CNavLink>
                </CNavItem>
                <CNavItem >
                  <CNavLink role='button' className={activeTab === 'closed' ? 'active' : ''} onClick={() => handleTabClick('closed')}>Closed</CNavLink>
                </CNavItem>
                <CNavItem >
                  <CNavLink role='button' className={activeTab === 'canceled' ? 'active' : ''} onClick={() => handleTabClick('cancelled')}>Cancelled</CNavLink>
                </CNavItem>
              </CNav>
            </div>
            <div>
              <NavLink to='../RankingEventRegistration'><CButton className='btn-success'>Registration</CButton></NavLink>
            </div>
          </div>
          <div className='d-flex justify-content-between mb-2 mt-3 gap-2'>

            <div className='me-1 d-flex w-50'>
              <input className='form-control me-3' placeholder='Title' value={filterData.search} onChange={handleSearch} />
              <CButton onClick={getRankingEvents}>Search</CButton>
            </div>

            <div className='d-flex ps-2  gap-3 align-items-center'>
              <p>StartTime</p>
              <DatePicker value={filterData.startDate} onChange={handleStartDate} />
              <DatePicker value={filterData.endDate} onChange={handleEndDate} />
            </div>
          </div>
          <ReactTable showCheckbox={false} columns={columns} data={RankingEvents} totalCount={10} onSelectionChange={() => { }} />
          {RankingEvents.length > 0 &&
            <div className='d-flex w-100 justify-content-center mt-3  gap-3'>
              <div className='d-flex gap-3'>
                <div className='userlist-pagination'>
                  <div className='userlist-pagination dataTables_paginate'>
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
                <div className='d-flex align-items-center gap-2'>
                  <label>Show</label>
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
                  <label>Lists</label>
                </div>
              </div>
            </div>
          }
        </main>
      </div>
    </>
  )
}

export default RankingEventManagement
