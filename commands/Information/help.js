const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");

module.exports = {
    name: "help",
    category: "Information",
    aliases: [ "h" ],
    description: "Return all commands, or one specific command",
    args: false,
    usage: "",
    permission: [],
    owner: false,
    async execute(message, args, client) {
        const embed = new MessageEmbed()
            .setColor(client.embedColor)
            .setAuthor(message.client.user.username, message.client.user.displayAvatarURL())
            .setThumbnail(message.client.user.displayAvatarURL())
            .setFooter(`Request by: ${message.author.tag}`, message.author.displayAvatarURL())
            .setTitle(`List All Command`);

        const commands = (category) => {
            return message.client.commands
                .filter(cmd => cmd.category === category)
                .map(cmd => `\`${cmd.name}\``)
                .join(", ");
        }

        const info = message.client.categories
            .map(cat => stripIndents`**${cat[0].toUpperCase() + cat.slice(1)}** \n ${commands(cat)}`)
            .reduce((string, category) => string + "\n" + category);

        return message.channel.send(embed.setDescription(info));
    }
};