// Import external libraries.
import * as $JSONSchema from "jsonschema";
import * as $TypeORM from "typeorm";

// Define the schema to validate fingerprint objects against.
const schema: $JSONSchema.Schema = {
    id: "/Fingerprint",
    properties: {

    },
    type: "object",
};

/**
 * Save a fingerprint for the user attached to a given session ID.
 * @param sessionID The session ID that is attached to the user for which the
 *   fingerprint is to be saved for
 * @param fingerprint The fingerprint to save
 */
export function saveFingerprint(sessionID: string, fingerprint: object): void {
    // Validate the fingerprint against the JSON schema.
    const validator: $JSONSchema.Validator = new $JSONSchema.Validator();
    const validationResult: $JSONSchema.ValidatorResult =
        validator.validate(fingerprint, schema);

    if (!validationResult.valid) {
        console.warn(
            "Fingerprint validation error:",
            validationResult.errors,
        );
        return;
    }


}

// Define the entity.
@$TypeORM.Entity("fingerprints")
export class Fingerprint {
    @$TypeORM.PrimaryColumn()
    public userID!: string;

    @$TypeORM.Column()
    public fingerprints!: object[];
}
