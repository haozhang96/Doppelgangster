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
interface IControllerConstructors extends IMappedObject<
    Controllers.ControllerConstructor[]
> {
    authorization: Controllers.AuthorizationControllerConstructor[];
    characteristic: Controllers.CharacteristicControllerConstructor[];
    command: Controllers.CommandControllerConstructor[];
    logging: Controllers.LoggingControllerConstructor[];
    module: Controllers.ModuleControllerConstructor[];
    persistence: Controllers.PersistenceControllerConstructor[];
    profile: Controllers.ProfileControllerConstructor[];
}

/**
 * Define which controller implementations will be used by Doppelgangster.
 */
export const controllers: Readonly<IControllerConstructors> = {
    authorization: [],

    characteristic: [
        CharacteristicControllers.BasicCharacteristicController,
    ],

    command: [
        CommandControllers.TextCommandController,
    ],

    logging: [
        LoggingControllers.ConsoleLoggingController,
        LoggingControllers.FileLoggingController,
    ],

    module: [
        ModuleControllers.BasicModuleController,
    ],

    persistence: [],

    profile: [
        ProfileControllers.BasicProfileController,
    ],
};
