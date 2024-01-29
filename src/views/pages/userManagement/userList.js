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
import { Link, useNavigate } from 'react-router-dom'
import * as XLSX from 'xlsx';
import moment from 'moment'
import Loader from 'src/components/common/Loader'
import { enqueueSnackbar } from 'notistack'
import { useTranslation } from 'react-i18next'




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
  const [currentImportHistoryPage, setCurrentImportHistoryPage] = useState(1)
  const [totalImport, setTotalImport] = useState(0)
  const [totalImportPages, setTotalImportPages] = useState(0)
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const translationObject = i18n.getDataByLanguage(i18n.language);
  const multiLang = translationObject?.translation?.Userlist


  const statusDropdownValues = [{ id: 2, Name: multiLang?.All }, { id: 1, Name: multiLang?.Active }, {
    id: 0, Name: multiLang?.Inactive
  }];
  const textDropdownValues = [{ id: 1, Name: multiLang?.Employee_No, type: 'employeeNo' }, { id: 2, Name: multiLang?.Korean_Name, type: 'koreanName' }, { id: 3, Name: multiLang?.English_Name, type: 'englishName' }, { id: 4, Name: multiLang?.E_mail, type: 'email' }];
  const perPageValue = [5, 10, 20, 30]

  console.log('nnfn =>', multiLang?.Employee_No)

  const columns = useMemo(() => [
    {
      Header: multiLang?.No,
      accessor: 'Id',
      Cell: ({ row }) => {
        return currentPage * itemsPerPage + (row.index + 1)
      }

    },
    {
      Header: multiLang?.Employee_No,
      accessor: 'employeeCode'
    },
    {
      Header: multiLang?.Name,
      accessor: 'koreanName'
    },
    {
      Header: multiLang?.English_Name,
      accessor: 'englishName',
      // Cell: ({ row }) => <Link to={`/UserDetails/${row.original.id}`}>{row.original.englishName}</Link>
      Cell: ({ row }) => <p role='button' onClick={() => viewDetailsHandler(row.original.id)} className='text-center'>{row.original.englishName}</p>

    },
    {
      Header: multiLang?.E_mail,
      accessor: 'Email'
    },
    {
      Header: multiLang?.Job_Title,
      accessor: 'jobTitle'
    },
    {
      Header: multiLang?.Company,
      accessor: 'companiesName'
    },
    {
      Header: multiLang?.Division,
      accessor: 'divisionName'
    },
    {
      Header: multiLang?.Group,
      accessor: 'groupName'
    },
    {
      Header: multiLang?.Team,
      accessor: 'TeamName'
    },
    {
      Header: multiLang?.Status,
      accessor: 'Status',
      Cell: ({ row }) => <p>{row.original.Status == 1 ? 'Active' : 'Inactive'}</p>
    },

  ], [currentPage, itemsPerPage, t])

  const importHistoryColumns = useMemo(() => [
    {
      Header: multiLang?.Employee_No,
      accessor: 'Id',
      Cell: ({ row }) => {
        return (currentImportHistoryPage - 1) * itemsPerPage + (row.index + 1)
      }

    },
    {
      Header: multiLang?.File_Name,
      accessor: 'filename'
    },
    {
      Header: multiLang?.Imported_on,
      accessor: 'importDate',
      Cell: ({ row }) => <p>{row.original.importDate ? moment(row.original.importDate).format('YYYY-MM-DD HH:mm:ss') : '-'}</p>

    },
    {
      Header: multiLang?.Importe_by,
      accessor: 'adminUsername',
      Cell: ({ row }) => <p>{row.original.adminUsername ? row.original.adminUsername : '-'}</p>
    },
    {
      Header: multiLang?.Total_Records,
      accessor: 'importedUsersCount'
    },
    // {
    //   Header: 'Action',
    //   Cell: ({ row }) => <CButton className='btn btn-light w-100' onClick={() => undo(row.original)}>undo</CButton>

    // }

  ], [currentImportHistoryPage, itemsPerPage, t])

  const viewDetailsHandler = (id) => {
    navigate("./UserDetails", {
      state: {
        userId: id
      }
    })
  }

  useEffect(() => {
    getUserListData().then((item) => {
    })
  }, [isLeader, itemsPerPage, currentPage, selectCompany, selectDivision, selectGroup, selectTeam, searchInputValue, statusSelectedValue])


  useEffect(() => {
    getCompaniesData();
  }, [])

  useEffect(() => {
    getImportHistoryData(1).then((item) => {
    })
  }, [startDate, endDate, searchImportInputValue])



  const handleStartDateChange = async (date) => {
    const formattedStartDate = date?.toISOString();
    setStartDate(formattedStartDate);

  };

  const handleEndDateChange = async (date) => {

    const formattedEndDate = date?.toISOString();
    setEndDate(formattedEndDate);

  };

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
    setIsLoading(true)
    if (selectedFile) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const arrayBuffer = event.target.result;
        const data = new Uint8Array(arrayBuffer);

        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];


        const headers = XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0];


        const expectedHeaders = ['srNo', 'email', 'roleName', 'division', 'company'];
        const isValidHeaders = expectedHeaders.every(expectedHeader =>
          headers.includes(expectedHeader)
        );
        if (isValidHeaders) {

          // Upload logic
          const formData = new FormData();
          formData.append('attachments', selectedFile);
          orgImportApi(formData).then(response => response)
            .then(data => {
              if (data.status == 200) {
                getUserListData()
                setOrgImportVisible(false)
                setIsLoading(false)
                enqueueSnackbar(data?.success, { variant: 'success' })
              } else {
                enqueueSnackbar(data?.error, { variant: 'error' })
                setOrgImportVisible(false)
                setIsLoading(false)
              }
            })
            .catch(error => {
              setOrgImportVisible(false)
              setIsLoading(false)
            });
        } else {
          checkFileFormat(true)
          setIsLoading(false)
        }
      };

      reader.readAsArrayBuffer(selectedFile);
    }

  };

  const handleUploadUserImport = () => {
    setIsLoading(true)
    if (selectedFile) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const arrayBuffer = event.target.result;
        const data = new Uint8Array(arrayBuffer);

        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];


        const headers = XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0];


        const expectedHeaders = ['srNo', 'employeeCode', 'KnoxId', 'englishName', 'koreanName', 'email', 'mobile', 'gender', 'company', 'division', 'group', 'jobTitle', 'team'];
        const isValidHeaders = expectedHeaders.every(expectedHeader =>
          headers.includes(expectedHeader)
        );
        if (isValidHeaders) {

          // Upload logic
          const formData = new FormData();
          formData.append('attachments', selectedFile);
          userImportApi(formData).then(response => response)
            .then(data => {
              if (data.status == 200) {
                getUserListData()
                setUserImportVisible(false)
                setIsLoading(false)
                enqueueSnackbar(data?.success, { variant: 'success' })
              } else {
                setUserImportVisible(false)
                setIsLoading(false)
                enqueueSnackbar(data?.error, { variant: 'error' })
              }
            })
            .catch(error => {
              setUserImportVisible(false)
              setIsLoading(false)
            });
        } else {
          checkUserFileFormat(true)
          setIsLoading(false)

        }
      };

      reader.readAsArrayBuffer(selectedFile);
    }

  };


  const getUserListData = async () => {
    setIsLoading(true)
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
        setIsLoading(false)
        setUserListData(res.data)
        setTotalUser(res.totalCount)
        setTotalPages(Math.ceil(res.totalCount / Number(itemsPerPage)));
      } else {
        setIsLoading(false)
      }

    } catch (error) {
      setIsLoading(false)
    }
  };

  // http://192.168.9.175:3000
  // https://ptkapi.experiencecommerce.com
  const getUserListExport = async () => {
    setIsLoading(true)
    let url = `https://ptkapi.experiencecommerce.com/api/adminPanel/userListExport?pageNo=${currentPage + 1
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


    if (dataIds.length > 0) {
      url = url + `&exportId=${JSON.stringify(dataIds)}`;
    }



    const res = await getUserListExportData(url)

    if (res.downloadLink) {
      const downloadLink = res.downloadLink;
      const link = document.createElement('a');
      link.href = 'https://ptkapi.experiencecommerce.com/' + downloadLink;
      link.setAttribute('download', `exported_data_${new Date().getTime()}.xlsx`);

      link.click();
      checkExportSelectid(false)
      setIsLoading(false)
      enqueueSnackbar('Data exported succesfully', { variant: 'success' })

    } else {
      checkExportSelectid(false)
      setIsLoading(false)
      enqueueSnackbar('Something went wrong', { variant: 'error' })
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
    }
  }

  const getDivisionData = async (id) => {
    setIsLoading(true)
    try {
      let url = `https://ptkapi.experiencecommerce.com/api/adminPanel/getDivision?id=${id}`
      const res = await getDivisionMasterData(url);
      if (res.status == 200) {
        setDivisionData(res.data)
        setIsLoading(false)
      }
    } catch (error) {
      setIsLoading(false)
    }
  }

  const getGroupData = async (id) => {
    setIsLoading(true)
    try {
      let url = `https://ptkapi.experiencecommerce.com/api/adminPanel/getGroup?id=${id}`
      const res = await getGroupMasterData(url);
      if (res.status == 200) {
        setGroupData(res.data)
        setIsLoading(false)
      }
    } catch (error) {
      setIsLoading(false)
    }

  }

  const getTeamData = async (id) => {
    setIsLoading(true)
    try {
      let url = `https://ptkapi.experiencecommerce.com/api/adminPanel/getTeam?groupId=${id}`
      const res = await getTeamMasterData(url);
      if (res.status == 200) {
        setTeamData(res.data)
        setIsLoading(false)
      }
    } catch (error) {
      setIsLoading(false)
    }

  }

  const getImportHistoryData = async (currentImportHistoryPage) => {
    setIsLoading(true)
    try {
      let url = `https://ptkapi.experiencecommerce.com/api/adminPanel/importModifiedHistory?pageNo=${currentImportHistoryPage}&limit=${itemsPerPage}`;
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
        setCurrentImportHistoryPage(currentImportHistoryPage)
        setImportHistoryData(res.data)
        setTotalImport(res.totalCount)
        setTotalImportPages(Math.ceil(res.totalCount / Number(itemsPerPage)));
        // setTotalUser(res.totalUser)
        setIsLoading(false)
      }

    } catch (error) {
      setIsLoading(false)
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

  const handleImportHistoryPageChange = (selectedPage) => {
    // setCurrentImportHistoryPage(selectedPage.selected)
    getImportHistoryData(selectedPage.selected + 1)

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
  }


  const [selectedRows, setSelectedRows] = useState([]);
  const handleSelectionChange = useCallback((selectedRowsIds) => {
    setSelectedRows([...selectedRows, selectedRowsIds]);

    const getIds = selectedRowsIds.map((item) => {
      return item.id.toString();
    })
    setDataIds(getIds)

  }, []);

  const clearAllFilters = () => {
    setSelectCompany({});
    setSelectDivision({});
    setSelectGroup({});
    setSelectTeam({});
    setIsLeader('');
    setDivisionData([]);
    setGroupData([])
    setTeamData([])
    setStatusSelectedValue({ id: 1, Name: 'Active' })
    setTypeSelect({});
    setSearchInput('');
    setSearchInputValue('');
  }

  const sampleUserExportFile = async () => {
    const link = document.createElement('a');
    link.href = 'https://ptkapi.experiencecommerce.com/public/uploads/samplefile/sample-file-user-Import.xlsx';
    link.setAttribute('download', `Sample_User_downLoad_${new Date().getTime()}.xlsx`);

    link.click();
  }

  const sampleOrgExportFile = async () => {
    const link = document.createElement('a');
    link.href = 'https://ptkapi.experiencecommerce.com/public/uploads/samplefile/organisation-Import.xlsx';
    link.setAttribute('download', `Sample_User_downLoad_${new Date().getTime()}.xlsx`);

    link.click();
  }

  return (
    <>
      {isLoading && <Loader />}
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
              <label className='me-3'>{multiLang?.Department}</label>
              <CDropdown className='dropDownbackground me-3 drpBtn' >
                <CDropdownToggle color="white">{selectCompany.companyName ? selectCompany.companyName : multiLang?.Company}</CDropdownToggle>
                <CDropdownMenu>
                  {companiesData.map((option, index) => (
                    <CDropdownItem role="button" key={index} onClick={() => { getDivisionData(option.id); setSelectCompany(option) }}>
                      {option.companyName}
                    </CDropdownItem>
                  ))}
                </CDropdownMenu>
              </CDropdown>
              <CDropdown className={divisionData.length > 0 ? 'dropDownbackground me-3 drpBtn' : 'dropDownbackground me-3 drpBtn disable-class'} >
                <CDropdownToggle color="white">{selectDivision.DivisionsName ? selectDivision.DivisionsName : multiLang?.Division}</CDropdownToggle>

                <CDropdownMenu >
                  <CDropdownItem role="button" onClick={() => setSelectDivision({ DivisionsName: 'None' })}>None</CDropdownItem>
                  {divisionData.length > 0 && divisionData?.map((option, index) => (
                    <CDropdownItem role="button" key={index} onClick={() => { getGroupData(option.id); setSelectDivision(option) }}>
                      {option.DivisionsName}
                    </CDropdownItem>
                  ))}
                </CDropdownMenu>
              </CDropdown>
              <CDropdown className={groupData.length > 0 ? 'dropDownbackground me-3 drpBtn' : 'dropDownbackground me-3 drpBtn disable-class'}>
                <CDropdownToggle color="white">{selectGroup.groupName ? selectGroup.groupName : multiLang?.Group}</CDropdownToggle>
                <CDropdownMenu>
                  <CDropdownItem role="button" onClick={() => setSelectGroup({ groupName: 'None' })}>{multiLang?.None}</CDropdownItem>
                  {groupData.map((option, index) => (
                    <CDropdownItem role="button" key={index} onClick={() => { getTeamData(option.id); setSelectGroup(option) }}>
                      {option.groupName}
                    </CDropdownItem>
                  ))}
                </CDropdownMenu>
              </CDropdown>
              <CDropdown className={TeamData.length > 0 ? 'dropDownbackground me-4 drpBtn' : 'dropDownbackground me-4 drpBtn disable-class'}>
                <CDropdownToggle color="white">{selectTeam.teamName ? selectTeam.teamName : multiLang?.Team}</CDropdownToggle>
                <CDropdownMenu>
                  <CDropdownItem role="button" onClick={() => setSelectTeam({ teamName: 'None' })}>{multiLang?.None}</CDropdownItem>
                  {TeamData.map((option, index) => (
                    <CDropdownItem role="button" key={index} onClick={() => setSelectTeam(option)} >
                      {option.teamName}
                    </CDropdownItem>
                  ))}
                </CDropdownMenu>
              </CDropdown>
              <CFormCheck className='d-flex flex-row-reverse reveseCheckBox' id="reverseCheckbox1" checked={isLeader} onChange={handleCheckboxChange} label="Leader only" />
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
                <input className="form-control mr-sm-10 me-2" value={searchInput} onChange={handleInputChange} type="search" placeholder={multiLang?.Search} aria-label="Search" />
                <button className="btn btn-primary my-2 my-sm-0" disabled={!typeSelect.id || searchInput == ''} type="submit" onClick={() => { handleInputvalue() }}>{multiLang?.Search}</button>
              </div>
            </div>
          </div>
          <div className='d-flex justify-content-end mt-3'>
            <CButton className='btn btn-primary' onClick={() => clearAllFilters()}>{multiLang?.Clear}</CButton>
          </div>
        </div>
        <div>
          <div className='d-flex justify-content-between align-items-center mb-3'>
            <p style={{ margin: 0 }}>{multiLang?.Total}:{totalUser}</p>
            <div>

              <button className='btn btn-light  me-3' onClick={() => setUserImportVisible(!userImportVisible)} >{multiLang?.User_Import}</button>

              <CModal
                backdrop="static"
                alignment="center"
                visible={userImportVisible}
                onClose={() => setUserImportVisible(false)}
                aria-labelledby="LiveDemoExampleLabel">
                <CModalHeader onClose={() => setUserImportVisible(false)}>
                  <CModalTitle>{multiLang?.Excel_File_Upload}</CModalTitle>
                </CModalHeader>
                <CModalBody>
                  <div className='d-flex w-100 gap-3 justify-content-end p-3'>
                    <input type="file"
                      onChange={handleFileSelect}
                      multiple
                      accept=".xlsx, .xls" />
                    <CButton onClick={() => handleUploadUserImport()} disabled={!selectedFile}>Upload</CButton>
                  </div>
                  {userFileFormat && <p className='text-danger text-center'>{multiLang?.Upload_Header_Error}</p>}
                  {fileSize && <p className='text-danger text-center'>{multiLang?.Upload_File_Size_Error}</p>}

                  <div className='p-1'>
                    {/* <p>Download Sample File</p> */}
                    <CButton className='btn btn-primary' onClick={() => sampleUserExportFile()}>{multiLang?.Sample_File}</CButton>
                  </div>

                </CModalBody>
              </CModal>
              <button className='btn btn-light  me-3' onClick={() => setOrgImportVisible(!orgImportVisible)}>{multiLang?.Org_Import}</button>
              <CModal
                backdrop="static"
                alignment="center"
                visible={orgImportVisible}
                onClose={() => setOrgImportVisible(false)}
                aria-labelledby="LiveDemoExampleLabel">
                <CModalHeader onClose={() => setOrgImportVisible(false)}>
                  <CModalTitle>{multiLang?.Excel_File_Upload}</CModalTitle>
                </CModalHeader>
                <CModalBody>
                  <div className='d-flex w-100 gap-3 justify-content-end p-3'>
                    <input type="file"
                      onChange={handleFileSelect}
                      multiple
                      accept=".xlsx, .xls" />
                    <CButton onClick={() => handleOrgUpload()} disabled={!selectedFile}>{multiLang?.Upload}</CButton>
                  </div>
                  {fileFormat && <p className='text-danger text-center'>{multiLang?.Upload_Header_Error}</p>}
                  {fileSize && <p className='text-danger text-center'>{multiLang?.Upload_File_Size_Error}</p>}

                  <div className='p-1'>
                    {/* <p>Download Sample File</p> */}
                    <CButton className='btn btn-primary' onClick={() => sampleOrgExportFile()}>{multiLang?.Sample_File}</CButton>
                  </div>
                </CModalBody>
              </CModal>

              <button className='btn btn-light  me-3' onClick={() => checkExportSelectid(!exportSelectid)}>{multiLang?.Export}</button>
              <CModal
                backdrop="static"
                alignment="center"
                visible={exportSelectid}
                onClose={() => checkExportSelectid(false)}
                aria-labelledby="LiveDemoExampleLabel">
                <CModalHeader onClose={() => checkExportSelectid(false)}>
                  <CModalTitle>{multiLang?.Export_Data}</CModalTitle>
                </CModalHeader>
                <CModalBody>
                  {dataIds?.length > 0 ? <p>{multiLang?.Selected_User_Data}</p> : <p>{multiLang?.All_User_Data}</p>}

                  <div className='d-flex justify-content-end'>
                    <CButton onClick={() => getUserListExport()} >{multiLang?.Export}</CButton>
                  </div>
                  {fileFormat && <p className='text-danger text-center'>{multiLang?.Upload_Header_Error}</p>}

                </CModalBody>
              </CModal>
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

            <div>
              <button className='btn btn-success mb-3' onClick={() => { setImportVisible(!importVisible); getImportHistoryData(1) }}>{multiLang?.Import_History}</button>
            </div>
            <div>
              <CModal
                backdrop="static"
                alignment="center"
                size="lg"
                visible={importVisible}
                onClose={() => setImportVisible(false)}
                aria-labelledby="LiveDemoExampleLabel">
                <CModalHeader onClose={() => setImportVisible(false)}>
                  <CModalTitle>{multiLang?.Import_History}</CModalTitle>
                </CModalHeader>
                <CModalBody>
                  <div className='d-flex w-100 gap-3 justify-content-end'>
                    <p>{multiLang?.Total}: {totalImport} </p>
                    <div className='d-flex p-2 gap-3'>
                      <DatePicker value={startDate} onChange={handleStartDateChange} />
                      <DatePicker value={endDate} onChange={handleEndDateChange} />
                    </div>
                    <div>
                      <div className="d-flex form-inline w-100">
                        <input className="form-control mr-sm-10 me-2" onChange={handleImportInputChange} type="search" placeholder={multiLang?.Search} aria-label="Search" />
                        <button className="btn btn-primary my-2 my-sm-0" disabled={searchImportInput == ''} type="submit" onClick={() => { handleImportInputvalue() }}>{multiLang?.Search}</button>
                      </div>
                    </div>
                  </div>
                  <div>
                    <ReactTable showCheckbox={false} columns={importHistoryColumns} data={importHistoryData} totalCount={10} onSelectionChange={handleSelectionChange} />
                    {importHistoryData.length > 0 &&
                      <div className='userlist-pagination'>
                        <div className='userlist-pagination dataTables_paginate'>
                          <ReactPaginate
                            breakLabel={'...'}
                            marginPagesDisplayed={1}
                            previousLabel={<button>{multiLang?.Previous}</button>}
                            nextLabel={<button>{multiLang?.Next}</button>}
                            pageCount={totalImportPages}
                            onPageChange={handleImportHistoryPageChange}
                            forcePage={currentImportHistoryPage - 1}
                            renderOnZeroPageCount={null}
                            pageRangeDisplayed={1}
                          />
                        </div>
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
    </>
  )
}

export default UserList
