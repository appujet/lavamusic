const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "invite",
    category: "Information",
    aliases: [ "addme" ],
    description: "invite LavaMusic",
    args: false,
    usage: "",
    permission: [],
    owner: false,
    async execute(message, args, client) {
      
      const mainPage = new MessageEmbed()
            .setAuthor('LavaMusic', 'https://media.discordapp.net/attachments/845318824323448882/876690332333514752/1629089649835.png')
            .setThumbnail('https://media.discordapp.net/attachments/845318824323448882/876690332333514752/1629089649835.png')
             .setColor('#303236')
            .addField('invite lavamusic', `[Here](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=36768832&scope=bot)`, true)
           message.channel.send(mainPage)
    }
}