import {createTransform} from "./createTransform";

const transform = createTransform("use-react-redux-hooks-from-core-fe");
const testCases = [
    {
        title: "Remain unchanged",
        input: `import { useOtherHook } from "react-redux";`,
        output: `import { useOtherHook } from "react-redux";`,
    },
    {
        title: "When have other import in react-redux",
        input: `import { useSelector, useOtherHook } from "react-redux";`,
        output: `import { useOtherHook } from "react-redux";
import { useSelector } from "core-fe";`,
    },
    {
        title: "When have  only one imported hook",
        input: `import { useSelector } from "react-redux";`,
        output: `import { useSelector } from "core-fe";`,
    },
    {
        title: "When have multiple imported hooks",
        input: `import { useSelector, useStore } from "react-redux";`,
        output: `import { useSelector, useStore } from "core-fe";`,
    },
    {
        title: "When have existed core-fe import",
        input: `import { useSelector, useStore } from "react-redux";
import { useOtherHook } from "core-fe"`,
        output: `import { useOtherHook, useSelector, useStore } from "core-fe";`,
    },
];

// Put your tests here
describe("Testing use-react-redux-hooks-from-core-fe codemod", () => {
    test.each(testCases)("$title", ({input, output}) => {
        expect(transform(input)).toEqual(output);
    });
});
