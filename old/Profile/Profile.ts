import * as Discord from "discord.js";
import { EventEmitter } from "events";

import { ProfileMarshal, ProfileAnalysis, ProfileComparison, ProfileReport, Characteristic, IGatekeeperFingerprint } from "@";
import { Characteristics } from "../Characteristic/Characteristics";
import { IExpirable } from "@/Interfaces";
// import Logger from "@/Logger";


export class Profile extends EventEmitter implements IExpirable {
	// Public properties
	public readonly profileMarshal: ProfileMarshal;
	public readonly user: Discord.User;
	public readonly userID: string;
	public readonly characteristics: ReadonlyArray<Characteristic<any>> = Characteristics.map(Characteristic => new Characteristic(this));

	// Private properties
	private _analysis: ProfileAnalysis | undefined;
	private _report: ProfileReport | undefined;
	private readonly _reportsAgainst: Map<string, ProfileReport> = new Map();


	/**
	 * Constructor
	 * @param profileMarshal A ProfileMarshal object
	 * @param user A Discord.User object or user ID string
	 */
	private constructor(profileMarshal: ProfileMarshal, user: Discord.User | string) {
		super(); this.profileMarshal = profileMarshal;

		if (user instanceof Discord.User) {
			this.user = user; this.userID = user.id;
		} else if (this.user = profileMarshal.doppelgangster.discord.users.find(_user => _user.id === user))
			this.userID = this.user.id;
		else
			this.userID = user;
	}


	// Public methods
	public static async create(profileMarshal: ProfileMarshal, user: Discord.User | string): Promise<Profile> {
		const profile: Profile = new Profile(profileMarshal, user);
		for (const characteristic of profile.characteristics)
			await characteristic.initialize();
		return profile;
	}

	public get analysis(): ProfileAnalysis {
		return this._analysis && !this._analysis.expired ? this._analysis : (this._analysis = new ProfileAnalysis(this));
	}

	public get report(): ProfileReport {
		return this._report && !this._report.expired ? this._report : (this._report = new ProfileReport(this, this.profileMarshal.profiles));
	}

	public get comparisons(): ProfileComparison[] {
		return this.profileMarshal.getComparisonsWithProfile(this);
	}

	public compareTo(otherProfile: Profile): ProfileComparison {
		return this.profileMarshal.compareProfiles(this, otherProfile); // Caching occurs in the profile marshal
	}

	public runReportAgainst(against: Profile[]): ProfileReport {
		const againstGroupID: string = against.map(profile => profile.user.id).sort().join(","), report: ProfileReport | undefined = this._reportsAgainst.get(againstGroupID);
		return report && !report.expired ? report : this._reportsAgainst.set(againstGroupID, new ProfileReport(this, against)).get(againstGroupID) as ProfileReport;
	}

	public async getFingerprints(): Promise<IGatekeeperFingerprint[]> {
		return await this.profileMarshal.doppelgangster.gatekeeper.getFingerprints(this.user);
	}

	public get expired(): boolean { return this._analysis && this._analysis.expired || this.profileMarshal.getComparisonsWithProfile(this).some(comparison => comparison.expired); }
}