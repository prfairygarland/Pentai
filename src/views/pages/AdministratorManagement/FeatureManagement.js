import { CButton, CCol, CFormCheck } from '@coreui/react'
import React, { useState } from 'react'
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getApi } from 'src/utils/Api';
import { API_ENDPOINT } from 'src/utils/config';

const FeatureManagement = () => {


  const { t, i18n } = useTranslation();
  const translationObject = i18n.getDataByLanguage(i18n.language);
  const multiLang = translationObject?.translation?.MenuAccessPermission
  const [featureManagementData, setFeatureManagementData] = useState([])

  useEffect(() => {
    getFeatureManagementData()
  }, [])



  const getFeatureManagementData = async () => {
    let url = API_ENDPOINT.getFeatureManagement

    const res = await getApi(url)

    console.log('test =>', res);
    if (res?.status === 200) {
      setFeatureManagementData(res.data)
    } else {
      // setAdminGroupData([])
    }
  }

  const handleCheckBoxChange = async (i, value) => {
    console.log('value =>', value);
    const updatedValues = [...featureManagementData];
    updatedValues[i].isEnabled = value
    setFeatureManagementData(updatedValues);
  };

  return (
    <div>
      <div className="formWraper mt-3">
        <div className="form-outline form-white  d-flex ">
          <div className="formWrpLabel">
            <label className="fw-bolder ">{multiLang?.usageStatus}</label>
          </div>
          <div className="formWrpInpt">
            {featureManagementData.map((item, index) => (
              <div key={index}
                className="d-flex formradiogroup mb-2 gap-2"
              >
                <h5 className="radiolabel" htmlFor="Bulletin board">
                  {item.name}
                </h5>
                <CFormCheck
                  type="radio"
                  id='one'
                  name={"checkBox" + index}
                  checked={item.isEnabled === true}
                  onChange={() =>
                    handleCheckBoxChange(index, true)
                  }
                  value={true}
                  label={multiLang?.grant}
                />
                <CFormCheck
                  type="radio"
                  id='two'
                  name={"checkBox" + index}
                  checked={item.isEnabled === false}
                  onChange={() =>
                    handleCheckBoxChange(index, false)
                  }
                  value={false}
                  label={multiLang?.deny}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* <hr /> */}
      <div className="d-flex justify-content-center mt-2">
        <CCol xs="auto">
          <CButton
            type="submit"
            className="mb-3  mb-3 text-white "
          // onClick={handleUpdateStatus}
          >
            {multiLang?.save}
          </CButton>
        </CCol>
      </div>
    </div>
  )
}

export default FeatureManagement
