// Import internal components.
import { Endpoint } from "../endpoint";
import { clientUncompiledRootDirectory } from "../paths";
import { dropConnection, getRequestSessionID } from "../utilities";

// Import built-in libraries.
import * as $FileSystem from "fs";
import * as $HTTP from "http";
import * as $Path from "path";

// Construct the main CSS source code to serve.
const source: string = $FileSystem.readFileSync(
    $Path.resolve(clientUncompiledRootDirectory, "css", "styles.css"),
).toString();

export default class extends Endpoint {
    public mimeType = "text/css";
    protected url = "/css/styles.css";

    public async handle(
        request: $HTTP.IncomingMessage,
        response: $HTTP.ServerResponse,
    ): Promise<void> {
        // Make sure that the request has a valid session ID.
        if (!getRequestSessionID(request)) {
            return dropConnection(request, response);
        }

        response.end(source);
    }
}
