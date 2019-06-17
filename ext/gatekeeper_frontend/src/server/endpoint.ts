// Import internal components.
import { serverRootDirectory } from "./paths";

// Import built-in libraries.
import * as $FileSystem from "fs";
import * as $HTTP from "http";
import * as $Path from "path";

/**
 * STUB
 */
export abstract class Endpoint {
    public readonly method: string = "GET";
    public readonly mimeType: string = "text/plain";
    protected abstract readonly _url: string;

    public abstract async handle(
        request: $HTTP.IncomingMessage,
        response: $HTTP.ServerResponse,
    ): Promise<void>;

    public canHandle(path: string): boolean {
        return this._url ? path === this._url : false;
    }
}

/**
 * STUB
 */
export function getEndpoints(): Endpoint[] {
    const endpointsDirectory: string =
        $Path.resolve(serverRootDirectory, "endpoints");

    return $FileSystem.readdirSync(endpointsDirectory).map((file) =>
        $Path.resolve(endpointsDirectory, file),
    ).map((file) =>
        new (require(file).default)(),
    );
}
