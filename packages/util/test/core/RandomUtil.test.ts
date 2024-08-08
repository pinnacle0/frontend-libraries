import {RandomUtil} from "../../src/core/RandomUtil";

describe("RandomUtil.ofOne", () => {
    test("throws if array is empty", () => {
        expect(() => RandomUtil.ofOne([])).toThrowError();
    });

    test("item is in array", () => {
        const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        Array.from({length: 300}).forEach(() => {
            const randomItem = RandomUtil.ofOne(array);
            expect(array).toContain(randomItem);
        });
    });
});

describe("RandomUtil.ofMany", () => {
    test("throws if array is too small", () => {
        expect(() => RandomUtil.ofMany([], 1, true)).toThrowError();
        expect(() => RandomUtil.ofMany([1], 2, true)).toThrowError();
        expect(() => RandomUtil.ofMany([1], 2, false)).toThrowError();
    });

    test("item is in array with correct size and ordering", () => {
        const array = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        Array.from({length: 300}).forEach(() => {
            const randomItemsWithoutOrdering = RandomUtil.ofMany(array, 5, false);
            expect(randomItemsWithoutOrdering).toHaveLength(5);
            randomItemsWithoutOrdering.forEach(item => expect(array).toContain(item));

            const randomItemsWithOrdering = RandomUtil.ofMany(array, 5, true);
            expect(randomItemsWithOrdering).toHaveLength(5);
            randomItemsWithOrdering.forEach(item => expect(array).toContain(item));
            expect(randomItemsWithOrdering).toStrictEqual([...randomItemsWithOrdering].sort());
        });
    });

    test("size same with array length", () => {
        const array = [1, 2, 3, 4];
        Array.from({length: 100}).forEach(() => {
            const randomItemsWithoutOrdering = RandomUtil.ofMany(array, 4, false);
            expect([...randomItemsWithoutOrdering].sort()).toStrictEqual(array);

            const randomItemsWithOrdering = RandomUtil.ofMany(array, 4, true);
            expect(randomItemsWithOrdering).toStrictEqual(array);
        });
    });
});

describe("RandomUtil.integerBetween", () => {
    test("throws if invalid args", () => {
        expect(() => RandomUtil.integerBetween(2, 1)).toThrowError();
        expect(() => RandomUtil.integerBetween(-1, -2)).toThrowError();
    });

    test("random number is within range", () => {
        const possibleNums = [1, 2, 3, 4, 5];
        Array.from({length: 300}).forEach(() => {
            const randomNum = RandomUtil.integerBetween(1, 5);
            expect(possibleNums).toContain(randomNum);
        });
    });
});

describe("RandomUtil.integersBetween", () => {
    test("throws if invalid args", () => {
        expect(() => RandomUtil.integersBetween(2, 1, 1, true)).toThrowError();
        expect(() => RandomUtil.integersBetween(2, 3, 3, true)).toThrowError();
        expect(() => RandomUtil.integersBetween(2, 100, 0, true)).toThrowError();

        expect(() => RandomUtil.integersBetween(2, 3, 2, true)).not.toThrowError();
    });

    test("random numbers is within range", () => {
        const possibleNums = [1, 2, 3, 4, 5, 6];
        Array.from({length: 300}).forEach(() => {
            const randomNums = RandomUtil.integersBetween(1, 6, 3, true);
            expect(randomNums).toHaveLength(3);
            randomNums.forEach(item => expect(possibleNums).toContain(item));
        });
    });
});
