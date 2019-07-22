// Import Doppelgangster components.
import { Doppelgangster } from "@/core";
import { Module } from "@/core/base/module";

/**
 * TODO
 */
export class Guardian extends Module {
    constructor(doppelgangster: Doppelgangster) {
        super(doppelgangster);

        doppelgangster.logger.info("Guardian says hello!");
    }

    public destroy(): void {
        return;
    }
}
