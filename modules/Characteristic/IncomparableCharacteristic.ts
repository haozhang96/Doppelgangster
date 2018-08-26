import { Profile, CharacteristicAnalysis } from "@";
import { Characteristic } from "@/Characteristic"; // Needs to be separate to prevent circular dependency
// import Logger from "@/Logger";


export abstract class IncomparableCharacteristic<DataT, ExampleT> extends Characteristic<DataT> {
	// Private properties
	private _analysis: CharacteristicAnalysis<ExampleT> | undefined;


	/**
	 * Constructor
	 * @param profile The profile
	 * @param data Characteristic data
	 */
	constructor(profile: Profile, data?: DataT) {
		super(profile, data);
		this.on("data", () => {
			// Logger.info("New data for", this.profile.user.username, "-", this.name, "--", this.data);
			if (this.analysis) this.analysis.expire(); // Expire characteristic analysis
			profile.analysis.expire(); // Expire profile analysis
		});
	}


	// Public methods
	public get analysis(): CharacteristicAnalysis<ExampleT> {
		return this._analysis && !this._analysis.expired ? this._analysis : (this._analysis = this.hasData && this.analyzer() || new CharacteristicAnalysis(this));
	}


	// Extensible methods
	protected abstract analyzer(): CharacteristicAnalysis<ExampleT> | undefined;
}