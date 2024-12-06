import {createTransform} from "./createTransform";
import {describe, test, expect} from "vitest";

const transform = await createTransform("use-react-node");

const testCases = [
    {
        title: "Return type",
        input: `
type A = () => SafeReactChildren
`,
        output: `
type A = () => React.ReactNode
`,
    },
    {
        title: "only import (SafeReactChildren)",
        input: `
import React from "react";
import { SafeReactChildren } from "@pinnacle0/util";
const a: SafeReactChildren = <div>hi</div>;
`,
        output: `
import React from "react";
const a: React.ReactNode = <div>hi</div>;
`,
    },
    {
        title: "multiple import",
        input: `
import React from "react";
import { SafeReactChildren, OtherImport } from "@pinnacle0/util";
const a: SafeReactChildren = <div>hi</div>;
`,
        output: `
import React from "react";
import { OtherImport } from "@pinnacle0/util";
const a: React.ReactNode = <div>hi</div>;
`,
    },
    {
        title: "insert React default import when dont exist",
        input: `
import { useEffect } from 'react'
import { SafeReactChildren, OtherImport } from "@pinnacle0/util";
const a: SafeReactChildren = <div>hi</div>;
`,
        output: `
import React, { useEffect } from "react";
import { OtherImport } from "@pinnacle0/util";
const a: React.ReactNode = <div>hi</div>;
`,
    },
    {
        title: "insert React default when default not exist in react import",
        input: `
import { useEffect } from 'react'
import { SafeReactChildren, OtherImport } from "@pinnacle0/util";
const a: SafeReactChildren = <div>hi</div>;
`,
        output: `
import React, { useEffect } from "react";
import { OtherImport } from "@pinnacle0/util";
const a: React.ReactNode = <div>hi</div>;
`,
    },
    {
        title: "added import",
        input: `
import { useEffect } from 'react'
`,
        output: `
import React, { useEffect } from "react";
`,
    },
    {
        title: "ignore type import",
        input: `
import type { useEffect } from "react";
`,
        output: `
import type { useEffect } from "react";
`,
    },
];

// Put your tests here
describe("Testing use-react-node codemod", () => {
    test.each(testCases)("$title", ({input, output}) => {
        expect(transform(input)).toBe(output);
    });
});
