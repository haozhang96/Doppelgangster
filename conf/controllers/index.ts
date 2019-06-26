import { IMappedObject } from "@/common/interfaces";
import * as CharacteristicControllers from "@/controllers/characteristic";
import * as CommandControllers from "@/controllers/command";
import * as LoggingControllers from "@/controllers/logging";
import * as ModuleControllers from "@/controllers/module";
import * as ProfileControllers from "@/controllers/profile";
import * as Controllers from "@/core/base/controllers";

/**
 * Define how the controllers object must be defined at the bottom.
 */
interface IControllerClasses extends IMappedObject<
    Controllers.ControllerClass[]
> {
    authorization: Controllers.AuthorizationControllerClass[];
    characteristic: Controllers.CharacteristicControllerClass[];
    command: Controllers.CommandControllerClass[];
    logging: Controllers.LoggingControllerClass[];
    module: Controllers.ModuleControllerClass[];
    persistence: Controllers.PersistenceControllerClass[];
    profile: Controllers.ProfileControllerClass[];
}

/**
 * Define which controller implementations will be used by Doppelgangster.
 */
export const controllers: Readonly<IControllerClasses> = {
    // Initialize the logging controllers first.
    logging: [
        LoggingControllers.ConsoleLoggingController,
        LoggingControllers.FileLoggingController,
    ],

    authorization: [],

    characteristic: [
        CharacteristicControllers.BasicCharacteristicController,
    ],

    command: [
        CommandControllers.TextCommandController,
    ],

    module: [
        ModuleControllers.BasicModuleController,
    ],

    persistence: [],

    profile: [
        ProfileControllers.BasicProfileController,
    ],
};
