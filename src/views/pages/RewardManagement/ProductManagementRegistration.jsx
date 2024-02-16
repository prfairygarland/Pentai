import {
  CButton,
  CFormInput,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { postApi } from 'src/utils/Api'
import { API_ENDPOINT } from 'src/utils/config'
import { enqueueSnackbar } from 'notistack'

const ProductManagementRegistration = ({ show = false, setShow, productData }) => {
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [uploadedImage, setUploadedImage] = useState('')

  const closeHandler = () => {
    setShow(false)
  }

  const saveHandler = async () => {
    const formData = new FormData()
    formData.append('images', uploadedImage)
    const changedImage = await postApi(API_ENDPOINT.uploadImage, formData)
    const imagePath = await changedImage?.data?.data[0]?.path
    const body = {
      name: title,
      price: price,
      image: imagePath,
    }
    try {
      const res = await postApi(API_ENDPOINT.createRewardProduct, body)
      if (res?.data?.status === 201) {
        enqueueSnackbar(`Product saved successfully!`, { variant: 'success' })
        setShow(false)
      } else {
        enqueueSnackbar(`Enter all fields`, { variant: 'error' })
      }
    } catch (error) {
      enqueueSnackbar(`Something Went wrong!`, { variant: 'error' })
    }
  }

  const cancelHandler = () => {
    setShow(false)
  }

  useEffect(() => {
    setTitle('')
    setPrice('')
    setUploadedImage('')
  }, [show])

  return (
    <CModal
      alignment="center"
      backdrop="static"
      visible={show}
      size="lg"
      onClose={() => closeHandler()}
      aria-labelledby="LiveDemoExampleLabel"
    >
      <CModalHeader onClose={() => closeHandler()} style={{ borderWidth: 0 }}>
        <CModalTitle>Product</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div className="card-body">
          <div className="formWraper">
            <div className="form-outline form-white  d-flex ">
              <div className="formWrpLabel">
                <label className="fw-bolder ">Title</label>
              </div>
              <div className="formWrpInpt">
                <div className="d-flex formradiogroup mb-2 gap-3">
                  <CFormInput
                    type="text"
                    placeholder="Enter title"
                    name="title"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value.substring(0, 46))
                    }}
                  />
                  <span className="txt-byte-information justify-content-start">
                    {title.length} / 46
                  </span>
                </div>
              </div>
            </div>
            <div className="form-outline form-white  d-flex ">
              <div className="formWrpLabel">
                <label className="fw-bolder ">Price</label>
              </div>
              <div className="formWrpInpt">
                <div className="d-flex formradiogroup mb-2 gap-3">
                  <CFormInput
                    type="text"
                    placeholder="Enter price"
                    name="price"
                    value={price}
                    onChange={(e) => {
                      setPrice(e.target.value.substring(0, 4))
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="form-outline form-white  d-flex ">
              <div className="formWrpLabel">
                <label className="fw-bolder ">Image</label>
              </div>
              <div className="formWrpInpt ">
                <div className="upload-img-btn-and-info flex-column">
                  <div className="upload-container-btn">
                    <label
                      className="btn btn-primary"
                      style={{ paddingLeft: 20 }}
                      htmlFor="imageFiles"
                    >
                      Upload
                      <input
                        type="file"
                        name="imageFiles"
                        id="imageFiles"
                        style={{ display: 'none' }}
                        accept=".png, .jpg, .jpeg, .gif"
                        onChange={(e) => setUploadedImage(e.target.files[0])}
                      />
                    </label>
                  </div>
                  {uploadedImage && (
                    <div className="upload-images-container uploadImgWrap">
                      <div className="thubmnail-img-container">
                        <img src={URL.createObjectURL(uploadedImage)} alt="" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CModalBody>
      <CModalFooter className="d-flex justify-content-center gap-2">
        <CButton onClick={cancelHandler}>Cancel</CButton>
        <CButton onClick={saveHandler}>Save</CButton>
      </CModalFooter>
    </CModal>
  )
}

export default ProductManagementRegistration
