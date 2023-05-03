import { Context } from '../structures/index.js';
export declare class Utils {
    static formatTime(ms: number): string;
    static chunk(array: any[], size: number): any[];
    static formatBytes(bytes: number, decimals?: number): string;
    static formatNumber(number: number): string;
    static parseTime(string: string): number;
    static progressBar(current: number, total: number, size?: number, color?: number): string;
    static paginate(ctx: Context, embed: any[]): Promise<void>;
}
