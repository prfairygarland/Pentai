import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getApi, patchApi } from 'src/utils/Api'
import { API_ENDPOINT } from 'src/utils/config'
import LiveConsoleQuestions from './LiveConsoleQuestions'
import LiveConsoleVideoView from './LiveConsoleVideoView'
import LiveConsoleChatContainer from './LiveConsoleChatContainer'
import { CButton } from '@coreui/react'

const LiveConsole = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const streamId = location?.state?.streamId
  const [questions, setQuestions] = useState({})
  const [playbackUrl, setPlaybackUrl] = useState('')
  const [title, setTitle] = useState('')
  const [socketURL, setSocketURL] = useState('')
  const [isLive, setIsLive] = useState(0)
  const endLiveStream = async () => {
    let url = `${API_ENDPOINT.endLiveStream}?streamId=${location?.state?.streamId}`
    await patchApi(url)
    navigate('../LiveManagement')
  }
  const startLiveStream = async () => {
    setIsLive(1)
    let url = `${API_ENDPOINT.startLiveStream}?streamId=${location?.state?.streamId}`
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
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    if (streamId !== undefined) {
      getStreamDetails()
    }
  }, [])

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 20px' }}>
        <div style={{ fontWeight: 'bold', paddingTop: '8px', fontSize: '20px' }}>
          Title : {title}
        </div>
        <div>
          {isLive === 0 && (
            <CButton
              color="secondary"
              style={{ borderRadius: '15px', width: '150px' }}
              onClick={startLiveStream}
            >
              Start
            </CButton>
          )}
          {isLive === 1 && (
            <CButton
              color="primary"
              style={{ borderRadius: '15px', width: '150px' }}
              onClick={endLiveStream}
            >
              End
            </CButton>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <LiveConsoleQuestions questions={questions} isLive={isLive} />
        <LiveConsoleVideoView playbackUrl={playbackUrl} isLive={isLive} />
        <LiveConsoleChatContainer streamId={streamId} socketURL={socketURL} isLive={isLive} />
      </div>
    </>
  )
}

export default LiveConsole
