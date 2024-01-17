import { CButton, CCol, CFormCheck, CFormInput } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { getApi, postApi, putApi } from 'src/utils/Api'
import { API_ENDPOINT } from 'src/utils/config'
import { enqueueSnackbar } from 'notistack'

const UsageSetting = (props) => {
  const [radioGroupValue, setRadioGroupValue] = useState({})
  const [prohabitedWords, setProhabitedWords] = useState([])
  const [addInputValue, setAddInputValue] = useState('')

  useEffect(() => {
    getUsageStatus()
    getProhabitedWords()
  }, [])

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
      console.log('getapi usage status')
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
        enqueueSnackbar(`Updated Successfully - `, { variant: 'success' })
      } else {
        enqueueSnackbar(`Work in progress - `, { variant: 'error' })
      }
    } catch (error) {
      enqueueSnackbar(`Something went wrong! `, { variant: 'error' })
    }
  }

  const getProhabitedWords = async () => {
    try {
      const res = await getApi(API_ENDPOINT.get_prohabited_words)
      console.log('getapi prohabited Words', res)
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

  const handleRemoveAllWords = () => {
    setProhabitedWords([])
  }

  const addProhabitedWord = () => {
    if (addInputValue.trim() === '') {
      enqueueSnackbar(`Please add prohibited word`, { variant: 'error' })
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
        enqueueSnackbar(`Updated Successfully`, { variant: 'success' })
      } else {
        enqueueSnackbar(`Something went wrong! `, { variant: 'error' })
      }
    } catch (error) {
      enqueueSnackbar(`Something went wrong! `, { variant: 'error' })
    }
  }

  const disableStyle = {
    'pointer-events': 'none',
    opacity: 0.4,
  }
  return (
    <section>
      <div className="formWraper mt-3">
        <div className="form-outline form-white  d-flex ">
          <div className="formWrpLabel">
            <label className="fw-bolder ">Usage status</label>
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
                <label className="radiolabel" htmlFor="Bulletin board">
                  Bulletin board​
                </label>
                <CFormCheck
                  type="radio"
                  name="BulletinBoard"
                  id={radioGroupValue?.BulletinBoard?.id}
                  checked={radioGroupValue.BulletinBoard?.status === 1}
                  onChange={handleRadioCheck}
                  value="1"
                  label="Grant"
                />
                <CFormCheck
                  type="radio"
                  name="BulletinBoard"
                  id={radioGroupValue?.BulletinBoard?.id}
                  checked={radioGroupValue.BulletinBoard?.status === 0}
                  onChange={handleRadioCheck}
                  value="0"
                  label="Deny"
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
              <label className="radiolabel" htmlFor="Club board">
                Club board​
              </label>
              <CFormCheck
                type="radio"
                name="ClubBoard"
                id={radioGroupValue?.ClubBoard?.id}
                checked={radioGroupValue.ClubBoard?.status === 1}
                onChange={handleRadioCheck}
                value="1"
                label="Grant"
              />
              <CFormCheck
                type="radio"
                name="ClubBoard"
                id={radioGroupValue?.ClubBoard?.id}
                checked={radioGroupValue.ClubBoard?.status === 0}
                onChange={handleRadioCheck}
                value="0"
                label="Deny"
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
              <label className="radiolabel" htmlFor="Welfare board​">
                Welfare board​
              </label>
              <CFormCheck
                type="radio"
                name="WelfareBoard"
                id={radioGroupValue?.WelfareBoard?.id}
                checked={radioGroupValue.WelfareBoard?.status === 1}
                onChange={handleRadioCheck}
                value="1"
                label="Grant"
              />
              <CFormCheck
                type="radio"
                name="WelfareBoard"
                id={radioGroupValue?.WelfareBoard?.id}
                checked={radioGroupValue.WelfareBoard?.status === 0}
                onChange={handleRadioCheck}
                value="0"
                label="Deny"
              />
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div className="d-flex justify-content-center">
        <CCol xs="auto">
          <CButton
            type="submit"
            className="mb-3 btn-dark mb-3 text-white bg-dark"
            onClick={handleUpdateStatus}
          >
            Save Status
          </CButton>
        </CCol>
      </div>
      <div className="formWraper mt-3">
        <div className="form-outline form-white  d-flex ">
          <div className="formWrpLabel">
            <label className="fw-bolder ">Prohibited Words</label>
          </div>
          <div className="formWrpInpt">
            <div className="prohabitinfo">
              <p>※ Guide for setting prohibited words on Community.</p>
              <p>
                1. If prohibited words are set, the corresponding prohibited words are equally
                applied to all boards and sub-boards in community.
              </p>
              <p>
                2. Prohibited words cannot be included in the board/club name, post, or comment.
              </p>
            </div>
            <div className="d-flex w-100 mt-4">
              <CCol xs="auto" className="w-75 me-3">
                <CFormInput
                  type="text"
                  id="inputPassword2"
                  onChange={(e) => setAddInputValue(e.target.value)}
                  placeholder="Please enter prohibited words"
                  value={addInputValue}
                />
              </CCol>
              <CCol xs="auto">
                <CButton type="submit" onClick={addProhabitedWord} className="mb-3 btn-dark">
                  Add
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
                          {/* <p style={{ lineHeight: '0.5' }}>x</p> */}
                          <i className='icon-close'></i>
                        </button>
                      </div>
                    ))}
                  {/* <div className='prohibitword m-2'>
                                        <span>Test123<button>x</button></span>
                                    </div>
                                    <div className='prohibitword m-2'>
                                        <span>Test-1234 <button>x</button></span>
                                    </div> */}
                </div>
              </div>
              <div className="d-flex justify-content-end mt-2">
                <CCol xs="auto">
                  <CButton type="submit" onClick={handleRemoveAllWords} className="mb-3 btn-dark">
                    Delete All
                  </CButton>
                </CCol>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div className="d-flex justify-content-center">
        <CCol xs="auto">
          <CButton type="submit" className="mb-3 btn-dark" onClick={handleSaveProhibitedWords}>
            Save Prohibited Words
          </CButton>
        </CCol>
      </div>
    </section>
  )
}

export default UsageSetting
