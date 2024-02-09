import React from 'react'

const LiveConsoleVideoView = ({ playbackUrl, isLive }) => {
  const videoStyles = {
    height: '100%',
    width: '100%',
    // left: '37%',
    // top: '0',
    // position: 'fixed',
  }

  ;(async function (IVSPlayerPackage) {
    // First, check if the browser supports the IVS player.
    if (!IVSPlayerPackage.isPlayerSupported) {
      console.warn('The current browser does not support the IVS player.')
      return
    }

    const PlayerState = IVSPlayerPackage.PlayerState
    const PlayerEventType = IVSPlayerPackage.PlayerEventType

    // Initialize player
    const player = await IVSPlayerPackage.create()
    console.log('IVS Player version:', player.getVersion())
    player.attachHTMLVideoElement(document.getElementById('video-player'))

    // Attach event listeners
    player.addEventListener(PlayerState.PLAYING, function () {
      console.log('Player State - PLAYING')
      console.log('Latency: ' + player.getLiveLatency())
    })
    player.addEventListener(PlayerState.ENDED, function () {
      console.log('Player State - ENDED')
    })
    player.addEventListener(PlayerState.READY, function () {
      console.log('Player State - READY')
    })
    player.addEventListener(PlayerEventType.ERROR, function (err) {
      console.warn('Player Event - ERROR:', err)
    })
    player.addEventListener(PlayerEventType.TEXT_METADATA_CUE, (cue) => {
      const metadataText = cue.text
      const position = player.getPosition().toFixed(2)
      console.log(
        `PlayerEvent - TEXT_METADATA_CUE: "${metadataText}". Observed ${position}s after playback started.`,
      )
    })

    player.addEventListener(PlayerState.BUFFERING, function () {
      console.log('Player State - BUFFERING')
    })

    player.addEventListener(PlayerEventType.REBUFFERING, function () {
      console.log('Player State - REBUFFERING')
    })

    // Setup stream and play
    player.setAutoplay(true)
    player.load(playbackUrl)
    // player.load(
    //   'https://fcc3ddae59ed.us-west-2.playback.live-video.net/api/video/v1/us-west-2.893648527354.channel.DmumNckWFTqz.m3u8',
    // )
    player.setVolume(1.0)
  })(window.IVSPlayer)

  return (
    <div
      className="col-md-4"
      style={{
        // width: '37%',
        height: '90vh',
        backgroundColor: 'gray',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontSize: '20px',
        fontWeight: 'bold',
      }}
    >
      {isLive === 1 && <video style={videoStyles} id="video-player" controls></video>}
      {isLive === 0 && <p>Loading...</p>}
    </div>
  )
}

export default LiveConsoleVideoView
