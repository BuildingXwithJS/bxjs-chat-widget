const YouTube = require('../api/youtube-live-chat')

const channelId = 'UCPkKhlR0sXtN5hlB228xuTg'

module.exports = (onMessage) => {
  const yt = new YouTube(channelId, process.env.YOUTUBE_KEY)

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
