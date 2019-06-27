// Import internal components.
import { verifyReCAPTCHA } from "../data";
import { database } from "../database";
import { Endpoint } from "../endpoint";
import {
    Fingerprint, GatekeeperSession, saveFingerprint,
} from "../entities";
import {
    base64XORJSONDecode, dropConnection, getRequestIPAddress,
    getRequestSessionID, parseEnvironmentVariable,
} from "../utilities";

// Import built-in libraries.
import * as $HTTP from "http";

// Define configurations.
const configurations = {
    maxBytes: parseEnvironmentVariable("VERIFICATION_MAX_BYTES", 16 * 1024),
    maxFingerprintCount:
        parseEnvironmentVariable("VERIFICATION_MAX_FINGERPRINT_COUNT", 5),
};

export default class extends Endpoint {
    public method = "POST";
    protected url = "/verify";

    public async handle(
        request: $HTTP.IncomingMessage,
        response: $HTTP.ServerResponse,
    ): Promise<void> {
        // Retrieve the session ID.
        const sessionID: string | undefined = getRequestSessionID(request);

        // Make sure that the request has a valid session ID.
        if (!sessionID) {
            return dropConnection(request, response, "Invalid session ID");
        }

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
            || fingerprints.length === configurations.maxFingerprintCount
        ) {
            return dropConnection(request, response, "");
        }*/

        const chunks: Uint8Array[] = [];
        request.on("data", (chunk) => {
            // Drop the connection if the data being sent is larger than the
            //   maximum allowed size.
            if (request.socket.bytesRead > configurations.maxBytes) {
                return dropConnection(request, response, "Data size overflow");
            }

            chunks.push(chunk);
        }).on("end", async () => {
            // Disconnect the user since they're done sending data.
            response.end();

            try {
                // Reconstruct the data from the encoded POST body.
                const data = base64XORJSONDecode(
                    Buffer.concat(chunks).toString(),
                    sessionID.split("").reverse().join(""), // :^)
                );

                // Make sure that the fingerprint's session ID matches.
                if (data.sessionID !== sessionID) {
                    return dropConnection(
                        request,
                        response,
                        "Mismatching fingerprint session ID",
                    );
                }

                // Make sure that the reCAPTCHA response is valid.
                if (!verifyReCAPTCHA(
                    data.reCAPTCHAresponse,
                    await getRequestIPAddress(request),
                )) {
                    return dropConnection(
                        request,
                        response,
                        "Invalid reCAPTCHA response",
                    );
                }

                // Save the fingerprint.
                const fingerprint: object = data.data;
                console.log("Fingerprint:", fingerprint);
                saveFingerprint(sessionID, fingerprint);
            } catch (error) {
                console.error("Fingerprint error:", error);
                return dropConnection(request, response, "Fingerprint error");
            }
        });
    }
}
