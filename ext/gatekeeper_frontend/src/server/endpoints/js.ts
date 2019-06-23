// Import internal components.
import { getIPAPIData, getIPHubData, isTorExitNode } from "../data";
import { database } from "../database";
import { Endpoint } from "../endpoint";
import { GatekeeperSession } from "../entities/gatekeeper_session";
import { obfuscateJavaScript } from "../obfuscator";
import { clientUncompiledRootDirectory } from "../paths";
import { dropConnection, xorEncode } from "../utilities";

// Import built-in libraries.
import * as $FileSystem from "fs";
import * as $HTTP from "http";
// import * as $OS from "os";
import * as $Path from "path";

// Define configurations.
const configurations = {
    debugAlert: !!process.env.JS_DEBUG_ALERT || true,
    forceRecompilation: !!process.env.JS_FORCE_RECOMPILE || false,
    obfuscate: !!process.env.JS_OBFUSCATE || true,
};

// Define the list of libraries located in /src/client/js/libs to concatenate
//   with the main script.
const libraryFileNames: string[] = [
    "polyfills.js",
    "platform.js",
    "webrtcips.js",
    "fingerprintjs2.js",
];

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

/**
 * Generate the main include script to be served for the given request.
 * @param request 
 * @param sessionID 
 */
async function generateScript(
    request: $HTTP.IncomingMessage,
    sessionID: string,
): Promise<string> {
    // Construct the paths to the necessary files.
    const jsPath: string = $Path.resolve(clientUncompiledRootDirectory, "js");
    const inputPath: string = $Path.resolve(jsPath, "fingerprint.js");
    const outputPath: string = $Path.resolve(jsPath, "include.js");

    // Prepare to generate the output script to be served.
    let output: string;

    // Check if the script has already been generated and hasn't been updated.
    if (
        $FileSystem.existsSync(outputPath)
        && (
            $FileSystem.statSync(outputPath).mtime
            > $FileSystem.statSync(inputPath).mtime
        )
    ) {
        output = $FileSystem.readFileSync(outputPath).toString();
    } else {
        // Read all the library files.
        const libraries: string[] = libraryFileNames.map((file) =>
            $FileSystem.readFileSync(
                $Path.resolve(jsPath, "libs", file),
            ).toString(),
        );

        // Concatenate the libraries and the main script into the output.
        output =
            "window.onload = function () {\n"
            + libraries.join("\n")
            + $FileSystem.readFileSync(inputPath).toString()
            + "\n};";

        // Obfuscate the output if required.
        if (configurations.obfuscate) {
            const obfuscatorOptions = { selfDefending: true };

            // Disable self-defense if the user's browser is IE < 7.
            const ieUserAgentMatch: RegExpMatchArray | null =
                (request.headers["user-agent"] || "").match(
                    /^Mozilla\/\d\.\d+ \(.+; MSIE (\d\.\d+)/,
                );
            if (ieUserAgentMatch && parseInt(ieUserAgentMatch[1], 10) < 7) {
                obfuscatorOptions.selfDefending = false;
            }

            // Obfuscate the output.
            output = obfuscateJavaScript(output, obfuscatorOptions);

            // Save the obfuscated output to re-serve later.
            $FileSystem.writeFileSync(outputPath, output);
        }
    }

    // See https://stackoverflow.com/a/19524949/8060864.
    const ipAddress: string =
        (request.headers["x-forwarded-for"] as string || "").split(",").pop()
        || request.connection.remoteAddress
        || request.socket.remoteAddress
        || "";

    // Generate the user data to be sent with the output.
    const userData = {
        doNotTrack: request.headers.dnt === "1",
        headers: request.headers,
        id: sessionID,
        ip: ipAddress,
        ipHub: await getIPHubData(ipAddress),
        ipapi: await getIPAPIData(ipAddress),
        isTorExitNode: await isTorExitNode(ipAddress),
    };

    // Return the encoded user data concatenated with the script to be served.
    return (
        `var data = "${
            atob(xorEncode(
                JSON.stringify(userData),
                sessionID.split("").reverse().join(""), // :^)
            ))
        }";\n${
            output
        }`
    );
}

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

        // Retrieve the session ID from the referer header.
        const sessionID: string = refererMatch[1];

        // Make sure that the session is valid in the database.
        if (!await database.count(GatekeeperSession, { sessionID })) {
            return dropConnection(request, response);
        }

        // Make sure that the client does not use cached responses.
        response.setHeader(
            "Cache-Control",
            "no-cache, max-age=0, must-revalidate, no-store, no-transform",
        );

        // Return the JavaScript based on server configurations.
        response.end(await generateScript(request, sessionID));
    }
}
