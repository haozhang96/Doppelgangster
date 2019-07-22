// Import Doppelgangster components.
import { Doppelgangster } from "@/core";
import { Module } from "@/core/base/module";

/**
 * TODO
 */
export class Scribe extends Module {
    constructor(doppelgangster: Doppelgangster) {
        super(doppelgangster);

        doppelgangster.logger.info("Scribe says hello!");
    }

    public destroy(): void {
        return;
    }
}
