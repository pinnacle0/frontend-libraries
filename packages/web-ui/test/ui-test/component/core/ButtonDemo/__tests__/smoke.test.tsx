import {Button, ButtonColor, ButtonSize, Props} from "@pinnacle0/web-ui/core/Button";
import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import {AmountRangeInput} from "@pinnacle0/web-ui/core/AmountRangeInput";

describe("Button (smoke test)", () => {
    test("renders children on screen", () => {
        render(<Button>button children text</Button>);
        expect(screen.queryAllByText(/button children text/i)).toHaveLength(1);
    });

    test("onClick fires", () => {
        const onClick = jest.fn();
        render(<Button onClick={onClick}>button text</Button>);

        const button = screen.getByText(/button text/i);
        userEvent.click(button);
        expect(onClick).toHaveBeenCalledTimes(1);

        userEvent.click(button);
        expect(onClick).toHaveBeenCalledTimes(2);
    });
});

describe("Custom Button (smoke test)", () => {
    test("extend Color ", () => {
        type CustomColor = ButtonColor | "new-color";
        const CustomButton = (props: Props<CustomColor>) => <Button {...props} />;

        render(<CustomButton color="new-color" />);
        expect(screen.getByRole("button")?.classList).toContain("new-color");
    });

    test("extend Size ", () => {
        type CustomSize = ButtonSize | "jumbo";
        const CustomButton = (props: Props<ButtonColor, CustomSize>) => <Button {...props} />;

        render(<CustomButton size="jumbo" />);
        expect(screen.getByRole("button")?.classList).toContain("jumbo");
    });
});

describe("Button (type  test)", () => {
    type CustomColor = ButtonColor | "new-color";
    type CustomSize = ButtonSize | "jumbo";

    test("button", () => {
        const Wrapper = () => {
            return (
                <React.Fragment>
                    <Button color="primary" />
                    <Button color="green" />
                    <Button color="wire-frame" />;
                    <Button size="small" />
                    <Button size="medium" />
                </React.Fragment>
            );

            // @ts-expect-error
            return <Button color="bad" />;

            // @ts-expect-error
            return <Button size="bad" />;
        };
    });

    test.todo("Custom  Button");
});
