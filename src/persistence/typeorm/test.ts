import { doppelgangster } from "@/app";
import { TypeORMPersistenceController } from "@/controllers/persistence";
import {
    MyEntity, MyFakeEntity,
} from "@/persistence/typeorm/entities/my_entity";
import {
    MyFakeRepository, MyRepository,
} from "@/persistence/typeorm/repositories/my_repository";

(async () => {
    // Attach a persistence controller to a Doppelgangster instance.
    const controller =
        await new TypeORMPersistenceController(doppelgangster).initialize();

    // First way
    const repositoryA: MyRepository = new MyRepository(controller);
    const entityA: MyEntity = await (new MyEntity(repositoryA)).load();
    entityA.a = "hi";

    // Second way
    const repositoryB: MyRepository =
        await controller.getRepository(MyRepository);
    const entityB: MyEntity =
        await repositoryB.read(await repositoryB.create());
    entityB.a = "hi";

    // Another repository + entity
    const repositoryC: MyFakeRepository = new MyFakeRepository(controller);
    const entityC: MyFakeEntity = await (new MyFakeEntity(repositoryC)).load();
    entityC.destroy();

    // No type errors
    alert(entityA.a === entityB.a);
    alert(repositoryA.fromJSON("{}").a === repositoryB.fromJSON("{}").a);
    alert(new MyEntity(new MyRepository(controller)));
    alert(new MyFakeEntity(new MyFakeRepository(controller)));

    // Type errors
    alert(new MyEntity(new MyFakeRepository(controller)));
    alert(new MyFakeEntity(new MyRepository(controller)));
})();
