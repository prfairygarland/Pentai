import { CButton, CFormSelect } from '@coreui/react'
import moment from 'moment/moment'
import React, { useEffect, useMemo, useState } from 'react'
import DatePicker from 'react-date-picker'
import ReactPaginate from 'react-paginate'
import { useLocation } from 'react-router-dom'
import Loader from 'src/components/common/Loader'
import ReactTable from 'src/components/common/ReactTable'
import { getApi } from 'src/utils/Api'
import { API_ENDPOINT } from 'src/utils/config'

const RankingParticipationDetails = () => {

    const initialData = {
        search: '',
        reward: '',
        name: '',
        endDate: ''
    }

    const location = useLocation()
    const [isLoading, setIsLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [filterData, setFilterData] = useState(initialData)
    const [participantsDetails, setParticipantsDetails] = useState([])
    const [rewards, setRewards] = useState([])

    const perPageValue = [
        { label: '10', value: 10 },
        { label: '30', value: 30 },
        { label: '50', value: 50 },
        { label: '100', value: 100 }

    ]

    const name = [
        { label: 'Name', value: 'name' },
        { label: 'English Name', value: 'englishName' },
        { label: 'E-mail', value: 'email' },
    ]

    const handleSearch = (e) => {
        const value = e.target.value
        setFilterData((prev) => {
            return {
                ...prev,
                search: value
            }
        })
    }

    const handleRewardChange = (e) => {
        const value = e.target.value
        setFilterData((prev) => {
            return {
                ...prev,
                reward: value
            }
        })
    }

    const handleChnageName = (e) => {
        const value = e.target.value
        setFilterData((prev) => {
            return {
                ...prev,
                name: value
            }
        })
    }

    useEffect(() => {
        getParticipantsDetails()
      }, [itemsPerPage, currentPage])

    const getParticipantsDetails = async () => {
        setIsLoading(true)
        let url = `${API_ENDPOINT.getRankingParticipantDetails}?eventId=${location?.state?.eventId}&pageNo=${currentPage + 1}&pageSize=${itemsPerPage}`

        if (filterData.search) {
            url = url + `&searchTerm=${filterData?.search}`
        }

        if (filterData.reward) {
            url = url + `&rewardId=${filterData?.reward}`
        }

        try {
            const response = await getApi(url)
            console.log('resranking::', response)
            if (response?.status === 201) {
                setParticipantsDetails(response?.data)
                setTotalPages(Math.ceil(response?.total / Number(itemsPerPage)))
                setIsLoading(false)
            }
            else {
                setParticipantsDetails([])
                setIsLoading(false)
            }
        } catch (error) {

        }
        finally {
            setIsLoading(false)
        }

    }

    // const getEventDetails = async () => {
    //     let url = `${API_ENDPOINT.getRankingParticipants}?eventId=${location?.state?.eventId}`

    //     const response = await getApi(url)
    //     console.log('resparticipants::', response)
    //     if (response?.status === 201) {
    //         if (response?.data?.rewards) {
    //             const data = await response?.data?.rewards?.map((op) => {
    //                 return { 'label': op.name, 'value': op.id }

    //             })
    //             setRewards((pre) => {
    //                 return [{ label: 'All', value: '' }, ...data]
    //             })
    //         }
    //     }
    // }

    useEffect(() => {
        getParticipantsDetails()
    }, [])


    const handlePageChange = (selectedPage) => {
        setCurrentPage(selectedPage.selected)
    }


    const columns = useMemo(() => [

        {
            Header: 'E-mail',
            accessor: 'email',
            Cell: ({ row }) => <p>{row.original.email ? row.original.email : ''}</p>
        },
        {
            Header: 'Name',
            accessor: 'name',
            Cell: ({ row }) => <p className='text-center'> {row.original.koreanName ? row.original.koreanName : '-'}</p>
        },
        {
            Header: 'English Name',
            accessor: 'englishName',
            Cell: ({ row }) => <p className='text-center'>{row.original.englishName ? row.original.englishName : ''}</p>
        },
        {
            Header: 'Phone Number',
            accessor: 'phoneNumber',
            Cell: ({ row }) => <p className='text-center'>{row.original.mobile ? row.original.mobile : '-'}</p>
        },
        {
            Header: 'Division',
            accessor: 'division',
            Cell: ({ row }) => <p className='text-center'>{row.original.divisionName ? row.original.divisionName : ''}</p>
        },
        {
            Header: 'Group',
            accessor: 'group',
            Cell: ({ row }) => <p className='text-center'>{row.original.groupName ? row.original.groupName : ''}</p>
        },
        {
            Header: 'Team',
            accessor: 'team',
            Cell: ({ row }) => <p className='text-center'>{row.original.teamName ? row.original.teamName : '-'}</p>
        },
        {
            Header: 'Reward',
            accessor: 'reward',
            Cell: ({ row }) => <p className='text-center'>{row.original.reward ? row.original.reward : '-'}</p>
        },
        {
            Header: 'Time',
            accessor: 'time',
            Cell: ({ row }) => <p className='text-center'>{row.original.participationTime ? moment(row.original.participationTime).format("YYYY-MM-DD HH:mm") : '-'}</p>
        },
        {
            Header: 'Status',
            accessor: 'status',
            Cell: ({ row }) => <p className='text-center'>{row.original.status ? row.original.status : '-'}</p>
        },
        {
            Header: 'Participation',
            accessor: 'Participation',
            Cell: ({ row }) => <p className='text-center'>{row.original.participation ? row.original.participation : '-'}</p>
        },
        {
            Header: 'Stars',
            accessor: 'stars',
            Cell: ({ row }) => <p className='text-center'>{row.original.stars ? row.original.stars : '-'}</p>
        }
    ], [])

  return (
    <section className="flex-row align-items-center mb-3">
    {isLoading && <Loader />}
   <div className="w-100">
       <div className="card border-0 ">
           <div className='card-body p-0'>
               <div className='formWraper'>
                   <div>
                       <div className='d-flex'>
                           <div className='d-flex col-md-6'>
                               <div className="form-outline d-flex col-md-12">
                                   <div className='formWrpLabel'>
                                       <label className="fw-bolder ">Participants</label>
                                   </div>
                                   <div className='formWrpInpt text-center '>
                                       5000
                                   </div>
                               </div>
                           </div>
                           <div className="form-outline  d-flex  col-md-6">
                               <div className='formWrpLabel'>
                                   <label className="fw-bolder ">Points</label>
                               </div>
                               <div className='formWrpInpt text-center '>
                                   5000 p
                               </div>
                           </div>
                       </div>
                   </div>
                   <div className='d-flex col-md-12'>
                       <div className='d-flex col-md-6'>
                           <div className="form-outline d-flex col-md-12">
                               <div className='formWrpLabel'>
                                   <label className="fw-bolder ">Participation</label>
                               </div>
                               <div className='formWrpInpt text-center '>
                                   5000
                               </div>
                           </div>
                       </div>
                       <div className="form-outline  d-flex  col-md-6">
                           <div className='formWrpLabel'>
                               <label className="fw-bolder ">Event Cost</label>
                           </div>
                           <div className='formWrpInpt text-center '>
                               250000   KRW
                           </div>
                       </div>
                   </div>
               </div>
           </div>
       </div>
   </div>
   <div className='container p-3 justify-align-content-around w-100 mt-3'>
       <div className='d-flex '>
           <div className='d-flex  align-items-center justify-content-between w-100 gap-3 '>
               <div className='d-flex align-items-center w-100'>
                   <div className="d-flex align-items-center ">
                       {/* <label className="fw-medium me-3 " style={{ 'white-space': 'nowrap' }}>
                       Name
                   </label> */}
                       <CFormSelect
                           className="me-2"
                           aria-label="Default select example"
                           options={name}
                           onChange={handleChnageName}
                           value={filterData.name}
                       />
                   </div>
               </div>
           </div>

           <div className='d-flex  align-items-center justify-content-between w-100 gap-3 '>
               <div className='d-flex  align-items-center gap-3 w-100'>
                   <div className=''>
                       {/* <label>Title</label> */}
                   </div>
                   <div className="col-md-12">
                       <div className="d-flex form-inline w-100">
                           <input className="form-control mr-sm-10 me-2" value={filterData.search} onChange={handleSearch} type="search" placeholder="Search" aria-label="Search" />
                       </div>
                   </div>
               </div>
               <CButton onClick={getParticipantsDetails} className="btn btn-primary my-2 my-sm-0" type="submit" >Search</CButton>
               <CButton className="w-50" type="submit" >List Download</CButton>
           </div>
       </div>
   </div>
   <div>
       <ReactTable columns={columns} data={participantsDetails} showCheckbox={false} onSelectionChange={() => { }} />
   </div>
   {participantsDetails.length > 0 &&
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
</section>
  )
} 

export default RankingParticipationDetails