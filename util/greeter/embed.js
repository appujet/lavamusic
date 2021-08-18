const { MessageEmbed } = require('discord.js');

module.exports = (args, oldEmbed) => {

  //temporarily removed support for Embed fields and timestamp
  const parameter = args.join(' ');
  const success = []; // Stores confirmation messages if embed values are succesfully saved
  const fails = []; // Stores fail messages if embed values provided cannot be saved
  const validModifiers =  [
    '{avatar}',
    '{avatarDynamic}',
    '{guildIcon}',
    '{guildIconDynamic}',
    '{guildOwnerAvatar}',
    '{guildOwnerAvatarDynamic}',
    '{userAvatar}',
    '{userAvatarDynamic}'
  ];

  const embedProps = {
    authorImageURL: matchFor('-author=image', parameter),
    authorName: matchFor('-author=name', parameter),
    authorURL: matchFor('-author=url', parameter),
    title: matchFor('-title', parameter),
    url: matchFor('-url', parameter),
    description: matchFor('-description', parameter),
    thumbnail: matchFor('-thumbnail', parameter),
    color: matchFor('-color', parameter),
    image: matchFor('-image', parameter),
    footerText: matchFor('-footer=text', parameter),
    footerImage: matchFor('-footer=image', parameter)
  };

  const urlServices = [
    'authorImageURL',
    'authorURL',
    'footerImage',
    'image',
    'thumbnail',
    'url',
  ];

  const limits = {
    title: 256,
    description: 2048,
    authorName: 256,
    footerText: 2048
  };

  //>>>>START>>>>>>>>*double checking variables**>>>>>>>>>//

  //------------testing validity of URL-------------------//
  for (const [key, val] of Object.entries(embedProps)){
    if (!urlServices.includes(key)){
      // If the key is not one of the url services
      continue;
    } else if (!val){
      // If the key has no value (User has no input for this key)
      continue;
    } else {
      // The key is a url service and has a set value from the user
      if (websiteTest(val)){
        // The value passes the website test and considered a valid url
        success.push(`**Embed#${key}** has successfully been set!`);
      } else if (validModifiers.includes(val.trim())){
        // The value is not a url but a valid modifier
        success.push(`**Embed#${key}** has successfully been set (Modifier)!`);
      } else if (embedProps[key] === ' '){
        // The value is a non-empty non-falsy value string
        success.push(`**Embed#${key}** has successfully been removed!`);
      } else {
        // The value is not a valid url
        // The value is not a valid modifier
        // The value is not a non-empty non-falsy string
        embedProps[key] = null;
        fails.push(`The provided **${key}** is invalid. Please ensure the validity of the URL.`);
      };
    };
  };

  //-----------testing validity of color------------------//

  if (embedProps.color.match(/#[a-f0-9]{6}/i)){
    embedProps.color = undefined;
    fails.push('The provided **Color Hex Code** is invalid. Please make sure you are passing a valid Hex Code');
  } else if (embedProps.color){
    success.push('**Embed#color** has successfully been set!')
  };

  //----------testing string lengths-----------------------//

  for (const [key, val] of (Object.entries(embedProps))){
    if (!['authorName', 'title', 'description', 'footerText'].includes(key)){
      continue;
    } else if (!val){
      continue;
    } else if (val.length > limits[key]){
      embedProps[key] = undefined;
      fails.push(`Embed **${key}** is only limited to **${limits[key]}** characters. Yours have **${val.length}**`);
    } else {
      success.push(`**Embed#${key}** has successfully been set!`);
    };
  };

  //>>>>>END>>>>>>>>>>*double checking variables*>>>>>>>>>>//
  //>>>>>>>>>**Check if new Outgoing data are present>>>>>>//

  if (!success.length){
    if (!fails.length){
      return { error: 'NO_EMBED_OPTIONS', success, fails };
    } else {
      return { error: 'EMBED_OPTIONS_INVALID', success, fails };
    };
  } else {

    const embed = new MessageEmbed(oldEmbed || {})

    embed.setAuthor(
      embedProps.authorName || embed.author.name || '',
      isEmpty(embedProps.authorImageURL, embed.author.iconURL),
      isEmpty(embedProps.authorURL, embed.author.url),
    )
    .setTitle(
      embedProps.title || embed.title || ''
    )
    .setURL(
      isEmpty(embedProps.url, embed.url)
    )
    .setThumbnail(
      isEmpty(embedProps.thumbnail, embed.thumbnail.url)
    )
    .setDescription(
      embedProps.description || embed.description || ''
    )
    .setImage(
      isEmpty(embedProps.image, embed.image.url)
    )
    .setColor(
      embedProps.color || embed.color
    )
    .setFooter(
      embedProps.footerText || embed.footer.text || '',
      isEmpty(embedProps.footerImage, embed.footer.iconURL),
    );

    return { embed, success, fails };
  };
};

//matches anything inside the bracket after -author=image:, -author=name:, etc
//matches "https://i.imgur.com/asdasx.png" in "-author=image:[https://i.imgur.com/asdasx.png]"
//returns undefined if matches nothing
function matchFor(option, str){
  return str.match(new RegExp('(?<=' + option + ':\\[)[\\s\\S]+?(?=])', 'g'))[0];
};

// Tests if the passed string is a valid url format or not
// Returns a Boolean
function websiteTest(str){
  return !!(str.match(/https?:\/\/[\w\d-.]{4,}\/?([\w\d:%_\+.~#?&/=-]{1,})?/g))
};

// Check if url is a blank non-falsy value
function isEmpty(str = null, other){
  return str.trim() === '' ? null : str.trim() || other || null;
};
