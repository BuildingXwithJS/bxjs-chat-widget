const YouTube = require('./youtube-live-chat')

const channelId = 'UCPkKhlR0sXtN5hlB228xuTg'

const connectionsPool = []

const currentMessages = []

module.exports = async (fastify, opts, done) => {
  const yt = new YouTube(channelId, process.env.YOUTUBE_KEY)

  yt.on('ready', () => {
    console.log('ready!')
    yt.listen()
  })

  yt.on('message', (data) => {
    currentMessages.push(data)
    connectionsPool.forEach((socket) => {
      socket.send(JSON.stringify({ message: data }))
    })
  })

  yt.on('error', (error) => {
    console.error(error)
  })

  fastify.get('/messages', { websocket: true }, (connection, req) => {
    connectionsPool.push(connection.socket)
    connection.socket.send(JSON.stringify({ messages: currentMessages }))
    connection.socket.on('close', () => {
      const connectionIndex = connectionsPool.findIndex(
        (sock) => sock === connection.socket
      )
      connectionsPool.splice(connectionIndex, 1)
      connection.socket.send('bye')
    })
  })

  done()
}
