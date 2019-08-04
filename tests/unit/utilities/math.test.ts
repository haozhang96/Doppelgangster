// Import internal components.
import { MathUtils } from "@/utilities";

// Import external libraries.
import { expect } from "chai";
import "mocha";

describe("calculateSimilarity", ({ calculateSimilarity } = MathUtils) => {
    it("should return NaN when factor is 0", () => {
        expect(isNaN(calculateSimilarity(0, 0, 0))).to.equal(true);
    });

    it("should return 1 when a and b are equal", () => {
        expect(calculateSimilarity(1, 1, 1)).to.equal(1);
    });
});
