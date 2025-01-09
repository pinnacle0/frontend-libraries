import {createTransform} from "./createTransform.js";
import {describe, test, expect} from "vitest";

const transform = await createTransform("object-freeze-to-class-static");

const testSet = [
    {
        title: "Without property",
        input: "export const SomeUtil = Object.freeze({})",
        output: "export class SomeUtil {}",
    },
    {
        title: "Object property with non-identifier value ",
        input: `
export const SomeUtil = Object.freeze({
    a: 3,
    b: () => console.log("hi")
})
`,
        output: `
export class SomeUtil {
    static a = 3;
    static b = () => console.log("hi");
}
`,
    },
    {
        title: "Object property with identifier value (property)",
        input: `
const a = 3
export const SomeUtil = Object.freeze({
    a
})
`,
        output: `
export class SomeUtil {
    static a = 3;
}
`,
    },
    {
        title: "Object property with identifier value (function)",
        input: `
// some comment belong to function a
function a() {
    console.log("hi");
} 
export const SomeUtil = Object.freeze({
    a
})
`,
        output: `
export class SomeUtil {
    // some comment belong to function a
    static a() {
        console.log("hi");
    }
}
`,
    },
    {
        title: "Object method",
        input: `
export const SomeUtil = Object.freeze({
    // with comment
    cal() {
        console.log("hi")
    }
})
`,
        output: `
export class SomeUtil {
    // with comment
    static cal() {
        console.log("hi")
    }
}
`,
    },
    {
        title: "Updated references in call expression",
        input: `
const a = 3;
function b() {
    path.resolve(a);
}
export const SomeUtil = Object.freeze({
    a,
    b
})
`,
        output: `
export class SomeUtil {
    static a = 3;

    static b() {
        path.resolve(SomeUtil.a);
    }
}
`,
    },
    {
        title: "Update with references",
        input: `
// some comment belong to function a
function a() {
    console.log("hi");
} 
function b() {
    a();
}
export const SomeUtil = Object.freeze({
    a,
    b
})
`,
        output: `
export class SomeUtil {
    // some comment belong to function a
    static a() {
        console.log("hi");
    }

    static b() {
        SomeUtil.a();
    }
}
`,
    },
    {
        title: "Update with references",
        input: `
// some comment belong to function a
function a() {
    console.log("hi");
} 
function b() {
    a();
    const c = a() + 3;
    return () => {
        const a = 3;
        console.log(a);
    };
}
export const SomeUtil = Object.freeze({
    a,
    b
})
`,
        output: `
export class SomeUtil {
    // some comment belong to function a
    static a() {
        console.log("hi");
    }

    static b() {
        SomeUtil.a();
        const c = SomeUtil.a() + 3;
        return () => {
            const a = 3;
            console.log(a);
        };
    }
}
`,
    },
    {
        title: "Moved global declaration with references updating",
        input: `
const a = 3;
// with comment
const b = () => a;
export const SomeUtil = Object.freeze({
    b
})
`,
        output: `
export class SomeUtil {
    private static a = 3;

    // with comment
    static b = () => SomeUtil.a;
}
`,
    },
    {
        title: "Omit declare const",
        input: `
declare const a = 3;
const b = () => a;
export const SomeUtil = Object.freeze({
    b
})
`,
        output: `
declare const a = 3;

export class SomeUtil {
    static b = () => a;
}
`,
    },
];

describe("Testing object-freeze-to-class-static codemod", () => {
    test.each(testSet)("$title", ({input, output}) => {
        expect(transform(input)).toBe(output);
    });
});
