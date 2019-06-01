// Import Doppelgangster components.
import { ModuleController } from "@/core/base/controllers";
import { Module } from "@/core/base/module";
import { CommandConstructor } from "@/core/interaction/command";

/**
 * STUB
 */
export class Gatekeeper extends Module {
    constructor(controller: ModuleController) {
        super(controller);
    }

    public destroy(): void {
        return;
    }

    public getCommands(): CommandConstructor[] {
        return [];
    }
}
