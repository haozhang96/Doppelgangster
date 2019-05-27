// Import internal components.
import { Callback } from "@/common/types";

export interface ILogger {
    readonly debug: Callback;
    readonly error: Callback;
    readonly fatal: Callback;
    readonly info: Callback;
    readonly log: Callback;
    readonly trace: Callback;
    readonly warn: Callback;
}
