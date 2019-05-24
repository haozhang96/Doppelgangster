export interface IInitializable {
	initialized: boolean;
	initialize(...args: any[]): any;
}

export interface IStaticInitializable extends IInitializable {
	new (): any;
}