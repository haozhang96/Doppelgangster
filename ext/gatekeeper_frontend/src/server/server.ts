// Enable support for TypeORM decorators.
import "reflect-metadata";

// Initialize the database.
import "./database";

// Import internal components.
import { Endpoint, getEndpoints } from "./endpoint";

// Import built-in libraries.
import * as $HTTP from "http";

// Display runtime environment version information.
console.log(`Runtime environment: Node.js v${
    process.version.slice(1)
}, MongoDB v${
    // tslint:disable-next-line: no-var-requires
    require("../../package.json").dependencies.mongodb.replace("^", "")
}`);

// Enumerate all the available endpoints in /src/server/endpoints.
const endpoints: readonly Endpoint[] = getEndpoints();

// Create the server and listen on the port set in the environment variable.
$HTTP.createServer((request, response) => {
    try {
        // Find an endpoint that could handle the request.
        for (const endpoint of endpoints) {
            if (
                (request.method || "") === endpoint.method.toUpperCase()
                && endpoint.canHandle(request)
            ) {
                response.setHeader("Content-Type", endpoint.mimeType);
                return endpoint.handle(request, response);
            }
        }

        // At this point, none of the endpoints could handle the request.
        response.statusCode = 404;
    } catch (_) {
        response.statusCode = 500;
    }
    response.end();
}).listen(
    process.env.SERVER_PORT || 80,
);
