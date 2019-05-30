// Import internal components.
import { Callback } from "@/common/types";
import { IMappedObject } from ".";

export interface ILogger extends IMappedObject<Callback> {
    debug: Callback;
    error: Callback;
    fatal: Callback;
    info: Callback;
    log: Callback;
    trace: Callback;
    warn: Callback;
}
