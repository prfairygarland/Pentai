import { cilMenu } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CButton, CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle, CFormCheck, CModal } from '@coreui/react'
import React, { useMemo, useState } from 'react'
import DatePicker from 'react-date-picker';
import { useNavigate } from 'react-router-dom';
import Loader from 'src/components/common/Loader';
import ReactTable from 'src/components/common/ReactTable';

const PushNotificationManagement = () => {

    const [isLoading, setIsLoading] = useState(false)


    const navigate = useNavigate()

    const dataList = [
        {id:1}
    ]

    const handleSelectionChange = () =>{
        console.log('hello')
        // setIsLoading(true)
    }

    const Classification = [
        {label:'All', value:'All'},
        {label:'General', value:'general'},
        {label:'Urgent', value:'urgent'}
    ]

    const Status = [
        {label:'All', value:'All'},
        {label:'Stand By', value:'Stand By'},
        {label:'confirmed', value:'confirmed'},
        {label:'Cancelled', value:'cancelled'}
    ]

   

    const columns = useMemo(() => [
        
        {
            Header: 'No',
            accessor: '',
            // Cell: ({ row }) => {
            //     return currentPage * itemsPerPage + (row?.index + 1)
            // }
        },
        {
            Header: 'Classification',
            accessor: '',
            // Cell: ({ row }) =>
            //     <img alt="" crossOrigin='anonymous' src={imageUrl + row?.original?.image} style={{ width: '100%', height: '100px' }}></img>

        },
        {
            Header: 'Title',
            accessor: 'title',
            // Cell: ({ row }) => 
        },
        {
            Header: 'Send Date',
            accessor: '',
            // Cell: ({ row }) => 
        },
        {
            Header: 'Status',
            accessor: '',
            // Cell: ({ row }) => 
        },
        {
            Header: 'Action',
            accessor: '',
             Cell: ({ row }) => <a className='mx-3 primTxt '>Delete</a>
        },
    ], [])

    return (
        <div>
            <div className='d-flex justify-content-between  pageTitle mb-3 pb-2'>
                <h2>Push Notification Management</h2>
                <CButton onClick={() => navigate('createPushNotificationRegistration')}>Create</CButton>
            </div>
           {isLoading && <Loader />} <div>
        <div className='container bg-light p-3 mb-3'>
          <div className='d-flex mb-3'>
            <div className='me-5'>
              <label className='me-3'>Classification</label>
              <CDropdown className='dropDownbackground drpBtn'>
                <CDropdownToggle color="white" >
                  {/* {statusSelectedValue.Name ? statusSelectedValue.Name : multiLang?.Active} */}
                  name
                </CDropdownToggle>
                <CDropdownMenu>
                  {Classification.map((option, index) => (
                    <CDropdownItem role="button" key={index}>
                      {option.label}
                    </CDropdownItem>
                  ))}
                </CDropdownMenu>
              </CDropdown>
            </div>
            <div className='d-flex align-items-center'>
              <label className='me-3'>Status</label>
              <CDropdown className='dropDownbackground me-3 drpBtn' >
                <CDropdownToggle color="white">Name</CDropdownToggle>
                <CDropdownMenu>
                  {Status.map((option, index) => (
                    <CDropdownItem role="button" key={index} >
                      {option.label}
                    </CDropdownItem>
                  ))}
                </CDropdownMenu>
              </CDropdown>
              <div className="d-flex align-items-center">
                <label className="me-3 fw-medium">Send Date</label>
                <div className="d-flex p-2 gap-3 ">
                  <DatePicker  />
                  <DatePicker  />
                </div>
              </div>
            </div>

          </div>
          <div className='d-flex  align-items-center justify-content-between  gap-3 pe-3'>
            <div className='d-flex  align-items-center gap-3 w-100'>
            <div className=''>
              <label>Title</label>
            </div>
            <div className="col-md-8">
              <div className="d-flex form-inline w-100">
                <input className="form-control mr-sm-10 me-2" type="search" placeholder="Search" aria-label="Search" />
              </div>
            </div>
            </div>
                <button className="btn btn-primary my-2 my-sm-0"  type="submit" >Search</button>
          </div>
        </div>
        <div>
          <div className='d-flex justify-content-between align-items-center mb-3'>
            <p style={{ margin: 0 }}>total</p>
          </div>
        </div>
        <div>

          <ReactTable columns={columns} data={dataList} showCheckbox={false} totalCount={10} onSelectionChange={handleSelectionChange} />
          {/* <div>
           <div className='d-flex justify-content-center align-items-center mt-3 mb-2 gap-3'>
           {userListData.length > 0 &&
              <div className='userlist-pagination'>
                <div className='userlist-pagination dataTables_paginate'>
                  <ReactPaginate
                    breakLabel={'...'}
                    marginPagesDisplayed={1}
                    previousLabel={<button>{multiLang?.Previous}</button>}
                    nextLabel={<button>{multiLang?.Next}</button>}
                    pageCount={totalPages}
                    onPageChange={handlePageChange}
                    forcePage={currentPage}
                    renderOnZeroPageCount={null}
                    pageRangeDisplayed={1}
                  />
                </div>
              </div>
            }
            <CDropdown className='dropDownbackground drpDBtn align-items-center'>
                <label>{multiLang?.Show}</label>
                <CDropdownToggle color="white" className='mx-2 filterbtn' >{itemsPerPage}</CDropdownToggle>
                <CDropdownMenu >
                  {perPageValue.map((option, index) => (
                    <CDropdownItem role="button" key={index} onClick={() => perPagehandleSelect(option)}>
                      {option}
                    </CDropdownItem>
                  ))}
                </CDropdownMenu>
                <label>{multiLang?.Lists}</label>
              </CDropdown>
           </div>
          </div> */}
        </div>
      </div>
        </div>
    )
}

export default PushNotificationManagement