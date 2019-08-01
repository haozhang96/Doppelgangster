// Import internal components.
import { Promisable } from "@/common/types";
import { Profile } from "@/core/heuristic/profile";
import { IFingerprint } from "@/modules/gatekeeper/interfaces";

export interface IFingerprintRepository {
    getFingerprints(profile: Promisable<Profile>): Promisable<IFingerprint[]>;
}
