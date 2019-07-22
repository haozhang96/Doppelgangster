import { GatekeeperSession } from "./entities";

export abstract class Sessions {
    public static addSession(sessionID: string, data: GatekeeperSession) {
        this._sessions[sessionID] = data;
    }

    public static getSession(sessionID: string): GatekeeperSession {
        return this._sessions[sessionID];
    }

    public static removeSession(sessionID: string): void {
        delete this._sessions[sessionID];
    }

    private static _sessions: { [sessionID: string]: GatekeeperSession } = {};
}
