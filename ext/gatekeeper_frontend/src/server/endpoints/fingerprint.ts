// Import internal components.
import { Endpoint } from "../endpoint";

// Import built-in libraries.
import * as $HTTP from "http";

export default class extends Endpoint {
    public method = "POST";
    protected url = "/verify";

    public async handle(
        request: $HTTP.IncomingMessage,
        response: $HTTP.ServerResponse,
    ): Promise<void> {
        const chunks: Uint8Array[] = [];

        request.on("data", (chunk) => chunks.push(chunk)).on("end", () => {
            const data: string = Buffer.concat(chunks).toString();

            // Drop fingerprint data that are larger than the maximum allowed
            //   size.
            if (data.length > 16 * 1024) {
                return;
            }

            // TODO: Check max fingerprint count

            // Add the fingerprint to the database.
            try {
                const fingerprint = JSON.parse(data);
                response.end(fingerprint.toString());
            } catch (error) {
                console.error("Fingerprint error:", error);
            }
        });
    }
}
