// Import internal components.
import {
    Controller, ControllerConstructor,
} from "@/core/base/controllers/controller";

/**
 * TODO
 */
export abstract class AuthorizationController extends Controller { }

/**
 * Define the authorization controller's constructor type with the abstract
 *   property removed.
 */
export type AuthorizationControllerConstructor = ControllerConstructor<
    typeof AuthorizationController,
    AuthorizationController
>;
