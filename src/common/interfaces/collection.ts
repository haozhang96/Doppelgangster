export interface ICollection<T> {
    clear(): void;
    contains(...args: any[]): boolean;
    get(...args: any[]): T;
    indexOf(...args: any[]): number;
    remove(...args: any[]): boolean;
}
