import {createTransform} from "./createTransform";

const transform = createTransform("use-react-util-from-web-ui");
const testCases = [
    {title: "Remain unchanged", input: `import some from "some-other-package";`, output: `import some from "some-other-package";`},
    {title: "Remain unchanged", input: `import {ReactUtil} from "@pinnacle0/web-ui/util/ReactUtil";`, output: `import {ReactUtil} from "@pinnacle0/web-ui/util/ReactUtil";`},
    {title: "Remain unchanged", input: `import {} from "@pinnacle0/util"`, output: `import {} from "@pinnacle0/util"`},
    {title: "Update import to web-ui", input: `import { ReactUtil } from "@pinnacle0/util";`, output: `import { ReactUtil } from "@pinnacle0/web-ui/util/ReactUtil";`},
    {
        title: "Update import to web-ui",
        input: `import { ReactUtil } from "@pinnacle0/util";`,
        output: `import { ReactUtil } from "@pinnacle0/web-ui/util/ReactUtil";`,
    },

    {
        title: "Added new import and keep original util import when have more one import specifier",
        input: `import { ReactUtil, NameUtil } from "@pinnacle0/util";`,
        output: `import { NameUtil } from "@pinnacle0/util";
import { ReactUtil } from "@pinnacle0/web-ui/util/ReactUtil";`,
    },
    {
        title: "ignore type import",
        input: `import { ReactUtil, NameUtil } from "@pinnacle0/util";
import type { SafeChild } from "@pinnacle0/util";`,
        output: `import { NameUtil } from "@pinnacle0/util";
import { ReactUtil } from "@pinnacle0/web-ui/util/ReactUtil";
import type { SafeChild } from "@pinnacle0/util";`,
    },
    {
        title: "ignore type import",
        input: `import { ReactUtil, NameUtil } from "@pinnacle0/util";
import type { SafeChild } from "@pinnacle0/util";`,
        output: `import { NameUtil } from "@pinnacle0/util";
import { ReactUtil } from "@pinnacle0/web-ui/util/ReactUtil";
import type { SafeChild } from "@pinnacle0/util";`,
    },
];

describe("Testing use-react-util-form-web-ui", () => {
    test.each(testCases)("$title", ({input, output}) => {
        expect(transform(input)).toBe(output);
    });
});
