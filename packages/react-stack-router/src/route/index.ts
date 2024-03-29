import {invariant} from "../util";
import {matchPathSegment, patternType} from "./matchPath";

export interface RouteNode<T> {
    pattern: string;
    children: Map<string, RouteNode<T>>;
    payload: T | null;
    parent: RouteNode<T> | null;
    fallbackNode?: RouteNode<T>;
    parameterNode?: RouteNode<T>;
    unionNode?: RouteNode<T>;
    wildcardNode?: RouteNode<T>;
}

export interface Match<T> {
    params: {[key: string]: string};
    payload: T;
    matchedSegments: string[];
    fallback: boolean;
}

/**
 * A Lightweight route based on Prefix tree
 */
export class Route<T> {
    private cache = new Map<string, Match<T> | null>();
    private root: RouteNode<T> = {pattern: "", parent: null, children: new Map(), payload: null};

    insert(path: string, payload: T): void {
        this.cache.clear();
        const segments = pathToSegments(path);

        let currentNode: RouteNode<T> = this.root;
        for (const segment of segments) {
            const node = currentNode.children.get(segment);
            if (node !== undefined) {
                currentNode = node;
            } else {
                const newNode = this.createNode(segment, currentNode);
                currentNode.children.set(segment, newNode);
                currentNode = newNode;
            }
        }

        currentNode.payload = payload;
    }

    lookup(path: string): Match<T> | null {
        const cachedMatched = this.cache.get(path);
        if (cachedMatched) {
            return cachedMatched;
        } else {
            const match = this.freshLookup(path);
            this.cache.set(path, match);
            return match;
        }
    }

    private freshLookup(path: string): Match<T> | null {
        const segments = pathToSegments(path);
        let params: Record<string, string> = {};
        let nextNode: RouteNode<T> = this.root;
        const matchedSegments: string[] = [];

        for (const segment of segments) {
            const childNode = nextNode.children.get(segment);
            if (childNode) {
                nextNode = childNode;
            } else {
                if (nextNode.parameterNode) {
                    nextNode = nextNode.parameterNode;
                } else if (nextNode.unionNode) {
                    nextNode = nextNode.unionNode;
                } else if (nextNode.wildcardNode) {
                    nextNode = nextNode.wildcardNode;
                } else {
                    return this.matchFallbackRoute();
                }

                const matched = matchPathSegment(nextNode.pattern, segment);
                if (!matched) {
                    return this.matchFallbackRoute();
                }

                params = {...params, ...matched.param};
            }
            matchedSegments.push(segment);
        }

        // if matched node do not have payload, lookup parent wildcard
        if (nextNode.payload === null) {
            if (nextNode.parent?.wildcardNode) {
                nextNode = nextNode.parent.wildcardNode;
            }
        }

        // if matched node still do not have payload, lookup fallback node
        if (nextNode.payload === null) {
            return this.matchFallbackRoute();
        }

        // removed matched node itself
        matchedSegments.pop();

        return this.createMatch(nextNode.payload, params, matchedSegments);
    }

    private createMatch(payload: T | null, params: Record<string, string>, matchedSegments: string[], fallback = false): Match<T> | null {
        return payload
            ? {
                  payload,
                  params,
                  matchedSegments,
                  fallback,
              }
            : null;
    }

    private matchFallbackRoute(): Match<T> | null {
        return this.createMatch(this.root.fallbackNode?.payload ?? null, {}, [], true);
    }

    private createNode(segment: string, currentNode: RouteNode<T>): RouteNode<T> {
        invariant(currentNode.pattern !== "**", "can not define any path after a fallback node");
        const type = patternType(segment);
        const newNode: RouteNode<T> = {pattern: segment, children: new Map(), payload: null, parent: currentNode};

        switch (type) {
            case "parameter":
                invariant(currentNode.parameterNode === undefined, `duplicate declaration of parameter node ${segment} on existing node ${currentNode.parameterNode?.pattern}`);
                currentNode.parameterNode = newNode;
                return newNode;
            case "wildcard":
                currentNode.wildcardNode = newNode;
                return newNode;
            case "union":
                invariant(currentNode.unionNode === undefined, `duplicate declaration of union node ${segment} on existing node ${currentNode.unionNode?.pattern}`);
                currentNode.unionNode = newNode;
                return newNode;
            case "fallback":
                invariant(currentNode.parent === null, "fallback node can be only define at root of route");
                currentNode.fallbackNode = newNode;
                return newNode;
            case "normal":
                return newNode;
        }
    }
}

export function pathToSegments(path: string): string[] {
    const formattedPath = formatPath(path);

    if (formattedPath === "/") {
        return ["/"];
    } else {
        return formattedPath.split("/");
    }
}

export function formatPath(path: string): string {
    let formatted = path.replaceAll(/[/]+/g, "/");

    if (formatted === "/") return formatted;

    // removed trailing '/'
    if (formatted[formatted.length - 1] === "/") {
        formatted = formatted.slice(0, -1);
    }

    // removed leading '/'
    if (formatted[0] === "/") {
        formatted = formatted.slice(1);
    }

    return formatted;
}
