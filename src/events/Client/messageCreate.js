const { MessageEmbed, Permissions } = require("discord.js");
const db = require("../../schema/prefix.js");
const i18n = require("../../utils/i18n");

module.exports = {
    name: "messageCreate",
    run: async (client, message) => {
   
   if (message.author.bot) return;
   if (!message.guild) return;
    let prefix = client.prefix;
    const channel = message?.channel;
    const ress =  await db.findOne({Guild: message.guildId})
   if(ress && ress.Prefix)prefix = ress.Prefix;

    const mention = new RegExp(`^<@!?${client.user.id}>( |)$`);
    if (message.content.match(mention)) {
      const embed = new MessageEmbed()
        .setColor(client.embedColor)
        .setDescription(i18n.__mf("events.msgcrt.embed", {
            Pre: prefix
          }));
      message.channel.send({embeds: [embed]})
    };
    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
    if (!prefixRegex.test(message.content)) return;
    const [ matchedPrefix ] = message.content.match(prefixRegex);
    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) ||
        client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;
    if(!message.guild.me.permissions.has(Permissions.FLAGS.SEND_MESSAGES)) return await message.author.dmChannel.send({ content: `${i18n.__mf("events.msgcrt.embed2", {
        channelId: message.channel.id,
        cmdname: command.name,
      })}` }).catch(() => {});

    if(!message.guild.me.permissions.has(Permissions.FLAGS.VIEW_CHANNEL)) return;

    if(!message.guild.me.permissions.has(Permissions.FLAGS.EMBED_LINKS)) return await message.channel.send({ content: `${i18n.__mf("events.msgcrt.embed3", {
        cmdname: command.name
      })}` }).catch(() => {});
    
    const embed = new MessageEmbed()
        .setColor("RED");

    // args: true,
    if (command.args && !args.length) {
        let reply = `${i18n.__("events.msgcrt.embed4")} ${message.author}!`;
        
        // usage: '',
        if (command.usage) {
        	reply += `\n\`${prefix}${command.name} ${command.usage}\``;
        }
        
        embed.setDescription(reply);
        return message.channel.send({embeds: [embed]});
    }

    if (command.permission && !message.member.permissions.has(command.permission)) {
        embed.setDescription(i18n.__("prams.prams"));
        return message.channel.send({embeds: [embed]});
    }
   if (!channel.permissionsFor(message.guild.me)?.has(Permissions.FLAGS.EMBED_LINKS) && client.user.id !== userId) {
        return channel.send({ content: `${i18n.__("events.msgcrt.embed5")}` });
      }
    if (command.owner && message.author.id !== `${client.owner}`) {
        embed.setDescription("Only <@491577179495333903> can use this command!");
        return message.channel.send({embeds: [embed]});
    }

    const player = message.client.manager.get(message.guild.id);

    if (command.player && !player) {
        embed.setDescription(i18n.__("player.nomusic"));
        return message.channel.send({embeds: [embed]});
    }

    if (command.inVoiceChannel && !message.member.voice.channelId) {
        embed.setDescription(i18n.__("player.vcmust"));
        return message.channel.send({embeds: [embed]});
    }

    if (command.sameVoiceChannel) {
    if(message.guild.me.voice.channel) {
        if (message.guild.me.voice.channelId !== message.member.voice.channelId) {
            embed.setDescription(`${i18n.__("player.samevc")} ${message.guild.me.voice.channel}!`);
            return message.channel.send({embeds: [embed]});
        }
    }
}

    try {
        command.execute(message, args, client, prefix);
    } catch (error) {
        console.log(error);
        embed.setDescription(i18n.__("player.cmderr"));
        return message.channel.send({embeds: [embed]});
    }
  }
};
