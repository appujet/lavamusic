'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * The AsyncQueue class used to sequentialize burst requests
 */
class AsyncQueue {
    constructor() {
        /**
         * The promises array
         */
        Object.defineProperty(this, "promises", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
    }
    /**
     * The remaining amount of queued promises
     */
    get remaining() {
        return this.promises.length;
    }
    /**
     * Waits for last promise and queues a new one
     * @example
     * ```typescript
     * const queue = new AsyncQueue();
     * async function request(url, options) {
     *     await queue.wait();
     *     try {
     *         const result = await fetch(url, options);
     *         // Do some operations with 'result'
     *     } finally {
     *         // Remove first entry from the queue and resolve for the next entry
     *         queue.shift();
     *     }
     * }
     *
     * request(someUrl1, someOptions1); // Will call fetch() immediately
     * request(someUrl2, someOptions2); // Will call fetch() after the first finished
     * request(someUrl3, someOptions3); // Will call fetch() after the second finished
     * ```
     */
    wait() {
        const next = this.promises.length ? this.promises[this.promises.length - 1].promise : Promise.resolve();
        let resolve;
        const promise = new Promise((res) => {
            resolve = res;
        });
        this.promises.push({
            resolve: resolve,
            promise
        });
        return next;
    }
    /**
     * Frees the queue's lock for the next item to process
     */
    shift() {
        const deferred = this.promises.shift();
        if (typeof deferred !== 'undefined')
            deferred.resolve();
    }
}

exports.AsyncQueue = AsyncQueue;
//# sourceMappingURL=index.js.map
