import "@testing-library/jest-dom"; // For extending types
import "@testing-library/jest-dom/extend-expect";

import {NumberInput} from "@pinnacle0/web-ui/core/NumberInput";
import {render, screen} from "@testing-library/react";
import React from "react";
import userEvent from "@testing-library/user-event";

type AllowNullProps = import("@pinnacle0/web-ui/core/NumberInput").Props<true>;

describe("NumberInput (nullable, functional test)", () => {
    const renderInputComponent = (inputComponent: React.ReactElement<typeof NumberInput>) => {
        const {rerender} = render(inputComponent);
        const inputElement = screen.getByRole("textbox") as HTMLInputElement;
        const buttons = screen.getAllByRole("button") as HTMLButtonElement[];
        const addButton = buttons.find(_ => _.className.toLowerCase().includes("add"))!;
        const minusButton = buttons.find(_ => _.className.toLowerCase().includes("minus"))!;
        return {inputElement, addButton, minusButton, rerender};
    };

    test("empty input calls onChange with null (integer, non-stepped)", async () => {
        const mockOnChange = jest.fn<void, [number | null]>();
        const props: AllowNullProps = {
            allowNull: true,
            value: null,
            onChange: mockOnChange,
        };
        const {inputElement, rerender} = renderInputComponent(<NumberInput {...props} />);

        expect(inputElement).toBeTruthy();
        expect(inputElement).not.toHaveFocus();
        expect(mockOnChange).not.toHaveBeenCalled();
        expect(inputElement.value).toBe("");

        mockOnChange.mockClear();
        await userEvent.type(inputElement, "123");
        expect(inputElement).toHaveFocus();
        expect(mockOnChange).toHaveBeenCalledTimes(3);
        expect(mockOnChange).toHaveBeenLastCalledWith(123);
        rerender(<NumberInput {...props} value={123} />); // Parent onChange called, pass new props to component
        expect(mockOnChange).toHaveBeenCalledTimes(3);
        expect(inputElement.value).toBe("123");

        mockOnChange.mockClear();
        await userEvent.type(inputElement, "{backspace}{backspace}{backspace}");
        expect(mockOnChange).toHaveBeenCalledTimes(3);
        expect(mockOnChange).toHaveBeenLastCalledWith(null);
        rerender(<NumberInput {...props} value={null} />); // Parent onChange called, pass new props to component
        expect(inputElement.value).toBe("");

        mockOnChange.mockClear();
        userEvent.click(document.body);
        expect(inputElement).not.toHaveFocus();
        expect(mockOnChange).not.toHaveBeenCalled();
        expect(inputElement.value).toBe("");
    });

    describe("add button uses a reasonable default value when input value is empty (null)", () => {
        type TestEachRowSchema = {
            min: number;
            max: number;
            scale: number;
            expectedOnChangeValue: number | null;
            expectedInputElementValue: string;
        };
        test.each`
            min          | max          | scale        | expectedOnChangeValue | expectedInputElementValue
            ${undefined} | ${undefined} | ${undefined} | ${0}                  | ${"0"}
            ${undefined} | ${undefined} | ${0}         | ${0}                  | ${"0"}
            ${0}         | ${100}       | ${1}         | ${0}                  | ${"0.0"}
            ${-100}      | ${0}         | ${2}         | ${0}                  | ${"0.00"}
            ${10}        | ${undefined} | ${undefined} | ${10}                 | ${"10"}
            ${10}        | ${100}       | ${2}         | ${10}                 | ${"10.00"}
            ${-100}      | ${0}         | ${undefined} | ${0}                  | ${"0"}
            ${-100}      | ${-10}       | ${2}         | ${-10}                | ${"-10.00"}
        `("step(+) uses $expectedOnChangeValue when min/max is [$min, $max]", ({min, max, scale, expectedOnChangeValue, expectedInputElementValue}: TestEachRowSchema) => {
            const mockOnChange = jest.fn<void, [number | null]>();
            const props: AllowNullProps = {
                min,
                max,
                scale,
                step: undefined,
                value: null,
                onChange: mockOnChange,
                allowNull: true,
            };
            const {inputElement, addButton, rerender} = renderInputComponent(<NumberInput {...props} />);

            expect(inputElement).toBeTruthy(), expect(addButton).toBeTruthy();
            expect(inputElement).not.toHaveFocus(), expect(addButton).not.toHaveFocus();
            expect(mockOnChange).not.toHaveBeenCalled();
            expect(inputElement.value).toBe("");

            mockOnChange.mockClear();
            userEvent.click(addButton);
            expect(inputElement).not.toHaveFocus(), expect(addButton).toHaveFocus();
            expect(mockOnChange).toHaveBeenCalledTimes(1);
            expect(mockOnChange).toHaveBeenLastCalledWith(expectedOnChangeValue);
            rerender(<NumberInput {...props} value={expectedOnChangeValue} />);
            expect(inputElement.value).toBe(expectedInputElementValue);
        });
    });

    describe("minus button uses a reasonable default value when input value is empty (null)", () => {
        type TestEachRowSchema = {
            min: number;
            max: number;
            scale: number;
            expectedOnChangeValue: number | null;
            expectedInputElementValue: string;
        };
        test.each`
            min          | max          | scale        | expectedOnChangeValue | expectedInputElementValue
            ${undefined} | ${undefined} | ${undefined} | ${0}                  | ${"0"}
            ${undefined} | ${undefined} | ${0}         | ${0}                  | ${"0"}
            ${0}         | ${100}       | ${1}         | ${0}                  | ${"0.0"}
            ${-100}      | ${0}         | ${2}         | ${0}                  | ${"0.00"}
            ${10}        | ${undefined} | ${undefined} | ${10}                 | ${"10"}
            ${10}        | ${100}       | ${2}         | ${10}                 | ${"10.00"}
            ${-100}      | ${0}         | ${undefined} | ${0}                  | ${"0"}
            ${-100}      | ${-10}       | ${2}         | ${-10}                | ${"-10.00"}
        `("step(-) uses $expectedOnChangeValue when min/max is [$min, $max]", ({min, max, scale, expectedOnChangeValue, expectedInputElementValue}: TestEachRowSchema) => {
            const mockOnChange = jest.fn<void, [number | null]>();
            const props: AllowNullProps = {
                min,
                max,
                scale,
                step: undefined,
                value: null,
                onChange: mockOnChange,
                allowNull: true,
            };
            const {inputElement, minusButton, rerender} = renderInputComponent(<NumberInput {...props} />);

            expect(inputElement).toBeTruthy(), expect(minusButton).toBeTruthy();
            expect(inputElement).not.toHaveFocus(), expect(minusButton).not.toHaveFocus();
            expect(mockOnChange).not.toHaveBeenCalled();
            expect(inputElement.value).toBe("");

            mockOnChange.mockClear();
            userEvent.click(minusButton);
            expect(inputElement).not.toHaveFocus(), expect(minusButton).toHaveFocus();
            expect(mockOnChange).toHaveBeenCalledTimes(1);
            expect(mockOnChange).toHaveBeenLastCalledWith(expectedOnChangeValue);
            rerender(<NumberInput {...props} value={expectedOnChangeValue} />);
            expect(inputElement.value).toBe(expectedInputElementValue);
        });
    });
});
