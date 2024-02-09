import { CButton, CImage, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import ReactPaginate from 'react-paginate';
import { Link, Navigate, useLocation, useParams } from 'react-router-dom'
import ReactTable from 'src/components/common/ReactTable';
import { getBookRental, getOprationClub, getSupplyRental, getUserDetail } from 'src/utils/Api';
import { ALL_CONSTANTS } from 'src/utils/config';
import * as moment from 'moment';
import { useTranslation } from 'react-i18next';

const UserDetails = () => {


  const { id } = useParams();

  const [userDetails, setUserDetailsData] = useState([])
  const [userId, setUserId] = useState();
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
  const location = useLocation()
  const { t, i18n } = useTranslation();
  const translationObject = i18n.getDataByLanguage(i18n.language);
  const multiLang = translationObject?.translation?.UserDetails


  const suppliesRentalColumns = useMemo(() => [
    {
      Header: multiLang?.No,
      accessor: 'Id',
      Cell: ({ row }) => {
        return (currentSuppliesRentalPage - 1) * itemsPerPage + (row.index + 1)
      }
    },
    {
      Header: multiLang?.Category,
      accessor: 'CategoryName'
    },
    {
      Header: multiLang?.Item,
      accessor: 'itemName'
    },
    {
      Header: multiLang?.Rental_Date,
      accessor: '',
      Cell: ({ row }) => <p>{row.original.RentalDate ? moment(row.original.RentalDate).format('YYYY-MM-DD') : '-'}</p>

    },
    {
      Header: multiLang?.Return_Date,
      accessor: 'returnDate',
      Cell: ({ row }) => <p>{row.original.returnDate ? moment(row.original.returnDate).format('YYYY-MM-DD') : '-'}</p>

    },
    {
      Header: multiLang?.Status,
      accessor: 'status'
    }

  ], [currentSuppliesRentalPage, itemsPerPage])

  const bookRentalColumns = useMemo(() => [
    {
      Header: multiLang?.No,
      accessor: 'Id',
      Cell: ({ row }) => {
        return (currentBookRentalPage - 1) * itemsPerPage + (row.index + 1)
      }
    },
    {
      Header: multiLang?.Genre,
      accessor: 'genre'
    },
    {
      Header: multiLang?.Book_Title,
      accessor: 'bookTitle'
    },
    {
      Header: multiLang?.Author,
      accessor: 'author',
    },
    {
      Header: multiLang?.Rental_Date,
      accessor: 'rentalDate',
      Cell: ({ row }) => <p>{moment(row.original.rentalDate).format('YYYY-MM-DD')}</p>
    },
    {
      Header: multiLang?.Return_Date,
      accessor: 'returnDate',
      Cell: ({ row }) => <p>{row.original.returnDate ? moment(row.original.returnDate).format('YYYY-MM-DD') : '-'}</p>
    },
    {
      Header: multiLang?.Status,
      accessor: 'status'
    }

  ], [currentBookRentalPage, itemsPerPage])


  const operationClubColumns = useMemo(() => [
    {
      Header: multiLang?.No,
      accessor: 'Id',
      Cell: ({ row }) => {
        return (currentOperationClubPage - 1) * itemsPerPage + (row.index + 1)
      }
    },
    {
      Header: multiLang?.Club_Name,
      accessor: 'clubName'
    },
    {
      Header: multiLang?.Created_Date,
      accessor: 'CreatedAt',
      Cell: ({ row }) => <p>{row.original.CreatedAt ? moment(row.original.CreatedAt).format('YYYY-MM-DD') : '-'}</p>

    }

  ], [currentOperationClubPage, itemsPerPage])


  const getSupplyRentallistData = async (currentSuppliesRentalPage) => {
    try {
      let url = `https://ptkapi.experiencecommerce.com/api/adminPanel/supplyRental?pageNo=${currentSuppliesRentalPage}&limit=${itemsPerPage}&userId=${userId}`
      const res = await getSupplyRental(url);
      if (res.status == 200) {
        setCurrentSuppliesRentalPage(currentSuppliesRentalPage)
        // setCompaniesData(res.data)
        setSupplyRentalData(res.data)
        setTotalSupply(res.totalSupply)
        setTotalSuppliesRentalPages(Math.ceil(res.totalSupply / Number(itemsPerPage)));
      }
    } catch (error) {
    }
  }

  const getBookRentallistData = async (currentBookRentalPage) => {
    try {
      let url = `https://ptkapi.experiencecommerce.com/api/adminPanel/bookRental?pageNo=${currentBookRentalPage}&limit=${itemsPerPage}&userId=${userId}`
      const res = await getBookRental(url);
      if (res.status == 200) {
        setCurrentBookRentalPage(currentBookRentalPage)
        // setCompaniesData(res.data)
        setBookRentalData(res.data)
        settotalBookSupply(res.totalBook);
        setTotalBookRentalPages(Math.ceil(res.totalBook / Number(itemsPerPage)));


      }
    } catch (error) {
    }
  }

  const getOprationClublistData = async (currentOperationClubPage) => {
    try {
      let url = `https://ptkapi.experiencecommerce.com/api/adminPanel/userClubDetails?pageNo=${currentOperationClubPage}&limit=${itemsPerPage}&userId=${userId}`
      const res = await getOprationClub(url);
      if (res.status == 200) {
        setCurrentOperationClubPage(currentOperationClubPage)
        // setCompaniesData(res.data)
        setOprationClubData(res.data)
        settotalOprationClub(res.totalClubCount);
        setTotalOperationClubPages(Math.ceil(res.totalClubCount / Number(itemsPerPage)));


      }
    } catch (error) {
    }
  }


  const getUserDetailData = async () => {
    try {
      let url = `https://ptkapi.experiencecommerce.com/api/adminPanel/userDetails?userId=${location?.state?.userId}`
      const res = await getUserDetail(url);
      if (res.status == 200) {
        // setCompaniesData(res.data)
        setUserDetailsData(res.data)
      }
    } catch (error) {
    }
  }

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected)
  }

  const handleSupplyPageChange = (selectedPage) => {
    // setCurrentSuppliesRentalPage(selectedPage.selected)
    getSupplyRentallistData(selectedPage.selected + 1)
  }

  const handleBookPageChange = (selectedPage) => {
    getBookRentallistData(selectedPage.selected + 1)
  }

  const handleOprationClubPageChange = (selectedPage) => {
    getOprationClublistData(selectedPage.selected + 1)
  }


  const [selectedRows, setSelectedRows] = useState([]);
  const handleSelectionChange = useCallback((selectedRowsIds) => {
    setSelectedRows([...selectedRows, selectedRowsIds]);

    const getIds = selectedRowsIds.map((item) => {
      return item.id.toString();
    })
    // setDataIds(getIds)

  }, []);

  useEffect(() => {
    setUserId(location?.state?.userId)
    getUserDetailData()
  }, [])

  return (
    <>
      <div>
      <div className="pageTitle mb-3 pb-2">
      <h2>User Details</h2>
    </div>
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
                          <label className="fw-bolder ">{multiLang?.Profile_Image}</label>
                        </div>
                        <div className='formWrpInpt'>
                         <div className='useDetailImgWrp'>
                         {userDetails[0]?.imageUrl != null ?
                            <CImage alt='NA'  crossorigin="anonymous" src={ALL_CONSTANTS.API_URL + userDetails[0]?.imageUrl} width={200} height={200} />
                            : '-'
                          }
                         </div>
                        </div>
                      </div>

                      <div className="form-outline form-white  d-flex ">
                        <div className='formWrpLabel'>
                          <label className="fw-bolder ">{multiLang?.Employee_No}</label>
                        </div>
                        <div className='formWrpInpt'>{userDetails[0]?.employeeCode ? userDetails[0]?.employeeCode : ''}</div>
                      </div>

                      <div className='d-flex col-md-12'>
                        <div className="form-outline form-white d-flex col-md-6">
                          <div className='formWrpLabel'>
                            <label className="fw-bolder ">{multiLang?.Name}</label>
                          </div>
                          <div className='formWrpInpt'>{userDetails[0]?.korenName ? userDetails[0]?.korenName : 'NA'}
                          </div>
                        </div>
                        <div className="form-outline form-white  d-flex  col-md-6">
                          <div className='formWrpLabel'>
                            <label className="fw-bolder ">{multiLang?.English_Name}</label>
                          </div>
                          <div className='formWrpInpt'>{userDetails[0]?.englishName ? userDetails[0]?.englishName : 'NA'}
                          </div>
                        </div>
                      </div>

                      <div className='d-flex col-md-12'>
                        <div className="form-outline form-white d-flex col-md-6">
                          <div className='formWrpLabel'>
                            <label className="fw-bolder ">{multiLang?.E_mail}</label>
                          </div>
                          <div className='formWrpInpt'>{userDetails[0]?.email ? userDetails[0]?.email : 'NA'}
                          </div>
                        </div>
                        <div className="form-outline form-white  d-flex  col-md-6">
                          <div className='formWrpLabel'>
                            <label className="fw-bolder ">{multiLang?.Mobile}</label>
                          </div>
                          <div className='formWrpInpt'>{userDetails[0]?.mobile ? userDetails[0]?.mobile : 'NA'}
                          </div>
                        </div>
                      </div>

                      <div className="form-outline form-white  d-flex ">
                        <div className='formWrpLabel'>
                          <label className="fw-bolder ">{multiLang?.Job_Title}</label>
                        </div>
                        <div className='formWrpInpt'>{userDetails[0]?.jobTitle ? userDetails[0]?.jobTitle : 'NA'}
                        </div>
                      </div>

                      <div className='d-flex col-md-12'>
                        <div className="form-outline form-white d-flex col-md-6">
                          <div className='formWrpLabel'>
                            <label className="fw-bolder ">{multiLang?.Company}</label>
                          </div>
                          <div className='formWrpInpt'>{userDetails[0]?.companyName ? userDetails[0]?.companyName : 'NA'}
                          </div>
                        </div>
                        <div className="form-outline form-white  d-flex  col-md-6">
                          <div className='formWrpLabel'>
                            <label className="fw-bolder ">{multiLang?.Division}</label>
                          </div>
                          <div className='formWrpInpt'>
                            {userDetails[0]?.divisionName ? userDetails[0]?.divisionName : 'NA'}
                          </div>
                        </div>
                      </div>

                      <div className='d-flex col-md-12'>
                        <div className="form-outline form-white d-flex col-md-6">
                          <div className='formWrpLabel'>
                            <label className="fw-bolder ">{multiLang?.Group}</label>
                          </div>
                          <div className='formWrpInpt'>
                            {userDetails[0]?.groupName ? userDetails[0]?.groupName : 'NA'}
                          </div>
                        </div>
                        <div className="form-outline form-white  d-flex  col-md-6">
                          <div className='formWrpLabel'>
                            <label className="fw-bolder ">{multiLang?.Team}</label>
                          </div>
                          <div className='formWrpInpt'>
                            {userDetails[0]?.teamName ? userDetails[0]?.teamName : 'NA'}
                          </div>
                        </div>
                      </div>

                      <div className="form-outline form-white d-flex ">
                        <div className='formWrpLabel'>
                          <label className="fw-bolder ">{multiLang?.Status}</label>
                        </div>
                        <div className='formWrpInpt'>{userDetails[0]?.status == 1 ? 'Active' : 'Inactive'}
                        </div>
                      </div>
                      <div className="form-outline form-white d-flex ">
                        <div className='formWrpLabel'>
                          <label className="fw-bolder ">{multiLang?.Last_Access}
                          </label>
                        </div>
                        <div className='formWrpInpt'>
                          {userDetails[0]?.lastloginAt ? userDetails[0]?.lastloginAt : 'NA'}
                        </div>
                      </div>

                      <div className='d-flex col-md-12'>
                        <div className="form-outline form-white d-flex col-md-6">
                          <div className=" d-flex w-100">
                            <div className='formWrpLabel'>
                              <label className="fw-bolder ">{multiLang?.Rental_Info}
                              </label>
                            </div>
                            <div className='formWrpInpt d-flex gap-5'>
                              <div className='d-flex gap-2 align-items-center'>
                                <p>{multiLang?.Supplies_Rental}: </p>
                              <strong>
                              <a>
                                  {userDetails[0]?.supplyCount == 0 ? 0 : <Link onClick={() => { setSuppliesRentalVisible(!suppliesRentalVisible); getSupplyRentallistData(1) }}>{userDetails[0]?.supplyCount}</Link>}
                                </a>
                              </strong>
                                <CModal
                                  backdrop="static"
                                  alignment="center"
                                  size='lg'
                                  visible={suppliesRentalVisible}
                                  onClose={() => setSuppliesRentalVisible(false)}
                                  aria-labelledby="LiveDemoExampleLabel">
                                  <CModalHeader onClose={() => setSuppliesRentalVisible(false)}>
                                    <CModalTitle>{multiLang?.Supplies_Rental_Status}</CModalTitle>
                                  </CModalHeader>
                                  <CModalBody>
                                    <p className='mb-2'>{multiLang?.Total}: {totalSupply}</p>
                                    <div className='userdetailPopTable'>
                                      <ReactTable showCheckbox={false} columns={suppliesRentalColumns} data={supplyRentalData} totalCount={5} onSelectionChange={handleSelectionChange} /></div>
                                    <div className='userlist-pagination dataTables_paginate mt-3'>
                                      <ReactPaginate
                                        breakLabel={'...'}
                                        marginPagesDisplayed={1}
                                        previousLabel={<button>{multiLang?.Previous}</button>}
                                        nextLabel={<button>{multiLang?.Next}</button>}
                                        pageCount={totalSuppliesRentalPages}
                                        onPageChange={handleSupplyPageChange}
                                        forcePage={currentSuppliesRentalPage - 1}
                                        renderOnZeroPageCount={null}
                                        pageRangeDisplayed={1}
                                      />
                                    </div>
                                  </CModalBody>
                                  {/* <CModalFooter>
                                    <CButton className='btn btn-black' onClick={() => setSuppliesRentalVisible(false)}>
                                      {multiLang?.Close}
                                    </CButton>
                                  </CModalFooter> */}
                                </CModal>
                              </div>
                              <div className='d-flex gap-2 align-items-center'>
                                <p>{multiLang?.Book_Rental}: </p>
                               <strong>
                               <a>
                                  {
                                    userDetails[0]?.bookCount == 0 ? 0 :
                                      <Link onClick={() => { setBookRentalVisible(!bookRentalVisible); getBookRentallistData(1) }}>{userDetails[0]?.bookCount}</Link>
                                  }
                                </a>
                               </strong>
                                <CModal
                                  backdrop="static"
                                  alignment="center"
                                  size='lg'
                                  visible={bookRentalVisible}
                                  onClose={() => setBookRentalVisible(false)}
                                  aria-labelledby="LiveDemoExampleLabel">
                                  <CModalHeader onClose={() => setBookRentalVisible(false)}>
                                    <CModalTitle>{multiLang?.Book_Rental_Status}</CModalTitle>
                                  </CModalHeader>
                                  <CModalBody>
                                    <p className='mb-2'>{multiLang?.Total}: {totalBookSupply}</p>
                                    <div className='userdetailPopTable'>
                                      <ReactTable showCheckbox={false} columns={bookRentalColumns} data={bookRentalData} totalCount={5} onSelectionChange={handleSelectionChange} />
                                    </div>
                                    <div className='userlist-pagination dataTables_paginate mt-3'>
                                      <ReactPaginate
                                        breakLabel={'...'}
                                        marginPagesDisplayed={1}
                                        previousLabel={<button>{multiLang?.Previous}</button>}
                                        nextLabel={<button>{multiLang?.Next}</button>}
                                        pageCount={totalBookRentalPages}
                                        onPageChange={handleBookPageChange}
                                        forcePage={currentBookRentalPage - 1}
                                        renderOnZeroPageCount={null}
                                        pageRangeDisplayed={1}
                                      />
                                    </div>
                                  </CModalBody>
                                  {/* <CModalFooter>
                                    <CButton className='btn btn-black' onClick={() => setBookRentalVisible(false)}>
                                      {multiLang?.Close}
                                    </CButton>
                                  </CModalFooter> */}
                                </CModal>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="form-outline form-white  d-flex  col-md-6">
                          <div className='formWrpLabel'>
                            <div className='d-flex gap-2'>
                              <label>{multiLang?.Point_info} </label>
                            </div>
                          </div>

                        </div>
                      </div>


                      <div className="form-outline form-white d-flex ">
                        <div className='formWrpLabel'>
                          <label className="fw-bolder ">{multiLang?.Club_Info}
                          </label>
                        </div>
                        <div className='formWrpInpt'>
                          <div className='d-flex gap-2 align-items-center'>
                            <p>{multiLang?.Operation_Club}: </p>

                          <strong>
                          <a>
                              {
                                userDetails[0]?.clubCount == 0 ? 0 :
                                  <Link onClick={() => { setOperationClubVisible(!operationClubVisible); getOprationClublistData(1) }}>{userDetails[0]?.clubCount}</Link>
                              }
                            </a>
                          </strong>
                            <CModal
                              backdrop="static"
                              alignment="center"
                              size='lg'
                              visible={operationClubVisible}
                              onClose={() => setOperationClubVisible(false)}
                              aria-labelledby="LiveDemoExampleLabel">
                              <CModalHeader onClose={() => setOperationClubVisible(false)}>
                                <CModalTitle>{multiLang?.Operation_Club_Status}</CModalTitle>
                              </CModalHeader>
                              <CModalBody>
                                <p className='mb-2'>{multiLang?.Total}: {totalOprationClub}</p>
                              <div className='userdetailPopTable'>
                               <ReactTable className='d-flex ' showCheckbox={false} columns={operationClubColumns} data={oprationClubData} totalCount={5} onSelectionChange={handleSelectionChange} />
                               </div>

                                <div className='userlist-pagination dataTables_paginate mt-3'>
                                  <ReactPaginate
                                    breakLabel={'...'}
                                    marginPagesDisplayed={1}
                                    previousLabel={<button>{multiLang?.Previous}</button>}
                                    nextLabel={<button>{multiLang?.Next}</button>}
                                    pageCount={totalOperationClubPages}
                                    onPageChange={handleOprationClubPageChange}
                                    forcePage={currentOperationClubPage - 1}
                                    renderOnZeroPageCount={null}
                                    pageRangeDisplayed={1}
                                  />
                                </div>
                              </CModalBody>
                              {/* <CModalFooter>
                                <CButton className='btn btn-black' onClick={() => setOperationClubVisible(false)}>
                                  {multiLang?.Close}
                                </CButton>
                              </CModalFooter> */}
                            </CModal>
                          </div>
                        </div>
                      </div>
                      <div className='px-4 mt-4 d-flex justify-content-center mb-3'>
                        <Link to={"/User"}>
                          <button className="btn btn-primary btn-md">{multiLang?.List}</button>
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
