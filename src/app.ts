// Enable support for module alias resolution.
import "module-alias/register";

// Import internal components.
import { Doppelgangster } from "@/core";

// Suppress (catch and print) uncaught exceptions so they won't break the bot.
Doppelgangster.suppressUncaughtExceptions();

// Initialize the bot.
export let doppelgangster: Doppelgangster = new Doppelgangster();
