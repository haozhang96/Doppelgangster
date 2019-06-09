// Import internal components.
import { IMappedObject } from "@/common/interfaces";
import { EventEmitter } from "@/common/mixins/event_emitter/event_emitter";
import { Callback, InstantiableClass } from "@/common/types";

// Import built-in libraries.
import { EventEmitter as $EventEmitter } from "events";

/**
 * Define a delegated EventEmitter class (TODO).
 * @param Base The base class to apply the mix-in to
 */
export function DelegatedEventEmitter<ClassT extends InstantiableClass>(
    Base: ClassT,
    delimiter: string = ":",
) {
    return class <EmitterT extends $EventEmitter> extends EventEmitter(
        Base as InstantiableClass,
    ) {
        private readonly _emitters: IMappedObject<EmitterT> = {};

        public addEmitter(name: string, emitter: EmitterT): this {
            this._emitters[name] = emitter;
            return this;
        }

        public addListener = (event: string, listener: Callback) => {
            return this.delegate(super.addListener, event, listener);
        }

        public emit = (event: string, ...args: any[]): boolean => {
            return this.delegate(super.emit, event, ...args);
        }

        public on = (event: string, listener: Callback) => {
            return this.delegate(super.on, event, listener);
        }

        public once = (event: string, listener: Callback) => {
            return this.delegate(super.once, event, listener);
        }

        public prependListener = (event: string, listener: Callback) => {
            return this.delegate(super.prependListener, event, listener);
        }

        public prependOnceListener = (event: string, listener: Callback) => {
            return this.delegate(super.prependOnceListener, event, listener);
        }

        public rawListeners = (event: string) => {
            return this.delegate(super.rawListeners, event);
        }

        public removeAllListeners = (event?: string) => {
            return this.delegate(super.removeAllListeners, event);
        }

        public removeEmitter(name: string): this {
            delete this._emitters[name];
            return this;
        }

        public removeListener = (event: string, listener: Callback) => {
            return this.delegate(super.removeListener, event, listener);
        }

        public off = (event: string, listener: Callback) => {
            return this.delegate(super.off, event, listener);
        }

        /**
         * Delegate a method call to a child event emitter if applicable.
         * @param method 
         * @param tag 
         * @param args Additional arguments to pass to the delegated call
         */
        private delegate<T extends Callback>(
            method: T,
            event?: string,
            ...args: any[]
        ): ReturnType<T> {
            if (event) {
                args.unshift(event.slice(event.indexOf(delimiter) + 1));
            }
            return method.call(
                this.getDelegatedEmitter(event),
                ...args,
            ) as ReturnType<T>;
        }

        private getDelegatedEmitter(event?: string): this | EmitterT {
            if (!event || !event.includes(delimiter)) {
                return this;
            }
            return this._emitters[event.slice(0, event.indexOf(delimiter))];
        }
    };
}
