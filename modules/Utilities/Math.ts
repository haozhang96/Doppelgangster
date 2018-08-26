export const Math: {
    calculateSimilarity(one: number, two: number, distanceFactor: number): number;
} = {
    calculateSimilarity(one: number, two: number, distanceFactor: number): number {
        return global.Math.exp((one - two) ** 2 / -distanceFactor);
    }
};