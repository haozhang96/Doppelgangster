// Import internal components.
import { TypeORMRepository } from "@/persistence/typeorm";
import { MyEntity } from "@/persistence/typeorm/entities/my_entity";

export class MyRepository extends TypeORMRepository<MyEntity, string> {
    protected entityClass = MyEntity;
}
