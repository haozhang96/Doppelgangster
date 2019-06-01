// Import Doppelgangster components.
import { Doppelgangster } from "@/core";
import { Module } from "@/core/base/module";
import { CommandConstructor } from "@/core/interaction/command";

/**
 * STUB
 */
export class Gatekeeper extends Module {
    public readonly commands: CommandConstructor[] = [];

    constructor(doppelgangster: Doppelgangster) {
        super(doppelgangster);

        doppelgangster.logger.log("Gatekeeper says hello!");
    }

    public destroy(): void {
        return;
    }
}
