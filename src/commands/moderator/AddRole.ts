import { Command, Lavamusic, Context } from "../../structures/index.js";


export default class AddRole extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: "addrole",
            description: {
                content: "Adds a role to a user",
                examples: ["addrole @user @role"],
                usage: "addrole <user> <role>"
            },
            category: "moderator",
            aliases: ["ar"],
            cooldown: 3,
            args: true,
            player: {
                voice: false,
                dj: false,
                active: false,
                djPerm: null
            },
            permissions: {
                dev: false,
                client: ["SendMessages", "ViewChannel", "EmbedLinks", "ManageRoles"],
                user: ["ManageRoles"]
            },
            slashCommand: false,
            options: []
        });
    };
    public async run(client: Lavamusic, ctx: Context, args: string[]): Promise<void> {

        const embed = this.client.embed();
        
    }
}