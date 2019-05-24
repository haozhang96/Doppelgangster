import { IncomparableCharacteristic, CharacteristicAnalysis } from "@/Characteristic";


type Data = boolean;
type Example = boolean;

export default class extends IncomparableCharacteristic<Data, Example> {
	name = "Connection.Proxy";
	description = "Whether the user is using a proxy of some sort";
	weight = 3;

	async collector(): Promise<void> {
		await this.profile.getFingerprints().then(fingerprints => fingerprints && (this.data = fingerprints.some(fingerprint => fingerprint.connection.isProxy)));
	}

	analyzer(): CharacteristicAnalysis<Example> | undefined {
		if (!this.data) return;
		return new CharacteristicAnalysis(this, this.data ? 1 : 0, [this.data]);
	}
}