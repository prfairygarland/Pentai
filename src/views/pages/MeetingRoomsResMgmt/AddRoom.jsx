import {
  CButton,
  CFormCheck,
  CFormInput,
  CFormSwitch,
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
import { ALL_CONSTANTS, API_ENDPOINT } from 'src/utils/config'
import './meetingRoomManagement.scss'

const AddRoom = ({ setModal, getMod, Modal, removeIds, buildingId, getVal, floorId, roomId }) => {
  const [deleteVisible, setDeleteVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [roomImage, setRoomImage] = useState('')
  const [customSetting, setCustomSetting] = useState(false)
  const [addRoomData, setAddRoomData] = useState({
    name: '',
    meetingRoomCode: '',
    capacity: 1,
    visibility: true,
    buildingEquipment: [
      {
        id: 1,
        name: 'TV',
        iconName: 'display',
      },
      {
        id: 2,
        name: 'Camera',
        iconName: 'camera',
      },
    ],
    roomEquipment: [
      {
        id: 1,
        name: 'TV',
        iconName: 'display',
      },
    ],
  })

  useEffect(() => {
    if (roomId) {
      getData(roomId)
    } else {
      setAddRoomData({
        name: '',
        meetingRoomCode: '',
        capacity: 1,
        visibility: true,
        roomEquipment: [],
      })
    }
    getEquipmentsFromBuildingId()
  }, [roomId])

  const getEquipmentsFromBuildingId = async () => {
    try {
      let url = API_ENDPOINT.get_equipments_from_building_id + `?id=${buildingId}`
      const response = await getApi(url)

      if (response?.status === 200) {
        setAddRoomData((prev) => ({ ...prev, buildingEquipment: response?.data }))
      }
    } catch (error) {
      console.log(error)
    }
  }
  const roomEquipmentChangeHandler = (equipmentObj) => {
    const alreadyCheckedEquipments = addRoomData?.roomEquipment.filter(
      (item) => item.id === equipmentObj.id,
    )
    if (alreadyCheckedEquipments.length === 0) {
      setAddRoomData((prev) => ({
        ...prev,
        roomEquipment: [...addRoomData?.roomEquipment, equipmentObj],
      }))
    } else {
      const remainingEquipments = addRoomData?.roomEquipment.filter(
        (item) => item.id !== equipmentObj.id,
      )
      setAddRoomData((prev) => ({ ...prev, roomEquipment: remainingEquipments }))
    }
  }
  async function urlToBlob(url) {
    const response = await fetch(url)
    const blob = await response.blob()
    return blob
  }

  const urlToFile = async (url) => {
    const blob = await urlToBlob(ALL_CONSTANTS.BASE_URL + url)
    const fileName = url
    return new File([blob], fileName, { type: blob.type })
  }

  const getData = async (id) => {
    try {
      let url = API_ENDPOINT.get_meeting_room_details + `?id=${id}`
      const response = await getApi(url)

      if (response?.status === 200) {
        const images = await urlToFile(response?.data?.image)
        setRoomImage(images)
        setAddRoomData({
          name: response.data.name,
          visibility: response.data.visibility === 'visible' ? true : false,
          meetingRoomCode: response.data.meetingCode,
          capacity: response.data.capacity,
          roomEquipment: response.data.roomEquipment,
          buildingEquipment: response.data.buildingEquipment,
        })
        setCustomSetting(response.data.customSetting === 'yes')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const deleteRoom = async () => {
    try {
      let url = API_ENDPOINT.delete_meeting_room
      const response = await deleteApi(url, `?id=${roomId}`)
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
    const keyName = e.target.name
    let value = e.target.value
    if (keyName === 'name') {
      value = value.substring(0, 18)
    }
    setAddRoomData((prev) => ({ ...prev, [keyName]: value }))
  }

  const saveRoomHandler = async () => {
    if (addRoomData.name === '') {
      enqueueSnackbar('Please enter name', { variant: 'error' })
      return false
    }
    if (addRoomData.meetingRoomCode === '') {
      enqueueSnackbar('Please enter meeting room code', { variant: 'error' })
      return false
    }
    if (isNaN(addRoomData.capacity)) {
      enqueueSnackbar('Please enter valid capacity', { variant: 'error' })
      return false
    }
    if (Number(addRoomData.capacity) < 1) {
      enqueueSnackbar('Please enter capacity greater than zero', { variant: 'error' })
      return false
    }
    if (roomImage === '') {
      enqueueSnackbar('Please upload room image', { variant: 'error' })
      return false
    }
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('name', addRoomData.name)
      formData.append('capacity', addRoomData.capacity)
      formData.append('meetingCode', addRoomData.meetingRoomCode)
      formData.append('images', roomImage)
      formData.append('customSetting', customSetting ? 'yes' : 'no')
      formData.append('visibility', addRoomData.visibility === true ? 'visible' : 'hide')

      let res
      if (roomId) {
        formData.append(
          'equipmentIds',
          JSON.stringify(addRoomData.roomEquipment?.map((equip) => equip.id)),
        )
        formData.append('roomId', roomId)
        res = await putApi(API_ENDPOINT.update_meeting_room, formData)
      } else {
        formData.append('buildingId', buildingId)
        formData.append('floorId', floorId)
        formData.append(
          'equipments',
          JSON.stringify(addRoomData.roomEquipment?.map((equip) => equip.id)),
        )
        res = await postApi(API_ENDPOINT.create_meeting_room, formData)
      }
      console.log(res)
      if (res.status === 200) {
        setAddRoomData({
          name: '',
          meetingRoomCode: '',
          capacity: 1,
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
    setAddRoomData({
      name: '',
      meetingRoomCode: '',
      capacity: 1,
      visibility: true,
    })
    setIsLoading(false)
    removeIds(null)
    getVal(null)
    setModal(!getMod)
  }

  return (
    <div className="col-md-9">
      {isLoading && <Loader />}
      <div>
        {floorId && (
          <div className="d-flex justify-content-end">
            <CButton onClick={() => setDeleteVisible(true)}>Delete</CButton>
          </div>
        )}
        <div className="card-body">
          <div className="formWraper">
            <div className="form-outline form-white   d-flex ">
              <div className="formWrpLabel">
                <label className="fw-bolder ">Meeting Room Name</label>
              </div>
              <div className="formWrpInpt d-flex">
                <div className="d-flex formradiogroup mb-2 gap-3">
                  <CFormInput
                    type="text"
                    placeholder=""
                    name="name"
                    value={addRoomData.name}
                    onChange={(e) => {
                      handleInputChange(e)
                    }}
                  />
                </div>
                <span className="txt-byte-information">{addRoomData.name.length} / 18 byte</span>
              </div>
            </div>
            <div className="form-outline form-white   d-flex ">
              <div className="formWrpLabel">
                <label className="fw-bolder ">Meeting Room Code</label>
              </div>
              <div className="formWrpInpt d-flex">
                <div className="d-flex formradiogroup mb-2 gap-3">
                  <CFormInput
                    type="text"
                    placeholder="Enter A Code"
                    name="meetingRoomCode"
                    value={addRoomData.meetingRoomCode}
                    onChange={(e) => {
                      handleInputChange(e)
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="form-outline form-white   d-flex ">
              <div className="formWrpLabel">
                <label className="fw-bolder ">Capacity</label>
              </div>
              <div className="formWrpInpt d-flex">
                <div className="d-flex formradiogroup mb-2 gap-3">
                  <CFormInput
                    type="number"
                    placeholder=""
                    name="capacity"
                    min={0}
                    value={addRoomData.capacity}
                    onChange={(e) => {
                      handleInputChange(e)
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="form-outline form-white  d-flex ">
              <div className="formWrpLabel">
                <label className="fw-bolder ">Room Image</label>
              </div>
              <div className="upload-image-main-container">
                <div className="upload-img-btn-and-info">
                  <div className="upload-container-btn">
                    <label className="label-btn" color="dark" htmlFor="imageFiles">
                      Upload
                      <input
                        type="file"
                        name="imageFiles"
                        id="imageFiles"
                        style={{ display: 'none' }}
                        multiple
                        accept=".png, .jpg, .jpeg, .gif"
                        onChange={(e) => setRoomImage(e.target.files[0])}
                      />
                    </label>
                  </div>
                  <div className="upload-container-guidance">
                    <p className="upload-instruction"># Instruction One</p>
                    <p className="upload-instruction"># Instruction Two</p>
                    <div className="file-information">
                      <ul>
                        <li>5MB</li>
                        <li>5MB</li>
                      </ul>
                    </div>
                  </div>
                </div>
                {roomImage && (
                  <div className="room-image-container">
                    <img src={URL.createObjectURL(roomImage)} alt="" />
                  </div>
                )}
              </div>
            </div>
            <div className="toggleContainer">
              <div>Custom Settings</div>
              <div>
                <CFormSwitch
                  id="club_period_qualification"
                  className="cFormSwitch"
                  onClick={() => {
                    setCustomSetting((prev) => !prev)
                    setAddRoomData((prev) => ({ ...prev, visibility: true }))
                  }}
                  checked={customSetting}
                />
              </div>
            </div>
            <div className="d-flex col-md-12">
              <div className="form-outline form-white d-flex w-100">
                <div className="formWrpLabel">
                  <label className="fw-bolder ">Equipment</label>
                </div>
                <div className="push-notification-container gap-3">
                  {addRoomData?.buildingEquipment?.length > 0 && (
                    <ul className="p-2">
                      {addRoomData?.buildingEquipment.map((item) => (
                        <CFormCheck
                          key={item}
                          id="flexCheckDefault"
                          className="gap-2"
                          label={item.name}
                          checked={addRoomData?.roomEquipment?.some(
                            (roomEqu) => roomEqu.id === item.id,
                          )}
                          onChange={() => roomEquipmentChangeHandler(item)}
                        />
                      ))}
                    </ul>
                  )}
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
                    defaultChecked={addRoomData.visibility}
                    onClick={() => setAddRoomData((prev) => ({ ...prev, visibility: true }))}
                    value={true}
                    disabled={!customSetting}
                  />
                  <CFormCheck
                    type="radio"
                    name="visibility"
                    id="exampleRadios2"
                    label="Hide"
                    defaultChecked={!addRoomData.visibility}
                    onClick={() => setAddRoomData((prev) => ({ ...prev, visibility: false }))}
                    value={false}
                    disabled={!customSetting}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          margin: '5%',
          gap: 10,
        }}
      >
        <CButton
          onClick={() => cancelHandler()}
          style={{ marginRight: '2%', background: '#ccc', border: 'none' }}
        >
          Cancel
        </CButton>
        <CButton onClick={() => saveRoomHandler()}>Save</CButton>
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
          <p>Are you sure you want to delete this room?</p>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={() => deleteRoom()}>
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

export default AddRoom
