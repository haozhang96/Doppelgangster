"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const javascript_obfuscator_1 = tslib_1.__importDefault(require("javascript-obfuscator"));
const FileSystem = tslib_1.__importStar(require("fs"));
const HTTP = tslib_1.__importStar(require("http"));
const Path = tslib_1.__importStar(require("path"));
const URL = tslib_1.__importStar(require("url"));
const javascriptObfuscatorOptions = {
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
    selfDefending: true,
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
const rootDirectory = Path.resolve(__dirname, "..");
const mainHTML = FileSystem.readFileSync(Path.resolve(rootDirectory, "templates", "index.html")).toString().replace("{% RECAPTCHA_SITE_KEY %}", process.env.RECAPTCHA_SITE_KEY || "");
const mimeTypes = {
    css: "text/css",
    html: "text/html",
    js: "text/javascript",
};
function getMainScript() {
    const code = FileSystem.readFileSync(Path.resolve(__dirname, "include.js")).toString();
    if (!process.env.OBFUSCATE_JAVASCRIPT) {
        return code;
    }
    return javascript_obfuscator_1.default.obfuscate(code, javascriptObfuscatorOptions).getObfuscatedCode();
}
HTTP.createServer(async (request, response) => {
    const path = Path.resolve(rootDirectory, (URL.parse(request.url || "").pathname || "").slice(1));
    if (path !== rootDirectory && (!new RegExp(`^${rootDirectory}/(js|css)/\\w+\\.\\w+$`, "i").test(path)
        || path === __filename
        || !FileSystem.existsSync(path))) {
        console.error("Not allowed:", path);
        response.statusCode = 404;
        return response.end();
    }
    try {
        response.setHeader("Content-Type", mimeTypes[Path.extname(path).slice(1)] || mimeTypes.html);
        if (path === rootDirectory) {
            return response.end(mainHTML);
        }
        else if (path === Path.resolve(__dirname, "include.js")) {
            return response.end(getMainScript());
        }
        else {
            return response.end(FileSystem.readFileSync(path), "binary");
        }
    }
    catch (error) {
        console.error(error);
        response.statusCode = 403;
        return response.end();
    }
}).listen(process.env.SERVER_PORT || 80);
//# sourceMappingURL=app.js.map