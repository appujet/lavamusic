const { readdirSync } = require('fs');

module.exports = (client) => {
    let count = 0;
    readdirSync("./src/commands/").forEach(dir => {
        const commandFiles = readdirSync(`./src/commands/${dir}/`).filter(f => f.endsWith('.js'));
        for (const file of commandFiles) {
            const command = require(`../commands/${dir}/${file}`);
            if (command.name) {
                client.commands.set(command.name, command);
                if (command.aliases && Array.isArray(command.aliases)) {
                    command.aliases.forEach(alias => {
                        client.aliases.set(alias, command.name)
                    })
                }
                count++;
            }
        }
    });
    client.logger.log(`Client Commands Loaded ${count}`, "cmd");
}