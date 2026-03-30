!function() {
    try {
        var e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : {}
            , n = (new e.Error).stack;
        n && (e._posthogChunkIds = e._posthogChunkIds || {},
            e._posthogChunkIds[n] = "019c353e-cb21-76c0-baad-944a1afabdd5")
    } catch (e) {}
}();
(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["object" == typeof document ? document.currentScript : void 0, 181043, e => {
    "use strict";
    e.i(691013),
        e.i(178548),
        e.s([])
}
    , 748337, 860587, e => {
        "use strict";
        e.i(260835);
        var t = e.i(245974);
        e.i(181043);
        var r = e.i(691013)
            , a = e.i(406855);
        e.i(556928);
        var s = e.i(859026);
        e.s(["CaseUtils", () => s.default], 860587);
        var s = s;
        class u {
            static getProductOptionItemId(e, t) {
                return [e, t.size, t.frameColor, t.orientation, t.paperType, u.getMatsLabel(!!t.includeMats)].map(e => e ?? "").join("-")
            }
            static getPaperStyleFromPaperType(e) {
                return Object.values(t.PaperStyle).find(t => e.includes(t))
            }
            static A_SIZE_NAMES = {
                x4dot1x5dot8: "A6",
                x5dot8x8dot3: "A5",
                x8dot3x11dot7: "A4",
                x11dot7x16dot5: "A3",
                x16dot5x23dot4: "A2",
                x23dot4x33dot1: "A1",
                x33dot1x46dot8: "A0"
            };
            static METRIC_SIZE_NAMES = {
                x11x15dot7: "28x40cm",
                x11dot8x9dot4: "30x24cm",
                x11dot8x15dot7: "30x40cm",
                x15dot7x19dot7: "40x50cm",
                x19dot7x27dot6: "50x70cm",
                x27dot6x39dot4: "70x100cm"
            };
            static renderSizeOption(e) {
                let t = r.GALLERIES_CONFIG[e]?.name || u.A_SIZE_NAMES[e] || u.METRIC_SIZE_NAMES[e];
                return t || (e ? (0,
                    a.formatProductSize)(e) : "None")
            }
            static getReadableName(e, t) {
                switch (e) {
                    case t:
                    case "catalogProductId":
                        return (0,
                            a.getProductName)(t) ?? t;
                    case "size":
                        return u.renderSizeOption(t);
                    case "paperType":
                    case "frameColor":
                        return s.default.fromPascalCaseToTitle(t);
                    default:
                        return t
                }
            }
            static getMatsLabel(e) {
                return e ? "Mats" : ""
            }
        }
        e.s(["ProductCatalogUtils", () => u], 748337)
    }
    , 546053, e => {
        e.v({
            partitions: [{
                id: "aws",
                outputs: {
                    dnsSuffix: "amazonaws.com",
                    dualStackDnsSuffix: "api.aws",
                    implicitGlobalRegion: "us-east-1",
                    name: "aws",
                    supportsDualStack: !0,
                    supportsFIPS: !0
                },
                regionRegex: "^(us|eu|ap|sa|ca|me|af|il|mx)\\-\\w+\\-\\d+$",
                regions: {
                    "af-south-1": {
                        description: "Africa (Cape Town)"
                    },
                    "ap-east-1": {
                        description: "Asia Pacific (Hong Kong)"
                    },
                    "ap-east-2": {
                        description: "Asia Pacific (Taipei)"
                    },
                    "ap-northeast-1": {
                        description: "Asia Pacific (Tokyo)"
                    },
                    "ap-northeast-2": {
                        description: "Asia Pacific (Seoul)"
                    },
                    "ap-northeast-3": {
                        description: "Asia Pacific (Osaka)"
                    },
                    "ap-south-1": {
                        description: "Asia Pacific (Mumbai)"
                    },
                    "ap-south-2": {
                        description: "Asia Pacific (Hyderabad)"
                    },
                    "ap-southeast-1": {
                        description: "Asia Pacific (Singapore)"
                    },
                    "ap-southeast-2": {
                        description: "Asia Pacific (Sydney)"
                    },
                    "ap-southeast-3": {
                        description: "Asia Pacific (Jakarta)"
                    },
                    "ap-southeast-4": {
                        description: "Asia Pacific (Melbourne)"
                    },
                    "ap-southeast-5": {
                        description: "Asia Pacific (Malaysia)"
                    },
                    "ap-southeast-6": {
                        description: "Asia Pacific (New Zealand)"
                    },
                    "ap-southeast-7": {
                        description: "Asia Pacific (Thailand)"
                    },
                    "aws-global": {
                        description: "aws global region"
                    },
                    "ca-central-1": {
                        description: "Canada (Central)"
                    },
                    "ca-west-1": {
                        description: "Canada West (Calgary)"
                    },
                    "eu-central-1": {
                        description: "Europe (Frankfurt)"
                    },
                    "eu-central-2": {
                        description: "Europe (Zurich)"
                    },
                    "eu-north-1": {
                        description: "Europe (Stockholm)"
                    },
                    "eu-south-1": {
                        description: "Europe (Milan)"
                    },
                    "eu-south-2": {
                        description: "Europe (Spain)"
                    },
                    "eu-west-1": {
                        description: "Europe (Ireland)"
                    },
                    "eu-west-2": {
                        description: "Europe (London)"
                    },
                    "eu-west-3": {
                        description: "Europe (Paris)"
                    },
                    "il-central-1": {
                        description: "Israel (Tel Aviv)"
                    },
                    "me-central-1": {
                        description: "Middle East (UAE)"
                    },
                    "me-south-1": {
                        description: "Middle East (Bahrain)"
                    },
                    "mx-central-1": {
                        description: "Mexico (Central)"
                    },
                    "sa-east-1": {
                        description: "South America (Sao Paulo)"
                    },
                    "us-east-1": {
                        description: "US East (N. Virginia)"
                    },
                    "us-east-2": {
                        description: "US East (Ohio)"
                    },
                    "us-west-1": {
                        description: "US West (N. California)"
                    },
                    "us-west-2": {
                        description: "US West (Oregon)"
                    }
                }
            }, {
                id: "aws-cn",
                outputs: {
                    dnsSuffix: "amazonaws.com.cn",
                    dualStackDnsSuffix: "api.amazonwebservices.com.cn",
                    implicitGlobalRegion: "cn-northwest-1",
                    name: "aws-cn",
                    supportsDualStack: !0,
                    supportsFIPS: !0
                },
                regionRegex: "^cn\\-\\w+\\-\\d+$",
                regions: {
                    "aws-cn-global": {
                        description: "aws-cn global region"
                    },
                    "cn-north-1": {
                        description: "China (Beijing)"
                    },
                    "cn-northwest-1": {
                        description: "China (Ningxia)"
                    }
                }
            }, {
                id: "aws-eusc",
                outputs: {
                    dnsSuffix: "amazonaws.eu",
                    dualStackDnsSuffix: "api.amazonwebservices.eu",
                    implicitGlobalRegion: "eusc-de-east-1",
                    name: "aws-eusc",
                    supportsDualStack: !0,
                    supportsFIPS: !0
                },
                regionRegex: "^eusc\\-(de)\\-\\w+\\-\\d+$",
                regions: {
                    "eusc-de-east-1": {
                        description: "AWS European Sovereign Cloud (Germany)"
                    }
                }
            }, {
                id: "aws-iso",
                outputs: {
                    dnsSuffix: "c2s.ic.gov",
                    dualStackDnsSuffix: "api.aws.ic.gov",
                    implicitGlobalRegion: "us-iso-east-1",
                    name: "aws-iso",
                    supportsDualStack: !0,
                    supportsFIPS: !0
                },
                regionRegex: "^us\\-iso\\-\\w+\\-\\d+$",
                regions: {
                    "aws-iso-global": {
                        description: "aws-iso global region"
                    },
                    "us-iso-east-1": {
                        description: "US ISO East"
                    },
                    "us-iso-west-1": {
                        description: "US ISO WEST"
                    }
                }
            }, {
                id: "aws-iso-b",
                outputs: {
                    dnsSuffix: "sc2s.sgov.gov",
                    dualStackDnsSuffix: "api.aws.scloud",
                    implicitGlobalRegion: "us-isob-east-1",
                    name: "aws-iso-b",
                    supportsDualStack: !0,
                    supportsFIPS: !0
                },
                regionRegex: "^us\\-isob\\-\\w+\\-\\d+$",
                regions: {
                    "aws-iso-b-global": {
                        description: "aws-iso-b global region"
                    },
                    "us-isob-east-1": {
                        description: "US ISOB East (Ohio)"
                    },
                    "us-isob-west-1": {
                        description: "US ISOB West"
                    }
                }
            }, {
                id: "aws-iso-e",
                outputs: {
                    dnsSuffix: "cloud.adc-e.uk",
                    dualStackDnsSuffix: "api.cloud-aws.adc-e.uk",
                    implicitGlobalRegion: "eu-isoe-west-1",
                    name: "aws-iso-e",
                    supportsDualStack: !0,
                    supportsFIPS: !0
                },
                regionRegex: "^eu\\-isoe\\-\\w+\\-\\d+$",
                regions: {
                    "aws-iso-e-global": {
                        description: "aws-iso-e global region"
                    },
                    "eu-isoe-west-1": {
                        description: "EU ISOE West"
                    }
                }
            }, {
                id: "aws-iso-f",
                outputs: {
                    dnsSuffix: "csp.hci.ic.gov",
                    dualStackDnsSuffix: "api.aws.hci.ic.gov",
                    implicitGlobalRegion: "us-isof-south-1",
                    name: "aws-iso-f",
                    supportsDualStack: !0,
                    supportsFIPS: !0
                },
                regionRegex: "^us\\-isof\\-\\w+\\-\\d+$",
                regions: {
                    "aws-iso-f-global": {
                        description: "aws-iso-f global region"
                    },
                    "us-isof-east-1": {
                        description: "US ISOF EAST"
                    },
                    "us-isof-south-1": {
                        description: "US ISOF SOUTH"
                    }
                }
            }, {
                id: "aws-us-gov",
                outputs: {
                    dnsSuffix: "amazonaws.com",
                    dualStackDnsSuffix: "api.aws",
                    implicitGlobalRegion: "us-gov-west-1",
                    name: "aws-us-gov",
                    supportsDualStack: !0,
                    supportsFIPS: !0
                },
                regionRegex: "^us\\-gov\\-\\w+\\-\\d+$",
                regions: {
                    "aws-us-gov-global": {
                        description: "aws-us-gov global region"
                    },
                    "us-gov-east-1": {
                        description: "AWS GovCloud (US-East)"
                    },
                    "us-gov-west-1": {
                        description: "AWS GovCloud (US-West)"
                    }
                }
            }],
            version: "1.1"
        })
    }
    , 419443, 637207, e => {
        "use strict";
        e.s(["fromUtf8", 0, e => new TextEncoder().encode(e)], 419443),
            e.s(["toUtf8", 0, e => {
                if ("string" == typeof e)
                    return e;
                if ("object" != typeof e || "number" != typeof e.byteOffset || "number" != typeof e.byteLength)
                    throw Error("@smithy/util-utf8: toUtf8 encoder function only accepts string | Uint8Array.");
                return new TextDecoder("utf-8").decode(e)
            }
            ], 637207)
    }
    , 309870, (e, t, r) => {
        var a = e.r(356967)
            , s = a.Buffer;
        function u(e, t) {
            for (var r in e)
                t[r] = e[r]
        }
        function i(e, t, r) {
            return s(e, t, r)
        }
        s.from && s.alloc && s.allocUnsafe && s.allocUnsafeSlow ? t.exports = a : (u(a, r),
            r.Buffer = i),
            i.prototype = Object.create(s.prototype),
            u(s, i),
            i.from = function(e, t, r) {
                if ("number" == typeof e)
                    throw TypeError("Argument must not be a number");
                return s(e, t, r)
            }
            ,
            i.alloc = function(e, t, r) {
                if ("number" != typeof e)
                    throw TypeError("Argument must be a number");
                var a = s(e);
                return void 0 !== t ? "string" == typeof r ? a.fill(t, r) : a.fill(t) : a.fill(0),
                    a
            }
            ,
            i.allocUnsafe = function(e) {
                if ("number" != typeof e)
                    throw TypeError("Argument must be a number");
                return s(e)
            }
            ,
            i.allocUnsafeSlow = function(e) {
                if ("number" != typeof e)
                    throw TypeError("Argument must be a number");
                return a.SlowBuffer(e)
            }
    }
    , 924753, (e, t, r) => {
        "use strict";
        var a = e.r(309870).Buffer
            , s = a.isEncoding || function(e) {
                switch ((e = "" + e) && e.toLowerCase()) {
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
                        return !1
                }
            }
        ;
        function u(e) {
            var t;
            switch (this.encoding = function(e) {
                var t = function(e) {
                    var t;
                    if (!e)
                        return "utf8";
                    for (; ; )
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
                                if (t)
                                    return;
                                e = ("" + e).toLowerCase(),
                                    t = !0
                        }
                }(e);
                if ("string" != typeof t && (a.isEncoding === s || !s(e)))
                    throw Error("Unknown encoding: " + e);
                return t || e
            }(e),
                this.encoding) {
                case "utf16le":
                    this.text = F,
                        this.end = n,
                        t = 4;
                    break;
                case "utf8":
                    this.fillLast = o,
                        t = 4;
                    break;
                case "base64":
                    this.text = q,
                        this.end = l,
                        t = 3;
                    break;
                default:
                    this.write = x,
                        this.end = c;
                    return
            }
            this.lastNeed = 0,
                this.lastTotal = 0,
                this.lastChar = a.allocUnsafe(t)
        }
        function i(e) {
            return e <= 127 ? 0 : e >> 5 == 6 ? 2 : e >> 4 == 14 ? 3 : e >> 3 == 30 ? 4 : e >> 6 == 2 ? -1 : -2
        }
        function o(e) {
            var t = this.lastTotal - this.lastNeed
                , r = function(e, t, r) {
                if ((192 & t[0]) != 128)
                    return e.lastNeed = 0,
                        "�";
                if (e.lastNeed > 1 && t.length > 1) {
                    if ((192 & t[1]) != 128)
                        return e.lastNeed = 1,
                            "�";
                    if (e.lastNeed > 2 && t.length > 2 && (192 & t[2]) != 128)
                        return e.lastNeed = 2,
                            "�"
                }
            }(this, e, 0);
            return void 0 !== r ? r : this.lastNeed <= e.length ? (e.copy(this.lastChar, t, 0, this.lastNeed),
                this.lastChar.toString(this.encoding, 0, this.lastTotal)) : void (e.copy(this.lastChar, t, 0, e.length),
                this.lastNeed -= e.length)
        }
        function F(e, t) {
            if ((e.length - t) % 2 == 0) {
                var r = e.toString("utf16le", t);
                if (r) {
                    var a = r.charCodeAt(r.length - 1);
                    if (a >= 55296 && a <= 56319)
                        return this.lastNeed = 2,
                            this.lastTotal = 4,
                            this.lastChar[0] = e[e.length - 2],
                            this.lastChar[1] = e[e.length - 1],
                            r.slice(0, -1)
                }
                return r
            }
            return this.lastNeed = 1,
                this.lastTotal = 2,
                this.lastChar[0] = e[e.length - 1],
                e.toString("utf16le", t, e.length - 1)
        }
        function n(e) {
            var t = e && e.length ? this.write(e) : "";
            if (this.lastNeed) {
                var r = this.lastTotal - this.lastNeed;
                return t + this.lastChar.toString("utf16le", 0, r)
            }
            return t
        }
        function q(e, t) {
            var r = (e.length - t) % 3;
            return 0 === r ? e.toString("base64", t) : (this.lastNeed = 3 - r,
                this.lastTotal = 3,
                1 === r ? this.lastChar[0] = e[e.length - 1] : (this.lastChar[0] = e[e.length - 2],
                    this.lastChar[1] = e[e.length - 1]),
                e.toString("base64", t, e.length - r))
        }
        function l(e) {
            var t = e && e.length ? this.write(e) : "";
            return this.lastNeed ? t + this.lastChar.toString("base64", 0, 3 - this.lastNeed) : t
        }
        function x(e) {
            return e.toString(this.encoding)
        }
        function c(e) {
            return e && e.length ? this.write(e) : ""
        }
        r.StringDecoder = u,
            u.prototype.write = function(e) {
                var t, r;
                if (0 === e.length)
                    return "";
                if (this.lastNeed) {
                    if (void 0 === (t = this.fillLast(e)))
                        return "";
                    r = this.lastNeed,
                        this.lastNeed = 0
                } else
                    r = 0;
                return r < e.length ? t ? t + this.text(e, r) : this.text(e, r) : t || ""
            }
            ,
            u.prototype.end = function(e) {
                var t = e && e.length ? this.write(e) : "";
                return this.lastNeed ? t + "�" : t
            }
            ,
            u.prototype.text = function(e, t) {
                var r = function(e, t, r) {
                    var a = t.length - 1;
                    if (a < r)
                        return 0;
                    var s = i(t[a]);
                    return s >= 0 ? (s > 0 && (e.lastNeed = s - 1),
                        s) : --a < r || -2 === s ? 0 : (s = i(t[a])) >= 0 ? (s > 0 && (e.lastNeed = s - 2),
                        s) : --a < r || -2 === s ? 0 : (s = i(t[a])) >= 0 ? (s > 0 && (2 === s ? s = 0 : e.lastNeed = s - 3),
                        s) : 0
                }(this, e, t);
                if (!this.lastNeed)
                    return e.toString("utf8", t);
                this.lastTotal = r;
                var a = e.length - (r - this.lastNeed);
                return e.copy(this.lastChar, 0, a),
                    e.toString("utf8", t, a)
            }
            ,
            u.prototype.fillLast = function(e) {
                if (this.lastNeed <= e.length)
                    return e.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed),
                        this.lastChar.toString(this.encoding, 0, this.lastTotal);
                e.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, e.length),
                    this.lastNeed -= e.length
            }
    }
    , 62056, e => {
        "use strict";
        e.s(["BRANDING_PRINTER_PORT", 0, 5500, "ET_TIMEZONE", 0, "America/New_York", "HAUS_AND_HUES_USER_ID", 0, "1376bfe2-9aa2-44f6-9001-545eb867e767", "INCHES_PER_FOOT", 0, 12, "NEW_CLIENT_ORDER_STATUS_ENABLED", 0, !1, "OZ_PER_POUND", 0, 16])
    }
    , 691013, e => {
        "use strict";
        e.i(260835);
        var t = e.i(245974);
        let r = {
            Brighton: {
                name: t.ProductSize.Brighton,
                prints: [{
                    orientation: "Vertical",
                    size: "x8x10"
                }, {
                    orientation: "Vertical",
                    size: "x11x14"
                }, {
                    orientation: "Vertical",
                    size: "x16x20"
                }, {
                    orientation: "Vertical",
                    size: "x11x14"
                }, {
                    orientation: "Vertical",
                    size: "x11x14"
                }, {
                    orientation: "Vertical",
                    size: "x16x20"
                }, {
                    orientation: "Vertical",
                    size: "x11x14"
                }, {
                    orientation: "Vertical",
                    size: "x8x10"
                }]
            },
            Bristol: {
                name: t.ProductSize.Bristol,
                prints: [{
                    orientation: "Vertical",
                    size: "x8x10"
                }, {
                    orientation: "Vertical",
                    size: "x12x16"
                }, {
                    orientation: "Vertical",
                    size: "x12x16"
                }, {
                    orientation: "Vertical",
                    size: "x8x10"
                }, {
                    orientation: "Vertical",
                    size: "x12x16"
                }]
            },
            Camden: {
                name: t.ProductSize.Camden,
                prints: [{
                    orientation: "Vertical",
                    size: "x5x7"
                }, {
                    orientation: "Horizontal",
                    size: "x5x7"
                }, {
                    orientation: "Vertical",
                    size: "x4x6"
                }, {
                    orientation: "Vertical",
                    size: "x4x6"
                }, {
                    orientation: "Horizontal",
                    size: "x4x6"
                }, {
                    orientation: "Vertical",
                    size: "x8x10"
                }, {
                    orientation: "Horizontal",
                    size: "x8x10"
                }, {
                    orientation: "Horizontal",
                    size: "x5x7"
                }, {
                    orientation: "Horizontal",
                    size: "x5x7"
                }, {
                    orientation: "Horizontal",
                    size: "x4x6"
                }]
            },
            Hudson: {
                name: t.ProductSize.Hudson,
                prints: [{
                    orientation: "Horizontal",
                    size: "x4x6"
                }, {
                    orientation: "Vertical",
                    size: "x5x7"
                }, {
                    orientation: "Horizontal",
                    size: "x4x6"
                }, {
                    orientation: "Horizontal",
                    size: "x4x6"
                }, {
                    orientation: "Horizontal",
                    size: "x4x6"
                }, {
                    orientation: "Vertical",
                    size: "x4x6"
                }, {
                    orientation: "Vertical",
                    size: "x4x6"
                }, {
                    orientation: "Vertical",
                    size: "x5x7"
                }, {
                    orientation: "Horizontal",
                    size: "x4x6"
                }, {
                    orientation: "Vertical",
                    size: "x5x7"
                }, {
                    orientation: "Vertical",
                    size: "x4x6"
                }]
            },
            Kent: {
                name: t.ProductSize.Kent,
                prints: [{
                    orientation: "Vertical",
                    size: "x4x6"
                }, {
                    orientation: "Vertical",
                    size: "x5x7"
                }, {
                    orientation: "Horizontal",
                    size: "x4x6"
                }, {
                    orientation: "Horizontal",
                    size: "x4x6"
                }, {
                    orientation: "Vertical",
                    size: "x5x7"
                }, {
                    orientation: "Vertical",
                    size: "x4x6"
                }]
            },
            Warwick: {
                name: t.ProductSize.Warwick,
                prints: [{
                    orientation: "Vertical",
                    size: "x11x14"
                }, {
                    orientation: "Vertical",
                    size: "x12x16"
                }, {
                    orientation: "Vertical",
                    size: "x8x10"
                }, {
                    orientation: "Vertical",
                    size: "x8x10"
                }, {
                    orientation: "Vertical",
                    size: "x12x16"
                }, {
                    orientation: "Vertical",
                    size: "x11x14"
                }]
            },
            Windsor: {
                name: t.ProductSize.Windsor,
                prints: [{
                    orientation: "Vertical",
                    size: "x11x14"
                }, {
                    orientation: "Vertical",
                    size: "x11x14"
                }, {
                    orientation: "Vertical",
                    size: "x8x10"
                }, {
                    orientation: "Vertical",
                    size: "x8x10"
                }, {
                    orientation: "Vertical",
                    size: "x11x14"
                }, {
                    orientation: "Vertical",
                    size: "x8x10"
                }]
            },
            York: {
                name: t.ProductSize.York,
                prints: [{
                    orientation: "Vertical",
                    size: "x8x10"
                }, {
                    orientation: "Vertical",
                    size: "x11x14"
                }, {
                    orientation: "Vertical",
                    size: "x16x20"
                }, {
                    orientation: "Vertical",
                    size: "x11x14"
                }, {
                    orientation: "Vertical",
                    size: "x8x10"
                }]
            }
        };
        e.s(["GALLERIES_CONFIG", 0, r])
    }
    , 462887, e => {
        "use strict";
        var t = e.i(691013);
        let r = {
            IndividualArtPrint: 1,
            SetOf2ArtPrints: 2,
            SetOf3ArtPrints: 3,
            SetOf4ArtPrints: 4,
            SetOf5ArtPrints: 5,
            SetOf6ArtPrints: 6,
            SetOf8ArtPrints: 8,
            SetOf9ArtPrints: 9,
            SetOf10ArtPrints: 10,
            SetOf12ArtPrints: 12,
            SetOf15ArtPrints: 15,
            Brighton: t.GALLERIES_CONFIG.Brighton.prints.length,
            Bristol: t.GALLERIES_CONFIG.Bristol.prints.length,
            Camden: t.GALLERIES_CONFIG.Camden.prints.length,
            Hudson: t.GALLERIES_CONFIG.Hudson.prints.length,
            Kent: t.GALLERIES_CONFIG.Kent.prints.length,
            Warwick: t.GALLERIES_CONFIG.Warwick.prints.length,
            Windsor: t.GALLERIES_CONFIG.Windsor.prints.length,
            York: t.GALLERIES_CONFIG.York.prints.length,
            PictureFrame: 1,
            SetOf2Frames: 2,
            SetOf3Frames: 3,
            SetOf4Frames: 4,
            SetOf6Frames: 6,
            SetOf9Frames: 9,
            SetOf12Frames: 12
        };
        e.s(["DESIGN_COUNTS", 0, r])
    }
    , 178548, e => {
        "use strict";
        e.s(["PRODUCT_CATEGORIES", 0, ["Art Prints", "Gallery Wall Art", "Picture Frames"], "PRODUCT_CATEGORY_GROUPS", 0, ["Prints", "Private Label"], "PRODUCT_CATEGORY_MAP", 0, {
            IndividualArtPrint: "Art Prints",
            SetOf2ArtPrints: "Art Prints",
            SetOf3ArtPrints: "Art Prints",
            SetOf4ArtPrints: "Art Prints",
            SetOf5ArtPrints: "Art Prints",
            SetOf6ArtPrints: "Art Prints",
            SetOf8ArtPrints: "Art Prints",
            SetOf9ArtPrints: "Art Prints",
            SetOf10ArtPrints: "Art Prints",
            SetOf12ArtPrints: "Art Prints",
            SetOf15ArtPrints: "Art Prints",
            Brighton: "Gallery Wall Art",
            Bristol: "Gallery Wall Art",
            Camden: "Gallery Wall Art",
            Hudson: "Gallery Wall Art",
            Kent: "Gallery Wall Art",
            Warwick: "Gallery Wall Art",
            Windsor: "Gallery Wall Art",
            York: "Gallery Wall Art",
            PictureFrame: "Picture Frames",
            SetOf2Frames: "Picture Frames",
            SetOf3Frames: "Picture Frames",
            SetOf4Frames: "Picture Frames",
            SetOf6Frames: "Picture Frames",
            SetOf9Frames: "Picture Frames",
            SetOf12Frames: "Picture Frames"
        }, "PRODUCT_CATEGORY_TO_CATEGORY_GROUP_MAP", 0, {
            "Art Prints": "Prints",
            "Gallery Wall Art": "Prints",
            "Picture Frames": "Private Label"
        }])
    }
    , 406855, e => {
        "use strict";
        var t = e.i(62056);
        e.i(277940);
        var r = e.i(153078);
        e.i(260835);
        var a = e.i(245974)
            , s = e.i(228337)
            , u = e.i(462887)
            , i = e.i(691013)
            , o = e.i(178548);
        let F = {
                IndividualArtPrint: "Individual Art Print",
                SetOf2ArtPrints: "Set of 2 Art Prints",
                SetOf3ArtPrints: "Set of 3 Art Prints",
                SetOf4ArtPrints: "Set of 4 Art Prints",
                SetOf5ArtPrints: "Set of 5 Art Prints",
                SetOf6ArtPrints: "Set of 6 Art Prints",
                SetOf8ArtPrints: "Set of 8 Art Prints",
                SetOf9ArtPrints: "Set of 9 Art Prints",
                SetOf10ArtPrints: "Set of 10 Art Prints",
                SetOf12ArtPrints: "Set of 12 Art Prints",
                SetOf15ArtPrints: "Set of 15 Art Prints",
                PictureFrame: "Picture Frame",
                SetOf2Frames: "Set of 2 Frames",
                SetOf3Frames: "Set of 3 Frames",
                SetOf4Frames: "Set of 4 Frames",
                SetOf6Frames: "Set of 6 Frames",
                SetOf9Frames: "Set of 9 Frames",
                SetOf12Frames: "Set of 12 Frames",
                Brighton: "Brighton",
                Bristol: "Bristol",
                Camden: "Camden",
                Hudson: "Hudson",
                Kent: "Kent",
                Warwick: "Warwick",
                Windsor: "Windsor",
                York: "York"
            }
            , n = e => e in i.GALLERIES_CONFIG
            , q = new Set([a.FrameStyle.Metal, a.FrameStyle.PremiumMetal])
            , l = e => Object.values(a.FrameStyle).find(t => e.includes(t))
            , x = e => {
                if (e === a.FrameColor.Unframed)
                    return a.FrameColor.Unframed;
                let t = l(e);
                return e.replace(t, "")
            }
            , c = {
                Metal: 1,
                Oak: 2,
                PremiumMetal: 3,
                PremiumOak: 4,
                Unframed: 0
            }
            , d = {
                Metal: "Metal",
                Oak: "Oak",
                PremiumMetal: "Metal",
                PremiumOak: "Oak",
                Unframed: "Unframed"
            }
            , f = {
                Metal: "Standard Metal",
                Oak: "Standard Oak",
                PremiumMetal: "Premium Metal",
                PremiumOak: "Premium Oak",
                Unframed: "Unframed"
            }
            , h = (e, t=!1) => (t ? d : f)[e] ?? ""
            , p = (e, r) => e in a.CatalogProductId || r === t.HAUS_AND_HUES_USER_ID
            , S = (e, r) => e in a.FrameColor || r === t.HAUS_AND_HUES_USER_ID
            , m = (e, t) => o.PRODUCT_CATEGORY_TO_CATEGORY_GROUP_MAP[o.PRODUCT_CATEGORY_MAP[e]] === t
            , P = (e, t) => o.PRODUCT_CATEGORY_MAP[e] === t
            , g = e => P(e, "Picture Frames")
            , A = Object.values(a.ProductSize).filter(e => !n(e))
            , O = new Set(["SemiGlossPoster", "SemiMatteLinenPoster"])
            , C = e => e.replace(/dot/g, ".").replace(/^x/, "")
            , E = s.default.memoize(e => {
                    if (n(e)) {
                        let t, r;
                        return E((t = 0,
                            r = i.GALLERIES_CONFIG[e].prints[0].size,
                            i.GALLERIES_CONFIG[e].prints.forEach(e => {
                                    let {heightInInch: a, widthInInch: s} = E(e.size)
                                        , u = Math.max(a, s);
                                    u > t && (t = u,
                                        r = e.size)
                                }
                            ),
                            r))
                    }
                    let[t,r] = C(e).split("x").map(Number.parseFloat);
                    if (!r || !t)
                        throw Error(`Invalid size: ${e}`);
                    return {
                        heightInInch: r,
                        widthInInch: t
                    }
                }
            )
            , v = e => {
                if (n(e))
                    return s.default.sum(i.GALLERIES_CONFIG[e].prints.map(e => v(e.size)));
                let {heightInInch: r, widthInInch: a} = E(e);
                return r * a / t.INCHES_PER_FOOT ** 2
            }
            , w = e => {
                let {widthInInch: t, heightInInch: r} = E(e);
                return t >= 20 && r >= 20 && (t > 20 || r > 20)
            }
        ;
        e.s(["NON_GALLERY_SIZES", 0, A, "formatProductSize", 0, C, "getAllPublicAndPrivateFrames", 0, () => Object.values(a.HausAndHuesCatalogProductId).filter(g), "getDesignCount", 0, e => u.DESIGN_COUNTS[e], "getEffectiveFrameStyle", 0, (e, t) => e === a.FrameStyle.Oak && w(t) ? a.FrameStyle.PremiumOak : e, "getFrameColorGroup", 0, e => Object.fromEntries(Object.entries(s.default.groupBy(e, l)).sort( ([e], [t]) => c[e] - c[t])), "getFrameColorName", 0, x, "getFrameColorOptions", 0, (e, t=null) => {
            let r = g(e);
            return Object.values(a.HausAndHuesFrameColor).filter(e => S(e, t) && (!r || e !== a.FrameColor.Unframed))
        }
            , "getFrameDisplayName", 0, e => {
                let t = a.HausAndHuesFrameColor[e];
                if (!t)
                    return e;
                if (t === a.FrameColor.Unframed)
                    return "Unframed";
                let r = l(t)
                    , s = x(t)
                    , u = h(r);
                return `${s} ${u}`
            }
            , "getFrameStyleFromColor", 0, l, "getFrameStyleReadableName", 0, h, "getPaperAreaInFeet", 0, v, "getPaperStyleFromType", 0, e => Object.values(a.PaperStyle).find(t => e.includes(t)) ?? null, "getProductCategoriesForGroup", 0, e => o.PRODUCT_CATEGORIES.filter(t => o.PRODUCT_CATEGORY_TO_CATEGORY_GROUP_MAP[t] === e), "getProductName", 0, e => F[e], "getProductsInCategory", 0, (e, t) => Object.values(a.HausAndHuesCatalogProductId).filter(r => P(r, e) && p(r, t)), "getProductsInCategoryGroup", 0, (e, t) => Object.values(a.HausAndHuesCatalogProductId).filter(r => m(r, e) && p(r, t)), "getSizeDimensions", 0, E, "getSizeOptions", 0, e => n(e) ? [a.ProductSize[e]] : g(e) ? Object.values(r.NON_GALLERY_PRODUCT_SIZES_SUPPORTING_FRAMES) : A, "hasOrientationOptions", 0, e => P(e, "Art Prints"), "isDigitalPaperType", 0, e => O.has(e), "isFrameColorAvailableForUser", 0, S, "isGallerySize", 0, n, "isLargeFrameSize", 0, w, "isMetalFrame", 0, e => q.has(e), "isPremiumFrame", 0, e => e.includes("Premium"), "isPrivateLabelFrames", 0, g, "isProductAvailable", 0, p, "isProductInCategoryGroup", 0, m], 406855)
    }
    , 742677, e => {
        "use strict";
        var t = e.i(865136);
        e.s(["NumberUtils", () => t.default])
    }
    , 762211, e => {
        "use strict";
        var t = e.i(539610);
        let r = t.default
            , a = ["US", ...Object.keys(t.default)];
        e.s(["ARTELO_SUPPORTED_COUNTRY_CODES", 0, a, "default", 0, r])
    }
    , 568250, e => {
        "use strict";
        let t = {
            branding: {
                PackageInsert: .6,
                PackageSticker: .2
            },
            frameCosts: {
                Metal: .6,
                Oak: .6,
                PremiumMetal: .81,
                PremiumOak: 1.01,
                Unframed: 0
            },
            framingServiceCosts: [{
                threshold: 16,
                value: {
                    baseCost: 2.5,
                    perExtraFrameCost: 1
                }
            }, {
                threshold: 11,
                value: {
                    baseCost: 2.25,
                    perExtraFrameCost: .75
                }
            }, {
                threshold: 0,
                value: {
                    baseCost: 2,
                    perExtraFrameCost: .5
                }
            }],
            hangingPinsCost: .5,
            inkCosts: {
                digital: .015,
                wideFormat: .51
            },
            laborCosts: {
                framed: {
                    FineArt: 1.5,
                    Photo: 1.5,
                    Poster: 1.1
                },
                unframed: {
                    FineArt: 1,
                    Photo: 1,
                    Poster: .6
                }
            },
            matCosts: {
                x4x6: .88,
                x5dot8x8dot3: 1.25,
                x5x7: .96,
                x6x6: 1.05,
                x6x8: 1.14,
                x8dot3x11dot7: 1.55,
                x8dot5x11: 1.4,
                x8x8: 1.23,
                x8x10: 1.31,
                x8x12: 1.4,
                x9x12: 1.49,
                x10x10: 1.58,
                x11dot7x16dot5: 2,
                x11x14: 1.66,
                x11x17: 1.75,
                x12x12: 1.84,
                x12x16: 1.93,
                x12x18: 2.01,
                x16dot5x23dot4: 2.32,
                x16x16: 2.1,
                x16x20: 2.19,
                x16x24: 2.28,
                x18x18: 2.36,
                x18x24: 2.45,
                x20x20: 2.54,
                x20x28: 2.73,
                x20x30: 2.63,
                x23dot4x33dot1: 2.75,
                x24x24: 2.71,
                x24x30: 2.75,
                x24x32: 2.78,
                x24x36: 2.8
            },
            paperCosts: {
                ArchivalMatteFineArt: {
                    price: .45
                },
                ColdPressFineArt: {
                    price: 1.5
                },
                GermanEtchingFineArt: {
                    price: 4.53
                },
                GlossyPhoto: {
                    price: .99
                },
                GlossyPoster: {
                    price: .23
                },
                HotPressFineArt: {
                    price: 1.5
                },
                LusterPhoto: {
                    price: .71
                },
                MattePhoto: {
                    price: .61
                },
                MattePoster: {
                    price: .29
                },
                PearlFineArt: {
                    price: 3.9
                },
                PearlPhoto: {
                    price: 1.37
                },
                RagSatinPhoto: {
                    price: 3.83
                },
                SemiGlossPoster: {
                    price: .15
                },
                SemiMatteLinenPoster: {
                    price: .36
                },
                SemiMattePhoto: {
                    price: .99
                },
                VelvetFineArt: {
                    price: 2.03
                },
                WatercolorFineArt: {
                    price: 1.33
                }
            },
            profitMargin: {
                framed: .65,
                unframed: [{
                    threshold: 20,
                    value: .475
                }, {
                    threshold: 0,
                    value: .55
                }]
            },
            shipping: {
                estimates: {
                    framed: {
                        Premium: {
                            x4x6: {
                                1: 5.64,
                                2: 7.89,
                                3: 8.21,
                                4: 8.46,
                                5: 8.6,
                                6: 8.81,
                                8: 9.81,
                                9: 10.81,
                                10: 11.12,
                                12: 11.81,
                                15: 16.5
                            },
                            x5dot8x8dot3: {
                                1: 7.34,
                                2: 6.88,
                                3: 9.49,
                                4: 9.75,
                                5: 9.8,
                                6: 10,
                                8: 11,
                                9: 12,
                                10: 12.45,
                                12: 13,
                                15: 17
                            },
                            x5x7: {
                                1: 6.77,
                                2: 8.07,
                                3: 8.55,
                                4: 8.81,
                                5: 8.91,
                                6: 9.51,
                                8: 9.81,
                                9: 10.81,
                                10: 11.23,
                                12: 12.81,
                                15: 16.5
                            },
                            x6x6: {
                                1: 6.77,
                                2: 8.07,
                                3: 8.55,
                                4: 8.91,
                                5: 9.31,
                                6: 9.51,
                                8: 9.81,
                                9: 10.81,
                                10: 11.81,
                                12: 12.81,
                                15: 16.5
                            },
                            x6x8: {
                                1: 7.34,
                                2: 8.48,
                                3: 8.65,
                                4: 8.91,
                                5: 9.8,
                                6: 10,
                                8: 11,
                                9: 12,
                                10: 12.45,
                                12: 13,
                                15: 17
                            },
                            x8dot3x11dot7: {
                                1: 7.48,
                                2: 8.49,
                                3: 8.49,
                                4: 8.65,
                                5: 9.11,
                                6: 9.26,
                                8: 10.26,
                                9: 11.26,
                                10: 11.59,
                                12: 12.26,
                                15: 17
                            },
                            x8dot5x11: {
                                1: 7.65,
                                2: 8.99,
                                3: 9.24,
                                4: 9.35,
                                5: 9.95,
                                6: 10.88,
                                8: 12.12,
                                9: 13.12,
                                10: 13.51,
                                12: 15.12,
                                15: 17.65
                            },
                            x8x8: {
                                1: 7.48,
                                2: 8.61,
                                3: 8.81,
                                4: 8.91,
                                5: 9.9,
                                6: 10.63,
                                8: 11.63,
                                9: 12.63,
                                10: 13.48,
                                12: 14.63,
                                15: 17.33
                            },
                            x8x10: {
                                1: 7.48,
                                2: 8.74,
                                3: 8.84,
                                4: 8.91,
                                5: 9.9,
                                6: 10.05,
                                8: 11.63,
                                9: 12.68,
                                10: 13.48,
                                12: 14.68,
                                15: 17.5
                            },
                            x8x12: {
                                1: 7.48,
                                2: 8.49,
                                3: 8.49,
                                4: 8.65,
                                5: 9.11,
                                6: 9.26,
                                8: 10.26,
                                9: 11.26,
                                10: 11.59,
                                12: 12.26,
                                15: 17
                            },
                            x9x12: {
                                1: 7.78,
                                2: 9.04,
                                3: 9.35,
                                4: 9.45,
                                5: 9.51,
                                6: 10.88,
                                8: 12.12,
                                9: 13.26,
                                10: 13.59,
                                12: 16.25,
                                15: 18
                            },
                            x10x10: {
                                1: 7.48,
                                2: 8.99,
                                3: 8.97,
                                4: 9.65,
                                5: 9.9,
                                6: 10.88,
                                8: 12.12,
                                9: 13.29,
                                10: 13.59,
                                12: 16.25,
                                15: 18
                            },
                            x11dot7x16dot5: {
                                1: 8.73,
                                2: 9.13,
                                3: 9.13,
                                4: 9.64,
                                5: 10.92,
                                6: 11.28,
                                8: 12.28,
                                9: 13.28,
                                10: 13.65,
                                12: 14.28,
                                15: 18.5
                            },
                            x11x14: {
                                1: 8.06,
                                2: 9.05,
                                3: 9.45,
                                4: 9.73,
                                5: 10.06,
                                6: 10.88,
                                8: 12.73,
                                9: 13.29,
                                10: 13.59,
                                12: 16.75,
                                15: 17.5
                            },
                            x11x17: {
                                1: 8.73,
                                2: 9.29,
                                3: 9.49,
                                4: 10.13,
                                5: 10.84,
                                6: 11.21,
                                8: 12.61,
                                9: 13.29,
                                10: 13.65,
                                12: 16.75,
                                15: 18.5
                            },
                            x12x12: {
                                1: 8.66,
                                2: 9.13,
                                3: 9.65,
                                4: 9.8,
                                5: 10.11,
                                6: 10.88,
                                8: 12.18,
                                9: 13.58,
                                10: 13.58,
                                12: 16.75,
                                15: 18
                            },
                            x12x16: {
                                1: 8.73,
                                2: 9.13,
                                3: 9.33,
                                4: 10.24,
                                5: 11.02,
                                6: 11.28,
                                8: 12.78,
                                9: 13.58,
                                10: 13.65,
                                12: 16.75,
                                15: 18.5
                            },
                            x12x18: {
                                1: 9.29,
                                2: 9.37,
                                3: 9.47,
                                4: 10.51,
                                5: 12.26,
                                6: 13.06,
                                8: 14.06,
                                9: 15.06,
                                10: 15.67,
                                12: 16.75,
                                15: 19.5
                            },
                            x16dot5x23dot4: {
                                1: 10.74,
                                2: 13.06,
                                3: 13.06,
                                4: 13.91,
                                5: 14.34,
                                6: 14.87,
                                8: 15.87,
                                9: 16.87,
                                10: 17.23,
                                12: 17.87,
                                15: 21.5
                            },
                            x16x16: {
                                1: 9.59,
                                2: 9.64,
                                3: 9.94,
                                4: 10.87,
                                5: 12.31,
                                6: 12.48,
                                8: 13.48,
                                9: 15.48,
                                10: 15.91,
                                12: 16.75,
                                15: 19.5
                            },
                            x16x20: {
                                1: 10.43,
                                2: 10.83,
                                3: 10.93,
                                4: 12.37,
                                5: 12.68,
                                6: 12.95,
                                8: 13.95,
                                9: 14.95,
                                10: 16.61,
                                12: 16.95,
                                15: 19.5
                            },
                            x16x24: {
                                1: 10.74,
                                2: 13.06,
                                3: 13.06,
                                4: 13.91,
                                5: 14.34,
                                6: 14.87,
                                8: 15.87,
                                9: 16.87,
                                10: 17.23,
                                12: 17.87,
                                15: 21.5
                            },
                            x18x18: {
                                1: 10.36,
                                2: 12.04,
                                3: 12.04,
                                4: 12.63,
                                5: 13.04,
                                6: 13.91,
                                8: 14.15,
                                9: 16.21,
                                10: 16.66,
                                12: 17.3,
                                15: 21.5
                            },
                            x18x24: {
                                1: 10.66,
                                2: 13.74,
                                3: 13.94,
                                4: 14.02,
                                5: 14.71,
                                6: 15.11,
                                8: 16.11,
                                9: 17.11,
                                10: 17.66,
                                12: 18.11,
                                15: 22
                            },
                            x20x20: {
                                1: 10.74,
                                2: 12.82,
                                3: 12.82,
                                4: 13.09,
                                5: 13.79,
                                6: 14.59,
                                8: 15.59,
                                9: 16.59,
                                10: 16.98,
                                12: 17.59,
                                15: 22
                            },
                            x20x28: {
                                1: 11.22,
                                2: 12.91,
                                3: 12.91,
                                4: 13.78,
                                5: 15.77,
                                6: 16.17,
                                8: 17.17,
                                9: 18.17,
                                10: 19.19,
                                12: 20.17,
                                15: 25
                            },
                            x20x30: {
                                1: 11.22,
                                2: 12.91,
                                3: 12.91,
                                4: 13.78,
                                5: 15.77,
                                6: 16.17,
                                8: 17.17,
                                9: 18.17,
                                10: 19.19,
                                12: 20.17,
                                15: 25
                            },
                            x23dot4x33dot1: {
                                1: 20.88,
                                2: 25.91,
                                3: 41.85,
                                4: 62.73,
                                5: 67.76,
                                6: 83.7,
                                8: 109.61,
                                9: 125.55,
                                10: 146.43,
                                12: 167.4,
                                15: 190.3
                            },
                            x24x24: {
                                1: 11.11,
                                2: 12.34,
                                3: 12.54,
                                4: 13.02,
                                5: 15.44,
                                6: 16.01,
                                8: 17.01,
                                9: 18.01,
                                10: 19.01,
                                12: 20.01,
                                15: 25
                            },
                            x24x30: {
                                1: 20.88,
                                2: 25.91,
                                3: 41.85,
                                4: 62.73,
                                5: 67.76,
                                6: 83.7,
                                8: 109.61,
                                9: 125.55,
                                10: 146.43,
                                12: 167.4,
                                15: 190.3
                            },
                            x24x32: {
                                1: 20.88,
                                2: 25.91,
                                3: 41.85,
                                4: 62.73,
                                5: 67.76,
                                6: 83.7,
                                8: 109.61,
                                9: 125.55,
                                10: 146.43,
                                12: 167.4,
                                15: 190.3
                            },
                            x24x36: {
                                1: 20.88,
                                2: 25.91,
                                3: 41.85,
                                4: 62.73,
                                5: 67.76,
                                6: 83.7,
                                8: 109.61,
                                9: 125.55,
                                10: 146.43,
                                12: 167.4,
                                15: 190.3
                            }
                        },
                        Standard: {
                            x4x6: {
                                1: 5.34,
                                2: 6.86,
                                3: 6.96,
                                4: 7.36,
                                5: 7.51,
                                6: 7.66,
                                8: 8.66,
                                9: 9.66,
                                10: 9.66,
                                12: 10.66,
                                15: 14.5
                            },
                            x5dot8x8dot3: {
                                1: 5.34,
                                2: 5.98,
                                3: 8.25,
                                4: 8.48,
                                5: 8.64,
                                6: 8.7,
                                8: 9.7,
                                9: 9.7,
                                10: 10.06,
                                12: 10.5,
                                15: 15
                            },
                            x5x7: {
                                1: 5.45,
                                2: 7.02,
                                3: 7.22,
                                4: 7.66,
                                5: 7.76,
                                6: 7.96,
                                8: 8.66,
                                9: 9.66,
                                10: 9.66,
                                12: 9.66,
                                15: 14.5
                            },
                            x6x6: {
                                1: 5.66,
                                2: 7.02,
                                3: 7.32,
                                4: 7.66,
                                5: 7.86,
                                6: 7.96,
                                8: 8.66,
                                9: 9.66,
                                10: 9.66,
                                12: 10.66,
                                15: 14.5
                            },
                            x6x8: {
                                1: 5.73,
                                2: 7.21,
                                3: 7.25,
                                4: 7.78,
                                5: 8.14,
                                6: 8.7,
                                8: 8.7,
                                9: 9.7,
                                10: 10.06,
                                12: 10.5,
                                15: 15
                            },
                            x8dot3x11dot7: {
                                1: 6.61,
                                2: 7.38,
                                3: 7.38,
                                4: 7.52,
                                5: 7.89,
                                6: 8.05,
                                8: 8.05,
                                9: 9.05,
                                10: 10.06,
                                12: 10.5,
                                15: 15
                            },
                            x8dot5x11: {
                                1: 6.61,
                                2: 7.34,
                                3: 8.34,
                                4: 8.49,
                                5: 8.74,
                                6: 8.93,
                                8: 8.93,
                                9: 10.03,
                                10: 10.06,
                                12: 10.5,
                                15: 15
                            },
                            x8x8: {
                                1: 6.05,
                                2: 7.25,
                                3: 7.31,
                                4: 7.88,
                                5: 8.21,
                                6: 8.75,
                                8: 8.8,
                                9: 9.96,
                                10: 10.06,
                                12: 10.5,
                                15: 15
                            },
                            x8x10: {
                                1: 6.07,
                                2: 7.34,
                                3: 7.34,
                                4: 7.99,
                                5: 8.46,
                                6: 8.9,
                                8: 8.9,
                                9: 9.96,
                                10: 10.06,
                                12: 10.5,
                                15: 15.5
                            },
                            x8x12: {
                                1: 6.61,
                                2: 7.38,
                                3: 7.38,
                                4: 7.52,
                                5: 7.89,
                                6: 8.05,
                                8: 8.05,
                                9: 9.05,
                                10: 10.06,
                                12: 10.5,
                                15: 15
                            },
                            x9x12: {
                                1: 6.61,
                                2: 7.38,
                                3: 8.38,
                                4: 8.52,
                                5: 8.89,
                                6: 9.05,
                                8: 9.05,
                                9: 10.05,
                                10: 10.06,
                                12: 10.5,
                                15: 16
                            },
                            x10x10: {
                                1: 6.61,
                                2: 7.45,
                                3: 7.45,
                                4: 8.52,
                                5: 8.58,
                                6: 9.08,
                                8: 9.08,
                                9: 9.98,
                                10: 10.66,
                                12: 10.95,
                                15: 17
                            },
                            x11dot7x16dot5: {
                                1: 7.47,
                                2: 7.94,
                                3: 7.94,
                                4: 8.38,
                                5: 9.16,
                                6: 9.81,
                                8: 10.81,
                                9: 10.81,
                                10: 11.38,
                                12: 11.81,
                                15: 16.5
                            },
                            x11x14: {
                                1: 6.96,
                                2: 7.52,
                                3: 8.42,
                                4: 8.65,
                                5: 8.95,
                                6: 9.33,
                                8: 9.33,
                                9: 10.06,
                                10: 10.06,
                                12: 10.5,
                                15: 15.5
                            },
                            x11x17: {
                                1: 6.98,
                                2: 8.08,
                                3: 8.38,
                                4: 8.81,
                                5: 9.34,
                                6: 9.75,
                                8: 10.75,
                                9: 10.75,
                                10: 11.17,
                                12: 11.75,
                                15: 16.5
                            },
                            x12x12: {
                                1: 6.96,
                                2: 7.52,
                                3: 8.42,
                                4: 8.91,
                                5: 9.09,
                                6: 9.2,
                                8: 10.2,
                                9: 10.2,
                                10: 10.69,
                                12: 11.2,
                                15: 16
                            },
                            x12x16: {
                                1: 7.47,
                                2: 7.94,
                                3: 8.64,
                                4: 8.88,
                                5: 9.16,
                                6: 9.81,
                                8: 10.81,
                                9: 10.81,
                                10: 11.38,
                                12: 11.81,
                                15: 16.5
                            },
                            x12x18: {
                                1: 7.51,
                                2: 8.06,
                                3: 8.86,
                                4: 8.88,
                                5: 10.87,
                                6: 11.36,
                                8: 12.36,
                                9: 12.36,
                                10: 12.96,
                                12: 13.36,
                                15: 17.5
                            },
                            x16dot5x23dot4: {
                                1: 8.06,
                                2: 11.36,
                                3: 11.36,
                                4: 12.1,
                                5: 12.64,
                                6: 12.93,
                                8: 13.93,
                                9: 13.93,
                                10: 14.35,
                                12: 14.93,
                                15: 19.5
                            },
                            x16x16: {
                                1: 7.49,
                                2: 8.38,
                                3: 8.78,
                                4: 9.45,
                                5: 10.34,
                                6: 10.85,
                                8: 11.85,
                                9: 11.85,
                                10: 12.45,
                                12: 12.85,
                                15: 17.5
                            },
                            x16x20: {
                                1: 7.54,
                                2: 9.42,
                                3: 9.42,
                                4: 10.76,
                                5: 11.01,
                                6: 11.76,
                                8: 12.26,
                                9: 12.56,
                                10: 12.68,
                                12: 14.26,
                                15: 19.5
                            },
                            x16x24: {
                                1: 8.06,
                                2: 11.36,
                                3: 11.36,
                                4: 12.1,
                                5: 12.64,
                                6: 12.93,
                                8: 13.93,
                                9: 13.93,
                                10: 14.35,
                                12: 14.93,
                                15: 19.5
                            },
                            x18x18: {
                                1: 7.66,
                                2: 10.36,
                                3: 10.71,
                                4: 10.99,
                                5: 11.16,
                                6: 12.21,
                                8: 13.04,
                                9: 14.01,
                                10: 14.69,
                                12: 15.97,
                                15: 20.5
                            },
                            x18x24: {
                                1: 8.47,
                                2: 11.95,
                                3: 11.95,
                                4: 12.19,
                                5: 12.97,
                                6: 13.14,
                                8: 14.14,
                                9: 14.14,
                                10: 14.71,
                                12: 15.14,
                                15: 20.5
                            },
                            x20x20: {
                                1: 8.88,
                                2: 11.15,
                                3: 11.15,
                                4: 11.38,
                                5: 12.16,
                                6: 12.69,
                                8: 13.69,
                                9: 14.69,
                                10: 15.69,
                                12: 16.69,
                                15: 21
                            },
                            x20x28: {
                                1: 9.37,
                                2: 11.23,
                                3: 11.23,
                                4: 11.98,
                                5: 13.64,
                                6: 14.06,
                                8: 15.06,
                                9: 15.06,
                                10: 15.64,
                                12: 17.06,
                                15: 21.5
                            },
                            x20x30: {
                                1: 9.37,
                                2: 11.65,
                                3: 12.23,
                                4: 12.98,
                                5: 13.64,
                                6: 14.06,
                                8: 15.06,
                                9: 15.06,
                                10: 15.64,
                                12: 17.06,
                                15: 21.5
                            },
                            x23dot4x33dot1: {
                                1: 13.08,
                                2: 13.14,
                                3: 13.14,
                                4: 29.96,
                                5: 31.53,
                                6: 32.2,
                                8: 34.2,
                                9: 34.2,
                                10: 35.2,
                                12: 39.2,
                                15: 46.3
                            },
                            x24x24: {
                                1: 9.69,
                                2: 11.23,
                                3: 12.23,
                                4: 12.55,
                                5: 13.14,
                                6: 13.96,
                                8: 14.54,
                                9: 14.99,
                                10: 16.11,
                                12: 16.92,
                                15: 21.5
                            },
                            x24x30: {
                                1: 13.08,
                                2: 13.14,
                                3: 13.14,
                                4: 29.96,
                                5: 31.53,
                                6: 32.2,
                                8: 34.2,
                                9: 34.2,
                                10: 35.2,
                                12: 39.2,
                                15: 46.3
                            },
                            x24x32: {
                                1: 13.08,
                                2: 13.14,
                                3: 13.14,
                                4: 29.96,
                                5: 31.53,
                                6: 32.2,
                                8: 34.2,
                                9: 34.2,
                                10: 35.2,
                                12: 39.2,
                                15: 46.3
                            },
                            x24x36: {
                                1: 19.33,
                                2: 19.33,
                                3: 29.96,
                                4: 29.96,
                                5: 31.53,
                                6: 32.2,
                                8: 34.2,
                                9: 34.2,
                                10: 35.2,
                                12: 39.2,
                                15: 46.3
                            }
                        }
                    },
                    framedGallery: {
                        Brighton: 10.45,
                        Bristol: 10.45,
                        Camden: 10.45,
                        Hudson: 10.45,
                        Kent: 10.45,
                        Warwick: 10.45,
                        Windsor: 10.45,
                        York: 10.45
                    },
                    unframed: [{
                        threshold: 24,
                        value: 8.1
                    }, {
                        threshold: 20,
                        value: 7.1
                    }, {
                        threshold: 0,
                        value: 4.91
                    }]
                },
                packaging: {
                    boxCost: .08893,
                    framedBoxes: {
                        Premium: {
                            x4x6: {
                                1: {
                                    squareFeet: 1.84
                                },
                                2: {
                                    squareFeet: 3.33
                                },
                                3: {
                                    squareFeet: 3.33
                                },
                                4: {
                                    squareFeet: 3.92
                                },
                                5: {
                                    squareFeet: 4.31
                                },
                                6: {
                                    squareFeet: 4.55
                                },
                                8: {
                                    squareFeet: 4.55
                                },
                                9: {
                                    squareFeet: 4.55
                                },
                                10: {
                                    squareFeet: 5.55
                                },
                                12: {
                                    squareFeet: 5.55
                                },
                                15: {
                                    squareFeet: 6.55
                                }
                            },
                            x5dot8x8dot3: {
                                1: {
                                    squareFeet: 3.7
                                },
                                2: {
                                    squareFeet: 6.62
                                },
                                3: {
                                    squareFeet: 7
                                },
                                4: {
                                    squareFeet: 7.25
                                },
                                5: {
                                    squareFeet: 7.45
                                },
                                6: {
                                    squareFeet: 7.85
                                },
                                8: {
                                    squareFeet: 8.45
                                },
                                9: {
                                    squareFeet: 8.65
                                },
                                10: {
                                    squareFeet: 10.35
                                },
                                12: {
                                    squareFeet: 10.55
                                },
                                15: {
                                    squareFeet: 12.45
                                }
                            },
                            x5x7: {
                                1: {
                                    squareFeet: 2.28
                                },
                                2: {
                                    squareFeet: 3.6
                                },
                                3: {
                                    squareFeet: 3.6
                                },
                                4: {
                                    squareFeet: 5.32
                                },
                                5: {
                                    squareFeet: 5.32
                                },
                                6: {
                                    squareFeet: 6.08
                                },
                                8: {
                                    squareFeet: 6.08
                                },
                                9: {
                                    squareFeet: 6.08
                                },
                                10: {
                                    squareFeet: 7.08
                                },
                                12: {
                                    squareFeet: 7.08
                                },
                                15: {
                                    squareFeet: 8.08
                                }
                            },
                            x6x6: {
                                1: {
                                    squareFeet: 3
                                },
                                2: {
                                    squareFeet: 5
                                },
                                3: {
                                    squareFeet: 5
                                },
                                4: {
                                    squareFeet: 6.5
                                },
                                5: {
                                    squareFeet: 7
                                },
                                6: {
                                    squareFeet: 7
                                },
                                8: {
                                    squareFeet: 8
                                },
                                9: {
                                    squareFeet: 8
                                },
                                10: {
                                    squareFeet: 10
                                },
                                12: {
                                    squareFeet: 10
                                },
                                15: {
                                    squareFeet: 11
                                }
                            },
                            x6x8: {
                                1: {
                                    squareFeet: 3.7
                                },
                                2: {
                                    squareFeet: 6.62
                                },
                                3: {
                                    squareFeet: 6.62
                                },
                                4: {
                                    squareFeet: 7
                                },
                                5: {
                                    squareFeet: 7.17
                                },
                                6: {
                                    squareFeet: 7.27
                                },
                                8: {
                                    squareFeet: 8.27
                                },
                                9: {
                                    squareFeet: 8.27
                                },
                                10: {
                                    squareFeet: 10.27
                                },
                                12: {
                                    squareFeet: 10.27
                                },
                                15: {
                                    squareFeet: 12.27
                                }
                            },
                            x8dot3x11dot7: {
                                1: {
                                    squareFeet: 4.65
                                },
                                2: {
                                    squareFeet: 8.8
                                },
                                3: {
                                    squareFeet: 8.95
                                },
                                4: {
                                    squareFeet: 9.05
                                },
                                5: {
                                    squareFeet: 9.65
                                },
                                6: {
                                    squareFeet: 10.75
                                },
                                8: {
                                    squareFeet: 11.65
                                },
                                9: {
                                    squareFeet: 11.75
                                },
                                10: {
                                    squareFeet: 12.65
                                },
                                12: {
                                    squareFeet: 12.85
                                },
                                15: {
                                    squareFeet: 14.65
                                }
                            },
                            x8dot5x11: {
                                1: {
                                    squareFeet: 4.44
                                },
                                2: {
                                    squareFeet: 8.25
                                },
                                3: {
                                    squareFeet: 8.25
                                },
                                4: {
                                    squareFeet: 8.98
                                },
                                5: {
                                    squareFeet: 8.98
                                },
                                6: {
                                    squareFeet: 10.38
                                },
                                8: {
                                    squareFeet: 11.38
                                },
                                9: {
                                    squareFeet: 11.38
                                },
                                10: {
                                    squareFeet: 12.38
                                },
                                12: {
                                    squareFeet: 12.38
                                },
                                15: {
                                    squareFeet: 14.38
                                }
                            },
                            x8x8: {
                                1: {
                                    squareFeet: 3.7
                                },
                                2: {
                                    squareFeet: 6.62
                                },
                                3: {
                                    squareFeet: 6.62
                                },
                                4: {
                                    squareFeet: 7
                                },
                                5: {
                                    squareFeet: 7.5
                                },
                                6: {
                                    squareFeet: 7.97
                                },
                                8: {
                                    squareFeet: 8.27
                                },
                                9: {
                                    squareFeet: 8.27
                                },
                                10: {
                                    squareFeet: 9.27
                                },
                                12: {
                                    squareFeet: 9.27
                                },
                                15: {
                                    squareFeet: 11.27
                                }
                            },
                            x8x10: {
                                1: {
                                    squareFeet: 4.12
                                },
                                2: {
                                    squareFeet: 6.81
                                },
                                3: {
                                    squareFeet: 6.81
                                },
                                4: {
                                    squareFeet: 7.56
                                },
                                5: {
                                    squareFeet: 7.85
                                },
                                6: {
                                    squareFeet: 8.19
                                },
                                8: {
                                    squareFeet: 9.19
                                },
                                9: {
                                    squareFeet: 9.19
                                },
                                10: {
                                    squareFeet: 10.19
                                },
                                12: {
                                    squareFeet: 10.19
                                },
                                15: {
                                    squareFeet: 12.19
                                }
                            },
                            x8x12: {
                                1: {
                                    squareFeet: 4.65
                                },
                                2: {
                                    squareFeet: 8.8
                                },
                                3: {
                                    squareFeet: 8.95
                                },
                                4: {
                                    squareFeet: 9.05
                                },
                                5: {
                                    squareFeet: 9.65
                                },
                                6: {
                                    squareFeet: 10.75
                                },
                                8: {
                                    squareFeet: 11.65
                                },
                                9: {
                                    squareFeet: 11.75
                                },
                                10: {
                                    squareFeet: 12.65
                                },
                                12: {
                                    squareFeet: 12.85
                                },
                                15: {
                                    squareFeet: 14.65
                                }
                            },
                            x9x12: {
                                1: {
                                    squareFeet: 4.57
                                },
                                2: {
                                    squareFeet: 8.73
                                },
                                3: {
                                    squareFeet: 8.73
                                },
                                4: {
                                    squareFeet: 9.21
                                },
                                5: {
                                    squareFeet: 9.54
                                },
                                6: {
                                    squareFeet: 10.59
                                },
                                8: {
                                    squareFeet: 11.59
                                },
                                9: {
                                    squareFeet: 11.59
                                },
                                10: {
                                    squareFeet: 12.59
                                },
                                12: {
                                    squareFeet: 12.59
                                },
                                15: {
                                    squareFeet: 14.59
                                }
                            },
                            x10x10: {
                                1: {
                                    squareFeet: 4.45
                                },
                                2: {
                                    squareFeet: 8.61
                                },
                                3: {
                                    squareFeet: 8.61
                                },
                                4: {
                                    squareFeet: 10.35
                                },
                                5: {
                                    squareFeet: 10.77
                                },
                                6: {
                                    squareFeet: 11.02
                                },
                                8: {
                                    squareFeet: 12.02
                                },
                                9: {
                                    squareFeet: 12.02
                                },
                                10: {
                                    squareFeet: 13.02
                                },
                                12: {
                                    squareFeet: 13.02
                                },
                                15: {
                                    squareFeet: 15.02
                                }
                            },
                            x11dot7x16dot5: {
                                1: {
                                    squareFeet: 6.6
                                },
                                2: {
                                    squareFeet: 14.35
                                },
                                3: {
                                    squareFeet: 14.45
                                },
                                4: {
                                    squareFeet: 14.65
                                },
                                5: {
                                    squareFeet: 14.85
                                },
                                6: {
                                    squareFeet: 14.95
                                },
                                8: {
                                    squareFeet: 15.55
                                },
                                9: {
                                    squareFeet: 15.65
                                },
                                10: {
                                    squareFeet: 16.55
                                },
                                12: {
                                    squareFeet: 16.95
                                },
                                15: {
                                    squareFeet: 18.85
                                }
                            },
                            x11x14: {
                                1: {
                                    squareFeet: 5.63
                                },
                                2: {
                                    squareFeet: 10.45
                                },
                                3: {
                                    squareFeet: 10.45
                                },
                                4: {
                                    squareFeet: 10.94
                                },
                                5: {
                                    squareFeet: 11.55
                                },
                                6: {
                                    squareFeet: 11.91
                                },
                                8: {
                                    squareFeet: 12.91
                                },
                                9: {
                                    squareFeet: 12.91
                                },
                                10: {
                                    squareFeet: 13.91
                                },
                                12: {
                                    squareFeet: 13.91
                                },
                                15: {
                                    squareFeet: 15.91
                                }
                            },
                            x11x17: {
                                1: {
                                    squareFeet: 6.2
                                },
                                2: {
                                    squareFeet: 13.77
                                },
                                3: {
                                    squareFeet: 13.77
                                },
                                4: {
                                    squareFeet: 13.85
                                },
                                5: {
                                    squareFeet: 13.85
                                },
                                6: {
                                    squareFeet: 13.91
                                },
                                8: {
                                    squareFeet: 14.91
                                },
                                9: {
                                    squareFeet: 14.91
                                },
                                10: {
                                    squareFeet: 15.91
                                },
                                12: {
                                    squareFeet: 15.91
                                },
                                15: {
                                    squareFeet: 17.91
                                }
                            },
                            x12x12: {
                                1: {
                                    squareFeet: 4.97
                                },
                                2: {
                                    squareFeet: 10.94
                                },
                                3: {
                                    squareFeet: 10.94
                                },
                                4: {
                                    squareFeet: 11.57
                                },
                                5: {
                                    squareFeet: 12.08
                                },
                                6: {
                                    squareFeet: 12.56
                                },
                                8: {
                                    squareFeet: 13.56
                                },
                                9: {
                                    squareFeet: 13.56
                                },
                                10: {
                                    squareFeet: 14.56
                                },
                                12: {
                                    squareFeet: 14.56
                                },
                                15: {
                                    squareFeet: 16.56
                                }
                            },
                            x12x16: {
                                1: {
                                    squareFeet: 6.5
                                },
                                2: {
                                    squareFeet: 14.29
                                },
                                3: {
                                    squareFeet: 14.29
                                },
                                4: {
                                    squareFeet: 14.33
                                },
                                5: {
                                    squareFeet: 14.39
                                },
                                6: {
                                    squareFeet: 14.39
                                },
                                8: {
                                    squareFeet: 15.39
                                },
                                9: {
                                    squareFeet: 15.39
                                },
                                10: {
                                    squareFeet: 16.39
                                },
                                12: {
                                    squareFeet: 16.39
                                },
                                15: {
                                    squareFeet: 18.39
                                }
                            },
                            x12x18: {
                                1: {
                                    squareFeet: 7.31
                                },
                                2: {
                                    squareFeet: 14.89
                                },
                                3: {
                                    squareFeet: 14.89
                                },
                                4: {
                                    squareFeet: 14.89
                                },
                                5: {
                                    squareFeet: 14.89
                                },
                                6: {
                                    squareFeet: 14.89
                                },
                                8: {
                                    squareFeet: 15.89
                                },
                                9: {
                                    squareFeet: 15.89
                                },
                                10: {
                                    squareFeet: 16.89
                                },
                                12: {
                                    squareFeet: 16.89
                                },
                                15: {
                                    squareFeet: 18.89
                                }
                            },
                            x16dot5x23dot4: {
                                1: {
                                    squareFeet: 6.6
                                },
                                2: {
                                    squareFeet: 14.35
                                },
                                3: {
                                    squareFeet: 14.45
                                },
                                4: {
                                    squareFeet: 14.65
                                },
                                5: {
                                    squareFeet: 14.85
                                },
                                6: {
                                    squareFeet: 14.95
                                },
                                8: {
                                    squareFeet: 15.55
                                },
                                9: {
                                    squareFeet: 15.65
                                },
                                10: {
                                    squareFeet: 16.55
                                },
                                12: {
                                    squareFeet: 16.95
                                },
                                15: {
                                    squareFeet: 18.85
                                }
                            },
                            x16x16: {
                                1: {
                                    squareFeet: 7.56
                                },
                                2: {
                                    squareFeet: 20.99
                                },
                                3: {
                                    squareFeet: 20.99
                                },
                                4: {
                                    squareFeet: 22.44
                                },
                                5: {
                                    squareFeet: 22.95
                                },
                                6: {
                                    squareFeet: 23.99
                                },
                                8: {
                                    squareFeet: 24.99
                                },
                                9: {
                                    squareFeet: 25.99
                                },
                                10: {
                                    squareFeet: 27.99
                                },
                                12: {
                                    squareFeet: 27.99
                                },
                                15: {
                                    squareFeet: 30.99
                                }
                            },
                            x16x20: {
                                1: {
                                    squareFeet: 9.59
                                },
                                2: {
                                    squareFeet: 20.87
                                },
                                3: {
                                    squareFeet: 20.87
                                },
                                4: {
                                    squareFeet: 22.09
                                },
                                5: {
                                    squareFeet: 23.5
                                },
                                6: {
                                    squareFeet: 23.64
                                },
                                8: {
                                    squareFeet: 25.64
                                },
                                9: {
                                    squareFeet: 26.64
                                },
                                10: {
                                    squareFeet: 29.64
                                },
                                12: {
                                    squareFeet: 29.64
                                },
                                15: {
                                    squareFeet: 33.64
                                }
                            },
                            x16x24: {
                                1: {
                                    squareFeet: 16.63
                                },
                                2: {
                                    squareFeet: 26.29
                                },
                                3: {
                                    squareFeet: 26.29
                                },
                                4: {
                                    squareFeet: 26.46
                                },
                                5: {
                                    squareFeet: 27
                                },
                                6: {
                                    squareFeet: 27.02
                                },
                                8: {
                                    squareFeet: 28.02
                                },
                                9: {
                                    squareFeet: 28.02
                                },
                                10: {
                                    squareFeet: 30.02
                                },
                                12: {
                                    squareFeet: 30.02
                                },
                                15: {
                                    squareFeet: 34.02
                                }
                            },
                            x18x18: {
                                1: {
                                    squareFeet: 14
                                },
                                2: {
                                    squareFeet: 28
                                },
                                3: {
                                    squareFeet: 28
                                },
                                4: {
                                    squareFeet: 30
                                },
                                5: {
                                    squareFeet: 30
                                },
                                6: {
                                    squareFeet: 30
                                },
                                8: {
                                    squareFeet: 32
                                },
                                9: {
                                    squareFeet: 32
                                },
                                10: {
                                    squareFeet: 34
                                },
                                12: {
                                    squareFeet: 34
                                },
                                15: {
                                    squareFeet: 39
                                }
                            },
                            x18x24: {
                                1: {
                                    squareFeet: 16.62
                                },
                                2: {
                                    squareFeet: 30.87
                                },
                                3: {
                                    squareFeet: 30.87
                                },
                                4: {
                                    squareFeet: 31.34
                                },
                                5: {
                                    squareFeet: 32.06
                                },
                                6: {
                                    squareFeet: 32.2
                                },
                                8: {
                                    squareFeet: 34.2
                                },
                                9: {
                                    squareFeet: 35.2
                                },
                                10: {
                                    squareFeet: 37.2
                                },
                                12: {
                                    squareFeet: 37.2
                                },
                                15: {
                                    squareFeet: 42
                                }
                            },
                            x20x20: {
                                1: {
                                    squareFeet: 15.17
                                },
                                2: {
                                    squareFeet: 32.82
                                },
                                3: {
                                    squareFeet: 32.82
                                },
                                4: {
                                    squareFeet: 32.83
                                },
                                5: {
                                    squareFeet: 33.55
                                },
                                6: {
                                    squareFeet: 34.22
                                },
                                8: {
                                    squareFeet: 35.22
                                },
                                9: {
                                    squareFeet: 36.22
                                },
                                10: {
                                    squareFeet: 38.22
                                },
                                12: {
                                    squareFeet: 38.22
                                },
                                15: {
                                    squareFeet: 42
                                }
                            },
                            x20x28: {
                                1: {
                                    squareFeet: 25.5
                                },
                                2: {
                                    squareFeet: 45
                                },
                                3: {
                                    squareFeet: 45
                                },
                                4: {
                                    squareFeet: 75
                                },
                                5: {
                                    squareFeet: 95
                                },
                                6: {
                                    squareFeet: 95
                                },
                                8: {
                                    squareFeet: 142
                                },
                                9: {
                                    squareFeet: 142
                                },
                                10: {
                                    squareFeet: 170
                                },
                                12: {
                                    squareFeet: 190
                                },
                                15: {
                                    squareFeet: 210
                                }
                            },
                            x20x30: {
                                1: {
                                    squareFeet: 21.3
                                },
                                2: {
                                    squareFeet: 36.89
                                },
                                3: {
                                    squareFeet: 36.89
                                },
                                4: {
                                    squareFeet: 39.1
                                },
                                5: {
                                    squareFeet: 40.08
                                },
                                6: {
                                    squareFeet: 41.4
                                },
                                8: {
                                    squareFeet: 43.4
                                },
                                9: {
                                    squareFeet: 44.4
                                },
                                10: {
                                    squareFeet: 49.4
                                },
                                12: {
                                    squareFeet: 49.4
                                },
                                15: {
                                    squareFeet: 58
                                }
                            },
                            x23dot4x33dot1: {
                                1: {
                                    squareFeet: 25.5
                                },
                                2: {
                                    squareFeet: 45
                                },
                                3: {
                                    squareFeet: 45
                                },
                                4: {
                                    squareFeet: 75
                                },
                                5: {
                                    squareFeet: 95
                                },
                                6: {
                                    squareFeet: 95
                                },
                                8: {
                                    squareFeet: 142
                                },
                                9: {
                                    squareFeet: 142
                                },
                                10: {
                                    squareFeet: 170
                                },
                                12: {
                                    squareFeet: 190
                                },
                                15: {
                                    squareFeet: 210
                                }
                            },
                            x24x24: {
                                1: {
                                    squareFeet: 20
                                },
                                2: {
                                    squareFeet: 32
                                },
                                3: {
                                    squareFeet: 32
                                },
                                4: {
                                    squareFeet: 34
                                },
                                5: {
                                    squareFeet: 36
                                },
                                6: {
                                    squareFeet: 36
                                },
                                8: {
                                    squareFeet: 40
                                },
                                9: {
                                    squareFeet: 40
                                },
                                10: {
                                    squareFeet: 40
                                },
                                12: {
                                    squareFeet: 44
                                },
                                15: {
                                    squareFeet: 50
                                }
                            },
                            x24x30: {
                                1: {
                                    squareFeet: 25.5
                                },
                                2: {
                                    squareFeet: 45
                                },
                                3: {
                                    squareFeet: 45
                                },
                                4: {
                                    squareFeet: 75
                                },
                                5: {
                                    squareFeet: 95
                                },
                                6: {
                                    squareFeet: 95
                                },
                                8: {
                                    squareFeet: 142
                                },
                                9: {
                                    squareFeet: 142
                                },
                                10: {
                                    squareFeet: 170
                                },
                                12: {
                                    squareFeet: 190
                                },
                                15: {
                                    squareFeet: 210
                                }
                            },
                            x24x32: {
                                1: {
                                    squareFeet: 25.5
                                },
                                2: {
                                    squareFeet: 45
                                },
                                3: {
                                    squareFeet: 45
                                },
                                4: {
                                    squareFeet: 75
                                },
                                5: {
                                    squareFeet: 95
                                },
                                6: {
                                    squareFeet: 95
                                },
                                8: {
                                    squareFeet: 142
                                },
                                9: {
                                    squareFeet: 142
                                },
                                10: {
                                    squareFeet: 170
                                },
                                12: {
                                    squareFeet: 190
                                },
                                15: {
                                    squareFeet: 210
                                }
                            },
                            x24x36: {
                                1: {
                                    squareFeet: 31
                                },
                                2: {
                                    squareFeet: 47.4
                                },
                                3: {
                                    squareFeet: 47.4
                                },
                                4: {
                                    squareFeet: 74.96
                                },
                                5: {
                                    squareFeet: 94.8
                                },
                                6: {
                                    squareFeet: 94.8
                                },
                                8: {
                                    squareFeet: 142.2
                                },
                                9: {
                                    squareFeet: 142.2
                                },
                                10: {
                                    squareFeet: 169.76
                                },
                                12: {
                                    squareFeet: 189.6
                                },
                                15: {
                                    squareFeet: 210
                                }
                            }
                        },
                        Standard: {
                            x4x6: {
                                1: {
                                    squareFeet: 1.6
                                },
                                2: {
                                    squareFeet: 2.9
                                },
                                3: {
                                    squareFeet: 2.95
                                },
                                4: {
                                    squareFeet: 3.54
                                },
                                5: {
                                    squareFeet: 4.09
                                },
                                6: {
                                    squareFeet: 4.29
                                },
                                8: {
                                    squareFeet: 4.39
                                },
                                9: {
                                    squareFeet: 4.59
                                },
                                10: {
                                    squareFeet: 4.69
                                },
                                12: {
                                    squareFeet: 5.09
                                },
                                15: {
                                    squareFeet: 5.83
                                }
                            },
                            x5dot8x8dot3: {
                                1: {
                                    squareFeet: 3.7
                                },
                                2: {
                                    squareFeet: 6.62
                                },
                                3: {
                                    squareFeet: 7
                                },
                                4: {
                                    squareFeet: 7.25
                                },
                                5: {
                                    squareFeet: 7.45
                                },
                                6: {
                                    squareFeet: 7.85
                                },
                                8: {
                                    squareFeet: 8.45
                                },
                                9: {
                                    squareFeet: 8.65
                                },
                                10: {
                                    squareFeet: 10.35
                                },
                                12: {
                                    squareFeet: 10.55
                                },
                                15: {
                                    squareFeet: 12.45
                                }
                            },
                            x5x7: {
                                1: {
                                    squareFeet: 1.98
                                },
                                2: {
                                    squareFeet: 3.13
                                },
                                3: {
                                    squareFeet: 3.13
                                },
                                4: {
                                    squareFeet: 4.63
                                },
                                5: {
                                    squareFeet: 4.63
                                },
                                6: {
                                    squareFeet: 4.92
                                },
                                8: {
                                    squareFeet: 5.42
                                },
                                9: {
                                    squareFeet: 5.42
                                },
                                10: {
                                    squareFeet: 5.95
                                },
                                12: {
                                    squareFeet: 6.42
                                },
                                15: {
                                    squareFeet: 7.33
                                }
                            },
                            x6x6: {
                                1: {
                                    squareFeet: 3
                                },
                                2: {
                                    squareFeet: 5
                                },
                                3: {
                                    squareFeet: 5
                                },
                                4: {
                                    squareFeet: 6
                                },
                                5: {
                                    squareFeet: 6.25
                                },
                                6: {
                                    squareFeet: 6.5
                                },
                                8: {
                                    squareFeet: 7.25
                                },
                                9: {
                                    squareFeet: 7.5
                                },
                                10: {
                                    squareFeet: 8.25
                                },
                                12: {
                                    squareFeet: 8.5
                                },
                                15: {
                                    squareFeet: 8.8
                                }
                            },
                            x6x8: {
                                1: {
                                    squareFeet: 3.22
                                },
                                2: {
                                    squareFeet: 5.76
                                },
                                3: {
                                    squareFeet: 5.96
                                },
                                4: {
                                    squareFeet: 6.09
                                },
                                5: {
                                    squareFeet: 6.32
                                },
                                6: {
                                    squareFeet: 6.42
                                },
                                8: {
                                    squareFeet: 7.32
                                },
                                9: {
                                    squareFeet: 7.52
                                },
                                10: {
                                    squareFeet: 8.32
                                },
                                12: {
                                    squareFeet: 8.62
                                },
                                15: {
                                    squareFeet: 9.94
                                }
                            },
                            x8dot3x11dot7: {
                                1: {
                                    squareFeet: 4.65
                                },
                                2: {
                                    squareFeet: 8.8
                                },
                                3: {
                                    squareFeet: 8.95
                                },
                                4: {
                                    squareFeet: 9.05
                                },
                                5: {
                                    squareFeet: 9.65
                                },
                                6: {
                                    squareFeet: 10.75
                                },
                                8: {
                                    squareFeet: 11.65
                                },
                                9: {
                                    squareFeet: 11.75
                                },
                                10: {
                                    squareFeet: 12.65
                                },
                                12: {
                                    squareFeet: 12.85
                                },
                                15: {
                                    squareFeet: 14.65
                                }
                            },
                            x8dot5x11: {
                                1: {
                                    squareFeet: 3.86
                                },
                                2: {
                                    squareFeet: 7.17
                                },
                                3: {
                                    squareFeet: 7.77
                                },
                                4: {
                                    squareFeet: 8.94
                                },
                                5: {
                                    squareFeet: 9.03
                                },
                                6: {
                                    squareFeet: 9.53
                                },
                                8: {
                                    squareFeet: 10.03
                                },
                                9: {
                                    squareFeet: 10.53
                                },
                                10: {
                                    squareFeet: 11.03
                                },
                                12: {
                                    squareFeet: 11.53
                                },
                                15: {
                                    squareFeet: 12.83
                                }
                            },
                            x8x8: {
                                1: {
                                    squareFeet: 3.22
                                },
                                2: {
                                    squareFeet: 5.76
                                },
                                3: {
                                    squareFeet: 5.76
                                },
                                4: {
                                    squareFeet: 6.09
                                },
                                5: {
                                    squareFeet: 6.32
                                },
                                6: {
                                    squareFeet: 6.32
                                },
                                8: {
                                    squareFeet: 7.32
                                },
                                9: {
                                    squareFeet: 7.32
                                },
                                10: {
                                    squareFeet: 8.32
                                },
                                12: {
                                    squareFeet: 8.32
                                },
                                15: {
                                    squareFeet: 10.12
                                }
                            },
                            x8x10: {
                                1: {
                                    squareFeet: 3.58
                                },
                                2: {
                                    squareFeet: 5.92
                                },
                                3: {
                                    squareFeet: 5.92
                                },
                                4: {
                                    squareFeet: 6.57
                                },
                                5: {
                                    squareFeet: 7.12
                                },
                                6: {
                                    squareFeet: 7.12
                                },
                                8: {
                                    squareFeet: 8.12
                                },
                                9: {
                                    squareFeet: 8.12
                                },
                                10: {
                                    squareFeet: 9.12
                                },
                                12: {
                                    squareFeet: 9.12
                                },
                                15: {
                                    squareFeet: 10.92
                                }
                            },
                            x8x12: {
                                1: {
                                    squareFeet: 4.65
                                },
                                2: {
                                    squareFeet: 8.8
                                },
                                3: {
                                    squareFeet: 8.95
                                },
                                4: {
                                    squareFeet: 9.05
                                },
                                5: {
                                    squareFeet: 9.65
                                },
                                6: {
                                    squareFeet: 10.75
                                },
                                8: {
                                    squareFeet: 11.65
                                },
                                9: {
                                    squareFeet: 11.75
                                },
                                10: {
                                    squareFeet: 12.65
                                },
                                12: {
                                    squareFeet: 12.85
                                },
                                15: {
                                    squareFeet: 14.65
                                }
                            },
                            x9x12: {
                                1: {
                                    squareFeet: 3.97
                                },
                                2: {
                                    squareFeet: 7.59
                                },
                                3: {
                                    squareFeet: 7.59
                                },
                                4: {
                                    squareFeet: 8.14
                                },
                                5: {
                                    squareFeet: 9.21
                                },
                                6: {
                                    squareFeet: 9.21
                                },
                                8: {
                                    squareFeet: 10.21
                                },
                                9: {
                                    squareFeet: 10.21
                                },
                                10: {
                                    squareFeet: 11.21
                                },
                                12: {
                                    squareFeet: 11.21
                                },
                                15: {
                                    squareFeet: 12.98
                                }
                            },
                            x10x10: {
                                1: {
                                    squareFeet: 3.87
                                },
                                2: {
                                    squareFeet: 7.49
                                },
                                3: {
                                    squareFeet: 7.49
                                },
                                4: {
                                    squareFeet: 9
                                },
                                5: {
                                    squareFeet: 9.58
                                },
                                6: {
                                    squareFeet: 9.58
                                },
                                8: {
                                    squareFeet: 10.58
                                },
                                9: {
                                    squareFeet: 10.58
                                },
                                10: {
                                    squareFeet: 11.58
                                },
                                12: {
                                    squareFeet: 11.58
                                },
                                15: {
                                    squareFeet: 13.26
                                }
                            },
                            x11dot7x16dot5: {
                                1: {
                                    squareFeet: 6.6
                                },
                                2: {
                                    squareFeet: 14.35
                                },
                                3: {
                                    squareFeet: 14.45
                                },
                                4: {
                                    squareFeet: 14.65
                                },
                                5: {
                                    squareFeet: 14.85
                                },
                                6: {
                                    squareFeet: 14.95
                                },
                                8: {
                                    squareFeet: 15.55
                                },
                                9: {
                                    squareFeet: 15.65
                                },
                                10: {
                                    squareFeet: 16.55
                                },
                                12: {
                                    squareFeet: 16.95
                                },
                                15: {
                                    squareFeet: 18.85
                                }
                            },
                            x11x14: {
                                1: {
                                    squareFeet: 4.9
                                },
                                2: {
                                    squareFeet: 9.09
                                },
                                3: {
                                    squareFeet: 9.09
                                },
                                4: {
                                    squareFeet: 9.51
                                },
                                5: {
                                    squareFeet: 10.36
                                },
                                6: {
                                    squareFeet: 10.36
                                },
                                8: {
                                    squareFeet: 11.36
                                },
                                9: {
                                    squareFeet: 11.36
                                },
                                10: {
                                    squareFeet: 12.36
                                },
                                12: {
                                    squareFeet: 12.36
                                },
                                15: {
                                    squareFeet: 14.14
                                }
                            },
                            x11x17: {
                                1: {
                                    squareFeet: 5.39
                                },
                                2: {
                                    squareFeet: 11.97
                                },
                                3: {
                                    squareFeet: 11.97
                                },
                                4: {
                                    squareFeet: 12.06
                                },
                                5: {
                                    squareFeet: 12.1
                                },
                                6: {
                                    squareFeet: 12.1
                                },
                                8: {
                                    squareFeet: 13.1
                                },
                                9: {
                                    squareFeet: 13.1
                                },
                                10: {
                                    squareFeet: 14.1
                                },
                                12: {
                                    squareFeet: 14.1
                                },
                                15: {
                                    squareFeet: 15.87
                                }
                            },
                            x12x12: {
                                1: {
                                    squareFeet: 4.32
                                },
                                2: {
                                    squareFeet: 9.51
                                },
                                3: {
                                    squareFeet: 9.51
                                },
                                4: {
                                    squareFeet: 10.06
                                },
                                5: {
                                    squareFeet: 10.92
                                },
                                6: {
                                    squareFeet: 10.92
                                },
                                8: {
                                    squareFeet: 11.92
                                },
                                9: {
                                    squareFeet: 11.92
                                },
                                10: {
                                    squareFeet: 12.92
                                },
                                12: {
                                    squareFeet: 12.92
                                },
                                15: {
                                    squareFeet: 14.69
                                }
                            },
                            x12x16: {
                                1: {
                                    squareFeet: 5.65
                                },
                                2: {
                                    squareFeet: 12.43
                                },
                                3: {
                                    squareFeet: 12.43
                                },
                                4: {
                                    squareFeet: 12.46
                                },
                                5: {
                                    squareFeet: 12.51
                                },
                                6: {
                                    squareFeet: 12.51
                                },
                                8: {
                                    squareFeet: 13.51
                                },
                                9: {
                                    squareFeet: 13.51
                                },
                                10: {
                                    squareFeet: 14.51
                                },
                                12: {
                                    squareFeet: 14.51
                                },
                                15: {
                                    squareFeet: 16.28
                                }
                            },
                            x12x18: {
                                1: {
                                    squareFeet: 6.36
                                },
                                2: {
                                    squareFeet: 12.95
                                },
                                3: {
                                    squareFeet: 12.95
                                },
                                4: {
                                    squareFeet: 12.95
                                },
                                5: {
                                    squareFeet: 12.95
                                },
                                6: {
                                    squareFeet: 12.95
                                },
                                8: {
                                    squareFeet: 14.95
                                },
                                9: {
                                    squareFeet: 14.95
                                },
                                10: {
                                    squareFeet: 14.95
                                },
                                12: {
                                    squareFeet: 14.95
                                },
                                15: {
                                    squareFeet: 16.72
                                }
                            },
                            x16dot5x23dot4: {
                                1: {
                                    squareFeet: 6.6
                                },
                                2: {
                                    squareFeet: 14.35
                                },
                                3: {
                                    squareFeet: 14.45
                                },
                                4: {
                                    squareFeet: 14.65
                                },
                                5: {
                                    squareFeet: 14.85
                                },
                                6: {
                                    squareFeet: 14.95
                                },
                                8: {
                                    squareFeet: 15.55
                                },
                                9: {
                                    squareFeet: 15.65
                                },
                                10: {
                                    squareFeet: 16.55
                                },
                                12: {
                                    squareFeet: 16.95
                                },
                                15: {
                                    squareFeet: 18.85
                                }
                            },
                            x16x16: {
                                1: {
                                    squareFeet: 6.57
                                },
                                2: {
                                    squareFeet: 18.25
                                },
                                3: {
                                    squareFeet: 18.25
                                },
                                4: {
                                    squareFeet: 19.51
                                },
                                5: {
                                    squareFeet: 20.86
                                },
                                6: {
                                    squareFeet: 20.86
                                },
                                8: {
                                    squareFeet: 22.86
                                },
                                9: {
                                    squareFeet: 22.86
                                },
                                10: {
                                    squareFeet: 22.86
                                },
                                12: {
                                    squareFeet: 22.86
                                },
                                15: {
                                    squareFeet: 25.33
                                }
                            },
                            x16x20: {
                                1: {
                                    squareFeet: 8.34
                                },
                                2: {
                                    squareFeet: 18.15
                                },
                                3: {
                                    squareFeet: 18.15
                                },
                                4: {
                                    squareFeet: 19.21
                                },
                                5: {
                                    squareFeet: 20.56
                                },
                                6: {
                                    squareFeet: 20.56
                                },
                                8: {
                                    squareFeet: 22.56
                                },
                                9: {
                                    squareFeet: 22.56
                                },
                                10: {
                                    squareFeet: 22.56
                                },
                                12: {
                                    squareFeet: 22.56
                                },
                                15: {
                                    squareFeet: 25.61
                                }
                            },
                            x16x24: {
                                1: {
                                    squareFeet: 14.46
                                },
                                2: {
                                    squareFeet: 22.86
                                },
                                3: {
                                    squareFeet: 22.86
                                },
                                4: {
                                    squareFeet: 23.01
                                },
                                5: {
                                    squareFeet: 23.5
                                },
                                6: {
                                    squareFeet: 23.5
                                },
                                8: {
                                    squareFeet: 25.5
                                },
                                9: {
                                    squareFeet: 25.5
                                },
                                10: {
                                    squareFeet: 25.5
                                },
                                12: {
                                    squareFeet: 25.5
                                },
                                15: {
                                    squareFeet: 28.9
                                }
                            },
                            x18x18: {
                                1: {
                                    squareFeet: 12
                                },
                                2: {
                                    squareFeet: 24
                                },
                                3: {
                                    squareFeet: 24
                                },
                                4: {
                                    squareFeet: 26
                                },
                                5: {
                                    squareFeet: 26
                                },
                                6: {
                                    squareFeet: 26
                                },
                                8: {
                                    squareFeet: 28
                                },
                                9: {
                                    squareFeet: 28
                                },
                                10: {
                                    squareFeet: 30
                                },
                                12: {
                                    squareFeet: 30
                                },
                                15: {
                                    squareFeet: 34.41
                                }
                            },
                            x18x24: {
                                1: {
                                    squareFeet: 14.45
                                },
                                2: {
                                    squareFeet: 26.84
                                },
                                3: {
                                    squareFeet: 26.84
                                },
                                4: {
                                    squareFeet: 27.64
                                },
                                5: {
                                    squareFeet: 28
                                },
                                6: {
                                    squareFeet: 28
                                },
                                8: {
                                    squareFeet: 31
                                },
                                9: {
                                    squareFeet: 31
                                },
                                10: {
                                    squareFeet: 31
                                },
                                12: {
                                    squareFeet: 31
                                },
                                15: {
                                    squareFeet: 35
                                }
                            },
                            x20x20: {
                                1: {
                                    squareFeet: 13.19
                                },
                                2: {
                                    squareFeet: 28.54
                                },
                                3: {
                                    squareFeet: 28.54
                                },
                                4: {
                                    squareFeet: 28.55
                                },
                                5: {
                                    squareFeet: 29.76
                                },
                                6: {
                                    squareFeet: 29.76
                                },
                                8: {
                                    squareFeet: 32.76
                                },
                                9: {
                                    squareFeet: 32.76
                                },
                                10: {
                                    squareFeet: 32.76
                                },
                                12: {
                                    squareFeet: 32.76
                                },
                                15: {
                                    squareFeet: 36.01
                                }
                            },
                            x20x28: {
                                1: {
                                    squareFeet: 25.5
                                },
                                2: {
                                    squareFeet: 45
                                },
                                3: {
                                    squareFeet: 45
                                },
                                4: {
                                    squareFeet: 75
                                },
                                5: {
                                    squareFeet: 95
                                },
                                6: {
                                    squareFeet: 95
                                },
                                8: {
                                    squareFeet: 142
                                },
                                9: {
                                    squareFeet: 142
                                },
                                10: {
                                    squareFeet: 170
                                },
                                12: {
                                    squareFeet: 190
                                },
                                15: {
                                    squareFeet: 210
                                }
                            },
                            x20x30: {
                                1: {
                                    squareFeet: 18.52
                                },
                                2: {
                                    squareFeet: 32.08
                                },
                                3: {
                                    squareFeet: 32.08
                                },
                                4: {
                                    squareFeet: 34
                                },
                                5: {
                                    squareFeet: 35
                                },
                                6: {
                                    squareFeet: 36
                                },
                                8: {
                                    squareFeet: 40
                                },
                                9: {
                                    squareFeet: 40
                                },
                                10: {
                                    squareFeet: 40
                                },
                                12: {
                                    squareFeet: 40
                                },
                                15: {
                                    squareFeet: 45.84
                                }
                            },
                            x23dot4x33dot1: {
                                1: {
                                    squareFeet: 25.5
                                },
                                2: {
                                    squareFeet: 45
                                },
                                3: {
                                    squareFeet: 45
                                },
                                4: {
                                    squareFeet: 75
                                },
                                5: {
                                    squareFeet: 95
                                },
                                6: {
                                    squareFeet: 95
                                },
                                8: {
                                    squareFeet: 142
                                },
                                9: {
                                    squareFeet: 142
                                },
                                10: {
                                    squareFeet: 170
                                },
                                12: {
                                    squareFeet: 190
                                },
                                15: {
                                    squareFeet: 210
                                }
                            },
                            x24x24: {
                                1: {
                                    squareFeet: 16
                                },
                                2: {
                                    squareFeet: 30
                                },
                                3: {
                                    squareFeet: 30
                                },
                                4: {
                                    squareFeet: 32
                                },
                                5: {
                                    squareFeet: 34
                                },
                                6: {
                                    squareFeet: 34
                                },
                                8: {
                                    squareFeet: 38
                                },
                                9: {
                                    squareFeet: 38
                                },
                                10: {
                                    squareFeet: 38
                                },
                                12: {
                                    squareFeet: 40
                                },
                                15: {
                                    squareFeet: 45.46
                                }
                            },
                            x24x30: {
                                1: {
                                    squareFeet: 25.5
                                },
                                2: {
                                    squareFeet: 45
                                },
                                3: {
                                    squareFeet: 45
                                },
                                4: {
                                    squareFeet: 75
                                },
                                5: {
                                    squareFeet: 95
                                },
                                6: {
                                    squareFeet: 95
                                },
                                8: {
                                    squareFeet: 142
                                },
                                9: {
                                    squareFeet: 142
                                },
                                10: {
                                    squareFeet: 170
                                },
                                12: {
                                    squareFeet: 190
                                },
                                15: {
                                    squareFeet: 210
                                }
                            },
                            x24x32: {
                                1: {
                                    squareFeet: 25.5
                                },
                                2: {
                                    squareFeet: 45
                                },
                                3: {
                                    squareFeet: 45
                                },
                                4: {
                                    squareFeet: 75
                                },
                                5: {
                                    squareFeet: 95
                                },
                                6: {
                                    squareFeet: 95
                                },
                                8: {
                                    squareFeet: 142
                                },
                                9: {
                                    squareFeet: 142
                                },
                                10: {
                                    squareFeet: 170
                                },
                                12: {
                                    squareFeet: 190
                                },
                                15: {
                                    squareFeet: 210
                                }
                            },
                            x24x36: {
                                1: {
                                    squareFeet: 27.56
                                },
                                2: {
                                    squareFeet: 47.4
                                },
                                3: {
                                    squareFeet: 47.4
                                },
                                4: {
                                    squareFeet: 74.96
                                },
                                5: {
                                    squareFeet: 94.8
                                },
                                6: {
                                    squareFeet: 94.8
                                },
                                8: {
                                    squareFeet: 142.2
                                },
                                9: {
                                    squareFeet: 142.2
                                },
                                10: {
                                    squareFeet: 169.76
                                },
                                12: {
                                    squareFeet: 189.6
                                },
                                15: {
                                    squareFeet: 210
                                }
                            }
                        }
                    },
                    framedGalleryBoxSizes: {
                        Premium: {
                            Brighton: 11.5,
                            Bristol: 11.5,
                            Camden: 11.5,
                            Hudson: 11.5,
                            Kent: 11.5,
                            Warwick: 11.5,
                            Windsor: 11.5,
                            York: 11.5
                        },
                        Standard: {
                            Brighton: 10,
                            Bristol: 10,
                            Camden: 10,
                            Hudson: 10,
                            Kent: 10,
                            Warwick: 10,
                            Windsor: 10,
                            York: 10
                        }
                    },
                    includeSleeveForFramedThreshold: 16,
                    sleeveCosts: [{
                        threshold: 18,
                        value: .74
                    }, {
                        threshold: 16,
                        value: .242
                    }, {
                        threshold: 11,
                        value: .182
                    }, {
                        threshold: 10,
                        value: .14
                    }, {
                        threshold: 9,
                        value: .12
                    }, {
                        threshold: 8,
                        value: .09
                    }, {
                        threshold: 0,
                        value: .05
                    }],
                    unframedMailerCosts: [{
                        threshold: 18,
                        value: 1.6
                    }, {
                        threshold: 16,
                        value: .9
                    }, {
                        threshold: 12,
                        value: .8
                    }, {
                        threshold: 11,
                        value: .7
                    }, {
                        threshold: 8.5,
                        value: .6
                    }, {
                        threshold: 8,
                        value: .5
                    }, {
                        threshold: 0,
                        value: .45
                    }]
                },
                perExtraUnitShippingCosts: [{
                    threshold: 20,
                    value: 2
                }, {
                    threshold: 0,
                    value: 1
                }]
            },
            wholesaleDiscounts: [{
                threshold: 100,
                value: .2
            }, {
                threshold: 50,
                value: .13
            }, {
                threshold: 25,
                value: .1
            }, {
                threshold: 10,
                value: .05
            }, {
                threshold: 0,
                value: 0
            }]
        };
        e.s(["PRICING_DATA", 0, t])
    }
]);

//# sourceMappingURL=0b92e4211f956f5a.js.map
//# chunkId=019c353e-cb21-76c0-baad-944a1afabdd5


!function() {
    try {
        var e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : {}
            , n = (new e.Error).stack;
        n && (e._posthogChunkIds = e._posthogChunkIds || {},
            e._posthogChunkIds[n] = "019c353e-c963-7261-9ed0-393a10c390eb")
    } catch (e) {}
}();
(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["object" == typeof document ? document.currentScript : void 0, 25379, 92246, 618343, 118048, 119530, t => {
    "use strict";
    t.i(260835);
    var e = t.i(245974)
        , r = t.i(406855);
    t.i(992030);
    var a = t.i(135459);
    t.s(["ImageEditorPrinterUtils", () => a.default], 92246);
    var a = a;
    function i(t, i) {
        let d = t === e.Orientation.Horizontal
            , n = (0,
            r.getSizeDimensions)(e.ProductSize.x4dot1x5dot8)
            , o = (0,
            r.getSizeDimensions)("x3dot8125x5dot4375")
            , P = "inches" === i ? 1 : a.default.IMAGE_EDITOR_DPI;
        return {
            paperHeight: (d ? n.widthInInch : n.heightInInch) * P,
            paperWidth: (d ? n.heightInInch : n.widthInInch) * P,
            printableHeight: (d ? o.widthInInch : o.heightInInch) * P,
            printableWidth: (d ? o.heightInInch : o.widthInInch) * P
        }
    }
    t.s(["getPackageInsertDimensions", () => i], 618343);
    let d = e.ProductSize.x4dot1x5dot8
        , n = {
        [e.BrandingType.PackageInsert]: {
            id: e.BrandingType.PackageInsert,
            isCircle: !1,
            name: "Package Insert",
            size: "x3dot8125x5dot4375",
            url: `/branding/create?type=${e.BrandingType.PackageInsert}`
        },
        [e.BrandingType.PackageSticker]: {
            id: e.BrandingType.PackageSticker,
            isCircle: !0,
            name: "Package Sticker",
            size: "x2x2",
            url: `/branding/create?type=${e.BrandingType.PackageSticker}`
        }
    };
    t.s(["PACKAGE_INSERT_PAPER_SIZE", 0, d, "default", 0, n], 118048),
        t.s([], 25379);
    let o = {
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x11x14}-${e.FrameStyle.Unframed}-${e.PaperType.MattePoster}-Unmatted`]: 4.29,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x12x18}-${e.FrameStyle.Unframed}-${e.PaperType.MattePoster}-Unmatted`]: 6.09,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x16x20}-${e.FrameStyle.Unframed}-${e.PaperType.MattePoster}-Unmatted`]: 8.09,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x18x24}-${e.FrameStyle.Unframed}-${e.PaperType.MattePoster}-Unmatted`]: 8.59,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x20x30}-${e.FrameStyle.Unframed}-${e.PaperType.MattePoster}-Unmatted`]: 9.9,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x24x36}-${e.FrameStyle.Unframed}-${e.PaperType.MattePoster}-Unmatted`]: 11.9
    }
        , P = {
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x5x7}-${e.FrameStyle.Oak}-${e.PaperType.MattePoster}-Matted`]: 8.38,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x5x7}-${e.FrameStyle.Oak}-${e.PaperType.ArchivalMatteFineArt}-Matted`]: 8.5,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x5x7}-${e.FrameStyle.Oak}-${e.PaperType.SemiMatteLinenPoster}-Matted`]: 9.25,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x5x7}-${e.FrameStyle.Oak}-${e.PaperType.HotPressFineArt}-Matted`]: 9.25,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x5x7}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 3.37,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x5x7}-${e.FrameStyle.Unframed}-${e.PaperType.HotPressFineArt}-Unmatted`]: 3.94,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x8x8}-${e.FrameStyle.Oak}-${e.PaperType.MattePoster}-Matted`]: 10.43,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x8x8}-${e.FrameStyle.Oak}-${e.PaperType.ArchivalMatteFineArt}-Matted`]: 10.65,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x8x8}-${e.FrameStyle.Oak}-${e.PaperType.SemiMatteLinenPoster}-Matted`]: 11.13,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x8x8}-${e.FrameStyle.Oak}-${e.PaperType.HotPressFineArt}-Matted`]: 12.07,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x8x8}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 4.04,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x8x8}-${e.FrameStyle.Unframed}-${e.PaperType.HotPressFineArt}-Unmatted`]: 5.12,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x8x10}-${e.FrameStyle.Oak}-${e.PaperType.MattePoster}-Matted`]: 11.37,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x8x10}-${e.FrameStyle.Oak}-${e.PaperType.ArchivalMatteFineArt}-Matted`]: 11.64,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x8x10}-${e.FrameStyle.Oak}-${e.PaperType.SemiMatteLinenPoster}-Matted`]: 11.98,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x8x10}-${e.FrameStyle.Oak}-${e.PaperType.HotPressFineArt}-Matted`]: 13.4,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x8x10}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 4.27,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x8x10}-${e.FrameStyle.Unframed}-${e.PaperType.HotPressFineArt}-Unmatted`]: 5.6,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x8dot5x11}-${e.FrameStyle.Oak}-${e.PaperType.MattePoster}-Matted`]: 12.13,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x8dot5x11}-${e.FrameStyle.Oak}-${e.PaperType.ArchivalMatteFineArt}-Matted`]: 12.43,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x8dot5x11}-${e.FrameStyle.Oak}-${e.PaperType.SemiMatteLinenPoster}-Matted`]: 12.64,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x8dot5x11}-${e.FrameStyle.Oak}-${e.PaperType.HotPressFineArt}-Matted`]: 14.49,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x8dot5x11}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 4.71,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x8dot5x11}-${e.FrameStyle.Unframed}-${e.PaperType.HotPressFineArt}-Unmatted`]: 6.27,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x9x12}-${e.FrameStyle.Oak}-${e.PaperType.MattePoster}-Matted`]: 12.85,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x9x12}-${e.FrameStyle.Oak}-${e.PaperType.ArchivalMatteFineArt}-Matted`]: 13.22,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x9x12}-${e.FrameStyle.Oak}-${e.PaperType.SemiMatteLinenPoster}-Matted`]: 13.28,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x9x12}-${e.FrameStyle.Oak}-${e.PaperType.HotPressFineArt}-Matted`]: 15.61,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x9x12}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 5.01,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x9x12}-${e.FrameStyle.Unframed}-${e.PaperType.HotPressFineArt}-Unmatted`]: 6.83,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x10x10}-${e.FrameStyle.Oak}-${e.PaperType.MattePoster}-Matted`]: 12.37,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x10x10}-${e.FrameStyle.Oak}-${e.PaperType.ArchivalMatteFineArt}-Matted`]: 12.7,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x10x10}-${e.FrameStyle.Oak}-${e.PaperType.SemiMatteLinenPoster}-Matted`]: 12.85,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x10x10}-${e.FrameStyle.Oak}-${e.PaperType.HotPressFineArt}-Matted`]: 14.91,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x10x10}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 4.91,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x10x10}-${e.FrameStyle.Unframed}-${e.PaperType.HotPressFineArt}-Unmatted`]: 6.6,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x12x12}-${e.FrameStyle.Oak}-${e.PaperType.MattePoster}-Matted`]: 14.46,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x12x12}-${e.FrameStyle.Oak}-${e.PaperType.ArchivalMatteFineArt}-Matted`]: 14.94,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x12x12}-${e.FrameStyle.Oak}-${e.PaperType.SemiMatteLinenPoster}-Matted`]: 14.67,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x12x12}-${e.FrameStyle.Oak}-${e.PaperType.HotPressFineArt}-Matted`]: 18.12,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x12x12}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 6.16,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x12x12}-${e.FrameStyle.Unframed}-${e.PaperType.HotPressFineArt}-Unmatted`]: 8.58,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x16x16}-${e.FrameStyle.Oak}-${e.PaperType.MattePoster}-Matted`]: 20.11,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x16x16}-${e.FrameStyle.Oak}-${e.PaperType.ArchivalMatteFineArt}-Matted`]: 20.96,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x16x16}-${e.FrameStyle.Oak}-${e.PaperType.HotPressFineArt}-Matted`]: 26.62,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x16x16}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 8.26,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x16x16}-${e.FrameStyle.Unframed}-${e.PaperType.HotPressFineArt}-Unmatted`]: 12.57,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x20x20}-${e.FrameStyle.Oak}-${e.PaperType.MattePoster}-Matted`]: 28.25,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x20x20}-${e.FrameStyle.Oak}-${e.PaperType.ArchivalMatteFineArt}-Matted`]: 29.58,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x20x20}-${e.FrameStyle.Oak}-${e.PaperType.HotPressFineArt}-Matted`]: 38.41,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x20x20}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 11.28,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x20x20}-${e.FrameStyle.Unframed}-${e.PaperType.HotPressFineArt}-Unmatted`]: 17,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x11x14}-${e.FrameStyle.Oak}-${e.PaperType.MattePoster}-Matted`]: 15.12,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x11x14}-${e.FrameStyle.Oak}-${e.PaperType.ArchivalMatteFineArt}-Matted`]: 15.64,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x11x14}-${e.FrameStyle.Oak}-${e.PaperType.SemiMatteLinenPoster}-Matted`]: 15.27,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x11x14}-${e.FrameStyle.Oak}-${e.PaperType.HotPressFineArt}-Matted`]: 19.02,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x11x14}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 6.09,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x11x14}-${e.FrameStyle.Unframed}-${e.PaperType.HotPressFineArt}-Unmatted`]: 8.67,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x11x17}-${e.FrameStyle.Oak}-${e.PaperType.MattePoster}-Matted`]: 16.7,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x11x17}-${e.FrameStyle.Oak}-${e.PaperType.ArchivalMatteFineArt}-Matted`]: 17.3,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x11x17}-${e.FrameStyle.Oak}-${e.PaperType.SemiMatteLinenPoster}-Matted`]: 16.63,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x11x17}-${e.FrameStyle.Oak}-${e.PaperType.HotPressFineArt}-Matted`]: 21.44,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x11x17}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 6.57,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x11x17}-${e.FrameStyle.Unframed}-${e.PaperType.HotPressFineArt}-Unmatted`]: 9.73,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x16x20}-${e.FrameStyle.Oak}-${e.PaperType.MattePoster}-Matted`]: 22.84,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x16x20}-${e.FrameStyle.Oak}-${e.PaperType.ArchivalMatteFineArt}-Matted`]: 23.92,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x16x20}-${e.FrameStyle.Oak}-${e.PaperType.HotPressFineArt}-Matted`]: 30.97,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x16x20}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 9.23,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x16x20}-${e.FrameStyle.Unframed}-${e.PaperType.HotPressFineArt}-Unmatted`]: 14.6,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x18x24}-${e.FrameStyle.Oak}-${e.PaperType.MattePoster}-Matted`]: 29.73,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x18x24}-${e.FrameStyle.Oak}-${e.PaperType.ArchivalMatteFineArt}-Matted`]: 31.18,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x18x24}-${e.FrameStyle.Oak}-${e.PaperType.HotPressFineArt}-Matted`]: 40.71,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x18x24}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 13.72,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x18x24}-${e.FrameStyle.Unframed}-${e.PaperType.HotPressFineArt}-Unmatted`]: 20.99,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x12x16}-${e.FrameStyle.Oak}-${e.PaperType.MattePoster}-Matted`]: 16.85,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x12x16}-${e.FrameStyle.Oak}-${e.PaperType.ArchivalMatteFineArt}-Matted`]: 17.48,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x12x16}-${e.FrameStyle.Oak}-${e.PaperType.SemiMatteLinenPoster}-Matted`]: 16.76,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x12x16}-${e.FrameStyle.Oak}-${e.PaperType.HotPressFineArt}-Matted`]: 21.72,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x12x16}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 6.9,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x12x16}-${e.FrameStyle.Unframed}-${e.PaperType.HotPressFineArt}-Unmatted`]: 10.13,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x20x30}-${e.FrameStyle.Oak}-${e.PaperType.MattePoster}-Matted`]: 36.08,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x20x30}-${e.FrameStyle.Oak}-${e.PaperType.ArchivalMatteFineArt}-Matted`]: 38.11,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x20x30}-${e.FrameStyle.Oak}-${e.PaperType.HotPressFineArt}-Matted`]: 51.33,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x20x30}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 13.91,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x20x30}-${e.FrameStyle.Unframed}-${e.PaperType.HotPressFineArt}-Unmatted`]: 22.46,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x16x24}-${e.FrameStyle.Oak}-${e.PaperType.MattePoster}-Matted`]: 26.8,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x16x24}-${e.FrameStyle.Oak}-${e.PaperType.ArchivalMatteFineArt}-Matted`]: 28.1,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x16x24}-${e.FrameStyle.Oak}-${e.PaperType.HotPressFineArt}-Matted`]: 36.57,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x16x24}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 10.22,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x16x24}-${e.FrameStyle.Unframed}-${e.PaperType.HotPressFineArt}-Unmatted`]: 16.68,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x24x36}-${e.FrameStyle.Oak}-${e.PaperType.MattePoster}-Matted`]: 51.3,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x24x36}-${e.FrameStyle.Oak}-${e.PaperType.ArchivalMatteFineArt}-Matted`]: 54.2,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x24x36}-${e.FrameStyle.Oak}-${e.PaperType.HotPressFineArt}-Matted`]: 73.26,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x24x36}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 17.33,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x24x36}-${e.FrameStyle.Unframed}-${e.PaperType.HotPressFineArt}-Unmatted`]: 29.66,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x12x18}-${e.FrameStyle.Oak}-${e.PaperType.MattePoster}-Matted`]: 18.06,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x12x18}-${e.FrameStyle.Oak}-${e.PaperType.ArchivalMatteFineArt}-Matted`]: 18.81,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x12x18}-${e.FrameStyle.Oak}-${e.PaperType.HotPressFineArt}-Matted`]: 23.56,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x12x18}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 7.29,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x12x18}-${e.FrameStyle.Unframed}-${e.PaperType.HotPressFineArt}-Unmatted`]: 10.91,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x20x24}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 12.32,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x20x24}-${e.FrameStyle.Unframed}-${e.PaperType.HotPressFineArt}-Unmatted`]: 19.17,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x5x7}-${e.FrameStyle.Oak}-${e.PaperType.MattePoster}-Matted`]: 17.12,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x5x7}-${e.FrameStyle.Oak}-${e.PaperType.ArchivalMatteFineArt}-Matted`]: 17.48,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x5x7}-${e.FrameStyle.Oak}-${e.PaperType.SemiMatteLinenPoster}-Matted`]: 19.75,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x5x7}-${e.FrameStyle.Oak}-${e.PaperType.HotPressFineArt}-Matted`]: 19.78,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x5x7}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 4.45,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x5x7}-${e.FrameStyle.Unframed}-${e.PaperType.HotPressFineArt}-Unmatted`]: 6.2,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x8x8}-${e.FrameStyle.Oak}-${e.PaperType.MattePoster}-Matted`]: 22.93,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x8x8}-${e.FrameStyle.Oak}-${e.PaperType.ArchivalMatteFineArt}-Matted`]: 23.56,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x8x8}-${e.FrameStyle.Oak}-${e.PaperType.SemiMatteLinenPoster}-Matted`]: 25.01,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x8x8}-${e.FrameStyle.Oak}-${e.PaperType.HotPressFineArt}-Matted`]: 27.8,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x8x8}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 6,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x8x8}-${e.FrameStyle.Unframed}-${e.PaperType.HotPressFineArt}-Unmatted`]: 9.23,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x8x10}-${e.FrameStyle.Oak}-${e.PaperType.MattePoster}-Matted`]: 25.59,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x8x10}-${e.FrameStyle.Oak}-${e.PaperType.ArchivalMatteFineArt}-Matted`]: 26.41,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x8x10}-${e.FrameStyle.Oak}-${e.PaperType.SemiMatteLinenPoster}-Matted`]: 27.4,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x8x10}-${e.FrameStyle.Oak}-${e.PaperType.HotPressFineArt}-Matted`]: 31.7,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x8x10}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 6.73,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x8x10}-${e.FrameStyle.Unframed}-${e.PaperType.HotPressFineArt}-Unmatted`]: 10.77,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x8dot5x11}-${e.FrameStyle.Oak}-${e.PaperType.MattePoster}-Matted`]: 27.95,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x8dot5x11}-${e.FrameStyle.Oak}-${e.PaperType.ArchivalMatteFineArt}-Matted`]: 28.92,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x8dot5x11}-${e.FrameStyle.Oak}-${e.PaperType.SemiMatteLinenPoster}-Matted`]: 29.52,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x8dot5x11}-${e.FrameStyle.Oak}-${e.PaperType.HotPressFineArt}-Matted`]: 35.09,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x8dot5x11}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 7.59,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x8dot5x11}-${e.FrameStyle.Unframed}-${e.PaperType.HotPressFineArt}-Unmatted`]: 12.29,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x9x12}-${e.FrameStyle.Oak}-${e.PaperType.MattePoster}-Matted`]: 30.16,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x9x12}-${e.FrameStyle.Oak}-${e.PaperType.ArchivalMatteFineArt}-Matted`]: 31.24,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x9x12}-${e.FrameStyle.Oak}-${e.PaperType.SemiMatteLinenPoster}-Matted`]: 31.46,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x9x12}-${e.FrameStyle.Oak}-${e.PaperType.HotPressFineArt}-Matted`]: 38.41,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x9x12}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 8.33,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x9x12}-${e.FrameStyle.Unframed}-${e.PaperType.HotPressFineArt}-Unmatted`]: 13.79,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x10x10}-${e.FrameStyle.Oak}-${e.PaperType.MattePoster}-Matted`]: 28.83,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x10x10}-${e.FrameStyle.Oak}-${e.PaperType.ArchivalMatteFineArt}-Matted`]: 29.85,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x10x10}-${e.FrameStyle.Oak}-${e.PaperType.SemiMatteLinenPoster}-Matted`]: 30.28,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x10x10}-${e.FrameStyle.Oak}-${e.PaperType.HotPressFineArt}-Matted`]: 36.48,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x10x10}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 8,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x10x10}-${e.FrameStyle.Unframed}-${e.PaperType.HotPressFineArt}-Unmatted`]: 13.05,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x12x12}-${e.FrameStyle.Oak}-${e.PaperType.MattePoster}-Matted`]: 35.24,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x12x12}-${e.FrameStyle.Oak}-${e.PaperType.ArchivalMatteFineArt}-Matted`]: 36.69,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x12x12}-${e.FrameStyle.Oak}-${e.PaperType.SemiMatteLinenPoster}-Matted`]: 35.87,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x12x12}-${e.FrameStyle.Oak}-${e.PaperType.HotPressFineArt}-Matted`]: 46.22,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x12x12}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 10.59,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x12x12}-${e.FrameStyle.Unframed}-${e.PaperType.HotPressFineArt}-Unmatted`]: 17.85,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x16x16}-${e.FrameStyle.Oak}-${e.PaperType.MattePoster}-Matted`]: 51.21,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x16x16}-${e.FrameStyle.Oak}-${e.PaperType.ArchivalMatteFineArt}-Matted`]: 53.78,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x16x16}-${e.FrameStyle.Oak}-${e.PaperType.HotPressFineArt}-Matted`]: 70.72,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x16x16}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 16.12,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x16x16}-${e.FrameStyle.Unframed}-${e.PaperType.HotPressFineArt}-Unmatted`]: 29.04,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x20x20}-${e.FrameStyle.Oak}-${e.PaperType.MattePoster}-Matted`]: 70.02,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x20x20}-${e.FrameStyle.Oak}-${e.PaperType.ArchivalMatteFineArt}-Matted`]: 74.05,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x20x20}-${e.FrameStyle.Oak}-${e.PaperType.HotPressFineArt}-Matted`]: 100.52,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x20x20}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 21.72,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x20x20}-${e.FrameStyle.Unframed}-${e.PaperType.HotPressFineArt}-Unmatted`]: 38.85,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x11x14}-${e.FrameStyle.Oak}-${e.PaperType.MattePoster}-Matted`]: 36.54,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x11x14}-${e.FrameStyle.Oak}-${e.PaperType.ArchivalMatteFineArt}-Matted`]: 38.08,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x11x14}-${e.FrameStyle.Oak}-${e.PaperType.SemiMatteLinenPoster}-Matted`]: 36.99,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x11x14}-${e.FrameStyle.Oak}-${e.PaperType.HotPressFineArt}-Matted`]: 48.28,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x11x14}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 10.82,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x11x14}-${e.FrameStyle.Unframed}-${e.PaperType.HotPressFineArt}-Unmatted`]: 18.59,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x11x17}-${e.FrameStyle.Oak}-${e.PaperType.MattePoster}-Matted`]: 41.68,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x11x17}-${e.FrameStyle.Oak}-${e.PaperType.ArchivalMatteFineArt}-Matted`]: 43.56,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x11x17}-${e.FrameStyle.Oak}-${e.PaperType.SemiMatteLinenPoster}-Matted`]: 41.53,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x11x17}-${e.FrameStyle.Oak}-${e.PaperType.HotPressFineArt}-Matted`]: 55.93,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x11x17}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 12.34,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x11x17}-${e.FrameStyle.Unframed}-${e.PaperType.HotPressFineArt}-Unmatted`]: 21.77,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x16x20}-${e.FrameStyle.Oak}-${e.PaperType.MattePoster}-Matted`]: 58.02,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x16x20}-${e.FrameStyle.Oak}-${e.PaperType.ArchivalMatteFineArt}-Matted`]: 61.25,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x16x20}-${e.FrameStyle.Oak}-${e.PaperType.HotPressFineArt}-Matted`]: 82.43,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x16x20}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 19.07,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x16x20}-${e.FrameStyle.Unframed}-${e.PaperType.HotPressFineArt}-Unmatted`]: 35.22,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x18x24}-${e.FrameStyle.Oak}-${e.PaperType.MattePoster}-Matted`]: 72.99,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x18x24}-${e.FrameStyle.Oak}-${e.PaperType.ArchivalMatteFineArt}-Matted`]: 77.34,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x18x24}-${e.FrameStyle.Oak}-${e.PaperType.HotPressFineArt}-Matted`]: 105.93,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x18x24}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 27.01,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x18x24}-${e.FrameStyle.Unframed}-${e.PaperType.HotPressFineArt}-Unmatted`]: 48.8,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x12x16}-${e.FrameStyle.Oak}-${e.PaperType.MattePoster}-Matted`]: 42.07,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x12x16}-${e.FrameStyle.Oak}-${e.PaperType.ArchivalMatteFineArt}-Matted`]: 44.01,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x12x16}-${e.FrameStyle.Oak}-${e.PaperType.SemiMatteLinenPoster}-Matted`]: 41.83,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x12x16}-${e.FrameStyle.Oak}-${e.PaperType.HotPressFineArt}-Matted`]: 56.71,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x12x16}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 12.8,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x12x16}-${e.FrameStyle.Unframed}-${e.PaperType.HotPressFineArt}-Unmatted`]: 22.49,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x20x30}-${e.FrameStyle.Oak}-${e.PaperType.MattePoster}-Matted`]: 90.14,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x20x30}-${e.FrameStyle.Oak}-${e.PaperType.ArchivalMatteFineArt}-Matted`]: 96.19,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x20x30}-${e.FrameStyle.Oak}-${e.PaperType.HotPressFineArt}-Matted`]: 135.88,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x20x30}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 29.57,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x20x30}-${e.FrameStyle.Unframed}-${e.PaperType.HotPressFineArt}-Unmatted`]: 55.25,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x16x24}-${e.FrameStyle.Oak}-${e.PaperType.MattePoster}-Matted`]: 66.15,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x16x24}-${e.FrameStyle.Oak}-${e.PaperType.ArchivalMatteFineArt}-Matted`]: 70.02,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x16x24}-${e.FrameStyle.Oak}-${e.PaperType.HotPressFineArt}-Matted`]: 95.43,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x16x24}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 22.03,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x16x24}-${e.FrameStyle.Unframed}-${e.PaperType.HotPressFineArt}-Unmatted`]: 41.4,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x24x36}-${e.FrameStyle.Oak}-${e.PaperType.MattePoster}-Matted`]: 116.64,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x24x36}-${e.FrameStyle.Oak}-${e.PaperType.ArchivalMatteFineArt}-Matted`]: 125.35,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x24x36}-${e.FrameStyle.Oak}-${e.PaperType.HotPressFineArt}-Matted`]: 182.52,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x24x36}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 39.88,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x24x36}-${e.FrameStyle.Unframed}-${e.PaperType.HotPressFineArt}-Unmatted`]: 76.88,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x12x18}-${e.FrameStyle.Oak}-${e.PaperType.MattePoster}-Matted`]: 45.19,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x12x18}-${e.FrameStyle.Oak}-${e.PaperType.ArchivalMatteFineArt}-Matted`]: 47.4,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x12x18}-${e.FrameStyle.Oak}-${e.PaperType.HotPressFineArt}-Matted`]: 61.68,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x12x18}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 13.91,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x12x18}-${e.FrameStyle.Unframed}-${e.PaperType.HotPressFineArt}-Unmatted`]: 24.79,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x20x24}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 24.85,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x20x24}-${e.FrameStyle.Unframed}-${e.PaperType.HotPressFineArt}-Unmatted`]: 45.4
    }
        , l = {
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x8x8}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 2.79,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x8x10}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 3.19,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x10x10}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 3.68,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x11x14}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 5,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x12x12}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 4.76,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x12x18}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 6.4,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x16x20}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 8.8,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x18x24}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 11.34
    }
        , u = {
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x18x24}-${e.FrameStyle.Unframed}-${e.PaperType.MattePoster}-Unmatted`]: 18.59,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x24x32}-${e.FrameStyle.Unframed}-${e.PaperType.MattePoster}-Unmatted`]: 26.91,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x24x36}-${e.FrameStyle.Unframed}-${e.PaperType.MattePoster}-Unmatted`]: 28.78
    }
        , $ = {
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x12x18}-${e.FrameStyle.Unframed}-${e.PaperType.MattePoster}-Unmatted`]: 6.4,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x12x18}-${e.FrameStyle.Unframed}-${e.PaperType.GlossyPoster}-Unmatted`]: 6.4,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x18x18}-${e.FrameStyle.Unframed}-${e.PaperType.MattePoster}-Unmatted`]: 8.7,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x18x18}-${e.FrameStyle.Unframed}-${e.PaperType.GlossyPoster}-Unmatted`]: 8.7,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x16x20}-${e.FrameStyle.Unframed}-${e.PaperType.MattePoster}-Unmatted`]: 7.13,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x16x20}-${e.FrameStyle.Unframed}-${e.PaperType.GlossyPoster}-Unmatted`]: 7.13,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x16x24}-${e.FrameStyle.Unframed}-${e.PaperType.MattePoster}-Unmatted`]: 7.31,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x16x24}-${e.FrameStyle.Unframed}-${e.PaperType.GlossyPoster}-Unmatted`]: 7.31,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x18x24}-${e.FrameStyle.Unframed}-${e.PaperType.MattePoster}-Unmatted`]: 7.52,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x18x24}-${e.FrameStyle.Unframed}-${e.PaperType.GlossyPoster}-Unmatted`]: 7.52,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x20x20}-${e.FrameStyle.Unframed}-${e.PaperType.MattePoster}-Unmatted`]: 9.15,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x20x20}-${e.FrameStyle.Unframed}-${e.PaperType.GlossyPoster}-Unmatted`]: 9.15,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x20x28}-${e.FrameStyle.Unframed}-${e.PaperType.MattePoster}-Unmatted`]: 10.1,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x20x28}-${e.FrameStyle.Unframed}-${e.PaperType.GlossyPoster}-Unmatted`]: 10.1,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x20x30}-${e.FrameStyle.Unframed}-${e.PaperType.MattePoster}-Unmatted`]: 10.45,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x20x30}-${e.FrameStyle.Unframed}-${e.PaperType.GlossyPoster}-Unmatted`]: 10.45,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x24x32}-${e.FrameStyle.Unframed}-${e.PaperType.MattePoster}-Unmatted`]: 9.89,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x24x32}-${e.FrameStyle.Unframed}-${e.PaperType.GlossyPoster}-Unmatted`]: 9.89,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x24x36}-${e.FrameStyle.Unframed}-${e.PaperType.MattePoster}-Unmatted`]: 9.91,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x24x36}-${e.FrameStyle.Unframed}-${e.PaperType.GlossyPoster}-Unmatted`]: 9.91,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x28x40}-${e.FrameStyle.Unframed}-${e.PaperType.MattePoster}-Unmatted`]: 15.87,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x28x40}-${e.FrameStyle.Unframed}-${e.PaperType.GlossyPoster}-Unmatted`]: 15.87,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x30x40}-${e.FrameStyle.Unframed}-${e.PaperType.MattePoster}-Unmatted`]: 16.55,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x30x40}-${e.FrameStyle.Unframed}-${e.PaperType.GlossyPoster}-Unmatted`]: 16.55,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x16dot5x23dot4}-${e.FrameStyle.Unframed}-${e.PaperType.MattePoster}-Unmatted`]: 7.97,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x16dot5x23dot4}-${e.FrameStyle.Unframed}-${e.PaperType.GlossyPoster}-Unmatted`]: 7.97,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x23dot4x33dot1}-${e.FrameStyle.Unframed}-${e.PaperType.MattePoster}-Unmatted`]: 10.85,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x23dot4x33dot1}-${e.FrameStyle.Unframed}-${e.PaperType.GlossyPoster}-Unmatted`]: 10.85,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x33dot1x46dot8}-${e.FrameStyle.Unframed}-${e.PaperType.MattePoster}-Unmatted`]: 19.7,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x33dot1x46dot8}-${e.FrameStyle.Unframed}-${e.PaperType.GlossyPoster}-Unmatted`]: 19.7
    }
        , m = {
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x11x14}-${e.FrameStyle.PremiumOak}-${e.PaperType.WatercolorFineArt}-Matted`]: 30.08,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x11x14}-${e.FrameStyle.Unframed}-${e.PaperType.WatercolorFineArt}-Matted`]: 11.46,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x12x16}-${e.FrameStyle.Unframed}-${e.PaperType.WatercolorFineArt}-Matted`]: 13.38,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x18x24}-${e.FrameStyle.Unframed}-${e.PaperType.WatercolorFineArt}-Matted`]: 23.89,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x5x7}-${e.FrameStyle.Unframed}-${e.PaperType.WatercolorFineArt}-Matted`]: 6.15,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x8x10}-${e.FrameStyle.Unframed}-${e.PaperType.WatercolorFineArt}-Matted`]: 8.47,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x11x14}-${e.FrameStyle.Unframed}-${e.PaperType.WatercolorFineArt}-Unmatted`]: 7.58,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x12x16}-${e.FrameStyle.Unframed}-${e.PaperType.WatercolorFineArt}-Unmatted`]: 8.69,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x18x24}-${e.FrameStyle.Unframed}-${e.PaperType.WatercolorFineArt}-Unmatted`]: 18.68,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x5x7}-${e.FrameStyle.Unframed}-${e.PaperType.WatercolorFineArt}-Unmatted`]: 3.64,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x8x10}-${e.FrameStyle.Unframed}-${e.PaperType.WatercolorFineArt}-Unmatted`]: 5.06
    }
        , c = {
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x8x10}-${e.FrameStyle.Unframed}-${e.PaperType.MattePoster}-Unmatted`]: 2.61,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x8x12}-${e.FrameStyle.Unframed}-${e.PaperType.MattePoster}-Unmatted`]: 3.84,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x8dot5x11}-${e.FrameStyle.Unframed}-${e.PaperType.MattePoster}-Unmatted`]: 3.9,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x11x14}-${e.FrameStyle.Unframed}-${e.PaperType.MattePoster}-Unmatted`]: 4.55,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x11x17}-${e.FrameStyle.Unframed}-${e.PaperType.MattePoster}-Unmatted`]: 5.45,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x12x16}-${e.FrameStyle.Unframed}-${e.PaperType.MattePoster}-Unmatted`]: 5.55,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x12x18}-${e.FrameStyle.Unframed}-${e.PaperType.MattePoster}-Unmatted`]: 6.08,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x13x19}-${e.FrameStyle.Unframed}-${e.PaperType.MattePoster}-Unmatted`]: 6.85,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x18x24}-${e.FrameStyle.Unframed}-${e.PaperType.MattePoster}-Unmatted`]: 10.61,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x19x27}-${e.FrameStyle.Unframed}-${e.PaperType.MattePoster}-Unmatted`]: 12.05,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x20x24}-${e.FrameStyle.Unframed}-${e.PaperType.MattePoster}-Unmatted`]: 10.84,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x20x30}-${e.FrameStyle.Unframed}-${e.PaperType.MattePoster}-Unmatted`]: 10.69,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x22x28}-${e.FrameStyle.Unframed}-${e.PaperType.MattePoster}-Unmatted`]: 11.31,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x24x30}-${e.FrameStyle.Unframed}-${e.PaperType.MattePoster}-Unmatted`]: 11.3,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x24x36}-${e.FrameStyle.Unframed}-${e.PaperType.MattePoster}-Unmatted`]: 12.66
    }
        , s = {
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x10x24}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 7.8,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x11x14}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 6.75,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x12x12}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 6.8,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x12x16}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 6.88,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x14x14}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 7.61,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x16x16}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 8.6,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x16x20}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 9.65,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x16x24}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 10.65,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x16dot5x23dot4}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 10.99,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x18x18}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 11,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x18x24}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 12.21,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x20x20}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 10.55,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x20x28}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 12,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x23dot4x33dot1}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 13,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x24x32}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 14,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x24x36}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 13.5,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x28x28}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 13.5,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x28x40}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 14.5,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x30x40}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 16,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x33dot1x46dot8}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 17
    }
        , S = {
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x16x20}-${e.FrameStyle.Unframed}-${e.PaperType.MattePoster}-Unmatted`]: 6.85,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x18x24}-${e.FrameStyle.Unframed}-${e.PaperType.MattePoster}-Unmatted`]: 10.01,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x20x30}-${e.FrameStyle.Unframed}-${e.PaperType.MattePoster}-Unmatted`]: 10.65,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x24x36}-${e.FrameStyle.Unframed}-${e.PaperType.MattePoster}-Unmatted`]: 12.21,
        [`${e.CatalogProductId.SetOf2ArtPrints}-${e.ProductSize.x24x36}-${e.FrameStyle.Unframed}-${e.PaperType.MattePoster}-Unmatted`]: 21.05,
        [`${e.CatalogProductId.SetOf3ArtPrints}-${e.ProductSize.x24x36}-${e.FrameStyle.Unframed}-${e.PaperType.MattePoster}-Unmatted`]: 30.07
    }
        , p = {
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x5x7}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 3.86,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x8x10}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 4.67,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x11x14}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 6.31,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x18x24}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 13.19,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x24x36}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 16.3
    }
        , A = {
        [`${e.CatalogProductId.SetOf4ArtPrints}-${e.ProductSize.x12x16}-${e.FrameStyle.Unframed}-${e.PaperType.SemiGlossPoster}-Unmatted`]: 4.21,
        [`${e.CatalogProductId.SetOf6ArtPrints}-${e.ProductSize.x8x10}-${e.FrameStyle.Unframed}-${e.PaperType.SemiGlossPoster}-Unmatted`]: 4.1,
        [`${e.CatalogProductId.SetOf6ArtPrints}-${e.ProductSize.x12x16}-${e.FrameStyle.Unframed}-${e.PaperType.SemiGlossPoster}-Unmatted`]: 4.89,
        [`${e.CatalogProductId.SetOf8ArtPrints}-${e.ProductSize.x12x16}-${e.FrameStyle.Unframed}-${e.PaperType.SemiGlossPoster}-Unmatted`]: 5.27,
        [`${e.CatalogProductId.SetOf9ArtPrints}-${e.ProductSize.x12x16}-${e.FrameStyle.Unframed}-${e.PaperType.SemiGlossPoster}-Unmatted`]: 5.46,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x8x10}-${e.FrameStyle.Unframed}-${e.PaperType.SemiGlossPoster}-Unmatted`]: 3.04,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x11x14}-${e.FrameStyle.Unframed}-${e.PaperType.SemiGlossPoster}-Unmatted`]: 3.29,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x12x16}-${e.FrameStyle.Unframed}-${e.PaperType.SemiGlossPoster}-Unmatted`]: 3.54,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x16x20}-${e.FrameStyle.Unframed}-${e.PaperType.LusterPhoto}-Unmatted`]: 5.89,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x18x24}-${e.FrameStyle.Unframed}-${e.PaperType.LusterPhoto}-Unmatted`]: 6.23,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x20x28}-${e.FrameStyle.Unframed}-${e.PaperType.LusterPhoto}-Unmatted`]: 11.11,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x24x36}-${e.FrameStyle.Unframed}-${e.PaperType.LusterPhoto}-Unmatted`]: 10.23,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x28x40}-${e.FrameStyle.Unframed}-${e.PaperType.LusterPhoto}-Unmatted`]: 16
    }
        , x = {
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x8x10}-${e.FrameStyle.Unframed}-${e.PaperType.HotPressFineArt}-Unmatted`]: 5,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x11x14}-${e.FrameStyle.Unframed}-${e.PaperType.HotPressFineArt}-Unmatted`]: 9
    }
        , y = {
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x6x6}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 3.88,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x8x8}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 4.46,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x10x10}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 5.26,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x12x12}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 6.37,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x16x16}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 8.26,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x18x18}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 11.69,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x20x20}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 10.86,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x24x24}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 12.92,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x30x30}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 16.72,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x32x32}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 18.19,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x36x36}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 21.38,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x40x40}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 24.96,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x4x6}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 3.7,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x8x12}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 4.9,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x12x18}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 7.39,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x16x24}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 10.03,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x20x30}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 13.22,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x24x36}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 16.3,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x32x48}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 24.2,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x40x60}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 34.34,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x6x8}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 4.05,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x9x12}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 5.34,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x12x16}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 7.04,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x18x24}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 13.19,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x24x32}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 15.17,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x30x40}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 20.25,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x36x48}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 26.45,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x8x10}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 4.67,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x16x20}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 9.13,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x24x30}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 14.62,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x5x7}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 3.86,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x8dot5x11}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 5.07,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x11x14}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 6.31,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x11x17}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 6.75,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x13x19}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 7.79,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x14x20}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 8.26,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x19x27}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 14.3,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x20x24}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 11.79,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x20x28}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 12.73,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x22x28}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 13.39,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x27x40}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 18.86,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x5dot8x8dot3}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 4.05,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x8dot3x11dot7}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 4.9,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x11dot7x16dot5}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 6.83,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x16dot5x23dot4}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 10.07,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x23dot4x33dot1}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 15.25,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x33dot1x46dot8}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 24.35,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x11x15dot7}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 6.56,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x11dot8x15dot7}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 6.75,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x15dot7x19dot7}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 8.68,
        [`${e.CatalogProductId.IndividualArtPrint}-${e.ProductSize.x19dot7x27dot6}-${e.FrameStyle.Unframed}-${e.PaperType.ArchivalMatteFineArt}-Unmatted`]: 14.74
    }
        , g = {
        [`${e.CatalogProductId.SetOf10ArtPrints}-${e.ProductSize.x12x16}-${e.FrameStyle.Unframed}-${e.PaperType.MattePoster}-Unmatted`]: 27.12,
        [`${e.CatalogProductId.SetOf10ArtPrints}-${e.ProductSize.x18x24}-${e.FrameStyle.Unframed}-${e.PaperType.MattePoster}-Unmatted`]: 59.31,
        [`${e.CatalogProductId.PictureFrame}-${e.ProductSize.x12x16}-${e.FrameStyle.Metal}-null-Unmatted`]: 12.93,
        [`${e.CatalogProductId.PictureFrame}-${e.ProductSize.x12x16}-${e.FrameStyle.Oak}-null-Unmatted`]: 12.93,
        [`${e.CatalogProductId.PictureFrame}-${e.ProductSize.x18x24}-${e.FrameStyle.Metal}-null-Unmatted`]: 19.22,
        [`${e.CatalogProductId.PictureFrame}-${e.ProductSize.x18x24}-${e.FrameStyle.Oak}-null-Unmatted`]: 19.22,
        [`${e.CatalogProductId.PictureFrame}-${e.ProductSize.x12x16}-${e.FrameStyle.Metal}-null-Matted`]: 12.93,
        [`${e.CatalogProductId.PictureFrame}-${e.ProductSize.x12x16}-${e.FrameStyle.Oak}-null-Matted`]: 12.93,
        [`${e.CatalogProductId.PictureFrame}-${e.ProductSize.x18x24}-${e.FrameStyle.Metal}-null-Matted`]: 19.22,
        [`${e.CatalogProductId.PictureFrame}-${e.ProductSize.x18x24}-${e.FrameStyle.Oak}-null-Matted`]: 19.22
    };
    t.s(["USER_DISCOUNTS", 0, {
        "1ebaf970-57e9-4ca6-9f8c-84abab7292bb": {
            productionCostDiscounts: o
        },
        "2a82aed7-b145-40d7-b144-f3bc1a94eecf": {
            productionCostDiscounts: l
        },
        "3c253e18-efeb-4195-8dd1-0cb2accc3b91": {
            productionCostDiscounts: s
        },
        "00ab14cc-98e3-43c5-8426-324b350b7ef9": {
            productionCostDiscounts: x
        },
        "19be0e8d-18c3-4ba3-b75a-f3ad49ce380f": {
            productionCostDiscounts: P
        },
        "009e5aa1-259d-4116-a8db-2c8ae4d19de9": {
            productionCostDiscounts: P
        },
        "409edc79-93d6-4084-9c66-21f91c81c6f3": {
            productionCostDiscounts: o
        },
        "0272ec37-2fde-4add-a6d6-bd78642c98d1": {
            productionCostDiscounts: g
        },
        "61188c3e-0c9d-4091-97de-d233a26040dc": {
            productionCostDiscounts: u
        },
        "ad5fe915-16d7-47dd-b8fb-8232bbf0eccb": {
            productionCostDiscounts: S
        },
        "c507552b-91fd-47c9-ada0-159a91f5a5ca": {
            productionCostDiscounts: m
        },
        "cd6988d6-6333-4c36-98c7-3519e5373d55": {
            productionCostDiscounts: c
        },
        "ce74d4c7-d11a-45dc-9afd-8f1434494c2d": {
            productionCostDiscounts: y
        },
        "dcb184b3-a6d9-4766-8ab7-3da5ce9e067d": {
            productionCostDiscounts: A
        },
        "e152dddd-765e-47c0-b861-7300b7e3e6cb": {
            freeBranding: !0,
            productionCostDiscounts: p
        },
        "e576a03e-49ec-4cf8-a88a-d162d83d14ba": {
            productionCostDiscounts: $
        }
    }], 119530)
}
    , 750089, 337845, 709937, t => {
        "use strict";
        t.i(260835);
        var e = t.i(245974);
        let r = t => t.orderItems.some(t => t.product && t.product.frameStyle !== e.FrameStyle.Unframed);
        var a = t.i(406855)
            , i = t.i(228337);
        t.i(181043);
        var d = t.i(691013);
        let n = t => {
            let e = t.orderItems.filter(t => !!t.product);
            return e.length ? e : null
        }
            , o = t => t.flatMap(t => {
                let {product: r} = t;
                return r ? (0,
                    a.isGallerySize)(r.size) ? d.GALLERIES_CONFIG[r.size].prints.flatMap( ({size: e}) => o([{
                    ...t,
                    product: {
                        ...r,
                        catalogProductId: "IndividualArtPrint",
                        size: e
                    }
                }])) : i.default.times((0,
                    a.getDesignCount)(r.catalogProductId) * t.quantity, () => ({
                    ...r,
                    catalogProductId: (0,
                        a.isPrivateLabelFrames)(r.catalogProductId) ? e.CatalogProductId.PictureFrame : e.CatalogProductId.IndividualArtPrint
                })) : []
            }
        )
            , P = (t, r) => t === e.FrameStyle.Unframed ? 0 : ({
            [e.FrameStyle.PremiumOak]: 1.375,
            [e.FrameStyle.PremiumMetal]: 1.375,
            [e.FrameStyle.Oak]: 1.125,
            [e.FrameStyle.Metal]: 1.125
        })[(0,
            a.getEffectiveFrameStyle)(t, r)]
            , l = (t, e, r) => {
            let {widthInInch: i, heightInInch: d} = (0,
                a.getSizeDimensions)(t.size)
                , n = P(t.frameStyle, t.size)
                , o = [i + n, d + n].sort( (t, e) => t - e)
                , l = [e.length, e.width].sort( (t, e) => t - e)
                , u = r ? (t, e) => t < e : (t, e) => t <= e;
            return u(o[0], l[0]) && u(o[1], l[1])
        }
            , u = [{
            dimensions: {
                height: 4,
                length: 11.25,
                weight: 8,
                width: 9.25
            },
            maxFloorDimensions: {
                length: 11,
                width: 9
            },
            name: "Box 1.1"
        }, {
            dimensions: {
                height: 5.75,
                length: 11.25,
                weight: 9.9,
                width: 9.25
            },
            maxFloorDimensions: {
                length: 11,
                width: 9
            },
            name: "Box 1"
        }, {
            dimensions: {
                height: 4,
                length: 15.25,
                weight: 15.8,
                width: 13.62
            },
            maxFloorDimensions: {
                length: 15,
                width: 13.25
            },
            name: "Box 2.1"
        }, {
            dimensions: {
                height: 5.75,
                length: 15.25,
                weight: 16,
                width: 13.62
            },
            maxFloorDimensions: {
                length: 15,
                width: 13.25
            },
            name: "Box 2"
        }, {
            dimensions: {
                height: 4,
                length: 21.25,
                weight: 22.4,
                width: 15.25
            },
            maxFloorDimensions: {
                length: 21,
                width: 15
            },
            name: "Box 3.1"
        }, {
            dimensions: {
                height: 5.75,
                length: 21.25,
                weight: 25.6,
                width: 15.25
            },
            maxFloorDimensions: {
                length: 21.125,
                width: 15
            },
            name: "Box 3"
        }, {
            dimensions: {
                height: 4,
                length: 27.25,
                weight: 35.2,
                width: 19.25
            },
            maxFloorDimensions: {
                length: 27,
                width: 19
            },
            name: "Box 4.1"
        }, {
            dimensions: {
                height: 5.75,
                length: 27.25,
                weight: 38.4,
                width: 19.25
            },
            maxFloorDimensions: {
                length: 27,
                width: 19
            },
            name: "Box 4"
        }, {
            dimensions: {
                height: 4,
                length: 29.25,
                weight: 41.6,
                width: 23.25
            },
            maxFloorDimensions: {
                length: 29,
                width: 23
            },
            name: "Box 5.1"
        }, {
            dimensions: {
                height: 5.75,
                length: 29.25,
                weight: 51.2,
                width: 23.25
            },
            maxFloorDimensions: {
                length: 29,
                width: 23
            },
            name: "Box 5"
        }, {
            dimensions: {
                height: 4,
                length: 33.25,
                weight: 57.6,
                width: 25.62
            },
            maxFloorDimensions: {
                length: 33,
                width: 25
            },
            name: "Box 6.1"
        }, {
            dimensions: {
                height: 6,
                length: 33.25,
                weight: 70.4,
                width: 25.62
            },
            maxFloorDimensions: {
                length: 33,
                width: 25
            },
            name: "Box 6"
        }, {
            dimensions: {
                height: 4,
                length: 38.5,
                weight: 67.2,
                width: 27.5
            },
            maxFloorDimensions: {
                length: 38,
                width: 27
            },
            name: "Box 7.1"
        }]
            , $ = t => t.filter(t => t.items.length > 0).length
            , m = (t, e, r, a) => {
            let i = [[0, 0]];
            return t.items.forEach(t => {
                    i.push([t.x + t.width, t.y], [t.x, t.y + t.height], [t.x + t.width, t.y + t.height])
                }
            ),
                i.filter( ([i,d]) => !(i + e > a.width) && !(d + r > a.length) && !t.items.some(t => i < t.x + t.width && i + e > t.x && d < t.y + t.height && d + r > t.y)).sort( (t, e) => t[0] + t[1] - (e[0] + e[1]))
        }
            , c = (t, e, r, i, d) => {
            var n, o, l;
            let u, s;
            if (Date.now() - d > 5e3)
                return null;
            if (0 === t.remainingProducts.length)
                return {
                    floors: t.floors,
                    success: !0
                };
            if (i && (n = t,
                o = i,
                l = e,
                u = $(n.floors),
                !(!(u > (s = $(o.floors))) && u + Math.ceil(n.remainingProducts.reduce( (t, e) => {
                        let r = (0,
                            a.getSizeDimensions)(e.size)
                            , i = P(e.frameStyle, e.size);
                        return t + (r.widthInInch + i) * (r.heightInInch + i)
                    }
                    , 0) / (l.length * l.width)) <= s)))
                return null;
            let[S] = t.remainingProducts;
            if (!S)
                return null;
            let p = (0,
                a.getSizeDimensions)(S.size)
                , A = P(S.frameStyle, S.size)
                , x = p.widthInInch + A
                , y = p.heightInInch + A
                , g = i;
            for (let a = 0; a < Math.min(t.currentFloorIndex + 1, r); a++)
                for (let[n,o,P] of [[x, y, !1], [y, x, !0]])
                    if (!(n > e.width) && !(o > e.length))
                        for (let[l,u] of m(t.floors[a], n, o, e)) {
                            let m = {
                                currentFloorIndex: Math.max(t.currentFloorIndex, a),
                                floors: t.floors.map( (t, e) => e === a ? {
                                    items: [...t.items, {
                                        height: o,
                                        product: S,
                                        rotated: P,
                                        width: n,
                                        x: l,
                                        y: u
                                    }]
                                } : {
                                    items: [...t.items]
                                }),
                                remainingProducts: t.remainingProducts.slice(1)
                            }
                                , s = c(m, e, r, g, d);
                            if (s?.success && (g = s,
                            $(s.floors) < $(i?.floors ?? [])))
                                return s
                        }
            if (t.currentFloorIndex < r - 1) {
                let a = t.currentFloorIndex + 1;
                for (let[i,n,o] of [[x, y, !1], [y, x, !0]]) {
                    if (i > e.width || n > e.length)
                        continue;
                    let P = c({
                        currentFloorIndex: a,
                        floors: t.floors.map( (t, e) => e === a ? {
                            items: [{
                                height: n,
                                product: S,
                                rotated: o,
                                width: i,
                                x: 0,
                                y: 0
                            }]
                        } : {
                            items: [...t.items]
                        }),
                        remainingProducts: t.remainingProducts.slice(1)
                    }, e, r, g, d);
                    P?.success && (g = P)
                }
            }
            return g
        }
            , s = t => t.some(t => (0,
            a.isLargeFrameSize)(t.size))
            , S = [{
            digitalOnly: !1,
            dimensions: {
                height: .2,
                length: 11.5,
                weight: 3,
                width: 9
            },
            isTube: !1,
            maxPrints: 12,
            name: "Mailer 1"
        }, {
            digitalOnly: !1,
            dimensions: {
                height: .2,
                length: 12.75,
                weight: 5,
                width: 15
            },
            isTube: !1,
            maxPrints: 12,
            name: "Mailer 2"
        }, {
            digitalOnly: !0,
            dimensions: {
                height: .2,
                length: 13,
                weight: 6,
                width: 18
            },
            isTube: !1,
            maxPrints: 12,
            name: "Mailer 3"
        }, {
            digitalOnly: !1,
            dimensions: {
                height: 5,
                length: 21.375,
                weight: 5.8,
                width: 5
            },
            isTube: !0,
            maxPrints: 4,
            name: "Tube 1"
        }, {
            digitalOnly: !1,
            dimensions: {
                height: 5,
                length: 26,
                weight: 7,
                width: 5
            },
            isTube: !0,
            maxPrints: 4,
            name: "Tube 2"
        }, {
            digitalOnly: !1,
            dimensions: {
                height: 5,
                length: 36.25,
                weight: 9.2,
                width: 5
            },
            isTube: !0,
            maxPrints: 4,
            name: "Tube 3"
        }, {
            digitalOnly: !1,
            dimensions: {
                height: 6.5,
                length: 44,
                weight: 42,
                width: 6.5
            },
            isTube: !0,
            maxPrints: 4,
            name: 'Tube 4 + 44" box'
        }]
            , p = {
            x4x6: {
                Metal: 4.79726,
                Oak: 5.29109,
                PremiumMetal: 6.4,
                PremiumOak: 9.6
            },
            x5dot8x8dot3: {
                Metal: 10,
                Oak: 10,
                PremiumMetal: 15,
                PremiumOak: 15
            },
            x5x7: {
                Metal: 6.20822,
                Oak: 6.9137,
                PremiumMetal: 9.6,
                PremiumOak: 12.8
            },
            x6x6: {
                Metal: 6.2,
                Oak: 6.9,
                PremiumMetal: 9.6,
                PremiumOak: 12.8
            },
            x6x8: {
                Metal: 7.5,
                Oak: 8.25411,
                PremiumMetal: 11.2,
                PremiumOak: 16
            },
            x8dot3x11dot7: {
                Metal: 22,
                Oak: 22,
                PremiumMetal: 27,
                PremiumOak: 27
            },
            x8dot5x11: {
                Metal: 11.14657,
                Oak: 11.9226,
                PremiumMetal: 22.4,
                PremiumOak: 25.6
            },
            x8x8: {
                Metal: 8.5,
                Oak: 10.01781,
                PremiumMetal: 16,
                PremiumOak: 19.2
            },
            x8x10: {
                Metal: 10.37054,
                Oak: 11.21712,
                PremiumMetal: 19.2,
                PremiumOak: 22.4
            },
            x8x12: {
                Metal: 20,
                Oak: 20,
                PremiumMetal: 25,
                PremiumOak: 25
            },
            x9x12: {
                Metal: 12.62808,
                Oak: 13.26301,
                PremiumMetal: 22.4,
                PremiumOak: 28.8
            },
            x10x10: {
                Metal: 13.9,
                Oak: 14.39178,
                PremiumMetal: 22.4,
                PremiumOak: 28.8
            },
            x11dot7x16dot5: {
                Metal: 24,
                Oak: 24,
                PremiumMetal: 46,
                PremiumOak: 46
            },
            x11x14: {
                Metal: 16.29657,
                Oak: 17.84862,
                PremiumMetal: 32,
                PremiumOak: 35.2
            },
            x11x17: {
                Metal: 20.10616,
                Oak: 21.09383,
                PremiumMetal: 38.4,
                PremiumOak: 44.8
            },
            x12x12: {
                Metal: 16.9,
                Oak: 17.91917,
                PremiumMetal: 28.8,
                PremiumOak: 35.2
            },
            x12x16: {
                Metal: 19.18904,
                Oak: 19.2,
                PremiumMetal: 38.4,
                PremiumOak: 44.8
            },
            x12x18: {
                Metal: 21.65821,
                Oak: 22.85753,
                PremiumMetal: 41.6,
                PremiumOak: 41.6
            },
            x16dot5x23dot4: {
                Metal: 46,
                Oak: 46,
                PremiumMetal: 83,
                PremiumOak: 83
            },
            x16x16: {
                Metal: 24.5,
                Oak: 27.79588,
                PremiumMetal: 48,
                PremiumOak: 44.8
            },
            x16x20: {
                Metal: 33.58081,
                Oak: 35.69725,
                PremiumMetal: 60.8,
                PremiumOak: 54.4
            },
            x16x24: {
                Metal: 38.94245,
                Oak: 43.66916,
                PremiumMetal: 76.8,
                PremiumOak: 76.8
            },
            x18x18: {
                Metal: 31.5,
                Oak: 33.5,
                PremiumMetal: 54,
                PremiumOak: 57.6
            },
            x18x24: {
                Metal: 44.44519,
                Oak: 46.49108,
                PremiumMetal: 80,
                PremiumOak: 83.2
            },
            x20x20: {
                Metal: 44.4,
                Oak: 44.58629,
                PremiumMetal: 76.8,
                PremiumOak: 86.4
            },
            x20x28: {
                Metal: 52.8,
                Oak: 52.8,
                PremiumMetal: 115.2,
                PremiumOak: 115.2
            },
            x20x30: {
                Metal: 66.45614,
                Oak: 69.13697,
                PremiumMetal: 108.8,
                PremiumOak: 124.8
            },
            x23dot4x33dot1: {
                Metal: 64,
                Oak: 64,
                PremiumMetal: 152,
                PremiumOak: 152
            },
            x24x24: {
                Metal: 57.6,
                Oak: 59.2,
                PremiumMetal: 99.2,
                PremiumOak: 103.2
            },
            x24x30: {
                Metal: 66.4,
                Oak: 66.4,
                PremiumMetal: 145,
                PremiumOak: 145
            },
            x24x32: {
                Metal: 69.6,
                Oak: 69.6,
                PremiumMetal: 152,
                PremiumOak: 152
            },
            x24x36: {
                Metal: 94.11093,
                Oak: 96.79175,
                PremiumMetal: 166.4,
                PremiumOak: 166.4
            }
        }
            , A = (t, e) => p[t][e]
            , x = {
            ArchivalMatteFineArt: 230,
            HotPressFineArt: 300,
            ColdPressFineArt: 305,
            PearlFineArt: 285,
            GermanEtchingFineArt: 310,
            VelvetFineArt: 255,
            WatercolorFineArt: 300,
            GlossyPhoto: 250,
            LusterPhoto: 260,
            SemiMattePhoto: 260,
            MattePhoto: 280,
            RagSatinPhoto: 310,
            PearlPhoto: 285,
            SemiGlossPoster: 280,
            GlossyPoster: 200,
            MattePoster: 190,
            SemiMatteLinenPoster: 270
        }
            , y = t => .00327706 * x[t];
        t.s(["getPaperWeightInGSM", 0, t => x[t], "getPaperWeightInOuncesPerSqft", 0, y], 337845),
            t.s(["getPackageAndProductWeightData", 0, (t, m=!1) => {
                let p = i.default.sum(t.map( ({product: t, quantity: e}) => t ? ( ({catalogProductId: t, size: e, frameStyle: r, paperType: i}, n) => {
                        let o = 0
                            , P = 0;
                        if ("Unframed" !== r && ((0,
                            a.isGallerySize)(e) ? o += d.GALLERIES_CONFIG[e].prints.map(t => t.size).reduce( (t, e) => t + A(e, (0,
                            a.getEffectiveFrameStyle)(r, e)), 0) : o += A(e, (0,
                            a.getEffectiveFrameStyle)(r, e))),
                            i) {
                            let t = y(i);
                            P = (0,
                                a.getPaperAreaInFeet)(e) * t
                        }
                        return (P + o) * ((0,
                            a.isGallerySize)(e) ? 1 : (0,
                            a.getDesignCount)(t)) * n
                    }
                )(t, e) : 0))
                    , x = ( (t, d=!0) => {
                        let m, p, A = ( (t, i) => {
                                if (r(t))
                                    return ( (t, r) => {
                                            let i = n(t);
                                            if (!i)
                                                return null;
                                            let d = o(i)
                                                , m = d.filter(t => t.frameStyle === e.FrameStyle.Unframed)
                                                , S = d.filter(t => t.frameStyle !== e.FrameStyle.Unframed);
                                            if (m.length > 5)
                                                return null;
                                            let p = u.find(t => {
                                                    var e, i;
                                                    let d, n, o, u, p;
                                                    if (!m.every(e => l(e, t.maxFloorDimensions, !1)) || !S.every(e => l(e, t.maxFloorDimensions, !1)))
                                                        return !1;
                                                    let A = (e = t,
                                                        d = (i = S).filter(t => (0,
                                                            a.isPremiumFrame)(t.frameStyle)),
                                                        n = i.filter(t => !(0,
                                                            a.isPremiumFrame)(t.frameStyle)),
                                                        o = d.length > 0,
                                                        u = s(d),
                                                        p = s(n),
                                                        4 === e.dimensions.height ? u ? 1 : o ? 2 : 4 : o ? 3 : p ? 6 : 7);
                                                    return ( (t, e, r, i) => {
                                                            var d;
                                                            if (!t.length)
                                                                return !0;
                                                            if (t.reduce( (t, e) => {
                                                                    let r = (0,
                                                                        a.getSizeDimensions)(e.size)
                                                                        , i = P(e.frameStyle, e.size);
                                                                    return t + (r.widthInInch + i) * (r.heightInInch + i)
                                                                }
                                                                , 0) > e.length * e.width * r)
                                                                return !1;
                                                            let n = ( (t, e, r) => {
                                                                    if ((t => {
                                                                            let[e] = t;
                                                                            if (!e)
                                                                                return !0;
                                                                            let r = (0,
                                                                                a.getSizeDimensions)(e.size)
                                                                                , i = P(e.frameStyle, e.size)
                                                                                , d = r.widthInInch + i
                                                                                , n = r.heightInInch + i;
                                                                            return t.every(t => {
                                                                                    let e = (0,
                                                                                        a.getSizeDimensions)(t.size)
                                                                                        , r = P(t.frameStyle, t.size)
                                                                                        , i = e.widthInInch + r
                                                                                        , o = e.heightInInch + r;
                                                                                    return i === d && o === n
                                                                                }
                                                                            )
                                                                        }
                                                                    )(t))
                                                                        return ( (t, e, r) => {
                                                                                let[i] = t;
                                                                                if (!i)
                                                                                    return {
                                                                                        floors: [],
                                                                                        success: !0
                                                                                    };
                                                                                let d = (0,
                                                                                    a.getSizeDimensions)(i.size)
                                                                                    , n = P(i.frameStyle, i.size)
                                                                                    , o = d.widthInInch + n
                                                                                    , l = d.heightInInch + n
                                                                                    , u = [{
                                                                                    cols: Math.floor(e.width / o),
                                                                                    itemHeight: l,
                                                                                    itemWidth: o,
                                                                                    rows: Math.floor(e.length / l)
                                                                                }, {
                                                                                    cols: Math.floor(e.width / l),
                                                                                    itemHeight: o,
                                                                                    itemWidth: l,
                                                                                    rows: Math.floor(e.length / o)
                                                                                }].reduce( (t, e) => e.cols * e.rows > t.cols * t.rows ? e : t)
                                                                                    , $ = u.cols * u.rows;
                                                                                if (0 === $)
                                                                                    return null;
                                                                                let m = Math.ceil(t.length / $);
                                                                                if (m > r)
                                                                                    return null;
                                                                                let c = 0
                                                                                    , s = Array.from({
                                                                                    length: m
                                                                                }).map( () => {
                                                                                        let e = {
                                                                                            items: []
                                                                                        };
                                                                                        return Array.from({
                                                                                            length: Math.min($, t.length - c)
                                                                                        }).forEach( (r, a) => {
                                                                                                let i = Math.floor(a / u.cols)
                                                                                                    , d = a % u.cols;
                                                                                                e.items.push({
                                                                                                    height: u.itemHeight,
                                                                                                    product: t[c],
                                                                                                    rotated: u.itemWidth === l,
                                                                                                    width: u.itemWidth,
                                                                                                    x: d * u.itemWidth,
                                                                                                    y: i * u.itemHeight
                                                                                                }),
                                                                                                    c++
                                                                                            }
                                                                                        ),
                                                                                            e
                                                                                    }
                                                                                )
                                                                                    , S = r - s.length;
                                                                                return s.push(...Array.from({
                                                                                    length: S
                                                                                }, () => ({
                                                                                    items: []
                                                                                }))),
                                                                                    {
                                                                                        floors: s,
                                                                                        success: !0
                                                                                    }
                                                                            }
                                                                        )(t, e, r);
                                                                    let i = [...t].sort( (t, e) => {
                                                                            let r = (0,
                                                                                a.getSizeDimensions)(t.size)
                                                                                , i = (0,
                                                                                a.getSizeDimensions)(e.size)
                                                                                , d = P(t.frameStyle, t.size)
                                                                                , n = P(e.frameStyle, e.size)
                                                                                , o = (r.widthInInch + d) * (r.heightInInch + d);
                                                                            return (i.widthInInch + n) * (i.heightInInch + n) - o
                                                                        }
                                                                    );
                                                                    return c({
                                                                        currentFloorIndex: 0,
                                                                        floors: Array(r).fill(null).map( () => ({
                                                                            items: []
                                                                        })),
                                                                        remainingProducts: i
                                                                    }, e, r, null, Date.now())
                                                                }
                                                            )(t, e, r);
                                                            return n?.success && i && (d = n.floors,
                                                                console.log("\n=== FRAMED PACKAGE PACKING VISUALIZATION ==="),
                                                                console.log(`Floor dimensions: ${e.length}" x ${e.width}"`),
                                                                console.log(`Total floors used: ${$(d)}
`),
                                                                d.forEach( (t, r) => {
                                                                        if (0 === t.items.length)
                                                                            return;
                                                                        console.log(`Floor ${r + 1}:`);
                                                                        let i = Math.ceil(4 * e.width)
                                                                            , d = Math.ceil(4 * e.length)
                                                                            , n = Array(d).fill(null).map( () => Array(i).fill(" "));
                                                                        n.forEach( (t, e) => {
                                                                                t.forEach( (t, r) => {
                                                                                        (0 === e || e === d - 1 || 0 === r || r === i - 1) && (n[e][r] = "█")
                                                                                    }
                                                                                )
                                                                            }
                                                                        ),
                                                                            t.items.forEach(t => {
                                                                                    let e = Math.round(4 * t.x)
                                                                                        , r = Math.min(Math.round((t.x + t.width) * 4), i - 1)
                                                                                        , a = Math.round(4 * t.y)
                                                                                        , o = Math.min(Math.round((t.y + t.height) * 4), d - 1);
                                                                                    for (let t = a; t <= o; t++)
                                                                                        for (let P = e; P <= r; P++) {
                                                                                            let l = t === a || t === o || P === e || P === r;
                                                                                            P > 0 && P < i - 1 && t > 0 && t < d - 1 && l && (n[t][P] = "┃")
                                                                                        }
                                                                                    a > 0 && e > 0 && (n[a][e] = "┏"),
                                                                                    a > 0 && r < i - 1 && (n[a][r] = "┓"),
                                                                                    o < d - 1 && e > 0 && (n[o][e] = "┗"),
                                                                                    o < d - 1 && r < i - 1 && (n[o][r] = "┛");
                                                                                    for (let t = e + 1; t < r; t++)
                                                                                        a > 0 && a < d - 1 && (n[a][t] = "━"),
                                                                                        o > 0 && o < d - 1 && (n[o][t] = "━");
                                                                                    for (let t = a + 1; t < o; t++)
                                                                                        e > 0 && e < i - 1 && (n[t][e] = "┃"),
                                                                                        r > 0 && r < i - 1 && (n[t][r] = "┃");
                                                                                    let P = `${t.width}"x${t.height}"`
                                                                                        , l = Math.floor((a + o) / 2)
                                                                                        , u = Math.floor((e + r - P.length) / 2);
                                                                                    l > a && l < o && u > e && u + P.length < r && [...P].forEach( (t, e) => {
                                                                                            u + e > 0 && u + e < i - 1 && (n[l][u + e] = t)
                                                                                        }
                                                                                    )
                                                                                }
                                                                            ),
                                                                            n.forEach(t => {
                                                                                    console.log(`  ${t.join("")}`)
                                                                                }
                                                                            ),
                                                                            console.log("  Items on this floor:"),
                                                                            t.items.forEach(t => {
                                                                                    let e = (0,
                                                                                        a.getSizeDimensions)(t.product.size);
                                                                                    console.log(`    ${t.product.size} (${e.widthInInch}" x ${e.heightInInch}") -> ${t.width}" x ${t.height}" at (${t.x}", ${t.y}")`)
                                                                                }
                                                                            ),
                                                                            console.log("")
                                                                    }
                                                                ),
                                                                console.log("===============================================\n")),
                                                                !!n?.success
                                                        }
                                                    )(S, t.maxFloorDimensions, A, r)
                                                }
                                            );
                                            return p ? {
                                                name: p.name,
                                                ...p.dimensions
                                            } : null
                                        }
                                    )(t, void 0);
                                let d = n(t);
                                if (!d)
                                    return null;
                                let m = o(d)
                                    , p = t.orderItems.some(t => {
                                        let e = t.product?.paperType;
                                        return !!e && (0,
                                            a.isDigitalPaperType)(e)
                                    }
                                )
                                    , A = S.find(t => {
                                        if (p) {
                                            if (t.isTube)
                                                return !1
                                        } else if (t.digitalOnly)
                                            return !1;
                                        return !(m.length > t.maxPrints) && m.every(e => {
                                                let {widthInInch: r, heightInInch: i} = (0,
                                                    a.getSizeDimensions)(e.size);
                                                return t.isTube ? Math.min(r, i) <= Math.max(t.dimensions.length, t.dimensions.width, t.dimensions.height) : l(e, t.dimensions, !0)
                                            }
                                        )
                                    }
                                );
                                return A ? {
                                    name: A.name,
                                    ...A.dimensions
                                } : null
                            }
                        )({
                            orderItems: t
                        });
                        return A ? A : d ? r({
                            orderItems: t
                        }) ? {
                            name: (m = i.default.maxBy(u, ({dimensions: {weight: t}}) => t)).name,
                            ...m.dimensions
                        } : {
                            name: (p = i.default.maxBy(S, ({dimensions: {weight: t}}) => t)).name,
                            ...p.dimensions
                        } : null
                    }
                )(t, m);
                return x ? {
                    packageForOrder: x,
                    packageWeightInOunces: x.weight,
                    productWeightInOunces: p,
                    weightInOunces: p + x.weight
                } : {
                    packageForOrder: null,
                    packageWeightInOunces: null,
                    productWeightInOunces: p,
                    weightInOunces: null
                }
            }
            ], 709937),
            t.s([], 750089)
    }
    , 67122, 127909, t => {
        "use strict";
        var e = t.i(62056)
            , r = t.i(568250);
        t.i(260835);
        var a = t.i(245974);
        t.i(181043);
        var i = t.i(691013)
            , d = t.i(406855);
        t.i(750089);
        var n = t.i(709937);
        let o = {
            fixedCost: .3,
            percent: .029
        };
        t.s(["MIN_STRIPE_AMOUNT_USD", 0, .5, "STRIPE_COSTS", 0, o], 127909),
            t.i(556928);
        var P = t.i(742677)
            , l = t.i(228337)
            , u = t.i(748337)
            , $ = t.i(762211);
        class m {
            static INTERNATIONAL_SHIPPING_MAX_WEIGHT_LBS = 70;
            static PHYSICAL_FRAME_TYPE_MAP = {
                Metal: "Standard",
                Oak: "Standard",
                PremiumMetal: "Premium",
                PremiumOak: "Premium"
            };
            static MARKETPLACE_FEES = {
                Etsy: {
                    baseCharge: .25,
                    percentCharge: .095
                },
                Shopify: {
                    baseCharge: .3,
                    percentCharge: .029
                }
            };
            static getSmallestDimension = l.default.memoize(t => {
                    let {heightInInch: e, widthInInch: r} = (0,
                        d.getSizeDimensions)(t);
                    return Math.min(e, r)
                }
            );
            static getLinearFeetPerFrame = t => {
                let {widthInInch: r, heightInInch: a} = (0,
                    d.getSizeDimensions)(t);
                return 2 * ((a + r) / e.INCHES_PER_FOOT)
            }
            ;
            static getSizeWithLargestMinDimension = l.default.memoize(t => {
                    let e = 0
                        , r = i.GALLERIES_CONFIG[t].prints[0].size;
                    return i.GALLERIES_CONFIG[t].prints.forEach(t => {
                            let a = this.getSmallestDimension(t.size);
                            a > e && (e = a,
                                r = t.size)
                        }
                    ),
                        r
                }
            );
            static getValueFromThresholdArray = (t, e) => {
                for (let {value: r, threshold: a} of e)
                    if (t >= a)
                        return r;
                throw Error("Invalid value encountered")
            }
            ;
            static getSleeveCost = t => {
                let e = t;
                (0,
                    d.isGallerySize)(t) && (e = this.getSizeWithLargestMinDimension(t));
                let a = this.getSmallestDimension(e);
                return this.getValueFromThresholdArray(a, r.PRICING_DATA.shipping.packaging.sleeveCosts)
            }
            ;
            static getUnframedMailerCosts = t => {
                let {unframedMailerCosts: e} = r.PRICING_DATA.shipping.packaging
                    , a = this.getValueFromThresholdArray(this.getSmallestDimension(t), e)
                    , i = this.getSleeveCost(t);
                return {
                    packaging: a,
                    sleeves: i,
                    total: a + i
                }
            }
            ;
            static getMarginMultiplier(t) {
                return 1 / (1 - t / (1 - o.percent))
            }
            static getPaperCosts(t) {
                let {catalogProductId: e, paperType: a, size: i} = t;
                if (!a)
                    return {
                        ink: 0,
                        paper: 0,
                        total: 0
                    };
                let {inkCosts: n, paperCosts: o} = r.PRICING_DATA
                    , {price: l} = o[a]
                    , u = (0,
                    d.isDigitalPaperType)(a)
                    , $ = (0,
                    d.getPaperAreaInFeet)(i)
                    , m = (0,
                    d.isGallerySize)(i) ? 1 : (0,
                    d.getDesignCount)(e)
                    , c = u ? n.digital : n.wideFormat
                    , s = P.NumberUtils.roundToDecimalPoints($ * c * m, 2)
                    , S = P.NumberUtils.roundToDecimalPoints(u ? l * (0,
                    d.getDesignCount)(e) : $ * l * m, 2);
                return {
                    ink: s,
                    paper: S,
                    total: s + S
                }
            }
            static getFrameCost(t) {
                let {catalogProductId: e, size: n, frameStyle: o} = t;
                return "Unframed" === o ? 0 : (0,
                    d.isGallerySize)(n) ? l.default.sum(i.GALLERIES_CONFIG[n].prints.map(t => m.getFrameCost({
                    catalogProductId: a.CatalogProductId.IndividualArtPrint,
                    frameStyle: o,
                    size: t.size
                }))) : P.NumberUtils.roundToDecimalPoints(m.getLinearFeetPerFrame(n) * r.PRICING_DATA.frameCosts[(0,
                    d.getEffectiveFrameStyle)(o, n)] * (0,
                    d.getDesignCount)(e), 2)
            }
            static getBoxCost = t => {
                let e, {catalogProductId: a, size: i, frameStyle: n} = t, {boxCost: o, framedBoxes: l, framedGalleryBoxSizes: u} = r.PRICING_DATA.shipping.packaging;
                if ((0,
                    d.isGallerySize)(i))
                    e = u[this.PHYSICAL_FRAME_TYPE_MAP[n]][i];
                else {
                    let t = l[this.PHYSICAL_FRAME_TYPE_MAP[n]][i][(0,
                        d.getDesignCount)(a)];
                    if (!t)
                        return 0;
                    if ("price"in t)
                        return t.price;
                    e = t.squareFeet
                }
                return P.NumberUtils.roundToDecimalPoints(e * o, 2)
            }
            ;
            static getFramedPackagingCost(t) {
                let e, {catalogProductId: a, size: i} = t, {includeSleeveForFramedThreshold: n} = r.PRICING_DATA.shipping.packaging;
                if ((0,
                    d.isPrivateLabelFrames)(a))
                    e = 0;
                else {
                    let t = i;
                    (0,
                        d.isGallerySize)(i) && (t = m.getSizeWithLargestMinDimension(i)),
                        e = m.getSmallestDimension(t) >= n ? m.getSleeveCost(t) : 0
                }
                let o = m.getBoxCost(t);
                return {
                    packaging: o,
                    sleeves: e,
                    total: o + e
                }
            }
            static getMarketplaceFees(t, e, r) {
                return m.MARKETPLACE_FEES[e].percentCharge * t + (r ? m.getMarketplaceBaseFee(e) : 0)
            }
            static getMarketplaceBaseFee(t) {
                return m.MARKETPLACE_FEES[t].baseCharge
            }
            static getInternationalShippingEstimate = (t, e) => {
                if (!t)
                    return 0;
                let r = $.default[e] || $.default.CA;
                if (t > this.INTERNATIONAL_SHIPPING_MAX_WEIGHT_LBS) {
                    let[r,a] = [Math.floor(t / this.INTERNATIONAL_SHIPPING_MAX_WEIGHT_LBS), t % this.INTERNATIONAL_SHIPPING_MAX_WEIGHT_LBS];
                    return r * this.getInternationalShippingEstimate(this.INTERNATIONAL_SHIPPING_MAX_WEIGHT_LBS, e) + this.getInternationalShippingEstimate(a, e)
                }
                return r.poundCosts[t]
            }
            ;
            static getDomesticShippingEstimate = t => {
                let {catalogProductId: e, size: a, frameStyle: i} = t
                    , n = r.PRICING_DATA.shipping.estimates;
                if ("Unframed" === i) {
                    let t = a;
                    (0,
                        d.isGallerySize)(a) && (t = this.getSizeWithLargestMinDimension(a));
                    let e = this.getSmallestDimension(t);
                    return this.getValueFromThresholdArray(e, n.unframed)
                }
                return (0,
                    d.isGallerySize)(a) ? n.framedGallery[a] : n.framed[this.PHYSICAL_FRAME_TYPE_MAP[i]][a][(0,
                    d.getDesignCount)(e)] ?? 0
            }
            ;
            static DHL_DIM_DIVISOR = 139;
            static getInternationalShippingFeeBuffer = t => t.every(t => "Unframed" === t.frameStyle) ? 1.3 : 1.25;
            static getInternationalOrderShippingEstimate = (t, r) => {
                let {weightInOunces: a, packageForOrder: i} = (0,
                    n.getPackageAndProductWeightData)(t.map(t => ({
                    product: t,
                    quantity: t.quantity
                })), !0);
                if (!i)
                    throw Error("Expected fallback package to exist");
                let d = i.length * i.width * i.height / this.DHL_DIM_DIVISOR
                    , o = this.getInternationalShippingEstimate(Math.ceil(Math.max(a / e.OZ_PER_POUND, d)), r);
                return P.NumberUtils.roundToDecimalPoints(o * this.getInternationalShippingFeeBuffer(t), 2)
            }
            ;
            static getDomesticOrderTotalShippingCost = t => {
                let {perExtraUnitShippingCosts: e} = r.PRICING_DATA.shipping
                    , a = t.toSorted( (t, e) => (e ? this.getDomesticShippingEstimate(e) : 0) - (t ? this.getDomesticShippingEstimate(t) : 0))
                    , i = 0;
                return a.forEach( (t, r) => {
                        let a;
                        if (!t)
                            return;
                        let n = this.getDomesticShippingEstimate(t)
                            , o = t.quantity;
                        0 === r && o && (i += n,
                            o -= 1),
                            a = (0,
                                d.isGallerySize)(t.size) ? this.getSizeWithLargestMinDimension(t.size) : t.size,
                            i += o * this.getValueFromThresholdArray(this.getSmallestDimension(a), e)
                    }
                ),
                    i
            }
            ;
            static getOrderShippingEstimate = (t, e) => {
                let r = t.filter(t => !!t);
                if (!r.length)
                    return 0;
                let a = r.some(t => "Unframed" !== t.frameStyle) ? 1.05 : 1;
                return "US" === e ? a * this.getDomesticOrderTotalShippingCost(r) : a * this.getInternationalOrderShippingEstimate(r, e)
            }
            ;
            static removeProductionCostMargin = (t, e) => {
                let r = this.getMarginMultiplier(this.getProfitMargin(t))
                    , a = this.getFramingAdjustment(t);
                return (e - o.fixedCost) / r / a + o.fixedCost
            }
            ;
            static getLaborCost = t => {
                let {frameStyle: e, paperType: a} = t
                    , i = a ? u.ProductCatalogUtils.getPaperStyleFromPaperType(a) : "Poster";
                return r.PRICING_DATA.laborCosts["Unframed" === e ? "unframed" : "framed"][i]
            }
            ;
            static getProfitMargin = t => {
                let {frameStyle: e, size: a} = t;
                if ("Unframed" !== e)
                    return r.PRICING_DATA.profitMargin.framed;
                let i = a;
                return (0,
                    d.isGallerySize)(a) && (i = this.getSizeWithLargestMinDimension(a)),
                    this.getValueFromThresholdArray(this.getSmallestDimension(i), r.PRICING_DATA.profitMargin.unframed)
            }
            ;
            static getPackagingCosts = t => {
                if ("Unframed" !== t.frameStyle)
                    return this.getFramedPackagingCost(t);
                if ((0,
                    d.isGallerySize)(t.size)) {
                    let e = {
                        packaging: 0,
                        sleeves: 0,
                        total: 0
                    };
                    return i.GALLERIES_CONFIG[t.size].prints.forEach(t => {
                            Object.entries(this.getUnframedMailerCosts(t.size)).forEach( ([t,r]) => {
                                    e[t] += r
                                }
                            )
                        }
                    ),
                        e
                }
                return this.getUnframedMailerCosts(t.size)
            }
            ;
            static getFramingServiceCost = t => {
                let {catalogProductId: e, size: a, includeFramingService: i} = t;
                if (!i)
                    return 0;
                let {baseCost: n, perExtraFrameCost: o} = this.getValueFromThresholdArray(this.getSmallestDimension(a), r.PRICING_DATA.framingServiceCosts);
                return n + Math.max((0,
                    d.getDesignCount)(e) - 1, 0) * o
            }
            ;
            static getHangingPinsCost = t => {
                let {catalogProductId: e, includeHangingPins: a, frameStyle: i} = t;
                return !a || ["PremiumOak", "PremiumMetal"].includes(i) ? 0 : r.PRICING_DATA.hangingPinsCost * (0,
                    d.getDesignCount)(e)
            }
            ;
            static getMatsCost = t => {
                let {catalogProductId: e, size: n, includeMats: o} = t;
                return o ? (0,
                    d.isGallerySize)(n) ? l.default.sum(i.GALLERIES_CONFIG[n].prints.map(t => this.getMatsCost({
                    catalogProductId: a.CatalogProductId.IndividualArtPrint,
                    includeMats: o,
                    size: t.size
                }))) : r.PRICING_DATA.matCosts[n] * (0,
                    d.getDesignCount)(e) : 0
            }
            ;
            static getPricingInputs = (t, e) => {
                let r = {
                    frameCost: this.getFrameCost(t) * e,
                    framingServiceCost: this.getFramingServiceCost(t) * e,
                    hangingPinsCost: this.getHangingPinsCost(t) * e,
                    laborCost: this.getLaborCost(t) * e,
                    matsCost: this.getMatsCost(t) * e,
                    packagingCost: this.getPackagingCosts(t).total * e,
                    paperCost: this.getPaperCosts(t).total * e,
                    total: 0
                };
                return r.total = l.default.sum(Object.values(r)),
                    r
            }
            ;
            static getTotalPhysicalCost = t => {
                let {total: e} = this.getPricingInputs(t, 1);
                return P.NumberUtils.roundToDecimalPoints(e, 2)
            }
            ;
            static getFramingAdjustment = t => "Unframed" !== t.frameStyle ? 1.045 : 1;
            static getProductionCost(t) {
                if (!Object.values(a.HausAndHuesCatalogProductId).includes(t.catalogProductId))
                    throw Error("Unexpected product type");
                let e = m.getProfitMargin(t)
                    , r = m.getTotalPhysicalCost(t);
                return P.NumberUtils.roundToDecimalPoints(r * m.getMarginMultiplier(e) * m.getFramingAdjustment(t) + o.fixedCost, 2)
            }
        }
        t.s(["default", () => m], 67122)
    }
    , 159094, 606741, 646266, t => {
        "use strict";
        t.i(25379);
        var e = t.i(903301)
            , r = t.i(568250)
            , a = t.i(119530);
        t.i(260835);
        var i = t.i(245974)
            , d = t.i(406855);
        t.i(556928);
        var n = t.i(742677)
            , o = t.i(228337)
            , P = t.i(72022)
            , l = t.i(67122);
        class u {
            static INVOICE_DETAILS_TYPES = ["amountRefunded", "arteloShipping", "wholesaleDiscount", "customPricingAdjustment", "productionCost", "branding", "usSalesTax", "pst", "gst", "hst"];
            static getMarketplaceFees(t, r, a, i) {
                let d = (0,
                    e.convertCurrency)(t, i, "USD");
                return (0,
                    e.convertCurrency)(l.default.getMarketplaceFees(d, r, a), "USD", i)
            }
            static getMarketplaceBaseFee(...t) {
                return l.default.getMarketplaceBaseFee(...t)
            }
            static getPerOrderBrandingCostInUsd = (t, e, d, n) => n && a.USER_DISCOUNTS[n]?.freeBranding ? 0 : Object.entries(r.PRICING_DATA.branding).reduce( (r, [a,n]) => {
                    let o = (r => {
                            switch (r) {
                                case "PackageInsert":
                                {
                                    let r = d ? d?.insertPlacement : t?.PackageInsert?.placement;
                                    return {
                                        hasBranding: !!r,
                                        multiplier: r === i.BrandingPlacement.PerOrder ? 1 : e
                                    }
                                }
                                case "PackageSticker":
                                {
                                    let r = d ? d?.stickerPlacement : t?.PackageSticker?.placement;
                                    return {
                                        hasBranding: !!r,
                                        multiplier: r === i.BrandingPlacement.PerOrder ? 1 : e
                                    }
                                }
                                default:
                                    return {
                                        hasBranding: !1,
                                        multiplier: 0
                                    }
                            }
                        }
                    )(a);
                    return o.hasBranding ? r + o.multiplier * n : r
                }
                , 0);
            static getShippingCost(t, e, r, a, i, d=1) {
                return l.default.getOrderShippingEstimate([{
                    catalogProductId: a,
                    frameStyle: r,
                    paperType: e,
                    quantity: d,
                    size: t
                }], i)
            }
            static getOrderDiscountPercentage = t => l.default.getValueFromThresholdArray(t, r.PRICING_DATA.wholesaleDiscounts);
            static getTotalOrderCost = (t, e=!0) => {
                let r = e ? t.amountRefunded : 0;
                return Math.max(t.productionCost + t.arteloShipping + t.branding + t.holidayFees + P.default.getTotalTaxes(t) - t.wholesaleDiscount - t.customPricingAdjustment - r, 0)
            }
            ;
            static getTotalOrderItemCost = (t, e=!0) => {
                let r = e ? t.amountRefunded : 0;
                return t.arteloShipping + t.productionCost - r - t.customPricingAdjustment
            }
            ;
            static getCartItemUnitCost = t => l.default.getProductionCost({
                ...t,
                frameStyle: (0,
                    d.getFrameStyleFromColor)(t.frameColor)
            });
            static getCartChargeAmount = t => this.getTotalOrderCost({
                amountRefunded: 0,
                arteloShipping: t.shippingCost,
                branding: t.branding,
                customPricingAdjustment: t.customPricingAdjustment,
                gst: t.gst,
                holidayFees: t.holidayFees,
                hst: t.hst,
                productionCost: t.subtotal,
                pst: t.pst,
                usSalesTax: t.usSalesTax,
                wholesaleDiscount: t.wholesaleDiscount
            });
            static getCustomPricingDiscount = o.default.memoize( (t, e) => {
                    if (!e)
                        return 0;
                    let r = a.USER_DISCOUNTS[e]?.productionCostDiscounts[`${t.catalogProductId}-${t.size}-${t.frameStyle}-${t.paperType}-${t.includeMats ? "Matted" : "Unmatted"}`];
                    return r ? Math.max(l.default.getProductionCost(t) - r, 0) : 0
                }
                , (...t) => JSON.stringify(t));
            static getTotalOrderPreMarginCostInUsd = o.default.memoize( (t, r) => n.NumberUtils.roundToDecimalPoints(o.default.sumBy(r, r => r.product ? l.default.removeProductionCostMargin(r.product, (0,
                e.convertCurrency)(r.details.productionCost, t, "USD")) : 0), 2), (t, e) => JSON.stringify({
                currency: t,
                orderItems: e
            }))
        }
        t.s(["default", () => u], 606741);
        var $ = t.i(748337);
        class m {
            static MAX_PREFIX_LENGTH = 11;
            static MAX_SKU_LENGTH = 32;
            static getNameAbbreviation(t) {
                return ({
                    Brighton: "btn",
                    Bristol: "bsl",
                    Camden: "cdn",
                    Hudson: "hdn",
                    Kent: "knt",
                    Warwick: "wwk",
                    Windsor: "win",
                    York: "yrk",
                    IndividualArtPrint: "s1p",
                    PictureFrame: "pf",
                    SetOf2ArtPrints: "s2p",
                    SetOf3ArtPrints: "s3p",
                    SetOf4ArtPrints: "s4p",
                    SetOf5ArtPrints: "s5p",
                    SetOf6ArtPrints: "s6p",
                    SetOf8ArtPrints: "s8p",
                    SetOf9ArtPrints: "s9p",
                    SetOf10ArtPrints: "10p",
                    SetOf12ArtPrints: "12p",
                    SetOf15ArtPrints: "15p",
                    SetOf2Frames: "s2f",
                    SetOf3Frames: "s3f",
                    SetOf4Frames: "s4f",
                    SetOf6Frames: "s6f",
                    SetOf9Frames: "s9f",
                    SetOf12Frames: "12f"
                })[t] ?? ""
            }
            static getSizeAbbreviation(t) {
                return (0,
                    d.isGallerySize)(t) ? m.getNameAbbreviation(t) : t in $.ProductCatalogUtils.A_SIZE_NAMES ? $.ProductCatalogUtils.A_SIZE_NAMES[t].toLowerCase() : t in $.ProductCatalogUtils.METRIC_SIZE_NAMES ? $.ProductCatalogUtils.METRIC_SIZE_NAMES[t].toLowerCase().replace(/x|cm/g, "") : (0,
                    d.formatProductSize)(t).replace(/\./g, "").slice(0, 5)
            }
            static getFrameStyleAbbreviation(t) {
                return ({
                    Metal: "ml",
                    Oak: "oak",
                    PremiumMetal: "pml",
                    PremiumOak: "pok",
                    Unframed: ""
                })[t] ?? ""
            }
            static getFrameColorAbbreviation(t) {
                return ({
                    BlackMetal: "bl",
                    BlackOak: "bl",
                    BlackPremiumMetal: "bl",
                    BlackPremiumOak: "bl",
                    BrassPremiumMetal: "br",
                    GoldMetal: "gl",
                    GoldPremiumMetal: "gl",
                    GrayPremiumMetal: "gr",
                    NaturalOak: "na",
                    NaturalPremiumOak: "na",
                    SilverMetal: "sl",
                    SilverPremiumMetal: "sl",
                    Unframed: "unf",
                    WalnutOak: "wa",
                    WalnutPremiumOak: "wa",
                    WhiteMetal: "wh",
                    WhiteOak: "wh",
                    WhitePremiumMetal: "wh",
                    WhitePremiumOak: "wh"
                })[t] ?? ""
            }
            static getPaperTypeAbbreviation(t) {
                return ({
                    ArchivalMatteFineArt: "am",
                    ColdPressFineArt: "cp",
                    GermanEtchingFineArt: "ge",
                    GlossyPhoto: "gl",
                    GlossyPoster: "gs",
                    HotPressFineArt: "hp",
                    LusterPhoto: "lu",
                    MattePhoto: "mp",
                    MattePoster: "mp",
                    PearlFineArt: "pf",
                    PearlPhoto: "pp",
                    RagSatinPhoto: "rs",
                    SemiGlossPoster: "sp",
                    SemiMatteLinenPoster: "sl",
                    SemiMattePhoto: "sm",
                    VelvetFineArt: "vf",
                    WatercolorFineArt: "wc"
                })[t] ?? ""
            }
            static getSkuPrefix() {
                return o.default.times(m.MAX_PREFIX_LENGTH, () => o.default.random(35).toString(36)).join("")
            }
            static getSkuSuffix(t) {
                return [t.catalogProductId ? m.getNameAbbreviation(t.catalogProductId) : "", t.size ? m.getSizeAbbreviation(t.size) : "", t.frameColor ? m.getFrameColorAbbreviation(t.frameColor) : "", t.frameStyle ? m.getFrameStyleAbbreviation(t.frameStyle) : "", t.paperType ? m.getPaperTypeAbbreviation(t.paperType) : ""].filter(t => !!t).join("-")
            }
            static getSku(t, e) {
                return [t, e].join("-")
            }
            static hasSuffix(t, e) {
                return t.endsWith(`-${e}`)
            }
            static getSKUPrefixFromSKU(t, e) {
                let r = `-${e}`;
                return t.endsWith(r) ? t.slice(0, -r.length) : t
            }
        }
        t.s(["default", () => m], 646266),
            t.s([], 159094)
    }
]);

//# sourceMappingURL=6f579b4bbc56c1b0.js.map
//# chunkId=019c353e-c963-7261-9ed0-393a10c390eb
