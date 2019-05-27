// Import internal components.
import { Controller, ControllerConstructor } from "@/core/base/controllers";
import { Doppelgangster } from "@/core/doppelgangster";
import { Logging } from "@/utilities";

/**
 * STUB
 */
export abstract class LoggingController extends Controller {
    /**
     * Construct a LoggingController instance.
     * @param doppelgangster A Doppelgangster instance to attach to
     */
    constructor(doppelgangster: Doppelgangster) {
        super(doppelgangster);

        // Override the global logger in utilities.
        Logging.setLogger(this);
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
 * Define the logging controller's constructor type with the abstract property
 *   removed.
 */
export type LoggingControllerConstructor =
    ControllerConstructor<typeof LoggingController, LoggingController>;
