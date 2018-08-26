import { readdirSync as listFiles } from "fs";

import { Profile, Characteristic } from "@";


export const Characteristics: (new (profile: Profile) => Characteristic<any>)[] = [];
for (const type of ["Incomparable", "Comparable"])
	for (const characteristic of listFiles("modules/Characteristic/Characteristics/" + type))
		if (characteristic.endsWith(".ts"))
			Characteristics.push(require(`./${type}/${characteristic.slice(0, -3)}`).default);