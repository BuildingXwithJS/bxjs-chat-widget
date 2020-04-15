const youtubeClient = require('./clients/youtube')

const connectionsPool = []

const currentMessages = []

const onMessage = (data) => {
  currentMessages.push(data)
  connectionsPool.forEach((socket) => {
    socket.send(JSON.stringify(data))
  })
}

module.exports = async (fastify, opts, done) => {
  // bootstrap clients
  youtubeClient(onMessage)

  // messages ws endpoint
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
