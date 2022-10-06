import {createInlineTest, createTest} from "./createTest";

const testSet = [
    {title: "ts enable", input: `const a:number = 3`, output: `const a:number = 3`},
    {title: "tsx enable", input: `const a = <div>message</div>`, output: `const a = <div>message</div>`},
    {title: "tsx with comment", input: `<MyComponent >{/* comment */}</MyComponent>`, output: `<MyComponent >{/* comment */}</MyComponent>`},
    {title: "remain unchanged (normal)", input: `import {useEffect} from 'react'`, output: `import {useEffect} from 'react'`},
    {title: "remain unchanged (default)", input: `import React from 'react'`, output: `import React from 'react'`},
    {title: "removed original, added new import ", input: `import {ReactUtil} from "@pinnacle0/util"`, output: `import {ReactUtil} from "@pinnacle0/web-ui/util/ReactUtil"`},
    {
        title: "keep original, added new import",
        input: `import { ReactUtil, OtherUtil } from "@pinnacle0/util";`,
        output: `
import { OtherUtil } from "@pinnacle0/util";
import { ReactUtil } from "@pinnacle0/web-ui/util/ReactUtil";`,
    },
    {
        title: "remain unchanged when already import",
        input: `import { ReactUtil, OtherUtil } from "@pinnacle0/web-ui/util/ReactUtil";`,
        output: `import { ReactUtil, OtherUtil } from "@pinnacle0/web-ui/util/ReactUtil";`,
    },
    {
        title: "remain unchanged when already import",
        input: `import { ReactUtil, OtherUtil } from "@pinnacle0/web-ui/util/ReactUtil";`,
        output: `import { ReactUtil, OtherUtil } from "@pinnacle0/web-ui/util/ReactUtil";`,
    },
];

describe("Testing react-util-to-web-ui codemod", () => {
    for (const {input, output, title} of testSet) {
        createInlineTest("react-util-to-web-ui", title, input, output);
    }

    createTest("react-util-to-web-ui", "template1");
});
