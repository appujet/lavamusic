const config = require("../config.js");
const { EmbedBuilder } = require("discord.js");
const chalk = require("chalk");
/**
 * @param {Discord.Client} client
 */

module.exports = async (client) => {
    process.on("beforeExit", (code) => {
        // If You Want You Can Use
        console.log(chalk.yellow.dim("[AntiCrash] | [BeforeExit_Logs] | [Start] : ==============="));
        console.log(code);
        console.log(chalk.yellow("[AntiCrash] | [BeforeExit_Logs] | [End] : ==============="));
    });
    process.on("exit", (error) => {
        // If You Want You Can Use
        console.log(chalk.yellow("[AntiCrash] | [Exit_Logs] | [Start]  : ==============="));
        console.log(error);
        console.log(chalk.yellow("[AntiCrash] | [Exit_Logs] | [End] : ==============="));
    });
    process.on("unhandledRejection", async (reason, promise) => {
        // Needed
        console.log(chalk.yellow("[AntiCrash] | [UnhandledRejection_Logs] | [start] : ==============="));
        console.log(reason);
        console.log(chalk.yellow("[AntiCrash] | [UnhandledRejection_Logs] | [end] : ==============="));

        let errorLogsChannel = client.channels.cache.get(config.errorLogsChannel);
        if (!errorLogsChannel) errorLogsChannel = await client.channels.fetch(config.errorLogsChannel);
        const errEmbed = new EmbedBuilder()
            .setColor("#000000")
            .setTitle(`An Error Occured:`)
            .setDescription(`\`\`\`${reason}\`\`\``)
            .setTimestamp();

        if (errorLogsChannel) {
            await errorLogsChannel.send({
                embeds: [errEmbed],
            });
        }
    });
    process.on("rejectionHandled", (promise) => {
        // If You Want You Can Use
        console.log(chalk.yellow("[AntiCrash] | [RejectionHandled_Logs] | [Start] : ==============="));
        console.log(promise);
        console.log(chalk.yellow("[AntiCrash] | [RejectionHandled_Logs] | [End] : ==============="));
    });
    process.on("uncaughtException", (err, origin) => {
        // Needed
        console.log(chalk.yellow("[AntiCrash] | [UncaughtException_Logs] | [Start] : ==============="));
        console.log(err);
        console.log(chalk.yellow("[AntiCrash] | [UncaughtException_Logs] | [End] : ==============="));
    });
    process.on("uncaughtExceptionMonitor", (err, origin) => {
        // Needed
        console.log(chalk.yellow("[AntiCrash] | [UncaughtExceptionMonitor_Logs] | [Start] : ==============="));
        console.log(err);
        console.log(chalk.yellow("[AntiCrash] | [UncaughtExceptionMonitor_Logs] | [End] : ==============="));
    });
    process.on("warning", (warning) => {
        // If You Want You Can Use
        console.log(chalk.yellow("[AntiCrash] | [Warning_Logs] | [Start] : ==============="));
        console.log(warning);
        console.log(chalk.yellow("[AntiCrash] | [Warning_Logs] | [End] : ==============="));
    });
    // process.on('SIGINT', () => { // If You Want You Can Use
    //   console.log(chalk.yellow('☆・[AntiCrash] | [SIGINT]・☆'));
    // });

    client.logger.log(chalk.blue(`Loaded ErrorHandler (AntiCrash)`));
};
