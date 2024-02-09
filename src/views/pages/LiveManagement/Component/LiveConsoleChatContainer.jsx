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
    // <div style={{ width: '26%', display: 'flex', flexDirection: 'column' }}>
    <div className="col-md-4 p-2">
      {/* <div
        style={{
          border: '1px solid black',
          borderRadius: '10px',
          padding: '5px',
          margin: '10px',
          height: '22vh',
        }}
      > */}
      <div className="statusBox">
        <p>
          <b> Status :</b>{' '}
          <span style={{ color: 'red' }}>
            <b>On AIR</b>
          </span>
        </p>
        <p>
          <b>Scheduled :</b> YYYY-MM-DD 00:00 ~ YYYY-MM-DD 00:00
        </p>
        <p>
          <b>Current time :</b> 00:00:00 PM
        </p>
        <p>
          <b>Start time :</b> 00:00:00 PM
        </p>
        <p>
          <b>Elapsed time :</b> 00:00:00
        </p>
        <p>
          <b>UV l PV l Like :</b> 000 l 000 l 000
        </p>
      </div>
      {/* <div
        style={{
          border: '1px solid black',
          borderRadius: '10px',
          padding: '5px',
          margin: '10px',
          height: '40vh',
          maxHeight: '40vh',
          overflowX: 'auto',
        }}
      > */}
      <div className="chatBoxWrp">
        <h5>Chat (1000)</h5>
        <div className="chatBoxList">
          {chatData.length > 0 &&
            chatData.map((chat, index) => (
              <p key={index}>
                <b>{chat.name}</b> : {chat.message}
              </p>
            ))}
        </div>
      </div>
      {/* <div
        style={{
          border: '1px solid black',
          borderRadius: '10px',
          padding: '5px',
          margin: '10px',
          height: '20vh',
        }}
      > */}
      <div className="adminChat">
        <h5>Admin Chat</h5>
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
        </div>
        <div className="d-flex justify-content-between align-items-center mt-2">
          <span>{adminChatText.length} / 150 byte</span>
          {isLive === 1 && (
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <CButton onClick={sendAdminChatText}>Send</CButton>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LiveConsoleChatContainer
