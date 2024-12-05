import {afterAll, describe, it} from "vitest";
import {RuleTester} from "@typescript-eslint/rule-tester";

// ref: https://typescript-eslint.io/packages/rule-tester#vitest
RuleTester.afterAll = afterAll;
RuleTester.it = it;
RuleTester.itOnly = it.only;
RuleTester.describe = describe;
