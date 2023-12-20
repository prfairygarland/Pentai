import { CButton, CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle, CFormCheck, CFormInput, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CSpinner } from '@coreui/react'
import axios from 'axios'
import React, { useEffect, useMemo, useState, useCallback } from 'react'
import ReactPaginate from 'react-paginate'
import { useTable } from 'react-table'
import ReactTable from 'src/components/common/ReactTable'
import { getCompaniesMasterData, getDivisionMasterData, getGroupMasterData, getImportHistory, getTeamMasterData, getUserList, getUserListExportData, orgImportApi, userImportApi } from 'src/utils/Api'
import DatePicker from 'react-date-picker'
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import { Link } from 'react-router-dom'
import * as XLSX from 'xlsx';




const UserList = () => {

  const [userListData, setUserListData] = useState([])
  const [importHistoryData, setImportHistoryData] = useState([])
  const [totalUser, setTotalUser] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const [searchInputValue, setSearchInputValue] = useState('')
  const [searchImportInput, setImportSearchInput] = useState('');
  const [searchImportInputValue, setSearchImportInputValue] = useState('')
  const [statusSelectedValue, setStatusSelectedValue] = useState({ id: 1, Name: 'Active' })
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [isLeader, setIsLeader] = useState()
  const [companiesData, setCompaniesData] = useState([])
  const [divisionData, setDivisionData] = useState([])
  const [groupData, setGroupData] = useState([])
  const [TeamData, setTeamData] = useState([])
  const [selectCompany, setSelectCompany] = useState({});
  const [selectDivision, setSelectDivision] = useState({});
  const [selectGroup, setSelectGroup] = useState({});
  const [selectTeam, setSelectTeam] = useState({});
  const [typeSelect, setTypeSelect] = useState({});
  const [searchInput, setSearchInput] = useState('');
  const [dataIds, setDataIds] = useState(null);
  const [importVisible, setImportVisible] = useState(false)
  const [userImportVisible, setUserImportVisible] = useState(false)
  const [orgImportVisible, setOrgImportVisible] = useState(false)
  const [fileFormat, checkFileFormat] = useState(false)
  const [userFileFormat, checkUserFileFormat] = useState(false)
  const [fileSize, checkFileSize] = useState(false)
  const [exportSelectid, checkExportSelectid] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');




  const statusDropdownValues = [{ id: 2, Name: 'All' }, { id: 1, Name: 'Active' }, { id: 0, Name: 'Inactive' }];
  const textDropdownValues = [{ id: 1, Name: 'Employee No', type: 'employeeNo' }, { id: 2, Name: 'Korean Name', type: 'koreanName' }, { id: 3, Name: 'English Name', type: 'englishName' }, { id: 4, Name: 'E-mail', type: 'email' }];
  const perPageValue = [5, 10, 20, 30]

  const columns = useMemo(() => [
    {
      Header: 'No',
      accessor: 'Id',
      Cell: ({ row }) =>
      {
        return currentPage * itemsPerPage + (row.index + 1)
      }

    },
    {
      Header: 'Employee No.',
      accessor: 'employeeCode'
    },
    {
      Header: 'Name',
      accessor: 'koreanName'
    },
    {
      Header: 'English Name',
      accessor: 'englishName',
      Cell: ({ row }) => <Link to={`/UserDetails/${row.original.id}`}>{row.original.englishName}</Link>
    },
    {
      Header: 'E-mail',
      accessor: 'Email'
    },
    {
      Header: 'Job Title',
      accessor: 'jobTitle'
    },
    {
      Header: 'Company',
      accessor: 'companiesName'
    },
    {
      Header: 'Division',
      accessor: 'divisionName'
    },
    {
      Header: 'Group',
      accessor: 'groupName'
    },
    {
      Header: 'Team',
      accessor: 'TeamName'
    },
    {
      Header: 'Status',
      accessor: 'Status',
      Cell: ({ row }) => <p>{row.original.Status == 1 ? 'Active' : 'Inactive'}</p>
    },

  ], [currentPage, itemsPerPage])

  const importHistoryColumns = useMemo(() => [
    {
      Header: 'No',
      accessor: 'Id',
      Cell: ({ row }) =>
        currentPage > 0
          ? currentPage * itemsPerPage + (parseInt(row.id) + 1)
          : parseInt(row.id) + 1

    },
    {
      Header: 'File Name',
      accessor: 'filename'
    },
    {
      Header: 'Imported on',
      accessor: 'importDate'
    },
    {
      Header: 'Imported by',
      accessor: 'adminUsername',
    },
    {
      Header: 'Total Records',
      accessor: 'importedUsersCount'
    },
    {
      Header: 'Action',
      Cell: ({ row }) => <CButton className='btn btn-light w-100' onClick={() => undo(row.original)}>undo</CButton>

    }

  ], [])

  useEffect(() => {
    getUserListData().then((item) => {
    })
  }, [isLeader, itemsPerPage, currentPage, selectCompany, selectDivision, selectGroup, selectTeam, searchInputValue, statusSelectedValue])


  useEffect(() => {
    getCompaniesData();
  }, [])

  useEffect(() => {
    getImportHistoryData().then((item) => {
    })
  }, [importVisible, startDate, endDate, searchImportInputValue])

  const undo = () => {
    console.log('undo');
  }

  const handleStartDateChange = async (date) => {
    // console.log('startDate =>', date);
    const formattedStartDate = date?.toISOString();
    setStartDate(formattedStartDate);

  };

  const handleEndDateChange = async (date) => {

    const formattedEndDate = date?.toISOString();
    setEndDate(formattedEndDate);

  };
  console.log('startDate =>', startDate);
  console.log('endDate =>', endDate)
  // file upload
  const handleFileSelect = (e) => {
    setSelectedFile(null)
    checkFileFormat(false)
    checkUserFileFormat(false)
    checkFileSize(false)
    const file = e.target.files[0];

    const maxSize = 5 * 1024 * 1024; // 5 MB in bytes
    if (file && file.size > maxSize) {
      // alert('File size exceeds the maximum limit of 5 MB. Please choose a smaller file.');
      checkFileSize(true)
      e.target.value = null; // Clear the file input
      setSelectedFile(null);
    } else {
      checkFileSize(false)
      setSelectedFile(file);
    }
    // setSelectedFile(file);
  };

  const handleOrgUpload = () => {
    if (selectedFile) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const arrayBuffer = event.target.result;
        const data = new Uint8Array(arrayBuffer);

        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];


        const headers = XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0];

        console.log('Actual Column Headers:', headers);

        const expectedHeaders = ['srNo', 'username', 'password', 'roleName', 'division', 'company'];
        const isValidHeaders = expectedHeaders.every(expectedHeader =>
          headers.includes(expectedHeader)
        );
        if (isValidHeaders) {

          console.log('correct')
          // Upload logic
          const formData = new FormData();
          formData.append('attachments', selectedFile);
          orgImportApi(formData).then(response => response)
            .then(data => {
              console.log('Upload successful:', data);
              if (data.status == 200) {
                setOrgImportVisible(false)
              }
            })
            .catch(error => {
              console.error('Upload failed:', error);
            });
        } else {
          console.log('correct wrong')
          checkFileFormat(true)

        }
      };

      reader.readAsArrayBuffer(selectedFile);
    }

  };

  const handleUploadUserImport = () => {
    if (selectedFile) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const arrayBuffer = event.target.result;
        const data = new Uint8Array(arrayBuffer);

        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];


        const headers = XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0];

        console.log('Actual Column Headers:', headers);

        const expectedHeaders = ['srNo', 'username', 'password', 'roleName', 'division', 'company'];
        const isValidHeaders = expectedHeaders.every(expectedHeader =>
          headers.includes(expectedHeader)
        );
        if (isValidHeaders) {

          console.log('correct')
          // Upload logic
          const formData = new FormData();
          formData.append('attachments', selectedFile);
          userImportApi(formData).then(response => response)
            .then(data => {
              console.log('Upload successful:', data);
            })
            .catch(error => {
              console.error('Upload failed:', error);
            });
        } else {
          console.log('correct wrong')
          checkUserFileFormat(true)
        }
      };

      reader.readAsArrayBuffer(selectedFile);
    }

  };


  const getUserListData = async () => {
    try {
      let url = `https://ptkapi.experiencecommerce.com/api/adminPanel/userList?pageNo=${currentPage + 1
        }&limit=${itemsPerPage}&status=${statusSelectedValue.id}`;

      if (selectCompany.id) {
        url = url + `&company=${selectCompany.id}`
      }
      if (selectDivision.id) {
        url = url + `&division=${selectDivision.id}`
      }
      if (selectGroup.id) {
        url = url + `&group=${selectGroup.id}`
      }
      if (selectTeam.id) {
        url = url + `&team=${selectTeam.id}`
      }
      if (isLeader == true) {
        url = url + `&isLeader=${isLeader}`;
      }

      if (typeSelect.id && searchInput != '') {
        url = url + `&searchId=${typeSelect.id}&${typeSelect.type}=${searchInput}`;
      }

      const res = await getUserList(url);
      if (res.status == 200) {
        setUserListData(res.data)
        setTotalUser(res.totalUser)
        setTotalPages(Math.ceil(res.totalUser / Number(itemsPerPage)));
      }

    } catch (error) {
      console.log(error);
    }
  };

  // http://192.168.9.175:3000
  // https://ptkapi.experiencecommerce.com
  const getUserListExport = async () => {
    let url = `http://192.168.9.175:3000/api/adminPanel/userListExport?pageNo=${currentPage + 1
      }&limit=${itemsPerPage}&status=${statusSelectedValue.id}`;

    if (selectCompany.id) {
      url = url + `&company=${selectCompany.id}`
    }
    if (selectDivision.id) {
      url = url + `&division=${selectDivision.id}`
    }
    if (selectGroup.id) {
      url = url + `&group=${selectGroup.id}`
    }
    if (selectTeam.id) {
      url = url + `&team=${selectTeam.id}`
    }
    if (isLeader == true) {
      url = url + `&isLeader=${isLeader}`;
    }

    if (typeSelect.id && searchInput != '') {
      url = url + `&searchId=${typeSelect.id}&${typeSelect.type}=${searchInput}`;
    }

    console.log('dataIds =>', dataIds);

    if (dataIds.length > 0) {
      url = url + `&exportId=${JSON.stringify(dataIds)}`;
    }


    console.log('url check =>', url);

    const res = await getUserListExportData(url)
    console.log('res =>', res);

    if (res.downloadLink) {
      const downloadLink = res.downloadLink;
      const link = document.createElement('a');
      link.href = 'https://ptkapi.experiencecommerce.com/' + downloadLink;
      link.setAttribute('download', `exported_data_${new Date().getTime()}.xlsx`);

      link.click();
      checkExportSelectid(false)

    } else {
      checkExportSelectid(false)
      console.log('No data found');
    }
  }

  const getCompaniesData = async () => {
    try {
      let url = `https://ptkapi.experiencecommerce.com/api/adminPanel/getCompanies`
      const res = await getCompaniesMasterData(url);
      if (res.status == 200) {
        setCompaniesData(res.data)
      }
    } catch (error) {
      console.log('error getCompaniesData =>', error);
    }
  }

  const getDivisionData = async (id) => {
    try {
      let url = `https://ptkapi.experiencecommerce.com/api/adminPanel/getDivision?id=${id}`
      const res = await getDivisionMasterData(url);
      if (res.status == 200) {
        setDivisionData(res.data)
      }
    } catch (error) {
      console.log('error getCompaniesData =>', error);
    }
  }

  const getGroupData = async (id) => {
    try {
      let url = `https://ptkapi.experiencecommerce.com/api/adminPanel/getGroup?id=${id}`
      const res = await getGroupMasterData(url);
      if (res.status == 200) {
        setGroupData(res.data)
      }
    } catch (error) {
      console.log('error getCompaniesData =>', error);
    }

  }

  const getTeamData = async (id) => {
    try {
      let url = `https://ptkapi.experiencecommerce.com/api/adminPanel/getTeam?groupId=${id}`
      const res = await getTeamMasterData(url);
      if (res.status == 200) {
        setTeamData(res.data)
      }
    } catch (error) {
      console.log('error getCompaniesData =>', error);
    }

  }

  const getImportHistoryData = async () => {
    try {
      let url = `https://ptkapi.experiencecommerce.com/api/adminPanel/importModifiedHistory?pageNo=${currentPage + 1
        }`;
      console.log('start date =>', startDate);
      if (startDate) {
        url = url + `&startDate=${startDate}`
      }
      if (endDate) {
        url = url + `&endDate=${endDate}`
      }
      if (searchImportInputValue != '') {
        url = url + `&filename=${searchImportInputValue}`
      }

      const res = await getImportHistory(url);
      if (res.status == 200) {
        setImportHistoryData(res.data)
        // setTotalUser(res.totalUser)
        // setTotalPages(Math.ceil(res.totalUser / Number(itemsPerPage)));
      }

    } catch (error) {
      console.log(error);
    }
  };


  const statushandleSelect = (value) => {
    setStatusSelectedValue(value);
  };


  const perPagehandleSelect = (value) => {
    setItemsPerPage(value);
    setCurrentPage(0)
  };



  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected)
  }

  const handleCheckboxChange = (event) => {
    setIsLeader(event.target.checked)
  }

  const handleInputChange = (event) => {
    if (event.target.value == '') {
      setSearchInputValue('')
    }
    setSearchInput(event.target.value)
  }

  const handleInputvalue = (event) => {
    setSearchInputValue(searchInput)

  }

  const handleImportInputChange = (event) => {
    if (event.target.value == '') {
      setSearchImportInputValue('')
    }
    setImportSearchInput(event.target.value)
  }

  const handleImportInputvalue = (event) => {
    setSearchImportInputValue(searchImportInput)
    console.log('searchImportInput =>', searchImportInput);
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
    setDataIds(getIds)

  }, []);

  const resetFilter = () => {
    console.log('hello');
    setSelectCompany({});
    setSelectDivision({});
    setSelectGroup({});
    setSelectTeam({});
    setIsLeader('');
    setTypeSelect({});
    setSearchInput('');
    setSearchInputValue('');
  }

  // setSelectCompany({});
  // setSelectDivision({});
  // setSelectGroup({});
  // setSelectTeam({});
  // setIsLeader('');
  // setTypeSelect({});
  // setSearchInput('');
  // setSearchInputValue('');
  // getUserListData()

  return (
    <div>
      <div className='container bg-light p-3 mb-3'>
        <div className='d-flex mb-3'>
          <div className='me-5'>
            <label className='me-3'>Status</label>
            <CDropdown className='dropDownbackground drpBtn'>
              <CDropdownToggle color="white" >
                {statusSelectedValue.Name ? statusSelectedValue.Name : 'Active'}
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
            <label className='me-3'>Department</label>
            <CDropdown className='dropDownbackground me-3 drpBtn' >
              <CDropdownToggle color="white">{selectCompany.companyName ? selectCompany.companyName : 'company'}</CDropdownToggle>
              <CDropdownMenu>
                {companiesData.map((option, index) => (
                  <CDropdownItem role="button" key={index} onClick={() => { getDivisionData(option.id); setSelectCompany(option) }}>
                    {option.companyName}
                  </CDropdownItem>
                ))}
              </CDropdownMenu>
            </CDropdown>
            <CDropdown className={divisionData.length > 0 ? 'dropDownbackground me-3 drpBtn' : 'dropDownbackground me-3 drpBtn disable-class'} >
              <CDropdownToggle color="white">{selectDivision.DivisionsName ? selectDivision.DivisionsName : 'division'}</CDropdownToggle>

              <CDropdownMenu >
                {divisionData.length > 0 && divisionData?.map((option, index) => (
                  <CDropdownItem role="button" key={index} onClick={() => { getGroupData(option.id); setSelectDivision(option) }}>
                    {option.DivisionsName}
                  </CDropdownItem>
                ))}
              </CDropdownMenu>
            </CDropdown>
            <CDropdown className={groupData.length > 0 ? 'dropDownbackground me-3 drpBtn' : 'dropDownbackground me-3 drpBtn disable-class'}>
              <CDropdownToggle color="white">{selectGroup.groupName ? selectGroup.groupName : 'group'}</CDropdownToggle>
              <CDropdownMenu>
                {groupData.map((option, index) => (
                  <CDropdownItem role="button" key={index} onClick={() => { getTeamData(option.id); setSelectGroup(option) }}>
                    {option.groupName}
                  </CDropdownItem>
                ))}
              </CDropdownMenu>
            </CDropdown>
            <CDropdown className={TeamData.length > 0 ? 'dropDownbackground me-4 drpBtn' : 'dropDownbackground me-4 drpBtn disable-class'}>
              <CDropdownToggle color="white">{selectTeam.teamName ? selectTeam.teamName : 'team'}</CDropdownToggle>
              <CDropdownMenu>
                {TeamData.map((option, index) => (
                  <CDropdownItem role="button" key={index} onClick={() => setSelectTeam(option)} >
                    {option.teamName}
                  </CDropdownItem>
                ))}
              </CDropdownMenu>
            </CDropdown>
            <CFormCheck reverse id="reverseCheckbox1" checked={isLeader} onChange={handleCheckboxChange} label="Leader only" />
          </div>

        </div>
        <div className='d-flex justify-content-between align-items-center'>
          <div className='me-3'>
            <CDropdown className='dropDownbackground drpDBtn'>
              <CDropdownToggle color="white" >
                {typeSelect.Name ? typeSelect.Name : 'Type'}
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
          <div className="navbar navbar-light bg-light w-100">
            <div className="d-flex form-inline w-100">
              <input className="form-control mr-sm-10 me-2" onChange={handleInputChange} type="search" placeholder="Search" aria-label="Search" />
              <button className="btn btn-primary my-2 my-sm-0" disabled={!typeSelect.id || searchInput == ''} type="submit" onClick={() => { handleInputvalue() }}>Search</button>
            </div>
          </div>
        </div>
        <div className='mt-3'>
          <CButton className='btn btn-primary' onClick={() => resetFilter()}>Reset filters</CButton>
        </div>
      </div>
      <div>
        <div className='d-flex justify-content-between align-items-center mb-3'>
          <p style={{ margin: 0 }}>Total:{totalUser}</p>
          <div>

            <button className='btn btn-light  me-3' onClick={() => setUserImportVisible(!userImportVisible)} >User Import</button>
            <CModal
              alignment="center"
              visible={userImportVisible}
              onClose={() => setUserImportVisible(false)}
              aria-labelledby="LiveDemoExampleLabel">
              <CModalHeader onClose={() => setUserImportVisible(false)}>
                <CModalTitle>Excel File Upload</CModalTitle>
              </CModalHeader>
              <CModalBody>
                <div className='d-flex w-100 gap-3 justify-content-end p-3'>
                  <input type="file"
                    onChange={handleFileSelect}
                    multiple
                    accept=".xlsx, .xls" />
                  <CButton onClick={handleUploadUserImport} disabled={!selectedFile}>Upload</CButton>
                </div>
                {userFileFormat && <p className='text-danger text-center'>Please add the correct header</p>}
                {fileSize && <p className='text-danger text-center'>File size is not more 5 mb</p>}



              </CModalBody>
            </CModal>
            <button className='btn btn-light  me-3' onClick={() => setOrgImportVisible(!orgImportVisible)}>Org Import</button>
            <CModal
              alignment="center"
              visible={orgImportVisible}
              onClose={() => setOrgImportVisible(false)}
              aria-labelledby="LiveDemoExampleLabel">
              <CModalHeader onClose={() => setOrgImportVisible(false)}>
                <CModalTitle>Excel File Upload</CModalTitle>
              </CModalHeader>
              <CModalBody>
                <div className='d-flex w-100 gap-3 justify-content-end p-3'>
                  <input type="file"
                    onChange={handleFileSelect}
                    multiple
                    accept=".xlsx, .xls" />
                  <CButton onClick={handleOrgUpload} disabled={!selectedFile}>Upload</CButton>
                </div>
                {fileFormat && <p className='text-danger text-center'>Please add the correct header</p>}
                {fileSize && <p className='text-danger text-center'>File size is not more 5 mb</p>}

              </CModalBody>
            </CModal>

            <button className='btn btn-light  me-3' onClick={() => checkExportSelectid(!exportSelectid)}>Export</button>
            <CModal
              alignment="center"
              visible={exportSelectid}
              onClose={() => checkExportSelectid(false)}
              aria-labelledby="LiveDemoExampleLabel">
              <CModalHeader onClose={() => checkExportSelectid(false)}>
                <CModalTitle>Export Data</CModalTitle>
              </CModalHeader>
              <CModalBody>
                {dataIds?.length > 0 ? <p>Are you sure to export the selected user data?</p> : <p>Are you sure to export all user data?</p>}

                <div className='d-flex justify-content-end'>
                  <CButton onClick={() => getUserListExport()} >Export</CButton>
                </div>
                {fileFormat && <p className='text-danger text-center'>Please add the correct header</p>}

              </CModalBody>
            </CModal>
            <CDropdown className='dropDownbackground drpDBtn align-items-center'>
              <label>Show</label>
              <CDropdownToggle color="white" className='w-25'>{itemsPerPage}</CDropdownToggle>
              <CDropdownMenu>
                {perPageValue.map((option, index) => (
                  <CDropdownItem role="button" key={index} onClick={() => perPagehandleSelect(option)}>
                    {option}
                  </CDropdownItem>
                ))}
              </CDropdownMenu>
              <label>Lists</label>
            </CDropdown>
          </div>
        </div>
      </div>
      <div>

        <ReactTable columns={columns} data={userListData} totalCount={10} onSelectionChange={handleSelectionChange} />
        <div>
          {userListData.length > 0 &&
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
                  pageRangeDisplayed={1}
                />
              </div>
            </div>
          }

          <div>
            <button className='btn btn-success mb-3' onClick={() => { setImportVisible(!importVisible); getImportHistoryData() }}>Import History</button>
          </div>
          <div>
            <CModal
              alignment="center"
              size="lg"
              visible={importVisible}
              onClose={() => setImportVisible(false)}
              aria-labelledby="LiveDemoExampleLabel">
              <CModalHeader onClose={() => setImportVisible(false)}>
                <CModalTitle>Import History</CModalTitle>
              </CModalHeader>
              <CModalBody>
                <div className='d-flex w-100 gap-3 justify-content-end'>
                  <p>Total: </p>
                  <div className='d-flex p-2 gap-3'>
                    <DatePicker value={startDate} onChange={handleStartDateChange} />
                    <DatePicker value={endDate} onChange={handleEndDateChange} />
                  </div>
                  <div>
                    <div className="d-flex form-inline w-100">
                      <input className="form-control mr-sm-10 me-2" onChange={handleImportInputChange} type="search" placeholder="Search" aria-label="Search" />
                      <button className="btn btn-primary my-2 my-sm-0" disabled={searchImportInput == ''} type="submit" onClick={() => { handleImportInputvalue() }}>Search</button>
                    </div>
                  </div>
                </div>
                <div>
                  <ReactTable showCheckbox={false} columns={importHistoryColumns} data={importHistoryData} totalCount={10} onSelectionChange={handleSelectionChange} />
                  {importHistoryData.length > 0 &&
                    <div className='userlist-pagination'>
                      {/* <div className='userlist-pagination dataTables_paginate'>
                        <ReactPaginate
                          breakLabel={'...'}
                          marginPagesDisplayed={1}
                          previousLabel={<button>Previous</button>}
                          nextLabel={<button>Next</button>}
                          pageCount={totalPages}
                          onPageChange={handlePageChange}
                          forcePage={currentPage}
                          renderOnZeroPageCount={null}
                          pageRangeDisplayed={1}
                        />
                      </div> */}
                    </div>
                  }

                </div>
              </CModalBody>
              {/* <CModalFooter>
                <CButton color="secondary">Close</CButton>
                <CButton color="primary">Save changes</CButton>
              </CModalFooter> */}
            </CModal>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserList
