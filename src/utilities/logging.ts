import * as $Tracer from "tracer";

// Create a console logger.
const Logger: $Tracer.Tracer.Logger = $Tracer.colorConsole({
    dateformat: "mm/dd HH:MM:ss.l",
    // format: "[{{timestamp}}][{{title}}][{{file}}] {{message}}",
    format: [
        "[{{timestamp}}][{{title}}][{{file}}] {{message}}",
        {
            error: "[{{timestamp}}][{{title}}][{{file}}][{{line}}:{{pos}}][{{method}}] {{message}}\n{{stack}}",
        },
    ],

    preprocess: (data: $Tracer.Tracer.LogOutput) => {
        data.title = data.title.toUpperCase().padStart(5);

        const file: string = data.file.replace(/\.js$/, "");
        data.file =
            file.length > 20 ? file.slice(0, 19) + "…" : file.padStart(20);
    },
});

// Expose components.
export const Logging = {
    debug: Logger.debug,
    error: Logger.error,
    fatal: Logger.fatal,
    info: Logger.info,
    log: Logger.log,
    trace: Logger.trace,
    warn: Logger.warn,
};
