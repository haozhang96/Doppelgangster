// Import Doppelgangster components.
import { DiscordGuildAttachable, Mix } from "@/common/mixins";
import { Doppelgangster } from "@/core";
import { Module } from "@/core/base/module";

/**
 * TODO
 */
export class Gatekeeper extends Mix(Module)
    .with(DiscordGuildAttachable)
.compose() {
    public characteristics = Module.getCharacteristicClasses(__dirname);
    public commands = Module.getCommandClasses(__dirname);
    public entities = Module.getEntityClasses(__dirname, this.doppelgangster);

    constructor(doppelgangster: Doppelgangster) {
        super(doppelgangster);

        doppelgangster.logger.info("Gatekeeper says hello!");
    }

    public destroy(): void {
        return;
    }
}
