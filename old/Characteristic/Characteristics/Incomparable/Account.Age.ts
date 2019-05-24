import { IncomparableCharacteristic, CharacteristicAnalysis } from "@/Characteristic";
import * as Utilities from "@/Utilities";


type Data = Date;
type Example = Date;

export default class extends IncomparableCharacteristic<Data, Example> {
	name = "Account.Age";
	description = "Account age";
	weight = 5;
	configurations = { distanceFactor: 1e10 };

	async collector(): Promise<void> {
		this.data = this.profile.user && this.profile.user.createdAt;
	}

	analyzer(): CharacteristicAnalysis<Example> | undefined {
		if (!this.data) return;
		return new CharacteristicAnalysis(this, Utilities.Math.calculateSimilarity(Date.now(), +this.data, this.configurations.distanceFactor), [this.data]);
	}
}