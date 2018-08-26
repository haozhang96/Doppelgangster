import { IncomparableCharacteristic, CharacteristicAnalysis } from "@/Characteristic";


type Data = boolean;
type Example = boolean;

export default class extends IncomparableCharacteristic<Data, Example> {
	name = "Browser.HasVisitedBefore";
	description = "Whether the user has visited the gatekeeper's page before";
	weight = 5;

	async collector(): Promise<void> {
		await this.profile.getFingerprints().then(fingerprints => fingerprints && (this.data = fingerprints.some(fingerprint => fingerprint.browser.hasVisitedBefore)));
	}

	analyzer(): CharacteristicAnalysis<Example> | undefined {
		if (!this.data) return;
		return new CharacteristicAnalysis(this, this.data ? 1 : 0, [this.data]);
	}
}