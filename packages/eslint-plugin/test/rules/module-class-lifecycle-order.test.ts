import {TSESLint} from "@typescript-eslint/experimental-utils";
import {MessageIds, name, rule} from "../../src/rules/module-class-lifecycle-order";
import {createConfig} from "../create-config";

const messageId: MessageIds = "moduleClassLifecycleOrder";

const ruleTester = new TSESLint.RuleTester(createConfig());

ruleTester.run(name, rule, {
    valid: [
        `import {Module} from "unrelated-module"
        class UnrelatedModule extends Module<T> {
            *onUnrelatedGenerator() {}
            override *onEnter() {}
            override *onRender() {}
            onTick() {}
            onDestroy() {}
            someMethod() {}
        }`,
        `import {Module} from "core-fe";
        class FeatureModule extends Module<RootState, "feature"> {
            override *onRender() {}
            override *onDestroy() {}
            *onError() {}
            onError() {}
            *onlineStatusUpdate() {}
            onlineStatusUpdated() {}
            *onePunchMan() {}
            onePunchMan() {}
            private *someGenerator() {}
            private *someMethod() {}
        }`,
        // prettier-format-preserve
    ],
    invalid: [
        {
            code: `import {Module} from "core-fe";
                class IncorrectModule extends Module<RootState, "incorrect"> {
                    *systemCheck() {}
                    override *onRender() {}  // onRender should be ordered before systemCheck() {}
                }`,
            errors: [{line: 4, messageId}],
        },
        {
            code: `import {Module} from "core-fe";
                class IncorrectModule extends Module<RootState, "incorrect"> {
                    private readonly property: string[] = []
                    override *onLocationMatched() {}
                    *systemCheck() {}
                    *onError() {}
                    override *onRender() {}  // onRender should be ordered before systemCheck() {}
                }`,
            errors: [{line: 7, messageId}],
        },
    ],
});
