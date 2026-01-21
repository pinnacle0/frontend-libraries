interface Data {
    value: string;
    expiryTimestamp: number;
}

/**
 * an expirable local storage (Singleton)
 */
export class ExpirableLocalStorage {
    private static readonly PREFIX = "@@EXPIRABLE/";
    private static readonly TRUE = "TRUE";
    private static readonly FALSE = "FALSE";
    private static readonly DEFAULT_DATA_VALUE = {expiryTimestamp: 0, value: null};

    private static instance: ExpirableLocalStorage;

    private storage: Storage = window.localStorage;

    /**
     * get the ExpirableStorage instance
     */
    static getInstance() {
        if (!ExpirableLocalStorage.instance) {
            ExpirableLocalStorage.instance = new ExpirableLocalStorage();
        }

        return ExpirableLocalStorage.instance;
    }

    /**
     * clear all keys
     */
    clearAll(): void {
        this.clear(Object.keys(this.storage).filter(key => key.startsWith(ExpirableLocalStorage.PREFIX)));
    }

    /**
     * set boolean value
     * @param key storage key
     * @param value boolean value
     * @param expiryTimestamp expiry timestamp
     */
    setBool(key: string, value: boolean, expiryTimestamp: number): void {
        this.set(key, value ? ExpirableLocalStorage.TRUE : ExpirableLocalStorage.FALSE, expiryTimestamp);
    }

    /**
     * set string
     * @param key storage key
     * @param value string value
     * @param expiryTimestamp expiry timestamp
     */
    setString(key: string, value: string, expiryTimestamp: number): void {
        this.set(key, value, expiryTimestamp);
    }

    /**
     * set number
     * @param key storage key
     * @param value number value
     * @param expiryTimestamp expiry timestamp
     */
    setNumber(key: string, value: number, expiryTimestamp: number): void {
        this.set(key, value.toString(), expiryTimestamp);
    }

    /**
     * set object
     * @param key storage key
     * @param item object
     * @param expiryTimestamp expiry timestamp
     */
    setObject<T extends object>(key: string, item: T, expiryTimestamp: number): void {
        this.set(key, JSON.stringify(item), expiryTimestamp);
    }

    /**
     * get boolean value
     * @param key storage key
     * @param defaultValue default value
     * @returns boolean value
     */
    getBool(key: string, defaultValue: boolean): boolean {
        const transformer = (_: string) => (_ === ExpirableLocalStorage.TRUE ? true : _ === ExpirableLocalStorage.FALSE ? false : null);
        return this.get(key, defaultValue, transformer);
    }

    /**
     * get string value
     * @param key storage key
     * @param defaultValue default value
     * @param validValues valid values
     * @returns string value
     */
    getString<T extends string = string>(key: string, defaultValue: T, validValues?: readonly T[]): T {
        const transformer = (_: string): T | null => {
            const typedValue = _ as T;
            return validValues ? (validValues.includes(typedValue) ? typedValue : null) : typedValue;
        };
        return this.get(key, defaultValue, transformer);
    }

    /**
     * get number value
     * @param key storage key
     * @param defaultValue default value
     * @param validator validator
     * @returns number value
     */
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

    /**
     * get object value
     * @param key storage key
     * @param defaultValue default value
     * @param validator validator
     * @returns object value
     */
    getObject<T extends object>(key: string, defaultValue: T, validator: (item: object) => boolean): T {
        const transformer = (_: string): T | null => {
            try {
                const obj: object = JSON.parse(_);
                if (validator(obj)) {
                    return obj as T;
                } else {
                    return null;
                }
            } catch {
                return null;
            }
        };
        return this.get(key, defaultValue, transformer);
    }

    /**
     * get the raw localstorage data
     * @param key storage key
     * @returns raw data
     */
    getRaw(key: string): string | null {
        try {
            return this.storage.getItem(this.canonicalKey(key));
        } catch {
            return null;
        }
    }

    /**
     * The ExpirableStorage's constructor should always be private to prevent direct
     * construction calls with the `new` operator.
     */
    private constructor() {}

    /**
     * get current timestamp
     * @returns current timestamp
     */
    private now(): number {
        return new Date().getTime();
    }

    /**
     * get value
     * @param key storage key
     * @param defaultValue
     * @param transformer
     * @returns
     */
    private get<T extends string | number | boolean | object>(key: string, defaultValue: T, transformer: (value: string) => T | null) {
        try {
            this.prune();
            const {value} = this.getData(this.canonicalKey(key));

            if (value !== null) {
                return transformer(value) || defaultValue;
            }

            return defaultValue;
        } catch {
            return defaultValue;
        }
    }

    /**
     * set value
     * @param key storage key
     * @param value storage value
     * @param expiryTimestamp The "expiryTimestamp" (expiration time) claim identifies the expiration time on or after which the value MUST NOT be accepted for processing. The processing of the "expiryTimestamp" claim requires that the current date/time MUST be before the expiration date/time listed in the "expiryTimestamp" claim.
     */
    private set(key: string, value: string, expiryTimestamp: number): void {
        try {
            this.setData(this.canonicalKey(key), {
                value,
                expiryTimestamp,
            });
        } catch {
            // Do nothing
        }
    }

    /**
     *
     * @param key storage key
     * @returns the original localstorage canonical key with prefix like "@@EXPIRABLE/key"
     */
    private canonicalKey(key: string): string {
        return `${ExpirableLocalStorage.PREFIX}${key}`;
    }

    private getData(key: string): Data {
        return JSON.parse(this.storage.getItem(key) || JSON.stringify(ExpirableLocalStorage.DEFAULT_DATA_VALUE)) as Data;
    }

    /**
     * set Data
     * @param key storage key
     * @param data storage value
     */
    private setData(key: string, data: Data): void {
        this.storage.setItem(key, JSON.stringify(data));
    }

    private clear(keys: string[]): void {
        try {
            keys.forEach(key => this.storage.removeItem(key));
        } catch {
            // Do nothing
        }
    }

    /**
     * delete the expired keys
     */
    private prune() {
        try {
            const expiredKeys = Object.keys(this.storage).filter(key => {
                if (!key.startsWith(ExpirableLocalStorage.PREFIX)) {
                    return false;
                }

                const {expiryTimestamp} = this.getData(key);
                return this.now() > expiryTimestamp;
            });

            this.clear(expiredKeys);
        } catch {
            // Do nothing
        }
    }
}
