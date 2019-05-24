import * as Discord from "discord.js";

import { ComparableCharacteristic, CharacteristicComparison } from "@/Characteristic";
import * as Utilities from "@/Utilities";
// import Logger from "@/Logger";


const exclusions: Set<string> = new Set(require("../Configurations/Linguistic.Slurs.Racial").concat(require("../Configurations/Linguistic.Slurs.Sexual")));
const profanities: RegExp[] = [...new Set(require("../Configurations/Linguistic.Profanity") as string[])].filter(profanity => !exclusions.has(profanity)).map(word => new RegExp("\\b" + word + "\\b", "i"));


type Data = Map<RegExp, Discord.Message[]>;
type Example = Discord.Message;

export default class extends ComparableCharacteristic<Data, Example> {
	name = "Linguistic.Profanity";
	description = "Usage of profanities";
    weight = 3;
	
	async collector(): Promise<void> {
		const data: Data = this.data = new Map();
		this.profile.user.client.on("message", message => {
			if (message.author === this.profile.user) {
                let newData: boolean = false;
				for (const profanity of profanities)
					if (profanity.test(message.content)) {
                        const map: Discord.Message[] | undefined = data.get(profanity);
                        if (map)
                            map.push(message);
                        else
                            data.set(profanity, [message]);
                        newData = true;
                    }
                if (newData) this.emit("data");
            }
		});
	}

	comparator(otherCharacteristic: this): CharacteristicComparison<Example> | undefined {
        if (!(this.data && otherCharacteristic.data)) return;

        const   thisProfanities: string[] = [...this.data.keys()].map(regex => regex.source),
                otherProfanities: string[] = [...otherCharacteristic.data.keys()].map(regex => regex.source),
                unusedProfanities: Set<RegExp> = new Set(profanities),
                uniqueCount: number = new Set(thisProfanities.concat(otherProfanities)).size;
        let     sameCount: number = 0;
        
        for (const thisProfanity of thisProfanities)
            for (const otherProfanity of otherProfanities)
                if (thisProfanity === otherProfanity) {
                    sameCount++; break;
                }
        
		return new CharacteristicComparison(this, otherCharacteristic,
			sameCount / uniqueCount,
            Utilities.Discord.matchMessages(
                ([] as Discord.Message[]).concat(...this.data.values()),
                ([] as Discord.Message[]).concat(...otherCharacteristic.data.values()),
                (thisMessage, otherMessage) => {
                    let matched: boolean = false;
                    for (const profanity of unusedProfanities)
                        if (profanity.test(thisMessage.content) && profanity.test(otherMessage.content)) {
                            unusedProfanities.delete(profanity); matched = true;
                        }
                    return matched;
                }
            ),
            Utilities.Discord.formatMessage
        );
	}
}