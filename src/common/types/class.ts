export type Class = Function; // tslint:disable-line: ban-types

export type InstantiableClass<InstanceT = {}> = Class & (
    new (...args: any[]) => InstanceT
);

export type ClassConstructorCallSignature<ClassT extends InstantiableClass> =
    ClassT extends new (...args: infer R) => any ? R : never;
