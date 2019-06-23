// Import internal components.
// import { models } from "./database";
import { Endpoint, getEndpoints } from "./endpoint";

// Import built-in libraries.
import * as $HTTP from "http";

// Enumerate all the defined endpoints.
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
        response.statusCode = 403;
    }
    response.end();
}).listen(
    process.env.SERVER_PORT || 80,
);

// console.log("Database models:", models);
