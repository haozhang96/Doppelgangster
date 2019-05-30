// Import internal components.
import {
    Controller, ControllerConstructor,
} from "@/core/base/controllers/controller";

/**
 * STUB
 */
export abstract class PersistenceController extends Controller { }

/**
 * Define the persistence controller's constructor type with the abstract
 *   property removed.
 */
export type PersistenceControllerConstructor =
    ControllerConstructor<typeof PersistenceController, PersistenceController>;
