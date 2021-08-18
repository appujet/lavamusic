
const text = require('../../util/string');
const constants = require('../../util/constants');
const em = require('../../assets/json/emojis.json');
const { MessageEmbed } = require("discord.js");
const { readdirSync } = require("fs");
const Discord = require('discord.js');

const { MessageButton, MessageActionRow } = require("discord-buttons")



module.exports = {
  name: 'help',
  aliases: [ ],
  group: 'General',
  description: 'Displays basic information or a help for a command.',
  clientPermissions: [ 'EMBED_LINKS' ],
  parameters: [ 'Command Name/Alina' ],
  examples: [
    'help anirand',
    'help watching',
    'help register'
  ],
  run: (client, message, [query]) => {

 const { websites } = client.config;
 
 const { color } = client.config;
 
  
  if (!query) {
 
    let group = [];
    const diremojis = {
      Action: `${em.action}`,
      Anime: `${em.anime}`,
      Fun: `${em.fun}`,
      General: `${em.general}`,
      Info: `${em.info}`,
      Moderation: `${em.mod}`,
      Music: `${em.music}`,
      
      Owner: `${em.owner}`,
      Setup: `${em.setup}`,
      Social: `${em.social}`,
      Utility: `${em.utility}`
    }
    const ignored = ['Owner']
    readdirSync("./commands/").forEach((dir) => {
      const editedName = `${diremojis[dir]}  ${dir.toUpperCase()}`
   
     if(ignored.includes(dir)) return;
      
      const commands = readdirSync(`./commands/${dir}/`).filter((file) =>
        file.endsWith(".js")
      );

      const cmds = commands.filter((command) => {
        let file = require(`../../commands/${dir}/${command}`);

        return !file.hidden;
      }).map((command) => {
        let file = require(`../../commands/${dir}/${command}`);
        
        if (!file.name) return "";
        
     
        let name = file.name.replace(".js", "");

        return `\`${name},\` `;
      });
	 
      let data = new Object();

      data = {
        name: editedName,
        value: cmds.length === 0 ? "In progress." : cmds.join(" "),
      };
       
       
      group.push(data);
    });

    const embed = new MessageEmbed()
  
      .setTitle(`**${client.user.username}'s Commands**`)      
      .setThumbnail(client.user.displayAvatarURL())
      .addFields(group)
      .setDescription(
        `These are the commands of ${client.user.username} if you want to get more details of a command type\n\`\`\`${client.prefix}help [command name]\`\`\``)
      .setFooter(
        `Help | \©️${new Date().getFullYear()} ${client.config.foot}`)
      
      .setTimestamp()
      .setColor(color);
    return message.channel.send(embed);
  } else {
      const command = client.commands.get(query.toLowerCase());

      if (!command){
        return message.channel.send(`Sorry, I couldn't find any match for **${query}** in the commands list!`);
      };

      return message.channel.send(
        new MessageEmbed()
        .setColor(color)
        .setDescription(command.description)
        .setAuthor(client.prefix + command.name, client.user.displayAvatarURL())
        .setFooter(`Help | \©️${new Date().getFullYear()} ${client.config.foot}`)
        .addFields([
          { name: 'Aliases', value: text.joinArray(command.aliases) || 'None' , inline: true },
          {
            name: 'Restrictions', inline: true,
            value: Object.entries(command).filter(( [key, val] ) => val === true)
            .map(([ key ]) => constants.restriction[key]).join(' ') || 'None'
          },
          {
            name: 'Permissions', value: text.joinArray(command.permissions.map(x => x.split('_')
            .map(a => a.charAt(0) + a.slice(1).toLowerCase()).join(' '))) || 'None', inline: true
          },
          { name: 'Parameters', value: text.joinArray(command.parameters) || 'None', inline: true },
          { name: 'Cooldown\n(seconds)', value: command.cooldown.time / 1000 || 'None', inline: true},
          { name: '\u200b', value: '\u200b', inline: true },
          { name: 'Examples', value: command.examples.map(x=>`\`${client.prefix}${x}\``)||'None'},
          {
            name: '\u200b',
            value: Object.entries(websites).map(( [name, url] ) =>{
              return `[*${name.charAt(0).toUpperCase() + name.slice(1)}*](${url})`;
            }).join('\u2000•\u2000')
          }
        ])
      );
    };
  }
}