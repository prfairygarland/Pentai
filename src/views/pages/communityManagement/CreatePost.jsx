import React, { useEffect, useRef, useState } from 'react'
import { CButton, CFormCheck, CFormInput, CFormSelect, CFormTextarea } from '@coreui/react'

import './createPost.scss'
import { getApi, postApi } from 'src/utils/Api'
import { API_ENDPOINT } from 'src/utils/config'

const CreatePost = () => {
  const [boardDropdownValues, setBoardDropdownValues] = useState([{ id: 0, name: 'All' }])
  const [uploadedImages, setUploadedImages] = useState([])
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [data, setData] = useState({
    title: '',
    content: '',
    boardId: '',
    isAnnouncement: false,
    isPushNotification: false,
  })
  const titleErrRef = useRef(false)
  const contentErrRef = useRef(false)

  const uploadImagesHandler = (e) => {
    const files = [...uploadedImages]
    Array.from(e.target.files).forEach((file) => {
      if (files.length === 10) {
        return //only first 10 files will be uploaded
      }
      files.push(file)
    })
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
        const res = await postApi(API_ENDPOINT.create_post_bulletin, data)
        console.log(res.status)
        setData({
          title: '',
          content: '',
          boardId: '',
          isAnnouncement: false,
          isPushNotification: false,
        })
        alert('Post Created Successfully')
      } catch (error) {
        console.log(error)
      }
    }
  }

  const validate = () => {
    let isValidated = true
    if (!data.title || data.title.trim() === '') {
      isValidated = false
      titleErrRef.current.style.display = 'block'
    } else {
      titleErrRef.current.style.display = 'none'
    }
    if (!data.content || data.content.trim() === '') {
      isValidated = false
      contentErrRef.current.style.display = 'block'
    } else {
      contentErrRef.current.style.display = 'none'
    }
    return isValidated
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

  useEffect(() => {
    titleErrRef.current.style.display = 'none'
    contentErrRef.current.style.display = 'none'
    getBoardList()
  }, [])

  return (
    <>
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
                <option key={option.id} value={option.id}>
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
                      onChange={(e) => handleInputChange(e)}
                    />
                    <span className="txt-byte-information">0 / 120 byte</span>
                  </div>
                  <span className="err-msg-txt" ref={titleErrRef}>
                    Please enter title
                  </span>
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
                  <span className="err-msg-txt" ref={contentErrRef}>
                    Please enter content
                  </span>
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
                  <div className="recruit-btn" onClick={() => alert('Recruit - Work In Progress')}>
                    <div>+</div>
                    <div>Recruit</div>
                  </div>
                  <div className="poll-btn" onClick={() => alert('Poll - Work In Progress')}>
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
