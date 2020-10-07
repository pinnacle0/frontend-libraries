import crypto from "crypto";
import {RandomUtil} from "../../src/core/RandomUtil";

describe("RandomUtil.fromArray", () => {
    test("returns null if array is empty", () => {
        expect(RandomUtil.fromArray([])).toBeNull();
    });

    test("item is in array", () => {
        const array = [1, 2, "a", "b"];
        Array.from({length: 300}).forEach(() => {
            const randomItem = RandomUtil.fromArray(array);
            expect(array).toContain(randomItem);
        });
    });
});

describe("RandomUtil.integerBetween", () => {
    test("random number is within range", () => {
        const possibleNums = [1, 2, 3, 4, 5];
        Array.from({length: 300}).forEach(() => {
            const randomNum = RandomUtil.integerBetween(1, 5);
            expect(possibleNums).toContain(randomNum);
        });
    });
});

describe("RandomUtil.pickItemByHash", () => {
    const hashData = [...new Set(Array.from({length: 1000}).map(() => crypto.randomBytes(2).toString("hex")))];
    const array = ["a", "b", "c", "d", "e"] as const;
    const pickedData = hashData.map(hash => {
        return {
            hash,
            pick: RandomUtil.pickItemByHash(array, hash),
        };
    });

    test("picked item is inside original array", () => {
        pickedData.forEach(({pick}) => {
            expect(array).toContain(pick);
        });
    });

    test("same hash always returns same pick from array", () => {
        pickedData.forEach(({hash, pick: originalPick}) => {
            const pickFromSameHash = RandomUtil.pickItemByHash(array, hash);
            expect(pickFromSameHash).toStrictEqual(originalPick);
        });
    });

    test("throws error if array is empty", () => {
        const emptyArray = [] as const;
        expect(() => RandomUtil.pickItemByHash(emptyArray, "any")).toThrow(/empty array/);
    });
});
