import * as $HTTP from "http";

/**
 * Immediately drop an active connection with a 403 status code.
 * @param request 
 * @param response 
 */
export function dropConnection(
    request: $HTTP.IncomingMessage,
    response: $HTTP.ServerResponse,
): void {
    response.statusCode = 403;
    response.end();
    request.destroy();
}
