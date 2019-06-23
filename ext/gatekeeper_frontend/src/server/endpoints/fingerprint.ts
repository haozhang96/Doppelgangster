// Import internal components.
import { Endpoint } from "../endpoint";
import { dropConnection } from "../utilities";

// Import built-in libraries.
import * as $HTTP from "http";

// Define configurations.
const configurations = {
    maxCount: parseInt(process.env.FINGERPRINT_MAX_COUNT || "10", 10),
    maxSize: parseInt(process.env.FINGERPRINT_MAX_SIZE || "16384", 10),
};

export default class extends Endpoint {
    public method = "POST";
    protected url = "/verify";

    public async handle(
        request: $HTTP.IncomingMessage,
        response: $HTTP.ServerResponse,
    ): Promise<void> {
        console.log("Host:", request.headers.host);
        console.log("Referer:", request.headers.referer);

        // Attempt to match the required referer URL format.
        const refererMatch: RegExpMatchArray | null =
            (request.headers.referer || "").match(
                new RegExp(`^https?://${request.headers.host}/([0-9a-f]{64})$`),
            );

        // Make sure that the referer URL matches the required format.
        if (!refererMatch) {
            return dropConnection(request, response);
        }

        // Retrieve the SHA-256 session ID from the referer URL.
        const sessionID: string = refererMatch.slice(1)[0];

        const chunks: Uint8Array[] = [];
        request.on("data", (chunk) => {
            // TODO: Check max fingerprint count
            

            // Drop the connection if the data being sent is larger than the
            //   maximum allowed size.
            if (request.socket.bytesRead > configurations.maxCount) {
                return dropConnection(request, response);
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
