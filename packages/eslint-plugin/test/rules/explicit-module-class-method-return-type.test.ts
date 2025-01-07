import {RuleTester} from "@typescript-eslint/rule-tester";
import {createConfig} from "../create-config.js";
import {name, rule, MessageIds} from "../../src/rules/explicit-module-class-method-return-type.js";

const ruleTester = new RuleTester(createConfig());
const messageId: MessageIds = "explicitModuleClassMethodReturnType";

ruleTester.run(name, rule, {
    valid: [
        `import {Module} from "core-fe"
        class UnrelatedModule extends Module<T> {
            *onEnter(): SagaGenerator {}
            *onUnrelatedGenerator(name:string): SagaGenerator {}
            *fetchNextPage(filter:Filter): SagaGenerator {}
        }`,
        `import {Module} from "core-fe"
        class UnrelatedModule extends Module<T> {
            constructor() {}
        }`,
        `import {Module} from "core-fe"
        class UnrelatedModule extends NotModule<T> {
            *onEnter() {}
            *onUnrelatedGenerator(name:string) {}
            *fetchNextPage(filter:Filter) {}
        }`,
    ],
    invalid: [
        {
            code: `import {Module} from "core-fe"
            class UnrelatedModule extends Module<T> {
                *onEnter() {}
                *onUnrelatedGenerator(name:string) {}
                *fetchNextPage(filter:Filter): SagaGenerator {}
            }`,
            errors: [
                {messageId, line: 3},
                {messageId, line: 4},
            ],
            output: `import {Module} from "core-fe"
            class UnrelatedModule extends Module<T> {
                *onEnter(): SagaGenerator {}
                *onUnrelatedGenerator(name:string): SagaGenerator {}
                *fetchNextPage(filter:Filter): SagaGenerator {}
            }`,
        },
        {
            code: `import {Module} from "core-fe"
            class UnrelatedModule extends Module<T> {
                *onEnter(getter:() => {}) {
                    if(this.state.name === 'some') {
                        return A;
                    }
                }
                *onUnrelatedGenerator(name:string) {}
            }`,
            errors: [
                {messageId, line: 3},
                {messageId, line: 8},
            ],
            output: `import {Module} from "core-fe"
            class UnrelatedModule extends Module<T> {
                *onEnter(getter:() => {}): SagaGenerator {
                    if(this.state.name === 'some') {
                        return A;
                    }
                }
                *onUnrelatedGenerator(name:string): SagaGenerator {}
            }`,
        },
        {
            code: `import {Module} from "core-fe"
            class UnrelatedModule extends Module<T> {
                *onEnter(): SagaGenerator {}
                private getName() {}
            }`,
            errors: [{messageId, line: 4}],
        },
        {
            code: `import {Module} from "core-fe"
            class AgentTeamManagementModule extends Module<RootState, "agentTeamManagement"> {

                override *onEnter(): SagaGenerator {
                    const name = this.rootState.app.main.currentCustomer!.name;
                    yield* all([
                        this.refreshData(getInitialFilter(name)),
                        this.fetchMyIncomeConfig(),
                    ]);
                }

                *updateSalary(config: SalaryConfigAJAXView) {
                    this.setState(state => (state.incomeConfig.editingSalary = config));
                }

                @Log()
                private *fetchMyIncomeConfig() {
                    const config = yield* call(CustomerAJAXService.getIncomeConfig);
                    this.setState(state => (state.incomeConfig.myConfig = config));
                }

                private getName() {
                    return 43;
                }
            }`,
            errors: [
                {messageId, line: 12},
                {messageId, line: 17},
                {messageId, line: 22},
            ],
            output: `import {Module} from "core-fe"
            class AgentTeamManagementModule extends Module<RootState, "agentTeamManagement"> {

                override *onEnter(): SagaGenerator {
                    const name = this.rootState.app.main.currentCustomer!.name;
                    yield* all([
                        this.refreshData(getInitialFilter(name)),
                        this.fetchMyIncomeConfig(),
                    ]);
                }

                *updateSalary(config: SalaryConfigAJAXView): SagaGenerator {
                    this.setState(state => (state.incomeConfig.editingSalary = config));
                }

                @Log()
                private *fetchMyIncomeConfig(): SagaGenerator {
                    const config = yield* call(CustomerAJAXService.getIncomeConfig);
                    this.setState(state => (state.incomeConfig.myConfig = config));
                }

                private getName() {
                    return 43;
                }
            }`,
        },
    ],
});
