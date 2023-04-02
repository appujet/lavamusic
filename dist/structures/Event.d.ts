import Lavamusic from './Lavamusic.js';
export default class Event {
    client: Lavamusic;
    one: boolean;
    file: string;
    name: string;
    fileName: string;
    constructor(client: Lavamusic, file: string, options: EventOptions);
    run(...args: any[]): Promise<any>;
}
interface EventOptions {
    name: string;
    one?: boolean;
}
export {};
/**
 * Project: lavamusic
 * Author: Blacky
 * Company: Coders
 * Copyright (c) 2023. All rights reserved.
 * This code is the property of Coder and may not be reproduced or
 * modified without permission. For more information, contact us at
 * https://discord.gg/ns8CTk9J3e
 */
