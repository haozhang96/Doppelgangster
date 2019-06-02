// Import internal components.
import {
    Controller, ControllerConstructor,
} from "@/core/base/controllers/controller";

/**
 * TODO
 */
export abstract class LoggingController extends Controller {
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
