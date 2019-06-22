// Import internal components.
import { Endpoint } from "../endpoint";

// Import built-in libraries.
import * as $HTTP from "http";

// Define configurations.
const Configs = {
    maxFingerprintCount: 10,
    maxFingerprintSize: 16 * 1024,
};

export default class extends Endpoint {
    public method = "POST";
    protected url = "/verify";

    public async handle(
        request: $HTTP.IncomingMessage,
        response: $HTTP.ServerResponse,
    ): Promise<void> {
        const chunks: Uint8Array[] = [];

        request.on("data", (chunk) => {
            // TODO: Check max fingerprint count

            // Drop the connection if the data being sent is larger than the
            //   maximum allowed size.
            if (request.socket.bytesRead > Configs.maxFingerprintSize) {
                response.end();
                return request.destroy();
            }

            chunks.push(chunk);
        }).on("end", () => {
            // Add the fingerprint to the database.
            try {
                const fingerprint =
                    JSON.parse(Buffer.concat(chunks).toString());
                response.end(JSON.stringify(fingerprint));
            } catch (error) {
                console.error("Fingerprint error:", error);
            }
        });
    }
}
