const text = require(`${process.cwd()}/util/string`);
const moment = require('moment');

async function modify(str, member){

  const owner = await member.guild.members.fetch(member.guild.ownerID);
  const modifiers = {
    "{avatar}": member.user.displayAvatarURL(),
    "{avatarDynamic}": member.user.displayAvatarURL({ dynamic: true, format: 'png'}),
    "{channelCount}": member.guild.channels.cache.size,
    "{categoryChannelCount}": member.guild.channels.cache.filter( c => c.type === 'category').size,
    "{textChannelCount}": member.guild.channels.cache.filter( c => c.type === 'text').size,
    "{voiceChannelCount}": member.guild.channels.cache.filter( c => c.type === 'voice').size,
    "{createdAt}": member.user.createdAt,
    "{createdAtMDY}": moment(member.user.createdAt).format('dddd, MMMM D YYYY'),
    "{discriminator}": member.user.discriminator,
    "{displayColor}": member.displayColor,
    "{displayName}": member.displayName,
    "{guildIcon}": member.guild.iconURL(),
    "{guildIconDynamic}": member.guild.iconURL({dynamic: true, format: 'png'}),
    "{guildName}": member.guild.name,
    "{guildOwner}":  owner.user.username,
    "{guildOwnerNickname}": owner.displayName,
    "{guildOwnerTag}": owner.user.tag,
    "{guildOwnerDiscrim}": owner.user.discriminator,
    "{guildOwnerAvatar}": owner.user.displayAvatarURL(),
    "{guildOwnerAvatarDynamic}": owner.user.displayAvatarURL({dynamic: true, format: 'png'}),
    "{joinedAt}": member.joinedAt,
    "{joinedAtMDY}": moment(member.joinedAt).format('dddd, MMMM D YYYY'),
    "{memberCount}": member.guild.memberCount,
    "{tag}": member.user.tag,
    "{user}": member.user.username,
    "{userNickname}": member.displayName,
    "{userTag}": member.user.tag,
    "{userDiscrim}": member.user.discriminator,
    "{userAvatar}": member.user.displayAvatarURL(),
    "{userAvatarDynamic}": member.user.displayAvatarURL({ dynamic: true, format: 'png'}),
    "{usermention}": member.toString(),
    "{memberJoinRank}": member.guild.memberCount,
    "{memberJoinRankOrdinalized}": text.ordinalize(member.guild.memberCount)
  };
  const regexp = new RegExp(Object.keys(modifiers).join('|'), 'g');

  return str.replace(regexp, word => {
    return modifiers[word] || word;
  });
};

module.exports = { modify };
