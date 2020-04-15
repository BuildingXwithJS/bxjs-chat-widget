const YouTube = require('../api/youtube-live-chat')
const { youtube } = require('../../config.js')

module.exports = (onMessage) => {
  const yt = new YouTube(youtube.channelId, youtube.apiKey)

  yt.on('ready', () => {
    console.log('[youtube] ready!')
    yt.listen(10000)
  })

  yt.on('message', (data) => {
    const message = {
      id: data.id,
      url: data.authorDetails.channelUrl,
      username: data.authorDetails.displayName,
      date: data.snippet.publishedAt,
      message: data.snippet.displayMessage,
      source: 'youtube'
    }
    onMessage(message)
  })

  yt.on('error', (error) => {
    console.error('[youtube] error:', error)
  })
}
