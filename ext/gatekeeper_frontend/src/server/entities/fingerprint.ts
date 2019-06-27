// Import external libraries.
import * as $JSONSchema from "jsonschema";
import * as $TypeORM from "typeorm";

const validator: $JSONSchema.Validator = new $JSONSchema.Validator();

/**
 * Save a fingerprint for the user attached to a given session ID.
 * @param sessionID The session ID that is attached to the user for which the
 *   fingerprint is to be saved for
 * @param fingerprint The fingerprint to save
 */
export function saveFingerprint(sessionID: string, fingerprint: object): void {
    // Perform validation.
    

    return;
}

// Define the entity.
@$TypeORM.Entity("fingerprints")
export class Fingerprint {
    @$TypeORM.PrimaryColumn()
    public userID!: string;

    @$TypeORM.Column()
    public fingerprints!: object[];
}
