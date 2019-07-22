// Import internal components.
import { Profile } from "@/core/heuristic/profile";
import { IFingerprint } from "../../interfaces";

export interface IFingerprintEntity {
    getFingerprints(profile: Profile): IFingerprint[];
}
