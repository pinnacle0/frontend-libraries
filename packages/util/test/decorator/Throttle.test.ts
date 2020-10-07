import {Throttle} from "../../src/decorator/Throttle";

class Foo {
    // To test if "this" works in the function scope
    n: number = 0;

    @Throttle(1000)
    increase(count: number): void {
        this.n += count;
    }
}

test("@Throttle", done => {
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
});
