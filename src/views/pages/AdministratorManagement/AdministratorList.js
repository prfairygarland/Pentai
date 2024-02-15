import { cilInfo } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CButton, CFormInput, CFormSelect, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CNav, CNavItem, CNavLink, CTooltip } from '@coreui/react'
import moment from 'moment'
import { enqueueSnackbar } from 'notistack'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import DatePicker from 'react-date-picker'
import { useTranslation } from 'react-i18next'
import ReactPaginate from 'react-paginate'
import { NavLink } from 'react-router-dom'
import Loader from 'src/components/common/Loader'
import ReactTable from 'src/components/common/ReactTable'
import { deleteApi, getApi, postApi, putApi } from 'src/utils/Api'
import { ALL_CONSTANTS, API_ENDPOINT } from 'src/utils/config'
import { paginationItemPerPageOptions } from 'src/utils/constant'

const AdministratorList = () => {

  const initialData = {
    search: '',
    Status: '',
    startDate: '',
    endDate: '',
    level: '',
    group: ''
  }

  const { t, i18n } = useTranslation();
  const translationObject = i18n.getDataByLanguage(i18n.language);
  const multiLang = translationObject?.translation?.AdministratorManagementList
  const [filterData, setFilterData] = useState(initialData)
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalData, setTotalDarta] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [administratorListData, setAdministratorListData] = useState([])
  const [groupData, setGroupData] = useState([])
  const [currentHistoryPage, setCurrentHistoryPage] = useState(1)
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalHistory, setTotalHistory] = useState(0)
  const [historyVisible, setHistoryVisible] = useState(false)
  const [totalHistoryPages, setTotalHistoryPages] = useState(0)
  const [searchHistoryInput, setHistorySearchInput] = useState('');
  const [searchHistoryInputValue, setSearchHistoryInputValue] = useState('')
  const [historyData, setHistoryData] = useState([])
  const [visible, setVisible] = useState(false)
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const [levelId, setLevelId] = useState('')
  const [groupId, setGroupId] = useState(null)
  const [saveModal, setSaveModal] = useState(false)
  const [cancelModal, setCancelModal] = useState(false)
  const [adminId, setAdminId] = useState(null)
  const [deleteAdmin, setDeleteAdmin] = useState(null)
  const [deleteModal, setDeleteModal] = useState(false)

  const perPageValue = [
    { label: '10', value: 10 },
    { label: '30', value: 30 },
    { label: '50', value: 50 },
    { label: '100', value: 100 }

  ]

  const vars = {
    '--my-css-var': 10,
    '--my-another-css-var': "red",
    '--cui-tooltip-max-width': '300px',
  }

  useEffect(() => {
    getGroup()
  }, [])

  useEffect(() => {
    getHistoryData(1).then((item) => {
    })
  }, [startDate, endDate, searchHistoryInputValue])

  useEffect(() => {
    getAdministratorListData()
  }, [itemsPerPage, currentPage, filterData.Status, filterData.startDate, filterData.endDate, filterData.level, filterData.group])

  useEffect(() => {
    if (filterData?.search === '') {
      getAdministratorListData()
    }
  }, [filterData.search])


  const columns = useMemo(() => [

    {
      Header: multiLang?.no,
      accessor: 'id',
      Cell: ({ row }) => {
        return (currentPage) * itemsPerPage + (row.index + 1)
      }
    },
    {
      Header: multiLang?.id,
      accessor: 'email',
      Cell: ({ row }) => <p> {row.original.email ? row.original.email : '-'}</p>
    },
    {
      Header: multiLang?.group,
      accessor: 'groupName',
      Cell: ({ row }) => <p>{row.original.groupName ? row.original.groupName : '-'}</p>
    },
    {
      Header: multiLang?.level,
      accessor: 'roleName',
      Cell: ({ row }) => <p>{row.original.roleName ? row.original.roleName : '-'}</p>
    },
    {
      Header: multiLang?.registrationDate,
      accessor: 'registeredAt',
      Cell: ({ row }) => <p>{row.original.registeredAt ? moment(row.original.registeredAt).format('YYYY-MM-DD HH:mm:ss') : '-'}</p>
    },
    {
      Header: multiLang?.action,
      // accessor: 'id',
      Cell: ({ row }) => <div className='d-flex gap-2 justify-content-center'>
        <a className='greenTxt' onClick={() => getAdminData(row.original.id)} >{multiLang?.modify}</a>
        <a className='primTxt' onClick={() => (setDeleteAdmin(row.original.authUserRoleMappingsId), setDeleteModal(true))} >{multiLang?.delete}</a>
      </div>
    }

  ], [currentPage, itemsPerPage])

  const historyColumns = useMemo(() => [
    {
      Header: multiLang?.no,
      accessor: 'Id',
      Cell: ({ row }) => {
        return (currentHistoryPage - 1) * 5 + (row.index + 1)
      }

    },
    {
      Header: multiLang?.id,
      accessor: 'email',
      Cell: ({ row }) => <p>{row.original.email ? row.original.email : '-'}</p>
    },
    {
      Header: multiLang?.comment,
      accessor: 'CommentName',
      Cell: ({ row }) => <p>{row.original.CommentName ? row.original.CommentName : '-'}</p>
    },
    {
      Header: multiLang?.modifiedDate,
      accessor: 'modifiedAt',
      Cell: ({ row }) => <p>{row.original.modifiedAt ? moment(row.original.modifiedAt).format('YYYY-MM-DD HH:mm:ss') : '-'}</p>

    },

    {
      Header: multiLang?.modifiedBy,
      accessor: 'modifiedByemail',
      Cell: ({ row }) => <p>{row.original.modifiedByemail ? row.original.modifiedByemail : '-'}</p>

    }

  ], [currentHistoryPage])

  const getHistoryData = async (currentHistoryPage) => {
    // setIsLoading(true)
    try {
      let url = API_ENDPOINT.getAdministratorHistory + `?pageNo=${currentHistoryPage}&limit=${5}`
      if (startDate) {
        url = url + `&startDate=${moment(startDate).add(1, 'd').toISOString().split('T')[0] + `T00:00:00.000Z`}`
      }
      if (endDate) {
        url = url + `&endDate=${moment(endDate).add(1, 'd').toISOString().split('T')[0] + `T23:59:59.000Z`}`
      }
      // if (searchHistoryInputValue != '') {
      //   url = url + `&filename=${searchHistoryInputValue}`
      // }

      const response = await getApi(url)
      console.log('res =>', response);
      if (response.status == 200) {
        setCurrentHistoryPage(currentHistoryPage)
        setHistoryData(response.data)
        setTotalHistory(response.totalCount)
        setTotalHistoryPages(Math.ceil(response.totalCount / Number(5)));
        // setIsLoading(false)
      }

    } catch (error) {
      // setIsLoading(false)
    }
  };

  const getAdminData = async (ids) => {
    setAdminId(ids)
    console.log('id =>', ids);
    try {
      let url = API_ENDPOINT.getAdminData + `?id=${ids}`

      const response = await getApi(url)
      console.log('res =>', response);
      if (response.status == 200) {
        setId(response.data[0].email)
        setLevelId(response.data[0].roleId == 2 ? 'Super' : 'Sub')
        setGroupId(response.data[0].groupId)
        setPassword(response.data[0].password)
        setVisible(true)
        // setIsLoading(false)
      }

    } catch (error) {
      // setIsLoading(false)
    }
  }

  const resetHistory = async () => {
    setStartDate('')
    setEndDate('')
    setSearchHistoryInputValue('')
  }

  const getGroup = async () => {
    let url = API_ENDPOINT.getGroup

    try {
      const response = await getApi(url)
      console.log('get responce =>', response);
      if (response?.status === 200) {
        setGroupData(response.data)
      }

      if (response?.status === 200) {
        const data = await response?.data?.map((op) => {
          return { 'label': op?.groupName, 'value': op?.id }

        })
        setGroupData(data)
      }
    } catch (error) {
      console.log(error)
    }
  }


  const getAdministratorListData = async () => {
    setIsLoading(true)
    try {
      let url = API_ENDPOINT.getAdministratorList + `?pageNo=${currentPage + 1}&limit=${itemsPerPage}`

      if (filterData?.search) {
        url = url + `&email=${filterData?.search}`
      }

      if (filterData?.startDate) {
        url = url + `&startDate=${filterData?.startDate}`
      }

      if (filterData?.endDate) {
        url = url + `&endDate=${filterData?.endDate}`
      }

      if (filterData?.level) {
        url = url + `&level=${filterData?.level}`
      }

      if (filterData?.group) {
        console.log('gdhdhd =>', filterData?.group);
        if (filterData?.group == 0) {
          url = url + `&groupName=All`
        }
        if (filterData?.group == 1) {
          url = url + `&groupName=HR`
        }
        if (filterData?.group == 2) {
          url = url + `&groupName=IT`
        }
      }




      const response = await getApi(url)
      console.log('data get =>', response.data);
      if (response?.status === 200) {
        setAdministratorListData(response?.data)
        setTotalDarta(response?.totalCount)
        setTotalPages(Math.ceil(response?.totalCount / Number(itemsPerPage)))
        setIsLoading(false)
      } else {
        setAdministratorListData([])
        setTotalDarta(0)
        setIsLoading(false)
      }
    } catch (error) {
      setIsLoading(false)
      console.log(error)
    }
  }


  const handleSearch = (e) => {
    const value = e.target.value
    console.log('value =>', value);
    setFilterData((prev) => {
      return {
        ...prev,
        search: value
      }
    })
  }

  const handleStartDate = (event) => {
    if (event != null) {
      const value = event.toISOString()
      console.log('val', value)
      setFilterData((prev) => {
        return {
          ...prev,
          startDate: value
        }
      })
    } else {
      setFilterData((prev) => {
        return {
          ...prev,
          startDate: ''
        }
      })
    }
  }

  const handleEndDate = (event) => {

    if (event != null) {
      const value = event.toISOString()
      console.log('val', value)
      setFilterData((prev) => {
        return {
          ...prev,
          endDate: value
        }
      })
    } else {
      setFilterData((prev) => {
        return {
          ...prev,
          endDate: ''
        }
      })
    }
  }

  const handleSelectionChange = useCallback((selectedRowsIds) => {
  }, []);

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected)
  }

  const handleLevelChange = (event) => {
    const value = event?.target?.value

    setFilterData((prev) => {
      return {
        ...prev,
        level: value,
      }
    })
  }

  const handleGroupChange = (event) => {
    const value = event?.target?.value

    setFilterData((prev) => {
      return {
        ...prev,
        group: value,
      }
    })
  }

  const handleStartDateChange = async (date) => {
    const formattedStartDate = date?.toISOString();
    setStartDate(formattedStartDate);

  };

  const handleEndDateChange = async (date) => {

    const formattedEndDate = date?.toISOString();
    setEndDate(formattedEndDate);

  };

  const handleHistoryPageChange = (selectedPage) => {
    getHistoryData(selectedPage.selected + 1)

  }

  const handleHistoryInputChange = (event) => {
    if (event.target.value == '') {
      setSearchHistoryInputValue('')
    }
    setHistorySearchInput(event.target.value)
  }

  const handleHistoryInputvalue = (event) => {
    setSearchHistoryInputValue(searchHistoryInput)
  }

  const validateID = async (id) => {
    const validFormat = /^[a-z0-9]{4,12}$/;
    const forbiddenWords = /(admin|sub|super|master)/;

    if (!validFormat.test(id)) {
      return "ID must be 4 to 12 lowercase letters and numbers.";
    } else if (forbiddenWords.test(id)) {
      return "ID cannot contain 'admin', 'sub', 'super', or 'master'.";
    }

    return "";
  }

  const validate = async () => {
    console.log('pass word =>', password);
    if (id === '') {
      enqueueSnackbar('Please enter Id', { variant: 'error' })
      return
    }

    // validateID(id).then((test) => {
    // if (test != '') {
    //   enqueueSnackbar(test, { variant: 'error' })
    //   return
    // }

    else if (password === '') {
      enqueueSnackbar('Please enter password', { variant: 'error' })
      return
    } else if (levelId === '') {
      enqueueSnackbar('Please select level', { variant: 'error' })
      return
    } else if (levelId == 'Select') {
      enqueueSnackbar('Please select level', { variant: 'error' })
      return
    } else if (groupId === null) {
      enqueueSnackbar('Please select Group', { variant: 'error' })
    } else if (groupId == 0) {
      enqueueSnackbar('Please select Group', { variant: 'error' })
    } else {
      setSaveModal(true)
    }
    // })
  }

  const adminAccountRegistration = async () => {
    setIsLoading(true)
    const data = {
      username: id,
      password: password,
      groupId: groupId
    }

    data['roleId'] = levelId === 'Super' ? 2 : 3

    let res;
    if (adminId) {
      data['comment'] = 'Test'
      res = await putApi(API_ENDPOINT.updateAdmin, data)
    } else {
      res = await postApi(API_ENDPOINT.createAdmin, data)
    }

    console.log('testrt =>', res);

    if (res.status === 200) {
      if (adminId) {
        enqueueSnackbar('Update successfully', { variant: 'success' })
      } else {
        enqueueSnackbar('Create successfully', { variant: 'success' })
      }
      resetValues()
      setIsLoading(false)
      getAdministratorListData()
      setAdminId(null)
    } else {
      resetValues()
      setIsLoading(false)
      getAdministratorListData()
      setAdminId(null)
    }
  }

  const resetValues = async () => {
    setId('');
    setPassword('');
    setGroupId(null);
    setLevelId('');
    setSaveModal(false)
    setCancelModal(false)
    setVisible(false)
    setAdminId(null)

  }


  const deleteAdminData = async (deleteAdmin) => {
    console.log('delete admin =>', deleteAdmin);
    try {
      let url = API_ENDPOINT.deleteAdminuser
      const response = await deleteApi(url, `?roleMappingId=${deleteAdmin}`)
      console.log('test new =>', response);
      if (response?.status === 200) {
        // setUserInfoPopup(true)
        enqueueSnackbar('Delete succefully', { variant: 'success' })
        setDeleteModal(false)
        setDeleteAdmin(null)
        await getAdministratorListData()
      }
    } catch (error) {
      enqueueSnackbar('Something Went Wrong', { variant: 'error' })
      console.log(error)
    }
  }

  return (
    <div className='mb-5'>
      {isLoading && <Loader />}
      <main>
      <div className="pageTitle mb-3 pb-2 d-flex justify-content-between align-items-center">
            <h2>{multiLang?.administratorList}</h2>
            <NavLink><CButton onClick={() => setVisible(!visible)} className='btn-success'>{multiLang?.create}</CButton></NavLink>
          </div>

        <div className="d-flex p-4  flex-column bg-light  mt-3">
          <div className="d-flex justify-content-between align-items-center w-100">
            <div className='d-flex'>
              <div className="d-flex align-items-center me-5">
                <label className="me-3 fw-medium">{multiLang?.level}</label>
                <CFormSelect
                  className="me-2"
                  aria-label="Default select example"
                  options={[
                    { label: multiLang?.all, value: 'All' },
                    { label: multiLang?.super, value: 'Super' },
                    { label: multiLang?.Sub, value: 'Sub' }
                  ]}
                  onChange={handleLevelChange}
                  value={filterData.level}
                />

              </div>
              <div className="d-flex align-items-center me-5">
                <label className="me-3 fw-medium">{multiLang?.group}</label>
                <CFormSelect
                  className="me-2"
                  aria-label="Default select example"
                  options={groupData.length > 0 ? [{ label: multiLang?.all, value: 0 }, ...groupData] : [{ label: multiLang?.all, value: 0 }]}
                  onChange={handleGroupChange}
                  value={filterData.group}
                />

              </div>
            </div>
            <div className="d-flex align-items-center">
              <label className="me-3 fw-medium">{multiLang?.registrationDate}</label>
              <div className="d-flex p-2 gap-3">
                <DatePicker value={filterData.startDate} onChange={handleStartDate} />
                <DatePicker value={filterData.endDate} onChange={handleEndDate} />
              </div>
            </div>
          </div>
          <div className="d-flex align-items-center">
            <label className="me-3 fw-medium">{multiLang?.id}</label>
            {/* <div className='d-flex w-50'>
              <input className='form-control me-3' placeholder={multiLang?.search} value={filterData.search} onChange={handleSearch} />
              <CButton >{multiLang?.search}</CButton>
            </div> */}
            <div className="d-flex form-inline w-50">
              <input className="form-control mr-sm-10 me-2" value={filterData.search} onChange={handleSearch} type="search" placeholder={multiLang?.search} aria-label="Search" />
              <button className="btn btn-primary my-2 my-sm-0" disabled={filterData.search == ''} type="submit" onClick={getAdministratorListData}>{multiLang?.search}</button>
            </div>
          </div>

        </div>
        <div className='mt-4 mb-2'>
          <label className="me-3 fw-medium">{multiLang?.total} {totalData}</label>
        </div>
        <ReactTable showCheckbox={false} columns={columns} data={administratorListData} totalCount={10} onSelectionChange={handleSelectionChange} />

        {administratorListData.length > 0 &&
          <div className='d-flex w-100 justify-content-center gap-3 mt-4'>
            <div className='d-flex gap-3'>
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
                    pageRangeDisplayed={4}
                  />
                </div>

              </div>
              <div className='d-flex align-items-center gap-2'>
                <label>{multiLang?.show}</label>
                <CFormSelect
                  className=''
                  aria-label=""
                  value={itemsPerPage}
                  options={perPageValue}
                  onChange={(event) => {
                    setItemsPerPage(parseInt(event?.target?.value));
                    setCurrentPage(0)
                  }}
                />
                <label>{multiLang?.LiveManagement?.Lists}</label>
              </div>
            </div>
          </div>
        }

        <div>
          <CButton className='btn btn-success mb-3' onClick={() => { setHistoryVisible(!historyVisible); getHistoryData(1) }}>{multiLang?.history}</CButton>
        </div>
        <div>
          <CModal
            backdrop="static"
            alignment="center"
            size="lg"
            visible={historyVisible}
            onClose={() => (setHistoryVisible(false), resetHistory())}
            aria-labelledby="LiveDemoExampleLabel">
            <CModalHeader onClose={() => setHistoryVisible(false)}>
              <CModalTitle>{multiLang?.history}</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <div className='d-flex w-100 gap-3 mb-3 justify-content-between align-items-center'>
                <p>{multiLang?.total}: {totalHistory} </p>
                <div className='d-flex gap-3'>
                  <DatePicker value={startDate} onChange={handleStartDateChange} />
                  <DatePicker value={endDate} onChange={handleEndDateChange} />
                </div>
                <div>
                  <div className="d-flex form-inline w-100">
                    <input className="form-control mr-sm-10 me-2" onChange={handleHistoryInputChange} type="search" placeholder={multiLang?.search} aria-label="Search" />
                    <button className="btn btn-primary my-2 my-sm-0" disabled={searchHistoryInput == ''} type="submit" onClick={() => { handleHistoryInputvalue() }}>{multiLang?.search}</button>
                  </div>
                </div>
              </div>
              <div>
                <ReactTable showCheckbox={false} columns={historyColumns} data={historyData} totalCount={10} onSelectionChange={handleSelectionChange} />

                <div className='mt-3'>
                  {historyData.length > 0 &&
                    <div className='userlist-pagination'>
                      <div className='userlist-pagination dataTables_paginate'>
                        <ReactPaginate
                          breakLabel={'...'}
                          marginPagesDisplayed={1}
                          previousLabel={<button>{multiLang?.previous}</button>}
                          nextLabel={<button>{multiLang?.next}</button>}
                          pageCount={totalHistoryPages}
                          onPageChange={handleHistoryPageChange}
                          forcePage={currentHistoryPage - 1}
                          renderOnZeroPageCount={null}
                          pageRangeDisplayed={1}
                        />
                      </div>
                    </div>
                  }
                </div>

              </div>
            </CModalBody>
            {/* <CModalFooter>
                <CButton color="secondary">Close</CButton>
                <CButton color="primary">Save changes</CButton>
              </CModalFooter> */}
          </CModal>
        </div>

        <div>
          <CModal
            backdrop="static"
            visible={visible}
            onClose={() => setVisible(false)}
            aria-labelledby="StaticBackdropExampleLabel"
          >
            <CModalHeader>
              <CModalTitle id="StaticBackdropExampleLabel">{multiLang?.AdminRegistrationTitle}</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <div className="card-body">
                <div className="formWraper">
                  <div className="form-outline form-white  d-flex ">
                    <div className="formWrpLabel">
                      <label className="fw-bolder ">
                        {multiLang?.id}
                        <CTooltip style={vars}
                          content={multiLang?.idInfo}
                          placement="bottom"
                        >
                          <CIcon icon={cilInfo} size="lg" />
                        </CTooltip>
                      </label>
                    </div>
                    <div className="formWrpInpt">
                      <div className="d-flex formradiogroup mb-2 gap-3">
                        <CFormInput
                          type="text"
                          placeholder={multiLang?.id}
                          name="title"
                          value={id}
                          onChange={(e) => setId(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-outline form-white  d-flex ">
                    <div className="formWrpLabel">
                      <label className="fw-bolder ">
                        {multiLang?.password}
                      </label>
                    </div>
                    <div className="formWrpInpt">
                      <div className="d-flex formradiogroup mb-2 gap-3">
                        <CFormInput
                          type="password"
                          placeholder={multiLang?.password}
                          name="title"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-outline form-white  d-flex ">
                    <div className="formWrpLabel">
                      <label className="fw-bolder ">
                        {multiLang?.level}
                      </label>
                    </div>
                    <div className="formWrpInpt">
                      <div className="d-flex formradiogroup mb-2 gap-3">
                        <CFormSelect
                          className="me-2"
                          options={[
                            { label: multiLang?.select, value: 'Select' },
                            { label: multiLang?.super, value: 'Super' },
                            { label: multiLang?.Sub, value: 'Sub' }
                          ]}
                          value={levelId}
                          onChange={(e) => setLevelId(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-outline form-white  d-flex ">
                    <div className="formWrpLabel">
                      <label className="fw-bolder ">
                        {multiLang?.group}
                      </label>
                    </div>
                    <div className="formWrpInpt">
                      <div className="d-flex formradiogroup mb-2 gap-3">
                        <CFormSelect
                          className="me-2"
                          aria-label="Default select example"
                          options={[{ label: multiLang?.select, value: 0 }, ...groupData]}
                          value={groupId}
                          onChange={(e) => setGroupId(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>


                </div>
              </div>
            </CModalBody>
            <CModalFooter className='d-flex justify-content-center'>
              <CButton className='btn-black' onClick={() => setCancelModal(true)}>
                {multiLang?.cancel}
              </CButton>
              <CButton disabled={id === '' || password === ''} onClick={() => validate()} >{multiLang?.save}</CButton>
            </CModalFooter>
          </CModal>
        </div>

        <div>
          <CModal
            backdrop="static"
            visible={saveModal}
            onClose={() => setSaveModal(false)}
            aria-labelledby="StaticBackdropExampleLabel"
          >
            <CModalHeader>
              <CModalTitle id="StaticBackdropExampleLabel">{multiLang?.save}</CModalTitle>
            </CModalHeader>
            <CModalBody>
              {multiLang?.saveMsg}
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={() => setSaveModal(false)}>
                {multiLang?.no}
              </CButton>
              <CButton onClick={() => adminAccountRegistration()} color="primary">{multiLang?.yes}</CButton>
            </CModalFooter>
          </CModal>
        </div>

        <div>
          <CModal
            backdrop="static"
            visible={cancelModal}
            onClose={() => setCancelModal(false)}
            aria-labelledby="StaticBackdropExampleLabel"
          >
            <CModalHeader>
              <CModalTitle id="StaticBackdropExampleLabel">{multiLang?.cancel}</CModalTitle>
            </CModalHeader>
            <CModalBody>
              {multiLang?.cancelMsg}
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={() => setCancelModal(false)}>
                {multiLang?.no}
              </CButton>
              <CButton onClick={() => resetValues()} color="primary">{multiLang?.yes}</CButton>
            </CModalFooter>
          </CModal>
        </div>

        <div>
          <CModal
            backdrop="static"
            visible={deleteModal}
            onClose={() => (setDeleteAdmin(null), setDeleteModal(false))}
            aria-labelledby="StaticBackdropExampleLabel"
          >
            <CModalHeader>
              <CModalTitle id="StaticBackdropExampleLabel">{multiLang?.delete}</CModalTitle>
            </CModalHeader>
            <CModalBody>
              {multiLang?.deletMsg}
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={() => (setDeleteAdmin(null), setDeleteModal(false))}>
                {multiLang?.no}
              </CButton>
              <CButton onClick={() => deleteAdminData(deleteAdmin)} color="primary">{multiLang?.yes}</CButton>
            </CModalFooter>
          </CModal>
        </div>

      </main >
    </div >
  )
}

export default AdministratorList

