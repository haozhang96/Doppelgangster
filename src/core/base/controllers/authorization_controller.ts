// Import internal components.
import {
    Controller, ControllerClass,
} from "@/core/base/controllers/controller";

/**
 * TODO
 */
export abstract class AuthorizationController extends Controller { }

/**
 * Define the AuthorizationController's class type with the abstract property
 *   removed.
 */
export type AuthorizationControllerClass = ControllerClass<
    typeof AuthorizationController,
    AuthorizationController
>;
