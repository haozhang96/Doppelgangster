export type Class = Function; // tslint:disable-line: ban-types

export type InstantiableClass<ClassT extends Class = Class, InstanceT = {}> =
    Class & (
        ClassT extends new (...args: infer R) => InstanceT ?
            new (...args: R) => InstanceT
        :
            new (...args: any[]) => InstanceT
    );

export type ClassConstructorCallSignature<ClassT extends InstantiableClass> =
    ClassT extends new (...args: infer R) => any ? R : never;

export type ClassConstructorCallSignatureWithoutFirstArg<
    ClassT extends InstantiableClass
> = ClassT extends new (_: any, ...args: infer R) => any ? R : never;
