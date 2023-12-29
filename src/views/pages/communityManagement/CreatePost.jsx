import React, { useEffect, useState } from 'react'
import { CButton, CFormCheck, CFormInput, CFormSelect, CFormTextarea } from '@coreui/react'
import { useNavigate, useLocation } from 'react-router-dom'

import './createPost.scss'
import { getApi, postApi } from 'src/utils/Api'
import { API_ENDPOINT } from 'src/utils/config'
import { enqueueSnackbar } from 'notistack'
import RecruitManagement from './RecruitManagement'
import PollManagement from './PollManagement'

const CreatePost = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [boardDropdownValues, setBoardDropdownValues] = useState([{ id: 0, name: 'All' }])
  const [recruitData, setRecruitData] = useState({})
  const [pollData, setPollData] = useState({})
  const [uploadedImages, setUploadedImages] = useState([])
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [isRecruitOpen, setIsRecruitOpen] = useState(false)
  const [isPollOpen, setIsPollOpen] = useState(false)
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
    e.target.value = null
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
    e.target.value = null
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
    let value = e.target.value
    if (keyName === 'title') {
      value = value.substring(0, 120)
    }
    setData((prev) => ({ ...prev, [keyName]: value }))
  }

  const savePostHandler = async () => {
    if (validate()) {
      try {
        const formData = new FormData()
        for (let obj in data) {
          if (obj !== 'pollData') {
            if (Array.isArray(data[obj])) {
              for (let i = 0; i < data[obj].length; i++) {
                formData.append(obj, data[obj][i])
              }
            } else {
              formData.append(obj, data[obj])
            }
          }
        }
        const res = await postApi(API_ENDPOINT.create_post_bulletin, formData)
        if (res?.data?.status === 201) {
          setData({
            title: '',
            content: '',
            isAnnouncement: false,
            isPushNotification: false,
            images: [],
            attachments: [],
            recruitData: {},
            pollData: {},
          })
          navigate('../BulletinBoard', {
            state: {
              enqueueSnackbarMsg: 'Post Created Successfully And Redirected to Post Listing Page',
              variant: 'success',
            },
          })
        } else {
          enqueueSnackbar(`${res?.data?.msg}`, { variant: 'error' })
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  const validate = () => {
    if (data.title.trim() === '') {
      enqueueSnackbar('Please enter title', { variant: 'error' })
      return false
    }
    if (data.content.trim() === '') {
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

  const pollHandler = (isOpen) => {
    setIsPollOpen(isOpen)
  }

  const changeRecruitDataHandle = (data) => {
    setRecruitData(data)
    const date = new Date(data.recruitmentDeadline)
    setData((prev) => ({
      ...prev,
      recruitmentEnabled: data.recruitmentEnabled,
      recruitmentAllowRaffle: data.recruitmentAllowRaffle,
      recruitmentMaxParticipants: data.recruitmentMaxParticipants,
      recruitmentDeadline: date.toUTCString(),
      recruitmentRaffleMaxWinners: data.recruitmentRaffleMaxWinners,
    }))
  }

  const changePollDataHandle = (paramData) => {
    setPollData(paramData)
    const date = new Date(paramData.pollEndTimestamp)
    const pollParamData = { ...paramData, pollEndTimestamp: date.toUTCString() }
    delete pollParamData.pollDisplayOptions
    setData((prev) => ({
      ...prev,
      ...pollParamData,
    }))
  }

  const modifyRecruit = () => {
    setIsRecruitOpen(true)
  }

  const modifyPoll = () => {
    setIsPollOpen(true)
  }

  useEffect(() => {
    getBoardList()
  }, [])

  return (
    <>
      <RecruitManagement
        isRecruitOpen={isRecruitOpen}
        setModal={recruitHandler}
        changeRecruitDataHandle={changeRecruitDataHandle}
        recruitModifyData={recruitData}
      />
      <PollManagement
        isPollOpen={isPollOpen}
        setModal={pollHandler}
        changePollDataHandle={changePollDataHandle}
        pollModifyData={pollData}
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
                      }}
                    />
                    <span className="txt-byte-information">{data.title.length} / 120 byte</span>
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
                      <div>
                        {recruitData.recruitmentDeadline.getFullYear()}-
                        {recruitData.recruitmentDeadline.getMonth() + 1}-
                        {recruitData.recruitmentDeadline.getDate()}&nbsp;
                        {recruitData.recruitmentDeadline.getHours()}:
                        {recruitData.recruitmentDeadline.getMinutes()}
                      </div>
                      <div>Status : Not Open</div>
                      <div>No. of Participants : {recruitData.recruitmentMaxParticipants}</div>
                      <div>
                        Raffle : {recruitData.recruitmentAllowRaffle ? 'Yes' : 'No'} /{' '}
                        {recruitData.recruitmentRaffleMaxWinners}
                      </div>
                      <CButton className="btn" color="dark" onClick={() => modifyRecruit()}>
                        Modify
                      </CButton>
                      <CButton className="delete-btn" onClick={() => setRecruitData({})}>
                        Delete
                      </CButton>
                    </div>
                  )}
                  {pollData?.pollEndTimestamp && (
                    <div>
                      <div>Status : Not Open</div>
                      <div>Anonymous : None</div>
                      <div>Select : {pollData.pollMaxSelections === 1 ? 'Single' : 'Multi'}</div>
                      <h3>Poll : {pollData.pollTitle}</h3>
                      <div style={{ fontWeight: 800 }}>
                        {pollData?.pollEndTimestamp.getFullYear()}-
                        {pollData?.pollEndTimestamp.getMonth() + 1}-
                        {pollData?.pollEndTimestamp.getDate()}&nbsp;
                        {pollData?.pollEndTimestamp.getHours()}:
                        {pollData?.pollEndTimestamp.getMinutes()}
                      </div>
                      <div>
                        <ul>
                          {pollData?.pollDisplayOptions &&
                            pollData?.pollDisplayOptions.map((opt, index) => (
                              <li key={index}>
                                Option {index + 1} : {opt}
                              </li>
                            ))}
                        </ul>
                      </div>
                      <CButton className="btn" color="dark" onClick={() => modifyPoll()}>
                        Modify
                      </CButton>
                      <CButton className="delete-btn" onClick={() => setPollData({})}>
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
                      <label className="label-btn" color="dark" htmlFor="imageFiles">
                        Upload
                        <input
                          type="file"
                          name="imageFiles"
                          id="imageFiles"
                          style={{ display: 'none' }}
                          multiple
                          accept="image/*"
                          onChange={(e) => uploadImagesHandler(e)}
                        />
                      </label>
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
                      <label className="label-btn" color="dark" htmlFor="files">
                        Upload
                        <input
                          type="file"
                          name="files"
                          id="files"
                          style={{ display: 'none' }}
                          multiple
                          accept=".xlsx, .docx, .pdf"
                          onChange={(e) => uploadFilesHandler(e)}
                        />
                      </label>
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
                  <div
                    className={
                      recruitData?.recruitmentDeadline || pollData?.pollEndTimestamp
                        ? `recruit-btn disabled`
                        : `recruit-btn`
                    }
                    onClick={() => recruitHandler(true)}
                  >
                    <div>+</div>
                    <div>Recruit</div>
                  </div>
                  <div
                    className={
                      recruitData?.recruitmentDeadline || pollData?.pollEndTimestamp
                        ? `poll-btn disabled`
                        : `poll-btn`
                    }
                    onClick={() => pollHandler(true)}
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
