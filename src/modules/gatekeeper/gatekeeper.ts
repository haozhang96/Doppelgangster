// Import Doppelgangster components.
import { Doppelgangster } from "@/core";
import { Module } from "@/core/base/module";
import { CommandConstructor } from "@/core/interaction/command";

/**
 * STUB
 */
export class Gatekeeper extends Module {
    constructor(doppelgangster: Doppelgangster) {
        super(doppelgangster);
    }

    public destroy(): void {
        return;
    }

    public get commands(): CommandConstructor[] {
        return [];
    }
}
