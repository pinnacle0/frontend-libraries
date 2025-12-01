import React from "react";
import {ReactUtil} from "../../src/util/ReactUtil/index.jsx";
import {describe, test, expect} from "vitest";

describe("ReactUtil.memo", () => {
    const someNullable = {apiData: ""} as {apiData: string} | null;

    test("test1", () => {
        type TabProps = {title: string};
        const Tab = ReactUtil.memo("Tab", (props: TabProps) => {
            return someNullable && <div>Title: {props.title}</div>;
        });
        // React.memo does not add displayName to returned object, but its inner wrapped component displayName is recognize-able by React
        // For more information, check the type definition of React.ExoticComponent and https://github.com/facebook/react/blob/v16.6.0/packages/react/src/memo.js#L27-L31
        expect((Tab as any).type.displayName).toBe("Tab");
        <Tab title="title" />;
        // @ts-expect-error
        <Tab title="title">children</Tab>;
    });

    test("test2", () => {
        type TabContainerProps = {title: string; children: React.ReactNode};
        const TabContainer = ReactUtil.memo("TabContainer", (props: TabContainerProps) => {
            return (
                someNullable && (
                    <div>
                        Title: {props.title}
                        <div>{props.children}</div>
                    </div>
                )
            );
        });
        expect((TabContainer as any).type.displayName).toBe("TabContainer");
        <TabContainer title="title">children</TabContainer>;
        // @ts-expect-error
        <TabContainer title="title" />;
        // @ts-expect-error
        <TabContainer title="title">{{foo: 100}}</TabContainer>;
    });

    test("test3", () => {
        type TypedTabProps<T extends string> = {title: string; generic: T};
        enum Enum {
            A = "A",
            B = "B",
        }
        const TypedTab = ReactUtil.memo("TypedTab", <T extends string>(props: TypedTabProps<T>) => {
            return (
                someNullable && (
                    <div>
                        Title: {props.title} / {props.generic.toLocaleUpperCase()}
                    </div>
                )
            );
        });
        expect((TypedTab as any).type.displayName).toBe("TypedTab");
        <TypedTab title="title" generic={Enum.B} />;
        <TypedTab<Enum> title="title" generic={Enum.A} />;
        // @ts-expect-error
        <TypedTab<"a" | "b"> title="title" generic="c" />;
    });
});

describe("ReactUtil.statics", () => {
    test("test", () => {
        const A1 = ReactUtil.memo("A1", () => <div />);
        const A2 = ReactUtil.memo("A2", () => <div />);

        const A = ReactUtil.statics("A", {A1, A2});
        // Passes too, even if `const A = {A1, A2}` here
        const B = ReactUtil.memo("B", () => <div />);
        const C = ReactUtil.memo("C", () => <div />);

        const Wrapped = ReactUtil.statics("Wrapped", {A, B, C});
        expect(Object.keys(Wrapped.A)).toEqual(["A1", "A2"]);
        expect((Wrapped.A.A1 as any).type.displayName).toBe("A1");
        expect((Wrapped.A.A2 as any).type.displayName).toBe("A2");
        expect((Wrapped.B as any).type.displayName).toBe("B");
        expect((Wrapped.C as any).type.displayName).toBe("C");

        // @ts-expect-error
        ReactUtil.statics("Wrapped", {A, B, C, a: 123});
    });
});

describe("ReactUtil.compound", () => {
    test("test", () => {
        const A = ReactUtil.compound("A", {A1: (_props: {str?: string}) => <div />, A2: (_props: {num?: number}) => <div />}, (_props: {str: string; num?: number}) => <div />);

        const B1 = ReactUtil.memo("B1", (_props: {str: string}) => <div />);
        const B2 = ReactUtil.memo("B2", (_props: {num: number}) => <div />);
        const B = ReactUtil.statics("B", {B1, B2});

        const C1 = ReactUtil.memo("C1", (_props: {str: string}) => <div />);
        const C2 = ReactUtil.memo("C2", (_props: {num: number}) => <div />);
        const C = ReactUtil.compound("C", {C1, C2, A, B}, (_props: {str: string; num: number}) => <div />);

        expect(Object.keys(A).includes("A1")).toBe(true);
        expect(Object.keys(A).includes("A2")).toBe(true);
        expect((A as any).type.displayName).toBe("A");
        expect((A.A1 as any).type.displayName).toBe("A1");
        expect((A.A2 as any).type.displayName).toBe("A2");

        expect(Object.keys(C).includes("C1")).toBe(true);
        expect(Object.keys(C).includes("C2")).toBe(true);
        expect(Object.keys(C).includes("A")).toBe(true);
        expect((C as any).type.displayName).toBe("C");
        expect((C.C1 as any).type.displayName).toBe("C1");
        expect((C.C2 as any).type.displayName).toBe("C2");
        expect((C.A as any).type.displayName).toBe("A");
        expect((C.A.A1 as any).type.displayName).toBe("A1");
        expect((C.A.A2 as any).type.displayName).toBe("A2");
        expect(Object.keys(C.B)).toEqual(["B1", "B2"]);
        expect((C.B.B1 as any).type.displayName).toBe("B1");
        expect((C.B.B2 as any).type.displayName).toBe("B2");

        // type check
        <A str="foo" num={100} />;
        <A.A1 str="foo" />;
        <A.A2 num={100} />;
        <C str="foo" num={100} />;
        <C.C1 str="foo" />;
        <C.C2 num={100} />;
        <C.A str="foo" />;
        <C.A.A1 str="foo" />;
        <C.A.A2 num={100} />;
        <C.B.B1 str="foo" />;
        <C.B.B2 num={100} />;

        // @ts-expect-error
        <C.B />;
        // @ts-expect-error
        ReactUtil.compound("Wrapped", {A, B, a: 123}, C);
    });
});
