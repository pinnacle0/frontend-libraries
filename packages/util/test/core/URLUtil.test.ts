import {URLUtil} from "../../src/core/URLUtil.js";
import {describe, test, expect} from "vitest";

describe("URLUtil.transformOriginPrefix", () => {
    type TestEachRowSchema = {url: string; args: [any, any, ...any[]]; expected: any};

    test.each`
        url                                   | args
        ${"https://www.google.com"}           | ${["", "www"]}
        ${"https://www.google.com"}           | ${[" ", "www"]}
        ${"//www.google.com"}                 | ${["www", "m"]}
        ${"www.google.com"}                   | ${["www", "m"]}
        ${"https://www.google.com/game"}      | ${["www", "m"]}
        ${"https://www.google.com#hash"}      | ${["www", "m"]}
        ${"https://www.google.com?query=abc"} | ${["www", "m"]}
    `('throws error from transformOriginPrefix("$url", ...$args)', ({url, args}: TestEachRowSchema) => {
        expect(() => URLUtil.transformOriginPrefix(url, ...args)).toThrow();
    });

    test.each`
        url                                   | args                       | expected
        ${"file://"}                          | ${["local", "www"]}        | ${null}
        ${"file:///Users/foo/test.html"}      | ${[null, "www"]}           | ${null}
        ${"https://127.0.0.1"}                | ${["www", "m"]}            | ${null}
        ${"https://127.0.0.1:7446"}           | ${["www", "m"]}            | ${null}
        ${"https://127.0.0.1:7446"}           | ${[null, "m"]}             | ${null}
        ${"https://localhost:7446"}           | ${["local", "www"]}        | ${null}
        ${"https://localhost:7446"}           | ${["localhost", "google"]} | ${null}
        ${"https://localhost:7446"}           | ${["any", "google"]}       | ${null}
        ${"https://localhost:7446"}           | ${[null, "www"]}           | ${null}
        ${"https://google.com"}               | ${["g", "www"]}            | ${null}
        ${"https://google.com"}               | ${["www", "g"]}            | ${null}
        ${"https://google.com"}               | ${["google", "yahoo"]}     | ${"https://yahoo.com"}
        ${"https://google.com"}               | ${[null, "yahoo"]}         | ${"https://yahoo.google.com"}
        ${"https://google.com"}               | ${[null, "www"]}           | ${"https://www.google.com"}
        ${"https://google.com"}               | ${[null, ""]}              | ${"https://google.com"}
        ${"https://google.baby"}              | ${[null, "ns"]}            | ${"https://ns.google.baby"}
        ${"https://www.google.com"}           | ${["m", "www"]}            | ${null}
        ${"https://www.game.google.com"}      | ${["game", "www"]}         | ${null}
        ${"https://www.game.google.com"}      | ${[null, "ww2"]}           | ${"https://ww2.game.google.com"}
        ${"https://www.google.com"}           | ${["www", "m"]}            | ${"https://m.google.com"}
        ${"https://www.google.com"}           | ${[null, "m"]}             | ${"https://m.google.com"}
        ${"https://www.game.google.com"}      | ${["www", "m"]}            | ${"https://m.game.google.com"}
        ${"https://www.game.google.com:7446"} | ${["www", "m"]}            | ${"https://m.game.google.com:7446"}
        ${"https://h.google.com"}             | ${["h", "m"]}              | ${"https://m.google.com"}
        ${"https://g.google.com"}             | ${["g", "m"]}              | ${"https://m.google.com"}
        ${"https://www.google.com"}           | ${["www", ""]}             | ${"https://google.com"}
        ${"https://www.google.com:7446"}      | ${["www", ""]}             | ${"https://google.com:7446"}
        ${"https://123.google.com:7446"}      | ${["123", ""]}             | ${"https://google.com:7446"}
        ${"https://123.google.com:7446"}      | ${["123", "456"]}          | ${"https://456.google.com:7446"}
        ${"https://123.google.com:7446"}      | ${["123", "456.test"]}     | ${"https://456.test.google.com:7446"}
        ${"https://www.google.com"}           | ${[null, "m", "ftp"]}      | ${"ftp://m.google.com"}
        ${"https://www.google.com"}           | ${["www", "m", "ftp"]}     | ${"ftp://m.google.com"}
        ${"https://www.google.com"}           | ${["www", "m", ""]}        | ${"https://m.google.com"}
        ${"https://www.google.com"}           | ${["m", "chat", ""]}       | ${null}
        ${"http://www.google.com"}            | ${["www", "chat", "wss"]}  | ${"wss://chat.google.com"}
    `('returns expected from transformOriginPrefix("$url", ...$args)', ({url, args, expected}: TestEachRowSchema) => {
        expect(URLUtil.transformOriginPrefix(url, ...args)).toBe(expected);
    });
});
