// Import internal components.
import { Endpoint } from "../endpoint";
import { obfuscateJavaScript } from "../obfuscator";
import { clientRootDirectory } from "../paths";

// Import built-in libraries.
import * as $FileSystem from "fs";
import * as $HTTP from "http";
import * as $Path from "path";

// Construct the main JavaScript source code to serve.
export const source: string = $FileSystem.readFileSync(
    $Path.resolve(clientRootDirectory, "js", "include.js"),
).toString();

export default class extends Endpoint {
    public mimeType = "text/javascript";
    protected _url = "/js/include.js";

    public async handle(
        _request: $HTTP.IncomingMessage,
        response: $HTTP.ServerResponse,
    ): Promise<void> {
        response.write(
            process.env.OBFUSCATE_JAVASCRIPT ?
                obfuscateJavaScript(source)
            :
                source,
        );
    }
}
