/**
 * In mobile Safari, the user may turn on "Block All Cookies".
 * In such situation, accessing to localStorage will throw error.
 */

type ListItemType = string | number | boolean;

function get<T extends ListItemType>(key: string, validator?: T[]): T[] {
    try {
        const rawData = localStorage.getItem(key);
        if (rawData) {
            const parsedList: unknown = JSON.parse(rawData);
            if (Array.isArray(parsedList)) {
                return (parsedList as T[]).filter(_ => !validator || validator.includes(_));
            }
        }
        return [];
    } catch (e) {
        return [];
    }
}

function put<T extends ListItemType>(key: string, value: T, maxSize: number = 5): void {
    try {
        const list = get(key);
        const existIndex = list.indexOf(value);
        if (existIndex >= 0) {
            list.splice(existIndex, 1);
            list.push(value);
        } else {
            list.push(value);
            if (list.length > maxSize) {
                list.splice(0, list.length - maxSize);
            }
        }

        localStorage.setItem(key, JSON.stringify(list));
    } catch (e) {
        // Do nothing
    }
}

function stack<T extends ListItemType>(key: string, value: T, maxSize: number = 5): void {
    try {
        const list = get(key);
        const existIndex = list.indexOf(value);
        if (existIndex >= 0) {
            list.splice(existIndex, 1);
            list.splice(0, 0, value);
        } else {
            list.splice(0, 0, value);
            if (list.length > maxSize) {
                list.splice(list.length - 1, list.length - maxSize);
            }
        }

        localStorage.setItem(key, JSON.stringify(list));
    } catch (e) {
        // Do nothing
    }
}

export const RecentUsedStorageUtil = Object.freeze({
    get,
    put,
    stack,
});
