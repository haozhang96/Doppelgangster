// Import internal components.
import { getIPAPIData, getIPHubData, isTorExitNode } from "../data";
import { database } from "../database";
import { Endpoint } from "../endpoint";
import { GatekeeperSession } from "../entities/gatekeeper_session";
import { clientUncompiledRootDirectory } from "../paths";
import {
    dropConnection, getRequestIPAddress, obfuscateJavaScript,
    parseEnvironmentVariable, xorCipher,
} from "../utilities";

// Import built-in libraries.
import * as $FileSystem from "fs";
import * as $HTTP from "http";
// import * as $OS from "os";
import * as $Path from "path";

// Define configurations.
const configurations = {
    debugAlert: parseEnvironmentVariable("JS_DEBUG_ALERT", true),
    forceRecompilation: parseEnvironmentVariable("JS_FORCE_RECOMPILE", false),
    obfuscate: parseEnvironmentVariable("JS_OBFUSCATE", true),
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

// Construct a response to handle invalid requests.
const invalidRequestResponse: string = (
    "window.onload = function () { "
    + "document.getElementById(\"content\").innerHTML = "
    + "\"<div class=\\\"primary\\\">Invalid request.<\/div>\"; }"
);

// Construct a response to handle requests made via Chrome's Lite mode, which is
//   unsupported.
const chromeLiteModeResponse: string = (
    "window.onload = function () { "
    + "document.getElementById(\"content\").innerHTML = "
    + "\"<div class=\\\"primary\\\">Disable Chrome's Lite mode.<\/div>"
    + "<a class=\\\"secondary\\\" href="
    + "\\\"https:\\\/\\\/support.google.com\\\/chrome\\\/answer\\\/2392284\\\">"
    + "Find out how<\/a>\"; "
    + "}"
);

/**
 * Generate the main include script to be served for the given request.
 * @param request An active HTTP incoming message request to serve the script to
 * @param sessionID The session ID of the request
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

    // If the script isn't forced to be recompiled, has already been generated,
    //   and hasn't been updated, then simply serve the old generated file.
    if (
        !configurations.forceRecompilation
        && $FileSystem.existsSync(outputPath)
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
        output = (
            "window.onload = function () {\n"
            + libraries.join("\n")
            + $FileSystem.readFileSync(inputPath).toString()
            + "\n};"
        );

        // Wrap the code in a debug alert if configured.
        if (configurations.debugAlert) {
            output = (
                "try {\n" + output + "\n} catch (error) { "
                + "alert(error.name + \": \" + error.message + "
                + "(error.stack ? \"\\n\\nStack: \" + error.stack : \"\")"
                + "); throw error; }"
            );
        }

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

    // Get the request's IP address.
    const ipAddress: string = await getRequestIPAddress(request);

    // Generate the user data to be sent with the output.
    const userData = {
        doNotTrack: request.headers.dnt === "1",
        headers: request.headers,
        ip: ipAddress,
        ipHub: await getIPHubData(ipAddress),
        ipapi: await getIPAPIData(ipAddress),
        isTorExitNode: await isTorExitNode(ipAddress),
        sessionID,
    };

    // Return the encoded user data concatenated with the script to be served.
    return (
        `var data = "${
            Buffer.from(xorCipher(
                JSON.stringify(userData),
                sessionID.split("").reverse().join(""), // :^)
            ), "binary").toString("base64")
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
        console.log("IP:", await getRequestIPAddress(request));
        console.log("Host:", request.headers.host);
        console.log("Referer:", request.headers.referer);

        // Attempt to match the required referer URL format.
        const refererMatch: RegExpMatchArray | null =
            (request.headers.referer || "").match(
                new RegExp(`^https?://${request.headers.host}/([0-9a-f]{64})$`),
            );

        // Make sure that the referer URL matches the required format.
        if (!refererMatch) {
            return dropConnection(request, response, "Referer mismatch");
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
        /*if (!await database.count(GatekeeperSession, { sessionID })) {
            return dropConnection(request, response, "Invalid session ID");
        }*/

        // Make sure that the client does not use cached responses.
        response.setHeader(
            "Cache-Control",
            "no-cache, max-age=0, must-revalidate, no-store, no-transform",
        );

        // Return the JavaScript based on server configurations.
        response.end(await generateScript(request, sessionID));
    }
}
