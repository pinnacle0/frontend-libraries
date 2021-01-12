import {TSESLint} from "@typescript-eslint/experimental-utils";
import type {MessageIds} from "../../src/rules/module-class-method-decorators";
import {name, rule} from "../../src/rules/module-class-method-decorators";
import {createConfig} from "../create-config";

const onPrefixedMethodNotLifecycleId: MessageIds = "onPrefixedMethodNotLifecycle";
const lifecycleDecoratorOrderId: MessageIds = "lifecycleDecoratorOrder";
const logDecoratorOrderId: MessageIds = "logDecoratorOrder";
const lifecycleDecoratorWithLogDecoratorId: MessageIds = "lifecycleDecoratorWithLogDecorator";

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
            @Lifecycle()
            *onRender() {}
            @Lifecycle()
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
            @Lifecycle()
            *onRender() {}
            @Lifecycle()
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
                @Lifecycle()
                @Log()                // Using @Lifecycle() with @Log() at line 5
                *onEnter() {}
                @UnrelatedDecorator()
                @Lifecycle()          // @Lifecycle() not first decorator at line 8
                *onRender() {}
                @Log()                // @Log() not last decorator, Using @Lifecycle() with @Log() at line 10
                @Lifecycle()          // @Lifecycle() not first decorator at line 11
                *onDestroy() {}
            }`,
            errors: [
                {line: 5, messageId: lifecycleDecoratorWithLogDecoratorId},
                {line: 8, messageId: lifecycleDecoratorOrderId},
                {line: 10, messageId: logDecoratorOrderId},
                {line: 10, messageId: lifecycleDecoratorWithLogDecoratorId},
                {line: 11, messageId: lifecycleDecoratorOrderId},
            ],
            output: `
            import {Module} from "core-fe";
            class IncorrectModule extends Module<RootState, "incorrect"> {
                @Lifecycle()
                                // Using @Lifecycle() with @Log() at line 5
                *onEnter() {}
                @Lifecycle()
@UnrelatedDecorator()
                          // @Lifecycle() not first decorator at line 8
                *onRender() {}
                                // @Log() not last decorator, Using @Lifecycle() with @Log() at line 10
                @Lifecycle()          // @Lifecycle() not first decorator at line 11
                *onDestroy() {}
            }`,
        },
        {
            code: `
            import {Module} from "core-native";
            class IncorrectModule extends Module<RootState, "incorrect"> {
                @Lifecycle()
                @Log()                // Using @Lifecycle() with @Log() at line 5
                *onEnter() {}
                @UnrelatedDecorator()
                @Lifecycle()          // @Lifecycle() not first decorator at line 8
                *onRender() {}
                @Log()                // @Log() not last decorator, Using @Lifecycle() with @Log() at line 10
                @Lifecycle()          // @Lifecycle() not first decorator at line 11
                *onDestroy() {}
            }`,
            errors: [
                {line: 5, messageId: lifecycleDecoratorWithLogDecoratorId},
                {line: 8, messageId: lifecycleDecoratorOrderId},
                {line: 10, messageId: logDecoratorOrderId},
                {line: 10, messageId: lifecycleDecoratorWithLogDecoratorId},
                {line: 11, messageId: lifecycleDecoratorOrderId},
            ],
            output: `
            import {Module} from "core-native";
            class IncorrectModule extends Module<RootState, "incorrect"> {
                @Lifecycle()
                                // Using @Lifecycle() with @Log() at line 5
                *onEnter() {}
                @Lifecycle()
@UnrelatedDecorator()
                          // @Lifecycle() not first decorator at line 8
                *onRender() {}
                                // @Log() not last decorator, Using @Lifecycle() with @Log() at line 10
                @Lifecycle()          // @Lifecycle() not first decorator at line 11
                *onDestroy() {}
            }`,
        },
        {
            code: `
            import {Module} from "core-native";
            class IncorrectNativeModule extends Module<RootState, "incorrectNative"> {
                *onNotLifeCycleMethod() {} // Method prefixed with "on" but is not @Lifecycle() at line 4
                *onEnter() {}              // Method prefixed with "on" but is not @Lifecycle() at line 5
                *onError() {}
                onError() {}
                private *onlineStatusUpdated() {}
                private onlineStatusUpdated() {}
            }`,
            errors: [
                {messageId: onPrefixedMethodNotLifecycleId, line: 4},
                {messageId: onPrefixedMethodNotLifecycleId, line: 5},
            ],
            output: `
            import {Module} from "core-native";
            class IncorrectNativeModule extends Module<RootState, "incorrectNative"> {
                @Lifecycle()
*onNotLifeCycleMethod() {} // Method prefixed with "on" but is not @Lifecycle() at line 4
                @Lifecycle()
*onEnter() {}              // Method prefixed with "on" but is not @Lifecycle() at line 5
                *onError() {}
                onError() {}
                private *onlineStatusUpdated() {}
                private onlineStatusUpdated() {}
            }`,
        },
    ],
});
