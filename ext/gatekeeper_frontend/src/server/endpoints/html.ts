// Import internal components.
import { Endpoint } from "../endpoint";
import { clientRootDirectory } from "../paths";

// Import built-in libraries.
import * as $FileSystem from "fs";
import * as $HTTP from "http";
import * as $Path from "path";

// Construct the main HTML source code to serve.
export const source: string =
    $FileSystem.readFileSync(
        $Path.resolve(clientRootDirectory, "index.html"),
    ).toString().replace(
        "{% RECAPTCHA_SITE_KEY %}",
        process.env.RECAPTCHA_SITE_KEY || "",
    );

export default class extends Endpoint {
    public mimeType = "text/html";
    protected _url = "/";

    public async handle(
        _request: $HTTP.IncomingMessage,
        response: $HTTP.ServerResponse,
    ): Promise<void> {
        response.write(source);
    }
}
