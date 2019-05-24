import * as Discord from "discord.js";
import * as Statistics from "simple-statistics";

import { ComparableCharacteristic, CharacteristicComparison } from "@/Characteristic";
import * as Utilities from "@/Utilities";
import Logger from "@/Logger";


type Data = number[];
type Example = number;

export default class extends ComparableCharacteristic<Data, Example> {
	name = "Behavior.TypingSpeed";
	description = "Median typing speed in characters per minute (CPM)";
	weight = 3;
	configurations = {
		minimumMessageLength: 10, maxCPM: 1000, typingTimeout: 60000,
		cpmDistanceFactor: 5e3, cpmNormalizationFactor: 3, cpmLengthNormalizationFactor: 2
	};
	
	async collector(): Promise<void> {
		const data: Data = this.data = [];
		let listening: boolean;

		this.profile.user.client.on("typingStart", async (channel, user) => {
			if (user === this.profile.user && !listening) {
				// Logger.info(`"${this.profile.user.username}" started typing in "${(channel as Discord.TextChannel).name}".`);
				const startedTyping: number = +user.typingSinceIn(channel); listening = true;

				const receivedMessage: Discord.Message = await Utilities.Event.listenWithTimeout<Discord.Message>(this.profile.user.client, "message", (message: Discord.Message | undefined) => {
					if (message && message.channel === channel && message.author === this.profile.user) return message;
				}, this.configurations.typingTimeout);

				if (receivedMessage)
					if (receivedMessage.content.length >= this.configurations.minimumMessageLength) {
						const duration: number = receivedMessage.createdTimestamp - startedTyping, cpm: number = receivedMessage.content.length / (duration / 60000);

						if (cpm <= this.configurations.maxCPM) {
							data.push(cpm * Math.exp(this.configurations.cpmNormalizationFactor / receivedMessage.content.length ** this.configurations.cpmLengthNormalizationFactor)); this.emit("data");
							Logger.info(`"${this.profile.user.username}" typed ${receivedMessage.content.length} characters for ${duration} milliseconds at ${Math.round(cpm)} (${Math.round(data[data.length - 1])} normalized) CPM.`);
						}/*
							Logger.info(`"${this.profile.user.username}" has sent a message but its CPM is higher than ${this.configurations.maxCPM}.`);*/
					}/* else
						Logger.info(`"${this.profile.user.username}" has sent a message but it was shorter than the minimum length of ${this.configurations.minimumMessageLength}.`);
				else
					Logger.info(`"${this.profile.user.username}" started typing but didn't send a message within ${Math.round(this.configurations.typingTimeout / 1000)} seconds.`);*/
				listening = false;
			}
		});
	}

	comparator(otherCharacteristic: this): CharacteristicComparison<Example> | undefined {
		if (!(this.data && otherCharacteristic.data)) return;

		const thisMedianCPM: number = Statistics.medianSorted(this.data), otherMedianCPM: number = Statistics.medianSorted(otherCharacteristic.data);
		return new CharacteristicComparison(this, otherCharacteristic,
			Utilities.Math.calculateSimilarity(thisMedianCPM, otherMedianCPM, this.configurations.cpmDistanceFactor),
			[{one: thisMedianCPM, two: otherMedianCPM}]
		);
	}
}