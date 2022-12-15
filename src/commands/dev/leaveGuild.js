import Command from '../../structures/Command.js';

export default class LeaveGuild extends Command {
    constructor(client) {
        super(client, {
            name: 'leave-guild',
            description: {
                content: 'Leave a guild',
                usage: '<server id>',
                examples: ['leave-guild 123456789'],
            },
            aliases: ['gleave'],
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
        
        const guild = this.client.guilds.cache.get(args.join(" "));

        if (!guild) return ctx.sendMessage("Guild not found.");

        await guild.leave()
        await ctx.sendMessage(`Left guild: ${guild.name}`);

    }
};
