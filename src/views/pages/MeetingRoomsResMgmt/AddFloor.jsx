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

const AddFloor = ({
  setModal,
  getMod,
  Modal,
  getId,
  removeIds,
  buildingId,
  buildingName,
  getVal,
}) => {
  const [deleteVisible, setDeleteVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [addBuildingData, setAddBuildingData] = useState({
    name: '',
    associatedRooms: 1,
    visibility: true,
  })

  useEffect(() => {
    if (getId !== null) {
      getData(getId)
    } else {
      setAddBuildingData({
        name: '',
        associatedItem: 1,
        visibility: true,
      })
    }
  }, [getId])

  const getData = async (id) => {
    try {
      let url = API_ENDPOINT.get_supply_type_details + `?id=${id}`
      const response = await getApi(url)

      if (response?.status === 200) {
        setAddBuildingData({
          name: response.data.name,
          associatedItem: response.data.associatedItem,
          visibility: response.data.visibility === 'visible' ? true : false,
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  const deleteBuilding = async () => {
    try {
      let url = API_ENDPOINT.delete_supply_type
      const response = await deleteApi(url, `?id=${getId}`)
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
      value = value.substring(0, 26)
    }
    setAddBuildingData((prev) => ({ ...prev, [keyName]: value }))
  }

  const saveFloor = async (type) => {
    if (type === 'save') {
      if (addBuildingData.name === '') {
        enqueueSnackbar('Please enter name', { variant: 'error' })
        return false
      }
      if (addBuildingData.associatedItem < 1) {
        enqueueSnackbar('Please enter valid associate Item', { variant: 'error' })
        return false
      }
      if (addBuildingData.rentalDuration < 1) {
        enqueueSnackbar('Please enter valid Rental Duration', { variant: 'error' })
        return false
      }

      if (addBuildingData.pickUpAndReturn === '') {
        enqueueSnackbar('Please enter Point of pick and return', { variant: 'error' })
        return false
      }

      if (addBuildingData.reasonRemarks === '') {
        enqueueSnackbar('Please enter Reason remarks guide text', { variant: 'error' })
        return false
      }
      setIsLoading(true)
      try {
        let data = {
          name: addBuildingData.name,
          buildingId: buildingId,
          visibility: addBuildingData.visibility === true ? 'visible' : 'hide',
        }

        let res

        if (getId) {
          data['id'] = getId
          res = await putApi(API_ENDPOINT.update_supply_type, data)
        } else {
          res = await postApi(API_ENDPOINT.create_meeting_floor, data)
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
        setAddBuildingData({
          name: '',
          associatedItem: 0,
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
  }

  return (
    <div className="col-md-9">
      {isLoading && <Loader />}
      <div>
        {getId && (
          <div className="d-flex justify-content-end">
            <CButton onClick={() => setDeleteVisible(true)}>Delete</CButton>
          </div>
        )}
        <div className="dropdown-container mb-2">
          <h5 className="me-3">Add floor for : {buildingName}</h5>
        </div>
        <div className="card-body">
          <div className="formWraper">
            <div className="form-outline form-white   d-flex ">
              <div className="formWrpLabel">
                <label className="fw-bolder ">Floor Name</label>
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
                    onChange={(e) => {
                      handleInputChange(e)
                    }}
                  />
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
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          margin: '5%',
          gap: 10,
        }}
      >
        {/* <CButton
          onClick={() => saveBuilding('cancle')}
          style={{ marginRight: '2%', background: '#ccc', border: 'none' }}
        >
          Cancel
        </CButton> */}
        <CButton onClick={() => saveFloor('save')}>Save</CButton>
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
            Are you sure you want to delete this category?
            <br />
            All categories and items belonging will be deleted.
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

export default AddFloor
