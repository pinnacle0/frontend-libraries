import {Throttle} from "../../src/decorator/Throttle.js";
import {test, expect} from "vitest";

class Foo {
    // To test if "this" works in the function scope
    n: number = 0;

    @Throttle(1000)
    increase(count: number): void {
        this.n += count;
    }
}

test("@Throttle", () =>
    new Promise<void>(done => {
        const a = new Foo();

        for (let i = 0; i < 5; i++) {
            a.increase(10); // Should only be called in the first loop
            expect(a.n).toBe(10);
        }

        setTimeout(() => {
            a.increase(100);
            expect(a.n).toBe(110);
            done();
        }, 1500);
    }));
