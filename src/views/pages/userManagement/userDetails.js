import { CButton, CImage, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import ReactTable from 'src/components/common/ReactTable';
import { getBookRental, getSupplyRental, getUserDetail } from 'src/utils/Api';
import { ALL_CONSTANTS } from 'src/utils/config';

const UserDetails = () => {


  const { id } = useParams();
  console.log("id", id);

  const [userDetails, setUserDetailsData] = useState([])
  const [supplyRentalData, setSupplyRentalData] = useState([])
  const [bookRentalData, setBookRentalData] = useState([])
  const [totalSupply, setTotalSupply] = useState()
  const [totalBookSupply, settotalBookSupply] = useState()
  const [suppliesRentalVisible, setSuppliesRentalVisible] = useState(false)
  const [bookRentalVisible, setBookRentalVisible] = useState(false)
  const [operationClubVisible, setOperationClubVisible] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)



  const suppliesRentalColumns = useMemo(() => [
    {
      Header: 'No',
      accessor: 'Id',
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

  ], [])

  const bookRentalColumns = useMemo(() => [
    {
      Header: 'No',
      accessor: 'Id',
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

  ], [])

  const getSupplyRentallistData = async () => {
    try {
      let url = `https://ptkapi.experiencecommerce.com/api/adminPanel/supplyRental?pageNo=${currentPage + 1}&userId=27`
      const res = await getSupplyRental(url);
      if (res.status == 200) {
        // setCompaniesData(res.data)
        setSupplyRentalData(res.data)
        setTotalSupply(res.totalSupply)
      }
    } catch (error) {
      console.log('error getCompaniesData =>', error);
    }
  }

  const getBookRentallistData = async () => {
    try {
      let url = `https://ptkapi.experiencecommerce.com/api/adminPanel/bookRental?pageNo=${currentPage + 1}&userId=27`
      const res = await getBookRental(url);
      if (res.status == 200) {
        // setCompaniesData(res.data)
        setBookRentalData(res.data)
        settotalBookSupply(res.totalSupply)
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
        <div>
          <CButton className='btn btn-dark'>Reset password</CButton>
        </div>
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
                          <CImage rounded thumbnail crossorigin="anonymous" src={ALL_CONSTANTS.API_URL + userDetails[0]?.imageUrl} width={200} height={200} />
                        </div>
                      </div>

                      <div className="form-outline form-white  d-flex ">
                        <div className='formWrpLabel'>
                          <label className="fw-bolder ">Employee No.</label>
                        </div>
                        <div className='formWrpInpt'>{userDetails[0]?.employeeCode}</div>
                      </div>

                      <div className='d-flex col-md-12'>
                        <div className="form-outline form-white d-flex col-md-6">
                          <div className='formWrpLabel'>
                            <label className="fw-bolder ">Name</label>
                          </div>
                          <div className='formWrpInpt'>{userDetails[0]?.korenName}
                          </div>
                        </div>
                        <div className="form-outline form-white  d-flex  col-md-6">
                          <div className='formWrpLabel'>
                            <label className="fw-bolder ">English Name</label>
                          </div>
                          <div className='formWrpInpt'>{userDetails[0]?.englishName}
                          </div>
                        </div>
                      </div>

                      <div className='d-flex col-md-12'>
                        <div className="form-outline form-white d-flex col-md-6">
                          <div className='formWrpLabel'>
                            <label className="fw-bolder ">E-mail</label>
                          </div>
                          <div className='formWrpInpt'>{userDetails[0]?.email}
                          </div>
                        </div>
                        <div className="form-outline form-white  d-flex  col-md-6">
                          <div className='formWrpLabel'>
                            <label className="fw-bolder ">Mobile</label>
                          </div>
                          <div className='formWrpInpt'>{userDetails[0]?.mobile}
                          </div>
                        </div>
                      </div>

                      <div className="form-outline form-white  d-flex ">
                        <div className='formWrpLabel'>
                          <label className="fw-bolder ">Job Title</label>
                        </div>
                        <div className='formWrpInpt'>{userDetails[0]?.jobTitle}
                        </div>
                      </div>

                      <div className='d-flex col-md-12'>
                        <div className="form-outline form-white d-flex col-md-6">
                          <div className='formWrpLabel'>
                            <label className="fw-bolder ">Company</label>
                          </div>
                          <div className='formWrpInpt'>
                          </div>
                        </div>
                        <div className="form-outline form-white  d-flex  col-md-6">
                          <div className='formWrpLabel'>
                            <label className="fw-bolder ">Division</label>
                          </div>
                          <div className='formWrpInpt'>
                          </div>
                        </div>
                      </div>

                      <div className='d-flex col-md-12'>
                        <div className="form-outline form-white d-flex col-md-6">
                          <div className='formWrpLabel'>
                            <label className="fw-bolder ">Group</label>
                          </div>
                          <div className='formWrpInpt'>
                          </div>
                        </div>
                        <div className="form-outline form-white  d-flex  col-md-6">
                          <div className='formWrpLabel'>
                            <label className="fw-bolder ">Team</label>
                          </div>
                          <div className='formWrpInpt'>
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
                            <p onClick={() => { setSuppliesRentalVisible(!suppliesRentalVisible); getSupplyRentallistData() }}>3</p>
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
                            <p onClick={() => { setBookRentalVisible(!bookRentalVisible); getBookRentallistData() }}>3</p>
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
                          <label className="fw-bolder ">Clib Info.
                          </label>
                        </div>
                        <div className='formWrpInpt'>
                          <div className='d-flex gap-2'>
                            <p>Operation Club: </p>
                            <p onClick={() => setOperationClubVisible(!operationClubVisible)}>3</p>
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
                                <p>Operation Club</p>
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
                        {/* <button className="btn btn-primary btn-md  " type="submit">List</button> */}
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
