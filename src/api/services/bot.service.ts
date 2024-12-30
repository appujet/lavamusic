export class BotService {
    async getAllBots() {
        // Mock implementation
        return [
            { id: 1, name: "Bot A" },
            { id: 2, name: "Bot B" },
        ];
    }

    async createBot(data: any) {
        // Mock implementation
        return { id: Date.now(), ...data };
    }
}