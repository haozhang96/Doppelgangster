// Import external libraries.
import * as $TypeORM from "typeorm";

// Define the entity.
@$TypeORM.Entity("gatekeeper_sessions")
export class GatekeeperSession {
    @$TypeORM.PrimaryColumn()
    public sessionID!: string;

    @$TypeORM.Column()
    public secret!: string;
}
