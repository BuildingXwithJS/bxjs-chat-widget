const Mixer = require('@mixer/client-node')
const ws = require('ws')
const { mixer } = require('../../config')

// Instantiate a new Mixer Client
const client = new Mixer.Client(new Mixer.DefaultRequestRunner())

const { channelId } = mixer

const getConnectionInformation = (channelId) =>
  new Mixer.ChatService(client)
    .join(channelId)
    .then((response) => response.body)

module.exports = async (onMessage) => {
  const joinInformation = await getConnectionInformation(channelId)
  const socket = new Mixer.Socket(ws, joinInformation.endpoints).boot()

  socket.auth(channelId)

  socket.on('ChatMessage', (data) => {
    data.message.message.forEach(({ text }) => {
      const message = {
        id: data.id,
        url: `https://mixer.com/${data.user_name}`,
        username: data.user_name,
        date: new Date(),
        message: text,
        source: 'mixer'
      }
      onMessage(message)
    })
  })
}
