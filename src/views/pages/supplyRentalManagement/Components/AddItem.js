import { CButton, CFormCheck, CFormInput, CFormSelect, CFormSwitch, CFormTextarea, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import React, { useEffect, useRef, useState } from 'react'
import DatePicker from 'react-date-picker';
import Loader from 'src/components/common/Loader';
import { getApi } from 'src/utils/Api';
import { API_ENDPOINT } from 'src/utils/config';


const AddItem = ({ modalName, supplyID }) => {

  const [deleteVisible, setDeleteVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [toggleState, setToggleState] = useState(false);
  const [addItemData, setAddItemData] = useState({
    name: modalName,
    itemNumber: null,
    categoryId: null,
    subCategoryId: null,
    availabilityCount: null,
    image: '',
    itemStatus: '',
    registeredDate: null,
    associatedItem: 1,
    rentalDuration: 1,
    providedOption: true,
    pickUpAndReturn: '',
    reasonRemarks: '',
    rentalGuideDescription: '',
    visibility: true,
  })
  const [selectedImage, setSelectedImage] = useState(null);
  const inputRef = useRef(null)

  useEffect(() => {
    if (supplyID !== null) {
      getData(supplyID)
    }
  }, [supplyID])

  const handleInputChange = (e) => {
    const keyName = e.target.name
    let value = e.target.value
    console.log('keyName =>', keyName);
    console.log('value =>', value);
    if (keyName === 'itemNumber') {
      value = value
    } else if (keyName === 'itemStatus') {
      value = value
    } else if (keyName === 'associatedItem') {
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

  const handleDeadlineDate = (event) => {
    let d = new Date(event),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear()
    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day
    // setDeadlineDate([year, month, day].join('-'))
  }
  const handleToggleChange = () => {
    setToggleState((prevState) => !prevState);
  };

  const getData = async (id) => {
    try {
      let url = API_ENDPOINT.get_supply_type_details + `?id=${id}`
      const response = await getApi(url)

      console.log('test responce =>', response.data);

      if (response?.status === 200) {
        setAddItemData({
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

  const handleImageChangeNew = (e) => {
    inputRef.current.click()
  }

  const handleImageChange = (event) => {
    console.log('check =>');
    const file = event.target.files[0];

    // Check if a file is selected and if it's either a JPG or PNG
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };

      reader.readAsDataURL(file);
    } else {
      // Handle invalid file type
      console.warn('Please select a valid JPG or PNG file.');
    }
  };

  return (
   
      <div className='col-md-9'>
        {isLoading && <Loader />}
        <div className='addItemWrp'>
          <div className='d-flex justify-content-end'>
            <CButton onClick={() => setDeleteVisible(true)}>Delete</CButton>
          </div>
          <div className="dropdown-container mb-2">
            <h5 className="me-3">Item Number</h5>
          </div>
          <div className="card-body">
            <div className="formWraper">
              <div className="form-outline form-white   d-flex ">
                <div className="formWrpLabel" >
                  <label className="fw-bolder ">
                    Model Name
                  </label>
                </div>
                <div className="formWrpInpt d-flex">
                  <div className="d-flex formradiogroup mb-2 gap-3">
                    <p>{modalName}</p>
                  </div>
                </div>
              </div>
              <div className="form-outline form-white   d-flex ">
                <div className="formWrpLabel" >
                  <label className="fw-bolder ">
                    Item Number
                  </label>
                </div>
                <div className="formWrpInpt d-flex">
                  <div className="d-flex formradiogroup mb-2 gap-3">
                    <CFormInput
                      type="text"
                      placeholder=""
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
                      Item Status
                    </label>
                  </div>
                  <div className="formWrpInpt d-flex w-100">
                    <div className="d-flex formradiogroup mb-2 gap-3 w-100">
                      <CFormSelect
                        
                        
                        name='itemStatus'
                        value={addItemData.itemStatus}
                        options={[
                          { label: 'select', value: '' },
                          {
                            label: 'Available', value: 'available'
                          },
                          {
                            label: 'Unavailable', value: 'unavailable'
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
                      Item Registered Date
                    </label>
                  </div>
                  <div className="formWrpInpt d-flex w-100">
                    <div className="d-flex formradiogroup gap-3 w-100">
                      <DatePicker 
                        // value={deadlineDate}
                        minDate={new Date()}
                        onChange={(event) => handleDeadlineDate(event)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="form-outline form-white   d-flex ">
                <div className="formWrpLabel">
                  <label className="fw-bolder ">
                    Item Image
                  </label>
                </div>
                <div className="formWrpInpt d-flex">
                  <div style={{ width: '180px', overflow: 'hidden', marginBottom: '5%' }} >
                    {selectedImage != null ? <img alt='' src={selectedImage} style={{ height: '100%', width: '100%' }} /> : <img alt='' src='https://www.beelights.gr/assets/images/empty-image.png' style={{ height: '100%', width: '100%' }} />}
                    <input style={{ display: 'none' }} type="file" name="upload" accept=".png, .jpg, .jpeg" ref={inputRef} onChange={handleImageChange} />
                  </div>
                  <div className='ms-4'>
                    <ul>
                      <li>※ You can upload 1 image only</li>
                      <li>Maximum File Size : 00</li>
                      <li>File type : png , jpg , jpeg , gif</li>
                    </ul>
                    <button className='mt-2' style={{ background: '#4f5d73', height: '40px', width: '80px', cursor: 'pointer', borderRadius: 8, color: 'white' }} onClick={handleImageChangeNew}>Upload</button>
                  </div>
                </div>
              </div>
              <div className="form-outline formWrpLabel form-white d-flex justify-content-end bg-light">
                <p style={{ padding: '2%' }}>Custom Settings</p>
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
                      Rental Duration
                    </label>
                  </div>
                  <div className="formWrpInpt">
                    <div className="d-flex formradiogroup mb-2 align-items-center  justify-content-center gap-5">
                      <p>
                        Max. Rentable Weeks
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
                      <label className="fw-bolder ">Visibility</label>
                    </div>
                    <div className="push-notification-container gap-3">
                      <CFormCheck type="radio" name="visibility" id="exampleRadios1" label="Visible"
                        defaultChecked={addItemData.visibility}
                        onClick={() => setAddItemData((prev) => ({ ...prev, visibility: true }))}
                        value={true}
                      />
                      <CFormCheck type="radio" name="visibility" id="exampleRadios2" label="Hide"
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
                      <label className="fw-bolder ">Request as provided option</label>
                    </div>
                    <div className="push-notification-container gap-3">
                      <CFormCheck type="radio" name="providedOption" id="exampleRadios1" label="Visible"
                        defaultChecked={addItemData.providedOption}
                        onClick={() => setAddItemData((prev) => ({ ...prev, providedOption: true }))}
                        value={true}
                      />
                      <CFormCheck type="radio" name="providedOption" id="exampleRadios2" label="Hide"
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
                      Point of pick and return
                    </label>
                  </div>
                  <div className="formWrpInpt">
                    <div className="d-flex formradiogroup mb-2 gap-3">
                      <CFormInput
                        type="text"
                        placeholder="Enter name, Location"
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
                      Reason remarks guide text
                    </label>
                  </div>
                  <div className="formWrpInpt">
                    <div className="d-flex formradiogroup mb-2 gap-3">
                      <CFormInput
                        type="text"
                        placeholder="Enter guide text"
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
                      Supply Rental guide description
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
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '5%', gap: 10 }}>
          <CButton style={{ marginRight: '2%', background: '#ccc', border: 'none' }}>Cancel</CButton>
          <CButton>Save</CButton>
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
            <CButton color="primary">Delete</CButton>
            <CButton color="secondary" onClick={() => setDeleteVisible(false)}>
              Cancel
            </CButton>
          </CModalFooter>
        </CModal>
      </div>
 
  )
}

export default AddItem
