// Import external libraries.
import * as $Request from "request";

export function verifyReCAPTCHA(
    reCAPTCHAresponse: string,
    ipAddress: string,
): Promise<boolean> {
    return new Promise((resolve) => {
        $Request.get(
            `https://www.google.com/recaptcha/api/siteverify?secret=${
                process.env.RECAPTCHA_SECRET_KEY
            }&remoteip=${
                ipAddress
            }$response=${
                reCAPTCHAresponse
            }`,
            (error, response) => {
                if (error || response.statusCode !== 200) {
                    console.error(
                        "An error has occurred while verifying reCAPTCHA "
                        + "response:",
                        error,
                    );
                    resolve(false);
                }

                resolve(JSON.parse(response.body).success);
            },
        );
    });
}
