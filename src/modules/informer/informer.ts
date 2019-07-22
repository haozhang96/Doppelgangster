// Import Doppelgangster components.
import { Doppelgangster } from "@/core";
import { Module } from "@/core/base/module";

/**
 * TODO
 */
export class Informer extends Module {
    constructor(doppelgangster: Doppelgangster) {
        super(doppelgangster);

        doppelgangster.logger.info("Informer says hello!");
    }

    public destroy(): void {
        return;
    }
}
