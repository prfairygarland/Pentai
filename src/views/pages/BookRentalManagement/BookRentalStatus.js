import { CButton, CFormSelect, CImage, CModal, CModalBody, CModalHeader, CModalTitle } from '@coreui/react';
import moment from 'moment/moment';
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import DatePicker from 'react-date-picker';
import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom';
import ReactTable from 'src/components/common/ReactTable';
import { getApi, getUserListExportData } from 'src/utils/Api';
import { API_ENDPOINT } from 'src/utils/config';
import { paginationItemPerPageOptions } from 'src/utils/constant';
import UserProfile from './Component/UserProfile';
import RentalStatus from './Component/RentalStatus';
import RentalHistory from './Component/RentalHistory';

export let imageUrl = 'https://ptkapi.experiencecommerce.com'

const BookRentalStatus = () => {

    const initialData = {
        title: '',
        rentalStatus: '',
        bookGenre: '',
        startDate: '',
        endDate: ''
    }

    const [currentPage, setCurrentPage] = useState(0)
    const [itemsPerPage, setItemsPerPage] = useState(5)
    const [genre, setGenre] = useState();
    const [bookList, setBookList] = useState([])
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [totalPages, setTotalPages] = useState(0)
    const [userInfoPopup, setUserInfoPopup] = useState(false)
    const [RentalDetailsPopup, setRenatlDetailsPopup] = useState(false)
    const [RentalHistoryPopup, setRentalHistoryPopup] = useState(false)
    const [popUp, setPopUp] = useState('')
    const [userInfoData, setUserInfoData] = useState({})
    const [RentalStatusData, setRentalStatusData] = useState({})
    const [RentalHistoryData, setRentalHistoryData] = useState([])
    const [totalCount, setTotalCount] = useState(0)
    const [HistotalPages, setHisTotalPages] = useState(0)
    const [filterData, setFilterData] = useState(initialData)
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedId, setSelectedId] = useState(null)
    const [HisCurrentPage, setHistCurrentPage] = useState(0)
    const [bookRentalId, setBookRentalId] = useState(null)



    const handleShowUserInfo = async (userId) => {
        let url = API_ENDPOINT.get_userdetails + `?userId=${userId}`

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

    const handleShowRentalDetails = async (id) => {
        let url = API_ENDPOINT.get_rentaldetails + `?id=${id}`
        try {
            const response = await getApi(url)
            if (response?.status === 200) {
                setRentalStatusData(response.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleShowRentalHistory = async (BookRentalId, id) => {
        setBookRentalId(BookRentalId)
        let url = API_ENDPOINT.get_rentalhistory + `?bookRentalId=${BookRentalId}&limit=${itemsPerPage}&offset=${HisCurrentPage + 1}`
            setSelectedId(BookRentalId)
        try {
            const response = await getApi(url)
            if (response?.status === 200) {
               setRentalHistoryData(response?.data)
               setTotalCount(response?.totalCount)
               setHisTotalPages(Math.ceil(response.totalCount / Number(itemsPerPage)));
            }
        } catch (error) {
            console.log(error)
        }
        handleShowRentalDetails(id)
    }


            const columns = useMemo(() => [
                {
                    Header: 'Book Genre',
                    accessor: '',
                    Cell: ({ row }) => <p>{`${row.original.genreBane}`}</p>
                },
                {
                    Header: 'Book Title',
                    accessor: 'title',
                    Cell: ({ row }) => <p>{`${row.original.title.charAt(0).toUpperCase() + row.original.title.slice(1)}`}</p>
                },
                {
                    Header: 'Author',
                    accessor: 'author',
                    Cell: ({ row }) => <p>{`${row.original.author.charAt(0).toUpperCase() + row.original.author.slice(1)}`}</p>

                },
                {
                    Header: 'ISBN',
                    accessor: 'SIBNCode',
                    Cell: ({ row }) => <p>{row.original.SIBNCode}</p>
                },
                {
                    Header: 'Rental Status',
                    accessor: 'status',
                    Cell: ({ row }) => <p>{row.original.status}</p>,

                },
                {
                    Header: 'User Name',
                    accessor: 'userName',
                    // Cell: ({ row }) => <p>{moment(row.original.createdAt).format("YYYY-MM-DD HH:mm:ss")} </p>,
                    Cell: ({ row }) => <Link onClick={() => { handleShowUserInfo(row.original.userId); setPopUp('userDetails') }} style={{ cursor: 'pointer' }}>{row.original.userName} </Link>,
                },
                {
                    Header: 'Rental Duration',
                    accessor: 'duration',
                    Cell: ({ row }) => <>
                        <p>{moment(row.original.startDateTime).format("YYYY-MM-DD HH:mm:ss")} </p>
                        <p>{moment(row.original.endDateTime).format("YYYY-MM-DD HH:mm:ss")} </p>
                    </>,

                },
                {
                    Header: 'Rental Details',
                    accessor: 'details',
                    Cell: ({ row }) => <CButton onClick={() => { setUserInfoPopup(true); setPopUp('RentalD'); handleShowRentalDetails(row.original.id) }} className='mx-3 px-3 py-2 rounded border-1'>View</CButton>
                },
                {
                    Header: 'Rental History',
                    accessor: 'history',
                    Cell: ({ row }) => <CButton onClick={() => { setUserInfoPopup(true); setPopUp('RenatlH'); handleShowRentalHistory(row.original?.BookRentalId, row.original?.id) }} className='mx-3 px-3 py-2 rounded border-1'>View</CButton>

                },
            ], [])

    useEffect(() => {
        const getBookGenreData = async () => {
            const res = await getApi(API_ENDPOINT.get_genre_list)
            if (res?.status === 200) {
                const data = await res?.data?.map((op) => {
                    return { 'label': op?.name, 'value': op?.id }

                })
                setGenre((pre) => {
                    return [{ label: 'All', value: 0 }, ...data]
                })
            }
        }
        getBookGenreData()
        // handleShowRentalDetails(473)
    }, [])
    const getData = async (id) => {
        let url = `${API_ENDPOINT.get_book_list}?offset=${currentPage + 1}&limit=${itemsPerPage}`
        if (filterData?.title) {
            url = url + `&search=${filterData?.title}`
        }
        if (filterData?.rentalStatus) {
            url = url + `&status=${filterData?.rentalStatus}`
        }
        if (filterData.bookGenre) {
            url = url + `&genreId=${filterData.bookGenre}`
        }
        if (filterData?.startDate && filterData?.endDate) {
            url = url + `&startDate=${moment(filterData.startDate).format("YYYY-MM-DD")}&endDate=${moment(filterData.endDate).format("YYYY-MM-DD")}`
        }
        //   if(filterData.title && filterData.rentalStatus && filterData.bookGenre){
        //     url = url +  `&search=${filterData?.title}` + `&status=${filterData?.rentalStatus}` + `&genreId=${filterData?.bookGenre}`
        //   }


        const res = await getApi(url)
        if (res?.status === 200) {
            setBookList(res?.data)
            setTotalPages(Math.ceil(res.totalCount / Number(itemsPerPage)))
        }
        else{
            setBookList([])
        }
    }


    const getUserListExport = async () => {
        let url = `${API_ENDPOINT.book_listexport}?offset=${currentPage + 1}&limit=${itemsPerPage}`;
    
        if (filterData?.title) {
            url = url + `&search=${filterData?.title}`
        }
        if (filterData?.rentalStatus) {
            url = url + `&status=${filterData?.rentalStatus}`
        }
        if (filterData.bookGenre) {
            url = url + `&genreId=${filterData.bookGenre}`
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
        //   checkExportSelectid(false)
    
        } else {
        //   checkExportSelectid(false)
          console.log('No data found');
        }
      }

    useEffect(() => {
        getData()
    }, [filterData.rentalStatus, filterData.bookGenre, filterData.startDate, filterData.endDate, itemsPerPage, currentPage])


    const handleSearch = (e) => {
        const value = e.target.value
        setFilterData((prev) => {
            return {
                ...prev,
                title: value
            }
        })
    }

    const handleStartDate = (event) => {
        const value = event
        setStartDate(value)
         if(value){
             setFilterData((prev) => {
                 return {
                     ...prev,
                     startDate: value
                 }
             })
         }
    }

    const handleEndDate = (event) => {
        const value = event
        setEndDate(value)
        setFilterData((prev) => {
            return {
                ...prev,
                endDate: value
            }
        })
    }

    const handleRentalStatusChange = (e) => {
        const value = e.target.value
        setFilterData((prev) => {
            return {
                ...prev,
                rentalStatus: value.toLowerCase()
            }
        })
    }

    const handleBookGenre = (e) => {
        const value = e.target.value
        // const id = e.target.selectedIndex
        setFilterData((prev) => {
            return {
                ...prev,
                bookGenre: value
            }
        })
    }



    const handleSelectionChange = useCallback((selectedRowsIds) => {
        setSelectedRows([...selectedRows, selectedRowsIds]);
        console.log('selected rows type =>', typeof selectedRowsIds);

        const getIds = selectedRowsIds.map((item) => {
          console.log('ites =>', item);
          return item.id.toString();
        })
        console.log('getIds', getIds)
        console.log('getIds =>', typeof getIds);
        // setDataIds(getIds)

    }, []);

    const handlePageChange = (selectedPage) => {
        setCurrentPage(selectedPage.selected)
    }

    return (
        <div>
            <div className='clearfix'>
                <CButton onClick={getUserListExport} className='float-end mx-2'>Export</CButton>
            </div>
            <div className='d-flex justify-content-between align-items-center my-4'>
                <div className='mx-1 d-flex'>
                    <input className='px-4 me-3 form-control' value={filterData.title} onChange={handleSearch} />
                    <CButton onClick={getData}>Search</CButton>
                </div>
                <div className='d-flex me-5 gap-1'>
                    <CFormSelect
                        className='mx-4'
                        options={[
                            { label: 'All', value: 'All' },
                            { label: 'Renting', value: 'Renting' },
                            { label: 'Renting (extended)', value: 'Renting (extended)' },
                            { label: 'Renting (overdue)', value: 'Renting (overdue)' },
                            { label: 'Returned', value: 'Returned' }
                        ]}
                        onChange={handleRentalStatusChange}
                    />
                    <CFormSelect
                        options={genre}
                        onChange={handleBookGenre}
                    />
                </div>
                <div className='d-flex p-2 gap-3'>
                    <DatePicker value={startDate} onChange={handleStartDate} />
                    <DatePicker value={endDate} onChange={handleEndDate} />
                </div>
            </div>
            <div>
                <ReactTable columns={columns} data={bookList} showCheckbox={false} onSelectionChange={handleSelectionChange} />
            </div>
            <div className='d-flex w-100 justify-content-center gap-3'>
                {bookList.length > 0 &&
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
                                // renderOnZeroPageCount={null}
                                pageRangeDisplayed={4}
                            />
                        </div>

                    </div>

                }
                {bookList.length > 0 && <div className='d-flex align-items-center gap-2 mt-2'>
                    <label>Show</label>
                    <CFormSelect
                        className=''
                        aria-label=""
                        options={paginationItemPerPageOptions}
                        onChange={(event) => {
                            setItemsPerPage(parseInt(event?.target?.value));
                            setCurrentPage(0)
                        }}
                    />
                    <label>Lists</label>
                </div>}
            </div>
            <CModal
                alignment="center"
                visible={userInfoPopup}
                size='lg'
                onClose={() => {
                    setUserInfoPopup(false)
                    setHistCurrentPage(0)
                    // setUserInfoData({})
                }}
                backdrop="static"
                aria-labelledby="LiveDemoExampleLabel">
                <CModalHeader onClose={() => {
                    setUserInfoPopup(false)
                    // setUserInfoData({})
                }}>
                    <CModalTitle className='p-1'>{popUp === 'userDetails' ? 'User Information' : '' ||  popUp === 'RentalD' ? 'Rental Details' : '' || popUp === 'RenatlH' ? 'Rental History' : '' }</CModalTitle>
                </CModalHeader>
                {popUp === 'userDetails' ?
                    <UserProfile userInfoData={userInfoData} />
                    : ''}
                {
                    popUp === 'RentalD' ?
                        <RentalStatus RentalStatusData={RentalStatusData} setRentalStatusData={setRentalStatusData} setUserInfoPopup={setUserInfoPopup} /> : ''
                }
                {
                    popUp === 'RenatlH' ?
                        <RentalHistory bookRentalId={bookRentalId}  itemsPerPage={itemsPerPage} selectedId={selectedId} setHistCurrentPage={setHistCurrentPage} HisCurrentPage={HisCurrentPage} handleShowRentalHistory={handleShowRentalHistory} RentalHistoryData={RentalHistoryData} RentalStatusData={RentalStatusData} totalCount={totalCount} HistotalPages={HistotalPages} /> : ''
                }
            </CModal >
        </div >
    )
}

export default React.memo(BookRentalStatus);