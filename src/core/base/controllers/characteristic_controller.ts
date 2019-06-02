// Import internal components.
import {
    Controller, ControllerConstructor,
} from "@/core/base/controllers/controller";
import { Characteristic } from "@/core/heuristic/characteristic";
import { Profile } from "@/core/heuristic/profile";

/**
 * TODO
 */
export abstract class CharacteristicController extends Controller {
    public readonly characteristics: Map<Profile, Characteristic<any>> =
        new Map();
}

/**
 * Define the CharacteristicController's constructor type with the abstract
 *   property removed.
 */
export type CharacteristicControllerConstructor = ControllerConstructor<
    typeof CharacteristicController,
    CharacteristicController
>;
