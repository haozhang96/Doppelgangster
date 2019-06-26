// Import external libraries.
import JavaScriptObfuscator from "javascript-obfuscator";
import * as $Request from "request";

// Import built-in libraries.
import * as $HTTP from "http";

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
const loopbackIPAddresses: string[] = ["127.0.0.1", "::1", "::ffff:127.0.0.1"];

/**
 * Immediately drop an active connection with a 403 status code.
 * @param request 
 * @param response 
 */
export function dropConnection(
    request: $HTTP.IncomingMessage,
    response: $HTTP.ServerResponse,
): void {
    console.log("Dropping connection from " + getRequestIPAddress(request));
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
 * Encode an input string with a key using the XOR cipher.
 * This is absolutely NOT meant to be secure!
 * @param input 
 * @param key 
 */
export function xorCipher(input: string, key: string): string {
    const inputLength: number = input.length;
    const keyLength: number = key.length;
    const output: string[] = [];

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
