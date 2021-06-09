import {TSESLint} from "@typescript-eslint/experimental-utils";
import type {MessageIds} from "../../src/rules/module-class-method-decorators";
import {name, rule} from "../../src/rules/module-class-method-decorators";
import {createConfig} from "../create-config";

const logDecoratorOrderId: MessageIds = "logDecoratorOrder";

const ruleTester = new TSESLint.RuleTester(createConfig());

ruleTester.run(name, rule, {
    valid: [
        `import {Module} from "unrelated-module"
        class UnrelatedModule extends Module<T> {
            *onUnrelatedGenerator() {}
            *onEnter() {}
            *onRender() {}
            onTick() {}
            onDesetroy() {}
            someMethod() {}
        }`,
        `import {Module} from "core-fe";
        class FeatureModule extends Module<RootState, "feature"> {
            *onRender() {}
            *onDestroy() {}
            *onError() {}
            onError() {}
            *onlineStatusUpdated() {}
            onlineStatusUpdated() {}
            *onePunchMan() {}
            onePunchMan() {}
            private *someGenerator() {}
            private someMethod() {}
        }`,
        `import {Module} from "core-native";
        class FeatureModule extends Module<RootState, "feature"> {
            *onRender() {}
            *onDestroy() {}
            *onError() {}
            onError() {}
            *onlineStatusUpdated() {}
            onlineStatusUpdated() {}
            private *someGenerator() {}
            private someMethod() {}
        }`,
    ],
    invalid: [
        {
            code: `
            import {Module} from "core-fe";
            class IncorrectModule extends Module<RootState, "incorrect"> {
                @UnrelatedDecorator()
                @Log()
                *onEnter() {}
                @UnrelatedDecorator()
                @UnrelatedDecorator()
                *onRender() {}
                @Log()                // @Log() not last decorator, Using @UnrelatedDecorator() with @Log() at line 10
                @UnrelatedDecorator()          
                *onDestroy() {}
            }`,
            errors: [{line: 10, messageId: logDecoratorOrderId}],
            output: `
            import {Module} from "core-fe";
            class IncorrectModule extends Module<RootState, "incorrect"> {
                @UnrelatedDecorator()
                @Log()
                *onEnter() {}
                @UnrelatedDecorator()
                @UnrelatedDecorator()
                *onRender() {}
                                // @Log() not last decorator, Using @UnrelatedDecorator() with @Log() at line 10
                @UnrelatedDecorator()
@Log()          
                *onDestroy() {}
            }`,
        },
        {
            code: `
                    import {Module} from "core-native";
                    class IncorrectModule extends Module<RootState, "incorrect"> {
                        @UnrelatedDecorator()
                        @Log()
                        *onEnter() {}
                        @UnrelatedDecorator()
                        @UnrelatedDecorator()
                        *onRender() {}
                        @Log()                // @Log() not last decorator, Using @UnrelatedDecorator() with @Log() at line 10
                        @UnrelatedDecorator()
                        *onDestroy() {}
                    }`,
            errors: [{line: 10, messageId: logDecoratorOrderId}],
            output: `
                    import {Module} from "core-native";
                    class IncorrectModule extends Module<RootState, "incorrect"> {
                        @UnrelatedDecorator()
                        @Log()
                        *onEnter() {}
                        @UnrelatedDecorator()
                        @UnrelatedDecorator()
                        *onRender() {}
                                        // @Log() not last decorator, Using @UnrelatedDecorator() with @Log() at line 10
                        @UnrelatedDecorator()
@Log()
                        *onDestroy() {}
                    }`,
        },
    ],
});
