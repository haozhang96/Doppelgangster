// Import internal components.
import {
    Controller, ControllerConstructor,
} from "@/core/base/controllers/controller";

/**
 * TODO
 */
export abstract class ProfileController extends Controller { }

/**
 * Define the profile controller's constructor type with the abstract property
 *   removed.
 */
export type ProfileControllerConstructor =
    ControllerConstructor<typeof ProfileController, ProfileController>;
