import * as $HTTP from "http";

export function dropConnection(
    request: $HTTP.IncomingMessage,
    response: $HTTP.ServerResponse,
): void {
    response.statusCode = 403;
    response.end();
    request.destroy();
}
