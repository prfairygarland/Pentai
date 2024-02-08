import { CButton, CFormCheck, CFormInput, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import { enqueueSnackbar } from 'notistack'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Loader from 'src/components/common/Loader'
import { deleteApi, getApi, postApi, putApi } from 'src/utils/Api'
import { API_ENDPOINT } from 'src/utils/config'

const AddSubCategory = ({ setModal, getMod, Modal, getMainSubCatId, getSubCatId, removeSubCatIds, getVal, setCat, setSubIcon }) => {


  const { t, i18n } = useTranslation();
  const translationObject = i18n.getDataByLanguage(i18n.language);
  const multiLang = translationObject?.translation?.supplyRentalManagementAllSupplies

  const [deleteVisible, setDeleteVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false);

  const [addSubCategoryData, setAddSubCategoryData] = useState({
    name: '',
    categoryId: '',
    associatedItem: 1,
    visibility: true
  })

  useEffect(() => {
    if (getSubCatId !== null) {
      getData(getSubCatId)
    } else {
      setAddSubCategoryData({
        name: '',
        associatedItem: 1,
        visibility: true,
      })
    }
  }, [getSubCatId])

  const getData = async (id) => {
    try {
      let url = API_ENDPOINT.get_sub_category_details + `?id=${id}`
      const response = await getApi(url)


      if (response?.status === 200) {
        setAddSubCategoryData({
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
      value = value.substring(0, 24)
    } else if (keyName === 'associatedItem') {
      value = value
    }
    setAddSubCategoryData((prev) => ({ ...prev, [keyName]: value }))
  }

  const saveSubCategory = async (type) => {
    if (type === 'save') {
      if (addSubCategoryData.name === '') {
        enqueueSnackbar('Please enter name', { variant: 'error' })
        return false
      }
      if (addSubCategoryData.associatedItem < 1) {
        enqueueSnackbar('Please enter valid associate Item', { variant: 'error' })
        return false
      }

      setIsLoading(true)
      try {

        let data = {
          name: addSubCategoryData.name,
          categoryId: getMainSubCatId,
          associatedItem: addSubCategoryData.associatedItem,
          visibility: addSubCategoryData.visibility === true ? 'visible' : 'hide',
        }

        let res;

        if (getSubCatId && getMainSubCatId) {
          data['id'] = getSubCatId
          data['categoryId'] = getMainSubCatId

          res = await putApi(API_ENDPOINT.update_sub_categoriy, data)
        } else {
          res = await postApi(API_ENDPOINT.add_sub_category, data)
        }

        // const

        if (res.status === 200) {
          setAddSubCategoryData({
            name: '',
            associatedItem: 1,
            categoryId: null,
            visibility: true,
          })
          if (res.data.status === 409) {
            enqueueSnackbar(`${res?.data?.msg}`, { variant: 'error' })
          } else {
            enqueueSnackbar(`It has been saved`, { variant: 'success' })
          }
          setIsLoading(false)
          removeSubCatIds(null)
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
        setAddSubCategoryData({
          name: '',
          associatedItem: 1,
          categoryId: null,
          visibility: true,
        })
        setIsLoading(false)
        removeSubCatIds(null)
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
      let url = API_ENDPOINT.delete_sub_category
      const response = await deleteApi(url, `?id=${getSubCatId}`)

      if (response?.status === 200) {
        // setUserInfoPopup(true)
        enqueueSnackbar('Delete succefully', { variant: 'success' })
        removeSubCatIds(null)
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

    <div className='col-md-8'>
      {isLoading && <Loader />}
      <div>
        {getSubCatId !== null &&
        <div className='d-flex justify-content-between align-items-center mb-3'>
        <h4 className="me-3">{multiLang?.subCategory}</h4>
            <CButton onClick={() => setDeleteVisible(true)}  className='btn-black'>{multiLang?.delete}</CButton>
        </div>
        }
        
        <div className="card-body">
          <div className="formWraper">
            <div className="form-outline form-white   d-flex ">
              <div className="formWrpLabel" >
                <label className="fw-bolder ">
                  {multiLang?.subCategoryName}
                </label>
              </div>
              <div className="formWrpInpt d-flex">
                <div className="d-flex formradiogroup mb-2 gap-3">
                  <CFormInput
                    type="text"
                    placeholder={multiLang?.placeholder}
                    name="name"
                    value={addSubCategoryData.name}
                    onChange={(e) => {
                      handleInputChange(e)
                    }}
                  />
                </div>
                <span className="txt-byte-information"> {addSubCategoryData.name.length} / 24 {multiLang?.byte}</span>
              </div>
            </div>
            <div className="d-flex col-md-12">
              <div className="form-outline form-white d-flex w-100">
                <div className="formWrpLabel" >
                  <label className="fw-bolder ">{multiLang?.visibility}</label>
                </div>
                <div className="d-flex gap-2 ms-2">
                  <CFormCheck type="radio" name="visibility" id="exampleRadios1" label={multiLang?.visible}
                    defaultChecked={addSubCategoryData.visibility}
                    onClick={() => setAddSubCategoryData((prev) => ({ ...prev, visibility: true }))}
                    value={true}
                  />
                  <CFormCheck type="radio" name="visibility" id="exampleRadios2" label={multiLang?.hide}
                    defaultChecked={!addSubCategoryData.visibility}
                    onClick={() => setAddSubCategoryData((prev) => ({ ...prev, visibility: false }))}
                    value={false}
                  />
                </div>
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
                      value={addSubCategoryData.associatedItem}
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
      <div className='d-flex justify-content-center my-3 gap-4'>
        <CButton onClick={() => saveSubCategory('cancle')} className='btn-black'>{multiLang?.cancel}</CButton>
        <CButton onClick={() => saveSubCategory('save')} >{multiLang?.save}</CButton>
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

export default AddSubCategory
