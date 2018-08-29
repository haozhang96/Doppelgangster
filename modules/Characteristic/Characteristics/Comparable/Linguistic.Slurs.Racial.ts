import * as Discord from "discord.js";

import { ComparableCharacteristic, CharacteristicComparison } from "@/Characteristic";
import * as Utilities from "@/Utilities";
// import Logger from "@/Logger";


const slurs: RegExp[] = [...new Set(require("../Configurations/Linguistic.Slurs.Racial") as string[])].map(word => new RegExp("\\b" + word + "\\b", "i"));


type Data = Map<RegExp, Discord.Message[]>;
type Example = Discord.Message;

export default class extends ComparableCharacteristic<Data, Example> {
	name = "Linguistic.Slurs.Racial";
	description = "Usage of racial/ethnic slurs";
    weight = 4;
	
	async collector(): Promise<void> {
		const data: Data = this.data = new Map();
		this.profile.user.client.on("message", message => {
			if (message.author === this.profile.user) {
                let newData: boolean = false;
				for (const slur of slurs)
					if (slur.test(message.content)) {
                        const map: Discord.Message[] | undefined = data.get(slur);
                        if (map)
                            map.push(message);
                        else
                            data.set(slur, [message]);
                        newData = true;
                    }
                if (newData) this.emit("data");
            }
		});
	}

	comparator(otherCharacteristic: this): CharacteristicComparison<Example> | undefined {
        if (!(this.data && otherCharacteristic.data)) return;

        const   thisSlurs: string[] = [...this.data.keys()].map(regex => regex.source),
                otherSlurs: string[] = [...otherCharacteristic.data.keys()].map(regex => regex.source),
                unusedSlurs: Set<RegExp> = new Set(slurs),
                uniqueCount: number = new Set(thisSlurs.concat(otherSlurs)).size;
        let     sameCount: number = 0;
        
        for (const thisSlur of thisSlurs)
            for (const otherSlur of otherSlurs)
                if (thisSlur === otherSlur) {
                    sameCount++; break;
                }
        
		return new CharacteristicComparison(this, otherCharacteristic,
			sameCount / uniqueCount,
            Utilities.Discord.matchMessages(
                ([] as Discord.Message[]).concat(...this.data.values()),
                ([] as Discord.Message[]).concat(...otherCharacteristic.data.values()),
                (thisMessage, otherMessage) => {
                    let matched: boolean = false;
                    for (const slur of unusedSlurs)
                        if (slur.test(thisMessage.content) && slur.test(otherMessage.content)) {
                            unusedSlurs.delete(slur); matched = true;
                        }
                    return matched;
                }
            ),
            Utilities.Discord.formatMessage
        );
	}
}