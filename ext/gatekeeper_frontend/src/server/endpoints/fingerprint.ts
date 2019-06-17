// Import internal components.
import { Endpoint } from "../endpoint";

// Import built-in libraries.
import * as $HTTP from "http";

export default class extends Endpoint {
    public method = "POST";
    protected _url = "/verify";

    public async handle(
        request: $HTTP.IncomingMessage,
        response: $HTTP.ServerResponse,
    ): Promise<void> {
        return;
    }
}
