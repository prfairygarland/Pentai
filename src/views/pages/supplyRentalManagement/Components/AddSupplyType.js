import { cilInfo } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CButton, CFormCheck, CFormInput, CFormSelect, CFormTextarea, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import { enqueueSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Loader from 'src/components/common/Loader';
import { deleteApi, getApi, postApi, putApi } from 'src/utils/Api';
import { API_ENDPOINT } from 'src/utils/config';

const AddSupplyType = ({ setModal, getMod, Modal, getId, removeIds, getVal }) => {

  const { t, i18n } = useTranslation();
  const translationObject = i18n.getDataByLanguage(i18n.language);
  const multiLang = translationObject?.translation?.supplyRentalManagementAllSupplies
  const [deleteVisible, setDeleteVisible] = useState(false)
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false);
  const [addSupplyTypeData, setAddSupplyTypeData] = useState({
    name: '',
    associatedItem: 1,
    rentalDuration: 1,
    providedOption: true,
    pickUpAndReturn: '',
    reasonRemarks: '',
    rentalGuideDescription: '',
    visibility: true,
  })

  useEffect(() => {
    if (getId !== null) {
      getData(getId)
    } else {
      setAddSupplyTypeData({
        name: '',
        associatedItem: 1,
        rentalDuration: 1,
        providedOption: true,
        pickUpAndReturn: '',
        reasonRemarks: '',
        rentalGuideDescription: '',
        visibility: true,
      })
    }
  }, [getId])

  const getData = async (id) => {
    try {
      let url = API_ENDPOINT.get_supply_type_details + `?id=${id}`
      const response = await getApi(url)


      if (response?.status === 200) {
        setAddSupplyTypeData({
          name: response.data.name,
          associatedItem: response.data.associatedItem,
          rentalDuration: response.data.rentalDuration,
          providedOption: response.data.providedOption === 'visible' ? true : false,
          pickUpAndReturn: response.data.pickUpAndReturn,
          reasonRemarks: response.data.reasonRemarks,
          rentalGuideDescription: response.data.rentalGuideDescription,
          visibility: response.data.visibility === 'visible' ? true : false,
        })
        // setMainCategoryData(response?.data)
        // setUserInfoPopup(true)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const deleteSupplyType = async () => {
    try {
      let url = API_ENDPOINT.delete_supply_type
      const response = await deleteApi(url, `?id=${getId}`)

      if (response?.status === 200) {
        // setUserInfoPopup(true)
        enqueueSnackbar('Delete succefully', { variant: 'success' })
        removeIds(null)
        getVal(null)
        // Modal('allList')
        setModal(!getMod)


      }
    } catch (error) {
      enqueueSnackbar('Something Went Wrong', { variant: 'error' })
      console.log(error)
    }
  }

  const handleInputChange = (e) => {
    const keyName = e.target.name
    let value = e.target.value
    if (keyName === 'name') {
      value = value.substring(0, 26)
    } else if (keyName === 'associatedItem') {
      value = value
    } else if (keyName === 'rentalDuration') {
      value = value
    } else if (keyName === 'pickUpAndReturn') {
      value = value.substring(0, 25)
    } else if (keyName === 'reasonRemarks') {
      value = value.substring(0, 100)
    } else if (keyName === 'rentalGuideDescription') {
      value = value
    }
    setAddSupplyTypeData((prev) => ({ ...prev, [keyName]: value }))
  }

  const saveSupplyType = async (type) => {
    if (type === 'save') {
      if (addSupplyTypeData.name === '') {
        enqueueSnackbar('Please enter name', { variant: 'error' })
        return false
      }
      if (addSupplyTypeData.associatedItem < 1) {
        enqueueSnackbar('Please enter valid associate Item', { variant: 'error' })
        return false
      }
      if (addSupplyTypeData.rentalDuration < 1) {
        enqueueSnackbar('Please enter valid Rental Duration', { variant: 'error' })
        return false
      }

      if (addSupplyTypeData.pickUpAndReturn === '') {
        enqueueSnackbar('Please enter Point of pick and return', { variant: 'error' })
        return false
      }

      if (addSupplyTypeData.reasonRemarks === '') {
        enqueueSnackbar('Please enter Reason remarks guide text', { variant: 'error' })
        return false
      }
      if (addSupplyTypeData.rentalGuideDescription === '') {
        enqueueSnackbar('Please enter Supply Rental guide description', { variant: 'error' })
        return false
      }

      setIsLoading(true)
      try {

        let data = {
          name: addSupplyTypeData.name,
          associatedItem: addSupplyTypeData.associatedItem,
          rentalDuration: addSupplyTypeData.rentalDuration,
          providedOption: addSupplyTypeData.providedOption === true ? 'visible' : 'hide',
          pickUpAndReturn: addSupplyTypeData.pickUpAndReturn,
          reasonRemarks: addSupplyTypeData.reasonRemarks,
          rentalGuideDescription: addSupplyTypeData.rentalGuideDescription,
          visibility: addSupplyTypeData.visibility === true ? 'visible' : 'hide',
        }

        let res;

        if (getId) {
          data['id'] = getId
          res = await putApi(API_ENDPOINT.update_supply_type, data)
        } else {
          res = await postApi(API_ENDPOINT.add_supply_type, data)
        }

        if (res.status === 200) {
          setAddSupplyTypeData({
            name: '',
            associatedItem: 1,
            rentalDuration: 1,
            providedOption: true,
            pickUpAndReturn: '',
            reasonRemarks: '',
            rentalGuideDescription: '',
            visibility: true,
          })
          if (res.data.status === 409) {
            enqueueSnackbar(`${res?.data?.msg}`, { variant: 'error' })
          } else {
            enqueueSnackbar(`It has been saved`, { variant: 'success' })
          }
          setIsLoading(false)
          removeIds(null)
          getVal(null)
          // Modal('allList')
          setModal(!getMod)

        } else {
          enqueueSnackbar(`${res?.data?.msg}`, { variant: 'error' })
          setIsLoading(false)
        }
      } catch (error) {
        setIsLoading(false)
        console.log(error)
      }
    } else {
      try {
        setAddSupplyTypeData({
          name: '',
          associatedItem: 0,
          rentalDuration: 0,
          providedOption: true,
          pickUpAndReturn: '',
          reasonRemarks: '',
          rentalGuideDescription: '',
          visibility: true,
        })
        setIsLoading(false)
        // navigate('/AllSupplies')
        removeIds(null)
        getVal(null)
        // Modal('allList')
        setModal(!getMod)


      } catch (error) {
        setIsLoading(false)
        console.log(error)
      }
    }

  }



  return (
    <div className='col-md-8'>
      {isLoading && <Loader />}
      <div>
        {getId &&
          <div className='d-flex justify-content-between align-items-center mb-3'>
          <h4 className="me-3">{multiLang?.supplyType}</h4>
            <CButton onClick={() => setDeleteVisible(true)} className='btn-black'>{multiLang?.delete}</CButton>
          </div>
        }
        <div className="dropdown-container mb-2">
       
        </div>
        <div className="card-body">
          <div className="formWraper">
            <div className="form-outline form-white   d-flex ">
              <div className="formWrpLabel" >
                <label className="fw-bolder ">
                  {multiLang?.supplyTypeName}
                </label>
              </div>
              <div className="formWrpInpt d-flex">
                <div className="d-flex formradiogroup mb-2 gap-3">
                  <CFormInput
                    type="text"
                    placeholder={multiLang?.placeholder}
                    name='name'
                    value={addSupplyTypeData.name}
                    onChange={(e) => {
                      handleInputChange(e)
                    }}
                  />
                </div>
                <span className="txt-byte-information">{addSupplyTypeData.name.length} / 26 {multiLang?.byte}</span>
              </div>
            </div>
            <div className="form-outline form-white  d-flex ">
              <div className="formWrpLabel" >
                <label className="fw-bolder ">
                  {multiLang?.associatedItems}
                </label>
              </div>
              <div className="formWrpInpt">
                <div className="d-flex formradiogroup mb-2 gap-3">
                  <p>
                    <CFormInput placeholder='0' type='number' name='associatedItem'
                      value={addSupplyTypeData.associatedItem}
                      onChange={(e) => {
                        handleInputChange(e)
                      }}
                      style={{ width: '30%' }} />
                  </p>
                </div>
              </div>
            </div>
            <div className="form-outline formWrpLabel form-white d-flex justify-content-end bg-light">
              <p style={{ padding: '2%' }}>{multiLang?.defaultSettings}</p>
            </div>
            <div className="form-outline form-white  d-flex ">
              <div className="formWrpLabel" >
                <label className="fw-bolder ">
                  {multiLang?.rentalDuration}
                </label>
              </div>
              <div className="formWrpInpt">
                <div className="d-flex formradiogroup mb-2 align-items-center   gap-5">
                  <p>
                    {multiLang?.maxRentableWeeks}
                  </p>
                  <p>
                    <CFormInput placeholder='0' type='number' name='rentalDuration'
                      value={addSupplyTypeData.rentalDuration}
                      onChange={(e) => {
                        handleInputChange(e)
                      }}
                      style={{ width: '30%' }} />
                  </p>
                </div>
              </div>
            </div>

            <div className='formWrpLabel' />
            <div className="d-flex col-md-12">
              <div className="form-outline form-white d-flex w-100">
                <div className="formWrpLabel" >
                  <label className="fw-bolder ">{multiLang?.visibility}</label>
                </div>
                <div className="push-notification-container gap-3">
                  <CFormCheck type="radio" name="visibility" id="exampleRadios1" label={multiLang?.visible}
                    defaultChecked={addSupplyTypeData.visibility}
                    onClick={() => setAddSupplyTypeData((prev) => ({ ...prev, visibility: true }))}
                    value={true}
                  />
                  <CFormCheck type="radio" name="visibility" id="exampleRadios2" label={multiLang?.hide}
                    defaultChecked={!addSupplyTypeData.visibility}
                    onClick={() => setAddSupplyTypeData((prev) => ({ ...prev, visibility: false }))}
                    value={false}
                  />
                </div>
              </div>

            </div>
            <div className="d-flex col-md-12">
              <div className="form-outline form-white d-flex w-100">
                <div className="formWrpLabel">
                  <label className="fw-bolder ">{multiLang?.requestAsProvidedOption}</label>
                </div>
                <div className="push-notification-container gap-3">
                  <CFormCheck type="radio" name="providedOption" id="exampleRadios1" label={multiLang?.visible}
                    defaultChecked={addSupplyTypeData.providedOption}
                    onClick={() => setAddSupplyTypeData((prev) => ({ ...prev, providedOption: true }))}
                    value={true}
                  />
                  <CFormCheck type="radio" name="providedOption" id="exampleRadios2" label={multiLang?.hide}
                    defaultChecked={!addSupplyTypeData.providedOption}
                    onClick={() => setAddSupplyTypeData((prev) => ({ ...prev, providedOption: false }))}
                    value={false}
                  />
                </div>
              </div>

            </div>
            <div className="form-outline form-white  d-flex ">
              <div className="formWrpLabel" >
                <label className="fw-bolder">
                  {multiLang?.pointOfPickAndReturn}
                </label>
              </div>
              <div className="formWrpInpt">
                <div className="d-flex formradiogroup mb-2 gap-3">
                  <CFormInput
                    type="text"
                    placeholder={multiLang?.pointOfPickAndReturnPlaceholder}
                    name='pickUpAndReturn'
                    value={addSupplyTypeData.pickUpAndReturn}
                    onChange={(e) => {
                      handleInputChange(e)
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="form-outline form-white  d-flex ">
              <div className="formWrpLabel" >
                <label className="fw-bolder">
                  {multiLang?.reasonRemarksGuideText}
                </label>
              </div>
              <div className="formWrpInpt">
                <div className="d-flex formradiogroup mb-2 gap-3">
                  <CFormInput
                    type="text"
                    placeholder={multiLang?.reasonRemarksGuideTextPlaceholder}
                    name='reasonRemarks'
                    value={addSupplyTypeData.reasonRemarks}
                    onChange={(e) => {
                      handleInputChange(e)
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="form-outline form-white  d-flex ">
              <div className="formWrpLabel" >
                <label className="fw-bolder">
                  {multiLang?.supplyRentalGuideDescription}
                </label>
              </div>
              <div className="formWrpInpt">
                <div className="d-flex formradiogroup mb-2 gap-3">
                  <CFormTextarea
                    id="exampleFormControlTextarea1"
                    rows={3}
                    name='rentalGuideDescription'
                    value={addSupplyTypeData.rentalGuideDescription}
                    onChange={(e) => {
                      handleInputChange(e)
                    }}
                  ></CFormTextarea>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='p-4'>
        <div className='d-flex gap-3'>
          <CIcon icon={cilInfo} size="lg" />
          <p>{multiLang?.defaultSettingsMsg}</p>
        </div>
        <div className='mt-2'>
          <p>{multiLang?.defaultSettingsUpdateMsg}</p>
        </div>
      </div>
      <div className='d-flex justify-content-center my-3 gap-4' >
        <CButton onClick={() => saveSupplyType('cancle')} className='btn-black'>{multiLang?.cancel}</CButton>
        <CButton onClick={() => saveSupplyType('save')}>{multiLang?.save}</CButton>
      </div>

      <CModal
        backdrop="static"
        visible={deleteVisible}
        onClose={() => setDeleteVisible(false)}
        aria-labelledby="StaticBackdropExampleLabel"
      >
        <CModalHeader>
          <CModalTitle id="StaticBackdropExampleLabel" className='btn-black'>{multiLang?.delete}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>{multiLang?.deletePopUp}
            <br />
            {multiLang?.deletePopUpMsg}</p>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={() => deleteSupplyType()}>{multiLang?.delete}</CButton>
          <CButton color="secondary" onClick={() => setDeleteVisible(false)}>
            {multiLang?.cancel}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>

  )
}

export default AddSupplyType
