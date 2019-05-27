// Import internal components.
import { IMappedObject } from "@/common/interfaces";
import { Callback } from "@/common/types";

function mapValues<T, U = T>(
    object: IMappedObject<T>,
    callback: Callback<T, U>,
): IMappedObject<U> {
    const newObject: IMappedObject<U> = {};

    for (const [key, value] of Object.entries(object)) {
        newObject[key] = callback(value);
    }

    return newObject;
}

// Expose components.
export const ObjectUtils = {
    mapValues,
};
