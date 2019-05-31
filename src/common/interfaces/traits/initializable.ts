export interface IInitializable {
    initialized: boolean;
    initialize(...args: any[]): void;
}

export interface IStaticInitializable extends IInitializable {
    new (): any;
}
