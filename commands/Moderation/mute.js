const text = require('../../util/string');
const em = require('../../assets/json/emojis.json');
module.exports = {
  name: 'mute',
  aliases: [ 'deafen', 'silence', 'shut' ],
  guildOnly: true,
  permissions: [ 'MANAGE_ROLES' ],
  group: 'Moderation',
  description: 'Prevents a user from sending a message in this server',
  parameters: [ 'User Mention | ID' ],
  examples: [
    'mute @user',
    'mute 798213718237181231'
  ],
  run: async (client, message, [member = ''] ) => {

    const muteID = (client.guildProfiles
    .get(message.guild.id) || {})
    .roles.muted;

    if (!muteID){
      return message.channel.send(`${em.error} Muterole is yet to be set! Do so by using \`setmute\` command.`);
    };

    const muted = message.guild.roles.cache.get(muteID);

    if (!muted){
      return message.channel.send(`${em.error} The role set for muting members could not be found! Set a new one by using \`setmute\` command.`);
    };

    if (!member.match(/\d{17,19}/)){
      return message.channel.send(`${em.error} Please provide the ID or mention the user to mute.`);
    };

    member = await message.guild.members
    .fetch(member.match(/\d{17,19}/)[0])
    .catch(() => null);

    if (!member){
      return message.channel.send(`${em.error} Unable to mute user: User not found.`);
    } else if (message.member.roles.highest.position < member.roles.highest.position){
      return message.channel.send(`${em.error} ${message.author}, you cannot mute user whose roles are higher than yours!`)
    } else if (member.id === client.user.id){
      return message.channel.send(`${em.error} ${message.author}, no don't mute me!`);
    } else if (member.user.bot){
      return message.channel.send(`${em.error} ${message.author}, you cannot mute bots!`);
    } else if (message.member.id === member.id){
      return message.channel.send(`${em.error} ${message.author}, you cannot mute yourself!`);
    } else if (member.roles.cache.has(muted.id)){
      return message.channel.send(`${em.error} ${message.author}, **${member.user.tag}** is already muted!`)
    };

    let _warn = ''
    // Checking if the muterole is a suitable muterole by checking if this disables
    // the send message permission
    if (muted.permissions.has('SEND_MESSAGES')){
      _warn = _warn + '⚠️ The selected muted role does not disable users to send messages, please edit the role permission!\n'
    };

    // Checking if every role above the position of the mute role the use has
    // have a permission to send message, this will invalidate the function of
    // the mute command if they have one.
    let warns = member.roles.cache.filter(role => role.position > muted.position)
    .filter(role => role.permissions.has('SEND_MESSAGES'))
    .map(role => role.toString());

    if (warns.length){
      _warn = _warn + `⚠️ **${member.user.tag}** may still be able to speak because he has the ${text.joinArray(warns)} role(s) which grant permissions to send messages.`;
    };

    return member.roles.add(muted)
    .then(member => message.channel.send(`${em.success} | Successfully muted **${member.user.tag}**\n${_warn}`))
    .catch(() => message.channel.send(`${em.error} | Failed to mute **${member.user.tag}**.`))
  }
};
