import { CButton, CFormInput, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import { enqueueSnackbar } from 'notistack'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Loader from 'src/components/common/Loader'
import { getApi, postApi } from 'src/utils/Api'
import { API_ENDPOINT } from 'src/utils/config'

const AdminGroupManagement = () => {

  const { t, i18n } = useTranslation();
  const translationObject = i18n.getDataByLanguage(i18n.language);
  const multiLang = translationObject?.translation?.MenuAccessPermission
  const [adminGroupData, setAdminGroupData] = useState([])
  const [newAdminGroup, setNewAdminGroup] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [saveModal, setSaveModal] = useState(false)


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
    setNewAdminGroup([...newAdminGroup, { groupName: '', superAdminCount: 0, subAdminCount: 0 }])
  }

  const handleInputChange = (index, value) => {
    const updatedValues = [...newAdminGroup];
    updatedValues[index - adminGroupData.length].groupName = value
    setNewAdminGroup(updatedValues);
  };


  const save = async () => {
    setIsLoading(true)
    let data = {
      name: newAdminGroup[0].groupName
    }

    const res = await postApi(API_ENDPOINT.addGroup, data)

    if (res.status === 200) {
      enqueueSnackbar(multiLang?.successMsg, { variant: 'success' })
      setIsLoading(false)
      setSaveModal(false)
      getAdminGroupData()
      setNewAdminGroup([])
    } else {
      setIsLoading(false)
      setSaveModal(false)
    }

  }

  return (
    <div>
      {isLoading && <Loader />}
      <div className="pageTitle mb-3 pb-2 d-flex justify-content-between align-items-center">
          <h2>{multiLang?.AdminGroupManagement}</h2>
        </div>

      <div className='ptk-table w-100'>
        <table className='table'>
          <thead>
            <tr>
              <th className='d-flex justify-content-start'>
                <CButton onClick={() => addGroup()}>{multiLang?.add}</CButton>
              </th>
              <th>{multiLang?.name}</th>
              <th>{multiLang?.superAdmin}</th>
              <th>{multiLang?.subAdmin}</th>
              <th>{multiLang?.action}</th>
            </tr>
          </thead>
          <tbody>
            {[...adminGroupData, ...newAdminGroup].map((item, index) => (
              <tr key={index}>
                <td colSpan={2}>
                  <CFormInput
                    type="text"
                    value={item?.groupName}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    disabled={index < adminGroupData.length}
                  />
                </td>
                <td>{item.superAdminCount}</td>
                <td>{item.subAdminCount}</td>
                {item.subAdminCount == 0 &&
                  <td>
                    <a className='primTxt'>{multiLang?.delete} </a>
                  </td>
                }
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='d-flex justify-content-center'>
        <CButton onClick={() => setSaveModal(true)}>{multiLang?.save}</CButton>
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
            <CButton onClick={() => save()} color="primary">{multiLang?.yes}</CButton>
          </CModalFooter>
        </CModal>
      </div>
    </div>
  )
}

export default AdminGroupManagement
