import { CButton, CFormCheck, CFormInput, CFormTextarea, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import { enqueueSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import Loader from 'src/components/common/Loader';
import { deleteApi, getApi, postApi, putApi } from 'src/utils/Api';
import { API_ENDPOINT } from 'src/utils/config';

const AddModel = ({ setModal, getMod, Modal, getMainModalId, getModalId, removeModalIds, getVal, setCat, setSubIcon }) => {

  const { t, i18n } = useTranslation();
  const translationObject = i18n.getDataByLanguage(i18n.language);
  const multiLang = translationObject?.translation?.supplyRentalManagementAllSupplies

  const [deleteVisible, setDeleteVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false);

  const [addModalData, setModalData] = useState({
    name: '',
    subCategoryId: '',
    associatedItem: 1,
    visibility: true
  })

  useEffect(() => {
    if (getModalId !== null) {
      getData(getModalId)
    } else {
      setModalData({
        name: '',
        associatedItem: 1,
        visibility: true,
      })
    }
  }, [getModalId])

  const getData = async (id) => {
    try {
      let url = API_ENDPOINT.get_modal_details + `?id=${id}`
      const response = await getApi(url)


      if (response?.status === 200) {
        setModalData({
          name: response.data.name,
          associatedItem: response.data.associatedItem,
          visibility: response.data.visibility === 'visible' ? true : false,
        })
        // setMainCategoryData(response?.data)
        // setUserInfoPopup(true)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleInputChange = (e) => {
    const keyName = e.target.name
    let value = e.target.value



    if (keyName === 'name') {
      value = value
    } else if (keyName === 'associatedItem') {
      value = value
    }
    setModalData((prev) => ({ ...prev, [keyName]: value }))
  }

  const saveModal = async (type) => {

    if (type === 'save') {
      if (addModalData.name === '') {
        enqueueSnackbar('Please enter name', { variant: 'error' })
        return false
      }
      if (addModalData.associatedItem < 1) {
        enqueueSnackbar('Please enter valid associate Item', { variant: 'error' })
        return false
      }

      setIsLoading(true)
      try {

        let data = {
          name: addModalData.name,
          subCategoryId: getMainModalId,
          associatedItem: addModalData.associatedItem,
          visibility: addModalData.visibility === true ? 'visible' : 'hide',
        }

        let res;

        if (getModalId && getMainModalId) {
          data['id'] = getModalId
          data['subCategoryId'] = getMainModalId

          res = await putApi(API_ENDPOINT.update_modal, data)
        } else {
          res = await postApi(API_ENDPOINT.add_modal, data)
        }


        if (res.status === 200) {
          setModalData({
            name: '',
            associatedItem: 1,
            subCategoryId: null,
            visibility: true,
          })
          if (res.data.status === 409) {
            enqueueSnackbar(`${res?.data?.msg}`, { variant: 'error' })
          } else {
            enqueueSnackbar(`It has been saved`, { variant: 'success' })
          }
          setIsLoading(false)
          removeModalIds(null)
          getVal(null)
          setCat(null)
          setSubIcon(null)
          // Modal('allList')
          setModal(!getMod)
          //
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
        setModalData({
          name: '',
          associatedItem: 1,
          subCategoryId: null,
          visibility: true,
        })
        setIsLoading(false)
        removeModalIds(null)
        getVal(null)
        setCat(null)
        setSubIcon(null)
        // Modal('allList')
        setModal(!getMod)
      } catch (error) {
        setIsLoading(false)
        console.log(error)
      }
    }

  }

  const deleteCategory = async () => {
    try {
      let url = API_ENDPOINT.delete_modal
      const response = await deleteApi(url, `?id=${getModalId}`)

      if (response?.status === 200) {
        // setUserInfoPopup(true)
        enqueueSnackbar('Delete succefully', { variant: 'success' })
        removeModalIds(null)
        getVal(null)
        setCat(null)
        setSubIcon(null)
        // Modal('allList')
        setModal(!getMod)
      }
    } catch (error) {
      enqueueSnackbar('Something Went Wrong', { variant: 'error' })
      console.log(error)
    }
  }


  return (

    <div className='col-md-9'>
      {isLoading && <Loader />}
      <div>
        {getModalId !== null &&
        <div className='d-flex justify-content-end'>
            <CButton onClick={() => setDeleteVisible(true)}>{multiLang?.delete}</CButton>
        </div>
        }
        <div className="dropdown-container mb-2">
          <h5 className="me-3">{multiLang?.modelName}</h5>
        </div>
        <div className="card-body">
          <div className="formWraper">
            <div className="form-outline form-white   d-flex ">
              <div className="formWrpLabel" >
                <label className="fw-bolder ">
                  {multiLang?.modelName}
                </label>
              </div>
              <div className="formWrpInpt d-flex">
                <div className="d-flex formradiogroup mb-2 gap-3">
                  <CFormInput
                    type="text"
                    placeholder={multiLang?.placeholder}
                    name="name"
                    value={addModalData.name}
                    onChange={(e) => {
                      handleInputChange(e)
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="d-flex col-md-12">
              <div className="form-outline form-white d-flex w-100">
                <div className="formWrpLabel" >
                  <label className="fw-bolder ">{multiLang?.visibility}</label>
                </div>
                <div className="d-flex gap-2 ms-2">
                  <CFormCheck type="radio" name="visibility" id="exampleRadios1" label={multiLang?.visible}
                    defaultChecked={addModalData.visibility}
                    onClick={() => setModalData((prev) => ({ ...prev, visibility: true }))}
                    value={true}
                  />
                  <CFormCheck type="radio" name="visibility" id="exampleRadios2" label={multiLang?.hide}
                    defaultChecked={!addModalData.visibility}
                    onClick={() => setModalData((prev) => ({ ...prev, visibility: false }))}
                    value={false}
                  />
                </div>
              </div>

            </div>
            <div className="form-outline form-white  d-flex ">
              <div className="formWrpLabel">
                <label className="fw-bolder ">
                  {multiLang?.associatedItems}
                </label>
              </div>
              <div className="formWrpInpt">
                <div className="d-flex formradiogroup mb-2 gap-3">
                  <p>
                    <CFormInput placeholder='0' type='number' name='associatedItem'
                      value={addModalData.associatedItem}
                      onChange={(e) => {
                        handleInputChange(e)
                      }}
                      style={{ width: '30%' }} />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '5%', gap: 10 }}>
        <CButton onClick={() => saveModal('cancle')} style={{ marginRight: '2%', background: '#ccc', border: 'none' }}>{multiLang?.cancel}</CButton>
        <CButton onClick={() => saveModal('save')}>{multiLang?.save}</CButton>
      </div>
      <CModal
        backdrop="static"
        visible={deleteVisible}
        onClose={() => setDeleteVisible(false)}
        aria-labelledby="StaticBackdropExampleLabel"
      >
        <CModalHeader>
          <CModalTitle id="StaticBackdropExampleLabel">{multiLang?.delete}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>{multiLang?.deletePopUp}
            <br />
            {multiLang?.deletePopUpMsg}</p>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={() => deleteCategory()}>{multiLang?.delete}</CButton>
          <CButton color="secondary" onClick={() => setDeleteVisible(false)}>
            {multiLang?.cancel}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>

  )
}

export default AddModel
