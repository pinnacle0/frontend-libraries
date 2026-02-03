import type {Location} from "../type";

export interface HistoryInfo {
    location: Location;
    params: Record<string, string>;
}

type ScreenConfig = {
    content: React.ComponentType<any>;
    location: Location;
    params: Record<string, string>;
    searchParams: Record<string, string>;
};

export class Screen {
    readonly content: React.ComponentType<any>;
    readonly location: Location;
    readonly params: Record<string, string>;
    readonly searchParams: Record<string, string>;

    constructor({content, location, params, searchParams}: ScreenConfig) {
        this.content = content;
        this.location = location;
        this.params = params;
        this.searchParams = searchParams;
    }
}
