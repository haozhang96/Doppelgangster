// Import internal components.
import { ILogger } from "@/common/interfaces";
import { Doppelgangster } from "@/core";
import { LoggingController } from "@/core/base/controllers";
import { Logging } from "@/utilities";

// Import external libraries.
import * as $Tracer from "tracer";

/**
 * TODO
 */
export class ConsoleLoggingController extends LoggingController {
    public readonly debug = Tracer.debug;
    public readonly error = Tracer.error;
    public readonly fatal = Tracer.fatal;
    public readonly info = Tracer.info;
    public readonly log = Tracer.log;
    public readonly trace = Tracer.trace;
    public readonly warn = Tracer.warn;

    constructor(doppelgangster: Doppelgangster) {
        super(doppelgangster);

        // Replace the default logger early.
        Logging.setLogger(this as unknown as ILogger);
    }

    /**
     * Destroy the ConsoleLoggingController instance.
     */
    public destroy(): void {
        return;
    }
}

// Create a Tracer logger.
const Tracer: $Tracer.Tracer.Logger = $Tracer.colorConsole({
    dateformat: "mm/dd HH:MM:ss.l",
    format: [
        "[{{timestamp}}][{{title}}][{{file}}] {{message}}",
        {
            error: (
                "[{{timestamp}}][{{title}}][{{file}}][{{method}}:{{line}}:"
                + "{{pos}}] {{message}}\n{{stack}}"
            ),
        },
    ],
    stackIndex: 3,

    preprocess: (data: $Tracer.Tracer.LogOutput) => {
        data.title = data.title.toUpperCase().padStart(5);

        const file: string = data.file.replace(/\.js$/, "");
        data.file =
            file.length > 25 ? file.slice(0, 24) + "…" : file.padStart(25);
    },
});
