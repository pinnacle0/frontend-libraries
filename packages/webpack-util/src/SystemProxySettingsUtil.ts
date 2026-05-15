import os from "os";
import {spawnSync} from "child_process";

export type SystemProxyKind = "socks" | "http";

export interface SystemProxySettings {
    kind: SystemProxyKind;
    server: string;
    port: number;
}

/**
 * Reads macOS system proxy settings via `networksetup`.
 *
 * SOCKS is preferred over HTTP: SOCKS5 (with hostname mode) forwards the
 * target hostname to the proxy, so rule-based proxy clients (Shadowrocket,
 * Surge, ClashX, etc.) can evaluate DOMAIN-SUFFIX / DOMAIN-KEYWORD rules.
 * The HTTP slot is used as a fallback because Shadowrocket's
 * "Set As System Proxy" toggle on macOS populates the web/secure-web slots
 * (read by `-getwebproxy`) and does not always set the SOCKS slot.
 *
 * Only works on macOS — returns null on Windows/Linux.
 */
export class SystemProxySettingsUtil {
    static get(): SystemProxySettings | null {
        if (os.platform() !== "darwin") return null;

        const which = spawnSync("which", ["networksetup"]);
        if (which.status !== 0) return null;
        const bin = which.stdout.toString().trim();

        const listDevices = spawnSync(bin, ["-listallnetworkservices"]);
        if (listDevices.status !== 0) return null;
        const devices = listDevices.stdout.toString().trim().split("\n").slice(1);

        for (const device of devices) {
            const socks = this.readProxySlot(bin, "-getsocksfirewallproxy", device);
            if (socks) return {kind: "socks", ...socks};

            const http = this.readProxySlot(bin, "-getwebproxy", device);
            if (http) return {kind: "http", ...http};
        }
        return null;
    }

    private static readProxySlot(bin: string, command: string, device: string): {server: string; port: number} | null {
        const result = spawnSync(bin, [command, device]);
        if (result.status !== 0) return null;
        return this.parseRawProxySettings(result.stdout.toString().trim());
    }

    private static parseRawProxySettings(raw: string): {server: string; port: number} | null {
        const setting = raw.split("\n").reduce(
            (settings, line) => {
                const [key, value] = line.split(":").map(s => s.trim());
                if (key === "Enabled") {
                    settings.enabled = value === "Yes";
                } else if (key === "Server") {
                    settings.server = value;
                } else if (key === "Port") {
                    settings.port = Number(value);
                }
                return settings;
            },
            {} as {enabled: boolean; server: string; port: number}
        );

        return setting.enabled && setting.server && setting.port > 0 ? {server: setting.server, port: setting.port} : null;
    }
}
