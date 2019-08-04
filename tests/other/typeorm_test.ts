import { doppelgangster } from "@/app";
import { TypeORMPersistenceController } from "@/controllers/persistence";
import {
    FingerprintEntity, FingerprintRepository,
} from "@/modules/gatekeeper/persistence/typeorm/fingerprint";

(async () => {
    const controller = new TypeORMPersistenceController(doppelgangster);
    const repository: FingerprintRepository =
        await controller.getRepository(FingerprintRepository);
    const entity: FingerprintEntity =
        await repository.read(repository.create());

    alert(entity);
})();
