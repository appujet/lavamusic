const { EmbedBuilder } = require('discord.js');
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
    const embed = new EmbedBuilder()
      .setThumbnail(guild.iconURL({ dynamic: true, size: 1024 }))
      .setTitle(`📤 Left a Guild !!`)
      .addFields([
        { name: 'Name', value: `\`${guild.name}\`` },
        { name: 'ID', value: `\`${guild.id}\`` },
        { name: 'Owner', value: `\`${guild.members.cache.get(own.id) ? guild.members.cache.get(own.id).user.tag : "Unknown user"}\` ${own.id}` },
        { name: 'Member Count', value: `\`${guild.memberCount}\` Members` },
        { name: 'Creation Date', value: `\`${moment.utc(guild.createdAt).format('DD/MMM/YYYY')}\`` },
        { name: 'Guild Invite', value: `[Here is ${guild.name} invite ](https://discord.gg/${invite.code})` },
        { name: `${client.user.username}'s Server Count`, value: `\`${client.guilds.cache.size}\` Servers` }
      ])
      .setColor(client.embedColor)
      .setTimestamp()
    channel.send({ embeds: [embed] });
  }
}
