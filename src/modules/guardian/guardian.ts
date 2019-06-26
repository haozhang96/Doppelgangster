// Import Doppelgangster components.
import { Doppelgangster } from "@/core";
import { Module } from "@/core/base/module";
import { CharacteristicClass } from "@/core/heuristic/characteristic";
import { CommandClass } from "@/core/interaction/command";

/**
 * TODO
 */
export class Guardian extends Module {
    public readonly characteristics: CharacteristicClass[] = [];
    public readonly commands: CommandClass[] = [];

    constructor(doppelgangster: Doppelgangster) {
        super(doppelgangster);

        doppelgangster.logger.info("Guardian says hello!");
    }

    public destroy(): void {
        return;
    }
}
