// Import internal components.
import { IMappedObject } from "@/common/interfaces/mapped_object";
import { Callback } from "@/common/types";

export interface ILogger extends IMappedObject<Callback> {
    debug: Callback;
    error: Callback;
    fatal: Callback;
    info: Callback;
    log: Callback;
    trace: Callback;
    warn: Callback;
}
