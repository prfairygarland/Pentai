import {
  CAccordion,
  CAccordionBody,
  CAccordionHeader,
  CAccordionItem,
  CButton,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { patchApi } from 'src/utils/Api'
import { ALL_CONSTANTS, API_ENDPOINT } from 'src/utils/config'
import { enqueueSnackbar } from 'notistack'

const LiveConsoleQuestions = ({ questions }) => {
  const readyQuestionStyles = {
    marginRight: '5px',
    padding: '0px 5px',
    borderRadius: '10px',
    border: '2px solid gray',
    fontSize: '14px',
  }

  const nowQuestionStyles = {
    marginRight: '5px',
    padding: '0px 5px',
    borderRadius: '10px',
    border: '2px solid red',
    color: 'red',
    fontSize: '14px',
  }

  const endQuestionStyles = {
    marginRight: '5px',
    padding: '3px 10px',
    borderRadius: '10px',
    backgroundColor: 'black',
    color: 'white',
    fontSize: '14px',
  }
  const [questStatusAndBtn, setQuestStatusAndBtn] = useState([])

  const startQuiz = async (index, quesId) => {
    if (questStatusAndBtn.filter((quesData) => quesData.quesStatus === 'now').length > 0) {
      enqueueSnackbar(`Another quiz is in progress.`, { variant: 'error' })
      return false
    }

    try {
      let url = `${API_ENDPOINT.startQuizQuestion}?questionId=${quesId}`
      await patchApi(url)
      const filteredQuesStatus = [...questStatusAndBtn]
      filteredQuesStatus[index] = { quesId: quesId, quesStatus: 'now' }
      setQuestStatusAndBtn(filteredQuesStatus)
    } catch (error) {
      console.log(error)
    }
  }

  const endQuiz = async (index, quesId) => {
    try {
      let url = `${API_ENDPOINT.endQuizQuestion}?questionId=${quesId}`
      await patchApi(url)
      const filteredQuesStatus = [...questStatusAndBtn]
      filteredQuesStatus[index] = { quesId: quesId, quesStatus: 'end' }
      setQuestStatusAndBtn(filteredQuesStatus)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (Array.isArray(questions)) {
      const quesStatus = []
      questions.forEach((quesData) => {
        quesStatus.push({ quesId: quesData?.id, quesStatus: 'ready' })
      })
      setQuestStatusAndBtn(quesStatus)
    }
  }, [questions])

  return (
    <div style={{ width: '37%' }}>
      <div className="container bg-light p-3 mb-3">
        <div>
          <CAccordion alwaysOpen activeItemKey={1}>
            {Array.isArray(questions) &&
              questions.map((quesData, index) => (
                <CAccordionItem key={quesData?.id}>
                  <CAccordionHeader>
                    {questStatusAndBtn[index]?.quesId === quesData?.id &&
                      questStatusAndBtn[index]?.quesStatus === 'ready' && (
                        <p style={readyQuestionStyles}>Ready</p>
                      )}{' '}
                    {questStatusAndBtn[index]?.quesId === quesData?.id &&
                      questStatusAndBtn[index]?.quesStatus === 'now' && (
                        <p style={nowQuestionStyles}>Now</p>
                      )}{' '}
                    {questStatusAndBtn[index]?.quesId === quesData?.id &&
                      questStatusAndBtn[index]?.quesStatus === 'end' && (
                        <p style={endQuestionStyles}>End</p>
                      )}{' '}
                    {quesData?.title} - {quesData?.type}
                  </CAccordionHeader>
                  <CAccordionBody>
                    {quesData?.type !== 'imageMultipleChoice' &&
                      quesData?.options?.map((quesOpt) => (
                        <p
                          style={{
                            border: '1px solid gray',
                            borderRadius: '15px',
                            margin: '3px',
                            padding: '3px 10px',
                            display: 'flex',
                            justifyContent: 'space-between',
                          }}
                          key={quesOpt?.id}
                        >
                          {quesOpt?.title}
                          {quesOpt?.isCorrect !== 0 && (
                            <span
                              style={{
                                backgroundColor: 'blue',
                                color: '#fff',
                                borderRadius: '15px',
                                padding: '2px 10px',
                              }}
                            >
                              CORRECT
                            </span>
                          )}
                        </p>
                      ))}

                    {quesData?.type === 'imageMultipleChoice' &&
                      quesData?.options?.map((quesOpt) => (
                        <p
                          style={{
                            border: '1px solid gray',
                            borderRadius: '15px',
                            margin: '3px',
                            padding: '3px 10px',
                            display: 'flex',
                            justifyContent: 'space-between',
                          }}
                          key={quesOpt?.id}
                        >
                          <img
                            crossOrigin="anonymous"
                            style={{ width: '75px', height: '75px', borderRadius: '15px' }}
                            src={ALL_CONSTANTS.BASE_URL + quesOpt?.image}
                            alt=""
                          />
                          {quesOpt?.isCorrect !== 0 && (
                            <span
                              style={{
                                backgroundColor: 'blue',
                                color: '#fff',
                                borderRadius: '15px',
                                padding: '2px 10px',
                                height: '25px',
                                marginTop: '25px',
                              }}
                            >
                              CORRECT
                            </span>
                          )}
                        </p>
                      ))}
                    {questStatusAndBtn[index]?.quesStatus === 'ready' && (
                      <CButton
                        color="secondary"
                        style={{ width: '100%', borderRadius: '25px' }}
                        onClick={() => startQuiz(index, quesData.id)}
                      >
                        Start
                      </CButton>
                    )}
                    {questStatusAndBtn[index]?.quesStatus === 'now' && (
                      <CButton
                        color="primary"
                        style={{ width: '100%', borderRadius: '25px' }}
                        onClick={() => endQuiz(index, quesData.id)}
                      >
                        End
                      </CButton>
                    )}
                  </CAccordionBody>
                </CAccordionItem>
              ))}
          </CAccordion>
        </div>
      </div>
    </div>
  )
}

export default LiveConsoleQuestions
