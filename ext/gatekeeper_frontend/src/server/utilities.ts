// Import external libraries.
import JavaScriptObfuscator from "javascript-obfuscator";
import * as $Request from "request";

// Import built-in libraries.
import * as $HTTP from "http";
import * as $OS from "os";

// Define the default JavaScript obfuscator options.
const defaultJavaScriptObfuscatorOptions: any = {
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

// Keep a list of loopback (localhost) IP addresses.
const loopbackIPAddresses: string[] =
    ["localhost", "127.0.0.1", "::1", "::ffff:127.0.0.1"];

// Keep an indicator of whether the server is running locally.
const serverIsLocalHost: boolean =
    parseEnvironmentVariable("SERVER_ISLOCALHOST", false);

// Construct the server's hostname depending on whether it is running locally.
const serverHostname: string = serverIsLocalHost ? "localhost" : $OS.hostname();

// Construct a regular expression object to extract session IDs out of HTTP
//   request referrers
const referrerRegex: RegExp =
    new RegExp(`^https?://${
        serverIsLocalHost ?
            `(?:${loopbackIPAddresses.map((ipAddress) =>
                ipAddress.replace(/\./g, "\\."),
            ).join("|")})`
        :
            serverHostname
    }/([0-9a-f]{64})$`, "i");

/**
 * Decode a base64-XOR-JSON-encoded string with a key.
 * @param encoded The encoded string to decode
 * @param key The key to decode the encoded string with
 */
export function base64XORJSONDecode(encoded: string, key: string): any {
    return JSON.parse(xorCipher(
        Buffer.from(encoded, "base64").toString(),
        key,
    ));
}

/**
 * Encode an object into a string using the base64-XOR-JSON encoding with a key.
 * @param object The object to encode
 * @param key The key to encode the object with
 */
export function base64XORJSONEncode(object: any, key: string): string {
    return Buffer.from(
        xorCipher(JSON.stringify(object), key),
        "binary",
    ).toString("base64");
}

/**
 * Immediately drop an active connection with a 403 status code.
 * @param request The HTTP request to drop
 * @param response The response object attached to the given HTTP request
 */
export async function dropConnection(
    request: $HTTP.IncomingMessage,
    response: $HTTP.ServerResponse,
    reason?: string,
): Promise<void> {
    if (reason) {
        console.log(
            `Dropping connection from ${
                await getRequestIPAddress(request)
            }: ${
                reason
            }`,
        );
    }
    response.statusCode = 403;
    response.end();
    request.destroy();
}

/**
 * Return the IP address of a HTTP request.
 * See https://stackoverflow.com/a/19524949/8060864.
 * @param request The HTTP request to retrieve the IP address of
 */
export async function getRequestIPAddress(
    request: $HTTP.IncomingMessage,
): Promise<string> {
    const ipAddress: string = request.connection.remoteAddress || "";

    if (loopbackIPAddresses.includes(ipAddress)) {
        // For local machine requests, try to resolve the external IP address.
        return getExternalIPAddress();
    } else {
        return (
            (request.headers["x-forwarded-for"] as string).split(",").pop()
            || request.socket.remoteAddress
            || ipAddress
        );
    }
}

/**
 * Return the session ID of a HTTP request.
 * @param request The HTTP request to retrieve the session ID of
 */
export function getRequestSessionID(
    request: $HTTP.IncomingMessage,
): string | undefined {
    if (!serverIsLocalHost && request.headers.host !== serverHostname) {
        console.log("Host mismatch:", request.headers.host, serverHostname);
        return;
    }

    const referrerMatch: RegExpMatchArray | null =
        (request.headers.referer || "").match(referrerRegex);
    // console.debug("Regex:", referrerRegex);
    // console.debug("Referrer match:", referrerMatch);
    return referrerMatch ? referrerMatch[1] : undefined;
}

/**
 * Return the external IP address of this server.
 */
export async function getExternalIPAddress(): Promise<string> {
    const apiEndpoints: string[] = [
        "https://api.ipify.org",
        "https://ipv4.icanhazip.com",
        "https://ip4.seeip.org",
        "https://ipv4bot.whatismyipaddress.com",
    ];

    while (apiEndpoints.length) {
        try {
            return await new Promise((resolve, reject) => {
                $Request.get(
                    apiEndpoints.pop() as string,
                    (error, response) => {
                        // If the API failed to return the external IP, continue
                        //   to the next API.
                        if (error || response.statusCode !== 200) {
                            reject();
                        }

                        resolve(response.body);
                    },
                );
            });
        } finally {
            // No error handling is needed. Just go to the next API.
        }
    }

    // No API was able to get the external IP. Just return the default loopback
    //   address.
    return "127.0.0.1";
}

/**
 * Return the obfuscated JavaScript code using the default obfuscator options
 *   overridden with the provided options.
 * @param code The JavaScript code to obfuscate
 * @param options Additional obfuscator options to override the default options
 *   with
 */
export function obfuscateJavaScript(code: string, options?: object): string {
    return JavaScriptObfuscator.obfuscate(
        code,
        {...defaultJavaScriptObfuscatorOptions, ...options},
    ).getObfuscatedCode();
}

/**
 * Parse (using the JSON parser) a value out of the environment variables.
 * @param name The name of the environment variable to parse
 * @param defaultValue The default value to return if it's missing
 */
export function parseEnvironmentVariable<T>(name: string, defaultValue?: T): T {
    return (
        process.env[name] ?
            JSON.parse(process.env[name] as string)
        :
            defaultValue
    );
}

/**
 * Encode or decode an input string with a key using the XOR cipher.
 * This is absolutely NOT meant to be secure!
 * @param input The input string to encode or decode
 * @param key The key to encode/decode on the input string with
 */
export function xorCipher(input: string, key: string): string {
    const output: string[] = [];
    const inputLength: number = input.length;
    const keyLength: number = key.length;

    for (let i = 0; i < inputLength; i++) {
        output.push(
            String.fromCharCode(
                // tslint:disable-next-line: no-bitwise
                input.charCodeAt(i) ^ key.charCodeAt(i % keyLength),
            ),
        );
    }

    return output.join("");
}
