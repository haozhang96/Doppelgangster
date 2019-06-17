// Import external libraries.
import JavaScriptObfuscator from "javascript-obfuscator";

// Define JavaScript obfuscator options.
const defaultOptions = {
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
 * TODO
 * @param code 
 * @param options 
 */
export function obfuscateJavaScript(code: string, options?: object): string {
    return JavaScriptObfuscator.obfuscate(
        code,
        Object.assign(Object.assign({}, defaultOptions), options),
    ).getObfuscatedCode();
}
