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

const LiveConsoleQuestions = ({ questions, isLive }) => {
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
    // <div style={{ width: '37%' }}>
    <div className="col-md-4">
      <div className=" bg-light p-3 mb-3">
        <div>
          <h4>Quiz (1/10)</h4>
          <p>
            <b>Winner:100</b>
          </p>
          <p>Reward Points: 1,000 Points</p>
          <p>*Points shared by all</p>
        </div>
        <div>
          <CAccordion alwaysOpen activeItemKey={1} className="mt-2">
            {Array.isArray(questions) &&
              questions.map((quesData, index) => (
                <CAccordionItem key={quesData?.id} className="mb-2">
                  <CAccordionHeader className="quizQuesBox">
                    {questStatusAndBtn[index]?.quesId === quesData?.id &&
                      questStatusAndBtn[index]?.quesStatus === 'ready' && (
                        <span className="ready">Ready</span>
                      )}{' '}
                    {questStatusAndBtn[index]?.quesId === quesData?.id &&
                      questStatusAndBtn[index]?.quesStatus === 'now' && (
                        <span className="now">Now</span>
                      )}{' '}
                    {questStatusAndBtn[index]?.quesId === quesData?.id &&
                      questStatusAndBtn[index]?.quesStatus === 'end' && (
                        <span className="end">End</span>
                      )}{' '}
                    {quesData?.title}
                  </CAccordionHeader>
                  <CAccordionBody>
                    {quesData?.type !== 'imageMultipleChoice' &&
                      quesData?.options?.map((quesOpt) => (
                        <div key={quesOpt?.id} className="quizWrapBox">
                          <p>{quesOpt?.title}</p>
                          {quesOpt?.isCorrect !== 0 && (
                            <span className="btn btn-sm btn-success">CORRECT</span>
                          )}
                        </div>
                      ))}

                    {quesData?.type === 'imageMultipleChoice' &&
                      quesData?.options?.map((quesOpt) => (
                        <div key={quesOpt?.id} className="quizWrapBox">
                          <img
                            crossOrigin="anonymous"
                            style={{ width: '75px', height: '75px', borderRadius: '15px' }}
                            src={ALL_CONSTANTS.BASE_URL + quesOpt?.image}
                            alt=""
                          />
                          {quesOpt?.isCorrect !== 0 && (
                            <span className="btn btn-sm btn-success">CORRECT</span>
                          )}
                        </div>
                      ))}
                    {questStatusAndBtn[index]?.quesStatus === 'ready' && Number(isLive) === 1 && (
                      <CButton className="btn w-100" onClick={() => startQuiz(index, quesData.id)}>
                        Start
                      </CButton>
                    )}
                    {questStatusAndBtn[index]?.quesStatus === 'now' && Number(isLive) === 1 && (
                      <CButton className="btn w-100" onClick={() => endQuiz(index, quesData.id)}>
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
