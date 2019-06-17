// Import internal components.
import { Endpoint } from "../endpoint";
import { clientRootDirectory } from "../paths";

// Import built-in libraries.
import * as $FileSystem from "fs";
import * as $HTTP from "http";
import * as $Path from "path";

// Construct the main CSS source code to serve.
export const source: string = $FileSystem.readFileSync(
    $Path.resolve(clientRootDirectory, "css", "styles.css"),
).toString();

export default class extends Endpoint {
    public mimeType = "text/css";
    protected _url = "/css/styles.css";

    public async handle(
        _request: $HTTP.IncomingMessage,
        response: $HTTP.ServerResponse,
    ): Promise<void> {
        response.write(source);
    }
}
