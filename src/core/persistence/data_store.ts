import { Model } from "@/core/persistence/model";

import { NotOverriddenError } from "@/common/errors";

export abstract class DataStore {
    protected static create(): Model { throw new NotOverriddenError(); }
    protected static read(): Model { throw new NotOverriddenError(); }
    protected static update(): boolean { throw new NotOverriddenError(); }
    protected static delete(): boolean { throw new NotOverriddenError(); }
}
