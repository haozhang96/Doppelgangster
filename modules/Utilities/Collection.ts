export const Collection: {
    haveOneIntersection(one: Iterable<any>, two: Iterable<any>): boolean;
} = {
    haveOneIntersection(one: Iterable<any>, two: Iterable<any>): boolean {
        for (const oneValue of one)
            for (const twoValue of two)
                if (oneValue === twoValue)
                    return true;
        return false;
        /*const oneValues: Set<any> = new Set(one);
        for (const twoValue of two)
            if (oneValues.has(twoValue))
                return true;*/
    }
};