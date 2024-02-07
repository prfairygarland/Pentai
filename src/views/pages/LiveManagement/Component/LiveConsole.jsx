import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { getApi } from 'src/utils/Api'
import { API_ENDPOINT } from 'src/utils/config'
import LiveConsoleQuestions from './LiveConsoleQuestions'
import LiveConsoleVideoView from './LiveConsoleVideoView'
import LiveConsoleChatContainer from './LiveConsoleChatContainer'
import { CButton } from '@coreui/react'

const LiveConsole = () => {
  const location = useLocation()
  const streamId = location?.state?.streamId
  const [questions, setQuestions] = useState({})
  const [playbackUrl, setPlaybackUrl] = useState('')
  const [title, setTitle] = useState('')
  const getStreamDetails = async () => {
    try {
      let url = `${API_ENDPOINT.getStreamDetails}?streamId=${streamId}`
      const res = await getApi(url)
      console.log(res)
      if (res.status === 200) {
        setQuestions(res?.data?.questions)
        setPlaybackUrl(res?.data?.playbackUrl)
        setTitle(res?.data?.title)
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
          <CButton color="primary" style={{ borderRadius: '15px', width: '150px' }}>
            End
          </CButton>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <LiveConsoleQuestions questions={questions} />
        <LiveConsoleVideoView playbackUrl={playbackUrl} />
        <LiveConsoleChatContainer streamId={streamId} />
      </div>
    </>
  )
}

export default LiveConsole
