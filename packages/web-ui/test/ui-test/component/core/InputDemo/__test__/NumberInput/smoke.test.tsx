import "@testing-library/jest-dom"; // For extending types
import "@testing-library/jest-dom/extend-expect";

import type {Props} from "@pinnacle0/web-ui/core/NumberInput";
import {NumberInput} from "@pinnacle0/web-ui/core/NumberInput";
import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

describe("NumberInput display value (smoke test)", () => {
    const renderInputComponent = (inputComponent: React.ReactElement<typeof NumberInput>) => {
        const {rerender} = render(inputComponent);
        const inputElement = screen.getByRole("textbox") as HTMLInputElement;
        return {inputElement, rerender};
    };

    test("in non-editing mode, uses custom display renderer if provided", () => {
        const customDisplayValue = "@@CUSTOM_DISPLAY_RENDERED_VALUE";
        const value = 0;
        const props: Props<any> = {
            value,
            displayRenderer: () => customDisplayValue,
            allowNull: true, // don't care
            onChange: () => {}, // don't care
        };
        const {inputElement} = renderInputComponent(<NumberInput {...props} />);

        expect(inputElement).toBeTruthy();
        expect(inputElement.value).toBe(customDisplayValue);

        userEvent.click(inputElement);
        expect(inputElement).toHaveFocus();
        expect(inputElement.value).toBe(value.toString());

        userEvent.click(document.body);
        expect(inputElement).not.toHaveFocus();
        expect(inputElement.value).toBe(customDisplayValue);
    });

    test("in non-editing mode, displays value with number of decimal points specified with scale if no custom display renderer provided", () => {
        const value = 10;
        const scale = 4;
        const props: Props<any> = {
            value,
            scale,
            allowNull: true, // don't care
            onChange: () => {}, // don't care
        };
        const {inputElement} = renderInputComponent(<NumberInput {...props} />);

        expect(inputElement).toBeTruthy();
        expect(inputElement.value).toBe("10.0000");

        userEvent.click(inputElement);
        expect(inputElement).toHaveFocus();
        expect(inputElement.value).toBe("10");

        userEvent.click(document.body);
        expect(inputElement).not.toHaveFocus();
        expect(inputElement.value).toBe("10.0000");
    });

    test("enter key press triggers non-editing mode display", async () => {
        const customDisplayValue = "@@CUSTOM_DISPLAY_RENDERED_VALUE";
        const props: Props<any> = {
            displayRenderer: () => customDisplayValue,
            value: 1, // don't care
            allowNull: true, // don't care
            onChange: () => {}, // don't care
        };
        const {inputElement} = renderInputComponent(<NumberInput {...props} />);

        expect(inputElement).toBeTruthy();
        expect(inputElement.value).toBe(customDisplayValue);

        // Important: Do NOT use fireEvent.focus() because it does not work, focused element will be body (ref: https://github.com/testing-library/user-event/issues/350 ; https://github.com/testing-library/react-testing-library/issues/276 ; https://testing-library.com/docs/guide-events ; https://kentcdodds.com/blog/common-mistakes-with-react-testing-library#not-using-testing-libraryuser-event)
        userEvent.click(inputElement);
        expect(inputElement).toHaveFocus();
        expect(inputElement.value).toBe("1");

        await userEvent.type(inputElement, "{enter}", {skipClick: true});
        expect(inputElement).not.toHaveFocus();
        expect(inputElement.value).toBe(customDisplayValue);
    });

    test("when allowNull=true, input field uses an empty string to represent value=null", async () => {
        const value = null;
        const allowNull = true;
        const props: Props<true> = {value, allowNull, onChange: () => {}};
        const {inputElement} = renderInputComponent(<NumberInput {...props} />);

        expect(inputElement).toBeTruthy();
        expect(inputElement.value).toBe("");
    });
});
