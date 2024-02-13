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
  const [streamingUrl, setStreamingUrl] = useState('')
  const [streamKey, setStreamKey] = useState('')
  const [title, setTitle] = useState('')
  const [socketURL, setSocketURL] = useState('')
  const [isLive, setIsLive] = useState(0)
  const [scheduledAt, setScheduledAt] = useState('')
  const [scheduledUpto, setScheduledUpto] = useState('')
  const [serverTime, setServerTime] = useState('')
  const [broadcastStart, setBroadcastStart] = useState('')
  const [txtCopied, setTxtCopied] = useState('')
  const [quizRewardPoints, setQuizRewardPoints] = useState('')
  const [quizRewardType, setQuizRewardType] = useState('')
  const endLiveStream = async () => {
    let url = `${API_ENDPOINT.endLiveStream}?streamId=${streamId}`
    await patchApi(url)
    navigate('../LiveManagement')
    // window.close()
  }
  const startLiveStream = async () => {
    setIsLive(1)
    let url = `${API_ENDPOINT.startLiveStream}?streamId=${streamId}`
    await patchApi(url)
    getStreamDetails()
  }
  const backLiveStream = () => {
    navigate('../LiveManagement')
  }
  const getStreamDetails = async () => {
    try {
      let url = `${API_ENDPOINT.getStreamDetails}?streamId=${streamId}`
      const res = await getApi(url)
      if (res.status === 200) {
        setQuestions(res?.data?.questions)
        setPlaybackUrl(res?.data?.playbackUrl)
        setStreamingUrl(res?.data?.credentials?.streamingUrl)
        setStreamKey(res?.data?.credentials?.streamKey)
        setTitle(res?.data?.title)
        setSocketURL(res?.data?.socket)
        setScheduledAt(res?.data?.scheduledAt)
        setScheduledUpto(res?.data?.scheduledUpto)
        setServerTime(res?.data?.serverTime)
        setBroadcastStart(res?.data?.broadcastStart)
        setIsLive(res?.data?.status === 'ready' ? 0 : 1)
        setQuizRewardPoints(res?.data?.quizRewardPoints)
        setQuizRewardType(res?.data?.quizRewardType)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const copyAndPaste = (copyFor) => {
    if (copyFor === 'playback') {
      navigator.clipboard.writeText(playbackUrl)
    } else if (copyFor === 'stream') {
      navigator.clipboard.writeText(streamingUrl)
    } else {
      navigator.clipboard.writeText(streamKey)
    }
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
                color: '#fff',
                width: '200px',
                margin: '0px 10px',
              }}
              onClick={() => copyAndPaste('stream')}
            >
              {txtCopied === 'stream' ? 'Copied URL...' : 'Copy Streaming URL'}
            </CButton>
          </div>
          <div>
            <CButton
              disabled={txtCopied === 'secret'}
              color="primary"
              style={{
                color: '#fff',
                width: '230px',
                margin: '0px 10px',
              }}
              onClick={() => copyAndPaste('secret')}
            >
              {txtCopied === 'secret' ? 'Copied Password...' : 'Copy Streaming Password'}
            </CButton>
          </div>
        </div>
        <div className="w-50 d-flex  justify-content-end">
          {isLive === 0 && (
            <CButton style={{ margin: '0px 10px' }} onClick={backLiveStream}>
              Back
            </CButton>
          )}
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
        {serverTime && (
          <LiveConsoleChatContainer
            streamId={streamId}
            socketURL={socketURL}
            isLive={isLive}
            scheduledAt={scheduledAt}
            scheduledUpto={scheduledUpto}
            serverTime={serverTime}
            broadcastStart={broadcastStart}
          />
        )}
      </div>
    </>
  )
}

export default LiveConsole
