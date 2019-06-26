// Import Doppelgangster components.
import { Doppelgangster } from "@/core";
import { Module } from "@/core/base/module";
import { CharacteristicClass } from "@/core/heuristic/characteristic";
import { CommandClass } from "@/core/interaction/command";
import { getDefaultClassesInDirectory } from "@/utilities/reflection";

/**
 * TODO
 */
export class Gatekeeper extends Module {
    public readonly characteristics: CharacteristicClass[] =
        getDefaultClassesInDirectory(__dirname, "characteristics");
    public readonly commands: CommandClass[] = [];

    constructor(doppelgangster: Doppelgangster) {
        super(doppelgangster);

        doppelgangster.logger.info("Gatekeeper says hello!");
    }

    public destroy(): void {
        return;
    }
}
