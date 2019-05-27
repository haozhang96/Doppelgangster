export type Class = Function; // tslint:disable-line:ban-types

export type InstantiableClass<InstanceT = {}> = Class & (
    new (...args: any[]) => InstanceT
);
