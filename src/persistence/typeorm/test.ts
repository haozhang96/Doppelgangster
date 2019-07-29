import { doppelgangster } from "@/app";
import { TypeORMPersistenceController } from "@/controllers/persistence";
// import { MyEntity } from "./entities/my_entity";
import { MyRepository } from "./repositories/my_repository";

new TypeORMPersistenceController(
    doppelgangster,
).initialize().then(async (controller) => {
    const a = new MyRepository(controller);
    const b = await controller.getRepository(MyRepository);

    alert(a.fromJSON("{a:1}") === b.fromJSON("{a:1}"));
});
