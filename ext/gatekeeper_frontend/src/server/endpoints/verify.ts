// Import internal components.
import { verifyReCAPTCHA } from "../data";
import { database } from "../database";
import { Endpoint } from "../endpoint";
import { Fingerprint } from "../entities/fingerprint";
import { GatekeeperSession } from "../entities/gatekeeper_session";
import { dropConnection, getRequestIPAddress, xorCipher } from "../utilities";

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
        // Attempt to match the required referer URL format.
        const refererMatch: RegExpMatchArray | null =
            (request.headers.referer || "").match(
                new RegExp(`^https?://${request.headers.host}/([0-9a-f]{64})$`),
            );

        // Make sure that the referer URL matches the required format.
        if (!refererMatch) {
            return dropConnection(request, response, "Referer mismatch");
        }

        // Retrieve the SHA-256 session ID from the referer URL.
        const sessionID: string = refererMatch[1];

        // TODO
        /*const sessions: GatekeeperSession[] =
            await database.find(GatekeeperSession, { sessionID });

        // TODO
        const fingerprints: Fingerprint[] =
            await database.find(Fingerprint, { });

        // Make sure that the session is valid in the database, and that there
        //   is still room to store more fingerprints for the user.
        if (
            sessions.length === 0
            || fingerprints.length === configurations.maxCount
        ) {
            return dropConnection(request, response, "");
        }*/

        const chunks: Uint8Array[] = [];
        request.on("data", (chunk) => {
            // Drop the connection if the data being sent is larger than the
            //   maximum allowed size.
            if (request.socket.bytesRead > configurations.maxSize) {
                return dropConnection(request, response, "Data size overflow");
            }

            chunks.push(chunk);
        }).on("end", async () => {
            try {
                // Reconstruct the data from the encoded POST body.
                const data = JSON.parse(xorCipher(
                    Buffer.from(
                        Buffer.concat(chunks).toString(),
                        "base64",
                    ).toString(),
                    sessionID.split("").reverse().join(""), // :^)
                ));

                // Make sure that the reCAPTCHA response is valid.
                if (
                    data.sessionID !== sessionID
                    || !verifyReCAPTCHA(
                        data.reCAPTCHAresponse,
                        await getRequestIPAddress(request),
                    )
                ) {
                    return dropConnection(
                        request,
                        response,
                        "Invalid reCAPTCHA response",
                    );
                }

                const fingerprint = data.data;
                console.log("Fingerprint:", fingerprint);

                response.end(JSON.stringify(data));
            } catch (error) {
                console.error("Fingerprint error:", error);
                return dropConnection(request, response, "Fingerprint error");
            }
        });
    }
}
