// Import internal components.
import { LoggingController } from "@/core/base/controllers";
import { PathUtils } from "@/utilities";

// Import built-in libraries.
import * as $FileSystem from "fs";
import * as $Path from "path";

// Import configurations.
import * as Configs from "?/controllers/logging/file";
import { Doppelgangster } from "@/core";

/**
 * TODO
 */
export class FileLoggingController extends LoggingController {
    private readonly _file: $FileSystem.WriteStream;

    /**
     * Construct a FileLoggingController instance.
     * @param doppelgangster A Doppelgangster instance to attach to
     */
    constructor(doppelgangster: Doppelgangster) {
        super(doppelgangster);

        // Build the log folder's path.
        const logFolderPath: string = $Path.resolve(
            PathUtils.getProjectRoot(),
            "..", // root/dist/.. --> root
            Configs.loggingDirectory,
        );

        // Make sure that the log folder exists.
        if (!$FileSystem.existsSync(logFolderPath)) {
            $FileSystem.mkdirSync(logFolderPath);
        }

        // Create a log file to write to.
        this._file = $FileSystem.createWriteStream(
            $Path.resolve(
                logFolderPath,
                new Date().toJSON().replace(/:/g, "-") + ".log",
            ),
            { flags: "a" },
        );
    }

    public debug(...args: any[]) {
        this._log("debug", ...args);
    }

    /**
     * Destroy the ConsoleLoggingController instance.
     */
    public destroy(): void {
        return;
    }

    public error(...args: any[]) {
        this._log("error", ...args);
    }

    public fatal(...args: any[]) {
        this._log("fatal", ...args);
    }

    public info(...args: any[]) {
        this._log("info", ...args);
    }

    public log(...args: any[]) {
        this._log("log", ...args);
    }

    public trace(...args: any[]) {
        this._log("trace", ...args);
    }

    public warn(...args: any[]) {
        this._log("warn", ...args);
    }

    private _log(type: string, ...args: any[]): void {
        this._file.write(
            `[${
                new Date().toJSON()
            }][${
                type.toUpperCase().padEnd(5)
            }] ${
                args.join(" ")
            }\n`,
        );
    }
}
