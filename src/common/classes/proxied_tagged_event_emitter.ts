// Import internal components.
import { Callback, Optional } from "@/common/types";

// Import built-in libraries.
import { EventEmitter } from "events";

export class ProxiedTaggedEventEmitter<T extends EventEmitter> {
    private readonly taggedListeners: Map<string, Map<any, Callback>> =
        new Map();

    constructor(private readonly target: T) { }

    public emit(event: string, ...args: any[]): boolean {
        return this.target.emit(event, ...args);
    }

    public addTaggedListener(
        event: string,
        tag: any,
        listener: Callback,
    ): this {
        let listeners: Optional<Map<any, Callback>> =
            this.taggedListeners.get(event);

        // STUB
        if (!listeners) {
            this.taggedListeners.set(event, listeners = new Map());
        } else if (listeners.has(tag)) {
            throw new Error(`The "${
                event
            }" event already has a listener with the tag "${
                tag
            }" attached!`);
        }

        // STUB
        listeners.set(tag, listener);
        this.target.on(event, listener);
        return this;
    }

    public removeTaggedListener(event: string, tag: any): this {
        const listeners: Optional<Map<any, Callback>> =
            this.taggedListeners.get(event);

        if (listeners && listeners.has(tag)) {
            const listener: Optional<Callback> = listeners.get(tag);
            if (listener) {
                this.target.removeListener(event, listener);
            }
            listeners.delete(tag);
        }

        return this;
    }

    public removeAllTaggedListeners(event: string): this {
        const listeners: Optional<Map<any, Callback>> =
            this.taggedListeners.get(event);

        if (listeners) {
            for (const [tag, listener] of listeners) {
                this.target.removeListener(event, listener);
                listeners.delete(tag);
            }
        }

        return this;
    }

    public hasTaggedListener(event: string, tag: any): boolean {
        const listeners: Optional<Map<any, Callback>> =
            this.taggedListeners.get(event);
        return listeners && listeners.has(tag) || false;
    }
}
