export interface ISerializable<T> {
    serialize(...args: any[]): T;
}
