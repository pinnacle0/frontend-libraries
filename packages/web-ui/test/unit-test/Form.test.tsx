import React from "react";
import {act, cleanup, render} from "@testing-library/react";
import {afterEach, beforeAll, describe, expect, test, vi} from "vitest";
import type {FormHandler} from "../../src/core/Form";
import {Form} from "../../src/core/Form";
import {StepFormContainer} from "../../src/core/StepFormContainer";

beforeAll(() => {
    window.matchMedia = query =>
        ({
            matches: false,
            media: query,
            onchange: null,
            addListener: () => undefined,
            removeListener: () => undefined,
            addEventListener: () => undefined,
            removeEventListener: () => undefined,
            dispatchEvent: () => false,
        }) as MediaQueryList;
});

afterEach(cleanup);

describe("Form triggerSubmit", () => {
    test("does not treat an empty validator list as success when a failing item is already rendered", async () => {
        const onFinish = vi.fn();
        const resultRef: {current: boolean | undefined} = {current: undefined};

        const Harness = () => {
            const formRef = React.useRef<FormHandler>(null);
            React.useLayoutEffect(() => {
                void formRef.current!.triggerSubmit().then(result => {
                    resultRef.current = result;
                });
            }, []);
            return (
                <Form ref={formRef} onFinish={onFinish}>
                    <Form.Item validator={() => "must not be empty"}>
                        <span />
                    </Form.Item>
                </Form>
            );
        };

        render(<Harness />);
        await act(async () => {
            await Promise.resolve();
        });

        expect(resultRef.current).toBe(false);
        expect(onFinish).not.toHaveBeenCalled();
    });

    test("does not submit with the previous step's validators after the fields are replaced", async () => {
        const onFinish = vi.fn();
        const resultRef: {current: boolean | undefined} = {current: undefined};

        const Harness = ({step}: {step: number}) => {
            const formRef = React.useRef<FormHandler>(null);
            React.useLayoutEffect(() => {
                void formRef.current!.triggerSubmit().then(result => {
                    resultRef.current = result;
                });
            });
            return (
                <Form ref={formRef} onFinish={onFinish}>
                    {step === 1 ? (
                        <Form.Item key="code" validator={() => null}>
                            <span />
                        </Form.Item>
                    ) : (
                        <Form.Item key="password" validator={() => "password required"}>
                            <span />
                        </Form.Item>
                    )}
                </Form>
            );
        };

        const {rerender} = render(<Harness step={1} />);
        await act(async () => {
            await Promise.resolve();
        });
        expect(resultRef.current).toBe(true);
        expect(onFinish).toHaveBeenCalledTimes(1);

        resultRef.current = undefined;
        onFinish.mockClear();
        rerender(<Harness step={2} />);
        await act(async () => {
            await Promise.resolve();
        });

        expect(resultRef.current).toBe(false);
        expect(onFinish).not.toHaveBeenCalled();
    });

    test("still submits when the form has no Form.Item validators", async () => {
        const onFinish = vi.fn();
        const formRef = React.createRef<FormHandler>();

        render(
            <Form ref={formRef} onFinish={onFinish}>
                <span>no fields</span>
            </Form>
        );

        await expect(formRef.current!.triggerSubmit()).resolves.toBe(true);
        expect(onFinish).toHaveBeenCalledTimes(1);
    });

    test("ignores a second submit while validation is in flight", async () => {
        let release!: (value: string | null) => void;
        const validator = () =>
            new Promise<string | null>(resolve => {
                release = resolve;
            });
        const onFinish = vi.fn();
        const formRef = React.createRef<FormHandler>();

        render(
            <Form ref={formRef} onFinish={onFinish}>
                <Form.Item validator={validator}>
                    <span />
                </Form.Item>
            </Form>
        );

        const first = formRef.current!.triggerSubmit();
        const second = formRef.current!.triggerSubmit();
        expect(await second).toBe(false);
        release(null);
        expect(await first).toBe(true);
        expect(onFinish).toHaveBeenCalledTimes(1);
    });

    test("does not call onFinish when a validator fails", async () => {
        const onFinish = vi.fn();
        const formRef = React.createRef<FormHandler>();

        render(
            <Form ref={formRef} onFinish={onFinish}>
                <Form.Item validator={() => "invalid"}>
                    <span />
                </Form.Item>
            </Form>
        );

        await expect(formRef.current!.triggerSubmit()).resolves.toBe(false);
        expect(onFinish).not.toHaveBeenCalled();
    });
});

describe("StepFormContainer", () => {
    test("does not call the last-step onFinish when the new step's validator fails", async () => {
        const onFinish = vi.fn();

        const PasswordStep = () => {
            React.useLayoutEffect(() => {
                document.querySelector("form")?.dispatchEvent(new Event("submit", {bubbles: true, cancelable: true}));
            }, []);
            return (
                <Form.Item validator={() => "password required"}>
                    <span />
                </Form.Item>
            );
        };

        const {rerender} = render(
            <StepFormContainer
                currentStep={0}
                steps={[
                    {title: "code", content: <Form.Item validator={() => null}>{null}</Form.Item>},
                    {title: "password", content: <PasswordStep />},
                ]}
                onStepChange={() => undefined}
                onFinish={onFinish}
                responsive={false}
            />
        );

        rerender(
            <StepFormContainer
                currentStep={1}
                steps={[
                    {title: "code", content: <Form.Item validator={() => null}>{null}</Form.Item>},
                    {title: "password", content: <PasswordStep />},
                ]}
                onStepChange={() => undefined}
                onFinish={onFinish}
                responsive={false}
            />
        );

        await act(async () => {
            await Promise.resolve();
        });

        expect(onFinish).not.toHaveBeenCalled();
    });

    test("disables next and previous buttons while loading", () => {
        const {getByRole} = render(
            <StepFormContainer
                currentStep={1}
                steps={[
                    {title: "one", content: <span>one</span>},
                    {title: "two", content: <span>two</span>},
                    {title: "three", content: <span>three</span>},
                ]}
                onStepChange={() => undefined}
                onFinish={() => undefined}
                loading
                responsive={false}
            />
        );

        expect((getByRole("button", {name: "Previous"}) as HTMLButtonElement).disabled).toBe(true);
        expect((getByRole("button", {name: /Next/}) as HTMLButtonElement).disabled).toBe(true);
    });
});
