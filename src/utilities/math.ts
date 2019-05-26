function calculateSimilarity(a: number, b: number, factor: number): number {
    return global.Math.exp((a - b) ** 2 / -factor);
}

// Expose components.
export const MathUtils = {
    calculateSimilarity,
};
