import Command from '../../structures/Command.js';

export default class Eval extends Command {
    constructor(client) {
        super(client, {
            name: 'eval',
            description: {
                content: 'Evaluates code',
                usage: '<code>',
                examples: ['client.commands.size', 'client.config.prefix'],
            },
            aliases: ['e'],
            category: 'dev',
            cooldown: 3,
            args: true,
            permissions: {
                dev: true,
                client: ['SendMessages', 'ViewChannel', 'EmbedLinks'],
                user: [],
            },
            player: {
                voice: false,
                dj: false,
                active: false,
                djPerm: null,
            },
            slashCommand: false,
        });
    }
    async run(ctx, args) {
        const code = args.join(' ');
        if (!code) {
            return ctx.sendMessage({ content: 'Please provide a code to eval!' });
        }
        try {
            let evaled = await eval(code);
            if (typeof evaled !== 'string') {
                evaled = (await import('util')).inspect(evaled, { depth: 0 });
            }
            if (evaled.includes(this.client.config)) {
                evaled = evaled.replace(this.client.config, 'CENSORED');
            }
            if (evaled.includes(this.client.token)) {
                evaled = evaled.replace(this.client.token, 'CENSORED');
            }
            if (evaled.includes(this.client.config.mongourl)) {
                evaled = evaled.replace(this.client.config.mongourl, 'CENSORED');
            }
            const splitDescription = evaled;
            return ctx.sendMessage({
                content: `\`\`\`js\n${splitDescription}\n\`\`\``,
            });
        } catch (e) {
            console.log(e, 'error');
            return ctx.sendMessage({
                content: `\`\`\`js\n${e}\n\`\`\``,
            });
        }
    }
};