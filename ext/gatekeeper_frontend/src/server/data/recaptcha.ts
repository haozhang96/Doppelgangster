// Import external libraries.
import * as $Request from "request";

export function verifyReCAPTCHA(
    reCAPTCHAresponse: string,
    ipAddress: string,
): Promise<object> {
    return new Promise((resolve, reject) => {
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
                    reject(error);
                }

                resolve(JSON.parse(response.body).success);
            },
        );
    });
}
