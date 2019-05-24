export interface ICollection<T> {
    get(...args: any[]): T;
    remove(...args: any[]): boolean;
    clear(): void;
    contains(...args: any[]): boolean;
    indexOf(...args: any[]): number;
}
