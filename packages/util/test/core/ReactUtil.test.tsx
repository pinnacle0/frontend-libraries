import React from "react";
import {ReactUtil} from "../../src/core/ReactUtil";
import {SafeReactChildren} from "../../src/type";

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
        type TabContainerProps = {title: string; children: SafeReactChildren};
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
        // Test case passes as well, even if `const A = {A1, A2}` here
        const B = ReactUtil.memo("B", () => <div />);
        const C = ReactUtil.memo("C", () => <div />);
        const NotAComponent = () => 4;

        const Wrapped = ReactUtil.statics("Wrapped", {A, B, C});
        expect(Object.keys(Wrapped.A)).toEqual(["A1", "A2"]);
        expect((Wrapped.A.A1 as any).type.displayName).toBe("A1");
        expect((Wrapped.A.A2 as any).type.displayName).toBe("A2");
        expect((Wrapped.B as any).type.displayName).toBe("B");
        expect((Wrapped.C as any).type.displayName).toBe("C");

        // @ts-expect-error2
        ReactUtil.statics("Wrapped", {A, B, C, NotAComponent});
    });
});
