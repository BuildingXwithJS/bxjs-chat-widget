const { ChatClient } = require('dank-twitch-irc')

module.exports = async (onMessage) => {
  const client = new ChatClient()

  client.on('ready', () => console.log('Successfully connected to chat'))
  client.on('close', (error) => {
    if (error != null) {
      console.error('Client closed due to error', error)
    }
  })

  client.on('PRIVMSG', (msg) => {
    const now = new Date()
    const message = {
      id: `${now.getTime()}_${msg.displayName}`,
      url: `https://twitch.tv/${msg.displayName}`,
      username: msg.displayName,
      date: now,
      message: msg.messageText,
      source: 'twitch'
    }
    onMessage(message)
  })

  client.connect()
  client.join('yamalight')
}
