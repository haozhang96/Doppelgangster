// Import internal components.
import { database } from "../database";
import { Endpoint } from "../endpoint";
import { GatekeeperSession } from "../entities/gatekeeper_session";
import { clientRootDirectory } from "../paths";
import { dropConnection } from "../utilities";

// Import external libraries.
import { obfuscate } from "javascript-obfuscator";

// Import built-in libraries.
import * as $FileSystem from "fs";
import * as $HTTP from "http";
// import * as $OS from "os";
import * as $Path from "path";

// Define configurations.
const configurations = {
    debugAlert: !!process.env.JS_DEBUG_ALERT || true,
    forceRecompilation: !!process.env.JS_FORCE_RECOMPILE || false,
    obfuscate: !!process.env.JS_OBFUSCATE,
};

// Define the default JavaScript obfuscator options.
const defaultObfuscatorOptions: any = {
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

// TODO
// const hostname: string = $OS.hostname();

// TODO
/*const refererRegex: RegExp =
    new RegExp(`^https?://${hostname}/([0-9a-f]{64})$`, "i");*/

// Construct a response to handle requests made via Chrome's Lite mode, which is
//   unsupported.
const chromeLiteModeResponse: string =
    "window.onload = function () { "
    + "document.getElementById(\"content\").innerHTML = "
    + "\"<div class=\\\"primary\\\">Disable Chrome's Lite mode.<\/div>"
    + "<a class=\\\"secondary\\\" href="
    + "\\\"https:\\\/\\\/support.google.com\\\/chrome\\\/answer\\\/2392284\\\">"
    + "Find out how<\/a>\"; "
    + "}";

// Construct the main JavaScript source code to serve.
const source: string = $FileSystem.readFileSync(
    $Path.resolve(clientRootDirectory, "js", "include.js"),
).toString();

export default class extends Endpoint {
    public mimeType = "text/javascript";
    protected url = "/js/include.js";

    public async handle(
        request: $HTTP.IncomingMessage,
        response: $HTTP.ServerResponse,
    ): Promise<void> {
        console.log("Host:", request.headers.host);
        console.log("Referer:", request.headers.referer);

        // Attempt to match the required referer URL format.
        const refererMatch: RegExpMatchArray | null =
            (request.headers.referer || "").match(
                new RegExp(`^https?://${request.headers.host}/([0-9a-f]{64})$`),
            );

        // Make sure that the referer URL matches the required format.
        if (!refererMatch) {
            return dropConnection(request, response);
        }

        // Check if the request was made via Chrome Lite mode.
        if (
            request.headers.via === "1.1 Chrome-Compression-Proxy"
            && request.headers["save-data"] === "on"
            && (request.headers.forwarded || "").includes(
                request.headers["x-forwarded-for"] as string || "_",
            )
        ) {
            return response.end(chromeLiteModeResponse);
        }

        // Make sure that the session is valid in the database.
        if (!await database.manager.count(
            GatekeeperSession,
            { sessionID: refererMatch.slice(1)[0] },
        )) {
            return dropConnection(request, response);
        }

        // Make sure that the client does not use cached responses.
        response.setHeader(
            "Cache-Control",
            "no-cache, max-age=0, must-revalidate, no-store, no-transform",
        );

        // Return the obfuscated response if needed.
        if (configurations.obfuscate) {
            // TODO: Check IE7 (doesn't like self-defense)
            response.end(
                obfuscate(source, defaultObfuscatorOptions).getObfuscatedCode(),
            );
        } else {
            response.end(source);
        }
    }
}
