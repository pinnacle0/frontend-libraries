import {Memo} from "../../src/decorator/Memo";

class Foo {
    // To test if "this" works in the function scope
    private n: number = 20;

    @Memo()
    rand(trueOrFalse: boolean): string {
        return Math.random().toFixed(10) + "-" + (trueOrFalse ? this.n + 1 : this.n - 1).toString();
    }

    @Memo()
    sumWithRand(a: number, b: number, c: number): number {
        return a + b + c + Math.random();
    }
}

test("@Memo", () => {
    const a = new Foo();
    const trueRand = a.rand(true);
    const falseRand = a.rand(false);
    const sum = a.sumWithRand(10, 20, 30); // Should be 60.xxx

    expect(trueRand).not.toBe(falseRand);
    expect(sum > 60).toBeTruthy();
    expect(sum < 61).toBeTruthy();
    for (let i = 0; i < 10; i++) {
        const bool = Math.random() > 0.5;
        expect(a.rand(bool)).toBe(bool ? trueRand : falseRand);
        expect(a.sumWithRand(10, 20, 30)).toBe(sum);
    }
});
