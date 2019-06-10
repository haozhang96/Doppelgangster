import * as FileSystem from "fs";
import * as HTTP from "http";
import * as Path from "path";

// Create the server.
export const server: HTTP.Server = HTTP.createServer((request, response) => {
    return;
}).listen(process.env.SERVER_PORT || 80);
