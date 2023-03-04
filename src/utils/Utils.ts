
export class Utils {
    public static formatTime(ms: number): string {
        const minuteMs = 60 * 1000;
        const hourMs = 60 * minuteMs;
        const dayMs = 24 * hourMs;
        if (ms < minuteMs) {
            return `${ms / 1000}s`;
        } else if (ms < hourMs) {
            return `${Math.floor(ms / minuteMs)}m`;
        } else if (ms < dayMs) {
            return `${Math.floor(ms / hourMs)}h`;
        } else {
            return `${Math.floor(ms / dayMs)}d`;
        }
    }
}