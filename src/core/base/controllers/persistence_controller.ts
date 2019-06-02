// Import internal components.
import {
    Controller, ControllerConstructor,
} from "@/core/base/controllers/controller";

/**
 * TODO
 */
export abstract class PersistenceController extends Controller { }

/**
 * Define the PersistenceController's constructor type with the abstract
 *   property removed.
 */
export type PersistenceControllerConstructor =
    ControllerConstructor<typeof PersistenceController, PersistenceController>;
