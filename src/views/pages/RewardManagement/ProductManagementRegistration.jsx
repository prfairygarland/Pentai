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
import { ALL_CONSTANTS, API_ENDPOINT } from 'src/utils/config'
import { enqueueSnackbar } from 'notistack'

const ProductManagementRegistration = ({ show = false, setShow, productData, setProduct = '' }) => {
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [prodUploadedImage, setProdUploadedImage] = useState('')

  const closeHandler = () => {
    setTitle('')
    setPrice('')
    setProdUploadedImage('')
    setShow(false)
  }

  const updateHandler = () => {
    enqueueSnackbar(`Product updated successfully!`, { variant: 'success' })
    setTitle('')
    setPrice('')
    setProdUploadedImage('')
    setShow(false)
  }

  const saveHandler = async () => {
    const formData = new FormData()
    formData.append('images', prodUploadedImage)
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
        setTitle('')
        setPrice('')
        setProdUploadedImage('')
        setShow(false)
        if (setProduct) {
          setProduct(res?.data?.data?.productId)
        }
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

  async function urlToBlob(url) {
    const response = await fetch(url)
    const blob = await response.blob()
    return blob
  }

  const urlToFile = async (url) => {
    if (!url) return
    const blob = await urlToBlob(ALL_CONSTANTS.BASE_URL + url)
    const fileName = url
    return new File([blob], fileName, { type: blob.type })
  }

  const setProdData = async () => {
    setTitle(productData?.prodTitle)
    setPrice(productData?.prodPrice)
    const imagePath = await urlToFile(productData?.imagePath)
    setProdUploadedImage(imagePath)
  }
  useEffect(() => {
    if (productData && productData?.prodTitle) {
      setProdData()
      return
    }
    setTitle('')
    setPrice('')
    setProdUploadedImage('')
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
                <label className="fw-bolder ">Product Name</label>
              </div>
              <div className="formWrpInpt">
                <div className="d-flex formradiogroup mb-2 gap-3">
                  <CFormInput
                    type="text"
                    placeholder="Enter Name"
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
                    placeholder="Enter Number"
                    name="price"
                    value={price}
                    onChange={(e) => {
                      setPrice(e.target.value.substring(0, 4))
                    }}
                    style={{ width: 150 }}
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
                      htmlFor="prodImage"
                    >
                      Upload
                      <input
                        type="file"
                        name="prodImage"
                        id="prodImage"
                        style={{ display: 'none' }}
                        accept=".png, .jpg, .jpeg, .gif"
                        onChange={(e) => setProdUploadedImage(e.target.files[0])}
                      />
                    </label>
                  </div>
                  {prodUploadedImage && (
                    <div className="upload-images-container uploadImgWrap">
                      <div className="thubmnail-img-container">
                        <img src={URL.createObjectURL(prodUploadedImage)} alt="" />
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
        <CButton className="btn-black" onClick={cancelHandler}>
          Cancel
        </CButton>
        {productData && productData?.prodTitle && <CButton onClick={updateHandler}>Update</CButton>}
        {!productData?.prodTitle && <CButton onClick={saveHandler}>Save</CButton>}
      </CModalFooter>
    </CModal>
  )
}

export default ProductManagementRegistration
