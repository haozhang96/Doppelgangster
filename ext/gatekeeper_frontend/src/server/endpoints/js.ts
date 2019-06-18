// Import internal components.
import { Endpoint } from "../endpoint";
import { clientRootDirectory } from "../paths";

// Import external libraries.
import { obfuscate } from "javascript-obfuscator";

// Import built-in libraries.
import * as $FileSystem from "fs";
import * as $HTTP from "http";
import * as $Path from "path";

// Define JavaScript obfuscator options.
const obfuscatorOptions: any = {
    compact: true,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 0.75,
    deadCodeInjection: true,
    deadCodeInjectionThreshold: 0.4,
    debugProtection: true,
    debugProtectionInterval: true,
    disableConsoleOutput: true,
    domainLock: ["localhost"],
    identifierNamesGenerator: "mangled",
    identifiersPrefix: "",
    log: false,
    renameGlobals: true,
    reservedNames: [],
    rotateStringArray: true,
    seed: 0,
    selfDefending: true, // IE 5.5
    sourceMap: false,
    sourceMapBaseUrl: "",
    sourceMapFileName: "",
    sourceMapMode: "separate",
    stringArray: true,
    stringArrayEncoding: "rc4",
    stringArrayThreshold: 0.8,
    target: "browser",
    transformObjectKeys: false,
    unicodeEscapeSequence: false,
};

// Construct the main JavaScript source code to serve.
const source: string = $FileSystem.readFileSync(
    $Path.resolve(clientRootDirectory, "js", "include.js"),
).toString();

export default class extends Endpoint {
    public mimeType = "text/javascript";
    protected url = "/js/include.js";

    public async handle(
        _request: $HTTP.IncomingMessage,
        response: $HTTP.ServerResponse,
    ): Promise<void> {
        if (process.env.OBFUSCATE_JAVASCRIPT) {
            response.end(
                obfuscate(source, obfuscatorOptions).getObfuscatedCode(),
            );
        } else {
            response.end(source);
        }
    }
}
