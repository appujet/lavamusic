module.exports = {
  NO_OPTION_PARAM: {
    title: 'Please Include the Option Parameter',
  },
  NO_TEXT_MESSAGE: {
    title: 'Unable to change the %TYPE message to **text mode**!',
    subtitle: [
      'Make sure you have already set a %TYPE message (plain text) before you run this command.',
      `To set the message, use \`%PREFIX%COMMAND msg=set [message content]\``,
    ].join('\n')
  },
  NO_EMBED: {
    title: 'Unable to change the %TYPE message to **embed mode**!',
    subtitle: [
      'Make sure you have already set a %TYPE message (embed) before you run this command.\n',
      `To set the message, use \`%PREFIX%COMMAND embed=set [embed details]\`\n`,
    ].join('\n')
  },
  MESSAGE_SET_NO_ARGS: {
    title: 'Please enter a %TYPE message after the \`[options]\` parameter!',
    subtitle: 'You can use modifiers too to use dynamic information like the %STATE member\'s name, guild name, and guild membercount!'
  },
  EMBED_SET_NO_ARGS: {
    title: 'Please enter the embed options after the \`[options]\` parameter!',
    subtitle: 'You can use modifiers too to use dynamic information like the %STATE member\'s name, guild name, and guild membercount!'
  },
  FEATURE_NOT_ENABLED: {
    title: 'This feature is currently disabled on your server!',
    subtitle: `Enable it by typing \`%PREFIX%COMMAND\``
  },
  CHANNEL_NOT_FOUND: {
    title: 'No channel are set for sending these messages!',
    subtitle: `Set it by typing \`%PREFIX%COMMAND [#channel Mention | channel ID]\``,
  },
  NO_TYPE: {
    title: 'Failure to detect use-case!',
    subtitle: 'Please fix it by typing \`%PREFIX%COMMAND default\`!',
  },
  NO_EMBED_OPTIONS: {
    title: 'Embed options not detected!',
    subtitle: 'Embed options such as \`-title:[]\`, \`-url:[]\`, or \`-description:[]\` are needed so I could know which is which!'
  },
  EMBED_OPTIONS_INVALID: {
    title: 'All passed embed options are invalid!'
  },
};
