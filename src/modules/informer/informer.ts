// Import Doppelgangster components.
import { Doppelgangster } from "@/core";
import { Module } from "@/core/base/module";
import { CharacteristicConstructor } from "@/core/heuristic/characteristic";
import { CommandConstructor } from "@/core/interaction/command";

/**
 * TODO
 */
export class Informer extends Module {
    public readonly characteristics: CharacteristicConstructor[] = [];
    public readonly commands: CommandConstructor[] = [];

    constructor(doppelgangster: Doppelgangster) {
        super(doppelgangster);

        doppelgangster.logger.info("Informer says hello!");
    }

    public destroy(): void {
        return;
    }
}
