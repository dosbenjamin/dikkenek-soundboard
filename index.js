const Discord = require('discord.js')
const fetch = require('node-fetch')

require('dotenv').config()
const { TOKEN } = process.env
const bot = new Discord.Client()

const url = 'https://dikkenek-le-soundboard.herokuapp.com'

const getSounds = async () => {
  const soundboard = await fetch(url)
  const text = await soundboard.text()
  return text
    .match(/data-sound=".[^\s-]*"/g)
    .map(sound => sound.replace(/data-sound="|"/g, ''))
}

bot.on('message', async ({ content, member, channel }) => {
  const sounds = await getSounds()

  if (content === '!dikkenek') {
    channel.send(`
      Liste des sons disponibles : \n ${ sounds.join('\n') }
    `)
    return
  }

  const sound = content.substr(1)

  if (sounds.includes(sound)) {
    const connection = await member.voice.channel.join()
    const dispatcher = connection.play(
      `${ url }/ogg/${ sound }.ogg`, { volume: 0.75 }
    )
    dispatcher.on('finish', () => connection.disconnect())
  }
})

bot.login(TOKEN)
