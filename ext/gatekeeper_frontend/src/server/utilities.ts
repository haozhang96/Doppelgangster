// Import external libraries.
import JavaScriptObfuscator from "javascript-obfuscator";

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

/**
 * Immediately drop an active connection with a 403 status code.
 * @param request 
 * @param response 
 */
export function dropConnection(
    request: $HTTP.IncomingMessage,
    response: $HTTP.ServerResponse,
): void {
    response.statusCode = 403;
    response.end();
    request.destroy();
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
export function xorEncode(input: string, key: string): string {
    const inputLength: number = input.length;
    const keyLength: number = key.length;
    const output: string[] = [];

    for (let i = 0; i < inputLength; i++) {
        output.push(
            String.fromCharCode(
                // tslint:disable-next-line: no-bitwise
                input.charCodeAt(i) ^ key[i % keyLength].charCodeAt(0),
            ),
        );
    }

    return output.join("");
}
