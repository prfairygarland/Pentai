import { CButton, CFormInput } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { getApi, postApi } from 'src/utils/Api'
import { API_ENDPOINT } from 'src/utils/config'
import { enqueueSnackbar } from 'notistack'

const LiveConsoleChatContainer = ({ streamId, socketURL, isLive }) => {
  const [chatToken, setChatToken] = useState('')
  const [chatData, setChatData] = useState([])

  useEffect(() => {
    if (chatToken && isLive === 1) {
      const socket = new WebSocket(socketURL, chatToken)
      try {
        // Connection opened
        socket.addEventListener('open', (event) => {
          console.log('connection is open :: ', event)
        })
        socket.addEventListener('error', (error) => {
          console.log('error in connection :: ', error)
        })
        socket.addEventListener('message', (message) => {
          const newMessageData = {
            name: JSON.parse(message?.data)?.Attributes?.englishName,
            message: JSON.parse(message?.data)?.Attributes?.message,
          }
          setChatData((prev) => [...prev, newMessageData])
        })
      } catch (err) {
        console.log(err)
      }
    }
  }, [chatToken])

  const getChatToken = async () => {
    try {
      const res = await postApi(API_ENDPOINT.getChatToken, { streamId: streamId })
      if (res.status === 200) {
        setChatToken(res?.data?.data?.token)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (isLive === 1) {
      getChatToken()
    }
  }, [])

  const [adminChatText, setAdminChatText] = useState('')

  const sendAdminChatText = async () => {
    if (!adminChatText) {
      enqueueSnackbar(`please add text to send`, { variant: 'error' })
      return false
    }
    try {
      let url = `${API_ENDPOINT.sendAdminChatText}`
      const res = await postApi(url, { streamId: streamId, message: adminChatText })
      setAdminChatText('')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div style={{ width: '26%', display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          border: '1px solid black',
          borderRadius: '10px',
          padding: '5px',
          margin: '10px',
          height: '22vh',
        }}
      >
        <div>
          Status :{' '}
          <span style={{ color: 'red' }}>
            <b>On AIR</b>
          </span>
        </div>
        <div>Scheduled : YYYY-MM-DD 00:00 ~ YYYY-MM-DD 00:00</div>
        <div>Current time : 00:00:00 PM</div>
        <div>Start time : 00:00:00 PM</div>
        <div>Elapsed time : 00:00:00</div>
        <div>UV l PV l Like : 000 l 000 l 000</div>
      </div>
      <div
        style={{
          border: '1px solid black',
          borderRadius: '10px',
          padding: '5px',
          margin: '10px',
          height: '40vh',
          maxHeight: '40vh',
          overflowX: 'auto',
        }}
      >
        <div>
          <b>Chat (1000)</b>
        </div>
        {chatData.length > 0 &&
          chatData.map((chat, index) => (
            <div key={index}>
              {chat.name} : {chat.message}
            </div>
          ))}
      </div>
      <div
        style={{
          border: '1px solid black',
          borderRadius: '10px',
          padding: '5px',
          margin: '10px',
          height: '20vh',
        }}
      >
        <div style={{ fontWeight: 'bold', fontSize: '18px' }}>Admin Chat</div>
        <div>
          <CFormInput
            type="text"
            placeholder="Enter message"
            className="txt-poll-title"
            name="pollTitle"
            value={adminChatText}
            onChange={(e) => {
              setAdminChatText(e.target.value.substring(0, 150))
            }}
          />
          <span className="txt-byte-information">{adminChatText.length} / 150 byte</span>
        </div>
        {isLive === 1 && (
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <CButton
              color="secondary"
              style={{
                borderRadius: '15px',
                padding: '0px 10px',
                height: '25px',
                color: '#fff',
                fontWeight: '900',
                backgroundColor: 'blue',
              }}
              onClick={sendAdminChatText}
            >
              Send
            </CButton>
          </div>
        )}
      </div>
    </div>
  )
}

export default LiveConsoleChatContainer
