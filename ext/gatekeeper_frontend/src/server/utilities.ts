import * as $HTTP from "http";

/**
 * Immediately drop an active connection with a 403 status code.
 * @param request 
 * @param response 
 */
export function dropConnection(
    request: $HTTP.IncomingMessage,
    response: $HTTP.ServerResponse,
): void {
    response.statusCode = 403;
    response.end();
    request.destroy();
}

/**
 * Encode an input string with a key using the XOR cipher.
 * This is absolutely NOT meant to be secure!
 * @param input 
 * @param key 
 */
export function xorEncode(input: string, key: string): string {
    const inputLength: number = input.length;
    const keyLength: number = key.length;
    const output: string[] = [];

    for (let i = 0; i < inputLength; i++) {
        output.push(
            String.fromCharCode(
                // tslint:disable-next-line: no-bitwise
                input[i].charCodeAt(0) ^ key[i % keyLength].charCodeAt(0),
            ),
        );
    }

    return output.join("");
}
