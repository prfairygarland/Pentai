import { CButton, CFormInput } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { getApi } from 'src/utils/Api'
import { API_ENDPOINT } from 'src/utils/config'

const AdminGroupManagement = () => {


  const [adminGroupData, setAdminGroupData] = useState([])


  useEffect(() => {
    getAdminGroupData()
  }, [])


  const getAdminGroupData = async () => {
    let url = API_ENDPOINT.getAllAdminGroup

    const res = await getApi(url)

    console.log('test =>', res);
    if (res?.status === 200) {
      setAdminGroupData(res?.data)
    } else {
      // setAdminGroupData([])
    }
  }

  const addGroup = async () => {
    setAdminGroupData([...adminGroupData, { groupName: '', superAdminCount: 0, subAdminCount: 0 }])
  }

  const handleInputChange = (index, value) => {
    console.log('value =>', value);
    const updatedValues = [...adminGroupData];
    updatedValues[index].groupName = value
    setAdminGroupData(updatedValues);
  };

  return (
    <div>
      <h4 className='mb-4'>Admin Group Management</h4>
      <div className='ptk-table w-100'>
        <table className='table'>
          <thead>
            <tr>
              <th>
                <CButton onClick={() => addGroup()}>Add</CButton>
              </th>
              <th>Name</th>
              <th>Super Admin</th>
              <th>Sub Admin</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {adminGroupData.map((item, index) => (
              <tr key={index}>
                <td colSpan={2}>
                  <CFormInput
                    type="text"
                    value={item?.groupName}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                  // placeholder={`Input ${index + 1} Value`}
                  />
                </td>
                <td>{item.superAdminCount}</td>
                <td>{item.subAdminCount}</td>
                {item.subAdminCount == 0 &&
                  <td>
                    <CButton >Delete</CButton>
                  </td>
                }
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='d-flex justify-content-center'>
        <CButton >save</CButton>
      </div>
    </div>
  )
}

export default AdminGroupManagement
