import type {BrowserOS} from "./type";

export function parseUserAgentOS(userAgent: string): BrowserOS {
    if (userAgent.toUpperCase().includes("WINDOWS")) {
        // https://stackoverflow.com/a/19176790
        return "windows";
    } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
        // Also include "Mac" keyword
        return "ios";
    } else if (/Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
        return "android";
    } else if (/Mac OS/i.test(userAgent)) {
        return "mac";
    } else {
        return "other";
    }
}
