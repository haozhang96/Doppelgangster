// Import internal components.
import { TypeORMEntity, TypeORMEntityPrimaryKey } from "@/persistence/typeorm";
import { MyRepository } from "@/persistence/typeorm/repositories/my_repository";

// Import external libraries.
import * as $TypeORM from "typeorm";

export class MyEntity extends TypeORMEntity<MyEntity, MyRepository, string> {
    public primaryKey: TypeORMEntityPrimaryKey<MyEntity> = "a";
    public a: string = "hi";
    public b: string = "there";

    protected typeormEntity = new $TypeORM.BaseEntity();

    public serialize(): string {
        return "wow";
    }
}
