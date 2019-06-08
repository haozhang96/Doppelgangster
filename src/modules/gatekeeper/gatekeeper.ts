// Import Doppelgangster components.
import { Doppelgangster } from "@/core";
import { Module } from "@/core/base/module";
import { CharacteristicConstructor } from "@/core/heuristic/characteristic";
import { CommandConstructor } from "@/core/interaction/command";
import { getDefaultClassesInDirectory } from "@/utilities/reflection";

/**
 * TODO
 */
export class Gatekeeper extends Module {
    public readonly characteristics: CharacteristicConstructor[] =
        getDefaultClassesInDirectory(__dirname, "characteristics");
    public readonly commands: CommandConstructor[] = [];

    constructor(doppelgangster: Doppelgangster) {
        super(doppelgangster);

        doppelgangster.logger.info("Gatekeeper says hello!");
    }

    public destroy(): void {
        return;
    }
}
