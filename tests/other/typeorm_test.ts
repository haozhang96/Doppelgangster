import { doppelgangster } from "@/app";
import { TypeORMPersistenceController } from "@/controllers/persistence";
import {
    FingerprintEntity, FingerprintRepository,
} from "@/modules/gatekeeper/persistence/typeorm/fingerprint";

(async () => {
    // Attach a persistence controller to a Doppelgangster instance.
    const controller =
        await new TypeORMPersistenceController(doppelgangster).initialize();

    const repository: FingerprintRepository =
        await controller.getRepository(FingerprintRepository);
    const entity: FingerprintEntity =
        await repository.read(repository.create());

    alert(entity);
})();
