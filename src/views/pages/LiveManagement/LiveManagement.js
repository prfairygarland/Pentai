import { CButton, CFormSelect, CNav, CNavItem, CNavLink } from '@coreui/react'
import moment from 'moment'
import React, { useCallback, useMemo, useState } from 'react'
import DatePicker from 'react-date-picker'
import { useTranslation } from 'react-i18next'
import ReactPaginate from 'react-paginate'
import { NavLink } from 'react-router-dom'
import Loader from 'src/components/common/Loader'
import ReactTable from 'src/components/common/ReactTable'
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
  const [itemsPerPage, setItemsPerPage] = useState(5)



  // const columns = useMemo(() => [
  //   {
  //     Header: multiLang?.LiveManagement?.Image,
  //     accessor: '',
  //     // Cell: ({ row }) => <p>{row.original.id}</p>

  //   },
  //   {
  //     Header: multiLang?.LiveManagement?.Status,
  //     accessor: '',
  //     Cell: ({ row }) => <p></p>
  //   },
  //   {
  //     Header: multiLang?.LiveManagement?.Title,
  //     accessor: '',
  //     Cell: ({ row }) => <p> </p>
  //   },
  //   {
  //     Header: multiLang?.LiveManagement?.Scheduled_start_time,
  //     accessor: '',
  //     Cell: ({ row }) => <p></p>
  //   },
  //   {
  //     Header: multiLang?.LiveManagement?.Creator,
  //     accessor: '',
  //     Cell: ({ row }) => <p></p>
  //   },
  //   {
  //     Header: multiLang?.LiveManagement?.UV,
  //     accessor: '',
  //     Cell: ({ row }) => <p></p>
  //   },
  //   {
  //     Header: multiLang?.LiveManagement?.Like,
  //     accessor: '',
  //     Cell: ({ row }) => <p></p>
  //   },
  //   {
  //     Header: multiLang?.LiveManagement?.Console,
  //     accessor: '',
  //     Cell: ({ row }) => <p></p>
  //   },

  // ])

  const handleTabClick = (value) => {
    console.log('value =>', value);
    setFilterData({
      search: '',
      Status: '',
      startDate: '',
      endDate: ''
    })
    // setItemsPerPage(5);
    // setCurrentPage(0)
    setActiveTab(value);
    try {

    } catch (error) {
      console.error('Error fetching data:', error);
    }
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

  const handleSelectionChange = useCallback((selectedRowsIds) => {
  }, []);

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected)
  }

  return (
    <div className='mb-5'>
      {isLoading && <Loader />}
      <main>
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
                <CNavLink role='button' className={activeTab === 'onAir' ? 'active' : ''} onClick={() => handleTabClick('onAir')}>{multiLang?.LiveManagement?.On_Air}</CNavLink>
              </CNavItem>
              <CNavItem >
                <CNavLink role='button' className={activeTab === 'Ended' ? 'active' : ''} onClick={() => handleTabClick('Ended')}>{multiLang?.LiveManagement?.Ended}</CNavLink>
              </CNavItem>
              <CNavItem >
                <CNavLink role='button' className={activeTab === 'Cancel' ? 'active' : ''} onClick={() => handleTabClick('Cancel')}>{multiLang?.LiveManagement?.Cancel}</CNavLink>
              </CNavItem>
            </CNav>
          </div>
          <div>
            <NavLink to='./LiveRegistration'><CButton>{multiLang?.LiveManagement?.Registration}</CButton></NavLink>
          </div>
        </div>
        <div className='d-flex justify-content-between mb-2 mt-3'>

          <div className='mx-1 d-flex'>
            <input className='px-4 me-3' value={filterData.search} onChange={handleSearch} />
            <CButton>{multiLang?.LiveManagement?.Search}</CButton>
          </div>

          <div className='d-flex p-2 gap-3'>
            <DatePicker value={filterData.startDate} onChange={handleStartDate} />
            <DatePicker value={filterData.endDate} onChange={handleEndDate} />
          </div>
        </div>
        {/* <ReactTable showCheckbox={false} columns={columns} data={[]} totalCount={10} onSelectionChange={handleSelectionChange} /> */}
        <div className='d-flex w-100 justify-content-center gap-3'>
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
                  // renderOnZeroPageCount={null}
                  pageRangeDisplayed={4}
                />
              </div>

            </div>
            <div className='d-flex align-items-center gap-2 mt-2'>
              <label>{multiLang?.LiveManagement?.Show}</label>
              <CFormSelect
                className=''
                aria-label=""
                value={itemsPerPage}
                options={paginationItemPerPageOptions}
                onChange={(event) => {
                  // setItemsPerPage(parseInt(event?.target?.value));
                  // setCurrentPage(0)
                }}
              />
              <label>{multiLang?.LiveManagement?.Lists}</label>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default LiveManagement
