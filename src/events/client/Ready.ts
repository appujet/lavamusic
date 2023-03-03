import { Event, Lavamusic } from "../../structures/index.js";

export default class Ready extends Event {
    constructor(client: Lavamusic, file: string) {
        super(client, file, {
            name: "ready"
        });
    }
    public async run(): Promise<void> {
        console.log(`${this.client.user?.tag} is ready!`);
    }
};