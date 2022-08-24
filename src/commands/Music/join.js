const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  name: "join",
  aliases: ["j"],
  category: "Music",
  description: "Summons the bot to your voice channel.",
  args: false,
  usage: "",
  userPerms: [],
  owner: false,
  player: false,
  inVoiceChannel: true,
  sameVoiceChannel: false,
  execute: async (message, args, client, prefix) => {
    
    let player = message.client.manager.get(message.guildId);
        if(player && player.voiceChannel && player.state === "CONNECTED") {
            return await message.channel.send({embeds: [new EmbedBuilder().setColor(client.embedColor).setDescription( `I'm already connected to the <#${player.voiceChannel}> voice channel!`)]})
        } else {
    if (!message.guild.members.me.permissions.has([PermissionFlagsBits.Connect, PermissionFlagsBits.Speak])) return message.channel.send({embeds: [new EmbedBuilder().setColor(client.embedColor).setDescription(`I don't have enough permissions to execute this command! Please give me permission to \`CONNECT\` or \`SPEAK\`.`)]});

    const { channel } = message.member.voice;
   
    if (!message.guild.members.me.permissionsIn(channel).has([PermissionFlagsBits.Connect, PermissionFlagsBits.Speak])) return message.channel.send({embeds: [new EmbedBuilder().setColor(client.embedColor).setDescription(`I don't have enough permissions to connect to your VC! Please give me permission to \`CONNECT\` or \`SPEAK\`.`)]});
   
    const emojiJoin = message.client.emoji.join;

     player = message.client.manager.create({
        guild: message.guild.id,
        voiceChannel: channel.id,
        textChannel: message.channel.id,
        volume: 80,
        selfDeafen: true,
      }) 
      if(player && player.state !== "CONNECTED") player.connect();

      let thing = new EmbedBuilder()
        .setColor(client.embedColor)
        .setDescription(`${emojiJoin} **Joined the voice channel.**\nJoined <#${channel.id}> and bound to <#${message.channel.id}>`)
      return message.reply({ embeds: [thing] });

    };
  }
};
