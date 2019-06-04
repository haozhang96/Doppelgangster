// Import Doppelgangster components.
import { Doppelgangster } from "@/core";
import { Module } from "@/core/base/module";
import { CharacteristicConstructor } from "@/core/heuristic/characteristic";
import { CommandConstructor } from "@/core/interaction/command";
import * as Utilities from "@/utilities";

// Import built-in libraries.
import * as $Path from "path";

/**
 * TODO
 */
export class Gatekeeper extends Module {
    public readonly characteristics: CharacteristicConstructor[] =
        getCharacteristicClasses();
    public readonly commands: CommandConstructor[] = [];

    constructor(doppelgangster: Doppelgangster) {
        super(doppelgangster);

        doppelgangster.logger.log("Gatekeeper says hello!");
    }

    public destroy(): void {
        return;
    }
}

/**
 * Return all the characteristic classes found in /this_module/characteristics.
 */
function getCharacteristicClasses(): CharacteristicConstructor[] {
    return Utilities.reflection.getDefaultClassesInDirectory(
        $Path.resolve(__dirname, "characteristics"),
    );
}
