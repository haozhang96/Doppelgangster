// Import external libraries.
import JavaScriptObfuscator from "javascript-obfuscator";

// Import built-in libraries.
import * as FileSystem from "fs";
import * as HTTP from "http";
import * as Path from "path";
import * as URL from "url";

// Define JavaScript obfuscator options.
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

// Keep a reference to the project root directory.
const rootDirectory: string = Path.resolve(__dirname, "..");

// Construct the main HTML source code to serve.
const mainHTML: string =
    FileSystem.readFileSync(
        Path.resolve(rootDirectory, "templates", "index.html"),
    ).toString().replace(
        "{% RECAPTCHA_SITE_KEY %}",
        process.env.RECAPTCHA_SITE_KEY || "",
    );

// Define a list of MIME types of possibly served files.
const mimeTypes: { readonly [type: string]: string; } = {
    css: "text/css",
    html: "text/html",
    js: "text/javascript",
};

function getMainScript(): string {
    const code: string = FileSystem.readFileSync(
        Path.resolve(__dirname, "include.js"),
    ).toString();

    if (!process.env.OBFUSCATE_JAVASCRIPT) {
        return code;
    }

    return JavaScriptObfuscator.obfuscate(
        code,
        javascriptObfuscatorOptions as any,
    ).getObfuscatedCode();
}

// Create the server and listen on the port set in the environment variable.
HTTP.createServer(async (request, response) => {
    // Resolve the request URL to an absolute path.
    const path: string = Path.resolve(
        rootDirectory,
        (URL.parse(request.url || "").pathname || "").slice(1),
    );

    // If the resolved path doesn't point to js/*.* or css/*.*, or if the file
    //   doesn't exist, then the request is invalid.
    if (
        path !== rootDirectory && (
            !new RegExp(`^${
                rootDirectory
            }/(js|css)/\\w+\\.\\w+$`, "i").test(path)
            || path === __filename // :^)
            || !FileSystem.existsSync(path)
        )
    ) {
        console.error("Not allowed:", path);
        response.statusCode = 404;
        return response.end();
    }

    try {
        // Set the appropriate response header depending on the file type.
        response.setHeader(
            "Content-Type",
            mimeTypes[Path.extname(path).slice(1)] || mimeTypes.html,
        );

        // Reply to the response.
        if (path === rootDirectory) {
            // Return the main webpage.
            return response.end(mainHTML);
        } else if (path === Path.resolve(__dirname, "include.js")) {
            // Return the main script.
            return response.end(getMainScript());
        } else {
            // Return all other files.
            return response.end(FileSystem.readFileSync(path), "binary");
        }
    } catch (error) {
        console.error(error);
        response.statusCode = 403;
        return response.end();
    }
}).listen(process.env.SERVER_PORT || 80);
