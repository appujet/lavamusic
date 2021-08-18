const { MessageEmbed } = require('discord.js');
const text = require('../../util/string');

module.exports = {
  name: 'support',
  aliases: ['botinfo'],
  guildOnly: true,
  group: 'Info',
  description: 'Displays various ways to show support for ALi',
  clientPermissions: [ 'EMBED_LINKS' ],
  parameters: [ ],
  examples: [ 'support' ],
  run: async (client, message) => {

    const { color } = client.config;
    return message.channel.send(
      new MessageEmbed()
      .setColor(color)
      .setTitle('Support ALi and its Development!')
      .setDescription([
        'ALi is an open-source, but still a young and adolescent bot, not yet fully matured.',
        'As the bot progresses, Alina is bound to produce undesirable errors',
        'that interferes with her functions, and therefore strains functionality.',
        'It is good to hear that you\'re interested in supporting ALi, and there',
        'are various ways to do so..'
      ].join(' '))
      .addFields([
        {
          name: 'Join Her Support Server.',
          value: [
            `Join with ${message.client.guilds.cache.get('810116763639087124').memberCount}`,
            'other people and participate in ALi\'s support server from development to production,',
            'test bots, report bugs, or add feature requests, and be updated on what\'s to come.'
          ].join(' ')
        },{
          name: 'Contribute to Repository.',
          value: [
            'Found some bugs? Do you feel you can fix it yourself? Contribute to ALi\'s repository',
            '[here](https://github.com/brblacky/ALi) by creating an issue or making a reasonable',
            'pull request. While you\'re at it please follow Blacky#6618, Venom#9718 and/or add a star to',
            'the repository.'
          ].join(' ')
        },{
          name: 'Collaborate.',
          value: [
            'As of the moment, there are no dedicated collaborators for the production of Alina, and maintaining',
            'the bot has been done solely by Blacky#6618, Venom#9718. This is the reason why some fix updates take',
            'longer than anticipated. If you are confident and active enough to help maintain the code, you',
            'may [join](https://discord.gg/gfcv94hDhv) my support server and contact `Blacky#6618, Venom#9718` from there.'
          ].join(' ')
        },{
          name: 'Vote ALi.',
          value: [
            'Alina is available both on [DiscordBotList](https://discordbotlist.com/bots/alina-bot) and',
            '[DisBotlist](https://disbotlist.xyz/bot/841716414053351486). If you like this bot please vote and leave',
            'a review. Your review will be helpful when making changes to the bot. As of the moment,',
            'there are no rewards implemented for voting, but is subject to change.'
          ].join(' ')
        },
      ]).setFooter(`Support | \©️${new Date().getFullYear()} ${client.config.foot}`)
    )
  }
}
