import { cilAudio, cilCircle, cilHamburgerMenu, cilImage, cilRectangle, cilX } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CButton, CCard, CCardBody, CCardText, CCardTitle, CFormCheck, CFormInput, CFormSelect, CFormSwitch, CFormTextarea, CImage, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CNav, CNavItem, CNavLink } from '@coreui/react';
import { enqueueSnackbar } from 'notistack';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import DatePicker from 'react-date-picker';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import Loader from 'src/components/common/Loader'
import { deleteApi, getApi, postApi, putApi } from 'src/utils/Api';
import ConfirmationModal from 'src/utils/ConfirmationModal';
import { ALL_CONSTANTS, API_ENDPOINT } from 'src/utils/config';
import { imageUrl } from '../../BookRentalManagement/BookRentalStatus';

const LiveRegistration = () => {
  const { t, i18n } = useTranslation();
  const translationObject = i18n.getDataByLanguage(i18n.language);
  const multiLang = translationObject?.translation

  const navigate = useNavigate()
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('');
  const inputRef = useRef(null)
  const [modalProps, setModalProps] = useState({})
  const [liveStatus, setLiveStatus] = useState('')
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
  const [selectedRadio, setSelectedRadio] = useState('TrueOrFalse');
  const [answerSelectedRadio, setAnswerSelectedRadio] = useState(true);
  const [rewardPointsToggle, setrewardPointsToggle] = useState(false)
  const [rewardPointsCheckBox, setrewardPointsCheckBox] = useState(true)
  const [uploadedImages, setUploadedImages] = useState([])
  const [inputValues, setInputValues] = useState([]);
  const [shortAnswer, setShortAnswer] = useState('')
  const [timeLimit, setTimeLimit] = useState(10)
  const [mainQuizs, setMainQuizs] = useState([])
  const [currentQuizeIndex, setCurrentQuizeIndex] = useState(null)
  const [rewardPoints, setRewardPoints] = useState(null)
  const [questionsId, setQuestionsId] = useState(null)
  const [streamId, setStreamId] = useState(null)
  const [quizIdTodelete, setQuizIdToDelete] = useState(null)
  const [type, setType] = useState('')

  const handleTimeInputChange = (e) => {
    const sanitizedValue = e.target.value.replace(/[^0-9]/g, '');
    const newValue = sanitizedValue
    setTimeLimit(newValue);
  };

  console.log('quizIdTodelete', quizIdTodelete)
  console.log('mainQuizs', mainQuizs)

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
      confirmationSaveLiveRegisterModalHandler(true)
      // enqueueSnackbar(' uploaded image', { variant: 'success' })
    }
  }

  const confirmationSaveLiveRegisterModalHandler = (isOpen) => {
    setModalProps({
      isModalOpen: isOpen,
      content: 'Are you sure to save?',
      cancelBtn: 'Close',
      cancelBtnHandler: cancelConfirmation,
      successBtn: 'Ok',
      successBtnHandler: () => saveLiveRegisterHandler(),
      modalCloseHandler: confirmationSaveLiveRegisterModalHandler,
    })
  }

  const confirmationSaveLiveRegistrationModalHandler = (isOpen) => {
    setModalProps({
      isModalOpen: isOpen,
      content: 'Are you sure to save?',
      cancelBtn: 'Close',
      cancelBtnHandler: cancelConfirmation,
      successBtn: 'Ok',
      successBtnHandler: () => saveQuizRegistration(),
      modalCloseHandler: confirmationSaveLiveRegistrationModalHandler,
    })
  }

  const confirmationDeleteHandler = (isOpen, index) => {
    setModalProps({
      isModalOpen: isOpen,
      content: 'Are you sure to delete?',
      cancelBtn: 'Close',
      cancelBtnHandler: cancelConfirmation,
      successBtn: 'Ok',
      successBtnHandler: () => deleteQuiz(index),
      // modalCloseHandler: confirmationSaveLiveRegistrationModalHandler,
    })
  }

  const confirmationCloseModalHandler = (isOpen) => {
    setModalProps({
      isModalOpen: isOpen,
      title: '',
      content: multiLang?.LiveManagementRegistrationQuiz?.closePopUpMsg,
      cancelBtn: 'Close',
      cancelBtnHandler: cancelConfirmation,
      successBtn: multiLang?.LiveManagementRegistrationQuiz?.ok,
      successBtnHandler: () => cancelModalHandler(),
      modalCloseHandler: confirmationCloseModalHandler,
    })
  }

  const cancelModalHandler = () => {
    // setLiveRegisterTitle('')
    // setLiveRegisterStartDate('')
    // setLiveRegisterStartHours('')
    // setLiveRegisterStartMins('')
    // setLiveRegisterEndDate('')
    // setLiveRegisterEndHours('')
    // setLiveRegisterEndMins('')
    // setDescription('')
    // setSelectedImage('')
    // setParticipateToggle(false)
    // setSecretToggle(false)
    // setPoints(null)
    // setSecret(null)
    navigate('/LiveManagement')
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
      formData.append('scheduledAt', new Date(new Date(liveRegisterStartDate + 'T' + liveRegisterStartHours + ':' + liveRegisterStartMins)).toISOString())
      formData.append('scheduledUpto', (liveRegisterEndDate !== '' ? new Date(new Date(liveRegisterEndDate + 'T' + liveRegisterEndHours + ':' + liveRegisterEndMins)).toISOString() : ''))
      formData.append('images', selectedImage)
      formData.append('content', description)
      formData.append('participationRewardPoints', (points !== null ? points : 0))
      if (secret !== null) {
        formData.append('password', secret)
      }
      console.log('form data =>', formData);
      if (location?.state?.streamId) {
        formData.append('id', location?.state?.streamId)
        const res = await putApi(API_ENDPOINT.editLiveStream, formData)
        if (res?.status === 200) {
          if (res?.data?.status === 500) {
            enqueueSnackbar(res?.data?.msg, { variant: 'error' })
          } else {
            enqueueSnackbar('LiveStream updated Successfully', { variant: 'success' })
            navigateToList()
          }
        }
      }
      else {
        const res = await postApi(API_ENDPOINT.createLiveStream, formData)
        console.log(' new =>', res)
        if (res.status === 200) {
          if (res?.data?.status === 500) {
            enqueueSnackbar(res?.data?.msg, { variant: 'error' })
          } else {
            enqueueSnackbar('LiveStream Added Successfully', { variant: 'success' })
            navigateToList()
          }
        }
      }
    } catch (error) {
      console.log(error)
    }
    setModalProps({
      isModalOpen: false
    })
  }

  console.log('upload', uploadedImages)

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
        setQuestionsId(null)
      } else {
        setActiveTab(value);
        getStreamDetails()
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
    } else if (type === 'quiz') {
      setRewardPoints(sanitizedValue)
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
    if (value === 'TrueOrFalse') {
      setUploadedImages([])
      setInputValues([{ value: '', answer: true }])
      setShortAnswer('')
    } else if (value === 'imageMultipleChoice') {
      setAnswerSelectedRadio(true)
      setInputValues([{ value: '', answer: true }])
      setShortAnswer('')
    } else if (value === 'multipleChoice') {
      setAnswerSelectedRadio(true)
      setUploadedImages([])
      setShortAnswer('')
    } else if (value === 'shortAnswer') {
      setAnswerSelectedRadio(true)
      setUploadedImages([])
      setInputValues([{ value: '', answer: true }])
    }
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
      if (files.length === 4) {
        return //only first 10 files will be uploaded
      }
      if (files.length <= 0) {
        files.push({ title: '', value: true, image: file })
      } else {
        files.push({ title: '', value: false, image: file })
      }
    })
    e.target.value = null
    setUploadedImages(files)
  }

  const deleteUploadedImageHandler = (e, imgFileIndex) => {
    e.stopPropagation()
    const arrUploadedImages = [...uploadedImages]
    console.log('arrUploadedImages =>', arrUploadedImages);
    if (arrUploadedImages[imgFileIndex].value === true) {
      console.log('1 =>', arrUploadedImages[imgFileIndex + 1]);
      console.log('2 =>', arrUploadedImages[imgFileIndex - 1]);
      if (arrUploadedImages[imgFileIndex - 1] === undefined) {
        arrUploadedImages[imgFileIndex + 1].value = true
      } else if (arrUploadedImages[imgFileIndex + 1] === undefined) {
        arrUploadedImages[imgFileIndex - 1].value = true
      }
    }
    arrUploadedImages.splice(imgFileIndex, 1)
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

  const validateQuize = async () => {

    if (quizQuestion.trim() === '') {
      enqueueSnackbar('Please enter a Question.', { variant: 'error' })
      return false
    } else if (selectedRadio === null) {
      enqueueSnackbar('Please select quiz type', { variant: 'error' })
      return false
    } else if (selectedRadio === 'TrueOrFalse' && answerSelectedRadio === null) {
      enqueueSnackbar('Please select answer', { variant: 'error' })
      return false
    }
    else if (selectedRadio === 'imageMultipleChoice' && uploadedImages.length < 1) {
      enqueueSnackbar('Please select Image', { variant: 'error' })
      return false
    }
    else if (selectedRadio === 'imageMultipleChoice' && uploadedImages.length < 2) {
      enqueueSnackbar('Please select atleast 2 images', { variant: 'error' })
      return false
    }
    else if (selectedRadio === 'imageMultipleChoice' && uploadedImages.some(img => img.title === '')) {
      console.log('hhs');
      enqueueSnackbar('Enter image title', { variant: 'error' })
      return false
    }
    else if (selectedRadio === 'multipleChoice' && inputValues?.some((input) => !input?.value.trim())) {
      enqueueSnackbar(`Add Answer`, { variant: 'error' })
      return
    }
    else if (selectedRadio === 'multipleChoice' && inputValues.length < 2) {
      enqueueSnackbar('Please add atleast 2 options', { variant: 'error' })
      return false
    }
    else if (selectedRadio === 'shortAnswer' && shortAnswer === '') {
      enqueueSnackbar('Please enter a Answer.', { variant: 'error' })
      return false

    } else if (timeLimit.length === 0) {
      enqueueSnackbar('Please enter a Time limit.', { variant: 'error' })
      return false

    } else if (timeLimit.length > 0 && timeLimit[0] === '0') {
      enqueueSnackbar('First digit cannot be 0. Please enter a valid Time limit.', { variant: 'error' })
      return false
    } else {
      await saveQuiz()
    }

  }

  const resetQuiz = async () => {
    setQuizQuestion('')
    setSelectedRadio('TrueOrFalse')
    setAnswerSelectedRadio(true)
    setUploadedImages([])
    setInputValues([{ value: '', answer: true }])
    setShortAnswer('')
    setTimeLimit(10)
    setQuestionsId(null)
  }

  const saveQuiz = async () => {
    let quizData = {
      title: quizQuestion,
      timeLimitSeconds: timeLimit
    };

    if (questionsId) {
      quizData['id'] = questionsId
      quizData['streamId'] = streamId
    }

    if (selectedRadio === 'TrueOrFalse') {
      quizData['type'] = "TrueOrFalse"
      quizData['options'] = [{ "title": "True" }, { "title": "False" }]
      quizData['isCorrect'] = answerSelectedRadio
    }

    if (selectedRadio === 'imageMultipleChoice') {
      quizData['type'] = "imageMultipleChoice"
      quizData['options'] = uploadedImages
      for (let index = 0; index < uploadedImages.length; index++) {
        if (uploadedImages[index].value === true) {
          quizData['isCorrect'] = { title: uploadedImages[index].title, image: imageUrl + uploadedImages[index].image }
        }
      }

    }

    if (selectedRadio === 'multipleChoice') {
      quizData['type'] = "multipleChoice"
      quizData['options'] = inputValues
      for (let index = 0; index < inputValues.length; index++) {
        if (inputValues[index].answer === true) {
          quizData['isCorrect'] = { value: inputValues[index].value, answer: inputValues[index].answer }
        }
      }
    }

    if (selectedRadio === 'shortAnswer') {
      quizData['type'] = "shortAnswer"
      quizData['options'] = [{ "title": shortAnswer }]
      quizData['isCorrect'] = shortAnswer
    }

    console.log('quizData =>', quizData);

    if (currentQuizeIndex !== null) {
      const getData = [...mainQuizs]
      console.log('getData', getData)
      getData[currentQuizeIndex] = quizData
      setMainQuizs(getData)
      enqueueSnackbar('Update succesfully.', { variant: 'success' })
      setCurrentQuizeIndex(null)
    } else {
      const allQuizData = mainQuizs ? [...mainQuizs] : []
      allQuizData.push(quizData)
      setMainQuizs(allQuizData)
      enqueueSnackbar('Added succesfully.', { variant: 'success' })
      setCurrentQuizeIndex(null)
    }
    setVisible(false)
    resetQuiz()
  }

  console.log('ans', questionsId)

  const editQuiz = useCallback(async (data, index) => {
    console.log('edit data =>', data);
    setQuestionsId(data?.id)
    setCurrentQuizeIndex(index)
    setQuizQuestion(data.title)
    setTimeLimit(data.timeLimitSeconds)
    setSelectedRadio(data.type)
    setStreamId(data?.streamId)
    setType(data.type)
    // setInputValues(data?.options)

    if (data?.type === 'TrueOrFalse') {
      data?.options?.map((val) => {
        console.log('first', val)
        setAnswerSelectedRadio(val?.isCorrect === 0 ? false : true)
      })
    }
    if (data?.type === 'imageMultipleChoice') {
      const inputva = data?.options?.map(val => ({
        title: val?.title,
        value: val?.isCorrect === 0 ? false : true,
        ...val
      }))
      setUploadedImages(inputva)

    }
    if (data?.type === 'multipleChoice') {
      const inputval = data?.options?.map(val => ({
        value: val?.title,
        answer: val.isCorrect === 0 ? false : true
      }))

      setInputValues(inputval)

    }
    if (data?.type === 'shortAnswer') {
      data?.options?.map((val) => {
        setShortAnswer(val?.title)
      })

    }
    setVisible(true)
  }, [visible])

  console.log('input', uploadedImages)

  const deleteQuiz = async (index) => {
    const originalData = [...mainQuizs]
    originalData.splice(index, 1)
    setMainQuizs(originalData)
    //  try {   
    //    let url = `${API_ENDPOINT.deleteQuizQuestion}?questionId=${id}`
    //    const res = await deleteApi(url)
    //    if (res?.data?.status === 200) {
    //      enqueueSnackbar('Quiz question deleted successfully', { variant: 'success' })
    //      getStreamDetails()
    //    }
    //    else {
    //      enqueueSnackbar('Failed to delete the Quiz question', { variant: 'error' })
    //    }
    //  } catch (error) {

    //  }
    setModalProps({
      isModalOpen: false
    })

  }

  const validateAllRegistration = async () => {
    if (quizToggle === true && mainQuizs.length <= 0) {
      enqueueSnackbar('creating at least one Quiz is required.', { variant: 'error' })
      return
    } else if (rewardPointsToggle === true && rewardPoints === null) {
      setrewardPointsToggle(false)
    } else {
      confirmationSaveLiveRegistrationModalHandler(true)
    }
  }

  const saveQuizRegistration = async () => {
    setIsLoading(true)
    console.log('mainQuizs =>', mainQuizs)

    try {
      let url = `${API_ENDPOINT.deleteQuizQuestion}?questionId=${quizIdTodelete}`
      const res = await deleteApi(url)
      if (res?.data?.status === 200) {
        //  enqueueSnackbar('Quiz question deleted successfully', { variant: 'success' })
        getStreamDetails()
      }
      else {
        //  enqueueSnackbar('Failed to delete the Quiz question', { variant: 'error' })
      }
    } catch (error) {

    }

    try {
      let data = {
        streamId: location?.state?.streamId,
        quizRewardPoints: rewardPoints !== null ? rewardPoints : 0,
        quizRewardType: rewardPointsCheckBox === true ? 'sharedByAll' : 'givenToAll'
      }
      console.log('form data =>', data);

      const responce = await putApi(API_ENDPOINT.updateQuizInfo, data)
      console.log(' new =>', responce)

      console.log('test', mainQuizs);



      for (let obj in mainQuizs) {
        const formData = new FormData()
        console.log('obj', mainQuizs[obj].question);
        formData.append('streamId', location?.state?.streamId)
        formData.append('title', mainQuizs[obj].title)
        formData.append('type', mainQuizs[obj].type)
        formData.append('timeLimitSeconds', mainQuizs[obj].timeLimitSeconds)
        formData.append('order', obj)


        console.log('mainQuizs[obj].options =>', mainQuizs[obj].options);
        if (mainQuizs[obj].type === 'shortAnswer') {
          formData.append(`options[${0}][title]`, mainQuizs[obj].options[0].title)
          formData.append(`options[${0}][isCorrect]`, 1)

        } else {
          for (let i in mainQuizs[obj].options) {
            console.log('i =>', mainQuizs[obj].options[i]);
            if (mainQuizs[obj].type === 'TrueOrFalse') {
              formData.append(`options[${i}][title]`, mainQuizs[obj].options[i].title)
              if (mainQuizs[obj].isCorrect === true || mainQuizs[obj].options[i].isCorrect === 1) {
                formData.append(`options[${i}][isCorrect]`, 1)
              }
              else {
                formData.append(`options[${i}][isCorrect]`, 0)
              }
            } else if (mainQuizs[obj].type === 'imageMultipleChoice') {
              // images.push(mainQuizs[obj].options[i].image)
              formData.append(`options[${i}][title]`, mainQuizs[obj].options[i].title)
              if (mainQuizs[obj].options[i].value === true) {
                formData.append(`options[${i}][isCorrect]`, 1)
              } else {
                formData.append(`options[${i}][isCorrect]`, 0)
              }
              formData.append('images', mainQuizs[obj].options[i].image)
            } else if (mainQuizs[obj].type === 'multipleChoice') {
              formData.append(`options[${i}][title]`, mainQuizs[obj].options[i].value ? mainQuizs[obj].options[i].value : mainQuizs[obj].options[i].title)
              if (mainQuizs[obj].options[i].answer === true || mainQuizs[obj].options[i].isCorrect === 1) {
                formData.append(`options[${i}][isCorrect]`, 1)
              } else {
                formData.append(`options[${i}][isCorrect]`, 0)
              }
            }
          }
        }

        console.log('ids1', mainQuizs[obj].id)
        // console.log('ids2', questionsId)
        // console.log('id')

        console.log('form data =>', formData);
        console.log('type', type)
        let res = ''
        if (mainQuizs[obj].id) {
          formData.append('questionId', mainQuizs[obj].id)
          res = await putApi(API_ENDPOINT.editQuizQuestion, formData)
          if (res?.data?.status == 200) {
            getStreamDetails()
            // enqueueSnackbar('Quiz question Updated Successfully', { variant: 'success' })
            // navigate('/LiveManagement')
            setIsLoading(false)
          }
          else {
            enqueueSnackbar('Request failed', { variant: 'error' })
          }
        }
        else {
          res = await postApi(API_ENDPOINT.addQuizQuestion, formData)
          if (res?.status === 200) {
            getStreamDetails()
            // navigate('/LiveManagement')
            if (res?.data?.status === 400) {
              enqueueSnackbar(res?.data?.msg, { variant: 'error' })
            } else if (res?.data?.status !== 200) {
              enqueueSnackbar(res?.data?.error, { variant: 'error' })
            }
            else if (res?.data?.status === 200) {
              enqueueSnackbar('Quiz question Added Successfully', { variant: 'success' })
              setIsLoading(false)
              // setIsLoading(false)
            }
          }
        }
      }


      // console.log('form data =>', formData);
      // const res = await postApi(API_ENDPOINT.createLiveStream, formData)
      // console.log(' new =>', res)
      // if (res.status === 200) {
      //   if (res?.data?.status === 500) {
      //     enqueueSnackbar(res?.data?.msg, { variant: 'error' })
      //   } else {
      //     enqueueSnackbar('LiveStream Added Successfully', { variant: 'success' })
      //     navigateToList()
      //   }
      // }
    } catch (error) {
      console.log(error)
    }
    setModalProps({
      isModalOpen: false
    })

  }


  const navigateToList = async () => {
    navigate('/LiveManagement')
  }

  const quizCheck = async () => {
    if (location?.state?.streamId !== undefined) {
      handleTabClick('Quiz')
    } else {
      enqueueSnackbar('Add live stream first.', { variant: 'error' })
    }
  }

  const getStreamDetails = async () => {
    setIsLoading(true)
    try {
      let url = `${API_ENDPOINT.getStreamDetails}?streamId=${location?.state?.streamId}`
      const res = await getApi(url)
      console.log("res", res)
      if (res.status === 200) {
        setLiveStatus(res?.data?.status)
        setLiveRegisterTitle(res?.data?.title)
        setRewardPoints(res?.data?.quizRewardPoints)
        if (res?.data?.quizRewardPoints > 0) {
          setrewardPointsToggle(true)
        }
        if (res?.data?.questions.length > 0) {
          setQuizToggle(true)
        }
        setrewardPointsCheckBox(res?.data?.quizRewardType === "sharedByAll" ? true : false)
        setSecret(res?.data?.password)
        if (res?.data?.password) {
          setSecretToggle(true)
        }
        // quizRewardType
        setIsLoading(false)
        console.log('questions', res?.data?.questions)
        // if (res?.data?.questions?.length > 0) {
        setMainQuizs(res?.data?.questions)

        // const images = res?.data?.questions?.map((item) => {
        //   if (item?.type === 'imageMultipleChoice') {
        //     item?.options?.map((val) => ({
        //       title: val?.title,
        //       value: val?.isCorrect === 0 ? false : true,
        //       image: imageUrl + val?.image,
        //       ...val
        //     }))
        //   }
        // })
        // setUploadedImages(images)


        // res?.data?.question?.map((val) => {
        //   console.log('val', val)
        //   setQuizQuestion(val?.title)
        //   setSelectedRadio(val?.type)
        //   setTimeLimit(val?.timeLimitSeconds)
        //   setInputValues(val?.options)
        // })
        // }
        // setQuizQuestion
        // console.log(new Date(res?.data?.scheduledAt))

        let startDateTime = new Date(res?.data?.scheduledAt),
          startMonth = '' + (startDateTime.getMonth() + 1),
          startDay = '' + startDateTime.getDate(),
          startYear = startDateTime.getFullYear()
        if (startMonth.length < 2) startMonth = '0' + startMonth
        if (startDay.length < 2) startDay = '0' + startDay
        setLiveRegisterStartDate([startYear, startMonth, startDay].join('-'))
        if (startDateTime.getHours() < 10) {
          setLiveRegisterStartHours('0' + (startDateTime.getHours()))
        } else {
          setLiveRegisterStartHours(startDateTime.getHours())
        }
        if (startDateTime.getMinutes() < 10) {
          setLiveRegisterStartMins('0' + startDateTime.getMinutes())
        } else {
          setLiveRegisterStartMins(startDateTime.getMinutes())
        }

        let endDateTime = new Date(res?.data?.scheduledUpto),
          endMonth = '' + (endDateTime.getMonth() + 1),
          endDay = '' + endDateTime.getDate(),
          endYear = endDateTime.getFullYear()
        if (endMonth.length < 2) endMonth = '0' + endMonth
        if (endDay.length < 2) endDay = '0' + endDay
        setLiveRegisterEndDate([endYear, endMonth, endDay].join('-'))
        if (endDateTime.getHours() < 10) {
          setLiveRegisterEndHours('0' + (endDateTime.getHours()))
        } else {
          setLiveRegisterEndHours(endDateTime.getHours())
        }
        if (endDateTime.getMinutes() < 10) {
          setLiveRegisterEndMins('0' + endDateTime.getMinutes())
        } else {
          setLiveRegisterEndMins(endDateTime.getMinutes())
        }
        const image = await urlToFile(res?.data?.background)
        setSelectedImage(image)

        setParticipateToggle(res?.data?.participationRewardPoints !== 0)
        setPoints(res?.data?.participationRewardPoints)
        setDescription(res?.data?.content)
      }
    } catch (error) {
      console.log(error)
    }
    finally {
      setIsLoading(false)
    }
  }

  console.log('uploadedImages', uploadedImages)

  async function urlToBlob(url) {
    const response = await fetch(url)
    const blob = await response.blob()
    return blob
  }

  const urlToFile = async (url) => {
    const blob = await urlToBlob(ALL_CONSTANTS.BASE_URL + "/" + url)
    const fileName = url
    return new File([blob], fileName, { type: blob.type })
  }

  const consoleLiveHandler = () => {
    navigate('../LiveManagement/liveConsole', { state: { streamId: location?.state?.streamId }})
  }

  useEffect(() => {
    if (location?.state?.streamId !== undefined) {
      getStreamDetails()
    }
  }, [])

  return (
    <div className='mb-5'>
      {isLoading && <Loader />}
      <ConfirmationModal modalProps={modalProps} />
      <main>
        <div className="pageTitle mb-3 pb-2">
          <h2>Live Registration</h2>
        </div>
        {/* edit only  */}


        <div className="d-flex justify-content-end align-items-center mb-2">
          {/* <div>
            <p>{multiLang?.LiveManagementRegistrationLive?.liveDetails}</p>
          </div> */}
          <div className='d-flex gap-3'>
            <CButton onClick={consoleLiveHandler}>{multiLang?.LiveManagementRegistrationLive?.console}  <CIcon icon={cilAudio}></CIcon> </CButton>
            <CButton className='btn-black'>{multiLang?.LiveManagementRegistrationLive?.liveCancel}</CButton>
          </div>

        </div>

        {location?.state?.streamId !== undefined &&
          <div className="d-flex justify-content-between p-3 h-100 w-100 bg-light rounded mt-2 mb-4">
            <div className="align-items-center align-items-center">
              <p className="fw-medium me-3" style={{ 'white-space': 'nowrap' }}>
                {multiLang?.LiveManagementRegistrationLive?.start}
              </p>
              <p>-</p>
            </div>
            <div className="align-items-center ms-2 align-items-center">
              <p className="fw-medium me-1">{multiLang?.LiveManagementRegistrationLive?.end}</p>
              <p>-</p>
            </div>
            <div className="align-items-center ms-2 align-items-center">
              <p className="fw-medium me-1">{multiLang?.LiveManagementRegistrationLive?.time}</p>
              <p>-</p>
            </div>
            <div className="align-items-center ms-2 align-items-center">
              <p className="fw-medium me-1">{multiLang?.LiveManagementRegistrationLive?.uniqueVisitor}</p>
              <p>-</p>
            </div>
            <div className="align-items-center ms-2 align-items-center">
              <p className="fw-medium me-1">{multiLang?.LiveManagementRegistrationLive?.pageView}</p>
              <p>-</p>
            </div>
            <div className="align-items-center ms-2 align-items-center">
              <p className="fw-medium me-1">{multiLang?.LiveManagementRegistrationLive?.like}</p>
              <p>-</p>
            </div>
            <div className="align-items-center ms-2 align-items-center">
              <p className="fw-medium me-1">{multiLang?.LiveManagementRegistrationLive?.chat}</p>
              <p>-</p>
            </div>
            <div className="align-items-center ms-2 align-items-center">
              <p className="fw-medium me-1">{multiLang?.LiveManagementRegistrationLive?.creator}</p>
              <p>-</p>
            </div>

          </div>
        }


        {/* edit only */}

        <div className='mb-2'>
          <div>
            <CNav variant="underline" className='d-flex gap3 tabNav'>
              <CNavItem >
                <CNavLink role='button' className={activeTab === '' ? 'active' : ''} onClick={() => handleTabClick('')}>
                  {multiLang?.LiveManagementRegistrationLive?.Live}
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink role='button' className={activeTab === 'Quiz' ? 'active' : ''} onClick={() => quizCheck()}>{multiLang?.LiveManagementRegistrationLive?.Quiz}</CNavLink>
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
                          <div className="d-flex formradiogroup mb-2 gap-3 w-50">
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
                        <div className='d-flex '>
                          <div className="formWrpLabel" >
                            <label className="fw-bolder ">
                              {multiLang?.LiveManagementRegistrationLive?.Scheduled_start_time} <span className="mandatory-red-asterisk">*</span>
                            </label>
                          </div>
                          <div>
                            <div className="formWrpInpt d-flex w-100 flex-column">
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

                              <p>{multiLang?.LiveManagementRegistrationLive?.Scheduled_start_time_msg}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="form-outline form-white d-flex ">
                        <div className='d-flex '>
                          <div className="formWrpLabel" >
                            <label className="fw-bolder ">
                              {multiLang?.LiveManagementRegistrationLive?.Scheduled_end_time}
                            </label>
                          </div>
                          <div className='w-100'>
                            <div className="formWrpInpt d-flex w-100 flex-column">
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
                          <div className="upload-img-btn-and-info gap-1 flex-column">
                            <div className="upload-container-guidance">
                              <div className="file-information">
                                <ul>
                                  <li>- {multiLang?.LiveManagementRegistrationLive?.Image_size}</li>
                                  <li>- {multiLang?.LiveManagementRegistrationLive?.File_format}</li>
                                </ul>
                              </div>
                            </div>
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
                                <i className="icon-close" onClick={() => setSelectedImage('')} style={{ cursor: 'pointer' }} />
                                <div>
                                  <img src={URL.createObjectURL(selectedImage)} alt="" />
                                </div>
                              </div>
                            ) : (
                              <label className="uploadImgWrap" htmlFor="imageFiles">
                                <div className='thumbnailLiveImg'>
                                  <img src='https://www.beelights.gr/assets/images/empty-image.png' style={{ height: '100%', width: '100%' }} />
                                </div>
                              </label>

                            )}

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
                        <div className='d-flex col-md-12'>
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
                              <div className='d-flex w-100 gap-3'>
                                <CFormInput
                                  className='w-25'
                                  type="text"
                                  placeholder={multiLang?.LiveManagementRegistrationLive?.Enter_number}
                                  name='Points'
                                  value={secret}
                                  onChange={(e) => handleChange(e, 'secret')}
                                />
                                <div className='d-flex align-items-center gap-5'>
                                  <p >{secret?.length} / 4</p>
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
              <div className='d-flex justify-content-center gap-3 my-3'>

                {location?.state?.streamId !== undefined &&
                  <CButton onClick={() => navigateToList()} >{multiLang?.LiveManagementRegistrationLive?.list}</CButton>
                }

                <CButton onClick={confirmationCloseModalHandler} className='btn-black'>{multiLang?.LiveManagementRegistrationLive?.Cancel}</CButton>
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
                        <div className='d-flex col-md-12'>
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
                            <div className='d-flex col-md-12'>
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
                                          value={rewardPoints}
                                          onChange={(e) => handleChange(e, 'quiz')}
                                        />
                                        <p className='w-100'>{multiLang?.LiveManagementRegistrationLive?.Points}</p>
                                      </div>
                                    </div>
                                  }
                                </div>
                                {rewardPointsToggle &&
                                  <div className="gap-2 ms-2">
                                    <CFormCheck type="radio" className='mb-2' name="rewardPoints" id="exampleRadios1" label={multiLang?.LiveManagementRegistrationQuiz?.Points_shared_by_all}
                                      value={rewardPointsCheckBox}
                                      checked={rewardPointsCheckBox === true}
                                      onChange={() => setrewardPointsCheckBox(true)}
                                    />
                                    <CFormCheck type="radio" className='mb-2' name="visibility" id="exampleRadios2" label={multiLang?.LiveManagementRegistrationQuiz?.Points_given_by_all}
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
                            <div className='d-flex col-md-12'>
                              <div className="formWrpLabel" >
                                <label className="fw-bolder ">

                                  {multiLang?.LiveManagementRegistrationQuiz?.Create_Quiz}  <span className="mandatory-red-asterisk">*</span>
                                </label>
                              </div>
                              <div className="formWrpInpt  w-100 align-items-center gap-2">
                                <ul >
                                  {mainQuizs.length > 0 &&
                                    mainQuizs.map((data, i) => (
                                      <li key={i} className='d-flex gap-2 align-items-center mb-2'>
                                        <span>{i + 1}</span>
                                        <b className='greenTxt createQuizTitle'>{data.type}</b>
                                        <p onClick={() => editQuiz(data, i)}>{data?.title}</p>
                                        <i role='button' onClick={() => { setQuizIdToDelete(data?.id); confirmationDeleteHandler(true, i) }} className="icon-close"></i>
                                  
                                      </li>
                                    ))
                                  }
                                </ul>
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
              <div
                className='d-flex justify-content-center align-items-center gap-3 my-3'>
                {location?.state?.streamId !== undefined &&
                  <CButton onClick={() => navigateToList()} >{multiLang?.LiveManagementRegistrationLive?.list}</CButton>
                }
                <CButton onClick={confirmationCloseModalHandler} className='btn-black'>{multiLang?.LiveManagementRegistrationQuiz?.Cancel}</CButton>
                <CButton onClick={() => validateAllRegistration()}>{multiLang?.LiveManagementRegistrationQuiz?.Save}</CButton>
              </div>

              <div>
                <CModal
                  size="xl"
                  backdrop="static"
                  visible={visible}
                  onClose={() => { setVisible(false); resetQuiz() }}
                  aria-labelledby="StaticBackdropExampleLabel"
                  scrollable
                >
                  <CModalHeader>
                    <CModalTitle id="StaticBackdropExampleLabel">{multiLang?.LiveManagementRegistrationQuiz?.Create_Quiz}</CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                    <div className='d-flex col-md-12'>
                      <div className='col-md-6 pe-4'>
                        <div>
                          <h5 className='mb-2'>{multiLang?.LiveManagementRegistrationQuiz?.Question}  <span className="mandatory-red-asterisk">*</span></h5>
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
                          <div className='d-flex flex-wrap mt-2 mb-2  quizCheckBox'>
                            <CButton color="light" className="d-flex align-items-center  gap-2" onClick={() => { setAnswerSelectedRadio(true); handleRadioChange('TrueOrFalse') }}>
                              <CFormCheck
                                className='w-50 gap-2'
                                type="radio"
                                id="radioButton1"
                                name="TrueFalse"
                                // label="True/False"
                                checked={selectedRadio === 'TrueOrFalse'}
                              />
                              <CIcon icon={cilCircle}></CIcon>
                              <CIcon icon={cilX}></CIcon>
                              {multiLang?.LiveManagementRegistrationQuiz?.True_False}
                            </CButton>

                            <CButton color="light" className="d-flex align-items-center  gap-2" onClick={() => handleRadioChange('imageMultipleChoice')}>
                              <CFormCheck
                                className='w-50 gap-2'
                                type="radio"
                                id="radioButton2"
                                name="Image"
                                // label="Image"
                                checked={selectedRadio === 'imageMultipleChoice'}
                              />
                              <CIcon icon={cilImage}></CIcon>
                              {multiLang?.LiveManagementRegistrationQuiz?.Image}
                            </CButton>

                            <CButton color="light" className="d-flex align-items-center  gap-2" onClick={() => handleRadioChange('multipleChoice')}>
                              <CFormCheck
                                type="radio"
                                className='w-50 gap-2'
                                id="radioButton3"
                                name="MultipleChoice"
                                // label="Multiple choice"
                                checked={selectedRadio === 'multipleChoice'}
                              />
                              <CIcon icon={cilHamburgerMenu}></CIcon>
                              {multiLang?.LiveManagementRegistrationQuiz?.Multiple_Choice}
                            </CButton>

                            <CButton color="light" className="d-flex align-items-center  gap-2" onClick={() => handleRadioChange('shortAnswer')}>
                              <CFormCheck
                                className='w-50 gap-2'
                                type="radio"
                                id="radioButton4"
                                name="ShortAnswer"
                                // label="Short-answer"
                                checked={selectedRadio === 'shortAnswer'}
                              />
                              <CIcon icon={cilRectangle}></CIcon>

                              {multiLang?.LiveManagementRegistrationQuiz?.Short_answer}
                            </CButton>

                          </div>
                        </div>
                        {selectedRadio !== null &&
                          <div className='answer'>
                            <h5>{multiLang?.LiveManagementRegistrationQuiz?.answer}</h5>
                            {selectedRadio === 'trueOrFalse' &&
                              <div className='d-flex quizCheckBox mt-2'>
                                <CButton color="light" className="d-flex align-items-center justify-content-between p-2  gap-2" onClick={() => setAnswerSelectedRadio(true)}>
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
                                      className="btn btn-success text-white btn-sm flex-end"
                                    >
                                      {multiLang?.LiveManagementRegistrationQuiz?.correct}
                                    </label>
                                  }

                                </CButton>
                                <CButton color="light" className="d-flex align-items-center justify-content-between p-2 gap-2" onClick={() => setAnswerSelectedRadio(false)}>
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
                                      className="btn btn-success text-white btn-sm flex-end"
                                    >
                                      {multiLang?.LiveManagementRegistrationQuiz?.correct}
                                    </label>
                                  }
                                </CButton>
                              </div>
                            }
                            {selectedRadio === 'imageMultipleChoice' &&
                              <div className='mt-2 mb-2'>
                                {uploadedImages?.length > 0 && (
                                  <div className=" imageMultipleChoiceWrap d-flex flex-wrap mb-4">
                                    {uploadedImages.map((imgFile, index) => (
                                      <div key={index} className='imageMultipleChoice'>
                                       
                                          <div className="d-flex align-items-center gap-2 mb-2" onClick={() => imageAnswerHandler(index)}>
                                          <div className='imageMultipleChoiceCheck d-flex align-items-center gap-2 flex-column'>
                                          <CFormCheck
                                              className='w-50 gap-2'
                                              type="radio"
                                              id="radioButton4"
                                              checked={uploadedImages[index]?.value === true}
                                            />
  {uploadedImages[index].value === true &&
                                            <label
                                              className="btn btn-success text-white btn-sm flex-end"
                                            >
                                              {multiLang?.LiveManagementRegistrationQuiz?.correct}
                                            </label>
                                          }
                                          </div>
                                            <div
                                              className='remaining-img-container'
                                            >
                                              <img crossOrigin='anonymous' src={imgFile?.id ? imageUrl + imgFile?.image : URL.createObjectURL(uploadedImages[index].image)} alt="" />
                                              <button
                                                className="thumbclsBtn"
                                                onClick={(e) => deleteUploadedImageHandler(e, index)}
                                              >
                                                <i className="icon-close"></i>
                                              </button>
                                            
                                            </div>

                                          </div>
                                          <div className='d-flex gap-3 align-items-center'>
                                              <div className='imgchoiseInput'>
                                              <CFormInput
                                                  type="text"
                                                  value={uploadedImages[index].title}
                                                  placeholder={multiLang?.LiveManagementRegistrationLive?.Title_placeholder}
                                                  // name='Title'
                                                  onChange={(e) => titleHandler(index, e?.target?.value)}
                                                />
                                                <span className='text-nowrap'>{uploadedImages[index]?.title?.length} / 15 {multiLang?.LiveManagementRegistrationQuiz?.byte}</span>
                                              </div>
                                              </div>
                                       
                                      </div>

                                    ))}
                                  </div>
                                )}
                                {uploadedImages.length < 4 &&
                                  <div className="formWrpInpt mt-2 mb-2">
                                    <div className="upload-container-btn">
                                      <label className="btn btn-primary w-50 " htmlFor="imageFiles">
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

                            {selectedRadio === 'multipleChoice' &&
                              <div >
                                <div>
                                  {inputValues?.map((input, index) => (
                                    <div key={index} className='d-flex mt-3 mb-2 align-items-center gap-3'>
                                      <div>
                                        <div className="multiAns d-flex align-items-center gap-2" onClick={() => MultipleAnswerHandler(index)}>
                                          <CFormCheck
                                            className='w-50 gap-2'
                                            type="radio"
                                            id="radioButton4"
                                            checked={input.answer === true}
                                          />
                                          <CFormInput
                                            type="text"
                                            value={input?.value}
                                            onClick={(e) => e.stopPropagation()}
                                            onChange={(e) => handleMultipleInputChange(index, e.target.value)}
                                          // placeholder={`Input ${index + 1} Value`}
                                          />
                                          <span>{input?.value?.length} / 30</span>

                                        </div>
                                      </div>

                                      {input.answer === true &&
                                        <label
                                          className="btn btn-success text-white btn-sm flex-end"
                                        >
                                          {multiLang?.LiveManagementRegistrationQuiz?.correct}
                                        </label>
                                      }
                                      {index >= 2 && (
                                        <div>
                                          <i role='button' onClick={() => deleteInputField(index)} className="icon-close"></i>
                                        </div>
                                      )}

                                    </div>

                                  ))}
                                </div>
                                {inputValues?.length < 4 &&
                                  <CButton className='mb-3 mt-2' onClick={addInputField}>{multiLang?.LiveManagementRegistrationQuiz?.Create_Answer} +</CButton>
                                }
                              </div>
                            }

                            {selectedRadio === 'shortAnswer' &&
                              <div className="formWrpInpt d-flex">
                                <div className="d-flex formradiogroup mb-2 mt-2 gap-3">
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
                        }

                        <div className='answer d-flex align-items-center gap-2 mt-3'>
                          <h5>{multiLang?.LiveManagementRegistrationQuiz?.timelimit}</h5>
                          <CFormInput
                            style={{width:70, textAlign:'center'}}
                            type='text'
                            value={timeLimit}
                            onChange={handleTimeInputChange}
                          />
                          <p>{multiLang?.LiveManagementRegistrationQuiz?.seconds}</p>
                        </div>
                      </div>



                      <div className='col-md-6'>
                        <div>
                          <div className='container mt-3'>
                            <div className='p-3'>
                              <CCard >
                                <CCardBody>
                                  {/* <CCardTitle>Centered Card Title</CCardTitle> */}
                                  <CCardTitle className='text-left'>
                                    {quizQuestion}
                                  </CCardTitle>
                                  {selectedRadio === 'trueOrFalse' &&
                                    <div className='gap-2 mt-3 d-flex justify-content-center gap-3'>
                                      <div className='trueFlaseBtn d-flex justify-content-center align-items-center'>
                                        <CFormCheck className='ms-2' button={{ color: 'secondary' }} type="radio" name="options" id="option3" autoComplete="off" label="True" disabled />
                                      </div>
                                      <div className='trueFlaseBtn d-flex justify-content-center align-items-center'>
                                        <CFormCheck button={{ color: 'secondary' }} type="radio" name="options" id="option3" autoComplete="off" label="False" disabled />
                                      </div>
                                    </div>
                                  }
                                  {selectedRadio === 'imageMultipleChoice' &&
                                    <div className='gap-2 mt-2 d-flex  gap-3'>
                                      {uploadedImages?.length > 0 && (
                                        <div className="d-flex ">
                                          {uploadedImages.map((input, index) => (
                                            <div key={index} className='w-50 p-2 mb-2'>
                                            
                                                <div
                                                  className='remaining-img-container ansImgChoise'
                                                >
                                                 
                                                  <img crossOrigin='anonymous' src={input.id ? imageUrl + input.image : URL.createObjectURL(uploadedImages[index].image)} alt="" />
                                                  <p className='mt-1'>{input.question}</p>
                                                </div>
                                           
                                            </div>

                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  }

                                  {selectedRadio === 'multipleChoice' &&
                                    <div className='gap-2 mt-3 d-flex justify-content-center gap-3'>
                                      {inputValues?.length > 0 && (
                                        <div className="upload-images-container uploadImgWrap d-block">
                                          {inputValues.map((input, index) => (
                                            <div key={index} >
                                              <div>
                                                <p>{input?.value}</p>
                                              </div>
                                            </div>

                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  }
                                  {selectedRadio === 'shortAnswer' &&
                                    <div className='gap-2 mt-3 d-flex justify-content-center gap-3'>

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
                    <CButton className='btn-black' onClick={() => { setVisible(false); resetQuiz() }}>
                      {multiLang?.LiveManagementRegistrationQuiz?.close}
                    </CButton>
                    <CButton color="primary" onClick={() => validateQuize()}>{multiLang?.LiveManagementRegistrationQuiz?.Save}</CButton>
                  </CModalFooter>
                </CModal>
              </div>
            </div>
          }
        </div>
        <div>

        </div>
      </main>
    </div>
  )
}

export default LiveRegistration
