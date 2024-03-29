import { CButton, CFormCheck, CFormInput, CFormSelect, CFormSwitch, CFormTextarea, CImage, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import { enqueueSnackbar } from 'notistack';
import React, { useEffect, useRef, useState } from 'react'
import DatePicker from 'react-date-picker';
import { useTranslation } from 'react-i18next';
import Loader from 'src/components/common/Loader';
import { deleteApi, getApi, postApi, putApi } from 'src/utils/Api';
import { ALL_CONSTANTS, API_ENDPOINT } from 'src/utils/config';


const AddItem = ({ getVal, setCat, setSubIcon, setModalIcon, setModal, getMod, modalName, supplyID, setMainIds, getItemId, removeItemIds, getCatId, setCatId, getSubCatId, setSubCatId, getModId, setModId }) => {

  const { t, i18n } = useTranslation();
  const translationObject = i18n.getDataByLanguage(i18n.language);
  const multiLang = translationObject?.translation?.supplyRentalManagementAllSupplies

  const [deleteVisible, setDeleteVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [toggleState, setToggleState] = useState(false);
  const [addItemData, setAddItemData] = useState({
    name: modalName,
    itemNumber: null,
    categoryId: null,
    subCategoryId: null,
    availabilityCount: null,
    images: '',
    itemStatus: '',
    registeredDate: null,
    customSetting: toggleState,
    rentalDuration: 1,
    providedOption: true,
    pickUpAndReturn: '',
    reasonRemarks: '',
    rentalGuideDescription: '',
    visibility: true,
    supplyModelId: null
  })
  const [selectedImage, setSelectedImage] = useState(null);
  const [showSelectedImage, setShowSelectedImage] = useState(null);
  const [getImage, setImage] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    if (supplyID !== null) {
      getData(supplyID)
    }
  }, [supplyID])

  useEffect(() => {
    if (getItemId !== null) {
      getItemData(getItemId)
    } else {
      setAddItemData({
        name: modalName,
        itemNumber: null,
        categoryId: null,
        subCategoryId: null,
        availabilityCount: null,
        images: '',
        itemStatus: '',
        registeredDate: null,
        // customSetting: toggleState,
        // rentalDuration: 1,
        // providedOption: true,
        // pickUpAndReturn: '',
        // reasonRemarks: '',
        // rentalGuideDescription: '',
        // visibility: true,
        supplyModelId: null
      })
    }
  }, [getItemId])

  const handleInputChange = (e) => {
    const keyName = e.target.name
    let value = e.target.value

    if (keyName === 'itemNumber') {
      value = value
    } else if (keyName === 'itemStatus') {
      value = value
    } else if (keyName === 'rentalDuration') {
      value = value
    } else if (keyName === 'pickUpAndReturn') {
      value = value
    } else if (keyName === 'reasonRemarks') {
      value = value
    } else if (keyName === 'rentalGuideDescription') {
      value = value
    }
    setAddItemData((prev) => ({ ...prev, [keyName]: value }))
  }

  const handleDateChange = async (date) => {
    // console.log('startDate =>', date);
    const formattedDate = date?.toISOString();
    setAddItemData((prev) => ({ ...prev, ['registeredDate']: formattedDate }))

  };

  const deleteSupplyType = async () => {
    try {
      let url = API_ENDPOINT.delete_item
      const response = await deleteApi(url, `?id=${getItemId}`)

      if (response?.status === 200) {
        // setUserInfoPopup(true)
        enqueueSnackbar('Delete succefully', { variant: 'success' })
        removeItemIds(null)
        setMainIds(null)
        setCatId(null)
        setSubCatId(null)
        setModId(null)
        setModal(!getMod)
        getVal(null)
        setCat(null)
        setSubIcon(null)
        setModalIcon(null)

      }
    } catch (error) {
      enqueueSnackbar('Something Went Wrong', { variant: 'error' })
      console.log(error)
    }
  }

  // const handleDeadlineDate = (event) => {
  //   let d = new Date(event),
  //     month = '' + (d.getMonth() + 1),
  //     day = '' + d.getDate(),
  //     year = d.getFullYear()
  //   if (month.length < 2) month = '0' + month
  //   if (day.length < 2) day = '0' + day
  //   // setDeadlineDate([year, month, day].join('-'))
  // }
  const handleToggleChange = () => {
    setToggleState((prevState) => !prevState);
  };

  const getData = async (id) => {

    try {
      let url = API_ENDPOINT.get_supply_type_details + `?id=${id}`
      const response = await getApi(url)



      if (response?.status === 200) {
        setSelectedImage(null)
        setShowSelectedImage(null)
        setAddItemData({
          name: modalName,
          itemNumber: '',
          categoryId: null,
          subCategoryId: null,
          availabilityCount: null,
          images: '',
          itemStatus: '',
          registeredDate: null,
          customSetting: toggleState,
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

  // const getImageBlob = async (file) => {
  //   // Using fetch to get the image blob
  //   const response = await fetch(file);
  //   const blob = await response.blob();
  //   return blob;

  // };

  async function urlToBlob(url) {
    const response = await fetch(url)
    const blob = await response.blob()
    return blob
  }

  const convertImageToFiles = async (val) => {
    try {
      const blob = await urlToBlob(val)
      const fileName = val

      return new File([blob], fileName, { type: blob.type })

    } catch (error) {
      console.error('Error fetching and converting image:', error);
    }
  }

  const getItemData = async (id) => {
    try {
      let url = API_ENDPOINT.get_item_details + `?id=${id}`
      const response = await getApi(url)


      if (response?.status === 200) {
        // setShowSelectedImage('https://ptkapi.experiencecommerce.com' + response.data.image)
        // setShowSelectedImage(response.data.image)
        setShowSelectedImage(ALL_CONSTANTS.BASE_URL + response.data.image)

        setAddItemData({
          name: response.data.modelName,
          itemNumber: response.data.itemNumber,
          categoryId: response.data.categoryId,
          subCategoryId: response.data.subCategoryId,
          availabilityCount: response.data.availabilityCount,
          itemStatus: response.data.itemStatus,
          registeredDate: response.data.registeredDate,
          customSetting: response.data.customSetting === 'no' ? setToggleState(false) : setToggleState(true),
          rentalDuration: response.data.rentalDuration,
          providedOption: response.data.providedOption === 'visible' ? true : false,
          pickUpAndReturn: response.data.pickUpAndReturn,
          reasonRemarks: response.data.reasonRemarks,
          rentalGuideDescription: response.data.rentalGuideDescription,
          visibility: response.data.visibility === 'visible' ? true : false,
          supplyModelId: response.data.supplyModelId

        })

        // setMainCategoryData(response?.data)
        // setUserInfoPopup(true)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleImageChangeNew = (e) => {
    inputRef.current.click()
  }

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file)

    // Check if a file is selected and if it's either a JPG or PNGimage
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setShowSelectedImage(reader.result);
      };

      reader.readAsDataURL(file);
    } else {
      // Handle invalid file type
      console.warn('Please select a valid JPG or PNG file.');
    }
  };

  const saveSupplyType = async (type) => {



    if (type === 'save') {

      if (selectedImage === null && showSelectedImage === null) {
        enqueueSnackbar('Please select image', { variant: 'error' })
        return false
      }
      if (addItemData.itemNumber === null || addItemData.itemNumber === undefined || addItemData.itemNumber === '') {
        enqueueSnackbar('Please enter item number', { variant: 'error' })
        return false
      }
      if (addItemData.itemStatus === '' || addItemData.itemStatus === undefined) {
        enqueueSnackbar('Please select item status', { variant: 'error' })
        return false
      }

      if (addItemData.registeredDate === null || addItemData.registeredDate === undefined) {
        enqueueSnackbar('Please select resgister Date', { variant: 'error' })
        return false
      }

      if (addItemData.rentalDuration < 1) {
        enqueueSnackbar('Please enter valid Rental Duration', { variant: 'error' })
        return false
      }

      if (addItemData.pickUpAndReturn === '') {
        enqueueSnackbar('Please enter Point of pick and return', { variant: 'error' })
        return false
      }

      if (addItemData.reasonRemarks === '') {
        enqueueSnackbar('Please enter Reason remarks guide text', { variant: 'error' })
        return false
      }
      if (addItemData.rentalGuideDescription === '') {
        enqueueSnackbar('Please enter Supply Rental guide description', { variant: 'error' })
        return false
      }




      setIsLoading(true)
      try {
        const checkData = await convertImageToFiles(showSelectedImage)
        let data = {
          name: addItemData.name,
          itemNumber: addItemData.itemNumber,
          categoryId: addItemData.categoryId == null ? getCatId : addItemData.categoryId,
          subCategoryId: addItemData.subCategoryId == null ? getSubCatId : addItemData.subCategoryId,
          availabilityCount: 5,
          images: selectedImage !== null ? selectedImage : (checkData),
          itemStatus: addItemData.itemStatus,
          customSetting: toggleState === true ? 'yes' : 'no',
          rentalDuration: addItemData.rentalDuration,
          registeredDate: addItemData.registeredDate,
          providedOption: addItemData.providedOption === true ? 'visible' : 'hide',
          pickUpAndReturn: addItemData.pickUpAndReturn,
          reasonRemarks: addItemData.reasonRemarks,
          rentalGuideDescription: addItemData.rentalGuideDescription,
          visibility: addItemData.visibility === true ? 'visible' : 'hide',
          supplyModelId: addItemData.supplyModelId == null ? getModId : addItemData.supplyModelId
        }
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          formData.append(key, value);
        });

        let res;

        if (getItemId) {
          data['id'] = getItemId
          formData.append('id', getItemId);
          res = await putApi(API_ENDPOINT.update_item, formData)
        } else {
          res = await postApi(API_ENDPOINT.add_item, formData)
        }

        console.log('responce =>', res);
        if (res.status === 200) {
          setAddItemData({
            name: addItemData.name,
            itemNumber: null,
            categoryId: null,
            subCategoryId: null,
            availabilityCount: null,
            images: '',
            itemStatus: '',
            registeredDate: null,
            customSetting: toggleState,
            rentalDuration: 1,
            providedOption: true,
            pickUpAndReturn: '',
            reasonRemarks: '',
            rentalGuideDescription: '',
            visibility: true,
            supplyModelId: null
          })
          if (res.data.status === 409) {
            enqueueSnackbar(`${res?.data?.msg}`, { variant: 'error' })
          } else {
            enqueueSnackbar(`It has been saved`, { variant: 'success' })
          }
          setIsLoading(false)
          removeItemIds(null)
          setMainIds(null)
          setCatId(null)
          setSubCatId(null)
          setModId(null)
          setModal(!getMod)
          getVal(null)
          setCat(null)
          setSubIcon(null)
          setModalIcon(null)
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
        setToggleState(false)
        setAddItemData({
          name: modalName,
          itemNumber: null,
          categoryId: null,
          subCategoryId: null,
          availabilityCount: null,
          images: '',
          itemStatus: '',
          registeredDate: null,
          customSetting: toggleState,
          rentalDuration: 1,
          providedOption: true,
          pickUpAndReturn: '',
          reasonRemarks: '',
          rentalGuideDescription: '',
          visibility: true,
          supplyModelId: null
        })
        setIsLoading(false)
        removeItemIds(null)
        setMainIds(null)
        setCatId(null)
        setSubCatId(null)
        setModId(null)
        setModal(!getMod)
        getVal(null)
        setCat(null)
        setSubIcon(null)
        setModalIcon(null)
      } catch (error) {
        setIsLoading(false)
        console.log(error)
      }
    }

  }

  return (

    <div className='col-md-8'>
      {isLoading && <Loader />}
      <div className='addItemWrp'>
        {getItemId !== null &&
          <div className='d-flex justify-content-between align-items-center mb-3'>
          <h4 className="me-3">{multiLang?.itemNumber}</h4>
            <CButton onClick={() => setDeleteVisible(true)} className='btn-black'>{multiLang?.delete}</CButton>
          </div>
        }
       
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
                  <p>{addItemData.name}</p>
                </div>
              </div>
            </div>
            <div className="form-outline form-white   d-flex ">
              <div className="formWrpLabel" >
                <label className="fw-bolder ">
                  {multiLang?.itemNumber}
                </label>
              </div>
              <div className="formWrpInpt d-flex">
                <div className="d-flex formradiogroup mb-2 gap-3">
                  <CFormInput
                    type="text"
                    placeholder={multiLang?.placeholder}
                    name='itemNumber'
                    value={addItemData.itemNumber}
                    onChange={(e) => {
                      handleInputChange(e)
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="form-outline form-white d-flex ">
              <div className='d-flex col-md-6'>
                <div className="formWrpLabel" >
                  <label className="fw-bolder ">
                    {multiLang?.itemStatus}
                  </label>
                </div>
                <div className="formWrpInpt d-flex w-100">
                  <div className="d-flex formradiogroup mb-2 gap-3 w-100">
                    <CFormSelect
                      name='itemStatus'
                      value={addItemData.itemStatus}
                      options={[
                        { label: multiLang?.select, value: '' },
                        {
                          label: multiLang?.available, value: 'available'
                        },
                        {
                          label: multiLang?.unAvailable, value: 'unAvailable'
                        },
                      ]}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
              <div className='d-flex col-md-6'>
                <div className="formWrpLabel " >
                  <label className="fw-bolder ">
                    {multiLang?.itemRegisteredDate}
                  </label>
                </div>
                <div className="formWrpInpt d-flex w-100">
                  <div className="d-flex formradiogroup gap-3 w-100">
                    <DatePicker value={addItemData.registeredDate} onChange={handleDateChange} />
                  </div>
                </div>
              </div>
            </div>
            <div className="form-outline form-white   d-flex ">
              <div className="formWrpLabel">
                <label className="fw-bolder ">
                  {multiLang?.itemImage}
                </label>
              </div>
              <div className="formWrpInpt d-flex">
                <div style={{ width: '180px', overflow: 'hidden', marginBottom: '5%' }} >
                  {showSelectedImage != null ? <CImage alt='' crossorigin="anonymous" src={showSelectedImage} style={{ height: '100%', width: '100%' }} /> : <img src='https://www.beelights.gr/assets/images/empty-image.png' style={{ height: '100%', width: '100%' }} />}
                  <input style={{ display: 'none' }} type="file" name="upload" accept=".png, .jpg, .jpeg" ref={inputRef} onChange={handleImageChange} />
                </div>
                <div className='ms-4'>
                  <ul>
                    <li>※ {multiLang?.imageUploadMsg}</li>
                    <li>{multiLang?.imageSize} : 00</li>
                    <li>{multiLang?.fileType} : {multiLang?.imageFileType}</li>
                  </ul>
                  <button className='mt-2 btn btn-primary'  onClick={handleImageChangeNew}>{multiLang?.upload}</button>
                </div>
              </div>
            </div>
            <div className="form-outline formWrpLabel form-white d-flex justify-content-end bg-light">
              <p style={{ padding: '2%' }}>{multiLang?.customSettings}</p>
              <CFormSwitch
                className="mx-1 me-2 mt-1"
                color="success"
                shape="pill"
                variant="opposite"
                checked={toggleState}
                onChange={handleToggleChange}
              />
            </div>

            <div style={!toggleState ? { pointerEvents: 'none', opacity: 0.6 } : null}>
              <div className="form-outline form-white  d-flex ">
                <div className="formWrpLabel" >
                  <label className="fw-bolder ">
                    {multiLang?.rentalDuration}
                  </label>
                </div>
                <div className="formWrpInpt">
                  <div className="d-flex formradiogroup mb-2 align-items-center  justify-content-center gap-5">
                    <p>
                      {multiLang?.maxRentableWeeks}
                    </p>
                    <p>
                      <CFormInput placeholder='0' type='number' name='rentalDuration'
                        value={addItemData.rentalDuration}
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
                      defaultChecked={addItemData.visibility}
                      onClick={() => setAddItemData((prev) => ({ ...prev, visibility: true }))}
                      value={true}
                    />
                    <CFormCheck type="radio" name="visibility" id="exampleRadios2" label={multiLang?.hide}
                      defaultChecked={!addItemData.visibility}
                      onClick={() => setAddItemData((prev) => ({ ...prev, visibility: false }))}
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
                      defaultChecked={addItemData.providedOption}
                      onClick={() => setAddItemData((prev) => ({ ...prev, providedOption: true }))}
                      value={true}
                    />
                    <CFormCheck type="radio" name="providedOption" id="exampleRadios2" label={multiLang?.hide}
                      defaultChecked={!addItemData.providedOption}
                      onClick={() => setAddItemData((prev) => ({ ...prev, providedOption: false }))}
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
                      value={addItemData.pickUpAndReturn}
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
                      value={addItemData.reasonRemarks}
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
                      value={addItemData.rentalGuideDescription}
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
      </div>
      <div className='d-flex justify-content-center align-items-center gap-3 my-3'>
        <CButton onClick={() => saveSupplyType('cancle')}  className='btn-black'>{multiLang?.cancel}</CButton>
        <CButton onClick={() => saveSupplyType('save')}>{multiLang?.save}</CButton>
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
          <p>{multiLang?.deleteItem}</p>
        </CModalBody>
        <CModalFooter>
          <CButton className='btn-black' onClick={() => deleteSupplyType()}>{multiLang?.delete}</CButton>
          <CButton  onClick={() => setDeleteVisible(false)}>
            {multiLang?.cancel}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>

  )
}

export default AddItem
