export const Collection: {
    haveOneIntersection(one: Iterable<any>, two: Iterable<any>): boolean;
} = {
    haveOneIntersection(one: Iterable<any>, two: Iterable<any>): boolean {
        const oneValues: Set<any> = new Set(one);
        for (const twoValue of two)
            if (oneValues.has(twoValue))
                return true;
        return false;
    }
};