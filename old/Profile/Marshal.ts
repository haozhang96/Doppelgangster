import * as Discord from "discord.js";

import { Doppelgangster, Profile, ProfileComparison } from "@";
import { UniquePair, UnorderedPairStore } from "@/Classes/Pair";
import Logger from "@/Logger";


export class ProfileMarshal {
	// Public properties
	public readonly doppelgangster: Doppelgangster;
	public readonly profiles: Profile[] = [];

	// Private properties
	private readonly profilePairs: UnorderedPairStore<Profile> = new UnorderedPairStore();
	private readonly profileComparisons: Map<UniquePair<Profile>, ProfileComparison> = new Map();


	/**
	 * Creates a profile marshal module
	 * @param doppelgangster A Doppelgangster instance
	 */
	constructor(doppelgangster: Doppelgangster) {
		this.doppelgangster = doppelgangster;
		Logger.info("Module is ready.");
	}


	/******************
	 * Public methods *
	 ******************/
	
	/**
	 * Returns the Doppelgangster profile for a Discord user and, if it doesn't exists, creates and adds it to the marshal's collection
	 * @param user The Discord user
	 */
	public async getUserProfile(user: Discord.User, createIfMissing: boolean = true): Promise<Profile | undefined> {
		return this.profiles.find(profile => profile.user === user) || (
			createIfMissing ?
			/*Logger.info(`Creating profile for "${user.username}"...`) &&*/ (this.profiles[this.profiles.length] = await Profile.create(this, user)) :
			undefined
		);
	}

	/**
	 * Compares two Discord users; caching is utilized
	 * @param userOne The first Discord user
	 * @param userTwo The second Discord user
	 */
	public async compareUsers(userOne: Discord.User, userTwo: Discord.User): Promise<ProfileComparison | undefined> {
		const profileOne: Profile | undefined = await this.getUserProfile(userOne), profileTwo: Profile | undefined = await this.getUserProfile(userTwo);
		return profileOne && profileTwo ? this.compareProfiles(profileOne, profileTwo) : undefined;
	}

	/**
	 * Compares two Doppelgangster profiles; caching is utilized
	 * @param firstProfile The first Doppelgangster profile
	 * @param secondProfile The second Doppelgangster profile
	 */
	public compareProfiles(profileOne: Profile, profileTwo: Profile): ProfileComparison {
		const pair: UniquePair<Profile> = this.profilePairs.get(profileOne, profileTwo), comparison: ProfileComparison | undefined = this.profileComparisons.get(pair);
		Logger.info(`Comparing "${profileOne.user.username}" and "${profileTwo.user.username}": cached[${!!comparison}], expired[${comparison ? comparison.expired : false}]`);
		return comparison && !comparison.expired ? comparison : this.profileComparisons.set(pair, new ProfileComparison(profileOne, profileTwo)).get(pair) as ProfileComparison;
	}

	/**
	 * Gets all the profile comparisons in which a given Doppelgangster profile is associated with
	 * @param profile The Doppelgangster profile
	 */
	public getComparisonsWithProfile(profile: Profile): ProfileComparison[] {
		const comparisons: ProfileComparison[] = [];
		for (const [profilePair, comparison] of this.profileComparisons)
			if (profilePair.one === profile || profilePair.two === profile)
				comparisons.push(comparison);
		return comparisons;
	}

	/**
	 * Creates a Doppelgangster profile for every user in a Discord guild and adds them to the marshal's collection
	 * @param guild The Discord guild
	 */
	public async addAllUsersInGuild(guild: Discord.Guild): Promise<Profile[]> {
		const profiles: Profile[] = [];
		for (const [, channel] of guild.channels.filter(channel => channel instanceof Discord.TextChannel))
			for (const [, member] of (channel as Discord.TextChannel).members)
				if (!member.user.bot) {
					const profile: Profile | undefined = await this.getUserProfile(member.user);
					if (profile) profiles.push(profile);
				}
		return profiles;
	}
}