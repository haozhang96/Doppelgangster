// Import external libraries.
import * as $Request from "request";

export function getIPHubData(ipAddress: string): Promise<object> {
    return new Promise((resolve, reject) => {
        $Request.get(
            "http://v2.api.iphub.info/ip/" + ipAddress,
            { headers: { "X-Key": process.env.IPHUB_API_KEY } },
            (error, response) => {
                if (error || response.statusCode !== 200) {
                    reject(error);
                }

                resolve(JSON.parse(response.body));
            },
        );
    });
}
