import React, { useEffect, useState } from 'react'
import { CButton, CFormCheck, CFormInput, CFormSelect, CFormTextarea } from '@coreui/react'
import { useLocation } from 'react-router-dom'

import './createPost.scss'
import { getApi, postApi } from 'src/utils/Api'
import { API_ENDPOINT } from 'src/utils/config'
import { SnackbarProvider, enqueueSnackbar } from 'notistack'
import RecruitManagement from './RecruitManagement'

const CreatePost = () => {
  const location = useLocation()
  const [boardDropdownValues, setBoardDropdownValues] = useState([{ id: 0, name: 'All' }])
  const [recruitData, setRecruitData] = useState({})
  const [uploadedImages, setUploadedImages] = useState([])
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [titleCharCount, setTitleCharCount] = useState(0)
  const [isRecruitOpen, setIsRecruitOpen] = useState(false)
  const [data, setData] = useState({
    title: '',
    content: '',
    boardId: '',
    isAnnouncement: false,
    isPushNotification: false,
  })

  const uploadImagesHandler = (e) => {
    const files = [...uploadedImages]
    Array.from(e.target.files).forEach((file) => {
      if (files.length === 10) {
        return //only first 10 files will be uploaded
      }
      files.push(file)
    })
    setData((prev) => ({ ...prev, images: files }))
    setUploadedImages(files)
  }

  const deleteUploadedImageHandler = (imgFileIndex) => {
    const imgFiles = [...uploadedImages]
    imgFiles.splice(imgFileIndex, 1)
    setUploadedImages(imgFiles)
  }

  const uploadFilesHandler = (e) => {
    const files = [...uploadedFiles]
    Array.from(e.target.files).forEach((file) => {
      if (files.length === 10) {
        return //only first 10 files will be uploaded
      }
      files.push(file)
    })
    setData((prev) => ({ ...prev, attachments: files }))
    setUploadedFiles(files)
  }

  const deleteUploadedFileHandler = (fileIndex) => {
    const files = [...uploadedFiles]
    files.splice(fileIndex, 1)
    setUploadedFiles(files)
  }

  const handleInputChange = (e) => {
    const keyName = e.target.name
    const value = e.target.value
    setData((prev) => ({ ...prev, [keyName]: value }))
  }

  const savePostHandler = async () => {
    if (validate()) {
      try {
        const formData = new FormData()
        for (let obj in data) {
          if (Array.isArray(data[obj])) {
            for (let i = 0; i < data[obj].length; i++) {
              formData.append(obj, data[obj][i])
            }
          } else {
            formData.append(obj, data[obj])
          }
        }
        // for (var pair of formData.entries()) {
        //   console.log(pair[0] + ', ' + pair[1])
        // }
        const res = await postApi(API_ENDPOINT.create_post_bulletin, formData)
        console.log(res.status)
        setData({
          title: '',
          content: '',
          boardId: '',
          isAnnouncement: false,
          isPushNotification: false,
          recruitData: {},
        })
        enqueueSnackbar('Post Created Successfully', { variant: 'success' })
      } catch (error) {
        console.log(error)
      }
    }
  }

  const validate = () => {
    if (!data.title || data.title.trim() === '') {
      enqueueSnackbar('Please enter title', { variant: 'error' })
      return false
    }
    if (!data.content || data.content.trim() === '') {
      enqueueSnackbar('Please enter content', { variant: 'error' })
      return false
    }
    return true
  }

  const getBoardList = async () => {
    try {
      const res = await getApi(API_ENDPOINT.get_board_list)
      if (res.status === 200) {
        setBoardDropdownValues(res?.getBoardData)
        setData((prev) => ({ ...prev, boardId: res?.getBoardData[0].id.toString() }))
      }
    } catch (error) {
      console.log(error)
    }
  }

  const recruitHandler = (isOpen) => {
    setIsRecruitOpen(isOpen)
  }

  const changeRecruitDataHandle = (data) => {
    setRecruitData(data)
    setData((prev) => ({
      ...prev,
      recruitmentEnabled: data.recruitmentEnabled,
      recruitmentAllowRaffle: data.recruitmentAllowRaffle,
      recruitmentMaxParticipants: data.recruitmentMaxParticipants,
      recruitmentDeadline: data.recruitmentDeadline,
      recruitmentRaffleMaxWinners: data.recruitmentRaffleMaxWinners,
    }))
  }
  useEffect(() => {
    getBoardList()
  }, [])

  return (
    <>
      <SnackbarProvider
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      />
      <RecruitManagement
        isRecruitOpen={isRecruitOpen}
        setModal={recruitHandler}
        changeRecruitDataHandle={changeRecruitDataHandle}
      />
      <main>
        <h4>Create a Post</h4>
        <div className="card p-2 mb-2 mt-4">
          <div className="dropdown-container">
            <label className="me-3">Board</label>
            <CFormSelect
              size="sm"
              name="boardId"
              className="board-dropdown"
              onChange={(e) => {
                handleInputChange(e)
              }}
            >
              {boardDropdownValues.map((option, index) => (
                <option
                  key={option.id}
                  value={option.id}
                  selected={option.id === location.state.boardID}
                >
                  {option.name}
                </option>
              ))}
            </CFormSelect>
          </div>
          <div className="card-body">
            <div className="formWraper">
              <div className="form-outline form-white  d-flex ">
                <div className="formWrpLabel">
                  <label className="fw-bolder ">
                    Title <span className="mandatory-red-asterisk">*</span>
                  </label>
                </div>
                <div className="formWrpInpt">
                  <div className="d-flex formradiogroup mb-2 gap-3">
                    <CFormInput
                      type="text"
                      placeholder="Enter Title Here"
                      name="title"
                      value={data.title}
                      onChange={(e) => {
                        handleInputChange(e)
                        setTitleCharCount(e.target.value.length)
                      }}
                    />
                    <span className="txt-byte-information">{titleCharCount} / 120 byte</span>
                  </div>
                  {/* <span className="err-msg-txt" ref={titleErrRef}>
                    Please enter title
                  </span> */}
                </div>
              </div>
              <div className="form-outline form-white  d-flex ">
                <div className="formWrpLabel">
                  <label className="fw-bolder ">
                    Content <span className="mandatory-red-asterisk">*</span>
                  </label>
                </div>
                <div className="formWrpInpt">
                  <div className="d-flex formradiogroup mb-2 gap-3">
                    <CFormTextarea
                      id="exampleFormControlTextarea1"
                      rows={3}
                      placeholder="Enter your content here"
                      name="content"
                      value={data.content}
                      onChange={(e) => handleInputChange(e)}
                    ></CFormTextarea>
                  </div>
                  {recruitData?.recruitmentDeadline && (
                    <div>
                      <div>{recruitData.recruitmentDeadline}</div>
                      <div>Status : Not Open</div>
                      <div>No. of Participants : {recruitData.recruitmentMaxParticipants}</div>
                      <div>
                        Raffle : {recruitData.recruitmentAllowRaffle ? 'Yes' : 'No'} /{' '}
                        {recruitData.recruitmentRaffleMaxWinners}
                      </div>
                      <CButton className="btn" color="dark" onClick={() => alert('WIP')}>
                        Modify
                      </CButton>
                      <CButton className="delete-btn" onClick={() => setRecruitData({})}>
                        Delete
                      </CButton>
                    </div>
                  )}
                </div>
              </div>
              <div className="form-outline form-white  d-flex ">
                <div className="formWrpLabel">
                  <label className="fw-bolder ">Upload Image</label>
                </div>
                <div className="upload-image-main-container">
                  <div className="upload-img-btn-and-info">
                    <div className="upload-container-btn">
                      <CButton className="btn" color="dark" for="imageFiles" htmlFor="imageFiles">
                        Upload
                      </CButton>
                      <input
                        type="file"
                        name="imageFiles"
                        id="imageFiles"
                        style={{ display: 'inline' }}
                        multiple
                        accept="image/*"
                        onChange={(e) => uploadImagesHandler(e)}
                      />
                    </div>
                    <div className="upload-container-guidance">
                      <div className="upload-instruction"># Upto 10 files can be uploaded</div>
                      <div className="upload-instruction">
                        # The first image is registered as a representative image [thumbnail] in the
                        order of upload
                      </div>
                      <div className="file-information">
                        <ul>
                          <li>Maximum File Size : 00</li>
                          <li>File type : JPG</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  {uploadedImages.length > 0 && (
                    <div className="upload-images-container">
                      {uploadedImages.map((imgFile, index) => (
                        <div
                          className={
                            index === 0 ? 'thubmnail-img-container' : 'remaining-img-container'
                          }
                          key={index}
                        >
                          <img src={URL.createObjectURL(uploadedImages[index])} alt="" />
                          <span onClick={() => deleteUploadedImageHandler(index)}>X</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="form-outline form-white  d-flex ">
                <div className="formWrpLabel">
                  <label className="fw-bolder ">Upload File</label>
                </div>
                <div className="upload-file-main-container">
                  <div className="upload-img-btn-and-info">
                    <div className="upload-container-btn">
                      <CButton className="btn" color="dark" for="files" htmlFor="files">
                        Upload
                      </CButton>
                      <input
                        type="file"
                        name="files"
                        id="files"
                        style={{ display: 'inline' }}
                        multiple
                        accept=".xlsx, .docx, .pdf"
                        onChange={(e) => uploadFilesHandler(e)}
                      />
                    </div>
                    <div className="upload-container-guidance">
                      <div className="upload-instruction"># Upto 10 files can be uploaded</div>
                      <div className="file-information">
                        <ul>
                          <li>Maximum File Size : 00</li>
                          <li>File type : PDF, xlsx, doc...</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  {uploadedFiles.length > 0 && (
                    <div className="upload-files-container">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="individual-file-and-delete">
                          <div className="uploaded-file-name">{file.name}</div>
                          <div
                            className="uploaded-file-delete"
                            onClick={() => deleteUploadedFileHandler(index)}
                          >
                            X
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="form-outline form-white  d-flex ">
                <div className="formWrpLabel">
                  <label className="fw-bolder ">Add</label>
                </div>
                <div className="recruit-poll-container">
                  <div className="recruit-btn" onClick={() => recruitHandler(true)}>
                    <div>+</div>
                    <div>Recruit</div>
                  </div>
                  <div
                    className="poll-btn"
                    onClick={() =>
                      enqueueSnackbar('Recruit - Work In Progress', { variant: 'warning' })
                    }
                  >
                    <div>+</div>
                    <div>Poll</div>
                  </div>
                </div>
              </div>
              <div className="d-flex col-md-12">
                <div className="form-outline form-white d-flex col-md-6">
                  <div className="formWrpLabel">
                    <label className="fw-bolder ">Push Notification</label>
                  </div>
                  <div className="push-notification-container">
                    <CFormCheck
                      type="radio"
                      name="isPushNotification"
                      defaultChecked={data.isPushNotification}
                      onClick={() => setData((prev) => ({ ...prev, isPushNotification: true }))}
                      label="Yes"
                      value={true}
                    />
                    <CFormCheck
                      type="radio"
                      name="isPushNotification"
                      defaultChecked={!data.isPushNotification}
                      onClick={() => setData((prev) => ({ ...prev, isPushNotification: false }))}
                      label="No"
                      value={false}
                    />
                  </div>
                </div>
                <div className="form-outline form-white d-flex col-md-6">
                  <div className="formWrpLabel">
                    <label className="fw-bolder ">Add As Notice</label>
                  </div>
                  <div className="add-as-notice-container">
                    <CFormCheck
                      type="radio"
                      name="isAnnouncement"
                      defaultChecked={data.isAnnouncement}
                      onClick={() => setData((prev) => ({ ...prev, isAnnouncement: true }))}
                      label="Yes"
                      value={true}
                    />
                    <CFormCheck
                      type="radio"
                      name="isAnnouncement"
                      label="No"
                      onClick={() => setData((prev) => ({ ...prev, isAnnouncement: false }))}
                      defaultChecked={!data.isAnnouncement}
                      value={false}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="d-grid gap-2 col-2 mx-auto m-4">
          <CButton className="btn" color="dark" onClick={savePostHandler}>
            Save
          </CButton>
        </div>
      </main>
    </>
  )
}

export default CreatePost
