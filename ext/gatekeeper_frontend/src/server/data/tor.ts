// Import built-in libraries.
import * as $DNS from "dns";

export function isTorExitNode(ipAddress: string): Promise<boolean> {
    return new Promise((resolve) => {
        $DNS.lookup(
            `${
                ipAddress.split(".").reverse().join(".")
            }.443.8.8.8.8.ip-port.exitlist.torproject.org`,
            (error, address) => {
                if (error) {
                    resolve(false);
                }

                resolve(
                    address ?
                        address.startsWith("127.0.0.")
                        && address !== "127.0.0.1"
                    :
                        false,
                );
            },
        );
    });
}
