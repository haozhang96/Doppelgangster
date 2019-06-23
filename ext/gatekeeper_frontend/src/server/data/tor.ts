// Import external libraries.
import * as $Request from "request";

export function isTorExitNode(ipAddress: string): Promise<boolean> {
    // TODO: Cache the file

    return new Promise((resolve, reject) => {
        $Request.get(
            (
                "http://torstatus.blutmagie.de/ip_list_exit.php/"
                + "Tor_ip_list_EXIT.csv"
            ),
            (error, response) => {
                if (error || response.statusCode !== 200) {
                    reject(false);
                }

                resolve((response.body as string).includes(ipAddress));
            },
        );
    });
}
