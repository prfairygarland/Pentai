import { CButton, CCol, CFormCheck } from '@coreui/react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';

const FeatureManagement = () => {


  const { t, i18n } = useTranslation();
  const translationObject = i18n.getDataByLanguage(i18n.language);
  const multiLang = translationObject?.translation?.MenuAccessPermission
  const [featureManagementData, setFeatureManagementData] = useState({
    reservationStatuses: true,
    ptkLoungeStatuses: false,
    communityStatuses: false,
  })

  return (
    <div>
      <div className="formWraper mt-3">
        <div className="form-outline form-white  d-flex ">
          <div className="formWrpLabel">
            <label className="fw-bolder ">{multiLang?.usageStatus}</label>
          </div>
          <div className="formWrpInpt">
            {
              <div
                className="d-flex formradiogroup mb-2 gap-2"
              >
                <h5 className="radiolabel" htmlFor="Bulletin board">
                  {multiLang?.reservation}
                </h5>
                <CFormCheck
                  type="radio"
                  name="BulletinBoard"
                  defaultChecked={featureManagementData.reservationStatuses}
                  onClick={() =>
                    setFeatureManagementData((prev) => ({ ...prev, reservationStatuses: true }))
                  }
                  value={true}
                  label={multiLang?.grant}
                />
                <CFormCheck
                  type="radio"
                  name="BulletinBoard"
                  defaultChecked={!featureManagementData.reservationStatuses}
                  onClick={() =>
                    setFeatureManagementData((prev) => ({ ...prev, reservationStatuses: false }))
                  }
                  value={false}
                  label={multiLang?.deny}
                />
              </div>
            }
            {
              <div
                className="d-flex formradiogroup mb-2 gap-2"
              >
                <h5 className="radiolabel" htmlFor="Bulletin board">
                  {multiLang?.community}
                </h5>
                <CFormCheck
                  type="radio"
                  name="BulletinBoard"
                  // id={radioGroupValue?.BulletinBoard?.id}
                  // checked={radioGroupValue.BulletinBoard?.status === 1}
                  // onChange={handleRadioCheck}
                  value="1"
                  label={multiLang?.grant}
                />
                <CFormCheck
                  type="radio"
                  name="BulletinBoard"
                  // id={radioGroupValue?.BulletinBoard?.id}
                  // checked={radioGroupValue.BulletinBoard?.status === 0}
                  // onChange={handleRadioCheck}
                  value="0"
                  label={multiLang?.deny}
                />
              </div>
            }
            {
              <div
                className="d-flex formradiogroup mb-2 gap-2"
              >
                <h5 className="radiolabel" htmlFor="Bulletin board">
                  {multiLang?.pTKLounge}
                </h5>
                <CFormCheck
                  type="radio"
                  name="BulletinBoard"
                  // id={radioGroupValue?.BulletinBoard?.id}
                  // checked={radioGroupValue.BulletinBoard?.status === 1}
                  // onChange={handleRadioCheck}
                  value="1"
                  label={multiLang?.grant}
                />
                <CFormCheck
                  type="radio"
                  name="BulletinBoard"
                  // id={radioGroupValue?.BulletinBoard?.id}
                  // checked={radioGroupValue.BulletinBoard?.status === 0}
                  // onChange={handleRadioCheck}
                  value="0"
                  label={multiLang?.deny}
                />
              </div>
            }
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
