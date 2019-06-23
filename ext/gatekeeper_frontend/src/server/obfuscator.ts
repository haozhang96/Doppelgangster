// Import external libraries.
import * as $JavaScriptObfuscator from "javascript-obfuscator";

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

/**
 * Return the obfuscated JavaScript code using the default obfuscator options
 *   overridden with the provided options.
 * @param code The JavaScript code to obfuscate
 * @param options Additional obfuscator options to override the default options
 *   with
 */
export function obfuscateJavaScript(code: string, options?: object): string {
    return $JavaScriptObfuscator.obfuscate(
        code,
        {...defaultObfuscatorOptions, ...options},
    ).getObfuscatedCode();
}
