module.exports = {
    name: "leaveserver",
    category: "Owner",
    aliases: ["lv"],
    description: "Leave server",
    args: false,
    usage: "<guild id>",
    permission: [],
    owner: true,
    execute: async (message, args, client, prefix) => {
        let guild = client.guilds.cache.get(args[0]);
        if (!guild)
            return message.reply({
                content: "Could not find the Guild to Leave",
            });
        guild
            .leave()
            .then((g) => {
                message.channel.send({
                    content: `Left \`${g.name} | ${g.id}\``,
                });
            })
            .catch((e) => {
                message.reply(`${e.message ? e.message : e}`, {
                    code: "js",
                });
            });
    },
};
