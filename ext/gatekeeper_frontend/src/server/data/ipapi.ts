// Import external libraries.
import * as $Request from "request";

export function getIPAPIData(ipAddress: string): Promise<object> {
    return new Promise((resolve, reject) => {
        $Request.get(
            "https://ipapi.co/" + ipAddress + "/json",
            (error, response) => {
                if (error || response.statusCode !== 200) {
                    reject(error);
                }

                resolve(JSON.parse(response.body));
            },
        );
    });
}
