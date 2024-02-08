import { CButton } from '@coreui/react'
import moment from 'moment/moment'
import { enqueueSnackbar } from 'notistack'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import ReactPaginate from 'react-paginate'
import ReactTable from 'src/components/common/ReactTable'
import { getApi, getUserListExportData } from 'src/utils/Api'
import { API_ENDPOINT } from 'src/utils/config'

const RentalHistory = ({ bookRentalId, setHistCurrentPage, HisCurrentPage, selectedId, handleShowRentalHistory, RentalHistoryData, RentalStatusData, totalCount, HistotalPages }) => {

    // const [currentPage, setCurrentPage] = useState(0)

    useEffect(() => {
        handleShowRentalHistory(selectedId)
    }, [HisCurrentPage])


    const historyExportData = async () => {
        try {
            let url = API_ENDPOINT.bookexport_RentalHistory + `?bookRentalId=${bookRentalId}`

            console.log('url check =>', url);

            const res = await getApi(url)
            console.log('res =>', res);

            if (res.filePath) {
                const downloadLink = res.filePath;
                const link = document.createElement('a');
                link.href = 'https://ptkapi.experiencecommerce.com/' + downloadLink;
                link.setAttribute('download', `exported_data_${new Date().getTime()}.xlsx`);

                link.click();
                enqueueSnackbar('Data export successfull', { variant: 'success', autoHideDuration: 3000, })

            } else {
                enqueueSnackbar('Something went wrong', { variant: 'error', autoHideDuration: 3000, })
                console.log('No data found');
            }

        } catch (error) {
            console.log(error)
        }
    }



    const columns = useMemo(() => [
        {
            Header: 'No',
            accessor: '',
            Cell: ({ row }) => <p>{row.original.id}</p>
        },
        {
            Header: 'User Name',
            accessor: 'user Name',
            Cell: ({ row }) => <p>{row.original.userName}</p>
        },
        {
            Header: 'Rental Requested Date',
            accessor: 'Rental Date',
            Cell: ({ row }) => <p> <p>{moment(row.original.startDateTime).format("YYYY-MM-DD")} - {moment(row.original.endDateTime).format("YYYY-MM-DD")} </p>
                <p> </p></p>
        },
        {
            Header: 'Returned Date',
            accessor: 'Returned Date',
            Cell: ({ row }) => <p>{row.original.returnDate ? moment(row.original.returnDate).format("YYYY-MM-DD") : '-'}</p>
        },
        {
            Header: 'Rental status',
            accessor: 'Rental',
            Cell: ({ row }) => <p>{row.original.status}</p>
        },

    ])

    const handlePageChange = (selectedPage) => {
        setHistCurrentPage(selectedPage.selected)
        // setCurrentPageH(selectedId.selected)
    }

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

    return (
        <div>
            <div className='p-md-4'>
                <div className='d-flex align-content-center g-2'>
                    <p style={{ fontSize: 'medium' }}>Book Title:</p>
                    <p style={{ fontSize: 'medium', paddingLeft: 5, fontWeight: '600' }}>{RentalStatusData?.title}</p>
                </div>
                <div className='d-flex align-content-center g-2'>
                    <p>ISBN: </p>
                    <p style={{ fontSize: 'medium', paddingLeft: 5, fontWeight: '600' }}>{RentalStatusData?.SIBNCode}</p>
                </div>
                <div className='d-flex justify-content-between py-md-3 '>
                    <p style={{ fontSize: 'medium' }}>Total: {totalCount > 0 ? totalCount : '-'}</p>
                    <CButton onClick={historyExportData} className=''>Export</CButton>
                </div>
            </div>
            <ReactTable columns={columns} data={RentalHistoryData} showCheckbox={false} onSelectionChange={handleSelectionChange} />
            <div className='userlist-pagination py-3'>
                <div className='userlist-pagination dataTables_paginate'>
                    <ReactPaginate
                        breakLabel={'...'}
                        marginPagesDisplayed={1}
                        previousLabel={<button>Previous</button>}
                        nextLabel={<button>Next</button>}
                        pageCount={HistotalPages}
                        onPageChange={handlePageChange}
                        forcePage={HisCurrentPage}
                        // renderOnZeroPageCount={null}
                        pageRangeDisplayed={4}
                    />
                </div>

            </div>
        </div>
    )
}

export default RentalHistory