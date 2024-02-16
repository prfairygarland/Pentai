import { CButton, CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle, CFormCheck, CFormInput, CFormTextarea, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import { use } from 'i18next';
import { enqueueSnackbar } from 'notistack';
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next';
import ReactPaginate from 'react-paginate';
import { useNavigate } from 'react-router-dom';
import Loader from 'src/components/common/Loader';
import ReactTable from 'src/components/common/ReactTable';
import { getApi, postApi } from 'src/utils/Api';
import { API_ENDPOINT } from 'src/utils/config';

const PointsManagement = () => {


  const { t, i18n } = useTranslation();
  const translationObject = i18n.getDataByLanguage(i18n.language);
  const multiLang = translationObject?.translation?.PointsManagement
  const [isLoading, setIsLoading] = useState(false);
  const [searchInputValue, setSearchInputValue] = useState('')
  const [statusSelectedValue, setStatusSelectedValue] = useState({ id: 1, Name: 'Active' })
  const [currentPage, setCurrentPage] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const navigate = useNavigate();
  const [getPointAllData, setGetPointAllData] = useState([])
  const [total, setTotal] = useState(0)
  const [dataIds, setDataIds] = useState(null);
  const [totalPages, setTotalPages] = useState(0)
  const [divisionData, setDivisionData] = useState([])
  const [groupData, setGroupData] = useState([])
  const [TeamData, setTeamData] = useState([])
  const [selectDivision, setSelectDivision] = useState({});
  const [selectGroup, setSelectGroup] = useState({});
  const [selectTeam, setSelectTeam] = useState({});
  const [typeSelect, setTypeSelect] = useState({});
  const [searchInput, setSearchInput] = useState('');
  const [visible, setVisible] = useState(false)
  const [reason, setReason] = useState('')
  const [points, setPoints] = useState(null);
  const [type, setType] = useState(true)


  const statusDropdownValues = [{ id: 2, Name: multiLang?.All }, { id: 1, Name: multiLang?.Active }, {
    id: 0, Name: multiLang?.Inactive
  }];
  const textDropdownValues = [{ id: 1, Name: multiLang?.Name, type: 'Name' }, { id: 2, Name: multiLang?.English_Name, type: 'englishName' }, { id: 3, Name: multiLang?.E_mail, type: 'email' }];

  const perPageValue = [5, 10, 20, 30]

  const perPagehandleSelect = (value) => {
    setItemsPerPage(value);
    setCurrentPage(0)
  };

  const [selectedRows, setSelectedRows] = useState([]);
  const handleSelectionChange = useCallback((selectedRowsIds) => {
    setSelectedRows([...selectedRows, selectedRowsIds]);

    const getIds = selectedRowsIds.map((item) => {
      return item.id.toString();
    })
    setDataIds(getIds)

  }, []);

  console.log('getIds =>', dataIds);

  useEffect(() => {
    getPointsData()
  }, [itemsPerPage, currentPage, selectDivision, selectGroup, selectTeam, searchInputValue, statusSelectedValue])

  useEffect(() => {
    getDivisionData()
    getGroupData()
    getTeamData()
  }, [])

  const getDivisionData = async () => {
    let url = API_ENDPOINT.getDivisionApiData

    const res = await getApi(url)

    console.log('test =>', res);
    if (res?.status === 200) {
      setDivisionData(res.data)
    } else {
      // setFeatureManagementData([])
    }
  }

  const getGroupData = async () => {
    let url = API_ENDPOINT.getGroupApiData

    const res = await getApi(url)

    console.log('test =>', res);
    if (res?.status === 200) {
      setGroupData(res.data)
    } else {
      // setFeatureManagementData([])
    }
  }

  const getTeamData = async () => {
    let url = API_ENDPOINT.getTeamApiData

    const res = await getApi(url)

    console.log('test =>', res);
    if (res?.status === 200) {
      setTeamData(res.data)
    } else {
      // setFeatureManagementData([])
    }
  }

  const columns = useMemo(() => [
    {
      Header: multiLang?.E_mail,
      accessor: 'email',
      Cell: ({ row }) => <p>{row.original.email ? row.original.email : '-'}</p>
    },
    {
      Header: multiLang?.Name,
      accessor: 'koreanName',
      Cell: ({ row }) => <p>{row.original.koreanName ? row.original.koreanName : '-'}</p>
    },
    {
      Header: multiLang?.English_Name,
      accessor: 'englishName',
      Cell: ({ row }) => <a role='button' onClick={() => viewDetailsHandler(row.original.id)} className='text-center'>{row.original.englishName}</a>

    },
    {
      Header: multiLang?.Company,
      accessor: 'companyName',
      Cell: ({ row }) => <p>{row.original.companyName ? row.original.companyName : '-'}</p>
    },
    {
      Header: multiLang?.Division,
      accessor: 'divisionName',
      Cell: ({ row }) => <p>{row.original.divisionName ? row.original.divisionName : '-'}</p>
    },
    {
      Header: multiLang?.Group,
      accessor: 'groupName',
      Cell: ({ row }) => <p>{row.original.groupName ? row.original.groupName : '-'}</p>
    },
    {
      Header: multiLang?.Team,
      accessor: 'teamName',
      Cell: ({ row }) => <p>{row.original.teamName ? row.original.teamName : '-'}</p>
    },
    {
      Header: multiLang?.Status,
      accessor: 'isAuthenticated',
      Cell: ({ row }) => <p className={row.original.isAuthenticated == 1 ? 'greenTxt' : 'primTxt'}>{row.original.isAuthenticated == 1 ? 'Active' : 'Inactive'}</p>
    },
    {
      Header: multiLang?.point,
      accessor: 'availablePoints',
      Cell: ({ row }) => <a onClick={() => viewDetailsHandler(row.original.id)}>{row.original.availablePoints ? row.original.availablePoints : '-'}</a>
    }

  ], [currentPage, itemsPerPage, t])

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected)
  }

  const viewDetailsHandler = (id) => {
    navigate("./PointsDetails", {
      state: {
        pointId: id
      }
    })
  }

  const statushandleSelect = (value) => {
    setStatusSelectedValue(value);
  };

  const handleInputvalue = (event) => {
    setSearchInputValue(searchInput)

  }

  const handleInputChange = (event) => {
    if (event.target.value == '') {
      setSearchInputValue('')
    }
    setSearchInput(event.target.value)
  }

  const getPointsData = async () => {
    setIsLoading(true)
    try {
      let url = API_ENDPOINT.getPointsdata + `?pageNo=${currentPage + 1}&pageSize=${itemsPerPage}&status=${statusSelectedValue.id}`


      if (selectDivision.id) {
        url = url + `&division=${selectDivision.id}`
      }
      if (selectGroup.id) {
        url = url + `&group=${selectGroup.id}`
      }
      if (selectTeam.id) {
        url = url + `&team=${selectTeam.id}`
      }

      if (typeSelect.id && searchInput != '') {
        url = url + `&searchId=${typeSelect.id}&${typeSelect.type}=${searchInput}`;
      }

      const res = await getApi(url)
      console.log('resPonce =>', res);
      if (res.status == 201) {
        setIsLoading(false)
        setGetPointAllData(res.data)
        setTotal(res.totalCount)
        setTotalPages(Math.ceil(res.totalCount / Number(itemsPerPage)));
      } else {
        setIsLoading(false)
      }

    } catch (error) {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    const sanitizedValue = e.target.value.replace(/[^0-9]/g, '');
    setPoints(sanitizedValue);

  };

  const validate = async () => {
    if (points === null) {
      enqueueSnackbar('Please enter points', { variant: 'error' })
    } else if (points === '') {
      enqueueSnackbar('Please enter points', { variant: 'error' })
    } else if (reason === '') {
      enqueueSnackbar('Please enter reason', { variant: 'error' })
    } else {
      handleChangePoint()
    }
  }

  const resetValues = async () => {
    setPoints(null)
    setReason('')
    setType(true)
  }

  const handleChangePoint = async () => {
    setIsLoading(true)
    let url = API_ENDPOINT.changePoint
    try {
      // for (let obj in dataIds) {
      //   let data = {
      //     id: dataIds[obj],
      //     type: type === true ? 'add' : 'deduct',
      //     points: points,
      //     reason: reason
      //   }

      //   let responce = await postApi(data, url)

      // }
      let data = {
        id: dataIds[0],
        type: type === true ? 'add' : 'deduct',
        points: points,
        reason: reason
      }
      let responce = await postApi(url, data)

      console.log('res =>', responce);

      if (responce.status === 200) {
        setVisible(false)
        resetValues()
        getPointsData()
        enqueueSnackbar(multiLang?.successMsg, { variant: 'success' })
        setIsLoading(false)
      } else {
        setVisible(false)
        getPointsData()
        setIsLoading(false)
      }

    } catch {

    }
  }

  return (
    <div>
      {isLoading && <Loader />}
      <div className='pageTitle mb-3 pb-2'>
        <h2>{multiLang?.pointsManagement}</h2>
      </div>
      <div>
        <div className='container bg-light p-3 mb-3'>
          <div className='d-flex mb-3'>
            <div className='me-5'>
              <label className='me-3'>{multiLang?.Status}</label>
              <CDropdown className='dropDownbackground drpBtn'>
                <CDropdownToggle color="white" >
                  {statusSelectedValue.Name ? statusSelectedValue.Name : multiLang?.Active}
                </CDropdownToggle>
                <CDropdownMenu>
                  {statusDropdownValues.map((option, index) => (
                    <CDropdownItem role="button" key={index} onClick={() => statushandleSelect(option)}>
                      {option.Name}
                    </CDropdownItem>
                  ))}
                </CDropdownMenu>
              </CDropdown>
            </div>
            <div className='d-flex align-items-center'>
              <label className='me-3'>{multiLang?.department}</label>
              <CDropdown className={divisionData?.length > 0 ? 'dropDownbackground me-3 drpBtn' : 'dropDownbackground me-3 drpBtn disable-class'} >
                <CDropdownToggle color="white">{selectDivision.DivisionsName ? selectDivision.DivisionsName : multiLang?.Division}</CDropdownToggle>
                <CDropdownMenu >
                  <CDropdownItem role="button" onClick={() => setSelectDivision({ DivisionsName: 'None' })}>{multiLang?.none}</CDropdownItem>
                  {divisionData?.length > 0 && divisionData?.map((option, index) => (
                    <CDropdownItem role="button" key={index} onClick={() => { getGroupData(option.id); setSelectDivision(option) }}>
                      {option.DivisionsName}
                    </CDropdownItem>
                  ))}
                </CDropdownMenu>
              </CDropdown>
              <CDropdown className={groupData?.length > 0 ? 'dropDownbackground me-3 drpBtn' : 'dropDownbackground me-3 drpBtn disable-class'}>
                <CDropdownToggle color="white">{selectGroup.groupName ? selectGroup.groupName : multiLang?.Group}</CDropdownToggle>
                <CDropdownMenu>
                  <CDropdownItem role="button" onClick={() => setSelectGroup({ groupName: 'None' })}>{multiLang?.none}</CDropdownItem>
                  {groupData?.map((option, index) => (
                    <CDropdownItem role="button" key={index} onClick={() => { setSelectGroup(option) }}>
                      {option.groupName}
                    </CDropdownItem>
                  ))}
                </CDropdownMenu>
              </CDropdown>
              <CDropdown className={TeamData?.length > 0 ? 'dropDownbackground me-4 drpBtn' : 'dropDownbackground me-4 drpBtn disable-class'}>
                <CDropdownToggle color="white">{selectTeam.teamName ? selectTeam.teamName : multiLang?.Team}</CDropdownToggle>
                <CDropdownMenu>
                  <CDropdownItem role="button" onClick={() => setSelectTeam({ teamName: 'None' })}>{multiLang?.none}</CDropdownItem>
                  {TeamData.map((option, index) => (
                    <CDropdownItem role="button" key={index} onClick={() => setSelectTeam(option)} >
                      {option.teamName}
                    </CDropdownItem>
                  ))}
                </CDropdownMenu>
              </CDropdown>
            </div>

          </div>
          <div className='d-flex  align-items-center gap-3 pe-3'>
            <div className='col-md-2'>
              <CDropdown className='dropDownbackground drpDBtn w-100'>
                <CDropdownToggle color="white" >
                  {typeSelect.Name ? typeSelect.Name : multiLang?.Type}
                </CDropdownToggle>
                <CDropdownMenu>
                  {textDropdownValues.map((option, index) => (
                    <CDropdownItem role="button" key={index} onClick={() => setTypeSelect(option)}>
                      {option.Name}
                    </CDropdownItem>
                  ))}
                </CDropdownMenu>
              </CDropdown>
            </div>
            <div className="col-md-10  ">
              <div className="d-flex form-inline w-100">
                <input className="form-control mr-sm-10 me-2" value={searchInput} onChange={handleInputChange} type="search" placeholder={multiLang?.search} aria-label="Search" />
                <button className="btn btn-primary my-2 my-sm-0" disabled={!typeSelect.id || searchInput == ''} type="submit" onClick={() => { handleInputvalue() }}>{multiLang?.search}</button>
              </div>
            </div>
          </div>
          <div className='d-flex justify-content-end mt-3'>
            {/* <CButton className='btn btn-black' onClick={() => clearAllFilters()}>{multiLang?.Clear}</CButton> */}
          </div>
        </div>
        <div>
          <div className='d-flex justify-content-between align-items-center mb-3'>
            <p style={{ margin: 0 }}>{multiLang?.total}:{total}</p>
            <CButton className='' disabled={dataIds?.length === 0} onClick={() => setVisible(!visible)}>{multiLang?.changePoints}</CButton>
          </div>
        </div>
        <div>

          <ReactTable columns={columns} data={getPointAllData} totalCount={10} onSelectionChange={handleSelectionChange} />
          <div>
            <div className='d-flex justify-content-center align-items-center mt-3 mb-2 gap-3'>
              {getPointAllData?.length > 0 &&
                <div className='d-flex gap-4'>
                  <div className='userlist-pagination'>
                    <div className='userlist-pagination dataTables_paginate'>
                      <ReactPaginate
                        breakLabel={'...'}
                        marginPagesDisplayed={1}
                        previousLabel={<button>{multiLang?.previous}</button>}
                        nextLabel={<button>{multiLang?.next}</button>}
                        pageCount={totalPages}
                        onPageChange={handlePageChange}
                        forcePage={currentPage}
                        renderOnZeroPageCount={null}
                        pageRangeDisplayed={1}
                      />
                    </div>


                  </div>

                  <CDropdown className='dropDownbackground drpDBtn align-items-center'>
                    <label>{multiLang?.show}</label>
                    <CDropdownToggle color="white" className='mx-2 filterbtn' >{itemsPerPage}</CDropdownToggle>
                    <CDropdownMenu >
                      {perPageValue.map((option, index) => (
                        <CDropdownItem role="button" key={index} onClick={() => perPagehandleSelect(option)}>
                          {option}
                        </CDropdownItem>
                      ))}
                    </CDropdownMenu>
                    <label>{multiLang?.lists}</label>
                  </CDropdown>
                </div>
              }

            </div>

          </div>


          <div>
            <CModal
              backdrop="static"
              visible={visible}
              onClose={() => (resetValues(), setVisible(false))}
              aria-labelledby="StaticBackdropExampleLabel"
            >
              <CModalHeader>
                <CModalTitle id="StaticBackdropExampleLabel">{multiLang?.changePoints}</CModalTitle>
              </CModalHeader>
              <CModalBody>
                <div>
                  <p style={{ margin: 0 }}>{multiLang?.total}:{dataIds?.length}</p>
                </div>
                <div className="card-body">
                  <div className="formWraper">
                    <div className="form-outline form-white  d-flex ">
                      <div className="formWrpLabel">
                        <label className="fw-bolder ">
                          {multiLang?.type}
                        </label>
                      </div>
                      <div className="formWrpInpt">
                        <div className="formradiogroup mb-2 gap-3">
                          <div className="push-notification-container gap-3">
                            <CFormCheck type="radio" name="add" id="exampleRadios1" label={multiLang?.add}
                              defaultChecked={type}
                              onClick={() => setType(true)}
                              value={true}
                            />
                            <CFormCheck type="radio" name="deduct" id="exampleRadios2" label={multiLang?.deduct}
                              defaultChecked={!type}
                              onClick={() => setType(false)}
                              value={false}
                            />
                          </div>
                          <div className='d-flex align-items-center gap-3'>
                            <CFormInput
                              // style={{ width: 100 }}
                              className='text-center'
                              type="text"
                              placeholder={multiLang?.enterNumber}
                              name='Points'
                              value={points}
                              onChange={(e) => handleChange(e)}
                            />
                            <p className='w-100'>{multiLang?.points}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="form-outline form-white  d-flex ">
                      <div className="formWrpLabel">
                        <label className="fw-bolder ">
                          {multiLang?.reason}
                        </label>
                      </div>
                      <div className="formWrpInpt">
                        <div className="d-flex formradiogroup mb-2 gap-3">
                          <CFormTextarea
                            type="text"
                            placeholder="Enter reason"
                            name="title"
                            value={reason}
                            onChange={(e) => {
                              setReason(e.target.value.substring(0, 100))
                            }}
                          />
                          <span className="txt-byte-information justify-content-start">
                            {reason?.length} / 100
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CModalBody>
              <CModalFooter className='d-flex justify-content-center'>
                <CButton className='btn-black' onClick={() => (resetValues(), setVisible(false))}>
                  {multiLang?.close}
                </CButton>
                <CButton color="primary" onClick={() => validate()}>{multiLang?.save}</CButton>
              </CModalFooter>
            </CModal>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PointsManagement
