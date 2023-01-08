import type {Match} from "../src/route";
import {formatPath, Route} from "../src/route";

const setupRoute = (config: Record<string, string>): Route<string> => {
    const route = new Route<string>();
    for (const path in config) {
        route.insert(path, config[path]);
    }
    return route;
};

const expectToMatch = (target: Match<string> | null, expectMatch: Match<string> | null) => expect(target).toStrictEqual(expectMatch);

describe("RadixRoute testing", () => {
    test.each`
        path                | expected
        ${"//"}             | ${"/"}
        ${"///"}            | ${"/"}
        ${"////"}           | ${"/"}
        ${"//video//:id"}   | ${"video/:id"}
        ${"//video////:id"} | ${"video/:id"}
    `("returns $expected when formatPath $path", ({path, expected}) => {
        expect(formatPath(path)).toBe(expected);
    });

    test("basic", () => {
        const routeConfig = {
            "/service": "service-route",
            "/service/regular": "service-regular-route",
            "/service/:regular": "service-regular-parameter",
        } satisfies Record<string, string>;
        const route = setupRoute(routeConfig);
        route.insert("/service/regular", "service-regular-reassign");

        expect(() => route.insert("/service/:bbbb/nested", "duplicated")).toThrow();
        expectToMatch(route.lookup("/"), null);
        expectToMatch(route.lookup("/service/other/nested"), null);
        expectToMatch(route.lookup("/service//"), {params: {}, parents: [], payload: routeConfig["/service"]});
        expectToMatch(route.lookup("/service/regular"), {params: {}, parents: [{payload: routeConfig["/service"], matchedSegment: "service"}], payload: "service-regular-reassign"});
        expectToMatch(route.lookup("/service/other/"), {
            params: {
                regular: "other",
            },
            parents: [
                {
                    payload: routeConfig["/service"],
                    matchedSegment: "service",
                },
            ],
            payload: routeConfig["/service/:regular"],
        });
    });

    test("parameter", () => {
        const routeConfig = {
            "/service/regular/:name": "service-regular",
            "/service/regular/:name/nested/:more": "service-regular-nested",
        } satisfies Record<string, string>;
        const route = setupRoute(routeConfig);

        expectToMatch(route.lookup("/service/regular"), null);
        expectToMatch(route.lookup("/service/regular/"), null);
        expectToMatch(route.lookup("/service/regular/123/nested"), null);
        expectToMatch(route.lookup("/service/regular/123"), {
            params: {
                name: "123",
            },
            parents: [
                {payload: null, matchedSegment: "service"},
                {payload: null, matchedSegment: "regular"},
            ],
            payload: routeConfig["/service/regular/:name"],
        });
        expect(route.lookup("/service/regular/123/nested/456")).toStrictEqual({
            params: {
                name: "123",
                more: "456",
            },
            parents: [
                {payload: null, matchedSegment: "service"},
                {payload: null, matchedSegment: "regular"},
                {payload: routeConfig["/service/regular/:name"], matchedSegment: "123"},
                {payload: null, matchedSegment: "nested"},
            ],
            payload: routeConfig["/service/regular/:name/nested/:more"],
        });
    });

    test("union", () => {
        const routeConfig = {
            "/service/:type(about|contact|game|order)": "service-union",
            "/service": "service-root",
        } satisfies Record<string, string>;
        const route = setupRoute(routeConfig);

        expect(() => route.insert("/service/:type(sound|other)/nested/route", "duplicated")).toThrow();
        expectToMatch(route.lookup("/service/about"), {
            params: {type: "about"},
            parents: [
                {
                    payload: routeConfig["/service"],
                    matchedSegment: "service",
                },
            ],
            payload: routeConfig["/service/:type(about|contact|game|order)"],
        });
        expectToMatch(route.lookup("/service/contact"), {
            params: {type: "contact"},
            parents: [
                {
                    payload: routeConfig["/service"],
                    matchedSegment: "service",
                },
            ],
            payload: routeConfig["/service/:type(about|contact|game|order)"],
        });
        expectToMatch(route.lookup("/service/game"), {
            params: {type: "game"},
            parents: [
                {
                    payload: routeConfig["/service"],
                    matchedSegment: "service",
                },
            ],
            payload: routeConfig["/service/:type(about|contact|game|order)"],
        });
        expectToMatch(route.lookup("/service/order"), {
            params: {type: "order"},
            parents: [
                {
                    payload: routeConfig["/service"],
                    matchedSegment: "service",
                },
            ],
            payload: routeConfig["/service/:type(about|contact|game|order)"],
        });
        expectToMatch(route.lookup("/service/aboutcontact"), null);
        expectToMatch(route.lookup("/service/about_order"), null);
        expectToMatch(route.lookup("/service/about|contact"), null);

        route.insert("/service/:type(about|contact|game|order)/nested/route", "service-union-nested-route");
        route.insert("/service/first/nested/route", "service-first-nested-route");
        expectToMatch(route.lookup("/service/about/nested/route"), {
            params: {type: "about"},
            parents: [
                {payload: routeConfig["/service"], matchedSegment: "service"},
                {payload: routeConfig["/service/:type(about|contact|game|order)"], matchedSegment: "about"},
                {payload: null, matchedSegment: "nested"},
            ],
            payload: "service-union-nested-route",
        });
        expectToMatch(route.lookup("/service/order/nested/route"), {
            params: {type: "order"},
            parents: [
                {payload: routeConfig["/service"], matchedSegment: "service"},
                {payload: routeConfig["/service/:type(about|contact|game|order)"], matchedSegment: "order"},
                {payload: null, matchedSegment: "nested"},
            ],
            payload: "service-union-nested-route",
        });
        expectToMatch(route.lookup("/service/first/nested/route"), {
            params: {},
            parents: [
                {payload: routeConfig["/service"], matchedSegment: "service"},
                {payload: null, matchedSegment: "first"},
                {payload: null, matchedSegment: "nested"},
            ],

            payload: "service-first-nested-route",
        });
        expectToMatch(route.lookup("/service/second/nested/route"), null);
    });

    test("wildcard", () => {
        const routeConfig = {
            "*": "service-wildcard",
            "/service/*": "service-wildcard",
            "/service/*/:userId": "service-wildcard-with-user-id",
            "/service/other/:userId": "service-other-match-with-user-id",
        };
        const route = setupRoute(routeConfig);
        expectToMatch(route.lookup("/service"), null);
        expectToMatch(route.lookup("/"), {params: {}, parents: [], payload: routeConfig["*"]});
        expectToMatch(route.lookup("/service/wildcard"), {
            params: {},
            parents: [{payload: null, matchedSegment: "service"}],
            payload: routeConfig["/service/*"],
        });
        expectToMatch(route.lookup("/service/game/f521312f1213213"), {
            params: {userId: "f521312f1213213"},
            parents: [
                {payload: null, matchedSegment: "service"},
                {payload: routeConfig["/service/*"], matchedSegment: "game"},
            ],
            payload: routeConfig["/service/*/:userId"],
        });
        expectToMatch(route.lookup("/service/other/f521312f1213213"), {
            params: {userId: "f521312f1213213"},
            parents: [
                {payload: null, matchedSegment: "service"},
                {payload: null, matchedSegment: "other"},
            ],
            payload: routeConfig["/service/other/:userId"],
        });
    });

    test("fallback", () => {
        const routeConfig = {
            "**": "fallback-route",
            "/": "root-route",
            "*": "root-wildcard-route",
            "/service": "service-route",
        };

        const route = setupRoute(routeConfig);

        expect(() => route.insert("other/**", "non-root-fallback")).toThrow();
        expect(() => route.insert("**/name", "fallback-before-normal-segment")).toThrow();

        expectToMatch(route.lookup("/non-of-match"), {params: {}, parents: [], payload: routeConfig["*"]});
        expectToMatch(route.lookup("/service/123"), {params: {}, parents: [], payload: routeConfig["**"]});
        expectToMatch(route.lookup("/service"), {params: {}, parents: [], payload: routeConfig["/service"]});
        expectToMatch(route.lookup("/non-of-match/nested"), {params: {}, parents: [], payload: routeConfig["**"]});
        expectToMatch(route.lookup("/"), {params: {}, parents: [], payload: routeConfig["/"]});
    });
});
