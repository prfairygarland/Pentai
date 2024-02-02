import { cilInfo } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CButton,
  CCol,
  CFormCheck,
  CFormInput,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'
import { enqueueSnackbar } from 'notistack'
import React, { useEffect, useState } from 'react'
import Loader from 'src/components/common/Loader'
import { deleteApi, getApi, postApi, putApi } from 'src/utils/Api'
import { API_ENDPOINT } from 'src/utils/config'

const AddBuilding = ({ setModal, getMod, Modal, removeIds, buildingId, getVal }) => {
  const [deleteVisible, setDeleteVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [searchTxt, setSearchTxt] = useState('')
  const [filteredEquipments, setFilteredEquipments] = useState([])
  const [addBuildingData, setAddBuildingData] = useState({
    name: '',
    associatedRooms: 0,
    visibility: true,
    allEquipments: [],
  })

  useEffect(() => {
    if (buildingId !== null) {
      getData(buildingId)
    } else {
      setAddBuildingData({
        name: '',
        associatedRooms: 0,
        visibility: true,
      })
      getAllEquipments()
    }
  }, [buildingId])

  const getAllEquipments = async (searchTxtArg = '') => {
    try {
      setSearchTxt(searchTxtArg)
      let url = API_ENDPOINT.get_all_equipments
      if (searchTxtArg) {
        url += '?search=' + searchTxtArg
      }
      const response = await getApi(url)

      console.log(response)
      if (response?.status === 200) {
        if (!searchTxtArg) {
          setAddBuildingData((prev) => ({ ...prev, allEquipments: response?.data }))
          setFilteredEquipments([])
        } else {
          setFilteredEquipments(response?.data)
        }
      }
      if (response?.status === 204 && searchTxtArg !== '') {
        setFilteredEquipments([{ id: 'new', name: 'No Equipment Found!' }])
      }
    } catch (error) {
      console.log(error)
    }
  }

  const setEquipmentsHandler = (obj) => {
    const alreadyAddEquipments = addBuildingData?.allEquipments.filter((item) => item.id === obj.id)
    if (alreadyAddEquipments.length > 0) {
      enqueueSnackbar('Already Added', { variant: 'success' })
    } else {
      if (obj.id !== 'new') {
        setAddBuildingData((prev) => ({
          ...prev,
          allEquipments: [...addBuildingData?.allEquipments, obj],
        }))
      }
    }
  }

  const addNewEquipment = async () => {
    try {
      const res = await postApi(API_ENDPOINT.add_new_equipment, {
        name: searchTxt,
        visibility: 'visible',
      })
      if (res.status === 200) {
        setSearchTxt('')
        getAllEquipments()
      } else {
        enqueueSnackbar(`${res?.data?.msg}`, { variant: 'error' })
        setIsLoading(false)
      }
    } catch (error) {
      setIsLoading(false)
      console.log(error)
    }
  }

  const removeEquipment = (id = '') => {
    if (id) {
      const remainingEquipments = addBuildingData?.allEquipments.filter((item) => item.id !== id)
      setAddBuildingData((prev) => ({ ...prev, allEquipments: remainingEquipments }))
    } else {
      setAddBuildingData((prev) => ({ ...prev, allEquipments: [] }))
    }
  }

  const getData = async (id) => {
    try {
      let url = API_ENDPOINT.get_meeting_building_details + `?id=${id}`
      const response = await getApi(url)

      if (response?.status === 200) {
        setAddBuildingData({
          name: response.data.name,
          visibility: response.data.visibility === 'visible' ? true : false,
          associatedRooms: response.data.associatedItem,
          allEquipments: response?.data?.buildingEquipment,
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  const deleteBuilding = async () => {
    try {
      let url = API_ENDPOINT.delete_meeting_building
      const response = await deleteApi(url, `?id=${buildingId}`)
      if (response?.status === 200) {
        enqueueSnackbar('Delete succefully', { variant: 'success' })
        removeIds(null)
        getVal(null)
        setModal(!getMod)
      }
    } catch (error) {
      enqueueSnackbar('Something Went Wrong', { variant: 'error' })
      console.log(error)
    }
  }

  const handleInputChange = (e) => {
    setAddBuildingData((prev) => ({ ...prev, name: e.target.value }))
  }

  const saveBuilding = async () => {
    if (addBuildingData.name === '') {
      enqueueSnackbar('Please enter name', { variant: 'error' })
      return false
    }
    setIsLoading(true)
    try {
      let data = {
        name: addBuildingData.name,
        visibility: addBuildingData.visibility === true ? 'visible' : 'hide',
        equipments: JSON.stringify(addBuildingData?.allEquipments?.map((equip) => equip.id)),
      }

      if (buildingId) {
        data.id = buildingId
      }
      let res
      if (buildingId) {
        res = await putApi(API_ENDPOINT.update_meeting_building, data)
      } else {
        res = await postApi(API_ENDPOINT.create_meeting_building, data)
      }

      if (res.status === 200) {
        setAddBuildingData({
          name: '',
          associatedItem: 1,
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
        setModal(!getMod)
      } else {
        enqueueSnackbar(`${res?.data?.msg}`, { variant: 'error' })
        setIsLoading(false)
      }
    } catch (error) {
      setIsLoading(false)
      console.log(error)
    }
  }

  const cancelHandler = () => {
    try {
      setAddBuildingData({
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
      removeIds(null)
      getVal(null)
      setModal(!getMod)
    } catch (error) {
      setIsLoading(false)
      console.log(error)
    }
  }

  return (
    <div className="col-md-8 ps-4">
      {isLoading && <Loader />}
      <div>
        {buildingId && (
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="me-3">Location</h5>
            <CButton onClick={() => setDeleteVisible(true)} className="btn-black">
              Delete
            </CButton>
          </div>
        )}

        <div className="card-body">
          <div className="formWraper">
            <div className="form-outline form-white   d-flex ">
              <div className="formWrpLabel">
                <label className="fw-bolder ">Location Name</label>
              </div>
              <div className="formWrpInpt d-flex">
                <div className="d-flex formradiogroup mb-2 gap-3">
                  <CFormInput
                    type="text"
                    placeholder=""
                    name="name"
                    value={addBuildingData.name}
                    onChange={(e) => {
                      handleInputChange(e)
                    }}
                  />
                </div>
                <span className="txt-byte-information">
                  {addBuildingData.name.length} / 26 byte
                </span>
              </div>
            </div>
            <div className="form-outline form-white   d-flex ">
              <div className="formWrpLabel">
                <label className="fw-bolder ">Associated Rooms</label>
              </div>
              <div className="formWrpInpt d-flex">
                <div className="d-flex formradiogroup mb-2 gap-3">
                  <CFormInput
                    type="number"
                    placeholder=""
                    name="associatedRooms"
                    min={0}
                    value={addBuildingData.associatedRooms}
                    disabled={true}
                  />
                </div>
              </div>
            </div>
            <div className="d-flex col-md-12">
              <div className="form-outline form-white d-flex w-100">
                <div className="formWrpLabel">
                  <label className="fw-bolder ">Default Settings</label>
                </div>
              </div>
            </div>
            <div className="d-flex col-md-12">
              <div className="form-outline form-white d-flex w-100">
                <div className="formWrpLabel">
                  <label className="fw-bolder ">Equipments</label>
                </div>
                <div className="formWrpInpt">
                  <div className="d-flex w-100 mt-4">
                    <CCol xs="auto" className="w-75 me-3">
                      <CFormInput
                        type="text"
                        id="inputPassword2"
                        onChange={(e) => getAllEquipments(e.target.value)}
                        placeholder="Please enter equipment name"
                        value={searchTxt}
                      />
                      {filteredEquipments.length > 0 && (
                        <ul className="p-2">
                          {filteredEquipments.map((item) => (
                            <li
                              className="p-2"
                              key={item.id}
                              onClick={() => setEquipmentsHandler(item)}
                            >
                              <strong> {item.name}</strong>
                            </li>
                          ))}
                        </ul>
                      )}
                    </CCol>
                    <CCol xs="auto">
                      <CButton type="submit" onClick={addNewEquipment} className="mb-3 btn-primary">
                        Add
                      </CButton>
                    </CCol>
                  </div>
                  {console.log(
                    'addBuildingData?.allEquipments :: ',
                    addBuildingData?.allEquipments,
                  )}
                  <div className="d-flex w-100 mt-4 flex-column">
                    <div className="prowordsection">
                      <div className="d-flex flex-wrap">
                        {addBuildingData?.allEquipments &&
                          addBuildingData?.allEquipments?.map((equipDetails, index) => (
                            <div className="prohibitword m-2" key={0}>
                              <p>{equipDetails?.name}&nbsp;&nbsp;&nbsp;</p>
                              <button onClick={() => removeEquipment(equipDetails?.id)}>
                                <i className="icon-close"></i>
                              </button>
                            </div>
                          ))}
                      </div>
                    </div>
                    <div className="d-flex justify-content-end mt-2">
                      <CCol xs="auto">
                        <CButton
                          type="submit"
                          onClick={() => removeEquipment()}
                          className="mb-3 btn-black"
                        >
                          Delete All
                        </CButton>
                      </CCol>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex col-md-12">
              <div className="form-outline form-white d-flex w-100">
                <div className="formWrpLabel">
                  <label className="fw-bolder ">Visibility</label>
                </div>
                <div className="push-notification-container gap-3">
                  <CFormCheck
                    type="radio"
                    name="visibility"
                    id="exampleRadios1"
                    label="Visible"
                    defaultChecked={addBuildingData.visibility}
                    onClick={() => setAddBuildingData((prev) => ({ ...prev, visibility: true }))}
                    value={true}
                  />
                  <CFormCheck
                    type="radio"
                    name="visibility"
                    id="exampleRadios2"
                    label="Hide"
                    defaultChecked={!addBuildingData.visibility}
                    onClick={() => setAddBuildingData((prev) => ({ ...prev, visibility: false }))}
                    value={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="d-flex gap-3">
          <CIcon icon={cilInfo} size="lg" />
          <p>
            Values you set here will automatically apply to all lower categories as the default
            settings.
          </p>
        </div>
        <div className="mt-2">
          <p>
            But, you can also customize the settings for each subcategory separately on their own
            settings page.
          </p>
        </div>
      </div>
      <div className="d-flex justify-content-center gap-3 my-3">
        <CButton onClick={() => cancelHandler()} className="btn-black">
          Cancel
        </CButton>
        <CButton onClick={() => saveBuilding()}>{buildingId ? 'Update' : 'Save'}</CButton>
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
          <p>
            Are you sure you want to delete this building?
            <br />
            All floors and rooms belonging will be deleted.
          </p>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={() => deleteBuilding()}>
            Delete
          </CButton>
          <CButton color="secondary" onClick={() => setDeleteVisible(false)}>
            Cancel
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default AddBuilding
