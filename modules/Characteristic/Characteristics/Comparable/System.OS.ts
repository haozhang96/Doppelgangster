import { ComparableCharacteristic, CharacteristicComparison } from "@/Characteristic";
import { Pair } from "@/Classes/Pair";
import * as Utilities from "@/Utilities";


type Data = Set<string>;
type Example = string;

export default class extends ComparableCharacteristic<Data, Example> {
	name = "System.OS";
	description = "Operating system";
	weight = 1;

	async collector(): Promise<void> {
		await this.profile.getFingerprints().then(fingerprints => fingerprints && (
			this.data = new Set(fingerprints.map(fingerprint => `${fingerprint.system.os.family} ${fingerprint.system.os.version} (${fingerprint.system.os.architecture}-bit)`
		))));
	}

	comparator(otherCharacteristic: this): CharacteristicComparison<Example> | undefined {
		if (!(this.data && otherCharacteristic.data)) return;
		return new CharacteristicComparison(this, otherCharacteristic,
			Utilities.Collection.haveOneIntersection(this.data, otherCharacteristic.data) ? 1 : 0,
			[new Pair([...this.data].join(", "), [...otherCharacteristic.data].join(", "))]
		);
	}
}