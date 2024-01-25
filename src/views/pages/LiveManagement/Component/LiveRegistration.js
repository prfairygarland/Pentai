import { cilCircle, cilHamburgerMenu, cilImage, cilRectangle, cilX } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CButton, CCard, CCardBody, CCardText, CCardTitle, CFormCheck, CFormInput, CFormSwitch, CFormTextarea, CImage, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CNav, CNavItem, CNavLink } from '@coreui/react';
import { enqueueSnackbar } from 'notistack';
import React, { useRef, useState } from 'react'
import DatePicker from 'react-date-picker';
import { useTranslation } from 'react-i18next';
import Loader from 'src/components/common/Loader'
import ConfirmationModal from 'src/utils/ConfirmationModal';

const LiveRegistration = () => {


  const { t, i18n } = useTranslation();
  const translationObject = i18n.getDataByLanguage(i18n.language);
  const multiLang = translationObject?.translation
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('');
  const inputRef = useRef(null)
  const [modalProps, setModalProps] = useState({})
  const [liveRegisterTitle, setLiveRegisterTitle] = useState('')
  const [liveRegisterStartDate, setLiveRegisterStartDate] = useState('')
  const [liveRegisterStartHours, setLiveRegisterStartHours] = useState('')
  const [liveRegisterStartMins, setLiveRegisterStartMins] = useState('')
  const [liveRegisterEndDate, setLiveRegisterEndDate] = useState('')
  const [liveRegisterEndHours, setLiveRegisterEndHours] = useState('')
  const [liveRegisterEndMins, setLiveRegisterEndMins] = useState('')
  const [description, setDescription] = useState('')
  const [selectedImage, setSelectedImage] = useState('');
  const [participateToggle, setParticipateToggle] = useState(false);
  const [secretToggle, setSecretToggle] = useState(false);
  const [points, setPoints] = useState(null);
  const [secret, setSecret] = useState(null);

  // Quiz
  const [visible, setVisible] = useState(false)
  const [quizToggle, setQuizToggle] = useState(false);
  const [quizQuestion, setQuizQuestion] = useState('')
  const [selectedRadio, setSelectedRadio] = useState(null);
  const [answerSelectedRadio, setAnswerSelectedRadio] = useState(null);
  const [rewardPointsToggle, setrewardPointsToggle] = useState(false)
  const [rewardPointsCheckBox, setrewardPointsCheckBox] = useState(true)
  const [uploadedImages, setUploadedImages] = useState([])
  const [inputValues, setInputValues] = useState([{ value: '', answer: true }]);
  const [shortAnswer, setShortAnswer] = useState('')
  const [timeLimit, setTimeLimit] = useState(10)
  const [mainQuizs, setMainQuizs] = useState([])


  const handleTimeInputChange = (e) => {
    // Validate and set the value within the desired range
    const inputValue = parseInt(e.target.value, 10);
    const newValue = isNaN(inputValue) ? 10 : Math.max(10, inputValue);

    setTimeLimit(newValue);
  };

  const validateLiveRegister = () => {
    if (liveRegisterTitle.trim() === '') {
      enqueueSnackbar('Please enter title', { variant: 'error' })
      return false
    } else if (liveRegisterStartDate === '') {
      enqueueSnackbar('Please select start date', { variant: 'error' })
      return false
    } else if (liveRegisterStartHours === '' && liveRegisterStartMins === '') {
      enqueueSnackbar('Please select start time', { variant: 'error' })
      return false
    } else if (new Date() > new Date(liveRegisterStartDate + 'T' + liveRegisterStartHours + ':' + liveRegisterStartMins)) {
      enqueueSnackbar('Start time can not be earlier than current time', { variant: 'error' })
      return false
    } else if (new Date(liveRegisterStartDate + 'T' + liveRegisterStartHours + ':' + liveRegisterStartMins) > new Date(liveRegisterEndDate + 'T' + liveRegisterEndHours + ':' + liveRegisterEndMins)) {
      enqueueSnackbar('End time can not be earlier than start time', { variant: 'error' })
      return false
    } else if (selectedImage === '') {
      enqueueSnackbar('Please upload image', { variant: 'error' })
      return false
    } else if (participateToggle === true && points === null) {
      enqueueSnackbar('Please Enter Points', { variant: 'error' })
      return false
    } else if (secretToggle === true && secret === null) {
      enqueueSnackbar('Please Enter Secret Number', { variant: 'error' })
      return false
    } else if (secret?.length < 4) {
      enqueueSnackbar('4 Numbers are required', { variant: 'error' })
      return false
    } else {
      confirmationSaveClubBannerModalHandler(true)
      // enqueueSnackbar(' uploaded image', { variant: 'success' })
    }
  }

  const confirmationSaveClubBannerModalHandler = (isOpen) => {
    setModalProps({
      isModalOpen: isOpen,
      content: 'Are you sure to save?',
      cancelBtn: 'Close',
      cancelBtnHandler: cancelConfirmation,
      successBtn: 'Ok',
      successBtnHandler: () => saveLiveRegisterHandler(),
      modalCloseHandler: confirmationSaveClubBannerModalHandler,
    })
  }

  const confirmationCloseModalHandler = (isOpen) => {
    setModalProps({
      isModalOpen: isOpen,
      title: 'Confirmation',
      content: 'Are you sure you want to leave this page? If you leave this page, changes you made may not be saved.',
      cancelBtn: 'Close',
      cancelBtnHandler: cancelConfirmation,
      successBtn: 'Ok',
      successBtnHandler: () => cancelModalHandler(),
      modalCloseHandler: confirmationCloseModalHandler,
    })
  }

  const cancelModalHandler = () => {
    setLiveRegisterTitle('')
    setLiveRegisterStartDate('')
    setLiveRegisterStartHours('')
    setLiveRegisterStartMins('')
    setLiveRegisterEndDate('')
    setLiveRegisterEndHours('')
    setLiveRegisterEndMins('')
    setDescription('')
    setSelectedImage('')
    setParticipateToggle(false)
    setSecretToggle(false)
    setPoints(null)
    setSecret(null)
    setModalProps({
      isModalOpen: false
    })
  }

  const cancelConfirmation = () => {
    setModalProps({
      isModalOpen: false
    })
  }

  const saveLiveRegisterHandler = async () => {
    try {
      const formData = new FormData()
      formData.append('title', liveRegisterTitle)
      formData.append('startDateTime', new Date(liveRegisterStartDate + 'T' + liveRegisterStartHours + ':' + liveRegisterStartMins))
      formData.append('endDateTime', new Date(liveRegisterEndDate + 'T' + liveRegisterEndHours + ':' + liveRegisterEndMins))
      formData.append('image', selectedImage)
      formData.append('description', description)
      formData.append('description', participateToggle)
      formData.append('description', points)
      formData.append('description', secretToggle)
      formData.append('description', secret)


      // const res = await postApi(API_ENDPOINT.create_club_banner, formData)
      // console.log(res)
      // if (res.status === 200) {
      //   if (res?.data?.status === 409) {
      //     enqueueSnackbar(res?.data?.msg, { variant: 'error' })
      //   } else {
      //     enqueueSnackbar('Club Banner Added Successfully', { variant: 'success' })
      //   }
      // }
    } catch (error) {
      console.log(error)
    }
    setModalProps({
      isModalOpen: false
    })
  }

  const handleTabClick = (value) => {
    try {
      console.log('value =>', value);
      if (value === 'Quiz') {
        setLiveRegisterTitle('')
        setLiveRegisterStartDate('')
        setLiveRegisterStartHours('')
        setLiveRegisterStartMins('')
        setLiveRegisterEndDate('')
        setLiveRegisterEndHours('')
        setLiveRegisterEndMins('')
        setDescription('')
        setSelectedImage('')
        setParticipateToggle(false)
        setSecretToggle(false)
        setPoints(null)
        setSecret(null)
        setActiveTab(value);
      } else {
        setActiveTab(value);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleLiveRegisterStartDate = (event) => {
    let d = new Date(event),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear()
    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day
    setLiveRegisterStartDate([year, month, day].join('-'))
  }

  const liveRegisterStartTimeHandler = (e) => {
    setLiveRegisterStartHours(e.target.value.split(':')[0])
    setLiveRegisterStartMins(e.target.value.split(':')[1])
  }

  const handleLiveRegisterEndDate = (event) => {
    let d = new Date(event),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear()
    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day
    setLiveRegisterEndDate([year, month, day].join('-'))
  }

  const liveRegisterEndTimeHandler = (e) => {
    setLiveRegisterEndHours(e.target.value.split(':')[0])
    setLiveRegisterEndMins(e.target.value.split(':')[1])
  }

  const handleChange = (e, type) => {
    // Remove non-numeric characters
    const sanitizedValue = e.target.value.replace(/[^0-9]/g, '');
    if (type === 'points') {
      setPoints(sanitizedValue);
    } else if (type === 'secret') {
      if (sanitizedValue.length <= 4) {
        setSecret(sanitizedValue);
      }
    }
  };

  const handleParticipantToggle = async () => {
    setParticipateToggle((prevState) => !prevState)
    if (participateToggle === false) {
      setPoints(null)
    }
  };

  const handleSecretToggle = async (e) => {
    setSecretToggle((prevState) => !prevState)
    if (secretToggle === false) {
      setSecret(null)
    }
  };

  const handleTitleChange = async (e) => {
    let value = e.target.value
    value = value.substring(0, 50)
    setLiveRegisterTitle(value)
  }

  const handleDescriptionChange = async (e) => {
    let value = e.target.value
    value = value.substring(0, 200)
    setDescription(value)
  }

  const handleQuizQuestionChange = async (e) => {
    let value = e.target.value
    value = value.substring(0, 100)
    setQuizQuestion(value)
  }

  const handleRadioChange = (value) => {
    setSelectedRadio(value);
  };

  const handleQuizeToggle = async () => {
    setQuizToggle((prevState) => !prevState)
    if (quizToggle === false) {
    }
  };


  const handlerewardPointsToggle = async () => {
    setrewardPointsToggle((prevState) => !prevState)
    if (rewardPointsToggle === false) {
    }
  };

  const uploadImagesHandler = (e) => {
    const files = uploadedImages ? [...uploadedImages] : []
    const eventFiles = e.target.files
    if (eventFiles.length + files.length > 4) {
      enqueueSnackbar(` Upto 4 images can be added`, { variant: 'error' })
      e.target.value = null
      return
    }
    Array.from(e.target.files).forEach((file) => {
      if (files.length === 10) {
        return //only first 10 files will be uploaded
      }
      files.push({ title: '', value: false, image: file })
    })
    e.target.value = null
    // setData((prev) => ({ ...prev, images: files }))
    setUploadedImages(files)
  }

  const deleteUploadedImageHandler = (imgFileIndex) => {
    const arrUploadedImages = [...uploadedImages]
    arrUploadedImages.splice(imgFileIndex, 1)
    // setData((prev) => ({ ...prev, images: imgFiles }))
    setUploadedImages(arrUploadedImages)
  }

  const titleHandler = async (index, val) => {
    const arrUploadedImages = [...uploadedImages]
    arrUploadedImages[index].title = val.substring(0, 15)
    setUploadedImages(arrUploadedImages)
  }

  const imageAnswerHandler = async (index) => {
    const arrUploadedImages = [...uploadedImages]
    for (let i = 0; i < arrUploadedImages.length; i++) {
      if (i === index) {
        console.log('test');
        arrUploadedImages[index].value = true
      } else {
        arrUploadedImages[i].value = false
      }
    }
    setUploadedImages(arrUploadedImages)
  }


  const addInputField = () => {
    const hasEmptyField = inputValues.some((input) => !input.value.trim());

    if (hasEmptyField) {
      enqueueSnackbar(`Add Answer`, { variant: 'error' })
      return
    }
    if (inputValues.length < 4) {
      setInputValues([...inputValues, { value: '', answer: false }]);
    } else {
      enqueueSnackbar(` Upto 4 Answers can be added`, { variant: 'error' })
    }
  };

  const MultipleAnswerHandler = async (index) => {
    const hasEmptyField = inputValues.some((input) => !input.value.trim());
    if (hasEmptyField) {
      enqueueSnackbar(`Add Answer`, { variant: 'error' })
      return
    }
    const arrMultipleAnswer = [...inputValues]
    for (let i = 0; i < arrMultipleAnswer.length; i++) {
      if (i === index) {
        console.log('test');
        arrMultipleAnswer[index].answer = true
      } else {
        arrMultipleAnswer[i].answer = false
      }
    }
    setInputValues(arrMultipleAnswer)
  }

  const handleMultipleInputChange = (index, value) => {
    const updatedValues = [...inputValues];
    updatedValues[index].value = value.substring(0, 30);
    setInputValues(updatedValues);
  };

  const deleteInputField = (index) => {
    const updatedValues = [...inputValues];
    if (updatedValues[index].answer === true) {
      updatedValues[index - 1].answer = inputValues[index].answer;
    }
    updatedValues.splice(index, 1);
    setInputValues(updatedValues);

  };

  const handleShortAnswerChange = async (e) => {
    let value = e.target.value
    value = value.substring(0, 50)
    setShortAnswer(value)
  }

  return (
    <div className='mb-5'>
      {isLoading && <Loader />}
      <ConfirmationModal modalProps={modalProps} />
      <main>
        <div className='mb-2'>
          <div>
            <CNav variant="underline" className='d-flex gap3 tabNav'>
              <CNavItem >
                <CNavLink role='button' className={activeTab === '' ? 'active' : ''} onClick={() => handleTabClick('')}>
                  {multiLang?.LiveManagementRegistrationLive?.Live}
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink role='button' className={activeTab === 'Quiz' ? 'active' : ''} onClick={() => handleTabClick('Quiz')}>{multiLang?.LiveManagementRegistrationLive?.Quiz}</CNavLink>
              </CNavItem>
            </CNav>
          </div>

          {/* Live */}

          {activeTab === '' &&
            <div>
              <div className='mt-4'>
                <div className='addItemWrp'>
                  <div className="card-body">
                    <div className="formWraper">
                      <div className="form-outline form-white d-flex ">
                        <div className="formWrpLabel" >
                          <label className="fw-bolder ">
                            {multiLang?.LiveManagementRegistrationLive?.Title} <span className="mandatory-red-asterisk">*</span>
                          </label>
                        </div>
                        <div className="formWrpInpt d-flex">
                          <div className="d-flex formradiogroup mb-2 gap-3">
                            <CFormInput
                              type="text"
                              value={liveRegisterTitle}
                              placeholder={multiLang?.LiveManagementRegistrationLive?.Title_placeholder}
                              name='Title'
                              onChange={(e) => {
                                handleTitleChange(e)
                              }}
                            />
                          </div>
                          <span className="txt-byte-information">{liveRegisterTitle.length} / 50 {multiLang?.LiveManagementRegistrationLive?.byte}</span>
                        </div>
                      </div>
                      <div className="form-outline form-white d-flex ">
                        <div className='d-flex col-md-6'>
                          <div className="formWrpLabel" >
                            <label className="fw-bolder ">
                              {multiLang?.LiveManagementRegistrationLive?.Scheduled_start_time} <span className="mandatory-red-asterisk">*</span>
                            </label>
                          </div>
                          <div>
                            <div className="formWrpInpt d-flex w-100">
                              <div className="d-flex formradiogroup mb-2 gap-1 w-100">
                                <DatePicker value={liveRegisterStartDate}
                                  onChange={(event) => handleLiveRegisterStartDate(event)}
                                />
                                <input
                                  type="time"
                                  name="time"
                                  id="time"
                                  className="time-picker"
                                  value={`${liveRegisterStartHours}:${liveRegisterStartMins}`}
                                  onChange={(e) => liveRegisterStartTimeHandler(e)}
                                />
                              </div>
                            </div>
                            <div>
                              <p>{multiLang?.LiveManagementRegistrationLive?.Scheduled_start_time_msg}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="form-outline form-white d-flex ">
                        <div className='d-flex col-md-6'>
                          <div className="formWrpLabel" >
                            <label className="fw-bolder ">
                              {multiLang?.LiveManagementRegistrationLive?.Scheduled_end_time}
                            </label>
                          </div>
                          <div>
                            <div className="formWrpInpt d-flex w-100">
                              <div className="d-flex formradiogroup mb-2 gap-1 w-100">
                                <DatePicker value={liveRegisterEndDate}
                                  onChange={(event) => handleLiveRegisterEndDate(event)} />
                                <input
                                  type="time"
                                  name="time"
                                  id="time"
                                  className="time-picker"
                                  value={`${liveRegisterEndHours}:${liveRegisterEndMins}`}
                                  onChange={(e) => liveRegisterEndTimeHandler(e)}
                                />
                              </div>
                            </div>
                            <div>
                              <p>{multiLang?.LiveManagementRegistrationLive?.Scheduled_end_time_msg}</p>
                            </div>
                          </div>

                        </div>
                      </div>
                      <div className="form-outline form-white d-flex ">
                        <div className="formWrpLabel">
                          <label className="fw-bolder ">
                            {multiLang?.LiveManagementRegistrationLive?.image} <span className="mandatory-red-asterisk">*</span>
                          </label>
                        </div>
                        <div className="upload-image-main-container">
                          <div className="upload-img-btn-and-info gap-3 align-items-center">
                            <div className="upload-container-btn">
                              <input
                                type="file"
                                name="imageFiles"
                                id="imageFiles"
                                style={{ display: 'none' }}
                                accept=".png, .jpg"
                                onChange={(e) => setSelectedImage(e.target.files[0])}
                              />
                            </div>
                            {selectedImage ? (
                              <div className="uploadImgWrap">
                                <i className="icon-close" onClick={() => setSelectedImage('')} />
                                <div className="thubmnail-img-container">
                                  <img src={URL.createObjectURL(selectedImage)} alt="" />
                                </div>
                              </div>
                            ) : (
                              <label className="uploadImgWrap" htmlFor="imageFiles">
                                <div className="thubmnail-img-container">
                                  <img src='https://www.beelights.gr/assets/images/empty-image.png' style={{ height: '100%', width: '100%' }} />
                                </div>
                              </label>

                            )}
                            <div className="upload-container-guidance">
                              <div className="file-information">
                                <ul>
                                  <li>- {multiLang?.LiveManagementRegistrationLive?.Image_size}</li>
                                  <li>{multiLang?.LiveManagementRegistrationLive?.File_format}</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="form-outline form-white d-flex ">
                        <div className='d-flex col-md-6'>
                          <div className="formWrpLabel" >
                            <label className="fw-bolder ">
                              {multiLang?.LiveManagementRegistrationLive?.Participation_Points}
                            </label>
                          </div>
                          <div className="formWrpInpt d-flex w-100 align-items-center gap-2">
                            <CFormSwitch
                              className="mx-1 me-2 mt-1"
                              color="success"
                              shape="pill"
                              variant="opposite"
                              checked={participateToggle}
                              onChange={() => handleParticipantToggle()}
                            />
                            {participateToggle === true &&
                              <div className='d-flex align-items-center gap-3'>
                                <CFormInput
                                  className='w-75'
                                  type="text"
                                  placeholder={multiLang?.LiveManagementRegistrationLive?.Enter_number}
                                  name='Points'
                                  value={points}
                                  onChange={(e) => handleChange(e, 'points')}
                                />
                                <p className='w-100'>{multiLang?.LiveManagementRegistrationLive?.Points}</p>
                              </div>
                            }
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className='formWrpLabel' />
                        <div className="form-outline form-white d-flex ">
                          <div className="formWrpLabel" >
                            <label className="fw-bolder">
                              {multiLang?.LiveManagementRegistrationLive?.Description}
                            </label>
                          </div>
                          <div className="formWrpInpt">
                            <div className="d-flex formradiogroup mb-2 gap-3">
                              <CFormTextarea
                                id="exampleFormControlTextarea1"
                                rows={3}
                                name='rentalGuideDescription'
                                placeholder={multiLang?.LiveManagementRegistrationLive?.Enter_Description}
                                value={description}
                                onChange={(e) => handleDescriptionChange(e)}
                              ></CFormTextarea>
                              <span className="txt-byte-information">{description.length} / 200 {multiLang?.LiveManagementRegistrationLive?.byte}</span>
                            </div>

                          </div>
                        </div>
                      </div>
                      <div className="form-outline form-white d-flex align-items-center">
                        <div className='d-flex col-md-6'>
                          <div className="formWrpLabel" >
                            <label className="fw-bolder ">
                              {multiLang?.LiveManagementRegistrationLive?.Secret}
                            </label>
                          </div>
                          <div className="formWrpInpt d-flex align-items-center gap-2 w-100">
                            <CFormSwitch
                              className="mx-1 me-2 mt-1"
                              color="success"
                              shape="pill"
                              variant="opposite"
                              checked={secretToggle}
                              onChange={() => handleSecretToggle()}
                            />
                            {secretToggle === true &&
                              <div className='d-flex'>
                                <CFormInput
                                  className='w-50'
                                  type="text"
                                  placeholder={multiLang?.LiveManagementRegistrationLive?.Enter_number}
                                  name='Points'
                                  value={secret}
                                  onChange={(e) => handleChange(e, 'secret')}
                                />
                                <div className='d-flex align-items-center'>
                                  <p className='w-50'>{secret?.length} / 4</p>
                                  <p>{multiLang?.LiveManagementRegistrationLive?.Secret_description}</p>
                                </div>
                              </div>
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '5%', gap: 10 }}>
                <CButton onClick={confirmationCloseModalHandler} style={{ marginRight: '2%', background: '#ccc', border: 'none' }}>{multiLang?.LiveManagementRegistrationLive?.Cancel}</CButton>
                <CButton onClick={validateLiveRegister}>{multiLang?.LiveManagementRegistrationLive?.Save}</CButton>
              </div>
            </div>
          }

          {/* Quiz */}
          {activeTab === 'Quiz' &&
            <div>
              <div className='mt-4'>
                <div className='addItemWrp'>
                  <div className="card-body">
                    <div className="formWraper">
                      <div className="form-outline form-white d-flex ">
                        <div className='d-flex col-md-6'>
                          <div className="formWrpLabel" >
                            <label className="fw-bolder ">
                              {multiLang?.LiveManagementRegistrationQuiz?.Quiz}
                            </label>
                          </div>
                          <div className="formWrpInpt d-flex w-100 align-items-center gap-2">
                            <CFormSwitch
                              className="mx-1 me-2 mt-1"
                              color="success"
                              shape="pill"
                              variant="opposite"
                              checked={quizToggle}
                              onChange={() => handleQuizeToggle()}
                            />
                          </div>
                        </div>
                      </div>
                      {quizToggle === true &&
                        <div>
                          <div className="form-outline form-white d-flex ">
                            <div className='d-flex col-md-6'>
                              <div className="formWrpLabel" >
                                <label className="fw-bolder ">
                                  {multiLang?.LiveManagementRegistrationQuiz?.Reward_Points}
                                </label>
                              </div>
                              <div>
                                <div className="formWrpInpt d-flex w-100 align-items-center gap-2">
                                  <CFormSwitch
                                    className="mx-1 me-2 mt-1"
                                    color="success"
                                    shape="pill"
                                    variant="opposite"
                                    checked={rewardPointsToggle}
                                    onChange={() => handlerewardPointsToggle()}
                                  />
                                  {rewardPointsToggle &&
                                    <div className='w-100'>
                                      <div className='d-flex gap-3 align-items-center'>
                                        <CFormInput
                                          className='w-75'
                                          type="text"
                                          placeholder={multiLang?.LiveManagementRegistrationLive?.Enter_number}
                                          name='Points'
                                        />
                                        <p className='w-100'>{multiLang?.LiveManagementRegistrationLive?.Points}</p>
                                      </div>

                                    </div>
                                  }
                                </div>
                                {rewardPointsToggle &&
                                  <div className="gap-2 ms-2">
                                    <CFormCheck type="radio" name="rewardPoints" id="exampleRadios1" label={multiLang?.LiveManagementRegistrationQuiz?.Points_shared_by_all}
                                      value={rewardPointsCheckBox}
                                      checked={rewardPointsCheckBox === true}
                                      onChange={() => setrewardPointsCheckBox(true)}
                                    />
                                    <CFormCheck type="radio" name="visibility" id="exampleRadios2" label={multiLang?.LiveManagementRegistrationQuiz?.Points_given_by_all}
                                      value={rewardPointsCheckBox}
                                      checked={rewardPointsCheckBox === false}
                                      onChange={() => setrewardPointsCheckBox(false)}
                                    />
                                  </div>
                                }

                              </div>
                            </div>
                          </div>

                          <div className="form-outline form-white d-flex ">
                            <div className='d-flex col-md-6'>
                              <div className="formWrpLabel" >
                                <label className="fw-bolder ">
                                  {multiLang?.LiveManagementRegistrationQuiz?.Create_Quiz}  <span className="mandatory-red-asterisk">*</span>
                                </label>
                              </div>
                              <div className="formWrpInpt d-flex w-100 align-items-center gap-2">
                                <CButton onClick={() => setVisible(!visible)}>{multiLang?.LiveManagementRegistrationQuiz?.Create} +</CButton>
                              </div>
                            </div>
                          </div>
                        </div>
                      }

                    </div>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '5%', gap: 10 }}>
                <CButton style={{ marginRight: '2%', background: '#ccc', border: 'none' }}>{multiLang?.LiveManagementRegistrationQuiz?.Cancel}</CButton>
                <CButton >{multiLang?.LiveManagementRegistrationQuiz?.Save}</CButton>
              </div>

              <div>
                <CModal
                  size="xl"
                  backdrop="static"
                  visible={visible}
                  onClose={() => setVisible(false)}
                  aria-labelledby="StaticBackdropExampleLabel"
                >
                  <CModalHeader>
                    <CModalTitle id="StaticBackdropExampleLabel">{multiLang?.LiveManagementRegistrationQuiz?.Create_Quiz}</CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                    <div className='d-flex col-md-12'>
                      <div className='col-md-6 pe-4'>
                        <div>
                          <h5 className='mb-2'>{multiLang?.LiveManagementRegistrationQuiz?.Question}</h5>
                          <CFormTextarea
                            id="exampleFormControlTextarea1"
                            rows={3}
                            name='rentalGuideDescription'
                            placeholder={multiLang?.LiveManagementRegistrationQuiz?.Enter_question}
                            value={quizQuestion}
                            onChange={(e) => handleQuizQuestionChange(e)}
                          ></CFormTextarea>
                          <span className='d-flex justify-content-end mt-1'>{quizQuestion.length} / 100 {multiLang?.LiveManagementRegistrationQuiz?.byte}</span>
                        </div>

                        <div className=''>
                          <h5>{multiLang?.LiveManagementRegistrationQuiz?.Quiz_type}</h5>
                          <div className='d-flex flex-wrap mt-2 mb-2'>
                            <CButton color="light" className="d-flex align-items-center w-50 gap-2" onClick={() => handleRadioChange('TrueFalse')}>
                              <CFormCheck
                                className='w-50 gap-2'
                                type="radio"
                                id="radioButton1"
                                name="TrueFalse"
                                // label="True/False"
                                checked={selectedRadio === 'TrueFalse'}
                              />
                              <CIcon icon={cilCircle}></CIcon>
                              <CIcon icon={cilX}></CIcon>
                              {multiLang?.LiveManagementRegistrationQuiz?.True_False}
                            </CButton>

                            <CButton color="light" className="d-flex align-items-center w-50 gap-2" onClick={() => handleRadioChange('Image')}>
                              <CFormCheck
                                className='w-50 gap-2'
                                type="radio"
                                id="radioButton2"
                                name="Image"
                                // label="Image"
                                checked={selectedRadio === 'Image'}
                              />
                              <CIcon icon={cilImage}></CIcon>
                              {multiLang?.LiveManagementRegistrationQuiz?.Image}
                            </CButton>

                            <CButton color="light" className="d-flex align-items-center w-50 gap-2" onClick={() => handleRadioChange('MultipleChoice')}>
                              <CFormCheck
                                type="radio"
                                className='w-50 gap-2'
                                id="radioButton3"
                                name="MultipleChoice"
                                // label="Multiple choice"
                                checked={selectedRadio === 'MultipleChoice'}
                              />
                              <CIcon icon={cilHamburgerMenu}></CIcon>
                              {multiLang?.LiveManagementRegistrationQuiz?.Multiple_Choice}
                            </CButton>

                            <CButton color="light" className="d-flex align-items-center w-50 gap-2" onClick={() => handleRadioChange('ShortAnswer')}>
                              <CFormCheck
                                className='w-50 gap-2'
                                type="radio"
                                id="radioButton4"
                                name="ShortAnswer"
                                // label="Short-answer"
                                checked={selectedRadio === 'ShortAnswer'}
                              />
                              <CIcon icon={cilRectangle}></CIcon>

                              {multiLang?.LiveManagementRegistrationQuiz?.Short_answer}
                            </CButton>

                          </div>
                        </div>
                        <div className='answer'>
                          <h5>Answer</h5>
                          {selectedRadio === 'TrueFalse' &&
                            <div className='d-flex'>
                              <CButton color="light" className="d-flex align-items-center w-50 gap-2" onClick={() => setAnswerSelectedRadio(true)}>
                                <CFormCheck
                                  className='w-50 gap-2'
                                  type="radio"
                                  id="radioButton1"
                                  name="True"
                                  label="True"
                                  checked={answerSelectedRadio === true}
                                />
                                {answerSelectedRadio === true &&
                                  <label
                                    className="btn btn-dark text-white btn-sm flex-end"
                                  >
                                    correct
                                  </label>
                                }

                              </CButton>
                              <CButton color="light" className="d-flex align-items-center w-50 gap-2" onClick={() => setAnswerSelectedRadio(false)}>
                                <CFormCheck
                                  className='w-50 gap-2'
                                  type="radio"
                                  id="radioButton1"
                                  name="False"
                                  label="False"
                                  checked={answerSelectedRadio === false}
                                />
                                {answerSelectedRadio === false &&
                                  <label
                                    className="btn btn-dark text-white btn-sm flex-end"
                                  >
                                    correct
                                  </label>
                                }
                              </CButton>
                            </div>
                          }
                          {selectedRadio === 'Image' &&
                            <div className='mt-2 mb-2'>
                              {uploadedImages?.length > 0 && (
                                <div className="upload-images-container uploadImgWrap">
                                  {uploadedImages.map((imgFile, index) => (
                                    <div key={index}>
                                      <div>
                                        <CButton color="light" className="d-flex align-items-center gap-2" onClick={() => imageAnswerHandler(index)}>
                                          <CFormCheck
                                            className='w-50 gap-2'
                                            type="radio"
                                            id="radioButton4"
                                            name="ShortAnswer"
                                            checked={uploadedImages[index]?.value === true}
                                          />

                                          <div
                                            className='remaining-img-container'
                                          >
                                            <img src={URL.createObjectURL(uploadedImages[index].image)} alt="" />
                                            <button
                                              className="thumbclsBtn"
                                              onClick={() => deleteUploadedImageHandler(index)}
                                            >
                                              <i className="icon-close"></i>
                                            </button>
                                            <div className='d-flex'>
                                              <CFormInput
                                                type="text"
                                                value={uploadedImages[index].title}
                                                placeholder={multiLang?.LiveManagementRegistrationLive?.Title_placeholder}
                                                // name='Title'
                                                onChange={(e) => titleHandler(index, e?.target?.value)}
                                              />
                                              <span>{uploadedImages[index]?.title?.length} / 15 {multiLang?.LiveManagementRegistrationQuiz?.byte}</span>
                                            </div>
                                          </div>

                                        </CButton>
                                        {uploadedImages[index].value === true &&
                                          <label
                                            className="btn btn-dark text-white btn-sm flex-end"
                                          >
                                            correct
                                          </label>
                                        }
                                      </div>
                                    </div>

                                  ))}
                                </div>
                              )}
                              {uploadedImages.length < 4 &&
                                <div className="formWrpInpt mt-2 mb-2">
                                  <div className="upload-container-btn">
                                    <label className="label-btn" color="dark" htmlFor="imageFiles">
                                      {multiLang?.LiveManagementRegistrationQuiz?.Create_Answer} +
                                      <input
                                        type="file"
                                        name="imageFiles"
                                        id="imageFiles"
                                        style={{ display: 'none' }}
                                        multiple
                                        accept=".png, .jpg, .jpeg, .gif"
                                        onChange={(e) => uploadImagesHandler(e)}
                                      />
                                    </label>
                                  </div>
                                </div>
                              }
                              <div className="upload-container-guidance">
                                <div className="file-information">
                                  <ul>
                                    <li>- {multiLang?.LiveManagementRegistrationLive?.Image_size}</li>
                                    <li>{multiLang?.LiveManagementRegistrationLive?.File_format}</li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          }

                          {selectedRadio === 'MultipleChoice' &&
                            <div >
                              <div>
                                {inputValues.map((input, index) => (
                                  <div key={index} className='d-flex mt-3 mb-2'>
                                    <div>
                                      <CButton color="light" className="d-flex align-items-center gap-2" onClick={() => MultipleAnswerHandler(index)}>
                                        <CFormCheck
                                          className='w-50 gap-2'
                                          type="radio"
                                          id="radioButton4"
                                          name="ShortAnswer"
                                          checked={input.answer === true}
                                        />
                                        <CFormInput
                                          type="text"
                                          value={input.value}
                                          onChange={(e) => handleMultipleInputChange(index, e.target.value)}
                                        // placeholder={`Input ${index + 1} Value`}
                                        />
                                        <span>{input.value.length} / 30</span>

                                      </CButton>
                                    </div>

                                    {input.answer === true &&
                                      <label
                                        className="btn btn-dark text-white btn-sm flex-end"
                                      >
                                        correct
                                      </label>
                                    }
                                    {index >= 2 && (
                                      <button
                                        className="thumbclsBtn"
                                        onClick={() => deleteInputField(index)}
                                      >
                                        <i className="icon-close"></i>
                                      </button>
                                    )}

                                  </div>

                                ))}
                              </div>
                              {inputValues.length < 4 &&
                                <CButton onClick={addInputField}>{multiLang?.LiveManagementRegistrationQuiz?.Create_Answer} +</CButton>
                              }
                            </div>
                          }

                          {selectedRadio === 'ShortAnswer' &&
                            <div className="formWrpInpt d-flex">
                              <div className="d-flex formradiogroup mb-2 gap-3">
                                <CFormInput
                                  type="text"
                                  value={shortAnswer}
                                  placeholder={multiLang?.LiveManagementRegistrationQuiz?.Enter_answer}
                                  name='Title'
                                  onChange={(e) => {
                                    handleShortAnswerChange(e)
                                  }}
                                />
                              </div>
                              <span className="txt-byte-information">{shortAnswer.length} / 50 {multiLang?.LiveManagementRegistrationLive?.byte}</span>
                            </div>
                          }
                        </div>

                        <div className='answer d-flex align-items-center gap-2'>
                          <h5>Time limit</h5>
                          <CFormInput
                            className='w-25'
                            type='number'
                            value={timeLimit}
                            onChange={handleTimeInputChange}
                          />
                          <p>second(s)</p>
                        </div>
                      </div>



                      <div className='col-md-6'>
                        <div>
                          <div className='container mt-3'>
                            <div className='p-3'>
                              <CCard className="text-center">
                                <CCardBody>
                                  {/* <CCardTitle>Centered Card Title</CCardTitle> */}
                                  <CCardText>
                                    {quizQuestion}
                                  </CCardText>
                                  {selectedRadio === 'TrueFalse' &&
                                    <div className='TrueFalse gap-2 mt-3 d-flex justify-content-center gap-3'>
                                      <CFormCheck className='ms-2' button={{ color: 'secondary' }} type="radio" name="options" id="option3" autoComplete="off" label="True" disabled />
                                      <CFormCheck button={{ color: 'secondary' }} type="radio" name="options" id="option3" autoComplete="off" label="False" disabled />
                                    </div>
                                  }
                                  {selectedRadio === 'Image' &&
                                    <div className='TrueFalse gap-2 mt-3 d-flex justify-content-center gap-3'>
                                      {uploadedImages?.length > 0 && (
                                        <div className="upload-images-container uploadImgWrap">
                                          {uploadedImages.map((input, index) => (
                                            <div key={index}>
                                              <div>
                                                <div
                                                  className='remaining-img-container'
                                                >
                                                  <img src={URL.createObjectURL(input.image)} alt="" />
                                                  <p>{input.title}</p>
                                                </div>
                                              </div>
                                            </div>

                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  }

                                  {selectedRadio === 'MultipleChoice' &&
                                    <div className='TrueFalse gap-2 mt-3 d-flex justify-content-center gap-3'>

                                      {inputValues?.length > 0 && (
                                        <div className="upload-images-container uploadImgWrap d-block">
                                          {inputValues.map((input, index) => (
                                            <div key={index} >
                                              <div>
                                                <p>{input.value}</p>
                                              </div>
                                            </div>

                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  }
                                  {selectedRadio === 'ShortAnswer' &&
                                    <div className='TrueFalse gap-2 mt-3 d-flex justify-content-center gap-3'>

                                      {inputValues?.length > 0 && (
                                        <div className="upload-images-container uploadImgWrap d-block">
                                          <p>{shortAnswer}</p>
                                        </div>
                                      )}
                                    </div>
                                  }
                                </CCardBody>
                              </CCard>
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>
                  </CModalBody>
                  <CModalFooter className='d-flex justify-content-center'>
                    <CButton color="secondary" onClick={() => setVisible(false)}>
                      Close
                    </CButton>
                    <CButton color="primary">Save</CButton>
                  </CModalFooter>
                </CModal>
              </div>


            </div>
          }

        </div>
      </main>
    </div>
  )
}

export default LiveRegistration
