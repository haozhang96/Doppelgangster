// Import external libraries.
import * as $Request from "request";

export function getIPAPIData(ipAddress: string): Promise<object> {
    return new Promise((resolve) => {
        $Request.get(
            "https://ipapi.co/" + ipAddress + "/json",
            (error, response) => {
                if (error || response.statusCode !== 200) {
                    console.error(
                        "An error has occurred while getting IPAPI data:",
                        error,
                    );
                    resolve();
                }

                resolve(JSON.parse(response.body));
            },
        );
    });
}
