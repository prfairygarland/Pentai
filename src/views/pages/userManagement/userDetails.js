import { CButton, CImage, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import ReactPaginate from 'react-paginate';
import { Link, Navigate, useParams } from 'react-router-dom'
import ReactTable from 'src/components/common/ReactTable';
import { getBookRental, getOprationClub, getSupplyRental, getUserDetail } from 'src/utils/Api';
import { ALL_CONSTANTS } from 'src/utils/config';

const UserDetails = () => {


  const { id } = useParams();
  console.log("id", id);

  const [userDetails, setUserDetailsData] = useState([])
  const [supplyRentalData, setSupplyRentalData] = useState([])
  const [bookRentalData, setBookRentalData] = useState([])
  const [oprationClubData, setOprationClubData] = useState([])
  const [totalSupply, setTotalSupply] = useState()
  const [totalBookSupply, settotalBookSupply] = useState()
  const [totalOprationClub, settotalOprationClub] = useState()
  const [suppliesRentalVisible, setSuppliesRentalVisible] = useState(false)
  const [bookRentalVisible, setBookRentalVisible] = useState(false)
  const [operationClubVisible, setOperationClubVisible] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [currentSuppliesRentalPage, setCurrentSuppliesRentalPage] = useState(1)
  const [totalSuppliesRentalPages, setTotalSuppliesRentalPages] = useState(0)
  const [currentBookRentalPage, setCurrentBookRentalPage] = useState(1)
  const [totalBookRentalPages, setTotalBookRentalPages] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [currentOperationClubPage, setCurrentOperationClubPage] = useState(1)
  const [totalOperationClubPages, setTotalOperationClubPages] = useState(0)


  const suppliesRentalColumns = useMemo(() => [
    {
      Header: 'No',
      accessor: 'Id',
      Cell: ({ row }) => {
        return (currentSuppliesRentalPage - 1) * itemsPerPage + (row.index + 1)
      }
    },
    {
      Header: 'Category',
      accessor: 'CategoryName'
    },
    {
      Header: 'Item',
      accessor: 'itemName'
    },
    {
      Header: 'Rental Date',
      accessor: 'RentalDate',
    },
    {
      Header: 'Return Date',
      accessor: 'returnDate'
    },
    {
      Header: 'Status',
      accessor: 'status'
    }

  ], [currentSuppliesRentalPage, itemsPerPage])

  const bookRentalColumns = useMemo(() => [
    {
      Header: 'No',
      accessor: 'Id',
      Cell: ({ row }) => {
        return (currentBookRentalPage - 1) * itemsPerPage + (row.index + 1)
      }
    },
    {
      Header: 'Genre',
      accessor: 'genre'
    },
    {
      Header: 'Book Title',
      accessor: 'bookTitle'
    },
    {
      Header: 'Author',
      accessor: 'author',
    },
    {
      Header: 'Rental Date',
      accessor: 'rentalDate'
    },
    {
      Header: 'Return Date',
      accessor: 'returnDate'
    },
    {
      Header: 'Status',
      accessor: 'status'
    }

  ], [currentBookRentalPage, itemsPerPage])


  const operationClubColumns = useMemo(() => [
    {
      Header: 'No',
      accessor: 'Id',
      Cell: ({ row }) => {
        return (currentOperationClubPage - 1) * itemsPerPage + (row.index + 1)
      }
    },
    {
      Header: 'Club Name',
      accessor: 'clubName'
    },
    {
      Header: 'Created Date',
      accessor: 'CreatedAt'
    }

  ], [currentOperationClubPage, itemsPerPage])

  const getSupplyRentallistData = async (currentSuppliesRentalPage) => {
    try {
      let url = `https://ptkapi.experiencecommerce.com/api/adminPanel/supplyRental?pageNo=${currentSuppliesRentalPage}&limit=${itemsPerPage}&userId=${id}`
      const res = await getSupplyRental(url);
      if (res.status == 200) {
        setCurrentSuppliesRentalPage(currentSuppliesRentalPage)
        // setCompaniesData(res.data)
        setSupplyRentalData(res.data)
        setTotalSupply(res.totalSupply)
        setTotalSuppliesRentalPages(Math.ceil(res.totalSupply / Number(itemsPerPage)));
      }
    } catch (error) {
      console.log('error getCompaniesData =>', error);
    }
  }

  const getBookRentallistData = async (currentBookRentalPage) => {
    try {
      let url = `https://ptkapi.experiencecommerce.com/api/adminPanel/bookRental?pageNo=${currentBookRentalPage}&limit=${itemsPerPage}&userId=${id}`
      const res = await getBookRental(url);
      if (res.status == 200) {
        setCurrentBookRentalPage(currentBookRentalPage)
        // setCompaniesData(res.data)
        setBookRentalData(res.data)
        settotalBookSupply(res.totalBook);
        setTotalBookRentalPages(Math.ceil(res.totalBook / Number(itemsPerPage)));


      }
    } catch (error) {
      console.log('error getCompaniesData =>', error);
    }
  }

  const getOprationClublistData = async (currentOperationClubPage) => {
    try {
      let url = `https://ptkapi.experiencecommerce.com/api/adminPanel/userClubDetails?pageNo=${currentOperationClubPage}&limit=${itemsPerPage}&userId=${id}`
      const res = await getOprationClub(url);
      if (res.status == 200) {
        setCurrentOperationClubPage(currentOperationClubPage)
        // setCompaniesData(res.data)
        setOprationClubData(res.data)
        settotalOprationClub(res.totalClubCount);
        setTotalOperationClubPages(Math.ceil(res.totalClubCount / Number(itemsPerPage)));


      }
    } catch (error) {
      console.log('error getCompaniesData =>', error);
    }
  }


  const getUserDetailData = async () => {
    try {
      let url = `https://ptkapi.experiencecommerce.com/api/adminPanel/userDetails?userId=${id}`
      const res = await getUserDetail(url);
      if (res.status == 200) {
        // setCompaniesData(res.data)
        setUserDetailsData(res.data)
      }
    } catch (error) {
      console.log('error getCompaniesData =>', error);
    }
  }

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected)
  }

  const handleSupplyPageChange = (selectedPage) => {
    // setCurrentSuppliesRentalPage(selectedPage.selected)
    console.log('selectedPage.selected =>', selectedPage.selected);
    getSupplyRentallistData(selectedPage.selected + 1)
  }

  const handleBookPageChange = (selectedPage) => {
    getBookRentallistData(selectedPage.selected + 1)
  }

  const handleOprationClubPageChange = (selectedPage) => {
    getOprationClublistData(selectedPage.selected + 1)
  }


  const [selectedRows, setSelectedRows] = useState([]);
  console.log('selected ids', typeof selectedRows);
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

  useEffect(() => {
    getUserDetailData()
  }, [])

  return (
    <>
      <div>
        {/* <div>
          <CButton className='btn btn-dark'>Reset password</CButton>
        </div> */}
        <section className="d-flex flex-row align-items-center">
          <div className='container'>
            <div className="row justify-content-center">
              {/* <div className="row justify-content-center"> */}
              <div className='col-md-12' >
                <div className="card p-2">
                  <div className='card-body p-0'>
                    <div className='formWraper'>
                      <div className="form-outline form-white  d-flex ">
                        <div className='formWrpLabel'>
                          <label className="fw-bolder ">Profile Image</label>
                        </div>
                        <div className='formWrpInpt'>
                          { }
                          <CImage alt='NA' rounded crossorigin="anonymous" src={ALL_CONSTANTS.API_URL + userDetails[0]?.imageUrl} width={200} height={200} />
                        </div>
                      </div>

                      <div className="form-outline form-white  d-flex ">
                        <div className='formWrpLabel'>
                          <label className="fw-bolder ">Employee No.</label>
                        </div>
                        <div className='formWrpInpt'>{userDetails[0]?.employeeCode ? userDetails[0]?.employeeCode : ''}</div>
                      </div>

                      <div className='d-flex col-md-12'>
                        <div className="form-outline form-white d-flex col-md-6">
                          <div className='formWrpLabel'>
                            <label className="fw-bolder ">Name</label>
                          </div>
                          <div className='formWrpInpt'>{userDetails[0]?.korenName ? userDetails[0]?.korenName : 'NA'}
                          </div>
                        </div>
                        <div className="form-outline form-white  d-flex  col-md-6">
                          <div className='formWrpLabel'>
                            <label className="fw-bolder ">English Name</label>
                          </div>
                          <div className='formWrpInpt'>{userDetails[0]?.englishName ? userDetails[0]?.englishName : 'NA'}
                          </div>
                        </div>
                      </div>

                      <div className='d-flex col-md-12'>
                        <div className="form-outline form-white d-flex col-md-6">
                          <div className='formWrpLabel'>
                            <label className="fw-bolder ">E-mail</label>
                          </div>
                          <div className='formWrpInpt'>{userDetails[0]?.email ? userDetails[0]?.email : 'NA'}
                          </div>
                        </div>
                        <div className="form-outline form-white  d-flex  col-md-6">
                          <div className='formWrpLabel'>
                            <label className="fw-bolder ">Mobile</label>
                          </div>
                          <div className='formWrpInpt'>{userDetails[0]?.mobile ? userDetails[0]?.mobile : 'NA'}
                          </div>
                        </div>
                      </div>

                      <div className="form-outline form-white  d-flex ">
                        <div className='formWrpLabel'>
                          <label className="fw-bolder ">Job Title</label>
                        </div>
                        <div className='formWrpInpt'>{userDetails[0]?.jobTitle ? userDetails[0]?.jobTitle : 'NA'}
                        </div>
                      </div>

                      <div className='d-flex col-md-12'>
                        <div className="form-outline form-white d-flex col-md-6">
                          <div className='formWrpLabel'>
                            <label className="fw-bolder ">Company</label>
                          </div>
                          <div className='formWrpInpt'>{userDetails[0]?.companyName ? userDetails[0]?.companyName : 'NA'}
                          </div>
                        </div>
                        <div className="form-outline form-white  d-flex  col-md-6">
                          <div className='formWrpLabel'>
                            <label className="fw-bolder ">Division</label>
                          </div>
                          <div className='formWrpInpt'>
                            {userDetails[0]?.divisionName ? userDetails[0]?.divisionName : 'NA'}
                          </div>
                        </div>
                      </div>

                      <div className='d-flex col-md-12'>
                        <div className="form-outline form-white d-flex col-md-6">
                          <div className='formWrpLabel'>
                            <label className="fw-bolder ">Group</label>
                          </div>
                          <div className='formWrpInpt'>
                            {userDetails[0]?.groupName ? userDetails[0]?.groupName : 'NA'}
                          </div>
                        </div>
                        <div className="form-outline form-white  d-flex  col-md-6">
                          <div className='formWrpLabel'>
                            <label className="fw-bolder ">Team</label>
                          </div>
                          <div className='formWrpInpt'>
                            {userDetails[0]?.teamName ? userDetails[0]?.teamName : 'NA'}
                          </div>
                        </div>
                      </div>

                      <div className="form-outline form-white d-flex ">
                        <div className='formWrpLabel'>
                          <label className="fw-bolder ">Status</label>
                        </div>
                        <div className='formWrpInpt'>{userDetails[0]?.status == 1 ? 'Active' : 'Inactive'}
                        </div>
                      </div>
                      <div className="form-outline form-white d-flex ">
                        <div className='formWrpLabel'>
                          <label className="fw-bolder ">Last Access
                          </label>
                        </div>
                        <div className='formWrpInpt'>
                          {userDetails[0]?.lastloginAt ? userDetails[0]?.lastloginAt : 'NA'}
                        </div>
                      </div>

                      <div className="form-outline form-white d-flex ">
                        <div className='formWrpLabel'>
                          <label className="fw-bolder ">Rental Info.
                          </label>
                        </div>
                        <div className='formWrpInpt d-flex gap-5'>
                          <div className='d-flex gap-2'>
                            <p>Supplies Rental: </p>
                            <p >
                              {userDetails[0]?.supplyCount == 0 ? 0 : <Link onClick={() => { setSuppliesRentalVisible(!suppliesRentalVisible); getSupplyRentallistData(1) }}>{userDetails[0]?.supplyCount}</Link>}
                            </p>
                            <CModal
                              alignment="center"
                              size='lg'
                              visible={suppliesRentalVisible}
                              onClose={() => setSuppliesRentalVisible(false)}
                              aria-labelledby="LiveDemoExampleLabel">
                              <CModalHeader onClose={() => setSuppliesRentalVisible(false)}>
                                <CModalTitle>Supplies Rental Status</CModalTitle>
                              </CModalHeader>
                              <CModalBody>
                                <p>Total: {totalSupply}</p>
                                <ReactTable showCheckbox={false} columns={suppliesRentalColumns} data={supplyRentalData} totalCount={5} onSelectionChange={handleSelectionChange} />
                                <div className='userlist-pagination dataTables_paginate'>
                                  <ReactPaginate
                                    breakLabel={'...'}
                                    marginPagesDisplayed={1}
                                    previousLabel={<button>Previous</button>}
                                    nextLabel={<button>Next</button>}
                                    pageCount={totalSuppliesRentalPages}
                                    onPageChange={handleSupplyPageChange}
                                    forcePage={currentSuppliesRentalPage - 1}
                                    renderOnZeroPageCount={null}
                                    pageRangeDisplayed={1}
                                  />
                                </div>
                              </CModalBody>
                              <CModalFooter>
                                <CButton color="secondary" onClick={() => setSuppliesRentalVisible(false)}>
                                  Close
                                </CButton>
                              </CModalFooter>
                            </CModal>
                          </div>
                          <div className='d-flex gap-2'>
                            <p>Book Rental: </p>
                            <p>
                              {
                                userDetails[0]?.bookCount == 0 ? 0 :
                                  <Link onClick={() => { setBookRentalVisible(!bookRentalVisible); getBookRentallistData(1) }}>{userDetails[0]?.bookCount}</Link>
                              }
                            </p>
                            <CModal
                              alignment="center"
                              size='lg'
                              visible={bookRentalVisible}
                              onClose={() => setBookRentalVisible(false)}
                              aria-labelledby="LiveDemoExampleLabel">
                              <CModalHeader onClose={() => setBookRentalVisible(false)}>
                                <CModalTitle>Book Rental Status</CModalTitle>
                              </CModalHeader>
                              <CModalBody>
                                <p>Total: {totalBookSupply}</p>
                                <ReactTable showCheckbox={false} columns={bookRentalColumns} data={bookRentalData} totalCount={5} onSelectionChange={handleSelectionChange} />
                                <div className='userlist-pagination dataTables_paginate'>
                                  <ReactPaginate
                                    breakLabel={'...'}
                                    marginPagesDisplayed={1}
                                    previousLabel={<button>Previous</button>}
                                    nextLabel={<button>Next</button>}
                                    pageCount={totalBookRentalPages}
                                    onPageChange={handleBookPageChange}
                                    forcePage={currentBookRentalPage - 1}
                                    renderOnZeroPageCount={null}
                                    pageRangeDisplayed={1}
                                  />
                                </div>
                              </CModalBody>
                              <CModalFooter>
                                <CButton color="secondary" onClick={() => setBookRentalVisible(false)}>
                                  Close
                                </CButton>
                              </CModalFooter>
                            </CModal>
                          </div>
                        </div>
                      </div>

                      <div className="form-outline form-white d-flex ">
                        <div className='formWrpLabel'>
                          <label className="fw-bolder ">Club Info.
                          </label>
                        </div>
                        <div className='formWrpInpt'>
                          <div className='d-flex gap-2'>
                            <p>Operation Club: </p>

                            <p >
                              {
                                userDetails[0]?.clubCount == 0 ? 0 :
                                  <Link onClick={() => { setOperationClubVisible(!operationClubVisible); getOprationClublistData(1) }}>{userDetails[0]?.clubCount}</Link>
                              }
                            </p>
                            <CModal
                              alignment="center"
                              size='lg'
                              visible={operationClubVisible}
                              onClose={() => setOperationClubVisible(false)}
                              aria-labelledby="LiveDemoExampleLabel">
                              <CModalHeader onClose={() => setOperationClubVisible(false)}>
                                <CModalTitle>Operation Club Status</CModalTitle>
                              </CModalHeader>
                              <CModalBody>
                                <p>Total: {totalOprationClub}</p>
                                <ReactTable className='d-flex' showCheckbox={false} columns={operationClubColumns} data={oprationClubData} totalCount={5} onSelectionChange={handleSelectionChange} />
                                <div className='userlist-pagination dataTables_paginate'>
                                  <ReactPaginate
                                    breakLabel={'...'}
                                    marginPagesDisplayed={1}
                                    previousLabel={<button>Previous</button>}
                                    nextLabel={<button>Next</button>}
                                    pageCount={totalOperationClubPages}
                                    onPageChange={handleOprationClubPageChange}
                                    forcePage={currentOperationClubPage - 1}
                                    renderOnZeroPageCount={null}
                                    pageRangeDisplayed={1}
                                  />
                                </div>
                              </CModalBody>
                              <CModalFooter>
                                <CButton color="secondary" onClick={() => setOperationClubVisible(false)}>
                                  Close
                                </CButton>
                              </CModalFooter>
                            </CModal>
                          </div>
                        </div>
                      </div>
                      <div className='px-4 mt-4 d-flex justify-content-center mb-3'>
                        <Link to={"/User"}>
                          <button className="btn btn-primary btn-md">List</button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* </div> */}
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default UserDetails
