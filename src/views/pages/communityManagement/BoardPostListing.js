import { CButton, CFormInput, CFormSelect, CModal, CModalBody, CModalHeader, CModalTitle } from '@coreui/react'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import DatePicker from 'react-date-picker';
import ReactPaginate from 'react-paginate';
import { Link, useNavigate } from 'react-router-dom';
import ReactTable from 'src/components/common/ReactTable';
import { getApi } from 'src/utils/Api';
import { API_ENDPOINT } from 'src/utils/config';
import { postTypeOptions, classificationsOptions, reportedOptions, paginationItemPerPageOptions } from 'src/utils/constant';


const BoardPostListing = () => {

    const initialFilter = {
        department: 'title',
        searchstring: '',
        startdate: '',
        enddate: '',
        posttype: '',
        classification: '',
        reported: ''
    }

    const [boardSelectOptions, setBoeardSelectOptions] = useState([{ label: 'All', value: '' }])
    const [boardID, setBoardID] = useState(0)
    const [boardDetails, setBoardDetails] = useState({})
    const [postData, setPostData] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(0)
    const [totalDataCount, setTotalDataCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(0)
    const [itemsPerPage, setItemsPerPage] = useState(5)
    const [filterData, setFilterData] = useState(initialFilter)
    const [filterApplied, setFilterApplied] = useState(0)
    const [userInfoPopup, setUserInfoPopup] = useState(false)
    const [userInfoData, setUserInfoData] = useState({})


    useEffect(() => {
        getBoardDropDownData()
    }, [])

    useEffect(() => {
        getPostData(boardID)
    }, [itemsPerPage, currentPage, filterApplied,boardID])

    console.log(filterApplied)

    const handleSelectBoardChange = async (event) => {
        const value = parseInt(event.target.value)

        setCurrentPage(0)
        setBoardID(value)
        setFilterData(initialFilter)
        setFilterApplied(0) 
        if (value) {
            const boardInfo = await getBoardDataByID(value)
            setBoardDetails(boardInfo.getBoardData[0])
        } else {
            setBoardDetails({})
        }
        // getPostData(value)
    }

    const getBoardDropDownData = async () => {
        setIsLoading(true)
        try {
            let url = `${API_ENDPOINT.get_boards}`

            const responce = await getApi(url)

            if (responce.status === 200) {
                const boardData = responce.getBoardData.map((ele) => {
                    return { 'label': ele.name, 'value': ele.id }
                })

                setBoeardSelectOptions((prev) => {
                    return [{ label: 'All', value: 0 }, ...boardData]
                })
                setIsLoading(false)
            } else {
                setIsLoading(false)
            }
        } catch (error) {
            setIsLoading(false)
            console.log(error)
        }
    }

    const getPostData = async (boardId) => {
        console.log("filterData", filterData)
        setIsLoading(true)
        try {
            let url = `${API_ENDPOINT.get_bulletinboard_posts}?pageNo=${currentPage + 1}&limit=${itemsPerPage}`

            if (boardId >= 0) {
                url = url + `&boardId=${boardId}`
            }

            if (filterData.searchstring) {
                if (filterData.department === 'writter') {
                    url = url + `&writer=${filterData.searchstring}`
                } else {
                    url = url + `&title=${filterData.searchstring}`
                }
            }

            if (filterData?.posttype) {
                url = url + `&postType=${filterData.posttype}`
            }

            if (filterData?.classification) {
                url = url + `&postStatuses=${filterData.classification}`
            }

            if (filterData?.reported > 0) {
                url = url + `&reported=${filterData.reported}`
            }

            if (filterData?.startdate && filterData.enddate) {
                url = url + `&startDate=${filterData.startdate}&endDate=${filterData.enddate}`
            }

            const responce = await getApi(url)

            console.log('getPostData', responce)
            if (responce.status === 200) {
                setPostData(responce.data)
                setTotalDataCount(responce.totalCount)
                setTotalPages(Math.ceil(responce.totalCount / Number(itemsPerPage)));
                setIsLoading(false)
            } else {
                setIsLoading(false)
            }

        } catch (error) {
            setIsLoading(false)
        }

    }

    const getBoardDataByID = async (id) => {
        let data = []
        try {
            let url = API_ENDPOINT.get_boarddata_byID + `?boardId=${id}`

            const response = await getApi(url)
            console.log(response)
            if (response.status === 200) {
                data = response
            }
        } catch (error) {
            console.log(error)
        }
        return data
    }

    const handlePageChange = (selectedPage) => {
        setCurrentPage(selectedPage.selected)
    }

    const handleDepartmentChange = (event) => {

        const value = event?.target?.value

        setFilterData((prev) => {
            return {
                ...prev,
                department: value
            }
        })
    }

    const handleDepartmentSearchChange = (event) => {

        const value = event?.target?.value

        setFilterData((prev) => {
            return {
                ...prev,
                searchstring: value
            }
        })
    }
    const handleStartDate = (event) => {
        console.log('startdate', event)

        const value = event?.toISOString()

        setFilterData((prev) => {
            return {
                ...prev,
                startdate: value
            }
        })
    }

    const handleEndDate = (event) => {
        console.log('enddate', event)
        const value = event?.toISOString()

        setFilterData((prev) => {
            return {
                ...prev,
                enddate: value
            }
        })
    }

    const handlePostTypeChange = (event) => {
        const value = event?.target?.value

        setFilterData((prev) => {
            return {
                ...prev,
                posttype: value
            }
        })
    }

    const handleClassificationChange = (event) => {
        const value = event?.target?.value

        setFilterData((prev) => {
            return {
                ...prev,
                classification: value
            }
        })
    }

    const handleReportedChange = (event) => {
        const value = event?.target?.value != '' ? parseInt(event?.target?.value) : ''

        console.log(value)
        console.log(typeof value)


        setFilterData((prev) => {
            return {
                ...prev,
                reported: value
            }
        })
    }

    const handleSearchfilter = () => {

        if ((filterData.startdate && !filterData.enddate) || (!filterData.startdate && filterData.enddate)) {
            console.log('start end ceck');
            return
        }

        if ((filterData.searchstring && filterData.department) || (filterData.startdate && filterData.enddate) || filterData.posttype || filterData.classification || (filterData.reported > 0)) {
            // setFilterApplied(false)
            console.log('if')
            setCurrentPage(0)
            setFilterApplied(prev=> prev + 1)
        } else {
            console.log('else')
            setFilterApplied(0)
            return
        }
    }

    const resetFilter = useCallback(() => {
        // if (filterApplied > 0) {
            setCurrentPage(0)
            setFilterApplied(0)
            setFilterData({
                department: 'title',
                searchstring: '',
                startdate: '',
                enddate: '',
                posttype: '',
                classification: '',
                reported: ''
            })
        // }
    }, [])

    const handleShowWritterInfo = async (type, id) => {
        console.log('userid', id, type)
        let url = API_ENDPOINT.get_postuserdetail

        if (type === 'user') {
            url = url + `?userId=${id}`
        }

        if (type === 'admin') {
            url = url + `?adminId=${id}`
        }

        try {
            const response = await getApi(url)
            console.log('response', response)
            if (response.status === 200) {
                setUserInfoPopup(true)
                setUserInfoData(response.getBoardData[0])
            }

        } catch (error) {
            console.log(error)
        }
    }

    const [selectedRows, setSelectedRows] = useState([]);
    const handleSelectionChange = useCallback((selectedRowsIds) => {
        // setSelectedRows([...selectedRows, selectedRowsIds]);
        // console.log('selected rows type =>', typeof selectedRowsIds);

        // const getIds = selectedRowsIds.map((item) => {
        //   console.log('ites =>', item);
        //   return item.id.toString();
        // })
        // console.log('getIds', getIds)
        // console.log('getIds =>', typeof getIds);
        // setDataIds(getIds)

    }, []);

    const columns = useMemo(() => [
        {
            Header: 'No',
            Cell: ({ row }) => {
                return currentPage * itemsPerPage + (row.index + 1)
            }
        },
        {
            Header: 'Type',
            accessor: 'PostTypes'
        },
        {
            Header: 'Classification',
            accessor: 'postStatuses'
        },
        {
            Header: 'Reported Post',
            accessor: 'englishName',
            Cell: ({ row }) => <p>{`${row.original.reportsPostCount ? 'Y' : 'N'}`}</p>
        },
        {
            Header: 'Title',
            accessor: 'PostTitle',
            Cell: ({ row }) => <div className="text-wrap">
                <Link >{row.original.PostTitle}</Link>
            </div>
        },
        {
            Header: 'Writter',
            accessor: 'englishname',
            Cell: ({ row }) => <Link  onClick={() => handleShowWritterInfo(row.original.userId ? 'user' : 'admin', row.original.userId ? row.original.userId : row.original.AdminId)} className='text-dark' style={{curser : 'pointer'}}>{row.original.englishname ? row.original.englishname : row.original.adminName}</Link>,

        },
        {
            Header: 'Date',
            accessor: 'createdAt'
        },
        {
            Header: 'Likes',
            accessor: 'likes',
            Cell: ({ row }) => <p>{`${row.original.likes ? row.original.likes : 0}`}</p>
        },
        {
            Header: 'Comments',
            accessor: 'comments',
            Cell: ({ row }) => <p>{`${row.original.comments ? row.original.comments : 0}`}</p>
        },
        {
            Header: 'Views',
            accessor: 'views',
            Cell: ({ row }) => <p>{`${row.original.views ? row.original.views : 0}`}</p>
        },
        {
            Header: 'No of Reported Comments',
            accessor: 'reportsCommentsCount',
            Cell: ({ row }) => <p>{row.original.reportsCommentsCount ? row.original.reportsCommentsCount : 0}</p>
        },
        {
            Header: 'History',
            Cell: ({ row }) => <Link>View</Link>
        },
    ], [currentPage, itemsPerPage])

    const navigate = useNavigate();
    const createPostHandler = () => {
        navigate("./createPost", {
            state: {
                boardID: boardID
            }
        })
    }
    return (
        <main>
            <div>
                <div className='d-flex justify-content-end'>
                    <CButton onClick={createPostHandler}>Create a post</CButton>
                </div>
                <div className='d-flex p-3 justify-content-between h-100 w-100 bg-light rounded mt-2' >
                    <div className='d-flex align-items-center w-25 ms-2 align-items-center'>
                        <p className='fw-medium me-3' style={{ 'white-space': 'nowrap'}}>Board</p>
                        <CFormSelect
                            className='mb-2'
                            aria-label="Default select example"
                            options={boardSelectOptions}
                            onChange={handleSelectBoardChange}
                        />
                    </div>
                    <div className='d-flex align-items-center  ms-2 align-items-center'>
                        <p className='fw-medium me-1'>Usage status :</p>
                        <p>{boardDetails?.usageStatus ? 'Deny' : '-'}</p>
                    </div>
                    <div className='d-flex align-items-center  ms-2 align-items-center'>
                        <p className='fw-medium me-1'>Permissions to write :</p>
                        <p>{boardDetails?.isAdminOnly === 0 || boardDetails?.isAdminOnly === 1 ? (boardDetails?.isAdminOnly === 0 ? 'All' : 'Admin only') : '-'}</p>
                    </div>
                    <div className='d-flex align-items-center me-2 align-items-center'>
                        <p className='fw-medium me-1'>Anonymous Board :</p>
                        <p>{boardDetails?.annonymousBoard === 0 || boardDetails?.annonymousBoard === 1 ? (boardDetails?.annonymousBoard === 0 ? 'No' : 'Yes') : '-'}</p>
                    </div>
                </div>
                <div className='d-flex p-4  flex-column bg-light rounded mt-3'>
                    <div className='d-flex align-items-center w-100'>
                        <div className='d-flex align-items-center me-5'>
                            <label className='me-3 fw-medium'>Department</label>
                            <CFormSelect
                                className='w-50 me-2'
                                aria-label="Default select example"
                                options={[
                                    { label: 'Title', value: 'title' },
                                    { label: 'Writter', value: 'writter' }
                                ]}
                                onChange={handleDepartmentChange}
                            />
                            <CFormInput type="text" value={filterData?.searchstring} onChange={handleDepartmentSearchChange} id="inputPassword2" />
                        </div>
                        <div className='d-flex align-items-center'>
                            <label className='me-3 fw-medium'>Date</label>
                            <div className='d-flex p-2 gap-3'>
                                From <DatePicker value={filterData?.startdate} onChange={handleStartDate} />
                                to<DatePicker value={filterData?.enddate} onChange={handleEndDate} />
                            </div>
                        </div>
                    </div>
                    <div className='d-flex align-items-center w-100 mt-4'>
                        <div className='d-flex align-items-center me-5 '>
                            <label className='fw-medium me-3 ' style={{ 'white-space': 'nowrap'}}>Post Type</label>
                            <CFormSelect
                                className='me-2'
                                aria-label="Default select example"
                                options={[
                                    { label: 'Select...', value: '' },
                                    ...postTypeOptions
                                ]}
                                onChange={handlePostTypeChange}
                                value={filterData.posttype}
                            />
                        </div>
                        <div className='d-flex align-items-center me-5'>
                            <label className='fw-medium  me-3'>Classification</label>
                            <CFormSelect
                                className='me-2'
                                aria-label="Default select example"
                                options={[
                                    { label: 'Select...', value: '' },
                                    ...classificationsOptions
                                ]}
                                onChange={handleClassificationChange}
                                value={filterData.classification}
                            />
                        </div>
                        <div className='d-flex align-items-center me-5'>
                            <label className='fw-medium me-3'>Reported​</label>
                            <CFormSelect
                                className='me-2'
                                aria-label="Default select example"
                                options={[
                                    { label: 'Select...', value: '' },
                                    ...reportedOptions
                                ]}
                                onChange={handleReportedChange}
                                value={filterData.reported}
                            />
                        </div>
                    </div>
                    <div className='d-flex gap-3 mt-3'>
                        <CButton onClick={handleSearchfilter} >Search</CButton>
                        <CButton onClick={resetFilter}>Reset</CButton>
                    </div>
                </div>
                <div className='d-flex flex-column mt-3 p-3'>
                    <p style={{ margin: 0 }}>Total&nbsp;:&nbsp; {totalDataCount}</p>
                    <ReactTable columns={columns} data={postData} showCheckbox={false} onSelectionChange={handleSelectionChange} />
                    <div className='d-flex w-100 justify-content-center gap-3'>
                        {postData.length > 0 &&
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

                        }
                        {postData.length > 0 && <div className='d-flex align-items-center gap-2 mt-2'>
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
                </div>
            </div>

            {/* Modal */}
            <CModal
                alignment="center"
                visible={userInfoPopup}
                onClose={() => {
                    setUserInfoPopup(false)
                    setUserInfoData({})
                }}
                backdrop="static"
                aria-labelledby="LiveDemoExampleLabel">
                <CModalHeader onClose={() =>{
                    setUserInfoPopup(false)
                    setUserInfoData({})
                }}>
                    <CModalTitle className='p-1'>User Information </CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <div className=''>
                        <p>Username : { userInfoData.englishName ?  userInfoData.englishName : '-'}</p>
                        <p>Group/Team : { userInfoData.teamName ? userInfoData.teamName : '-' } </p>
                        <p>E-mail address : { userInfoData.email ? userInfoData.email : '-' }</p>
                   </div>
                   
                </CModalBody>
                
            </CModal>
        </main>
    )
}

export default BoardPostListing