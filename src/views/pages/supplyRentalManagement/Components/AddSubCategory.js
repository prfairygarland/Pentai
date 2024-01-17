import { CButton, CFormCheck, CFormInput, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import { enqueueSnackbar } from 'notistack'
import React, { useEffect, useState } from 'react'
import Loader from 'src/components/common/Loader'
import { deleteApi, getApi, postApi, putApi } from 'src/utils/Api'
import { API_ENDPOINT } from 'src/utils/config'

const AddSubCategory = ({ setModal, getMod, Modal, getMainSubCatId, getSubCatId, removeSubCatIds }) => {
  console.log('get Id =>', getMainSubCatId);

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

      console.log('test responce =>', response.data);

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

    console.log('key name =>', keyName);
    console.log('value =>', value);

    if (keyName === 'name') {
      value = value.substring(0, 28)
    } else if (keyName === 'associatedItem') {
      value = value
    }
    setAddSubCategoryData((prev) => ({ ...prev, [keyName]: value }))
  }

  const saveSubCategory = async (type) => {
    console.log('type =>', type);
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

        console.log('responce =>', res);
        if (res.status === 200) {
          setAddSubCategoryData({
            name: '',
            associatedItem: 1,
            categoryId: null,
            visibility: true,
          })
          enqueueSnackbar(`It has been saved`, { variant: 'success' })
          setIsLoading(false)
          removeSubCatIds(null)
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

      console.log('test responce =>', response);
      if (response?.status === 200) {
        // setUserInfoPopup(true)
        enqueueSnackbar('Delete succefully', { variant: 'success' })
        removeSubCatIds(null)
        // Modal('allList')
        setModal(!getMod)
      }
    } catch (error) {
      enqueueSnackbar('Something Went Wrong', { variant: 'error' })
      console.log(error)
    }
  }

  return (
 
      <div  className='col-md-9'>
        {isLoading && <Loader />}
        <div>
          <div className='d-flex justify-content-end'>
            <CButton onClick={() => setDeleteVisible(true)}>Delete</CButton>
          </div>
          <div className="dropdown-container mb-2">
            <h5 className="me-3">Subcategory</h5>
          </div>
          <div className="card-body">
            <div className="formWraper">
              <div className="form-outline form-white   d-flex ">
                <div className="formWrpLabel" >
                  <label className="fw-bolder ">
                    Subcategory Name
                  </label>
                </div>
                <div className="formWrpInpt d-flex">
                  <div className="d-flex formradiogroup mb-2 gap-3">
                    <CFormInput
                      type="text"
                      placeholder=""
                      name="name"
                      value={addSubCategoryData.name}
                      onChange={(e) => {
                        handleInputChange(e)
                      }}
                    />
                  </div>
                  <span className="txt-byte-information">0 / 24 byte</span>
                </div>
              </div>
              <div className="d-flex col-md-12">
                <div className="form-outline form-white d-flex w-100">
                  <div className="formWrpLabel" >
                    <label className="fw-bolder ">Visibility</label>
                  </div>
                  <div className="d-flex gap-2 ms-2">
                    <CFormCheck type="radio" name="visibility" id="exampleRadios1" label="Visible"
                      defaultChecked={addSubCategoryData.visibility}
                      onClick={() => setAddSubCategoryData((prev) => ({ ...prev, visibility: true }))}
                      value={true}
                    />
                    <CFormCheck type="radio" name="visibility" id="exampleRadios2" label="Hide"
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
                    Associated Items
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
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '5%', gap: 10 }}>
          <CButton onClick={() => saveSubCategory('cancle')} style={{ marginRight: '2%', background: '#ccc', border: 'none' }}>Cancel</CButton>
          <CButton onClick={() => saveSubCategory('save')} >Save</CButton>
        </div>
        <CModal
          backdrop="static"
          visible={deleteVisible}
          onClose={() => setDeleteVisible(false)}
          aria-labelledby="StaticBackdropExampleLabel"
        >
          <CModalHeader>
            <CModalTitle id="StaticBackdropExampleLabel">Delete</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <p>Are you sure you want to delete this category?
              <br />
              All categories and items belonging will be deleted.</p>
          </CModalBody>
          <CModalFooter>
            <CButton color="primary" onClick={() => deleteCategory()}>Delete</CButton>
            <CButton color="secondary" onClick={() => setDeleteVisible(false)}>
              Cancel
            </CButton>
          </CModalFooter>
        </CModal>
      </div>
    
  )
}

export default AddSubCategory
