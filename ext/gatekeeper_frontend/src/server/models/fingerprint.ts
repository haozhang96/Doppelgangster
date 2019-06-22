// Import external libraries.
import * as $Waterline from "waterline";

// Define the model.
const fingerprint: $Waterline.CollectionClass = $Waterline.Collection.extend({
    datastore: "default",
    identity: "fingerprint",
    primaryKey: "userID",

    attributes: {
        userID: { type: "number" },
    },
} as any);

// Expose the model.
export default fingerprint;
