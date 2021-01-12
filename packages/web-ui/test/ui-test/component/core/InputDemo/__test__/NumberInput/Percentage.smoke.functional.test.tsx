import "@testing-library/jest-dom"; // For extending types
import "@testing-library/jest-dom/extend-expect";

import type {Props} from "@pinnacle0/web-ui/core/NumberInput/NumberInputPercentage";
import {NumberInputPercentage} from "@pinnacle0/web-ui/core/NumberInput/NumberInputPercentage";
import {render, screen} from "@testing-library/react";
import React from "react";

describe("NumberInputPercentage display value (smoke test)", () => {
    const renderInputComponent = (inputComponent: React.ReactElement<typeof NumberInputPercentage>) => {
        const {rerender} = render(inputComponent);
        const inputElement = screen.getByRole("textbox") as HTMLInputElement;
        return {inputElement, rerender};
    };

    test("in non-editing mode, displays `0.1` as `10 %`", () => {
        const value = 0.1;
        const props: Props<any> = {
            value,
            allowNull: true, // don't care
            onChange: () => {}, // don't care
        };
        const {inputElement} = renderInputComponent(<NumberInputPercentage {...props} />);

        expect(inputElement).toBeTruthy();
        expect(inputElement).not.toHaveFocus();
        expect(inputElement.value).toBe("10 %");
    });

    test("in non-editing mode with percentageScale 1, displays `0.2` as `20.0%`", () => {
        const value = 0.2;
        const props: Props<any> = {
            value,
            percentageScale: 1,
            allowNull: true, // don't care
            onChange: () => {}, // don't care
        };
        const {inputElement} = renderInputComponent(<NumberInputPercentage {...props} />);

        expect(inputElement).toBeTruthy();
        expect(inputElement).not.toHaveFocus();
        expect(inputElement.value).toBe("20.0 %");
    });

    test("allows any integer with percentageScale, displays correct number of decimal points", () => {
        const value = 0.11;
        const props: Props<any> = {
            value,
            allowNull: true, // don't care
            onChange: () => {}, // don't care
        };
        const {inputElement, rerender} = renderInputComponent(<NumberInputPercentage {...props} />);

        expect(inputElement).toBeTruthy();
        expect(inputElement).not.toHaveFocus();

        // Percentage scale = 5
        rerender(<NumberInputPercentage {...props} percentageScale={5} />);
        expect(inputElement.value).toStrictEqual(expect.stringMatching(/\.0{5} %$/));

        // Percentage scale = 9
        rerender(<NumberInputPercentage {...props} percentageScale={9} />);
        expect(inputElement.value).toStrictEqual(expect.stringMatching(/\.0{9} %$/));
    });

    test("throws a descriptive error message when percentageScale is not an integer", async () => {
        expect.assertions(3);
        jest.spyOn(console, "error").mockImplementation(() => {}); // https://github.com/facebook/react/issues/11098#issuecomment-335290556

        const expectedErrorMessageRegExp = /percentageScale\W+.*\W+integer/i;
        const props: Props<any> = {
            value: 0, // don't care
            allowNull: true, // don't care
            onChange: () => {}, // don't care
        };

        try {
            render(<NumberInputPercentage {...props} percentageScale={0.1} />);
        } catch (error) {
            expect((error as Error).message).toStrictEqual(expect.stringMatching(expectedErrorMessageRegExp));
        }

        try {
            const {inputElement, rerender} = renderInputComponent(<NumberInputPercentage {...props} />);
            expect(inputElement).toBeTruthy();
            rerender(<NumberInputPercentage {...props} percentageScale={0.1} />);
        } catch (error) {
            expect((error as Error).message).toStrictEqual(expect.stringMatching(expectedErrorMessageRegExp));
        }
    });
});
