import {RuleTester} from "@typescript-eslint/rule-tester";
import {MessageIds, name, rule} from "../../src/rules/module-class-lifecycle-order";
import {createConfig} from "../create-config";

const messageId: MessageIds = "moduleClassLifecycleOrder";

const ruleTester = new RuleTester(createConfig());

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
        `import {Module} from "core-fe";
        class FeatureModule extends Module<RootState, "feature"> {}`,
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
        {
            code: `import {Module} from "core-fe";
                class IncorrectModule extends Module<RootState, "incorrect"> {
                    private readonly property: string[] = []
                    override *onLocationMatched() {}
                    *systemCheck() {}
                    *onError() {}
                    override onePunch() {}
                    override *onRender() {}  // onRender should be ordered before systemCheck() {}
                }`,
            errors: [{line: 8, messageId}],
        },
    ],
});
