import { cilDataTransferDown } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CButton, CFormSelect, CModal, CModalBody, CModalHeader, CModalTitle } from '@coreui/react'
import React, { useCallback, useMemo, useState } from 'react'
import ReactPaginate from 'react-paginate'
import ReactTable from 'src/components/common/ReactTable'
import { paginationItemPerPageOptions } from 'src/utils/constant'

const DataImport = () => {
    const [visible, setVisible] = useState(false)
    const [validate, setValidate] = useState(false)
    const [totalPages, setTotalPages] = useState(0)
    const [currentPage, setCurrentPage] = useState(0)

    const data = [
        {no:1, boookgenrCode:'p1000', ISBN:3444545545, itemNumber:67656,status:'valid'},
        {no:1, boookgenrCode:'p1000', ISBN:3444545545, itemNumber:67656,status:'valid'},
        {no:1, boookgenrCode:'p1000', ISBN:3444545545, itemNumber:67656,status:'valid'},
        {no:1, boookgenrCode:'p1000', ISBN:3444545545, itemNumber:67656,status:'valid'},
        {no:1, boookgenrCode:'p1000', ISBN:3444545545, itemNumber:67656,status:'valid'},
        {no:1, boookgenrCode:'p1000', ISBN:3444545545, itemNumber:67656,status:'valid'},
        {no:2, boookgenrCode:'p1000', ISBN:3444545545, itemNumber:67656,status:'valid'},
        {no:1, boookgenrCode:'p1000', ISBN:3444545545, itemNumber:67656,status:'valid'},
    ]


    const columns = useMemo(() => [
        {
            Header: 'No',
            accessor: '',
            Cell: ({ row }) => <p>{row.original.no}</p>
        },
        {
            Header: 'Book Genre Code',
            accessor: '',
            Cell: ({ row }) => <p>{row.original.boookgenrCode}</p>
        },
        {
            Header: 'ISBN',
            accessor: 'SIBNCode',
            Cell: ({ row }) => <p>{row.original.ISBN}</p>
        },
        {
            Header: 'Item Number',
            accessor: '',
            Cell: ({ row }) => <p>{row.original.itemNumber}</p>
        },
        {
            Header: 'Status',
            accessor: 'status',
            Cell: ({ row }) => <p>{row.original.status}</p>,

        },
        {
            Header: '',
            accessor: '4',
            Cell: ({ row }) => <p style={{color:'red'}}>{row.original.no === 1 ?  'Number alreday exists' : ''}</p>,

        },
       
    ], [])

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

    const handlePageChange = (selectedPage) => {
        // setCurrentPage(selectedPage.selected)
    }

    return (
        <div>
            <div style={{display:'flex', gap:'20px', alignItems:'center'}}>
            <div style={{border:'0.5px solid black', width:'30%'}} className='d-flex gap-3 p-2'>
                    <input type="file"
                    //   onChange={handleFileSelect}
                      multiple
                      accept=".xlsx, .xls" />
                  </div>
                    <CButton onClick={() => setValidate(!validate)}>Validate</CButton>
            </div>
            <div className='d-flex mt-5  mb-3  fw-bold align-align-items-center gap-3'>
                <p style={{textDecoration:'underline', textUnderlineOffset:'2px'}}>Download Template</p>
                <CIcon  icon={cilDataTransferDown} size='lg' />
            </div>
            <div>
                <p>Please download the template and fill out the required information</p>
            </div>
           {validate && (<div className='my-5'>
                <div className='d-flex gap-4'>
                    <p className='fw-bold '>Validate : </p>
                    <p>Status for current import job of uploaded files</p>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>13:32:52</td>
                            <td>In Progress</td>
                        </tr>
                    </tbody>
                </table>
                <div className='d-flex gap-3 justify-content-between align-items-center'>
                    <div>
                        <p>Records with the error</p>
                    </div>
                    <div className='d-flex gap-3'>
                    <CButton onClick={() => setVisible(true)}>View Log</CButton>
                    <CButton>Run Now</CButton>
                    <CButton>Cancel</CButton>
                    </div>
                </div>
            </div>)}
            <div>
            <CModal
                alignment="center"
                visible={visible}
                size='lg'
                onClose={() => {
                    setVisible(false)
                }}
                backdrop="static"
                aria-labelledby="LiveDemoExampleLabel">
                <CModalHeader>
                    <CModalTitle className='p-1'>View Log : Validate</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <div className='w-100 d-flex justify-content-between '>
                        <CButton>Show only errors</CButton>
                        <CButton>Export</CButton>
                    </div>
                    <p className='my-4 mx-md-5'>Total: 120</p>
                    <div>
                        <ReactTable columns={columns} data={data} showCheckbox={false} onSelectionChange={handleSelectionChange}  />
                        <div className='d-flex w-100 justify-content-center gap-3'>
                {data.length > 0 &&
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
                {data.length > 0 && <div className='d-flex align-items-center gap-2 mt-2'>
                    <label>Show</label>
                    <CFormSelect
                        className=''
                        aria-label=""
                        options={paginationItemPerPageOptions}
                        onChange={(event) => {
                            // setItemsPerPage(parseInt(event?.target?.value));
                            // setCurrentPage(0)
                        }}
                    />
                    <label>Lists</label>
                </div>}
                    </div>
                    </div>
                </CModalBody>
            </CModal >
            </div>
        </div>
    )
}

export default DataImport