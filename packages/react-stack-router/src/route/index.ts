import {matchPath, patternType} from "./match";

interface RouteNode<T> {
    pattern: string;
    children: Map<string, RouteNode<T>>;
    payload: T | null;
    parent: RouteNode<T> | null;
    parameterNode?: RouteNode<T>;
    unionNode?: RouteNode<T>;
    wildcardNode?: RouteNode<T>;
}

interface Match<T> {
    param: {[key: string]: string};
    payload: T;
}

export class Route<T> {
    private root: RouteNode<T> = {pattern: "", parent: null, children: new Map(), payload: null};

    insert(path: string, payload: T): void {
        const formattedPath = formatPath(path);
        const segments = formattedPath === "/" ? ["/"] : formattedPath.split("/");

        let nextNode: RouteNode<T> = this.root;
        for (const segment of segments) {
            const node = nextNode.children.get(segment);
            if (node !== undefined) {
                nextNode = node;
            } else {
                const type = patternType(segment);
                const newNode = this.createRadixRoute(segment, nextNode);

                nextNode.children.set(segment, newNode);

                if (type === "parameter") {
                    if (nextNode.parameterNode) {
                        throw new Error(`[react-stack-router]: duplicate declaration of paramenter node ${segment} on existing node ${nextNode.parameterNode.pattern} `);
                    }
                    nextNode.parameterNode = newNode;
                } else if (type === "wildcard") {
                    nextNode.wildcardNode = newNode;
                } else if (type === "union") {
                    if (nextNode.unionNode) {
                        throw new Error(`[react-stack-router]: duplicate declaration of union node ${segment} on existing node ${nextNode.unionNode.pattern} `);
                    }
                    nextNode.unionNode = newNode;
                }
                nextNode = newNode;
            }
        }

        nextNode.payload = payload;
    }

    lookup(path: string): Match<T> | null {
        const formattedPath = formatPath(path);

        const segments = formattedPath === "/" ? ["/"] : formattedPath.split("/");
        let param: Record<string, string> = {};
        let nextNode: RouteNode<T> = this.root;

        for (const segment of segments) {
            const childNode = nextNode.children.get(segment);
            if (childNode !== undefined) {
                nextNode = childNode;
            } else {
                if (nextNode.parameterNode) {
                    nextNode = nextNode.parameterNode;
                } else if (nextNode.unionNode) {
                    nextNode = nextNode.unionNode;
                } else if (nextNode.wildcardNode) {
                    nextNode = nextNode.wildcardNode;
                } else {
                    return null;
                }

                const matched = matchPath(nextNode.pattern, segment);
                if (!matched) {
                    return null;
                }
                param = {...param, ...matched.param};
            }
        }

        return nextNode.payload
            ? {
                  payload: nextNode.payload,
                  param,
              }
            : null;
    }

    private createRadixRoute(pattern: string, parent: RouteNode<T>): RouteNode<T> {
        return {pattern, children: new Map(), payload: null, parent};
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