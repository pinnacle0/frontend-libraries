interface Data {
    value: string;
    exp: number;
}

/**
 * In mobile Safari, the user may turn on "Block All Cookies".
 * In such situation, accessing to localStorage/sessionStorage will throw error.
 */

type ClearOptions = {keys: string[] | ((key: string) => boolean)} | {exceptKeys: string[] | ((key: string) => boolean)};

/**
 * an expirable storage management tool
 */
export class ExpirableStorageHelper {
    private static readonly PREFIX = "@@EXPIRABLE/";
    private static readonly TRUE = "TRUE";
    private static readonly FALSE = "FALSE";
    private static readonly DEFAULT_DATA_VALUE = {exp: 0, value: null};

    constructor(private readonly storage: Storage) {}

    clear(options?: ClearOptions): void {
        try {
            if (options) {
                if ("keys" in options) {
                    const {keys} = options;
                    if (Array.isArray(keys)) {
                        keys.forEach(key => this.storage.removeItem(this._key(key)));
                    } else {
                        this.forEach(key => {
                            if (keys(key)) {
                                this.storage.removeItem(this._key(key));
                            }
                        });
                    }
                } else {
                    const {exceptKeys} = options;
                    this.forEach(key => {
                        const shouldNotRemove = Array.isArray(exceptKeys) ? exceptKeys.includes(key) : exceptKeys(key);
                        if (!shouldNotRemove) {
                            this.storage.removeItem(this._key(key));
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

    setBool(key: string, value: boolean, exp: number): void {
        this.set(key, value ? ExpirableStorageHelper.TRUE : ExpirableStorageHelper.FALSE, exp);
    }

    setString(key: string, value: string, exp: number): void {
        this.set(key, value, exp);
    }

    setNumber(key: string, value: number, exp: number): void {
        this.set(key, value.toString(), exp);
    }

    setObject<T extends object>(key: string, item: T, exp: number): void {
        this.set(key, JSON.stringify(item), exp);
    }

    getBool(key: string, defaultValue: boolean): boolean {
        const transformer = (_: string) => (_ === ExpirableStorageHelper.TRUE ? true : _ === ExpirableStorageHelper.FALSE ? false : null);
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
            return this.storage.getItem(this._key(key));
        } catch (e) {
            return null;
        }
    }

    getExpiredKeys(): string[] {
        const keys = Object.keys(this.storage).filter(key => {
            if (!key.startsWith(ExpirableStorageHelper.PREFIX)) {
                return false;
            }

            const {exp} = this.getData(key);
            return this.now() > exp;
        });

        return keys.map(_ => _.replace(new RegExp(`^${ExpirableStorageHelper.PREFIX}`), ""));
    }

    private now(): number {
        return new Date().getTime();
    }

    private get<T extends string | number | boolean | object>(key: string, defaultValue: T, transformer: (value: string) => T | null) {
        try {
            this.prune();
            const {value} = this.getData(this._key(key));

            if (value !== null) {
                return transformer(value) || defaultValue;
            }

            return defaultValue;
        } catch (e) {
            return defaultValue;
        }
    }

    /**
     * set value
     * @param key storage key
     * @param value storage value
     * @param exp The "exp" (expiration time) claim identifies the expiration time on or after which the value MUST NOT be accepted for processing. The processing of the "exp" claim requires that the current date/time MUST be before the expiration date/time listed in the "exp" claim.
     */
    private set(key: string, value: string, exp: number): void {
        try {
            this.setData(this._key(key), {
                value,
                exp,
            });
            this.prune();
        } catch (e) {
            // Do nothing
        }
    }

    private _key(key: string): string {
        return `${ExpirableStorageHelper.PREFIX}${key}`;
    }

    private getData(key: string): Data {
        return JSON.parse(this.storage.getItem(key) || JSON.stringify(ExpirableStorageHelper.DEFAULT_DATA_VALUE)) as Data;
    }

    private setData(key: string, data: Data): void {
        this.storage.setItem(key, JSON.stringify(data));
    }

    private prune() {
        try {
            const expiredKeys = this.getExpiredKeys();

            this.clear({keys: expiredKeys});
        } catch (e) {
            // Do nothing
        }
    }

    private forEach(callback: (key: string, value: string) => void): void {
        Object.keys(this.storage).forEach(key => callback(this._key(key), this.storage.getItem(key)!));
    }
}
