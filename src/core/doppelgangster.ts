import * as $Discord from "discord.js";

export class Doppelgangster {
    private readonly _discord: $Discord.Client;

    constructor() {
        const discord: $Discord.Client = this._discord = new $Discord.Client();
        
        
    }

    public get discord(): $Discord.Client {
        return this._discord;
    }
}
