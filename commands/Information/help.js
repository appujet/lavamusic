const {
    MessageEmbed,
    Message,
    Client
} = require("discord.js");
const { readdirSync } = require("fs");
const {
    button_pagination
} = require('../../utils/button');

module.exports = {
    name: "help",
    category: "Information",
    aliases: [ "h" ],
    description: "Return all commands, or one specific command",
    args: false,
    usage: "",
    permission: [],
    owner: false,
   execute: async (message, args, client, prefix) => {
       
        let cots = [];
        let cots2 = [];
        if (!args[0]) {

            //categories to ignore
            let ignored = [
                "Owner"
            ];

            const emo = {
                config: "⚙️",
                information: "ℹ️",
                music: "🎵",
                
            }

            readdirSync('./commands').map(async (dir) => {
                const commands = readdirSync(`./commands/${dir}/`).filter((file) =>
                    file.endsWith(".js")
                );

                let cmds = commands.map(e => {
                    let obyy = new Object();

                    e = e.replace('.js', '');

                    const des = client.commands.get(e).description;

                    obyy = {
                        name: `\`${e}\``,
                        value: des || 'No description',
                        inline: true
                    }

                    return obyy
                })

                let uwu = {
                    dir,
                    cmdd: cmds
                }

                cots2.push(uwu);
            });

            let embeds = [];

            cots2.forEach(cot => {

                const embed = new MessageEmbed()
                    .setTitle(`${cot.dir.charAt(0).toUpperCase() + cot.dir.slice(1)} Commands!`)
                    .setDescription(`Use \`${prefix}help\` followed by a command name to get more information on a command.\nFor example: \`${prefix}help ping\`.\n\n`)
                    .setColor(client.embedColor)

                cot.cmdd.forEach(ecmdd => {
                    embed.addFields(ecmdd)
                })

                embeds.push(embed);
            });

            await button_pagination(message, embeds);

        } else {

            const command =
                client.commands.get(args[0].toLowerCase()) ||
                client.commands.find(
                    (c) => c.aliases && c.aliases.includes(args[0].toLowerCase())
                );


            if (!command) {
                const embed = new MessageEmbed()
                    .setTitle(`Invalid command! Use \`${prefix}help\` for all of my commands!`)
                    .setColor("RED");
                return await client.sendEmbed(embed);
            }

            const embed = new MessageEmbed()
                .setTitle("Command Details:")
                .addField(
                    "Command:",
                    command.name ? `\`${command.name}\`` : "No name for this command."
                )
                .addField(
                    "Aliases:",
                    command.aliases ?
                    `\`${command.aliases.join("` `")}\`` :
                    "No aliases for this command."
                )
                .addField(
                    "Usage:",
                    command.usage ?
                    `\`${prefix}${command.name} ${command.usage}\`` :
                    `\`${prefix}${command.name}\``
                )
                .addField(
                    "Command Description:",
                    command.description ?
                    command.description :
                    "No description for this command."
                )
                .setFooter(
                    `Requested by ${message.member.displayName}`,
                    message.author.displayAvatarURL({
                        dynamic: true
                    })
                )
                .setTimestamp()
                .setColor(client.embedColor);
            return await message.channel.send({embeds: [embed]});
        }
    },
};
