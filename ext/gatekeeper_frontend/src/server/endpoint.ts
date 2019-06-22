// Import internal components.
import { serverRootDirectory } from "./paths";

// Import built-in libraries.
import * as $FileSystem from "fs";
import * as $HTTP from "http";
import * as $Path from "path";

/**
 * TODO
 */
export abstract class Endpoint {
    public readonly method: string = "GET";
    public readonly mimeType: string = "text/plain";
    protected abstract readonly url: string | RegExp;

    public canHandle(request: $HTTP.IncomingMessage): boolean {
        return (
            this.url instanceof RegExp ?
                this.url.test(request.url || "")
            :
                request.url === this.url
        );
    }

    public abstract async handle(
        request: $HTTP.IncomingMessage,
        response: $HTTP.ServerResponse,
    ): Promise<void>;
}

/**
 * Return all the endpoint classes in /src/server/endpoints.
 */
export function getEndpoints(): Endpoint[] {
    const endpointsDirectory: string =
        $Path.resolve(serverRootDirectory, "endpoints");

    return $FileSystem.readdirSync(endpointsDirectory).filter((file) =>
        file.endsWith(".js"),
    ).map((file) =>
        new (require($Path.resolve(endpointsDirectory, file)).default)(),
    );
}
