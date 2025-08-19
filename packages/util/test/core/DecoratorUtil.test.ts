import {describe, test, expect} from "vitest";
import {DecoratorUtil} from "../../src/core/DecoratorUtil.js";

const AddNumberBefore = (number: number) => DecoratorUtil.interceptFunction<[number], number>((fn, originalNumber) => fn(originalNumber + number));
const AddNumberBeforeAsync = (number: number) => DecoratorUtil.interceptFunction<[number], Promise<number>>(async (fn, originalNumber) => await fn(originalNumber + number));

describe("DecoratorUtil.interceptFunction", () => {
    test("type safe", async () => {
        class TestClass {
            @AddNumberBefore(1)
            instanceAddOneAndmultiply(x: number): number {
                return x * 2;
            }

            @AddNumberBefore(1)
            static staticAddOneAndmultiply(x: number): number {
                return x * 2;
            }

            @AddNumberBeforeAsync(1)
            static async addOneAndmultiplyAsync(x: number): Promise<number> {
                return x * 2;
            }

            // @ts-expect-error
            @AddNumberBeforeAsync(1)
            static addOneAndmultiplyMixed(x: number): number {
                return x * 2;
            }

            // @ts-expect-error
            @AddNumberBefore(1)
            static numberToString(x: number): string {
                return x.toString();
            }

            // @ts-expect-error
            @AddNumberBefore(1)
            static stringToNumber(x: string): number {
                return Number(x);
            }
        }

        const testClass = new TestClass();
        expect(testClass.instanceAddOneAndmultiply(5)).toBe(12);
        expect(TestClass.staticAddOneAndmultiply(5)).toBe(12);
        await expect(TestClass.addOneAndmultiplyAsync(5)).resolves.toBe(12);
    });
});
