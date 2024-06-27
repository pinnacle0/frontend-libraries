import type {BrowserOS} from "@pinnacle0/web-ui/util/BrowserUtil/type";
import {parseUserAgentOS} from "../../src/util/BrowserUtil/parseUserAgentOS";

type TestEachRowSchema = {
    userAgent: string;
    expected: BrowserOS;
};

describe("BrowserUtil.parseUserAgentOS", () => {
    test.each`
        userAgent                                                                                                                                                               | expected
        ${"Mozilla/5.0 (Windows Phone 10.0; Android 6.0.1; Microsoft; RM-1152) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Mobile Safari/537.36 Edge/15.15254"} | ${"windows"}
        ${"Mozilla/5.0 (iPhone14,6; U; CPU iPhone OS 15_4 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) Version/10.0 Mobile/19E241 Safari/602.1"}                     | ${"ios"}
        ${"Mozilla/5.0 (iPhone13,2; U; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) Version/10.0 Mobile/15E148 Safari/602.1"}                     | ${"ios"}
        ${"Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36"}                                                    | ${"android"}
        ${"Mozilla/5.0 (Linux; Android 13; SM-S901B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36"}                                             | ${"android"}
        ${"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36"}                                              | ${"mac"}
        ${"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0.2 Safari/601.3.9"}                                               | ${"mac"}
        ${"Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:15.0) Gecko/20100101 Firefox/15.0.1"}                                                                                     | ${"other"}
        ${"Mozilla/5.0 (PlayStation; PlayStation 5/2.26) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0 Safari/605.1.15"}                                                | ${"other"}
    `("BrowserUtil.parseUserAgentOS($userAgent) returns '$expected'", ({userAgent, expected}: TestEachRowSchema) => {
        expect(parseUserAgentOS(userAgent)).toBe(expected);
    });
});
