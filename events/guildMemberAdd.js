const { MessageEmbed } = require('discord.js');
const modifier = require(`${process.cwd()}/util/modifier`);
const string = require(`${process.cwd()}/util/string`);
const welcomeSchema = require("../models/Welcome")
const Canvas = require("canvas")
const path = require("path")
module.exports = async ( client, member ) => {

  const guildProfile = client.guildProfiles.get(member.guild.id);

  if (!guildProfile.greeter.welcome.isEnabled){
    return;
  } else if (!guildProfile.greeter.welcome.channel){
    return;
  } else if (!member.guild.channels.cache.get(guildProfile.greeter.welcome.channel)){
    return;
  } else {
    // Do nothing..
  };
  const { color } = client.config;

  const welcome = guildProfile.greeter.welcome;
  const type = welcome.type === 'msg' && !welcome.message ? 'default' : welcome.type;

  if (type === 'default'){
    return client.channels.cache.get(guildProfile.greeter.welcome.channel).send(
      new MessageEmbed()
      .setColor(color)
      .setTitle(`${member.user.tag} has joined our server!`)
      .setThumbnail(member.user.displayAvatarURL({format: 'png', dynamic: true}))
      .setDescription(`Hello ${member}, welcome to **${member.guild.name}**!\n\nYou are our **${string.ordinalize(member.guild.memberCount)}** member!`)
      .setFooter(`Member Greeter | ©️${new Date().getFullYear()} ALi`)
    );
  };

  //if message was text, send the text
   if (type === 'msg'){
    const message = await modifier.modify(guildProfile.greeter.welcome.message, member);
    return client.channels.cache.get(guildProfile.greeter.welcome.channel).send(message);
 };

  //if message was embed
  return client.channels.cache.get(guildProfile.greeter.welcome.channel).send(
    new MessageEmbed(
      JSON.parse(
        await modifier.modify(JSON.stringify(guildProfile.greeter.welcome.embed), member)))
  );
};
