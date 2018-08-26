import { EventEmitter } from "events";


export const Event: {
    listenWithTimeout<T>(emitter: EventEmitter, event: string, handler: (..._arguments: any[]) => T | undefined, timeout: number, failureReturn?: T): Promise<T>;
} = {
    async listenWithTimeout<T>(emitter: EventEmitter, event: string, handler: (..._arguments: any[]) => T | undefined, timeout: number, failureReturn?: T): Promise<T> {
        // Logger.trace(`Listening`);
        return new Promise<T>(resolve => {
            // Wrap the handler in our own so we can process timeouts
            const _handler: () => void = (..._arguments: any[]) => {
                const returned: T = handler.call(null, ..._arguments);
                if (returned !== undefined) {
                    resolve(returned); emitter.removeListener(event, _handler);
                }
            };
            
            // Attach to the event and set the timeout handler
            emitter.on(event, _handler);
            setTimeout(() => {
                if (emitter.listeners(event).includes(_handler)) {
                    resolve(failureReturn); emitter.removeListener(event, _handler);
                }
            }, timeout);
        });
    }
};