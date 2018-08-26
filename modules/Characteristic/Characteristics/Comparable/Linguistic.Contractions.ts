import * as Discord from "discord.js";

import { ComparableCharacteristic, CharacteristicComparison } from "@/Characteristic";
import { Pair } from "@/Classes/Pair";
import * as Utilities from "@/Utilities";
// import Logger from "@/Logger";


const contractions: RegExp[][] = [ // [full regex, contracted regex, ...common replacements]
	[/$1 not/i, /$1n't/i, "are|could|did|does|do|had|has|have|is|must|need|should|was|were|would"], [/cannot/i, /can't/i], [/will not/i, /won't/i],
	[/$1 (is|has|does)/i, /$1's/i, "everyone|he|how|it|she|somebody|someone|something|that|there|what|where|who|why"], [/let us/i, /let's/i],
	[/$1 are/i, /$1're/i, "how|they|we|what|who|you"], [/I am/i, /I'm/i],
	[/$1 have/i, /$1've/i, "could|he|I|might|must|should|they|we|what|who|would|you"],
	[/$1 (will|would)/i, /$1'(ll|d)/i, "he|how|I|it|she|that|there|they|we|what|who|you"],
	[/going to/i, /gonna/i], [/got to/i, /gotta/i], [/fixing to/i, /finna/i], [/ought to/i, /oughta/i],
	[/give me/i, /gimme/i]
].map(contraction => contraction.slice(0, 2).map((regex: string | RegExp) => new RegExp(
	(regex instanceof RegExp ? regex.source : regex).replace(/\$\d+/g, slot => `(${contraction[+slot.slice(1) + 1]})`)
, regex instanceof RegExp ? regex.flags : undefined)));


type Data = { readonly full: Discord.Message[]; readonly contracted: Discord.Message[]; };
type Example = Discord.Message;

export default class extends ComparableCharacteristic<Data, Example> {
	name = "Linguistic.Contractions";
	description = "Usage of contractions (e.g. I will -> I'll)";
	weight = 3;
    configurations = { contractionRatioDistanceFactor: 5e-2 };
	
	async collector(): Promise<void> {
		const data: Data = this.data = { full: [], contracted: [] };
		this.profile.user.client.on("message", message => {
			if (message.author === this.profile.user) {
				let newData: boolean = false;
				for (const [full, contracted] of contractions) {
					if (full.test(message.content)) {
						data.full.push(message); newData = true;
					}
					if (contracted.test(message.content)) {
						data.contracted.push(message); newData = true;
					}
				}
				if (newData) this.emit("data");
			}
		});
	}

	comparator(otherCharacteristic: this): CharacteristicComparison<Example> | undefined {
		if (!(this.data && this.hasData && otherCharacteristic.data && otherCharacteristic.hasData)) return;

		const 	thisContractionRatio: number = this.data.contracted.length / (this.data.full.length || 1),
				otherContractionRatio: number = otherCharacteristic.data.contracted.length / (otherCharacteristic.data.full.length || 1),
				examples: Pair<Example>[] = [];
		
		for (const [full, contraction] of contractions)
			examples.push(
				...Utilities.Discord.matchMessages(this.data.full, otherCharacteristic.data.full, (thisFullMessage, otherFullMessage) =>
					full.test(thisFullMessage.content) && full.test(otherFullMessage.content)
				),
				...Utilities.Discord.matchMessages(this.data.contracted, otherCharacteristic.data.contracted, (thisContractedMessage, otherContractedMessage) =>
					contraction.test(thisContractedMessage.content) && contraction.test(otherContractedMessage.content)
				)
			);

		return new CharacteristicComparison(this, otherCharacteristic,
			Utilities.Math.calculateSimilarity(thisContractionRatio, otherContractionRatio, this.configurations.contractionRatioDistanceFactor),
			examples,
			Utilities.Discord.formatMessage
		);
	}

	get hasData(): boolean { return !!this.data && !!(this.data.full.length || this.data.contracted.length); }
}