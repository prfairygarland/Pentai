import { CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle, CFormCheck, CSpinner } from '@coreui/react'
import axios from 'axios'
import React, { useEffect, useMemo, useState, useCallback } from 'react'
import ReactPaginate from 'react-paginate'
import { useTable } from 'react-table'
import ReactTable from 'src/components/common/ReactTable'
import { getCompaniesMasterData, getDivisionMasterData, getGroupMasterData, getTeamMasterData, getUserList } from 'src/utils/Api'

const UserList = () => {

  const [userListData, setUserListData] = useState([])
  const [totalUser, setTotalUser] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const [searchInputValue, setSearchInputValue] = useState('')
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
  const [searchInput, setSearchInput] = useState('')


  const statusDropdownValues = [{ id: 2, Name: 'All' }, { id: 1, Name: 'Active' }, { id: 0, Name: 'Inactive' }];
  const textDropdownValues = [{ id: 1, Name: 'Employee No', type: 'employeeNo' }, { id: 2, Name: 'Korean Name', type: 'koreanName' }, { id: 3, Name: 'English Name', type: 'englishName' }, { id: 4, Name: 'E-mail', type: 'email' }];
  const perPageValue = [5, 10, 20, 30]

  const columns = useMemo(() => [
    {
      Header: 'No',
      accessor: 'Id',
      Cell: ({ row }) =>
        currentPage > 0
          ? currentPage * itemsPerPage + (parseInt(row.id) + 1)
          : parseInt(row.id) + 1
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
      accessor: 'englishName'
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
      accessor: 'Status'
    },

  ], [])

  useEffect(() => {
    getUserListData().then((item) => {
    })
  }, [isLeader, itemsPerPage, currentPage, selectCompany, selectDivision, selectGroup, selectTeam, searchInputValue, statusSelectedValue])


  useEffect(() => {
    getCompaniesData();
  }, [])

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


  const getUserListExport = async () => {
    let url = `https://ptkapi.experiencecommerce.com/api/adminPanel/userListExport?pageNo=${currentPage + 1
      }&limit=${itemsPerPage}`;
    const res = await getUserList(url)

    const link = document.createElement('a');
    link.href = url;
    document.body.appendChild(link);
    link.click();

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


  // for Delete
  const [selectedRows, setSelectedRows] = useState([]);
  const handleSelectionChange = useCallback((selectedRowsIds) => {
    setSelectedRows(selectedRowsIds);
  }, []);

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
      </div>
      <div>
        <div className='d-flex justify-content-between align-items-center mb-3'>
          <p style={{ margin: 0 }}>Total:{totalUser}</p>
          <div>
            <button className='btn btn-light  me-3' >User Import</button>
            <button className='btn btn-light  me-3'>Org Import</button>
            <button className='btn btn-light  me-3' onClick={() => getUserListExport()}>Export</button>
            <CDropdown className='dropDownbackground drpDBtn align-items-center'>
              <label>Show</label>
              <CDropdownToggle color="white" className='mx-2 filterbtn' >{itemsPerPage}</CDropdownToggle>
              <CDropdownMenu >
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
            <button className='btn btn-primary mb-3'>Import History</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserList
