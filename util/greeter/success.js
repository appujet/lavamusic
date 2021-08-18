module.exports = {
  STATS_IS_DEF: {
    title: '%TITLE Feature message has been successfully reverted to **default**!',
    subtitle: [
      '%STATE members will now be announced by ALi\'s default announce message.',
      `To change the message, use \`%PREFIX%COMMAND [options] [additional parameters]\``
    ].join('\n')
  },
  TYPE_IS_MESSAGE: {
    title: '%TITLE Feature message has been successfully changed to **text mode**!',
    subtitle: [
      '%STATE members will now be announced through your guild\'s configured %TYPE message.',
      `To change the message, use \`%PREFIX%COMMAND [options] [additional parameters]\``,
    ].join('\n')
  },
  TYPE_IS_EMBED: {
    title: '%TITLE Feature message has been successfully changed to **embed mode**!',
    subtitle: [
      '%STATE members will now be announced through your guild\'s configured %TYPE message.',
      `To change the message, use \`%PREFIX%COMMAND [options] [additional parameters]\``,
    ].join('\n')
  },
  MESSAGE_TEXT_SET: {
    title: '%TITLE Feature message has been set!',
    subtitle: `You may now use this message on member %ACTION via \`%PREFIX%COMMAND msg=true\``,
  },
  MESSAGE_EMBED_SET: {
    title: '%TITLE Embed Message has been updated!',
    subtitle: `You may now use this embed on member %ACTION via \`%PREFIX%COMMAND embed=true\``
  }
}
