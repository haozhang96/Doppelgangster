// Import internal components.
import { ILogger } from "@/common/interfaces";
import {
    Controller, ControllerConstructor,
} from "@/core/base/controllers/controller";
import { Doppelgangster } from "@/core/doppelgangster";

/**
 * TODO
 */
export abstract class LoggingController extends Controller {
    constructor(doppelgangster: Doppelgangster) {
        super(doppelgangster);

        doppelgangster.registerLogger(this as unknown as ILogger);
    }

    // @Override
    public abstract debug(...args: any[]): void;
    public abstract error(...args: any[]): void;
    public abstract fatal(...args: any[]): void;
    public abstract info(...args: any[]): void;
    public abstract log(...args: any[]): void;
    public abstract trace(...args: any[]): void;
    public abstract warn(...args: any[]): void;
}

/**
 * Define the LoggingController's constructor type with the abstract property
 *   removed.
 */
export type LoggingControllerConstructor =
    ControllerConstructor<typeof LoggingController, LoggingController>;
