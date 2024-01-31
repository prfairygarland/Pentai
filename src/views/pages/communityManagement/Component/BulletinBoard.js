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
import React, { useEffect, useState } from 'react'
import { getApi, postApi, putApi } from 'src/utils/Api'
import { API_ENDPOINT } from 'src/utils/config'
import { enqueueSnackbar } from 'notistack'
import Loader from 'src/components/common/Loader'
import { useTranslation } from 'react-i18next';

const BulletinBoard = () => {
  const [addBulletinBoard, setAddBulletinBoard] = useState(false)
  const [addBoardData, setAddBoardData] = useState({
    name: '',
    boardStatuses: true,
    annonymousBoard: false,
    isAdminOnly: false,
  })
  const [searchData, setSearchData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isEdited, setIsedited] = useState(false)
  const [visible, setVisible] = useState(false)
  const [deleteVisible, setDeleteVisible] = useState(false)
  const [pointsData, setPointsData] = useState({})
  const [getId, setId] = useState()
  const [isLoading, setIsLoading] = useState(false)

  const { i18n } = useTranslation();
  const translationObject = i18n.getDataByLanguage(i18n.language);  

  const handleSearchChange = (event) => {
    const term = event.target.value.toLowerCase()
    setSearchTerm(term)

    const filtered = searchData.filter((item) =>
      Object.values(item).some(
        (value) => typeof value === 'string' && value.toLowerCase().includes(term),
      ),
    )

    setFilteredData(filtered)
  }

  useEffect(() => {
    handleBulletinSearchData()
    handlePointsData()
  }, [])

  const handleInputChange = (e) => {
    const keyName = e.target.name
    let value = e.target.value
    if (keyName === 'name') {
      value = value.substring(0, 20)
    }
    setAddBoardData((prev) => ({ ...prev, [keyName]: value }))
  }

  const handleCheckboxChange = (event) => {
    const keyName = event.target.name
    let checked = event.target.checked
    if (keyName === 'isAdminOnly') {
      setAddBoardData((prev) => ({ ...prev, [keyName]: checked }))
    }
  }

  const handleSearchFocus = () => {
    setFilteredData(searchData)
  }

  const handleBulletinSearchData = async () => {
    try {
      const res = await getApi(API_ENDPOINT.bulletin_search)
      if (res.status == 200) {
        setSearchData(res.data)
        setFilteredData(res.data)
      }
    } catch (error) {
      console.log('handlePostDelete error =>', error)
    }
  }

  const handlePointsData = async () => {
    try {
      const res = await getApi(API_ENDPOINT.get_points_settings)
      if (res?.status === 200) {
        setPointsData(res.data)
      } else {
        // handle pending
      }
    } catch (error) {
      console.log('handlePostDelete error =>', error)
    }
  }

  const handleItemClick = (clickedItem) => {
    // Handle the click on a specific filtered data item
    setAddBulletinBoard(true)
    setId(clickedItem.id)
    addBoardData.name = clickedItem.name
    addBoardData.boardStatuses = clickedItem.boardStatuses == 'grant' ? true : false
    addBoardData.annonymousBoard = clickedItem.annonymousBoard == 1 ? true : false
    addBoardData.isAdminOnly = clickedItem.isAdminOnly == 1 ? true : false
    setIsedited(true)
  }

  const saveBoard = async () => {
    if (addBoardData.name === '') {
      enqueueSnackbar(translationObject?.translation?.communityBoardManagement?.pleaseEnterName, { variant: 'error' })
      return false
    }
    setIsLoading(true)
    try {
      let data = {
        name: addBoardData.name,
        boardStatuses: addBoardData.boardStatuses == true ? 'grant' : 'deny',
        isAdminOnly: addBoardData.isAdminOnly == true ? 1 : 0,
        annonymousBoard: addBoardData.annonymousBoard == true ? 1 : 0,
      }

      let res

      if (getId) {
        data['id'] = getId
        res = await putApi(API_ENDPOINT.update_bulletin_board, data)
      } else {
        res = await postApi(API_ENDPOINT.add_bulletin_board, data)
      }

      if (res.status === 200) {
        setAddBoardData({
          name: '',
          boardStatuses: true,
          isAdminOnly: false,
          annonymousBoard: false,
        })
        enqueueSnackbar(translationObject?.translation?.communityBoardManagement?.bulletingBoardAddedSuccessfully, { variant: 'success' })
        setVisible(false)
        setId()
        handleBulletinSearchData()
        setFilteredData([])
        setIsLoading(false)
      } else {
        enqueueSnackbar(`${res?.data?.msg}`, { variant: 'error' })
        setVisible(false)
        setId()
        setFilteredData([])
        setIsLoading(false)
      }
    } catch (error) {
      setIsLoading(false)
      console.log(error)
    }
  }

  const setBulletinBoard = async () => {
    setId()
    setAddBulletinBoard(true)
    setIsedited(false)
    addBoardData.name = ''
    addBoardData.boardStatuses = true
    addBoardData.annonymousBoard = false
    addBoardData.isAdminOnly = false
  }

  const handleBoardDelete = async () => {
    setIsLoading(true)
    try {
      const res = await postApi(API_ENDPOINT.delete_bulletin_board, { boardId: getId })
      if (res.status === 200) {
        setAddBoardData({
          name: '',
          boardStatuses: true,
          isAdminOnly: false,
          annonymousBoard: false,
        })
        enqueueSnackbar(translationObject?.translation?.communityBoardManagement?.deletedSuccessfully, { variant: 'success' })
        setDeleteVisible(false)
        setId()
        handleBulletinSearchData()
        setFilteredData([])
        setIsLoading(false)
      } else {
        enqueueSnackbar(`${res?.data?.msg}`, { variant: 'error' })
        setDeleteVisible(false)
        setId()
        setFilteredData([])
        setIsLoading(false)
      }
    } catch (error) {
      setIsLoading(false)
      console.log(error)
    }
  }

  const validate = async () => {
    if (addBoardData.name === '') {
      enqueueSnackbar(translationObject?.translation?.communityBoardManagement?.pleaseEnterName, { variant: 'error' })
      return false
    } else {
      setVisible(!visible)
    }
  }

  const handlePointsPerPostCheckbox = () => {
    const newValue = !pointsData.pointsPerPostenabled
    setPointsData((prev) => {
      return {
        ...prev,
        pointsPerPost: 1,
        pointsPerPostenabled: Number(newValue),
      }
    })
  }

  const handlePointsPerCommentCheckbox = () => {
    const newValue = !pointsData.pointsPerCommentenabled
    setPointsData((prev) => {
      return {
        ...prev,
        pointsPerComment: 1,
        pointsPerCommentenabled: Number(newValue),
      }
    })
  }

  const savePointsHandler = async () => {
    try {
      await putApi(API_ENDPOINT.update_points_settings, pointsData)
    } catch (error) {
      console.log()
    }
  }

  return (
    <>
      {isLoading && <Loader />}
      <section>
        <div className="d-flex w-100">
          <div className="col-md-4">
            <div className="d-flex justify-content-end pt-3 pb-3 gap-2">
              <CButton
                type="submit"
                className=" text-white "
                onClick={() => setBulletinBoard()}
              >
                {translationObject?.translation?.communityBoardManagement?.add}
              </CButton>
              {getId && (
                <CButton
                  type="submit"
                  className=" text-white btn-black"
                  onClick={() => setDeleteVisible(true)}
                >
                  {translationObject?.translation?.communityBoardManagement?.delete}
                </CButton>
              )}
            </div>
            <div className="d-flex justify-content-center">
              <CCol xs="auto" className="w-100" style={{ width: 'auto' }}>
                <CFormInput
                  type="text"
                  id="inputPassword2"
                  placeholder="Search"
                  onFocus={handleSearchFocus}
                  onChange={handleSearchChange}
                />
                {searchData.length > 0 && (
                  <ul className="p-2 sidebarMenuLink">
                    {filteredData.map((item) => (
                      <li className="p-2" key={item.id} onClick={() => handleItemClick(item)} draggable={true}>
                        <strong> {item.name}</strong>
                      </li>
                    ))}
                  </ul>
                )}
              </CCol>
            </div>
          </div>
          {addBulletinBoard == true ? (
            <div className="w-75 p-4">
              <div>
                <div className="w-100 p-3">
                  <main>
                    <div>
                      <div className="card-body">
                        <div className="formWraper">
                          <div className="form-outline form-white d-flex">
                            <div className="formWrpLabel" style={{ minWidth: '170px' }}>
                              <label className="fw-bolder ">{translationObject?.translation?.communityBoardManagement?.usageStatus}</label>
                            </div>
                            <div className="formWrpInpt">
                              <div className="d-flex formradiogroup  gap-3">
                                <CFormCheck
                                  type="radio"
                                  name="boardStatuses"
                                  id="exampleRadios1"
                                  label="Grant"
                                  defaultChecked={addBoardData.boardStatuses}
                                  onClick={() =>
                                    setAddBoardData((prev) => ({ ...prev, boardStatuses: true }))
                                  }
                                  value={true}
                                />
                                <CFormCheck
                                  type="radio"
                                  name="boardStatuses"
                                  id="exampleRadios2"
                                  label="Deny"
                                  defaultChecked={!addBoardData.boardStatuses}
                                  onClick={() =>
                                    setAddBoardData((prev) => ({ ...prev, boardStatuses: false }))
                                  }
                                  value={false}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="form-outline form-white  d-flex ">
                            <div className="formWrpLabel" style={{ minWidth: '170px' }}>
                              <label className="fw-bolder ">{translationObject?.translation?.communityBoardManagement?.permissionToWrite}</label>
                            </div>
                            <div className="formWrpInpt">
                              <CFormCheck
                                id="reverseCheckbox1"
                                label="Admin only"
                                name="isAdminOnly"
                                checked={addBoardData.isAdminOnly}
                                onChange={(e) => handleCheckboxChange(e)}
                              />
                            </div>
                          </div>

                          <div className="form-outline form-white  d-flex ">
                            <div className="formWrpLabel" style={{ minWidth: '170px' }}>
                              <label className="fw-bolder ">{translationObject?.translation?.communityBoardManagement?.anonymousBoard}</label>
                            </div>
                            <div className="formWrpInpt">
                              <div className="d-flex formradiogroup mb-2 gap-3">
                                <CFormCheck
                                  type="radio"
                                  name="annonymousBoard"
                                  id="exampleRadios1"
                                  label="Yes"
                                  defaultChecked={addBoardData.annonymousBoard}
                                  onClick={() =>
                                    setAddBoardData((prev) => ({ ...prev, annonymousBoard: true }))
                                  }
                                  value={true}
                                />
                                <CFormCheck
                                  type="radio"
                                  name="annonymousBoard"
                                  id="exampleRadios2"
                                  label="No"
                                  defaultChecked={!addBoardData.annonymousBoard}
                                  onClick={() =>
                                    setAddBoardData((prev) => ({ ...prev, annonymousBoard: false }))
                                  }
                                  value={false}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="form-outline form-white  d-flex ">
                            <div className="formWrpLabel" style={{ minWidth: '170px' }}>
                              <label className="fw-bolder ">{translationObject?.translation?.communityBoardManagement?.boardName}</label>
                            </div>
                            <div className="formWrpInpt">
                              <div className="d-flex formradiogroup mb-2 gap-3">
                                <CFormInput
                                  type="email"
                                  id="exampleFormControlInput1"
                                  aria-describedby="exampleFormControlInputHelpInline"
                                  name="name"
                                  value={addBoardData.name}
                                  onChange={(e) => {
                                    handleInputChange(e)
                                  }}
                                />
                                <span className="txt-byte-information">
                                  {addBoardData.name.length} / {translationObject?.translation?.communityBoardManagement?.twentyBytes}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </main>
                </div>
              </div>
            </div>
          ) : (
            <div className="col-md-8">
              <div>
                <div className="p-3">
                  <main>
                    <div>
                      <div className="card-body">
                        <div className="formWraper">
                          <div className="form-outline form-white d-flex">
                            <div className="formWrpLabel" style={{ minWidth: '140px' }}>
                              <label className="fw-bolder ">{translationObject?.translation?.communityBoardManagement?.pointSettings}</label>
                            </div>
                            <div className='w-100'>
                              <div className="formWrpInpt">
                                <div className="d-flex formradiogroup gap-3 align-items-center">
                                 <div className='lblwidth'>
                                 <CFormCheck
                                    id="flexCheckDefault"
                                    className="gap-2"
                                    label={translationObject?.translation?.communityBoardManagement?.pointsPerPost}
                                    checked={pointsData?.pointsPerPostenabled}
                                    onChange={handlePointsPerPostCheckbox}
                                    
                                  />
                                 </div>
                                  <CFormInput
                                    type="number"
                                    className="h-25 w-25 "
                                    id="inputPassword2"
                                    min={1}
                                    max={999}
                                    placeholder="1~999"
                                    value={pointsData?.pointsPerPost}
                                    disabled={!pointsData?.pointsPerPostenabled}
                                    onChange={(e) =>
                                      setPointsData((prev) => ({
                                        ...prev,
                                        pointsPerPost: e.target.value,
                                      }))
                                    }
                                    onKeyDown={(e) => e.preventDefault()}
                                  />{' '}
                                  <span>{translationObject?.translation?.communityBoardManagement?.points}</span>
                                </div>
                              </div>
                              <div className="formWrpInpt">
                                <div className="d-flex formradiogroup gap-3 align-items-center">
                                 <div className='lblwidth'>
                                 <CFormCheck
                                    id="flexCheckDefault"
                                    className="gap-2"
                                    label={translationObject?.translation?.communityBoardManagement?.pointsPerComment}
                                    checked={pointsData?.pointsPerCommentenabled}
                                    onChange={handlePointsPerCommentCheckbox}
                                  />
                                 </div>
                                  <CFormInput
                                    type="number"
                                    max={999}
                                    min={1}
                                    className="h-25 w-25 "
                                    id="inputPassword2"
                                    placeholder="1~999"
                                    value={pointsData?.pointsPerComment}
                                    disabled={!pointsData?.pointsPerCommentenabled}
                                    onChange={(e) =>
                                      setPointsData((prev) => ({
                                        ...prev,
                                        pointsPerComment: e.target.value,
                                      }))
                                    }
                                    onKeyDown={(e) => e.preventDefault()}
                                  />{' '}
                                  <span>{translationObject?.translation?.communityBoardManagement?.points}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="prohabitinfo mt-2 p-3">
                            <p>※ {translationObject?.translation?.communityBoardManagement?.guideForSettingPoints}​</p>
                            <p>{translationObject?.translation?.communityBoardManagement?.guideForSettingPointsPointOne}​</p>
                            <p>{translationObject?.translation?.communityBoardManagement?.guideForSettingPointsPointTwo}​</p>
                            <p>{translationObject?.translation?.communityBoardManagement?.guideForSettingPointsPointThree}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </main>
                  <div className="save-cancel-btn-container">
                    <CButton
                      className="btn btn-primary mt-3"
                      
                      onClick={savePointsHandler}
                    >
                      {translationObject?.translation?.communityBoardManagement?.save}
                    </CButton>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {addBulletinBoard && (
          <div className="save-cancel-btn-container">
            <CButton className="btn save-cancel-btn" color="dark" onClick={() => validate()}>
            {translationObject?.translation?.communityBoardManagement?.save}
            </CButton>
          </div>
        )}

        <CModal
          backdrop="static"
          visible={visible}
          onClose={() => setVisible(false)}
          aria-labelledby="StaticBackdropExampleLabel"
        >
          <CModalHeader>
            <CModalTitle id="StaticBackdropExampleLabel">{translationObject?.translation?.communityBoardManagement?.savedTheSettings}</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <p>{translationObject?.translation?.communityBoardManagement?.areYouSureToSave}</p>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setVisible(false)}>
            {translationObject?.translation?.communityBoardManagement?.close}
            </CButton>
            <CButton onClick={() => saveBoard()} color="primary">
            {translationObject?.translation?.communityBoardManagement?.save}
            </CButton>
          </CModalFooter>
        </CModal>

        <CModal
          backdrop="static"
          visible={deleteVisible}
          onClose={() => setDeleteVisible(false)}
          aria-labelledby="StaticBackdropExampleLabel"
        >
          <CModalHeader>
            <CModalTitle id="StaticBackdropExampleLabel">{translationObject?.translation?.communityBoardManagement?.deleteBoard}</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <p>{translationObject?.translation?.communityBoardManagement?.deleteAllPostConfirmationStatement}</p>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setDeleteVisible(false)}>
            {translationObject?.translation?.communityBoardManagement?.close}
            </CButton>
            <CButton onClick={() => handleBoardDelete()} color="primary">
            {translationObject?.translation?.communityBoardManagement?.delete}
            </CButton>
          </CModalFooter>
        </CModal>
      </section>
    </>
  )
}

export default BulletinBoard
