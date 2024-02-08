import { CButton, CCol, CFormCheck, CFormInput } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { getApi, postApi, putApi } from 'src/utils/Api'
import { API_ENDPOINT } from 'src/utils/config'
import { enqueueSnackbar } from 'notistack'
import ConfirmationModal from 'src/utils/ConfirmationModal'
import { useTranslation } from 'react-i18next';

const UsageSetting = (props) => {
  const [radioGroupValue, setRadioGroupValue] = useState({})
  const [prohabitedWords, setProhabitedWords] = useState([])
  const [addInputValue, setAddInputValue] = useState('')
  const [modalProps, setModalProps] = useState({})

  useEffect(() => {
    getUsageStatus()
    getProhabitedWords()
  }, [])

  const { i18n } = useTranslation();
  const translationObject = i18n.getDataByLanguage(i18n.language);  

  const handleRadioCheck = (event) => {
    const value = event.target.value
    const groupName = event.target.name
    const groupId = event.target.id
    setRadioGroupValue((prev) => {
      return {
        ...prev,
        [groupName]: {
          status: Number(value),
          id: Number(groupId),
        },
      }
    })
  }

  const getUsageStatus = async () => {
    try {
      const res = await getApi(API_ENDPOINT.get_board_usage_setting)
      if (res.status === 200) {
        setRadioGroupValue(res.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleUpdateStatus = async () => {
    const body = {
      ...radioGroupValue,
    }
    console.log(body)
    try {
      let url = `${API_ENDPOINT.update_board_usage_setting}`
      const res = await putApi(url, body)
      if (res?.status === 200) {
        enqueueSnackbar(translationObject?.translation?.communityBoardManagement?.updatedSuccessfully, { variant: 'success' })
      } else {
        enqueueSnackbar(translationObject?.translation?.communityBoardManagement?.somethingWentWrong, { variant: 'error' })
      }
    } catch (error) {
      enqueueSnackbar(translationObject?.translation?.communityBoardManagement?.somethingWentWrong, { variant: 'error' })
    }
  }

  const getProhabitedWords = async () => {
    try {
      const res = await getApi(API_ENDPOINT.get_prohabited_words)
      if (res.status === 200) {
        setProhabitedWords(
          res.data.map(function (item) {
            return item.word
          }),
        )
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleRemoveWord = (index) => {
    const filterdWord = [...prohabitedWords]
    filterdWord.splice(index, 1)
    setProhabitedWords(filterdWord)
  }

  const removeAllWords = async () => {
    const body = {
      deleteAll: true,
      id: '1',
    }
    try {
      let url = `${API_ENDPOINT.delete_all_prohabited_words}`
      const res = await putApi(url, body)
      if (res?.status === 200) {
        enqueueSnackbar(translationObject?.translation?.communityBoardManagement?.deleteAllProhibitedWordsSuccessfully, { variant: 'success' })
      } else {
        enqueueSnackbar(translationObject?.translation?.communityBoardManagement?.somethingWentWrong, { variant: 'error' })
      }
    } catch (error) {
      enqueueSnackbar(translationObject?.translation?.communityBoardManagement?.somethingWentWrong, { variant: 'error' })
    }
    setModalProps({
      isModalOpen: false
    })
    getProhabitedWords()
  }

  const cancelRemoveAllWords = () => {
    setModalProps({
      isModalOpen: false
    })
  }

  const confirmationDeleteAllHandler = (isOpen) => {
    setModalProps({
      isModalOpen: isOpen,
      title: 'Confirmation',
      content: translationObject?.translation?.communityBoardManagement?.areYouSureYouWantToDeleteAllProhibitedWords,
      cancelBtn: 'No',
      cancelBtnHandler: cancelRemoveAllWords,
      successBtn: 'Yes',
      successBtnHandler: () => removeAllWords(),
      modalCloseHandler: confirmationDeleteAllHandler,
    })
  }

  const addProhabitedWord = () => {
    if (addInputValue.trim() === '') {
      enqueueSnackbar(translationObject?.translation?.communityBoardManagement?.pleaseAddProhibitedWord, { variant: 'error' })
      return false
    }
    const filterdWord = [...prohabitedWords, addInputValue]
    setProhabitedWords(filterdWord)
    setAddInputValue('')
  }

  const handleSaveProhibitedWords = async () => {
    const body = {
      words: prohabitedWords,
      languageCode: 'en',
    }
    try {
      let url = `${API_ENDPOINT.add_prohabited_words}`
      const res = await postApi(url, body)
      if (res?.status === 200) {
        enqueueSnackbar(translationObject?.translation?.communityBoardManagement?.updatedSuccessfully, { variant: 'success' })
      } else {
        enqueueSnackbar(translationObject?.translation?.communityBoardManagement?.somethingWentWrong, { variant: 'error' })
      }
    } catch (error) {
      enqueueSnackbar(translationObject?.translation?.communityBoardManagement?.somethingWentWrong, { variant: 'error' })
    }
    setModalProps({
      isModalOpen: false
    })
  }

  const cancelSaveAllWords = () => {
    setModalProps({
      isModalOpen: false
    })
  }

  const confirmationSaveAllHandler = (isOpen) => {
    setModalProps({
      isModalOpen: isOpen,
      title: 'Confirmation',
      content: translationObject?.translation?.communityBoardManagement?.areYouSureYouWantToSaveAllProhibitedWords,
      cancelBtn: 'No',
      cancelBtnHandler: cancelSaveAllWords,
      successBtn: 'Yes',
      successBtnHandler: () => handleSaveProhibitedWords(),
      modalCloseHandler: confirmationSaveAllHandler,
    })
  }

  const disableStyle = {
    'pointer-events': 'none',
    opacity: 0.4,
  }
  return (
    <section>
      <ConfirmationModal modalProps={modalProps} />
      <div className="formWraper mt-3">
        <div className="form-outline form-white  d-flex ">
          <div className="formWrpLabel">
            <label className="fw-bolder ">{translationObject?.translation?.communityBoardManagement?.usageStatus}</label>
          </div>
          <div className="formWrpInpt">
            {
              <div
                className="d-flex formradiogroup mb-2 gap-2"
                style={
                  radioGroupValue.ClubBoard?.status === 0 &&
                  radioGroupValue.WelfareBoard?.status === 0
                    ? disableStyle
                    : {}
                }
              >
                <h5 className="radiolabel" htmlFor="Bulletin board">
                {translationObject?.translation?.communityBoardManagement?.bulletinBoard}
                </h5>
                <CFormCheck
                  type="radio"
                  name="BulletinBoard"
                  id={radioGroupValue?.BulletinBoard?.id}
                  checked={radioGroupValue.BulletinBoard?.status === 1}
                  onChange={handleRadioCheck}
                  value="1"
                  label={translationObject?.translation?.communityBoardManagement?.grant}
                />
                <CFormCheck
                  type="radio"
                  name="BulletinBoard"
                  id={radioGroupValue?.BulletinBoard?.id}
                  checked={radioGroupValue.BulletinBoard?.status === 0}
                  onChange={handleRadioCheck}
                  value="0"
                  label={translationObject?.translation?.communityBoardManagement?.deny}
                />
              </div>
            }
            <div
              className="d-flex formradiogroup mb-2 gap-2"
              style={
                radioGroupValue.BulletinBoard?.status === 0 &&
                radioGroupValue.WelfareBoard?.status === 0
                  ? disableStyle
                  : {}
              }
            >
              <h5 className="radiolabel" htmlFor="Club board">
              {translationObject?.translation?.communityBoardManagement?.clubBoard}
              </h5>
              <CFormCheck
                type="radio"
                name="ClubBoard"
                id={radioGroupValue?.ClubBoard?.id}
                checked={radioGroupValue.ClubBoard?.status === 1}
                onChange={handleRadioCheck}
                value="1"
                label={translationObject?.translation?.communityBoardManagement?.grant}
                />
              <CFormCheck
                type="radio"
                name="ClubBoard"
                id={radioGroupValue?.ClubBoard?.id}
                checked={radioGroupValue.ClubBoard?.status === 0}
                onChange={handleRadioCheck}
                value="0"
                label={translationObject?.translation?.communityBoardManagement?.deny}
                />
            </div>
            <div
              className="d-flex formradiogroup mb-2 gap-2"
              style={
                radioGroupValue.ClubBoard?.status === 0 &&
                radioGroupValue.BulletinBoard?.status === 0
                  ? disableStyle
                  : {}
              }
            >
              <h5 className="radiolabel" htmlFor="Welfare board​">
              {translationObject?.translation?.communityBoardManagement?.welfareBoard}
              </h5>
              <CFormCheck
                type="radio"
                name="WelfareBoard"
                id={radioGroupValue?.WelfareBoard?.id}
                checked={radioGroupValue.WelfareBoard?.status === 1}
                onChange={handleRadioCheck}
                value="1"
                label={translationObject?.translation?.communityBoardManagement?.grant}
                />
              <CFormCheck
                type="radio"
                name="WelfareBoard"
                id={radioGroupValue?.WelfareBoard?.id}
                checked={radioGroupValue.WelfareBoard?.status === 0}
                onChange={handleRadioCheck}
                value="0"
                label={translationObject?.translation?.communityBoardManagement?.deny}
                />
            </div>
          </div>
        </div>
      </div>
      {/* <hr /> */}
      <div className="d-flex justify-content-center mt-2">
        <CCol xs="auto">
          <CButton
            type="submit"
            className="mb-3  mb-3 text-white "
            onClick={handleUpdateStatus}
          >
            {translationObject?.translation?.communityBoardManagement?.saveStatus}
          </CButton>
        </CCol>
      </div>
      <div className="formWraper mt-3">
        <div className="form-outline form-white  d-flex ">
          <div className="formWrpLabel">
            <label className="fw-bolder ">{translationObject?.translation?.communityBoardManagement?.prohibitedWords}</label>
          </div>
          <div className="formWrpInpt">
            <div className="prohabitinfo">
              <p>※ {translationObject?.translation?.communityBoardManagement?.guideForSettingProhibitedWords}</p>
              <p>
                1. {translationObject?.translation?.communityBoardManagement?.guideForSettingProhibitedWordsPointOne}
              </p>
              <p>
                2. {translationObject?.translation?.communityBoardManagement?.guideForSettingProhibitedWordsPointTwo}
              </p>
            </div>
            <div className="d-flex w-100 mt-4">
              <CCol xs="auto" className="w-75 me-3">
                <CFormInput
                  type="text"
                  id="inputPassword2"
                  onChange={(e) => setAddInputValue(e.target.value)}
                  placeholder={translationObject?.translation?.communityBoardManagement?.pleaseEnterProhibitedWords}
                  value={addInputValue}
                />
              </CCol>
              <CCol xs="auto">
                <CButton type="submit" onClick={addProhabitedWord} className="mb-3 ">
                  {translationObject?.translation?.communityBoardManagement?.add}
                </CButton>
              </CCol>
            </div>
            <div className="d-flex w-100 mt-4 flex-column">
              <div className="prowordsection">
                <div className="d-flex flex-wrap">
                  {prohabitedWords &&
                    prohabitedWords.map((word, index) => (
                      <div className="prohibitword m-2" key={index}>
                        <p>{word}&nbsp;&nbsp;&nbsp;</p>
                        <button onClick={() => handleRemoveWord(index)}>
                          <i className='icon-close'></i>
                        </button>
                      </div>
                    ))}
                </div>
              </div>
              <div className="d-flex justify-content-end mt-2">
                <CCol xs="auto">
                  <CButton type="submit" onClick={confirmationDeleteAllHandler} className="mb-3 btn-black">
                    {translationObject?.translation?.communityBoardManagement?.deleteAll}
                  </CButton>
                </CCol>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <hr /> */}
      <div className="d-flex justify-content-center mt-2">
        <CCol xs="auto">
          <CButton type="submit" className="mb-3 btn-primary" onClick={confirmationSaveAllHandler}>
          {translationObject?.translation?.communityBoardManagement?.saveProhibitedWords}
          </CButton>
        </CCol>
      </div>
    </section>
  )
}

export default UsageSetting
