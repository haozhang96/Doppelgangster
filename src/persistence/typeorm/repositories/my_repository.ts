// Import internal components.
import { TypeORMRepository } from "@/persistence/typeorm";
import { MyEntity } from "@/persistence/typeorm/entities/my_entity";

export class MyRepository extends TypeORMRepository<typeof MyEntity, string> {
    protected entityClass = MyEntity;
}
