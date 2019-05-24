import { ComparableCharacteristic, CharacteristicComparison } from "@/Characteristic";
import * as Utilities from "@/Utilities";


type Data = { presence: string; updated: Date; };
type Example = Date;

export default class extends ComparableCharacteristic<Data, Example> {
	name = "Behavior.PresenceChange";
	description = "How closely the user's presence changed with respect to another's";
	weight = 3;
	configurations = { presenceChangeDistanceFactor: 1e8 };
	
	async collector(): Promise<void> {
		this.profile.user.client.on("presenceUpdate", (_oldMember, newMember) => {
			if (newMember.user === this.profile.user) {
                this.data = { presence: newMember.presence.status, updated: new Date() }; this.emit("data");
			}
		});
	}

	comparator(otherCharacteristic: this): CharacteristicComparison<Example> | undefined {
        if (this.data && otherCharacteristic.data && this.data.presence === otherCharacteristic.data.presence)
		    return new CharacteristicComparison(this, otherCharacteristic,
			    Utilities.Math.calculateSimilarity(+this.data.updated, +otherCharacteristic.data.updated, this.configurations.presenceChangeDistanceFactor),
			    [{one: this.data.updated, two: otherCharacteristic.data.updated}]
		    );
	}
}