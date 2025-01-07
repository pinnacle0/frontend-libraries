import {DistributionGenerator} from "../../src/core/DistributionGenerator.js";
import {describe, test, expect} from "vitest";

describe("DistributionGenerator.boxMullerTransform", () => {
    test("within value range [0, 100] for 1000 random values", () => {
        for (let i = 0; i < 1000; i++) {
            const randomValue = DistributionGenerator.boxMullerTransform(0, 100);
            expect(randomValue).toBeGreaterThanOrEqual(0);
            expect(randomValue).toBeLessThanOrEqual(100);
        }
    });
});

describe("DistributionGenerator iterator next()", () => {
    test("successive calls within value range [0, 100] and change range [0, 20] for 1000 changes", () => {
        const distribution = new DistributionGenerator(0, 100, 0, 20);
        expect(distribution.next()).toBeGreaterThanOrEqual(0);
        expect(distribution.next()).toBeLessThanOrEqual(100);
        for (let i = 0; i < 1000; i++) {
            const currVal = distribution.next();
            const nextVal = distribution.next();
            expect(currVal).toBeGreaterThanOrEqual(0);
            expect(currVal).toBeLessThanOrEqual(100);
            expect(nextVal).toBeGreaterThanOrEqual(0);
            expect(nextVal).toBeLessThanOrEqual(100);
            expect(Math.abs(nextVal - currVal)).toBeGreaterThanOrEqual(0);
            expect(Math.abs(nextVal - currVal)).toBeLessThanOrEqual(20);
        }
    });
});
