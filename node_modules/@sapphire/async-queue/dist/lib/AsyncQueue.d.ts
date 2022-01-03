/**
 * The AsyncQueue class used to sequentialize burst requests
 */
export declare class AsyncQueue {
    /**
     * The remaining amount of queued promises
     */
    get remaining(): number;
    /**
     * The promises array
     */
    private promises;
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
    wait(): Promise<void>;
    /**
     * Frees the queue's lock for the next item to process
     */
    shift(): void;
}
//# sourceMappingURL=AsyncQueue.d.ts.map