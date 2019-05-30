export interface ISerializable<T> {
    serialize(): T;
    deserialize(data: T): void;
}
