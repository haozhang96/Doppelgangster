export interface IDisableable {
    enabled: boolean;
    enable(): void;
    disable(): void;
}
