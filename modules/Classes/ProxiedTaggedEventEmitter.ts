import { EventEmitter } from "events";


export class ProxiedTaggedEventEmitter<T extends EventEmitter> {
    private readonly target: T;
    private readonly taggedListeners: Map<string, Map<any, Function>> = new Map();


    constructor(target: T) {
        this.target = target;
    }


    public emit(event: string, ..._arguments: any[]): boolean {
        return this.target.emit(event, ..._arguments);
    }

    public addTaggedListener(event: string, tag: any, listener: Function): this {
        let listeners: Map<any, Function> | undefined = this.taggedListeners.get(event);

        if (!listeners)
            this.taggedListeners.set(event, listeners = new Map());
        else if (listeners.has(tag))
            throw new Error(`The "${event}" event already has a listener with the tag "${tag}" attached!`);
        
        return listeners.set(tag, listener) && this.target.on(event, listener) && this;
    }

    public removeTaggedListener(event: string, tag: any): this {
        const listeners: Map<any, Function> | undefined = this.taggedListeners.get(event);
        
        if (listeners && listeners.has(tag)) {
            const listener: Function | undefined = listeners.get(tag);
            if (listener) this.target.removeListener(event, listener);
            listeners.delete(tag);
        }

        return this;
    }

    public removeAllTaggedListeners(event: string): this {
        const listeners: Map<any, Function> | undefined = this.taggedListeners.get(event);

        if (listeners)
            for (const [tag, listener] of listeners) {
                this.target.removeListener(event, listener);
                listeners.delete(tag);
            }
        
        return this;
    }

    public hasTaggedListener(event: string, tag: any): boolean {
        const listeners: Map<any, Function> | undefined = this.taggedListeners.get(event);
        return listeners && listeners.has(tag) || false;
    }
}