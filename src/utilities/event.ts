import { Callback, Optional } from "@/common/types";

// Import built-in libraries.
import { EventEmitter } from "events";

async function listenWithTimeout<T>(
    emitter: EventEmitter,
    event: string,
    handler: Callback<any, Optional<T>>,
    timeout: number,
    failureReturn?: T,
): Promise<T> {
    // Logger.trace(`Listening`);
    return new Promise<T>((resolve) => {
        // Wrap the handler in our own so we can process timeouts.
        const _handler: () => void = (...args: any[]) => {
            const returned: Optional<T> = handler.call(null, ...args);
            if (returned !== undefined) {
                resolve(returned);
                emitter.removeListener(event, _handler);
            }
        };

        // Attach to the event and set the timeout handler.
        emitter.on(event, _handler);
        setTimeout(() => {
            if (emitter.listeners(event).includes(_handler)) {
                resolve(failureReturn);
                emitter.removeListener(event, _handler);
            }
        }, timeout);
    });
}

// Expose components.
export const EventUtils = {
    listenWithTimeout,
};
