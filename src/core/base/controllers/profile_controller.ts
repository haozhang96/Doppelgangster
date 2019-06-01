// Import internal components.
import {
    Controller, ControllerConstructor,
} from "@/core/base/controllers/controller";

/**
 * STUB
 */
export abstract class ProfileController extends Controller { }

/**
 * Define the profile controller's constructor type with the abstract property
 *   removed.
 */
export type ProfileControllerConstructor =
    ControllerConstructor<typeof ProfileController, ProfileController>;
