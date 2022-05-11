interface CellMeasurerCacheOptions {
    defaultHeight: number;
}

export class CellMeasurerCache {
    private cellHeightCache: {[key: string]: number};
    private defaultHeight: number;

    constructor(options: CellMeasurerCacheOptions) {
        this.defaultHeight = options.defaultHeight;
        this.cellHeightCache = {};
    }

    private createCacheKey(index: number): string {
        return `key-${index}`;
    }

    clearAll() {
        this.cellHeightCache = {};
    }

    has(index: number) {
        return this.cellHeightCache[this.createCacheKey(index)] !== undefined;
    }

    set(height: number, index: number) {
        this.cellHeightCache[this.createCacheKey(index)] = height;
    }

    clear(index: number) {
        delete this.cellHeightCache[this.createCacheKey(index)];
    }

    getKey(index: number) {
        return this.createCacheKey(index);
    }

    itemSize(index: number): number {
        const cachedHeight = this.cellHeightCache[this.createCacheKey(index)];
        return cachedHeight ?? this.defaultHeight;
    }
}
