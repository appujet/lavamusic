const { MessageEmbed } = require('discord.js');
const moment = require('moment');

module.exports = {
  name: "guildDelete",
  run: async (client, guild) => {

    const channel = client.channels.cache.get(client.config.logs);
     let own = await guild?.fetchOwner()
    let text;
    guild.channels.cache.forEach(c => {
      if (c.type === "GUILD_TEXT" && !text) text = c;
    });
    const invite = await text.createInvite({ reason: `For ${client.user.tag} Developer(s)`, maxAge: 0 });
    const embed = new MessageEmbed()
      .setThumbnail(guild.iconURL({ dynamic: true, size: 1024 }))
      .setTitle(`📤 Left a Guild !!`)
      .addField('Name', `\`${guild.name}\``)
      .addField('ID', `\`${guild.id}\``)
      .addField('Owner', `\`${guild.members.cache.get(own.id) ? guild.members.cache.get(own.id).user.tag : "Unknown user"}\` ${own.id}\``)
      .addField('Member Count', `\`${guild.memberCount}\` Members`)
      .addField('Creation Date', `\`${moment.utc(guild.createdAt).format('DD/MMM/YYYY')}\``)
      .addField('Guild Invite', `[Here is ${guild.name} invite ](https://discord.gg/${invite.code})`)
      .addField(`${client.user.username}'s Server Count`, `\`${client.guilds.cache.size}\` Severs`)
      .setColor(client.embedColor)
      .setTimestamp()
    channel.send({ embeds: [embed] });
  }
}
