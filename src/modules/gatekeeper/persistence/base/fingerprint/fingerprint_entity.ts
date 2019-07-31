// Import internal components.
import { IFingerprint } from "@/modules/gatekeeper/interfaces";

export interface IFingerprintEntity {
    userID: string;
    fingerprints: IFingerprint[];
}
