// TODO: no need exact copy structure from previous test folder, flatten here (1 or 2 levels)
import {E2ETestUtil} from "../../../../util/E2ETestUtil";

fixture`ButtonDemo`;

test("screenshot-all", async t => {
    await t.navigateTo("https://localhost:4455/core/button");
    await E2ETestUtil.compareScreenshot(t);
});

// TODO: Add localhost 4455 port check, and put where?
// TODO: E2ETestUtil.runTestcase({urlPath:"/core/button"})
interface E2ETestcaseOption {
    urlPath: string;
    actions?: (t: TestController) => Promise<void>;
    // TODO: or more options?
}
