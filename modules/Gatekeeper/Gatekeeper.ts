import * as Discord from "discord.js";
import * as MongoDB from "mongodb";
import * as Crypto from "crypto";
import * as TFA from "node-2fa";
import * as Utilities from "util";
import { EventEmitter } from "events";

import { Doppelgangster } from "@";
import { DatabaseInterface } from "@/Gatekeeper/DatabaseInterface";
import { IGatekeeperFingerprint } from "@/Gatekeeper/Interfaces";
import { IDiscordGuildAttachable } from "@/Interfaces";
import Logger from "@/Logger";
import Configurations from "Configurations";


interface IVerificationSession {
	id: string;
	guild: Discord.Guild;
	user: Discord.User;
	secret: string;
}


export class Gatekeeper extends EventEmitter implements IDiscordGuildAttachable {
	// Private properties
	// private readonly doppelgangster: Doppelgangster;
	private readonly frontendDatabase: DatabaseInterface = new DatabaseInterface(Configurations.doppelgangster.gatekeeper.database.interface, Configurations.doppelgangster.gatekeeper.database.options);
	private readonly backendDatabase: MongoDB.Db;
	private readonly attachedGuilds: Discord.Guild[] = [];
	private readonly verificationSessions: IVerificationSession[] = [];


	/**
	 * Constructor
	 * @param doppelgangster A Doppelgangster object
	 * @param verificationTimeout The verification timeout interval in milli-seconds
	 */
	constructor(doppelgangster: Doppelgangster, backendDatabase: MongoDB.Db) {
		super(); /*this.doppelgangster = doppelgangster;*/ this.backendDatabase = backendDatabase;

		// Testing
		doppelgangster.discord.on("message", async message => {
			if (this.attachedGuilds.includes(message.guild) && message.content === "~~" && !this.verificationSessions.find(session => session.guild === message.guild && session.user === message.author))
				this.createSession(message.guild, message.author);
		});

		doppelgangster.discord.on("guildMemberAdd", member => {
			if (this.isGuildAttached(member.guild))
				this.createSession(member.guild, member.user);
		}).on("guildMemberRemove", member => {
			const session: IVerificationSession | undefined = this.verificationSessions.find(session => session.guild === member.guild && session.user === member.user);
			if (session) this.destroySession(session);
		});
		
		Logger.info("Module is ready.");
	}


	// Public methods
	public async getFingerprints(user: Discord.User | string): Promise<IGatekeeperFingerprint[]> {
		return (await this.backendDatabase.collection("fingerprints").findOne({ userID: user instanceof Discord.User ? user.id : user }) || {}).fingerprints;
	}

	public async attachGuild(guild: Discord.Guild): Promise<this> {
		if (this.isGuildAttached(guild)) { // TODO: Temporarily disabled
			// Create gateway channel
			let gatewayChannel: Discord.TextChannel = guild.channels.find("name", Configurations.doppelgangster.gatekeeper.verification.gatewayChannelName) as Discord.TextChannel;
			if (!gatewayChannel) {
				gatewayChannel = await guild.createChannel(
					Configurations.doppelgangster.gatekeeper.verification.gatewayChannelName, "text", [], "Created by Doppelgangster's gatekeeper module to intercept new users"
				) as Discord.TextChannel;
				gatewayChannel.setTopic("Welcome to the server! Follow the instructions below to enter the server."); gatewayChannel.setPosition(1);
				gatewayChannel.sendMessage(`Welcome to \`${guild.name}\`!`);
			}

			// Create a verified role
			let verifiedRole: Discord.Role = guild.roles.find("name", Configurations.doppelgangster.gatekeeper.verification.verifiedRoleName);
			if (!verifiedRole) {
				verifiedRole = await guild.createRole({
					name: Configurations.doppelgangster.gatekeeper.verification.verifiedRoleName,
					permissions: [
						
					],
				}, "Created by Doppelgangster's gatekeeper module to limit new users' access");
			}

			// Update everyone role
			
			
			this.attachedGuilds.push(guild);
		}
		return this;
	}

	public detachGuild(guild: Discord.Guild): this {
		if (this.isGuildAttached(guild)) {


			this.attachedGuilds.splice(this.attachedGuilds.indexOf(guild), 1);
		}
		return this;
	}

	public isGuildAttached(guild: Discord.Guild): boolean {
		return this.attachedGuilds.includes(guild);
	}


	// Private methods
	private async createSession(guild: Discord.Guild, user: Discord.User): Promise<IVerificationSession | undefined> {
		Logger.info(`Creating verification session for "${user.username}" in "${guild.name}"...`);

		try {
			// Generate session information
			const secret: string = TFA.generateSecret().secret, session: IVerificationSession = {
				id: Crypto.createHash("sha256").update(secret + Math.random().toString(36).substring(2, 15)).digest("hex"),
				guild, user, secret
			};

			// Initiate session
			await this.frontendDatabase.insert("2fa", "sessions", { id: session.id, secret: session.secret }, "id");
			
			// Notify user
			await user.send(
				`Welcome to \`${guild.name}\`!\n` +
				`Please visit this webpage for your verification code: ${Configurations.doppelgangster.gatekeeper.gatewayURL}?${session.id}\n` +
				`You have ${(Configurations.doppelgangster.gatekeeper.verification.timeout / 1000).toFixed()} seconds to retrieve your code before your session expires.`
			);

			// Wait for user response
			const listener: (message: Discord.Message) => void = message => {
				if (message.channel instanceof Discord.DMChannel && message.content.length === 6)
					if (TFA.verifyToken(session.secret, message.content, 120)) {
						user.client.removeListener("message", listener);
						this.completeSession(session);
					} else message.author.send("Sorry, that code is incorrect. Please refresh or reopen the webpage and retry.");
			};
			user.client.on("message", listener);

			// Session timeout
			setTimeout(() => {
				if (this.verificationSessions.includes(session)) {
					user.client.removeListener("message", listener);
					this.destroySession(session);
					user.send(`Your verification session for \`${guild.name}\` has expired.\nReply with \`~~\` to start another session.`);
				}
			}, Configurations.doppelgangster.gatekeeper.verification.timeout);
			
			// Finalize session creation
			Logger.info(`[${session.id}] Created verification session for "${user.username}" in "${guild.name}".`);
			this.verificationSessions.push(session);
			return session;
		} catch (error) {
			Logger.error(`Unable to create verification session for "${user.username}" in "${guild.name}".\n${error}`);
		}
	}

	private async completeSession(session: IVerificationSession): Promise<this> {
		Logger.info(`[${session.id}] Completing verification session...`);

		try {
			const result: any = await this.frontendDatabase.select("2fa", "sessions", "fingerprints", { id: session.id });
			const fingerprints: IGatekeeperFingerprint[] = JSON.parse(JSON.parse(result)[0][0]);

			// Emit fingerprints event
			this.emit("fingerprints", session.user);

			// Notify user of success
			session.user.send(`Congratulations, you have been verified for entry into \`${session.guild.name}\`! Here are your fingerprint(s) collected during this session:`);
			const messageChunks: RegExpMatchArray | null = Utilities.inspect(fingerprints, { depth: null, maxArrayLength: null }).match(/[\s\S]{1,1980}/g);
			if (messageChunks) messageChunks.forEach(segment => session.user.send(`\`\`\`\n${segment}\`\`\``));
			
			// Save fingerprints to back-end database
			try {
				const collection: MongoDB.Collection = this.backendDatabase.collection("fingerprints");
				await collection.updateOne({ userID: session.user.id }, { $set: {
					fingerprints: ((await collection.findOne({ userID: session.user.id })) || { fingerprints: [] }).fingerprints.concat(fingerprints)
				} }, { upsert: true });
				Logger.info(`[${session.id}] Successfully fingerprinted "${session.user.username}".`);
			} catch (error) {
				Logger.error(`[${session.id}] Unable to save fingerprints for "${session.user.username}": ${error}`);
			}
		} catch (error) {
			session.user.send(`Congratulations, you have been verified for entry into \`${session.guild.name}\`! Unfortunately, I was not able to retrieve your fingerprint.`);
			Logger.warn(`[${session.id}] No fingerprint data returned for ${session.user.username}.`);
		} finally {
			return this.destroySession(session);
		}
	}

	private destroySession(session: IVerificationSession): this {
		Logger.info(`[${session.id}] Destroying verification session...`);

		this.frontendDatabase.delete("2fa", "sessions", { id: session.id });
		if (this.verificationSessions.includes(session))
			this.verificationSessions.splice(this.verificationSessions.indexOf(session), 1);
		return this;
	}
}