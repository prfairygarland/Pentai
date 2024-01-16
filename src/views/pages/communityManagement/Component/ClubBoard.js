import { CButton, CForm, CFormInput, CFormSelect, CFormSwitch, CModal, CModalBody, CModalHeader, CModalTitle } from '@coreui/react';
import React, { useEffect, useMemo, useState } from 'react'
import './boardManagement.scss'
import ReactTable from 'src/components/common/ReactTable';
import { API_ENDPOINT } from 'src/utils/config';
import { getApi } from 'src/utils/Api';
import ReactPaginate from 'react-paginate';
import { paginationItemPerPageOptions } from 'src/utils/constant';

const ClubBoard = () => {
    const [showClubPeriod, setShowClubPeriod] = useState(false)
    const [showClubBanner, setShowClubBanner] = useState(false)
    const [clubActivityListPopup, setClubActivityListPopup] = useState(false)
    const [totalPages, setTotalPages] = useState(0)
    const [clubPeriodData, setClubPeriodData] = useState({})
    const [totalclubPeriodDataCount, setTotalclubPeriodDataCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(0)
    const [itemsPerPage, setItemsPerPage] = useState(5)
    const [searchTxt, setSearchTxt] = useState('')
    const [clubActivityListData, setClubActivityListData] = useState({})


    const getClubRegistrationPeriodsBySearch = async (id) => {
      if(searchTxt.trim() === '') {
        getClubRegistrationPeriods()
        return false
      }
      try {
        let url = `${API_ENDPOINT.get_search_club_registration_periods}?pageNo=${currentPage+1}&term=${searchTxt}`
        const res = await getApi(url)
        console.log(res.results)
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
        let url = `${API_ENDPOINT.get_club_registration_periods}?pageNo=${currentPage+1}`
        const res = await getApi(url)
  
        if (res.status === 200) {
          console.log(res.data)
          setClubPeriodData(res.data)
          setTotalclubPeriodDataCount(res.totalCount)
          setTotalPages(Math.ceil(res.totalCount / Number(itemsPerPage)))
        }
      } catch (error) {
        console.log(error)
      }
    }

    const clubPeriodDataColumns = useMemo(
      () => [
        {
          Header: <p className="text-center">No</p>,
          accessor: 'number',
          Cell: ({ row }) => {
            return currentPage * itemsPerPage + (row.index + 1)
          },
        },
        {
          Header: <p className="text-center">Title</p>,
          accessor: 'PostTypes',
          Cell: ({ row }) => (
            <p className="text-center">{row.original.title}</p>
          ),
        },
        {
          Header: <p className="text-center">Registration Period</p>,
          accessor: 'regPeriod',
          Cell: ({ row }) => (
            <p
              role="button"
              className="text-center"
            >
              {new Date(row.original.registrationPeriodStart).toLocaleDateString()} - {new Date(row.original.registrationPeriodEnd).toLocaleDateString()}
            </p>
          ),
        },
        {
          Header: <p className="text-center">1st Deadline</p>,
          accessor: 'firstDeadline',
          Cell: ({ row }) => (
            <p
              role="button"
              className="text-center"
            >
              {new Date(row.original.firstDeadline).toLocaleDateString()}
            </p>
          ),
        },
        {
          Header: <p className="text-center">Recruitment Period</p>,
          accessor: 'recPeriod',
          Cell: ({ row }) => (
            <p
              role="button"
              className="text-center"
            >
              {new Date(row.original.recruitmentPeriodStart).toLocaleDateString()} - {new Date(row.original.recruitmentPeriodEnd).toLocaleDateString()}
            </p>
          ),
        },
        {
          Header: <p className="text-center">Final Deadline</p>,
          accessor: 'finalDeadline',
          Cell: ({ row }) => (
            <p
              role="button"
              className="text-center"
            >
              {new Date(row.original.finalDeadline).toLocaleDateString()}
            </p>
          ),
        },
        {
          Header: <p className="text-center">Min. participant limit</p>,
          accessor: 'minPart',
          Cell: ({ row }) => (
            <p
              role="button"
              className="text-center"
            >
              {row.original.minParticipants}
            </p>
          ),
        },
        {
          Header: <p className="text-center">Max. same group limit</p>,
          accessor: 'maxLimit',
          Cell: ({ row }) => (
            <p
              role="button"
              className="text-center"
            >
              {row.original.maxParticipantsPerGroup}
            </p>
          ),
        },
        {
          Header: <p className="text-center">No. Club Activities</p>,
          accessor: 'clubAct',
          Cell: ({ row }) => (
            <p
              role="button"
              className="text-center"
            >
              -
            </p>
          ),
        },
        {
          Header: <p className="text-center">Total No. of Participants</p>,
          accessor: 'totNoOfPart',
          Cell: ({ row }) => (
            <p
              role="button"
              className="text-center"
            >
              -
            </p>
          ),
        },
        {
          Header: <p className="text-center">Club activity list</p>,
          accessor: 'clubActList',
          Cell: ({ row }) => (
            <p
              role="button"
              onClick={() => viewActivityList(row.original.id)}
              className="text-center"
            >
              View
            </p>
          ),
        },
      ],
      [currentPage, itemsPerPage],
    )

    const clubActivityListColumns = useMemo(
      () => [
        {
          Header: <p className="text-center">No</p>,
          accessor: 'number',
          Cell: ({ row }) => {
            return <p className="text-center">{row.index + 1}</p>
          },
        },
        {
          Header: <p className="text-center">Club</p>,
          accessor: 'club',
          Cell: ({ row }) => <p className="text-center">{row.original.clubName} </p>,
        },
        {
          Header: <p className="text-center">Activity</p>,
          accessor: 'activity',
          Cell: ({ row }) => <p className="text-center">{row.original.activity} </p>,
        },
        {
          Header: <p className="text-center">Host</p>,
          accessor: 'host',
          Cell: ({ row }) => <p className="text-center">{row.original.host} </p>,
        },
        {
          Header: <p className="text-center">No. of Participants</p>,
          accessor: 'noOfParticipants',
          Cell: ({ row }) => <p className="text-center">{row.original.participants} </p>,
        },
        {
          Header: <p className="text-center">History</p>,
          accessor: 'history',
          Cell: ({ row }) => (
            <p className="text-center">{row.original.recruitmentId} </p>
          ),
        },
      ],
      [clubActivityListData],
    )

    const handlePageChange = (selectedPage) => {
      setCurrentPage(selectedPage.selected)
    }

    const handleShowClubPeriodToggle = () => {
      setShowClubPeriod((prev) => !prev)
    }

    const viewActivityList = async (id) => {
      setClubActivityListPopup(true)
      try {
        let url = `${API_ENDPOINT.get_club_activity_list}?pageNo=${currentPage+1}&registrationId=${id}`
        const res = await getApi(url)
        console.log(res.data)
        console.log(res.status)
        if (res.status === 200) {
          setClubActivityListData(res.data)
        }
      } catch (error) {
        console.log(error)
      }
    }

    useEffect(() => {
      getClubRegistrationPeriods()
    }, [currentPage, itemsPerPage])
    return (
    <div>
      <div className='toggleContainer'>
        <div>Club Period/Qualification</div>
        <div><CFormSwitch id="club_period_qualification" className='cFormSwitch' onClick={handleShowClubPeriodToggle} defaultChecked={showClubPeriod}/></div>
      </div>
      {showClubPeriod && <div>
        <CForm className="d-flex">
          <CFormInput className="me-sm-2" placeholder="Search" size="sm" value={searchTxt} onChange={(e) => setSearchTxt(e.target.value)}/>
          <CButton color="light" className="my-2 my-sm-0" type="button" onClick={getClubRegistrationPeriodsBySearch}>
            Search
          </CButton>
        </CForm>
        {totalclubPeriodDataCount > 0 && <p style={{ margin: 0 }}>Total&nbsp;:&nbsp; {totalclubPeriodDataCount}</p>}
        <ReactTable
          columns={clubPeriodDataColumns}
          data={clubPeriodData}
          showCheckbox={false}
          onSelectionChange={() => {}}
        />
        <div className="d-flex w-100 justify-content-center gap-3">
          {clubPeriodData?.length > 0 && (
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
          {clubPeriodData?.length > 0 && (
            <div className="d-flex align-items-center gap-2 mt-2">
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
              // columns={clubPeriodDataColumns}
              // data={clubPeriodData}
              onSelectionChange={() => {
                console.log('no action')
              }}
              showCheckbox={false}
            />}
            {clubActivityListData.length === 0 && <>No Data Available</>}
          </CModalBody>
        </CModal>

      </div>}
      <div className='toggleContainer'>
        <div>Club Banner</div>
        <div><CFormSwitch id="club_banner" className="cFormSwitch" defaultChecked={showClubBanner}/></div>
      </div>
    </div>
  )
}

export default ClubBoard
