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

interface Option {
    maxSize: number;
    actionOnDuplicate: "keep" | "reorder";
    actionOnInsert: "start" | "end";
}

function put<T extends ListItemType>(key: string, value: T, option: Partial<Option> = {}): void {
    try {
        const maxSize = option.maxSize || 5;
        const actionOnDuplicate = option.actionOnDuplicate || "reorder";
        const actionOnInsert = option.actionOnInsert || "end";
        const list = get(key);
        const existIndex = list.indexOf(value);
        if (existIndex >= 0) {
            if (actionOnDuplicate === "reorder") {
                list.splice(existIndex, 1);
                list.push(value);
            }
        } else {
            actionOnInsert === "end" ? list.push(value) : list.splice(0, 0, value);
            if (list.length > maxSize) {
                const insertPositionIndex = actionOnInsert === "end" ? 0 : list.length - 1;
                list.splice(insertPositionIndex, list.length - maxSize);
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
});
