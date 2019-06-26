// Enable support for TypeORM decorators.
import "reflect-metadata";

// Enable support for module alias resolution (@/... paths).
import "module-alias/register";

// Import internal components.
import { Doppelgangster } from "@/core";

// Suppress (catch and print) uncaught exceptions so they won't break the bot.
Doppelgangster.suppressUncaughtExceptions();

// Initialize the bot.
export const doppelgangster: Doppelgangster = new Doppelgangster();

// Below is the testing area.
