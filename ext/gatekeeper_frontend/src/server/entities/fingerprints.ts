// Import external libraries.
import * as $TypeORM from "typeorm";

@$TypeORM.Entity()
export default class Fingerprints {
    @$TypeORM.PrimaryGeneratedColumn()
    public _id!: $TypeORM.ObjectID;

    @$TypeORM.Column()
    public userID!: string;

    @$TypeORM.Column()
    public fingerprints!: string;
}

// Define the model.
/*const fingerprints: $Waterline.CollectionClass = $Waterline.Collection.extend({
    connection: "default",
    dataEncryptionKeys: { default: process.env.DATABASE_DATA_ENCRYPTION_KEY },
    datastore: "default",
    identity: "fingerprints",
    primaryKey: "id",

    attributes: {
        id: {
            type : "string",
        },

        userID: {
            required: true,
            type: "number",
        },

        fingerprints: {
            // encrypt: true,
            required: true,
            type: "json",
        },
    },

    beforeCreate(
        user: $Waterline.ModelInstance,
        done: $Waterline.Callback<$Waterline.ModelInstance>,
    ): void {
        return;
    },
} as $Waterline.CollectionDefinition);

// Expose the model.
export default Fingerprints;*/
