export type RefreshCallback = (...args: any[]) => void;

export interface IRefreshCallbackDescriptor {
    callback: RefreshCallback;
    interval?: number;
}
