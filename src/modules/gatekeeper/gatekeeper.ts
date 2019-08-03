// Import Doppelgangster components.
import { DiscordGuildAttachable, Mix } from "@/common/mixins";
import { Doppelgangster } from "@/core";
import { Module } from "@/core/base/module";
import { EntityClass } from "@/core/base/persistence";
import { CharacteristicClass } from "@/core/heuristic/characteristic";
import { CommandClass } from "@/core/interaction/command";
import { getDefaultClassesInDirectory } from "@/utilities/reflection";

/**
 * TODO
 */
export class Gatekeeper extends Mix(Module)
    .with(DiscordGuildAttachable)
.compose() {
    public readonly characteristics: CharacteristicClass[] =
        getDefaultClassesInDirectory(__dirname, "characteristics");
    public readonly commands: CommandClass[] =
        getDefaultClassesInDirectory(__dirname, "commands");
    public readonly entities: Array<EntityClass<any, any>> =
        getDefaultClassesInDirectory(__dirname, "entities");

    constructor(doppelgangster: Doppelgangster) {
        super(doppelgangster);

        doppelgangster.logger.info("Gatekeeper says hello!");
    }

    public destroy(): void {
        return;
    }
}
