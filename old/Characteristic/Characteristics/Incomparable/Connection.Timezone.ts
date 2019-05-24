import { IncomparableCharacteristic, CharacteristicAnalysis } from "@/Characteristic";


type Data = boolean;
type Example = boolean;

export default class extends IncomparableCharacteristic<Data, Example> {
	name = "Connection.Timezone";
	description = "Whether the user's connection's timezone matches their browser's";
	weight = 3;

	async collector(): Promise<void> {
		await this.profile.getFingerprints().then(fingerprints => fingerprints && (
			this.data = fingerprints.filter(fingerprint => fingerprint.connection.location).some(fingerprint =>
				fingerprint.connection.location && fingerprint.connection.location.timezone.matchesSystem || false
			)
		));
	}

	analyzer(): CharacteristicAnalysis<Example> | undefined {
		if (!this.data) return;
		return new CharacteristicAnalysis(this, !this.data ? 1 : 0, [this.data]);
	}
}