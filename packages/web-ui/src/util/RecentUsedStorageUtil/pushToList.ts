export function pushToList<T>(list: T[], newItem: T, maxSize: number, actionOnDuplicate: "keep" | "reorder", actionOnInsert: "start" | "end"): T[] {
    const newList = [...list];
    const existIndex = newList.indexOf(newItem);

    if (existIndex >= 0) {
        if (actionOnDuplicate === "reorder") {
            newList.splice(existIndex, 1);
            actionOnInsert === "end" ? newList.push(newItem) : newList.splice(0, 0, newItem);
        }
    } else {
        actionOnInsert === "end" ? newList.push(newItem) : newList.splice(0, 0, newItem);
        if (newList.length > maxSize) {
            const insertPositionIndex = actionOnInsert === "end" ? 0 : newList.length - 1;
            newList.splice(insertPositionIndex, newList.length - maxSize);
        }
    }

    return newList;
}
