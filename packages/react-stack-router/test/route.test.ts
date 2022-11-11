import {formatPath, Route} from "../src/route";

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
        const route = new Route<string>();
        route.insert("/service", "service");
        route.insert("/service/regular", "service-regular");
        route.insert("/service/regular", "service-regular");
        route.insert("/service/:regular", "service-regular-parameter");

        expect(() => route.insert("/service/:bbbb/nested", "duplicated")).toThrow();

        expect(route.lookup("/")).toBeNull();
        expect(route.lookup("/service//")).toStrictEqual({param: {}, payload: "service"});
        expect(route.lookup("/service/regular")).toStrictEqual({param: {}, payload: "service-regular"});
        expect(route.lookup("/service/regular/")).toStrictEqual({param: {}, payload: "service-regular"});
        expect(route.lookup("/service/other/")).toStrictEqual({
            param: {
                regular: "other",
            },
            payload: "service-regular-parameter",
        });
        expect(route.lookup("/service/other/nested")).toBeNull();
    });

    test("parameter", () => {
        const route = new Route<string>();
        route.insert("/service/regular/:name", "service-regular");
        route.insert("/service/regular/:name/nested/:more", "service-regular-nested");

        expect(route.lookup("/service/regular")).toBeNull();
        expect(route.lookup("/service/regular/")).toBeNull();
        expect(route.lookup("/service/regular/123")).toStrictEqual({
            param: {
                name: "123",
            },
            payload: "service-regular",
        });
        expect(route.lookup("/service/regular/123/nested")).toBeNull();
        expect(route.lookup("/service/regular/123/nested/456")).toStrictEqual({
            param: {
                name: "123",
                more: "456",
            },
            payload: "service-regular-nested",
        });
    });

    test("union", () => {
        const route = new Route<string>();
        route.insert("/service/:type(about|contact|game|order)", "service-union");
        route.insert("/service", "service-root");

        expect(() => route.insert("/service/:type(sound|other)/nested/route", "duplicated")).toThrow();

        expect(route.lookup("/service/about")).toStrictEqual({param: {type: "about"}, payload: "service-union"});
        expect(route.lookup("/service/contact")).toStrictEqual({param: {type: "contact"}, payload: "service-union"});
        expect(route.lookup("/service/game")).toStrictEqual({param: {type: "game"}, payload: "service-union"});
        expect(route.lookup("/service/order")).toStrictEqual({param: {type: "order"}, payload: "service-union"});
        expect(route.lookup("/service/aboutcontact")).toBeNull();
        expect(route.lookup("/service/aboutcontact")).toBeNull();
        expect(route.lookup("/service/about_order")).toBeNull();
        expect(route.lookup("/service/about|contact")).toBeNull();

        route.insert("/service/:type(about|contact|game|order)/nested/route", "service-union-nested-route");
        route.insert("/service/first/nested/route", "service-first-nested-route");
        expect(route.lookup("/service/about/nested/route")).toStrictEqual({param: {type: "about"}, payload: "service-union-nested-route"});
        expect(route.lookup("/service/order/nested/route")).toStrictEqual({param: {type: "order"}, payload: "service-union-nested-route"});
        expect(route.lookup("/service/first/nested/route")).toStrictEqual({param: {}, payload: "service-first-nested-route"});
        expect(route.lookup("/service/second/nested/route")).toBeNull();
    });

    test("wildcard", () => {
        const route = new Route<string>();
        route.insert("*", "service-wildcard");
        route.insert("/service/*", "service-wildcard");
        route.insert("/service/*/:userId", "service-wildcard-with-user-id");
        expect(route.lookup("/")).toStrictEqual({param: {"*": "/"}, payload: "service-wildcard"});
        expect(route.lookup("/service")).toBeNull();
        expect(route.lookup("/service/anymatch")).toStrictEqual({
            param: {"*": "anymatch"},
            payload: "service-wildcard",
        });
        expect(route.lookup("/service/game/f521312f1213213")).toStrictEqual({
            param: {"*": "game", userId: "f521312f1213213"},
            payload: "service-wildcard-with-user-id",
        });
    });
});
