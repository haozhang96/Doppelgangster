// Import internal components.
import { LoggingController } from "@/core/base/controllers";

// Import external libraries.
import * as $Tracer from "tracer";

/**
 * STUB
 */
export class ConsoleLoggingController extends LoggingController {
    public debug = Tracer.log;
    public error = Tracer.error;
    public fatal = Tracer.fatal;
    public info = Tracer.info;
    public log = Tracer.log;
    public trace = Tracer.trace;
    public warn = Tracer.warn;

    /**
     * Destroy the console logging controller instance.
     */
    public destroy(): void {
        return;
    }
}

// Create a Tracer logger.
const Tracer: $Tracer.Tracer.Logger = $Tracer.colorConsole({
    dateformat: "mm/dd HH:MM:ss.l",
    // format: "[{{timestamp}}][{{title}}][{{file}}] {{message}}",
    format: [
        "[{{timestamp}}][{{title}}][{{file}}] {{message}}",
        {
            error: (
                "[{{timestamp}}][{{title}}][{{file}}][{{line}}:"
                + "{{pos}}][{{method}}] {{message}}\n{{stack}}"
            ),
        },
    ],

    preprocess: (data: $Tracer.Tracer.LogOutput) => {
        data.title = data.title.toUpperCase().padStart(5);

        const file: string = data.file.replace(/\.js$/, "");
        data.file =
            file.length > 20 ? file.slice(0, 19) + "…" : file.padStart(20);
    },
});
