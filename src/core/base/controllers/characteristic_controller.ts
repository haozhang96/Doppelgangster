// Import internal components.
import {
    Controller, ControllerConstructor,
} from "@/core/base/controllers/controller";

/**
 * TODO
 */
export abstract class CharacteristicController extends Controller { }

/**
 * Define the characteristic controller's constructor type with the abstract
 *   property removed.
 */
export type CharacteristicControllerConstructor = ControllerConstructor<
    typeof CharacteristicController,
    CharacteristicController
>;
