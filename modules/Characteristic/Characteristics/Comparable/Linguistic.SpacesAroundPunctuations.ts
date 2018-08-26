import * as Discord from "discord.js";

import { ComparableCharacteristic, CharacteristicComparison } from "@/Characteristic";
import { UniquePair } from "@/Classes/Pair";
import * as Utilities from "@/Utilities";
// import Logger from "@/Logger";


interface IPunctuationSpaceTypeRecord<T = any> {
    readonly before: T; readonly after: T; readonly both: T; readonly none: T;
};

const   punctuationSet: string = "\\u2000-\\u206F\\u2E00-\\u2E7F\\\\!\"#$%&()*+,\\-./:;<=>?@\\[\\]^_`{|}~",
        punctuationRegexes: IPunctuationSpaceTypeRecord<RegExp> = {
            before: new RegExp(`\\s([${punctuationSet}]+)(?:[^\\s${punctuationSet}]|$)`, "g"),
            after: new RegExp(`(?:^|[^\\s${punctuationSet}])([${punctuationSet}]+)\\s`, "g"),
            both: new RegExp(`\\s([${punctuationSet}]+)\\s`, "g"),
            none: new RegExp(`(?:^|(?<![\\s${punctuationSet}]))([${punctuationSet}]+)(?:(?![\\s${punctuationSet}])|$)`, "g")
        };


type Data = Map<string, IPunctuationSpaceTypeRecord<Discord.Message[]>>;
type Example = Discord.Message;

export default class extends ComparableCharacteristic<Data, Example> {
	name = "Linguistic.SpacesAroundPunctuations";
	description = "Usage of spaces around punctuation marks";
	weight = 3;
	
	async collector(): Promise<void> {
        const data: Data = this.data = new Map();

		this.profile.user.client.on("message", message => {
			if (message.author === this.profile.user) {
                let newData: boolean = false;

                // Iterate through every punctuation space type
                for (const spaceType of (Object.keys(punctuationRegexes) as (keyof IPunctuationSpaceTypeRecord)[])) {
                    let match: RegExpExecArray | null;

                    // Check if the message contains a punctuation matching the current punctuation space type
                    while (match = punctuationRegexes[spaceType].exec(message.content)) {
                        const punctuation: string = match[1];
                        let record: IPunctuationSpaceTypeRecord<Discord.Message[]> | undefined = data.get(punctuation);

                        // Create a space type record for the current punctuation if it doesn't exist
                        if (!record)
                            data.set(punctuation, record = { before: [], after: [], both: [], none: [] });
                        
                        // Add the current message to the record under the appropriate space type
                        record[spaceType].push(message);
                        newData = true; // Flag the characteristic for data update
                    }
                }

                // Defer data update until after processing is finished
                if (newData)
                    this.emit("data");
			}
		});
	}

	comparator(otherCharacteristic: this): CharacteristicComparison<Example> | undefined {
        if (!(this.data && this.hasData && otherCharacteristic.data && otherCharacteristic.hasData)) return;

        // TODO: Fix scoring
		const   usedPunctuations: Set<string> = new Set(), otherUsedMessages: Set<Discord.Message> = new Set(), matchingMessages: UniquePair<Discord.Message>[] = [];
        let     sameCount: number = 0, uniqueCount: number = 0;

        for (const [thisPunctuation, thisPunctuationRecord] of this.data)
            for (const [otherPunctuation, otherPunctuationRecord] of otherCharacteristic.data)
                if (thisPunctuation === otherPunctuation && !usedPunctuations.has(thisPunctuation)) {
                    for (const spaceType of (Object.keys(thisPunctuationRecord) as (keyof IPunctuationSpaceTypeRecord)[]))
                        if (otherPunctuationRecord[spaceType])
                            for (const thisMessage of thisPunctuationRecord[spaceType])
                                for (const otherMessage of otherPunctuationRecord[spaceType])
                                    if (!otherUsedMessages.has(otherMessage)) {
                                        sameCount++; uniqueCount++;
                                        matchingMessages.push(new UniquePair(thisMessage, otherMessage));
                                        otherUsedMessages.add(otherMessage); break;
                                    }
                    usedPunctuations.add(thisPunctuation); break;
                }
        
		return new CharacteristicComparison(this, otherCharacteristic, sameCount / uniqueCount, matchingMessages, Utilities.Discord.formatMessage);
	}

	get hasData(): boolean { return !!(this.data && this.data.size); }
}