const config = require("../config.js");
const { EmbedBuilder } = require("discord.js");
var colors = require("colors");
/**
 * @param {Discord.Client} client
 */

module.exports = async (client) => {
    process.on("beforeExit", (code) => {
        // If You Want You Can Use
        console.log("[AntiCrash] | [BeforeExit_Logs] | [Start] : ===============".yellow.dim);
        console.log(code);
        console.log("[AntiCrash] | [BeforeExit_Logs] | [End] : ===============".yellow);
    });
    process.on("exit", (error) => {
        // If You Want You Can Use
        console.log("[AntiCrash] | [Exit_Logs] | [Start]  : ===============".yellow);
        console.log(error);
        console.log("[AntiCrash] | [Exit_Logs] | [End] : ===============".yellow);
    });
    process.on("unhandledRejection", (reason, promise) => {
        // Needed
        console.log("[AntiCrash] | [UnhandledRejection_Logs] | [start] : ===============".yellow);
        console.log(reason);
        console.log("[AntiCrash] | [UnhandledRejection_Logs] | [end] : ===============".yellow);

        const errorLogsChannel = client.channels.cache.get(config.errorLogsChannel);
        const errEmbed = new EmbedBuilder()
            .setColor("#000000")
            .setTitle(`An Error Occured:`)
            .setDescription(`\`\`\`${reason}\`\`\``)
            .setTimestamp();

        if (errorLogsChannel) {
            errorLogsChannel.send({
                embeds: [errEmbed],
            });
        }
    });
    process.on("rejectionHandled", (promise) => {
        // If You Want You Can Use
        console.log("[AntiCrash] | [RejectionHandled_Logs] | [Start] : ===============".yellow);
        console.log(promise);
        console.log("[AntiCrash] | [RejectionHandled_Logs] | [End] : ===============".yellow);
    });
    process.on("uncaughtException", (err, origin) => {
        // Needed
        console.log("[AntiCrash] | [UncaughtException_Logs] | [Start] : ===============".yellow);
        console.log(err);
        console.log("[AntiCrash] | [UncaughtException_Logs] | [End] : ===============".yellow);
    });
    process.on("uncaughtExceptionMonitor", (err, origin) => {
        // Needed
        console.log("[AntiCrash] | [UncaughtExceptionMonitor_Logs] | [Start] : ===============".yellow);
        console.log(err);
        console.log("[AntiCrash] | [UncaughtExceptionMonitor_Logs] | [End] : ===============".yellow);
    });
    process.on("warning", (warning) => {
        // If You Want You Can Use
        console.log("[AntiCrash] | [Warning_Logs] | [Start] : ===============".yellow);
        console.log(warning);
        console.log("[AntiCrash] | [Warning_Logs] | [End] : ===============".yellow);
    });
    // process.on('SIGINT', () => { // If You Want You Can Use
    //   console.log('☆・[AntiCrash] | [SIGINT]・☆'.yellow.dim);
    // });

    client.logger.log(`Loaded ErrorHandler (AntiCrash)`.blue);
};
