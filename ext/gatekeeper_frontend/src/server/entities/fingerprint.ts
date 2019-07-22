import { IFingerprint } from "../interfaces";
import { fingerprintSchema } from "../schemas/fingerprint";

// Import external libraries.
import * as $JSONSchema from "jsonschema";
import * as $TypeORM from "typeorm";

/**
 * Save a fingerprint for the user attached to a given session ID.
 * @param sessionID The session ID attached to the user for which the
 *   fingerprint is to be saved for
 * @param fingerprint The fingerprint to save
 */
export function saveFingerprint(sessionID: string, fingerprint: object): void {
    // Validate the fingerprint against the JSON schema.
    const validator: $JSONSchema.Validator = new $JSONSchema.Validator();
    const validationResult: $JSONSchema.ValidatorResult =
        validator.validate(fingerprint, fingerprintSchema);

    if (!validationResult.valid) {
        console.warn(
            "Fingerprint validation error:",
            validationResult.errors,
        );
        return;
    }

    // TODO
}

// Define the entity.
@$TypeORM.Entity("fingerprints")
export class Fingerprint {
    @$TypeORM.PrimaryColumn()
    public userID!: string;

    @$TypeORM.Column("simple-json")
    public fingerprints!: IFingerprint[];
}
