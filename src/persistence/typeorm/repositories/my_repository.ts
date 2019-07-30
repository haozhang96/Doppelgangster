// tslint:disable: max-classes-per-file

// Import internal components.
import { TypeORMRepository } from "@/persistence/typeorm";
import {
    MyEntity, MyFakeEntity,
} from "@/persistence/typeorm/entities/my_entity";

export class MyRepository extends TypeORMRepository<MyEntity, string> {
    protected entityClass = MyEntity;
}

export class MyFakeRepository extends TypeORMRepository<MyFakeEntity, string> {
    protected entityClass = MyFakeEntity;
}
