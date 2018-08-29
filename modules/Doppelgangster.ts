import * as Discord from "discord.js";
import * as MongoDB from "mongodb";

import { Commander, Gatekeeper, ProfileMarshal } from "@";
import { IDiscordGuildAttachable } from "@/Interfaces";
import * as Utilities from "@/Utilities";
import Logger from "@/Logger";
import Configurations from "Configurations";


export class Doppelgangster implements IDiscordGuildAttachable {
	// Public properties
	public readonly discord: Discord.Client;
	public readonly database: MongoDB.Db;
	public readonly profileMarshal: ProfileMarshal;
	public readonly commander: Commander;
	public readonly gatekeeper: Gatekeeper;

	// Private properties
	private readonly attachedGuilds: Discord.Guild[] = [];
	

	/**
	 * Creates a Doppelgangster instance
	 * @param discord A Discord.js client
	 * @param database A MongoDB database connection
	 */
	private constructor(discord: Discord.Client, database: MongoDB.Db) {
		this.discord = discord; this.database = database;
		this.profileMarshal = new ProfileMarshal(this);
		this.commander = new Commander(this);
		this.gatekeeper = new Gatekeeper(this, database);
	}


	// Public methods
	public static async initialize(): Promise<Doppelgangster | void> {
		try {
			// Create a Discord client
			//let reconnecting: boolean = false;
			const discord: Discord.Client = new Discord.Client(), login: () => void = async () => {
				try {
					Logger.info("Connecting to Discord...");
					await discord.login(Configurations.discord.token);
					Logger.info("Successfully connected to Discord.");
				} catch (error) {
					Logger.warn("Failed to connect to Discord:", Utilities.Miscellaneous.stringifyError(error, false));
					throw error;
				} finally {
					//reconnecting = false;
				}
			};
			
			// Attach events to Discord
			discord.on("error", error => {
				Logger.warn("Discord has encountered an error:", Utilities.Miscellaneous.stringifyError(error, false));
				//if (!reconnecting) {
				//	Logger.warn(`Doppelgangster has disconnected from Discord! Reconnecting in ${Math.round(Configurations.discord.reconnectTimeout / 1000)} seconds...`);
				//	setTimeout(login, Configurations.discord.reconnectTimeout); reconnecting = true;
				//}
			}).on("disconnect", () => {
				Logger.error("Doppelgangster has disconnected from Discord!");
			});

			// Log into Discord
			await login();

			// Connect to database
			Logger.info("Connecting to database...");
			const database: MongoDB.Db = (await MongoDB.connect(Configurations.doppelgangster.database.mongodbConnectionString, { useNewUrlParser: true } as any)).db("doppelgangster");
			Logger.info("Successfully connected to database.");

			// Initialize modules
			Logger.info("Initializing modules...");
			const doppelgangster: Doppelgangster = new Doppelgangster(discord, database);
			Logger.info("Successfully initialized modules.");
			
			// Attach to all connected guilds if needed
			if (Configurations.doppelgangster.autoAttachToAllGuilds)
				for (const [, guild] of discord.guilds)
                	await doppelgangster.attachGuild(guild);
			
			Logger.info("Initialization completed.");
			return doppelgangster;
		} catch (error) {
			Logger.error("Initialization failed:", Utilities.Miscellaneous.stringifyError(error));
		}
	}
	
	public async attachGuild(guild: Discord.Guild): Promise<this> {
		if (!this.isGuildAttached(guild)) {
			Logger.info(`Attaching to "${guild.name}"...`);
			/* Profile marshal */ await this.profileMarshal.addAllUsersInGuild(guild);
			/* Commander */ this.commander.attachGuild(guild);
			/* Gatekeeper */ if (Configurations.doppelgangster.underAttack) this.gatekeeper.attachGuild(guild);
			this.attachedGuilds.push(guild);
		}
		return this;
	}

	public detachGuild(guild: Discord.Guild): this {
		if (this.isGuildAttached(guild)) {
			Logger.info(`Detaching from "${guild.name}"...`);
			/* Commander */ this.commander.detachGuild(guild);
			/* Gatekeeper */ this.gatekeeper.detachGuild(guild);
			this.attachedGuilds.splice(this.attachedGuilds.indexOf(guild), 1);
		}
		return this;
	}

	public isGuildAttached(guild: Discord.Guild): boolean {
		return this.attachedGuilds.includes(guild);
	}
}


export const initialize: typeof Doppelgangster.initialize = Doppelgangster.initialize;