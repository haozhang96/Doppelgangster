// Import internal components.
import {
    Controller, ControllerClass,
} from "@/core/base/controllers/controller";

/**
 * TODO
 */
export abstract class PersistenceController extends Controller { }

/**
 * Define the PersistenceController's class type with the abstract property
 *   removed.
 */
export type PersistenceControllerClass =
    ControllerClass<typeof PersistenceController, PersistenceController>;
