// Import internal components.
import { InstantiableClass, ReturnInstead } from "@/common/types";

// Import built-in libraries.
import { EventEmitter as $EventEmitter } from "events";

// Keep a reference to the original EventEmitter's prototype.
const prototype: typeof $EventEmitter.prototype = $EventEmitter.prototype;

/**
 * STUB
 * @param Base 
 */
export function EventEmitter<ClassT extends InstantiableClass>(Base: ClassT) {
    return class extends Base implements $EventEmitter {
        // Expose all of the EventEmitter class' fields and methods.
        public addListener!: ReturnInstead<typeof prototype.addListener, this>;
        public emit!: typeof prototype.emit;
        public eventNames!: typeof prototype.eventNames;
        public getMaxListeners!: typeof prototype.getMaxListeners;
        public listenerCount!: typeof prototype.listenerCount;
        public listeners!: typeof prototype.listeners;
        public on!: ReturnInstead<typeof prototype.on, this>;
        public once!: ReturnInstead<typeof prototype.once, this>;
        public prependListener!:
            ReturnInstead<typeof prototype.prependListener, this>;
        public prependOnceListener!:
            ReturnInstead<typeof prototype.prependOnceListener, this>;
        public rawListeners!: typeof prototype.rawListeners;
        public removeAllListeners!:
            ReturnInstead<typeof prototype.removeAllListeners, this>;
        public removeListener!:
            ReturnInstead<typeof prototype.removeListener, this>;
        public off!: ReturnInstead<typeof prototype.off, this>;
        public setMaxListeners!:
            ReturnInstead<typeof prototype.setMaxListeners, this>;

        constructor(...args: any[]) {
            super(...args);

            // Call the EventEmitter's constructor to apply mix-in fields.
            $EventEmitter.call(this);
        }
    };
}
