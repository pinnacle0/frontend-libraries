export const dummyEmptyCallback = (): void => {};

export const dummyAlertCallback = (...args: any[]) => alert(`callback args: ${JSON.stringify(args)}`);

export const dummyLabelledAlertCallback =
    (label: string) =>
    (...args: any[]) =>
        alert(`${label}\ncallback args: ${JSON.stringify(args)}`);
