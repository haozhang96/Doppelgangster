export class TypeMismatchError extends TypeError {
    constructor(
        public readonly givenType: string,
        public readonly expectedType: string,
    ) {
        super(
            `Type "${
                expectedType
            }" was expected, but "${
                givenType
            }" was given!`,
        );
    }
}
