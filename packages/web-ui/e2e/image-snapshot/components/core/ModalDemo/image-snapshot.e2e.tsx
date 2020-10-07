import {E2ETestUtil} from "../../../../util/E2ETestUtil";

const WAIT_DELAY = 500;

fixture`ModalDemo`;

test("screenshot-all", async t => {
    await t.navigateTo("https://localhost:4455/core/modal");
    await E2ETestUtil.compareScreenshot(t);
});

test("screenshot-default-declarative-modal", async t => {
    await t.navigateTo("https://localhost:4455/core/modal");
    await t.click("button.modal-demo-declarative-modal-default");
    await t.wait(WAIT_DELAY);
    await E2ETestUtil.compareScreenshot(t);
});

test("screenshot-sync-modal", async t => {
    await t.navigateTo("https://localhost:4455/core/modal");
    await t.click("button.modal-demo-sync-modal-default");
    await t.wait(WAIT_DELAY);
    await E2ETestUtil.compareScreenshot(t);
});
