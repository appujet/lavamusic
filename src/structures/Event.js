export default class Event {
   /**
    * 
    * @param {import('./Client.js').BotClient} client
    * @param {*} file 
    * @param {*} options 
    */
    constructor(client, file, options = {}) {
        this.client = client;
        this.name = options.name || file.name;
        this.file = file;
    }

    async _execute(...args) {
        try {
            await this.execute(...args);
        }
        catch (err) {
            this.client.logger.error(err);
        }
    }

    reload() {
        const path = `../events/${this.name}.js`;
        delete require.cache[path];
        require(`../events/${this.name}.js`);
    }
};