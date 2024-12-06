import {createTransform} from "./createTransform";
import {describe, test, expect} from "vitest";

const transform = await createTransform("use-react-hook-from-web-ui");
const testCases = [
    {
        title: "Remain unchanged",
        input: `import { OtherUtil, useOtherHook } from "@pinnacle0/util";`,
        output: `import { OtherUtil, useOtherHook } from "@pinnacle0/util";`,
    },
    {
        title: "When have other import in @pinnacle0/util",
        input: `import { useBool, useOtherHook } from "@pinnacle0/util";`,
        output: `import { useOtherHook } from "@pinnacle0/util";
import { useBool } from "@pinnacle0/web-ui/hooks";`,
    },
    {
        title: "When util only have one imported hook",
        input: `import { useBool } from "@pinnacle0/util";`,
        output: `import { useBool } from "@pinnacle0/web-ui/hooks";`,
    },
    {
        title: "When have both util and web-ui/hooks import",
        input: `import { useBool, useOtherHook } from "@pinnacle0/util";
import { usePrevious } from "@pinnacle0/web-ui/hooks";`,
        output: `import { useOtherHook } from "@pinnacle0/util";
import { usePrevious, useBool } from "@pinnacle0/web-ui/hooks";`,
    },
];

// Put your tests here
describe("Testing use-react-hook-from-web-ui codemod", () => {
    test.each(testCases)("$title", ({input, output}) => {
        expect(transform(input)).toEqual(output);
    });
});
