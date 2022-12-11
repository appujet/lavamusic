import pkg from 'signale';
const { Signale } = pkg;

export default class Logger extends Signale {
    constructor(config, client) {
        super({
            config: config,
            types: {
                info: {
                    badge: 'ℹ',
                    color: 'blue',
                    label: 'info',
                },
                warn: {
                    badge: '⚠',
                    color: 'yellow',
                    label: 'warn',
                },
                error: {
                    badge: '✖',
                    color: 'red',
                    label: 'error',
                },
                debug: {
                    badge: '🐛',
                    color: 'magenta',
                    label: 'debug',
                },
                cmd: {
                    badge: '⌨️',
                    color: 'green',
                    label: 'cmd',
                },
                event: {
                    badge: '🎫',
                    color: 'cyan',
                    label: 'event',
                },
                ready: {
                    badge: '✔️',
                    color: 'green',
                    label: 'ready',
                },
            },
            scope: (client ? `Shard ${('00' + client.shard.ids[0]).slice(-2)}` : 'Manager'),
        });
    }
};