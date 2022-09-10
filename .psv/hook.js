var Ff = Object.create;
var ki = Object.defineProperty;
var kf = Object.getOwnPropertyDescriptor;
var Bf = Object.getOwnPropertyNames;
var Gf = Object.getPrototypeOf,
    Uf = Object.prototype.hasOwnProperty;
var c = (e, t) => () => (t || e((t = {exports: {}}).exports, t), t.exports);
var Wf = (e, t, r, n) => {
    if ((t && typeof t == "object") || typeof t == "function") for (let i of Bf(t)) !Uf.call(e, i) && i !== r && ki(e, i, {get: () => t[i], enumerable: !(n = kf(t, i)) || n.enumerable});
    return e;
};
var Q = (e, t, r) => ((r = e != null ? Ff(Gf(e)) : {}), Wf(t || !e || !e.__esModule ? ki(r, "default", {value: e, enumerable: !0}) : r, e));
var Hi = c(ye => {
    "use strict";
    Object.defineProperty(ye, "__esModule", {value: !0});
    function We(e, t, r) {
        var n;
        if ((r === void 0 && (r = {}), !t.codes)) {
            t.codes = {};
            for (var i = 0; i < t.chars.length; ++i) t.codes[t.chars[i]] = i;
        }
        if (!r.loose && (e.length * t.bits) & 7) throw new SyntaxError("Invalid padding");
        for (var s = e.length; e[s - 1] === "="; ) if ((--s, !r.loose && !(((e.length - s) * t.bits) & 7))) throw new SyntaxError("Invalid padding");
        for (var o = new ((n = r.out) != null ? n : Uint8Array)(((s * t.bits) / 8) | 0), a = 0, u = 0, l = 0, f = 0; f < s; ++f) {
            var h = t.codes[e[f]];
            if (h === void 0) throw new SyntaxError("Invalid character " + e[f]);
            (u = (u << t.bits) | h), (a += t.bits), a >= 8 && ((a -= 8), (o[l++] = 255 & (u >> a)));
        }
        if (a >= t.bits || 255 & (u << (8 - a))) throw new SyntaxError("Unexpected end of data");
        return o;
    }
    function Ve(e, t, r) {
        r === void 0 && (r = {});
        for (var n = r, i = n.pad, s = i === void 0 ? !0 : i, o = (1 << t.bits) - 1, a = "", u = 0, l = 0, f = 0; f < e.length; ++f)
            for (l = (l << 8) | (255 & e[f]), u += 8; u > t.bits; ) (u -= t.bits), (a += t.chars[o & (l >> u)]);
        if ((u && (a += t.chars[o & (l << (t.bits - u))]), s)) for (; (a.length * t.bits) & 7; ) a += "=";
        return a;
    }
    var Bi = {chars: "0123456789ABCDEF", bits: 4},
        Gi = {chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567", bits: 5},
        Ui = {chars: "0123456789ABCDEFGHIJKLMNOPQRSTUV", bits: 5},
        Wi = {chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", bits: 6},
        Vi = {chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_", bits: 6},
        Vf = {
            parse: function (t, r) {
                return We(t.toUpperCase(), Bi, r);
            },
            stringify: function (t, r) {
                return Ve(t, Bi, r);
            },
        },
        Hf = {
            parse: function (t, r) {
                return r === void 0 && (r = {}), We(r.loose ? t.toUpperCase().replace(/0/g, "O").replace(/1/g, "L").replace(/8/g, "B") : t, Gi, r);
            },
            stringify: function (t, r) {
                return Ve(t, Gi, r);
            },
        },
        Xf = {
            parse: function (t, r) {
                return We(t, Ui, r);
            },
            stringify: function (t, r) {
                return Ve(t, Ui, r);
            },
        },
        zf = {
            parse: function (t, r) {
                return We(t, Wi, r);
            },
            stringify: function (t, r) {
                return Ve(t, Wi, r);
            },
        },
        Kf = {
            parse: function (t, r) {
                return We(t, Vi, r);
            },
            stringify: function (t, r) {
                return Ve(t, Vi, r);
            },
        },
        Yf = {parse: We, stringify: Ve};
    ye.base16 = Vf;
    ye.base32 = Hf;
    ye.base32hex = Xf;
    ye.base64 = zf;
    ye.base64url = Kf;
    ye.codec = Yf;
});
var Ki = c(be => {
    "use strict";
    var Xi =
        (be && be.__importDefault) ||
        function (e) {
            return e && e.__esModule ? e : {default: e};
        };
    Object.defineProperty(be, "__esModule", {value: !0});
    be.createBase32HashFromFile = be.createBase32Hash = void 0;
    var Jf = Xi(require("crypto")),
        Zf = Xi(require("fs")),
        Qf = Hi();
    function zi(e) {
        return Qf.base32.stringify(Jf.default.createHash("md5").update(e).digest()).replace(/(=+)$/, "").toLowerCase();
    }
    be.createBase32Hash = zi;
    async function eh(e) {
        let t = await Zf.default.promises.readFile(e, "utf8");
        return zi(
            t.split(`\r
`).join(`
`)
        );
    }
    be.createBase32HashFromFile = eh;
});
var Ji = c((jm, Yi) => {
    "use strict";
    var th = (e, t, r, n) => {
            if (r === "length" || r === "prototype" || r === "arguments" || r === "caller") return;
            let i = Object.getOwnPropertyDescriptor(e, r),
                s = Object.getOwnPropertyDescriptor(t, r);
            (!rh(i, s) && n) || Object.defineProperty(e, r, s);
        },
        rh = function (e, t) {
            return e === void 0 || e.configurable || (e.writable === t.writable && e.enumerable === t.enumerable && e.configurable === t.configurable && (e.writable || e.value === t.value));
        },
        nh = (e, t) => {
            let r = Object.getPrototypeOf(t);
            r !== Object.getPrototypeOf(e) && Object.setPrototypeOf(e, r);
        },
        ih = (e, t) => `/* Wrapped ${e}*/
${t}`,
        sh = Object.getOwnPropertyDescriptor(Function.prototype, "toString"),
        oh = Object.getOwnPropertyDescriptor(Function.prototype.toString, "name"),
        ah = (e, t, r) => {
            let n = r === "" ? "" : `with ${r.trim()}() `,
                i = ih.bind(null, n, t.toString());
            Object.defineProperty(i, "name", oh), Object.defineProperty(e, "toString", {...sh, value: i});
        },
        uh = (e, t, {ignoreNonConfigurable: r = !1} = {}) => {
            let {name: n} = e;
            for (let i of Reflect.ownKeys(t)) th(e, t, i, r);
            return nh(e, t), ah(e, t, n), e;
        };
    Yi.exports = uh;
});
var Qi = c((Cm, Zi) => {
    "use strict";
    Zi.exports = () => {
        let e = {};
        return (
            (e.promise = new Promise((t, r) => {
                (e.resolve = t), (e.reject = r);
            })),
            e
        );
    };
});
var ts = c((Ae, Kr) => {
    "use strict";
    var es =
            (Ae && Ae.__awaiter) ||
            function (e, t, r, n) {
                return new (r || (r = Promise))(function (i, s) {
                    function o(l) {
                        try {
                            u(n.next(l));
                        } catch (f) {
                            s(f);
                        }
                    }
                    function a(l) {
                        try {
                            u(n.throw(l));
                        } catch (f) {
                            s(f);
                        }
                    }
                    function u(l) {
                        l.done
                            ? i(l.value)
                            : new r(function (f) {
                                  f(l.value);
                              }).then(o, a);
                    }
                    u((n = n.apply(e, t || [])).next());
                });
            },
        lh =
            (Ae && Ae.__importDefault) ||
            function (e) {
                return e && e.__esModule ? e : {default: e};
            };
    Object.defineProperty(Ae, "__esModule", {value: !0});
    var ch = lh(Qi());
    function zr(e, t = "maxAge") {
        let r,
            n,
            i,
            s = () =>
                es(this, void 0, void 0, function* () {
                    if (r !== void 0) return;
                    let u = l =>
                        es(this, void 0, void 0, function* () {
                            i = ch.default();
                            let f = l[1][t] - Date.now();
                            if (f <= 0) {
                                e.delete(l[0]), i.resolve();
                                return;
                            }
                            return (
                                (r = l[0]),
                                (n = setTimeout(() => {
                                    e.delete(l[0]), i && i.resolve();
                                }, f)),
                                typeof n.unref == "function" && n.unref(),
                                i.promise
                            );
                        });
                    try {
                        for (let l of e) yield u(l);
                    } catch {}
                    r = void 0;
                }),
            o = () => {
                (r = void 0), n !== void 0 && (clearTimeout(n), (n = void 0)), i !== void 0 && (i.reject(void 0), (i = void 0));
            },
            a = e.set.bind(e);
        return (
            (e.set = (u, l) => {
                e.has(u) && e.delete(u);
                let f = a(u, l);
                return r && r === u && o(), s(), f;
            }),
            s(),
            e
        );
    }
    Ae.default = zr;
    Kr.exports = zr;
    Kr.exports.default = zr;
});
var is = c((Dm, ns) => {
    "use strict";
    var fh = Ji(),
        hh = ts(),
        Yr = new WeakMap(),
        rs = new WeakMap(),
        Ut = (e, {cacheKey: t, cache: r = new Map(), maxAge: n} = {}) => {
            typeof n == "number" && hh(r);
            let i = function (...s) {
                let o = t ? t(s) : s[0],
                    a = r.get(o);
                if (a) return a.data;
                let u = e.apply(this, s);
                return r.set(o, {data: u, maxAge: n ? Date.now() + n : Number.POSITIVE_INFINITY}), u;
            };
            return fh(i, e, {ignoreNonConfigurable: !0}), rs.set(i, r), i;
        };
    Ut.decorator =
        (e = {}) =>
        (t, r, n) => {
            let i = t[r];
            if (typeof i != "function") throw new TypeError("The decorated value must be a function");
            delete n.value,
                delete n.writable,
                (n.get = function () {
                    if (!Yr.has(this)) {
                        let s = Ut(i, e);
                        return Yr.set(this, s), s;
                    }
                    return Yr.get(this);
                });
        };
    Ut.clear = e => {
        let t = rs.get(e);
        if (!t) throw new TypeError("Can't clear a function that was not memoized!");
        if (typeof t.clear != "function") throw new TypeError("The cache Map can't be cleared!");
        t.clear();
    };
    ns.exports = Ut;
});
var as = c((Fm, os) => {
    "use strict";
    var ss = require("assert"),
        {URL: dh} = require("url"),
        ph = is();
    os.exports = ph(gh);
    function gh(e) {
        ss(e, "`registry` is required"), ss(typeof e == "string", "`registry` should be a string");
        let t = bh(e);
        return yh(t);
    }
    function yh(e) {
        return e.replace(":", "+");
    }
    function bh(e) {
        let t = new dh(e);
        if (!t || !t.host) throw new Error(`Couldn't get host from ${e}`);
        return t.host;
    }
});
var ct = c((km, us) => {
    var mh = "2.0.0",
        vh = Number.MAX_SAFE_INTEGER || 9007199254740991,
        Eh = 16;
    us.exports = {SEMVER_SPEC_VERSION: mh, MAX_LENGTH: 256, MAX_SAFE_INTEGER: vh, MAX_SAFE_COMPONENT_LENGTH: Eh};
});
var ft = c((Bm, ls) => {
    var _h = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...e) => console.error("SEMVER", ...e) : () => {};
    ls.exports = _h;
});
var Ie = c((me, cs) => {
    var {MAX_SAFE_COMPONENT_LENGTH: Jr} = ct(),
        wh = ft();
    me = cs.exports = {};
    var Oh = (me.re = []),
        g = (me.src = []),
        y = (me.t = {}),
        Rh = 0,
        E = (e, t, r) => {
            let n = Rh++;
            wh(e, n, t), (y[e] = n), (g[n] = t), (Oh[n] = new RegExp(t, r ? "g" : void 0));
        };
    E("NUMERICIDENTIFIER", "0|[1-9]\\d*");
    E("NUMERICIDENTIFIERLOOSE", "[0-9]+");
    E("NONNUMERICIDENTIFIER", "\\d*[a-zA-Z-][a-zA-Z0-9-]*");
    E("MAINVERSION", `(${g[y.NUMERICIDENTIFIER]})\\.(${g[y.NUMERICIDENTIFIER]})\\.(${g[y.NUMERICIDENTIFIER]})`);
    E("MAINVERSIONLOOSE", `(${g[y.NUMERICIDENTIFIERLOOSE]})\\.(${g[y.NUMERICIDENTIFIERLOOSE]})\\.(${g[y.NUMERICIDENTIFIERLOOSE]})`);
    E("PRERELEASEIDENTIFIER", `(?:${g[y.NUMERICIDENTIFIER]}|${g[y.NONNUMERICIDENTIFIER]})`);
    E("PRERELEASEIDENTIFIERLOOSE", `(?:${g[y.NUMERICIDENTIFIERLOOSE]}|${g[y.NONNUMERICIDENTIFIER]})`);
    E("PRERELEASE", `(?:-(${g[y.PRERELEASEIDENTIFIER]}(?:\\.${g[y.PRERELEASEIDENTIFIER]})*))`);
    E("PRERELEASELOOSE", `(?:-?(${g[y.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${g[y.PRERELEASEIDENTIFIERLOOSE]})*))`);
    E("BUILDIDENTIFIER", "[0-9A-Za-z-]+");
    E("BUILD", `(?:\\+(${g[y.BUILDIDENTIFIER]}(?:\\.${g[y.BUILDIDENTIFIER]})*))`);
    E("FULLPLAIN", `v?${g[y.MAINVERSION]}${g[y.PRERELEASE]}?${g[y.BUILD]}?`);
    E("FULL", `^${g[y.FULLPLAIN]}$`);
    E("LOOSEPLAIN", `[v=\\s]*${g[y.MAINVERSIONLOOSE]}${g[y.PRERELEASELOOSE]}?${g[y.BUILD]}?`);
    E("LOOSE", `^${g[y.LOOSEPLAIN]}$`);
    E("GTLT", "((?:<|>)?=?)");
    E("XRANGEIDENTIFIERLOOSE", `${g[y.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`);
    E("XRANGEIDENTIFIER", `${g[y.NUMERICIDENTIFIER]}|x|X|\\*`);
    E("XRANGEPLAIN", `[v=\\s]*(${g[y.XRANGEIDENTIFIER]})(?:\\.(${g[y.XRANGEIDENTIFIER]})(?:\\.(${g[y.XRANGEIDENTIFIER]})(?:${g[y.PRERELEASE]})?${g[y.BUILD]}?)?)?`);
    E("XRANGEPLAINLOOSE", `[v=\\s]*(${g[y.XRANGEIDENTIFIERLOOSE]})(?:\\.(${g[y.XRANGEIDENTIFIERLOOSE]})(?:\\.(${g[y.XRANGEIDENTIFIERLOOSE]})(?:${g[y.PRERELEASELOOSE]})?${g[y.BUILD]}?)?)?`);
    E("XRANGE", `^${g[y.GTLT]}\\s*${g[y.XRANGEPLAIN]}$`);
    E("XRANGELOOSE", `^${g[y.GTLT]}\\s*${g[y.XRANGEPLAINLOOSE]}$`);
    E("COERCE", `(^|[^\\d])(\\d{1,${Jr}})(?:\\.(\\d{1,${Jr}}))?(?:\\.(\\d{1,${Jr}}))?(?:$|[^\\d])`);
    E("COERCERTL", g[y.COERCE], !0);
    E("LONETILDE", "(?:~>?)");
    E("TILDETRIM", `(\\s*)${g[y.LONETILDE]}\\s+`, !0);
    me.tildeTrimReplace = "$1~";
    E("TILDE", `^${g[y.LONETILDE]}${g[y.XRANGEPLAIN]}$`);
    E("TILDELOOSE", `^${g[y.LONETILDE]}${g[y.XRANGEPLAINLOOSE]}$`);
    E("LONECARET", "(?:\\^)");
    E("CARETTRIM", `(\\s*)${g[y.LONECARET]}\\s+`, !0);
    me.caretTrimReplace = "$1^";
    E("CARET", `^${g[y.LONECARET]}${g[y.XRANGEPLAIN]}$`);
    E("CARETLOOSE", `^${g[y.LONECARET]}${g[y.XRANGEPLAINLOOSE]}$`);
    E("COMPARATORLOOSE", `^${g[y.GTLT]}\\s*(${g[y.LOOSEPLAIN]})$|^$`);
    E("COMPARATOR", `^${g[y.GTLT]}\\s*(${g[y.FULLPLAIN]})$|^$`);
    E("COMPARATORTRIM", `(\\s*)${g[y.GTLT]}\\s*(${g[y.LOOSEPLAIN]}|${g[y.XRANGEPLAIN]})`, !0);
    me.comparatorTrimReplace = "$1$2$3";
    E("HYPHENRANGE", `^\\s*(${g[y.XRANGEPLAIN]})\\s+-\\s+(${g[y.XRANGEPLAIN]})\\s*$`);
    E("HYPHENRANGELOOSE", `^\\s*(${g[y.XRANGEPLAINLOOSE]})\\s+-\\s+(${g[y.XRANGEPLAINLOOSE]})\\s*$`);
    E("STAR", "(<|>)?=?\\s*\\*");
    E("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$");
    E("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
});
var ht = c((Gm, fs) => {
    var Sh = ["includePrerelease", "loose", "rtl"],
        xh = e => (e ? (typeof e != "object" ? {loose: !0} : Sh.filter(t => e[t]).reduce((t, r) => ((t[r] = !0), t), {})) : {});
    fs.exports = xh;
});
var Wt = c((Um, ps) => {
    var hs = /^[0-9]+$/,
        ds = (e, t) => {
            let r = hs.test(e),
                n = hs.test(t);
            return r && n && ((e = +e), (t = +t)), e === t ? 0 : r && !n ? -1 : n && !r ? 1 : e < t ? -1 : 1;
        },
        Th = (e, t) => ds(t, e);
    ps.exports = {compareIdentifiers: ds, rcompareIdentifiers: Th};
});
var $ = c((Wm, ms) => {
    var Vt = ft(),
        {MAX_LENGTH: gs, MAX_SAFE_INTEGER: Ht} = ct(),
        {re: ys, t: bs} = Ie(),
        Ah = ht(),
        {compareIdentifiers: He} = Wt(),
        W = class {
            constructor(t, r) {
                if (((r = Ah(r)), t instanceof W)) {
                    if (t.loose === !!r.loose && t.includePrerelease === !!r.includePrerelease) return t;
                    t = t.version;
                } else if (typeof t != "string") throw new TypeError(`Invalid Version: ${t}`);
                if (t.length > gs) throw new TypeError(`version is longer than ${gs} characters`);
                Vt("SemVer", t, r), (this.options = r), (this.loose = !!r.loose), (this.includePrerelease = !!r.includePrerelease);
                let n = t.trim().match(r.loose ? ys[bs.LOOSE] : ys[bs.FULL]);
                if (!n) throw new TypeError(`Invalid Version: ${t}`);
                if (((this.raw = t), (this.major = +n[1]), (this.minor = +n[2]), (this.patch = +n[3]), this.major > Ht || this.major < 0)) throw new TypeError("Invalid major version");
                if (this.minor > Ht || this.minor < 0) throw new TypeError("Invalid minor version");
                if (this.patch > Ht || this.patch < 0) throw new TypeError("Invalid patch version");
                n[4]
                    ? (this.prerelease = n[4].split(".").map(i => {
                          if (/^[0-9]+$/.test(i)) {
                              let s = +i;
                              if (s >= 0 && s < Ht) return s;
                          }
                          return i;
                      }))
                    : (this.prerelease = []),
                    (this.build = n[5] ? n[5].split(".") : []),
                    this.format();
            }
            format() {
                return (this.version = `${this.major}.${this.minor}.${this.patch}`), this.prerelease.length && (this.version += `-${this.prerelease.join(".")}`), this.version;
            }
            toString() {
                return this.version;
            }
            compare(t) {
                if ((Vt("SemVer.compare", this.version, this.options, t), !(t instanceof W))) {
                    if (typeof t == "string" && t === this.version) return 0;
                    t = new W(t, this.options);
                }
                return t.version === this.version ? 0 : this.compareMain(t) || this.comparePre(t);
            }
            compareMain(t) {
                return t instanceof W || (t = new W(t, this.options)), He(this.major, t.major) || He(this.minor, t.minor) || He(this.patch, t.patch);
            }
            comparePre(t) {
                if ((t instanceof W || (t = new W(t, this.options)), this.prerelease.length && !t.prerelease.length)) return -1;
                if (!this.prerelease.length && t.prerelease.length) return 1;
                if (!this.prerelease.length && !t.prerelease.length) return 0;
                let r = 0;
                do {
                    let n = this.prerelease[r],
                        i = t.prerelease[r];
                    if ((Vt("prerelease compare", r, n, i), n === void 0 && i === void 0)) return 0;
                    if (i === void 0) return 1;
                    if (n === void 0) return -1;
                    if (n === i) continue;
                    return He(n, i);
                } while (++r);
            }
            compareBuild(t) {
                t instanceof W || (t = new W(t, this.options));
                let r = 0;
                do {
                    let n = this.build[r],
                        i = t.build[r];
                    if ((Vt("prerelease compare", r, n, i), n === void 0 && i === void 0)) return 0;
                    if (i === void 0) return 1;
                    if (n === void 0) return -1;
                    if (n === i) continue;
                    return He(n, i);
                } while (++r);
            }
            inc(t, r) {
                switch (t) {
                    case "premajor":
                        (this.prerelease.length = 0), (this.patch = 0), (this.minor = 0), this.major++, this.inc("pre", r);
                        break;
                    case "preminor":
                        (this.prerelease.length = 0), (this.patch = 0), this.minor++, this.inc("pre", r);
                        break;
                    case "prepatch":
                        (this.prerelease.length = 0), this.inc("patch", r), this.inc("pre", r);
                        break;
                    case "prerelease":
                        this.prerelease.length === 0 && this.inc("patch", r), this.inc("pre", r);
                        break;
                    case "major":
                        (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) && this.major++, (this.minor = 0), (this.patch = 0), (this.prerelease = []);
                        break;
                    case "minor":
                        (this.patch !== 0 || this.prerelease.length === 0) && this.minor++, (this.patch = 0), (this.prerelease = []);
                        break;
                    case "patch":
                        this.prerelease.length === 0 && this.patch++, (this.prerelease = []);
                        break;
                    case "pre":
                        if (this.prerelease.length === 0) this.prerelease = [0];
                        else {
                            let n = this.prerelease.length;
                            for (; --n >= 0; ) typeof this.prerelease[n] == "number" && (this.prerelease[n]++, (n = -2));
                            n === -1 && this.prerelease.push(0);
                        }
                        r && (He(this.prerelease[0], r) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = [r, 0]) : (this.prerelease = [r, 0]));
                        break;
                    default:
                        throw new Error(`invalid increment argument: ${t}`);
                }
                return this.format(), (this.raw = this.version), this;
            }
        };
    ms.exports = W;
});
var Pe = c((Vm, ws) => {
    var {MAX_LENGTH: Ih} = ct(),
        {re: vs, t: Es} = Ie(),
        _s = $(),
        Ph = ht(),
        Nh = (e, t) => {
            if (((t = Ph(t)), e instanceof _s)) return e;
            if (typeof e != "string" || e.length > Ih || !(t.loose ? vs[Es.LOOSE] : vs[Es.FULL]).test(e)) return null;
            try {
                return new _s(e, t);
            } catch {
                return null;
            }
        };
    ws.exports = Nh;
});
var Rs = c((Hm, Os) => {
    var qh = Pe(),
        Lh = (e, t) => {
            let r = qh(e, t);
            return r ? r.version : null;
        };
    Os.exports = Lh;
});
var xs = c((Xm, Ss) => {
    var Mh = Pe(),
        $h = (e, t) => {
            let r = Mh(e.trim().replace(/^[=v]+/, ""), t);
            return r ? r.version : null;
        };
    Ss.exports = $h;
});
var Is = c((zm, As) => {
    var Ts = $(),
        jh = (e, t, r, n) => {
            typeof r == "string" && ((n = r), (r = void 0));
            try {
                return new Ts(e instanceof Ts ? e.version : e, r).inc(t, n).version;
            } catch {
                return null;
            }
        };
    As.exports = jh;
});
var X = c((Km, Ns) => {
    var Ps = $(),
        Ch = (e, t, r) => new Ps(e, r).compare(new Ps(t, r));
    Ns.exports = Ch;
});
var Xt = c((Ym, qs) => {
    var Dh = X(),
        Fh = (e, t, r) => Dh(e, t, r) === 0;
    qs.exports = Fh;
});
var $s = c((Jm, Ms) => {
    var Ls = Pe(),
        kh = Xt(),
        Bh = (e, t) => {
            if (kh(e, t)) return null;
            {
                let r = Ls(e),
                    n = Ls(t),
                    i = r.prerelease.length || n.prerelease.length,
                    s = i ? "pre" : "",
                    o = i ? "prerelease" : "";
                for (let a in r) if ((a === "major" || a === "minor" || a === "patch") && r[a] !== n[a]) return s + a;
                return o;
            }
        };
    Ms.exports = Bh;
});
var Cs = c((Zm, js) => {
    var Gh = $(),
        Uh = (e, t) => new Gh(e, t).major;
    js.exports = Uh;
});
var Fs = c((Qm, Ds) => {
    var Wh = $(),
        Vh = (e, t) => new Wh(e, t).minor;
    Ds.exports = Vh;
});
var Bs = c((ev, ks) => {
    var Hh = $(),
        Xh = (e, t) => new Hh(e, t).patch;
    ks.exports = Xh;
});
var Us = c((tv, Gs) => {
    var zh = Pe(),
        Kh = (e, t) => {
            let r = zh(e, t);
            return r && r.prerelease.length ? r.prerelease : null;
        };
    Gs.exports = Kh;
});
var Vs = c((rv, Ws) => {
    var Yh = X(),
        Jh = (e, t, r) => Yh(t, e, r);
    Ws.exports = Jh;
});
var Xs = c((nv, Hs) => {
    var Zh = X(),
        Qh = (e, t) => Zh(e, t, !0);
    Hs.exports = Qh;
});
var zt = c((iv, Ks) => {
    var zs = $(),
        ed = (e, t, r) => {
            let n = new zs(e, r),
                i = new zs(t, r);
            return n.compare(i) || n.compareBuild(i);
        };
    Ks.exports = ed;
});
var Js = c((sv, Ys) => {
    var td = zt(),
        rd = (e, t) => e.sort((r, n) => td(r, n, t));
    Ys.exports = rd;
});
var Qs = c((ov, Zs) => {
    var nd = zt(),
        id = (e, t) => e.sort((r, n) => nd(n, r, t));
    Zs.exports = id;
});
var dt = c((av, eo) => {
    var sd = X(),
        od = (e, t, r) => sd(e, t, r) > 0;
    eo.exports = od;
});
var Kt = c((uv, to) => {
    var ad = X(),
        ud = (e, t, r) => ad(e, t, r) < 0;
    to.exports = ud;
});
var Zr = c((lv, ro) => {
    var ld = X(),
        cd = (e, t, r) => ld(e, t, r) !== 0;
    ro.exports = cd;
});
var Yt = c((cv, no) => {
    var fd = X(),
        hd = (e, t, r) => fd(e, t, r) >= 0;
    no.exports = hd;
});
var Jt = c((fv, io) => {
    var dd = X(),
        pd = (e, t, r) => dd(e, t, r) <= 0;
    io.exports = pd;
});
var Qr = c((hv, so) => {
    var gd = Xt(),
        yd = Zr(),
        bd = dt(),
        md = Yt(),
        vd = Kt(),
        Ed = Jt(),
        _d = (e, t, r, n) => {
            switch (t) {
                case "===":
                    return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e === r;
                case "!==":
                    return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e !== r;
                case "":
                case "=":
                case "==":
                    return gd(e, r, n);
                case "!=":
                    return yd(e, r, n);
                case ">":
                    return bd(e, r, n);
                case ">=":
                    return md(e, r, n);
                case "<":
                    return vd(e, r, n);
                case "<=":
                    return Ed(e, r, n);
                default:
                    throw new TypeError(`Invalid operator: ${t}`);
            }
        };
    so.exports = _d;
});
var ao = c((dv, oo) => {
    var wd = $(),
        Od = Pe(),
        {re: Zt, t: Qt} = Ie(),
        Rd = (e, t) => {
            if (e instanceof wd) return e;
            if ((typeof e == "number" && (e = String(e)), typeof e != "string")) return null;
            t = t || {};
            let r = null;
            if (!t.rtl) r = e.match(Zt[Qt.COERCE]);
            else {
                let n;
                for (; (n = Zt[Qt.COERCERTL].exec(e)) && (!r || r.index + r[0].length !== e.length); )
                    (!r || n.index + n[0].length !== r.index + r[0].length) && (r = n), (Zt[Qt.COERCERTL].lastIndex = n.index + n[1].length + n[2].length);
                Zt[Qt.COERCERTL].lastIndex = -1;
            }
            return r === null ? null : Od(`${r[2]}.${r[3] || "0"}.${r[4] || "0"}`, t);
        };
    oo.exports = Rd;
});
var lo = c((pv, uo) => {
    "use strict";
    uo.exports = function (e) {
        e.prototype[Symbol.iterator] = function* () {
            for (let t = this.head; t; t = t.next) yield t.value;
        };
    };
});
var fo = c((gv, co) => {
    "use strict";
    co.exports = O;
    O.Node = Ne;
    O.create = O;
    function O(e) {
        var t = this;
        if ((t instanceof O || (t = new O()), (t.tail = null), (t.head = null), (t.length = 0), e && typeof e.forEach == "function"))
            e.forEach(function (i) {
                t.push(i);
            });
        else if (arguments.length > 0) for (var r = 0, n = arguments.length; r < n; r++) t.push(arguments[r]);
        return t;
    }
    O.prototype.removeNode = function (e) {
        if (e.list !== this) throw new Error("removing node which does not belong to this list");
        var t = e.next,
            r = e.prev;
        return t && (t.prev = r), r && (r.next = t), e === this.head && (this.head = t), e === this.tail && (this.tail = r), e.list.length--, (e.next = null), (e.prev = null), (e.list = null), t;
    };
    O.prototype.unshiftNode = function (e) {
        if (e !== this.head) {
            e.list && e.list.removeNode(e);
            var t = this.head;
            (e.list = this), (e.next = t), t && (t.prev = e), (this.head = e), this.tail || (this.tail = e), this.length++;
        }
    };
    O.prototype.pushNode = function (e) {
        if (e !== this.tail) {
            e.list && e.list.removeNode(e);
            var t = this.tail;
            (e.list = this), (e.prev = t), t && (t.next = e), (this.tail = e), this.head || (this.head = e), this.length++;
        }
    };
    O.prototype.push = function () {
        for (var e = 0, t = arguments.length; e < t; e++) xd(this, arguments[e]);
        return this.length;
    };
    O.prototype.unshift = function () {
        for (var e = 0, t = arguments.length; e < t; e++) Td(this, arguments[e]);
        return this.length;
    };
    O.prototype.pop = function () {
        if (!!this.tail) {
            var e = this.tail.value;
            return (this.tail = this.tail.prev), this.tail ? (this.tail.next = null) : (this.head = null), this.length--, e;
        }
    };
    O.prototype.shift = function () {
        if (!!this.head) {
            var e = this.head.value;
            return (this.head = this.head.next), this.head ? (this.head.prev = null) : (this.tail = null), this.length--, e;
        }
    };
    O.prototype.forEach = function (e, t) {
        t = t || this;
        for (var r = this.head, n = 0; r !== null; n++) e.call(t, r.value, n, this), (r = r.next);
    };
    O.prototype.forEachReverse = function (e, t) {
        t = t || this;
        for (var r = this.tail, n = this.length - 1; r !== null; n--) e.call(t, r.value, n, this), (r = r.prev);
    };
    O.prototype.get = function (e) {
        for (var t = 0, r = this.head; r !== null && t < e; t++) r = r.next;
        if (t === e && r !== null) return r.value;
    };
    O.prototype.getReverse = function (e) {
        for (var t = 0, r = this.tail; r !== null && t < e; t++) r = r.prev;
        if (t === e && r !== null) return r.value;
    };
    O.prototype.map = function (e, t) {
        t = t || this;
        for (var r = new O(), n = this.head; n !== null; ) r.push(e.call(t, n.value, this)), (n = n.next);
        return r;
    };
    O.prototype.mapReverse = function (e, t) {
        t = t || this;
        for (var r = new O(), n = this.tail; n !== null; ) r.push(e.call(t, n.value, this)), (n = n.prev);
        return r;
    };
    O.prototype.reduce = function (e, t) {
        var r,
            n = this.head;
        if (arguments.length > 1) r = t;
        else if (this.head) (n = this.head.next), (r = this.head.value);
        else throw new TypeError("Reduce of empty list with no initial value");
        for (var i = 0; n !== null; i++) (r = e(r, n.value, i)), (n = n.next);
        return r;
    };
    O.prototype.reduceReverse = function (e, t) {
        var r,
            n = this.tail;
        if (arguments.length > 1) r = t;
        else if (this.tail) (n = this.tail.prev), (r = this.tail.value);
        else throw new TypeError("Reduce of empty list with no initial value");
        for (var i = this.length - 1; n !== null; i--) (r = e(r, n.value, i)), (n = n.prev);
        return r;
    };
    O.prototype.toArray = function () {
        for (var e = new Array(this.length), t = 0, r = this.head; r !== null; t++) (e[t] = r.value), (r = r.next);
        return e;
    };
    O.prototype.toArrayReverse = function () {
        for (var e = new Array(this.length), t = 0, r = this.tail; r !== null; t++) (e[t] = r.value), (r = r.prev);
        return e;
    };
    O.prototype.slice = function (e, t) {
        (t = t || this.length), t < 0 && (t += this.length), (e = e || 0), e < 0 && (e += this.length);
        var r = new O();
        if (t < e || t < 0) return r;
        e < 0 && (e = 0), t > this.length && (t = this.length);
        for (var n = 0, i = this.head; i !== null && n < e; n++) i = i.next;
        for (; i !== null && n < t; n++, i = i.next) r.push(i.value);
        return r;
    };
    O.prototype.sliceReverse = function (e, t) {
        (t = t || this.length), t < 0 && (t += this.length), (e = e || 0), e < 0 && (e += this.length);
        var r = new O();
        if (t < e || t < 0) return r;
        e < 0 && (e = 0), t > this.length && (t = this.length);
        for (var n = this.length, i = this.tail; i !== null && n > t; n--) i = i.prev;
        for (; i !== null && n > e; n--, i = i.prev) r.push(i.value);
        return r;
    };
    O.prototype.splice = function (e, t, ...r) {
        e > this.length && (e = this.length - 1), e < 0 && (e = this.length + e);
        for (var n = 0, i = this.head; i !== null && n < e; n++) i = i.next;
        for (var s = [], n = 0; i && n < t; n++) s.push(i.value), (i = this.removeNode(i));
        i === null && (i = this.tail), i !== this.head && i !== this.tail && (i = i.prev);
        for (var n = 0; n < r.length; n++) i = Sd(this, i, r[n]);
        return s;
    };
    O.prototype.reverse = function () {
        for (var e = this.head, t = this.tail, r = e; r !== null; r = r.prev) {
            var n = r.prev;
            (r.prev = r.next), (r.next = n);
        }
        return (this.head = t), (this.tail = e), this;
    };
    function Sd(e, t, r) {
        var n = t === e.head ? new Ne(r, null, t, e) : new Ne(r, t, t.next, e);
        return n.next === null && (e.tail = n), n.prev === null && (e.head = n), e.length++, n;
    }
    function xd(e, t) {
        (e.tail = new Ne(t, e.tail, null, e)), e.head || (e.head = e.tail), e.length++;
    }
    function Td(e, t) {
        (e.head = new Ne(t, null, e.head, e)), e.tail || (e.tail = e.head), e.length++;
    }
    function Ne(e, t, r, n) {
        if (!(this instanceof Ne)) return new Ne(e, t, r, n);
        (this.list = n), (this.value = e), t ? ((t.next = this), (this.prev = t)) : (this.prev = null), r ? ((r.prev = this), (this.next = r)) : (this.next = null);
    }
    try {
        lo()(O);
    } catch {}
});
var bo = c((yv, yo) => {
    "use strict";
    var Ad = fo(),
        qe = Symbol("max"),
        ce = Symbol("length"),
        Xe = Symbol("lengthCalculator"),
        gt = Symbol("allowStale"),
        Le = Symbol("maxAge"),
        le = Symbol("dispose"),
        ho = Symbol("noDisposeOnSet"),
        q = Symbol("lruList"),
        ee = Symbol("cache"),
        go = Symbol("updateAgeOnGet"),
        en = () => 1,
        rn = class {
            constructor(t) {
                if ((typeof t == "number" && (t = {max: t}), t || (t = {}), t.max && (typeof t.max != "number" || t.max < 0))) throw new TypeError("max must be a non-negative number");
                let r = (this[qe] = t.max || 1 / 0),
                    n = t.length || en;
                if (((this[Xe] = typeof n != "function" ? en : n), (this[gt] = t.stale || !1), t.maxAge && typeof t.maxAge != "number")) throw new TypeError("maxAge must be a number");
                (this[Le] = t.maxAge || 0), (this[le] = t.dispose), (this[ho] = t.noDisposeOnSet || !1), (this[go] = t.updateAgeOnGet || !1), this.reset();
            }
            set max(t) {
                if (typeof t != "number" || t < 0) throw new TypeError("max must be a non-negative number");
                (this[qe] = t || 1 / 0), pt(this);
            }
            get max() {
                return this[qe];
            }
            set allowStale(t) {
                this[gt] = !!t;
            }
            get allowStale() {
                return this[gt];
            }
            set maxAge(t) {
                if (typeof t != "number") throw new TypeError("maxAge must be a non-negative number");
                (this[Le] = t), pt(this);
            }
            get maxAge() {
                return this[Le];
            }
            set lengthCalculator(t) {
                typeof t != "function" && (t = en),
                    t !== this[Xe] &&
                        ((this[Xe] = t),
                        (this[ce] = 0),
                        this[q].forEach(r => {
                            (r.length = this[Xe](r.value, r.key)), (this[ce] += r.length);
                        })),
                    pt(this);
            }
            get lengthCalculator() {
                return this[Xe];
            }
            get length() {
                return this[ce];
            }
            get itemCount() {
                return this[q].length;
            }
            rforEach(t, r) {
                r = r || this;
                for (let n = this[q].tail; n !== null; ) {
                    let i = n.prev;
                    po(this, t, n, r), (n = i);
                }
            }
            forEach(t, r) {
                r = r || this;
                for (let n = this[q].head; n !== null; ) {
                    let i = n.next;
                    po(this, t, n, r), (n = i);
                }
            }
            keys() {
                return this[q].toArray().map(t => t.key);
            }
            values() {
                return this[q].toArray().map(t => t.value);
            }
            reset() {
                this[le] && this[q] && this[q].length && this[q].forEach(t => this[le](t.key, t.value)), (this[ee] = new Map()), (this[q] = new Ad()), (this[ce] = 0);
            }
            dump() {
                return this[q]
                    .map(t => (er(this, t) ? !1 : {k: t.key, v: t.value, e: t.now + (t.maxAge || 0)}))
                    .toArray()
                    .filter(t => t);
            }
            dumpLru() {
                return this[q];
            }
            set(t, r, n) {
                if (((n = n || this[Le]), n && typeof n != "number")) throw new TypeError("maxAge must be a number");
                let i = n ? Date.now() : 0,
                    s = this[Xe](r, t);
                if (this[ee].has(t)) {
                    if (s > this[qe]) return ze(this, this[ee].get(t)), !1;
                    let u = this[ee].get(t).value;
                    return this[le] && (this[ho] || this[le](t, u.value)), (u.now = i), (u.maxAge = n), (u.value = r), (this[ce] += s - u.length), (u.length = s), this.get(t), pt(this), !0;
                }
                let o = new nn(t, r, s, i, n);
                return o.length > this[qe] ? (this[le] && this[le](t, r), !1) : ((this[ce] += o.length), this[q].unshift(o), this[ee].set(t, this[q].head), pt(this), !0);
            }
            has(t) {
                if (!this[ee].has(t)) return !1;
                let r = this[ee].get(t).value;
                return !er(this, r);
            }
            get(t) {
                return tn(this, t, !0);
            }
            peek(t) {
                return tn(this, t, !1);
            }
            pop() {
                let t = this[q].tail;
                return t ? (ze(this, t), t.value) : null;
            }
            del(t) {
                ze(this, this[ee].get(t));
            }
            load(t) {
                this.reset();
                let r = Date.now();
                for (let n = t.length - 1; n >= 0; n--) {
                    let i = t[n],
                        s = i.e || 0;
                    if (s === 0) this.set(i.k, i.v);
                    else {
                        let o = s - r;
                        o > 0 && this.set(i.k, i.v, o);
                    }
                }
            }
            prune() {
                this[ee].forEach((t, r) => tn(this, r, !1));
            }
        },
        tn = (e, t, r) => {
            let n = e[ee].get(t);
            if (n) {
                let i = n.value;
                if (er(e, i)) {
                    if ((ze(e, n), !e[gt])) return;
                } else r && (e[go] && (n.value.now = Date.now()), e[q].unshiftNode(n));
                return i.value;
            }
        },
        er = (e, t) => {
            if (!t || (!t.maxAge && !e[Le])) return !1;
            let r = Date.now() - t.now;
            return t.maxAge ? r > t.maxAge : e[Le] && r > e[Le];
        },
        pt = e => {
            if (e[ce] > e[qe])
                for (let t = e[q].tail; e[ce] > e[qe] && t !== null; ) {
                    let r = t.prev;
                    ze(e, t), (t = r);
                }
        },
        ze = (e, t) => {
            if (t) {
                let r = t.value;
                e[le] && e[le](r.key, r.value), (e[ce] -= r.length), e[ee].delete(r.key), e[q].removeNode(t);
            }
        },
        nn = class {
            constructor(t, r, n, i, s) {
                (this.key = t), (this.value = r), (this.length = n), (this.now = i), (this.maxAge = s || 0);
            }
        },
        po = (e, t, r, n) => {
            let i = r.value;
            er(e, i) && (ze(e, r), e[gt] || (i = void 0)), i && t.call(n, i.value, i.key, e);
        };
    yo.exports = rn;
});
var z = c((bv, _o) => {
    var Me = class {
        constructor(t, r) {
            if (((r = Pd(r)), t instanceof Me)) return t.loose === !!r.loose && t.includePrerelease === !!r.includePrerelease ? t : new Me(t.raw, r);
            if (t instanceof sn) return (this.raw = t.value), (this.set = [[t]]), this.format(), this;
            if (
                ((this.options = r),
                (this.loose = !!r.loose),
                (this.includePrerelease = !!r.includePrerelease),
                (this.raw = t),
                (this.set = t
                    .split("||")
                    .map(n => this.parseRange(n.trim()))
                    .filter(n => n.length)),
                !this.set.length)
            )
                throw new TypeError(`Invalid SemVer Range: ${t}`);
            if (this.set.length > 1) {
                let n = this.set[0];
                if (((this.set = this.set.filter(i => !vo(i[0]))), this.set.length === 0)) this.set = [n];
                else if (this.set.length > 1) {
                    for (let i of this.set)
                        if (i.length === 1 && $d(i[0])) {
                            this.set = [i];
                            break;
                        }
                }
            }
            this.format();
        }
        format() {
            return (
                (this.range = this.set
                    .map(t => t.join(" ").trim())
                    .join("||")
                    .trim()),
                this.range
            );
        }
        toString() {
            return this.range;
        }
        parseRange(t) {
            t = t.trim();
            let n = `parseRange:${Object.keys(this.options).join(",")}:${t}`,
                i = mo.get(n);
            if (i) return i;
            let s = this.options.loose,
                o = s ? B[D.HYPHENRANGELOOSE] : B[D.HYPHENRANGE];
            (t = t.replace(o, Vd(this.options.includePrerelease))),
                A("hyphen replace", t),
                (t = t.replace(B[D.COMPARATORTRIM], qd)),
                A("comparator trim", t),
                (t = t.replace(B[D.TILDETRIM], Ld)),
                (t = t.replace(B[D.CARETTRIM], Md)),
                (t = t.split(/\s+/).join(" "));
            let a = t
                .split(" ")
                .map(h => jd(h, this.options))
                .join(" ")
                .split(/\s+/)
                .map(h => Wd(h, this.options));
            s && (a = a.filter(h => (A("loose invalid filter", h, this.options), !!h.match(B[D.COMPARATORLOOSE])))), A("range list", a);
            let u = new Map(),
                l = a.map(h => new sn(h, this.options));
            for (let h of l) {
                if (vo(h)) return [h];
                u.set(h.value, h);
            }
            u.size > 1 && u.has("") && u.delete("");
            let f = [...u.values()];
            return mo.set(n, f), f;
        }
        intersects(t, r) {
            if (!(t instanceof Me)) throw new TypeError("a Range is required");
            return this.set.some(n => Eo(n, r) && t.set.some(i => Eo(i, r) && n.every(s => i.every(o => s.intersects(o, r)))));
        }
        test(t) {
            if (!t) return !1;
            if (typeof t == "string")
                try {
                    t = new Nd(t, this.options);
                } catch {
                    return !1;
                }
            for (let r = 0; r < this.set.length; r++) if (Hd(this.set[r], t, this.options)) return !0;
            return !1;
        }
    };
    _o.exports = Me;
    var Id = bo(),
        mo = new Id({max: 1e3}),
        Pd = ht(),
        sn = yt(),
        A = ft(),
        Nd = $(),
        {re: B, t: D, comparatorTrimReplace: qd, tildeTrimReplace: Ld, caretTrimReplace: Md} = Ie(),
        vo = e => e.value === "<0.0.0-0",
        $d = e => e.value === "",
        Eo = (e, t) => {
            let r = !0,
                n = e.slice(),
                i = n.pop();
            for (; r && n.length; ) (r = n.every(s => i.intersects(s, t))), (i = n.pop());
            return r;
        },
        jd = (e, t) => (A("comp", e, t), (e = Fd(e, t)), A("caret", e), (e = Cd(e, t)), A("tildes", e), (e = Bd(e, t)), A("xrange", e), (e = Ud(e, t)), A("stars", e), e),
        F = e => !e || e.toLowerCase() === "x" || e === "*",
        Cd = (e, t) =>
            e
                .trim()
                .split(/\s+/)
                .map(r => Dd(r, t))
                .join(" "),
        Dd = (e, t) => {
            let r = t.loose ? B[D.TILDELOOSE] : B[D.TILDE];
            return e.replace(r, (n, i, s, o, a) => {
                A("tilde", e, n, i, s, o, a);
                let u;
                return (
                    F(i)
                        ? (u = "")
                        : F(s)
                        ? (u = `>=${i}.0.0 <${+i + 1}.0.0-0`)
                        : F(o)
                        ? (u = `>=${i}.${s}.0 <${i}.${+s + 1}.0-0`)
                        : a
                        ? (A("replaceTilde pr", a), (u = `>=${i}.${s}.${o}-${a} <${i}.${+s + 1}.0-0`))
                        : (u = `>=${i}.${s}.${o} <${i}.${+s + 1}.0-0`),
                    A("tilde return", u),
                    u
                );
            });
        },
        Fd = (e, t) =>
            e
                .trim()
                .split(/\s+/)
                .map(r => kd(r, t))
                .join(" "),
        kd = (e, t) => {
            A("caret", e, t);
            let r = t.loose ? B[D.CARETLOOSE] : B[D.CARET],
                n = t.includePrerelease ? "-0" : "";
            return e.replace(r, (i, s, o, a, u) => {
                A("caret", e, i, s, o, a, u);
                let l;
                return (
                    F(s)
                        ? (l = "")
                        : F(o)
                        ? (l = `>=${s}.0.0${n} <${+s + 1}.0.0-0`)
                        : F(a)
                        ? s === "0"
                            ? (l = `>=${s}.${o}.0${n} <${s}.${+o + 1}.0-0`)
                            : (l = `>=${s}.${o}.0${n} <${+s + 1}.0.0-0`)
                        : u
                        ? (A("replaceCaret pr", u),
                          s === "0"
                              ? o === "0"
                                  ? (l = `>=${s}.${o}.${a}-${u} <${s}.${o}.${+a + 1}-0`)
                                  : (l = `>=${s}.${o}.${a}-${u} <${s}.${+o + 1}.0-0`)
                              : (l = `>=${s}.${o}.${a}-${u} <${+s + 1}.0.0-0`))
                        : (A("no pr"),
                          s === "0" ? (o === "0" ? (l = `>=${s}.${o}.${a}${n} <${s}.${o}.${+a + 1}-0`) : (l = `>=${s}.${o}.${a}${n} <${s}.${+o + 1}.0-0`)) : (l = `>=${s}.${o}.${a} <${+s + 1}.0.0-0`)),
                    A("caret return", l),
                    l
                );
            });
        },
        Bd = (e, t) => (
            A("replaceXRanges", e, t),
            e
                .split(/\s+/)
                .map(r => Gd(r, t))
                .join(" ")
        ),
        Gd = (e, t) => {
            e = e.trim();
            let r = t.loose ? B[D.XRANGELOOSE] : B[D.XRANGE];
            return e.replace(r, (n, i, s, o, a, u) => {
                A("xRange", e, n, i, s, o, a, u);
                let l = F(s),
                    f = l || F(o),
                    h = f || F(a),
                    p = h;
                return (
                    i === "=" && p && (i = ""),
                    (u = t.includePrerelease ? "-0" : ""),
                    l
                        ? i === ">" || i === "<"
                            ? (n = "<0.0.0-0")
                            : (n = "*")
                        : i && p
                        ? (f && (o = 0),
                          (a = 0),
                          i === ">" ? ((i = ">="), f ? ((s = +s + 1), (o = 0), (a = 0)) : ((o = +o + 1), (a = 0))) : i === "<=" && ((i = "<"), f ? (s = +s + 1) : (o = +o + 1)),
                          i === "<" && (u = "-0"),
                          (n = `${i + s}.${o}.${a}${u}`))
                        : f
                        ? (n = `>=${s}.0.0${u} <${+s + 1}.0.0-0`)
                        : h && (n = `>=${s}.${o}.0${u} <${s}.${+o + 1}.0-0`),
                    A("xRange return", n),
                    n
                );
            });
        },
        Ud = (e, t) => (A("replaceStars", e, t), e.trim().replace(B[D.STAR], "")),
        Wd = (e, t) => (A("replaceGTE0", e, t), e.trim().replace(B[t.includePrerelease ? D.GTE0PRE : D.GTE0], "")),
        Vd = e => (t, r, n, i, s, o, a, u, l, f, h, p, d) => (
            F(n) ? (r = "") : F(i) ? (r = `>=${n}.0.0${e ? "-0" : ""}`) : F(s) ? (r = `>=${n}.${i}.0${e ? "-0" : ""}`) : o ? (r = `>=${r}`) : (r = `>=${r}${e ? "-0" : ""}`),
            F(l) ? (u = "") : F(f) ? (u = `<${+l + 1}.0.0-0`) : F(h) ? (u = `<${l}.${+f + 1}.0-0`) : p ? (u = `<=${l}.${f}.${h}-${p}`) : e ? (u = `<${l}.${f}.${+h + 1}-0`) : (u = `<=${u}`),
            `${r} ${u}`.trim()
        ),
        Hd = (e, t, r) => {
            for (let n = 0; n < e.length; n++) if (!e[n].test(t)) return !1;
            if (t.prerelease.length && !r.includePrerelease) {
                for (let n = 0; n < e.length; n++)
                    if ((A(e[n].semver), e[n].semver !== sn.ANY && e[n].semver.prerelease.length > 0)) {
                        let i = e[n].semver;
                        if (i.major === t.major && i.minor === t.minor && i.patch === t.patch) return !0;
                    }
                return !1;
            }
            return !0;
        };
});
var yt = c((mv, xo) => {
    var bt = Symbol("SemVer ANY"),
        Ke = class {
            static get ANY() {
                return bt;
            }
            constructor(t, r) {
                if (((r = Xd(r)), t instanceof Ke)) {
                    if (t.loose === !!r.loose) return t;
                    t = t.value;
                }
                an("comparator", t, r),
                    (this.options = r),
                    (this.loose = !!r.loose),
                    this.parse(t),
                    this.semver === bt ? (this.value = "") : (this.value = this.operator + this.semver.version),
                    an("comp", this);
            }
            parse(t) {
                let r = this.options.loose ? wo[Oo.COMPARATORLOOSE] : wo[Oo.COMPARATOR],
                    n = t.match(r);
                if (!n) throw new TypeError(`Invalid comparator: ${t}`);
                (this.operator = n[1] !== void 0 ? n[1] : ""), this.operator === "=" && (this.operator = ""), n[2] ? (this.semver = new Ro(n[2], this.options.loose)) : (this.semver = bt);
            }
            toString() {
                return this.value;
            }
            test(t) {
                if ((an("Comparator.test", t, this.options.loose), this.semver === bt || t === bt)) return !0;
                if (typeof t == "string")
                    try {
                        t = new Ro(t, this.options);
                    } catch {
                        return !1;
                    }
                return on(t, this.operator, this.semver, this.options);
            }
            intersects(t, r) {
                if (!(t instanceof Ke)) throw new TypeError("a Comparator is required");
                if (((!r || typeof r != "object") && (r = {loose: !!r, includePrerelease: !1}), this.operator === "")) return this.value === "" ? !0 : new So(t.value, r).test(this.value);
                if (t.operator === "") return t.value === "" ? !0 : new So(this.value, r).test(t.semver);
                let n = (this.operator === ">=" || this.operator === ">") && (t.operator === ">=" || t.operator === ">"),
                    i = (this.operator === "<=" || this.operator === "<") && (t.operator === "<=" || t.operator === "<"),
                    s = this.semver.version === t.semver.version,
                    o = (this.operator === ">=" || this.operator === "<=") && (t.operator === ">=" || t.operator === "<="),
                    a = on(this.semver, "<", t.semver, r) && (this.operator === ">=" || this.operator === ">") && (t.operator === "<=" || t.operator === "<"),
                    u = on(this.semver, ">", t.semver, r) && (this.operator === "<=" || this.operator === "<") && (t.operator === ">=" || t.operator === ">");
                return n || i || (s && o) || a || u;
            }
        };
    xo.exports = Ke;
    var Xd = ht(),
        {re: wo, t: Oo} = Ie(),
        on = Qr(),
        an = ft(),
        Ro = $(),
        So = z();
});
var mt = c((vv, To) => {
    var zd = z(),
        Kd = (e, t, r) => {
            try {
                t = new zd(t, r);
            } catch {
                return !1;
            }
            return t.test(e);
        };
    To.exports = Kd;
});
var Io = c((Ev, Ao) => {
    var Yd = z(),
        Jd = (e, t) =>
            new Yd(e, t).set.map(r =>
                r
                    .map(n => n.value)
                    .join(" ")
                    .trim()
                    .split(" ")
            );
    Ao.exports = Jd;
});
var No = c((_v, Po) => {
    var Zd = $(),
        Qd = z(),
        ep = (e, t, r) => {
            let n = null,
                i = null,
                s = null;
            try {
                s = new Qd(t, r);
            } catch {
                return null;
            }
            return (
                e.forEach(o => {
                    s.test(o) && (!n || i.compare(o) === -1) && ((n = o), (i = new Zd(n, r)));
                }),
                n
            );
        };
    Po.exports = ep;
});
var Lo = c((wv, qo) => {
    var tp = $(),
        rp = z(),
        np = (e, t, r) => {
            let n = null,
                i = null,
                s = null;
            try {
                s = new rp(t, r);
            } catch {
                return null;
            }
            return (
                e.forEach(o => {
                    s.test(o) && (!n || i.compare(o) === 1) && ((n = o), (i = new tp(n, r)));
                }),
                n
            );
        };
    qo.exports = np;
});
var jo = c((Ov, $o) => {
    var un = $(),
        ip = z(),
        Mo = dt(),
        sp = (e, t) => {
            e = new ip(e, t);
            let r = new un("0.0.0");
            if (e.test(r) || ((r = new un("0.0.0-0")), e.test(r))) return r;
            r = null;
            for (let n = 0; n < e.set.length; ++n) {
                let i = e.set[n],
                    s = null;
                i.forEach(o => {
                    let a = new un(o.semver.version);
                    switch (o.operator) {
                        case ">":
                            a.prerelease.length === 0 ? a.patch++ : a.prerelease.push(0), (a.raw = a.format());
                        case "":
                        case ">=":
                            (!s || Mo(a, s)) && (s = a);
                            break;
                        case "<":
                        case "<=":
                            break;
                        default:
                            throw new Error(`Unexpected operation: ${o.operator}`);
                    }
                }),
                    s && (!r || Mo(r, s)) && (r = s);
            }
            return r && e.test(r) ? r : null;
        };
    $o.exports = sp;
});
var Do = c((Rv, Co) => {
    var op = z(),
        ap = (e, t) => {
            try {
                return new op(e, t).range || "*";
            } catch {
                return null;
            }
        };
    Co.exports = ap;
});
var tr = c((Sv, Go) => {
    var up = $(),
        Bo = yt(),
        {ANY: lp} = Bo,
        cp = z(),
        fp = mt(),
        Fo = dt(),
        ko = Kt(),
        hp = Jt(),
        dp = Yt(),
        pp = (e, t, r, n) => {
            (e = new up(e, n)), (t = new cp(t, n));
            let i, s, o, a, u;
            switch (r) {
                case ">":
                    (i = Fo), (s = hp), (o = ko), (a = ">"), (u = ">=");
                    break;
                case "<":
                    (i = ko), (s = dp), (o = Fo), (a = "<"), (u = "<=");
                    break;
                default:
                    throw new TypeError('Must provide a hilo val of "<" or ">"');
            }
            if (fp(e, t, n)) return !1;
            for (let l = 0; l < t.set.length; ++l) {
                let f = t.set[l],
                    h = null,
                    p = null;
                if (
                    (f.forEach(d => {
                        d.semver === lp && (d = new Bo(">=0.0.0")), (h = h || d), (p = p || d), i(d.semver, h.semver, n) ? (h = d) : o(d.semver, p.semver, n) && (p = d);
                    }),
                    h.operator === a || h.operator === u || ((!p.operator || p.operator === a) && s(e, p.semver)))
                )
                    return !1;
                if (p.operator === u && o(e, p.semver)) return !1;
            }
            return !0;
        };
    Go.exports = pp;
});
var Wo = c((xv, Uo) => {
    var gp = tr(),
        yp = (e, t, r) => gp(e, t, ">", r);
    Uo.exports = yp;
});
var Ho = c((Tv, Vo) => {
    var bp = tr(),
        mp = (e, t, r) => bp(e, t, "<", r);
    Vo.exports = mp;
});
var Ko = c((Av, zo) => {
    var Xo = z(),
        vp = (e, t, r) => ((e = new Xo(e, r)), (t = new Xo(t, r)), e.intersects(t));
    zo.exports = vp;
});
var Jo = c((Iv, Yo) => {
    var Ep = mt(),
        _p = X();
    Yo.exports = (e, t, r) => {
        let n = [],
            i = null,
            s = null,
            o = e.sort((f, h) => _p(f, h, r));
        for (let f of o) Ep(f, t, r) ? ((s = f), i || (i = f)) : (s && n.push([i, s]), (s = null), (i = null));
        i && n.push([i, null]);
        let a = [];
        for (let [f, h] of n) f === h ? a.push(f) : !h && f === o[0] ? a.push("*") : h ? (f === o[0] ? a.push(`<=${h}`) : a.push(`${f} - ${h}`)) : a.push(`>=${f}`);
        let u = a.join(" || "),
            l = typeof t.raw == "string" ? t.raw : String(t);
        return u.length < l.length ? u : t;
    };
});
var ra = c((Pv, ta) => {
    var Zo = z(),
        rr = yt(),
        {ANY: ln} = rr,
        vt = mt(),
        cn = X(),
        wp = (e, t, r = {}) => {
            if (e === t) return !0;
            (e = new Zo(e, r)), (t = new Zo(t, r));
            let n = !1;
            e: for (let i of e.set) {
                for (let s of t.set) {
                    let o = Op(i, s, r);
                    if (((n = n || o !== null), o)) continue e;
                }
                if (n) return !1;
            }
            return !0;
        },
        Op = (e, t, r) => {
            if (e === t) return !0;
            if (e.length === 1 && e[0].semver === ln) {
                if (t.length === 1 && t[0].semver === ln) return !0;
                r.includePrerelease ? (e = [new rr(">=0.0.0-0")]) : (e = [new rr(">=0.0.0")]);
            }
            if (t.length === 1 && t[0].semver === ln) {
                if (r.includePrerelease) return !0;
                t = [new rr(">=0.0.0")];
            }
            let n = new Set(),
                i,
                s;
            for (let d of e) d.operator === ">" || d.operator === ">=" ? (i = Qo(i, d, r)) : d.operator === "<" || d.operator === "<=" ? (s = ea(s, d, r)) : n.add(d.semver);
            if (n.size > 1) return null;
            let o;
            if (i && s) {
                if (((o = cn(i.semver, s.semver, r)), o > 0)) return null;
                if (o === 0 && (i.operator !== ">=" || s.operator !== "<=")) return null;
            }
            for (let d of n) {
                if ((i && !vt(d, String(i), r)) || (s && !vt(d, String(s), r))) return null;
                for (let m of t) if (!vt(d, String(m), r)) return !1;
                return !0;
            }
            let a,
                u,
                l,
                f,
                h = s && !r.includePrerelease && s.semver.prerelease.length ? s.semver : !1,
                p = i && !r.includePrerelease && i.semver.prerelease.length ? i.semver : !1;
            h && h.prerelease.length === 1 && s.operator === "<" && h.prerelease[0] === 0 && (h = !1);
            for (let d of t) {
                if (((f = f || d.operator === ">" || d.operator === ">="), (l = l || d.operator === "<" || d.operator === "<="), i)) {
                    if (
                        (p && d.semver.prerelease && d.semver.prerelease.length && d.semver.major === p.major && d.semver.minor === p.minor && d.semver.patch === p.patch && (p = !1),
                        d.operator === ">" || d.operator === ">=")
                    ) {
                        if (((a = Qo(i, d, r)), a === d && a !== i)) return !1;
                    } else if (i.operator === ">=" && !vt(i.semver, String(d), r)) return !1;
                }
                if (s) {
                    if (
                        (h && d.semver.prerelease && d.semver.prerelease.length && d.semver.major === h.major && d.semver.minor === h.minor && d.semver.patch === h.patch && (h = !1),
                        d.operator === "<" || d.operator === "<=")
                    ) {
                        if (((u = ea(s, d, r)), u === d && u !== s)) return !1;
                    } else if (s.operator === "<=" && !vt(s.semver, String(d), r)) return !1;
                }
                if (!d.operator && (s || i) && o !== 0) return !1;
            }
            return !((i && l && !s && o !== 0) || (s && f && !i && o !== 0) || p || h);
        },
        Qo = (e, t, r) => {
            if (!e) return t;
            let n = cn(e.semver, t.semver, r);
            return n > 0 ? e : n < 0 || (t.operator === ">" && e.operator === ">=") ? t : e;
        },
        ea = (e, t, r) => {
            if (!e) return t;
            let n = cn(e.semver, t.semver, r);
            return n < 0 ? e : n > 0 || (t.operator === "<" && e.operator === "<=") ? t : e;
        };
    ta.exports = wp;
});
var ia = c((Nv, na) => {
    var fn = Ie();
    na.exports = {
        re: fn.re,
        src: fn.src,
        tokens: fn.t,
        SEMVER_SPEC_VERSION: ct().SEMVER_SPEC_VERSION,
        SemVer: $(),
        compareIdentifiers: Wt().compareIdentifiers,
        rcompareIdentifiers: Wt().rcompareIdentifiers,
        parse: Pe(),
        valid: Rs(),
        clean: xs(),
        inc: Is(),
        diff: $s(),
        major: Cs(),
        minor: Fs(),
        patch: Bs(),
        prerelease: Us(),
        compare: X(),
        rcompare: Vs(),
        compareLoose: Xs(),
        compareBuild: zt(),
        sort: Js(),
        rsort: Qs(),
        gt: dt(),
        lt: Kt(),
        eq: Xt(),
        neq: Zr(),
        gte: Yt(),
        lte: Jt(),
        cmp: Qr(),
        coerce: ao(),
        Comparator: yt(),
        Range: z(),
        satisfies: mt(),
        toComparators: Io(),
        maxSatisfying: No(),
        minSatisfying: Lo(),
        minVersion: jo(),
        validRange: Do(),
        outside: tr(),
        gtr: Wo(),
        ltr: Ho(),
        intersects: Ko(),
        simplifyRange: Jo(),
        subset: ra(),
    };
});
var Ye = c(S => {
    "use strict";
    var sa =
        (S && S.__importDefault) ||
        function (e) {
            return e && e.__esModule ? e : {default: e};
        };
    Object.defineProperty(S, "__esModule", {value: !0});
    S.createPeersFolderSuffix = S.depPathToFilename = S.parse = S.refToRelative = S.relative = S.getRegistryByPackageName = S.refToAbsolute = S.tryGetPackageId = S.resolve = S.isAbsolute = void 0;
    var oa = Ki(),
        nr = sa(as()),
        Rp = sa(ia());
    function dn(e) {
        return e[0] !== "/";
    }
    S.isAbsolute = dn;
    function hn(e, t) {
        if (!dn(t)) {
            let r;
            if (t[1] === "@") {
                let i = t.indexOf("/", 1),
                    s = t.slice(1, i !== -1 ? i : 0);
                r = e[s] || e.default;
            } else r = e.default;
            return `${(0, nr.default)(r)}${t}`;
        }
        return t;
    }
    S.resolve = hn;
    function Sp(e, t) {
        if (t[0] !== "/") return null;
        let r = t.indexOf("_", t.lastIndexOf("/"));
        return r !== -1 ? hn(e, t.slice(0, r)) : hn(e, t);
    }
    S.tryGetPackageId = Sp;
    function xp(e, t, r) {
        return e.startsWith("link:") ? null : e.includes("/") ? (e[0] !== "/" ? e : `${(0, nr.default)(ir(r, t))}${e}`) : `${(0, nr.default)(ir(r, t))}/${t}/${e}`;
    }
    S.refToAbsolute = xp;
    function ir(e, t) {
        if (t[0] !== "@") return e.default;
        let r = t.substring(0, t.indexOf("/"));
        return e[r] || e.default;
    }
    S.getRegistryByPackageName = ir;
    function Tp(e, t, r) {
        let n = (0, nr.default)(ir(e, t));
        return r.startsWith(`${n}/`) ? r.slice(r.indexOf("/")) : r;
    }
    S.relative = Tp;
    function Ap(e, t) {
        return e.startsWith("link:") ? null : e.startsWith("file:") || e.includes("/") ? e : `/${t}/${e}`;
    }
    S.refToRelative = Ap;
    function Ip(e) {
        if (typeof e != "string") throw new TypeError(`Expected \`dependencyPath\` to be of type \`string\`, got \`${e === null ? "null" : typeof e}\``);
        let t = dn(e),
            r = e.split("/");
        t || r.shift();
        let n = t ? r.shift() : void 0,
            i = r[0].startsWith("@") ? `${r.shift()}/${r.shift()}` : r.shift(),
            s = r.shift();
        if (s) {
            let o = s.indexOf("_"),
                a;
            if ((o !== -1 && ((a = s.substring(o + 1)), (s = s.substring(0, o))), Rp.default.valid(s))) return {host: n, isAbsolute: t, name: i, peersSuffix: a, version: s};
        }
        if (!t) throw new Error(`${e} is an invalid relative dependency path`);
        return {host: n, isAbsolute: t};
    }
    S.parse = Ip;
    function Pp(e) {
        let t = Np(e).replace(/[\\/:*?"<>|]/g, "+");
        return t.length > 120 || (t !== t.toLowerCase() && !t.startsWith("file+")) ? `${t.substring(0, 50)}_${(0, oa.createBase32Hash)(t)}` : t;
    }
    S.depPathToFilename = Pp;
    function Np(e) {
        if (e.indexOf("file:") !== 0) {
            e.startsWith("/") && (e = e.substring(1));
            let t = e.lastIndexOf("/");
            return `${e.substring(0, t)}@${e.slice(t + 1)}`;
        }
        return e.replace(":", "+");
    }
    function qp(e) {
        let t = e
            .map(({name: r, version: n}) => `${r.replace("/", "+")}@${n}`)
            .sort()
            .join("+");
        return t.length > 26 ? `_${(0, oa.createBase32Hash)(t)}` : `_${t}`;
    }
    S.createPeersFolderSuffix = qp;
});
var pn = c((Lv, aa) => {
    function Lp(e) {
        return e != null && typeof e == "object" && e["@@functional/placeholder"] === !0;
    }
    aa.exports = Lp;
});
var Et = c((Mv, ua) => {
    var Mp = pn();
    function $p(e) {
        return function t(r) {
            return arguments.length === 0 || Mp(r) ? t : e.apply(this, arguments);
        };
    }
    ua.exports = $p;
});
var ca = c(($v, la) => {
    var jp = Et(),
        Cp = jp(function (t) {
            for (var r = {}, n = 0; n < t.length; ) (r[t[n][0]] = t[n][1]), (n += 1);
            return r;
        });
    la.exports = Cp;
});
var ha = c(_t => {
    "use strict";
    var fa =
        (_t && _t.__importDefault) ||
        function (e) {
            return e && e.__esModule ? e : {default: e};
        };
    Object.defineProperty(_t, "__esModule", {value: !0});
    var Dp = fa(require("path")),
        Fp = Ye(),
        kp = fa(ca());
    function Bp(e, t, r) {
        let n = r.pkgLocationByDepPath != null ? s => r.pkgLocationByDepPath[s] : (s, o) => Dp.default.join(r.virtualStoreDir, (0, Fp.depPathToFilename)(s), "node_modules", o),
            i = (0, kp.default)(e.map(s => [s.id, {...s, targetDirs: []}]));
        return (
            Object.entries(t.packages ?? {}).forEach(([s, o]) => {
                if (o.resolution?.type !== "directory") return;
                let u = (o.id ?? s).replace(/^file:/, "");
                if (i[u] == null) return;
                let l = n(s, o.name);
                i[u].targetDirs.push(l), (i[u].stages = ["preinstall", "install", "postinstall", "prepare", "prepublishOnly"]);
            }),
            Object.values(i)
        );
    }
    _t.default = Bp;
});
var gn = c(fe => {
    "use strict";
    var Gp =
            (fe && fe.__createBinding) ||
            (Object.create
                ? function (e, t, r, n) {
                      n === void 0 && (n = r);
                      var i = Object.getOwnPropertyDescriptor(t, r);
                      (!i || ("get" in i ? !t.__esModule : i.writable || i.configurable)) &&
                          (i = {
                              enumerable: !0,
                              get: function () {
                                  return t[r];
                              },
                          }),
                          Object.defineProperty(e, n, i);
                  }
                : function (e, t, r, n) {
                      n === void 0 && (n = r), (e[n] = t[r]);
                  }),
        Up =
            (fe && fe.__setModuleDefault) ||
            (Object.create
                ? function (e, t) {
                      Object.defineProperty(e, "default", {enumerable: !0, value: t});
                  }
                : function (e, t) {
                      e.default = t;
                  }),
        Wp =
            (fe && fe.__importStar) ||
            function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (e != null) for (var r in e) r !== "default" && Object.prototype.hasOwnProperty.call(e, r) && Gp(t, e, r);
                return Up(t, e), t;
            };
    Object.defineProperty(fe, "__esModule", {value: !0});
    var Vp = Wp(Ye());
    fe.default = (e, t) => {
        if (!t.name) {
            let r = Vp.parse(e);
            return {name: r.name, peersSuffix: r.peersSuffix, version: r.version};
        }
        return {name: t.name, peersSuffix: void 0, version: t.version};
    };
});
var da = c(he => {
    "use strict";
    var Hp =
            (he && he.__createBinding) ||
            (Object.create
                ? function (e, t, r, n) {
                      n === void 0 && (n = r);
                      var i = Object.getOwnPropertyDescriptor(t, r);
                      (!i || ("get" in i ? !t.__esModule : i.writable || i.configurable)) &&
                          (i = {
                              enumerable: !0,
                              get: function () {
                                  return t[r];
                              },
                          }),
                          Object.defineProperty(e, n, i);
                  }
                : function (e, t, r, n) {
                      n === void 0 && (n = r), (e[n] = t[r]);
                  }),
        Xp =
            (he && he.__setModuleDefault) ||
            (Object.create
                ? function (e, t) {
                      Object.defineProperty(e, "default", {enumerable: !0, value: t});
                  }
                : function (e, t) {
                      e.default = t;
                  }),
        zp =
            (he && he.__importStar) ||
            function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (e != null) for (var r in e) r !== "default" && Object.prototype.hasOwnProperty.call(e, r) && Hp(t, e, r);
                return Xp(t, e), t;
            };
    Object.defineProperty(he, "__esModule", {value: !0});
    var Kp = zp(Ye());
    he.default = (e, t, r) => (t.id ? t.id : Kp.tryGetPackageId(r, e) ?? e);
});
var pa = c(yn => {
    "use strict";
    Object.defineProperty(yn, "__esModule", {value: !0});
    yn.default = ({dependencies: e, optionalDependencies: t}) => e === void 0 && t === void 0;
});
var ga = c(bn => {
    "use strict";
    Object.defineProperty(bn, "__esModule", {value: !0});
    function Yp(e, t, r) {
        let n;
        r?.registry ? (n = r.registry.endsWith("/") ? r.registry : `${r.registry}/`) : (n = "https://registry.npmjs.org/");
        let i = Zp(e);
        return `${n}${e}/-/${i}-${Jp(t)}.tgz`;
    }
    bn.default = Yp;
    function Jp(e) {
        let t = e.indexOf("+");
        return t === -1 ? e : e.substring(0, t);
    }
    function Zp(e) {
        return e[0] !== "@" ? e : e.split("/")[1];
    }
});
var ya = c(te => {
    "use strict";
    var Qp =
            (te && te.__createBinding) ||
            (Object.create
                ? function (e, t, r, n) {
                      n === void 0 && (n = r);
                      var i = Object.getOwnPropertyDescriptor(t, r);
                      (!i || ("get" in i ? !t.__esModule : i.writable || i.configurable)) &&
                          (i = {
                              enumerable: !0,
                              get: function () {
                                  return t[r];
                              },
                          }),
                          Object.defineProperty(e, n, i);
                  }
                : function (e, t, r, n) {
                      n === void 0 && (n = r), (e[n] = t[r]);
                  }),
        eg =
            (te && te.__setModuleDefault) ||
            (Object.create
                ? function (e, t) {
                      Object.defineProperty(e, "default", {enumerable: !0, value: t});
                  }
                : function (e, t) {
                      e.default = t;
                  }),
        tg =
            (te && te.__importStar) ||
            function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (e != null) for (var r in e) r !== "default" && Object.prototype.hasOwnProperty.call(e, r) && Qp(t, e, r);
                return eg(t, e), t;
            },
        mn =
            (te && te.__importDefault) ||
            function (e) {
                return e && e.__esModule ? e : {default: e};
            };
    Object.defineProperty(te, "__esModule", {value: !0});
    var rg = mn(require("url")),
        ng = tg(Ye()),
        ig = mn(ga()),
        sg = mn(gn());
    te.default = (e, t, r) => {
        if (t.resolution.type || t.resolution.tarball?.startsWith("file:")) return t.resolution;
        let {name: n} = (0, sg.default)(e, t),
            i = t.resolution.registry || (n[0] === "@" && r[n.split("/")[0]]) || r.default,
            s;
        return t.resolution.tarball ? (s = new rg.default.URL(t.resolution.tarball, i.endsWith("/") ? i : `${i}/`).toString()) : (s = o(i)), {...t.resolution, registry: i, tarball: s};
        function o(a) {
            let {name: u, version: l} = ng.parse(e);
            if (!u || !l) throw new Error(`Couldn't get tarball URL from dependency path ${e}`);
            return (0, ig.default)(u, l, {registry: a});
        }
    };
});
var ba = c(sr => {
    "use strict";
    Object.defineProperty(sr, "__esModule", {value: !0});
    sr.DEPENDENCIES_FIELDS = void 0;
    sr.DEPENDENCIES_FIELDS = ["optionalDependencies", "dependencies", "devDependencies"];
});
var va = c(ma => {
    "use strict";
    Object.defineProperty(ma, "__esModule", {value: !0});
});
var _a = c(Ea => {
    "use strict";
    Object.defineProperty(Ea, "__esModule", {value: !0});
});
var Oa = c(wa => {
    "use strict";
    Object.defineProperty(wa, "__esModule", {value: !0});
});
var Sa = c(Ra => {
    "use strict";
    Object.defineProperty(Ra, "__esModule", {value: !0});
});
var xa = c(re => {
    "use strict";
    var og =
            (re && re.__createBinding) ||
            (Object.create
                ? function (e, t, r, n) {
                      n === void 0 && (n = r);
                      var i = Object.getOwnPropertyDescriptor(t, r);
                      (!i || ("get" in i ? !t.__esModule : i.writable || i.configurable)) &&
                          (i = {
                              enumerable: !0,
                              get: function () {
                                  return t[r];
                              },
                          }),
                          Object.defineProperty(e, n, i);
                  }
                : function (e, t, r, n) {
                      n === void 0 && (n = r), (e[n] = t[r]);
                  }),
        wt =
            (re && re.__exportStar) ||
            function (e, t) {
                for (var r in e) r !== "default" && !Object.prototype.hasOwnProperty.call(t, r) && og(t, e, r);
            };
    Object.defineProperty(re, "__esModule", {value: !0});
    wt(ba(), re);
    wt(va(), re);
    wt(_a(), re);
    wt(Oa(), re);
    wt(Sa(), re);
});
var En = c((zv, Ta) => {
    var vn = Et(),
        Ot = pn();
    function ag(e) {
        return function t(r, n) {
            switch (arguments.length) {
                case 0:
                    return t;
                case 1:
                    return Ot(r)
                        ? t
                        : vn(function (i) {
                              return e(r, i);
                          });
                default:
                    return Ot(r) && Ot(n)
                        ? t
                        : Ot(r)
                        ? vn(function (i) {
                              return e(i, n);
                          })
                        : Ot(n)
                        ? vn(function (i) {
                              return e(r, i);
                          })
                        : e(r, n);
            }
        };
    }
    Ta.exports = ag;
});
var Ia = c((Kv, Aa) => {
    function ug(e) {
        for (var t = [], r; !(r = e.next()).done; ) t.push(r.value);
        return t;
    }
    Aa.exports = ug;
});
var Na = c((Yv, Pa) => {
    function lg(e, t, r) {
        for (var n = 0, i = r.length; n < i; ) {
            if (e(t, r[n])) return !0;
            n += 1;
        }
        return !1;
    }
    Pa.exports = lg;
});
var La = c((Jv, qa) => {
    function cg(e) {
        var t = String(e).match(/^function (\w*)/);
        return t == null ? "" : t[1];
    }
    qa.exports = cg;
});
var or = c((Zv, Ma) => {
    function fg(e, t) {
        return Object.prototype.hasOwnProperty.call(t, e);
    }
    Ma.exports = fg;
});
var ja = c((Qv, $a) => {
    function hg(e, t) {
        return e === t ? e !== 0 || 1 / e === 1 / t : e !== e && t !== t;
    }
    $a.exports = typeof Object.is == "function" ? Object.is : hg;
});
var Fa = c((eE, Da) => {
    var dg = or(),
        Ca = Object.prototype.toString,
        pg = (function () {
            return Ca.call(arguments) === "[object Arguments]"
                ? function (t) {
                      return Ca.call(t) === "[object Arguments]";
                  }
                : function (t) {
                      return dg("callee", t);
                  };
        })();
    Da.exports = pg;
});
var Va = c((tE, Wa) => {
    var ka = Et(),
        Ba = or(),
        gg = Fa(),
        yg = !{toString: null}.propertyIsEnumerable("toString"),
        Ga = ["constructor", "valueOf", "isPrototypeOf", "toString", "propertyIsEnumerable", "hasOwnProperty", "toLocaleString"],
        Ua = (function () {
            "use strict";
            return arguments.propertyIsEnumerable("length");
        })(),
        bg = function (t, r) {
            for (var n = 0; n < t.length; ) {
                if (t[n] === r) return !0;
                n += 1;
            }
            return !1;
        },
        mg = ka(
            typeof Object.keys == "function" && !Ua
                ? function (t) {
                      return Object(t) !== t ? [] : Object.keys(t);
                  }
                : function (t) {
                      if (Object(t) !== t) return [];
                      var r,
                          n,
                          i = [],
                          s = Ua && gg(t);
                      for (r in t) Ba(r, t) && (!s || r !== "length") && (i[i.length] = r);
                      if (yg) for (n = Ga.length - 1; n >= 0; ) (r = Ga[n]), Ba(r, t) && !bg(i, r) && (i[i.length] = r), (n -= 1);
                      return i;
                  }
        );
    Wa.exports = mg;
});
var Xa = c((rE, Ha) => {
    var vg = Et(),
        Eg = vg(function (t) {
            return t === null ? "Null" : t === void 0 ? "Undefined" : Object.prototype.toString.call(t).slice(8, -1);
        });
    Ha.exports = Eg;
});
var eu = c((nE, Qa) => {
    var za = Ia(),
        Ka = Na(),
        _g = La(),
        wg = or(),
        _n = ja(),
        Ya = Va(),
        Ja = Xa();
    function Za(e, t, r, n) {
        var i = za(e),
            s = za(t);
        function o(a, u) {
            return wn(a, u, r.slice(), n.slice());
        }
        return !Ka(
            function (a, u) {
                return !Ka(o, u, a);
            },
            s,
            i
        );
    }
    function wn(e, t, r, n) {
        if (_n(e, t)) return !0;
        var i = Ja(e);
        if (i !== Ja(t)) return !1;
        if (typeof e["fantasy-land/equals"] == "function" || typeof t["fantasy-land/equals"] == "function")
            return typeof e["fantasy-land/equals"] == "function" && e["fantasy-land/equals"](t) && typeof t["fantasy-land/equals"] == "function" && t["fantasy-land/equals"](e);
        if (typeof e.equals == "function" || typeof t.equals == "function") return typeof e.equals == "function" && e.equals(t) && typeof t.equals == "function" && t.equals(e);
        switch (i) {
            case "Arguments":
            case "Array":
            case "Object":
                if (typeof e.constructor == "function" && _g(e.constructor) === "Promise") return e === t;
                break;
            case "Boolean":
            case "Number":
            case "String":
                if (!(typeof e == typeof t && _n(e.valueOf(), t.valueOf()))) return !1;
                break;
            case "Date":
                if (!_n(e.valueOf(), t.valueOf())) return !1;
                break;
            case "Error":
                return e.name === t.name && e.message === t.message;
            case "RegExp":
                if (!(e.source === t.source && e.global === t.global && e.ignoreCase === t.ignoreCase && e.multiline === t.multiline && e.sticky === t.sticky && e.unicode === t.unicode)) return !1;
                break;
        }
        for (var s = r.length - 1; s >= 0; ) {
            if (r[s] === e) return n[s] === t;
            s -= 1;
        }
        switch (i) {
            case "Map":
                return e.size !== t.size ? !1 : Za(e.entries(), t.entries(), r.concat([e]), n.concat([t]));
            case "Set":
                return e.size !== t.size ? !1 : Za(e.values(), t.values(), r.concat([e]), n.concat([t]));
            case "Arguments":
            case "Array":
            case "Object":
            case "Boolean":
            case "Number":
            case "String":
            case "Date":
            case "Error":
            case "RegExp":
            case "Int8Array":
            case "Uint8Array":
            case "Uint8ClampedArray":
            case "Int16Array":
            case "Uint16Array":
            case "Int32Array":
            case "Uint32Array":
            case "Float32Array":
            case "Float64Array":
            case "ArrayBuffer":
                break;
            default:
                return !1;
        }
        var o = Ya(e);
        if (o.length !== Ya(t).length) return !1;
        var a = r.concat([e]),
            u = n.concat([t]);
        for (s = o.length - 1; s >= 0; ) {
            var l = o[s];
            if (!(wg(l, t) && wn(t[l], e[l], a, u))) return !1;
            s -= 1;
        }
        return !0;
    }
    Qa.exports = wn;
});
var ru = c((iE, tu) => {
    var Og = En(),
        Rg = eu(),
        Sg = Og(function (t, r) {
            return Rg(t, r, [], []);
        });
    tu.exports = Sg;
});
var iu = c((sE, nu) => {
    var xg = En(),
        Tg = xg(function (t, r) {
            for (var n = {}, i = {}, s = 0, o = t.length; s < o; ) (i[t[s]] = 1), (s += 1);
            for (var a in r) i.hasOwnProperty(a) || (n[a] = r[a]);
            return n;
        });
    nu.exports = Tg;
});
var au = c(Rt => {
    "use strict";
    var ou =
        (Rt && Rt.__importDefault) ||
        function (e) {
            return e && e.__esModule ? e : {default: e};
        };
    Object.defineProperty(Rt, "__esModule", {value: !0});
    var Ag = xa(),
        su = ou(ru()),
        Ig = ou(iu());
    Rt.default = (e, t, r, n) => {
        let i = e.importers[r];
        if (!i) return !1;
        let s = {...t.devDependencies, ...t.dependencies, ...t.optionalDependencies};
        if (
            (n?.autoInstallPeers && ((t = {...t, dependencies: {...(0, Ig.default)(Object.keys(s), t.peerDependencies), ...t.dependencies}}), (s = {...t.peerDependencies, ...s})),
            !(0, su.default)(s, i.specifiers) || i.publishDirectory !== t.publishConfig?.directory || !(0, su.default)(t.dependenciesMeta ?? {}, i.dependenciesMeta ?? {}))
        )
            return !1;
        for (let o of Ag.DEPENDENCIES_FIELDS) {
            let a = i[o] ?? {},
                u = t[o] ?? {},
                l;
            switch (o) {
                case "optionalDependencies":
                    l = Object.keys(u);
                    break;
                case "devDependencies":
                    l = Object.keys(u).filter(f => (t.optionalDependencies == null || !t.optionalDependencies[f]) && (t.dependencies == null || !t.dependencies[f]));
                    break;
                case "dependencies":
                    l = Object.keys(u).filter(f => t.optionalDependencies == null || !t.optionalDependencies[f]);
                    break;
                default:
                    throw new Error(`Unknown dependency type "${o}"`);
            }
            if (l.length !== Object.keys(a).length && l.length !== Pg(a)) return !1;
            for (let f of l) if (!a[f] || i.specifiers?.[f] !== u[f]) return !1;
        }
        return !0;
    };
    function Pg(e) {
        return Object.values(e).filter(t => !t.includes("link:") && !t.includes("file:")).length;
    }
});
var lu = c(uu => {
    "use strict";
    Object.defineProperty(uu, "__esModule", {value: !0});
});
var cu = c(I => {
    "use strict";
    var Ng =
            (I && I.__createBinding) ||
            (Object.create
                ? function (e, t, r, n) {
                      n === void 0 && (n = r);
                      var i = Object.getOwnPropertyDescriptor(t, r);
                      (!i || ("get" in i ? !t.__esModule : i.writable || i.configurable)) &&
                          (i = {
                              enumerable: !0,
                              get: function () {
                                  return t[r];
                              },
                          }),
                          Object.defineProperty(e, n, i);
                  }
                : function (e, t, r, n) {
                      n === void 0 && (n = r), (e[n] = t[r]);
                  }),
        qg =
            (I && I.__exportStar) ||
            function (e, t) {
                for (var r in e) r !== "default" && !Object.prototype.hasOwnProperty.call(t, r) && Ng(t, e, r);
            },
        Je =
            (I && I.__importDefault) ||
            function (e) {
                return e && e.__esModule ? e : {default: e};
            };
    Object.defineProperty(I, "__esModule", {value: !0});
    I.getPkgShortId = I.satisfiesPackageManifest = I.pkgSnapshotToResolution = I.packageIsIndependent = I.packageIdFromSnapshot = I.nameVerFromPkgSnapshot = I.extendProjectsWithTargetDirs = void 0;
    var Lg = Ye(),
        Mg = Je(ha());
    I.extendProjectsWithTargetDirs = Mg.default;
    var $g = Je(gn());
    I.nameVerFromPkgSnapshot = $g.default;
    var jg = Je(da());
    I.packageIdFromSnapshot = jg.default;
    var Cg = Je(pa());
    I.packageIsIndependent = Cg.default;
    var Dg = Je(ya());
    I.pkgSnapshotToResolution = Dg.default;
    var Fg = Je(au());
    I.satisfiesPackageManifest = Fg.default;
    qg(lu(), I);
    I.getPkgShortId = Lg.refToRelative;
});
var pu = c((fE, du) => {
    "use strict";
    du.exports = {
        aliceblue: [240, 248, 255],
        antiquewhite: [250, 235, 215],
        aqua: [0, 255, 255],
        aquamarine: [127, 255, 212],
        azure: [240, 255, 255],
        beige: [245, 245, 220],
        bisque: [255, 228, 196],
        black: [0, 0, 0],
        blanchedalmond: [255, 235, 205],
        blue: [0, 0, 255],
        blueviolet: [138, 43, 226],
        brown: [165, 42, 42],
        burlywood: [222, 184, 135],
        cadetblue: [95, 158, 160],
        chartreuse: [127, 255, 0],
        chocolate: [210, 105, 30],
        coral: [255, 127, 80],
        cornflowerblue: [100, 149, 237],
        cornsilk: [255, 248, 220],
        crimson: [220, 20, 60],
        cyan: [0, 255, 255],
        darkblue: [0, 0, 139],
        darkcyan: [0, 139, 139],
        darkgoldenrod: [184, 134, 11],
        darkgray: [169, 169, 169],
        darkgreen: [0, 100, 0],
        darkgrey: [169, 169, 169],
        darkkhaki: [189, 183, 107],
        darkmagenta: [139, 0, 139],
        darkolivegreen: [85, 107, 47],
        darkorange: [255, 140, 0],
        darkorchid: [153, 50, 204],
        darkred: [139, 0, 0],
        darksalmon: [233, 150, 122],
        darkseagreen: [143, 188, 143],
        darkslateblue: [72, 61, 139],
        darkslategray: [47, 79, 79],
        darkslategrey: [47, 79, 79],
        darkturquoise: [0, 206, 209],
        darkviolet: [148, 0, 211],
        deeppink: [255, 20, 147],
        deepskyblue: [0, 191, 255],
        dimgray: [105, 105, 105],
        dimgrey: [105, 105, 105],
        dodgerblue: [30, 144, 255],
        firebrick: [178, 34, 34],
        floralwhite: [255, 250, 240],
        forestgreen: [34, 139, 34],
        fuchsia: [255, 0, 255],
        gainsboro: [220, 220, 220],
        ghostwhite: [248, 248, 255],
        gold: [255, 215, 0],
        goldenrod: [218, 165, 32],
        gray: [128, 128, 128],
        green: [0, 128, 0],
        greenyellow: [173, 255, 47],
        grey: [128, 128, 128],
        honeydew: [240, 255, 240],
        hotpink: [255, 105, 180],
        indianred: [205, 92, 92],
        indigo: [75, 0, 130],
        ivory: [255, 255, 240],
        khaki: [240, 230, 140],
        lavender: [230, 230, 250],
        lavenderblush: [255, 240, 245],
        lawngreen: [124, 252, 0],
        lemonchiffon: [255, 250, 205],
        lightblue: [173, 216, 230],
        lightcoral: [240, 128, 128],
        lightcyan: [224, 255, 255],
        lightgoldenrodyellow: [250, 250, 210],
        lightgray: [211, 211, 211],
        lightgreen: [144, 238, 144],
        lightgrey: [211, 211, 211],
        lightpink: [255, 182, 193],
        lightsalmon: [255, 160, 122],
        lightseagreen: [32, 178, 170],
        lightskyblue: [135, 206, 250],
        lightslategray: [119, 136, 153],
        lightslategrey: [119, 136, 153],
        lightsteelblue: [176, 196, 222],
        lightyellow: [255, 255, 224],
        lime: [0, 255, 0],
        limegreen: [50, 205, 50],
        linen: [250, 240, 230],
        magenta: [255, 0, 255],
        maroon: [128, 0, 0],
        mediumaquamarine: [102, 205, 170],
        mediumblue: [0, 0, 205],
        mediumorchid: [186, 85, 211],
        mediumpurple: [147, 112, 219],
        mediumseagreen: [60, 179, 113],
        mediumslateblue: [123, 104, 238],
        mediumspringgreen: [0, 250, 154],
        mediumturquoise: [72, 209, 204],
        mediumvioletred: [199, 21, 133],
        midnightblue: [25, 25, 112],
        mintcream: [245, 255, 250],
        mistyrose: [255, 228, 225],
        moccasin: [255, 228, 181],
        navajowhite: [255, 222, 173],
        navy: [0, 0, 128],
        oldlace: [253, 245, 230],
        olive: [128, 128, 0],
        olivedrab: [107, 142, 35],
        orange: [255, 165, 0],
        orangered: [255, 69, 0],
        orchid: [218, 112, 214],
        palegoldenrod: [238, 232, 170],
        palegreen: [152, 251, 152],
        paleturquoise: [175, 238, 238],
        palevioletred: [219, 112, 147],
        papayawhip: [255, 239, 213],
        peachpuff: [255, 218, 185],
        peru: [205, 133, 63],
        pink: [255, 192, 203],
        plum: [221, 160, 221],
        powderblue: [176, 224, 230],
        purple: [128, 0, 128],
        rebeccapurple: [102, 51, 153],
        red: [255, 0, 0],
        rosybrown: [188, 143, 143],
        royalblue: [65, 105, 225],
        saddlebrown: [139, 69, 19],
        salmon: [250, 128, 114],
        sandybrown: [244, 164, 96],
        seagreen: [46, 139, 87],
        seashell: [255, 245, 238],
        sienna: [160, 82, 45],
        silver: [192, 192, 192],
        skyblue: [135, 206, 235],
        slateblue: [106, 90, 205],
        slategray: [112, 128, 144],
        slategrey: [112, 128, 144],
        snow: [255, 250, 250],
        springgreen: [0, 255, 127],
        steelblue: [70, 130, 180],
        tan: [210, 180, 140],
        teal: [0, 128, 128],
        thistle: [216, 191, 216],
        tomato: [255, 99, 71],
        turquoise: [64, 224, 208],
        violet: [238, 130, 238],
        wheat: [245, 222, 179],
        white: [255, 255, 255],
        whitesmoke: [245, 245, 245],
        yellow: [255, 255, 0],
        yellowgreen: [154, 205, 50],
    };
});
var Rn = c((hE, yu) => {
    var St = pu(),
        gu = {};
    for (let e of Object.keys(St)) gu[St[e]] = e;
    var b = {
        rgb: {channels: 3, labels: "rgb"},
        hsl: {channels: 3, labels: "hsl"},
        hsv: {channels: 3, labels: "hsv"},
        hwb: {channels: 3, labels: "hwb"},
        cmyk: {channels: 4, labels: "cmyk"},
        xyz: {channels: 3, labels: "xyz"},
        lab: {channels: 3, labels: "lab"},
        lch: {channels: 3, labels: "lch"},
        hex: {channels: 1, labels: ["hex"]},
        keyword: {channels: 1, labels: ["keyword"]},
        ansi16: {channels: 1, labels: ["ansi16"]},
        ansi256: {channels: 1, labels: ["ansi256"]},
        hcg: {channels: 3, labels: ["h", "c", "g"]},
        apple: {channels: 3, labels: ["r16", "g16", "b16"]},
        gray: {channels: 1, labels: ["gray"]},
    };
    yu.exports = b;
    for (let e of Object.keys(b)) {
        if (!("channels" in b[e])) throw new Error("missing channels property: " + e);
        if (!("labels" in b[e])) throw new Error("missing channel labels property: " + e);
        if (b[e].labels.length !== b[e].channels) throw new Error("channel and label counts mismatch: " + e);
        let {channels: t, labels: r} = b[e];
        delete b[e].channels, delete b[e].labels, Object.defineProperty(b[e], "channels", {value: t}), Object.defineProperty(b[e], "labels", {value: r});
    }
    b.rgb.hsl = function (e) {
        let t = e[0] / 255,
            r = e[1] / 255,
            n = e[2] / 255,
            i = Math.min(t, r, n),
            s = Math.max(t, r, n),
            o = s - i,
            a,
            u;
        s === i ? (a = 0) : t === s ? (a = (r - n) / o) : r === s ? (a = 2 + (n - t) / o) : n === s && (a = 4 + (t - r) / o), (a = Math.min(a * 60, 360)), a < 0 && (a += 360);
        let l = (i + s) / 2;
        return s === i ? (u = 0) : l <= 0.5 ? (u = o / (s + i)) : (u = o / (2 - s - i)), [a, u * 100, l * 100];
    };
    b.rgb.hsv = function (e) {
        let t,
            r,
            n,
            i,
            s,
            o = e[0] / 255,
            a = e[1] / 255,
            u = e[2] / 255,
            l = Math.max(o, a, u),
            f = l - Math.min(o, a, u),
            h = function (p) {
                return (l - p) / 6 / f + 1 / 2;
            };
        return (
            f === 0
                ? ((i = 0), (s = 0))
                : ((s = f / l), (t = h(o)), (r = h(a)), (n = h(u)), o === l ? (i = n - r) : a === l ? (i = 1 / 3 + t - n) : u === l && (i = 2 / 3 + r - t), i < 0 ? (i += 1) : i > 1 && (i -= 1)),
            [i * 360, s * 100, l * 100]
        );
    };
    b.rgb.hwb = function (e) {
        let t = e[0],
            r = e[1],
            n = e[2],
            i = b.rgb.hsl(e)[0],
            s = (1 / 255) * Math.min(t, Math.min(r, n));
        return (n = 1 - (1 / 255) * Math.max(t, Math.max(r, n))), [i, s * 100, n * 100];
    };
    b.rgb.cmyk = function (e) {
        let t = e[0] / 255,
            r = e[1] / 255,
            n = e[2] / 255,
            i = Math.min(1 - t, 1 - r, 1 - n),
            s = (1 - t - i) / (1 - i) || 0,
            o = (1 - r - i) / (1 - i) || 0,
            a = (1 - n - i) / (1 - i) || 0;
        return [s * 100, o * 100, a * 100, i * 100];
    };
    function Gg(e, t) {
        return (e[0] - t[0]) ** 2 + (e[1] - t[1]) ** 2 + (e[2] - t[2]) ** 2;
    }
    b.rgb.keyword = function (e) {
        let t = gu[e];
        if (t) return t;
        let r = 1 / 0,
            n;
        for (let i of Object.keys(St)) {
            let s = St[i],
                o = Gg(e, s);
            o < r && ((r = o), (n = i));
        }
        return n;
    };
    b.keyword.rgb = function (e) {
        return St[e];
    };
    b.rgb.xyz = function (e) {
        let t = e[0] / 255,
            r = e[1] / 255,
            n = e[2] / 255;
        (t = t > 0.04045 ? ((t + 0.055) / 1.055) ** 2.4 : t / 12.92), (r = r > 0.04045 ? ((r + 0.055) / 1.055) ** 2.4 : r / 12.92), (n = n > 0.04045 ? ((n + 0.055) / 1.055) ** 2.4 : n / 12.92);
        let i = t * 0.4124 + r * 0.3576 + n * 0.1805,
            s = t * 0.2126 + r * 0.7152 + n * 0.0722,
            o = t * 0.0193 + r * 0.1192 + n * 0.9505;
        return [i * 100, s * 100, o * 100];
    };
    b.rgb.lab = function (e) {
        let t = b.rgb.xyz(e),
            r = t[0],
            n = t[1],
            i = t[2];
        (r /= 95.047),
            (n /= 100),
            (i /= 108.883),
            (r = r > 0.008856 ? r ** (1 / 3) : 7.787 * r + 16 / 116),
            (n = n > 0.008856 ? n ** (1 / 3) : 7.787 * n + 16 / 116),
            (i = i > 0.008856 ? i ** (1 / 3) : 7.787 * i + 16 / 116);
        let s = 116 * n - 16,
            o = 500 * (r - n),
            a = 200 * (n - i);
        return [s, o, a];
    };
    b.hsl.rgb = function (e) {
        let t = e[0] / 360,
            r = e[1] / 100,
            n = e[2] / 100,
            i,
            s,
            o;
        if (r === 0) return (o = n * 255), [o, o, o];
        n < 0.5 ? (i = n * (1 + r)) : (i = n + r - n * r);
        let a = 2 * n - i,
            u = [0, 0, 0];
        for (let l = 0; l < 3; l++)
            (s = t + (1 / 3) * -(l - 1)),
                s < 0 && s++,
                s > 1 && s--,
                6 * s < 1 ? (o = a + (i - a) * 6 * s) : 2 * s < 1 ? (o = i) : 3 * s < 2 ? (o = a + (i - a) * (2 / 3 - s) * 6) : (o = a),
                (u[l] = o * 255);
        return u;
    };
    b.hsl.hsv = function (e) {
        let t = e[0],
            r = e[1] / 100,
            n = e[2] / 100,
            i = r,
            s = Math.max(n, 0.01);
        (n *= 2), (r *= n <= 1 ? n : 2 - n), (i *= s <= 1 ? s : 2 - s);
        let o = (n + r) / 2,
            a = n === 0 ? (2 * i) / (s + i) : (2 * r) / (n + r);
        return [t, a * 100, o * 100];
    };
    b.hsv.rgb = function (e) {
        let t = e[0] / 60,
            r = e[1] / 100,
            n = e[2] / 100,
            i = Math.floor(t) % 6,
            s = t - Math.floor(t),
            o = 255 * n * (1 - r),
            a = 255 * n * (1 - r * s),
            u = 255 * n * (1 - r * (1 - s));
        switch (((n *= 255), i)) {
            case 0:
                return [n, u, o];
            case 1:
                return [a, n, o];
            case 2:
                return [o, n, u];
            case 3:
                return [o, a, n];
            case 4:
                return [u, o, n];
            case 5:
                return [n, o, a];
        }
    };
    b.hsv.hsl = function (e) {
        let t = e[0],
            r = e[1] / 100,
            n = e[2] / 100,
            i = Math.max(n, 0.01),
            s,
            o;
        o = (2 - r) * n;
        let a = (2 - r) * i;
        return (s = r * i), (s /= a <= 1 ? a : 2 - a), (s = s || 0), (o /= 2), [t, s * 100, o * 100];
    };
    b.hwb.rgb = function (e) {
        let t = e[0] / 360,
            r = e[1] / 100,
            n = e[2] / 100,
            i = r + n,
            s;
        i > 1 && ((r /= i), (n /= i));
        let o = Math.floor(6 * t),
            a = 1 - n;
        (s = 6 * t - o), (o & 1) !== 0 && (s = 1 - s);
        let u = r + s * (a - r),
            l,
            f,
            h;
        switch (o) {
            default:
            case 6:
            case 0:
                (l = a), (f = u), (h = r);
                break;
            case 1:
                (l = u), (f = a), (h = r);
                break;
            case 2:
                (l = r), (f = a), (h = u);
                break;
            case 3:
                (l = r), (f = u), (h = a);
                break;
            case 4:
                (l = u), (f = r), (h = a);
                break;
            case 5:
                (l = a), (f = r), (h = u);
                break;
        }
        return [l * 255, f * 255, h * 255];
    };
    b.cmyk.rgb = function (e) {
        let t = e[0] / 100,
            r = e[1] / 100,
            n = e[2] / 100,
            i = e[3] / 100,
            s = 1 - Math.min(1, t * (1 - i) + i),
            o = 1 - Math.min(1, r * (1 - i) + i),
            a = 1 - Math.min(1, n * (1 - i) + i);
        return [s * 255, o * 255, a * 255];
    };
    b.xyz.rgb = function (e) {
        let t = e[0] / 100,
            r = e[1] / 100,
            n = e[2] / 100,
            i,
            s,
            o;
        return (
            (i = t * 3.2406 + r * -1.5372 + n * -0.4986),
            (s = t * -0.9689 + r * 1.8758 + n * 0.0415),
            (o = t * 0.0557 + r * -0.204 + n * 1.057),
            (i = i > 0.0031308 ? 1.055 * i ** (1 / 2.4) - 0.055 : i * 12.92),
            (s = s > 0.0031308 ? 1.055 * s ** (1 / 2.4) - 0.055 : s * 12.92),
            (o = o > 0.0031308 ? 1.055 * o ** (1 / 2.4) - 0.055 : o * 12.92),
            (i = Math.min(Math.max(0, i), 1)),
            (s = Math.min(Math.max(0, s), 1)),
            (o = Math.min(Math.max(0, o), 1)),
            [i * 255, s * 255, o * 255]
        );
    };
    b.xyz.lab = function (e) {
        let t = e[0],
            r = e[1],
            n = e[2];
        (t /= 95.047),
            (r /= 100),
            (n /= 108.883),
            (t = t > 0.008856 ? t ** (1 / 3) : 7.787 * t + 16 / 116),
            (r = r > 0.008856 ? r ** (1 / 3) : 7.787 * r + 16 / 116),
            (n = n > 0.008856 ? n ** (1 / 3) : 7.787 * n + 16 / 116);
        let i = 116 * r - 16,
            s = 500 * (t - r),
            o = 200 * (r - n);
        return [i, s, o];
    };
    b.lab.xyz = function (e) {
        let t = e[0],
            r = e[1],
            n = e[2],
            i,
            s,
            o;
        (s = (t + 16) / 116), (i = r / 500 + s), (o = s - n / 200);
        let a = s ** 3,
            u = i ** 3,
            l = o ** 3;
        return (
            (s = a > 0.008856 ? a : (s - 16 / 116) / 7.787),
            (i = u > 0.008856 ? u : (i - 16 / 116) / 7.787),
            (o = l > 0.008856 ? l : (o - 16 / 116) / 7.787),
            (i *= 95.047),
            (s *= 100),
            (o *= 108.883),
            [i, s, o]
        );
    };
    b.lab.lch = function (e) {
        let t = e[0],
            r = e[1],
            n = e[2],
            i;
        (i = (Math.atan2(n, r) * 360) / 2 / Math.PI), i < 0 && (i += 360);
        let o = Math.sqrt(r * r + n * n);
        return [t, o, i];
    };
    b.lch.lab = function (e) {
        let t = e[0],
            r = e[1],
            i = (e[2] / 360) * 2 * Math.PI,
            s = r * Math.cos(i),
            o = r * Math.sin(i);
        return [t, s, o];
    };
    b.rgb.ansi16 = function (e, t = null) {
        let [r, n, i] = e,
            s = t === null ? b.rgb.hsv(e)[2] : t;
        if (((s = Math.round(s / 50)), s === 0)) return 30;
        let o = 30 + ((Math.round(i / 255) << 2) | (Math.round(n / 255) << 1) | Math.round(r / 255));
        return s === 2 && (o += 60), o;
    };
    b.hsv.ansi16 = function (e) {
        return b.rgb.ansi16(b.hsv.rgb(e), e[2]);
    };
    b.rgb.ansi256 = function (e) {
        let t = e[0],
            r = e[1],
            n = e[2];
        return t === r && r === n
            ? t < 8
                ? 16
                : t > 248
                ? 231
                : Math.round(((t - 8) / 247) * 24) + 232
            : 16 + 36 * Math.round((t / 255) * 5) + 6 * Math.round((r / 255) * 5) + Math.round((n / 255) * 5);
    };
    b.ansi16.rgb = function (e) {
        let t = e % 10;
        if (t === 0 || t === 7) return e > 50 && (t += 3.5), (t = (t / 10.5) * 255), [t, t, t];
        let r = (~~(e > 50) + 1) * 0.5,
            n = (t & 1) * r * 255,
            i = ((t >> 1) & 1) * r * 255,
            s = ((t >> 2) & 1) * r * 255;
        return [n, i, s];
    };
    b.ansi256.rgb = function (e) {
        if (e >= 232) {
            let s = (e - 232) * 10 + 8;
            return [s, s, s];
        }
        e -= 16;
        let t,
            r = (Math.floor(e / 36) / 5) * 255,
            n = (Math.floor((t = e % 36) / 6) / 5) * 255,
            i = ((t % 6) / 5) * 255;
        return [r, n, i];
    };
    b.rgb.hex = function (e) {
        let r = (((Math.round(e[0]) & 255) << 16) + ((Math.round(e[1]) & 255) << 8) + (Math.round(e[2]) & 255)).toString(16).toUpperCase();
        return "000000".substring(r.length) + r;
    };
    b.hex.rgb = function (e) {
        let t = e.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
        if (!t) return [0, 0, 0];
        let r = t[0];
        t[0].length === 3 &&
            (r = r
                .split("")
                .map(a => a + a)
                .join(""));
        let n = parseInt(r, 16),
            i = (n >> 16) & 255,
            s = (n >> 8) & 255,
            o = n & 255;
        return [i, s, o];
    };
    b.rgb.hcg = function (e) {
        let t = e[0] / 255,
            r = e[1] / 255,
            n = e[2] / 255,
            i = Math.max(Math.max(t, r), n),
            s = Math.min(Math.min(t, r), n),
            o = i - s,
            a,
            u;
        return (
            o < 1 ? (a = s / (1 - o)) : (a = 0),
            o <= 0 ? (u = 0) : i === t ? (u = ((r - n) / o) % 6) : i === r ? (u = 2 + (n - t) / o) : (u = 4 + (t - r) / o),
            (u /= 6),
            (u %= 1),
            [u * 360, o * 100, a * 100]
        );
    };
    b.hsl.hcg = function (e) {
        let t = e[1] / 100,
            r = e[2] / 100,
            n = r < 0.5 ? 2 * t * r : 2 * t * (1 - r),
            i = 0;
        return n < 1 && (i = (r - 0.5 * n) / (1 - n)), [e[0], n * 100, i * 100];
    };
    b.hsv.hcg = function (e) {
        let t = e[1] / 100,
            r = e[2] / 100,
            n = t * r,
            i = 0;
        return n < 1 && (i = (r - n) / (1 - n)), [e[0], n * 100, i * 100];
    };
    b.hcg.rgb = function (e) {
        let t = e[0] / 360,
            r = e[1] / 100,
            n = e[2] / 100;
        if (r === 0) return [n * 255, n * 255, n * 255];
        let i = [0, 0, 0],
            s = (t % 1) * 6,
            o = s % 1,
            a = 1 - o,
            u = 0;
        switch (Math.floor(s)) {
            case 0:
                (i[0] = 1), (i[1] = o), (i[2] = 0);
                break;
            case 1:
                (i[0] = a), (i[1] = 1), (i[2] = 0);
                break;
            case 2:
                (i[0] = 0), (i[1] = 1), (i[2] = o);
                break;
            case 3:
                (i[0] = 0), (i[1] = a), (i[2] = 1);
                break;
            case 4:
                (i[0] = o), (i[1] = 0), (i[2] = 1);
                break;
            default:
                (i[0] = 1), (i[1] = 0), (i[2] = a);
        }
        return (u = (1 - r) * n), [(r * i[0] + u) * 255, (r * i[1] + u) * 255, (r * i[2] + u) * 255];
    };
    b.hcg.hsv = function (e) {
        let t = e[1] / 100,
            r = e[2] / 100,
            n = t + r * (1 - t),
            i = 0;
        return n > 0 && (i = t / n), [e[0], i * 100, n * 100];
    };
    b.hcg.hsl = function (e) {
        let t = e[1] / 100,
            n = (e[2] / 100) * (1 - t) + 0.5 * t,
            i = 0;
        return n > 0 && n < 0.5 ? (i = t / (2 * n)) : n >= 0.5 && n < 1 && (i = t / (2 * (1 - n))), [e[0], i * 100, n * 100];
    };
    b.hcg.hwb = function (e) {
        let t = e[1] / 100,
            r = e[2] / 100,
            n = t + r * (1 - t);
        return [e[0], (n - t) * 100, (1 - n) * 100];
    };
    b.hwb.hcg = function (e) {
        let t = e[1] / 100,
            r = e[2] / 100,
            n = 1 - r,
            i = n - t,
            s = 0;
        return i < 1 && (s = (n - i) / (1 - i)), [e[0], i * 100, s * 100];
    };
    b.apple.rgb = function (e) {
        return [(e[0] / 65535) * 255, (e[1] / 65535) * 255, (e[2] / 65535) * 255];
    };
    b.rgb.apple = function (e) {
        return [(e[0] / 255) * 65535, (e[1] / 255) * 65535, (e[2] / 255) * 65535];
    };
    b.gray.rgb = function (e) {
        return [(e[0] / 100) * 255, (e[0] / 100) * 255, (e[0] / 100) * 255];
    };
    b.gray.hsl = function (e) {
        return [0, 0, e[0]];
    };
    b.gray.hsv = b.gray.hsl;
    b.gray.hwb = function (e) {
        return [0, 100, e[0]];
    };
    b.gray.cmyk = function (e) {
        return [0, 0, 0, e[0]];
    };
    b.gray.lab = function (e) {
        return [e[0], 0, 0];
    };
    b.gray.hex = function (e) {
        let t = Math.round((e[0] / 100) * 255) & 255,
            n = ((t << 16) + (t << 8) + t).toString(16).toUpperCase();
        return "000000".substring(n.length) + n;
    };
    b.rgb.gray = function (e) {
        return [((e[0] + e[1] + e[2]) / 3 / 255) * 100];
    };
});
var mu = c((dE, bu) => {
    var ar = Rn();
    function Ug() {
        let e = {},
            t = Object.keys(ar);
        for (let r = t.length, n = 0; n < r; n++) e[t[n]] = {distance: -1, parent: null};
        return e;
    }
    function Wg(e) {
        let t = Ug(),
            r = [e];
        for (t[e].distance = 0; r.length; ) {
            let n = r.pop(),
                i = Object.keys(ar[n]);
            for (let s = i.length, o = 0; o < s; o++) {
                let a = i[o],
                    u = t[a];
                u.distance === -1 && ((u.distance = t[n].distance + 1), (u.parent = n), r.unshift(a));
            }
        }
        return t;
    }
    function Vg(e, t) {
        return function (r) {
            return t(e(r));
        };
    }
    function Hg(e, t) {
        let r = [t[e].parent, e],
            n = ar[t[e].parent][e],
            i = t[e].parent;
        for (; t[i].parent; ) r.unshift(t[i].parent), (n = Vg(ar[t[i].parent][i], n)), (i = t[i].parent);
        return (n.conversion = r), n;
    }
    bu.exports = function (e) {
        let t = Wg(e),
            r = {},
            n = Object.keys(t);
        for (let i = n.length, s = 0; s < i; s++) {
            let o = n[s];
            t[o].parent !== null && (r[o] = Hg(o, t));
        }
        return r;
    };
});
var Eu = c((pE, vu) => {
    var Sn = Rn(),
        Xg = mu(),
        Ze = {},
        zg = Object.keys(Sn);
    function Kg(e) {
        let t = function (...r) {
            let n = r[0];
            return n == null ? n : (n.length > 1 && (r = n), e(r));
        };
        return "conversion" in e && (t.conversion = e.conversion), t;
    }
    function Yg(e) {
        let t = function (...r) {
            let n = r[0];
            if (n == null) return n;
            n.length > 1 && (r = n);
            let i = e(r);
            if (typeof i == "object") for (let s = i.length, o = 0; o < s; o++) i[o] = Math.round(i[o]);
            return i;
        };
        return "conversion" in e && (t.conversion = e.conversion), t;
    }
    zg.forEach(e => {
        (Ze[e] = {}), Object.defineProperty(Ze[e], "channels", {value: Sn[e].channels}), Object.defineProperty(Ze[e], "labels", {value: Sn[e].labels});
        let t = Xg(e);
        Object.keys(t).forEach(n => {
            let i = t[n];
            (Ze[e][n] = Yg(i)), (Ze[e][n].raw = Kg(i));
        });
    });
    vu.exports = Ze;
});
var xu = c((gE, Su) => {
    "use strict";
    var _u =
            (e, t) =>
            (...r) =>
                `\x1B[${e(...r) + t}m`,
        wu =
            (e, t) =>
            (...r) => {
                let n = e(...r);
                return `\x1B[${38 + t};5;${n}m`;
            },
        Ou =
            (e, t) =>
            (...r) => {
                let n = e(...r);
                return `\x1B[${38 + t};2;${n[0]};${n[1]};${n[2]}m`;
            },
        ur = e => e,
        Ru = (e, t, r) => [e, t, r],
        Qe = (e, t, r) => {
            Object.defineProperty(e, t, {
                get: () => {
                    let n = r();
                    return Object.defineProperty(e, t, {value: n, enumerable: !0, configurable: !0}), n;
                },
                enumerable: !0,
                configurable: !0,
            });
        },
        xn,
        et = (e, t, r, n) => {
            xn === void 0 && (xn = Eu());
            let i = n ? 10 : 0,
                s = {};
            for (let [o, a] of Object.entries(xn)) {
                let u = o === "ansi16" ? "ansi" : o;
                o === t ? (s[u] = e(r, i)) : typeof a == "object" && (s[u] = e(a[t], i));
            }
            return s;
        };
    function Jg() {
        let e = new Map(),
            t = {
                modifier: {reset: [0, 0], bold: [1, 22], dim: [2, 22], italic: [3, 23], underline: [4, 24], inverse: [7, 27], hidden: [8, 28], strikethrough: [9, 29]},
                color: {
                    black: [30, 39],
                    red: [31, 39],
                    green: [32, 39],
                    yellow: [33, 39],
                    blue: [34, 39],
                    magenta: [35, 39],
                    cyan: [36, 39],
                    white: [37, 39],
                    blackBright: [90, 39],
                    redBright: [91, 39],
                    greenBright: [92, 39],
                    yellowBright: [93, 39],
                    blueBright: [94, 39],
                    magentaBright: [95, 39],
                    cyanBright: [96, 39],
                    whiteBright: [97, 39],
                },
                bgColor: {
                    bgBlack: [40, 49],
                    bgRed: [41, 49],
                    bgGreen: [42, 49],
                    bgYellow: [43, 49],
                    bgBlue: [44, 49],
                    bgMagenta: [45, 49],
                    bgCyan: [46, 49],
                    bgWhite: [47, 49],
                    bgBlackBright: [100, 49],
                    bgRedBright: [101, 49],
                    bgGreenBright: [102, 49],
                    bgYellowBright: [103, 49],
                    bgBlueBright: [104, 49],
                    bgMagentaBright: [105, 49],
                    bgCyanBright: [106, 49],
                    bgWhiteBright: [107, 49],
                },
            };
        (t.color.gray = t.color.blackBright), (t.bgColor.bgGray = t.bgColor.bgBlackBright), (t.color.grey = t.color.blackBright), (t.bgColor.bgGrey = t.bgColor.bgBlackBright);
        for (let [r, n] of Object.entries(t)) {
            for (let [i, s] of Object.entries(n)) (t[i] = {open: `\x1B[${s[0]}m`, close: `\x1B[${s[1]}m`}), (n[i] = t[i]), e.set(s[0], s[1]);
            Object.defineProperty(t, r, {value: n, enumerable: !1});
        }
        return (
            Object.defineProperty(t, "codes", {value: e, enumerable: !1}),
            (t.color.close = "\x1B[39m"),
            (t.bgColor.close = "\x1B[49m"),
            Qe(t.color, "ansi", () => et(_u, "ansi16", ur, !1)),
            Qe(t.color, "ansi256", () => et(wu, "ansi256", ur, !1)),
            Qe(t.color, "ansi16m", () => et(Ou, "rgb", Ru, !1)),
            Qe(t.bgColor, "ansi", () => et(_u, "ansi16", ur, !0)),
            Qe(t.bgColor, "ansi256", () => et(wu, "ansi256", ur, !0)),
            Qe(t.bgColor, "ansi16m", () => et(Ou, "rgb", Ru, !0)),
            t
        );
    }
    Object.defineProperty(Su, "exports", {enumerable: !0, get: Jg});
});
var Au = c((yE, Tu) => {
    "use strict";
    Tu.exports = (e, t = process.argv) => {
        let r = e.startsWith("-") ? "" : e.length === 1 ? "-" : "--",
            n = t.indexOf(r + e),
            i = t.indexOf("--");
        return n !== -1 && (i === -1 || n < i);
    };
});
var Nu = c((bE, Pu) => {
    "use strict";
    var Zg = require("os"),
        Iu = require("tty"),
        K = Au(),
        {env: L} = process,
        ve;
    K("no-color") || K("no-colors") || K("color=false") || K("color=never") ? (ve = 0) : (K("color") || K("colors") || K("color=true") || K("color=always")) && (ve = 1);
    "FORCE_COLOR" in L && (L.FORCE_COLOR === "true" ? (ve = 1) : L.FORCE_COLOR === "false" ? (ve = 0) : (ve = L.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(L.FORCE_COLOR, 10), 3)));
    function Tn(e) {
        return e === 0 ? !1 : {level: e, hasBasic: !0, has256: e >= 2, has16m: e >= 3};
    }
    function An(e, t) {
        if (ve === 0) return 0;
        if (K("color=16m") || K("color=full") || K("color=truecolor")) return 3;
        if (K("color=256")) return 2;
        if (e && !t && ve === void 0) return 0;
        let r = ve || 0;
        if (L.TERM === "dumb") return r;
        if (process.platform === "win32") {
            let n = Zg.release().split(".");
            return Number(n[0]) >= 10 && Number(n[2]) >= 10586 ? (Number(n[2]) >= 14931 ? 3 : 2) : 1;
        }
        if ("CI" in L) return ["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some(n => n in L) || L.CI_NAME === "codeship" ? 1 : r;
        if ("TEAMCITY_VERSION" in L) return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(L.TEAMCITY_VERSION) ? 1 : 0;
        if (L.COLORTERM === "truecolor") return 3;
        if ("TERM_PROGRAM" in L) {
            let n = parseInt((L.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
            switch (L.TERM_PROGRAM) {
                case "iTerm.app":
                    return n >= 3 ? 3 : 2;
                case "Apple_Terminal":
                    return 2;
            }
        }
        return /-256(color)?$/i.test(L.TERM) ? 2 : /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(L.TERM) || "COLORTERM" in L ? 1 : r;
    }
    function Qg(e) {
        let t = An(e, e && e.isTTY);
        return Tn(t);
    }
    Pu.exports = {supportsColor: Qg, stdout: Tn(An(!0, Iu.isatty(1))), stderr: Tn(An(!0, Iu.isatty(2)))};
});
var Lu = c((mE, qu) => {
    "use strict";
    var e0 = (e, t, r) => {
            let n = e.indexOf(t);
            if (n === -1) return e;
            let i = t.length,
                s = 0,
                o = "";
            do (o += e.substr(s, n - s) + t + r), (s = n + i), (n = e.indexOf(t, s));
            while (n !== -1);
            return (o += e.substr(s)), o;
        },
        t0 = (e, t, r, n) => {
            let i = 0,
                s = "";
            do {
                let o = e[n - 1] === "\r";
                (s +=
                    e.substr(i, (o ? n - 1 : n) - i) +
                    t +
                    (o
                        ? `\r
`
                        : `
`) +
                    r),
                    (i = n + 1),
                    (n = e.indexOf(
                        `
`,
                        i
                    ));
            } while (n !== -1);
            return (s += e.substr(i)), s;
        };
    qu.exports = {stringReplaceAll: e0, stringEncaseCRLFWithFirstIndex: t0};
});
var Du = c((vE, Cu) => {
    "use strict";
    var r0 = /(?:\\(u(?:[a-f\d]{4}|\{[a-f\d]{1,6}\})|x[a-f\d]{2}|.))|(?:\{(~)?(\w+(?:\([^)]*\))?(?:\.\w+(?:\([^)]*\))?)*)(?:[ \t]|(?=\r?\n)))|(\})|((?:.|[\r\n\f])+?)/gi,
        Mu = /(?:^|\.)(\w+)(?:\(([^)]*)\))?/g,
        n0 = /^(['"])((?:\\.|(?!\1)[^\\])*)\1$/,
        i0 = /\\(u(?:[a-f\d]{4}|{[a-f\d]{1,6}})|x[a-f\d]{2}|.)|([^\\])/gi,
        s0 = new Map([
            [
                "n",
                `
`,
            ],
            ["r", "\r"],
            ["t", "	"],
            ["b", "\b"],
            ["f", "\f"],
            ["v", "\v"],
            ["0", "\0"],
            ["\\", "\\"],
            ["e", "\x1B"],
            ["a", "\x07"],
        ]);
    function ju(e) {
        let t = e[0] === "u",
            r = e[1] === "{";
        return (t && !r && e.length === 5) || (e[0] === "x" && e.length === 3)
            ? String.fromCharCode(parseInt(e.slice(1), 16))
            : t && r
            ? String.fromCodePoint(parseInt(e.slice(2, -1), 16))
            : s0.get(e) || e;
    }
    function o0(e, t) {
        let r = [],
            n = t.trim().split(/\s*,\s*/g),
            i;
        for (let s of n) {
            let o = Number(s);
            if (!Number.isNaN(o)) r.push(o);
            else if ((i = s.match(n0))) r.push(i[2].replace(i0, (a, u, l) => (u ? ju(u) : l)));
            else throw new Error(`Invalid Chalk template style argument: ${s} (in style '${e}')`);
        }
        return r;
    }
    function a0(e) {
        Mu.lastIndex = 0;
        let t = [],
            r;
        for (; (r = Mu.exec(e)) !== null; ) {
            let n = r[1];
            if (r[2]) {
                let i = o0(n, r[2]);
                t.push([n].concat(i));
            } else t.push([n]);
        }
        return t;
    }
    function $u(e, t) {
        let r = {};
        for (let i of t) for (let s of i.styles) r[s[0]] = i.inverse ? null : s.slice(1);
        let n = e;
        for (let [i, s] of Object.entries(r))
            if (!!Array.isArray(s)) {
                if (!(i in n)) throw new Error(`Unknown Chalk style: ${i}`);
                n = s.length > 0 ? n[i](...s) : n[i];
            }
        return n;
    }
    Cu.exports = (e, t) => {
        let r = [],
            n = [],
            i = [];
        if (
            (t.replace(r0, (s, o, a, u, l, f) => {
                if (o) i.push(ju(o));
                else if (u) {
                    let h = i.join("");
                    (i = []), n.push(r.length === 0 ? h : $u(e, r)(h)), r.push({inverse: a, styles: a0(u)});
                } else if (l) {
                    if (r.length === 0) throw new Error("Found extraneous } in Chalk template literal");
                    n.push($u(e, r)(i.join(""))), (i = []), r.pop();
                } else i.push(f);
            }),
            n.push(i.join("")),
            r.length > 0)
        ) {
            let s = `Chalk template literal is missing ${r.length} closing bracket${r.length === 1 ? "" : "s"} (\`}\`)`;
            throw new Error(s);
        }
        return n.join("");
    };
});
var dr = c((EE, Wu) => {
    "use strict";
    var xt = xu(),
        {stdout: Pn, stderr: Nn} = Nu(),
        {stringReplaceAll: u0, stringEncaseCRLFWithFirstIndex: l0} = Lu(),
        {isArray: lr} = Array,
        ku = ["ansi", "ansi", "ansi256", "ansi16m"],
        tt = Object.create(null),
        c0 = (e, t = {}) => {
            if (t.level && !(Number.isInteger(t.level) && t.level >= 0 && t.level <= 3)) throw new Error("The `level` option should be an integer from 0 to 3");
            let r = Pn ? Pn.level : 0;
            e.level = t.level === void 0 ? r : t.level;
        },
        qn = class {
            constructor(t) {
                return Bu(t);
            }
        },
        Bu = e => {
            let t = {};
            return (
                c0(t, e),
                (t.template = (...r) => Uu(t.template, ...r)),
                Object.setPrototypeOf(t, cr.prototype),
                Object.setPrototypeOf(t.template, t),
                (t.template.constructor = () => {
                    throw new Error("`chalk.constructor()` is deprecated. Use `new chalk.Instance()` instead.");
                }),
                (t.template.Instance = qn),
                t.template
            );
        };
    function cr(e) {
        return Bu(e);
    }
    for (let [e, t] of Object.entries(xt))
        tt[e] = {
            get() {
                let r = fr(this, Ln(t.open, t.close, this._styler), this._isEmpty);
                return Object.defineProperty(this, e, {value: r}), r;
            },
        };
    tt.visible = {
        get() {
            let e = fr(this, this._styler, !0);
            return Object.defineProperty(this, "visible", {value: e}), e;
        },
    };
    var Gu = ["rgb", "hex", "keyword", "hsl", "hsv", "hwb", "ansi", "ansi256"];
    for (let e of Gu)
        tt[e] = {
            get() {
                let {level: t} = this;
                return function (...r) {
                    let n = Ln(xt.color[ku[t]][e](...r), xt.color.close, this._styler);
                    return fr(this, n, this._isEmpty);
                };
            },
        };
    for (let e of Gu) {
        let t = "bg" + e[0].toUpperCase() + e.slice(1);
        tt[t] = {
            get() {
                let {level: r} = this;
                return function (...n) {
                    let i = Ln(xt.bgColor[ku[r]][e](...n), xt.bgColor.close, this._styler);
                    return fr(this, i, this._isEmpty);
                };
            },
        };
    }
    var f0 = Object.defineProperties(() => {}, {
            ...tt,
            level: {
                enumerable: !0,
                get() {
                    return this._generator.level;
                },
                set(e) {
                    this._generator.level = e;
                },
            },
        }),
        Ln = (e, t, r) => {
            let n, i;
            return r === void 0 ? ((n = e), (i = t)) : ((n = r.openAll + e), (i = t + r.closeAll)), {open: e, close: t, openAll: n, closeAll: i, parent: r};
        },
        fr = (e, t, r) => {
            let n = (...i) => (lr(i[0]) && lr(i[0].raw) ? Fu(n, Uu(n, ...i)) : Fu(n, i.length === 1 ? "" + i[0] : i.join(" ")));
            return Object.setPrototypeOf(n, f0), (n._generator = e), (n._styler = t), (n._isEmpty = r), n;
        },
        Fu = (e, t) => {
            if (e.level <= 0 || !t) return e._isEmpty ? "" : t;
            let r = e._styler;
            if (r === void 0) return t;
            let {openAll: n, closeAll: i} = r;
            if (t.indexOf("\x1B") !== -1) for (; r !== void 0; ) (t = u0(t, r.close, r.open)), (r = r.parent);
            let s = t.indexOf(`
`);
            return s !== -1 && (t = l0(t, i, n, s)), n + t + i;
        },
        In,
        Uu = (e, ...t) => {
            let [r] = t;
            if (!lr(r) || !lr(r.raw)) return t.join(" ");
            let n = t.slice(1),
                i = [r.raw[0]];
            for (let s = 1; s < r.length; s++) i.push(String(n[s - 1]).replace(/[{}\\]/g, "\\$&"), String(r.raw[s]));
            return In === void 0 && (In = Du()), In(e, i.join(""));
        };
    Object.defineProperties(cr.prototype, tt);
    var hr = cr();
    hr.supportsColor = Pn;
    hr.stderr = cr({level: Nn ? Nn.level : 0});
    hr.stderr.supportsColor = Nn;
    Wu.exports = hr;
});
var zu = c((RE, Xu) => {
    var h0 = typeof process == "object" && process && process.platform === "win32";
    Xu.exports = h0 ? {sep: "\\"} : {sep: "/"};
});
var Qu = c((SE, Zu) => {
    "use strict";
    Zu.exports = Yu;
    function Yu(e, t, r) {
        e instanceof RegExp && (e = Ku(e, r)), t instanceof RegExp && (t = Ku(t, r));
        var n = Ju(e, t, r);
        return n && {start: n[0], end: n[1], pre: r.slice(0, n[0]), body: r.slice(n[0] + e.length, n[1]), post: r.slice(n[1] + t.length)};
    }
    function Ku(e, t) {
        var r = t.match(e);
        return r ? r[0] : null;
    }
    Yu.range = Ju;
    function Ju(e, t, r) {
        var n,
            i,
            s,
            o,
            a,
            u = r.indexOf(e),
            l = r.indexOf(t, u + 1),
            f = u;
        if (u >= 0 && l > 0) {
            if (e === t) return [u, l];
            for (n = [], s = r.length; f >= 0 && !a; )
                f == u ? (n.push(f), (u = r.indexOf(e, f + 1))) : n.length == 1 ? (a = [n.pop(), l]) : ((i = n.pop()), i < s && ((s = i), (o = l)), (l = r.indexOf(t, f + 1))),
                    (f = u < l && u >= 0 ? u : l);
            n.length && (a = [s, o]);
        }
        return a;
    }
});
var al = c((xE, ol) => {
    var el = Qu();
    ol.exports = g0;
    var tl = "\0SLASH" + Math.random() + "\0",
        rl = "\0OPEN" + Math.random() + "\0",
        $n = "\0CLOSE" + Math.random() + "\0",
        nl = "\0COMMA" + Math.random() + "\0",
        il = "\0PERIOD" + Math.random() + "\0";
    function Mn(e) {
        return parseInt(e, 10) == e ? parseInt(e, 10) : e.charCodeAt(0);
    }
    function d0(e) {
        return e.split("\\\\").join(tl).split("\\{").join(rl).split("\\}").join($n).split("\\,").join(nl).split("\\.").join(il);
    }
    function p0(e) {
        return e.split(tl).join("\\").split(rl).join("{").split($n).join("}").split(nl).join(",").split(il).join(".");
    }
    function sl(e) {
        if (!e) return [""];
        var t = [],
            r = el("{", "}", e);
        if (!r) return e.split(",");
        var n = r.pre,
            i = r.body,
            s = r.post,
            o = n.split(",");
        o[o.length - 1] += "{" + i + "}";
        var a = sl(s);
        return s.length && ((o[o.length - 1] += a.shift()), o.push.apply(o, a)), t.push.apply(t, o), t;
    }
    function g0(e) {
        return e ? (e.substr(0, 2) === "{}" && (e = "\\{\\}" + e.substr(2)), Tt(d0(e), !0).map(p0)) : [];
    }
    function y0(e) {
        return "{" + e + "}";
    }
    function b0(e) {
        return /^-?0\d/.test(e);
    }
    function m0(e, t) {
        return e <= t;
    }
    function v0(e, t) {
        return e >= t;
    }
    function Tt(e, t) {
        var r = [],
            n = el("{", "}", e);
        if (!n) return [e];
        var i = n.pre,
            s = n.post.length ? Tt(n.post, !1) : [""];
        if (/\$$/.test(n.pre))
            for (var o = 0; o < s.length; o++) {
                var a = i + "{" + n.body + "}" + s[o];
                r.push(a);
            }
        else {
            var u = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(n.body),
                l = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(n.body),
                f = u || l,
                h = n.body.indexOf(",") >= 0;
            if (!f && !h) return n.post.match(/,.*\}/) ? ((e = n.pre + "{" + n.body + $n + n.post), Tt(e)) : [e];
            var p;
            if (f) p = n.body.split(/\.\./);
            else if (((p = sl(n.body)), p.length === 1 && ((p = Tt(p[0], !1).map(y0)), p.length === 1)))
                return s.map(function (M) {
                    return n.pre + p[0] + M;
                });
            var d;
            if (f) {
                var m = Mn(p[0]),
                    x = Mn(p[1]),
                    j = Math.max(p[0].length, p[1].length),
                    T = p.length == 3 ? Math.abs(Mn(p[2])) : 1,
                    ue = m0,
                    ge = x < m;
                ge && ((T *= -1), (ue = v0));
                var R = p.some(b0);
                d = [];
                for (var v = m; ue(v, x); v += T) {
                    var N;
                    if (l) (N = String.fromCharCode(v)), N === "\\" && (N = "");
                    else if (((N = String(v)), R)) {
                        var G = j - N.length;
                        if (G > 0) {
                            var C = new Array(G + 1).join("0");
                            v < 0 ? (N = "-" + C + N.slice(1)) : (N = C + N);
                        }
                    }
                    d.push(N);
                }
            } else {
                d = [];
                for (var U = 0; U < p.length; U++) d.push.apply(d, Tt(p[U], !1));
            }
            for (var U = 0; U < d.length; U++)
                for (var o = 0; o < s.length; o++) {
                    var a = i + d[U] + s[o];
                    (!t || f || a) && r.push(a);
                }
        }
        return r;
    }
});
var dl = c((AE, Fn) => {
    var V = (Fn.exports = (e, t, r = {}) => (Er(t), !r.nocomment && t.charAt(0) === "#" ? !1 : new rt(t, r).match(e)));
    Fn.exports = V;
    var Cn = zu();
    V.sep = Cn.sep;
    var ne = Symbol("globstar **");
    V.GLOBSTAR = ne;
    var E0 = al(),
        ul = {"!": {open: "(?:(?!(?:", close: "))[^/]*?)"}, "?": {open: "(?:", close: ")?"}, "+": {open: "(?:", close: ")+"}, "*": {open: "(?:", close: ")*"}, "@": {open: "(?:", close: ")"}},
        Dn = "[^/]",
        jn = Dn + "*?",
        _0 = "(?:(?!(?:\\/|^)(?:\\.{1,2})($|\\/)).)*?",
        w0 = "(?:(?!(?:\\/|^)\\.).)*?",
        fl = e => e.split("").reduce((t, r) => ((t[r] = !0), t), {}),
        ll = fl("().*{}+?[]^$\\!"),
        O0 = fl("[.("),
        cl = /\/+/;
    V.filter =
        (e, t = {}) =>
        (r, n, i) =>
            V(r, e, t);
    var Ee = (e, t = {}) => {
        let r = {};
        return Object.keys(e).forEach(n => (r[n] = e[n])), Object.keys(t).forEach(n => (r[n] = t[n])), r;
    };
    V.defaults = e => {
        if (!e || typeof e != "object" || !Object.keys(e).length) return V;
        let t = V,
            r = (n, i, s) => t(n, i, Ee(e, s));
        return (
            (r.Minimatch = class extends t.Minimatch {
                constructor(i, s) {
                    super(i, Ee(e, s));
                }
            }),
            (r.Minimatch.defaults = n => t.defaults(Ee(e, n)).Minimatch),
            (r.filter = (n, i) => t.filter(n, Ee(e, i))),
            (r.defaults = n => t.defaults(Ee(e, n))),
            (r.makeRe = (n, i) => t.makeRe(n, Ee(e, i))),
            (r.braceExpand = (n, i) => t.braceExpand(n, Ee(e, i))),
            (r.match = (n, i, s) => t.match(n, i, Ee(e, s))),
            r
        );
    };
    V.braceExpand = (e, t) => hl(e, t);
    var hl = (e, t = {}) => (Er(e), t.nobrace || !/\{(?:(?!\{).)*\}/.test(e) ? [e] : E0(e)),
        R0 = 1024 * 64,
        Er = e => {
            if (typeof e != "string") throw new TypeError("invalid pattern");
            if (e.length > R0) throw new TypeError("pattern is too long");
        },
        vr = Symbol("subparse");
    V.makeRe = (e, t) => new rt(e, t || {}).makeRe();
    V.match = (e, t, r = {}) => {
        let n = new rt(t, r);
        return (e = e.filter(i => n.match(i))), n.options.nonull && !e.length && e.push(t), e;
    };
    var S0 = e => e.replace(/\\(.)/g, "$1"),
        x0 = e => e.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"),
        rt = class {
            constructor(t, r) {
                Er(t),
                    r || (r = {}),
                    (this.options = r),
                    (this.set = []),
                    (this.pattern = t),
                    (this.windowsPathsNoEscape = !!r.windowsPathsNoEscape || r.allowWindowsEscape === !1),
                    this.windowsPathsNoEscape && (this.pattern = this.pattern.replace(/\\/g, "/")),
                    (this.regexp = null),
                    (this.negate = !1),
                    (this.comment = !1),
                    (this.empty = !1),
                    (this.partial = !!r.partial),
                    this.make();
            }
            debug() {}
            make() {
                let t = this.pattern,
                    r = this.options;
                if (!r.nocomment && t.charAt(0) === "#") {
                    this.comment = !0;
                    return;
                }
                if (!t) {
                    this.empty = !0;
                    return;
                }
                this.parseNegate();
                let n = (this.globSet = this.braceExpand());
                r.debug && (this.debug = (...i) => console.error(...i)),
                    this.debug(this.pattern, n),
                    (n = this.globParts = n.map(i => i.split(cl))),
                    this.debug(this.pattern, n),
                    (n = n.map((i, s, o) => i.map(this.parse, this))),
                    this.debug(this.pattern, n),
                    (n = n.filter(i => i.indexOf(!1) === -1)),
                    this.debug(this.pattern, n),
                    (this.set = n);
            }
            parseNegate() {
                if (this.options.nonegate) return;
                let t = this.pattern,
                    r = !1,
                    n = 0;
                for (let i = 0; i < t.length && t.charAt(i) === "!"; i++) (r = !r), n++;
                n && (this.pattern = t.substr(n)), (this.negate = r);
            }
            matchOne(t, r, n) {
                var i = this.options;
                this.debug("matchOne", {this: this, file: t, pattern: r}), this.debug("matchOne", t.length, r.length);
                for (var s = 0, o = 0, a = t.length, u = r.length; s < a && o < u; s++, o++) {
                    this.debug("matchOne loop");
                    var l = r[o],
                        f = t[s];
                    if ((this.debug(r, l, f), l === !1)) return !1;
                    if (l === ne) {
                        this.debug("GLOBSTAR", [r, l, f]);
                        var h = s,
                            p = o + 1;
                        if (p === u) {
                            for (this.debug("** at the end"); s < a; s++) if (t[s] === "." || t[s] === ".." || (!i.dot && t[s].charAt(0) === ".")) return !1;
                            return !0;
                        }
                        for (; h < a; ) {
                            var d = t[h];
                            if (
                                (this.debug(
                                    `
globstar while`,
                                    t,
                                    h,
                                    r,
                                    p,
                                    d
                                ),
                                this.matchOne(t.slice(h), r.slice(p), n))
                            )
                                return this.debug("globstar found match!", h, a, d), !0;
                            if (d === "." || d === ".." || (!i.dot && d.charAt(0) === ".")) {
                                this.debug("dot detected!", t, h, r, p);
                                break;
                            }
                            this.debug("globstar swallow a segment, and continue"), h++;
                        }
                        return !!(
                            n &&
                            (this.debug(
                                `
>>> no match, partial?`,
                                t,
                                h,
                                r,
                                p
                            ),
                            h === a)
                        );
                    }
                    var m;
                    if ((typeof l == "string" ? ((m = f === l), this.debug("string match", l, f, m)) : ((m = f.match(l)), this.debug("pattern match", l, f, m)), !m)) return !1;
                }
                if (s === a && o === u) return !0;
                if (s === a) return n;
                if (o === u) return s === a - 1 && t[s] === "";
                throw new Error("wtf?");
            }
            braceExpand() {
                return hl(this.pattern, this.options);
            }
            parse(t, r) {
                Er(t);
                let n = this.options;
                if (t === "**")
                    if (n.noglobstar) t = "*";
                    else return ne;
                if (t === "") return "";
                let i = "",
                    s = !!n.nocase,
                    o = !1,
                    a = [],
                    u = [],
                    l,
                    f = !1,
                    h = -1,
                    p = -1,
                    d,
                    m,
                    x,
                    j = t.charAt(0) === "." ? "" : n.dot ? "(?!(?:^|\\/)\\.{1,2}(?:$|\\/))" : "(?!\\.)",
                    T = () => {
                        if (l) {
                            switch (l) {
                                case "*":
                                    (i += jn), (s = !0);
                                    break;
                                case "?":
                                    (i += Dn), (s = !0);
                                    break;
                                default:
                                    i += "\\" + l;
                                    break;
                            }
                            this.debug("clearStateChar %j %j", l, i), (l = !1);
                        }
                    };
                for (let R = 0, v; R < t.length && (v = t.charAt(R)); R++) {
                    if ((this.debug("%s	%s %s %j", t, R, i, v), o)) {
                        if (v === "/") return !1;
                        ll[v] && (i += "\\"), (i += v), (o = !1);
                        continue;
                    }
                    switch (v) {
                        case "/":
                            return !1;
                        case "\\":
                            T(), (o = !0);
                            continue;
                        case "?":
                        case "*":
                        case "+":
                        case "@":
                        case "!":
                            if ((this.debug("%s	%s %s %j <-- stateChar", t, R, i, v), f)) {
                                this.debug("  in class"), v === "!" && R === p + 1 && (v = "^"), (i += v);
                                continue;
                            }
                            this.debug("call clearStateChar %j", l), T(), (l = v), n.noext && T();
                            continue;
                        case "(":
                            if (f) {
                                i += "(";
                                continue;
                            }
                            if (!l) {
                                i += "\\(";
                                continue;
                            }
                            a.push({type: l, start: R - 1, reStart: i.length, open: ul[l].open, close: ul[l].close}),
                                (i += l === "!" ? "(?:(?!(?:" : "(?:"),
                                this.debug("plType %j %j", l, i),
                                (l = !1);
                            continue;
                        case ")":
                            if (f || !a.length) {
                                i += "\\)";
                                continue;
                            }
                            T(), (s = !0), (m = a.pop()), (i += m.close), m.type === "!" && u.push(m), (m.reEnd = i.length);
                            continue;
                        case "|":
                            if (f || !a.length) {
                                i += "\\|";
                                continue;
                            }
                            T(), (i += "|");
                            continue;
                        case "[":
                            if ((T(), f)) {
                                i += "\\" + v;
                                continue;
                            }
                            (f = !0), (p = R), (h = i.length), (i += v);
                            continue;
                        case "]":
                            if (R === p + 1 || !f) {
                                i += "\\" + v;
                                continue;
                            }
                            d = t.substring(p + 1, R);
                            try {
                                RegExp("[" + d + "]");
                            } catch {
                                (x = this.parse(d, vr)), (i = i.substr(0, h) + "\\[" + x[0] + "\\]"), (s = s || x[1]), (f = !1);
                                continue;
                            }
                            (s = !0), (f = !1), (i += v);
                            continue;
                        default:
                            T(), ll[v] && !(v === "^" && f) && (i += "\\"), (i += v);
                            break;
                    }
                }
                for (f && ((d = t.substr(p + 1)), (x = this.parse(d, vr)), (i = i.substr(0, h) + "\\[" + x[0]), (s = s || x[1])), m = a.pop(); m; m = a.pop()) {
                    let R;
                    (R = i.slice(m.reStart + m.open.length)),
                        this.debug("setting tail", i, m),
                        (R = R.replace(/((?:\\{2}){0,64})(\\?)\|/g, (N, G, C) => (C || (C = "\\"), G + G + C + "|"))),
                        this.debug(
                            `tail=%j
   %s`,
                            R,
                            R,
                            m,
                            i
                        );
                    let v = m.type === "*" ? jn : m.type === "?" ? Dn : "\\" + m.type;
                    (s = !0), (i = i.slice(0, m.reStart) + v + "\\(" + R);
                }
                T(), o && (i += "\\\\");
                let ue = O0[i.charAt(0)];
                for (let R = u.length - 1; R > -1; R--) {
                    let v = u[R],
                        N = i.slice(0, v.reStart),
                        G = i.slice(v.reStart, v.reEnd - 8),
                        C = i.slice(v.reEnd),
                        U = i.slice(v.reEnd - 8, v.reEnd) + C,
                        M = N.split("(").length - 1,
                        Xr = C;
                    for (let Fi = 0; Fi < M; Fi++) Xr = Xr.replace(/\)[+*?]?/, "");
                    C = Xr;
                    let Df = C === "" && r !== vr ? "$" : "";
                    i = N + G + C + Df + U;
                }
                if ((i !== "" && s && (i = "(?=.)" + i), ue && (i = j + i), r === vr)) return [i, s];
                if (!s) return S0(t);
                let ge = n.nocase ? "i" : "";
                try {
                    return Object.assign(new RegExp("^" + i + "$", ge), {_glob: t, _src: i});
                } catch {
                    return new RegExp("$.");
                }
            }
            makeRe() {
                if (this.regexp || this.regexp === !1) return this.regexp;
                let t = this.set;
                if (!t.length) return (this.regexp = !1), this.regexp;
                let r = this.options,
                    n = r.noglobstar ? jn : r.dot ? _0 : w0,
                    i = r.nocase ? "i" : "",
                    s = t
                        .map(
                            o => (
                                (o = o.map(a => (typeof a == "string" ? x0(a) : a === ne ? ne : a._src)).reduce((a, u) => ((a[a.length - 1] === ne && u === ne) || a.push(u), a), [])),
                                o.forEach((a, u) => {
                                    a !== ne ||
                                        o[u - 1] === ne ||
                                        (u === 0
                                            ? o.length > 1
                                                ? (o[u + 1] = "(?:\\/|" + n + "\\/)?" + o[u + 1])
                                                : (o[u] = n)
                                            : u === o.length - 1
                                            ? (o[u - 1] += "(?:\\/|" + n + ")?")
                                            : ((o[u - 1] += "(?:\\/|\\/" + n + "\\/)" + o[u + 1]), (o[u + 1] = ne)));
                                }),
                                o.filter(a => a !== ne).join("/")
                            )
                        )
                        .join("|");
                (s = "^(?:" + s + ")$"), this.negate && (s = "^(?!" + s + ").*$");
                try {
                    this.regexp = new RegExp(s, i);
                } catch {
                    this.regexp = !1;
                }
                return this.regexp;
            }
            match(t, r = this.partial) {
                if ((this.debug("match", t, this.pattern), this.comment)) return !1;
                if (this.empty) return t === "";
                if (t === "/" && r) return !0;
                let n = this.options;
                Cn.sep !== "/" && (t = t.split(Cn.sep).join("/")), (t = t.split(cl)), this.debug(this.pattern, "split", t);
                let i = this.set;
                this.debug(this.pattern, "set", i);
                let s;
                for (let o = t.length - 1; o >= 0 && ((s = t[o]), !s); o--);
                for (let o = 0; o < i.length; o++) {
                    let a = i[o],
                        u = t;
                    if ((n.matchBase && a.length === 1 && (u = [s]), this.matchOne(u, a, r))) return n.flipNegate ? !0 : !this.negate;
                }
                return n.flipNegate ? !1 : this.negate;
            }
            static defaults(t) {
                return V.defaults(t).Minimatch;
            }
        };
    V.Minimatch = rt;
});
var Rl = c(Y => {
    "use strict";
    Object.defineProperty(Y, "__esModule", {value: !0});
    Y.WORKSPACE_MANIFEST_FILENAME = Y.LAYOUT_VERSION = Y.ENGINE_NAME = Y.LOCKFILE_VERSION = Y.WANTED_LOCKFILE = void 0;
    Y.WANTED_LOCKFILE = "pnpm-lock.yaml";
    Y.LOCKFILE_VERSION = 5.4;
    Y.ENGINE_NAME = `${process.platform}-${process.arch}-node-${process.version.split(".")[0]}`;
    Y.LAYOUT_VERSION = 5;
    Y.WORKSPACE_MANIFEST_FILENAME = "pnpm-workspace.yaml";
});
var Sl = c($e => {
    "use strict";
    Object.defineProperty($e, "__esModule", {value: !0});
    $e.LockfileMissingDependencyError = $e.FetchError = void 0;
    var $0 = Rl(),
        At = class extends Error {
            constructor(t, r, n) {
                super(r), (this.code = `ERR_PNPM_${t}`), (this.hint = n?.hint), (this.attempts = n?.attempts);
            }
        };
    $e.default = At;
    var Gn = class extends At {
        constructor(t, r, n) {
            let i = `GET ${t.url}: ${r.statusText} - ${r.status}`,
                s = t.authHeaderValue ? j0(t.authHeaderValue) : void 0;
            (r.status === 401 || r.status === 403 || r.status === 404) &&
                ((n = n
                    ? `${n}

`
                    : ""),
                s ? (n += `An authorization header was used: ${s}`) : (n += "No authorization header was set for the request.")),
                super(`FETCH_${r.status}`, i, {hint: n}),
                (this.request = t),
                (this.response = r);
        }
    };
    $e.FetchError = Gn;
    function j0(e) {
        let [t, r] = e.split(" ");
        return `${t} ${r.substring(0, 4)}[hidden]`;
    }
    var Un = class extends At {
        constructor(t) {
            let r = `Broken lockfile: no entry for '${t}' in ${$0.WANTED_LOCKFILE}`;
            super("LOCKFILE_MISSING_DEPENDENCY", r, {
                hint: `This issue is probably caused by a badly resolved merge conflict.
To fix the lockfile, run 'pnpm install --no-frozen-lockfile'.`,
            });
        }
    };
    $e.LockfileMissingDependencyError = Un;
});
var Tl = c((UE, xl) => {
    var Wn = class {
            constructor(t) {
                (this.value = t), (this.next = void 0);
            }
        },
        Vn = class {
            constructor() {
                this.clear();
            }
            enqueue(t) {
                let r = new Wn(t);
                this._head ? ((this._tail.next = r), (this._tail = r)) : ((this._head = r), (this._tail = r)), this._size++;
            }
            dequeue() {
                let t = this._head;
                if (!!t) return (this._head = this._head.next), this._size--, t.value;
            }
            clear() {
                (this._head = void 0), (this._tail = void 0), (this._size = 0);
            }
            get size() {
                return this._size;
            }
            *[Symbol.iterator]() {
                let t = this._head;
                for (; t; ) yield t.value, (t = t.next);
            }
        };
    xl.exports = Vn;
});
var Il = c((WE, Al) => {
    "use strict";
    var C0 = Tl(),
        D0 = e => {
            if (!((Number.isInteger(e) || e === 1 / 0) && e > 0)) throw new TypeError("Expected `concurrency` to be a number from 1 and up");
            let t = new C0(),
                r = 0,
                n = () => {
                    r--, t.size > 0 && t.dequeue()();
                },
                i = async (a, u, ...l) => {
                    r++;
                    let f = (async () => a(...l))();
                    u(f);
                    try {
                        await f;
                    } catch {}
                    n();
                },
                s = (a, u, ...l) => {
                    t.enqueue(i.bind(null, a, u, ...l)), (async () => (await Promise.resolve(), r < e && t.size > 0 && t.dequeue()()))();
                },
                o = (a, ...u) =>
                    new Promise(l => {
                        s(a, l, ...u);
                    });
            return (
                Object.defineProperties(o, {
                    activeCount: {get: () => r},
                    pendingCount: {get: () => t.size},
                    clearQueue: {
                        value: () => {
                            t.clear();
                        },
                    },
                }),
                o
            );
        };
    Al.exports = D0;
});
var ql = c((VE, Nl) => {
    "use strict";
    var Pl = Il(),
        _r = class extends Error {
            constructor(t) {
                super(), (this.value = t);
            }
        },
        F0 = async (e, t) => t(await e),
        k0 = async e => {
            let t = await Promise.all(e);
            if (t[1] === !0) throw new _r(t[0]);
            return !1;
        },
        B0 = async (e, t, r) => {
            r = {concurrency: 1 / 0, preserveOrder: !0, ...r};
            let n = Pl(r.concurrency),
                i = [...e].map(o => [o, n(F0, o, t)]),
                s = Pl(r.preserveOrder ? 1 : 1 / 0);
            try {
                await Promise.all(i.map(o => s(k0, o)));
            } catch (o) {
                if (o instanceof _r) return o.value;
                throw o;
            }
        };
    Nl.exports = B0;
});
var Dl = c((HE, Hn) => {
    "use strict";
    var Ll = require("path"),
        wr = require("fs"),
        {promisify: Ml} = require("util"),
        G0 = ql(),
        U0 = Ml(wr.stat),
        W0 = Ml(wr.lstat),
        $l = {directory: "isDirectory", file: "isFile"};
    function jl({type: e}) {
        if (!(e in $l)) throw new Error(`Invalid type specified: ${e}`);
    }
    var Cl = (e, t) => e === void 0 || t[$l[e]]();
    Hn.exports = async (e, t) => {
        (t = {cwd: process.cwd(), type: "file", allowSymlinks: !0, ...t}), jl(t);
        let r = t.allowSymlinks ? U0 : W0;
        return G0(
            e,
            async n => {
                try {
                    let i = await r(Ll.resolve(t.cwd, n));
                    return Cl(t.type, i);
                } catch {
                    return !1;
                }
            },
            t
        );
    };
    Hn.exports.sync = (e, t) => {
        (t = {cwd: process.cwd(), allowSymlinks: !0, type: "file", ...t}), jl(t);
        let r = t.allowSymlinks ? wr.statSync : wr.lstatSync;
        for (let n of e)
            try {
                let i = r(Ll.resolve(t.cwd, n));
                if (Cl(t.type, i)) return n;
            } catch {}
    };
});
var kl = c((XE, Xn) => {
    "use strict";
    var Fl = require("fs"),
        {promisify: V0} = require("util"),
        H0 = V0(Fl.access);
    Xn.exports = async e => {
        try {
            return await H0(e), !0;
        } catch {
            return !1;
        }
    };
    Xn.exports.sync = e => {
        try {
            return Fl.accessSync(e), !0;
        } catch {
            return !1;
        }
    };
});
var Kn = c((zE, nt) => {
    "use strict";
    var _e = require("path"),
        Or = Dl(),
        Bl = kl(),
        zn = Symbol("findUp.stop");
    nt.exports = async (e, t = {}) => {
        let r = _e.resolve(t.cwd || ""),
            {root: n} = _e.parse(r),
            i = [].concat(e),
            s = async o => {
                if (typeof e != "function") return Or(i, o);
                let a = await e(o.cwd);
                return typeof a == "string" ? Or([a], o) : a;
            };
        for (;;) {
            let o = await s({...t, cwd: r});
            if (o === zn) return;
            if (o) return _e.resolve(r, o);
            if (r === n) return;
            r = _e.dirname(r);
        }
    };
    nt.exports.sync = (e, t = {}) => {
        let r = _e.resolve(t.cwd || ""),
            {root: n} = _e.parse(r),
            i = [].concat(e),
            s = o => {
                if (typeof e != "function") return Or.sync(i, o);
                let a = e(o.cwd);
                return typeof a == "string" ? Or.sync([a], o) : a;
            };
        for (;;) {
            let o = s({...t, cwd: r});
            if (o === zn) return;
            if (o) return _e.resolve(r, o);
            if (r === n) return;
            r = _e.dirname(r);
        }
    };
    nt.exports.exists = Bl;
    nt.exports.sync.exists = Bl.sync;
    nt.exports.stop = zn;
});
var Wl = c(It => {
    "use strict";
    var Rr =
        (It && It.__importDefault) ||
        function (e) {
            return e && e.__esModule ? e : {default: e};
        };
    Object.defineProperty(It, "__esModule", {value: !0});
    var X0 = Rr(require("fs")),
        Gl = Rr(require("path")),
        z0 = Rr(Sl()),
        K0 = Rr(Kn()),
        Ul = "NPM_CONFIG_WORKSPACE_DIR",
        Y0 = "pnpm-workspace.yaml";
    async function J0(e) {
        let t = process.env[Ul] ?? process.env[Ul.toLowerCase()],
            r = t ? Gl.default.join(t, "pnpm-workspace.yaml") : await (0, K0.default)([Y0, "pnpm-workspace.yml"], {cwd: await Z0(e)});
        if (r?.endsWith(".yml")) throw new z0.default("BAD_WORKSPACE_MANIFEST_NAME", `The workspace manifest file should be named "pnpm-workspace.yaml". File found: ${r}`);
        return r && Gl.default.dirname(r);
    }
    It.default = J0;
    async function Z0(e) {
        return new Promise(t => {
            X0.default.realpath.native(e, function (r, n) {
                t(r !== null ? e : n);
            });
        });
    }
});
var tc = c((t1, ec) => {
    ec.exports = Pt;
    Pt.default = Pt;
    Pt.stable = Zl;
    Pt.stableStringify = Zl;
    var xr = "[...]",
        Yl = "[Circular]",
        Ce = [],
        je = [];
    function Jl() {
        return {depthLimit: Number.MAX_SAFE_INTEGER, edgesLimit: Number.MAX_SAFE_INTEGER};
    }
    function Pt(e, t, r, n) {
        typeof n > "u" && (n = Jl()), Zn(e, "", 0, [], void 0, 0, n);
        var i;
        try {
            je.length === 0 ? (i = JSON.stringify(e, t, r)) : (i = JSON.stringify(e, Ql(t), r));
        } catch {
            return JSON.stringify("[unable to serialize, circular reference is too complex to analyze]");
        } finally {
            for (; Ce.length !== 0; ) {
                var s = Ce.pop();
                s.length === 4 ? Object.defineProperty(s[0], s[1], s[3]) : (s[0][s[1]] = s[2]);
            }
        }
        return i;
    }
    function it(e, t, r, n) {
        var i = Object.getOwnPropertyDescriptor(n, r);
        i.get !== void 0 ? (i.configurable ? (Object.defineProperty(n, r, {value: e}), Ce.push([n, r, t, i])) : je.push([t, r, e])) : ((n[r] = e), Ce.push([n, r, t]));
    }
    function Zn(e, t, r, n, i, s, o) {
        s += 1;
        var a;
        if (typeof e == "object" && e !== null) {
            for (a = 0; a < n.length; a++)
                if (n[a] === e) {
                    it(Yl, e, t, i);
                    return;
                }
            if (typeof o.depthLimit < "u" && s > o.depthLimit) {
                it(xr, e, t, i);
                return;
            }
            if (typeof o.edgesLimit < "u" && r + 1 > o.edgesLimit) {
                it(xr, e, t, i);
                return;
            }
            if ((n.push(e), Array.isArray(e))) for (a = 0; a < e.length; a++) Zn(e[a], a, a, n, e, s, o);
            else {
                var u = Object.keys(e);
                for (a = 0; a < u.length; a++) {
                    var l = u[a];
                    Zn(e[l], l, a, n, e, s, o);
                }
            }
            n.pop();
        }
    }
    function ry(e, t) {
        return e < t ? -1 : e > t ? 1 : 0;
    }
    function Zl(e, t, r, n) {
        typeof n > "u" && (n = Jl());
        var i = Qn(e, "", 0, [], void 0, 0, n) || e,
            s;
        try {
            je.length === 0 ? (s = JSON.stringify(i, t, r)) : (s = JSON.stringify(i, Ql(t), r));
        } catch {
            return JSON.stringify("[unable to serialize, circular reference is too complex to analyze]");
        } finally {
            for (; Ce.length !== 0; ) {
                var o = Ce.pop();
                o.length === 4 ? Object.defineProperty(o[0], o[1], o[3]) : (o[0][o[1]] = o[2]);
            }
        }
        return s;
    }
    function Qn(e, t, r, n, i, s, o) {
        s += 1;
        var a;
        if (typeof e == "object" && e !== null) {
            for (a = 0; a < n.length; a++)
                if (n[a] === e) {
                    it(Yl, e, t, i);
                    return;
                }
            try {
                if (typeof e.toJSON == "function") return;
            } catch {
                return;
            }
            if (typeof o.depthLimit < "u" && s > o.depthLimit) {
                it(xr, e, t, i);
                return;
            }
            if (typeof o.edgesLimit < "u" && r + 1 > o.edgesLimit) {
                it(xr, e, t, i);
                return;
            }
            if ((n.push(e), Array.isArray(e))) for (a = 0; a < e.length; a++) Qn(e[a], a, a, n, e, s, o);
            else {
                var u = {},
                    l = Object.keys(e).sort(ry);
                for (a = 0; a < l.length; a++) {
                    var f = l[a];
                    Qn(e[f], f, a, n, e, s, o), (u[f] = e[f]);
                }
                if (typeof i < "u") Ce.push([i, t, e]), (i[t] = u);
                else return u;
            }
            n.pop();
        }
    }
    function Ql(e) {
        return (
            (e =
                typeof e < "u"
                    ? e
                    : function (t, r) {
                          return r;
                      }),
            function (t, r) {
                if (je.length > 0)
                    for (var n = 0; n < je.length; n++) {
                        var i = je[n];
                        if (i[1] === t && i[0] === r) {
                            (r = i[2]), je.splice(n, 1);
                            break;
                        }
                    }
                return e.call(this, t, r);
            }
        );
    }
});
var nc = c((r1, rc) => {
    "use strict";
    var ei = typeof window < "u" ? window : typeof global < "u" ? global : {};
    rc.exports = ny;
    function ny(e, t) {
        return e in ei ? ei[e] : ((ei[e] = t), t);
    }
});
var sc = c((n1, ic) => {
    var k = require("util").format;
    function iy(e, t, r, n, i, s, o, a, u, l, f, h, p, d, m, x) {
        return x !== void 0
            ? k(e, t, r, n, i, s, o, a, u, l, f, h, p, d, m, x)
            : m !== void 0
            ? k(e, t, r, n, i, s, o, a, u, l, f, h, p, d, m)
            : d !== void 0
            ? k(e, t, r, n, i, s, o, a, u, l, f, h, p, d)
            : p !== void 0
            ? k(e, t, r, n, i, s, o, a, u, l, f, h, p)
            : h !== void 0
            ? k(e, t, r, n, i, s, o, a, u, l, f, h)
            : f !== void 0
            ? k(e, t, r, n, i, s, o, a, u, l, f)
            : l !== void 0
            ? k(e, t, r, n, i, s, o, a, u, l)
            : u !== void 0
            ? k(e, t, r, n, i, s, o, a, u)
            : a !== void 0
            ? k(e, t, r, n, i, s, o, a)
            : o !== void 0
            ? k(e, t, r, n, i, s, o)
            : s !== void 0
            ? k(e, t, r, n, i, s)
            : i !== void 0
            ? k(e, t, r, n, i)
            : n !== void 0
            ? k(e, t, r, n)
            : r !== void 0
            ? k(e, t, r)
            : t !== void 0
            ? k(e, t)
            : e;
    }
    ic.exports = iy;
});
var qt = c((i1, pc) => {
    "use strict";
    var Nt = tc(),
        ie = nc()("$$bole", {fastTime: !1}),
        Tr = sc(),
        Ar = "debug info warn error".split(" "),
        lc = require("os").hostname(),
        sy = Nt(lc),
        cc = process.pid,
        fc = !1,
        ti = [];
    for (let e of Ar) (ti[e] = ',"hostname":' + sy + ',"pid":' + cc + ',"level":"' + e), Number(ti[e]), Array.isArray(ie[e]) || (ie[e] = []);
    function hc(e) {
        let t = e.stack,
            r;
        return (
            typeof e.cause == "function" &&
                (r = e.cause()) &&
                (t +=
                    `
Caused by: ` + hc(r)),
            t
        );
    }
    function oc(e, t) {
        t.err = {name: e.name, message: e.message, code: e.code, stack: hc(e)};
    }
    function oy(e, t) {
        t.req = {method: e.method, url: e.url, headers: e.headers, remoteAddress: e.connection.remoteAddress, remotePort: e.connection.remotePort};
    }
    function ac(e, t) {
        for (let r in e) Object.prototype.hasOwnProperty.call(e, r) && e[r] !== void 0 && (t[r] = e[r]);
    }
    function dc(e) {
        return e._writableState && e._writableState.objectMode === !0;
    }
    function uc(e, t, r, n) {
        let i = '{"time":' + (ie.fastTime ? Date.now() : '"' + new Date().toISOString() + '"') + ti[e] + '","name":' + t + (r !== void 0 ? ',"message":' + Nt(r) : "");
        for (let s in n) i += "," + Nt(s) + ":" + Nt(n[s]);
        return (i += "}"), Number(i), i;
    }
    function ay(e, t, r, n) {
        let i = {time: ie.fastTime ? Date.now() : new Date().toISOString(), hostname: lc, pid: cc, level: e, name: t};
        r !== void 0 && (n.message = r);
        for (let s in n) i[s] = n[s];
        return i;
    }
    function uy(e, t) {
        let r = ie[e],
            n = Nt(t);
        return function (s, o, a, u, l, f, h, p, d, m, x, j, T, ue, ge, R) {
            if (r.length === 0) return;
            let v = {},
                N,
                G = 0,
                C = r.length,
                U,
                M;
            if (
                (typeof s == "string" || s == null
                    ? (M = Tr(s, o, a, u, l, f, h, p, d, m, x, j, T, ue, ge, R)) || (M = void 0)
                    : (s instanceof Error
                          ? typeof o == "object"
                              ? (ac(o, v), oc(s, v), (M = Tr(a, u, l, f, h, p, d, m, x, j, T, ue, ge, R)) || (M = void 0))
                              : (oc(s, v), (M = Tr(o, a, u, l, f, h, p, d, m, x, j, T, ue, ge, R)) || (M = void 0))
                          : (M = Tr(o, a, u, l, f, h, p, d, m, x, j, T, ue, ge, R)) || (M = void 0),
                      typeof s == "boolean" ? (M = String(s)) : typeof s == "object" && !(s instanceof Error) && (s.method && s.url && s.headers && s.socket ? oy(s, v) : ac(s, v))),
                C === 1 && !fc)
            ) {
                r[0].write(
                    Buffer.from(
                        uc(e, n, M, v) +
                            `
`
                    )
                );
                return;
            }
            for (; G < C; G++)
                dc(r[G])
                    ? (N === void 0 && (N = ay(e, t, M, v)), r[G].write(N))
                    : (U === void 0 &&
                          (U = Buffer.from(
                              uc(e, n, M, v) +
                                  `
`
                          )),
                      r[G].write(U));
        };
    }
    function se(e) {
        function t(n) {
            return se(e + ":" + n);
        }
        function r(n, i) {
            return (n[i] = uy(i, e)), n;
        }
        return Ar.reduce(r, t);
    }
    se.output = function (t) {
        let r = !1;
        if (Array.isArray(t)) return t.forEach(se.output), se;
        if (typeof t.level != "string") throw new TypeError('Must provide a "level" option');
        for (let n of Ar) !r && n === t.level && (r = !0), r && (t.stream && dc(t.stream) && (fc = !0), ie[n].push(t.stream));
        return se;
    };
    se.reset = function () {
        for (let t of Ar) ie[t].splice(0, ie[t].length);
        return (ie.fastTime = !1), se;
    };
    se.setFastTime = function (t) {
        return arguments.length ? (ie.fastTime = t) : (ie.fastTime = !0), se;
    };
    pc.exports = se;
});
var mc = c(De => {
    "use strict";
    Object.defineProperty(De, "__esModule", {value: !0});
    De.globalInfo = De.globalWarn = void 0;
    var ri = qt();
    ri.setFastTime();
    De.default = ri("pnpm");
    var bc = ri("pnpm:global");
    function fy(e) {
        bc.warn(e);
    }
    De.globalWarn = fy;
    function hy(e) {
        bc.info(e);
    }
    De.globalInfo = hy;
});
var ni = c((u1, vc) => {
    vc.exports = require("stream");
});
var Oc = c((l1, wc) => {
    "use strict";
    function Ec(e, t) {
        var r = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
            var n = Object.getOwnPropertySymbols(e);
            t &&
                (n = n.filter(function (i) {
                    return Object.getOwnPropertyDescriptor(e, i).enumerable;
                })),
                r.push.apply(r, n);
        }
        return r;
    }
    function dy(e) {
        for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t] != null ? arguments[t] : {};
            t % 2
                ? Ec(Object(r), !0).forEach(function (n) {
                      py(e, n, r[n]);
                  })
                : Object.getOwnPropertyDescriptors
                ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
                : Ec(Object(r)).forEach(function (n) {
                      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
                  });
        }
        return e;
    }
    function py(e, t, r) {
        return t in e ? Object.defineProperty(e, t, {value: r, enumerable: !0, configurable: !0, writable: !0}) : (e[t] = r), e;
    }
    function gy(e, t) {
        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
    }
    function _c(e, t) {
        for (var r = 0; r < t.length; r++) {
            var n = t[r];
            (n.enumerable = n.enumerable || !1), (n.configurable = !0), "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n);
        }
    }
    function yy(e, t, r) {
        return t && _c(e.prototype, t), r && _c(e, r), e;
    }
    var by = require("buffer"),
        Ir = by.Buffer,
        my = require("util"),
        ii = my.inspect,
        vy = (ii && ii.custom) || "inspect";
    function Ey(e, t, r) {
        Ir.prototype.copy.call(e, t, r);
    }
    wc.exports = (function () {
        function e() {
            gy(this, e), (this.head = null), (this.tail = null), (this.length = 0);
        }
        return (
            yy(e, [
                {
                    key: "push",
                    value: function (r) {
                        var n = {data: r, next: null};
                        this.length > 0 ? (this.tail.next = n) : (this.head = n), (this.tail = n), ++this.length;
                    },
                },
                {
                    key: "unshift",
                    value: function (r) {
                        var n = {data: r, next: this.head};
                        this.length === 0 && (this.tail = n), (this.head = n), ++this.length;
                    },
                },
                {
                    key: "shift",
                    value: function () {
                        if (this.length !== 0) {
                            var r = this.head.data;
                            return this.length === 1 ? (this.head = this.tail = null) : (this.head = this.head.next), --this.length, r;
                        }
                    },
                },
                {
                    key: "clear",
                    value: function () {
                        (this.head = this.tail = null), (this.length = 0);
                    },
                },
                {
                    key: "join",
                    value: function (r) {
                        if (this.length === 0) return "";
                        for (var n = this.head, i = "" + n.data; (n = n.next); ) i += r + n.data;
                        return i;
                    },
                },
                {
                    key: "concat",
                    value: function (r) {
                        if (this.length === 0) return Ir.alloc(0);
                        for (var n = Ir.allocUnsafe(r >>> 0), i = this.head, s = 0; i; ) Ey(i.data, n, s), (s += i.data.length), (i = i.next);
                        return n;
                    },
                },
                {
                    key: "consume",
                    value: function (r, n) {
                        var i;
                        return (
                            r < this.head.data.length
                                ? ((i = this.head.data.slice(0, r)), (this.head.data = this.head.data.slice(r)))
                                : r === this.head.data.length
                                ? (i = this.shift())
                                : (i = n ? this._getString(r) : this._getBuffer(r)),
                            i
                        );
                    },
                },
                {
                    key: "first",
                    value: function () {
                        return this.head.data;
                    },
                },
                {
                    key: "_getString",
                    value: function (r) {
                        var n = this.head,
                            i = 1,
                            s = n.data;
                        for (r -= s.length; (n = n.next); ) {
                            var o = n.data,
                                a = r > o.length ? o.length : r;
                            if ((a === o.length ? (s += o) : (s += o.slice(0, r)), (r -= a), r === 0)) {
                                a === o.length ? (++i, n.next ? (this.head = n.next) : (this.head = this.tail = null)) : ((this.head = n), (n.data = o.slice(a)));
                                break;
                            }
                            ++i;
                        }
                        return (this.length -= i), s;
                    },
                },
                {
                    key: "_getBuffer",
                    value: function (r) {
                        var n = Ir.allocUnsafe(r),
                            i = this.head,
                            s = 1;
                        for (i.data.copy(n), r -= i.data.length; (i = i.next); ) {
                            var o = i.data,
                                a = r > o.length ? o.length : r;
                            if ((o.copy(n, n.length - r, 0, a), (r -= a), r === 0)) {
                                a === o.length ? (++s, i.next ? (this.head = i.next) : (this.head = this.tail = null)) : ((this.head = i), (i.data = o.slice(a)));
                                break;
                            }
                            ++s;
                        }
                        return (this.length -= s), n;
                    },
                },
                {
                    key: vy,
                    value: function (r, n) {
                        return ii(this, dy({}, n, {depth: 0, customInspect: !1}));
                    },
                },
            ]),
            e
        );
    })();
});
var oi = c((c1, Sc) => {
    "use strict";
    function _y(e, t) {
        var r = this,
            n = this._readableState && this._readableState.destroyed,
            i = this._writableState && this._writableState.destroyed;
        return n || i
            ? (t ? t(e) : e && (this._writableState ? this._writableState.errorEmitted || ((this._writableState.errorEmitted = !0), process.nextTick(si, this, e)) : process.nextTick(si, this, e)),
              this)
            : (this._readableState && (this._readableState.destroyed = !0),
              this._writableState && (this._writableState.destroyed = !0),
              this._destroy(e || null, function (s) {
                  !t && s
                      ? r._writableState
                          ? r._writableState.errorEmitted
                              ? process.nextTick(Pr, r)
                              : ((r._writableState.errorEmitted = !0), process.nextTick(Rc, r, s))
                          : process.nextTick(Rc, r, s)
                      : t
                      ? (process.nextTick(Pr, r), t(s))
                      : process.nextTick(Pr, r);
              }),
              this);
    }
    function Rc(e, t) {
        si(e, t), Pr(e);
    }
    function Pr(e) {
        (e._writableState && !e._writableState.emitClose) || (e._readableState && !e._readableState.emitClose) || e.emit("close");
    }
    function wy() {
        this._readableState && ((this._readableState.destroyed = !1), (this._readableState.reading = !1), (this._readableState.ended = !1), (this._readableState.endEmitted = !1)),
            this._writableState &&
                ((this._writableState.destroyed = !1),
                (this._writableState.ended = !1),
                (this._writableState.ending = !1),
                (this._writableState.finalCalled = !1),
                (this._writableState.prefinished = !1),
                (this._writableState.finished = !1),
                (this._writableState.errorEmitted = !1));
    }
    function si(e, t) {
        e.emit("error", t);
    }
    function Oy(e, t) {
        var r = e._readableState,
            n = e._writableState;
        (r && r.autoDestroy) || (n && n.autoDestroy) ? e.destroy(t) : e.emit("error", t);
    }
    Sc.exports = {destroy: _y, undestroy: wy, errorOrDestroy: Oy};
});
var we = c((f1, Ac) => {
    "use strict";
    var Tc = {};
    function J(e, t, r) {
        r || (r = Error);
        function n(s, o, a) {
            return typeof t == "string" ? t : t(s, o, a);
        }
        class i extends r {
            constructor(o, a, u) {
                super(n(o, a, u));
            }
        }
        (i.prototype.name = r.name), (i.prototype.code = e), (Tc[e] = i);
    }
    function xc(e, t) {
        if (Array.isArray(e)) {
            let r = e.length;
            return (e = e.map(n => String(n))), r > 2 ? `one of ${t} ${e.slice(0, r - 1).join(", ")}, or ` + e[r - 1] : r === 2 ? `one of ${t} ${e[0]} or ${e[1]}` : `of ${t} ${e[0]}`;
        } else return `of ${t} ${String(e)}`;
    }
    function Ry(e, t, r) {
        return e.substr(!r || r < 0 ? 0 : +r, t.length) === t;
    }
    function Sy(e, t, r) {
        return (r === void 0 || r > e.length) && (r = e.length), e.substring(r - t.length, r) === t;
    }
    function xy(e, t, r) {
        return typeof r != "number" && (r = 0), r + t.length > e.length ? !1 : e.indexOf(t, r) !== -1;
    }
    J(
        "ERR_INVALID_OPT_VALUE",
        function (e, t) {
            return 'The value "' + t + '" is invalid for option "' + e + '"';
        },
        TypeError
    );
    J(
        "ERR_INVALID_ARG_TYPE",
        function (e, t, r) {
            let n;
            typeof t == "string" && Ry(t, "not ") ? ((n = "must not be"), (t = t.replace(/^not /, ""))) : (n = "must be");
            let i;
            if (Sy(e, " argument")) i = `The ${e} ${n} ${xc(t, "type")}`;
            else {
                let s = xy(e, ".") ? "property" : "argument";
                i = `The "${e}" ${s} ${n} ${xc(t, "type")}`;
            }
            return (i += `. Received type ${typeof r}`), i;
        },
        TypeError
    );
    J("ERR_STREAM_PUSH_AFTER_EOF", "stream.push() after EOF");
    J("ERR_METHOD_NOT_IMPLEMENTED", function (e) {
        return "The " + e + " method is not implemented";
    });
    J("ERR_STREAM_PREMATURE_CLOSE", "Premature close");
    J("ERR_STREAM_DESTROYED", function (e) {
        return "Cannot call " + e + " after a stream was destroyed";
    });
    J("ERR_MULTIPLE_CALLBACK", "Callback called multiple times");
    J("ERR_STREAM_CANNOT_PIPE", "Cannot pipe, not readable");
    J("ERR_STREAM_WRITE_AFTER_END", "write after end");
    J("ERR_STREAM_NULL_VALUES", "May not write null values to stream", TypeError);
    J(
        "ERR_UNKNOWN_ENCODING",
        function (e) {
            return "Unknown encoding: " + e;
        },
        TypeError
    );
    J("ERR_STREAM_UNSHIFT_AFTER_END_EVENT", "stream.unshift() after end event");
    Ac.exports.codes = Tc;
});
var ai = c((h1, Ic) => {
    "use strict";
    var Ty = we().codes.ERR_INVALID_OPT_VALUE;
    function Ay(e, t, r) {
        return e.highWaterMark != null ? e.highWaterMark : t ? e[r] : null;
    }
    function Iy(e, t, r, n) {
        var i = Ay(t, n, r);
        if (i != null) {
            if (!(isFinite(i) && Math.floor(i) === i) || i < 0) {
                var s = n ? r : "highWaterMark";
                throw new Ty(s, i);
            }
            return Math.floor(i);
        }
        return e.objectMode ? 16 : 16 * 1024;
    }
    Ic.exports = {getHighWaterMark: Iy};
});
var Pc = c((d1, ui) => {
    typeof Object.create == "function"
        ? (ui.exports = function (t, r) {
              r && ((t.super_ = r), (t.prototype = Object.create(r.prototype, {constructor: {value: t, enumerable: !1, writable: !0, configurable: !0}})));
          })
        : (ui.exports = function (t, r) {
              if (r) {
                  t.super_ = r;
                  var n = function () {};
                  (n.prototype = r.prototype), (t.prototype = new n()), (t.prototype.constructor = t);
              }
          });
});
var st = c((p1, ci) => {
    try {
        if (((li = require("util")), typeof li.inherits != "function")) throw "";
        ci.exports = li.inherits;
    } catch {
        ci.exports = Pc();
    }
    var li;
});
var qc = c((g1, Nc) => {
    Nc.exports = require("util").deprecate;
});
var di = c((y1, Dc) => {
    "use strict";
    Dc.exports = P;
    function Mc(e) {
        var t = this;
        (this.next = null),
            (this.entry = null),
            (this.finish = function () {
                rb(t, e);
            });
    }
    var ot;
    P.WritableState = Mt;
    var Py = {deprecate: qc()},
        $c = ni(),
        qr = require("buffer").Buffer,
        Ny = global.Uint8Array || function () {};
    function qy(e) {
        return qr.from(e);
    }
    function Ly(e) {
        return qr.isBuffer(e) || e instanceof Ny;
    }
    var hi = oi(),
        My = ai(),
        $y = My.getHighWaterMark,
        Oe = we().codes,
        jy = Oe.ERR_INVALID_ARG_TYPE,
        Cy = Oe.ERR_METHOD_NOT_IMPLEMENTED,
        Dy = Oe.ERR_MULTIPLE_CALLBACK,
        Fy = Oe.ERR_STREAM_CANNOT_PIPE,
        ky = Oe.ERR_STREAM_DESTROYED,
        By = Oe.ERR_STREAM_NULL_VALUES,
        Gy = Oe.ERR_STREAM_WRITE_AFTER_END,
        Uy = Oe.ERR_UNKNOWN_ENCODING,
        at = hi.errorOrDestroy;
    st()(P, $c);
    function Wy() {}
    function Mt(e, t, r) {
        (ot = ot || Fe()),
            (e = e || {}),
            typeof r != "boolean" && (r = t instanceof ot),
            (this.objectMode = !!e.objectMode),
            r && (this.objectMode = this.objectMode || !!e.writableObjectMode),
            (this.highWaterMark = $y(this, e, "writableHighWaterMark", r)),
            (this.finalCalled = !1),
            (this.needDrain = !1),
            (this.ending = !1),
            (this.ended = !1),
            (this.finished = !1),
            (this.destroyed = !1);
        var n = e.decodeStrings === !1;
        (this.decodeStrings = !n),
            (this.defaultEncoding = e.defaultEncoding || "utf8"),
            (this.length = 0),
            (this.writing = !1),
            (this.corked = 0),
            (this.sync = !0),
            (this.bufferProcessing = !1),
            (this.onwrite = function (i) {
                Jy(t, i);
            }),
            (this.writecb = null),
            (this.writelen = 0),
            (this.bufferedRequest = null),
            (this.lastBufferedRequest = null),
            (this.pendingcb = 0),
            (this.prefinished = !1),
            (this.errorEmitted = !1),
            (this.emitClose = e.emitClose !== !1),
            (this.autoDestroy = !!e.autoDestroy),
            (this.bufferedRequestCount = 0),
            (this.corkedRequestsFree = new Mc(this));
    }
    Mt.prototype.getBuffer = function () {
        for (var t = this.bufferedRequest, r = []; t; ) r.push(t), (t = t.next);
        return r;
    };
    (function () {
        try {
            Object.defineProperty(Mt.prototype, "buffer", {
                get: Py.deprecate(
                    function () {
                        return this.getBuffer();
                    },
                    "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.",
                    "DEP0003"
                ),
            });
        } catch {}
    })();
    var Nr;
    typeof Symbol == "function" && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] == "function"
        ? ((Nr = Function.prototype[Symbol.hasInstance]),
          Object.defineProperty(P, Symbol.hasInstance, {
              value: function (t) {
                  return Nr.call(this, t) ? !0 : this !== P ? !1 : t && t._writableState instanceof Mt;
              },
          }))
        : (Nr = function (t) {
              return t instanceof this;
          });
    function P(e) {
        ot = ot || Fe();
        var t = this instanceof ot;
        if (!t && !Nr.call(P, this)) return new P(e);
        (this._writableState = new Mt(e, this, t)),
            (this.writable = !0),
            e &&
                (typeof e.write == "function" && (this._write = e.write),
                typeof e.writev == "function" && (this._writev = e.writev),
                typeof e.destroy == "function" && (this._destroy = e.destroy),
                typeof e.final == "function" && (this._final = e.final)),
            $c.call(this);
    }
    P.prototype.pipe = function () {
        at(this, new Fy());
    };
    function Vy(e, t) {
        var r = new Gy();
        at(e, r), process.nextTick(t, r);
    }
    function Hy(e, t, r, n) {
        var i;
        return r === null ? (i = new By()) : typeof r != "string" && !t.objectMode && (i = new jy("chunk", ["string", "Buffer"], r)), i ? (at(e, i), process.nextTick(n, i), !1) : !0;
    }
    P.prototype.write = function (e, t, r) {
        var n = this._writableState,
            i = !1,
            s = !n.objectMode && Ly(e);
        return (
            s && !qr.isBuffer(e) && (e = qy(e)),
            typeof t == "function" && ((r = t), (t = null)),
            s ? (t = "buffer") : t || (t = n.defaultEncoding),
            typeof r != "function" && (r = Wy),
            n.ending ? Vy(this, r) : (s || Hy(this, n, e, r)) && (n.pendingcb++, (i = zy(this, n, s, e, t, r))),
            i
        );
    };
    P.prototype.cork = function () {
        this._writableState.corked++;
    };
    P.prototype.uncork = function () {
        var e = this._writableState;
        e.corked && (e.corked--, !e.writing && !e.corked && !e.bufferProcessing && e.bufferedRequest && jc(this, e));
    };
    P.prototype.setDefaultEncoding = function (t) {
        if (
            (typeof t == "string" && (t = t.toLowerCase()),
            !(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((t + "").toLowerCase()) > -1))
        )
            throw new Uy(t);
        return (this._writableState.defaultEncoding = t), this;
    };
    Object.defineProperty(P.prototype, "writableBuffer", {
        enumerable: !1,
        get: function () {
            return this._writableState && this._writableState.getBuffer();
        },
    });
    function Xy(e, t, r) {
        return !e.objectMode && e.decodeStrings !== !1 && typeof t == "string" && (t = qr.from(t, r)), t;
    }
    Object.defineProperty(P.prototype, "writableHighWaterMark", {
        enumerable: !1,
        get: function () {
            return this._writableState.highWaterMark;
        },
    });
    function zy(e, t, r, n, i, s) {
        if (!r) {
            var o = Xy(t, n, i);
            n !== o && ((r = !0), (i = "buffer"), (n = o));
        }
        var a = t.objectMode ? 1 : n.length;
        t.length += a;
        var u = t.length < t.highWaterMark;
        if ((u || (t.needDrain = !0), t.writing || t.corked)) {
            var l = t.lastBufferedRequest;
            (t.lastBufferedRequest = {chunk: n, encoding: i, isBuf: r, callback: s, next: null}),
                l ? (l.next = t.lastBufferedRequest) : (t.bufferedRequest = t.lastBufferedRequest),
                (t.bufferedRequestCount += 1);
        } else fi(e, t, !1, a, n, i, s);
        return u;
    }
    function fi(e, t, r, n, i, s, o) {
        (t.writelen = n), (t.writecb = o), (t.writing = !0), (t.sync = !0), t.destroyed ? t.onwrite(new ky("write")) : r ? e._writev(i, t.onwrite) : e._write(i, s, t.onwrite), (t.sync = !1);
    }
    function Ky(e, t, r, n, i) {
        --t.pendingcb, r ? (process.nextTick(i, n), process.nextTick(Lt, e, t), (e._writableState.errorEmitted = !0), at(e, n)) : (i(n), (e._writableState.errorEmitted = !0), at(e, n), Lt(e, t));
    }
    function Yy(e) {
        (e.writing = !1), (e.writecb = null), (e.length -= e.writelen), (e.writelen = 0);
    }
    function Jy(e, t) {
        var r = e._writableState,
            n = r.sync,
            i = r.writecb;
        if (typeof i != "function") throw new Dy();
        if ((Yy(r), t)) Ky(e, r, n, t, i);
        else {
            var s = Cc(r) || e.destroyed;
            !s && !r.corked && !r.bufferProcessing && r.bufferedRequest && jc(e, r), n ? process.nextTick(Lc, e, r, s, i) : Lc(e, r, s, i);
        }
    }
    function Lc(e, t, r, n) {
        r || Zy(e, t), t.pendingcb--, n(), Lt(e, t);
    }
    function Zy(e, t) {
        t.length === 0 && t.needDrain && ((t.needDrain = !1), e.emit("drain"));
    }
    function jc(e, t) {
        t.bufferProcessing = !0;
        var r = t.bufferedRequest;
        if (e._writev && r && r.next) {
            var n = t.bufferedRequestCount,
                i = new Array(n),
                s = t.corkedRequestsFree;
            s.entry = r;
            for (var o = 0, a = !0; r; ) (i[o] = r), r.isBuf || (a = !1), (r = r.next), (o += 1);
            (i.allBuffers = a),
                fi(e, t, !0, t.length, i, "", s.finish),
                t.pendingcb++,
                (t.lastBufferedRequest = null),
                s.next ? ((t.corkedRequestsFree = s.next), (s.next = null)) : (t.corkedRequestsFree = new Mc(t)),
                (t.bufferedRequestCount = 0);
        } else {
            for (; r; ) {
                var u = r.chunk,
                    l = r.encoding,
                    f = r.callback,
                    h = t.objectMode ? 1 : u.length;
                if ((fi(e, t, !1, h, u, l, f), (r = r.next), t.bufferedRequestCount--, t.writing)) break;
            }
            r === null && (t.lastBufferedRequest = null);
        }
        (t.bufferedRequest = r), (t.bufferProcessing = !1);
    }
    P.prototype._write = function (e, t, r) {
        r(new Cy("_write()"));
    };
    P.prototype._writev = null;
    P.prototype.end = function (e, t, r) {
        var n = this._writableState;
        return (
            typeof e == "function" ? ((r = e), (e = null), (t = null)) : typeof t == "function" && ((r = t), (t = null)),
            e != null && this.write(e, t),
            n.corked && ((n.corked = 1), this.uncork()),
            n.ending || tb(this, n, r),
            this
        );
    };
    Object.defineProperty(P.prototype, "writableLength", {
        enumerable: !1,
        get: function () {
            return this._writableState.length;
        },
    });
    function Cc(e) {
        return e.ending && e.length === 0 && e.bufferedRequest === null && !e.finished && !e.writing;
    }
    function Qy(e, t) {
        e._final(function (r) {
            t.pendingcb--, r && at(e, r), (t.prefinished = !0), e.emit("prefinish"), Lt(e, t);
        });
    }
    function eb(e, t) {
        !t.prefinished &&
            !t.finalCalled &&
            (typeof e._final == "function" && !t.destroyed ? (t.pendingcb++, (t.finalCalled = !0), process.nextTick(Qy, e, t)) : ((t.prefinished = !0), e.emit("prefinish")));
    }
    function Lt(e, t) {
        var r = Cc(t);
        if (r && (eb(e, t), t.pendingcb === 0 && ((t.finished = !0), e.emit("finish"), t.autoDestroy))) {
            var n = e._readableState;
            (!n || (n.autoDestroy && n.endEmitted)) && e.destroy();
        }
        return r;
    }
    function tb(e, t, r) {
        (t.ending = !0), Lt(e, t), r && (t.finished ? process.nextTick(r) : e.once("finish", r)), (t.ended = !0), (e.writable = !1);
    }
    function rb(e, t, r) {
        var n = e.entry;
        for (e.entry = null; n; ) {
            var i = n.callback;
            t.pendingcb--, i(r), (n = n.next);
        }
        t.corkedRequestsFree.next = e;
    }
    Object.defineProperty(P.prototype, "destroyed", {
        enumerable: !1,
        get: function () {
            return this._writableState === void 0 ? !1 : this._writableState.destroyed;
        },
        set: function (t) {
            !this._writableState || (this._writableState.destroyed = t);
        },
    });
    P.prototype.destroy = hi.destroy;
    P.prototype._undestroy = hi.undestroy;
    P.prototype._destroy = function (e, t) {
        t(e);
    };
});
var Fe = c((b1, kc) => {
    "use strict";
    var nb =
        Object.keys ||
        function (e) {
            var t = [];
            for (var r in e) t.push(r);
            return t;
        };
    kc.exports = oe;
    var Fc = yi(),
        gi = di();
    st()(oe, Fc);
    for (pi = nb(gi.prototype), Lr = 0; Lr < pi.length; Lr++) (Mr = pi[Lr]), oe.prototype[Mr] || (oe.prototype[Mr] = gi.prototype[Mr]);
    var pi, Mr, Lr;
    function oe(e) {
        if (!(this instanceof oe)) return new oe(e);
        Fc.call(this, e),
            gi.call(this, e),
            (this.allowHalfOpen = !0),
            e && (e.readable === !1 && (this.readable = !1), e.writable === !1 && (this.writable = !1), e.allowHalfOpen === !1 && ((this.allowHalfOpen = !1), this.once("end", ib)));
    }
    Object.defineProperty(oe.prototype, "writableHighWaterMark", {
        enumerable: !1,
        get: function () {
            return this._writableState.highWaterMark;
        },
    });
    Object.defineProperty(oe.prototype, "writableBuffer", {
        enumerable: !1,
        get: function () {
            return this._writableState && this._writableState.getBuffer();
        },
    });
    Object.defineProperty(oe.prototype, "writableLength", {
        enumerable: !1,
        get: function () {
            return this._writableState.length;
        },
    });
    function ib() {
        this._writableState.ended || process.nextTick(sb, this);
    }
    function sb(e) {
        e.end();
    }
    Object.defineProperty(oe.prototype, "destroyed", {
        enumerable: !1,
        get: function () {
            return this._readableState === void 0 || this._writableState === void 0 ? !1 : this._readableState.destroyed && this._writableState.destroyed;
        },
        set: function (t) {
            this._readableState === void 0 || this._writableState === void 0 || ((this._readableState.destroyed = t), (this._writableState.destroyed = t));
        },
    });
});
var Uc = c((bi, Gc) => {
    var $r = require("buffer"),
        ae = $r.Buffer;
    function Bc(e, t) {
        for (var r in e) t[r] = e[r];
    }
    ae.from && ae.alloc && ae.allocUnsafe && ae.allocUnsafeSlow ? (Gc.exports = $r) : (Bc($r, bi), (bi.Buffer = ke));
    function ke(e, t, r) {
        return ae(e, t, r);
    }
    ke.prototype = Object.create(ae.prototype);
    Bc(ae, ke);
    ke.from = function (e, t, r) {
        if (typeof e == "number") throw new TypeError("Argument must not be a number");
        return ae(e, t, r);
    };
    ke.alloc = function (e, t, r) {
        if (typeof e != "number") throw new TypeError("Argument must be a number");
        var n = ae(e);
        return t !== void 0 ? (typeof r == "string" ? n.fill(t, r) : n.fill(t)) : n.fill(0), n;
    };
    ke.allocUnsafe = function (e) {
        if (typeof e != "number") throw new TypeError("Argument must be a number");
        return ae(e);
    };
    ke.allocUnsafeSlow = function (e) {
        if (typeof e != "number") throw new TypeError("Argument must be a number");
        return $r.SlowBuffer(e);
    };
});
var Ei = c(Vc => {
    "use strict";
    var vi = Uc().Buffer,
        Wc =
            vi.isEncoding ||
            function (e) {
                switch (((e = "" + e), e && e.toLowerCase())) {
                    case "hex":
                    case "utf8":
                    case "utf-8":
                    case "ascii":
                    case "binary":
                    case "base64":
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                    case "raw":
                        return !0;
                    default:
                        return !1;
                }
            };
    function ob(e) {
        if (!e) return "utf8";
        for (var t; ; )
            switch (e) {
                case "utf8":
                case "utf-8":
                    return "utf8";
                case "ucs2":
                case "ucs-2":
                case "utf16le":
                case "utf-16le":
                    return "utf16le";
                case "latin1":
                case "binary":
                    return "latin1";
                case "base64":
                case "ascii":
                case "hex":
                    return e;
                default:
                    if (t) return;
                    (e = ("" + e).toLowerCase()), (t = !0);
            }
    }
    function ab(e) {
        var t = ob(e);
        if (typeof t != "string" && (vi.isEncoding === Wc || !Wc(e))) throw new Error("Unknown encoding: " + e);
        return t || e;
    }
    Vc.StringDecoder = $t;
    function $t(e) {
        this.encoding = ab(e);
        var t;
        switch (this.encoding) {
            case "utf16le":
                (this.text = db), (this.end = pb), (t = 4);
                break;
            case "utf8":
                (this.fillLast = cb), (t = 4);
                break;
            case "base64":
                (this.text = gb), (this.end = yb), (t = 3);
                break;
            default:
                (this.write = bb), (this.end = mb);
                return;
        }
        (this.lastNeed = 0), (this.lastTotal = 0), (this.lastChar = vi.allocUnsafe(t));
    }
    $t.prototype.write = function (e) {
        if (e.length === 0) return "";
        var t, r;
        if (this.lastNeed) {
            if (((t = this.fillLast(e)), t === void 0)) return "";
            (r = this.lastNeed), (this.lastNeed = 0);
        } else r = 0;
        return r < e.length ? (t ? t + this.text(e, r) : this.text(e, r)) : t || "";
    };
    $t.prototype.end = hb;
    $t.prototype.text = fb;
    $t.prototype.fillLast = function (e) {
        if (this.lastNeed <= e.length) return e.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal);
        e.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, e.length), (this.lastNeed -= e.length);
    };
    function mi(e) {
        return e <= 127 ? 0 : e >> 5 === 6 ? 2 : e >> 4 === 14 ? 3 : e >> 3 === 30 ? 4 : e >> 6 === 2 ? -1 : -2;
    }
    function ub(e, t, r) {
        var n = t.length - 1;
        if (n < r) return 0;
        var i = mi(t[n]);
        return i >= 0
            ? (i > 0 && (e.lastNeed = i - 1), i)
            : --n < r || i === -2
            ? 0
            : ((i = mi(t[n])), i >= 0 ? (i > 0 && (e.lastNeed = i - 2), i) : --n < r || i === -2 ? 0 : ((i = mi(t[n])), i >= 0 ? (i > 0 && (i === 2 ? (i = 0) : (e.lastNeed = i - 3)), i) : 0));
    }
    function lb(e, t, r) {
        if ((t[0] & 192) !== 128) return (e.lastNeed = 0), "\uFFFD";
        if (e.lastNeed > 1 && t.length > 1) {
            if ((t[1] & 192) !== 128) return (e.lastNeed = 1), "\uFFFD";
            if (e.lastNeed > 2 && t.length > 2 && (t[2] & 192) !== 128) return (e.lastNeed = 2), "\uFFFD";
        }
    }
    function cb(e) {
        var t = this.lastTotal - this.lastNeed,
            r = lb(this, e, t);
        if (r !== void 0) return r;
        if (this.lastNeed <= e.length) return e.copy(this.lastChar, t, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal);
        e.copy(this.lastChar, t, 0, e.length), (this.lastNeed -= e.length);
    }
    function fb(e, t) {
        var r = ub(this, e, t);
        if (!this.lastNeed) return e.toString("utf8", t);
        this.lastTotal = r;
        var n = e.length - (r - this.lastNeed);
        return e.copy(this.lastChar, 0, n), e.toString("utf8", t, n);
    }
    function hb(e) {
        var t = e && e.length ? this.write(e) : "";
        return this.lastNeed ? t + "\uFFFD" : t;
    }
    function db(e, t) {
        if ((e.length - t) % 2 === 0) {
            var r = e.toString("utf16le", t);
            if (r) {
                var n = r.charCodeAt(r.length - 1);
                if (n >= 55296 && n <= 56319) return (this.lastNeed = 2), (this.lastTotal = 4), (this.lastChar[0] = e[e.length - 2]), (this.lastChar[1] = e[e.length - 1]), r.slice(0, -1);
            }
            return r;
        }
        return (this.lastNeed = 1), (this.lastTotal = 2), (this.lastChar[0] = e[e.length - 1]), e.toString("utf16le", t, e.length - 1);
    }
    function pb(e) {
        var t = e && e.length ? this.write(e) : "";
        if (this.lastNeed) {
            var r = this.lastTotal - this.lastNeed;
            return t + this.lastChar.toString("utf16le", 0, r);
        }
        return t;
    }
    function gb(e, t) {
        var r = (e.length - t) % 3;
        return r === 0
            ? e.toString("base64", t)
            : ((this.lastNeed = 3 - r),
              (this.lastTotal = 3),
              r === 1 ? (this.lastChar[0] = e[e.length - 1]) : ((this.lastChar[0] = e[e.length - 2]), (this.lastChar[1] = e[e.length - 1])),
              e.toString("base64", t, e.length - r));
    }
    function yb(e) {
        var t = e && e.length ? this.write(e) : "";
        return this.lastNeed ? t + this.lastChar.toString("base64", 0, 3 - this.lastNeed) : t;
    }
    function bb(e) {
        return e.toString(this.encoding);
    }
    function mb(e) {
        return e && e.length ? this.write(e) : "";
    }
});
var jr = c((v1, zc) => {
    "use strict";
    var Hc = we().codes.ERR_STREAM_PREMATURE_CLOSE;
    function vb(e) {
        var t = !1;
        return function () {
            if (!t) {
                t = !0;
                for (var r = arguments.length, n = new Array(r), i = 0; i < r; i++) n[i] = arguments[i];
                e.apply(this, n);
            }
        };
    }
    function Eb() {}
    function _b(e) {
        return e.setHeader && typeof e.abort == "function";
    }
    function Xc(e, t, r) {
        if (typeof t == "function") return Xc(e, null, t);
        t || (t = {}), (r = vb(r || Eb));
        var n = t.readable || (t.readable !== !1 && e.readable),
            i = t.writable || (t.writable !== !1 && e.writable),
            s = function () {
                e.writable || a();
            },
            o = e._writableState && e._writableState.finished,
            a = function () {
                (i = !1), (o = !0), n || r.call(e);
            },
            u = e._readableState && e._readableState.endEmitted,
            l = function () {
                (n = !1), (u = !0), i || r.call(e);
            },
            f = function (m) {
                r.call(e, m);
            },
            h = function () {
                var m;
                if (n && !u) return (!e._readableState || !e._readableState.ended) && (m = new Hc()), r.call(e, m);
                if (i && !o) return (!e._writableState || !e._writableState.ended) && (m = new Hc()), r.call(e, m);
            },
            p = function () {
                e.req.on("finish", a);
            };
        return (
            _b(e) ? (e.on("complete", a), e.on("abort", h), e.req ? p() : e.on("request", p)) : i && !e._writableState && (e.on("end", s), e.on("close", s)),
            e.on("end", l),
            e.on("finish", a),
            t.error !== !1 && e.on("error", f),
            e.on("close", h),
            function () {
                e.removeListener("complete", a),
                    e.removeListener("abort", h),
                    e.removeListener("request", p),
                    e.req && e.req.removeListener("finish", a),
                    e.removeListener("end", s),
                    e.removeListener("close", s),
                    e.removeListener("finish", a),
                    e.removeListener("end", l),
                    e.removeListener("error", f),
                    e.removeListener("close", h);
            }
        );
    }
    zc.exports = Xc;
});
var Yc = c((E1, Kc) => {
    "use strict";
    var Cr;
    function Re(e, t, r) {
        return t in e ? Object.defineProperty(e, t, {value: r, enumerable: !0, configurable: !0, writable: !0}) : (e[t] = r), e;
    }
    var wb = jr(),
        Se = Symbol("lastResolve"),
        Be = Symbol("lastReject"),
        jt = Symbol("error"),
        Dr = Symbol("ended"),
        Ge = Symbol("lastPromise"),
        _i = Symbol("handlePromise"),
        Ue = Symbol("stream");
    function xe(e, t) {
        return {value: e, done: t};
    }
    function Ob(e) {
        var t = e[Se];
        if (t !== null) {
            var r = e[Ue].read();
            r !== null && ((e[Ge] = null), (e[Se] = null), (e[Be] = null), t(xe(r, !1)));
        }
    }
    function Rb(e) {
        process.nextTick(Ob, e);
    }
    function Sb(e, t) {
        return function (r, n) {
            e.then(function () {
                if (t[Dr]) {
                    r(xe(void 0, !0));
                    return;
                }
                t[_i](r, n);
            }, n);
        };
    }
    var xb = Object.getPrototypeOf(function () {}),
        Tb = Object.setPrototypeOf(
            ((Cr = {
                get stream() {
                    return this[Ue];
                },
                next: function () {
                    var t = this,
                        r = this[jt];
                    if (r !== null) return Promise.reject(r);
                    if (this[Dr]) return Promise.resolve(xe(void 0, !0));
                    if (this[Ue].destroyed)
                        return new Promise(function (o, a) {
                            process.nextTick(function () {
                                t[jt] ? a(t[jt]) : o(xe(void 0, !0));
                            });
                        });
                    var n = this[Ge],
                        i;
                    if (n) i = new Promise(Sb(n, this));
                    else {
                        var s = this[Ue].read();
                        if (s !== null) return Promise.resolve(xe(s, !1));
                        i = new Promise(this[_i]);
                    }
                    return (this[Ge] = i), i;
                },
            }),
            Re(Cr, Symbol.asyncIterator, function () {
                return this;
            }),
            Re(Cr, "return", function () {
                var t = this;
                return new Promise(function (r, n) {
                    t[Ue].destroy(null, function (i) {
                        if (i) {
                            n(i);
                            return;
                        }
                        r(xe(void 0, !0));
                    });
                });
            }),
            Cr),
            xb
        ),
        Ab = function (t) {
            var r,
                n = Object.create(
                    Tb,
                    ((r = {}),
                    Re(r, Ue, {value: t, writable: !0}),
                    Re(r, Se, {value: null, writable: !0}),
                    Re(r, Be, {value: null, writable: !0}),
                    Re(r, jt, {value: null, writable: !0}),
                    Re(r, Dr, {value: t._readableState.endEmitted, writable: !0}),
                    Re(r, _i, {
                        value: function (s, o) {
                            var a = n[Ue].read();
                            a ? ((n[Ge] = null), (n[Se] = null), (n[Be] = null), s(xe(a, !1))) : ((n[Se] = s), (n[Be] = o));
                        },
                        writable: !0,
                    }),
                    r)
                );
            return (
                (n[Ge] = null),
                wb(t, function (i) {
                    if (i && i.code !== "ERR_STREAM_PREMATURE_CLOSE") {
                        var s = n[Be];
                        s !== null && ((n[Ge] = null), (n[Se] = null), (n[Be] = null), s(i)), (n[jt] = i);
                        return;
                    }
                    var o = n[Se];
                    o !== null && ((n[Ge] = null), (n[Se] = null), (n[Be] = null), o(xe(void 0, !0))), (n[Dr] = !0);
                }),
                t.on("readable", Rb.bind(null, n)),
                n
            );
        };
    Kc.exports = Ab;
});
var ef = c((_1, Qc) => {
    "use strict";
    function Jc(e, t, r, n, i, s, o) {
        try {
            var a = e[s](o),
                u = a.value;
        } catch (l) {
            r(l);
            return;
        }
        a.done ? t(u) : Promise.resolve(u).then(n, i);
    }
    function Ib(e) {
        return function () {
            var t = this,
                r = arguments;
            return new Promise(function (n, i) {
                var s = e.apply(t, r);
                function o(u) {
                    Jc(s, n, i, o, a, "next", u);
                }
                function a(u) {
                    Jc(s, n, i, o, a, "throw", u);
                }
                o(void 0);
            });
        };
    }
    function Zc(e, t) {
        var r = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
            var n = Object.getOwnPropertySymbols(e);
            t &&
                (n = n.filter(function (i) {
                    return Object.getOwnPropertyDescriptor(e, i).enumerable;
                })),
                r.push.apply(r, n);
        }
        return r;
    }
    function Pb(e) {
        for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t] != null ? arguments[t] : {};
            t % 2
                ? Zc(Object(r), !0).forEach(function (n) {
                      Nb(e, n, r[n]);
                  })
                : Object.getOwnPropertyDescriptors
                ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
                : Zc(Object(r)).forEach(function (n) {
                      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
                  });
        }
        return e;
    }
    function Nb(e, t, r) {
        return t in e ? Object.defineProperty(e, t, {value: r, enumerable: !0, configurable: !0, writable: !0}) : (e[t] = r), e;
    }
    var qb = we().codes.ERR_INVALID_ARG_TYPE;
    function Lb(e, t, r) {
        var n;
        if (t && typeof t.next == "function") n = t;
        else if (t && t[Symbol.asyncIterator]) n = t[Symbol.asyncIterator]();
        else if (t && t[Symbol.iterator]) n = t[Symbol.iterator]();
        else throw new qb("iterable", ["Iterable"], t);
        var i = new e(Pb({objectMode: !0}, r)),
            s = !1;
        i._read = function () {
            s || ((s = !0), o());
        };
        function o() {
            return a.apply(this, arguments);
        }
        function a() {
            return (
                (a = Ib(function* () {
                    try {
                        var u = yield n.next(),
                            l = u.value,
                            f = u.done;
                        f ? i.push(null) : i.push(yield l) ? o() : (s = !1);
                    } catch (h) {
                        i.destroy(h);
                    }
                })),
                a.apply(this, arguments)
            );
        }
        return i;
    }
    Qc.exports = Lb;
});
var yi = c((O1, ff) => {
    "use strict";
    ff.exports = w;
    var ut;
    w.ReadableState = sf;
    var w1 = require("events").EventEmitter,
        nf = function (t, r) {
            return t.listeners(r).length;
        },
        Dt = ni(),
        Fr = require("buffer").Buffer,
        Mb = global.Uint8Array || function () {};
    function $b(e) {
        return Fr.from(e);
    }
    function jb(e) {
        return Fr.isBuffer(e) || e instanceof Mb;
    }
    var wi = require("util"),
        _;
    wi && wi.debuglog ? (_ = wi.debuglog("stream")) : (_ = function () {});
    var Cb = Oc(),
        Ii = oi(),
        Db = ai(),
        Fb = Db.getHighWaterMark,
        kr = we().codes,
        kb = kr.ERR_INVALID_ARG_TYPE,
        Bb = kr.ERR_STREAM_PUSH_AFTER_EOF,
        Gb = kr.ERR_METHOD_NOT_IMPLEMENTED,
        Ub = kr.ERR_STREAM_UNSHIFT_AFTER_END_EVENT,
        lt,
        Oi,
        Ri;
    st()(w, Dt);
    var Ct = Ii.errorOrDestroy,
        Si = ["error", "close", "destroy", "pause", "resume"];
    function Wb(e, t, r) {
        if (typeof e.prependListener == "function") return e.prependListener(t, r);
        !e._events || !e._events[t] ? e.on(t, r) : Array.isArray(e._events[t]) ? e._events[t].unshift(r) : (e._events[t] = [r, e._events[t]]);
    }
    function sf(e, t, r) {
        (ut = ut || Fe()),
            (e = e || {}),
            typeof r != "boolean" && (r = t instanceof ut),
            (this.objectMode = !!e.objectMode),
            r && (this.objectMode = this.objectMode || !!e.readableObjectMode),
            (this.highWaterMark = Fb(this, e, "readableHighWaterMark", r)),
            (this.buffer = new Cb()),
            (this.length = 0),
            (this.pipes = null),
            (this.pipesCount = 0),
            (this.flowing = null),
            (this.ended = !1),
            (this.endEmitted = !1),
            (this.reading = !1),
            (this.sync = !0),
            (this.needReadable = !1),
            (this.emittedReadable = !1),
            (this.readableListening = !1),
            (this.resumeScheduled = !1),
            (this.paused = !0),
            (this.emitClose = e.emitClose !== !1),
            (this.autoDestroy = !!e.autoDestroy),
            (this.destroyed = !1),
            (this.defaultEncoding = e.defaultEncoding || "utf8"),
            (this.awaitDrain = 0),
            (this.readingMore = !1),
            (this.decoder = null),
            (this.encoding = null),
            e.encoding && (lt || (lt = Ei().StringDecoder), (this.decoder = new lt(e.encoding)), (this.encoding = e.encoding));
    }
    function w(e) {
        if (((ut = ut || Fe()), !(this instanceof w))) return new w(e);
        var t = this instanceof ut;
        (this._readableState = new sf(e, this, t)),
            (this.readable = !0),
            e && (typeof e.read == "function" && (this._read = e.read), typeof e.destroy == "function" && (this._destroy = e.destroy)),
            Dt.call(this);
    }
    Object.defineProperty(w.prototype, "destroyed", {
        enumerable: !1,
        get: function () {
            return this._readableState === void 0 ? !1 : this._readableState.destroyed;
        },
        set: function (t) {
            !this._readableState || (this._readableState.destroyed = t);
        },
    });
    w.prototype.destroy = Ii.destroy;
    w.prototype._undestroy = Ii.undestroy;
    w.prototype._destroy = function (e, t) {
        t(e);
    };
    w.prototype.push = function (e, t) {
        var r = this._readableState,
            n;
        return r.objectMode ? (n = !0) : typeof e == "string" && ((t = t || r.defaultEncoding), t !== r.encoding && ((e = Fr.from(e, t)), (t = "")), (n = !0)), of(this, e, t, !1, n);
    };
    w.prototype.unshift = function (e) {
        return of(this, e, null, !0, !1);
    };
    function of(e, t, r, n, i) {
        _("readableAddChunk", t);
        var s = e._readableState;
        if (t === null) (s.reading = !1), Xb(e, s);
        else {
            var o;
            if ((i || (o = Vb(s, t)), o)) Ct(e, o);
            else if (s.objectMode || (t && t.length > 0))
                if ((typeof t != "string" && !s.objectMode && Object.getPrototypeOf(t) !== Fr.prototype && (t = $b(t)), n)) s.endEmitted ? Ct(e, new Ub()) : xi(e, s, t, !0);
                else if (s.ended) Ct(e, new Bb());
                else {
                    if (s.destroyed) return !1;
                    (s.reading = !1), s.decoder && !r ? ((t = s.decoder.write(t)), s.objectMode || t.length !== 0 ? xi(e, s, t, !1) : Ai(e, s)) : xi(e, s, t, !1);
                }
            else n || ((s.reading = !1), Ai(e, s));
        }
        return !s.ended && (s.length < s.highWaterMark || s.length === 0);
    }
    function xi(e, t, r, n) {
        t.flowing && t.length === 0 && !t.sync
            ? ((t.awaitDrain = 0), e.emit("data", r))
            : ((t.length += t.objectMode ? 1 : r.length), n ? t.buffer.unshift(r) : t.buffer.push(r), t.needReadable && Br(e)),
            Ai(e, t);
    }
    function Vb(e, t) {
        var r;
        return !jb(t) && typeof t != "string" && t !== void 0 && !e.objectMode && (r = new kb("chunk", ["string", "Buffer", "Uint8Array"], t)), r;
    }
    w.prototype.isPaused = function () {
        return this._readableState.flowing === !1;
    };
    w.prototype.setEncoding = function (e) {
        lt || (lt = Ei().StringDecoder);
        var t = new lt(e);
        (this._readableState.decoder = t), (this._readableState.encoding = this._readableState.decoder.encoding);
        for (var r = this._readableState.buffer.head, n = ""; r !== null; ) (n += t.write(r.data)), (r = r.next);
        return this._readableState.buffer.clear(), n !== "" && this._readableState.buffer.push(n), (this._readableState.length = n.length), this;
    };
    var tf = 1073741824;
    function Hb(e) {
        return e >= tf ? (e = tf) : (e--, (e |= e >>> 1), (e |= e >>> 2), (e |= e >>> 4), (e |= e >>> 8), (e |= e >>> 16), e++), e;
    }
    function rf(e, t) {
        return e <= 0 || (t.length === 0 && t.ended)
            ? 0
            : t.objectMode
            ? 1
            : e !== e
            ? t.flowing && t.length
                ? t.buffer.head.data.length
                : t.length
            : (e > t.highWaterMark && (t.highWaterMark = Hb(e)), e <= t.length ? e : t.ended ? t.length : ((t.needReadable = !0), 0));
    }
    w.prototype.read = function (e) {
        _("read", e), (e = parseInt(e, 10));
        var t = this._readableState,
            r = e;
        if ((e !== 0 && (t.emittedReadable = !1), e === 0 && t.needReadable && ((t.highWaterMark !== 0 ? t.length >= t.highWaterMark : t.length > 0) || t.ended)))
            return _("read: emitReadable", t.length, t.ended), t.length === 0 && t.ended ? Ti(this) : Br(this), null;
        if (((e = rf(e, t)), e === 0 && t.ended)) return t.length === 0 && Ti(this), null;
        var n = t.needReadable;
        _("need readable", n),
            (t.length === 0 || t.length - e < t.highWaterMark) && ((n = !0), _("length less than watermark", n)),
            t.ended || t.reading
                ? ((n = !1), _("reading or ended", n))
                : n && (_("do read"), (t.reading = !0), (t.sync = !0), t.length === 0 && (t.needReadable = !0), this._read(t.highWaterMark), (t.sync = !1), t.reading || (e = rf(r, t)));
        var i;
        return (
            e > 0 ? (i = lf(e, t)) : (i = null),
            i === null ? ((t.needReadable = t.length <= t.highWaterMark), (e = 0)) : ((t.length -= e), (t.awaitDrain = 0)),
            t.length === 0 && (t.ended || (t.needReadable = !0), r !== e && t.ended && Ti(this)),
            i !== null && this.emit("data", i),
            i
        );
    };
    function Xb(e, t) {
        if ((_("onEofChunk"), !t.ended)) {
            if (t.decoder) {
                var r = t.decoder.end();
                r && r.length && (t.buffer.push(r), (t.length += t.objectMode ? 1 : r.length));
            }
            (t.ended = !0), t.sync ? Br(e) : ((t.needReadable = !1), t.emittedReadable || ((t.emittedReadable = !0), af(e)));
        }
    }
    function Br(e) {
        var t = e._readableState;
        _("emitReadable", t.needReadable, t.emittedReadable), (t.needReadable = !1), t.emittedReadable || (_("emitReadable", t.flowing), (t.emittedReadable = !0), process.nextTick(af, e));
    }
    function af(e) {
        var t = e._readableState;
        _("emitReadable_", t.destroyed, t.length, t.ended),
            !t.destroyed && (t.length || t.ended) && (e.emit("readable"), (t.emittedReadable = !1)),
            (t.needReadable = !t.flowing && !t.ended && t.length <= t.highWaterMark),
            Pi(e);
    }
    function Ai(e, t) {
        t.readingMore || ((t.readingMore = !0), process.nextTick(zb, e, t));
    }
    function zb(e, t) {
        for (; !t.reading && !t.ended && (t.length < t.highWaterMark || (t.flowing && t.length === 0)); ) {
            var r = t.length;
            if ((_("maybeReadMore read 0"), e.read(0), r === t.length)) break;
        }
        t.readingMore = !1;
    }
    w.prototype._read = function (e) {
        Ct(this, new Gb("_read()"));
    };
    w.prototype.pipe = function (e, t) {
        var r = this,
            n = this._readableState;
        switch (n.pipesCount) {
            case 0:
                n.pipes = e;
                break;
            case 1:
                n.pipes = [n.pipes, e];
                break;
            default:
                n.pipes.push(e);
                break;
        }
        (n.pipesCount += 1), _("pipe count=%d opts=%j", n.pipesCount, t);
        var i = (!t || t.end !== !1) && e !== process.stdout && e !== process.stderr,
            s = i ? a : x;
        n.endEmitted ? process.nextTick(s) : r.once("end", s), e.on("unpipe", o);
        function o(j, T) {
            _("onunpipe"), j === r && T && T.hasUnpiped === !1 && ((T.hasUnpiped = !0), f());
        }
        function a() {
            _("onend"), e.end();
        }
        var u = Kb(r);
        e.on("drain", u);
        var l = !1;
        function f() {
            _("cleanup"),
                e.removeListener("close", d),
                e.removeListener("finish", m),
                e.removeListener("drain", u),
                e.removeListener("error", p),
                e.removeListener("unpipe", o),
                r.removeListener("end", a),
                r.removeListener("end", x),
                r.removeListener("data", h),
                (l = !0),
                n.awaitDrain && (!e._writableState || e._writableState.needDrain) && u();
        }
        r.on("data", h);
        function h(j) {
            _("ondata");
            var T = e.write(j);
            _("dest.write", T),
                T === !1 &&
                    (((n.pipesCount === 1 && n.pipes === e) || (n.pipesCount > 1 && cf(n.pipes, e) !== -1)) && !l && (_("false write response, pause", n.awaitDrain), n.awaitDrain++), r.pause());
        }
        function p(j) {
            _("onerror", j), x(), e.removeListener("error", p), nf(e, "error") === 0 && Ct(e, j);
        }
        Wb(e, "error", p);
        function d() {
            e.removeListener("finish", m), x();
        }
        e.once("close", d);
        function m() {
            _("onfinish"), e.removeListener("close", d), x();
        }
        e.once("finish", m);
        function x() {
            _("unpipe"), r.unpipe(e);
        }
        return e.emit("pipe", r), n.flowing || (_("pipe resume"), r.resume()), e;
    };
    function Kb(e) {
        return function () {
            var r = e._readableState;
            _("pipeOnDrain", r.awaitDrain), r.awaitDrain && r.awaitDrain--, r.awaitDrain === 0 && nf(e, "data") && ((r.flowing = !0), Pi(e));
        };
    }
    w.prototype.unpipe = function (e) {
        var t = this._readableState,
            r = {hasUnpiped: !1};
        if (t.pipesCount === 0) return this;
        if (t.pipesCount === 1) return e && e !== t.pipes ? this : (e || (e = t.pipes), (t.pipes = null), (t.pipesCount = 0), (t.flowing = !1), e && e.emit("unpipe", this, r), this);
        if (!e) {
            var n = t.pipes,
                i = t.pipesCount;
            (t.pipes = null), (t.pipesCount = 0), (t.flowing = !1);
            for (var s = 0; s < i; s++) n[s].emit("unpipe", this, {hasUnpiped: !1});
            return this;
        }
        var o = cf(t.pipes, e);
        return o === -1 ? this : (t.pipes.splice(o, 1), (t.pipesCount -= 1), t.pipesCount === 1 && (t.pipes = t.pipes[0]), e.emit("unpipe", this, r), this);
    };
    w.prototype.on = function (e, t) {
        var r = Dt.prototype.on.call(this, e, t),
            n = this._readableState;
        return (
            e === "data"
                ? ((n.readableListening = this.listenerCount("readable") > 0), n.flowing !== !1 && this.resume())
                : e === "readable" &&
                  !n.endEmitted &&
                  !n.readableListening &&
                  ((n.readableListening = n.needReadable = !0),
                  (n.flowing = !1),
                  (n.emittedReadable = !1),
                  _("on readable", n.length, n.reading),
                  n.length ? Br(this) : n.reading || process.nextTick(Yb, this)),
            r
        );
    };
    w.prototype.addListener = w.prototype.on;
    w.prototype.removeListener = function (e, t) {
        var r = Dt.prototype.removeListener.call(this, e, t);
        return e === "readable" && process.nextTick(uf, this), r;
    };
    w.prototype.removeAllListeners = function (e) {
        var t = Dt.prototype.removeAllListeners.apply(this, arguments);
        return (e === "readable" || e === void 0) && process.nextTick(uf, this), t;
    };
    function uf(e) {
        var t = e._readableState;
        (t.readableListening = e.listenerCount("readable") > 0), t.resumeScheduled && !t.paused ? (t.flowing = !0) : e.listenerCount("data") > 0 && e.resume();
    }
    function Yb(e) {
        _("readable nexttick read 0"), e.read(0);
    }
    w.prototype.resume = function () {
        var e = this._readableState;
        return e.flowing || (_("resume"), (e.flowing = !e.readableListening), Jb(this, e)), (e.paused = !1), this;
    };
    function Jb(e, t) {
        t.resumeScheduled || ((t.resumeScheduled = !0), process.nextTick(Zb, e, t));
    }
    function Zb(e, t) {
        _("resume", t.reading), t.reading || e.read(0), (t.resumeScheduled = !1), e.emit("resume"), Pi(e), t.flowing && !t.reading && e.read(0);
    }
    w.prototype.pause = function () {
        return (
            _("call pause flowing=%j", this._readableState.flowing),
            this._readableState.flowing !== !1 && (_("pause"), (this._readableState.flowing = !1), this.emit("pause")),
            (this._readableState.paused = !0),
            this
        );
    };
    function Pi(e) {
        var t = e._readableState;
        for (_("flow", t.flowing); t.flowing && e.read() !== null; );
    }
    w.prototype.wrap = function (e) {
        var t = this,
            r = this._readableState,
            n = !1;
        e.on("end", function () {
            if ((_("wrapped end"), r.decoder && !r.ended)) {
                var o = r.decoder.end();
                o && o.length && t.push(o);
            }
            t.push(null);
        }),
            e.on("data", function (o) {
                if ((_("wrapped data"), r.decoder && (o = r.decoder.write(o)), !(r.objectMode && o == null) && !(!r.objectMode && (!o || !o.length)))) {
                    var a = t.push(o);
                    a || ((n = !0), e.pause());
                }
            });
        for (var i in e)
            this[i] === void 0 &&
                typeof e[i] == "function" &&
                (this[i] = (function (a) {
                    return function () {
                        return e[a].apply(e, arguments);
                    };
                })(i));
        for (var s = 0; s < Si.length; s++) e.on(Si[s], this.emit.bind(this, Si[s]));
        return (
            (this._read = function (o) {
                _("wrapped _read", o), n && ((n = !1), e.resume());
            }),
            this
        );
    };
    typeof Symbol == "function" &&
        (w.prototype[Symbol.asyncIterator] = function () {
            return Oi === void 0 && (Oi = Yc()), Oi(this);
        });
    Object.defineProperty(w.prototype, "readableHighWaterMark", {
        enumerable: !1,
        get: function () {
            return this._readableState.highWaterMark;
        },
    });
    Object.defineProperty(w.prototype, "readableBuffer", {
        enumerable: !1,
        get: function () {
            return this._readableState && this._readableState.buffer;
        },
    });
    Object.defineProperty(w.prototype, "readableFlowing", {
        enumerable: !1,
        get: function () {
            return this._readableState.flowing;
        },
        set: function (t) {
            this._readableState && (this._readableState.flowing = t);
        },
    });
    w._fromList = lf;
    Object.defineProperty(w.prototype, "readableLength", {
        enumerable: !1,
        get: function () {
            return this._readableState.length;
        },
    });
    function lf(e, t) {
        if (t.length === 0) return null;
        var r;
        return (
            t.objectMode
                ? (r = t.buffer.shift())
                : !e || e >= t.length
                ? (t.decoder ? (r = t.buffer.join("")) : t.buffer.length === 1 ? (r = t.buffer.first()) : (r = t.buffer.concat(t.length)), t.buffer.clear())
                : (r = t.buffer.consume(e, t.decoder)),
            r
        );
    }
    function Ti(e) {
        var t = e._readableState;
        _("endReadable", t.endEmitted), t.endEmitted || ((t.ended = !0), process.nextTick(Qb, t, e));
    }
    function Qb(e, t) {
        if ((_("endReadableNT", e.endEmitted, e.length), !e.endEmitted && e.length === 0 && ((e.endEmitted = !0), (t.readable = !1), t.emit("end"), e.autoDestroy))) {
            var r = t._writableState;
            (!r || (r.autoDestroy && r.finished)) && t.destroy();
        }
    }
    typeof Symbol == "function" &&
        (w.from = function (e, t) {
            return Ri === void 0 && (Ri = ef()), Ri(w, e, t);
        });
    function cf(e, t) {
        for (var r = 0, n = e.length; r < n; r++) if (e[r] === t) return r;
        return -1;
    }
});
var Ni = c((R1, df) => {
    "use strict";
    df.exports = pe;
    var Gr = we().codes,
        em = Gr.ERR_METHOD_NOT_IMPLEMENTED,
        tm = Gr.ERR_MULTIPLE_CALLBACK,
        rm = Gr.ERR_TRANSFORM_ALREADY_TRANSFORMING,
        nm = Gr.ERR_TRANSFORM_WITH_LENGTH_0,
        Ur = Fe();
    st()(pe, Ur);
    function im(e, t) {
        var r = this._transformState;
        r.transforming = !1;
        var n = r.writecb;
        if (n === null) return this.emit("error", new tm());
        (r.writechunk = null), (r.writecb = null), t != null && this.push(t), n(e);
        var i = this._readableState;
        (i.reading = !1), (i.needReadable || i.length < i.highWaterMark) && this._read(i.highWaterMark);
    }
    function pe(e) {
        if (!(this instanceof pe)) return new pe(e);
        Ur.call(this, e),
            (this._transformState = {afterTransform: im.bind(this), needTransform: !1, transforming: !1, writecb: null, writechunk: null, writeencoding: null}),
            (this._readableState.needReadable = !0),
            (this._readableState.sync = !1),
            e && (typeof e.transform == "function" && (this._transform = e.transform), typeof e.flush == "function" && (this._flush = e.flush)),
            this.on("prefinish", sm);
    }
    function sm() {
        var e = this;
        typeof this._flush == "function" && !this._readableState.destroyed
            ? this._flush(function (t, r) {
                  hf(e, t, r);
              })
            : hf(this, null, null);
    }
    pe.prototype.push = function (e, t) {
        return (this._transformState.needTransform = !1), Ur.prototype.push.call(this, e, t);
    };
    pe.prototype._transform = function (e, t, r) {
        r(new em("_transform()"));
    };
    pe.prototype._write = function (e, t, r) {
        var n = this._transformState;
        if (((n.writecb = r), (n.writechunk = e), (n.writeencoding = t), !n.transforming)) {
            var i = this._readableState;
            (n.needTransform || i.needReadable || i.length < i.highWaterMark) && this._read(i.highWaterMark);
        }
    };
    pe.prototype._read = function (e) {
        var t = this._transformState;
        t.writechunk !== null && !t.transforming ? ((t.transforming = !0), this._transform(t.writechunk, t.writeencoding, t.afterTransform)) : (t.needTransform = !0);
    };
    pe.prototype._destroy = function (e, t) {
        Ur.prototype._destroy.call(this, e, function (r) {
            t(r);
        });
    };
    function hf(e, t, r) {
        if (t) return e.emit("error", t);
        if ((r != null && e.push(r), e._writableState.length)) throw new nm();
        if (e._transformState.transforming) throw new rm();
        return e.push(null);
    }
});
var yf = c((S1, gf) => {
    "use strict";
    gf.exports = Ft;
    var pf = Ni();
    st()(Ft, pf);
    function Ft(e) {
        if (!(this instanceof Ft)) return new Ft(e);
        pf.call(this, e);
    }
    Ft.prototype._transform = function (e, t, r) {
        r(null, e);
    };
});
var _f = c((x1, Ef) => {
    "use strict";
    var qi;
    function om(e) {
        var t = !1;
        return function () {
            t || ((t = !0), e.apply(void 0, arguments));
        };
    }
    var vf = we().codes,
        am = vf.ERR_MISSING_ARGS,
        um = vf.ERR_STREAM_DESTROYED;
    function bf(e) {
        if (e) throw e;
    }
    function lm(e) {
        return e.setHeader && typeof e.abort == "function";
    }
    function cm(e, t, r, n) {
        n = om(n);
        var i = !1;
        e.on("close", function () {
            i = !0;
        }),
            qi === void 0 && (qi = jr()),
            qi(e, {readable: t, writable: r}, function (o) {
                if (o) return n(o);
                (i = !0), n();
            });
        var s = !1;
        return function (o) {
            if (!i && !s) {
                if (((s = !0), lm(e))) return e.abort();
                if (typeof e.destroy == "function") return e.destroy();
                n(o || new um("pipe"));
            }
        };
    }
    function mf(e) {
        e();
    }
    function fm(e, t) {
        return e.pipe(t);
    }
    function hm(e) {
        return !e.length || typeof e[e.length - 1] != "function" ? bf : e.pop();
    }
    function dm() {
        for (var e = arguments.length, t = new Array(e), r = 0; r < e; r++) t[r] = arguments[r];
        var n = hm(t);
        if ((Array.isArray(t[0]) && (t = t[0]), t.length < 2)) throw new am("streams");
        var i,
            s = t.map(function (o, a) {
                var u = a < t.length - 1,
                    l = a > 0;
                return cm(o, u, l, function (f) {
                    i || (i = f), f && s.forEach(mf), !u && (s.forEach(mf), n(i));
                });
            });
        return t.reduce(fm);
    }
    Ef.exports = dm;
});
var Li = c((Z, Bt) => {
    var kt = require("stream");
    process.env.READABLE_STREAM === "disable" && kt
        ? ((Bt.exports = kt.Readable), Object.assign(Bt.exports, kt), (Bt.exports.Stream = kt))
        : ((Z = Bt.exports = yi()),
          (Z.Stream = kt || Z),
          (Z.Readable = Z),
          (Z.Writable = di()),
          (Z.Duplex = Fe()),
          (Z.Transform = Ni()),
          (Z.PassThrough = yf()),
          (Z.finished = jr()),
          (Z.pipeline = _f()));
});
var wf = c((T1, Vr) => {
    var {Transform: Wr} = Li();
    function pm(e, t) {
        (e.super_ = t), (e.prototype = Object.create(t.prototype, {constructor: {value: e, enumerable: !1, writable: !0, configurable: !0}}));
    }
    function Mi(e) {
        return (t, r, n) => (typeof t == "function" && ((n = r), (r = t), (t = {})), typeof r != "function" && (r = (i, s, o) => o(null, i)), typeof n != "function" && (n = null), e(t, r, n));
    }
    var gm = Mi((e, t, r) => {
            let n = new Wr(e);
            return (n._transform = t), r && (n._flush = r), n;
        }),
        ym = Mi((e, t, r) => {
            function n(i) {
                if (!(this instanceof n)) return new n(i);
                (this.options = Object.assign({}, e, i)), Wr.call(this, this.options), (this._transform = t), r && (this._flush = r);
            }
            return pm(n, Wr), n;
        }),
        bm = Mi(function (e, t, r) {
            let n = new Wr(Object.assign({objectMode: !0, highWaterMark: 16}, e));
            return (n._transform = t), r && (n._flush = r), n;
        });
    Vr.exports = gm;
    Vr.exports.ctor = ym;
    Vr.exports.obj = bm;
});
var xf = c((A1, Sf) => {
    "use strict";
    var {Transform: mm} = Li(),
        {StringDecoder: vm} = require("string_decoder"),
        Te = Symbol("last"),
        Hr = Symbol("decoder");
    function Em(e, t, r) {
        var n;
        if (this.overflow) {
            var i = this[Hr].write(e);
            if (((n = i.split(this.matcher)), n.length === 1)) return r();
            n.shift(), (this.overflow = !1);
        } else (this[Te] += this[Hr].write(e)), (n = this[Te].split(this.matcher));
        this[Te] = n.pop();
        for (var s = 0; s < n.length; s++)
            try {
                Rf(this, this.mapper(n[s]));
            } catch (o) {
                return r(o);
            }
        if (((this.overflow = this[Te].length > this.maxLength), this.overflow && !this.skipOverflow)) return r(new Error("maximum buffer reached"));
        r();
    }
    function _m(e) {
        if (((this[Te] += this[Hr].end()), this[Te]))
            try {
                Rf(this, this.mapper(this[Te]));
            } catch (t) {
                return e(t);
            }
        e();
    }
    function Rf(e, t) {
        t !== void 0 && e.push(t);
    }
    function Of(e) {
        return e;
    }
    function wm(e, t, r) {
        switch (((e = e || /\r?\n/), (t = t || Of), (r = r || {}), arguments.length)) {
            case 1:
                typeof e == "function" ? ((t = e), (e = /\r?\n/)) : typeof e == "object" && !(e instanceof RegExp) && ((r = e), (e = /\r?\n/));
                break;
            case 2:
                typeof e == "function" ? ((r = t), (t = e), (e = /\r?\n/)) : typeof t == "object" && ((r = t), (t = Of));
        }
        (r = Object.assign({}, r)), (r.transform = Em), (r.flush = _m), (r.readableObjectMode = !0);
        let n = new mm(r);
        return (n[Te] = ""), (n[Hr] = new vm("utf8")), (n.matcher = e), (n.mapper = t), (n.maxLength = r.maxLength), (n.skipOverflow = r.skipOverflow), (n.overflow = !1), n;
    }
    Sf.exports = wm;
});
var If = c(($i, Af) => {
    $i = Af.exports = Om;
    $i.getSerialize = Tf;
    function Om(e, t, r, n) {
        return JSON.stringify(e, Tf(t, n), r);
    }
    function Tf(e, t) {
        var r = [],
            n = [];
        return (
            t == null &&
                (t = function (i, s) {
                    return r[0] === s ? "[Circular ~]" : "[Circular ~." + n.slice(0, r.indexOf(s)).join(".") + "]";
                }),
            function (i, s) {
                if (r.length > 0) {
                    var o = r.indexOf(this);
                    ~o ? r.splice(o + 1) : r.push(this), ~o ? n.splice(o, 1 / 0, i) : n.push(i), ~r.indexOf(s) && (s = t.call(this, i, s));
                } else r.push(s);
                return e == null ? s : e.call(this, i, s);
            }
        );
    }
});
var Pf = c((I1, ji) => {
    var Rm = wf(),
        Sm = xf(),
        {EOL: xm} = require("os"),
        Tm = If();
    ji.exports.stringify = e =>
        Rm.obj(e, (t, r, n) => {
            n(null, Tm(t) + xm);
        });
    ji.exports.parse = e => {
        (e = e || {}), (e.strict = e.strict !== !1);
        function t(r) {
            try {
                if (r) return JSON.parse(r);
            } catch {
                e.strict && this.emit("error", new Error("Could not parse row " + r.slice(0, 50) + "..."));
            }
        }
        return Sm(t, e);
    };
});
var qf = c(Gt => {
    "use strict";
    Object.defineProperty(Gt, "__esModule", {value: !0});
    Gt.createStreamParser = void 0;
    var Am = qt(),
        Im = Pf();
    Gt.default = Nf();
    function Nf() {
        let e = Im.parse();
        return Am.output([{level: "debug", stream: e}]), e;
    }
    Gt.createStreamParser = Nf;
});
var Lf = c(Ci => {
    "use strict";
    Object.defineProperty(Ci, "__esModule", {value: !0});
    var Pm = qt();
    function Nm() {
        Pm.output([{level: "debug", stream: process.stdout}]);
    }
    Ci.default = Nm;
});
var $f = c(H => {
    "use strict";
    Object.defineProperty(H, "__esModule", {value: !0});
    H.writeToConsole = H.createStreamParser = H.streamParser = H.globalWarn = H.globalInfo = void 0;
    var Di = mc();
    Object.defineProperty(H, "globalInfo", {
        enumerable: !0,
        get: function () {
            return Di.globalInfo;
        },
    });
    Object.defineProperty(H, "globalWarn", {
        enumerable: !0,
        get: function () {
            return Di.globalWarn;
        },
    });
    var Mf = qf();
    H.streamParser = Mf.default;
    Object.defineProperty(H, "createStreamParser", {
        enumerable: !0,
        get: function () {
            return Mf.createStreamParser;
        },
    });
    var qm = Lf();
    H.writeToConsole = qm.default;
    H.default = Di.default;
});
var ml = Q(cu());
function fu(...e) {
    return t => e.reduce((r, n) => n(r), t);
}
function hu(e, t) {
    return e.get(t) ?? [];
}
function kg(e, t, r) {
    e.set(t, [...hu(e, t), r]);
}
function Bg() {
    return new Map();
}
var On = Object.freeze({add: kg, get: hu, create: Bg});
var Hu = Q(dr());
var pr = "pnpmSingleVersion",
    Vu = "Single Version Checker";
var gr = class extends Error {
    constructor() {
        super("Can not find project root"), (this.name = "ProjectRootError");
    }
};
var yr = class extends Error {
        constructor() {
            super(`Unable to find option ${Hu.default.blueBright(`'${pr}'`)} in package.json of root project `), (this.name = "OptionsNotFound");
        }
    },
    br = class extends Error {
        constructor() {
            super("Invalid option, please make sure you have included single version dependencies."), (this.name = "OptionSyntaxError");
        }
    };
var mr = class extends Error {
    constructor() {
        super("'packages' in lockfile is missing"), (this.name = "LockfilePackagesMissingError");
    }
};
var kn = Q(dl());
function T0(e, t) {
    let r = !1;
    for (let n of t) if (((r = (0, kn.default)(e, n)), r)) return r;
    return r;
}
function A0(e) {
    return new RegExp(
        e
            .map(t => kn.default.makeRe(t))
            .filter(t => t !== !1)
            .map(t => t.source)
            .join("|")
    );
}
var pl = Object.freeze({isMatch: T0, toRegex: A0});
var de = Q(dr()),
    Bn = {sad: "\u{1F614}", cross: "\u274C", happy: "\u{1F917}"},
    I0 = e => `${Bn.cross} Found ${de.default.redBright(e)} Non-single version dependencies
`,
    P0 = (e, t) => `
    - ${de.default.blueBright(e)} has ${de.default.redBright(t.length)} distinct versions 
      ${t.map(r => r.version).join(", ")}
`,
    N0 = `
Well, here is what you can try to do:
Run ${de.default.blueBright("$ pnpm why <dependency> -r ")} on project root to figure out the dependencies that contain conflicted version. 
If the output is too long, try to redirect output, like ${de.default.blueBright("$ pnpm why <dependency> -r > example.txt")}
more about ${de.default.blueBright("$ pnpm why")} command, check out ${de.default.greenBright("https://pnpm.io/cli/why")} 
`;
function gl(e) {
    if (e.size === 0) return null;
    let t = I0(e.size);
    for (let [r, n] of e.entries()) t += P0(r, n);
    return (t += N0), t;
}
var yl = e => {
        e.message(`${Bn.sad} ${de.default.red("Installation Process interrupted.")}`);
    },
    bl = e => t => t ? (e.message(t), !0) : (e.message(`${Bn.happy} All Passed!!!`), !1);
var q0 = e => {
        let t = new Map();
        for (let [r, n] of e.entries()) n.length > 1 && t.set(r, n);
        return t;
    },
    L0 = e => t => {
        let r = pl.toRegex(t),
            n = On.create();
        for (let [i, s] of Object.entries(e)) {
            let o = (0, ml.nameVerFromPkgSnapshot)(i, s);
            r.test(o.name) && On.add(n, o.name, o);
        }
        return n;
    },
    vl = (e, t, r) => {
        if (!e.packages) throw new mr();
        return r.message("Verify single version dependencies..."), fu(L0(e.packages), q0, gl, bl(r))(t.includes);
    };
var El = Q(require("fs/promises")),
    _l = Q(require("path")),
    wl = require("util");
var M0 = e => {
        if (!e) throw new yr();
        if (!Array.isArray(e?.includes) && !Array.isArray(e?.include)) throw new br();
        return e.include && (e.includes = e.include), e;
    },
    Ol = async e => {
        let t = await El.default.readFile(_l.default.join(e, "package.json")),
            r = JSON.parse(new wl.TextDecoder().decode(t));
        return M0(r?.[pr]);
    };
var Vl = Q(Wl()),
    Hl = require("fs/promises"),
    Xl = Q(Kn());
var zl = Q(require("path")),
    Kl = async () => {
        let e = await (0, Vl.default)(process.cwd());
        if (!e) {
            let t = await (0, Xl.default)("package.json", {cwd: await (0, Hl.realpath)(process.cwd())});
            e = t ? zl.default.parse(t).dir : void 0;
        }
        if (!e) throw new gr();
        return e;
    };
var Yn = Q(dr());
var Jn = console.log;
function Sr(e) {
    return Yn.default.magenta(Vu + ": ") + e;
}
function Q0(e) {
    Jn(e);
}
function ey(e) {
    Jn(Sr(e));
}
function ty(e) {
    Jn(Sr(`${Yn.default.bgRed(" ERROR ")} ${e.message}`));
}
var QE = Object.freeze({debug: Q0, message: ey, error: ty});
var gc = qt()("pnpm");
function ly(e) {
    gc.info(Sr(e));
}
function cy(e) {
    gc.error(e);
}
var yc = Object.freeze({message: ly, error: cy});
var jf = Q($f()),
    Cf = async e => {
        try {
            let t = yc,
                r = await Kl(),
                n = await Ol(r);
            return vl(e, n, t) && (yl(t), process.exit(1)), e;
        } catch (t) {
            t instanceof Error && jf.default.error(t), process.exit(1);
        }
    };
module.exports = Cf;
/*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
