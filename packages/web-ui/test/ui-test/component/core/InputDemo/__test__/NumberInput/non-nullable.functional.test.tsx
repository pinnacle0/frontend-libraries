import "@testing-library/jest-dom"; // For extending types
import "@testing-library/jest-dom/extend-expect";

import {NumberInput} from "@pinnacle0/web-ui/core/NumberInput";
import {render, screen} from "@testing-library/react";
import React from "react";
import userEvent from "@testing-library/user-event";

type BanNullProps = import("@pinnacle0/web-ui/core/NumberInput").Props<false>;

describe("NumberInput (non-nullable, functional test)", () => {
    const renderInputComponent = (inputComponent: React.ReactElement<typeof NumberInput>) => {
        const {rerender} = render(inputComponent);
        const inputElement = screen.getByRole("textbox") as HTMLInputElement;
        const buttons = screen.getAllByRole("button") as HTMLButtonElement[];
        const addButton = buttons.find(_ => _.className.toLowerCase().includes("add"))!;
        const minusButton = buttons.find(_ => _.className.toLowerCase().includes("minus"))!;
        return {inputElement, addButton, minusButton, rerender};
    };

    test("required input (integer, non-stepped)", () => {
        const initialValue = 10;
        const mockOnChange = jest.fn<void, [number]>();
        const props: BanNullProps = {
            allowNull: false,
            value: initialValue,
            onChange: mockOnChange,
            scale: 0,
            stepperMode: "none",
        };
        const {inputElement, rerender} = renderInputComponent(<NumberInput {...props} />);

        expect(inputElement).toBeTruthy();
        expect(inputElement).not.toHaveFocus();
        expect(mockOnChange).not.toHaveBeenCalled();
        expect(Number(inputElement.value)).toBe(initialValue);
        expect(inputElement.value).toBe("10");

        mockOnChange.mockClear();
        userEvent.click(inputElement);
        expect(inputElement).toHaveFocus();
        expect(inputElement.value).toBe("10");

        mockOnChange.mockClear();
        userEvent.type(inputElement, ".", {skipClick: true});
        expect(mockOnChange).not.toHaveBeenCalled();
        expect(inputElement.value).toBe("10.");

        mockOnChange.mockClear();
        userEvent.type(inputElement, "0", {skipClick: true});
        expect(mockOnChange).not.toHaveBeenCalled();
        expect(inputElement.value).toBe("10.0");

        mockOnChange.mockClear();
        userEvent.type(inputElement, "{backspace}", {skipClick: true});
        expect(mockOnChange).not.toHaveBeenCalled();
        expect(inputElement.value).toBe("10.");

        mockOnChange.mockClear();
        userEvent.type(inputElement, "5", {skipClick: true});
        expect(mockOnChange).toHaveBeenCalledTimes(1);
        expect(mockOnChange).toHaveBeenLastCalledWith(11);
        rerender(<NumberInput {...props} value={11} />); // Parent onChange called, pass new props to component
        expect(mockOnChange).toHaveBeenCalledTimes(1);
        expect(inputElement.value).toBe("10.5");

        mockOnChange.mockClear();
        userEvent.type(inputElement, "{backspace}", {skipClick: true});
        expect(mockOnChange).toHaveBeenCalledTimes(1);
        expect(mockOnChange).toHaveBeenLastCalledWith(10);
        rerender(<NumberInput {...props} value={10} />); // Parent onChange called, pass new props to component
        expect(mockOnChange).toHaveBeenCalledTimes(1);
        expect(inputElement.value).toBe("10.");
    });

    test("required input (integer, non-stepped, parent onChange allows only multiples of 10)", () => {
        // TODO/Andy: Provide more details for regression testing
        const description = `
            This is a regression test for using an onChange callback of \`(newValue: number) => setValue(Math.round(newValue / 10) * 10)\`,
            where there is an edge case that the internal string (NumberInput.state.editingValue) does not update after input loses focus
            if value passed from parent (NumberInput.props.value) does not differ from the previous value (prevProps.value).
        `;
        const initialValue = 100;
        const mockOnChange = jest.fn<void, [number]>();
        const props: BanNullProps = {
            allowNull: false,
            value: initialValue,
            onChange: mockOnChange,
            stepperMode: "none",
            min: 10,
            max: 100000000,
            scale: 0,
        };
        const {inputElement, rerender} = renderInputComponent(<NumberInput {...props} />);

        expect(inputElement).toBeTruthy();
        expect(inputElement).not.toHaveFocus();
        expect(mockOnChange).not.toHaveBeenCalled();
        expect(Number(inputElement.value)).toBe(initialValue);
        expect(inputElement.value).toBe("100");

        mockOnChange.mockClear();
        userEvent.click(inputElement);
        expect(inputElement).toHaveFocus();
        expect(inputElement.value).toBe("100");

        mockOnChange.mockClear();
        userEvent.type(inputElement, "{backspace}", {skipClick: true});
        expect(mockOnChange).toHaveBeenCalledTimes(1);
        expect(mockOnChange).toHaveBeenLastCalledWith(10);
        rerender(<NumberInput {...props} value={10} />); // Parent onChange called, pass new props to component
        expect(mockOnChange).toHaveBeenCalledTimes(1);
        expect(inputElement.value).toBe("10");

        mockOnChange.mockClear();
        userEvent.type(inputElement, "1", {skipClick: true});
        expect(mockOnChange).toHaveBeenCalledTimes(1);
        expect(mockOnChange).toHaveBeenLastCalledWith(101);
        rerender(<NumberInput {...props} value={100} />); // Parent onChange called, pass new props to component; Assume the onChange implementation rounds 101 to 100
        expect(mockOnChange).toHaveBeenCalledTimes(1);
        expect(inputElement.value).toBe("101");

        mockOnChange.mockClear();
        userEvent.click(document.body);
        expect(inputElement).not.toHaveFocus();
        expect(mockOnChange).toHaveBeenCalledTimes(1); // Calls onChange because component is dumb and unaware that parent manipulates value inside onChange
        expect(mockOnChange).toHaveBeenLastCalledWith(101);
        rerender(<NumberInput {...props} value={100} />); // Parent onChange called, pass new props to component; Assume the onChange implementation rounds 101 to 100
        expect(mockOnChange).toHaveBeenCalledTimes(1);
        expect(inputElement.value).toBe("100");

        // Do it again

        mockOnChange.mockClear();
        userEvent.click(inputElement);
        expect(inputElement).toHaveFocus();
        expect(mockOnChange).not.toHaveBeenCalled();
        expect(inputElement.value).not.toBe("101"); // Regression - internal string should update accordingly
        expect(inputElement.value).toBe("100");

        // User highlights the last "0" and then type "2"
        mockOnChange.mockClear();
        inputElement.setSelectionRange(2, 3), expect(inputElement.value.substring(inputElement.selectionStart!, inputElement.selectionEnd!)).toBe("0");
        userEvent.type(inputElement, "2", {skipClick: true}), expect(inputElement.selectionStart).toBe(inputElement.value.length), expect(inputElement.selectionEnd).toBe(inputElement.value.length);
        expect(mockOnChange).toHaveBeenCalledTimes(1);
        expect(mockOnChange).toHaveBeenLastCalledWith(102);
        rerender(<NumberInput {...props} value={100} />); // Parent onChange called, pass new props to component; Assume the onChange implementation rounds 102 to 100
        expect(mockOnChange).toHaveBeenCalledTimes(1);
        expect(inputElement.value).toBe("102");

        // User highlights the last "2" and then type "3"
        mockOnChange.mockClear();
        inputElement.setSelectionRange(2, 3), expect(inputElement.value.substring(inputElement.selectionStart!, inputElement.selectionEnd!)).toBe("2");
        userEvent.type(inputElement, "3", {skipClick: true}), expect(inputElement.selectionStart).toBe(inputElement.value.length), expect(inputElement.selectionEnd).toBe(inputElement.value.length);
        expect(mockOnChange).toHaveBeenCalledTimes(1);
        expect(mockOnChange).toHaveBeenLastCalledWith(103);
        rerender(<NumberInput {...props} value={100} />); // Parent onChange called, pass new props to component; Assume the onChange implementation rounds 102 to 100
        expect(mockOnChange).toHaveBeenCalledTimes(1);
        expect(inputElement.value).toBe("103");

        mockOnChange.mockClear();
        userEvent.click(document.body);
        expect(inputElement).not.toHaveFocus();
        expect(mockOnChange).toHaveBeenCalledTimes(1); // Calls onChange because component is dumb and unaware that parent manipulates value inside onChange
        expect(mockOnChange).toHaveBeenLastCalledWith(103);
        rerender(<NumberInput {...props} value={100} />); // Parent onChange called, pass new props to component; Assume the onChange implementation rounds 102 to 100
        expect(mockOnChange).toHaveBeenCalledTimes(1);
        expect(inputElement.value).toBe("100");

        mockOnChange.mockClear();
        userEvent.click(inputElement);
        expect(inputElement).toHaveFocus();
        expect(inputElement.value).not.toBe("103"); // Regression - internal string should update accordingly
        expect(inputElement.value).toBe("100");
        expect(mockOnChange).not.toHaveBeenCalled();
    });

    test("required input (float 2 decimal point, stepped)", () => {
        const initialValue = 0.2;
        const mockOnChange = jest.fn<void, [number]>();
        const props: BanNullProps = {
            allowNull: false,
            value: initialValue,
            onChange: mockOnChange,
            scale: 2,
            step: 0.1,
            stepperMode: "always",
        };
        const {inputElement, addButton, rerender} = renderInputComponent(<NumberInput {...props} />);

        expect(inputElement).toBeTruthy(), expect(addButton).toBeTruthy();
        expect(inputElement).not.toHaveFocus(), expect(addButton).not.toHaveFocus();
        expect(mockOnChange).not.toHaveBeenCalled();
        expect(Number(inputElement.value)).toBe(initialValue);
        expect(inputElement.value).toBe("0.20");

        mockOnChange.mockClear();
        userEvent.click(inputElement);
        expect(inputElement).toHaveFocus();
        expect(inputElement.value).toBe("0.2");

        mockOnChange.mockClear();
        userEvent.type(inputElement, "00", {skipClick: true});
        expect(mockOnChange).not.toHaveBeenCalled();
        expect(inputElement.value).toBe("0.200");

        // Click stepper button
        mockOnChange.mockClear();
        userEvent.click(addButton);
        expect(inputElement).not.toHaveFocus(), expect(addButton).toHaveFocus();
        expect(mockOnChange).toHaveBeenCalledTimes(1);
        expect(mockOnChange).toHaveBeenLastCalledWith(0.3);
        rerender(<NumberInput {...props} value={0.3} />); // Parent onChange called, pass new props to component
        expect(mockOnChange).toHaveBeenCalledTimes(1);
        expect(inputElement.value).toBe("0.30");
    });

    test("required input (float 4 decimal point, non-stepped", () => {
        const initialValue = 4.5;
        const mockOnChange = jest.fn<void, [number]>();
        const props: BanNullProps = {
            allowNull: false,
            value: initialValue,
            onChange: mockOnChange,
            scale: 4,
            stepperMode: "none",
        };
        const {inputElement, rerender} = renderInputComponent(<NumberInput {...props} />);

        expect(inputElement).toBeTruthy();
        expect(inputElement).not.toHaveFocus();
        expect(mockOnChange).not.toHaveBeenCalled();
        expect(Number(inputElement.value)).toBe(initialValue);
        expect(inputElement.value).toBe("4.5000");

        mockOnChange.mockClear();
        userEvent.click(inputElement);
        expect(inputElement).toHaveFocus();
        expect(inputElement.value).toBe("4.5");

        mockOnChange.mockClear();
        userEvent.type(inputElement, "00", {skipClick: true});
        expect(mockOnChange).not.toHaveBeenCalled();
        expect(inputElement.value).toBe("4.500");

        mockOnChange.mockClear();
        userEvent.type(inputElement, "6", {skipClick: true});
        expect(mockOnChange).toHaveBeenCalledTimes(1);
        expect(mockOnChange).toHaveBeenLastCalledWith(4.5006);
        rerender(<NumberInput {...props} value={4.5006} />); // Parent onChange called, pass new props to component
        expect(mockOnChange).toHaveBeenCalledTimes(1);
        expect(inputElement.value).toBe("4.5006");

        mockOnChange.mockClear();
        userEvent.type(inputElement, "9", {skipClick: true});
        expect(mockOnChange).toHaveBeenCalledTimes(1);
        expect(mockOnChange).toHaveBeenLastCalledWith(4.5007);
        rerender(<NumberInput {...props} value={4.5007} />); // Parent onChange called, pass new props to component
        expect(mockOnChange).toHaveBeenCalledTimes(1);
        expect(inputElement.value).toBe("4.50069");

        mockOnChange.mockClear();
        userEvent.click(document.body);
        expect(inputElement).not.toHaveFocus();
        expect(mockOnChange).not.toHaveBeenCalled();
        expect(inputElement.value).toBe("4.5007");
    });

    test("enter key triggers onChange and uses displays value in non-editing mode if editingValue is different from props.value", () => {
        const initialValue = 10;
        const mockOnChange = jest.fn<void, [number]>();
        const props: BanNullProps = {
            allowNull: false,
            value: initialValue,
            onChange: mockOnChange,
            scale: 1,
            stepperMode: "none",
        };
        const {inputElement, rerender} = renderInputComponent(<NumberInput {...props} />);

        expect(inputElement).toBeTruthy();
        expect(inputElement).not.toHaveFocus();
        expect(mockOnChange).not.toHaveBeenCalled();
        expect(Number(inputElement.value)).toBe(initialValue);
        expect(inputElement.value).toBe("10.0");

        mockOnChange.mockClear();
        userEvent.click(inputElement);
        expect(inputElement).toHaveFocus();

        mockOnChange.mockClear();
        userEvent.type(inputElement, "{selectall}2", {skipClick: true});
        expect(Number(inputElement.value)).not.toBe(initialValue);
        expect(inputElement.value).toBe("2");

        mockOnChange.mockClear();
        userEvent.type(inputElement, "{enter}", {skipClick: true});
        expect(mockOnChange).toHaveBeenCalledTimes(1);
        expect(mockOnChange).toHaveBeenLastCalledWith(2);
        expect(inputElement).not.toHaveFocus();
        rerender(<NumberInput {...props} value={2} />); // Parent onChange called, pass new props to component
        expect(mockOnChange).toHaveBeenCalledTimes(1);
        expect(inputElement.value).toBe("2.0");
    });

    test("passing different props.min always triggers onChange call", () => {
        const mockOnChange = jest.fn<void, [number]>();
        const props: Omit<BanNullProps, "min" | "value"> = {
            allowNull: false,
            onChange: mockOnChange,
            scale: 0, // don't care
            stepperMode: "none", // don't care
            max: 1000, // don't care
        };
        const {inputElement, rerender} = renderInputComponent(<NumberInput {...props} value={200} min={100} />);

        expect(inputElement).toBeTruthy();
        expect(inputElement).not.toHaveFocus();
        expect(mockOnChange).not.toHaveBeenCalled();
        expect(inputElement.value).toBe("200");

        mockOnChange.mockClear();
        rerender(<NumberInput {...props} value={200} min={0} />); // Parent passes new min (100 -> 0)
        expect(mockOnChange).toHaveBeenCalledTimes(1);
        expect(mockOnChange).toHaveBeenLastCalledWith(200);
        rerender(<NumberInput {...props} value={200} min={0} />); // Parent onChange called, pass new props to component (Actually, PureComponent should not rerender because props.value is still 200)
        expect(mockOnChange).toHaveBeenCalledTimes(1);
        expect(inputElement.value).toBe("200");

        mockOnChange.mockClear();
        rerender(<NumberInput {...props} value={200} min={500} />); // Parent passes new min (0 -> 500)
        expect(mockOnChange).toHaveBeenCalledTimes(1);
        expect(mockOnChange).toHaveBeenLastCalledWith(500);
        rerender(<NumberInput {...props} value={500} min={500} />); // Parent onChange called, pass new props to component
        expect(mockOnChange).toHaveBeenCalledTimes(1);
        expect(inputElement.value).toBe("500");
    });

    test("passing different props.max always triggers onChange call", () => {
        const mockOnChange = jest.fn<void, [number]>();
        const props: Omit<BanNullProps, "max" | "value"> = {
            allowNull: false,
            onChange: mockOnChange,
            scale: 0, // don't care
            stepperMode: "none", // don't care
            min: 0, // don't care
        };
        const {inputElement, rerender} = renderInputComponent(<NumberInput {...props} value={200} max={1000} />);

        expect(inputElement).toBeTruthy();
        expect(inputElement).not.toHaveFocus();
        expect(mockOnChange).not.toHaveBeenCalled();
        expect(inputElement.value).toBe("200");

        mockOnChange.mockClear();
        rerender(<NumberInput {...props} value={200} max={500} />); // Parent passes new max (1000 -> 500)
        expect(mockOnChange).toHaveBeenCalledTimes(1);
        expect(mockOnChange).toHaveBeenLastCalledWith(200);
        rerender(<NumberInput {...props} value={200} max={500} />); // Parent onChange called, pass new props to component (Actually, PureComponent should not rerender because props.value is still 200)
        expect(mockOnChange).toHaveBeenCalledTimes(1);
        expect(inputElement.value).toBe("200");

        mockOnChange.mockClear();
        rerender(<NumberInput {...props} value={200} max={100} />); // Parent passes new max (500 -> 100)
        expect(mockOnChange).toHaveBeenCalledTimes(1);
        expect(mockOnChange).toHaveBeenLastCalledWith(100);
        rerender(<NumberInput {...props} value={100} max={100} />); // Parent onChange called, pass new props to component
        expect(mockOnChange).toHaveBeenCalledTimes(1);
        expect(inputElement.value).toBe("100");
    });

    test("passing different props.scale always triggers onChange call", () => {
        const mockOnChange = jest.fn<void, [number]>();
        const props: Omit<BanNullProps, "scale" | "value"> = {
            allowNull: false,
            onChange: mockOnChange,
            stepperMode: "none", // don't care
            min: 0, // don't care
            max: 100, // don't care
        };
        const {inputElement, rerender} = renderInputComponent(<NumberInput {...props} value={78.9} scale={1} />);

        expect(inputElement).toBeTruthy();
        expect(inputElement).not.toHaveFocus();
        expect(mockOnChange).not.toHaveBeenCalled();
        expect(inputElement.value).toBe("78.9");

        mockOnChange.mockClear();
        rerender(<NumberInput {...props} value={78.9} scale={2} />); // Parent passes new scale (1 -> 2)
        expect(mockOnChange).toHaveBeenCalledTimes(1);
        expect(mockOnChange).toHaveBeenLastCalledWith(78.9);
        rerender(<NumberInput {...props} value={78.9} scale={2} />); // Parent onChange called, pass new props to component (Actually, PureComponent should not rerender because props.value is still 78.9)
        expect(mockOnChange).toHaveBeenCalledTimes(1);
        expect(inputElement.value).toBe("78.90");

        mockOnChange.mockClear();
        rerender(<NumberInput {...props} value={78.9} scale={0} />); // Parent passes new scale (2 -> 0)
        expect(mockOnChange).toHaveBeenCalledTimes(1);
        expect(mockOnChange).toHaveBeenLastCalledWith(79);
        rerender(<NumberInput {...props} value={79} scale={0} />); // Parent onChange called, pass new props to component
        expect(mockOnChange).toHaveBeenCalledTimes(1);
        expect(inputElement.value).toBe("79");
    });

    describe("if props.step is not provided, uses a default value that depends on props.scale", () => {
        // test seq: check initial → click add → click add → click minus
        type TestEachRowSchema = {
            scale: number;
            expectedInitial: [number, string];
            expectedStep1Add: [number, string];
            expectedStep2Add: [number, string];
            expectedStep3Add: [number, string];
        };
        test.each`
            scale        | expectedInitial | expectedStep1Add  | expectedStep2Add  | expectedStep3Add  | step_testDisplayNameOnly
            ${undefined} | ${[1, "1"]}     | ${[2, "2"]}       | ${[3, "3"]}       | ${[2, "2"]}       | ${1}
            ${0}         | ${[1, "1"]}     | ${[2, "2"]}       | ${[3, "3"]}       | ${[2, "2"]}       | ${1}
            ${1}         | ${[1, "1.0"]}   | ${[1.1, "1.1"]}   | ${[1.2, "1.2"]}   | ${[1.1, "1.1"]}   | ${0.1}
            ${2}         | ${[1, "1.00"]}  | ${[1.01, "1.01"]} | ${[1.02, "1.02"]} | ${[1.01, "1.01"]} | ${0.01}
        `("step defaults to $step_testDisplayNameOnly when scale is $scale", ({scale, expectedInitial, expectedStep1Add, expectedStep2Add, expectedStep3Add}: TestEachRowSchema) => {
            const initialValue = 1;
            const mockOnChange = jest.fn<void, [number | null]>();
            const props: BanNullProps = {
                scale,
                step: undefined, // use default step calculated by component
                allowNull: false,
                value: initialValue,
                onChange: mockOnChange,
            };
            const {inputElement, addButton, minusButton, rerender} = renderInputComponent(<NumberInput {...props} />);
            let expectedOnChangeValue: number, expectedInputElementValue: string;

            [expectedOnChangeValue, expectedInputElementValue] = expectedInitial;
            expect(inputElement).toBeTruthy(), expect(addButton).toBeTruthy(), expect(minusButton).toBeTruthy();
            expect(inputElement).not.toHaveFocus(), expect(addButton).not.toHaveFocus(), expect(minusButton).not.toHaveFocus();
            expect(mockOnChange).not.toHaveBeenCalled();
            expect(Number(inputElement.value)).toBe(expectedOnChangeValue);
            expect(inputElement.value).toBe(expectedInputElementValue);

            [expectedOnChangeValue, expectedInputElementValue] = expectedStep1Add;
            mockOnChange.mockClear();
            userEvent.click(addButton);
            expect(inputElement).not.toHaveFocus(), expect(addButton).toHaveFocus(), expect(minusButton).not.toHaveFocus();
            expect(mockOnChange).toHaveBeenCalledTimes(1);
            expect(mockOnChange).toHaveBeenLastCalledWith(expectedOnChangeValue);
            rerender(<NumberInput {...props} value={expectedOnChangeValue} />); // Parent onChange called, pass new props to component
            expect(inputElement.value).toBe(expectedInputElementValue);

            [expectedOnChangeValue, expectedInputElementValue] = expectedStep2Add;
            mockOnChange.mockClear();
            userEvent.click(addButton);
            expect(inputElement).not.toHaveFocus(), expect(addButton).toHaveFocus(), expect(minusButton).not.toHaveFocus();
            expect(mockOnChange).toHaveBeenCalledTimes(1);
            expect(mockOnChange).toHaveBeenLastCalledWith(expectedOnChangeValue);
            rerender(<NumberInput {...props} value={expectedOnChangeValue} />); // Parent onChange called, pass new props to component
            expect(inputElement.value).toBe(expectedInputElementValue);

            [expectedOnChangeValue, expectedInputElementValue] = expectedStep3Add;
            mockOnChange.mockClear();
            userEvent.click(minusButton);
            expect(inputElement).not.toHaveFocus(), expect(addButton).not.toHaveFocus(), expect(minusButton).toHaveFocus();
            expect(mockOnChange).toHaveBeenCalledTimes(1);
            expect(mockOnChange).toHaveBeenLastCalledWith(expectedOnChangeValue);
            rerender(<NumberInput {...props} value={expectedOnChangeValue} />); // Parent onChange called, pass new props to component
            expect(inputElement.value).toBe(expectedInputElementValue);
        });
    });
});
