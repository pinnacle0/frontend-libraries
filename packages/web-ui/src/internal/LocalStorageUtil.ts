/**
 * In mobile Safari, the user may turn on "Block All Cookies".
 * In such situation, accessing to localStorage will throw error.
 */

const trueBoolValue = "TRUE";
const falseBoolValue = "FALSE";

function setBool(key: string, value: boolean) {
    try {
        localStorage.setItem(key, value ? trueBoolValue : falseBoolValue);
    } catch (e) {
        // Do nothing
    }
}

function setString(key: string, value: string) {
    try {
        localStorage.setItem(key, value);
    } catch (e) {
        // Do nothing
    }
}

function getBool(key: string, defaultValue: boolean): boolean {
    try {
        const data = localStorage.getItem(key);
        if (data !== null) {
            return data === trueBoolValue;
        } else {
            return defaultValue;
        }
    } catch (e) {
        return defaultValue;
    }
}

function getString<T extends string = string>(key: string, validValues: T[], defaultValue: T): T {
    try {
        const data = localStorage.getItem(key);
        if (data !== null) {
            const typedData = data as T;
            if (validValues.includes(typedData)) {
                return typedData;
            }
        }
        return defaultValue;
    } catch (e) {
        return defaultValue;
    }
}

function getObject<T extends object>(key: string, defaultValue: T, validator: (item: object) => boolean): T {
    try {
        const savedData = localStorage.getItem(key);
        if (savedData) {
            const data: object = JSON.parse(savedData);
            if (validator(data)) {
                return data as T;
            }
        }
        return defaultValue;
    } catch (e) {
        return defaultValue;
    }
}

function setObject<T extends object>(key: string, item: T): void {
    try {
        localStorage.setItem(key, JSON.stringify(item));
    } catch (e) {
        // Do nothing
    }
}

export const LocalStorageUtil = Object.freeze({
    setBool,
    setString,
    setObject,
    getBool,
    getString,
    getObject,
});
