import Lavamusic from './Lavamusic.js';

export default class Event {
    public client: Lavamusic;
    public one: boolean;
    public file: string;
    public name: string;
    public fileName: string;
    constructor(client: Lavamusic, file: string, options: EventOptions) {
        this.client = client;
        this.file = file;
        this.name = options.name;
        this.one = options.one || false;
        this.fileName = file.split('.')[0];
    }
    public async run(..._args: any[]): Promise<any> {
        return await Promise.resolve();
    }
}

interface EventOptions {
    name: string;
    one?: boolean;
}

/**
 * Project: lavamusic
 * Author: Blacky
 * Company: Coders
 * Copyright (c) 2023. All rights reserved.
 * This code is the property of Coder and may not be reproduced or
 * modified without permission. For more information, contact us at
 * https://discord.gg/ns8CTk9J3e
 */
