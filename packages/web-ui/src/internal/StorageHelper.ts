/**
 * In mobile Safari, the user may turn on "Block All Cookies".
 * In such situation, accessing to localStorage/sessionStorage will throw error.
 */

type ClearOptions = {keys: string[] | ((key: string) => boolean)} | {exceptKeys: string[] | ((key: string) => boolean)};

export class StorageHelper {
    private static readonly trueBoolValue = "TRUE";
    private static readonly falseBoolValue = "FALSE";
    private globalPrefix: string | null = null;

    constructor(private readonly storage: Storage) {}

    setGlobalPrefix(prefix: string) {
        this.globalPrefix = prefix;
    }

    clear(options?: ClearOptions): void {
        try {
            if (options) {
                if ("keys" in options) {
                    const {keys} = options;
                    if (Array.isArray(keys)) {
                        keys.forEach(key => this.storage.removeItem(key));
                    } else {
                        this.forEach(key => {
                            if (keys(key)) {
                                this.storage.removeItem(key);
                            }
                        });
                    }
                } else {
                    const {exceptKeys} = options;
                    this.forEach(key => {
                        const shouldNotRemove = Array.isArray(exceptKeys) ? exceptKeys.includes(key) : exceptKeys(key);
                        if (!shouldNotRemove) {
                            this.storage.removeItem(key);
                        }
                    });
                }
            } else {
                this.storage.clear();
            }
        } catch (e) {
            // Do nothing
        }
    }

    setBool(key: string, value: boolean): void {
        this.set(key, value ? StorageHelper.trueBoolValue : StorageHelper.falseBoolValue);
    }

    setString(key: string, value: string): void {
        this.set(key, value);
    }

    setNumber(key: string, value: number): void {
        this.set(key, value.toString());
    }

    setObject<T extends object>(key: string, item: T): void {
        this.set(key, JSON.stringify(item));
    }

    getBool(key: string, defaultValue: boolean): boolean {
        const transformer = (_: string) => (_ === StorageHelper.trueBoolValue ? true : _ === StorageHelper.falseBoolValue ? false : null);
        return this.get(key, defaultValue, transformer);
    }

    getString<T extends string = string>(key: string, defaultValue: T, validValues?: readonly T[]): T {
        const transformer = (_: string): T | null => {
            const typedValue = _ as T;
            return validValues ? (validValues.includes(typedValue) ? typedValue : null) : typedValue;
        };
        return this.get(key, defaultValue, transformer);
    }

    getNumber(key: string, defaultValue: number, validator?: number[] | ((value: number) => boolean)): number {
        const transformer = (_: string): number | null => {
            const numberedData = Number(_);
            if (Number.isFinite(numberedData)) {
                if (validator === undefined) {
                    return numberedData;
                } else if (typeof validator === "function") {
                    if (validator(numberedData)) {
                        return numberedData;
                    }
                } else {
                    if (validator.includes(numberedData)) {
                        return numberedData;
                    }
                }
            }
            return null;
        };
        return this.get(key, defaultValue, transformer);
    }

    getObject<T extends object>(key: string, defaultValue: T, validator: (item: object) => boolean): T {
        const transformer = (_: string): T | null => {
            try {
                const obj: object = JSON.parse(_);
                if (validator(obj)) {
                    return obj as T;
                } else {
                    return null;
                }
            } catch (e) {
                return null;
            }
        };
        return this.get(key, defaultValue, transformer);
    }

    getRaw(key: string): string | null {
        try {
            return this.storage.getItem(key);
        } catch (e) {
            return null;
        }
    }

    private set(key: string, value: string): void {
        try {
            const prefix = this.globalPrefix ? `${this.globalPrefix}-` : "";
            this.storage.setItem(prefix + key, value);
        } catch (e) {
            // Do nothing
        }
    }

    private get<T extends string | number | boolean | object>(key: string, defaultValue: T, transformer: (value: string) => T | null) {
        try {
            const prefix = this.globalPrefix ? `${this.globalPrefix}-` : "";
            const data = this.storage.getItem(prefix + key);
            if (data !== null) {
                const typedData = transformer(data);
                if (typedData !== null) {
                    return typedData;
                }
            }
            return defaultValue;
        } catch (e) {
            return defaultValue;
        }
    }

    private forEach(callback: (key: string, value: string) => void): void {
        Object.keys(this.storage).forEach(key => callback(key, this.storage.getItem(key)!));
    }
}
