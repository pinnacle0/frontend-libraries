import {createInlineTest, createTest} from "./createTest";

// Put your tests here
describe("Testing use-react-util-from-web-ui codemod", () => {
    createInlineTest("use-react-util-from-web-ui", "Remain unchanged", `import some from "some-other-package";`, `import some from "some-other-package";`);
    createInlineTest("use-react-util-from-web-ui", "Remain unchanged", `import {ReactUtil} from "@pinnacle0/web-ui/util/ReactUtil";`, `import {ReactUtil} from "@pinnacle0/web-ui/util/ReactUtil";`);
    createInlineTest("use-react-util-from-web-ui", "Remain unchanged", `import {} from "@pinnacle0/util"`, `import {} from "@pinnacle0/util"`);
    createInlineTest("use-react-util-from-web-ui", "Update import to web-ui", `import { ReactUtil } from "@pinnacle0/util";`, `import { ReactUtil } from "@pinnacle0/web-ui/util/ReactUtil";`);
    createInlineTest(
        "use-react-util-from-web-ui",
        "Added new import and keep original util import when have more one import specifier",
        `import { ReactUtil, NameUitl } from "@pinnacle0/util";`,
        `
import { NameUitl } from "@pinnacle0/util";
import { ReactUtil } from "@pinnacle0/web-ui/util/ReactUtil";
`
    );
    createInlineTest(
        "use-react-util-from-web-ui",
        "ignore type import",
        `
import { ReactUtil, NameUitl } from "@pinnacle0/util";
import type { SafeChild } from "@pinnacle0/util";
`,
        `
import { NameUitl } from "@pinnacle0/util";
import { ReactUtil } from "@pinnacle0/web-ui/util/ReactUtil";
import type { SafeChild } from "@pinnacle0/util";
`
    );
});
