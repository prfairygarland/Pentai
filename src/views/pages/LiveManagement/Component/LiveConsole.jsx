import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getApi, patchApi } from 'src/utils/Api'
import { API_ENDPOINT } from 'src/utils/config'
import LiveConsoleQuestions from './LiveConsoleQuestions'
import LiveConsoleVideoView from './LiveConsoleVideoView'
import LiveConsoleChatContainer from './LiveConsoleChatContainer'
import { CButton } from '@coreui/react'
import { useParams } from 'react-router'

const LiveConsole = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { streamId } = useParams()

  // const streamId = location?.state?.streamId
  const [questions, setQuestions] = useState({})
  const [playbackUrl, setPlaybackUrl] = useState('')
  const [title, setTitle] = useState('')
  const [socketURL, setSocketURL] = useState('')
  const [isLive, setIsLive] = useState(0)
  const [txtCopied, setTxtCopied] = useState('')
  const [quizRewardPoints, setQuizRewardPoints] = useState('')
  const [quizRewardType, setQuizRewardType] = useState('')
  const endLiveStream = async () => {
    let url = `${API_ENDPOINT.endLiveStream}?streamId=${streamId}`
    await patchApi(url)
    window.close()
  }
  const startLiveStream = async () => {
    setIsLive(1)
    let url = `${API_ENDPOINT.startLiveStream}?streamId=${streamId}`
    await patchApi(url)
  }
  const getStreamDetails = async () => {
    try {
      let url = `${API_ENDPOINT.getStreamDetails}?streamId=${streamId}`
      const res = await getApi(url)
      if (res.status === 200) {
        setQuestions(res?.data?.questions)
        setPlaybackUrl(res?.data?.playbackUrl)
        setTitle(res?.data?.title)
        setSocketURL(res?.data?.socket)
        setIsLive(res?.data?.isLive)
        setQuizRewardPoints(res?.data?.quizRewardPoints)
        setQuizRewardType(res?.data?.quizRewardType)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const copyAndPaste = (copyFor) => {
    navigator.clipboard.writeText(playbackUrl)
    setTxtCopied(copyFor)
    setTimeout(() => {
      setTxtCopied('')
    }, 10000)
  }

  useEffect(() => {
    if (streamId !== undefined) {
      getStreamDetails()
    }
  }, [])

  return (
    <>
      <div className="liveConsoleTitle">
        <div className="w-50">
          <h5>LIVE Console</h5>
          <p>
            <b>Title</b> : {title}
          </p>
        </div>
        <div style={{ display: 'flex' }}>
          <div>
            <CButton
              color="primary"
              disabled={txtCopied === 'playback'}
              style={{
                borderRadius: '20px',
                color: '#fff',
                width: '200px',
                margin: '0px 10px',
              }}
              onClick={() => copyAndPaste('playback')}
            >
              {txtCopied === 'playback' ? 'Copied URL...' : 'Copy Playback URL'}
            </CButton>
          </div>
          <div>
            <CButton
              disabled={txtCopied === 'stream'}
              color="primary"
              style={{
                borderRadius: '20px',
                color: '#fff',
                width: '200px',
                margin: '0px 10px',
              }}
              onClick={() => copyAndPaste('stream')}
            >
              {txtCopied === 'stream' ? 'Copied URL...' : 'Copy Stream URL'}
            </CButton>
          </div>
          <div>
            <CButton
              disabled={txtCopied === 'secret'}
              color="primary"
              style={{
                borderRadius: '20px',
                color: '#fff',
                width: '200px',
                margin: '0px 10px',
              }}
              onClick={() => copyAndPaste('secret')}
            >
              {txtCopied === 'secret' ? 'Copied Code...' : 'Copy Code'}
            </CButton>
          </div>
        </div>
        <div className="w-50 d-flex  justify-content-end">
          {isLive === 0 && <CButton onClick={startLiveStream}>Start</CButton>}
          {isLive === 1 && <CButton onClick={endLiveStream}>End</CButton>}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 20px' }}></div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <LiveConsoleQuestions
          questions={questions}
          isLive={isLive}
          quizRewardPoints={quizRewardPoints}
          quizRewardType={quizRewardType}
        />
        <LiveConsoleVideoView playbackUrl={playbackUrl} isLive={isLive} />
        <LiveConsoleChatContainer streamId={streamId} socketURL={socketURL} isLive={isLive} />
      </div>
    </>
  )
}

export default LiveConsole
