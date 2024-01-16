import moment from 'moment/moment'
import React, { useCallback, useMemo, useState } from 'react'
import ReactPaginate from 'react-paginate'
import ReactTable from 'src/components/common/ReactTable'

const SupplyRentalHistory = ({ RentalHistoryData, RentalStatusData, totalCount, HistotalPages, itemsPerPage }) => {

  const [currentPage, setCurrentPage] = useState(0)


  const columns = useMemo(() => [
    {
      Header: 'No',
      accessor: '',
      // Cell: ({ row }) => <p>{row.original.id}</p>
      Cell: ({ row }) => {
        return currentPage * itemsPerPage + (row.index + 1)
      }
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
    setCurrentPage(selectedPage.selected)
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
          <p style={{ fontSize: 'medium' }}>Model Name:</p>
          <p style={{ fontSize: 'medium', paddingLeft: 5, fontWeight: '600' }}>{RentalStatusData?.modelName}</p>
        </div>
        <div className='d-flex align-content-center g-2'>
          <p>Item Number: </p>
          <p style={{ fontSize: 'medium', paddingLeft: 5, fontWeight: '600' }}>{RentalStatusData?.itemNumber}</p>
        </div>
        <div className='d-flex justify-content-between py-md-3 '>
          <p style={{ fontSize: 'medium' }}>Total: {totalCount > 0 ? totalCount : '-'}</p>
          <button className='mx-3 px-3 py-2 rounded border-1'>Export</button>
        </div>
      </div>
      <ReactTable columns={columns} data={RentalHistoryData} showCheckbox={false} onSelectionChange={handleSelectionChange} />
      {RentalHistoryData.length > 0 &&
        <div className='userlist-pagination py-3'>
          <div className='userlist-pagination dataTables_paginate'>
            <ReactPaginate
              breakLabel={'...'}
              marginPagesDisplayed={1}
              previousLabel={<button>Previous</button>}
              nextLabel={<button>Next</button>}
              pageCount={HistotalPages}
              onPageChange={handlePageChange}
              forcePage={currentPage}
              // renderOnZeroPageCount={null}
              pageRangeDisplayed={4}
            />
          </div>

        </div>
      }
    </div>
  )
}

export default SupplyRentalHistory
