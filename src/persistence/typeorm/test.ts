import { doppelgangster } from "@/app";
import { TypeORMPersistenceController } from "@/controllers/persistence";
import { MyEntity } from "@/persistence/typeorm/entities/my_entity";
import { MyRepository } from "@/persistence/typeorm/repositories/my_repository";

new TypeORMPersistenceController(doppelgangster).initialize().then(async (
    controller,
) => {
    const repositoryA = new MyRepository(controller);
    const entityA = new MyEntity(repositoryA);
    entityA.load();

    const repositoryB = await controller.getRepository(MyRepository);
    const entityB = await repositoryB.create();
    repositoryB.read(entityB);

    alert(repositoryA.fromJSON("{a:1}") === repositoryB.fromJSON("{a:1}"));
});
