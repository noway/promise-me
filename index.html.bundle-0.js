BUNDLE = [], typeof window != "undefined" && (document._montageTiming = {}, document._montageTiming.loadStartTime = Date.now(), window.addEventListener("DOMContentLoaded", function() {
    var e = 1e3;
    document._montageStartBootstrappingTimeout = setTimeout(function() {
        document._montageStartBootstrappingTimeout = null;
        var e = document.documentElement;
        e.classList ? e.classList.add("montage-app-bootstrapping") : e.className = e.className + " montage-app-bootstrapping", document._montageTiming.bootstrappingStartTime = Date.now()
    }, e)
})),
function(e) {
    typeof require != "undefined" ? e.call(typeof global != "undefined" ? global : this, require, exports, module) : e({}, {}, {})
}(function(e, t, n) {
    global = this, t.initMontage = function() {
        var e = t.getPlatform();
        e.bootstrap(function(n, r, i) {
            var s = e.getParams(),
                u = e.getConfig(),
                a = i.resolve(n.getLocation(), s.montageLocation);
            u.makeLoader = function(e) {
                return t.ReelLoader(e, n.makeLoader(e))
            }, u.makeCompiler = function(e) {
                return t.SerializationCompiler(e, t.TemplateCompiler(e, n.makeCompiler(e)))
            };
            var f = i.resolve(u.location, s["package"] || "."),
                l = s.applicationHash;
            if (typeof BUNDLE == "object") {
                var c = {}, h = function(e) {
                    return c[e] = c[e] || r.defer()
                };
                global.bundleLoaded = function(e) {
                    h(e).resolve()
                };
                var p = r.defer();
                u.preloaded = p.promise;
                var d = r.resolve();
                BUNDLE.forEach(function(e) {
                    d = d.then(function() {
                        return r.all(e.map(function(e) {
                            return o.load(e), h(e).promise
                        }))
                    })
                }), p.resolve(d.then(function() {
                    delete BUNDLE, delete bundleLoaded
                }))
            }
            n.loadPackage({
                location: a,
                hash: s.montageHash
            }, u).then(function(e) {
                var t;
                return s.promiseLocation ? t = i.resolve(n.getLocation(), s.promiseLocation) : t = i.resolve(a, "packages/mr/packages/q"), [e, e.loadPackage({
                    location: t,
                    hash: s.promiseHash
                })]
            }).spread(function(t, n) {
                t.inject("core/mini-url", i), t.inject("core/promise", {
                    Promise: r
                }), n.inject("q", r), u.lint = function(e) {
                    t.async("core/jshint").then(function(t) {
                        t.JSHINT(e.text) || (console.warn("JSHint Error: " + e.location), t.JSHINT.errors.forEach(function(e) {
                            e && (console.warn("Problem at line " + e.line + " character " + e.character + ": " + e.reason), e.evidence && console.warn("    " + e.evidence))
                        }))
                    }).done()
                }, "autoPackage" in s && t.injectPackageDescription(f, {
                    dependencies: {
                        montage: "*"
                    }
                });
                if (f.slice(f.length - 5) === ".json") {
                    var o = f;
                    f = i.resolve(f, "."), t.injectPackageDescriptionLocation(f, o)
                }
                return t.loadPackage({
                    location: f,
                    hash: l
                }).then(function(n) {
                    global.require = n, global.montageRequire = t, e.initMontage(t, n, s)
                })
            }).done()
        })
    };
    var r = /((.*)\.reel)\/\2$/,
        i = function(e, t) {
            return t
        };
    t.SerializationCompiler = function(e, t) {
        return function(e) {
            t(e);
            if (!e.factory) return;
            var n = e.factory;
            return e.factory = function(e, t, s) {
                n.call(this, e, t, s);
                for (var o in t) {
                    var u = t[o];
                    if (u instanceof Object) if (u.hasOwnProperty("_montage_metadata") && !u._montage_metadata.isInstance) u._montage_metadata.aliases.push(o), u._montage_metadata.objectName = o;
                    else if (!Object.isSealed(u)) {
                        var a = s.id.replace(r, i);
                        Object.defineProperty(u, "_montage_metadata", {
                            value: {
                                require: e,
                                module: a,
                                moduleId: a,
                                property: o,
                                objectName: o,
                                aliases: [o],
                                isInstance: !1
                            }
                        })
                    }
                }
            }, e
        }
    };
    var s = /([^\/]+)\.reel$/;
    t.ReelLoader = function(e, t) {
        return function(e, n) {
            var r = s.exec(e);
            return r ? (n.redirect = e + "/" + r[1], n) : t(e, n)
        }
    }, t.TemplateCompiler = function(e, t) {
        return function(e) {
            if (!e.location) return;
            var n = e.location.match(/(.*\/)?(?=[^\/]+\.html(?:\.load\.js)?$)/);
            if (n) return e.dependencies = e.dependencies || [], e.exports = {
                directory: n[1],
                content: e.text
            }, Object.defineProperty(e.exports, "root", {
                get: function() {
                    return typeof console == "object" && console.warn("'root' property is deprecated on template modules.  Use 'directory' instead of root[1]"), n
                }
            }), e;
            t(e)
        }
    }, t.getPlatform = function() {
        if (typeof window != "undefined" && window && window.document) return o;
        if (typeof process != "undefined") return e("./node.js");
        throw new Error("Platform not supported.")
    };
    var o = {
        makeResolve: function() {
            var e = document.querySelector("base"),
                t = e;
            t || (e = document.createElement("base"), e.href = "");
            var n = document.querySelector("head"),
                r = document.createElement("a");
            return function(i, s) {
                t || n.appendChild(e), i = String(i);
                if (!/^[\w\-]+:/.test(i)) throw new Error("Can't resolve from a relative location: " + JSON.stringify(i) + " " + JSON.stringify(s));
                var o = e.href;
                e.href = i, r.href = s;
                var u = r.href;
                return e.href = o, t || n.removeChild(e), u
            }
        },
        load: function(e) {
            var t = document.createElement("script");
            t.src = e, t.onload = function() {
                t.parentNode.removeChild(t)
            }, document.getElementsByTagName("head")[0].appendChild(t)
        },
        getConfig: function() {
            return {
                location: "" + window.location
            }
        },
        getParams: function() {
            var e, t, n, r, i, s, o;
            if (!this._params) {
                this._params = {};
                var u = document.getElementsByTagName("script");
                for (e = 0; e < u.length; e++) {
                    r = u[e], i = !1, r.src && (n = r.src.match(/^(.*)montage.js(?:[\?\.]|$)/i)) && (this._params.montageLocation = n[1], i = !0), r.hasAttribute("data-montage-location") && (this._params.montageLocation = r.getAttribute("data-montage-location"), i = !0);
                    if (i) {
                        if (r.dataset) for (o in r.dataset) this._params[o] = r.dataset[o];
                        else if (r.attributes) for (t = 0; t < r.attributes.length; t++) s = r.attributes[t], n = s.name.match(/^data-(.*)$/), n && (this._params[n[1]] = s.value);
                        r.parentNode.removeChild(r);
                        break
                    }
                }
            }
            return this._params
        },
        bootstrap: function(e) {
            function t() {
                document.removeEventListener("DOMContentLoaded", t, !0), a = !0, i()
            }
            function n(e) {
                if (!m[e] && v[e]) {
                    var t = m[e] = {};
                    v[e](n, t)
                }
                return m[e]
            }
            function r() {
                l = n("mini-url"), f = n("promise"), u = n("require"), delete global.bootstrap, i()
            }
            function i() {
                a && u && e(u, f, l)
            }
            var s, u, a, f, l, c = this.getParams(),
                h = this.makeResolve();
            document.readyState === "interactive" ? t() : document.addEventListener("DOMContentLoaded", t, !0);
            var p = {
                require: "packages/mr/require.js",
                "require/browser": "packages/mr/browser.js",
                promise: "packages/mr/packages/q/q.js"
            };
            if (typeof BUNDLE == "undefined") for (var d in p) o.load(h(c.montageLocation, p[d]));
            var v = {};
            global.bootstrap = function(e, t) {
                v[e] = t, delete p[e];
                for (var e in p) return;
                delete global.bootstrap, r()
            }, global.bootstrap("mini-url", function(e, t) {
                t.resolve = h
            });
            var m = {}
        },
        initMontage: function(e, t, n) {
            var r = ["core/event/event-manager", "core/deserializer"];
            typeof window != "undefined" && r.push("core/event/binding");
            var i = e("core/promise").Promise;
            return i.all(r.map(e.deepLoad)).then(function() {
                r.forEach(e);
                var i = e("core/event/event-manager").EventManager,
                    s = e("core/deserializer").Deserializer,
                    o, u;
                o = i.create().initWithWindow(window), typeof global.montageWillLoad == "function" && global.montageWillLoad();
                var a = t.packageDescription.applicationPrototype,
                    f, l;
                return a ? (f = s.parseForModuleAndName(a), l = t.async(f.module)) : l = e.async("ui/application"), l.then(function(e) {
                    u = e[f ? f.name : "Application"].create(), window.document.application = u, o.application = u, u.eventManager = o, u._load(t, function() {
                        n.module && t.async(n.module).done()
                    })
                })
            }).done()
        }
    };
    typeof window != "undefined" ? global.__MONTAGE_LOADED__ ? console.warn("Montage already loaded!") : (global.__MONTAGE_LOADED__ = !0, t.initMontage()) : t.getPlatform()
}),
function(e) {
    if (typeof bootstrap != "undefined") typeof window != "undefined" ? bootstrap("require", function(t, n) {
        var r = t("promise"),
            i = t("mini-url");
        e(n, r, i), t("require/browser")
    }) : bootstrap("require", function(t, n) {
        var r = t("promise").Promise,
            i = t("mini-url");
        e(n, r, i)
    });
    else {
        if (typeof process == "undefined") throw new Error("Can't support require on this platform");
        var t = require("q"),
            n = require("url");
        e(exports, t, n)
    }
}(function(Require, Promise, URL) {
    function normalizeDependency(e, t, n) {
        t = t || {}, typeof e == "string" && (e = {
            location: e
        }), e.main && (e.location = t.mainPackageLocation), e.name && t.registry && t.registry[e.name] && (e.location = t.registry[e.name]), !e.location && t.packagesDirectory && e.name && (e.location = URL.resolve(t.packagesDirectory, e.name + "/"));
        if (!e.location) return e;
        /\/$/.test(e.location) || (e.location += "/");
        if (!Require.isAbsolute(e.location)) {
            if (!t.location) throw new Error("Dependency locations must be fully qualified: " + JSON.stringify(e));
            e.location = URL.resolve(t.location, e.location)
        }
        return e.name && (t.registry[e.name] = e.location), e
    }
    function configurePackage(e, t, n) {
        /\/$/.test(e) || (e += "/");
        var r = Object.create(n);
        r.name = t.name, r.location = e || Require.getLocation(), r.packageDescription = t, r.useScriptInjection = t.useScriptInjection;
        var i = r.modules = r.modules || {}, s = r.registry;
        r.name !== void 0 && !s[r.name] && (s[r.name] = r.location);
        var o = t.overlay || {}, u;
        (r.overlays || Require.overlays).forEach(function(e) {
            if (o[e]) {
                var n = o[e];
                for (var r in n) t[r] = n[r]
            }
        }), delete t.overlay, t.directories = t.directories || {}, t.directories.lib = t.directories.lib === void 0 ? "./" : t.directories.lib;
        var a = t.directories.lib;
        r.lib = URL.resolve(e, "./" + a);
        var f = t.directories.packages || "node_modules";
        f = URL.resolve(e, f + "/"), r.packagesDirectory = f, t.main !== void 0 && (i[""] = {
            id: "",
            redirect: normalizeId(t.main),
            location: r.location
        }, t.name !== i[""].redirect && (i[t.name] = {
            id: t.name,
            redirect: "",
            location: URL.resolve(e, t.name)
        }));
        var l = t.redirects;
        l !== void 0 && Object.keys(l).forEach(function(t) {
            i[t] = {
                id: t,
                redirect: l[t],
                location: URL.resolve(e, t)
            }
        });
        var c = t.mappings || {};
        return [t.dependencies, t.devDependencies].forEach(function(e) {
            if (!e) return;
            Object.keys(e).forEach(function(t) {
                c[t] || (c[t] = {
                    name: t,
                    version: e[t]
                })
            })
        }), Object.keys(c).forEach(function(e) {
            var t = c[e] = normalizeDependency(c[e], r, e)
        }), r.mappings = c, r
    }
    function has(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
    }
    function resolve(e, t) {
        e = String(e);
        var n = e.split("/"),
            r = [];
        if (n.length && n[0] === "." || n[0] === "..") {
            var i = t.split("/");
            i.pop(), n.unshift.apply(n, i)
        }
        for (var s = 0, o = n.length; s < o; s++) {
            var u = n[s];
            u !== "" && u !== "." && (u === ".." ? r.length && r.pop() : r.push(u))
        }
        return r.join("/")
    }
    if (!this) throw new Error("Require does not work in strict mode.");
    var globalEval = eval;
    Require.makeRequire = function(e) {
        function t(t) {
            var n = t.toLowerCase();
            return has(a, n) || (a[n] = {
                id: t,
                display: (e.name || e.location) + "#" + t,
                require: u
            }), a[n]
        }
        function n(n, r) {
            var i = t(n);
            i.exports = r, i.location = URL.resolve(e.location, n), i.directory = URL.resolve(i.location, "./"), i.injected = !0, delete i.redirect, delete i.mappingRedirect
        }
        function r(e, n, i) {
            var s = t(e);
            i = i || {};
            if (has(i, e)) return;
            return i[e] = !0, f(e, n).then(function() {
                return Promise.all(s.dependencies.map(function(n) {
                    n = resolve(n, e);
                    var s = t(n),
                        o = s.dependees = s.dependees || {};
                    return o[e] = !0, r(n, e, i)
                }))
            })
        }
        function i(e, n) {
            var r = t(e);
            if (r.id !== e) throw new Error("Can't require " + JSON.stringify(r.id) + " by alternate spelling " + JSON.stringify(e));
            if (r.redirect !== void 0) return i(r.redirect, n);
            if (r.mappingRedirect !== void 0) return r.mappingRequire(r.mappingRedirect, n);
            if (r.exports !== void 0) return r.exports;
            if (r.factory === void 0) throw new Error("Can't require module " + JSON.stringify(e) + " via " + JSON.stringify(n));
            r.directory = URL.resolve(r.location, "./"), r.exports = {};
            var s = r.factory.call(void 0, o(e), r.exports, r);
            return s !== void 0 && (r.exports = s), r.exports
        }
        function s(t, n, r) {
            if (n.location === e.location) return t;
            var i = {};
            for (var s in e.mappings) {
                var o = e.mappings[s],
                    u = o.location;
                if (!e.hasPackage(u)) continue;
                var a = e.getPackage(u),
                    f = a.identify(t, n, !0);
                if (f === null) continue;
                return f === "" ? s : s + "/" + f
            }
            if (r) return null;
            throw new Error("Can't identify " + t + " from " + n.location)
        }
        function o(o) {
            var u = function(e) {
                var t = resolve(e, o);
                return i(t, o)
            };
            return u.async = function(e) {
                var n = resolve(e, o),
                    i = t(e);
                return r(n, o).then(function() {
                    return u(n)
                }, function(e) {
                    return Promise.nextTick(function() {
                        throw e
                    }), u(n)
                })
            }, u.resolve = function(e) {
                return normalizeId(resolve(e, o))
            }, u.getModule = t, u.getModuleDescriptor = t, u.load = f, u.deepLoad = r, u.loadPackage = function(t, n) {
                return n ? Require.loadPackage(t, n) : e.loadPackage(t, e)
            }, u.hasPackage = function(t) {
                return e.hasPackage(t)
            }, u.getPackage = function(t) {
                return e.getPackage(t)
            }, u.isMainPackage = function() {
                return u.location === e.mainPackageLocation
            }, u.injectPackageDescription = function(t, n) {
                Require.injectPackageDescription(t, n, e)
            }, u.injectPackageDescriptionLocation = function(t, n) {
                Require.injectPackageDescriptionLocation(t, n, e)
            }, u.identify = s, u.inject = n, e.exposedConfigs.forEach(function(t) {
                u[t] = e[t]
            }), u.config = e, u.read = Require.read, u
        }
        var u;
        e = e || {}, e.location = URL.resolve(e.location || Require.getLocation(), "./"), e.lib = URL.resolve(e.location, e.lib || "./"), e.paths = e.paths || [e.lib], e.mappings = e.mappings || {}, e.exposedConfigs = e.exposedConfigs || Require.exposedConfigs, e.makeLoader = e.makeLoader || Require.makeLoader, e.load = e.load || e.makeLoader(e), e.makeCompiler = e.makeCompiler || Require.makeCompiler, e.compile = e.compile || e.makeCompiler(e), e.parseDependencies = e.parseDependencies || Require.parseDependencies, e.read = e.read || Require.read;
        var a = e.modules = e.modules || {}, f = memoize(function(n, r) {
            var i = t(n);
            return Promise.fcall(function() {
                if (i.factory === void 0 && i.exports === void 0 && i.redirect === void 0) return Promise.fcall(e.load, n, i)
            }).then(function() {
                e.compile(i);
                var t = i.dependencies = i.dependencies || [];
                i.redirect !== void 0 && t.push(i.redirect), i.extraDependencies !== void 0 && Array.prototype.push.apply(i.dependencies, i.extraDependencies)
            })
        });
        return u = o(""), u
    }, Require.injectPackageDescription = function(e, t, n) {
        var r = n.descriptions = n.descriptions || {};
        r[e] = Promise.resolve(t)
    }, Require.injectPackageDescriptionLocation = function(e, t, n) {
        var r = n.descriptionLocations = n.descriptionLocations || {};
        r[e] = t
    }, Require.loadPackageDescription = function(e, t) {
        var n = e.location,
            r = t.descriptions = t.descriptions || {};
        if (r[n] === void 0) {
            var i = t.descriptionLocations = t.descriptionLocations || {}, s;
            i[n] ? s = i[n] : s = URL.resolve(n, "package.json"), r[n] = Require.read(s).then(function(e) {
                try {
                    return JSON.parse(e)
                } catch (t) {
                    throw t.message = t.message + " in " + JSON.stringify(s), t
                }
            })
        }
        return r[n]
    }, Require.loadPackage = function(e, t) {
        e = normalizeDependency(e, t);
        if (!e.location) throw new Error("Can't find dependency: " + JSON.stringify(e));
        var n = e.location;
        t = Object.create(t || null);
        var r = t.loadingPackages = t.loadingPackages || {}, i = t.packages = {}, s = t.registry = t.registry || Object.create(null);
        t.mainPackageLocation = n, t.hasPackage = function(e) {
            e = normalizeDependency(e, t);
            if (!e.location) return !1;
            var n = e.location;
            return !!i[n]
        }, t.getPackage = function(e) {
            e = normalizeDependency(e, t);
            if (!e.location) throw new Error("Can't find dependency: " + JSON.stringify(e) + " from " + t.location);
            var n = e.location;
            if (!i[n]) throw r[n] ? new Error("Dependency has not finished loading: " + JSON.stringify(e)) : new Error("Dependency was not loaded: " + JSON.stringify(e));
            return i[n]
        }, t.loadPackage = function(e, n) {
            e = normalizeDependency(e, n);
            if (!e.location) throw new Error("Can't find dependency: " + JSON.stringify(e) + " from " + t.location);
            var s = e.location;
            return r[s] || (r[s] = Require.loadPackageDescription(e, t).then(function(e) {
                var n = configurePackage(s, e, t),
                    r = Require.makeRequire(n);
                return i[s] = r, r
            })), r[s]
        };
        var o = t.loadPackage(e);
        return o.location = n, o.async = function(e, t) {
            return o.then(function(n) {
                return n.async(e, t)
            })
        }, o
    }, Require.resolve = resolve, Require.base = function(e) {
        return String(e).replace(/(.+?)\/+$/, "$1").match(/([^\/]+$|^\/$|^$)/)[1]
    }, Require.isAbsolute = function(e) {
        return /^[\w\-]+:/.test(e)
    }, Require.parseDependencies = function(e) {
        var t = {};
        return String(e).replace(/(?:^|[^\w\$_.])require\s*\(\s*["']([^"']*)["']\s*\)/g, function(e, n) {
            t[n] = !0
        }), Object.keys(t)
    }, Require.DependenciesCompiler = function(e, t) {
        return function(n) {
            return !n.dependencies && n.text !== void 0 && (n.dependencies = e.parseDependencies(n.text)), t(n), n && !n.dependencies && (n.text || n.factory ? n.dependencies = Require.parseDependencies(n.text || n.factory) : n.dependencies = []), n
        }
    }, Require.ShebangCompiler = function(e, t) {
        return function(e) {
            e.text && (e.text = e.text.replace(/^#!/, "//#!")), t(e)
        }
    }, Require.LintCompiler = function(e, t) {
        return function(n) {
            try {
                t(n)
            } catch (r) {
                throw e.lint && Promise.nextTick(function() {
                    e.lint(n)
                }), r
            }
        }
    }, Require.exposedConfigs = ["paths", "mappings", "location", "packageDescription", "packages", "modules"], Require.makeCompiler = function(e) {
        return Require.JsonCompiler(e, Require.ShebangCompiler(e, Require.DependenciesCompiler(e, Require.LintCompiler(e, Require.Compiler(e)))))
    }, Require.JsonCompiler = function(e, t) {
        return function(e) {
            var n = (e.location || "").match(/\.json$/);
            return n ? (e.exports = JSON.parse(e.text), e) : t(e)
        }
    }, Require.MappingsLoader = function(e, t) {
        e.mappings = e.mappings || {}, e.name = e.name;
        var n = e.mappings,
            r = Object.keys(n),
            i = r.length;
        return function(s, o) {
            if (Require.isAbsolute(s)) return t(s, o);
            e.name !== void 0 && s.indexOf(e.name) === 0 && s.charAt(e.name.length) === "/" && console.warn("Package reflexive module ignored:", s);
            var u, a;
            for (u = 0; u < i; u++) {
                a = r[u];
                if (s === a || s.indexOf(a) === 0 && s.charAt(a.length) === "/") {
                    var f = n[a],
                        l = s.slice(a.length + 1);
                    return e.loadPackage(f, e).then(function(t) {
                        return o.mappingRedirect = l, o.mappingRequire = t, t.deepLoad(l, e.location)
                    })
                }
            }
            return t(s, o)
        }
    }, Require.ExtensionsLoader = function(e, t) {
        var n = e.extensions || ["js"],
            r = n.reduceRight(function(e, n) {
                return function(r, i) {
                    return t(r + "." + n, i).fail(function(t) {
                        if (/^Can't find /.test(t.message)) return e(r, i);
                        throw t
                    })
                }
            }, function(t, r) {
                throw new Error("Can't find " + JSON.stringify(t) + " with extensions " + JSON.stringify(n) + " in package at " + JSON.stringify(e.location))
            });
        return function(e, n) {
            return Require.base(e).indexOf(".") !== -1 ? t(e, n) : r(e, n)
        }
    }, Require.PathsLoader = function(e, t) {
        var n = e.paths.reduceRight(function(e, n) {
            return function(r, i) {
                var s = URL.resolve(n, r);
                return t(s, i).fail(function(t) {
                    if (/^Can't find /.test(t.message)) return e(r, i);
                    throw t
                })
            }
        }, function(t, n) {
            throw new Error("Can't find " + JSON.stringify(t) + " from paths " + JSON.stringify(e.paths) + " in package at " + JSON.stringify(e.location))
        });
        return function(e, r) {
            return Require.isAbsolute(e) ? t(e, r) : n(e, r)
        }
    }, Require.MemoizedLoader = function(e, t) {
        var n = e.cache = e.cache || {};
        return memoize(t, n)
    };
    var normalizeId = function(e) {
        var t = /^(.*)\.js$/.exec(e);
        return t && (e = t[1]), e
    }, memoize = function(e, t) {
        return t = t || {},
        function(n, r) {
            return has(t, n) || (t[n] = Promise.fcall(e, n, r)), t[n]
        }
    }
}), bootstrap("require/browser", function(require) {
    function xhrSuccess(e) {
        return e.status === 200 || e.status === 0 && e.responseText
    }
    var Require = require("require"),
        Promise = require("promise"),
        URL = require("mini-url"),
        GET = "GET",
        APPLICATION_JAVASCRIPT_MIMETYPE = "application/javascript",
        FILE_PROTOCOL = "file:",
        global = typeof global != "undefined" ? global : window;
    Require.getLocation = function() {
        return URL.resolve(window.location, ".")
    }, Require.overlays = ["window", "browser", "montage"], Require.read = function(e) {
        function t() {
            xhrSuccess(r) ? i.resolve(r.responseText) : n()
        }
        function n() {
            i.reject("Can't XHR " + JSON.stringify(e))
        }
        if (URL.resolve(window.location, e).indexOf(FILE_PROTOCOL) === 0) throw new Error("XHR does not function for file: protocol");
        var r = new XMLHttpRequest,
            i = Promise.defer();
        try {
            r.open(GET, e, !0), r.overrideMimeType && r.overrideMimeType(APPLICATION_JAVASCRIPT_MIMETYPE), r.onreadystatechange = function() {
                r.readyState === 4 && t()
            }, r.onload = r.load = t, r.onerror = r.error = n
        } catch (s) {
            i.reject(s.message, s)
        }
        return r.send(), i.promise
    };
    var globalEval = eval;
    global.navigator && global.navigator.userAgent.indexOf("Firefox") >= 0 && (globalEval = new Function("_", "return eval(_)"));
    var __FILE__String = "__FILE__",
        DoubleUnderscoreString = "__",
        globalEvalConstantA = "(function ",
        globalEvalConstantB = "(require, exports, module) {",
        globalEvalConstantC = "//*/\n})\n//@ sourceURL=";
    Require.Compiler = function(e) {
        return function(t) {
            if (t.factory || t.text === void 0) return t;
            if (e.useScriptInjection) throw new Error("Can't use eval.");
            var n = __FILE__String + t.location.replace(/\.\w+$|\W/g, DoubleUnderscoreString);
            try {
                t.factory = globalEval(globalEvalConstantA + n + globalEvalConstantB + t.text + globalEvalConstantC + t.location)
            } catch (r) {
                throw r.message = r.message + " in " + t.location, r
            }
            t.factory.displayName = n
        }
    }, Require.XhrLoader = function(e) {
        return function(t, n) {
            return e.read(t).then(function(e) {
                n.type = "javascript", n.text = e, n.location = t
            })
        }
    };
    var definitions = {}, getDefinition = function(e, t) {
        return definitions[e] = definitions[e] || {}, definitions[e][t] = definitions[e][t] || Promise.defer(), definitions[e][t]
    };
    montageDefine = function(e, t, n) {
        getDefinition(e, t).resolve(n)
    }, Require.loadScript = function(e) {
        var t = document.createElement("script");
        t.onload = function() {
            t.parentNode.removeChild(t)
        }, t.onerror = function(e) {
            t.parentNode.removeChild(t)
        }, t.src = e, t.defer = !0, document.getElementsByTagName("head")[0].appendChild(t)
    }, Require.ScriptLoader = function(e) {
        var t = e.packageDescription.hash;
        return function(e, n) {
            return Promise.fcall(function() {
                return definitions[t] && definitions[t][n.id] ? definitions[t][n.id].promise : (/\.js$/.test(e) ? e = e.replace(/\.js/, ".load.js") : e += ".load.js", Require.loadScript(e), getDefinition(t, n.id).promise)
            }).then(function(r) {
                delete definitions[t][n.id];
                for (var i in r) n[i] = r[i];
                n.location = e, n.directory = URL.resolve(e, ".")
            })
        }
    };
    var loadPackageDescription = Require.loadPackageDescription;
    Require.loadPackageDescription = function(e, t) {
        return e.hash ? (t.preloaded.isResolved() || t.preloaded.then(function(t) {
            if (!t.isResolved()) {
                var n = URL.resolve(e.location, "package.json.load.js");
                Require.loadScript(n)
            }
        }), getDefinition(e.hash, "package.json").promise.then(function(e) {
            return e.exports
        })) : loadPackageDescription(e, t)
    }, Require.makeLoader = function(e) {
        var t;
        return e.useScriptInjection ? t = Require.ScriptLoader : t = Require.XhrLoader, Require.MappingsLoader(e, Require.ExtensionsLoader(e, Require.PathsLoader(e, Require.MemoizedLoader(e, t(e)))))
    }
}),
function(e) {
    if (typeof bootstrap == "function") bootstrap("promise", e);
    else if (typeof exports == "object") e(void 0, exports);
    else if (typeof define == "function") define(e);
    else if (typeof ses != "undefined") {
        if (!ses.ok()) return;
        ses.makeQ = function() {
            var t = {};
            return e(void 0, t)
        }
    } else e(void 0, Q = {})
}(function(e, t) {
    "use strict";

    function n(e) {
        return mt(e) === "[object StopIteration]" || e instanceof gt
    }
    function r(e, t) {
        t.stack && typeof e == "object" && e !== null && e.stack && e.stack.indexOf(yt) === -1 && (e.stack = i(e.stack) + "\n" + yt + "\n" + i(t.stack))
    }
    function i(e) {
        var t = e.split("\n"),
            n = [];
        for (var r = 0; r < t.length; ++r) {
            var i = t[r];
            !o(i) && !s(i) && n.push(i)
        }
        return n.join("\n")
    }
    function s(e) {
        return e.indexOf("(module.js:") !== -1 || e.indexOf("(node.js:") !== -1
    }
    function o(e) {
        var t = /at .+ \((.*):(\d+):\d+\)/.exec(e);
        if (!t) return !1;
        var n = t[1],
            r = t[2];
        return n === tt && r >= et && r <= Nt
    }
    function u() {
        if (Error.captureStackTrace) {
            var e, t, n = Error.prepareStackTrace;
            return Error.prepareStackTrace = function(n, r) {
                e = r[1].getFileName(), t = r[1].getLineNumber()
            }, (new Error).stack, Error.prepareStackTrace = n, tt = e, t
        }
    }
    function a(e, t, n) {
        return function() {
            return typeof console != "undefined" && typeof console.warn == "function" && console.warn(t + " is deprecated, use " + n + " instead.", (new Error("")).stack), e.apply(e, arguments)
        }
    }
    function f() {
        function e(e) {
            if (!t) return;
            r = w(e), ct(t, function(e, t) {
                it(function() {
                    r.promiseSend.apply(r, t)
                })
            }, void 0), t = void 0, n = void 0
        }
        var t = [],
            n = [],
            r, i = dt(f.prototype),
            s = dt(c.prototype);
        return s.promiseSend = function(e, i, s, o) {
            var u = lt(arguments);
            t ? (t.push(u), e === "when" && o && n.push(o)) : it(function() {
                r.promiseSend.apply(r, u)
            })
        }, s.valueOf = function() {
            return t ? s : r.valueOf()
        }, Error.captureStackTrace && (Error.captureStackTrace(s, f), s.stack = s.stack.substring(s.stack.indexOf("\n") + 1)), rt(s), i.promise = s, i.resolve = e, i.reject = function(t) {
            e(b(t))
        }, i.notify = function(e) {
            t && ct(n, function(t, n) {
                it(function() {
                    n(e)
                })
            }, void 0)
        }, i
    }
    function l(e) {
        var t = f();
        return P(e, t.resolve, t.reject, t.notify).fail(t.reject), t.promise
    }
    function c(e, t, n, r) {
        t === void 0 && (t = function(e) {
            return b(new Error("Promise does not support operation: " + e))
        });
        var i = dt(c.prototype);
        return i.promiseSend = function(n, r) {
            var s = lt(arguments, 2),
                o;
            try {
                e[n] ? o = e[n].apply(i, s) : o = t.apply(i, [n].concat(s))
            } catch (u) {
                o = b(u)
            }
            r && r(o)
        }, n && (i.valueOf = n), r && (i.exception = r), rt(i), i
    }
    function h(e) {
        return p(e) ? e.valueOf() : e
    }
    function p(e) {
        return e && typeof e.promiseSend == "function"
    }
    function d(e) {
        return e && typeof e.then == "function"
    }
    function v(e) {
        return m(e) || g(e)
    }
    function m(e) {
        return !d(h(e))
    }
    function g(e) {
        return e = h(e), p(e) && "exception" in e
    }
    function y() {
        !Et && typeof window != "undefined" && !window.Touch && window.console && console.log("Should be empty:", wt), Et = !0
    }
    function b(e) {
        var t = c({
            when: function(t) {
                if (t) {
                    var n = ht(bt, this);
                    n !== -1 && (wt.splice(n, 1), bt.splice(n, 1))
                }
                return t ? t(e) : b(e)
            }
        }, function() {
            return b(e)
        }, function() {
            return this
        }, e);
        return y(), bt.push(t), wt.push(e), t
    }
    function w(e) {
        if (p(e)) return e;
        e = h(e);
        if (d(e)) {
            var t = f();
            return e.then(t.resolve, t.reject, t.notify), t.promise
        }
        return c({
            when: function() {
                return e
            },
            get: function(t) {
                return e[t]
            },
            put: function(t, n) {
                return e[t] = n, e
            },
            del: function(t) {
                return delete e[t], e
            },
            post: function(t, n) {
                return e[t].apply(e, n)
            },
            apply: function(t, n) {
                return e.apply(t, n)
            },
            fapply: function(t) {
                return e.apply(void 0, t)
            },
            viewInfo: function() {
                function t(e) {
                    r[e] || (r[e] = typeof n[e])
                }
                var n = e,
                    r = {};
                while (n) Object.getOwnPropertyNames(n).forEach(t), n = Object.getPrototypeOf(n);
                return {
                    type: typeof e,
                    properties: r
                }
            },
            keys: function() {
                return vt(e)
            }
        }, void 0, function() {
            return e
        })
    }
    function E(e) {
        return c({
            isDef: function() {}
        }, function() {
            var t = lt(arguments);
            return O.apply(void 0, [e].concat(t))
        }, function() {
            return h(e)
        })
    }
    function S(e, t) {
        return e = w(e), t ? c({
            viewInfo: function() {
                return t
            }
        }, function() {
            var t = lt(arguments);
            return O.apply(void 0, [e].concat(t))
        }, function() {
            return h(e)
        }) : O(e, "viewInfo")
    }
    function x(e) {
        return S(e).when(function(t) {
            var n;
            t.type === "function" ? n = function() {
                return xt(e, void 0, arguments)
            } : n = {};
            var r = t.properties || {};
            return vt(r).forEach(function(t) {
                r[t] === "function" && (n[t] = function() {
                    return St(e, t, arguments)
                })
            }), w(n)
        })
    }
    function T(e, t, n, i) {
        function s(e) {
            try {
                return typeof t == "function" ? t(e) : e
            } catch (n) {
                return b(n)
            }
        }
        function o(e) {
            if (typeof n == "function") {
                r(e, c);
                try {
                    return n(e)
                } catch (t) {
                    return b(t)
                }
            }
            return b(e)
        }
        function u(e) {
            return typeof i == "function" ? i(e) : e
        }
        var a = f(),
            l = !1,
            c = w(e);
        return it(function() {
            c.promiseSend("when", function(e) {
                if (l) return;
                l = !0, a.resolve(s(e))
            }, function(e) {
                if (l) return;
                l = !0, a.resolve(o(e))
            })
        }), c.promiseSend("when", void 0, void 0, function(e) {
            a.notify(u(e))
        }), a.promise
    }
    function N(e, t, n) {
        return T(e, function(e) {
            return j(e).then(function(e) {
                return t.apply(void 0, e)
            }, n)
        }, n)
    }
    function C(e) {
        return function() {
            function t(e, t) {
                var o;
                try {
                    o = r[e](t)
                } catch (u) {
                    return n(u) ? u.value : b(u)
                }
                return T(o, i, s)
            }
            var r = e.apply(this, arguments),
                i = t.bind(t, "send"),
                s = t.bind(t, "throw");
            return i()
        }
    }
    function k(e) {
        throw new gt(e)
    }
    function L(e) {
        return function() {
            return j([this, j(arguments)]).spread(function(t, n) {
                return e.apply(t, n)
            })
        }
    }
    function A(e) {
        return function(t) {
            var n = lt(arguments, 1);
            return O.apply(void 0, [t, e].concat(n))
        }
    }
    function O(e, t) {
        var n = f(),
            r = lt(arguments, 2);
        return e = w(e), it(function() {
            e.promiseSend.apply(e, [t, n.resolve].concat(r))
        }), n.promise
    }
    function M(e, t, n) {
        var r = f();
        return e = w(e), it(function() {
            e.promiseSend.apply(e, [t, r.resolve].concat(n))
        }), r.promise
    }
    function _(e) {
        return function(t) {
            var n = lt(arguments, 1);
            return M(t, e, n)
        }
    }
    function D(e, t) {
        var n = lt(arguments, 2);
        return xt(e, t, n)
    }
    function P(e) {
        var t = lt(arguments, 1);
        return Tt(e, t)
    }
    function H(e, t) {
        var n = lt(arguments, 2);
        return function() {
            var r = n.concat(lt(arguments));
            return xt(e, t, r)
        }
    }
    function B(e) {
        var t = lt(arguments, 1);
        return function() {
            var n = t.concat(lt(arguments));
            return Tt(e, n)
        }
    }
    function j(e) {
        return T(e, function(e) {
            var t = e.length;
            if (t === 0) return w(e);
            var n = f();
            return ct(e, function(r, i, s) {
                m(i) ? (e[s] = h(i), --t === 0 && n.resolve(e)) : T(i, function(r) {
                    e[s] = r, --t === 0 && n.resolve(e)
                }).fail(n.reject)
            }, void 0), n.promise
        })
    }
    function F(e) {
        return T(e, function(e) {
            return T(j(pt(e, function(e) {
                return T(e, nt, nt)
            })), function() {
                return pt(e, w)
            })
        })
    }
    function I(e, t) {
        return T(e, void 0, t)
    }
    function q(e, t) {
        return T(e, void 0, void 0, t)
    }
    function R(e, t) {
        return T(e, function(e) {
            return T(t(), function() {
                return e
            })
        }, function(e) {
            return T(t(), function() {
                return b(e)
            })
        })
    }
    function U(e, n, i, s) {
        function o(n) {
            it(function() {
                r(n, e);
                if (!t.onerror) throw n;
                t.onerror(n)
            })
        }
        var u = n || i || s ? T(e, n, i, s) : e;
        I(u, o)
    }
    function z(e, t) {
        var n = f(),
            r = setTimeout(function() {
                n.reject(new Error("Timed out after " + t + " ms"))
            }, t);
        return T(e, function(e) {
            clearTimeout(r), n.resolve(e)
        }, function(e) {
            clearTimeout(r), n.reject(e)
        }), n.promise
    }
    function W(e, t) {
        t === void 0 && (t = e, e = void 0);
        var n = f();
        return setTimeout(function() {
            n.resolve(e)
        }, t), n.promise
    }
    function X(e, t) {
        var n = lt(t),
            r = f();
        return n.push(r.makeNodeResolver()), Tt(e, n).fail(r.reject), r.promise
    }
    function V(e) {
        var t = lt(arguments, 1),
            n = f();
        return t.push(n.makeNodeResolver()), Tt(e, t).fail(n.reject), n.promise
    }
    function $(e) {
        var t = lt(arguments, 1);
        return function() {
            var n = t.concat(lt(arguments)),
                r = f();
            return n.push(r.makeNodeResolver()), Tt(e, n).fail(r.reject), r.promise
        }
    }
    function J(e, t, n) {
        return Q(e, t).apply(void 0, n)
    }
    function K(e, t) {
        var n = lt(arguments, 2);
        return J(e, t, n)
    }
    function Q(e) {
        if (arguments.length > 1) {
            var t = arguments[1],
                n = lt(arguments, 2),
                r = e;
            e = function() {
                var e = n.concat(lt(arguments));
                return r.apply(t, e)
            }
        }
        return function() {
            var t = f(),
                n = lt(arguments);
            return n.push(t.makeNodeResolver()), Tt(e, n).fail(t.reject), t.promise
        }
    }
    function G(e, t, n) {
        var r = lt(n),
            i = f();
        return r.push(i.makeNodeResolver()), St(e, t, r).fail(i.reject), i.promise
    }
    function Y(e, t) {
        var n = lt(arguments, 2),
            r = f();
        return n.push(r.makeNodeResolver()), St(e, t, n).fail(r.reject), r.promise
    }
    function Z(e, t) {
        if (!t) return e;
        e.then(function(e) {
            it(function() {
                t(null, e)
            })
        }, function(e) {
            it(function() {
                t(e)
            })
        })
    }
    var et = u(),
        tt, nt = function() {}, rt = Object.freeze || nt;
    typeof cajaVM != "undefined" && (rt = cajaVM.def);
    var it;
    if (typeof process != "undefined") it = process.nextTick;
    else if (typeof setImmediate == "function") it = setImmediate;
    else if (typeof MessageChannel != "undefined") {
        var st = new MessageChannel,
            ot = {}, ut = ot;
        st.port1.onmessage = function() {
            ot = ot.next;
            var e = ot.task;
            delete ot.task, e()
        }, it = function(e) {
            ut = ut.next = {
                task: e
            }, st.port2.postMessage(0)
        }
    } else it = function(e) {
        setTimeout(e, 0)
    };
    var at;
    if (Function.prototype.bind) {
        var ft = Function.prototype.bind;
        at = ft.bind(ft.call)
    } else at = function(e) {
        return function() {
            return e.call.apply(e, arguments)
        }
    };
    var lt = at(Array.prototype.slice),
        ct = at(Array.prototype.reduce || function(e, t) {
            var n = 0,
                r = this.length;
            if (arguments.length === 1) do {
                if (n in this) {
                    t = this[n++];
                    break
                }
                if (++n >= r) throw new TypeError
            } while (1);
            for (; n < r; n++) n in this && (t = e(t, this[n], n));
            return t
        }),
        ht = at(Array.prototype.indexOf || function(e) {
            for (var t = 0; t < this.length; t++) if (this[t] === e) return t;
            return -1
        }),
        pt = at(Array.prototype.map || function(e, t) {
            var n = this,
                r = [];
            return ct(n, function(i, s, o) {
                r.push(e.call(t, s, o, n))
            }, void 0), r
        }),
        dt = Object.create || function(e) {
            function t() {}
            return t.prototype = e, new t
        }, vt = Object.keys || function(e) {
            var t = [];
            for (var n in e) t.push(n);
            return t
        }, mt = Object.prototype.toString,
        gt;
    typeof ReturnValue != "undefined" ? gt = ReturnValue : gt = function(e) {
        this.value = e
    };
    var yt = "From previous event:";
    t.nextTick = it, t.defer = f, f.prototype.makeNodeResolver = function() {
        var e = this;
        return function(t, n) {
            t ? e.reject(t) : arguments.length > 2 ? e.resolve(lt(arguments, 1)) : e.resolve(n)
        }
    }, f.prototype.node = a(f.prototype.makeNodeResolver, "node", "makeNodeResolver"), t.promise = l, t.makePromise = c, c.prototype.then = function(e, t, n) {
        return T(this, e, t, n)
    }, c.prototype.thenResolve = function(e) {
        return T(this, function() {
            return e
        })
    }, ct(["isResolved", "isFulfilled", "isRejected", "when", "spread", "send", "get", "put", "del", "post", "invoke", "keys", "apply", "call", "bind", "fapply", "fcall", "fbind", "all", "allResolved", "view", "viewInfo", "timeout", "delay", "catch", "finally", "fail", "fin", "progress", "end", "done", "nfcall", "nfapply", "nfbind", "ncall", "napply", "nbind", "npost", "ninvoke", "nend", "nodeify"], function(e, n) {
        c.prototype[n] = function() {
            return t[n].apply(t, [this].concat(lt(arguments)))
        }
    }, void 0), c.prototype.toSource = function() {
        return this.toString()
    }, c.prototype.toString = function() {
        return "[object Promise]"
    }, rt(c.prototype), t.nearer = h, t.isPromise = p, t.isPromiseAlike = d, t.isResolved = v, t.isFulfilled = m, t.isRejected = g;
    var bt = [],
        wt = [],
        Et;
    t.reject = b, t.begin = w, t.resolve = w, t.ref = a(w, "ref", "resolve"), t.master = E, t.viewInfo = S, t.view = x, t.when = T, t.spread = N, t.async = C, t["return"] = k, t.promised = L, t.sender = a(A, "sender", "dispatcher"), t.Method = a(A, "Method", "dispatcher"), t.send = a(O, "send", "dispatch"), t.dispatch = M, t.dispatcher = _, t.get = _("get"), t.put = _("put"), t["delete"] = t.del = _("del");
    var St = t.post = _("post");
    t.invoke = function(e, t) {
        var n = lt(arguments, 2);
        return St(e, t, n)
    };
    var xt = t.apply = a(_("apply"), "apply", "fapply"),
        Tt = t.fapply = _("fapply");
    t.call = a(D, "call", "fcall"), t["try"] = P, t.fcall = P, t.bind = a(H, "bind", "fbind"), t.fbind = B, t.keys = _("keys"), t.all = j, t.allResolved = F, t["catch"] = t.fail = I, t.progress = q, t["finally"] = t.fin = R, t.end = a(U, "end", "done"), t.done = U, t.timeout = z, t.delay = W, t.nfapply = X, t.nfcall = V, t.nfbind = $, t.napply = a(J, "napply", "npost"), t.ncall = a(K, "ncall", "ninvoke"), t.nbind = a(Q, "nbind", "nfbind"), t.npost = G, t.ninvoke = Y, t.nend = a(Z, "nend", "nodeify"), t.nodeify = Z;
    var Nt = u()
}), montageDefine("06501b6", "package.json", {
    exports: {
        name: "montage",
        version: "0.12.2",
        hash: "06501b6",
        main: "core/core",
        directories: {
            lib: "./"
        },
        mappings: {
            mr: {
                name: "mr",
                hash: "55e8973",
                location: "../mr@55e8973/"
            },
            q: {
                name: "q",
                hash: "9196419",
                location: "../q@9196419/"
            },
            collections: {
                name: "collections",
                hash: "5c28f67",
                location: "../collections@5c28f67/"
            }
        },
        useScriptInjection: !0
    }
}), montageDefine("9196419", "package.json", {
    exports: {
        name: "q",
        version: "0.8.12",
        hash: "9196419",
        main: "q.js",
        directories: {
            lib: "./"
        },
        mappings: {},
        useScriptInjection: !0
    }
}), montageDefine("5c28f67", "package.json", {
    exports: {
        name: "collections",
        version: "0.1.3",
        hash: "5c28f67",
        directories: {
            lib: "./"
        },
        mappings: {},
        useScriptInjection: !0
    }
}), montageDefine("8194d19", "package.json", {
    exports: {
        name: "promise-me-website",
        version: "0.0.0",
        hash: "8194d19",
        directories: {
            lib: "./"
        },
        mappings: {
            montage: {
                name: "montage",
                hash: "06501b6",
                location: "packages/montage@06501b6/"
            },
            "promise-me": {
                name: "promise-me",
                hash: "44127fb",
                location: "packages/promise-me@44127fb/"
            }
        },
        useScriptInjection: !0
    }
}), montageDefine("44127fb", "package.json", {
    exports: {
        name: "promise-me",
        version: "0.1.0",
        hash: "44127fb",
        main: "promise-me.js",
        directories: {
            lib: "./"
        },
        mappings: {
            esprima: {
                name: "esprima",
                hash: "cd1ff07",
                location: "../esprima@cd1ff07/"
            },
            escodegen: {
                name: "escodegen",
                hash: "4524b7e",
                location: "../escodegen@4524b7e/"
            },
            estraverse: {
                name: "estraverse",
                hash: "4401746",
                location: "../estraverse@4401746/"
            },
            escope: {
                name: "escope",
                hash: "7d54410",
                location: "../escope@7d54410/"
            }
        },
        useScriptInjection: !0
    }
}), montageDefine("cd1ff07", "package.json", {
    exports: {
        name: "esprima",
        version: "1.0.2",
        hash: "cd1ff07",
        main: "esprima.js",
        directories: {
            lib: "./"
        },
        mappings: {},
        useScriptInjection: !0
    }
}), montageDefine("4524b7e", "package.json", {
    exports: {
        name: "escodegen",
        version: "0.0.15",
        hash: "4524b7e",
        main: "escodegen.js",
        directories: {
            lib: "./"
        },
        mappings: {
            esprima: {
                name: "esprima",
                hash: "cd1ff07",
                location: "../esprima@cd1ff07/"
            },
            "source-map": {
                name: "source-map",
                hash: "0bf699f",
                location: "../source-map@0bf699f/"
            }
        },
        useScriptInjection: !0
    }
}), montageDefine("4401746", "package.json", {
    exports: {
        name: "estraverse",
        version: "0.0.4",
        hash: "4401746",
        main: "estraverse.js",
        directories: {
            lib: "./"
        },
        mappings: {},
        useScriptInjection: !0
    }
}), montageDefine("7d54410", "package.json", {
    exports: {
        name: "escope",
        version: "0.0.13-dev",
        hash: "7d54410",
        main: "escope.js",
        directories: {
            lib: "./"
        },
        mappings: {
            estraverse: {
                name: "estraverse",
                hash: "4401746",
                location: "../estraverse@4401746/"
            }
        },
        useScriptInjection: !0
    }
}), montageDefine("0bf699f", "package.json", {
    exports: {
        name: "source-map",
        version: "0.1.8",
        hash: "0bf699f",
        main: "./lib/source-map.js",
        directories: {
            lib: "./lib"
        },
        mappings: {
            amdefine: {
                name: "amdefine",
                hash: "61db8d0",
                location: "../amdefine@61db8d0/"
            }
        },
        useScriptInjection: !0
    }
}), montageDefine("61db8d0", "package.json", {
    exports: {
        name: "amdefine",
        version: "0.0.4",
        hash: "61db8d0",
        main: "./amdefine.js",
        directories: {
            lib: "./"
        },
        mappings: {},
        useScriptInjection: !0
    }
}), montageDefine("06501b6", "core/event/event-manager", {
    dependencies: ["montage", "core/uuid", "core/event/mutable-event", "core/serializer", "core/deserializer"],
    factory: function(e, t, n) {
        var r = e("montage").Montage,
            i = e("core/uuid"),
            s = e("core/event/mutable-event").MutableEvent,
            o = e("core/serializer").Serializer,
            u = e("core/deserializer").Deserializer,
            a;
        if (typeof window != "undefined") {
            typeof window.Touch == "undefined" && "ontouchstart" in window && (window.Touch = function() {}, function() {
                var e;
                document.addEventListener("touchstart", e = function(t) {
                    window.Touch = t.touches[0].constructor, document.nativeRemoveEventListener ? document.nativeRemoveEventListener("touchstart", e, !0) : document.removeEventListener("touchstart", e, !0), a && a.isStoringPointerEvents && (a.isStoringPointerEvents = !1, a.isStoringPointerEvents = !0)
                }, !0)
            }()), r.defineProperty(Element.prototype, "eventHandlerUUID", {
                value: undefined,
                enumerable: !1
            }), r.defineProperty(Element.prototype, "controller", {
                get: function() {
                    return a._elementEventHandlerByUUID[this.eventHandlerUUID]
                },
                enumerable: !1
            }), r.defineProperty(Object.prototype, "addEventListener", {
                value: function(e, t, n) {
                    t && a.registerEventListener(this, e, t, n)
                }
            }), r.defineProperty(Object.prototype, "removeEventListener", {
                value: function(e, t, n) {
                    t && a.unregisterEventListener(this, e, t, n)
                }
            }), r.defineProperty(Object.prototype, "dispatchEvent", {
                value: function(e) {
                    var t = e;
                    s.isPrototypeOf(e) || (t = s.fromEvent(e)), t.target = this, a.handleEvent(t)
                },
                enumerable: !1
            }), r.defineProperty(Object.prototype, "dispatchEventNamed", {
                value: function(e, t, n, r) {
                    var i = s.fromType(e, t, n, r);
                    i.target = this, a.handleEvent(i)
                }
            });
            var f = r.create(r, {
                type: {
                    value: null
                },
                listener: {
                    value: null
                },
                capture: {
                    value: null
                }
            });
            o.defineSerializationUnit("listeners", function(e, t) {
                var n = a,
                    r = e.uuid,
                    i = [],
                    s, o, u;
                for (var f in n.registeredEventListeners) {
                    s = n.registeredEventListeners[f], o = s && s[r];
                    if (o) for (var l in o.listeners) u = o.listeners[l], i.push({
                        type: f,
                        listener: t.addObjectReference(u.listener),
                        capture: u.capture
                    })
                }
                if (i.length > 0) return i
            }), u.defineDeserializationUnit("listeners", function(e, t) {
                for (var n = 0, r; r = t[n]; n++) e.addEventListener(r.type, r.listener, r.capture)
            });
            var l = Event.NONE,
                c = Event.CAPTURING_PHASE,
                h = Event.AT_TARGET,
                p = Event.BUBBLING_PHASE,
                d = "function",
                v = t.EventManager = r.create(r, {
                    eventDefinitions: {
                        value: {
                            abort: {
                                bubbles: !1,
                                cancelable: !1
                            },
                            beforeunload: {
                                bubbles: !1
                            },
                            blur: {
                                bubbles: !1,
                                cancelable: !1
                            },
                            change: {
                                bubbles: !0,
                                cancelable: !1
                            },
                            click: {
                                bubbles: !0,
                                cancelable: !0
                            },
                            close: {
                                bubbles: !1,
                                cancelable: !1
                            },
                            compositionend: {
                                bubbles: !0,
                                cancelable: !1
                            },
                            compositionstart: {
                                bubbles: !0,
                                cancelable: !0
                            },
                            compositionupdate: {
                                bubbles: !0,
                                cancelable: !1
                            },
                            contextmenu: {
                                bubbles: !0,
                                cancelable: !0
                            },
                            copy: {
                                bubbles: !0,
                                cancelable: !0
                            },
                            cut: {
                                bubbles: !0,
                                cancelable: !0
                            },
                            dblclick: {
                                bubbles: !0,
                                cancelable: !1
                            },
                            DOMActivate: {
                                bubbles: !0,
                                cancelable: !0,
                                deprecated: !0
                            },
                            DOMMouseScroll: {
                                bubbles: !0
                            },
                            drag: {
                                bubbles: !0,
                                cancelable: !0
                            },
                            dragend: {
                                bubbles: !0,
                                cancelable: !1
                            },
                            dragenter: {
                                bubbles: !0,
                                cancelable: !0
                            },
                            dragleave: {
                                bubbles: !0,
                                cancelable: !1
                            },
                            dragover: {
                                bubbles: !0,
                                cancelable: !0
                            },
                            dragstart: {
                                bubbles: !0,
                                cancelable: !0
                            },
                            drop: {
                                bubbles: !0,
                                cancelable: !0
                            },
                            error: {
                                bubbles: function(e) {
                                    return !(XMLHttpRequest.prototype.isPrototypeOf(e) || e.tagName && "VIDEO" === e.tagName.toUpperCase() || e.tagName && "AUDIO" === e.tagName.toUpperCase())
                                },
                                cancelable: !1
                            },
                            focus: {
                                bubbles: !1,
                                cancelable: !1
                            },
                            focusin: {
                                bubbles: !0,
                                cancelable: !1
                            },
                            focusout: {
                                bubbles: !0,
                                cancelable: !1
                            },
                            input: {
                                bubbles: !0,
                                cancelable: !1
                            },
                            keydown: {
                                bubbles: !0,
                                cancelable: !1
                            },
                            keypress: {
                                bubbles: !0,
                                cancelable: !1
                            },
                            keyup: {
                                bubbles: !0,
                                cancelable: !1
                            },
                            load: {
                                bubbles: !1,
                                cancelable: !1
                            },
                            loadend: {
                                bubbles: !1,
                                cancelable: !1
                            },
                            loadstart: {
                                bubbles: !1,
                                cancelable: !1
                            },
                            message: {
                                bubbles: !1,
                                cancelable: !1
                            },
                            mousedown: {
                                bubbles: !0,
                                cancelable: !0
                            },
                            mouseenter: {
                                bubbles: !1,
                                cancelable: !1
                            },
                            mouseleave: {
                                bubbles: !1,
                                cancelable: !1
                            },
                            mousemove: {
                                bubbles: !0,
                                cancelable: !0
                            },
                            mouseout: {
                                bubbles: !0,
                                cancelable: !0
                            },
                            mouseover: {
                                bubbles: !0,
                                cancelable: !0
                            },
                            mouseup: {
                                bubbles: !0,
                                cancelable: !0
                            },
                            mousewheel: {
                                bubbles: !0
                            },
                            orientationchange: {
                                bubbles: !1
                            },
                            paste: {
                                bubbles: !0,
                                cancelable: !0
                            },
                            progress: {
                                bubbles: !1,
                                cancelable: !1
                            },
                            reset: {
                                bubbles: !0,
                                cancelable: !1
                            },
                            resize: {
                                bubbles: !1,
                                cancelable: !1
                            },
                            scroll: {
                                bubbles: function(e) {
                                    return !!e.defaultView
                                },
                                cancelable: !1
                            },
                            select: {
                                bubbles: !0,
                                cancelable: !1
                            },
                            submit: {
                                bubbles: !0,
                                cancelable: !0
                            },
                            touchcancel: {
                                bubbles: !0,
                                cancelable: !1
                            },
                            touchend: {
                                bubbles: !0,
                                cancelable: !0
                            },
                            touchmove: {
                                bubbles: !0,
                                cancelable: !0
                            },
                            touchstart: {
                                bubbles: !0,
                                cancelable: !0
                            },
                            unload: {
                                bubbles: !1,
                                cancelable: !1
                            },
                            wheel: {
                                bubbles: !0,
                                cancelable: !0
                            }
                        }
                    },
                    _DOMPasteboardElement: {
                        value: null,
                        enumerable: !1
                    },
                    _delegate: {
                        value: null,
                        enumerable: !1
                    },
                    delegate: {
                        enumerable: !1,
                        get: function() {
                            return this._delegate
                        },
                        set: function(e) {
                            this._delegate = e
                        }
                    },
                    _application: {
                        value: null,
                        enumerable: !1
                    },
                    application: {
                        enumerable: !1,
                        get: function() {
                            return this._application
                        },
                        set: function(e) {
                            this._application = e
                        }
                    },
                    _registeredWindows: {
                        value: null,
                        enumerable: !1
                    },
                    _windowsAwaitingFinalRegistration: {
                        value: {},
                        enumerable: !1
                    },
                    initWithWindow: {
                        enumerable: !1,
                        value: function(e) {
                            if (!this._registeredWindows) return this.registerWindow(e), this;
                            throw "EventManager has already been initialized"
                        }
                    },
                    registerWindow: {
                        enumerable: !1,
                        value: function(e) {
                            if (e.defaultEventManager && e.defaultEventManager !== this) throw "EventManager cannot register a window already registered to another EventManager";
                            if (this._registeredWindows && this._registeredWindows.indexOf(e) >= 0) throw "EventManager cannot register a window more than once";
                            this._registeredWindows || (this._registeredWindows = []);
                            if (!e.uuid || e.uuid.length === 0) e.uuid = i.generate();
                            if (this._windowsAwaitingFinalRegistration[e.uuid] === e) return;
                            e.Element.prototype.nativeAddEventListener = e.Element.prototype.addEventListener, Object.defineProperty(e, "nativeAddEventListener", {
                                enumerable: !1,
                                value: e.addEventListener
                            }), Object.getPrototypeOf(e.document).nativeAddEventListener = e.document.addEventListener, e.XMLHttpRequest.prototype.nativeAddEventListener = e.XMLHttpRequest.prototype.addEventListener, e.Worker && (e.Worker.prototype.nativeAddEventListener = e.Worker.prototype.addEventListener), e.Element.prototype.nativeRemoveEventListener = e.Element.prototype.removeEventListener, Object.defineProperty(e, "nativeRemoveEventListener", {
                                enumerable: !1,
                                value: e.removeEventListener
                            }), Object.getPrototypeOf(e.document).nativeRemoveEventListener = e.document.removeEventListener, e.XMLHttpRequest.prototype.nativeRemoveEventListener = e.XMLHttpRequest.prototype.removeEventListener, e.Worker && (e.Worker.prototype.nativeRemoveEventListener = e.Worker.prototype.removeEventListener), Object.defineProperty(e, "addEventListener", {
                                enumerable: !1,
                                value: e.XMLHttpRequest.prototype.addEventListener = e.Element.prototype.addEventListener = Object.getPrototypeOf(e.document).addEventListener = function(t, n, r) {
                                    return e.defaultEventManager.registerEventListener(this, t, n, !! r)
                                }
                            }), e.Worker && (e.Worker.prototype.addEventListener = e.addEventListener), Object.defineProperty(e, "removeEventListener", {
                                enumerable: !1,
                                value: e.XMLHttpRequest.prototype.removeEventListener = e.Element.prototype.removeEventListener = Object.getPrototypeOf(e.document).removeEventListener = function(t, n, r) {
                                    return e.defaultEventManager.unregisterEventListener(this, t, n, !! r)
                                }
                            }), e.Worker && (e.Worker.prototype.removeEventListener = e.removeEventListener);
                            if (e.HTMLDivElement.prototype.addEventListener !== e.Element.prototype.nativeAddEventListener && e.HTMLElement && "addEventListener" in e.HTMLElement.prototype && e.Components && e.Components.interfaces) {
                                var n, r;
                                for (n in Components.interfaces) if (n.match(/^nsIDOMHTML\w*Element$/)) {
                                    n = n.replace(/^nsIDOM/, "");
                                    if (n = window[n]) r = n.prototype, r.nativeAddEventListener = r.addEventListener, r.addEventListener = e.Element.prototype.addEventListener, r.nativeRemoveEventListener = r.removeEventListener, r.removeEventListener = e.Element.prototype.removeEventListener
                                }
                            }
                            a = e.defaultEventManager = t.defaultEventManager = this, this._registeredWindows.push(e), this._windowsAwaitingFinalRegistration[e.uuid] = e, /loaded|complete|interactive/.test(e.document.readyState) ? this._finalizeWindowRegistration(e) : e.document.addEventListener("DOMContentLoaded", this, !0)
                        }
                    },
                    _finalizeWindowRegistration: {
                        enumerable: !1,
                        value: function(e) {
                            if (this._windowsAwaitingFinalRegistration[e.uuid] !== e) throw "EventManager wasn't expecting to register this window";
                            delete this._windowsAwaitingFinalRegistration[e.uuid], this._listenToWindow(e)
                        }
                    },
                    unregisterWindow: {
                        enumerable: !1,
                        value: function(e) {
                            if (this._registeredWindows.indexOf(e) < 0) throw "EventManager cannot unregister an unregistered window";
                            var t = function(t) {
                                return e !== t
                            };
                            this._registeredWindows = this._registeredWindows.filter(t), this._stopListeningToWindow(e)
                        }
                    },
                    unregisterWindows: {
                        enumerable: !1,
                        value: function() {
                            this._registeredWindows.forEach(this.unregisterWindow)
                        }
                    },
                    registeredEventListeners: {
                        enumerable: !1,
                        value: {}
                    },
                    registeredEventListenersForEventType_: {
                        value: function(e) {
                            var t = this.registeredEventListeners[e],
                                n, r, i, s;
                            if (!t) return null;
                            s = {};
                            for (n in t) {
                                r = t[n].listeners;
                                for (i in r) s[i] = r[i]
                            }
                            return s
                        }
                    },
                    registeredEventListenersForEventType_onTarget_: {
                        enumerable: !1,
                        value: function(e, t, n) {
                            var r, i;
                            return t === n ? r = n.eventManager.registeredEventListeners[e] : r = this.registeredEventListeners[e], r ? (i = r[t.uuid], i ? i.listeners : null) : null
                        }
                    },
                    registeredEventListenersOnTarget_: {
                        value: function(e) {
                            var t, n, r = [];
                            for (t in this.registeredEventListeners) n = this.registeredEventListeners[t], e.uuid in n && r.push(n);
                            return r
                        }
                    },
                    registerEventListener: {
                        enumerable: !1,
                        value: function(e, t, n, r) {
                            var i = this.registeredEventListeners[t],
                                s, o, u, a = !1,
                                f = !1;
                            if (typeof e.uuid == "undefined") {
                                if (Array.isCanvasPixelArray(e)) return;
                                throw "EventManager cannot observe a target without a uuid"
                            }
                            return i ? ((s = i[e.uuid]) || (s = i[e.uuid] = {
                                target: e,
                                listeners: {}
                            }, a = !0), o = s.listeners[n.uuid], u = r ? "capture" : "bubble", o ? (o[u] = !0, f = !0) : (o = {
                                listener: n,
                                capture: r,
                                bubble: !r
                            }, s.listeners[n.uuid] = o, f = !0)) : (i = this.registeredEventListeners[t] = {}, i[e.uuid] = {
                                target: e,
                                listeners: {}
                            }, i[e.uuid].listeners[n.uuid] = {
                                listener: n,
                                capture: r,
                                bubble: !r
                            }, a = !0, f = !0), a && typeof e.nativeAddEventListener == "function" && this._observeTarget_forEventType_(e, t), f
                        }
                    },
                    unregisterEventListener: {
                        enumerable: !1,
                        value: function(e, t, n, r) {
                            var i = this.registeredEventListeners[t],
                                s, o, u, a, f;
                            if (!i) return;
                            s = i[e.uuid];
                            if (!s) return;
                            o = s.listeners[n.uuid];
                            if (!o) {
                                for (a in s.listeners) {
                                    f = s.listeners[a].listener;
                                    if (f.originalListener && f.originalListener.uuid === n.uuid) {
                                        o = s.listeners[a], n = f;
                                        break
                                    }
                                }
                                if (!o) return
                            }
                            u = r ? "capture" : "bubble", o[u] = !1, !o.bubble && !o.capture && (delete s.listeners[n.uuid], Object.keys(s.listeners).length === 0 && (delete i[e.uuid], Object.keys(i).length === 0 && (delete this.registeredEventListeners[t], this._stopObservingTarget_forEventType_(e, t))))
                        }
                    },
                    actualDOMTargetForEventTypeOnTarget: {
                        value: function(e, t) {
                            if (!t.nativeAddEventListener) return null;
                            if (!t.defaultView) {
                                var n = this.eventDefinitions[e],
                                    r;
                                return n ? (r = typeof n.bubbles === d ? n.bubbles(t) : n.bubbles, r ? t.screen ? t.document : t.ownerDocument : t) : t
                            }
                            return t
                        }
                    },
                    _observedTarget_byEventType_: {
                        value: {}
                    },
                    _observeTarget_forEventType_: {
                        enumerable: !1,
                        value: function(e, t) {
                            var n;
                            (n = this.actualDOMTargetForEventTypeOnTarget(t, e)) && (!this._observedTarget_byEventType_[t] || !this._observedTarget_byEventType_[t][n.uuid]) && (this._observedTarget_byEventType_[t] || (this._observedTarget_byEventType_[t] = {}), this._observedTarget_byEventType_[t][n.uuid] = this, n.nativeAddEventListener(t, this, !0))
                        }
                    },
                    _stopObservingTarget_forEventType_: {
                        enumerable: !1,
                        value: function(e, t) {
                            var n;
                            n = this.actualDOMTargetForEventTypeOnTarget(t, e), n && (delete this._observedTarget_byEventType_[t][n.uuid], n.nativeRemoveEventListener(t, this, !0))
                        }
                    },
                    _activationHandler: {
                        enumerable: !0,
                        value: null
                    },
                    _listenToWindow: {
                        enumerable: !1,
                        value: function(e) {
                            if (!this._activationHandler) {
                                var t = this;
                                this._activationHandler = function(e) {
                                    var n = e.type;
                                    t.registeredEventListeners[n] || t.handleEvent(e)
                                }
                            }
                            e.Touch ? e.document.nativeAddEventListener("touchstart", this._activationHandler, !0) : e.document.nativeAddEventListener("mousedown", this._activationHandler, !0);
                            if (this.application) {
                                var n = this.registeredEventListenersOnTarget_(this.application),
                                    r;
                                for (r in n) this._observeTarget_forEventType_(e, r)
                            }
                        }
                    },
                    _stopListeningToWindow: {
                        enumerable: !1,
                        value: function(e) {
                            var t = this.registeredEventListenersOnTarget_(this.application),
                                n = this.registeredEventListenersOnTarget_(e),
                                r;
                            for (r in t) this._stopObservingTarget_forEventType_(e, r);
                            for (r in n) this._stopObservingTarget_forEventType_(e, r)
                        }
                    },
                    reset: {
                        enumerable: !1,
                        value: function() {
                            var e, t, n, r;
                            for (e in this.registeredEventListeners) {
                                t = this.registeredEventListeners[e];
                                for (n in t.targets) r = t.targets[n], this._stopObservingTarget_forEventType_(r.target, e)
                            }
                            this.registeredEventListeners = {}, this._claimedPointers = {}
                        }
                    },
                    unload: {
                        enumerable: !1,
                        value: function() {
                            this._stopListening()
                        }
                    },
                    methodNameForBubblePhaseOfEventType: {
                        enumerable: !1,
                        value: function(e) {
                            return function(t, n) {
                                var r = n ? t + "+" + n : t;
                                return e[r] || (e[r] = "handle" + (n ? n.toCapitalized() : "") + t.toCapitalized())
                            }
                        }({})
                    },
                    _methodNameForCapturePhaseByEventType_: {
                        value: {}
                    },
                    methodNameForCapturePhaseOfEventType: {
                        enumerable: !1,
                        value: function(e) {
                            return function(t, n) {
                                var r = n ? t + "+" + n : t;
                                return e[r] || (e[r] = "capture" + (n ? n.toCapitalized() : "") + t.toCapitalized())
                            }
                        }({})
                    },
                    _claimedPointers: {
                        enumerable: !1,
                        distinct: !0,
                        value: {}
                    },
                    componentClaimingPointer: {
                        value: function(e) {
                            return this._claimedPointers[e]
                        }
                    },
                    isPointerClaimedByComponent: {
                        value: function(e, t) {
                            if (!t) throw "Must specify a valid component to see if it claims the specified pointer, '" + t + "' is not valid.";
                            return this._claimedPointers[e] === t
                        }
                    },
                    claimPointer: {
                        value: function(e, t) {
                            if (!e && e !== 0) throw "Must specify a valid pointer to claim, '" + e + "' is not valid.";
                            if (!t) throw "Must specify a valid component to claim a pointer, '" + t + "' is not valid.";
                            var n = this._claimedPointers[e];
                            return n === t ? !0 : n ? n.surrenderPointer(e, t) ? (this._claimedPointers[e] = t, !0) : !1 : (this._claimedPointers[e] = t, !0)
                        }
                    },
                    forfeitPointer: {
                        value: function(e, t) {
                            if (t !== this._claimedPointers[e]) throw "Not allowed to forfeit pointer '" + e + "' claimed by another component";
                            delete this._claimedPointers[e]
                        }
                    },
                    forfeitAllPointers: {
                        value: function(e) {
                            var t, n;
                            for (t in this._claimedPointers) n = this._claimedPointers[t], e === n && delete this._claimedPointers[t]
                        }
                    },
                    _isStoringPointerEvents: {
                        enumerable: !1,
                        value: !1
                    },
                    isStoringPointerEvents: {
                        enumerable: !0,
                        get: function() {
                            return this._isStoringPointerEvents
                        },
                        set: function(e) {
                            e === !0 ? this._isStoringPointerEvents || (this._isStoringPointerEvents = !0, window.Touch && Object.defineProperty(Touch.prototype, "velocity", {
                                get: function() {
                                    return a.pointerMotion(this.identifier).velocity
                                },
                                set: function() {}
                            })) : (this._isStoringPointerEvents = !1, this._pointerStorage.memory = {}, this._isMouseDragging = !1)
                        }
                    },
                    _isStoringMouseEventsWhileDraggingOnly: {
                        enumerable: !1,
                        value: !0
                    },
                    isStoringMouseEventsWhileDraggingOnly: {
                        enumerable: !0,
                        get: function() {
                            return this._isStoringMouseEventsWhileDraggingOnly
                        },
                        set: function(e) {
                            this._isStoringMouseEventsWhileDraggingOnly = e === !0 ? !0 : !1
                        }
                    },
                    _isMouseDragging: {
                        enumerable: !1,
                        value: !1
                    },
                    _pointerStorage: {
                        enumerable: !1,
                        value: {
                            memory: {},
                            add: function(e, t) {
                                this.memory[e] || (this.memory[e] = {
                                    data: new Array(32),
                                    size: 0,
                                    pos: 0
                                }), this.memory[e].data[this.memory[e].pos] = t, this.memory[e].size < this.memory[e].data.length && this.memory[e].size++, this.memory[e].pos = (this.memory[e].pos + 1) % this.memory[e].data.length
                            },
                            remove: function(e) {
                                delete this.memory[e]
                            },
                            clear: function(e) {
                                this.memory[e] && (this.memory[e].size = 0)
                            },
                            getMemory: function(e) {
                                return this.memory[e]
                            },
                            isStored: function(e) {
                                return this.memory[e] && this.memory[e].size > 0
                            },
                            storeEvent: function(e) {
                                var t;
                                switch (e.type) {
                                    case "mousedown":
                                        a._isMouseDragging = !0;
                                    case "mousemove":
                                        a._isStoringMouseEventsWhileDraggingOnly ? a._isMouseDragging && (this.add("mouse", {
                                            clientX: e.clientX,
                                            clientY: e.clientY,
                                            timeStamp: e.timeStamp
                                        }), Object.defineProperty(e, "velocity", {
                                            get: function() {
                                                return a.pointerMotion("mouse").velocity
                                            },
                                            set: function() {}
                                        })) : (this.add("mouse", {
                                            clientX: e.clientX,
                                            clientY: e.clientY,
                                            timeStamp: e.timeStamp
                                        }), Object.defineProperty(e, "velocity", {
                                            get: function() {
                                                return a.pointerMotion("mouse").velocity
                                            },
                                            set: function() {}
                                        }));
                                        break;
                                    case "mouseup":
                                        this.add("mouse", {
                                            clientX: e.clientX,
                                            clientY: e.clientY,
                                            timeStamp: e.timeStamp
                                        }), Object.defineProperty(e, "velocity", {
                                            get: function() {
                                                return a.pointerMotion("mouse").velocity
                                            },
                                            set: function() {}
                                        });
                                        break;
                                    case "touchstart":
                                    case "touchmove":
                                        for (t = 0; t < e.touches.length; t++) this.add(e.touches[t].identifier, {
                                            clientX: e.touches[t].clientX,
                                            clientY: e.touches[t].clientY,
                                            timeStamp: e.timeStamp
                                        });
                                        break;
                                    case "touchend":
                                        for (t = 0; t < e.changedTouches.length; t++) this.add(e.changedTouches[t].identifier, {
                                            clientX: e.changedTouches[t].clientX,
                                            clientY: e.changedTouches[t].clientY,
                                            timeStamp: e.timeStamp
                                        })
                                }
                            },
                            removeEvent: function(e) {
                                var t;
                                switch (e.type) {
                                    case "mouseup":
                                        a._isMouseDragging = !1, a._isStoringMouseEventsWhileDraggingOnly && this.clear("mouse");
                                        break;
                                    case "touchend":
                                        for (t = 0; t < e.changedTouches.length; t++) this.remove(e.changedTouches[t].identifier)
                                }
                            }
                        }
                    },
                    _getPointerVelocityData: {
                        enumerable: !1,
                        value: function(e) {
                            var t = 0,
                                n, r, i, s, o, u, f, l, c, h = 0,
                                p = !0,
                                d = {
                                    x: [],
                                    y: [],
                                    time: []
                                };
                            n = a._pointerStorage.getMemory(e), r = n.data.length, i = n.data[(n.pos - 1 + r) % r], s = o = u = i.timeStamp, f = i.clientX, l = i.clientY;
                            while (p && o > s - 350 && t < n.size) i = n.data[(n.pos - t - 1 + r) % r], o = i.timeStamp, c = f * f + l * l, c > 2 && u - o <= 50 ? (d.x.push(i.clientX), d.y.push(i.clientY), d.time.push(o), u = o, f = i.clientX, l = i.clientY, t++) : p = !1;
                            return d
                        }
                    },
                    _fitPointerCurve: {
                        enumerable: !1,
                        value: function(e, t) {
                            var n, r, i, s, o, u = 1e-4,
                                a = t.length,
                                f, l, c, h, p, d, v, m, g, y, b, w, E, S, x, T, N, C, k, L, A, O, M, _, D, P, H, B, j, F, I, q, R, U;
                            do {
                                v = 0, m = 0, g = 0, y = 0, b = 0, w = 0, S = 0, x = 0, T = 0, N = 0, C = 0, k = 0, A = 0, O = 0, M = 0, _ = 0, D = 0, P = 0, B = 0, j = 0, F = 0, I = 0, q = 0, R = 0;
                                for (d = 0; d < a; d++) f = t[d], l = f.t, h = l * l, p = h * l, c = f.v, E = u * (6 * (h - l) - p + 2), L = u * 6 * (p - 2 * h + l), H = u * 6 * (h - p), U = u * 2 * p, w += E * E, k += L * L, P += H * H, R += U * U, v += c * E, S += c * L, A += c * H, B += c * U, g -= E, T -= L, M -= H, F -= U, m -= E * l, x -= L * l, O -= H * l, j -= U * l, y -= E * h, N -= L * h, _ -= H * h, I -= U * h, b -= E * p, C -= L * p, D -= H * p, q -= U * p;
                                u *= 2
                            } while (w === 0 || k === 0 || P === 0 || R === 0);
                            l = u / w, v *= l, m *= l * 3, g *= l, y *= l * 3, b *= l, l = u / k, S *= l, x *= l * 3, T *= l, N *= l * 3, C *= l, l = u / P, A *= l, O *= l * 3, M *= l, _ *= l * 3, D *= l, l = u / R, B *= l, j *= l * 3, F *= l, I *= l * 3, q *= l, w = e[0], k = e[1], P = e[2], R = e[3], r = (k - P) * 3 + R - w, i = w + P - 2 * k, s = k - w, o = w;
                            for (d = 0; d < 20; d++) l = v + o * g + s * m + i * y + r * b, w += l, o += l, r -= l, i += l, s -= l, l = S + o * T + s * x + i * N + r * C, k += l, r += l * 3, i -= l + l, s += l, l = A + o * M + s * O + i * _ + r * D, P += l, r -= l * 3, i += l, l = B + o * F + s * j + i * I + r * q, R += l, r += l;
                            e[0] = w, e[1] = k, e[2] = P, e[3] = R
                        }
                    },
                    _pointerBezierValue: {
                        enumerable: !1,
                        value: function(e, t) {
                            var n = 1 - e;
                            return n * n * n * t[0] + 3 * n * n * e * t[1] + 3 * n * e * e * t[2] + e * e * e * t[3]
                        }
                    },
                    _calculatePointerVelocity: {
                        enumerable: !1,
                        value: function(e, t) {
                            var n = e.length,
                                r = e[0],
                                i = e[0],
                                s, o = 0,
                                u;
                            for (u = 1; u < n; u++) e[u] < r && (r = e[u], o = u);
                            s = i - r;
                            if (s) {
                                if (n > 5) {
                                    var a, f, l, c = [];
                                    for (u = 0; u < n; u++) c[u] = {
                                        v: t[u],
                                        t: (e[u] - r) / s
                                    };
                                    return a = c[o].v, f = c[0].v, l = [a, (a * 2 + f) / 3, (a + f * 2) / 3, f], this._fitPointerCurve(l, c), (this._pointerBezierValue(.8, l) - this._pointerBezierValue(.6, l)) * 5e3 / s
                                }
                                return n > 1 ? (t[0] - t[o]) * 1e3 / s : 0
                            }
                            return 0
                        }
                    },
                    pointerMotion: {
                        value: function(e) {
                            if (a._pointerStorage.isStored(e)) {
                                var t = {};
                                return Object.defineProperties(t, {
                                    _data: {
                                        enumerable: !1,
                                        writable: !0,
                                        value: null
                                    },
                                    _x: {
                                        enumerable: !1,
                                        writable: !0,
                                        value: null
                                    },
                                    _y: {
                                        enumerable: !1,
                                        writable: !0,
                                        value: null
                                    },
                                    _speed: {
                                        enumerable: !1,
                                        writable: !0,
                                        value: null
                                    },
                                    _angle: {
                                        enumerable: !1,
                                        writable: !0,
                                        value: null
                                    },
                                    x: {
                                        get: function() {
                                            return this._x === null && (this._data === null && (this._data = a._getPointerVelocityData(e)), this._x = a._calculatePointerVelocity(this._data.time, this._data.x)), this._x
                                        },
                                        set: function() {}
                                    },
                                    y: {
                                        get: function() {
                                            return this._y === null && (this._data === null && (this._data = a._getPointerVelocityData(e)), this._y = a._calculatePointerVelocity(this._data.time, this._data.y)), this._y
                                        },
                                        set: function() {}
                                    },
                                    speed: {
                                        get: function() {
                                            return this._speed === null && (this._speed = Math.sqrt(this.x * this.x + this.y * this.y)), this._speed
                                        },
                                        set: function() {}
                                    },
                                    angle: {
                                        get: function() {
                                            return this._angle === null && (this._angle = Math.atan2(this.y, this.x)), this._angle
                                        },
                                        set: function() {}
                                    }
                                }), {
                                    velocity: t
                                }
                            }
                            return undefined
                        }
                    },
                    monitorDOMModificationInEventHandling: {
                        value: !1
                    },
                    domModificationEventHandler: {
                        value: r.create(r, {
                            handleEvent: {
                                value: function(e) {
                                    throw "DOM Modified"
                                }
                            },
                            captureDOMSubtreeModified: {
                                value: function(e) {
                                    throw "DOMSubtreeModified"
                                }
                            },
                            captureDOMAttrModified: {
                                value: function(e) {
                                    throw "DOMAttrModified"
                                }
                            },
                            captureDOMCharacterDataModified: {
                                value: function(e) {
                                    throw "DOMCharacterDataModified"
                                }
                            }
                        })
                    },
                    handleEvent: {
                        enumerable: !1,
                        value: function(e) {
                            this.monitorDOMModificationInEventHandling && (document.body.addEventListener("DOMSubtreeModified", this.domModificationEventHandler, !0), document.body.addEventListener("DOMAttrModified", this.domModificationEventHandler, !0), document.body.addEventListener("DOMCharacterDataModified", this.domModificationEventHandler, !0));
                            var t, n, r, i, o, u, a, f, v, m, g = e.type,
                                y = e.bubbles,
                                b, w, E, S, x, T;
                            "DOMContentLoaded" === g && (t = e.target.defaultView, t && this._windowsAwaitingFinalRegistration[t.uuid] && (this._finalizeWindowRegistration(t), e.target.removeEventListener("DOMContentLoaded", this, !0))), typeof e.propagationStopped != "boolean" ? x = s.fromEvent(e) : x = e;
                            if ("mousedown" === g || "touchstart" === g) if (x.changedTouches) {
                                T = x.changedTouches.length;
                                for (n = 0; n < T; n++) this._prepareComponentsForActivationEventTarget(x.changedTouches[n].target)
                            } else this._prepareComponentsForActivationEventTarget(x.target);
                            m = this._eventPathForTarget(x.target), x.target.identifier ? E = this.methodNameForCapturePhaseOfEventType(g, x.target.identifier) : E = null, x.target.identifier ? S = this.methodNameForBubblePhaseOfEventType(g, x.target.identifier) : S = null, b = this.methodNameForCapturePhaseOfEventType(g), w = this.methodNameForBubblePhaseOfEventType(g), this.delegate && typeof this.delegate.willDistributeEvent === d && this.delegate.willDistributeEvent(x), this._isStoringPointerEvents && this._pointerStorage.storeEvent(x), x.eventPhase = c;
                            for (n = m.length - 1; !x.propagationStopped && (r = m[n]); n--) {
                                x.currentTarget = r, i = this.registeredEventListenersForEventType_onTarget_(g, r);
                                if (!i) continue;
                                a = Object.keys(i);
                                for (o = 0; i && !x.immediatePropagationStopped && (u = i[a[o]]); o++) {
                                    if (!u.capture) continue;
                                    v = u.listener, E && typeof v[E] === d ? v[E](x) : typeof v[b] === d ? v[b](x) : typeof v.handleEvent === d ? v.handleEvent(x) : typeof v === d && v.call(r, x)
                                }
                            }
                            if (!x.propagationStopped) {
                                x.eventPhase = h, x.currentTarget = r = x.target, i = this.registeredEventListenersForEventType_onTarget_(g, r);
                                if (i) {
                                    a = Object.keys(i);
                                    for (o = 0; i && !x.immediatePropagationStopped && (u = i[a[o]]); o++) v = u.listener, u.capture && (E && typeof v[E] === d ? v[E](x) : typeof v[b] === d ? v[b](x) : typeof v.handleEvent === d ? v.handleEvent(x) : typeof v === d && v.call(r, x)), u.bubble && (S && typeof v[S] === d ? v[S](x) : typeof v[w] === d ? v[w](x) : typeof v.handleEvent === d ? v.handleEvent(x) : typeof v === d && v.call(r, x))
                                }
                            }
                            x.eventPhase = p;
                            for (n = 0; y && !x.propagationStopped && (r = m[n]); n++) {
                                x.currentTarget = r, i = this.registeredEventListenersForEventType_onTarget_(g, r);
                                if (!i) continue;
                                a = Object.keys(i);
                                for (o = 0; i && !x.immediatePropagationStopped && (u = i[a[o]]); o++) {
                                    if (!u.bubble) continue;
                                    v = u.listener, S && typeof v[S] === d ? v[S](x) : typeof v[w] === d ? v[w](x) : typeof v.handleEvent === d ? v.handleEvent(x) : typeof v === d && v.call(r, x)
                                }
                            }
                            x.eventPhase = l, x.currentTarget = null, this._isStoringPointerEvents && this._pointerStorage.removeEvent(e), this.monitorDOMModificationInEventHandling && (document.body.removeEventListener("DOMSubtreeModified", this.domModificationEventHandler, !0), document.body.removeEventListener("DOMAttrModified", this.domModificationEventHandler, !0), document.body.removeEventListener("DOMCharacterDataModified", this.domModificationEventHandler, !0))
                        }
                    },
                    _prepareComponentsForActivationEventTarget: {
                        value: function(e) {
                            var t = e,
                                n, r = t && t.defaultView ? t.defaultView : window,
                                i = r.document ? r.document : document,
                                s;
                            do {
                                if (t) {
                                    s = this.eventHandlerForElement(t);
                                    if (s) if (!s._preparedForActivationEvents) s._prepareForActivationEvents(), s._preparedForActivationEvents = !0;
                                    else if (s._preparedForActivationEvents) return
                                }
                                n = t;
                                switch (t) {
                                    case r:
                                        t = null;
                                        break;
                                    case i:
                                        t = r;
                                        break;
                                    case i.documentElement:
                                        t = i;
                                        break;
                                    default:
                                        t = t.parentNode
                                }
                            } while (t && n !== t)
                        }
                    },
                    _eventPathForTarget: {
                        enumerable: !1,
                        value: function(e) {
                            if (!e) return [];
                            var t = e,
                                n = t && t.defaultView ? t.defaultView : window,
                                r = n.document ? n.document : document,
                                i = this.application,
                                s, o = [];
                            do {
                                t !== e && o.push(t), s = t;
                                switch (t) {
                                    case i:
                                        t = t.parentApplication, t && (i = t);
                                        break;
                                    case n:
                                        t = i;
                                        break;
                                    case r:
                                        t = n;
                                        break;
                                    case r.documentElement:
                                        t = r;
                                        break;
                                    default:
                                        t = t.parentProperty ? t[t.parentProperty] : t.parentNode, t || (t = i)
                                }
                            } while (t && s !== t);
                            return o
                        }
                    },
                    _elementEventHandlerByUUID: {
                        enumerable: !1,
                        value: {}
                    },
                    registerEventHandlerForElement: {
                        enumerable: !1,
                        value: function(e, t) {
                            var n = this.eventHandlerForElement(t);
                            n && this.unregisterEventHandlerForElement(t), this._elementEventHandlerByUUID[t.eventHandlerUUID = e.uuid] = e
                        }
                    },
                    unregisterEventHandlerForElement: {
                        enumerable: !1,
                        value: function(e) {
                            delete this._elementEventHandlerByUUID[e.eventHandlerUUID], delete e.eventHandlerUUID
                        }
                    },
                    eventHandlerForElement: {
                        enumerable: !1,
                        value: function(e) {
                            return this._elementEventHandlerByUUID[e.eventHandlerUUID]
                        }
                    }
                })
        }
    }
}), montageDefine("06501b6", "core/deserializer", {
    dependencies: ["montage", "core/logger", "core/promise"],
    factory: function(require, exports, module) {
        function deserialize(e, t, n) {
            var r = Promise.defer();
            return deserializer.init(e, t, n).deserializeObject(function(e) {
                r.resolve(e)
            }), r.promise
        }
        var Montage = require("montage").Montage,
            logger = require("core/logger").logger("deserializer"),
            Promise = require("core/promise").Promise,
            globalEval = eval,
            canEval = !0;
        try {
            eval("")
        } catch (ex) {
            canEval = !1
        }
        var Deserializer = exports.Deserializer = Montage.create(Montage, {
            _MONTAGE_ID_ATTRIBUTE: {
                value: "data-montage-id"
            },
            _objects: {
                value: null
            },
            _objectStack: {
                value: []
            },
            _modulesByRequire: {
                value: Object.create(null)
            },
            _modules: {
                value: null
            },
            _requiredModuleIds: {
                value: null
            },
            _objectLabels: {
                value: null
            },
            _serializationString: {
                value: null,
                enumerable: !1
            },
            _serialization: {
                value: null,
                enumerable: !1
            },
            _parseFunction: {
                value: null,
                enumerable: !1
            },
            _deserializationUnits: {
                value: []
            },
            _optimizedIds: {
                value: Object.create(null)
            },
            _indexedDeserializationUnits: {
                value: Object.create(null)
            },
            __sharedDocument: {
                value: null
            },
            _sharedDocument: {
                get: function() {
                    return this.__cachedDoc ? this.__cachedDoc : this.__cachedDoc = window.document.implementation.createHTMLDocument("")
                }
            },
            _reset: {
                value: function() {
                    this._serializationString = null, this._requiredModuleIds = null, this._areModulesLoaded = !1, this._parseFunction = null, this._serialization = null, this._compiledDeserializationFunction = null, this._compiledDeserializationFunctionString = null, this._origin = null
                }
            },
            _setupModulesForRequire: {
                value: function(e) {
                    if (e) {
                        var t = this._modulesByRequire[e.uuid];
                        t ? this._modules = t : this._modules = this._modulesByRequire[e.uuid] = Object.create(null)
                    }
                }
            },
            init: {
                value: function(e, t, n) {
                    return typeof e != "string" && (e = JSON.stringify(e)), this._reset(), this._serializationString = e, this._require = t, this._origin = n, this._setupModulesForRequire(t), this
                }
            },
            initWithString: {
                value: function(e, t) {
                    return this._reset(), this._serializationString = e, this._origin = t, this._setupModulesForRequire(this._require), this
                }
            },
            initWithObject: {
                value: function(e) {
                    return this._reset(), this._serializationString = JSON.stringify(e), this._setupModulesForRequire(this._require), this
                }
            },
            initWithObjectAndRequire: {
                value: function(e, t, n) {
                    return this._reset(), this._serializationString = JSON.stringify(e), this._require = t, this._origin = n, this._setupModulesForRequire(t), this
                }
            },
            initWithStringAndRequire: {
                value: function(e, t, n) {
                    return this._reset(), this._serializationString = e, this._require = t, this._origin = n, this._setupModulesForRequire(t), this
                }
            },
            defineDeserializationUnit: {
                value: function(e, t) {
                    this._deserializationUnits.push({
                        name: e,
                        funktion: this._indexedDeserializationUnits[e] = t
                    })
                }
            },
            getObjectsFromLastDeserialization: {
                value: function() {
                    var e = this._objects,
                        t = [];
                    for (var n in e) Object.hasOwnProperty.call(e, n) && t.push(e[n]);
                    return t
                }
            },
            chainDeserializer: {
                value: function(e) {
                    var t = this._chainedSerializations,
                        n, r;
                    t || (this._chainedSerializations = t = []), t.push({
                        string: e._serializationString,
                        compiledFunction: e._compiledDeserializationFunction,
                        compiledFunctionString: e._compiledDeserializationFunctionString
                    }), r = e._optimizedIds;
                    if (r) {
                        n || (this._optimizedIds = n = Object.create(null));
                        for (var i in r) n[i] = r[i]
                    }
                }
            },
            get: {
                value: function(e) {
                    var t = this._objectStack,
                        n = t.length - 1;
                    return t[n][e]
                }
            },
            deserializeProperties: {
                value: function() {
                    var e = this._objectStack,
                        t = e.length - 1,
                        n = e[t - 1],
                        r = e[t];
                    this._deserializeProperties(n, r.properties, !1)
                }
            },
            getProperty: {
                value: function(e) {
                    var t = this._objectStack,
                        n = t.length - 1,
                        r = t[n];
                    return r.properties[e]
                }
            },
            deserializeUnits: {
                value: function() {
                    var e = this._objectStack,
                        t = e.length - 1,
                        n = e[t];
                    n._units = this._indexedDeserializationUnits
                }
            },
            deserializeUnit: {
                value: function(e) {
                    var t = this._objectStack,
                        n = t.length - 1,
                        r = t[n],
                        i;
                    r._units ? i = r._units : r._units = i = Object.create(null), i[e] = this._indexedDeserializationUnits[e]
                }
            },
            getType: {
                value: function() {
                    var e = this._objectStack,
                        t = e.length - 1,
                        n = e[t];
                    return "object" in n ? "object" : "prototype" in n ? "prototype" : null
                }
            },
            getTypeValue: {
                value: function() {
                    var e = this._objectStack,
                        t = e.length - 1,
                        n = e[t];
                    return n.object || n.prototype
                }
            },
            getObjectByLabel: {
                value: function(e) {
                    return this._objects[e] || this._objectLabels[e]
                }
            },
            _customDeserialization: {
                enumerable: !1,
                value: function(e, t) {
                    this._pushContextObject(e), this._pushContextObject(t), e.deserializeSelf(this), this._popContextObject(), this._popContextObject()
                }
            },
            deserializePropertiesForObject: {
                value: function(e, t, n) {
                    if (n) for (var r in t) Montage.getPropertyAttribute(e, r, "serializable") || (Object.getPropertyDescriptor(e, r) ? console.warn('Unserializable property "' + r + '" found in the serialization of ' + (e._montage_metadata ? e._montage_metadata.objectName : e) + " (" + (this._origin || window.location) + ")") : console.warn('Nonexistent (and therefore unserializable) property "' + r + '" found in the serialization of ' + (e._montage_metadata ? e._montage_metadata.objectName : e) + " (" + (this._origin || window.location) + ")")), e[r] = t[r];
                    else for (var r in t) e[r] = t[r]
                }
            },
            _pushContextObject: {
                value: function(e) {
                    this._objectStack.push(e)
                }
            },
            _popContextObject: {
                value: function() {
                    return this._objectStack.pop()
                }
            },
            _require: {
                enumerable: !1,
                value: null
            },
            _defaultModuleLoader: {
                enumerable: !1,
                value: function(e, t) {
                    if (typeof require != "function") {
                        logger.error("Deserializer: The default module loader needs the global require function to be defined.");
                        return
                    }
                    var n = 0,
                        r = Object.create(null),
                        i = this._require;
                    e.forEach(function(s) {
                        t ? i.async(s).then(function(i) {
                            r[s] = i, ++n === e.length && t(r)
                        }, function(e) {
                            console.log(e.stack)
                        }).done() : r[s] = i(s)
                    });
                    if (!t) return r
                }
            },
            _areModulesLoaded: {
                value: !1
            },
            _areModulesLoading: {
                value: !1
            },
            ___loadModulesCallbacks: {
                value: null
            },
            _loadModules: {
                enumerable: !1,
                value: function(e, t) {
                    if (this._areModulesLoaded || e.length === 0) t && t();
                    else if (this._areModulesLoading) this.___loadModulesCallbacks.push(t);
                    else {
                        var n = this,
                            r = this._moduleLoader || this._defaultModuleLoader;
                        this.___loadModulesCallbacks = [t], this._areModulesLoading = !0;

                        function i(e) {
                            var t = n._modules;
                            for (var r in e) Object.hasOwnProperty.call(e, r) && (t[r] = e[r]);
                            n._areModulesLoaded = !0, n._areModulesLoading = !1, n.___loadModulesCallbacks.forEach(function(e) {
                                e && e()
                            }), n.___loadModulesCallbacks = null
                        }
                        t ? r.call(this, e, i) : i(r.call(this, e))
                    }
                }
            },
            _prepareForDeserialization: {
                value: function(e) {
                    if (this._areModulesLoaded) return e();
                    if (!this._compiledDeserializationFunctionString) {
                        try {
                            this._serialization = JSON.parse(this._serializationString)
                        } catch (t) {
                            if (logger.isError) return this._reportParseError(this._serializationString, this._origin), e()
                        }
                        this._parseForModules()
                    }
                    if (!(this._requiredModuleIds.length > 0)) return this._areModulesLoaded = !0, e();
                    this._loadModules(this._requiredModuleIds, e)
                }
            },
            setModuleLoader: {
                value: function(e) {
                    this._moduleLoader = e
                }
            },
            _findObjectNameRegExp: {
                value: /([^\/]+?)(\.reel)?$/
            },
            _toCamelCaseRegExp: {
                value: /(?:^|-)([^-])/g
            },
            _replaceToCamelCase: {
                value: function(e, t) {
                    return t.toUpperCase()
                }
            },
            _parseForModules: {
                value: function() {
                    var e = this._serialization,
                        t = this._requiredModuleIds = [],
                        n = this._modules,
                        r, i;
                    for (var s in e) {
                        r = e[s], i = null;
                        if ("module" in r) i = r.module;
                        else if ("prototype" in r || "object" in r) Deserializer.parseForModuleAndName(r.prototype || r.object, r), i = r.module;
                        i && !n[i] && t.indexOf(i) == -1 && t.push(i)
                    }
                }
            },
            parseForModuleAndName: {
                value: function(e, t) {
                    var n;
                    return typeof t == "undefined" && (t = Object.create(null)), n = e.indexOf("["), n > 0 ? (t.module = e.substr(0, n), t.name = e.slice(n + 1, -1)) : (t.module = e, Deserializer._findObjectNameRegExp.test(e), t.name = RegExp.$1.replace(Deserializer._toCamelCaseRegExp, Deserializer._replaceToCamelCase)), t
                }
            },
            _compile: {
                value: function() {
                    return this._prepareForDeserialization(), this._compileAndDeserialize(), this._compiledDeserializationFunctionString
                }
            },
            optimizeForDocument: {
                value: function(e) {
                    var t = Deserializer._MONTAGE_ID_ATTRIBUTE,
                        n = e.querySelectorAll("*[" + t + "]"),
                        r = this._optimizedIds = Object.create(null);
                    for (var i = 0, s; s = n[i]; i++) if (!s.id) {
                        var o = s.getAttribute(t);
                        s.setAttribute("id", r[o] = "_" + t + "_" + o)
                    }
                }
            },
            _labelRegexp: {
                enumerable: !1,
                value: /^[a-zA-Z_$][0-9a-zA-Z_$]*$/
            },
            _compileAndDeserialize: {
                value: function(e, t, n, r) {
                    function i(e, t) {
                        var i, c, d, v, m, b = o._objectLabels[e],
                            w = b != null,
                            E, S, x, T;
                        if (Object.keys(t).length == 0) return;
                        if ("module" in t) i = t.module, d = c = t.name;
                        else if ("prototype" in t || "object" in t) c = t.prototype || t.object, T = c.indexOf("["), T > 0 ? (i = c.substr(0, T), d = c = c.slice(T + 1, -1)) : (i = c, o._findObjectNameRegExp.test(c), d = c = RegExp.$1.replace(o._toCamelCaseRegExp, function(e, t) {
                            return t.toUpperCase()
                        }));
                        m = "object" in t, v = i + "." + c;
                        if (r) if (w) n[e] = b;
                        else if (m) n[e] = b = p[i][c];
                        else {
                            if (!(c in p[i])) {
                                console.log('Warning: Object "' + c + '" not found at "' + i + '" referenced from ' + o._origin + ".");
                                return
                            }
                            n[e] = b = p[i][c].create(), Montage.getInfoForObject(b).label = e, Object.defineProperty(b, "_suuid", {
                                enumerable: !1,
                                value: o.uuid + "-" + e
                            })
                        }
                        h[e] = !0, u += 'if (this._objectLabels["' + e + '"]) {\n', u += "  var " + e + " = exports." + e + ' = this._objectLabels["' + e + '"];\n', u += "} else if(exports." + e + ") {\n", u += "  var " + e + " = exports." + e + ";\n", w || (v in g ? d = g[v] : (E = (y[c] || 0) + 1, y[c] = E, E > 1 && (d += E), g[v] = d, g.push("var " + d + ' = this._modules["' + i + '"]["' + c + '"];')), u += "} else {\n", m ? u += "  var " + e + " = exports." + e + " = " + d + ";\n" : (u += "  var " + e + " = exports." + e + " = " + d + ".create();\n", u += "  Montage.getInfoForObject(" + e + ').label = "' + e + '";\n', u += "  Object.defineProperty(" + e + ', "_suuid", {enumerable: false, value: "' + o.uuid + "-" + e + '"});\n')), u += "}\n", S = s(t), f += "var " + e + "Serialization = " + S + ";\n", f += e + ".isDeserializing = true;\n", l += "delete " + e + ".isDeserializing;\n", f += "if (typeof " + e + '.deserializeSelf === "function") {\n', f += "  " + e + "Serialization._units = Object.create(null);\n", f += "  this._customDeserialization(" + e + ", " + S + ");\n", f += "} else {\n", f += "  this._deserializeProperties(" + e + ", " + e + "Serialization.properties);\n", f += "}\n", r && (b.isDeserializing = !0, typeof b.deserializeSelf == "function" ? (t._units = Object.create(null), o._customDeserialization(b, t)) : o._deserializeProperties(b, t.properties, !1)), a += "this._deserializeUnits(" + e + ", " + e + "Serialization);\n"
                    }
                    function s(u, a, f) {
                        var l = typeof u;
                        if (l === "object") if (u instanceof Array) l = "array";
                        else {
                            if (u === null) return "null";
                            "#" in u ? (l = "elementByMontageId", u = u["#"]) : "/" in u ? (l = "regexp", u = u["/"]) : "@" in u ? (l = "reference", u = u["@"]) : "->" in u ? (l = "function", u = u["->"]) : "." in u && Object.keys(u).length === 1 && console.log("Warning: It's not possible to reference elements by class name anymore: '" + JSON.stringify(u) + "' in template " + o._origin + ".")
                        }
                        switch (l) {
                            case "string":
                            case "number":
                            case "boolean":
                                return JSON.stringify(u);
                            case "object":
                                var c = [];
                                for (var f in u) c.push('"' + f + '": ' + s(u[f], u, f));
                                return "{" + c.join(",\n") + "}";
                            case "array":
                                var c = [];
                                for (var h = 0, p = u.length; h < p; h++) c.push(s(u[h], u, h));
                                return "[" + c.join(",\n") + "]";
                            case "elementByMontageId":
                                var v = o._optimizedIds[u],
                                    m;
                                return v ? (m = e.getElementById(v), d.push(v)) : (m = e.querySelector("*[" + Deserializer._MONTAGE_ID_ATTRIBUTE + '="' + u + '"]'), m || (m = e.getElementById(u), v = u)), m || console.log("Warning: Element " + Deserializer._MONTAGE_ID_ATTRIBUTE + "='" + u + "' not found in template " + o._origin), r && (a[f] = m), v ? 'element.getElementById("' + v + '")' : "element.querySelector('*[" + Deserializer._MONTAGE_ID_ATTRIBUTE + '="' + u + "\"]')";
                            case "regexp":
                                return r && (a[f] = new RegExp(u.source, u.flags)), "/" + u.source + "/" + u.flags;
                            case "reference":
                                var g, y = u;
                                return u in n ? g = n[u] : u in t ? Object.keys(t[u]).length > 0 ? (i(u, t[u]), g = n[u]) : (g = o._objectLabels[u], u = "this._objectLabels." + u) : logger.error("Error: Label '" + u + "' not found in serialization at " + o._origin), a && (a[f] = g), typeof g == "undefined" && logger.error("Missing object in serialization: '" + y + "'" + (o._origin ? " in " + o._origin : "")), u;
                            case "function":
                                var b = "function" + (u.name ? " " + u.name : "") + "(" + u.arguments.join(", ") + ") {\n" + u.body + "\n}";
                                return r && (a[f] = globalEval("(" + b + ")")), b
                        }
                    }
                    var o = this,
                        u = "",
                        a = "",
                        f = "",
                        l = "",
                        c, h = Object.create(null),
                        p = this._modules,
                        d = [],
                        v = this._optimizedIds,
                        m, g = [],
                        y = Object.create(null),
                        b, w = this._labelRegexp,
                        E;
                    canEval ? t = this._serialization : t = JSON.parse(this._serializationString);
                    for (b in t) {
                        if (!w.test(b)) throw logger.error("Invalid label format '" + b + "' " + (this._origin ? " in " + this._origin : "")), "Invalid label format: " + b;
                        var S = t[b];
                        if (b in h) continue;
                        "value" in S ? (c = s(S.value, S, "value"), u += "var " + b + " = exports." + b + " = " + c + ";\n", r && (n[b] = S.value, h[b] = !0), delete t[b]) : i(b, S)
                    }
                    if (r) {
                        for (b in t) o._deserializeUnits(n[b], t[b]);
                        for (b in n) E = n[b], E && delete E.isDeserializing
                    }
                    if (d.length > 0) {
                        l += 'element.getElementById("' + d.join('").removeAttribute("id");\nelement.getElementById("') + '").removeAttribute("id");';
                        for (var x = 0, T; T = d[x]; x++) e.getElementById(d[x]).removeAttribute("id")
                    }
                    return canEval && (m = "(function() {\n" + g.join("\n") + "\nreturn function(element, exports) {\n" + u + "\n\n" + f + "\n\n" + a + "\n\n" + l + "\nreturn exports;\n}}).call(this)"), logger.isDebug && logger.debug(m), m
                }
            },
            _reportParseError: {
                value: function(e, t) {
                    require.async("core/jshint").then(function(n) {
                        var r = n.JSHINT;
                        if (!r(e)) {
                            var i = r.errors[0],
                                s = e.split("\n"),
                                o = "   ",
                                u = (o + s.length).length,
                                a = i.line - 1;
                            for (var f = 0, l = s.length; f < l; f++) s[f] = (new Array(u - (f + 1 + "").length + 1)).join(f === a ? ">" : " ") + (f + 1) + " " + s[f];
                            logger.error("Syntax error at line " + i.line + (t ? " from " + t : "") + ":\n" + i.evidence + "\n" + i.reason + "\n" + s.join("\n"))
                        } else logger.error("Syntax error in the serialization but not able to find it!\n" + e)
                    }).done()
                }
            },
            _deserialize: {
                value: function(sourceDocument, targetDocument) {
                    var exports = this._objects = Object.create(null),
                        chainedSerializations = this._chainedSerializations;
                    this._compiledDeserializationFunction ? this._compiledDeserializationFunction(sourceDocument, exports) : this._compiledDeserializationFunctionString ? (this._compiledDeserializationFunction = eval(this._compiledDeserializationFunctionString), this._compiledDeserializationFunction(sourceDocument, exports)) : (this._compiledDeserializationFunctionString = this._compileAndDeserialize(sourceDocument, this._serialization, exports, !0), this._serialization = null);
                    if (chainedSerializations) for (var i = 0, serialization; serialization = chainedSerializations[i]; i++) serialization.compiledFunction ? serialization.compiledFunction.call(this, sourceDocument, exports) : serialization.compiledFunctionString ? (serialization.compiledFunction = eval(serialization.compiledFunctionString), serialization.compiledFunction.call(this, sourceDocument, exports)) : (serialization.compiledFunctionString = this._compileAndDeserialize(sourceDocument, serialization.object, exports, !0), serialization.object = null);
                    return targetDocument && targetDocument.adoptNode(sourceDocument.body.firstChild), exports
                }
            },
            deserializeObject: {
                value: function(e) {
                    return this.deserializeWithInstancesAndDocument(null, null, function(t) {
                        e(t ? t.root : undefined)
                    })
                }
            },
            deserializeObjectWithElement: {
                value: function(e, t) {
                    return this.deserializeWithInstancesAndElementForDocument(null, e, null, function(e, n) {
                        t(e ? e.root : undefined, n)
                    })
                }
            },
            deserialize: {
                value: function(e) {
                    return this.deserializeWithInstancesAndDocument(null, null, e)
                }
            },
            deserializeWithInstances: {
                value: function(e, t) {
                    return this.deserializeWithInstancesAndDocument(e, null, t)
                }
            },
            deserializeWithInstancesAndElementForDocument: {
                value: function(e, t, n, r) {
                    var i = this;
                    this._prepareForDeserialization(function() {
                        var s, o = i._sharedDocument,
                            u = o.body;
                        i._objects = Object.create(null), i._objectLabels = e || Object.create(null), t && u.appendChild(o.importNode(t, !0)), s = i._deserialize(o, n), i._invokeDeserializedFromSerialization(s), r(s, u)
                    })
                }
            },
            deserializeWithInstancesAndDocument: {
                value: function(e, t, n) {
                    var r = this;
                    this._prepareForDeserialization(function() {
                        r._objects = Object.create(null), r._objectLabels = e || Object.create(null);
                        var i = r._deserialize(t);
                        r._invokeDeserializedFromSerialization(i), n(i, t)
                    })
                }
            },
            _invokeDeserializedFromSerialization: {
                value: function(e) {
                    var t = this._objectLabels,
                        n;
                    for (var r in e) {
                        if (t[r] != null) continue;
                        n = e[r], n !== null && typeof n.deserializedFromSerialization == "function" && n.deserializedFromSerialization()
                    }
                }
            },
            _deserializeProperties: {
                value: function(e, t, n) {
                    e.deserializeProperties ? (this._pushContextObject(t), e.deserializeProperties(this), this._popContextObject()) : this.deserializePropertiesForObject(e, t, n)
                }
            },
            _deserializeUnits: {
                value: function(e, t) {
                    var n = t._units || this._indexedDeserializationUnits;
                    for (var r in n) r in t && n[r](e, t[r], this)
                }
            }
        }),
            deserializer = Deserializer.create();
        exports.deserialize = deserialize
    }
}), montageDefine("06501b6", "core/event/binding", {
    dependencies: ["montage", "core/change-notification", "core/serializer", "core/deserializer", "core/logger", "core/event/event-manager"],
    factory: function(e, t, n) {
        var r = e("montage").Montage,
            i = e("core/change-notification").ChangeNotification,
            s = e("core/serializer").Serializer,
            o = e("core/deserializer").Deserializer,
            u = e("core/logger").logger("binding"),
            a = e("core/event/event-manager").defaultEventManager,
            f = 2,
            l = "_",
            c = t.ChangeEventDispatchingArray = [],
            h = t.PropertyChangeBindingListener = Object.create(r, {
                useCapture: {
                    value: !1,
                    writable: !0
                },
                target: {
                    value: null,
                    writable: !0
                },
                originalListener: {
                    value: null,
                    writable: !0
                },
                originalListenerIsFunction: {
                    value: !1,
                    writable: !0
                },
                targetPropertyPath: {
                    value: null,
                    writable: !0
                },
                bindingOriginValueDeferred: {
                    value: !1,
                    writable: !0
                },
                deferredValue: {
                    value: null,
                    writable: !0
                },
                deferredValueTarget: {
                    value: null,
                    writable: !0
                },
                previousTargetPropertyPathValue: {
                    value: null,
                    writable: !0
                },
                targetPropertyPathCurrentIndex: {
                    value: 0,
                    writable: !0
                },
                currentIndexListenee: {
                    value: null,
                    writable: !0
                },
                bindingOriginCurrentIndexListenee: {
                    value: null,
                    writable: !0
                },
                currentPropertyComponent: {
                    value: null,
                    writable: !0
                },
                bindingOrigin: {
                    value: null,
                    writable: !0
                },
                bindingPropertyPath: {
                    value: null,
                    writable: !0
                },
                bindingPropertyPathCurrentIndex: {
                    value: 0,
                    writable: !0
                },
                bindingDescriptor: {
                    value: null,
                    writable: !0
                },
                applyBindingOriginDeferredValue: {
                    value: function() {
                        this.bindingOrigin.setProperty(this.bindingPropertyPath, this.deferredValue)
                    }
                },
                applyTargetDeferredValue: {
                    value: function() {
                        this.target.setProperty(this.targetPropertyPath, this.deferredValue)
                    }
                },
                applyDeferredValues: {
                    value: function() {
                        this.deferredValueTarget === "bound" ? this.applyBindingOriginDeferredValue() : this.deferredValueTarget === "target" && this.applyTargetDeferredValue(), this.deferredValueTarget = ""
                    }
                },
                handleChange: {
                    value: function(e) {
                        var t, n = this.bindingOrigin,
                            r = this.bindingPropertyPath,
                            i = n.getProperty(r),
                            s = this.target,
                            o = this.targetPropertyPath,
                            u;
                        s !== n ? t = e.currentTarget === n : t = e.currentPropertyPath === r;
                        if (t) {
                            if (n.setProperty.changeEvent) return;
                            this.bindingDescriptor.converter && (i = this.bindingDescriptor.converter.revert(i)), this.bindingOriginValueDeferred === !0 || n._bindingsDisabled ? (this.deferredValue = i, this.deferredValueTarget = "target") : (this.bindingOriginChangeTriggered = !0, s.setProperty(o, i), this.bindingOriginChangeTriggered = !1)
                        } else this.bindingOriginChangeTriggered || (u = s.getProperty(o), this.bindingDescriptor.boundValueMutator ? u = this.bindingDescriptor.boundValueMutator(u) : this.bindingDescriptor.converter && (u = this.bindingDescriptor.converter.convert(u)), u !== i && (this.bindingOriginValueDeferred === !0 || n._bindingsDisabled ? (this.deferredValue = u, this.deferredValueTarget = "bound") : (n.setProperty.changeEvent = e, n.setProperty(r, u), n.setProperty.changeEvent = null)), this.previousTargetPropertyPathValue = u)
                    }
                }
            });
        Object.defineProperty(Object.prototype, "propertyChangeBindingListener", {
            value: function(e, t, n, r, i, s, o) {
                var u, a = h.create();
                return a.useCapture = n, a.target = this, a.originalListener = t, a.originalListenerIsFunction = typeof t == "function", a.targetPropertyPath = u = e, a.previousTargetPropertyPathValue = this.getProperty(u), a.targetPropertyPathCurrentIndex = 0, i && (a.bindingOrigin = i, a.bindingPropertyPath = s, a.bindingDescriptor = o, a.bindingOriginValueDeferred = o.deferred ? !0 : !1), a
            },
            writable: !0
        });
        var p = t.BindingDescriptor = r.create(r, {
            boundObject: {
                enumerable: !1,
                value: null
            },
            boundObjectPropertyPath: {
                enumerable: !1,
                value: null
            },
            oneway: {
                enumerable: !1,
                value: null
            },
            deferred: {
                enumerable: !1,
                value: null
            },
            serializeSelf: {
                value: function(e) {
                    var t = {};
                    return e.addObjectReference(this.boundObject), t[this.oneway ? "<-" : "<->"] = "@" + e.getObjectLabel(this.boundObject) + "." + this.boundObjectPropertyPath, t.deferred = this.deferred, t.converter = this.converter, t
                }
            }
        });
        s.defineSerializationUnit("bindings", function(e) {
            var t = e._bindingDescriptors;
            if (t) {
                var n = !1,
                    r = {};
                for (var i in t) {
                    var s = t[i];
                    if (!("serializable" in s) || s.serializable) n = !0, r[i] = s
                }
                if (n) return r
            }
        });
        var d = t.deserializeBindingToBindingDescriptor = function(e, t) {
            var n;
            if (!("boundObject" in e)) {
                var r = e["<-"] || e["<->"] || e["<<->"];
                "<<->" in e && console.warn("WARNING: <<-> in bindings is deprectated, use <-> only, please update now.");
                if (!r) throw u.error("Invalid binding syntax '" + JSON.stringify(e) + "'."), "Invalid binding syntax '" + JSON.stringify(e) + "'";
                if (r[0] !== "@") throw u.error("Invalid binding syntax '" + r + "', should be in the form of '@label.path'."), "Invalid binding syntax '" + r + "'";
                n = r.indexOf("."), e.boundObject = t.getObjectByLabel(r.slice(1, n)), e.boundObjectPropertyPath = r.slice(n + 1), "<-" in e && (e.oneway = !0)
            }
        };
        o.defineDeserializationUnit("bindings", function(e, t, n) {
            for (var r in t) {
                var i = t[r],
                    s;
                d(i, n), Object.defineBinding(e, r, i)
            }
        });
        var v = t.Stats = {
            count: 0
        };
        Object.defineProperty(Object, "defineBinding", {
            value: function(e, t, n) {
                var i = e._bindingDescriptors,
                    s = typeof n.oneway == "undefined" ? !1 : n.oneway,
                    o = n.boundObject,
                    u = n.boundObjectPropertyPath,
                    a, f, l;
                if (!o || !u) return;
                v.count++, i || r.defineProperty(e, "_bindingDescriptors", {
                    enumerable: !1,
                    value: i = Object.create(Object.prototype)
                });
                if ((n.__proto__ || Object.getPrototypeOf(n)) !== p) if ("__proto__" in n) n.__proto__ = p;
                else {
                    var c = n;
                    n = Object.create(p);
                    for (var h in c) n[h] = c[h]
                }
                f = i[t];
                if (!f) {
                    i[t] = n, l = o.propertyChangeBindingListener(u, null, !0, null, e, t, n);
                    if (!l) return;
                    return o = n.boundObject, u = l.targetPropertyPath, s = typeof n.oneway == "undefined" ? !1 : n.oneway, n.boundObjectPropertyPath = u, n.bindingListener = l, l.listener = l, o.addPropertyChangeListener(u, l, !1), s || e.addPropertyChangeListener(t, l, !1), a = o.getProperty(u), n.boundValueMutator ? a = n.boundValueMutator(a) : n.converter && (a = n.converter.convert(a)), l.bindingOriginValueDeferred === !0 || e._bindingsDisabled ? (l.deferredValue = a, l.deferredValueTarget = "bound") : e.setProperty(t, a), l
                }
                if (o !== f.boundObject || n.boundObjectPropertyPath !== f.boundObjectPropertyPath) throw "sourceObject property, " + t + ", is already the source of a binding"
            }
        }), r.defineProperty(Object.prototype, "_bindingDescriptors", {
            enumerable: !1,
            value: null,
            writable: !0
        }), Object.defineProperty(Object.prototype, "_deserializeProperty_bindingDescriptors", {
            enumerable: !1,
            value: function(e, t) {
                this._bindingDescriptorsToInstall = e
            }
        }), Object.defineProperty(Object, "deleteBinding", {
            value: function(e, t) {
                var n = e._bindingDescriptors,
                    r, i;
                t in n && (v.count--, r = n[t], i = typeof r.oneway == "undefined" ? !0 : r.oneway, r.boundObject.removePropertyChangeListener(r.boundObjectPropertyPath, r.bindingListener, !1), i || e.removePropertyChangeListener(t, r.bindingListener, !1), delete n[t])
            }
        }), Object.defineProperty(Object, "deleteBindings", {
            value: function(e) {
                var t = e._bindingDescriptors;
                if (t) for (var n in t) t.hasOwnProperty(n) && Object.deleteBinding(e, n)
            }
        }), Object.defineProperty(Object, "applyBindingsDeferredValues", {
            value: function(e, t) {
                var n = e._bindingDescriptors,
                    r;
                if (n) for (var i in n) n.hasOwnProperty(i) && (r = n[i].bindingListener, r && (!t || !r.bindingOriginValueDeferred) && r.applyDeferredValues())
            }
        }), r.defineProperty(Object.prototype, "_bindingsDisabled", {
            enumerable: !1,
            value: null
        }), Object.defineProperty(Object, "disableBindings", {
            value: function(e) {
                e._bindingsDisabled = !0
            }
        }), Object.defineProperty(Object, "enableBindings", {
            value: function(e) {
                e._bindingsDisabled = !1, Object.applyBindingsDeferredValues(e, !0)
            }
        })
    }
}), montageDefine("06501b6", "core/logger", {
    dependencies: ["montage"],
    factory: function(e, t, n) {
        var r = e("montage").Montage,
            i, s, o, u, a, f, l, c, h;
        s = t.loggers = {}, f = function(e) {
            var t = f.caller.caller,
                n;
            return n = t.name, n === "" && (n = "anonymous"), n
        }, l = function(e) {
            if (e.getHours) {
                var t = e.getHours(),
                    n = e.getMinutes(),
                    r = e.getSeconds();
                return (t.length === 1 ? "0" + t : t) + ":" + (n.length === 1 ? "0" + n : n) + ":" + (r.length === 1 ? "0" + r : r) + "." + e.getMilliseconds()
            }
        }, a = function() {}, o = function() {
            console.log(arguments)
        }, u = function() {
            var e = arguments[0],
                t = e._montage_metadata,
                n = new Date;
            t ? ([].shift.call(arguments), [].unshift.call(arguments, t.objectName + "." + f(e) + "()"), this.buffered ? this.buffer.push(arguments) : console.debug.apply(console, arguments)) : this.buffered ? this.buffer.push(arguments) : console.debug.apply(console, arguments)
        }, i = t.Logger = r.create(r, {
            init: {
                value: function(e, t) {
                    this.name = e, this._storeState = !t;
                    if (this._storeState && h) {
                        var n = h.getItem("_montage_logger_" + e);
                        n && (this.isDebug = n === "true")
                    }
                    return this.isError = !0, this
                }
            },
            name: {
                value: null
            },
            buffer: {
                value: [],
                distinct: !0
            },
            buffered: {
                value: !1
            },
            flush: {
                value: function() {
                    var e = this.buffer,
                        t, n;
                    for (n = 0; t = e[n]; n++) console.debug.apply(console, t);
                    this.buffer.length = 0
                }
            },
            isDebug: {
                get: function() {
                    return this.debug !== a
                },
                set: function(e) {
                    e ? this.debug = u : this.debug = a
                }
            },
            isError: {
                get: function() {
                    return this.error !== a
                },
                set: function(e) {
                    e ? this.error = u : this.error = a
                }
            },
            debug: {
                value: a
            },
            error: {
                value: a
            },
            toTimeString: {
                value: l
            },
            _storeState: {
                value: null
            }
        }), t.logger = function(e, t) {
            var n;
            return (n = s[e]) == null && (n = r.create(i).init(e, t), r.defineProperty(s, e, {
                value: n
            })), n
        }, c = r.create(r, {
            init: {
                value: function() {
                    return document.nativeAddEventListener ? (document.nativeAddEventListener("keyup", this, !1), document.nativeAddEventListener("keydown", this, !1)) : (document.addEventListener("keyup", this, !1), document.addEventListener("keydown", this, !1)), this
                }
            },
            inspectorElement: {
                value: null
            },
            m_dontRemove: {
                value: null
            },
            titleHeader: {
                value: null
            },
            shown: {
                value: !1
            },
            isCtrl: {
                value: !1
            },
            isAlt: {
                value: !1
            },
            keyup: {
                value: function(e) {
                    e.which == 17 && (this.isCtrl = !1), e.which == 18 && (this.isAlt = !1)
                }
            },
            keydown: {
                value: function(e) {
                    e.which == 17 && (this.isCtrl = !0), e.which == 18 && (this.isAlt = !0);
                    if (e.which == 76 && this.isCtrl === !0 && this.isAlt === !0) return this.shown ? this.hideInspector() : this.showInspector(), !1
                }
            },
            change: {
                value: function(e) {
                    var t = e.target.checked,
                        n = e.target.value,
                        r = s[n];
                    r.isDebug = t, r._storeState && h && h.setItem("_montage_logger_" + n, t)
                }
            },
            mouseup: {
                value: function(e) {
                    this.hideInspector()
                }
            },
            showInspector: {
                value: function() {
                    if (!this.inspectorElement) {
                        var e = 0,
                            t, n, r, i, o, u, a, f, l, c, p;
                        this.m_dontRemove = document.getElementsByTagName("body")[0], this.inspectorElement = document.createElement("div"), this.inspectorElement.id = "_montage_logger_inspector", n = document.createElement("div"), this.inspectorElement.appendChild(n), i = document.createElement("div"), n.appendChild(i), r = document.createElement("h1"), r.className = "_montage_logger_inspector-title", r.textContent = "Logger Inspector", this.titleHeader = r, i.appendChild(r), l = Object.keys(s);
                        for (e = 0; t = s[l[e]]; e++) o = document.createElement("label"), u = document.createElement("input"), p = document.createElement("span"), o.className = "_montage_logger_inspector-content", p.textContent = t.name, o.appendChild(u), o.appendChild(p), u.value = t.name, u.type = "checkbox", u.checked = !! t.isDebug, f = "_montage_logger_" + t.name, t._storeState && h && (a = h.getItem(f), a == null && h.setItem(f, t.isDebug)), i.appendChild(o);
                        c = document.createElement("style");
                        var d = "#_montage_logger_inspector {";
                        d += "    border: 1px solid rgba(15,15,15,0.4);", d += "    position: fixed;", d += "    right: 25px;", d += "    top: 25px;", d += "    -webkit-border-radius: 5px;", d += "    color: #dddddd;", d += '    font: 10px "Lucida Grande","Lucida Sans", sans;', d += "    background:-webkit-gradient(linear, left top, left bottom, from(rgba(15,15,15,0.75)), to(rgba(15,15,15,0.95)) );", d += "    -webkit-box-shadow: 0 0 15px rgba(0,0,0,.3);", d += "    width: 250px;", d += "}", d += "#_montage_logger_inspector div {", d += "    -webkit-border-radius: 5px;", d += "    background: -webkit-gradient(radial, 100 -60, 0, 125 -50, 125, from(rgba(255,255,255,0.00)), to(rgba(0,0,0,.2)), color-stop(1, rgba(0,0,0,.2)));", d += "}", d += "#_montage_logger_inspector div div {", d += "    background: -webkit-gradient(linear, left top, left bottom, from(rgba(255,255,255,0.2)), to(rgba(0,0,0,.1)), color-stop(0.33, rgba(255,255,255,.01)), color-stop(0.33, rgba(50,50,50,1)) );", d += "    padding: 7px 10px;", d += "    -webkit-border-radius: 3px;", d += "    overflow-x: hidden;", d += "}", d += "._montage_logger_inspector-title {", d += "    color: rgba(255,255,255,0.9);", d += "    font-size: 13px;", d += "    margin: 0 0 11px 0;", d += "    padding: 0 0 0 5px;", d += "}", d += "._montage_logger_inspector-content {", d += "    padding: 0 0 0 20px;", d += "    margin: 0;", d += "    display: block;", d += "}", c.textContent = d, document.head.appendChild(c)
                    }
                    this.shown = !0, this.m_dontRemove.appendChild(this.inspectorElement), this.titleHeader.nativeAddEventListener("mouseup", this, !1), this.inspectorElement.nativeAddEventListener("change", this, !1)
                }
            },
            hideInspector: {
                value: function() {
                    document.getElementById("_montage_logger_inspector") && (this.shown = !1, this.m_dontRemove.removeChild(this.inspectorElement), this.titleHeader.nativeRemoveEventListener("mouseup", this, !1), this.inspectorElement.nativeRemoveEventListener("change", this, !1))
                }
            },
            handleEvent: {
                enumerable: !1,
                value: function(e) {
                    this[e.type] && this[e.type](e)
                }
            }
        });
        var p = function() {
            c.create().init()
        };
        typeof window != "undefined" && (h = window.localStorage, window.loggers = s, window.localStorage && p())
    }
}), montageDefine("06501b6", "core/uuid", {
    dependencies: [],
    factory: function(e, t, n) {
        function r(e) {
            var t = i,
                n = s,
                r;
            return n[0] = t[(r = Math.random() * 4294967296) & 15], n[1] = t[(r >>>= 4) & 15], n[2] = t[(r >>>= 4) & 15], n[3] = t[(r >>>= 4) & 15], n[4] = t[(r >>>= 4) & 15], n[5] = t[(r >>>= 4) & 15], n[6] = t[(r >>>= 4) & 15], n[7] = t[(r >>>= 4) & 15], n[9] = t[(r = Math.random() * 4294967296) & 15], n[10] = t[(r >>>= 4) & 15], n[11] = t[(r >>>= 4) & 15], n[12] = t[(r >>>= 4) & 15], n[15] = t[(r >>>= 4) & 15], n[16] = t[(r >>>= 4) & 15], n[17] = t[(r >>>= 4) & 15], n[19] = t[(r = Math.random() * 4294967296) & 3 | 8], n[20] = t[(r >>>= 4) & 15], n[21] = t[(r >>>= 4) & 15], n[22] = t[(r >>>= 4) & 15], n[24] = t[(r >>>= 4) & 15], n[25] = t[(r >>>= 4) & 15], n[26] = t[(r >>>= 4) & 15], n[27] = t[(r >>>= 4) & 15], n[28] = t[(r = Math.random() * 4294967296) & 15], n[29] = t[(r >>>= 4) & 15], n[30] = t[(r >>>= 4) & 15], n[31] = t[(r >>>= 4) & 15], n[32] = t[(r >>>= 4) & 15], n[33] = t[(r >>>= 4) & 15], n[34] = t[(r >>>= 4) & 15], n[35] = t[(r >>>= 4) & 15], n.join("")
        }
        var i = "0123456789ABCDEF".split(""),
            s = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".split(""),
            o = t.Uuid = Object.create(Object.prototype, {
                generate: {
                    enumerable: !1,
                    value: r
                }
            });
        t.generate = r
    }
}), montageDefine("06501b6", "core/event/mutable-event", {
    dependencies: ["montage"],
    factory: function(e, t, n) {
        var r = e("montage").Montage;
        if (typeof window != "undefined") var i = {}, s = {
            value: null
        }, o = function(e, t) {
            var n = "_" + t;
            r.defineProperty(e, n, {
                value: undefined
            }), r.defineProperty(e, t, {
                get: function(e, t) {
                    return function() {
                        return this.hasOwnProperty(t) ? this[t] : this._event ? this._event[e] : undefined
                    }
                }(t, n),
                set: function(e) {
                    return function(t) {
                        this[e] = t
                    }
                }(n)
            })
        }, u = t.MutableEvent = r.create(r, {
            fromEvent: {
                value: function(e) {
                    var t = e.type,
                        n = i[t],
                        r;
                    return n || (n = function() {}, n.prototype = u.create()._initPrototypeWithEvent(e), i[t] = n), r = new n, r._initWithEvent(e), r
                }
            },
            fromType: {
                value: function(e, t, n, r) {
                    var i = document.createEvent("CustomEvent");
                    return i.initCustomEvent(e, t, n, r), this.fromEvent(i)
                }
            },
            _initPrototypeWithEvent: {
                value: function(e) {
                    var t;
                    for (t in e) {
                        if (this[t]) continue;
                        o(this, t)
                    }
                    return o(this, "replayed"), this
                }
            },
            _initWithEvent: {
                value: function(e) {
                    return this._event = e, this
                }
            },
            preventDefault: {
                value: function() {
                    this._event.preventDefault()
                }
            },
            stopImmediatePropagation: {
                value: function() {
                    this._event.stopImmediatePropagation(), this.propagationStopped = !0, this.immediatePropagationStopped = !0
                }
            },
            propagationStopped: {
                value: !1
            },
            immediatePropagationStopped: {
                value: !1
            },
            mutable: {
                value: !0
            },
            target: {
                value: null
            },
            stopPropagation: {
                value: function() {
                    this._event.stopPropagation(), this.propagationStopped = !0
                }
            },
            stop: {
                value: function() {
                    this.preventDefault(), this.stopPropagation()
                }
            }
        })
    }
}), montageDefine("06501b6", "core/serializer", {
    dependencies: ["montage", "core/uuid", "core/deserializer", "core/logger"],
    factory: function(e, t, n) {
        function r(e, t) {
            return f.create().initWithRequire(t).serializeObject(e)
        }
        var i = e("montage").Montage,
            s = e("core/uuid").Uuid,
            o = e("core/deserializer").Deserializer,
            u = e("core/logger").logger("serializer"),
            a;
        typeof window != "undefined" && (a = window.Element);
        var f = i.create(i, {
            _INITIAL_LABEL_SEQUENCE_NUMBER: {
                value: 2
            },
            _MONTAGE_ID_ATTRIBUTE: {
                value: "data-montage-id"
            },
            _serializedObjects: {
                value: Object.create(null)
            },
            _serializedReferences: {
                value: Object.create(null)
            },
            _externalObjects: {
                value: null
            },
            _externalElements: {
                value: null
            },
            _objectStack: {
                value: null
            },
            _objectReferences: {
                value: null
            },
            _objectNamesIndex: {
                value: null
            },
            _objectLabels: {
                value: null
            },
            _serializationUnits: {
                value: []
            },
            _serializationUnitsIndex: {
                value: Object.create(null)
            },
            serializeNullValues: {
                value: !1
            },
            delegate: {
                value: null
            },
            defineSerializationUnit: {
                value: function(e, t) {
                    this._serializationUnits.push(this._serializationUnitsIndex[e] = {
                        name: e,
                        funktion: t
                    })
                }
            },
            initWithRequire: {
                value: function(e) {
                    return this._require = e, this
                }
            },
            serializeObject: {
                value: function(e) {
                    return this.serialize({
                        root: e
                    })
                }
            },
            serialize: {
                value: function(t) {
                    var n, r, i, s = this.serializeNullValues;
                    this._serializedObjects = Object.create(null), this._serializedReferences = Object.create(null), this._externalObjects = Object.create(null), this._externalElements = [], this._objectNamesIndex = Object.create(null), this._objectLabels = Object.create(null), this._objectReferences = Object.create(null);
                    for (i in t) t[i] != null && (this._objectLabels[t[i].uuid] = i), this._objectNamesIndex[i] = this._INITIAL_LABEL_SEQUENCE_NUMBER;
                    for (i in t) if (t[i] != null || s) r = this._serializeValue(t[i], null, 2), i in this._serializedObjects || (this._serializedObjects[i] = {
                        value: r
                    });
                    return this._cleanupExternalObjects(), n = this._getSerialization(this._serializedObjects, this._externalObjects), this._require = e, this._serialization = n, n
                }
            },
            set: {
                value: function(e, t, n) {
                    var r = this._objectStack,
                        i = r[r.length - 1],
                        s, o;
                    i[e] = t, n === "reference" && (o = i.uuid, s = this._objectReferences, o in s || (s[o] = Object.create(null)), s[o][e] = !0)
                }
            },
            setAll: {
                value: function(e) {
                    var t = this._objectStack.length - 2,
                        n = this._objectStack[t];
                    e || (e = i.getSerializablePropertyNames(n));
                    for (var r = 0, s = e.length; r < s; r++) {
                        var o = e[r];
                        this.set(o, n[o], i.getPropertyAttribute(n, o, "serializable"))
                    }
                }
            },
            setProperty: {
                value: function(e, t, n) {
                    var r = this._objectStack,
                        i = r[r.length - 1],
                        s, o;
                    i.properties[e] = t, n === "reference" && (s = this._objectReferences, o = i.properties.uuid, o in s || (s[o] = Object.create(null)), s[o][e] = !0)
                }
            },
            setProperties: {
                value: function(e) {
                    var t = this._objectStack.length - 2,
                        n = this._objectStack[t];
                    e || (e = i.getSerializablePropertyNames(n));
                    for (var r = 0, s = e.length; r < s; r++) {
                        var o = e[r];
                        this.setProperty(o, n[o], i.getPropertyAttribute(n, o, "serializable"))
                    }
                }
            },
            setType: {
                value: function(e, t) {
                    if (e === "object" || e === "prototype" || e === "value") {
                        var n = this._objectStack,
                            r = n[n.length - 1];
                        delete r.prototype, delete r.object, delete r.value, r[e] = t
                    }
                }
            },
            setUnit: {
                value: function(e) {
                    var t = this._objectStack,
                        n = t[t.length - 1];
                    n._units.indexOf(e) === -1 && n._units.push(this._serializationUnitsIndex[e])
                }
            },
            setAllUnits: {
                value: function() {
                    var e = this._objectStack,
                        t = e[e.length - 1];
                    t._units.length = 0, t._units.push.apply(t._units, this._serializationUnits)
                }
            },
            addObject: {
                value: function(e) {
                    var t = this._serializeValue(e, null, 2),
                        n = this._getObjectLabel(e);
                    n in this._serializedObjects || (this._serializedObjects[n] = {
                        value: t
                    })
                }
            },
            addObjectReference: {
                value: function(e) {
                    var t = this._getObjectLabel(e);
                    return this._serializedObjects[t] || (this._externalObjects[t] = e), {
                        "@": t
                    }
                }
            },
            getObjectLabel: {
                value: function(e) {
                    return this._getObjectLabel(e)
                }
            },
            _pushContextObject: {
                value: function(e) {
                    this._objectStack === null ? this._objectStack = [e] : this._objectStack.push(e)
                }
            },
            _popContextObject: {
                value: function() {
                    return this._objectStack.pop()
                }
            },
            _peekContextObject: {
                value: function() {
                    return this._objectStack[this._objectStack.length - 1]
                }
            },
            getExternalObjects: {
                value: function() {
                    return this._externalObjects
                }
            },
            _cleanupExternalObjects: {
                value: function() {
                    var e = this._externalObjects,
                        t = this._serializedObjects;
                    for (var n in e) {
                        var r = e[n];
                        t[n] && delete e[n]
                    }
                }
            },
            getExternalElements: {
                value: function() {
                    return this._externalElements
                }
            },
            _getSerialization: {
                value: function(e, t) {
                    var n = [],
                        r, i = "",
                        s;
                    for (var o in e) {
                        s = e[o], r = [], "prototype" in s ? (r.push('"prototype":' + s.prototype), delete s.prototype) : "object" in s && (r.push('"object":' + s.object), delete s.object);
                        for (var u in s) r.push('"' + u + '":' + s[u]);
                        n.push('"' + o + '":{\n    ' + r.join(",\n    ") + "}")
                    }
                    for (var o in t) n.push('"' + o + '":{}');
                    return n.length > 0 && (i = "{\n  " + n.join(",\n\n  ") + "\n}"), i
                }
            },
            _getObjectLabel: {
                value: function(e) {
                    var t = e.uuid,
                        n = this._objectLabels[t];
                    return n || (this._objectLabels[t] = n = this._generateLabelForObject(e)), n
                }
            },
            _labelRegexp: {
                enumerable: !1,
                value: /^[a-zA-Z_$][0-9a-zA-Z_$]*$/
            },
            _generateLabelForObject: {
                value: function(e) {
                    var t = (this._labelRegexp.test(e.identifier) ? e.identifier : null) || i.getInfoForObject(e).objectName.toLowerCase(),
                        n = this._objectNamesIndex[t];
                    return n ? (this._objectNamesIndex[t] = n + 1, t + n) : (this._objectNamesIndex[t] = this._INITIAL_LABEL_SEQUENCE_NUMBER, t)
                }
            },
            _applySerializationUnits: {
                value: function(e, t, n) {
                    var r;
                    n || (n = this._serializationUnits);
                    for (var i = 0, s; s = n[i]; i++) r = s.funktion(t, this), typeof r != "undefined" && (e[s.name] = this._serializeValue(r, null, 2))
                }
            },
            _isValueType: {
                value: function(e) {
                    return !("getInfoForObject" in e)
                }
            },
            _applyTypeUnit: {
                value: function(e, t) {
                    if (this._isValueType(t)) e.value = this._serializeValue(t);
                    else {
                        var n = i.getInfoForObject(t),
                            r = this._require.identify(n.moduleId, n.require),
                            s = n.objectName;
                        this._findObjectNameRegExp.test(r);
                        var o = RegExp.$1.replace(this._toCamelCaseRegExp, this._replaceToCamelCase);
                        o === s ? s = r : s = r + "[" + s + "]", n.isInstance ? e.prototype = this._serializeValue(s) : e.object = this._serializeValue(s)
                    }
                }
            },
            _findObjectNameRegExp: {
                value: /([^\/]+?)(\.reel)?$/
            },
            _toCamelCaseRegExp: {
                value: /(?:^|-)([^-])/g
            },
            _replaceToCamelCase: {
                value: function(e, t) {
                    return t.toUpperCase()
                }
            },
            _serializeObject: {
                value: function(e, t, n) {
                    var r = e.uuid,
                        s = this._serializedReferences[r],
                        o, u, a, f, l, c, h, p;
                    if (s) return s;
                    f = this._getObjectLabel(e), s = '{"@":"' + f + '"}';
                    if (n === "reference") this._serializedObjects[f] || (this._externalObjects[f] = e);
                    else {
                        p = this.delegate, this._serializedReferences[r] = s, o = Object.create(null), a = i.getInfoForObject(e);
                        if (!this._require) throw new Error("Cannot serialize Montage objects without a require function to identify the corresponding package.");
                        l = this._require.identify(a.moduleId, a.require), c = a.objectName, this._findObjectNameRegExp.test(l), h = RegExp.$1.replace(this._toCamelCaseRegExp, this._replaceToCamelCase), h === c ? c = l : c = l + "[" + c + "]", a.isInstance ? o.prototype = this._serializeValue(c) : o.object = this._serializeValue(c), typeof e.serializeProperties == "function" ? (this._pushContextObject(e), this._pushContextObject(Object.create(null)), e.serializeProperties(this, i.getSerializablePropertyNames(e)), p && typeof p.serializeObjectProperties == "function" && p.serializeObjectProperties(this, e, Object.keys(this._peekContextObject())), o.properties = this._serializeObjectLiteral(this._popContextObject(), null, 3), this._popContextObject()) : (t || (t = e, u = i.getSerializablePropertyNames(e)), p && typeof p.serializeObjectProperties == "function" ? (this._pushContextObject(e), this._pushContextObject(Object.create(null)), this.setAll(u), p.serializeObjectProperties(this, e, u), o.properties = this._serializeObjectLiteral(this._popContextObject(), null, 3), this._popContextObject()) : o.properties = this._serializeObjectLiteral(t, u, 3)), this._applySerializationUnits(o, e), this._serializedObjects[f] = o
                    }
                    return s
                }
            },
            _serializeValue: {
                value: function(e, t, n) {
                    var n = arguments[2] || 0,
                        r = typeof e;
                    return RegExp.isRegExp(e) ? this._serializeRegExp(e) : e != null && r === "object" || r === "function" ? typeof a != "undefined" && a.isElement(e) ? this._serializeElement(e) : Array.isArray(e) ? this._serializeArray(e, n + 1) : e.constructor === Function ? this._serializeFunction(e, n) : "getInfoForObject" in e ? typeof e.serializeSelf != "function" || e.uuid in this._serializedReferences || t === "reference" ? this._serializeObject(e, null, t) : this._customSerialization(e, n + 1) : this._serializeObjectLiteral(e, null, n + 1) : JSON.stringify(e)
                }
            },
            _customSerialization: {
                value: function(e, t) {
                    this._pushContextObject(e), this._pushContextObject({
                        properties: Object.create(null),
                        _units: []
                    });
                    var n = e.serializeSelf(this),
                        r = this._popContextObject();
                    return this._popContextObject(), typeof n == "undefined" ? this._serializeValueWithDescriptor(e, r, t) : (this._objectLabels[n.uuid] = this._objectLabels[e.uuid], this._serializeValue(n, t))
                }
            },
            _serializeElement: {
                value: function(e) {
                    var t = e.getAttribute(this._MONTAGE_ID_ATTRIBUTE),
                        n = t;
                    if (n) return this._externalElements.push(e), '{"#":"' + n + '"}';
                    u.error("Error: Not possible to serialize a DOM element with no " + this._MONTAGE_ID_ATTRIBUTE + " assigned: " + e.outerHTML)
                }
            },
            _serializeRegExp: {
                value: function(e) {
                    return this._serializeValue({
                        "/": {
                            source: e.source,
                            flags: (e.global ? "g" : "") + (e.ignoreCase ? "i" : "") + (e.multiline ? "m" : "")
                        }
                    })
                }
            },
            _serializeObjectLiteral: {
                value: function(e, t) {
                    t = t || Object.keys(e);
                    var n = arguments[2] || 0,
                        r = t.length,
                        s = [],
                        o = this._objectReferences[e.uuid],
                        u, a, f, l;
                    for (u = 0; u < r; u++) a = t[u], f = e[a], typeof f != "undefined" && (this.serializeNullValues || f !== null) && (l = i.getPropertyAttribute(e, a, "serializable") || (o && Object.hasOwnProperty.call(o, a) ? "reference" : "auto"), s.push(JSON.stringify(a) + ":" + this._serializeValue(f, l, n)));
                    var c = (new Array(n + 1)).join("  ");
                    return "{\n" + c + s.join(",\n" + c) + "}"
                }
            },
            _serializeArray: {
                value: function(e) {
                    var t = arguments[1] || 0,
                        n = [];
                    for (var r = 0, i = e.length; r < i; r++) n.push(this._serializeValue(e[r], null, t));
                    var s = (new Array(t + 1)).join("  ");
                    return "[\n" + s + n.join(",\n" + s) + "]"
                }
            },
            _serializeFunctionRegexp: {
                enumerable: !1,
                value: /^function[^(]*\(([^\)]+)\)\s*\{([\s\S]*)\}$/m
            },
            _serializeFunction: {
                value: function(e) {
                    var t = arguments[1] || 0,
                        n = (new Array(t + 1)).join("  "),
                        r = e.toString(),
                        i = this._serializeFunctionRegexp.exec(r);
                    return this._serializeValue({
                        "->": {
                            arguments: i[1].split(/\s*,\s*/),
                            body: i[2]
                        }
                    }, null, t)
                }
            },
            _serializeValueWithDescriptor: {
                value: function(e, t, n) {
                    var r, i = this.delegate;
                    "prototype" in t || "object" in t || "value" in t || this._applyTypeUnit(t, e);
                    if ("value" in t) return this._serializeValue(t.value);
                    i && typeof i.serializeObjectProperties == "function" && (this._pushContextObject(e), this._pushContextObject(t.properties), i.serializeObjectProperties(this, e, Object.keys(t.properties)), this._popContextObject(), this._popContextObject()), t.properties = this._serializeObjectLiteral(t.properties, null, 3);
                    var s;
                    if (s = t._units) delete t._units, this._applySerializationUnits(t, e, s);
                    return r = this._getObjectLabel(e), this._serializedObjects[r] = t, this._serializedReferences[e.uuid] = '{"@":"' + r + '"}'
                }
            }
        });
        typeof t != "undefined" && (t.Serializer = f, t.serialize = r)
    }
}), montageDefine("06501b6", "core/change-notification", {
    dependencies: ["montage", "core/logger"],
    factory: function(e, t, n) {
        var r = e("montage").Montage,
            i = e("core/logger").logger("change-notification"),
            s = "_",
            o = Object.create(null),
            u = Object.create(null),
            a = Object.create(null),
            f = Object.create(null),
            l = Object.create(null);
        t.__reset__ = function() {
            o = Object.create(null), u = Object.create(null), a = Object.create(null), f = Object.create(null), l = Object.create(null)
        }, t.__debug__ = function() {
            console.log("_descriptorsDirectory", o), console.log("_willChangeDescriptorsDirectory", u, a), console.log("_changeDescriptorsDirectory", f, l)
        };
        var c = t.ChangeNotification = Object.create(r, {
            _descriptorsRegistry: {
                writable: !0,
                value: Object.create(null)
            },
            _createFunctionDescriptor: {
                value: function(e, t, n, r) {
                    var i, s, o = Object.create(p);
                    typeof t == "function" ? (o.listenerFunction = t, o.listenerTarget = e) : (i = e.identifier, i && (i = i.toCapitalized(), s = "handle" + i + (n ? "WillChange" : "Change"), typeof t[s] == "function" && (o.listenerFunctionName = s, o.listenerFunction = t[s], o.listenerTarget = t)), o.listenerFunction || (s = "handle" + (n ? "WillChange" : "Change"), typeof t[s] == "function" && (o.listenerFunctionName = s, o.listenerFunction = t[s], o.listenerTarget = t)));
                    if (!o.listenerFunction) throw console.log("Could not find valid listener when installing", e, t), "Could not find valid listener when installing";
                    return o.listensToMutation = r, o
                }
            },
            registerPropertyChangeListener: {
                value: function(e, t, n, r, i) {
                    var s = e.uuid,
                        o = this._descriptorsRegistry,
                        u = o[s],
                        a;
                    return t == null && (t = "*", i = !0), u || (u = o[s] = Object.create(null), u.propertyPathCount = 0), a = u[t], a || (a = u[t] = Object.create(h).initWithTargetPath(e, t), u.propertyPathCount++), a.registerListener(n, r, i), a
                }
            },
            unregisterPropertyChangeListener: {
                value: function(e, t, n, r) {
                    var i = e.uuid,
                        s = this._descriptorsRegistry,
                        o = s[i],
                        u;
                    t == null && (t = "*"), o && (u = o[t], u && (u.unregisterListener(n, r), u.willChangeListenersCount === 0 && u.changeListenersCount === 0 && (delete o[t], --o.propertyPathCount === 0 && delete s[i])))
                }
            },
            getPropertyChangeDescriptor: {
                value: function(e, t) {
                    var n = this._descriptorsRegistry[e.uuid];
                    if (n) return t == null && (t = "*"), n[t]
                }
            },
            __debug__: {
                value: function() {
                    console.log("_descriptorsRegistry: ", this._descriptorsRegistry)
                }
            },
            __reset__: {
                value: function() {
                    this._descriptorsRegistry = Object.create(null)
                }
            }
        }),
            h = r.create(r, {
                target: {
                    value: null
                },
                propertyPath: {
                    value: null
                },
                willChangeListeners: {
                    value: null
                },
                changeListeners: {
                    value: null
                },
                willChangeListenersCount: {
                    value: 0
                },
                changeListenersCount: {
                    value: 0
                },
                isActive: {
                    value: !1
                },
                dependencies: {
                    value: null
                },
                hasWillChangeDependencies: {
                    value: !1
                },
                hasChangeDependencies: {
                    value: !1
                },
                dependentDescriptorsIndex: {
                    value: null
                },
                mutationDependencyIndex: {
                    value: null
                },
                mutationListenersCount: {
                    value: 0
                },
                observedDependentProperties: {
                    value: null
                },
                initWithTargetPath: {
                    value: function(e, t) {
                        return this.target = e, this.propertyPath = t, this
                    }
                },
                registerListener: {
                    value: function(e, t, n) {
                        var r = e.uuid,
                            i;
                        t ? (i = this.willChangeListeners, i || (i = this.willChangeListeners = Object.create(null)), r in i || (i[r] = c._createFunctionDescriptor(this.target, e, t, n), this.willChangeListenersCount++, n && this.mutationListenersCount++)) : (i = this.changeListeners, i || (i = this.changeListeners = Object.create(null)), r in i || (i[r] = c._createFunctionDescriptor(this.target, e, t, n), this.changeListenersCount++, n && this.mutationListenersCount++))
                    }
                },
                unregisterListener: {
                    value: function(e, t) {
                        var n = e.uuid,
                            r;
                        t ? (r = this.willChangeListeners, r && n in r && (r[n].listensToMutation && this.mutationListenersCount--, delete r[n], this.willChangeListenersCount--)) : (r = this.changeListeners, r && n in r && (r[n].listensToMutation && this.mutationListenersCount--, delete r[n], this.changeListenersCount--)), this.willChangeListenersCount === 0 && this.changeListenersCount === 0 && this.removeDependencies()
                    }
                },
                hasListeners: {
                    value: function() {
                        return this.willChangeListenersCount > 0 || this.changeListenersCount > 0
                    }
                },
                setupDependencies: {
                    value: function(e, t, n, r) {
                        var i = this.dependencies;
                        if (this.hasChangeDependencies) {
                            if (this.hasWillChangeDependencies || !n) return;
                            for (var s = 0, o = i.length; s < o; s += 3) i[s].addPropertyChangeListener(i[s + 1], this, !0, i[s + 2] != null)
                        } else this.addDependency(e, t, n, r);
                        this.hasChangeDependencies ? this.hasWillChangeDependencies = !0 : (n && (this.hasWillChangeDependencies = !0), this.hasChangeDependencies = !0)
                    }
                },
                addDependency: {
                    value: function(e, t, n, r) {
                        var i = this,
                            s;
                        e.getProperty(t, null, null, function(e, t, o, u, a) {
                            s = r ? a != null : !0, n && e.addPropertyChangeListener(t, i, !0, s), e.addPropertyChangeListener(t, i, !1, s), i.registerDependency(e, t, a)
                        })
                    }
                },
                removeDependencies: {
                    value: function() {
                        var e = this.dependencies,
                            t, n, r;
                        if (e) {
                            for (var i = 0, s = e.length; i < s; i += 3) t = e[i], n = e[i + 1], r = c.getPropertyChangeDescriptor(t, n), this.hasWillChangeDependencies && t.removePropertyChangeListener(n, this, !0), this.hasChangeDependencies && t.removePropertyChangeListener(n, this), r && delete r.dependentDescriptorsIndex[this.uuid];
                            e.length = 0
                        }
                    }
                },
                updateDependenciesAtIndex: {
                    value: function(e, t, n) {
                        var r = this,
                            i = this.dependencies,
                            s = i[e + 2];
                        t != null && t.getProperty(s, null, null, function(e, t, n, i, s) {
                            r.unregisterDependency(e, t, s), r.hasWillChangeDependencies && e.removePropertyChangeListener(t, r, !0), r.hasChangeDependencies && e.removePropertyChangeListener(t, r)
                        }), n != null && n.getProperty(s, null, null, function(e, t, n, i, s) {
                            r.hasWillChangeDependencies && e.addPropertyChangeListener(t, r, !0, s != null), r.hasChangeDependencies && e.addPropertyChangeListener(t, r, !1, s != null), r.registerDependency(e, t, s)
                        })
                    }
                },
                updateDependencies: {
                    value: function(e) {
                        var t = e._dependenciesIndex;
                        if (t != null) if (e.isMutation) {
                            for (var n = 0, r = e.minus.length; n < r; n++) this.updateDependenciesAtIndex(t, e.minus[n], null);
                            for (var n = 0, r = e.plus.length; n < r; n++) this.updateDependenciesAtIndex(t, null, e.plus[n])
                        } else this.updateDependenciesAtIndex(t, e.minus, e.plus);
                        else this.mutationListenersCount > 0 && !e.isMutation && this.updateMutationDependency(e.plus)
                    }
                },
                updateMutationDependency: {
                    value: function(e) {
                        var t, n;
                        if (this.mutationDependencyIndex != null) var t = this.dependencies[this.mutationDependencyIndex];
                        if (t === e) return;
                        n = this.mutationListenersCount > 0 && e != null && typeof e == "object", t && (this.unregisterDependency(t, null, null), t.removePropertyChangeListener(null, this, !0), t.removePropertyChangeListener(null, this, !1), this.mutationDependencyIndex = null), n && (this.willChangeListenersCount > 0 && e.addPropertyChangeListener(null, this, !0), this.changeListenersCount > 0 && e.addPropertyChangeListener(null, this, !1), this.mutationDependencyIndex = this.registerDependency(e, null, null))
                    }
                },
                registerDependency: {
                    value: function(e, t, n) {
                        var r = c.getPropertyChangeDescriptor(e, t),
                            i, s, o, u;
                        if (r) return i = r.dependentDescriptorsIndex, s = this.dependencies, o = this.uuid, s || (s = this.dependencies = []), u = s.push(e, t, n) - 3, i || (i = r.dependentDescriptorsIndex = Object.create(null)), o in i || (i[o] = u), u
                    }
                },
                unregisterDependency: {
                    value: function(e, t, n) {
                        var r = c.getPropertyChangeDescriptor(e, t),
                            i = this.dependencies,
                            s;
                        if (r) {
                            do {
                                s = i.indexOf(e);
                                if (i[s + 1] === t && i[s + 2] === n) {
                                    i.splice(s, 3);
                                    break
                                }
                                s = i.indexOf(e, s + 1)
                            } while (s != -1);
                            if (s == -1) throw "getProperty target (" + this.target.uuid + ":" + t + ") not found in dependencies for " + this.propertyPath;
                            delete r.dependentDescriptorsIndex[this.uuid]
                        }
                    }
                },
                handleWillChange: {
                    value: function(e) {
                        e.phase = "before", this.handleChange(e, this.willChangeListeners)
                    }
                },
                handleChange: {
                    value: function(e, t) {
                        var n, r = this.dependentDescriptorsIndex,
                            i = e._dependenciesIndex,
                            s, o = this.uuid;
                        if (e[o]) return;
                        arguments.length < 2 && (t = this.changeListeners, e.phase = "after", this.updateDependencies(e));
                        if (t) {
                            e._dependenciesIndex = null, e.currentTarget = this.target, e.currentPropertyPath = this.propertyPath, s = e.isMutation;
                            for (var u in t) {
                                n = t[u];
                                if (s && this.target._dependenciesForProperty && this.target._dependenciesForProperty[this.propertyPath] || !s || n.listensToMutation) r && (e._dependenciesIndex = r[u]), e[o] = !0, n.listenerFunction.call(n.listenerTarget, e), e[o] = !1
                            }
                            e._dependenciesIndex = i
                        }
                    }
                }
            }),
            p = Object.create(null, {
                listenerTarget: {
                    writable: !0,
                    value: null
                },
                listenerFunction: {
                    writable: !0,
                    value: null
                },
                listenerFunctionName: {
                    writable: !0,
                    value: null
                },
                listensToMutation: {
                    writable: !0,
                    value: !1
                }
            }),
            d = Object.create(null, {
                installDispatcherOnTargetProperty: {
                    value: function(e, t) {
                        var n, r, i, s;
                        n = Object.getPrototypeAndDescriptorDefiningProperty(e, t), r = n.propertyDescriptor, r ? (i = r.set, s = n.prototype, "value" in r ? this.addDispatcherToTargetProperty(e, t, r.enumerable) : i && !i.isDispatchingSetter && this.addDispatcherToTargetPropertyWithDescriptor(e, t, r)) : this.addDispatcherToTargetProperty(e, t, !0)
                    }
                },
                uninstallDispatcherOnTargetProperty: {
                    value: function(e, t) {}
                },
                dispatcherPropertyNamePrefix: {
                    value: "_"
                },
                addDispatcherToTargetProperty: {
                    value: function(e, t, n) {
                        var r = this.dispatcherPropertyNamePrefix + t;
                        m.enumerable = n, g.value = e[t], m.get = function() {
                            return this[r]
                        }, m.set = function(n) {
                            var i = c.getPropertyChangeDescriptor(e, t),
                                s, o;
                            if (!i) {
                                this[r] = n;
                                return
                            }
                            s = this[r];
                            if (s === n) return;
                            if (i.isActive && e === i.target && t === i.propertyPath) return;
                            o = Object.create(y), o.target = this, o.propertyPath = t, o.minus = s, i.isActive = !0, i.handleWillChange(o), this[r] = n, o.plus = this[r], i.handleChange(o), i.isActive = !1
                        }, m.set.isDispatchingSetter = !0, delete e[t], Object.defineProperty(e, r, g), Object.defineProperty(e, t, m)
                    }
                },
                addDispatcherToTargetPropertyWithDescriptor: {
                    value: function(e, t, n) {
                        var r = n.set;
                        m.enumerable = n.enumerable, g.value = e[t], m.get = n.get, m.set = function i(n) {
                            var s = c.getPropertyChangeDescriptor(e, t),
                                o, u;
                            if (!s) {
                                r.apply(this, arguments);
                                return
                            }
                            o = this[t];
                            if (o === n) {
                                r.apply(this, arguments);
                                return
                            }
                            if (s.isActive && e === s.target && t === s.propertyPath && i.caller !== r) return;
                            u = Object.create(y), u.target = this, u.propertyPath = t, u.minus = o, u.plus = n, s.isActive = !0, s.handleWillChange(u), r.apply(this, arguments), u.plus = this[t], s.handleChange(u), s.isActive = !1
                        }, m.set.isDispatchingSetter = !0, m.set.originalSetter = r, Object.defineProperty(e, t, m)
                    }
                },
                removeDispatcherOnTargetProperty: {
                    value: function(e, t) {}
                }
            });
        Object.defineProperty(Object.prototype, "dispatchPropertyChange", {
            value: function() {
                var e = arguments.length,
                    t = e - 1,
                    n, r, i, s, o, u, a;
                if (e < 2) throw "Affected property (or properties) and callback to effect change are required to dispatchPropertyChange";
                n = arguments[t];
                if (!n || typeof n != "function") throw "Callback to effect actual change is required to dispatchPropertyChange";
                o = [];
                for (r = 0; r < t; r++) i = arguments[r], s = c.getPropertyChangeDescriptor(this, i), s && !s.isActive && (a = Object.create(y), o.push(i, s, a), a.target = this, a.minus = this.getProperty(i), s.isActive = !0, s.handleWillChange(a));
                n.call(this);
                for (r = 0, u = o.length; r < u; r += 3) i = o[r], s = o[r + 1], a = o[r + 2], a.plus = this.getProperty(i), s.handleChange(a), s.isActive = !1
            }
        }), Object.defineProperty(Object.prototype, "addPropertyChangeListener", {
            value: function(e, t, n, r) {
                var i, s, o, u;
                if (!t || !e || this.uuid !== this.uuid) return;
                i = c.registerPropertyChangeListener(this, e, t, n, !r);
                if (e.indexOf(".") !== -1) i.setupDependencies(this, e, n, !r);
                else {
                    if (typeof this.automaticallyDispatchPropertyChangeListener != "function" || this.automaticallyDispatchPropertyChangeListener(e)) d.installDispatcherOnTargetProperty(this, e), !r && i.mutationListenersCount == 1 && i.updateMutationDependency(this[e]);
                    s = this._dependenciesForProperty ? this._dependenciesForProperty[e] : null;
                    if (s) {
                        i.observedDependentProperties || (i.observedDependentProperties = {});
                        for (o = 0; u = s[o]; o++) i.observedDependentProperties[u] || (i.observedDependentProperties[u] = !0, this.addPropertyChangeListener(u, i, n, !1), i.registerDependency(this, u, null))
                    }
                }
            }
        }), Object.defineProperty(Object.prototype, "removePropertyChangeListener", {
            value: function(e, t, n) {
                var r = c.getPropertyChangeDescriptor(this, e);
                if (!r) return;
                c.unregisterPropertyChangeListener(this, e, t, n), r.updateMutationDependency()
            }
        });
        var v = /^length$/;
        Object.defineProperty(String.prototype, "addPropertyChangeListener", {
            value: function(e, t, n, r) {
                if (e != null && v.test(e)) return;
                Object.prototype.addPropertyChangeListener.call(this, e, t, n, r)
            }
        });
        var m = {
            configurable: !0
        }, g = {
            enumerable: !1,
            writable: !0,
            configurable: !0
        }, y = t.PropertyChangeNotification = {
            phase: null,
            target: null,
            propertyPath: null,
            minus: null,
            plus: null,
            currentTarget: null,
            currentPropertyPath: null,
            isMutation: !1
        }, b = t.ChangeNotificationDispatchingArray = [],
            w = /^[0-9]+$/,
            E = /^length$/;
        Object.defineProperty(Array.prototype, "addPropertyChangeListener", {
            value: function(e, t, n, r) {
                var i, s, o, u, a;
                if (!t) return;
                if (e == null || (a = e.indexOf(".")) == -1) {
                    if (E.test(e)) return;
                    o = e ? /\(.*\)/.test(e) : !1, i = e == null, s = w.test(e)
                }
                i || s || o ? (this.isDispatchingArray || (this.__proto__ = b), u = c.registerPropertyChangeListener(this, o ? null : e, t, n, !r), s && !r && u.mutationListenersCount == 1 && u.updateMutationDependency(this[e])) : (Object.prototype.addPropertyChangeListener.apply(this, arguments), a == -1 && (u = c.getPropertyChangeDescriptor(this, e), u.setupDependencies(this, e, n, !r)))
            }
        }), Object.defineProperty(b, "_dispatchArrayChangeNotification", {
            enumerable: !1,
            configurable: !1,
            value: function(e, t, n, r, i) {
                var s = c.getPropertyChangeDescriptor(this, null),
                    o, u, a = Object.create(y),
                    f, l = this.length,
                    h = i.length,
                    p, d = this.slice(n, n + r);
                return a.target = this, n + r > l && (r = l - n), f = h - r, p = l + (f > 0 ? f : 0), s && (u = Object.create(y), u.target = this, u.minus = d, u.plus = i, u.index = n, u.isMutation = !0, s.handleWillChange(u)), this._dispatchArrayBulkWillChangeNotification(a, n, i, f, p), o = this[e].apply(this, t), s && (u.plus = i, s.handleChange(u)), this._dispatchArrayBulkChangeNotification(a, n, d, f, p), o
            }
        }), Object.defineProperty(b, "_dispatchArrayBulkWillChangeNotification", {
            enumerable: !1,
            configurable: !1,
            value: function(e, t, n, r, i) {
                var s, o, u;
                for (var a = 0, f = n.length; a < f; a++, t++) s = c.getPropertyChangeDescriptor(this, t), s && (o = this[t], u = n[a], o !== u && (e.index = t, e.propertyPath = String(t), e.minus = o, s.handleWillChange(e)));
                if (r != 0) for (; t < i; t++) s = c.getPropertyChangeDescriptor(this, t), s && (o = this[t], u = this[t - r], o !== u && (e.index = t, e.propertyPath = String(t), e.minus = o, s.handleWillChange(e)))
            }
        }), Object.defineProperty(b, "_dispatchArrayBulkChangeNotification", {
            enumerable: !1,
            configurable: !1,
            value: function(e, t, n, r, i) {
                var s, o, u;
                for (var a = 0, f = n.length; a < f; a++, t++) s = c.getPropertyChangeDescriptor(this, t), s && (o = n[a], u = this[t], o !== u && (e.index = t, e.propertyPath = String(t), e.minus = o, e.plus = u, s.handleChange(e)));
                if (r != 0) for (; t < i; t++) s = c.getPropertyChangeDescriptor(this, t), s && (o = this[t + r], u = this[t], o !== u && (e.index = t, e.propertyPath = String(t), e.minus = o, e.plus = u, s.handleChange(e)))
            }
        }), Object.defineProperty(Array.prototype, "_setProperty", {
            enumerable: !1,
            configurable: !0,
            value: function(e, t) {
                return this[e] = t
            }
        }), Object.defineProperty(Array.prototype, "setProperty", {
            enumerable: !1,
            configurable: !0,
            value: function(e, t) {
                return String(e).indexOf(".") == -1 ? this.__proto__ === b && !isNaN(e) ? this._dispatchArrayChangeNotification("_setProperty", arguments, Number(e), 1, Array.prototype.slice.call(arguments, 1, 2)) : this[e] = t : Object.prototype.setProperty.apply(this, arguments)
            }
        }), Object.defineProperty(b, "isDispatchingArray", {
            enumerable: !1,
            configurable: !1,
            value: !0
        }), Object.defineProperty(b, "_splice", {
            enumerable: !1,
            configurable: !0,
            value: Array.prototype.splice
        }), Object.defineProperty(b, "splice", {
            enumerable: !1,
            configurable: !0,
            value: function(e, t) {
                return this._dispatchArrayChangeNotification("_splice", arguments, e, t, Array.prototype.slice.call(arguments, 2))
            }
        }), Object.defineProperty(b, "_shift", {
            enumerable: !1,
            configurable: !0,
            value: Array.prototype.shift
        }), Object.defineProperty(b, "shift", {
            enumerable: !1,
            configurable: !0,
            value: function() {
                return this._dispatchArrayChangeNotification("_shift", arguments, 0, 1, [])
            }
        }), Object.defineProperty(b, "_unshift", {
            enumerable: !1,
            configurable: !0,
            value: Array.prototype.unshift
        }), Object.defineProperty(b, "unshift", {
            enumerable: !1,
            configurable: !0,
            value: function() {
                return this._dispatchArrayChangeNotification("_unshift", arguments, 0, 0, Array.prototype.slice.call(arguments, 0))
            }
        }), Object.defineProperty(b, "_push", {
            enumerable: !1,
            configurable: !0,
            value: Array.prototype.push
        }), Object.defineProperty(b, "push", {
            enumerable: !1,
            configurable: !0,
            value: function() {
                return this._dispatchArrayChangeNotification("_push", arguments, this.length, 0, Array.prototype.slice.call(arguments, 0))
            }
        }), Object.defineProperty(b, "_pop", {
            enumerable: !1,
            configurable: !0,
            value: Array.prototype.pop
        }), Object.defineProperty(b, "pop", {
            enumerable: !1,
            configurable: !0,
            value: function() {
                if (this.length > 0) return this._dispatchArrayChangeNotification("_pop", arguments, this.length - 1, 1, [])
            }
        }), Object.defineProperty(b, "_reverse", {
            enumerable: !1,
            configurable: !0,
            value: Array.prototype.reverse
        }), Object.defineProperty(b, "reverse", {
            enumerable: !1,
            configurable: !0,
            value: function() {
                var e = this.length;
                if (e === 0) return;
                var t = c.getPropertyChangeDescriptor(this, null),
                    n, r, i = Object.create(y),
                    s, o;
                i.target = this, t && (r = Object.create(y), r.target = this, r.isMutation = !0, t.handleWillChange(r));
                for (var u = 0; u < e; u++) n = c.getPropertyChangeDescriptor(this, u), n && (s = this[u], s !== this[e - u - 1] && (i.index = u, i.propertyPath = String(u), i.minus = s, n.handleWillChange(i)));
                this._reverse(), t && (r.minus = r.plus = [], t.handleChange(r));
                for (var u = 0; u < e; u++) n = c.getPropertyChangeDescriptor(this, u), n && (s = this[e - u - 1], o = this[u], s !== o && (i.index = u, i.propertyPath = String(u), i.minus = s, i.plus = o, n.handleChange(i)))
            }
        }), Object.defineProperty(b, "_sortIndexArray", {
            enumerable: !1,
            configurable: !0,
            value: []
        }), Object.defineProperty(b, "_sortDefaultCompareFunction", {
            enumerable: !1,
            configurable: !0,
            value: function(e, t) {
                return String(e).localeCompare(String(t))
            }
        }), Object.defineProperty(b, "_sort", {
            enumerable: !1,
            configurable: !0,
            value: Array.prototype.sort
        }), Object.defineProperty(b, "sort", {
            enumerable: !1,
            configurable: !0,
            value: function(e) {
                var t, n = this.length,
                    r, i, s, o, u, a, f, l, h;
                if (n === 0) return;
                e || (e = this._sortDefaultCompareFunction), t = this, l = b._sortIndexArray, h = l.length;
                if (h < n) {
                    l[n] = n - 1;
                    for (var p = h; p < n; p++) l[p] = p
                }
                f = l.slice(0, n), this._sort.call(f, function(n, r) {
                    return e(t[n], t[r])
                }), r = c.getPropertyChangeDescriptor(this, null), o = Object.create(y), o.target = this, r && (s = Object.create(y), s.target = this, s.isMutation = !0, r.handleWillChange(s));
                for (var p = 0; p < n; p++) f[p] = this[f[p]], i = c.getPropertyChangeDescriptor(this, p), i && (u = this[p], u !== f[p] && (o.index = p, o.propertyPath = String(p), o.minus = u, i.handleWillChange(o)));
                for (var p = 0; p < n; p++) i = c.getPropertyChangeDescriptor(this, p), i ? (u = this[p], a = f[p], this[p] = f[p], u !== a && (o.index = p, o.propertyPath = String(p), o.minus = u, o.plus = a, i.handleChange(o))) : this[p] = f[p];
                r && (s.minus = s.plus = [], r.handleChange(s))
            }
        }), Object.defineProperty(b, "_clear", {
            enumerable: !1,
            configurable: !0,
            value: Array.prototype.clear
        }), Object.defineProperty(b, "clear", {
            enumerable: !1,
            configurable: !0,
            value: function() {
                return this._dispatchArrayChangeNotification("_clear", arguments, this.length, 0, Array.prototype.slice.call(arguments, 0)), this
            }
        }), typeof define == "function" && Object.defineProperty(Object.prototype, "__debugChangeNotifications__", {
            enumerable: !1,
            configurable: !1,
            value: function() {
                var e = c._descriptorsRegistry[this.uuid],
                    t, n = [];
                if (e) {
                    for (t in e) {
                        n.push('"' + t + '"', e[t]);
                        var i = e[t].dependencies;
                        if (i) {
                            n.push("\n	listens to ");
                            for (var s = 0; s < i.length; s += 3) i[s + 1] == null ? n.push("mutation @", i[s]) : n.push('"' + i[s + 1] + '" @', i[s]), n.push("\n	           ");
                            n.pop()
                        }
                        var o = e[t].changeListeners,
                            u = [];
                        for (var a in o) {
                            var f = o[a].listenerTarget,
                                l = o[a].listenerFunctionName,
                                h = r.getInfoForObject(f);
                            h.objectName === "PropertyChangeBindingListener" && (f.bindingOrigin === this && f.bindingPropertyPath === t ? u.push('"' + f.targetPropertyPath + '" @ ' + (r.getInfoForObject(f.target).objectName || "<object>") + "(", f.target, ")") : u.push('"' + f.bindingPropertyPath + '" @ ' + (r.getInfoForObject(f.bindingOrigin).objectName || "<object>") + "(", f.bindingOrigin, ")"), u.push("\n	            "))
                        }
                        var p = [];
                        (function d(e, t) {
                            var n = e.changeListeners;
                            for (var i in n) {
                                var s = n[i].listenerTarget,
                                    o = n[i].listenerFunctionName,
                                    u = r.getInfoForObject(s);
                                u.objectName !== "PropertyChangeBindingListener" ? (e.dependentDescriptorsIndex && i in e.dependentDescriptorsIndex ? p.push('"' + s.propertyPath + '" (', s, ")", "-> ") : p.push(o ? o : "<function>", "@ " + u.objectName + " (", s, ")"), d(s, !0), p.push("\n	               ")) : t && p.push('"' + s.bindingPropertyPath + '" @ ' + r.getInfoForObject(s.bindingOrigin).objectName + "(", s.bindingOrigin, ")")
                            }
                        })(e[t]), p.length > 0 && (p.pop(), n.push("\n	is listened by "), n.push.apply(n, p)), u.length > 0 && (u.pop(), n.push("\n	is bound to "), n.push.apply(n, u)), n.push("\n\n")
                    }
                    console.log.apply(console, n)
                } else console.log("No change listeners installed.")
            }
        })
    }
}), montageDefine("06501b6", "core/core", {
    dependencies: ["collections/shim", "core/shim/object", "core/shim/array", "core/shim/string", "core/extras/object", "core/extras/array", "core/extras/date", "core/extras/element", "core/extras/function", "core/extras/regexp", "core/extras/string", "core/uuid"],
    factory: function(e, t, n) {
        function r(e, t) {
            var n = s + t + i;
            return e.hasOwnProperty(n) ? e[n] : Object.defineProperty(e, n, {
                enumerable: !1,
                configurable: !1,
                writable: !1,
                value: Object.create(r(Object.getPrototypeOf(e), t))
            })[n]
        }
        e("collections/shim"), e("core/shim/object"), e("core/shim/array"), e("core/shim/string"), e("core/extras/object"), e("core/extras/array"), e("core/extras/date"), e("core/extras/element"), e("core/extras/function"), e("core/extras/regexp"), e("core/extras/string");
        var i = "AttributeProperties",
            s = "_",
            o = "__proto__",
            u = "value",
            a = "enumerable",
            f = "distinct",
            l = "serializable",
            c = "modify",
            h = Array.prototype,
            p = Object.prototype,
            d = t.Montage = {};
        Object.defineProperty(d, "create", {
            configurable: !0,
            value: function(e, t) {
                if (e !== undefined && typeof e != "object") throw new TypeError("Object prototype may only be an Object or null, not '" + e + "'");
                if (!t) {
                    var n = Object.create(typeof e == "undefined" ? this : e);
                    return typeof n.didCreate == "function" && n.didCreate(), n
                }
                var r = Object.create(e);
                return d.defineProperties(r, t), r
            }
        });
        var v = [l];
        v.forEach(function(e) {
            Object.defineProperty(Object.prototype, s + e + i, {
                enumerable: !1,
                configurable: !1,
                writable: !1,
                value: {}
            })
        }), Object.defineProperty(d, "defineProperty", {
            value: function(e, t, n) {
                if (typeof e != "object" || e === null) throw new TypeError("Object must be an object, not '" + e + "'");
                var i = n.dependencies,
                    c = u in n;
                if (f in n && !c) throw "Cannot use distinct attribute on non-value property '" + t + "'";
                if (o in n) n.__proto__ = c ? typeof n.value == "function" ? y : g : m;
                else {
                    var v;
                    c ? typeof n.value == "function" ? v = y : v = g : v = m;
                    for (var b in v) b in n || (n[b] = v[b])
                }!n.hasOwnProperty(a) && t.charAt(0) === s && (n.enumerable = !1), n.hasOwnProperty(l) || (n.enumerable ? n.get && !n.set ? n.serializable = !1 : n.writable === !1 && (n.serializable = !1) : n.serializable = !1);
                if (i) {
                    var w = 0,
                        E;
                    for (; E = i[w]; w++) d.addDependencyToProperty(e, E, t)
                }
                l in n && (r(e, l)[t] = n.serializable);
                if (n.distinct !== !0 || typeof n.value != "object") return Object.defineProperty(e, t, n);
                (function(e, t, n, r) {
                    var i = function(e, t, n) {
                        Object.defineProperty(e, t, {
                            enumerable: !1,
                            configurable: !0,
                            writable: !0,
                            value: n
                        })
                    };
                    n.constructor === Object && Object.getPrototypeOf(n) === p ? Object.keys(n).length !== 0 ? Object.defineProperty(r, e, {
                        configurable: !0,
                        get: function() {
                            var e = this[t];
                            if (!e) {
                                var r;
                                e = {};
                                for (r in n) e[r] = n[r];
                                this.hasOwnProperty(t) ? this[t] = e : i(this, t, e)
                            }
                            return e
                        },
                        set: function(e) {
                            this.hasOwnProperty(t) ? this[t] = e : i(this, t, e)
                        }
                    }) : Object.defineProperty(r, e, {
                        configurable: !0,
                        get: function() {
                            var e = this[t];
                            return e || (e = {}, this.hasOwnProperty(t) ? this[t] = e : i(this, t, e)), e
                        },
                        set: function(e) {
                            this.hasOwnProperty(t) ? this[t] = e : i(this, t, e)
                        }
                    }) : (n.__proto__ || Object.getPrototypeOf(n)) === h ? n.length !== 0 ? Object.defineProperty(r, e, {
                        configurable: !0,
                        get: function() {
                            var e = this[t];
                            if (!e) {
                                var r, s;
                                e = [];
                                for (r = 0; typeof(s = n[r]) != "undefined"; r++) e[r] = s;
                                this.hasOwnProperty(t) ? this[t] = e : i(this, t, e)
                            }
                            return e
                        },
                        set: function(e) {
                            this.hasOwnProperty(t) ? this[t] = e : i(this, t, e)
                        }
                    }) : Object.defineProperty(r, e, {
                        configurable: !0,
                        get: function() {
                            var e = this[t];
                            return e || (e = [], this.hasOwnProperty(t) ? this[t] = e : i(this, t, e)), e
                        },
                        set: function(e) {
                            this.hasOwnProperty(t) ? this[t] = e : i(this, t, e)
                        }
                    }) : n.constructor.prototype === Object.getPrototypeOf(n) ? Object.defineProperty(r, e, {
                        configurable: !0,
                        get: function() {
                            var e = this[t];
                            if (!e) {
                                var r;
                                e = new n.constructor;
                                for (r in n) e[r] = n[r];
                                this.hasOwnProperty(t) ? this[t] = e : i(this, t, e)
                            }
                            return e
                        },
                        set: function(e) {
                            this.hasOwnProperty(t) ? this[t] = e : i(this, t, e)
                        }
                    }) : Object.defineProperty(r, e, {
                        configurable: !0,
                        get: function() {
                            var e = this[t];
                            return e || (e = Object.create(n.__proto__ || Object.getPrototypeOf(n)), this.hasOwnProperty(t) ? this[t] = e : i(this, t, e)), e
                        },
                        set: function(e) {
                            this.hasOwnProperty(t) ? this[t] = e : i(this, t, e)
                        }
                    })
                })(t, s + t, n.value, e)
            }
        }), Object.defineProperty(d, "defineProperties", {
            value: function(e, t) {
                if (typeof t != "object" || t === null) throw new TypeError("Properties must be an object, not '" + t + "'");
                for (var n in t) "_bindingDescriptors" !== n && this.defineProperty(e, n, t[n]);
                return e
            }
        });
        var m = {
            enumerable: !0,
            configurable: !0,
            serializable: "reference"
        }, g = {
            writable: !0,
            enumerable: !0,
            configurable: !0,
            serializable: "reference"
        }, y = {
            writable: !0,
            enumerable: !1,
            configurable: !0,
            serializable: !1
        };
        d.defineProperty(d, "addDependencyToProperty", {
            value: function(e, t, n) {
                e._dependenciesForProperty || d.defineProperty(e, "_dependenciesForProperty", {
                    value: {}
                }), e._dependenciesForProperty[n] || (e._dependenciesForProperty[n] = []), e._dependenciesForProperty[n].push(t)
            }
        }), d.defineProperty(d, "removeDependencyFromProperty", {
            value: function(e, t, n) {
                if (!e._dependenciesForProperty) return;
                var r = e._dependenciesForProperty[n];
                r && (r = r.filter(function(e) {
                    return e !== t
                }))
            }
        }), d.defineProperty(d, "getSerializablePropertyNames", {
            value: function(e) {
                var t = [],
                    n = e._serializableAttributeProperties;
                if (n) for (var r in n) n[r] && t.push(r);
                return t
            }
        }), d.defineProperty(d, "getPropertyAttribute", {
            value: function(e, t, n) {
                var r = s + n + i,
                    o = e[r];
                if (o) return o[t]
            }
        }), d.defineProperty(d, "getPropertyAttributes", {
            value: function(e, t) {
                var n = {}, r = s + t + i,
                    o = e[r];
                if (!o) return;
                for (var u in o) n[u] = o[u];
                return n
            }
        });
        var b = {
            isInstance: {
                value: !0
            }
        }, w = {
            objectName: {
                value: "Function"
            },
            isInstance: {
                value: !0
            }
        };
        d.defineProperty(d, "getInfoForObject", {
            value: function(e) {
                var t, n;
                if (S.call(e, "_montage_metadata")) return e._montage_metadata;
                t = e._montage_metadata || e.constructor && e.constructor._montage_metadata || null, e.constructor === Function ? n = w : n = b;
                try {
                    return Object.defineProperty(e, "_montage_metadata", {
                        enumerable: !1,
                        writable: !0,
                        value: Object.create(t, n)
                    })._montage_metadata
                } catch (r) {
                    return e._montage_metadata = Object.create(t, n)
                }
            }
        }), Object.defineProperty(d, "doNothing", {
            value: function() {}
        }), Object.defineProperty(d, "self", {
            value: function() {
                return this
            }
        }), Object.defineProperty(d, "__OBJECT_COUNT", {
            value: 0,
            writable: !0
        });
        var E = e("core/uuid"),
            S = Object.prototype.hasOwnProperty,
            x = function() {
                var e = E.generate(),
                    t = d.getInfoForObject(this);
                try {
                    if (t !== null && t.isInstance === !1) this._uuid = e, Object.defineProperty(this, "uuid", {
                        get: function() {
                            return this.hasOwnProperty("uuid") ? this._uuid : x.call(this)
                        }
                    });
                    else {
                        t.isInstance && Object.defineProperty(this, "uuid", {
                            configurable: !0,
                            enumerable: !1,
                            writable: !1,
                            value: e
                        });
                        if (this instanceof Element || !t.isInstance || !(u in Object.getOwnPropertyDescriptor(this, "uuid")) || !(o in this)) this._uuid = e
                    }
                } catch (n) {
                    this._uuid = e
                }
                return e
            }, T = function() {
                return S.call(this, "_uuid") ? this._uuid : x.call(this)
            };
        Object.defineProperty(Object.prototype, "_uuid", {
            enumerable: !1,
            value: null,
            writable: !0
        }), Object.defineProperty(Object.prototype, "uuid", {
            configurable: !0,
            get: T,
            set: function() {}
        }), d.defineProperty(d, "identifier", {
            value: null,
            serializable: !0
        }), Object.defineProperty(d, "equals", {
            value: function(e) {
                return this === e || this.uuid === e.uuid
            }
        }), Object.defineProperty(d, "callDelegateMethod", {
            value: function(e) {
                var t = this.delegate,
                    n, r;
                if (typeof this.identifier == "string") {
                    n = this.identifier + e.toCapitalized();
                    if (t && typeof(r = t[n]) == "function") return h.shift.call(arguments), r.apply(t, arguments)
                }
                if (t && typeof(r = t[e]) == "function") return h.shift.call(arguments), r.apply(t, arguments)
            }
        })
    }
}), montageDefine("06501b6", "core/shim/object", {
    dependencies: [],
    factory: function(e, t, n) {
        Object.create || (Object._creator = function r() {
            this.__proto__ = r.prototype
        }, Object.create = function(e, t) {
            return this._creator.prototype = e || Object.prototype, new this._creator
        }, Object.getPrototypeOf = function(e) {
            return e.__proto__
        }), Object.isSealed || Object.defineProperty(Object, "isSealed", {
            value: function() {
                return !1
            },
            writable: !0,
            configurable: !0
        }), Object.seal || Object.defineProperty(Object, "seal", {
            value: function(e) {
                return e
            },
            writable: !0,
            configurable: !0
        })
    }
}), montageDefine("06501b6", "core/shim/array", {
    dependencies: [],
    factory: function(e, t, n) {
        Array.isArray || Object.defineProperty(Array, "isArray", {
            value: function(e) {
                return Object.prototype.toString.call(e) === "[object Array]"
            },
            writable: !0,
            configurable: !0
        })
    }
}), montageDefine("06501b6", "core/shim/string", {
    dependencies: [],
    factory: function(e, t, n) {
        String.prototype.startsWith || Object.defineProperty(String.prototype, "startsWith", {
            value: function(e) {
                return this.length >= e.length && this.slice(0, e.length) === e
            },
            writable: !0,
            configurable: !0
        }), String.prototype.endsWith || Object.defineProperty(String.prototype, "endsWith", {
            value: function(e) {
                return this.length >= e.length && this.slice(this.length - e.length, this.length) === e
            },
            writable: !0,
            configurable: !0
        })
    }
}), montageDefine("06501b6", "core/extras/object", {
    dependencies: ["core/core", "collections/weak-map"],
    factory: function(e, t, n) {
        var r = e("core/core"),
            i = e("collections/weak-map"),
            s = "modify",
            o = "string",
            u = "function";
        Object.defineProperty(Object.prototype, "getProperty", {
            value: function(e, t, n, r, i) {
                var s, o, a, f, l = null;
                if (e == null) return;
                return s = e.indexOf(".", i), i = i || 0, a = e.substring(i, s === -1 ? e.length : s), a in this ? o = this[a] : o = typeof this.undefinedGet === u ? this.undefinedGet(a) : undefined, r && (f = e.indexOf(".", i), f != -1 && (l = e.substr(f + 1)), r(this, a, o, null, l)), (!r || !o || -1 !== s) && o && s !== -1 && (o.getProperty ? o = o.getProperty(e, t, n, r, s + 1) : o = Object.prototype.getProperty.call(o, e, t, n, r, s + 1)), o
            },
            writable: !0,
            configurable: !0
        }), Object.defineProperty(Object.prototype, "_propertySetterNamesByName", {
            value: {},
            writable: !0,
            configurable: !0
        }), Object.defineProperty(Object.prototype, "_propertySetterByName", {
            value: {},
            writable: !0,
            configurable: !0
        }), Object.defineProperty(Object.prototype, "setProperty", {
            value: function(e, t) {
                var n = !isNaN(e),
                    r = n ? -1 : e.lastIndexOf("."),
                    i, s, o;
                if (r !== -1) {
                    i = this.getProperty(e.substring(0, r));
                    if (!i) {
                        this.undefinedSet(e);
                        return
                    }
                    e = e.substring(r + 1)
                } else i = this;
                s = i.getProperty(e), s && Array.isArray(s) ? Array.isArray(i) ? (o = parseInt(e, 10), isNaN(o) ? i[e] = t : (i.length < o && (i[o] = null), i.splice(o, 1, t))) : i[e] = t : Array.isArray(i) ? (o = parseInt(e, 10), isNaN(o) || i.length < o && (i[o] = null), i.splice(o, 1, t)) : i[e] = t
            },
            writable: !0,
            configurable: !0
        }), Object.defineProperty(Object.prototype, "parentProperty", {
            value: null,
            writable: !0,
            configurable: !0
        }), Object.defineProperty(Object.prototype, "undefinedGet", {
            value: function(e) {
                console.warn("get undefined property -" + e + "-")
            },
            writable: !0,
            configurable: !0
        }), Object.defineProperty(Object.prototype, "undefinedSet", {
            value: function(e) {
                console.warn("set undefined property -" + e + "-")
            },
            writable: !0,
            configurable: !0
        }), Object.defineProperty(Object, "getPropertyDescriptor", {
            value: function(e, t) {
                var n = e,
                    r;
                do r = Object.getOwnPropertyDescriptor(n, t);
                while (!r && (n = n.__proto__ || Object.getPrototypeOf(n)));
                return r
            },
            writable: !0,
            configurable: !0
        }), Object.defineProperty(Object, "getPrototypeAndDescriptorDefiningProperty", {
            value: function(e, t) {
                var n = e,
                    r;
                if (t) {
                    do r = Object.getOwnPropertyDescriptor(n, t);
                    while (!r && (n = n.__proto__ || Object.getPrototypeOf(n)));
                    return {
                        prototype: n,
                        propertyDescriptor: r
                    }
                }
            },
            writable: !0,
            configurable: !0
        }), Object.defineProperty(Object.prototype, "clear", {
            value: function() {
                var e = Object.keys(this),
                    t = e.length;
                while (t) t--, delete this[e[t]];
                return this
            },
            writable: !0,
            configurable: !0
        })
    }
}), montageDefine("06501b6", "core/extras/array", {
    dependencies: [],
    factory: function(e, t, n) {
        var r = /^[0-9]+$/;
        Object.defineProperty(Array.prototype, "getProperty", {
            value: function(e, t, n, i, s) {
                if (e == null) return;
                s = s || 0;
                var o, u = r.test(e),
                    a = u ? -1 : e.indexOf("(", s),
                    f = u ? -1 : e.lastIndexOf(")"),
                    l = u ? -1 : e.indexOf(".", s),
                    c = -1,
                    h, p, d, v, m, g, y;
                l > -1 && a > -1 ? l > a ? (c = f + 1, v = e.substring(s, a)) : c = l : a > -1 ? (c = f + 1, v = e.substring(s, a)) : c = l, d = u ? e : e.substring(s, c === -1 ? e.length : c);
                if (v) i && i(this, v + "()", null, null, null), m = e.substring(a + 1, f), o = this[v](m, i);
                else if (isNaN(d)) {
                    i && i(this, null, undefined, null, e.slice(s)), o = [], p = 0;
                    if (n) while ((h = this[p]) != null) o[p] = h.getProperty(e, t, n, i, s), p++;
                    else {
                        while ((h = this[p]) != null) g = h.getProperty(e, t, n, i, s), Array.isArray(g) ? o = o.concat(g) : o[p] = g, p++;
                        if (t) {
                            var y = {};
                            o = o.filter(function(e) {
                                return y[e] ? !1 : y[e] = !0
                            })
                        }
                    }
                } else o = this[d], i && i(this, d, o, null, l != -1 ? e.slice(l + 1) : null), l > 0 ? o = o ? o.getProperty(e, t, n, i, l + 1) : undefined : i && l === -1 && o;
                return o
            },
            writable: !0,
            configurable: !0
        }), Object.defineProperty(Array.prototype, "count", {
            value: function() {
                return this.length
            },
            writable: !0,
            configurable: !0
        }), Object.defineProperty(Array.prototype, "any", {
            value: function(e, t) {
                var n;
                return e ? n = this.some(function(n) {
                    return !!n.getProperty(e, null, null, t)
                }) : n = this.some(function(e) {
                    return !!e
                }), n
            },
            writable: !0,
            configurable: !0
        }), Object.defineProperty(Array.prototype, "sum", {
            value: function(e, t) {
                return e ? this.map(function(n) {
                    return n.getProperty(e, null, null, t)
                }).sum() : this.reduce(function(e, t) {
                    return Array.isArray(t) && (t = t.sum()), e + t
                }, 0)
            },
            writable: !0,
            configurable: !0
        }), Object.defineProperty(Array, "isCanvasPixelArray", {
            value: function(e) {
                return Object.prototype.toString.call(e) === "[object CanvasPixelArray]"
            },
            writable: !0,
            configurable: !0
        })
    }
}), montageDefine("06501b6", "core/extras/date", {
    dependencies: [],
    factory: function(e, t, n) {
        Object.defineProperty(Date.prototype, "clone", {
            value: function() {
                return new Date(this)
            },
            writable: !0,
            configurable: !0
        })
    }
}), montageDefine("06501b6", "core/extras/element", {
    dependencies: [],
    factory: function(e, t, n) {
        Element && !Element.isElement && Object.defineProperty(Element, "isElement", {
            value: function(e) {
                return !!e && 1 === e.nodeType
            },
            writable: !0,
            configurable: !0
        })
    }
}), montageDefine("06501b6", "core/extras/function", {
    dependencies: ["./object"],
    factory: function(e, t, n) {
        e("./object"), Object.defineProperty(Function, "identity", {
            value: function(e) {
                return e
            },
            writable: !0,
            configurable: !0
        }), Object.defineProperty(Function, "noop", {
            value: function() {},
            writable: !0,
            configurable: !0
        }), Object.defineProperty(Function, "by", {
            value: function(e, t) {
                t = t || Object.compare, e = e || Function.identity;
                var n = function(n, r) {
                    return t(e(n), e(r))
                };
                return n.compare = t, n.by = e, n
            },
            writable: !0,
            configurable: !0
        })
    }
}), montageDefine("06501b6", "core/extras/regexp", {
    dependencies: [],
    factory: function(e, t, n) {
        if (!RegExp.isRegExp) {
            var r = Object.prototype.toString;
            Object.defineProperty(RegExp, "isRegExp", {
                value: function(e) {
                    return r.call(e) === "[object RegExp]"
                },
                writable: !0,
                configurable: !0
            })
        }
    }
}), montageDefine("06501b6", "core/extras/string", {
    dependencies: [],
    factory: function(e, t, n) {
        Object.defineProperty(String, "isString", {
            value: function(e) {
                return Object.prototype.toString.call(e) === "[object String]"
            },
            writable: !0,
            configurable: !0
        }), Object.defineProperty(String.prototype, "equals", {
            value: function(e) {
                return this.valueOf() === Object.getValueOf(e)
            },
            writable: !0,
            configurable: !0
        }), Object.defineProperty(String.prototype, "contains", {
            value: function(e) {
                return this.indexOf(e) !== -1
            },
            writable: !0,
            configurable: !0
        }), Object.defineProperty(String.prototype, "toCapitalized", {
            value: function() {
                return this.charAt(0).toUpperCase() + this.slice(1)
            },
            writable: !0,
            configurable: !0
        }), Object.defineProperty(String.prototype, "addEventListener", {
            value: Function.noop,
            writable: !0,
            configurable: !0
        })
    }
}), montageDefine("06501b6", "ui/component", {
    dependencies: ["montage", "ui/template", "core/gate", "core/promise", "core/logger", "core/event/event-manager"],
    factory: function(e, t, n) {
        var r = e("montage").Montage,
            i = e("ui/template").Template,
            s = e("core/gate").Gate,
            o = e("core/promise").Promise,
            u = e("core/logger").logger("component"),
            a = e("core/logger").logger("drawing"),
            f = e("core/event/event-manager").defaultEventManager,
            l, c = t.Component = r.create(r, {
                delegate: {
                    value: null
                },
                templateObjects: {
                    serializable: !1,
                    value: null
                },
                parentProperty: {
                    value: "parentComponent"
                },
                _dispatchActionEvent: {
                    value: function() {
                        this.dispatchEvent(this.createActionEvent())
                    },
                    enumerable: !1
                },
                createActionEvent: {
                    value: function() {
                        var e = document.createEvent("CustomEvent");
                        return e.initCustomEvent("action", !0, !0, null), e
                    }
                },
                canDrawGate: {
                    get: function() {
                        return this._canDrawGate || (this._canDrawGate = s.create().initWithDelegate(this), this._canDrawGate.setField("componentTreeLoaded", !1)), this._canDrawGate
                    },
                    enumerable: !1
                },
                _blockDrawGate: {
                    value: null
                },
                blockDrawGate: {
                    enumerable: !1,
                    get: function() {
                        return this._blockDrawGate || (this._blockDrawGate = s.create().initWithDelegate(this), this._blockDrawGate.setField("element", !1), this._blockDrawGate.setField("drawRequested", !1)), this._blockDrawGate
                    }
                },
                _firstDraw: {
                    enumerable: !1,
                    value: !0
                },
                _completedFirstDraw: {
                    enumerable: !1,
                    value: !1
                },
                _element: {
                    enumerable: !1,
                    value: null
                },
                element: {
                    get: function() {
                        return this._element
                    },
                    set: function(e) {
                        if (e == null) {
                            console.warn("Tried to set element of ", this, " to ", e);
                            return
                        }
                        if (this.isDeserializing) this.eventManager.registerEventHandlerForElement(this, e), this._isTemplateInstantiated ? this._templateElement || (this._templateElement = e) : (this._element = e, !this.blockDrawGate.value && this._element && this.blockDrawGate.setField("element", !0));
                        else {
                            if (!this._firstDraw) {
                                console.error("Cannot change element of ", this, " after it has been set");
                                return
                            }
                            this.eventManager.registerEventHandlerForElement(this, e), this._element = e, !this.blockDrawGate.value && this._element && this.blockDrawGate.setField("element", !0)
                        }
                    }
                },
                setElementWithParentComponent: {
                    value: function(e, t) {
                        this._alternateParentComponent = t, this.element != e && (this.element = e)
                    }
                },
                application: {
                    enumerable: !1,
                    get: function() {
                        return document.application
                    }
                },
                eventManager: {
                    enumerable: !1,
                    get: function() {
                        return f
                    }
                },
                rootComponent: {
                    enumerable: !1,
                    get: function() {
                        return h
                    }
                },
                acceptsDirectFocus: {
                    enumerable: !1,
                    value: function() {
                        return !1
                    }
                },
                elementControllerFromEvent: {
                    enumerable: !1,
                    value: function(e, t) {
                        return t
                    }
                },
                _alternateParentComponent: {
                    value: null
                },
                _cachedParentComponent: {
                    value: null
                },
                parentComponent: {
                    enumerable: !1,
                    get: function() {
                        var e = this._cachedParentComponent;
                        return e == null ? this._cachedParentComponent = this.findParentComponent() : e
                    }
                },
                findParentComponent: {
                    value: function() {
                        var e = this.element,
                            t, n = this.eventManager;
                        if (e) {
                            while ((t = e.parentNode) != null && n.eventHandlerForElement(t) == null) e = t;
                            return t ? n.eventHandlerForElement(t) : this._alternateParentComponent
                        }
                    }
                },
                querySelectorComponent: {
                    value: function(e) {
                        if (typeof e != "string") throw "querySelectorComponent: Selector needs to be a string.";
                        var t = e.match(/^\s*(?:@([^>\s]+))?(?:\s*(>)?\s*@([^>\s]+)(.*))?$/);
                        if (!t) throw 'querySelectorComponent: Syntax error "' + e + '"';
                        var n = this.childComponents,
                            i = t[1],
                            s = t[2] || " ",
                            o = t[3],
                            u = t[4],
                            a;
                        if (i) {
                            u = o ? "@" + o + u : "";
                            for (var f = 0, l; l = n[f]; f++) {
                                if (i === r.getInfoForObject(l).label) return u ? l.querySelectorComponent(u) : l;
                                a = l.querySelectorComponent(e);
                                if (a) return a
                            }
                        } else for (var f = 0, l; l = n[f]; f++) if (o === r.getInfoForObject(l).label) return u ? l.querySelectorComponent(u) : l;
                        return null
                    }
                },
                querySelectorAllComponent: {
                    value: function(e, t) {
                        if (typeof e != "string") throw "querySelectorComponent: Selector needs to be a string.";
                        var n = e.match(/^\s*(?:@([^>\s]+))?(?:\s*(>)?\s*@([^>\s]+)(.*))?$/);
                        if (!n) throw 'querySelectorComponent: Syntax error "' + e + '"';
                        var i = this.childComponents,
                            s = n[1],
                            o = n[2] || " ",
                            u = n[3],
                            a = n[4],
                            f = [];
                        if (s) {
                            a = u ? "@" + u + a : "";
                            for (var l = 0, c; c = i[l]; l++) s !== r.getInfoForObject(c).label || !! t && t !== c.ownerComponent ? f = f.concat(c.querySelectorAllComponent(e, t)) : a ? f = f.concat(c.querySelectorAllComponent(a)) : f.push(c)
                        } else for (var l = 0, c; c = i[l]; l++) u === r.getInfoForObject(c).label && (!t || t === c.ownerComponent) && (a ? f = f.concat(c.querySelectorAllComponent(a, t)) : f.push(c));
                        return f
                    }
                },
                template: {
                    enumerable: !1,
                    value: null
                },
                hasTemplate: {
                    enumerable: !1,
                    value: !0
                },
                _templateModuleId: {
                    serializable: !1,
                    value: null
                },
                _template: {
                    value: null
                },
                _treeLevel: {
                    value: 0
                },
                _addChildComponent: {
                    value: function(e) {
                        this.childComponents.indexOf(e) == -1 && (this.childComponents.push(e), e._cachedParentComponent = this)
                    }
                },
                attachToParentComponent: {
                    value: function() {
                        this._cachedParentComponent = null;
                        var e = this.parentComponent,
                            t, n;
                        if (e) {
                            t = e.childComponents;
                            for (var r = 0; n = t[r]; r++) {
                                var i = n.findParentComponent();
                                i === this && (e.removeChildComponent(n), i._addChildComponent(n))
                            }
                            e._addChildComponent(this)
                        }
                    }
                },
                detachFromParentComponent: {
                    value: function() {
                        var e = this.parentComponent;
                        e && e.removeChildComponent(this)
                    }
                },
                removeChildComponent: {
                    value: function(e) {
                        var t = this.childComponents,
                            n = e._element,
                            r = t.indexOf(e);
                        r > -1 && (t.splice(r, 1), e._cachedParentComponent = null, e._alternateParentComponent = null)
                    }
                },
                childComponents: {
                    enumerable: !1,
                    distinct: !0,
                    value: []
                },
                ownerComponent: {
                    enumerable: !1,
                    value: null
                },
                components: {
                    enumerable: !1,
                    value: {}
                },
                _isComponentExpanded: {
                    enumerable: !1,
                    value: null
                },
                _isTemplateLoaded: {
                    enumerable: !1,
                    value: null
                },
                _isTemplateInstantiated: {
                    enumerable: !1,
                    value: null
                },
                cleanupDeletedComponentTree: {
                    value: function(e) {
                        e && Object.deleteBindings(this), this.needsDraw = !1, this.traverseComponentTree(function(t) {
                            e && Object.deleteBindings(t), t.needsDraw = !1
                        })
                    }
                },
                originalContent: {
                    serializable: !1,
                    value: null
                },
                _newDomContent: {
                    enumerable: !1,
                    value: null
                },
                domContent: {
                    serializable: !1,
                    get: function() {
                        return this._element ? Array.prototype.slice.call(this._element.childNodes, 0) : null
                    },
                    set: function(e) {
                        function t(e) {
                            var n = e.controller;
                            if (n) n.detachFromParentComponent(), r.push(n);
                            else {
                                var i = e.childNodes;
                                for (var s = 0, o; o = i[s]; s++) t(o)
                            }
                        }
                        var n, r = [];
                        this._newDomContent = e, this.needsDraw = !0, this._newDomContent === null && (this._shouldClearDomContentOnNextDraw = !0), typeof this.contentWillChange == "function" && this.contentWillChange(e), n = this.childComponents;
                        for (var i = 0, s; s = n[i]; i++) s.detachFromParentComponent(), s.cleanupDeletedComponentTree();
                        if (e instanceof Element) t(e);
                        else if (e) for (var i = 0; i < e.length; i++) t(e[i]);
                        for (var i = 0, s; s = r[i]; i++) this._addChildComponent(s)
                    }
                },
                _shouldClearDomContentOnNextDraw: {
                    value: !1
                },
                clonesChildComponents: {
                    writable: !1,
                    value: !1
                },
                deserializedFromSerialization: {
                    value: function() {
                        this.attachToParentComponent(), this._element && (this._newDomContent ? this.originalContent = this._newDomContent : this.originalContent = Array.prototype.slice.call(this._element.childNodes, 0)), this.hasOwnProperty("identifier") || (this.identifier = r.getInfoForObject(this).label)
                    }
                },
                serializeProperties: {
                    value: function(e) {
                        e.setAll();
                        var t = this.childComponents;
                        for (var n = 0, r = t.length; n < r; n++) e.addObject(t[n])
                    }
                },
                canDraw: {
                    value: function() {
                        return this._canDraw
                    }
                },
                _canDraw: {
                    get: function() {
                        return !this._canDrawGate || this._canDrawGate.value
                    },
                    set: function(e) {
                        h.componentCanDraw(this, e)
                    },
                    enumerable: !1
                },
                _prepareCanDraw: {
                    enumerable: !1,
                    value: function() {
                        this._isComponentTreeLoaded || this.loadComponentTree()
                    }
                },
                _loadComponentTreeCallbacks: {
                    enumerable: !1,
                    value: null
                },
                _isComponentTreeLoaded: {
                    enumerable: !1,
                    value: null
                },
                _isComponentTreeLoading: {
                    enumerable: !1,
                    value: null
                },
                loadComponentTree: {
                    value: function(e) {
                        function t() {
                            var e, t = n._loadComponentTreeCallbacks;
                            n._isComponentTreeLoading = !1, n._isComponentTreeLoaded = !0, r.setField("componentTreeLoaded", !0);
                            if (t) {
                                for (var i = 0; e = t[i]; i++) e(n);
                                n._loadComponentTreeCallbacks = t = null
                            }
                        }
                        var n = this,
                            r = this.canDrawGate;
                        if (this._isComponentTreeLoaded) {
                            e && e(this);
                            return
                        }
                        e && (this._loadComponentTreeCallbacks == null ? this._loadComponentTreeCallbacks = [e] : this._loadComponentTreeCallbacks.push(e));
                        if (this._isComponentTreeLoading) return;
                        r.setField("componentTreeLoaded", !1);
                        if (this.needsDraw || this.hasTemplate) this._canDraw = !1;
                        this._isComponentTreeLoading = !0, this.expandComponent(function() {
                            var e, r = n.childComponents,
                                i = r.length,
                                s = 0,
                                o;
                            if (i === 0) {
                                t();
                                return
                            }
                            for (o = 0; e = r[o]; o++) e.loadComponentTree(function() {
                                ++s === i && t()
                            })
                        })
                    }
                },
                traverseComponentTree: {
                    value: function(e, t) {
                        function n() {
                            var n = r.childComponents,
                                i, s;
                            if (e && e(r) === !1) {
                                t && t();
                                return
                            }
                            if ((s = n.length) === 0) {
                                t && t();
                                return
                            }
                            for (var o = 0; i = n[o]; o++) i.traverseComponentTree(e, function() {
                                --s === 0 && t && t()
                            })
                        }
                        var r = this;
                        this._isComponentExpanded ? n() : this.expandComponent(function() {
                            n()
                        })
                    }
                },
                expandComponent: {
                    value: function(e) {
                        var t = this;
                        this.hasTemplate && !this._isTemplateInstantiated ? this.loadTemplate(function() {
                            t._isComponentExpanded = !0, e && e()
                        }) : (t._isComponentExpanded = !0, e && e())
                    }
                },
                _loadTemplateCallbacks: {
                    enumerable: !1,
                    value: null
                },
                loadTemplate: {
                    value: function(e) {
                        var t = this;
                        this._isTemplateInstantiated || this._loadTemplate(function(n) {
                            var r = t.templateObjects;
                            r ? r.owner = t : t.templateObjects = r = {
                                owner: t
                            }, t._isTemplateInstantiated = !0, n.instantiateWithInstancesAndDocument(r, t._element.ownerDocument, function() {
                                e && e()
                            })
                        })
                    }
                },
                _loadTemplate: {
                    value: function(e) {
                        if (this._isTemplateLoaded) {
                            e && e(this._template);
                            return
                        }
                        e && (this._loadTemplateCallbacks === null ? this._loadTemplateCallbacks = [e] : this._loadTemplateCallbacks.push(e));
                        if (this._isTemplateLoading) return;
                        this._isTemplateLoading = !0;
                        var t = this,
                            n, s, o = function(n) {
                                var r = t._loadTemplateCallbacks;
                                t._template = n, t._isTemplateLoaded = !0, t._isTemplateLoading = !1;
                                if (r) {
                                    for (var i = 0; e = r[i]; i++) e(n);
                                    t._loadTemplateCallbacks = r = null
                                }
                            };
                        n = r.getInfoForObject(this), u.isDebug && u.debug(this, "Will load " + this.templateModuleId), i.templateWithModuleId(n.require, this.templateModuleId, o)
                    }
                },
                templateModuleId: {
                    get: function() {
                        return this._templateModuleId || this._getDefaultTemplateModuleId()
                    }
                },
                _getDefaultTemplateModuleId: {
                    value: function() {
                        var e, t, n, i;
                        return i = r.getInfoForObject(this), n = i.moduleId, t = n.lastIndexOf("/"), e = n + "/" + n.slice(t === -1 ? 0 : t + 1, -5) + ".html", e
                    }
                },
                _deserializedFromTemplate: {
                    value: function(e) {
                        this.ownerComponent || (c.isPrototypeOf(e) ? this.ownerComponent = e : this.ownerComponent = this.rootComponent)
                    }
                },
                _description: {
                    serializable: !1,
                    enumerable: !1,
                    value: null
                },
                description: {
                    serializable: !1,
                    get: function() {
                        if (this._description === null) {
                            var t = this;
                            l || (l = e.async("ui/component-description").get("ComponentDescription")), this._description = l.then(function(e) {
                                return e.getComponentDescriptionFromComponentModule(t)
                            })
                        }
                        return this._description
                    },
                    set: function(e) {
                        e._component = this, this._description = o.resolve(e)
                    }
                },
                gateDidBecomeTrue: {
                    value: function(e) {
                        e == this._canDrawGate ? this._canDraw = !0 : e == this._blockDrawGate && (h.componentBlockDraw(this), this._prepareCanDraw())
                    },
                    enumerable: !1
                },
                _canDrawGate: {
                    enumerable: !1,
                    value: null
                },
                _preparedForActivationEvents: {
                    enumerable: !1,
                    value: !1
                },
                _drawIfNeeded: {
                    enumerable: !1,
                    value: function(e) {
                        var t, n, r, i;
                        this._treeLevel = e, this.needsDraw && !this._addedToDrawCycle && h.addToDrawCycle(this), a.isDebug && a.debug(this, "drawList: " + (this._drawList || []).length + " of " + this.childComponents.length);
                        if (this._drawList !== null && this._drawList.length > 0) {
                            n = this._drawList, this._drawList = [], i = n.length;
                            for (r = 0; r < i; r++) t = n[r], a.isDebug && a.debug("Parent Component " + (this.element != null ? this.element.id : "") + " drawList length: " + n.length), t._addedToDrawList = !1, a.isDebug && a.debug(this, "childComponent: " + t.element + "; canDraw: " + t.canDraw()), t.canDraw() && t._drawIfNeeded(e + 1)
                        }
                    }
                },
                _updateComponentDom: {
                    value: function() {
                        var e, t, n, r;
                        if (this._firstDraw) {
                            this.parentComponent && typeof this.parentComponent.childComponentWillPrepareForDraw == "function" && this.parentComponent.childComponentWillPrepareForDraw(this), this._willPrepareForDraw(), typeof this.willPrepareForDraw == "function" && this.willPrepareForDraw(), this._prepareForDraw(), this.prepareForDraw && this.prepareForDraw(), n = this.composerList.length;
                            for (r = 0; r < n; r++) t = this.composerList[r], t.lazyLoad || t._load();
                            this._firstDraw = !1
                        }
                        if (this._newDomContent !== null || this._shouldClearDomContentOnNextDraw) a.isDebug && u.debug("Component content changed: component ", this._montage_metadata.objectName, this.identifier, " newDomContent", this._newDomContent), this._performDomContentChanges()
                    }
                },
                _replaceElementWithTemplate: {
                    enumerable: !1,
                    value: function() {
                        var e = this.element,
                            t = this._templateElement,
                            n = this.element.attributes,
                            r, i, s, o;
                        for (s = 0; o = n[s]; s++) r = o.nodeName, r === "id" || r === "data-montage-id" ? i = o.nodeValue : i = (t.getAttribute(r) || "") + (r === "style" ? "; " : " ") + o.nodeValue, t.setAttribute(r, i);
                        e.parentNode ? e.parentNode.replaceChild(t, e) : console.warn("Warning: Trying to replace element ", e, " which has no parentNode"), this.eventManager.unregisterEventHandlerForElement(e), this.eventManager.registerEventHandlerForElement(this, t), this._element = t, this._templateElement = null, this._newDomContent && (this._newDomContent = null, this._shouldClearDomContentOnNextDraw = !1)
                    }
                },
                _prepareForDraw: {
                    value: function() {
                        u.isDebug && u.debug(this, "_templateElement: " + this._templateElement), this._templateElement && this._replaceElementWithTemplate();
                        var e = this.childComponents;
                        for (var t = 0, n; n = e[t]; t++) a.isDebug && a.debug(this, "needsDraw = true for: " + n._montage_metadata.exportedSymbol), n.needsDraw = !0
                    },
                    enumerable: !1
                },
                prepareForActivationEvents: {
                    enumerable: !1,
                    value: null
                },
                _prepareForActivationEvents: {
                    value: function() {
                        var e = this.composerList.length,
                            t;
                        for (e = 0; e < this.composerList.length; e++) t = this.composerList[e], t.lazyLoad && t._load();
                        typeof this.prepareForActivationEvents == "function" && this.prepareForActivationEvents()
                    }
                },
                _performDomContentChanges: {
                    value: function() {
                        var e = this._newDomContent,
                            t = this._element.childNodes[0],
                            n;
                        if (e || this._shouldClearDomContentOnNextDraw) {
                            n = this._element, n.innerHTML = "";
                            if (e instanceof Element) n.appendChild(e);
                            else if (e !== null) for (var r = 0, i; i = e[r]; r++) n.appendChild(i);
                            this._newDomContent = null, typeof this.contentDidChange == "function" && this.contentDidChange(this._element.childNodes[0], t), this._shouldClearDomContentOnNextDraw = !1
                        }
                    }
                },
                draw: {
                    enumerable: !1,
                    value: function() {}
                },
                willDraw: {
                    enumerable: !1,
                    value: null
                },
                didDraw: {
                    enumerable: !1,
                    value: function() {}
                },
                _addedToDrawList: {
                    value: !1
                },
                _addToParentsDrawList: {
                    enumerable: !1,
                    value: function() {
                        if (!this._addedToDrawList) {
                            var e = this.parentComponent;
                            e ? e._addToDrawList(this) : a.isDebug && a.debug(this, "parentComponent is null"), a.isDebug && a.debug("drawList -- childComponent", this._montage_metadata.objectName, " added to ", e._montage_metadata.objectName)
                        }
                    }
                },
                _needsDraw: {
                    enumerable: !1,
                    value: !1
                },
                needsDraw: {
                    enumerable: !1,
                    get: function() {
                        return !!this._needsDraw
                    },
                    set: function(e) {
                        if (this.isDeserializing) return;
                        this._needsDraw !== e && (a.isDebug && a.debug("NEEDS DRAW TOGGLED " + e + " FOR " + this._montage_metadata.objectName), this._needsDraw = !! e, e && (this.canDrawGate.value ? this._addToParentsDrawList() : this.blockDrawGate.setField("drawRequested", !0)))
                    }
                },
                _drawList: {
                    value: null
                },
                __addToDrawList: {
                    enumerable: !1,
                    value: function(e) {
                        this._drawList === null ? (this._drawList = [e], e._addedToDrawList = !0) : this._drawList.indexOf(e) === -1 && (this._drawList.push(e), e._addedToDrawList = !0)
                    }
                },
                _addToDrawList: {
                    enumerable: !1,
                    value: function(e) {
                        this.__addToDrawList(e), this._addToParentsDrawList()
                    }
                },
                _templateElement: {
                    enumerable: !1,
                    value: null
                },
                surrenderPointer: {
                    value: function(e, t) {
                        return !0
                    }
                },
                composerList: {
                    value: [],
                    distinct: !0,
                    serializable: !1
                },
                addComposer: {
                    value: function(e) {
                        this.addComposerForElement(e, e.element)
                    }
                },
                addComposerForElement: {
                    value: function(e, t) {
                        e.component = this, e.element = t, this.composerList.push(e), this._firstDraw || (e.lazyLoad ? this._preparedForActivationEvents && e._load() : e._load())
                    }
                },
                scheduleComposer: {
                    value: function(e) {
                        this.rootComponent.addToComposerList(e)
                    }
                },
                removeComposer: {
                    value: function(e) {
                        var t, n;
                        n = this.composerList.length;
                        for (t = 0; t < n; t++) if (this.composerList[t].uuid === e.uuid) {
                            this.composerList[t].unload(), this.composerList.splice(t, 1);
                            break
                        }
                    }
                },
                clearAllComposers: {
                    value: function() {
                        var e, t, n = this.composerList;
                        t = n.length;
                        for (e = 0; e < t; e++) n[e].unload();
                        n.splice(0, t)
                    }
                },
                localizer: {
                    value: null
                },
                _waitForLocalizerMessages: {
                    value: !1
                },
                waitForLocalizerMessages: {
                    enumerable: !1,
                    get: function() {
                        return this._waitForLocalizerMessages
                    },
                    set: function(e) {
                        if (this._waitForLocalizerMessages !== e) if (e === !0 && !this.localizer.messages) {
                            if (!this.localizer) throw "Cannot wait for messages on localizer if it is not set";
                            this._waitForLocalizerMessages = !0;
                            var t = this;
                            u.debug(this, "waiting for messages from localizer"), this.canDrawGate.setField("messages", !1), this.localizer.messagesPromise.then(function(e) {
                                u.isDebug && u.debug(t, "got messages from localizer"), t.canDrawGate.setField("messages", !0)
                            })
                        } else this._waitForLocalizerMessages = !1, this.canDrawGate.setField("messages", !0)
                    }
                },
                _elementAttributeValues: {
                    value: null
                },
                _elementAttributeDescriptors: {
                    value: null
                },
                _getElementAttributeDescriptor: {
                    value: function(e) {
                        var t, n = this;
                        while (n && n._elementAttributeDescriptors) {
                            t = n._elementAttributeDescriptors[e];
                            if (t) break;
                            n = Object.getPrototypeOf(n)
                        }
                        return t
                    }
                },
                defineAttribute: {
                    value: function(e, t) {
                        t = t || {};
                        var n = "_" + e,
                            i = {
                                configurable: typeof t.configurable == "undefined" ? !0 : t.configurable,
                                enumerable: typeof t.enumerable == "undefined" ? !0 : t.enumerable,
                                set: function(e, t) {
                                    return function(n) {
                                        var r = this._getElementAttributeDescriptor(e, this);
                                        r && "boolean" === r.dataType && (n = n || n === "" ? !0 : !1), typeof n != "undefined" && this[t] !== n && (this[t] = n, this._elementAttributeValues === null && (this._elementAttributeValues = {}), this._elementAttributeValues[e] = n, this.needsDraw = !0)
                                    }
                                }(e, n),
                                get: function(e, t) {
                                    return function() {
                                        return this[t]
                                    }
                                }(e, n)
                            };
                        r.defineProperty(this, n, {
                            value: null
                        }), r.defineProperty(this, e, i)
                    }
                },
                addAttributes: {
                    value: function(e) {
                        var t, n, r, i;
                        this._elementAttributeDescriptors = e;
                        for (r in e) e.hasOwnProperty(r) && (i = e[r], i === null || String.isString(i) ? (n = {
                            value: i,
                            dataType: "string"
                        }, e[r] = n) : n = i, typeof this[r] == "undefined" && this.defineAttribute(r, n))
                    }
                },
                _willPrepareForDraw: {
                    value: function() {
                        var e, t, n, r, i, s, o;
                        e = this.element.attributes;
                        if (e) {
                            n = e.length;
                            for (t = 0; t < n; t++) {
                                r = e[t].name, i = e[t].value, o = this._getElementAttributeDescriptor(r, this);
                                if (o || typeof this[r] != "undefined") {
                                    this._elementAttributeValues === null && (this._elementAttributeValues = {});
                                    if (typeof this._elementAttributeValues[r] == "undefined") {
                                        this._elementAttributeValues[r] = i;
                                        if (typeof this[r] == "undefined" || this[r] == null) this[r] = i
                                    }
                                }
                            }
                        }
                        o = this._getElementAttributeDescriptor("textContent", this);
                        if (o) {
                            var u = this.element.textContent;
                            typeof this._elementAttributeValues.textContent == "undefined" && (this._elementAttributeValues.textContent = u, this.textContent == null && (this.textContent = u))
                        }
                        if (this._elementAttributeDescriptors) for (s in this._elementAttributeDescriptors) {
                            o = this._elementAttributeDescriptors[s];
                            var a = "_" + s;
                            this[a] === null && o !== null && "value" in o && (this[a] = this._elementAttributeDescriptors[s].value)
                        }
                    }
                },
                _draw: {
                    value: function() {
                        var e = this.element,
                            t;
                        for (var n in this._elementAttributeValues) if (this._elementAttributeValues.hasOwnProperty(n)) {
                            var r = this[n];
                            t = this._getElementAttributeDescriptor(n, this), t && (t.dataType === "boolean" ? r === !0 ? (e[n] = !0, e.setAttribute(n, n.toLowerCase())) : (e[n] = !1, e.removeAttribute(n)) : typeof r != "undefined" && (n === "textContent" ? e.textContent = r : e.setAttribute(n, r))), delete this._elementAttributeValues[n]
                        }
                    }
                }
            }),
            h = r.create(c, {
                init: {
                    value: function() {
                        return this
                    }
                },
                needsDraw: {
                    enumerable: !0,
                    get: function() {
                        return !1
                    },
                    set: function(e) {
                        if (this._needsDraw !== e) {
                            this._needsDraw = !! e;
                            if (e) {
                                var t = this.childComponents;
                                for (var n = 0, r; r = t[n]; n++) a.isDebug && a.debug(this, "needsDraw = true for: " + r._montage_metadata.exportedSymbol), r.needsDraw = !0
                            }
                        }
                    }
                },
                canDrawGate: {
                    get: function() {
                        return this._canDrawGate || (this._canDrawGate = s.create().initWithDelegate(this))
                    }
                },
                _clearNeedsDrawTimeOut: {
                    value: null
                },
                _needsDrawList: {
                    value: []
                },
                _cannotDrawList: {
                    value: null
                },
                componentBlockDraw: {
                    value: function(e) {
                        this._cannotDrawList = this._cannotDrawList ? this._cannotDrawList : {}, this._cannotDrawList[e.uuid] = e, this._clearNeedsDrawTimeOut && (window.clearTimeout(this._clearNeedsDrawTimeOut), this._clearNeedsDrawTimeOut = null)
                    }
                },
                componentCanDraw: {
                    value: function(e, t) {
                        if (t) {
                            delete this._cannotDrawList[e.uuid], this._needsDrawList.push(e);
                            if (Object.keys(this._cannotDrawList).length === 0 && this._needsDrawList.length > 0 && !this._clearNeedsDrawTimeOut) {
                                var n = this;
                                this._clearNeedsDrawTimeOut = window.setTimeout(function() {
                                    n._clearNeedsDrawList()
                                }, 0)
                            }
                        } else this._clearNeedsDrawTimeOut && (window.clearTimeout(this._clearNeedsDrawTimeOut), this._clearNeedsDrawTimeOut = null)
                    }
                },
                _clearNeedsDrawList: {
                    value: function() {
                        var e, t, n, r = this._needsDrawList;
                        n = r.length;
                        for (t = 0; t < n; t++) e = r[t], e.needsDraw && e._addToParentsDrawList();
                        this._clearNeedsDrawTimeOut = null, r.splice(0, n)
                    }
                },
                removeFromCannotDrawList: {
                    value: function(e) {
                        delete this._cannotDrawList[e];
                        if (Object.keys(this._cannotDrawList).length === 0 && this._needsDrawList.length > 0 && !this._clearNeedsDrawTimeOut) {
                            var t = this;
                            this._clearNeedsDrawTimeOut = window.setTimeout(function() {
                                t._clearNeedsDrawList()
                            }, 0)
                        }
                    }
                },
                _cancelDrawIfScheduled: {
                    value: function() {
                        var e = this.requestedAnimationFrame,
                            t = this.cancelAnimationFrame;
                        e !== null && (this._frameTime || (u.isDebug && u.debug(this, "clearing draw"), t ? t.call(window, e) : window.clearTimeout(e), this.requestedAnimationFrame = null))
                    }
                },
                _addToDrawList: {
                    value: function(e) {
                        this.__addToDrawList(e), a.isDebug && a.debug(this, this.canDrawGate.value, this.requestedAnimationFrame), this.drawTree()
                    },
                    enumerable: !1
                },
                addToComposerList: {
                    value: function(e) {
                        this.composerList.push(e), a.isDebug && a.debug(this, e, "Added to composer list"), this._scheduleComposerRequest = !0, this.drawTree()
                    }
                },
                composerListSwap: {
                    value: [],
                    distinct: !0
                },
                _scheduleComposerRequest: {
                    value: !1
                },
                requestedAnimationFrame: {
                    value: null,
                    enumerable: !1
                },
                requestAnimationFrame: {
                    value: window.webkitRequestAnimationFrame ? window.webkitRequestAnimationFrame : window.mozRequestAnimationFrame,
                    enumerable: !1
                },
                cancelAnimationFrame: {
                    value: window.webkitCancelRequestAnimationFrame ? window.webkitCancelRequestAnimationFrame : window.mozCancelRequestAnimationFrame,
                    enumerable: !1
                },
                _frameTime: {
                    value: null
                },
                _oldSource: {
                    value: null
                },
                _diff: {
                    value: function(e, t) {
                        var n = {}, r = {};
                        for (var i = 0; i < t.length; i++) n[t[i]] == null && (n[t[i]] = {
                            rows: [],
                            o: null
                        }), n[t[i]].rows.push(i);
                        for (i = 0; i < e.length; i++) r[e[i]] == null && (r[e[i]] = {
                            rows: [],
                            n: null
                        }), r[e[i]].rows.push(i);
                        for (i in n) n[i].rows.length == 1 && typeof r[i] != "undefined" && r[i].rows.length == 1 && (t[n[i].rows[0]] = {
                            text: t[n[i].rows[0]],
                            row: r[i].rows[0]
                        }, e[r[i].rows[0]] = {
                            text: e[r[i].rows[0]],
                            row: n[i].rows[0]
                        });
                        for (i = 0; i < t.length - 1; i++) t[i].text != null && t[i + 1].text == null && t[i].row + 1 < e.length && e[t[i].row + 1].text == null && t[i + 1] == e[t[i].row + 1] && (t[i + 1] = {
                            text: t[i + 1],
                            row: t[i].row + 1
                        }, e[t[i].row + 1] = {
                            text: e[t[i].row + 1],
                            row: i + 1
                        });
                        for (i = t.length - 1; i > 0; i--) t[i].text != null && t[i - 1].text == null && t[i].row > 0 && e[t[i].row - 1].text == null && t[i - 1] == e[t[i].row - 1] && (t[i - 1] = {
                            text: t[i - 1],
                            row: t[i].row - 1
                        }, e[t[i].row - 1] = {
                            text: e[t[i].row - 1],
                            row: i - 1
                        });
                        return {
                            o: e,
                            n: t
                        }
                    }
                },
                _previousDrawDate: {
                    enumerable: !1,
                    value: 0
                },
                drawTree: {
                    value: function() {
                        if (this.requestedAnimationFrame === null) {
                            a.isDebug && a.debug(this, "requesting a draw");
                            var e = this,
                                t = this.requestAnimationFrame,
                                n = function(t) {
                                    e._frameTime = t ? t : Date.now(), e._clearNeedsDrawTimeOut && e._clearNeedsDrawList();
                                    if (a.isDebug) {
                                        var n = document.documentElement.innerHTML;
                                        if (e._oldSource && n !== e._oldSource) {
                                            var r = ["DOM modified outside of the draw loop"],
                                                i = e._diff(e._oldSource.split("\n"), n.split("\n"));
                                            for (var s = 0; s < i.n.length; s++) if (i.n[s].text == null) r.push("+ " + i.n[s]);
                                            else for (var o = i.n[s].row + 1; o < i.o.length && i.o[o].text == null; o++) r.push("- " + i.o[o]);
                                            console.warn(r.join("\n"))
                                        }
                                        console.group((t ? a.toTimeString(new Date(t)) + " " : "") + "Draw Fired")
                                    }
                                    e.drawIfNeeded(), a.isDebug && (console.groupEnd(), e._oldSource = document.documentElement.innerHTML), e._frameTime = null, e._scheduleComposerRequest && e.drawTree()
                                };
                            if (t) this.requestedAnimationFrame = t.call(window, n);
                            else {
                                var r = Date.now(),
                                    i = 17 - r + this._previousDrawDate;
                                i < 0 && (i = 0), this.requestedAnimationFrame = setTimeout(n, i), this._previousDrawDate = r + i
                            }
                            this._scheduleComposerRequest = !1
                        }
                    },
                    enumerable: !1
                },
                _readyToDrawList: {
                    enumerable: !1,
                    value: []
                },
                _readyToDrawListIndex: {
                    enumerable: !1,
                    value: null
                },
                addToDrawCycle: {
                    value: function(e) {
                        var t = this._readyToDrawListIndex,
                            n, r;
                        if (t.hasOwnProperty(e.uuid)) {
                            a.isDebug && a.debug("components should not be added to the draw cycle twice");
                            return
                        }
                        this._readyToDrawList.push(e), this._readyToDrawListIndex[e.uuid] = !0, e._updateComponentDom()
                    }
                },
                drawIfNeeded: {
                    value: function() {
                        var e = this._readyToDrawList,
                            t, n, r, i = 0,
                            s, o = this.composerList,
                            u, f;
                        e.length = 0, f = o.length, this._readyToDrawListIndex = {};
                        if (f > 0) {
                            this.composerList = this.composerListSwap;
                            for (n = 0; n < f; n++) u = o[n], u.needsFrame = !1, u.frame(this._frameTime);
                            o.splice(0, f), this.composerListSwap = o
                        }
                        this._drawIfNeeded(0), r = e.length;
                        while (i < r) {
                            for (n = i; n < r; n++) t = e[n], typeof t.willDraw == "function" && t.willDraw(this._frameTime), a.isDebug && a.debug(t._montage_metadata.objectName, " willDraw treeLevel ", t._treeLevel);
                            this._drawIfNeeded(0), i = r, r = e.length
                        }
                        var l = function(e, t) {
                            return e._treeLevel - t._treeLevel
                        };
                        e.sort(l);
                        for (n = 0; n < r; n++) t = e[n], t.needsDraw = !1;
                        this.requestedAnimationFrame = null;
                        for (n = r - 1; n >= 0; n--) t = e[n], t._draw(this._frameTime), t.draw(this._frameTime), a.isDebug && a.debug(t._montage_metadata.objectName, " draw treeLevel ", t._treeLevel);
                        for (n = 0; n < r; n++) t = e[n], t.didDraw(this._frameTime), t._completedFirstDraw || (s = document.createEvent("CustomEvent"), s.initCustomEvent("firstDraw", !0, !1, null), t.dispatchEvent(s), t._completedFirstDraw = !0), a.isDebug && a.debug(t._montage_metadata.objectName, " didDraw treeLevel ", t._treeLevel);
                        return !!e.length
                    }
                },
                element: {
                    get: function() {
                        return this._element
                    },
                    set: function(e) {
                        f.registerEventHandlerForElement(this, e), this._element = e
                    }
                }
            });
        h.init(), t.__root__ = h
    }
}), montageDefine("06501b6", "ui/controller/array-controller", {
    dependencies: ["montage", "ui/controller/object-controller", "core/change-notification", "ui/controller/array-controller"],
    factory: function(e, t, n) {
        var r = e("montage").Montage,
            i = e("ui/controller/object-controller").ObjectController,
            s = e("core/change-notification").ChangeNotification,
            o = t.ArrayController = r.create(i, {
                didCreate: {
                    value: function() {
                        var e = this;
                        this.addPropertyChangeListener("selections", function() {
                            var t = [];
                            e._selections.forEach(function(e, n) {
                                e && t.push(n)
                            }), e.selectedIndexes = t
                        }), this.addPropertyChangeListener("content", function() {
                            e.selectedObjects = null, e.automaticallyOrganizeObjects && e.organizeObjects()
                        })
                    }
                },
                _content: {
                    value: null
                },
                content: {
                    get: function() {
                        return this._content
                    },
                    set: function(e) {
                        if (this._content === e) return;
                        this._content = e
                    }
                },
                delegate: {
                    value: null
                },
                _organizedObjects: {
                    distinct: !0,
                    value: []
                },
                organizedObjects: {
                    get: function() {
                        return this._organizedObjects
                    }
                },
                automaticallyOrganizeObjects: {
                    value: !0
                },
                _sortFunction: {
                    value: null
                },
                sortFunction: {
                    get: function() {
                        return this._sortFunction
                    },
                    set: function(e) {
                        if (this._sortFunction === e) return;
                        this._sortFunction = e, this.automaticallyOrganizeObjects && this.organizeObjects()
                    }
                },
                _filterFunction: {
                    value: null
                },
                filterFunction: {
                    get: function() {
                        return this._filterFunction
                    },
                    set: function(e) {
                        if (this._filterFunction === e) return;
                        this._filterFunction = e, this.automaticallyOrganizeObjects && this.organizeObjects()
                    }
                },
                _startIndex: {
                    value: null
                },
                startIndex: {
                    get: function() {
                        return this._startIndex
                    },
                    set: function(e) {
                        if (this._startIndex === e) return;
                        this._startIndex = e, this.automaticallyOrganizeObjects && this.organizeObjects()
                    }
                },
                _endIndex: {
                    enumerable: !1,
                    value: null
                },
                endIndex: {
                    get: function() {
                        return this._endIndex
                    },
                    set: function(e) {
                        if (this._endIndex === e) return;
                        this._endIndex = e, this.automaticallyOrganizeObjects && this.organizeObjects()
                    }
                },
                _organizedObjectsIndexes: {
                    value: null
                },
                _rangedOrganizedObjectsIndexes: {
                    value: null
                },
                _selectedIndexes: {
                    value: null
                },
                selectedIndexes: {
                    get: function() {
                        return this._selectedIndexes ? this._selectedIndexes : this.selectedContentIndexes ? this._selectedIndexes = this._convertIndexesFromContentToOrganized(this.selectedContentIndexes) : null
                    },
                    set: function(e) {
                        if (this.selectedIndexes !== e) {
                            var t = e ? this._convertIndexesFromOrganizedToContent(e) : null,
                                n = null;
                            if (this.delegate && typeof this.delegate.shouldChangeSelection == "function") {
                                t && (n = this.content.filter(function(e, n) {
                                    return t.indexOf(n) >= 0
                                }, this));
                                if (this.delegate.shouldChangeSelection(this, n, this._selectedObjects) === !1) return
                            }
                            this.dispatchPropertyChange("selections", "selectedContentIndexes", "selectedObjects", function() {
                                this._selectedIndexes = e, this._selectedContentIndexes = t, this._selectedObjects = null, this._selections = null
                            })
                        }
                    }
                },
                _convertIndexesFromOrganizedToContent: {
                    value: function(e) {
                        var t, n = [],
                            r, i = e.length,
                            s, o;
                        r = this._rangedOrganizedObjectsIndexes ? this._rangedOrganizedObjectsIndexes : this._organizedObjectsIndexes;
                        if (r) {
                            o = r.length;
                            for (t = 0; t < i; t++) s = e[t], s < o && s >= 0 && (n[n.length] = r[s])
                        } else for (t = 0; t < i; t++) n[n.length] = e[t] + this.startIndex;
                        return n.sort()
                    }
                },
                _convertIndexesFromContentToOrganized: {
                    value: function(e) {
                        var t, n = [],
                            r, i = e.length,
                            s;
                        r = this._rangedOrganizedObjectsIndexes ? this._rangedOrganizedObjectsIndexes : this._organizedObjectsIndexes;
                        if (r) for (t = 0; t < i; t++) s = e[t], s >= 0 && (s = r.indexOf(s), s !== -1 && (n[n.length] = s));
                        else for (t = 0; t < i; t++) s = e[t] - this.startIndex, s > -1 && (this.endIndex == null || s < this.endIndex) && (n[n.length] = s);
                        return n.sort()
                    }
                },
                organizeObjects: {
                    value: function() {
                        var e = this.content,
                            t = this.filterFunction,
                            n = this.sortFunction,
                            r = 0,
                            i = 0,
                            s, o, u, a;
                        e && typeof t == "function" && (s = [], e = e.filter(function(e) {
                            var n = t.call(this, e);
                            return n && (s[i] = r, i++), r++, n
                        }, this));
                        if (typeof n == "function") {
                            o = [], u = [], r = 0;
                            for (r = 0; a = e[r]; r++) a !== null && typeof a == "object" ? (a._montage_array_controller_index = r, u[r] = a) : u[r] = {
                                _montage_array_controller_index: r,
                                _montage_array_controller_value: a
                            };
                            u = u.sort(function(e, t) {
                                return e._montage_array_controller_value && (e = e._montage_array_controller_value), t._montage_array_controller_value && (t = t._montage_array_controller_value), n.call(this, e, t)
                            }), e = [];
                            for (r = 0; a = u[r]; r++) i = a._montage_array_controller_index, o[r] = s ? s[i] : i, a._montage_array_controller_value ? e[r] = a._montage_array_controller_value : (e[r] = a, delete a._montage_array_controller_index);
                            this._organizedObjectsIndexes = o
                        } else this._organizedObjectsIndexes = s;
                        this._applyRangeIfNeeded(e)
                    }
                },
                _applyRangeIfNeeded: {
                    value: function(e) {
                        var t = this.startIndex,
                            n = this.endIndex;
                        e && (typeof t == "number" || typeof n == "number") && (t = typeof t == "number" && t >= 0 ? t : 0, n = typeof n == "number" && n < e.length ? n : e.length, e = e.slice(t, n), this._organizedObjectsIndexes ? this._rangedOrganizedObjectsIndexes = this._organizedObjectsIndexes.slice(t, n) : this._rangedOrganizedObjectsIndexes = null), this.dispatchPropertyChange("organizedObjects", function() {
                            this._organizedObjects = e ? e : []
                        })
                    }
                },
                _selectedObjects: {
                    value: null
                },
                selectedObjects: {
                    get: function() {
                        return this._selectedObjects ? this._selectedObjects : this._selectedContentIndexes ? (this.content && (this._selectedObjects = this.content.filter(function(e, t) {
                            return this._selectedContentIndexes.indexOf(t) >= 0
                        }, this)), this._selectedObjects) : null
                    },
                    set: function(e) {
                        e === null || typeof e == "undefined" ? e = null : Array.isArray(e) || (e = [e]);
                        if (this.selectedObjects === e) return;
                        if (this.delegate && typeof this.delegate.shouldChangeSelection == "function" && this.delegate.shouldChangeSelection(this, e, this._selectedObjects) === !1) return;
                        this.dispatchPropertyChange("selections", "selectedContentIndexes", "selectedIndexes", function() {
                            this._selectedObjects = e, this._selectedContentIndexes = null, this._selectedIndexes = null, this._selections = null
                        })
                    }
                },
                _selectedContentIndexes: {
                    value: null
                },
                selectedContentIndexes: {
                    get: function() {
                        if (this._selectedContentIndexes) return this._selectedContentIndexes;
                        if (!this._selectedObjects) return null;
                        this._selectedContentIndexes = [];
                        var e;
                        return this._selectedObjects.forEach(function(t) {
                            (e = this.content.indexOf(t)) !== -1 && this._selectedContentIndexes.push(e)
                        }, this), this._selectedContentIndexes
                    },
                    set: function(e) {
                        e === null || e === !1 || typeof e == "undefined" ? e = null : Array.isArray(e) || (e = [e]);
                        if (this.selectedContentIndexes === e) return;
                        if (this.delegate && typeof this.delegate.shouldChangeSelection == "function") {
                            var t = e,
                                n = null;
                            t && (n = this.content.filter(function(e, n) {
                                return t.indexOf(n) >= 0
                            }, this));
                            if (this.delegate.shouldChangeSelection(this, n, this._selectedObjects) === !1) return
                        }
                        this._selectedContentIndexes = e, this.dispatchPropertyChange("selections", "selectedIndexes", "selectedObjects", function() {
                            this._selectedIndexes = null, this._selectedObjects = null, this._selections = null
                        })
                    }
                },
                _selections: {
                    value: null
                },
                selections: {
                    get: function() {
                        if (!this._selections) {
                            this._selections = new Array(this._organizedObjects.length);
                            if (this.selectedIndexes) {
                                var e = this._selections,
                                    t = this.selectedIndexes,
                                    n = t.length,
                                    r, i;
                                for (r = 0; r < n; r++) i = t[r], i < e.length && (e[i] = !0)
                            }
                        }
                        return this._selections
                    }
                },
                initWithContent: {
                    value: function(e) {
                        return this.content = e, this
                    }
                },
                selectObjectsOnAddition: {
                    value: !1
                },
                clearFilterFunctionOnAddition: {
                    value: !0
                },
                add: {
                    value: function() {
                        var e = this.newObject();
                        this.content.push(e), this.selectObjectsOnAddition && (this.selectedContentIndexes = [this.content.length - 1]), this.clearFilterFunctionOnAddition && (this.filterFunction = null), this.automaticallyOrganizeObjects && this.organizeObjects()
                    }
                },
                addObjects: {
                    value: function() {
                        var e = Array.prototype.slice.call(arguments),
                            t, n = e.length,
                            r, i, s = this.content;
                        s ? s.push.apply(s, e) : this.content = s = e;
                        if (this.selectObjectsOnAddition) {
                            r = [], i = s.length - n;
                            for (t = 0; t < n; t++) r[t] = i++;
                            this.selectedContentIndexes = r, this.selectedObjects = e
                        }
                        this.clearFilterFunctionOnAddition && (this.filterFunction = null), this.automaticallyOrganizeObjects && this.organizeObjects()
                    }
                },
                remove: {
                    value: function() {
                        var e;
                        return this.selectedObjects && this.selectedObjects.length > 0 && (e = this.removeObjects.apply(this, this.selectedObjects), this.automaticallyOrganizeObjects && this.organizeObjects()), e
                    }
                },
                removeObjects: {
                    value: function() {
                        var e = Array.prototype.slice.call(arguments),
                            t;
                        return t = this.content.filter(function(t) {
                            return e.indexOf(t) < 0
                        }), this.content = t, this.automaticallyOrganizeObjects && this.organizeObjects(), e
                    }
                },
                removeObjectsAtSelectedIndexes: {
                    value: function() {
                        return this.removeObjectsAtIndexes(this.selectedIndexes)
                    }
                },
                removeObjectsAtIndexes: {
                    value: function(e) {
                        var t, n;
                        return e && e.length > 0 && (t = [], n = this.content.filter(function(n, r) {
                            return e.indexOf(r) < 0 ? !0 : (t.push(n), !1)
                        }), this.content = n, this.automaticallyOrganizeObjects && this.organizeObjects()), t
                    }
                }
            })
    }
}), montageDefine("06501b6", "ui/template", {
    dependencies: ["montage", "core/serializer", "core/deserializer", "core/logger", "core/event/event-manager", "ui/application"],
    factory: function(e, t, n) {
        t = typeof t != "undefined" ? t : {};
        var r = e("montage").Montage,
            i = e("core/serializer").Serializer,
            s = e("core/deserializer").Deserializer,
            o = e("core/logger").logger("template"),
            u = e("core/event/event-manager").defaultEventManager,
            a, f = t.Template = r.create(r, {
                _OLD_SCRIPT_TYPE: {
                    value: "text/m-objects"
                },
                _SCRIPT_TYPE: {
                    value: "text/montage-serialization"
                },
                _document: {
                    enumerable: !1,
                    value: null
                },
                document: {
                    get: function() {
                        return this._document
                    }
                },
                _require: {
                    value: window.require
                },
                _externalObjects: {
                    value: null
                },
                _ownerSerialization: {
                    value: null
                },
                _rootUrl: {
                    value: null
                },
                _isLoaded: {
                    value: !1
                },
                delegate: {
                    value: null
                },
                initWithDocument: {
                    value: function(e, t) {
                        return t && (this._require = t), this._document = e, this
                    }
                },
                __templatesById: {
                    value: {}
                },
                __templateCallbacksByModuleId: {
                    value: {}
                },
                templateWithModuleId: {
                    value: function(e, t, n) {
                        var r = e.location + t,
                            i = this.__templatesById[r],
                            s = function(e) {
                                e.__templateCallbacksByModuleId[r].forEach(function(t) {
                                    t.call(this, e)
                                }), delete e.__templateCallbacksByModuleId[r]
                            };
                        return i ? i._isLoaded ? n(i) : this.__templateCallbacksByModuleId[r].push(n) : (this.__templateCallbacksByModuleId[r] = [n], this.__templatesById[r] = i = this.create().initWithModuleId(e, t, s)), i
                    }
                },
                templateWithComponent: {
                    value: function(e, t) {
                        var n = e._templateId,
                            r = this.__templatesById[n],
                            i;
                        if (!r) {
                            r = this.create(), r.delegate = t, r.initWithComponent(e), i = r._externalObjects;
                            if (!i || Object.keys(i).length === 0) this.__templatesById[n] = r
                        }
                        return r
                    }
                },
                _deserializer: {
                    value: null
                },
                deserializer: {
                    get: function() {
                        return this._deserializer || (this._deserializer = s.create().initWithString(this._rootObjectSerialization))
                    }
                },
                initWithHtmlString: {
                    value: function(e) {
                        var t = this.createHtmlDocumentFromString(e);
                        return this._isLoaded = !0, this.initWithDocument(t), this
                    }
                },
                initWithModuleId: {
                    value: function(e, t, n) {
                        var r = this;
                        return this._require = e, this.createHtmlDocumentFromModuleId(e, t, function(e) {
                            if (!e) throw "Template '" + t + "' not found.";
                            r._isLoaded = !0, r.initWithDocument(e), n && n(r)
                        }), this
                    }
                },
                _serializer: {
                    value: null
                },
                serializer: {
                    get: function() {
                        return this._serializer || (this._serializer = i.create().initWithRequire(this._require))
                    }
                },
                serializeObjectProperties: {
                    enumerable: !1,
                    value: function() {
                        var e = this.delegate;
                        if (e && typeof e.serializeObjectProperties == "function") return e.serializeObjectProperties.apply(e, arguments)
                    }
                },
                initWithComponent: {
                    value: function(e) {
                        var t = document.implementation.createHTMLDocument(""),
                            n = this.serializer,
                            r, i, s, o, u, a;
                        this._document = t, n.delegate = this.delegate ? this : null, this._ownerSerialization = n.serialize({
                            owner: e
                        }), this._externalObjects = n.getExternalObjects(), i = n.getExternalElements();
                        var o = i.length;
                        if (o > 1) for (var f = 0; f < o; f++) {
                            u = i[f];
                            for (var l = 0; l < o; l++) if (f !== l) {
                                var a = i[l];
                                while ((a = a.parentNode) && a !== u);
                                a && (i.splice(l, 1), o--, l--, f > l && f--)
                            }
                        }
                        for (var f = 0; s = i[f]; f++) t.body.appendChild(t.importNode(s, !0));
                        return this._deserializer = this._createDeserializer(this._ownerSerialization), this
                    }
                },
                optimize: {
                    value: function() {
                        this.deserializer.optimizeForDocument(this._document)
                    }
                },
                _deserialize: {
                    value: function(t, n, r) {
                        typeof a == "undefined" && (a = e("ui/application").application);
                        var i = this;
                        this.getDeserializer(function(e) {
                            var s;
                            if (e) {
                                s = i._externalObjects;
                                if (s) for (var o in s) o in t || (t[o] = s[o]);
                                t.application = a, t.template = i, i._document === window.document ? e.deserializeWithInstancesAndDocument(t, i._document, r) : e.deserializeWithInstancesAndElementForDocument(t, i._document.body, n, r)
                            } else r()
                        })
                    }
                },
                instantiateWithOwnerAndDocument: {
                    value: function(e, t, n) {
                        return this.instantiateWithInstancesAndDocument({
                            owner: e
                        }, t, n)
                    }
                },
                instantiateWithInstancesAndDocument: {
                    value: function(e, t, n) {
                        var r = this;
                        this._partiallyInstantiateWithInstancesForDocument(e, t, function(t) {
                            t && (delete e.application, delete e.template, r._invokeTemplateDidLoad(t, t.owner && t.owner.templateObjects)), r.waitForStyles(function() {
                                n(t ? t.owner : null)
                            })
                        })
                    }
                },
                instantiateWithComponent: {
                    value: function(e, t) {
                        var n = this,
                            r = e.templateObjects;
                        r ? r.owner = e : r = {
                            owner: e
                        }, this._partiallyInstantiateWithInstancesForDocument(r, e.element.ownerDocument, function(i) {
                            delete r.owner, delete r.application, delete r.template, i && n._invokeTemplateDidLoad(i, !e._isTemplateLoaded && r), n.waitForStyles(function() {
                                t(i ? i.owner : null)
                            })
                        })
                    }
                },
                instantiateWithDocument: {
                    value: function(e, t) {
                        return this.instantiateWithOwnerAndDocument(null, e, t)
                    }
                },
                _partiallyInstantiateWithInstancesForDocument: {
                    value: function(e, t, n) {
                        function r(e) {
                            i._document !== t && i.exportHeaders(t), n(e)
                        }
                        var i = this,
                            s = e.owner;
                        !t && s && s._element && (t = s._element.ownerDocument), this._deserialize(e, t, function(e, t) {
                            if (i._extends && !i._isExpanded) {
                                var n = i._extends,
                                    t = n.element,
                                    s = n.instances,
                                    o = n.instancesMapping,
                                    u = n.elementId;
                                !t && u && (t = t.querySelector("*[data-montage-id='" + u + "']"));
                                if (!s) if (o) {
                                    s = {};
                                    for (var a in o) s[a] = e[o[a]];
                                    s.owner = e.owner
                                } else s = {
                                    owner: e.owner
                                };
                                i._extendsTemplateWithInstances(n.templateModuleId, t, s, function(t) {
                                    var n = Object.keys(t);
                                    for (var i = 0, s; s = n[i]; i++) e[s] = t[s];
                                    r(e)
                                })
                            } else r(e)
                        })
                    }
                },
                instantiate: {
                    value: function(e) {
                        return this.instantiateWithOwnerAndDocument(null, null, e)
                    }
                },
                _templateObjectDescriptor: {
                    value: {
                        enumerable: !0,
                        configurable: !0
                    }
                },
                _createTemplateObjectGetter: {
                    value: function(e, t) {
                        var n = "@" + t,
                            r, i, s;
                        return function() {
                            if (r) return e.querySelectorAllComponent(n, e);
                            i = e.querySelectorAllComponent(n, e);
                            if (i.length === 1) {
                                s = i[0];
                                while (s = s.parentComponent) {
                                    if (s === e) return Object.defineProperty(this, t, {
                                        value: i[0]
                                    }), i[0];
                                    if (s.clonesChildComponents) break
                                }
                            }
                            return r = !0, i
                        }
                    }
                },
                _invokeTemplateDidLoad: {
                    value: function(e, t) {
                        var n = e.owner,
                            r = Object.keys(e),
                            i, s = n && typeof n.templateDidDeserializeObject == "function";
                        for (var o = 0, u; u = e[i = r[o]]; o++) n !== u && (typeof u._deserializedFromTemplate == "function" && u._deserializedFromTemplate(n), typeof u.deserializedFromTemplate == "function" && u.deserializedFromTemplate(n), s && n.templateDidDeserializeObject(u), t && (u.parentComponent === n || !u.ownerComponent ? t[i] = u : (this._templateObjectDescriptor.get = this._createTemplateObjectGetter(u.ownerComponent, i), Object.defineProperty(t, i, this._templateObjectDescriptor))));
                        n && (typeof n._templateDidLoad == "function" && n._templateDidLoad(), typeof n.templateDidLoad == "function" && n.templateDidLoad())
                    }
                },
                defineExtension: {
                    value: function(e, t, n) {
                        this._extends = {
                            templateModuleId: e,
                            element: t,
                            instancesMapping: n
                        }
                    }
                },
                _extendsTemplateWithInstances: {
                    value: function(e, t, n, r) {
                        function i(e, t, n) {
                            var r = t.nextSibling,
                                i = t.parentNode,
                                s = e.childNodes,
                                o = e.attributes;
                            i.removeChild(t);
                            if (r) for (var u = 0, a = s.length; u < a; u++) i.insertBefore(s[0], r);
                            else for (var u = 0, a = s.length; u < a; u++) i.appendChild(s[0]);
                            for (var u = 0, f; f = o[u]; u++) {
                                var l = f.nodeName;
                                if (l === "id" || l === "data-montage-id") continue;
                                var c = (n.getAttribute(l) || "") + " " + f.nodeValue;
                                n.setAttribute(l, c)
                            }
                        }
                        var s = this,
                            o = n.owner,
                            u, a;
                        u = o._templateElement, a = u.ownerDocument, o._templateElement = null, f.templateWithModuleId(this._require, e, function(e) {
                            e._partiallyInstantiateWithInstancesForDocument({
                                owner: o
                            }, a, function(n) {
                                i(o._templateElement, t, u);
                                if (!s._isExpanded) {
                                    var a = s.getMontageIdByElement(t),
                                        f = s.getMontageIdByElement(u),
                                        l = s.getMontageIdByElement(o._templateElement);
                                    i(s._document.importNode(e.getMontageElementById(l), !0), s.getMontageElementById(a), s.getMontageElementById(f)), e.exportHeaders(s._document), s._isExpanded = !0
                                }
                                s._deserializer.chainDeserializer(e._deserializer), o._templateElement = u, r(n)
                            })
                        })
                    }
                },
                getMontageIdByElement: {
                    value: function(e) {
                        return e.getAttribute("data-montage-id") || e.id
                    }
                },
                getMontageElementById: {
                    value: function(e) {
                        return this._document.querySelector("*[data-montage-id='" + e + "']") || this._document.getElementById(e)
                    }
                },
                exportHeaders: {
                    value: function(e) {
                        this.insertStylesInDocumentIfNeeded(e), this.insertScriptsInDocumentIfNeeded(e)
                    }
                },
                _stylesLoadedCount: {
                    enumerable: !1,
                    value: null
                },
                _expectedStylesLoadedCount: {
                    enumerable: !1,
                    value: null
                },
                _stylesLoadedCallbacks: {
                    enumerable: !1,
                    value: null
                },
                insertStylesInDocumentIfNeeded: {
                    value: function(e) {
                        var t = e._montage_importedStyles,
                            n = this._id,
                            r;
                        if (!n || !e) return;
                        t || (t = e._montage_importedStyles = {
                            fromTemplates: {},
                            fromLinks: {}
                        }), r = t.fromTemplates;
                        if (n in r) return;
                        r[n] = !0;
                        var i = this,
                            s = this._rootUrl,
                            u = e.head,
                            a = this._stylesLoadedCallbacks = [],
                            f = this._document.querySelectorAll('link[rel="stylesheet"], style'),
                            l = f.length,
                            c = t.fromLinks,
                            h = l > 1 ? e.createDocumentFragment() : u,
                            p;
                        this._stylesLoadedCount = 0, this._expectedStylesLoadedCount = 0;
                        for (var d = 0, v; v = f[d]; d++) if (p = v.getAttribute("href")) {
                            /^https?:\/\/|^\//.test(p) || (v.href = s + p, p = v.href);
                            if (p in c) continue;
                            c[p] = !0, this._expectedStylesLoadedCount++;
                            var m = e.importNode(v, !1);
                            m.href = p, h.insertBefore(m, h.firstChild), o.isDebug && h.insertBefore(e.createComment("Inserted from " + this._id), h.firstChild);
                            var g = function(e) {
                                if (++i._stylesLoadedCount === i._expectedStylesLoadedCount) {
                                    var t;
                                    while (t = a.pop()) t();
                                    i._stylesLoadedCallbacks = a = null
                                }
                                this.removeEventListener(e.type, g, !1), e.type === "error" && console.log("CSS file " + p + " is missing")
                            }, y = new XMLHttpRequest;
                            y.open("GET", p), y.onreadystatechange = function(e) {
                                return function(t) {
                                    e.readyState === 4 && (e.status === 200 ? g({
                                        type: "load"
                                    }) : g({
                                        type: "error"
                                    }))
                                }
                            }(y), y.send()
                        } else h.insertBefore(e.importNode(v, !0), h.firstChild), o.isDebug && h.insertBefore(e.createComment("Inserted from " + this._id), h.firstChild);
                        l > 1 && u.insertBefore(h, u.firstChild)
                    }
                },
                insertScriptsInDocumentIfNeeded: {
                    value: function(e) {
                        var t = e._montage_importedScripts,
                            n = this._rootUrl,
                            r = n || null;
                        if (!r) return;
                        if (!t) t = e._montage_importedScripts = {
                            fromTemplate: {},
                            external: {}
                        };
                        else if (r in t.fromTemplate) return;
                        t.fromTemplate[r] = !0;
                        var i = e.head,
                            s = this._document.querySelectorAll("script"),
                            u = e.createDocumentFragment(),
                            a = t.external,
                            f, l, c, h;
                        for (var p = 0; h = s[p]; p++) {
                            l = h.type;
                            if (l === this._SCRIPT_TYPE) continue;
                            c = h.getAttribute("src"), f = e.importNode(h, !0);
                            if (c) {
                                /^https?:\/\/|^\//.test(c) || (f.src = r + c, c = f.src = f.src);
                                if (c in a) continue;
                                a[c] = !0
                            }
                            o.isDebug && u.appendChild(e.createComment("Inserted from " + this._id)), u.appendChild(f)
                        }
                        i.appendChild(u)
                    }
                },
                waitForStyles: {
                    value: function(e) {
                        this._stylesLoadedCount === this._expectedStylesLoadedCount ? e() : this._stylesLoadedCallbacks.push(e)
                    }
                },
                createHtmlDocumentFromString: {
                    value: function(e) {
                        var t = document.implementation.createHTMLDocument("");
                        t.documentElement.innerHTML = e;
                        if (!t.body) {
                            t = document.implementation.createHTMLDocument("");
                            var n = t.createRange(),
                                r = t.getElementsByTagName("head").item(0),
                                i = t.getElementsByTagName("body").item(0),
                                s, o, u, a, f, l;
                            s = e.indexOf("<head>"), s > 0 && (o = e.indexOf("</head>"), r.outerHTML = e.substring(s + 6, o)), u = e.indexOf("<body"), u > 0 && (a = e.indexOf("</body>"), f = e.substring(u, a + 7), n.selectNode(i), l = n.createContextualFragment(f), i.appendChild(l))
                        }
                        return t
                    }
                },
                _documentCache: {
                    enumerable: !1,
                    value: {}
                },
                createHtmlDocumentFromModuleId: {
                    value: function(e, t, n) {
                        var r = this,
                            i = e.location + t,
                            s = this._documentCache[i];
                        r._id = e.location + "/" + t, s ? (r._rootUrl = s.directory, n(r.createHtmlDocumentFromString(s.content))) : e.async(t).then(function(e) {
                            r._rootUrl = (r._documentCache[i] = e).directory, n(r.createHtmlDocumentFromString(e.content))
                        }).done()
                    }
                },
                getInlineSerialization: {
                    value: function(e) {
                        var t = e.querySelector("script[type='" + this._SCRIPT_TYPE + "']");
                        if (t) return t.textContent;
                        if (!this._document.querySelector("script[type='" + this._OLD_SCRIPT_TYPE + "']")) return null;
                        o.error("Unsupported serialization found" + (this._rootUrl ? " on " + this._rootUrl : "") + ", please upgrade to the new one.")
                    }
                },
                getExternalSerialization: {
                    value: function(e, t) {
                        var n = e.querySelector('link[rel="serialization"]');
                        if (n) {
                            var r = new XMLHttpRequest,
                                i = n.getAttribute("href"),
                                s = this._rootUrl || "";
                            /^https?:\/\/|^\//.test(i) || (i = s + i), r.open("GET", i), r.addEventListener("load", function() {
                                r.status == 200 ? t(r.responseText) : (o.isError && o.error("Unable to retrive " + i + ", code status: " + r.status), t(null))
                            }, !1), r.addEventListener("error", function() {
                                o.isError && o.error("Unable to retrive " + i), t(null)
                            }, !1), r.send()
                        } else t(null)
                    }
                },
                getDeserializer: {
                    value: function(e) {
                        if (this._deserializer !== null) e(this._deserializer);
                        else {
                            var t = this.getInlineSerialization(this._document),
                                n = this;
                            t ? (this._removeSerialization(), e(this._createDeserializer(t))) : this.getExternalSerialization(this._document, function(t) {
                                t ? (n._removeSerialization(), e(n._createDeserializer(t))) : e(n._deserializer = !1)
                            })
                        }
                    }
                },
                _createDeserializer: {
                    value: function(e) {
                        var t = this._rootUrl ? this._rootUrl : window.location.href;
                        return this._deserializer = s.create().initWithStringAndRequire(this._ownerSerialization = e, this._require, t)
                    }
                },
                setSerialization: {
                    value: function(e) {
                        var t = this._document.querySelector("script[type='" + this._SCRIPT_TYPE + "']"),
                            n = this._document;
                        t || (t = n.createElement("script"), t.setAttribute("type", this._SCRIPT_TYPE), t.textContent = this._ownerSerialization, n.head.appendChild(t)), t.textContent = this._ownerSerialization = e
                    }
                },
                _removeSerialization: {
                    value: function() {
                        var e = this._document.querySelector("script[type='" + this._SCRIPT_TYPE + "']");
                        e && e.parentNode.removeChild(e)
                    }
                },
                exportToString: {
                    value: function() {
                        var e = this._document;
                        if (!this.getInlineSerialization(e)) {
                            var t = e.createElement("script");
                            t.setAttribute("type", this._SCRIPT_TYPE), t.textContent = this._ownerSerialization, e.head.appendChild(t)
                        }
                        return (new XMLSerializer).serializeToString(this._document)
                    }
                },
                serializeProperties: {
                    value: function(e) {
                        e.set("owner", this._ownerSerialization), e.set("markup", this._document.body.innerHTML)
                    }
                },
                deserializeProperties: {
                    value: function(e) {
                        var t = e.get("markup"),
                            n = e.get("owner"),
                            r = e.get("extends");
                        t && (this._document = document.implementation.createHTMLDocument(""), this._document.body.innerHTML = t), n && (this._ownerSerialization = n), r && (this._extends = r)
                    }
                }
            })
    }
}), montageDefine("06501b6", "core/gate", {
    dependencies: ["montage", "core/logger"],
    factory: function(e, t, n) {
        var r = e("montage").Montage,
            i = e("core/logger").logger("gate"),
            s = t.Gate = r.create(r, {
                init: {
                    enumerable: !1,
                    value: function() {
                        return this.reset(), this
                    }
                },
                initWithDelegate: {
                    enumerable: !1,
                    value: function(e) {
                        return this.reset(), this.delegate = e, this
                    }
                },
                initWithDescriptor: {
                    enumerable: !1,
                    value: function(e) {
                        var t;
                        this.reset();
                        for (t in e) this.setField(t, e[t].value);
                        return this
                    }
                },
                count: {
                    value: 0
                },
                table: {
                    value: null
                },
                getField: {
                    enumerable: !1,
                    value: function(e) {
                        var t = this.table;
                        return !t || t[e]
                    }
                },
                setField: {
                    enumerable: !1,
                    value: function(e, t) {
                        var n = this.table,
                            r, s = this.count;
                        n = n ? n : this.table = {}, r = n[e], typeof r == "undefined" && !t ? this.count++ : typeof r != "undefined" && r !== t ? t ? this.count-- : this.count++ : t && i.error(this, e + " was not set before."), n[e] = !! t, this.count === 0 && s > 0 ? this.callDelegateMethod(!0) : s === 0 && this.count > 0 && this.callDelegateMethod(!1)
                    }
                },
                removeField: {
                    enumerable: !1,
                    value: function(e) {
                        var t = this.table,
                            n = t[e];
                        typeof n != "undefined" && !n && this.count--, delete t[e]
                    }
                },
                delegate: {
                    enumerable: !1,
                    value: null
                },
                callDelegateMethod: {
                    value: function(e) {
                        var t;
                        this.delegate && typeof(t = this.delegate["gateDidBecome" + (e ? "True" : "False")]) == "function" && t.call(this.delegate, this)
                    },
                    enumerable: !1
                },
                value: {
                    enumerable: !1,
                    get: function() {
                        return this.count === 0
                    }
                },
                reset: {
                    enumerable: !1,
                    value: function() {
                        this.table = {}, this.count = 0
                    }
                },
                toString: {
                    value: function() {
                        var e = this._fields,
                            t, n, r = "";
                        for (t = 0; n = e[t]; t++) r += n + "[" + (this._value & e[n]) + "], ";
                        return r
                    }
                }
            })
    }
}), montageDefine("06501b6", "ui/controller/object-controller", {
    dependencies: ["montage"],
    factory: function(e, t, n) {
        var r = e("montage").Montage,
            i = t.ObjectController = r.create(r, {
                objectPrototype: {
                    enumerable: !1,
                    value: null
                },
                newObject: {
                    enumerable: !1,
                    value: function() {
                        return this.objectPrototype.create()
                    }
                },
                initWithContent: {
                    value: function(e) {
                        return this.content = e, this
                    }
                },
                content: {
                    enumerable: !1,
                    value: null
                }
            })
    }
}), montageDefine("06501b6", "ui/select.reel/select", {
    dependencies: ["montage", "ui/component", "ui/native/select.reel"],
    factory: function(e, t, n) {
        var r = e("montage").Montage,
            i = e("ui/component").Component,
            s = e("ui/native/select.reel").Select;
        t.Select = r.create(s, {
            hasTemplate: {
                value: !0
            },
            willPrepareForDraw: {
                value: function() {
                    s.willPrepareForDraw.call(this), this.element.classList.add("montage-Select")
                }
            }
        })
    }
}), montageDefine("06501b6", "ui/textarea.reel/textarea", {
    dependencies: ["montage", "ui/component", "ui/native/textarea.reel"],
    factory: function(e, t, n) {
        var r = e("montage").Montage,
            i = e("ui/component").Component,
            s = e("ui/native/textarea.reel").Textarea;
        t.Textarea = r.create(s, {
            hasTemplate: {
                value: !0
            },
            willPrepareForDraw: {
                value: function() {
                    s.willPrepareForDraw.call(this), this.element.classList.add("montage-Textarea")
                }
            }
        })
    }
}), montageDefine("06501b6", "ui/application", {
    dependencies: ["core/core", "ui/template", "ui/component", "ui/montage-window", "ui/dom"],
    factory: function(e, t, n) {
        var r = e("core/core").Montage,
            i = e("ui/template").Template,
            s = e("ui/component").Component,
            o = e("ui/montage-window").MontageWindow,
            u;
        e("ui/dom");
        var a = t.Application = r.create(r, {
            eventManager: {
                value: null
            },
            parentApplication: {
                value: null
            },
            mainApplication: {
                get: function() {
                    var e = this;
                    while (e.parentApplication) e = e.parentApplication;
                    return e
                }
            },
            _windowsSortOrder: {
                value: "reverse-z-order"
            },
            windowsSortOrder: {
                get: function() {
                    return this.parentApplication == null ? this._windowsSortOrder : this.mainApplication.windowsSortOrder
                },
                set: function(e) {
                    this.parentApplication == null ? ["z-order", "reverse-z-order", "z-order", "reverse-open-order"].indexOf(e) !== -1 && (this._windowsSortOrder = e) : this.mainApplication.windowsSortOrder = e
                }
            },
            windows: {
                get: function() {
                    var e;
                    if (this.parentApplication == null) {
                        if (!this._windows) {
                            var e = o.create();
                            e.application = this, e.window = window, this.window = e, this._windows = [this.window], this._multipleWindow = !0
                        }
                        return this._windows
                    }
                    return this.mainApplication.windows
                }
            },
            _window: {
                value: null
            },
            window: {
                get: function() {
                    if (!this._window && this == this.mainApplication) {
                        var e = o.create();
                        e.application = this, e.window = window, this._window = e
                    }
                    return this._window
                },
                set: function(e) {
                    this._window || (this._window = e)
                }
            },
            attachedWindows: {
                value: []
            },
            eventManagerForWindow: {
                value: function(e) {
                    return e.defaultEventMananger
                }
            },
            focusWindow: {
                get: function() {
                    var e = this.windows,
                        t = this.windowsSortOrder;
                    if (t == "z-order") return e[0];
                    if (t == "reverse-z-order") return e[e.length - 1];
                    for (var n in e) if (e[n].focused) return e[n]
                }
            },
            addEventListener: {
                value: function(e, t, n) {
                    Object.getPrototypeOf(a).addEventListener.call(this, e, t, n)
                }
            },
            removeEventListener: {
                value: function(e, t, n) {
                    Object.getPrototypeOf(a).removeEventListener.call(this, e, t, n)
                }
            },
            delegate: {
                value: null
            },
            openWindow: {
                value: function(e, t, n) {
                    var r = this,
                        i = o.create(),
                        s, u, a = {
                            location: !1,
                            menubar: !1,
                            resizable: !0,
                            scrollbars: !0,
                            status: !1,
                            titlebar: !0,
                            toolbar: !1
                        }, f = {
                            module: e,
                            name: t,
                            parent: window,
                            callback: function(e, t) {
                                var n;
                                s = e.document.application, i.window = e, i.application = s, i.component = t, s.window = i, r.attachedWindows.push(i), n = r.mainApplication.windowsSortOrder, n == "z-order" || n == "reverse-open-order" ? r.windows.unshift(i) : r.windows.push(i), u = document.createEvent("CustomEvent"), u.initCustomEvent("load", !0, !0, null), i.dispatchEvent(u)
                            }
                        };
                    if (this === this.mainApplication && !this._multipleWindow) var l = this.window;
                    if (typeof n == "object") {
                        var c, h, p = "",
                            d = "";
                        for (c in n) n.hasOwnProperty(c) && (a[c] = n[c])
                    }
                    var v = ["name"];
                    for (c in a) v.indexOf(c) == -1 && (h = a[c], typeof h == "boolean" ? h = h ? "yes" : "no" : (h = String(h), h.match(/[ ,"]/) && (h = '"' + h.replace(/"/g, '\\"') + '"')), d += p + c + "=" + h, p = ",");
                    return window.require.loadPackage({
                        name: "montage"
                    }).then(function(e) {
                        var t = window.open(e.location + "ui/window-loader/index.html", "_blank", d);
                        t.loadInfo = f
                    }).done(), i
                }
            },
            attachWindow: {
                value: function(e) {
                    var t = e.application.parentApplication,
                        n;
                    return t !== this && (t && t.detachWindow(e), e.parentApplication = this, this.attachedWindows.push(e), n = this.mainApplication.windowsSortOrder, n == "z-order" || n == "reverse-open-order" ? this.windows.unshift(e) : this.windows.push(e), e.focus()), e
                }
            },
            detachWindow: {
                value: function(e) {
                    var t, n, r = this.windows;
                    return e === undefined && (e = this.window), n = e.application.parentApplication, n == this ? (t = this.attachedWindows.indexOf(e), t !== -1 && this.attachedWindows.splice(t, 1), t = r.indexOf(e), t !== -1 && r.splice(t, 1), e.application.parentApplication = null) : n && n.detachWindow(e), e
                }
            },
            didCreate: {
                value: function() {
                    window.loadInfo && !this.parentApplication && (this.parentApplication = window.loadInfo.parent.document.application)
                }
            },
            _load: {
                value: function(n, r) {
                    var s = i.create().initWithDocument(window.document, n),
                        o, u = this;
                    t.application = u, e.async("ui/component").then(function(e) {
                        o = e.__root__, o.element = document, s.instantiateWithOwnerAndDocument(null, window.document, function() {
                            u.callDelegateMethod("willFinishLoading", u), o.needsDraw = !0, r && r(u)
                        })
                    }).done()
                }
            },
            _alertPopup: {
                value: null,
                enumerable: !1
            },
            _confirmPopup: {
                value: null,
                enumerable: !1
            },
            _notifyPopup: {
                value: null,
                enumerable: !1
            },
            _zIndex: {
                value: null
            },
            _isSystemPopup: {
                value: function(e) {
                    return e === "alert" || e === "confirm" || e === "notify"
                }
            },
            _createPopupSlot: {
                value: function(e) {
                    var t = document.createElement("div");
                    document.body.appendChild(t), t.style.zIndex = e, t.style.position = "absolute";
                    var n = u.create();
                    return n.element = t, n
                }
            },
            getPopupSlot: {
                value: function(t, n, r) {
                    var i = this;
                    e.async("ui/slot.reel/slot").then(function(e) {
                        u = u || e.Slot, t = t || "custom";
                        var s = i._isSystemPopup(t),
                            o, a, f;
                        i.popupSlots = i.popupSlots || {};
                        if (s) switch (t) {
                            case "alert":
                                o = 9004;
                                break;
                            case "confirm":
                                o = 9003;
                                break;
                            case "notify":
                                o = 9002
                        } else i._zIndex ? i._zIndex = i._zIndex + 1 : i._zIndex = 7e3, o = i._zIndex;
                        f = i.popupSlots[t], f || (f = i.popupSlots[t] = i._createPopupSlot(o)), s || (f.element.style.zIndex = o), f.content = n, r.call(this, f)
                    }).done()
                }
            },
            returnPopupSlot: {
                value: function(e) {
                    var t = this;
                    if (t.popupSlots && t.popupSlots[e]) {
                        var n = t.popupSlots[e];
                        n.content = null
                    }
                }
            },
            _getActivePopupSlots: {
                value: function() {
                    var e = [];
                    if (this.popupSlots) {
                        var t = Object.keys(this.popupSlots);
                        if (t && t.length > 0) {
                            var n = 0,
                                r = t.length,
                                i;
                            for (n = 0; n < r; n++) i = this.popupSlots[t[n]], i && i.content !== null && e.push(i)
                        }
                    }
                    return e
                }
            }
        })
    }
}), montageDefine("06501b6", "ui/montage-window", {
    dependencies: ["montage"],
    factory: function(e, t, n) {
        var r = e("montage").Montage,
            i = t.MontageWindow = r.create(r, {
                _application: {
                    value: null
                },
                application: {
                    get: function() {
                        return this._application
                    },
                    set: function(e) {
                        this._application === null && (this._application = e, this.focused && this._setFocusedWindow(this))
                    }
                },
                _window: {
                    value: null
                },
                window: {
                    get: function() {
                        return this._window
                    },
                    set: function(e) {
                        if (this._window === null) {
                            var t = e.document.body;
                            this._window = e, e.addEventListener("beforeunload", this, !0), e.addEventListener("focus", this, !0), e.addEventListener("mousedown", this, !0), t.getAttribute("tabIndex") === null && (t.setAttribute("tabIndex", -1), t.focus())
                        }
                    }
                },
                document: {
                    get: function() {
                        return this._window.document
                    }
                },
                _component: {
                    value: null
                },
                component: {
                    get: function() {
                        return this._component
                    },
                    set: function(e) {
                        this._component === null && (this._component = e)
                    }
                },
                title: {
                    get: function() {
                        return this.document.title
                    },
                    set: function(e) {
                        this.document.title = e
                    }
                },
                focused: {
                    value: !1
                },
                focus: {
                    value: function() {
                        this._window && this._window.focus()
                    }
                },
                _setFocusedWindow: {
                    value: function(e) {
                        var t = this.application,
                            n, r, i;
                        if (t._multipleWindow) {
                            n = t.windows;
                            for (i in n) r = n[i], r.window === e ? r.focused !== !0 && (r.focused = !0, t.windowsSortOrder == "z-order" ? (n.splice(i, 1), n.unshift(r)) : t.windowsSortOrder == "reverse-z-order" && (n.splice(i, 1), n.push(r))) : r.focused = !1
                        } else this.focused = !0
                    }
                },
                closed: {
                    get: function() {
                        return this._window ? this._window.closed : !1
                    }
                },
                close: {
                    value: function() {
                        this._window && this._window.close()
                    }
                },
                resizeTo: {
                    value: function(e, t) {
                        this._window && this._window.resizeTo(e, t)
                    }
                },
                moveTo: {
                    value: function(e, t) {
                        this._window && this._window.moveTo(e, t)
                    }
                },
                captureFocus: {
                    value: function(e) {
                        var t = this.application;
                        if (!this.application) {
                            this.focused = !0;
                            return
                        }
                        if (t.parentApplication) t.mainApplication.window.captureFocus(e);
                        else {
                            var n = (e.target.ownerDocument ? e.target.ownerDocument.defaultView : null) || e.target.defaultView || e.target;
                            this._setFocusedWindow(n)
                        }
                    }
                },
                captureMousedown: {
                    value: function(e) {
                        this.captureFocus(e)
                    }
                },
                captureBeforeunload: {
                    value: function(e) {
                        var t = this.application,
                            n = t.windows,
                            r = t.attachedWindows,
                            i;
                        t.attachedWindows = [];
                        for (var i in r) r[i].close();
                        t.parentApplication && (r = t.parentApplication.attachedWindows, i = r.indexOf(this), i !== -1 && r.splice(i, 1), i = n.indexOf(this), i !== -1 && n.splice(i, 1), this.window.removeEventListener("beforeunload", this, !0), this.close())
                    }
                }
            })
    }
}), montageDefine("06501b6", "ui/dom", {
    dependencies: ["core/geometry/point"],
    factory: function(e, t, n) {
        var r = e("core/geometry/point").Point,
            i = Node.prototype,
            s = Element.prototype;
        Object.defineProperty(s, "set", {
            value: function(e, t, n) {
                var r = e.indexOf(".", n),
                    i, s, o, u, a;
                n = n || 0, s = e.substring(n, r === -1 ? e.length : r);
                if (r === -1) this.setAttribute(s, t);
                else {
                    o = e.lastIndexOf(".");
                    if (s === "style") u = e.substring(r + 1, e.length), this.style[u] = t;
                    else if (s === "classList") a = e.substring(r + 1, e.length), t ? this.classList.add(a) : this.classList.remove(a);
                    else if (i = this.get(e.substring(0, o))) i[e.substring(o + 1, e.length)] = t
                }
            },
            enumerable: !1
        }), i.get = function(e) {
            return this.getAttribute(e) || this[e]
        }, Object.getPrototypeOf(document).addRule = function(e, t) {
            var n, r;
            if ((n = document.styleSheets[0]) == null) {
                var i = document.createElement("style");
                i.type = "text/css", document.head.appendChild(i), n = document.styleSheets[0]
            } else r = document.getRule(e, n);
            r || n.insertRule(e + " " + t, n.cssRules.length)
        }, Object.getPrototypeOf(document).getRule = function(e, t) {
            var n;
            if (t.cssRules) for (var r = 0; n = t.cssRules[r]; r++) {
                if (n.name && n.name === e) return n;
                if (n.selectorText === e) return n
            }
        }, "use strict", typeof Element != "undefined" && function() {
            var e = "classList";
            if (!Element.prototype.hasOwnProperty(e)) {
                var t = /^\s+|\s+$/g,
                    n = function(e, t) {
                        e.setAttribute("class", t.join(" "))
                    }, r = function(e, t) {
                        if (t === "") throw "SYNTAX_ERR";
                        if (/\s/.test(t)) throw "INVALID_CHARACTER_ERR";
                        return e.indexOf(t)
                    }, i = function() {
                        var e = this,
                            i = e.getAttribute("class") || "";
                        return i = i.replace(t, "").split(/\s+/), {
                            length: i.length,
                            item: function(e) {
                                return i[e] || null
                            },
                            contains: function(e) {
                                return r(i, e) !== -1
                            },
                            add: function(t) {
                                r(i, t) === -1 && (i.push(t), this.length = i.length, n(e, i))
                            },
                            remove: function(t) {
                                var s = r(i, t);
                                s !== -1 && (i.splice(s, 1), this.length = i.length, n(e, i))
                            },
                            toggle: function(e) {
                                r(i, e) === -1 ? this.add(e) : this.remove(e)
                            },
                            toString: function() {
                                return e.getAttribute("class") || ""
                            }
                        }
                    };
                Object.defineProperty ? Object.defineProperty(Element.prototype, e, {
                    get: i,
                    enumerable: !0
                }) : Object.prototype.__defineGetter__ && Element.prototype.__defineGetter__(e, i)
            }
        }(), i.parentOf = function(e) {
            while ((e = e.parentNode) && e !== this);
            return e ? !0 : !1
        };
        var o = function(e) {
            var t, n = e.ownerDocument,
                r, i, s;
            if (e && n) {
                r = n.documentElement, i = n.body, s = n.defaultView;
                if (e !== i) {
                    t = e.getBoundingClientRect();
                    if (r.parentOf(e)) {
                        var o = r.clientTop || i.clientTop || 0,
                            u = r.clientLeft || i.clientLeft || 0,
                            a = s.pageYOffset || r.scrollTop || i.scrollTop,
                            f = s.pageXOffset || r.scrollLeft || i.scrollLeft,
                            l = t.top + a - o,
                            c = t.left + f - u;
                        return {
                            top: l,
                            left: c
                        }
                    }
                    return {
                        top: t.top,
                        left: t.left
                    }
                }
                return {
                    top: i.offsetTop,
                    left: i.offsetLeft
                }
            }
            return null
        }, u = null;
        try {
            u = new WebKitPoint(0, 0)
        } catch (a) {}
        var f = function() {
            t.convertPointFromNodeToPage = function(e, t) {
                return t ? (u.x = t.x, u.y = t.y) : (u.x = 0, u.y = 0), t = webkitConvertPointFromNodeToPage(e, u), t ? r.create().init(t.x, t.y) : null
            }, t.convertPointFromPageToNode = function(e, t) {
                return t ? (u.x = t.x, u.y = t.y) : (u.x = 0, u.y = 0), t = webkitConvertPointFromPageToNode(e, u), t ? r.create().init(t.x, t.y) : null
            }
        }, l = function() {
            t.convertPointFromNodeToPage = function(e, t) {
                if (!e || typeof e.x != "undefined") return null;
                var n;
                return (n = o(e)) ? r.create().init((t ? t.x : 0) + n.left, (t ? t.y : 0) + n.top) : r.create().init(t ? t.x : 0, t ? t.y : 0)
            }, t.convertPointFromPageToNode = function(e, t) {
                if (!e || typeof e.x != "undefined") return null;
                var n;
                return (n = o(e)) ? r.create().init((t ? t.x : 0) - n.left, (t ? t.y : 0) - n.top) : r.create().init(t ? t.x : 0, t ? t.y : 0)
            }
        };
        u ? f() : l()
    }
}), montageDefine("06501b6", "ui/select.reel/select.html", {
    text: "<!doctype html>\n\n<html>\n<head>\n    <meta charset=utf-8>\n    <link rel=stylesheet href=select.css>\n</head>\n<body>\n</body>\n</html>"
}), montageDefine("06501b6", "ui/textarea.reel/textarea.html", {
    text: "<!doctype html>\n\n<html>\n<head>\n    <meta charset=utf-8>\n    <link rel=stylesheet href=textarea.css>\n</head>\n<body>\n</body>\n</html>"
}), montageDefine("06501b6", "ui/native/select.reel/select", {
    dependencies: ["montage", "ui/component", "ui/controller/array-controller", "ui/native-control", "ui/composer/press-composer"],
    factory: function(e, t, n) {
        var r = e("montage").Montage,
            i = e("ui/component").Component,
            s = e("ui/controller/array-controller").ArrayController,
            o = e("ui/native-control").NativeControl,
            u = e("ui/composer/press-composer").PressComposer,
            a = t.Select = r.create(o, {
                _fromInput: {
                    value: null
                },
                _synching: {
                    value: null
                },
                __selectedIndexes: {
                    value: null,
                    enumerable: !1
                },
                _selectedIndexes: {
                    set: function(e) {
                        this.__selectedIndexes = e, this.needsDraw === !1 && (this.needsDraw = this._synching || !this._fromInput)
                    },
                    get: function() {
                        return this.__selectedIndexes
                    }
                },
                _content: {
                    value: null,
                    enumerable: !1
                },
                content: {
                    set: function(e) {
                        Array.isArray(e) || (e = [e]), this._content = e;
                        if (!this.contentController) {
                            var t = s.create();
                            t.content = e, this.contentController = t
                        }
                        this.needsDraw = !0
                    },
                    get: function() {
                        return this._content
                    }
                },
                valuePropertyPath: {
                    value: null
                },
                textPropertyPath: {
                    value: null
                },
                _contentController: {
                    value: null
                },
                contentController: {
                    get: function() {
                        return this._contentController
                    },
                    set: function(e) {
                        if (this._contentController === e) return;
                        this._contentController && Object.deleteBinding(this, "_selectedIndexes"), this._contentController = e, this._contentController && (this._bindingDescriptors && Object.deleteBinding(this, "content"), Object.defineBinding(this, "content", {
                            boundObject: this._contentController,
                            boundObjectPropertyPath: "organizedObjects",
                            oneway: !0
                        }), Object.defineBinding(this, "_selectedIndexes", {
                            boundObject: this._contentController,
                            boundObjectPropertyPath: "selectedIndexes"
                        }))
                    }
                },
                _getSelectedValuesFromIndexes: {
                    value: function() {
                        var e = this.contentController ? this.contentController.selectedObjects : null,
                            t = [];
                        if (e && e.length > 0) {
                            var n = 0,
                                r = e.length,
                                i;
                            for (; n < r; n++) i = this.valuePropertyPath || "value", e[n][i] && t.push(e[n][i])
                        }
                        return t
                    }
                },
                _synchValues: {
                    value: function() {
                        this._synching || (this._synching = !0, this.values = this._getSelectedValuesFromIndexes(), this.value = this.values && this.values.length > 0 ? this.values[0] : null, this._synching = !1)
                    }
                },
                _values: {
                    value: null
                },
                values: {
                    get: function() {
                        return this._values
                    },
                    set: function(e) {
                        var t = this.contentController ? this.contentController.content : null;
                        if (e && t) {
                            this._values = e;
                            if (!this._synching) {
                                var n = [],
                                    r = 0,
                                    i = this._values.length,
                                    s;
                                for (; r < i; r++) s = this._indexOf(this._values[r]), s >= 0 && n.push(s);
                                this._synching = !0, this.contentController.selectedIndexes = n, this._synching = !1
                            }
                        }
                    }
                },
                _value: {
                    value: null
                },
                value: {
                    get: function() {
                        return this._value
                    },
                    set: function(e) {
                        this._value = e, this._synching || (e == null ? this.values = [] : this.values = [e])
                    }
                },
                blur: {
                    value: function() {
                        this._element.blur()
                    }
                },
                focus: {
                    value: function() {
                        this._element.focus()
                    }
                },
                _addOptionsFromMarkup: {
                    value: function() {
                        var e = this.element,
                            t = e.querySelectorAll("option");
                        if (!this.contentController) {
                            var n = s.create(),
                                r = [];
                            n.content = [];
                            if (t && t.length > 0) {
                                var i = 0,
                                    o = t.length,
                                    u;
                                for (; i < o; i++) u = t[i].getAttribute("selected"), u && r.push(i), n.addObjects({
                                    value: t[i].value,
                                    text: t[i].textContent
                                });
                                this.contentController = n, r.length === 0 && o > 0 && (r = [0]), this._fromInput = !0, this.contentController.selectedIndexes = r
                            }
                        }
                    }
                },
                deserializedFromTemplate: {
                    value: function() {
                        this._addOptionsFromMarkup()
                    }
                },
                _removeAll: {
                    value: function(e) {
                        while (e.firstChild) e.removeChild(e.firstChild)
                    }
                },
                _refreshOptions: {
                    value: function() {
                        var e = this.content || [],
                            t = e.length,
                            n, r, i, s;
                        for (n = 0; n < t; n++) r = document.createElement("option"), String.isString(e[n]) ? i = s = e[n] : (i = e[n][this.textPropertyPath || "text"], s = e[n][this.valuePropertyPath || "value"]), r.value = s, r.textContent = i || s, this._selectedIndexes && this._selectedIndexes.length > 0 && this._selectedIndexes.indexOf(n) >= 0 && r.setAttribute("selected", "true"), this.element.appendChild(r)
                    }
                },
                prepareForDraw: {
                    value: function() {
                        this.element.addEventListener("focus", this), this.element.addEventListener("change", this)
                    }
                },
                prepareForActivationEvents: {
                    value: function() {
                        var e = u.create();
                        this.addComposer(e)
                    }
                },
                draw: {
                    enumerable: !1,
                    value: function() {
                        var e = this.element;
                        this._fromInput = !1, this._synching = !1, this._removeAll(e), this._refreshOptions();
                        var t = Object.getPrototypeOf(a).draw;
                        t.call(this)
                    }
                },
                didDraw: {
                    value: function() {
                        this._synchValues()
                    }
                },
                _indexOf: {
                    value: function(e) {
                        var t = this.content || [],
                            n = t.length,
                            r, i, s;
                        for (r = 0; r < n; r++) {
                            String.isString(t[r]) ? s = t[r] : s = t[r][this.valuePropertyPath || "value"];
                            if (s && s === e) return r
                        }
                        return -1
                    }
                },
                _getSelectedOptions: {
                    value: function(e) {
                        var t = e.querySelectorAll("option"),
                            n, r = t.length,
                            i = [];
                        for (n = 0; n < r; n++) t[n].selected && i.push(t[n]);
                        return i
                    }
                },
                _getSelectedOptionsIndices: {
                    value: function(e) {
                        var t = e.querySelectorAll("option"),
                            n, r = t.length,
                            i = [];
                        for (n = 0; n < r; n++) t[n].selected && i.push(n);
                        return i
                    }
                },
                handleChange: {
                    value: function(e) {
                        var t = this._getSelectedOptionsIndices(this.element);
                        t.length > 0 && (this._fromInput = !0, this._synching = !1, this.contentController.selectedIndexes = t, this._synchValues())
                    }
                }
            });
        a.addAttributes({
            autofocus: {
                dataType: "boolean"
            },
            disabled: {
                dataType: "boolean"
            },
            form: null,
            multiple: {
                dataType: "boolean"
            },
            name: null,
            required: {
                dataType: "boolean"
            },
            size: {
                dataType: "number",
                value: "1"
            }
        })
    }
}), montageDefine("06501b6", "ui/native/textarea.reel/textarea", {
    dependencies: ["montage", "ui/component", "ui/text-input"],
    factory: function(e, t, n) {
        var r = e("montage").Montage,
            i = e("ui/component").Component,
            s = e("ui/text-input").TextInput,
            o = t.Textarea = r.create(s, {
                select: {
                    value: function() {
                        this._element.select()
                    }
                },
                textContent: {
                    get: function() {
                        return this.value
                    },
                    set: function(e) {
                        this.value = e
                    }
                },
                willPrepareForDraw: {
                    value: function() {
                        s.willPrepareForDraw.call(this), this.textContent === null && (this.textContent = this.element.textContent)
                    }
                }
            });
        o.addAttributes({
            autofocus: {
                dataType: "boolean"
            },
            cols: null,
            dirname: null,
            disabled: {
                dataType: "boolean"
            },
            form: null,
            maxlength: null,
            name: null,
            placeholder: null,
            readonly: {
                dataType: "boolean"
            },
            required: {
                dataType: "boolean"
            },
            rows: null,
            wrap: null
        })
    }
}), montageDefine("06501b6", "core/geometry/point", {
    dependencies: ["montage"],
    factory: function(e, t, n) {
        var r = e("montage").Montage;
        t.Point = r.create(r, {
            init: {
                enumerable: !1,
                value: function(e, t) {
                    return this.x = e === null ? 0 : e, this.y = t === null ? 0 : t, this
                }
            },
            interpolate: {
                enumerable: !1,
                value: function(e, n, r, i) {
                    var s, o;
                    return s = n.x + (r.x - n.x) * e, o = n.y + (r.y - n.y) * e, i > 0 && (s = Math.round(s * i) / i, o = Math.round(o * i) / i), t.Point.create().init(s, o)
                }
            },
            x: {
                enumerable: !0,
                value: 0
            },
            y: {
                enumerable: !0,
                value: 0
            }
        })
    }
}), montageDefine("06501b6", "ui/native-control", {
    dependencies: ["montage", "ui/component"],
    factory: function(e, t, n) {
        var r = e("montage").Montage,
            i = e("ui/component").Component,
            s = t.NativeControl = r.create(i, {
                hasTemplate: {
                    value: !1
                },
                willPrepareForDraw: {
                    value: function() {}
                }
            });
        s.addAttributes({
            accesskey: null,
            contenteditable: null,
            contextmenu: null,
            dir: null,
            draggable: null,
            dropzone: null,
            hidden: {
                dataType: "boolean"
            },
            lang: null,
            spellcheck: null,
            style: null,
            tabindex: null,
            title: null
        })
    }
}), montageDefine("06501b6", "ui/composer/press-composer", {
    dependencies: ["montage", "ui/composer/composer", "core/event/mutable-event"],
    factory: function(e, t, n) {
        var r = e("montage").Montage,
            i = e("ui/composer/composer").Composer,
            s = e("core/event/mutable-event").MutableEvent,
            o = t.PressComposer = r.create(i, {
                load: {
                    value: function() {
                        window.Touch ? this._element.addEventListener("touchstart", this, !0) : this._element.addEventListener("mousedown", this, !0)
                    }
                },
                unload: {
                    value: function() {
                        window.Touch ? this._element.removeEventListener("touchstart", this) : this._element.removeEventListener("mousedown", this)
                    }
                },
                delegate: {
                    value: null
                },
                cancelPress: {
                    value: function() {
                        return this._state === o.PRESSED ? (this._dispatchPressCancel(), this._endInteraction(), !0) : !1
                    }
                },
                addEventListener: {
                    value: function(e, t, n) {
                        i.addEventListener.call(this, e, t, n), e === "longPress" && (this._shouldDispatchLongPress = !0)
                    }
                },
                UNPRESSED: {
                    value: 0
                },
                PRESSED: {
                    value: 1
                },
                CANCELLED: {
                    value: 2
                },
                _state: {
                    enumerable: !1,
                    value: 0
                },
                state: {
                    get: function() {
                        return this._state
                    }
                },
                _shouldDispatchLongPress: {
                    enumerable: !1,
                    value: !1
                },
                _longPressThreshold: {
                    enumerable: !1,
                    value: 1e3
                },
                longPressThreshold: {
                    get: function() {
                        return this._longPressThreshold
                    },
                    set: function(e) {
                        this._longPressThreshold !== e && (this._longPressThreshold = e)
                    }
                },
                _longPressTimeout: {
                    enumberable: !1,
                    value: null
                },
                _observedPointer: {
                    enumerable: !1,
                    value: null
                },
                _startInteraction: {
                    enumerable: !1,
                    value: function(e) {
                        if ("disabled" in this.component && this.component.disabled || this._observedPointer !== null) return !1;
                        var t = 0,
                            n;
                        if (e.type === "touchstart") {
                            n = e.changedTouches.length;
                            for (; t < n; t++) if (!this.component.eventManager.componentClaimingPointer(e.changedTouches[t].identifier)) {
                                this._observedPointer = e.changedTouches[t].identifier;
                                break
                            }
                            if (this._observedPointer === null) return !1;
                            document.addEventListener("touchend", this, !1), document.addEventListener("touchcancel", this, !1)
                        } else e.type === "mousedown" && (this._observedPointer = "mouse", document.addEventListener("mouseup", this, !1), document.addEventListener("click", this, !1));
                        this._element.addEventListener("dragstart", this, !1), this.component.eventManager.claimPointer(this._observedPointer, this), this._dispatchPressStart(e)
                    }
                },
                _interpretInteraction: {
                    value: function(e) {
                        var t, n, r;
                        if (this._observedPointer === null) {
                            this._endInteraction(e);
                            return
                        }
                        t = !this.component.eventManager.isPointerClaimedByComponent(this._observedPointer, this), n = e.target;
                        while (n !== this._element && n && n.parentNode) n = n.parentNode;
                        r = n === this._element;
                        if (t && e.type === "click") {
                            e.preventDefault(), this._endInteraction(e);
                            return
                        }
                        if (e.type === "mouseup") {
                            if (!t && r) {
                                this._dispatchPress(e), this._endInteraction(e);
                                return
                            }
                            if (!t && !r) {
                                this._dispatchPressCancel(e), this._endInteraction(e);
                                return
                            }
                            t && !r && this._endInteraction(e)
                        }
                    }
                },
                _endInteraction: {
                    value: function(e) {
                        if (!e || e.type === "touchend" || e.type === "touchcancel") document.removeEventListener("touchend", this), document.removeEventListener("touchcancel", this);
                        else if (!e || e.type === "click" || e.type === "mouseup") document.removeEventListener("click", this), document.removeEventListener("mouseup", this);
                        this.component.eventManager.isPointerClaimedByComponent(this._observedPointer, this) && this.component.eventManager.forfeitPointer(this._observedPointer, this), this._observedPointer = null, this._state = o.UNPRESSED
                    }
                },
                _changedTouchisObserved: {
                    value: function(e) {
                        if (this._observedPointer === null) return !1;
                        var t = 0,
                            n = event.changedTouches.length;
                        for (; t < n; t++) if (event.changedTouches[t].identifier === this._observedPointer) return t;
                        return !1
                    }
                },
                surrenderPointer: {
                    value: function(e, t) {
                        var n = this.callDelegateMethod("surrenderPointer", e, t);
                        return typeof n != "undefined" && n === !1 ? !1 : (this._dispatchPressCancel(), !0)
                    }
                },
                captureTouchstart: {
                    value: function(e) {
                        this._startInteraction(e)
                    }
                },
                handleTouchend: {
                    value: function(e) {
                        if (this._observedPointer === null) {
                            this._endInteraction(e);
                            return
                        }
                        this._changedTouchisObserved(e.changedTouches) !== !1 && (this.component.eventManager.isPointerClaimedByComponent(this._observedPointer, this) ? this._dispatchPress(e) : e.preventDefault(), this._endInteraction(e))
                    }
                },
                handleTouchcancel: {
                    value: function(e) {
                        if (this._observedPointer === null || this._changedTouchisObserved(e.changedTouches) !== !1) this.component.eventManager.isPointerClaimedByComponent(this._observedPointer, this) && this._dispatchPressCancel(e), this._endInteraction(e)
                    }
                },
                captureMousedown: {
                    value: function(e) {
                        this._startInteraction(e)
                    }
                },
                handleClick: {
                    value: function(e) {
                        this._interpretInteraction(e)
                    }
                },
                handleMouseup: {
                    value: function(e) {
                        this._interpretInteraction(e)
                    }
                },
                handleDragstart: {
                    value: function(e) {
                        this._dispatchPressCancel(e), this._endInteraction()
                    }
                },
                _createPressEvent: {
                    enumerable: !1,
                    value: function(e, t) {
                        var n, r, i;
                        return t || (t = document.createEvent("CustomEvent"), t.initCustomEvent(e, !0, !0, null)), n = u.create(), n.event = t, n.type = e, n.pointer = this._observedPointer, t.changedTouches && (i = this._changedTouchisObserved(t.changedTouches)) !== !1 && (n.touch = t.changedTouches[i]), n
                    }
                },
                _dispatchPressStart: {
                    enumerable: !1,
                    value: function(e) {
                        this._state = o.PRESSED, this.dispatchEvent(this._createPressEvent("pressStart", e));
                        if (this._shouldDispatchLongPress) {
                            var t = this;
                            this._longPressTimeout = setTimeout(function() {
                                t._dispatchLongPress()
                            }, this._longPressThreshold)
                        }
                    }
                },
                _dispatchPress: {
                    enumerable: !1,
                    value: function(e) {
                        this._shouldDispatchLongPress && (clearTimeout(this._longPressTimeout), this._longPressTimeout = null), this.dispatchEvent(this._createPressEvent("press", e)), this._state = o.UNPRESSED
                    }
                },
                _dispatchLongPress: {
                    enumerable: !1,
                    value: function(e) {
                        this._shouldDispatchLongPress && (this.dispatchEvent(this._createPressEvent("longPress", e)), this._longPressTimeout = null)
                    }
                },
                _dispatchPressCancel: {
                    enumerable: !1,
                    value: function(e) {
                        this._shouldDispatchLongPress && (clearTimeout(this._longPressTimeout), this._longPressTimeout = null), this._state = o.CANCELLED, this.dispatchEvent(this._createPressEvent("pressCancel", e))
                    }
                }
            }),
            u = function() {
                var e, t, n, i, s, o;
                e = r.create(r, {
                    type: {
                        value: "press"
                    },
                    _event: {
                        enumerable: !1,
                        value: null
                    },
                    event: {
                        get: function() {
                            return this._event
                        },
                        set: function(e) {
                            this._event = e
                        }
                    },
                    _touch: {
                        enumerable: !1,
                        value: null
                    },
                    touch: {
                        get: function() {
                            return this._touch
                        },
                        set: function(e) {
                            this._touch = e
                        }
                    }
                }), t = ["altKey", "ctrlKey", "metaKey", "shiftKey", "cancelBubble", "currentTarget", "defaultPrevented", "eventPhase", "timeStamp", "preventDefault", "stopImmediatePropagation", "stopPropagation"], n = ["clientX", "clientY", "pageX", "pageY", "screenX", "screenY", "target"], i = function(e) {
                    return {
                        get: function() {
                            return this._event[e]
                        }
                    }
                }, s = function(e) {
                    return {
                        get: function() {
                            return this._touch ? this._touch[e] : this._event[e]
                        }
                    }
                };
                for (o = t.length - 1; o >= 0; o--) r.defineProperty(e, t[o], i(t[o]));
                for (o = n.length - 1; o >= 0; o--) r.defineProperty(e, n[o], s(n[o]));
                return e
            }()
    }
}), montageDefine("06501b6", "ui/text-input", {
    dependencies: ["montage", "ui/component", "ui/native-control"],
    factory: function(e, t, n) {
        var r = e("montage").Montage,
            i = e("ui/component").Component,
            s = e("ui/native-control").NativeControl,
            o = t.TextInput = r.create(s, {
                _hasFocus: {
                    enumerable: !1,
                    value: !1
                },
                _value: {
                    enumerable: !1,
                    value: null
                },
                _valueSyncedWithInputField: {
                    enumerable: !1,
                    value: !1
                },
                value: {
                    get: function() {
                        return this._value
                    },
                    set: function(e, t) {
                        if (e !== this._value) {
                            if (this.converter) {
                                var n;
                                try {
                                    n = this.converter.revert(e), this.error = null, this._value = n
                                } catch (r) {
                                    this._value = e, this.error = r
                                }
                            } else this._value = e;
                            t ? this._valueSyncedWithInputField = !0 : (this._valueSyncedWithInputField = !1, this.needsDraw = !0)
                        }
                    }
                },
                _setValue: {
                    value: function() {
                        var e = this.element.value;
                        Object.getPropertyDescriptor(this, "value").set.call(this, e, !0)
                    }
                },
                converter: {
                    value: null
                },
                _error: {
                    value: null
                },
                error: {
                    get: function() {
                        return this._error
                    },
                    set: function(e) {
                        this._error = e, this.errorMessage = this._error ? this._error.message : null, this.needsDraw = !0
                    }
                },
                _errorMessage: {
                    value: null
                },
                errorMessage: {
                    get: function() {
                        return this._errorMessage
                    },
                    set: function(e) {
                        this._errorMessage = e
                    }
                },
                _updateOnInput: {
                    value: !0
                },
                updateOnInput: {
                    get: function() {
                        return !!this._updateOnInput
                    },
                    set: function(e) {
                        this._updateOnInput = e
                    }
                },
                blur: {
                    value: function() {
                        this._element.blur()
                    }
                },
                focus: {
                    value: function() {
                        this._element.focus()
                    }
                },
                prepareForDraw: {
                    enumerable: !1,
                    value: function() {
                        var e = this.element;
                        e.addEventListener("focus", this), e.addEventListener("input", this), e.addEventListener("change", this), e.addEventListener("blur", this)
                    }
                },
                _setElementValue: {
                    value: function(e) {
                        this.element.value = e == null ? "" : e
                    }
                },
                draw: {
                    enumerable: !1,
                    value: function() {
                        Object.getPrototypeOf(o).draw.call(this);
                        var e = this.element;
                        this._valueSyncedWithInputField || this._setElementValue(this.converter ? this.converter.convert(this._value) : this._value), this.error ? (e.classList.add("montage--invalidText"), e.title = this.error.message || "") : (e.classList.remove("montage--invalidText"), e.title = "")
                    }
                },
                didDraw: {
                    enumerable: !1,
                    value: function() {
                        if (this._hasFocus && this._value != null) {
                            var e = this._value.toString().length;
                            this.element.setSelectionRange(e, e)
                        }
                        this._valueSyncedWithInputField = !0
                    }
                },
                handleInput: {
                    enumerable: !1,
                    value: function() {
                        this.converter ? this.converter.allowPartialConversion === !0 && this.updateOnInput === !0 && this._setValue() : this._setValue()
                    }
                },
                handleChange: {
                    enumerable: !1,
                    value: function(e) {
                        this._setValue(), this._hasFocus = !1
                    }
                },
                handleBlur: {
                    enumerable: !1,
                    value: function(e) {
                        this._hasFocus = !1
                    }
                },
                handleFocus: {
                    enumerable: !1,
                    value: function(e) {
                        this._hasFocus = !0
                    }
                }
            });
        o.addAttributes({
            accept: null,
            alt: null,
            autocomplete: null,
            autofocus: {
                dataType: "boolean"
            },
            checked: {
                dataType: "boolean"
            },
            dirname: null,
            disabled: {
                dataType: "boolean"
            },
            form: null,
            formaction: null,
            formenctype: null,
            formmethod: null,
            formnovalidate: {
                dataType: "boolean"
            },
            formtarget: null,
            height: null,
            list: null,
            maxlength: null,
            multiple: {
                dataType: "boolean"
            },
            name: null,
            pattern: null,
            placeholder: null,
            readonly: {
                dataType: "boolean"
            },
            required: {
                dataType: "boolean"
            },
            size: null,
            src: null,
            width: null
        })
    }
}), montageDefine("06501b6", "ui/composer/composer", {
    dependencies: ["montage"],
    factory: function(e, t, n) {
        var r = e("montage").Montage;
        t.Composer = r.create(r, {
            _component: {
                value: null
            },
            component: {
                get: function() {
                    return this._component
                },
                set: function(e) {
                    this._component = e
                }
            },
            _element: {
                value: null
            },
            element: {
                get: function() {
                    return this._element
                },
                set: function(e) {
                    this._element = e
                }
            },
            lazyLoad: {
                value: !1
            },
            _needsFrame: {
                value: !1
            },
            needsFrame: {
                set: function(e) {
                    this._needsFrame !== e && (this._needsFrame = e, this._component && e && this._component.scheduleComposer(this))
                },
                get: function() {
                    return this._needsFrame
                }
            },
            frame: {
                value: function(e) {}
            },
            _resolveDefaults: {
                value: function() {
                    this.element == null && this.component != null && (this.element = this.component.element)
                }
            },
            _load: {
                value: function() {
                    this.element || this._resolveDefaults(), this.load()
                }
            },
            load: {
                value: function() {}
            },
            unload: {
                value: function() {}
            },
            deserializedFromTemplate: {
                value: function() {
                    this.component && this.component.addComposer(this)
                }
            }
        })
    }
}), montageDefine("5c28f67", "shim", {
    dependencies: ["./shim-array", "./shim-object", "./shim-function"],
    factory: function(e, t, n) {
        var r = e("./shim-array"),
            i = e("./shim-object"),
            s = e("./shim-function")
    }
}), montageDefine("5c28f67", "weak-map", {
    dependencies: [],
    factory: function(e, t, n) {
        "use strict";
        n.exports = typeof WeakMap != "undefined" ? WeakMap : function() {
            function e(e) {
                return e.prototype = null, Object.freeze(e)
            }
            var t = Object.prototype.hasOwnProperty,
                n = Object.getOwnPropertyNames,
                r = Object.defineProperty,
                i = {};
            n(Object).forEach(function(e) {
                i[e] = Object[e]
            });
            var s = "ident:" + Math.random() + "___";
            if (typeof crypto != "undefined" && typeof crypto.getRandomValues == "function" && typeof ArrayBuffer == "function" && typeof Uint8Array == "function") {
                var o = new ArrayBuffer(25),
                    u = new Uint8Array(o);
                crypto.getRandomValues(u), s = "rand:" + Array.prototype.map.call(u, function(e) {
                    return (e % 36).toString(36)
                }).join("") + "___"
            }
            r(Object, "getOwnPropertyNames", {
                value: function(e) {
                    return n(e).filter(function(e) {
                        return e !== s
                    })
                }
            }), "getPropertyNames" in Object && r(Object, "getPropertyNames", {
                value: function(e) {
                    return i.getPropertyNames(e).filter(function(e) {
                        return e !== s
                    })
                }
            });
            var a = function(e) {
                if (e !== Object(e)) throw new TypeError("Not an object: " + e);
                var t = e[s];
                if (t && t.key === e) return t;
                if (!i.isExtensible(e)) return void 0;
                var n = [],
                    o = [];
                return t = {
                    key: e,
                    gets: n,
                    vals: o
                }, r(e, s, {
                    value: t,
                    writable: !1,
                    enumerable: !1,
                    configurable: !1
                }), t
            };
            (function() {
                var e = Object.freeze;
                r(Object, "freeze", {
                    value: function(t) {
                        return a(t), e(t)
                    }
                });
                var t = Object.seal;
                r(Object, "seal", {
                    value: function(e) {
                        return a(e), t(e)
                    }
                });
                var n = Object.preventExtensions;
                r(Object, "preventExtensions", {
                    value: function(e) {
                        return a(e), n(e)
                    }
                })
            })();
            var f = function() {
                function t(e, n) {
                    var r = a(e),
                        i, u;
                    return r ? (i = r.gets.indexOf(t), u = r.vals) : (i = s.indexOf(e), u = o), i >= 0 ? u[i] : n
                }
                function n(e) {
                    var n = a(e),
                        r;
                    return n ? r = n.gets.indexOf(t) : r = s.indexOf(e), r >= 0
                }
                function r(e, n) {
                    var r = a(e),
                        i;
                    r ? (i = r.gets.indexOf(t), i >= 0 ? r.vals[i] = n : (r.gets.push(t), r.vals.push(n))) : (i = s.indexOf(e), i >= 0 ? o[i] = n : (s.push(e), o.push(n)))
                }
                function i(e) {
                    var n = a(e),
                        r;
                    return n ? (r = n.gets.indexOf(t), r >= 0 && (n.gets.splice(r, 1), n.vals.splice(r, 1))) : (r = s.indexOf(e), r >= 0 && (s.splice(r, 1), o.splice(r, 1))), !0
                }
                var s = [],
                    o = [];
                return Object.create(f.prototype, {
                    get___: {
                        value: e(t)
                    },
                    has___: {
                        value: e(n)
                    },
                    set___: {
                        value: e(r)
                    },
                    delete___: {
                        value: e(i)
                    }
                })
            };
            return f.prototype = Object.create(Object.prototype, {
                get: {
                    value: function(e, t) {
                        return this.get___(e, t)
                    },
                    writable: !0,
                    configurable: !0
                },
                has: {
                    value: function(e) {
                        return this.has___(e)
                    },
                    writable: !0,
                    configurable: !0
                },
                set: {
                    value: function(e, t) {
                        this.set___(e, t)
                    },
                    writable: !0,
                    configurable: !0
                },
                "delete": {
                    value: function(e) {
                        return this.delete___(e)
                    },
                    writable: !0,
                    configurable: !0
                }
            }), f
        }()
    }
}), montageDefine("5c28f67", "shim-array", {
    dependencies: ["./shim-function", "./generic-collection", "./generic-order", "./weak-map"],
    factory: function(e, t, n) {
        "use strict";

        function r(e, t) {
            Object.defineProperty(Array.prototype, e, {
                value: t,
                writable: !0,
                configurable: !0,
                enumerable: !1
            })
        }
        function i(e, t, n) {
            this.array = e, this.start = t == null ? 0 : t, this.end = n
        }
        var s = e("./shim-function"),
            o = e("./generic-collection"),
            u = e("./generic-order"),
            a = e("./weak-map");
        n.exports = Array, Array.empty = [], Object.freeze && Object.freeze(Array.empty), Array.from = function(e) {
            var t = [];
            return t.addEach(e), t
        }, r("addEach", o.prototype.addEach), r("deleteEach", o.prototype.deleteEach), r("toArray", o.prototype.toArray), r("toObject", o.prototype.toObject), r("all", o.prototype.all), r("any", o.prototype.any), r("min", o.prototype.min), r("max", o.prototype.max), r("sum", o.prototype.sum), r("average", o.prototype.average), r("only", o.prototype.only), r("flatten", o.prototype.flatten), r("zip", o.prototype.zip), r("sorted", o.prototype.sorted), r("reversed", o.prototype.reversed), r("constructClone", function(e) {
            var t = new this.constructor;
            return t.addEach(e), t
        }), r("has", function(e, t) {
            return this.find(e, t) !== -1
        }), r("get", function(e) {
            if (+e !== e) throw new Error("Indicies must be numbers");
            return this[e]
        }), r("set", function(e, t) {
            return this.splice(e, 1, t), !0
        }), r("add", function(e) {
            return this.push(e), !0
        }), r("delete", function(e, t) {
            var n = this.find(e, t);
            return n !== -1 ? (this.splice(n, 1), !0) : !1
        }), r("find", function(e, t) {
            t = t || this.contentEquals || Object.equals;
            for (var n = 0; n < this.length; n++) if (n in this && t(this[n], e)) return n;
            return -1
        }), r("findLast", function(e, t) {
            t = t || this.contentEquals || Object.equals;
            var n = this.length;
            do {
                n--;
                if (n in this && t(this[n], e)) return n
            } while (n > 0);
            return -1
        }), r("swap", function(e, t, n) {
            var r = Array.prototype.slice.call(arguments, 0, 2);
            return n && r.push.apply(r, n), this.splice.apply(this, r)
        }), r("one", function() {
            if (this.length === 0) throw new Error("Can't get one element from empty array.");
            for (var e in this) if (Object.owns(this, e)) return this[e]
        }), r("clear", function() {
            return this.length = 0, this
        }), r("compare", function(e, t) {
            t = t || Object.compare;
            var n, r, i, s, o;
            if (this === e) return 0;
            if (!e || !Array.isArray(e)) return u.prototype.compare.call(this, e, t);
            r = Math.min(this.length, e.length);
            for (n = 0; n < r; n++) if (n in this) {
                if (!(n in e)) return -1;
                i = this[n], s = e[n], o = t(i, s);
                if (o) return o
            } else if (n in e) return 1;
            return this.length - e.length
        }), r("equals", function(e) {
            var t = t || Object.equals,
                n = 0,
                r = this.length,
                i, s;
            if (this === e) return !0;
            if (!e || !Array.isArray(e)) return u.prototype.equals.call(this, e);
            if (r !== e.length) return !1;
            for (; n < r; ++n) if (n in this) {
                i = this[n], s = e[n];
                if (i !== s && i && s && !t(i, s)) return !1
            } else if (n in e) return !1;
            return !0
        }), r("clone", function(e, t) {
            if (e === undefined) e = Infinity;
            else if (e === 0) return this;
            t = t || new a;
            var n = [];
            for (var r in this) Object.owns(this, r) && (n[r] = Object.clone(this[r], e - 1, t));
            return n
        }), r("iterate", function(e, t) {
            return new i(this, e, t)
        }), r("Iterator", i), i.prototype.next = function() {
            if (this.start === (this.end == null ? this.array.length : this.end)) throw StopIteration;
            return this.array[this.start++]
        }
    }
}), montageDefine("5c28f67", "shim-object", {
    dependencies: ["./weak-map"],
    factory: function(e, t, n) {
        "use strict";
        var r = e("./weak-map");
        n.exports = Object, Object.empty = Object.freeze(Object.create(null)), Object.isObject = function(e) {
            return Object(e) === e
        }, Object.getValueOf = function(e) {
            return Object.can(e, "valueOf") && (e = e.valueOf()), e
        };
        var i = new r;
        Object.hash = function(e) {
            return Object.can(e, "hash") ? "" + e.hash() : Object(e) === e ? (i.has(e) || i.set(e, Math.random().toString(36).slice(2)), i.get(e)) : "" + e
        };
        var s = Object.prototype.hasOwnProperty;
        Object.owns = function(e, t) {
            return s.call(e, t)
        }, Object.can = function(e, t) {
            return e != null && typeof e[t] == "function" && !s.call(e, t)
        }, Object.has = function(e, t) {
            if (typeof e != "object") throw new Error("Object.has can't accept non-object: " + typeof e);
            if (Object.can(e, "has")) return e.has(t);
            if (typeof t == "string") return t in e && e[t] !== Object.prototype[t];
            throw new Error("Key must be a string for Object.has on plain objects")
        }, Object.get = function(e, t, n) {
            if (typeof e != "object") throw new Error("Object.get can't accept non-object: " + typeof e);
            return Object.can(e, "get") ? e.get(t, n) : Object.has(e, t) ? e[t] : n
        }, Object.set = function(e, t, n) {
            Object.can(e, "set") ? e.set(t, n) : e[t] = n
        }, Object.addEach = function(e, t) {
            Object.can(t, "forEach") ? typeof t.keys == "function" ? t.forEach(function(t, n) {
                e[n] = t
            }) : t.forEach(function(t) {
                e[t[0]] = t[1]
            }) : Object.keys(t).forEach(function(n) {
                e[n] = t[n]
            })
        }, Object.forEach = function(e, t, n) {
            Object.keys(e).forEach(function(r) {
                t.call(n, e[r], r, e)
            })
        }, Object.map = function(e, t, n) {
            return Object.keys(e).map(function(r) {
                return t.call(n, e[r], r, e)
            })
        }, Object.values = function(e) {
            return Object.map(e, Function.identity)
        }, Object.is = function(e, t) {
            return e === t ? e !== 0 || 1 / e === 1 / t : e !== e && t !== t
        }, Object.equals = function(e, t, n) {
            n = n || Object.equals, e = Object.getValueOf(e), t = Object.getValueOf(t);
            if (e === t) return e !== 0 || 1 / e === 1 / t;
            if (Object.can(e, "equals")) return e.equals(t, n);
            if (Object.can(t, "equals")) return t.equals(e, n);
            if (typeof e == "object" && typeof t == "object") {
                var r = Object.getPrototypeOf(e),
                    i = Object.getPrototypeOf(t);
                if (r === i && (r === Object.prototype || r === null)) {
                    for (var s in e) if (!n(e[s], t[s])) return !1;
                    for (var s in t) if (!n(e[s], t[s])) return !1;
                    return !0
                }
            }
            return e !== e && t !== t
        }, Object.compare = function(e, t) {
            e = Object.getValueOf(e), t = Object.getValueOf(t);
            var n = typeof e,
                r = typeof t;
            return e === t ? 0 : n !== r ? 0 : n === "number" ? e - t : n === "string" ? e < t ? -1 : 1 : Object.can(e, "compare") ? e.compare(t) : Object.can(t, "compare") ? -t.compare(e) : 0
        }, Object.clone = function(e, t, n) {
            e = Object.getValueOf(e), n = n || new r;
            if (t === undefined) t = Infinity;
            else if (t === 0) return e;
            if (Object.isObject(e)) {
                if (!n.has(e)) if (Object.can(e, "clone")) n.set(e, e.clone(t, n));
                else {
                    var i = Object.getPrototypeOf(e);
                    if (i !== null && i !== Object.prototype) throw new Error("Can't clone " + e);
                    var s = Object.create(i);
                    n.set(e, s);
                    for (var o in e) s[o] = Object.clone(e[o], t - 1, n)
                }
                return n.get(e)
            }
            return e
        }, Object.clear = function(e) {
            if (Object.can(e, "clear")) e.clear();
            else {
                var t = Object.keys(e),
                    n = t.length;
                while (n) n--, delete e[t[n]]
            }
            return e
        }
    }
}), montageDefine("5c28f67", "shim-function", {
    dependencies: [],
    factory: function(e, t, n) {
        n.exports = Function, Function.noop = function() {}, Function.identity = function(e) {
            return e
        }, Function.by = function(e, t) {
            t = t || Object.compare, e = e || Function.identity;
            var n = function(n, r) {
                return t(e(n), e(r))
            };
            return n.compare = t, n.by = e, n
        }
    }
}), montageDefine("5c28f67", "generic-collection", {
    dependencies: [],
    factory: function(e, t, n) {
        "use strict";

        function r() {
            throw new Error("Can't construct. GenericCollection is a mixin.")
        }
        function i(e) {
            var t = [],
                n = Infinity;
            for (var r = 0; r < e.length; r++) {
                var i = e[r];
                e[r] = i.toArray(), i.length < n && (n = i.length)
            }
            for (var r = 0; r < e.length; r++) {
                var i = e[r];
                for (var s = 0; s < i.length; s++) s < n && s in i && (t[s] = t[s] || [], t[s][r] = i[s])
            }
            return t
        }
        n.exports = r, r.prototype.addEach = function(e) {
            if (e && Object(e) === e) if (typeof e.forEach == "function") e.forEach(this.add, this);
            else if (typeof e.length == "number") for (var t = 0; t < e.length; t++) this.add(e[t], t);
            else Object.keys(e).forEach(function(t) {
                this.add(e[t], t)
            }, this)
        }, r.prototype.deleteEach = function(e) {
            e.forEach(function(e) {
                this["delete"](e)
            }, this)
        }, r.prototype.forEach = function(e) {
            var t = arguments[1];
            return this.reduce(function(n, r, i, s, o) {
                e.call(t, r, i, s, o)
            }, undefined)
        }, r.prototype.map = function(e) {
            var t = arguments[1],
                n = [];
            return this.reduce(function(r, i, s, o, u) {
                n.push(e.call(t, i, s, o, u))
            }, undefined), n
        }, r.prototype.toArray = function() {
            return this.map(Function.identity)
        }, r.prototype.toObject = function() {
            var e = {};
            return this.reduce(function(t, n, r) {
                e[r] = n
            }, undefined), e
        }, r.prototype.filter = function(e) {
            var t = arguments[1],
                n = this.constructClone();
            return this.reduce(function(r, i, s, o, u) {
                e.call(t, i, s, o, u) && n.add(i)
            }, undefined), n
        }, r.prototype.every = function(e) {
            var t = arguments[1];
            return this.reduce(function(n, r, i, s, o) {
                return n && e.call(t, r, i, s, o)
            }, !0)
        }, r.prototype.some = function(e) {
            var t = arguments[1];
            return this.reduce(function(n, r, i, s, o) {
                return n || e.call(t, r, i, s, o)
            }, !1)
        }, r.prototype.all = function() {
            return this.every(Boolean)
        }, r.prototype.any = function() {
            return this.some(Boolean)
        }, r.prototype.min = function(e) {
            return e = this.contentCompare || Object.compare, this.reduce(function(t, n) {
                return e(n, t) < 0 ? n : t
            }, Infinity)
        }, r.prototype.max = function(e) {
            return e = this.contentCompare || Object.compare, this.reduce(function(t, n) {
                return e(n, t) > 0 ? n : t
            }, -Infinity)
        }, r.prototype.sum = function(e) {
            return e = e === undefined ? 0 : e, this.reduce(function(e, t) {
                return e + t
            }, e)
        }, r.prototype.average = function(e) {
            var t = e === undefined ? 0 : e,
                n = e === undefined ? 0 : e;
            return this.reduce(function(e, r) {
                t += r, n += 1
            }, undefined), t / n
        }, r.prototype.concat = function() {
            var e = this.constructClone(this);
            for (var t = 0; t < arguments.length; t++) e.addEach(arguments[t]);
            return e
        }, r.prototype.flatten = function() {
            var e = this;
            return this.reduce(function(t, n) {
                return n.forEach(function(e) {
                    this.push(e)
                }, t, e), t
            }, [])
        }, r.prototype.zip = function() {
            var e = Array.prototype.slice.call(arguments);
            return e.unshift(this), i(e)
        }, r.prototype.sorted = function(e, t, n) {
            return e = e || this.contentCompare || Object.compare, e.by ? (t = e.by, e = e.compare || this.contentCompare || Object.compare) : t = t || Function.identity, n === undefined && (n = 1), this.map(function(e) {
                return {
                    by: t(e),
                    value: e
                }
            }).sort(function(t, r) {
                return e(t.by, r.by) * n
            }).map(function(e) {
                return e.value
            })
        }, r.prototype.reversed = function() {
            return this.constructClone(this).reverse()
        }, r.prototype.clone = function(e, t) {
            if (e === undefined) e = Infinity;
            else if (e === 0) return this;
            var n = this.constructClone();
            return this.forEach(function(r, i) {
                n.add(Object.clone(r, e - 1, t), i)
            }, this), n
        }, r.prototype.only = function() {
            if (this.length === 0) throw new Error("Can't get only value in empty collection.");
            if (this.length > 1) throw new Error("Can't get only value in collection with multiple values.");
            return this.one()
        }
    }
}), montageDefine("5c28f67", "generic-order", {
    dependencies: ["./shim-object"],
    factory: function(e, t, n) {
        function r() {
            throw new Error("Can't construct. GenericOrder is a mixin.")
        }
        var i = e("./shim-object");
        n.exports = r, r.prototype.equals = function(e, t) {
            t = t || this.contentEquals || i.equals;
            if (this === e) return !0;
            if (!e) return !1;
            var n = this;
            return this.length === e.length && this.zip(e).every(function(e) {
                return t(e[0], e[1])
            })
        }, r.prototype.compare = function(e, t) {
            t = t || this.contentCompare || i.compare;
            if (this === e) return 0;
            if (!e) return 1;
            var n = Math.min(this.length, e.length),
                r = this.zip(e).reduce(function(e, r, i) {
                    return e === 0 ? i >= n ? e : t(r[0], r[1]) : e
                }, 0);
            return r === 0 ? this.length - e.length : r
        }
    }
}), montageDefine("8194d19", "index.html", {
    text: '<!doctype html>\n<html lang=en>\n<head>\n    <meta http-equiv=Content-Type content="text/html; charset=utf-8">\n    <title>Promise Me – Convert callbacks to promises</title>\n\n    <link rel=stylesheet href="assets/style/bootstrap.min.css">\n\n    <script src="packages/montage@06501b6/montage.js" async=async></script>\n    <script type="text/montage-serialization">{"demo":{"prototype":"ui/demo.reel","properties":{"element":{"#":"demo"}}}}</script>\n</head>\n<body>\n    <div class=container>\n        <div class=row>\n            <h1 class=span8>Promise Me</h1>\n            <div class=span4 style="margin: 15px 0 30px; line-height: 40px">\n                <a href="https://github.com/Stuk/promise-me" class="btn btn-success" style="float: right">View code and download</a>\n            </div>\n        </div>\n\n        <p class=lead>Promise Me helps you convert your Javascript code from using callbacks to using <a href="http://wiki.commonjs.org/wiki/Promises/A">promises</a>, for example through <a href="https://github.com/kriskowal/q">Q</a>, <a href="https://github.com/tildeio/rsvp.js">RSVP.js</a> or <a href="https://github.com/cujojs/when">when.js</a>.</p>\n        <p>It parses your code and then manipulates the AST to transform the callbacks into calls to <code>then()</code>, including a rejection handler if you handle the original callback error. Think of it as a slightly smarter find-and-replace. It will probably break your code and require you to fix it.</p>\n\n\n        <h2>Demo</h2>\n        <div data-montage-id=demo>Loading promise-me, esprima, estraverse, escodegen...</div>\n\n    </div>\n</body>\n</html>'
}), montageDefine("8194d19", "ui/demo.reel/demo", {
    dependencies: ["montage", "montage/ui/component", "montage/ui/controller/array-controller", "promise-me"],
    factory: function(e, t, n) {
        var r = e("montage").Montage,
            i = e("montage/ui/component").Component,
            s = e("montage/ui/controller/array-controller").ArrayController,
            o = e("promise-me").convert;
            var TAB = "    ";
        t.Demo = r.create(i, {
            didCreate: {
                value: function() {
                    var t = this;
                    this.examplesController = s.create(), e.async("examples.json").then(function(e) {
                        t.examplesController.content = e, t.examplesController.selectedIndexes = [0]
                    })
                }
            },
            examplesController: {
                value: null
            },

            prepareForDraw: {
                value: function () {
                    this.templateObjects.before.element.addEventListener("keydown", this, false);
                }
            },

            handleKeydown: {
                value: function(e) {
                    var target = e.target;
                    var keyCode = e.keyCode;

                    if (keyCode == 9) {
                        e.preventDefault();
                        var start = target.selectionStart;
                        var end = target.selectionEnd;

                        target.value = target.value.substring(0, start) + TAB + target.value.substring(end);

                        target.selectionStart = target.selectionEnd = start + TAB.length;
                    }
                }
            }
        }), t.PromiseMeConverter = r.create(r, {
            convert: {
                value: function(e) {
                    var t;
                    try {
                        t = o(e)
                    } catch (n) {
                        t = n
                    }
                    return t
                }
            }
        })
    }
}), montageDefine("8194d19", "ui/demo.reel/demo.html", {
    text: '<!doctype html>\n<html>\n<head>\n    <title></title>\n    <link rel=stylesheet type="text/css" href=demo.css>\n    <script type="text/montage-serialization">{"owner":{"properties":{"element":{"#":"demo"}}},"promiseMeConverter":{"prototype":"ui/demo.reel[PromiseMeConverter]"},"exampleSelect":{"prototype":"montage/ui/select.reel","properties":{"element":{"#":"exampleSelect"},"textPropertyPath":"name"},"bindings":{"contentController":{"<-":"@owner.examplesController"}}},"before":{"prototype":"montage/ui/textarea.reel","properties":{"element":{"#":"before"}},"bindings":{"value":{"<-":"@owner.examplesController.selectedObjects.0.code"}}},"after":{"prototype":"montage/ui/textarea.reel","properties":{"element":{"#":"after"}},"bindings":{"value":{"<-":"@before.value","converter":{"@":"promiseMeConverter"}}}}}</script>\n</head>\n<body>\n    <div data-montage-id=demo class=Demo>\n        <div class=row>\n            <label class=span12>\n                Pick an example\n                <select data-montage-id=exampleSelect></select>\n            </label>\n        </div>\n\n        <div class="row input">\n            <div class=span6>\n                <strong>Before</strong>\n                <textarea data-montage-id=before class=span6 wrap=off></textarea>\n            </div>\n            <div class=span6>\n                <strong>After</strong>\n                <textarea data-montage-id=after class=span6 wrap=off></textarea>\n            </div>\n        </div>\n    </div>\n</body>\n</html>'
}), montageDefine("44127fb", "promise-me", {
    dependencies: ["esprima", "escodegen", "estraverse", "escope"],
    factory: function(e, t, n) {
        (function(n, r) {
            typeof t == "object" ? r(t, e("esprima"), e("escodegen"), e("estraverse"), e("escope")) : typeof define == "function" && define.amd ? define(["exports", "esprima", "escodegen", "estraverse", "escope"], r) : r(n.promiseMe = n.promiseMe || {}, n.esprima, n.escodegen, n.estraverse, n.escope)
        })(this, function(e, t, n, r, i) {
            function s(e) {
                var t = Array.prototype.slice.call(arguments, 1);
                return function() {
                    return e.apply(this, t.concat(Array.prototype.slice.call(arguments)))
                }
            }
            function o(e) {
                return e !== null && typeof e == "object"
            }
            function u(e, t) {
                for (var n in e) if (typeof t[n] == "undefined") t[n] = e[n];
                else if (o(t[n]) || o(e[n])) {
                    if (!o(t[n]) || !o(e[n])) throw new TypeError("Cannot combine object with non-object, '" + n + "'");
                    t[n] = u(t[n], e[n])
                } else t[n] = e[n];
                return t
            }
            function a(e, t, n) {
                if (e(n)) return t(n)
            }
            function f(e) {
                var t = e.arguments;
                return e.type === "CallExpression" && t.length && t[t.length - 1].type === "FunctionExpression" && t[t.length - 1].params.length === 2
            }
            function l(e) {
                var t = e,
                    n = t.arguments,
                    r = n.pop();
                return {
                    type: "CallExpression",
                    callee: {
                        type: "MemberExpression",
                        computed: !1,
                        object: t,
                        property: {
                            type: "Identifier",
                            name: "then"
                        }
                    },
                    arguments: c(r)
                }
            }
            function c(e) {
                var t = [e],
                    n = e.params.shift(),
                    r = h(e, n);
                return r && t.push(r), t
            }
            function h(e, t) {
                var n = t.name;
                if (e.body.type === "BlockStatement") {
                    var r = e.body.body;
                    for (var i = 0, s = r.length; i < s; i++) if (r[i].type === "IfStatement" && r[i].test.type === "Identifier" && r[i].test.name === n) {
                        var o = r.splice(i, 1)[0].consequent;
                        return o.type !== "BlockStatement" && (o = {
                            type: "BlockStatement",
                            body: [o]
                        }), {
                            type: "FunctionExpression",
                            id: null,
                            params: [t],
                            defaults: [],
                            body: o,
                            rest: null,
                            generator: !1,
                            expression: !1
                        }
                    }
                }
            }
            function p(e) {
                if (d(e)) {
                    var t = e.arguments[0],
                        n = t.body.body,
                        r = n[n.length - 1],
                        s = r.expression.callee.object,
                        o = r.expression.arguments,
                        u = {
                            type: "Program",
                            body: [{
                                type: "ExpressionStatement",
                                expression: t
                            }]
                        }, a = i.analyze(u),
                        f = a.scopes[1].through,
                        l = a.acquire(o[0]).through;
                    for (var c = l.length - 1; c >= 0; c--) if (f.indexOf(l[c]) === -1) return e;
                    if (o.length >= 2) {
                        var h = a.acquire(o[1]).through;
                        for (c = h.length - 1; c >= 0; c--) if (f.indexOf(h[c]) === -1) return e
                    }
                    return n[n.length - 1] = {
                        type: "ReturnStatement",
                        argument: s
                    }, p({
                        type: "CallExpression",
                        callee: {
                            type: "MemberExpression",
                            computed: !1,
                            object: e,
                            property: {
                                type: "Identifier",
                                name: "then"
                            }
                        },
                        arguments: o
                    })
                }
                return e
            }
            function d(e) {
                var t, n, r;
                if (v(e, {
                    type: "CallExpression",
                    callee: {
                        type: "MemberExpression",
                        property: {
                            type: "Identifier",
                            name: "then"
                        }
                    },
                    arguments: [{
                        type: "FunctionExpression",
                        body: {
                            type: "BlockStatement"
                        }
                    }]
                })) {
                    var i = e.arguments[0].body.body,
                        s = i[i.length - 1];
                    return v(s, {
                        type: "ExpressionStatement",
                        expression: {
                            type: "CallExpression",
                            callee: {
                                type: "MemberExpression",
                                property: {
                                    type: "Identifier",
                                    name: "then"
                                }
                            }
                        }
                    })
                }
                return !1
            }
            function v(e, t) {
                return !e || t === null || typeof t != "object" ? e === t : Object.keys(t).every(function(n) {
                    return v(e[n], t[n])
                })
            }
            var m = {
                loc: !0,
                range: !0,
                raw: !0,
                tokens: !0,
                comment: !0
            }, g = {
                parse: t.parse,
                comment: !0
            }, y = {
                parse: m,
                generate: g,
                matcher: f,
                replacer: l,
                flattener: p
            };
            e.convert = function(e, i, o) {
                i ? i = u(y, i) : i = y;
                var f = t.parse(e, i.parse);
                return f = n.attachComments(f, f.comments, f.tokens), r.replace(f, {
                    leave: s(a, i.matcher, i.replacer)
                }), r.replace(f, {
                    enter: i.flattener
                }), n.generate(f, i.generate)
            }, e.NODE_MATCHER = f, e.NODE_REPLACER = l, e.FLATTENER = p
        })
    }
}), montageDefine("cd1ff07", "esprima", {
    dependencies: [],
    factory: function(e, t, n) {
        (function(e, n) {
            "use strict";
            typeof define == "function" && define.amd ? define(["exports"], n) : typeof t != "undefined" ? n(t) : n(e.esprima = {})
        })(this, function(e) {
            "use strict";

            function t(e, t) {
                if (!e) throw new Error("ASSERT: " + t)
            }
            function n(e, t) {
                return pn.slice(e, t)
            }
            function r(e) {
                return "0123456789".indexOf(e) >= 0
            }
            function i(e) {
                return "0123456789abcdefABCDEF".indexOf(e) >= 0
            }
            function s(e) {
                return "01234567".indexOf(e) >= 0
            }
            function o(e) {
                return e === " " || e === "	" || e === "" || e === "\f" || e === " " || e.charCodeAt(0) >= 5760 && " ᠎             　﻿".indexOf(e) >= 0
            }
            function u(e) {
                return e === "\n" || e === "\r" || e === "\u2028" || e === "\u2029"
            }
            function a(e) {
                return e === "$" || e === "_" || e === "\\" || e >= "a" && e <= "z" || e >= "A" && e <= "Z" || e.charCodeAt(0) >= 128 && hn.NonAsciiIdentifierStart.test(e)
            }
            function f(e) {
                return e === "$" || e === "_" || e === "\\" || e >= "a" && e <= "z" || e >= "A" && e <= "Z" || e >= "0" && e <= "9" || e.charCodeAt(0) >= 128 && hn.NonAsciiIdentifierPart.test(e)
            }
            function l(e) {
                switch (e) {
                    case "class":
                    case "enum":
                    case "export":
                    case "extends":
                    case "import":
                    case "super":
                        return !0
                }
                return !1
            }
            function c(e) {
                switch (e) {
                    case "implements":
                    case "interface":
                    case "package":
                    case "private":
                    case "protected":
                    case "public":
                    case "static":
                    case "yield":
                    case "let":
                        return !0
                }
                return !1
            }
            function h(e) {
                return e === "eval" || e === "arguments"
            }
            function p(e) {
                var t = !1;
                switch (e.length) {
                    case 2:
                        t = e === "if" || e === "in" || e === "do";
                        break;
                    case 3:
                        t = e === "var" || e === "for" || e === "new" || e === "try";
                        break;
                    case 4:
                        t = e === "this" || e === "else" || e === "case" || e === "void" || e === "with";
                        break;
                    case 5:
                        t = e === "while" || e === "break" || e === "catch" || e === "throw";
                        break;
                    case 6:
                        t = e === "return" || e === "typeof" || e === "delete" || e === "switch";
                        break;
                    case 7:
                        t = e === "default" || e === "finally";
                        break;
                    case 8:
                        t = e === "function" || e === "continue" || e === "debugger";
                        break;
                    case 10:
                        t = e === "instanceof"
                }
                if (t) return !0;
                switch (e) {
                    case "const":
                        return !0;
                    case "yield":
                    case "let":
                        return !0
                }
                return dn && c(e) ? !0 : l(e)
            }
            function d() {
                var e, t, n;
                t = !1, n = !1;
                while (vn < yn) {
                    e = pn[vn];
                    if (n) e = pn[vn++], u(e) && (n = !1, e === "\r" && pn[vn] === "\n" && ++vn, ++mn, gn = vn);
                    else if (t) u(e) ? (e === "\r" && pn[vn + 1] === "\n" && ++vn, ++mn, ++vn, gn = vn, vn >= yn && C({}, cn.UnexpectedToken, "ILLEGAL")) : (e = pn[vn++], vn >= yn && C({}, cn.UnexpectedToken, "ILLEGAL"), e === "*" && (e = pn[vn], e === "/" && (++vn, t = !1)));
                    else if (e === "/") {
                        e = pn[vn + 1];
                        if (e === "/") vn += 2, n = !0;
                        else {
                            if (e !== "*") break;
                            vn += 2, t = !0, vn >= yn && C({}, cn.UnexpectedToken, "ILLEGAL")
                        }
                    } else if (o(e))++vn;
                    else {
                        if (!u(e)) break;
                        ++vn, e === "\r" && pn[vn] === "\n" && ++vn, ++mn, gn = vn
                    }
                }
            }
            function v(e) {
                var t, n, r, s = 0;
                n = e === "u" ? 4 : 2;
                for (t = 0; t < n; ++t) {
                    if (!(vn < yn && i(pn[vn]))) return "";
                    r = pn[vn++], s = s * 16 + "0123456789abcdef".indexOf(r.toLowerCase())
                }
                return String.fromCharCode(s)
            }
            function m() {
                var e, t, n, r;
                e = pn[vn];
                if (!a(e)) return;
                t = vn;
                if (e === "\\") {
                    ++vn;
                    if (pn[vn] !== "u") return;
                    ++vn, r = vn, e = v("u");
                    if (e) {
                        if (e === "\\" || !a(e)) return;
                        n = e
                    } else vn = r, n = "u"
                } else n = pn[vn++];
                while (vn < yn) {
                    e = pn[vn];
                    if (!f(e)) break;
                    if (e === "\\") {
                        ++vn;
                        if (pn[vn] !== "u") return;
                        ++vn, r = vn, e = v("u");
                        if (e) {
                            if (e === "\\" || !f(e)) return;
                            n += e
                        } else vn = r, n += "u"
                    } else n += pn[vn++]
                }
                return n.length === 1 ? {
                    type: un.Identifier,
                    value: n,
                    lineNumber: mn,
                    lineStart: gn,
                    range: [t, vn]
                } : p(n) ? {
                    type: un.Keyword,
                    value: n,
                    lineNumber: mn,
                    lineStart: gn,
                    range: [t, vn]
                } : n === "null" ? {
                    type: un.NullLiteral,
                    value: n,
                    lineNumber: mn,
                    lineStart: gn,
                    range: [t, vn]
                } : n === "true" || n === "false" ? {
                    type: un.BooleanLiteral,
                    value: n,
                    lineNumber: mn,
                    lineStart: gn,
                    range: [t, vn]
                } : {
                    type: un.Identifier,
                    value: n,
                    lineNumber: mn,
                    lineStart: gn,
                    range: [t, vn]
                }
            }
            function g() {
                var e = vn,
                    t = pn[vn],
                    n, i, s;
                if (t === ";" || t === "{" || t === "}") return ++vn, {
                    type: un.Punctuator,
                    value: t,
                    lineNumber: mn,
                    lineStart: gn,
                    range: [e, vn]
                };
                if (t === "," || t === "(" || t === ")") return ++vn, {
                    type: un.Punctuator,
                    value: t,
                    lineNumber: mn,
                    lineStart: gn,
                    range: [e, vn]
                };
                n = pn[vn + 1];
                if (t === "." && !r(n)) return {
                    type: un.Punctuator,
                    value: pn[vn++],
                    lineNumber: mn,
                    lineStart: gn,
                    range: [e, vn]
                };
                i = pn[vn + 2], s = pn[vn + 3];
                if (t === ">" && n === ">" && i === ">" && s === "=") return vn += 4, {
                    type: un.Punctuator,
                    value: ">>>=",
                    lineNumber: mn,
                    lineStart: gn,
                    range: [e, vn]
                };
                if (t === "=" && n === "=" && i === "=") return vn += 3, {
                    type: un.Punctuator,
                    value: "===",
                    lineNumber: mn,
                    lineStart: gn,
                    range: [e, vn]
                };
                if (t === "!" && n === "=" && i === "=") return vn += 3, {
                    type: un.Punctuator,
                    value: "!==",
                    lineNumber: mn,
                    lineStart: gn,
                    range: [e, vn]
                };
                if (t === ">" && n === ">" && i === ">") return vn += 3, {
                    type: un.Punctuator,
                    value: ">>>",
                    lineNumber: mn,
                    lineStart: gn,
                    range: [e, vn]
                };
                if (t === "<" && n === "<" && i === "=") return vn += 3, {
                    type: un.Punctuator,
                    value: "<<=",
                    lineNumber: mn,
                    lineStart: gn,
                    range: [e, vn]
                };
                if (t === ">" && n === ">" && i === "=") return vn += 3, {
                    type: un.Punctuator,
                    value: ">>=",
                    lineNumber: mn,
                    lineStart: gn,
                    range: [e, vn]
                };
                if (n === "=" && "<>=!+-*%&|^/".indexOf(t) >= 0) return vn += 2, {
                    type: un.Punctuator,
                    value: t + n,
                    lineNumber: mn,
                    lineStart: gn,
                    range: [e, vn]
                };
                if (t === n && "+-<>&|".indexOf(t) >= 0 && "+-<>&|".indexOf(n) >= 0) return vn += 2, {
                    type: un.Punctuator,
                    value: t + n,
                    lineNumber: mn,
                    lineStart: gn,
                    range: [e, vn]
                };
                if ("[]<>+-*%&|^!~?:=/".indexOf(t) >= 0) return {
                    type: un.Punctuator,
                    value: pn[vn++],
                    lineNumber: mn,
                    lineStart: gn,
                    range: [e, vn]
                }
            }
            function y() {
                var e, n, o;
                o = pn[vn], t(r(o) || o === ".", "Numeric literal must start with a decimal digit or a decimal point"), n = vn, e = "";
                if (o !== ".") {
                    e = pn[vn++], o = pn[vn];
                    if (e === "0") {
                        if (o === "x" || o === "X") {
                            e += pn[vn++];
                            while (vn < yn) {
                                o = pn[vn];
                                if (!i(o)) break;
                                e += pn[vn++]
                            }
                            return e.length <= 2 && C({}, cn.UnexpectedToken, "ILLEGAL"), vn < yn && (o = pn[vn], a(o) && C({}, cn.UnexpectedToken, "ILLEGAL")), {
                                type: un.NumericLiteral,
                                value: parseInt(e, 16),
                                lineNumber: mn,
                                lineStart: gn,
                                range: [n, vn]
                            }
                        }
                        if (s(o)) {
                            e += pn[vn++];
                            while (vn < yn) {
                                o = pn[vn];
                                if (!s(o)) break;
                                e += pn[vn++]
                            }
                            return vn < yn && (o = pn[vn], (a(o) || r(o)) && C({}, cn.UnexpectedToken, "ILLEGAL")), {
                                type: un.NumericLiteral,
                                value: parseInt(e, 8),
                                octal: !0,
                                lineNumber: mn,
                                lineStart: gn,
                                range: [n, vn]
                            }
                        }
                        r(o) && C({}, cn.UnexpectedToken, "ILLEGAL")
                    }
                    while (vn < yn) {
                        o = pn[vn];
                        if (!r(o)) break;
                        e += pn[vn++]
                    }
                }
                if (o === ".") {
                    e += pn[vn++];
                    while (vn < yn) {
                        o = pn[vn];
                        if (!r(o)) break;
                        e += pn[vn++]
                    }
                }
                if (o === "e" || o === "E") {
                    e += pn[vn++], o = pn[vn];
                    if (o === "+" || o === "-") e += pn[vn++];
                    o = pn[vn];
                    if (r(o)) {
                        e += pn[vn++];
                        while (vn < yn) {
                            o = pn[vn];
                            if (!r(o)) break;
                            e += pn[vn++]
                        }
                    } else o = "character " + o, vn >= yn && (o = "<end>"), C({}, cn.UnexpectedToken, "ILLEGAL")
                }
                return vn < yn && (o = pn[vn], a(o) && C({}, cn.UnexpectedToken, "ILLEGAL")), {
                    type: un.NumericLiteral,
                    value: parseFloat(e),
                    lineNumber: mn,
                    lineStart: gn,
                    range: [n, vn]
                }
            }
            function b() {
                var e = "",
                    n, r, i, o, a, f, l = !1;
                n = pn[vn], t(n === "'" || n === '"', "String literal must starts with a quote"), r = vn, ++vn;
                while (vn < yn) {
                    i = pn[vn++];
                    if (i === n) {
                        n = "";
                        break
                    }
                    if (i === "\\") {
                        i = pn[vn++];
                        if (!u(i)) switch (i) {
                            case "n":
                                e += "\n";
                                break;
                            case "r":
                                e += "\r";
                                break;
                            case "t":
                                e += "	";
                                break;
                            case "u":
                            case "x":
                                f = vn, a = v(i), a ? e += a : (vn = f, e += i);
                                break;
                            case "b":
                                e += "\b";
                                break;
                            case "f":
                                e += "\f";
                                break;
                            case "v":
                                e += "";
                                break;
                            default:
                                s(i) ? (o = "01234567".indexOf(i), o !== 0 && (l = !0), vn < yn && s(pn[vn]) && (l = !0, o = o * 8 + "01234567".indexOf(pn[vn++]), "0123".indexOf(i) >= 0 && vn < yn && s(pn[vn]) && (o = o * 8 + "01234567".indexOf(pn[vn++]))), e += String.fromCharCode(o)) : e += i
                        } else ++mn, i === "\r" && pn[vn] === "\n" && ++vn
                    } else {
                        if (u(i)) break;
                        e += i
                    }
                }
                return n !== "" && C({}, cn.UnexpectedToken, "ILLEGAL"), {
                    type: un.StringLiteral,
                    value: e,
                    octal: l,
                    lineNumber: mn,
                    lineStart: gn,
                    range: [r, vn]
                }
            }
            function w() {
                var e, n, r, i, s, o, a = !1,
                    l, c = !1;
                bn = null, d(), r = vn, n = pn[vn], t(n === "/", "Regular expression literal must start with a slash"), e = pn[vn++];
                while (vn < yn) {
                    n = pn[vn++], e += n;
                    if (a) n === "]" && (a = !1);
                    else if (n === "\\") n = pn[vn++], u(n) && C({}, cn.UnterminatedRegExp), e += n;
                    else {
                        if (n === "/") {
                            c = !0;
                            break
                        }
                        n === "[" ? a = !0 : u(n) && C({}, cn.UnterminatedRegExp)
                    }
                }
                c || C({}, cn.UnterminatedRegExp), i = e.substr(1, e.length - 2), s = "";
                while (vn < yn) {
                    n = pn[vn];
                    if (!f(n)) break;
                    ++vn;
                    if (n === "\\" && vn < yn) {
                        n = pn[vn];
                        if (n === "u") {
                            ++vn, l = vn, n = v("u");
                            if (n) {
                                s += n, e += "\\u";
                                for (; l < vn; ++l) e += pn[l]
                            } else vn = l, s += "u", e += "\\u"
                        } else e += "\\"
                    } else s += n, e += n
                }
                try {
                    o = new RegExp(i, s)
                } catch (h) {
                    C({}, cn.InvalidRegExp)
                }
                return {
                    literal: e,
                    value: o,
                    range: [r, vn]
                }
            }
            function E(e) {
                return e.type === un.Identifier || e.type === un.Keyword || e.type === un.BooleanLiteral || e.type === un.NullLiteral
            }
            function S() {
                var e, t;
                d();
                if (vn >= yn) return {
                    type: un.EOF,
                    lineNumber: mn,
                    lineStart: gn,
                    range: [vn, vn]
                };
                t = g();
                if (typeof t != "undefined") return t;
                e = pn[vn];
                if (e === "'" || e === '"') return b();
                if (e === "." || r(e)) return y();
                t = m();
                if (typeof t != "undefined") return t;
                C({}, cn.UnexpectedToken, "ILLEGAL")
            }
            function x() {
                var e;
                return bn ? (vn = bn.range[1], mn = bn.lineNumber, gn = bn.lineStart, e = bn, bn = null, e) : (bn = null, S())
            }
            function T() {
                var e, t, n;
                return bn !== null ? bn : (e = vn, t = mn, n = gn, bn = S(), vn = e, mn = t, gn = n, bn)
            }
            function N() {
                var e, t, n, r;
                return e = vn, t = mn, n = gn, d(), r = mn !== t, vn = e, mn = t, gn = n, r
            }
            function C(e, t) {
                var n, r = Array.prototype.slice.call(arguments, 2),
                    i = t.replace(/%(\d)/g, function(e, t) {
                        return r[t] || ""
                    });
                throw typeof e.lineNumber == "number" ? (n = new Error("Line " + e.lineNumber + ": " + i), n.index = e.range[0], n.lineNumber = e.lineNumber, n.column = e.range[0] - gn + 1) : (n = new Error("Line " + mn + ": " + i), n.index = vn, n.lineNumber = mn, n.column = vn - gn + 1), n
            }
            function k() {
                try {
                    C.apply(null, arguments)
                } catch (e) {
                    if (!En.errors) throw e;
                    En.errors.push(e)
                }
            }
            function L(e) {
                e.type === un.EOF && C(e, cn.UnexpectedEOS), e.type === un.NumericLiteral && C(e, cn.UnexpectedNumber), e.type === un.StringLiteral && C(e, cn.UnexpectedString), e.type === un.Identifier && C(e, cn.UnexpectedIdentifier);
                if (e.type === un.Keyword) {
                    if (l(e.value)) C(e, cn.UnexpectedReserved);
                    else if (dn && c(e.value)) {
                        k(e, cn.StrictReservedWord);
                        return
                    }
                    C(e, cn.UnexpectedToken, e.value)
                }
                C(e, cn.UnexpectedToken, e.value)
            }
            function A(e) {
                var t = x();
                (t.type !== un.Punctuator || t.value !== e) && L(t)
            }
            function O(e) {
                var t = x();
                (t.type !== un.Keyword || t.value !== e) && L(t)
            }
            function M(e) {
                var t = T();
                return t.type === un.Punctuator && t.value === e
            }
            function _(e) {
                var t = T();
                return t.type === un.Keyword && t.value === e
            }
            function D() {
                var e = T(),
                    t = e.value;
                return e.type !== un.Punctuator ? !1 : t === "=" || t === "*=" || t === "/=" || t === "%=" || t === "+=" || t === "-=" || t === "<<=" || t === ">>=" || t === ">>>=" || t === "&=" || t === "^=" || t === "|="
            }
            function P() {
                var e, t;
                if (pn[vn] === ";") {
                    x();
                    return
                }
                t = mn, d();
                if (mn !== t) return;
                if (M(";")) {
                    x();
                    return
                }
                e = T(), e.type !== un.EOF && !M("}") && L(e)
            }
            function H(e) {
                return e.type === fn.Identifier || e.type === fn.MemberExpression
            }
            function B() {
                var e = [];
                A("[");
                while (!M("]")) M(",") ? (x(), e.push(null)) : (e.push(ft()), M("]") || A(","));
                return A("]"), {
                    type: fn.ArrayExpression,
                    elements: e
                }
            }
            function j(e, t) {
                var n, r;
                return n = dn, r = Bt(), t && dn && h(e[0].name) && k(t, cn.StrictParamName), dn = n, {
                    type: fn.FunctionExpression,
                    id: null,
                    params: e,
                    defaults: [],
                    body: r,
                    rest: null,
                    generator: !1,
                    expression: !1
                }
            }
            function F() {
                var e = x();
                return e.type === un.StringLiteral || e.type === un.NumericLiteral ? (dn && e.octal && k(e, cn.StrictOctalLiteral), Jt(e)) : {
                    type: fn.Identifier,
                    name: e.value
                }
            }
            function I() {
                var e, t, n, r;
                e = T();
                if (e.type === un.Identifier) return n = F(), e.value === "get" && !M(":") ? (t = F(), A("("), A(")"), {
                    type: fn.Property,
                    key: t,
                    value: j([]),
                    kind: "get"
                }) : e.value === "set" && !M(":") ? (t = F(), A("("), e = T(), e.type !== un.Identifier && L(x()), r = [pt()], A(")"), {
                    type: fn.Property,
                    key: t,
                    value: j(r, e),
                    kind: "set"
                }) : (A(":"), {
                    type: fn.Property,
                    key: n,
                    value: ft(),
                    kind: "init"
                });
                if (e.type !== un.EOF && e.type !== un.Punctuator) return t = F(), A(":"), {
                    type: fn.Property,
                    key: t,
                    value: ft(),
                    kind: "init"
                };
                L(e)
            }
            function q() {
                var e = [],
                    t, n, r, i = {}, s = String;
                A("{");
                while (!M("}")) t = I(), t.key.type === fn.Identifier ? n = t.key.name : n = s(t.key.value), r = t.kind === "init" ? ln.Data : t.kind === "get" ? ln.Get : ln.Set, Object.prototype.hasOwnProperty.call(i, n) ? (i[n] === ln.Data ? dn && r === ln.Data ? k({}, cn.StrictDuplicateProperty) : r !== ln.Data && k({}, cn.AccessorDataProperty) : r === ln.Data ? k({}, cn.AccessorDataProperty) : i[n] & r && k({}, cn.AccessorGetSet), i[n] |= r) : i[n] = r, e.push(t), M("}") || A(",");
                return A("}"), {
                    type: fn.ObjectExpression,
                    properties: e
                }
            }
            function R() {
                var e;
                return A("("), e = lt(), A(")"), e
            }
            function U() {
                var e = T(),
                    t = e.type;
                if (t === un.Identifier) return {
                    type: fn.Identifier,
                    name: x().value
                };
                if (t === un.StringLiteral || t === un.NumericLiteral) return dn && e.octal && k(e, cn.StrictOctalLiteral), Jt(x());
                if (t === un.Keyword) {
                    if (_("this")) return x(), {
                        type: fn.ThisExpression
                    };
                    if (_("function")) return Ft()
                }
                return t === un.BooleanLiteral ? (x(), e.value = e.value === "true", Jt(e)) : t === un.NullLiteral ? (x(), e.value = null, Jt(e)) : M("[") ? B() : M("{") ? q() : M("(") ? R() : M("/") || M("/=") ? Jt(w()) : L(x())
            }
            function z() {
                var e = [];
                A("(");
                if (!M(")")) while (vn < yn) {
                    e.push(ft());
                    if (M(")")) break;
                    A(",")
                }
                return A(")"), e
            }
            function W() {
                var e = x();
                return E(e) || L(e), {
                    type: fn.Identifier,
                    name: e.value
                }
            }
            function X() {
                return A("."), W()
            }
            function V() {
                var e;
                return A("["), e = lt(), A("]"), e
            }
            function $() {
                var e;
                return O("new"), e = {
                    type: fn.NewExpression,
                    callee: K(),
                    arguments: []
                }, M("(") && (e.arguments = z()), e
            }
            function J() {
                var e;
                e = _("new") ? $() : U();
                while (M(".") || M("[") || M("(")) M("(") ? e = {
                    type: fn.CallExpression,
                    callee: e,
                    arguments: z()
                } : M("[") ? e = {
                    type: fn.MemberExpression,
                    computed: !0,
                    object: e,
                    property: V()
                } : e = {
                    type: fn.MemberExpression,
                    computed: !1,
                    object: e,
                    property: X()
                };
                return e
            }
            function K() {
                var e;
                e = _("new") ? $() : U();
                while (M(".") || M("[")) M("[") ? e = {
                    type: fn.MemberExpression,
                    computed: !0,
                    object: e,
                    property: V()
                } : e = {
                    type: fn.MemberExpression,
                    computed: !1,
                    object: e,
                    property: X()
                };
                return e
            }
            function Q() {
                var e = J(),
                    t;
                return t = T(), t.type !== un.Punctuator ? e : ((M("++") || M("--")) && !N() && (dn && e.type === fn.Identifier && h(e.name) && k({}, cn.StrictLHSPostfix), H(e) || C({}, cn.InvalidLHSInAssignment), e = {
                    type: fn.UpdateExpression,
                    operator: x().value,
                    argument: e,
                    prefix: !1
                }), e)
            }
            function G() {
                var e, t;
                return e = T(), e.type !== un.Punctuator && e.type !== un.Keyword ? Q() : M("++") || M("--") ? (e = x(), t = G(), dn && t.type === fn.Identifier && h(t.name) && k({}, cn.StrictLHSPrefix), H(t) || C({}, cn.InvalidLHSInAssignment), t = {
                    type: fn.UpdateExpression,
                    operator: e.value,
                    argument: t,
                    prefix: !0
                }, t) : M("+") || M("-") || M("~") || M("!") ? (t = {
                    type: fn.UnaryExpression,
                    operator: x().value,
                    argument: G()
                }, t) : _("delete") || _("void") || _("typeof") ? (t = {
                    type: fn.UnaryExpression,
                    operator: x().value,
                    argument: G()
                }, dn && t.operator === "delete" && t.argument.type === fn.Identifier && k({}, cn.StrictDelete), t) : Q()
            }
            function Y() {
                var e = G();
                while (M("*") || M("/") || M("%")) e = {
                    type: fn.BinaryExpression,
                    operator: x().value,
                    left: e,
                    right: G()
                };
                return e
            }
            function Z() {
                var e = Y();
                while (M("+") || M("-")) e = {
                    type: fn.BinaryExpression,
                    operator: x().value,
                    left: e,
                    right: Y()
                };
                return e
            }
            function et() {
                var e = Z();
                while (M("<<") || M(">>") || M(">>>")) e = {
                    type: fn.BinaryExpression,
                    operator: x().value,
                    left: e,
                    right: Z()
                };
                return e
            }
            function tt() {
                var e, t;
                t = wn.allowIn, wn.allowIn = !0, e = et();
                while (M("<") || M(">") || M("<=") || M(">=") || t && _("in") || _("instanceof")) e = {
                    type: fn.BinaryExpression,
                    operator: x().value,
                    left: e,
                    right: et()
                };
                return wn.allowIn = t, e
            }
            function nt() {
                var e = tt();
                while (M("==") || M("!=") || M("===") || M("!==")) e = {
                    type: fn.BinaryExpression,
                    operator: x().value,
                    left: e,
                    right: tt()
                };
                return e
            }
            function rt() {
                var e = nt();
                while (M("&")) x(), e = {
                    type: fn.BinaryExpression,
                    operator: "&",
                    left: e,
                    right: nt()
                };
                return e
            }
            function it() {
                var e = rt();
                while (M("^")) x(), e = {
                    type: fn.BinaryExpression,
                    operator: "^",
                    left: e,
                    right: rt()
                };
                return e
            }
            function st() {
                var e = it();
                while (M("|")) x(), e = {
                    type: fn.BinaryExpression,
                    operator: "|",
                    left: e,
                    right: it()
                };
                return e
            }
            function ot() {
                var e = st();
                while (M("&&")) x(), e = {
                    type: fn.LogicalExpression,
                    operator: "&&",
                    left: e,
                    right: st()
                };
                return e
            }
            function ut() {
                var e = ot();
                while (M("||")) x(), e = {
                    type: fn.LogicalExpression,
                    operator: "||",
                    left: e,
                    right: ot()
                };
                return e
            }
            function at() {
                var e, t, n;
                return e = ut(), M("?") && (x(), t = wn.allowIn, wn.allowIn = !0, n = ft(), wn.allowIn = t, A(":"), e = {
                    type: fn.ConditionalExpression,
                    test: e,
                    consequent: n,
                    alternate: ft()
                }), e
            }
            function ft() {
                var e, t;
                return e = T(), t = at(), D() && (H(t) || C({}, cn.InvalidLHSInAssignment), dn && t.type === fn.Identifier && h(t.name) && k(e, cn.StrictLHSAssignment), t = {
                    type: fn.AssignmentExpression,
                    operator: x().value,
                    left: t,
                    right: ft()
                }), t
            }
            function lt() {
                var e = ft();
                if (M(",")) {
                    e = {
                        type: fn.SequenceExpression,
                        expressions: [e]
                    };
                    while (vn < yn) {
                        if (!M(",")) break;
                        x(), e.expressions.push(ft())
                    }
                }
                return e
            }
            function ct() {
                var e = [],
                    t;
                while (vn < yn) {
                    if (M("}")) break;
                    t = It();
                    if (typeof t == "undefined") break;
                    e.push(t)
                }
                return e
            }
            function ht() {
                var e;
                return A("{"), e = ct(), A("}"), {
                    type: fn.BlockStatement,
                    body: e
                }
            }
            function pt() {
                var e = x();
                return e.type !== un.Identifier && L(e), {
                    type: fn.Identifier,
                    name: e.value
                }
            }
            function dt(e) {
                var t = pt(),
                    n = null;
                return dn && h(t.name) && k({}, cn.StrictVarName), e === "const" ? (A("="), n = ft()) : M("=") && (x(), n = ft()), {
                    type: fn.VariableDeclarator,
                    id: t,
                    init: n
                }
            }
            function vt(e) {
                var t = [];
                while (vn < yn) {
                    t.push(dt(e));
                    if (!M(",")) break;
                    x()
                }
                return t
            }
            function mt() {
                var e;
                return O("var"), e = vt(), P(), {
                    type: fn.VariableDeclaration,
                    declarations: e,
                    kind: "var"
                }
            }
            function gt(e) {
                var t;
                return O(e), t = vt(e), P(), {
                    type: fn.VariableDeclaration,
                    declarations: t,
                    kind: e
                }
            }
            function yt() {
                return A(";"), {
                    type: fn.EmptyStatement
                }
            }
            function bt() {
                var e = lt();
                return P(), {
                    type: fn.ExpressionStatement,
                    expression: e
                }
            }
            function wt() {
                var e, t, n;
                return O("if"), A("("), e = lt(), A(")"), t = Ht(), _("else") ? (x(), n = Ht()) : n = null, {
                    type: fn.IfStatement,
                    test: e,
                    consequent: t,
                    alternate: n
                }
            }
            function Et() {
                var e, t, n;
                return O("do"), n = wn.inIteration, wn.inIteration = !0, e = Ht(), wn.inIteration = n, O("while"), A("("), t = lt(), A(")"), M(";") && x(), {
                    type: fn.DoWhileStatement,
                    body: e,
                    test: t
                }
            }
            function St() {
                var e, t, n;
                return O("while"), A("("), e = lt(), A(")"), n = wn.inIteration, wn.inIteration = !0, t = Ht(), wn.inIteration = n, {
                    type: fn.WhileStatement,
                    test: e,
                    body: t
                }
            }
            function xt() {
                var e = x();
                return {
                    type: fn.VariableDeclaration,
                    declarations: vt(),
                    kind: e.value
                }
            }
            function Tt() {
                var e, t, n, r, i, s, o;
                return e = t = n = null, O("for"), A("("), M(";") ? x() : (_("var") || _("let") ? (wn.allowIn = !1, e = xt(), wn.allowIn = !0, e.declarations.length === 1 && _("in") && (x(), r = e, i = lt(), e = null)) : (wn.allowIn = !1, e = lt(), wn.allowIn = !0, _("in") && (H(e) || C({}, cn.InvalidLHSInForIn), x(), r = e, i = lt(), e = null)), typeof r == "undefined" && A(";")), typeof r == "undefined" && (M(";") || (t = lt()), A(";"), M(")") || (n = lt())), A(")"), o = wn.inIteration, wn.inIteration = !0, s = Ht(), wn.inIteration = o, typeof r == "undefined" ? {
                    type: fn.ForStatement,
                    init: e,
                    test: t,
                    update: n,
                    body: s
                } : {
                    type: fn.ForInStatement,
                    left: r,
                    right: i,
                    body: s,
                    each: !1
                }
            }
            function Nt() {
                var e, t = null;
                return O("continue"), pn[vn] === ";" ? (x(), wn.inIteration || C({}, cn.IllegalContinue), {
                    type: fn.ContinueStatement,
                    label: null
                }) : N() ? (wn.inIteration || C({}, cn.IllegalContinue), {
                    type: fn.ContinueStatement,
                    label: null
                }) : (e = T(), e.type === un.Identifier && (t = pt(), Object.prototype.hasOwnProperty.call(wn.labelSet, t.name) || C({}, cn.UnknownLabel, t.name)), P(), t === null && !wn.inIteration && C({}, cn.IllegalContinue), {
                    type: fn.ContinueStatement,
                    label: t
                })
            }
            function Ct() {
                var e, t = null;
                return O("break"), pn[vn] === ";" ? (x(), !wn.inIteration && !wn.inSwitch && C({}, cn.IllegalBreak), {
                    type: fn.BreakStatement,
                    label: null
                }) : N() ? (!wn.inIteration && !wn.inSwitch && C({}, cn.IllegalBreak), {
                    type: fn.BreakStatement,
                    label: null
                }) : (e = T(), e.type === un.Identifier && (t = pt(), Object.prototype.hasOwnProperty.call(wn.labelSet, t.name) || C({}, cn.UnknownLabel, t.name)), P(), t === null && !wn.inIteration && !wn.inSwitch && C({}, cn.IllegalBreak), {
                    type: fn.BreakStatement,
                    label: t
                })
            }
            function kt() {
                var e, t = null;
                return O("return"), wn.inFunctionBody || k({}, cn.IllegalReturn), pn[vn] === " " && a(pn[vn + 1]) ? (t = lt(), P(), {
                    type: fn.ReturnStatement,
                    argument: t
                }) : N() ? {
                    type: fn.ReturnStatement,
                    argument: null
                } : (M(";") || (e = T(), !M("}") && e.type !== un.EOF && (t = lt())), P(), {
                    type: fn.ReturnStatement,
                    argument: t
                })
            }
            function Lt() {
                var e, t;
                return dn && k({}, cn.StrictModeWith), O("with"), A("("), e = lt(), A(")"), t = Ht(), {
                    type: fn.WithStatement,
                    object: e,
                    body: t
                }
            }
            function At() {
                var e, t = [],
                    n;
                _("default") ? (x(), e = null) : (O("case"), e = lt()), A(":");
                while (vn < yn) {
                    if (M("}") || _("default") || _("case")) break;
                    n = Ht();
                    if (typeof n == "undefined") break;
                    t.push(n)
                }
                return {
                    type: fn.SwitchCase,
                    test: e,
                    consequent: t
                }
            }
            function Ot() {
                var e, t, n, r, i;
                O("switch"), A("("), e = lt(), A(")"), A("{");
                if (M("}")) return x(), {
                    type: fn.SwitchStatement,
                    discriminant: e
                };
                t = [], r = wn.inSwitch, wn.inSwitch = !0, i = !1;
                while (vn < yn) {
                    if (M("}")) break;
                    n = At(), n.test === null && (i && C({}, cn.MultipleDefaultsInSwitch), i = !0), t.push(n)
                }
                return wn.inSwitch = r, A("}"), {
                    type: fn.SwitchStatement,
                    discriminant: e,
                    cases: t
                }
            }
            function Mt() {
                var e;
                return O("throw"), N() && C({}, cn.NewlineAfterThrow), e = lt(), P(), {
                    type: fn.ThrowStatement,
                    argument: e
                }
            }
            function _t() {
                var e;
                return O("catch"), A("("), M(")") || (e = lt(), dn && e.type === fn.Identifier && h(e.name) && k({}, cn.StrictCatchVariable)), A(")"), {
                    type: fn.CatchClause,
                    param: e,
                    body: ht()
                }
            }
            function Dt() {
                var e, t = [],
                    n = null;
                return O("try"), e = ht(), _("catch") && t.push(_t()), _("finally") && (x(), n = ht()), t.length === 0 && !n && C({}, cn.NoCatchOrFinally), {
                    type: fn.TryStatement,
                    block: e,
                    guardedHandlers: [],
                    handlers: t,
                    finalizer: n
                }
            }
            function Pt() {
                return O("debugger"), P(), {
                    type: fn.DebuggerStatement
                }
            }
            function Ht() {
                var e = T(),
                    t, n;
                e.type === un.EOF && L(e);
                if (e.type === un.Punctuator) switch (e.value) {
                    case ";":
                        return yt();
                    case "{":
                        return ht();
                    case "(":
                        return bt();
                    default:
                }
                if (e.type === un.Keyword) switch (e.value) {
                    case "break":
                        return Ct();
                    case "continue":
                        return Nt();
                    case "debugger":
                        return Pt();
                    case "do":
                        return Et();
                    case "for":
                        return Tt();
                    case "function":
                        return jt();
                    case "if":
                        return wt();
                    case "return":
                        return kt();
                    case "switch":
                        return Ot();
                    case "throw":
                        return Mt();
                    case "try":
                        return Dt();
                    case "var":
                        return mt();
                    case "while":
                        return St();
                    case "with":
                        return Lt();
                    default:
                }
                return t = lt(), t.type === fn.Identifier && M(":") ? (x(), Object.prototype.hasOwnProperty.call(wn.labelSet, t.name) && C({}, cn.Redeclaration, "Label", t.name), wn.labelSet[t.name] = !0, n = Ht(), delete wn.labelSet[t.name], {
                    type: fn.LabeledStatement,
                    label: t,
                    body: n
                }) : (P(), {
                    type: fn.ExpressionStatement,
                    expression: t
                })
            }
            function Bt() {
                var e, t = [],
                    r, i, s, o, u, a, f;
                A("{");
                while (vn < yn) {
                    r = T();
                    if (r.type !== un.StringLiteral) break;
                    e = It(), t.push(e);
                    if (e.expression.type !== fn.Literal) break;
                    i = n(r.range[0] + 1, r.range[1] - 1), i === "use strict" ? (dn = !0, s && k(s, cn.StrictOctalLiteral)) : !s && r.octal && (s = r)
                }
                o = wn.labelSet, u = wn.inIteration, a = wn.inSwitch, f = wn.inFunctionBody, wn.labelSet = {}, wn.inIteration = !1, wn.inSwitch = !1, wn.inFunctionBody = !0;
                while (vn < yn) {
                    if (M("}")) break;
                    e = It();
                    if (typeof e == "undefined") break;
                    t.push(e)
                }
                return A("}"), wn.labelSet = o, wn.inIteration = u, wn.inSwitch = a, wn.inFunctionBody = f, {
                    type: fn.BlockStatement,
                    body: t
                }
            }
            function jt() {
                var e, t, n = [],
                    r, i, s, o, u, a, f;
                O("function"), i = T(), e = pt(), dn ? h(i.value) && k(i, cn.StrictFunctionName) : h(i.value) ? (o = i, u = cn.StrictFunctionName) : c(i.value) && (o = i, u = cn.StrictReservedWord), A("(");
                if (!M(")")) {
                    f = {};
                    while (vn < yn) {
                        i = T(), t = pt(), dn ? (h(i.value) && (s = i, u = cn.StrictParamName), Object.prototype.hasOwnProperty.call(f, i.value) && (s = i, u = cn.StrictParamDupe)) : o || (h(i.value) ? (o = i, u = cn.StrictParamName) : c(i.value) ? (o = i, u = cn.StrictReservedWord) : Object.prototype.hasOwnProperty.call(f, i.value) && (o = i, u = cn.StrictParamDupe)), n.push(t), f[t.name] = !0;
                        if (M(")")) break;
                        A(",")
                    }
                }
                return A(")"), a = dn, r = Bt(), dn && o && C(o, u), dn && s && k(s, u), dn = a, {
                    type: fn.FunctionDeclaration,
                    id: e,
                    params: n,
                    defaults: [],
                    body: r,
                    rest: null,
                    generator: !1,
                    expression: !1
                }
            }
            function Ft() {
                var e, t = null,
                    n, r, i, s, o = [],
                    u, a, f;
                O("function"), M("(") || (e = T(), t = pt(), dn ? h(e.value) && k(e, cn.StrictFunctionName) : h(e.value) ? (r = e, i = cn.StrictFunctionName) : c(e.value) && (r = e, i = cn.StrictReservedWord)), A("(");
                if (!M(")")) {
                    f = {};
                    while (vn < yn) {
                        e = T(), s = pt(), dn ? (h(e.value) && (n = e, i = cn.StrictParamName), Object.prototype.hasOwnProperty.call(f, e.value) && (n = e, i = cn.StrictParamDupe)) : r || (h(e.value) ? (r = e, i = cn.StrictParamName) : c(e.value) ? (r = e, i = cn.StrictReservedWord) : Object.prototype.hasOwnProperty.call(f, e.value) && (r = e, i = cn.StrictParamDupe)), o.push(s), f[s.name] = !0;
                        if (M(")")) break;
                        A(",")
                    }
                }
                return A(")"), a = dn, u = Bt(), dn && r && C(r, i), dn && n && k(n, i), dn = a, {
                    type: fn.FunctionExpression,
                    id: t,
                    params: o,
                    defaults: [],
                    body: u,
                    rest: null,
                    generator: !1,
                    expression: !1
                }
            }
            function It() {
                var e = T();
                if (e.type === un.Keyword) switch (e.value) {
                    case "const":
                    case "let":
                        return gt(e.value);
                    case "function":
                        return jt();
                    default:
                        return Ht()
                }
                if (e.type !== un.EOF) return Ht()
            }
            function qt() {
                var e, t = [],
                    r, i, s;
                while (vn < yn) {
                    r = T();
                    if (r.type !== un.StringLiteral) break;
                    e = It(), t.push(e);
                    if (e.expression.type !== fn.Literal) break;
                    i = n(r.range[0] + 1, r.range[1] - 1), i === "use strict" ? (dn = !0, s && k(s, cn.StrictOctalLiteral)) : !s && r.octal && (s = r)
                }
                while (vn < yn) {
                    e = It();
                    if (typeof e == "undefined") break;
                    t.push(e)
                }
                return t
            }
            function Rt() {
                var e;
                return dn = !1, e = {
                    type: fn.Program,
                    body: qt()
                }, e
            }
            function Ut(e, n, r, i, s) {
                t(typeof r == "number", "Comment must have valid position");
                if (En.comments.length > 0 && En.comments[En.comments.length - 1].range[1] > r) return;
                En.comments.push({
                    type: e,
                    value: n,
                    range: [r, i],
                    loc: s
                })
            }
            function zt() {
                var e, t, n, r, i, s;
                e = "", i = !1, s = !1;
                while (vn < yn) {
                    t = pn[vn];
                    if (s) t = pn[vn++], u(t) ? (n.end = {
                        line: mn,
                        column: vn - gn - 1
                    }, s = !1, Ut("Line", e, r, vn - 1, n), t === "\r" && pn[vn] === "\n" && ++vn, ++mn, gn = vn, e = "") : vn >= yn ? (s = !1, e += t, n.end = {
                        line: mn,
                        column: yn - gn
                    }, Ut("Line", e, r, yn, n)) : e += t;
                    else if (i) u(t) ? (t === "\r" && pn[vn + 1] === "\n" ? (++vn, e += "\r\n") : e += t, ++mn, ++vn, gn = vn, vn >= yn && C({}, cn.UnexpectedToken, "ILLEGAL")) : (t = pn[vn++], vn >= yn && C({}, cn.UnexpectedToken, "ILLEGAL"), e += t, t === "*" && (t = pn[vn], t === "/" && (e = e.substr(0, e.length - 1), i = !1, ++vn, n.end = {
                        line: mn,
                        column: vn - gn
                    }, Ut("Block", e, r, vn, n), e = "")));
                    else if (t === "/") {
                        t = pn[vn + 1];
                        if (t === "/") n = {
                            start: {
                                line: mn,
                                column: vn - gn
                            }
                        }, r = vn, vn += 2, s = !0, vn >= yn && (n.end = {
                            line: mn,
                            column: vn - gn
                        }, s = !1, Ut("Line", e, r, vn, n));
                        else {
                            if (t !== "*") break;
                            r = vn, vn += 2, i = !0, n = {
                                start: {
                                    line: mn,
                                    column: vn - gn - 2
                                }
                            }, vn >= yn && C({}, cn.UnexpectedToken, "ILLEGAL")
                        }
                    } else if (o(t))++vn;
                    else {
                        if (!u(t)) break;
                        ++vn, t === "\r" && pn[vn] === "\n" && ++vn, ++mn, gn = vn
                    }
                }
            }
            function Wt() {
                var e, t, n, r = [];
                for (e = 0; e < En.comments.length; ++e) t = En.comments[e], n = {
                    type: t.type,
                    value: t.value
                }, En.range && (n.range = t.range), En.loc && (n.loc = t.loc), r.push(n);
                En.comments = r
            }
            function Xt() {
                var e, t, r, i, s;
                return d(), e = vn, t = {
                    start: {
                        line: mn,
                        column: vn - gn
                    }
                }, r = En.advance(), t.end = {
                    line: mn,
                    column: vn - gn
                }, r.type !== un.EOF && (i = [r.range[0], r.range[1]], s = n(r.range[0], r.range[1]), En.tokens.push({
                    type: an[r.type],
                    value: s,
                    range: i,
                    loc: t
                })), r
            }
            function Vt() {
                var e, t, n, r;
                return d(), e = vn, t = {
                    start: {
                        line: mn,
                        column: vn - gn
                    }
                }, n = En.scanRegExp(), t.end = {
                    line: mn,
                    column: vn - gn
                }, En.tokens.length > 0 && (r = En.tokens[En.tokens.length - 1], r.range[0] === e && r.type === "Punctuator" && (r.value === "/" || r.value === "/=") && En.tokens.pop()), En.tokens.push({
                    type: "RegularExpression",
                    value: n.literal,
                    range: [e, vn],
                    loc: t
                }), n
            }
            function $t() {
                var e, t, n, r = [];
                for (e = 0; e < En.tokens.length; ++e) t = En.tokens[e], n = {
                    type: t.type,
                    value: t.value
                }, En.range && (n.range = t.range), En.loc && (n.loc = t.loc), r.push(n);
                En.tokens = r
            }
            function Jt(e) {
                return {
                    type: fn.Literal,
                    value: e.value
                }
            }
            function Kt(e) {
                return {
                    type: fn.Literal,
                    value: e.value,
                    raw: n(e.range[0], e.range[1])
                }
            }
            function Qt() {
                var e = {};
                return e.range = [vn, vn], e.loc = {
                    start: {
                        line: mn,
                        column: vn - gn
                    },
                    end: {
                        line: mn,
                        column: vn - gn
                    }
                }, e.end = function() {
                    this.range[1] = vn, this.loc.end.line = mn, this.loc.end.column = vn - gn
                }, e.applyGroup = function(e) {
                    En.range && (e.groupRange = [this.range[0], this.range[1]]), En.loc && (e.groupLoc = {
                        start: {
                            line: this.loc.start.line,
                            column: this.loc.start.column
                        },
                        end: {
                            line: this.loc.end.line,
                            column: this.loc.end.column
                        }
                    })
                }, e.apply = function(e) {
                    En.range && (e.range = [this.range[0], this.range[1]]), En.loc && (e.loc = {
                        start: {
                            line: this.loc.start.line,
                            column: this.loc.start.column
                        },
                        end: {
                            line: this.loc.end.line,
                            column: this.loc.end.column
                        }
                    })
                }, e
            }
            function Gt() {
                var e, t;
                return d(), e = Qt(), A("("), t = lt(), A(")"), e.end(), e.applyGroup(t), t
            }
            function Yt() {
                var e, t;
                d(), e = Qt(), t = _("new") ? $() : U();
                while (M(".") || M("[")) M("[") ? (t = {
                    type: fn.MemberExpression,
                    computed: !0,
                    object: t,
                    property: V()
                }, e.end(), e.apply(t)) : (t = {
                    type: fn.MemberExpression,
                    computed: !1,
                    object: t,
                    property: X()
                }, e.end(), e.apply(t));
                return t
            }
            function Zt() {
                var e, t;
                d(), e = Qt(), t = _("new") ? $() : U();
                while (M(".") || M("[") || M("(")) M("(") ? (t = {
                    type: fn.CallExpression,
                    callee: t,
                    arguments: z()
                }, e.end(), e.apply(t)) : M("[") ? (t = {
                    type: fn.MemberExpression,
                    computed: !0,
                    object: t,
                    property: V()
                }, e.end(), e.apply(t)) : (t = {
                    type: fn.MemberExpression,
                    computed: !1,
                    object: t,
                    property: X()
                }, e.end(), e.apply(t));
                return t
            }
            function en(e) {
                var t, n, r;
                t = Object.prototype.toString.apply(e) === "[object Array]" ? [] : {};
                for (n in e) e.hasOwnProperty(n) && n !== "groupRange" && n !== "groupLoc" && (r = e[n], r === null || typeof r != "object" || r instanceof RegExp ? t[n] = r : t[n] = en(r));
                return t
            }
            function tn(e, t) {
                return function(n) {
                    function r(e) {
                        return e.type === fn.LogicalExpression || e.type === fn.BinaryExpression
                    }
                    function i(n) {
                        var s, o;
                        r(n.left) && i(n.left), r(n.right) && i(n.right), e && (n.left.groupRange || n.right.groupRange ? (s = n.left.groupRange ? n.left.groupRange[0] : n.left.range[0], o = n.right.groupRange ? n.right.groupRange[1] : n.right.range[1], n.range = [s, o]) : typeof n.range == "undefined" && (s = n.left.range[0], o = n.right.range[1], n.range = [s, o])), t && (n.left.groupLoc || n.right.groupLoc ? (s = n.left.groupLoc ? n.left.groupLoc.start : n.left.loc.start, o = n.right.groupLoc ? n.right.groupLoc.end : n.right.loc.end, n.loc = {
                            start: s,
                            end: o
                        }) : typeof n.loc == "undefined" && (n.loc = {
                            start: n.left.loc.start,
                            end: n.right.loc.end
                        }))
                    }
                    return function() {
                        var s, o;
                        return d(), s = Qt(), o = n.apply(null, arguments), s.end(), e && typeof o.range == "undefined" && s.apply(o), t && typeof o.loc == "undefined" && s.apply(o), r(o) && i(o), o
                    }
                }
            }
            function nn() {
                var e;
                En.comments && (En.skipComment = d, d = zt), En.raw && (En.createLiteral = Jt, Jt = Kt);
                if (En.range || En.loc) En.parseGroupExpression = R, En.parseLeftHandSideExpression = K, En.parseLeftHandSideExpressionAllowCall = J, R = Gt, K = Yt, J = Zt, e = tn(En.range, En.loc), En.parseAdditiveExpression = Z, En.parseAssignmentExpression = ft, En.parseBitwiseANDExpression = rt, En.parseBitwiseORExpression = st, En.parseBitwiseXORExpression = it, En.parseBlock = ht, En.parseFunctionSourceElements = Bt, En.parseCatchClause = _t, En.parseComputedMember = V, En.parseConditionalExpression = at, En.parseConstLetDeclaration = gt, En.parseEqualityExpression = nt, En.parseExpression = lt, En.parseForVariableDeclaration = xt, En.parseFunctionDeclaration = jt, En.parseFunctionExpression = Ft, En.parseLogicalANDExpression = ot, En.parseLogicalORExpression = ut, En.parseMultiplicativeExpression = Y, En.parseNewExpression = $, En.parseNonComputedProperty = W, En.parseObjectProperty = I, En.parseObjectPropertyKey = F, En.parsePostfixExpression = Q, En.parsePrimaryExpression = U, En.parseProgram = Rt, En.parsePropertyFunction = j, En.parseRelationalExpression = tt, En.parseStatement = Ht, En.parseShiftExpression = et, En.parseSwitchCase = At, En.parseUnaryExpression = G, En.parseVariableDeclaration = dt, En.parseVariableIdentifier = pt, Z = e(En.parseAdditiveExpression), ft = e(En.parseAssignmentExpression), rt = e(En.parseBitwiseANDExpression), st = e(En.parseBitwiseORExpression), it = e(En.parseBitwiseXORExpression), ht = e(En.parseBlock), Bt = e(En.parseFunctionSourceElements), _t = e(En.parseCatchClause), V = e(En.parseComputedMember), at = e(En.parseConditionalExpression), gt = e(En.parseConstLetDeclaration), nt = e(En.parseEqualityExpression), lt = e(En.parseExpression), xt = e(En.parseForVariableDeclaration), jt = e(En.parseFunctionDeclaration), Ft = e(En.parseFunctionExpression), K = e(K), ot = e(En.parseLogicalANDExpression), ut = e(En.parseLogicalORExpression), Y = e(En.parseMultiplicativeExpression), $ = e(En.parseNewExpression), W = e(En.parseNonComputedProperty), I = e(En.parseObjectProperty), F = e(En.parseObjectPropertyKey), Q = e(En.parsePostfixExpression), U = e(En.parsePrimaryExpression), Rt = e(En.parseProgram), j = e(En.parsePropertyFunction), tt = e(En.parseRelationalExpression), Ht = e(En.parseStatement), et = e(En.parseShiftExpression), At = e(En.parseSwitchCase), G = e(En.parseUnaryExpression), dt = e(En.parseVariableDeclaration), pt = e(En.parseVariableIdentifier);
                typeof En.tokens != "undefined" && (En.advance = S, En.scanRegExp = w, S = Xt, w = Vt)
            }
            function rn() {
                typeof En.skipComment == "function" && (d = En.skipComment), En.raw && (Jt = En.createLiteral);
                if (En.range || En.loc) Z = En.parseAdditiveExpression, ft = En.parseAssignmentExpression, rt = En.parseBitwiseANDExpression, st = En.parseBitwiseORExpression, it = En.parseBitwiseXORExpression, ht = En.parseBlock, Bt = En.parseFunctionSourceElements, _t = En.parseCatchClause, V = En.parseComputedMember, at = En.parseConditionalExpression, gt = En.parseConstLetDeclaration, nt = En.parseEqualityExpression, lt = En.parseExpression, xt = En.parseForVariableDeclaration, jt = En.parseFunctionDeclaration, Ft = En.parseFunctionExpression, R = En.parseGroupExpression, K = En.parseLeftHandSideExpression, J = En.parseLeftHandSideExpressionAllowCall, ot = En.parseLogicalANDExpression, ut = En.parseLogicalORExpression, Y = En.parseMultiplicativeExpression, $ = En.parseNewExpression, W = En.parseNonComputedProperty, I = En.parseObjectProperty, F = En.parseObjectPropertyKey, U = En.parsePrimaryExpression, Q = En.parsePostfixExpression, Rt = En.parseProgram, j = En.parsePropertyFunction, tt = En.parseRelationalExpression, Ht = En.parseStatement, et = En.parseShiftExpression, At = En.parseSwitchCase, G = En.parseUnaryExpression, dt = En.parseVariableDeclaration, pt = En.parseVariableIdentifier;
                typeof En.scanRegExp == "function" && (S = En.advance, w = En.scanRegExp)
            }
            function sn(e) {
                var t = e.length,
                    n = [],
                    r;
                for (r = 0; r < t; ++r) n[r] = e.charAt(r);
                return n
            }
            function on(e, t) {
                var n, r;
                r = String, typeof e != "string" && !(e instanceof String) && (e = r(e)), pn = e, vn = 0, mn = pn.length > 0 ? 1 : 0, gn = 0, yn = pn.length, bn = null, wn = {
                    allowIn: !0,
                    labelSet: {},
                    inFunctionBody: !1,
                    inIteration: !1,
                    inSwitch: !1
                }, En = {}, typeof t != "undefined" && (En.range = typeof t.range == "boolean" && t.range, En.loc = typeof t.loc == "boolean" && t.loc, En.raw = typeof t.raw == "boolean" && t.raw, typeof t.tokens == "boolean" && t.tokens && (En.tokens = []), typeof t.comment == "boolean" && t.comment && (En.comments = []), typeof t.tolerant == "boolean" && t.tolerant && (En.errors = [])), yn > 0 && typeof pn[0] == "undefined" && (e instanceof String && (pn = e.valueOf()), typeof pn[0] == "undefined" && (pn = sn(e))), nn();
                try {
                    n = Rt(), typeof En.comments != "undefined" && (Wt(), n.comments = En.comments), typeof En.tokens != "undefined" && ($t(), n.tokens = En.tokens), typeof En.errors != "undefined" && (n.errors = En.errors);
                    if (En.range || En.loc) n.body = en(n.body)
                } catch (i) {
                    throw i
                } finally {
                    rn(), En = {}
                }
                return n
            }
            var un, an, fn, ln, cn, hn, pn, dn, vn, mn, gn, yn, bn, wn, En;
            un = {
                BooleanLiteral: 1,
                EOF: 2,
                Identifier: 3,
                Keyword: 4,
                NullLiteral: 5,
                NumericLiteral: 6,
                Punctuator: 7,
                StringLiteral: 8
            }, an = {}, an[un.BooleanLiteral] = "Boolean", an[un.EOF] = "<end>", an[un.Identifier] = "Identifier", an[un.Keyword] = "Keyword", an[un.NullLiteral] = "Null", an[un.NumericLiteral] = "Numeric", an[un.Punctuator] = "Punctuator", an[un.StringLiteral] = "String", fn = {
                AssignmentExpression: "AssignmentExpression",
                ArrayExpression: "ArrayExpression",
                BlockStatement: "BlockStatement",
                BinaryExpression: "BinaryExpression",
                BreakStatement: "BreakStatement",
                CallExpression: "CallExpression",
                CatchClause: "CatchClause",
                ConditionalExpression: "ConditionalExpression",
                ContinueStatement: "ContinueStatement",
                DoWhileStatement: "DoWhileStatement",
                DebuggerStatement: "DebuggerStatement",
                EmptyStatement: "EmptyStatement",
                ExpressionStatement: "ExpressionStatement",
                ForStatement: "ForStatement",
                ForInStatement: "ForInStatement",
                FunctionDeclaration: "FunctionDeclaration",
                FunctionExpression: "FunctionExpression",
                Identifier: "Identifier",
                IfStatement: "IfStatement",
                Literal: "Literal",
                LabeledStatement: "LabeledStatement",
                LogicalExpression: "LogicalExpression",
                MemberExpression: "MemberExpression",
                NewExpression: "NewExpression",
                ObjectExpression: "ObjectExpression",
                Program: "Program",
                Property: "Property",
                ReturnStatement: "ReturnStatement",
                SequenceExpression: "SequenceExpression",
                SwitchStatement: "SwitchStatement",
                SwitchCase: "SwitchCase",
                ThisExpression: "ThisExpression",
                ThrowStatement: "ThrowStatement",
                TryStatement: "TryStatement",
                UnaryExpression: "UnaryExpression",
                UpdateExpression: "UpdateExpression",
                VariableDeclaration: "VariableDeclaration",
                VariableDeclarator: "VariableDeclarator",
                WhileStatement: "WhileStatement",
                WithStatement: "WithStatement"
            }, ln = {
                Data: 1,
                Get: 2,
                Set: 4
            }, cn = {
                UnexpectedToken: "Unexpected token %0",
                UnexpectedNumber: "Unexpected number",
                UnexpectedString: "Unexpected string",
                UnexpectedIdentifier: "Unexpected identifier",
                UnexpectedReserved: "Unexpected reserved word",
                UnexpectedEOS: "Unexpected end of input",
                NewlineAfterThrow: "Illegal newline after throw",
                InvalidRegExp: "Invalid regular expression",
                UnterminatedRegExp: "Invalid regular expression: missing /",
                InvalidLHSInAssignment: "Invalid left-hand side in assignment",
                InvalidLHSInForIn: "Invalid left-hand side in for-in",
                MultipleDefaultsInSwitch: "More than one default clause in switch statement",
                NoCatchOrFinally: "Missing catch or finally after try",
                UnknownLabel: "Undefined label '%0'",
                Redeclaration: "%0 '%1' has already been declared",
                IllegalContinue: "Illegal continue statement",
                IllegalBreak: "Illegal break statement",
                IllegalReturn: "Illegal return statement",
                StrictModeWith: "Strict mode code may not include a with statement",
                StrictCatchVariable: "Catch variable may not be eval or arguments in strict mode",
                StrictVarName: "Variable name may not be eval or arguments in strict mode",
                StrictParamName: "Parameter name eval or arguments is not allowed in strict mode",
                StrictParamDupe: "Strict mode function may not have duplicate parameter names",
                StrictFunctionName: "Function name may not be eval or arguments in strict mode",
                StrictOctalLiteral: "Octal literals are not allowed in strict mode.",
                StrictDelete: "Delete of an unqualified identifier in strict mode.",
                StrictDuplicateProperty: "Duplicate data property in object literal not allowed in strict mode",
                AccessorDataProperty: "Object literal may not have data and accessor property with the same name",
                AccessorGetSet: "Object literal may not have multiple get/set accessors with the same name",
                StrictLHSAssignment: "Assignment to eval or arguments is not allowed in strict mode",
                StrictLHSPostfix: "Postfix increment/decrement may not have eval or arguments operand in strict mode",
                StrictLHSPrefix: "Prefix increment/decrement may not have eval or arguments operand in strict mode",
                StrictReservedWord: "Use of future reserved word in strict mode"
            }, hn = {
                NonAsciiIdentifierStart: new RegExp("[ªµºÀ-ÖØ-öø-ˁˆ-ˑˠ-ˤˬˮͰ-ʹͶͷͺ-ͽΆΈ-ΊΌΎ-ΡΣ-ϵϷ-ҁҊ-ԧԱ-Ֆՙա-ևא-תװ-ײؠ-يٮٯٱ-ۓەۥۦۮۯۺ-ۼۿܐܒ-ܯݍ-ޥޱߊ-ߪߴߵߺࠀ-ࠕࠚࠤࠨࡀ-ࡘࢠࢢ-ࢬऄ-हऽॐक़-ॡॱ-ॷॹ-ॿঅ-ঌএঐও-নপ-রলশ-হঽৎড়ঢ়য়-ৡৰৱਅ-ਊਏਐਓ-ਨਪ-ਰਲਲ਼ਵਸ਼ਸਹਖ਼-ੜਫ਼ੲ-ੴઅ-ઍએ-ઑઓ-નપ-રલળવ-હઽૐૠૡଅ-ଌଏଐଓ-ନପ-ରଲଳଵ-ହଽଡ଼ଢ଼ୟ-ୡୱஃஅ-ஊஎ-ஐஒ-கஙசஜஞடணதந-பம-ஹௐఅ-ఌఎ-ఐఒ-నప-ళవ-హఽౘౙౠౡಅ-ಌಎ-ಐಒ-ನಪ-ಳವ-ಹಽೞೠೡೱೲഅ-ഌഎ-ഐഒ-ഺഽൎൠൡൺ-ൿඅ-ඖක-නඳ-රලව-ෆก-ะาำเ-ๆກຂຄງຈຊຍດ-ທນ-ຟມ-ຣລວສຫອ-ະາຳຽເ-ໄໆໜ-ໟༀཀ-ཇཉ-ཬྈ-ྌက-ဪဿၐ-ၕၚ-ၝၡၥၦၮ-ၰၵ-ႁႎႠ-ჅჇჍა-ჺჼ-ቈቊ-ቍቐ-ቖቘቚ-ቝበ-ኈኊ-ኍነ-ኰኲ-ኵኸ-ኾዀዂ-ዅወ-ዖዘ-ጐጒ-ጕጘ-ፚᎀ-ᎏᎠ-Ᏼᐁ-ᙬᙯ-ᙿᚁ-ᚚᚠ-ᛪᛮ-ᛰᜀ-ᜌᜎ-ᜑᜠ-ᜱᝀ-ᝑᝠ-ᝬᝮ-ᝰក-ឳៗៜᠠ-ᡷᢀ-ᢨᢪᢰ-ᣵᤀ-ᤜᥐ-ᥭᥰ-ᥴᦀ-ᦫᧁ-ᧇᨀ-ᨖᨠ-ᩔᪧᬅ-ᬳᭅ-ᭋᮃ-ᮠᮮᮯᮺ-ᯥᰀ-ᰣᱍ-ᱏᱚ-ᱽᳩ-ᳬᳮ-ᳱᳵᳶᴀ-ᶿḀ-ἕἘ-Ἕἠ-ὅὈ-Ὅὐ-ὗὙὛὝὟ-ώᾀ-ᾴᾶ-ᾼιῂ-ῄῆ-ῌῐ-ΐῖ-Ίῠ-Ῥῲ-ῴῶ-ῼⁱⁿₐ-ₜℂℇℊ-ℓℕℙ-ℝℤΩℨK-ℭℯ-ℹℼ-ℿⅅ-ⅉⅎⅠ-ↈⰀ-Ⱞⰰ-ⱞⱠ-ⳤⳫ-ⳮⳲⳳⴀ-ⴥⴧⴭⴰ-ⵧⵯⶀ-ⶖⶠ-ⶦⶨ-ⶮⶰ-ⶶⶸ-ⶾⷀ-ⷆⷈ-ⷎⷐ-ⷖⷘ-ⷞⸯ々-〇〡-〩〱-〵〸-〼ぁ-ゖゝ-ゟァ-ヺー-ヿㄅ-ㄭㄱ-ㆎㆠ-ㆺㇰ-ㇿ㐀-䶵一-鿌ꀀ-ꒌꓐ-ꓽꔀ-ꘌꘐ-ꘟꘪꘫꙀ-ꙮꙿ-ꚗꚠ-ꛯꜗ-ꜟꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꠁꠃ-ꠅꠇ-ꠊꠌ-ꠢꡀ-ꡳꢂ-ꢳꣲ-ꣷꣻꤊ-ꤥꤰ-ꥆꥠ-ꥼꦄ-ꦲꧏꨀ-ꨨꩀ-ꩂꩄ-ꩋꩠ-ꩶꩺꪀ-ꪯꪱꪵꪶꪹ-ꪽꫀꫂꫛ-ꫝꫠ-ꫪꫲ-ꫴꬁ-ꬆꬉ-ꬎꬑ-ꬖꬠ-ꬦꬨ-ꬮꯀ-ꯢ가-힣ힰ-ퟆퟋ-ퟻ豈-舘並-龎ﬀ-ﬆﬓ-ﬗיִײַ-ﬨשׁ-זּטּ-לּמּנּסּףּפּצּ-ﮱﯓ-ﴽﵐ-ﶏﶒ-ﷇﷰ-ﷻﹰ-ﹴﹶ-ﻼＡ-Ｚａ-ｚｦ-ﾾￂ-ￇￊ-ￏￒ-ￗￚ-ￜ]"),
                NonAsciiIdentifierPart: new RegExp("[ªµºÀ-ÖØ-öø-ˁˆ-ˑˠ-ˤˬˮ̀-ʹͶͷͺ-ͽΆΈ-ΊΌΎ-ΡΣ-ϵϷ-ҁ҃-҇Ҋ-ԧԱ-Ֆՙա-և֑-ׇֽֿׁׂׅׄא-תװ-ײؐ-ؚؠ-٩ٮ-ۓە-ۜ۟-۪ۨ-ۼۿܐ-݊ݍ-ޱ߀-ߵߺࠀ-࠭ࡀ-࡛ࢠࢢ-ࢬࣤ-ࣾऀ-ॣ०-९ॱ-ॷॹ-ॿঁ-ঃঅ-ঌএঐও-নপ-রলশ-হ়-ৄেৈো-ৎৗড়ঢ়য়-ৣ০-ৱਁ-ਃਅ-ਊਏਐਓ-ਨਪ-ਰਲਲ਼ਵਸ਼ਸਹ਼ਾ-ੂੇੈੋ-੍ੑਖ਼-ੜਫ਼੦-ੵઁ-ઃઅ-ઍએ-ઑઓ-નપ-રલળવ-હ઼-ૅે-ૉો-્ૐૠ-ૣ૦-૯ଁ-ଃଅ-ଌଏଐଓ-ନପ-ରଲଳଵ-ହ଼-ୄେୈୋ-୍ୖୗଡ଼ଢ଼ୟ-ୣ୦-୯ୱஂஃஅ-ஊஎ-ஐஒ-கஙசஜஞடணதந-பம-ஹா-ூெ-ைொ-்ௐௗ௦-௯ఁ-ఃఅ-ఌఎ-ఐఒ-నప-ళవ-హఽ-ౄె-ైొ-్ౕౖౘౙౠ-ౣ౦-౯ಂಃಅ-ಌಎ-ಐಒ-ನಪ-ಳವ-ಹ಼-ೄೆ-ೈೊ-್ೕೖೞೠ-ೣ೦-೯ೱೲംഃഅ-ഌഎ-ഐഒ-ഺഽ-ൄെ-ൈൊ-ൎൗൠ-ൣ൦-൯ൺ-ൿංඃඅ-ඖක-නඳ-රලව-ෆ්ා-ුූෘ-ෟෲෳก-ฺเ-๎๐-๙ກຂຄງຈຊຍດ-ທນ-ຟມ-ຣລວສຫອ-ູົ-ຽເ-ໄໆ່-ໍ໐-໙ໜ-ໟༀ༘༙༠-༩༹༵༷༾-ཇཉ-ཬཱ-྄྆-ྗྙ-ྼ࿆က-၉ၐ-ႝႠ-ჅჇჍა-ჺჼ-ቈቊ-ቍቐ-ቖቘቚ-ቝበ-ኈኊ-ኍነ-ኰኲ-ኵኸ-ኾዀዂ-ዅወ-ዖዘ-ጐጒ-ጕጘ-ፚ፝-፟ᎀ-ᎏᎠ-Ᏼᐁ-ᙬᙯ-ᙿᚁ-ᚚᚠ-ᛪᛮ-ᛰᜀ-ᜌᜎ-᜔ᜠ-᜴ᝀ-ᝓᝠ-ᝬᝮ-ᝰᝲᝳក-៓ៗៜ៝០-៩᠋-᠍᠐-᠙ᠠ-ᡷᢀ-ᢪᢰ-ᣵᤀ-ᤜᤠ-ᤫᤰ-᤻᥆-ᥭᥰ-ᥴᦀ-ᦫᦰ-ᧉ᧐-᧙ᨀ-ᨛᨠ-ᩞ᩠-᩿᩼-᪉᪐-᪙ᪧᬀ-ᭋ᭐-᭙᭫-᭳ᮀ-᯳ᰀ-᰷᱀-᱉ᱍ-ᱽ᳐-᳔᳒-ᳶᴀ-ᷦ᷼-ἕἘ-Ἕἠ-ὅὈ-Ὅὐ-ὗὙὛὝὟ-ώᾀ-ᾴᾶ-ᾼιῂ-ῄῆ-ῌῐ-ΐῖ-Ίῠ-Ῥῲ-ῴῶ-ῼ‌‍‿⁀⁔ⁱⁿₐ-ₜ⃐-⃥⃜⃡-⃰ℂℇℊ-ℓℕℙ-ℝℤΩℨK-ℭℯ-ℹℼ-ℿⅅ-ⅉⅎⅠ-ↈⰀ-Ⱞⰰ-ⱞⱠ-ⳤⳫ-ⳳⴀ-ⴥⴧⴭⴰ-ⵧⵯ⵿-ⶖⶠ-ⶦⶨ-ⶮⶰ-ⶶⶸ-ⶾⷀ-ⷆⷈ-ⷎⷐ-ⷖⷘ-ⷞⷠ-ⷿⸯ々-〇〡-〯〱-〵〸-〼ぁ-ゖ゙゚ゝ-ゟァ-ヺー-ヿㄅ-ㄭㄱ-ㆎㆠ-ㆺㇰ-ㇿ㐀-䶵一-鿌ꀀ-ꒌꓐ-ꓽꔀ-ꘌꘐ-ꘫꙀ-꙯ꙴ-꙽ꙿ-ꚗꚟ-꛱ꜗ-ꜟꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꠧꡀ-ꡳꢀ-꣄꣐-꣙꣠-ꣷꣻ꤀-꤭ꤰ-꥓ꥠ-ꥼꦀ-꧀ꧏ-꧙ꨀ-ꨶꩀ-ꩍ꩐-꩙ꩠ-ꩶꩺꩻꪀ-ꫂꫛ-ꫝꫠ-ꫯꫲ-꫶ꬁ-ꬆꬉ-ꬎꬑ-ꬖꬠ-ꬦꬨ-ꬮꯀ-ꯪ꯬꯭꯰-꯹가-힣ힰ-ퟆퟋ-ퟻ豈-舘並-龎ﬀ-ﬆﬓ-ﬗיִ-ﬨשׁ-זּטּ-לּמּנּסּףּפּצּ-ﮱﯓ-ﴽﵐ-ﶏﶒ-ﷇﷰ-ﷻ︀-️︠-︦︳︴﹍-﹏ﹰ-ﹴﹶ-ﻼ０-９Ａ-Ｚ＿ａ-ｚｦ-ﾾￂ-ￇￊ-ￏￒ-ￗￚ-ￜ]")
            }, typeof "esprima" [0] == "undefined" && (n = function(e, t) {
                return pn.slice(e, t).join("")
            }), e.version = "1.0.2", e.parse = on, e.Syntax = function() {
                var e, t = {};
                typeof Object.create == "function" && (t = Object.create(null));
                for (e in fn) fn.hasOwnProperty(e) && (t[e] = fn[e]);
                return typeof Object.freeze == "function" && Object.freeze(t), t
            }()
        })
    }
}), montageDefine("4524b7e", "escodegen", {
    dependencies: ["source-map"],
    factory: function(e, t, n) {
        (function(e, n) {
            "use strict";
            typeof define == "function" && define.amd ? define(["exports"], function(t) {
                e(t, n)
            }) : typeof t != "undefined" ? e(t, n) : e(n.escodegen = {}, n)
        })(function(t, n) {
            "use strict";

            function r() {
                return {
                    indent: null,
                    base: null,
                    parse: null,
                    comment: !1,
                    format: {
                        indent: {
                            style: "    ",
                            base: 0,
                            adjustMultilineComment: !1
                        },
                        json: !1,
                        renumber: !1,
                        hexadecimal: !1,
                        quotes: "single",
                        escapeless: !1,
                        compact: !1,
                        parentheses: !0,
                        semicolons: !0,
                        safeConcatenation: !1
                    },
                    moz: {
                        starlessGenerator: !1,
                        parenthesizedComprehensionBlock: !1
                    },
                    sourceMap: null,
                    sourceMapWithCode: !1,
                    directive: !1,
                    verbatim: null
                }
            }
            function i(e) {
                var t = e.length,
                    n = [],
                    r;
                for (r = 0; r < t; r += 1) n[r] = e.charAt(r);
                return n
            }
            function s(e, t) {
                var n = "";
                for (t |= 0; t > 0; t >>>= 1, e += e) t & 1 && (n += e);
                return n
            }
            function o(e, t, n, r) {
                function i(e) {
                    var t, n;
                    if (J(e)) for (t = 0, n = e.length; t < n; ++t) i(e[t]);
                    else e instanceof o ? s.push(e) : typeof e == "string" && e && s.push(e)
                }
                var s = [];
                i(r), this.children = s
            }
            function u(e) {
                return /[\r\n]/g.test(e)
            }
            function a(e) {
                var t = e.charAt(e.length - 1);
                return t === "\r" || t === "\n"
            }
            function f(e) {
                var t = {}, n;
                for (n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
                return t
            }
            function l(e) {
                var t = {}, n, r;
                for (n in e) e.hasOwnProperty(n) && (r = e[n], typeof r == "object" && r !== null ? t[n] = l(r) : t[n] = r);
                return t
            }
            function c(e, t) {
                function n(e) {
                    return typeof e == "object" && e instanceof Object && !(e instanceof RegExp)
                }
                var r, i;
                for (r in t) t.hasOwnProperty(r) && (i = t[r], n(i) ? n(e[r]) ? c(e[r], i) : e[r] = c({}, i) : e[r] = i);
                return e
            }
            function h(e) {
                var t, n, r, i, s;
                if (e !== e) throw new Error("Numeric literal whose value is NaN");
                if (e < 0 || e === 0 && 1 / e < 0) throw new Error("Numeric literal whose value is negative");
                if (e === 1 / 0) return G ? "null" : Y ? "1e400" : "1e+400";
                t = "" + e;
                if (!Y || t.length < 3) return t;
                n = t.indexOf("."), !G && t.charAt(0) === "0" && n === 1 && (n = 0, t = t.slice(1)), r = t, t = t.replace("e+", "e"), i = 0, (s = r.indexOf("e")) > 0 && (i = +r.slice(s + 1), r = r.slice(0, s)), n >= 0 && (i -= r.length - n - 1, r = +(r.slice(0, n) + r.slice(n + 1)) + ""), s = 0;
                while (r.charAt(r.length + s - 1) === "0") s -= 1;
                return s !== 0 && (i -= s, r = r.slice(0, s)), i !== 0 && (r += "e" + i), (r.length < t.length || Z && e > 1e12 && Math.floor(e) === e && (r = "0x" + e.toString(16)).length < t.length) && +r === e && (t = r), t
            }
            function p(e, t) {
                var n = e.charCodeAt(0),
                    r = n.toString(16),
                    i = "\\";
                switch (e) {
                    case "\b":
                        i += "b";
                        break;
                    case "\f":
                        i += "f";
                        break;
                    case "	":
                        i += "t";
                        break;
                    default:
                        G || n > 255 ? i += "u" + "0000".slice(r.length) + r : e === "\0" && "0123456789".indexOf(t) < 0 ? i += "0" : e === "" ? i += "v" : i += "x" + "00".slice(r.length) + r
                }
                return i
            }
            function d(e) {
                var t = "\\";
                switch (e) {
                    case "\\":
                        t += "\\";
                        break;
                    case "\n":
                        t += "n";
                        break;
                    case "\r":
                        t += "r";
                        break;
                    case "\u2028":
                        t += "u2028";
                        break;
                    case "\u2029":
                        t += "u2029";
                        break;
                    default:
                        throw new Error("Incorrectly classified character")
                }
                return t
            }
            function v(e) {
                var t, n, r, s, o, u;
                o = e, typeof o[0] == "undefined" && (o = i(o)), u = et === "double" ? '"' : "'";
                for (t = 0, n = o.length; t < n; t += 1) {
                    r = o[t];
                    if (r === "'") {
                        u = '"';
                        break
                    }
                    if (r === '"') {
                        u = "'";
                        break
                    }
                    r === "\\" && (t += 1)
                }
                return u + e + u
            }
            function m(e) {
                var t = "",
                    n, r, s, o, u = 0,
                    a = 0,
                    f;
                typeof e[0] == "undefined" && (e = i(e));
                for (n = 0, r = e.length; n < r; n += 1) {
                    s = e[n];
                    if (s === "'") u += 1;
                    else if (s === '"') a += 1;
                    else if (s === "/" && G) t += "\\";
                    else {
                        if ("\\\n\r\u2028\u2029".indexOf(s) >= 0) {
                            t += d(s);
                            continue
                        }
                        if (G && s < " " || !(G || tt || s >= " " && s <= "~")) {
                            t += p(s, e[n + 1]);
                            continue
                        }
                    }
                    t += s
                }
                f = !(et === "double" || et === "auto" && a < u), e = t, t = f ? "'" : '"', typeof e[0] == "undefined" && (e = i(e));
                for (n = 0, r = e.length; n < r; n += 1) {
                    s = e[n];
                    if (s === "'" && f || s === '"' && !f) t += "\\";
                    t += s
                }
                return t + (f ? "'" : '"')
            }
            function g(e) {
                return "	\f  ".indexOf(e) >= 0 || e.charCodeAt(0) >= 5760 && " ᠎             　﻿".indexOf(e) >= 0
            }
            function y(e) {
                return "\n\r\u2028\u2029".indexOf(e) >= 0
            }
            function b(e) {
                return e === "$" || e === "_" || e === "\\" || e >= "a" && e <= "z" || e >= "A" && e <= "Z" || e >= "0" && e <= "9" || e.charCodeAt(0) >= 128 && W.NonAsciiIdentifierPart.test(e)
            }
            function w(e, t) {
                if (t == null) {
                    if (e instanceof $) return e;
                    t = {}
                }
                return t.loc == null ? new $(null, null, lt, e) : new $(t.loc.start.line, t.loc.start.column, lt === !0 ? t.loc.source || null : lt, e)
            }
            function E(e, t) {
                var n = w(e).toString(),
                    r = w(t).toString(),
                    i = n.charAt(n.length - 1),
                    s = r.charAt(0);
                return (i === "+" || i === "-") && i === s || b(i) && b(s) ? [e, " ", t] : g(i) || y(i) || g(s) || y(s) ? [e, t] : [e, rt, t]
            }
            function S(e) {
                return [K, e]
            }
            function x(e) {
                var t, n;
                return t = K, K += Q, n = e.call(this, K), K = t, n
            }
            function T(e) {
                var t;
                for (t = e.length - 1; t >= 0; t -= 1) if (y(e.charAt(t))) break;
                return e.length - 1 - t
            }
            function N(e, t) {
                var n, r, i, s, o, u, a, f;
                n = e.split(/\r\n|[\r\n]/), a = Number.MAX_VALUE;
                for (r = 1, i = n.length; r < i; r += 1) {
                    s = n[r], o = 0;
                    while (o < s.length && g(s[o])) o += 1;
                    a > o && (a = o)
                }
                typeof t != "undefined" ? (f = K, n[1][a] === "*" && (t += " "), K = t) : (a & 1 && (a -= 1), f = K);
                for (r = 1, i = n.length; r < i; r += 1) n[r] = w(S(n[r].slice(a))).join("");
                return K = f, n.join("\n")
            }
            function C(e, t) {
                return e.type === "Line" ? a(e.value) ? "//" + e.value : "//" + e.value + "\n" : at.format.indent.adjustMultilineComment && /[\n\r]/.test(e.value) ? N("/*" + e.value + "*/", t) : "/*" + e.value + "*/"
            }
            function k(e, t) {
                var n, r, i, o, u, f, l, c;
                if (e.leadingComments && e.leadingComments.length > 0) {
                    o = t, i = e.leadingComments[0], t = [], ot && e.type === R.Program && e.body.length === 0 && t.push("\n"), t.push(C(i)), a(w(t).toString()) || t.push("\n");
                    for (n = 1, r = e.leadingComments.length; n < r; n += 1) i = e.leadingComments[n], c = [C(i)], a(w(c).toString()) || c.push("\n"), t.push(S(c));
                    t.push(S(o))
                }
                if (e.trailingComments) {
                    f = !a(w(t).toString()), l = s(" ", T(w([K, t, Q]).toString()));
                    for (n = 0, r = e.trailingComments.length; n < r; n += 1) i = e.trailingComments[n], f ? (n === 0 ? t = [t, Q] : t = [t, l], t.push(C(i, l))) : t = [t, S(C(i))], n !== r - 1 && !a(w(t).toString()) && (t = [t, "\n"])
                }
                return t
            }
            function L(e, t, n) {
                return t < n ? ["(", e, ")"] : e
            }
            function A(e, t, n) {
                var r, i;
                return i = !at.comment || !e.leadingComments, e.type === R.BlockStatement && i ? [rt, P(e, {
                    functionBody: n
                })] : e.type === R.EmptyStatement && i ? ";" : (x(function() {
                    r = [nt, S(P(e, {
                        semicolonOptional: t,
                        functionBody: n
                    }))]
                }), r)
            }
            function O(e, t) {
                var n = a(w(t).toString());
                return e.type === R.BlockStatement && (!at.comment || !e.leadingComments) && !n ? [t, rt] : n ? [t, K] : [t, nt, K]
            }
            function M(e, t) {
                var n, r;
                r = e[at.verbatim].split(/\r\n|\n/);
                for (n = 1; n < r.length; n++) r[n] = nt + K + r[n];
                return r = L(r, U.Sequence, t.precedence), w(r, e)
            }
            function _(e) {
                var t, n, r, i;
                t = ["("];
                for (n = 0, r = e.params.length; n < r; n += 1) t.push(e.params[n].name), n + 1 < r && t.push("," + rt);
                return t.push(")"), e.expression ? (t.push(rt), i = D(e.body, {
                    precedence: U.Assignment,
                    allowIn: !0,
                    allowCall: !0
                }), i.toString().charAt(0) === "{" && (i = ["(", i, ")"]), t.push(i)) : t.push(A(e.body, !1, !0)), t
            }
            function D(e, t) {
                var n, r, i, s, o, f, l, c, p, d, v, g, y, S, T, N, C, k;
                r = t.precedence, y = t.allowIn, S = t.allowCall;
                if (at.verbatim && e.hasOwnProperty(at.verbatim)) return M(e, t);
                switch (e.type) {
                    case R.SequenceExpression:
                        n = [], y |= U.Sequence < r;
                        for (s = 0, o = e.expressions.length; s < o; s += 1) n.push(D(e.expressions[s], {
                            precedence: U.Assignment,
                            allowIn: y,
                            allowCall: !0
                        })), s + 1 < o && n.push("," + rt);
                        n = L(n, U.Sequence, r);
                        break;
                    case R.AssignmentExpression:
                        y |= U.Assignment < r, n = L([D(e.left, {
                            precedence: U.Call,
                            allowIn: y,
                            allowCall: !0
                        }), rt + e.operator + rt, D(e.right, {
                            precedence: U.Assignment,
                            allowIn: y,
                            allowCall: !0
                        })], U.Assignment, r);
                        break;
                    case R.ConditionalExpression:
                        y |= U.Conditional < r, n = L([D(e.test, {
                            precedence: U.LogicalOR,
                            allowIn: y,
                            allowCall: !0
                        }), rt + "?" + rt, D(e.consequent, {
                            precedence: U.Assignment,
                            allowIn: y,
                            allowCall: !0
                        }), rt + ":" + rt, D(e.alternate, {
                            precedence: U.Assignment,
                            allowIn: y,
                            allowCall: !0
                        })], U.Conditional, r);
                        break;
                    case R.LogicalExpression:
                    case R.BinaryExpression:
                        i = z[e.operator], y |= i < r, n = E(D(e.left, {
                            precedence: i,
                            allowIn: y,
                            allowCall: !0
                        }), e.operator), l = D(e.right, {
                            precedence: i + 1,
                            allowIn: y,
                            allowCall: !0
                        }), e.operator === "/" && l.toString().charAt(0) === "/" ? n.push(" ", l) : n = E(n, l), e.operator === "in" && !y ? n = ["(", n, ")"] : n = L(n, i, r);
                        break;
                    case R.CallExpression:
                        n = [D(e.callee, {
                            precedence: U.Call,
                            allowIn: !0,
                            allowCall: !0,
                            allowUnparenthesizedNew: !1
                        })], n.push("(");
                        for (s = 0, o = e.arguments.length; s < o; s += 1) n.push(D(e.arguments[s], {
                            precedence: U.Assignment,
                            allowIn: !0,
                            allowCall: !0
                        })), s + 1 < o && n.push("," + rt);
                        n.push(")"), S ? n = L(n, U.Call, r) : n = ["(", n, ")"];
                        break;
                    case R.NewExpression:
                        o = e.arguments.length, T = t.allowUnparenthesizedNew === undefined || t.allowUnparenthesizedNew, n = E("new", D(e.callee, {
                            precedence: U.New,
                            allowIn: !0,
                            allowCall: !1,
                            allowUnparenthesizedNew: T && !it && o === 0
                        }));
                        if (!T || it || o > 0) {
                            n.push("(");
                            for (s = 0; s < o; s += 1) n.push(D(e.arguments[s], {
                                precedence: U.Assignment,
                                allowIn: !0,
                                allowCall: !0
                            })), s + 1 < o && n.push("," + rt);
                            n.push(")")
                        }
                        n = L(n, U.New, r);
                        break;
                    case R.MemberExpression:
                        n = [D(e.object, {
                            precedence: U.Call,
                            allowIn: !0,
                            allowCall: S,
                            allowUnparenthesizedNew: !1
                        })], e.computed ? n.push("[", D(e.property, {
                            precedence: U.Sequence,
                            allowIn: !0,
                            allowCall: S
                        }), "]") : (e.object.type === R.Literal && typeof e.object.value == "number" && n.indexOf(".") < 0 && !/[eExX]/.test(n) && !(n.length >= 2 && n[0] === "0") && n.push("."), n.push("." + e.property.name)), n = L(n, U.Member, r);
                        break;
                    case R.UnaryExpression:
                        l = D(e.argument, {
                            precedence: U.Unary,
                            allowIn: !0,
                            allowCall: !0
                        }), rt === "" ? n = E(e.operator, l) : (n = [e.operator], e.operator.length > 2 ? n = E(n, l) : (d = w(n).toString(), p = d.charAt(d.length - 1), v = l.toString().charAt(0), (p === "+" || p === "-") && p === v || b(p) && b(v) ? n.push(" ", l) : n.push(l))), n = L(n, U.Unary, r);
                        break;
                    case R.YieldExpression:
                        e.delegate ? n = "yield*" : n = "yield", e.argument && (n = E(n, D(e.argument, {
                            precedence: U.Assignment,
                            allowIn: !0,
                            allowCall: !0
                        })));
                        break;
                    case R.UpdateExpression:
                        e.prefix ? n = L([e.operator, D(e.argument, {
                            precedence: U.Unary,
                            allowIn: !0,
                            allowCall: !0
                        })], U.Unary, r) : n = L([D(e.argument, {
                            precedence: U.Postfix,
                            allowIn: !0,
                            allowCall: !0
                        }), e.operator], U.Postfix, r);
                        break;
                    case R.FunctionExpression:
                        n = "function", e.id ? n += " " + e.id.name : n += rt, n = [n, _(e)];
                        break;
                    case R.ArrayPattern:
                    case R.ArrayExpression:
                        if (!e.elements.length) {
                            n = "[]";
                            break
                        }
                        c = e.elements.length > 1, n = ["[", c ? nt : ""], x(function(t) {
                            for (s = 0, o = e.elements.length; s < o; s += 1) e.elements[s] ? n.push(c ? t : "", D(e.elements[s], {
                                precedence: U.Assignment,
                                allowIn: !0,
                                allowCall: !0
                            })) : (c && n.push(t), s + 1 === o && n.push(",")), s + 1 < o && n.push("," + (c ? nt : rt))
                        }), c && !a(w(n).toString()) && n.push(nt), n.push(c ? K : "", "]");
                        break;
                    case R.Property:
                        e.kind === "get" || e.kind === "set" ? n = [e.kind + " ", D(e.key, {
                            precedence: U.Sequence,
                            allowIn: !0,
                            allowCall: !0
                        }), _(e.value)] : e.shorthand ? n = D(e.key, {
                            precedence: U.Sequence,
                            allowIn: !0,
                            allowCall: !0
                        }) : e.method ? (n = [], e.value.generator && n.push("*"), n.push(D(e.key, {
                            precedence: U.Sequence,
                            allowIn: !0,
                            allowCall: !0
                        }), _(e.value))) : n = [D(e.key, {
                            precedence: U.Sequence,
                            allowIn: !0,
                            allowCall: !0
                        }), ":" + rt, D(e.value, {
                            precedence: U.Assignment,
                            allowIn: !0,
                            allowCall: !0
                        })];
                        break;
                    case R.ObjectExpression:
                        if (!e.properties.length) {
                            n = "{}";
                            break
                        }
                        c = e.properties.length > 1, x(function(t) {
                            l = D(e.properties[0], {
                                precedence: U.Sequence,
                                allowIn: !0,
                                allowCall: !0
                            })
                        });
                        if (!c && !u(w(l).toString())) {
                            n = ["{", rt, l, rt, "}"];
                            break
                        }
                        x(function(t) {
                            n = ["{", nt, t, l];
                            if (c) {
                                n.push("," + nt);
                                for (s = 1, o = e.properties.length; s < o; s += 1) n.push(t, D(e.properties[s], {
                                    precedence: U.Sequence,
                                    allowIn: !0,
                                    allowCall: !0
                                })), s + 1 < o && n.push("," + nt)
                            }
                        }), a(w(n).toString()) || n.push(nt), n.push(K, "}");
                        break;
                    case R.ObjectPattern:
                        if (!e.properties.length) {
                            n = "{}";
                            break
                        }
                        c = !1;
                        if (e.properties.length === 1) N = e.properties[0], N.value.type !== R.Identifier && (c = !0);
                        else for (s = 0, o = e.properties.length; s < o; s += 1) {
                            N = e.properties[s];
                            if (!N.shorthand) {
                                c = !0;
                                break
                            }
                        }
                        n = ["{", c ? nt : ""], x(function(t) {
                            for (s = 0, o = e.properties.length; s < o; s += 1) n.push(c ? t : "", D(e.properties[s], {
                                precedence: U.Sequence,
                                allowIn: !0,
                                allowCall: !0
                            })), s + 1 < o && n.push("," + (c ? nt : rt))
                        }), c && !a(w(n).toString()) && n.push(nt), n.push(c ? K : "", "}");
                        break;
                    case R.ThisExpression:
                        n = "this";
                        break;
                    case R.Identifier:
                        n = e.name;
                        break;
                    case R.Literal:
                        if (e.hasOwnProperty("raw") && ft) try {
                            f = ft(e.raw).body[0].expression;
                            if (f.type === R.Literal && f.value === e.value) {
                                n = e.raw;
                                break
                            }
                        } catch (A) {}
                        if (e.value === null) {
                            n = "null";
                            break
                        }
                        if (typeof e.value == "string") {
                            n = m(e.value);
                            break
                        }
                        if (typeof e.value == "number") {
                            n = h(e.value);
                            break
                        }
                        n = e.value.toString();
                        break;
                    case R.ComprehensionExpression:
                        n = ["[", D(e.body, {
                            precedence: U.Assignment,
                            allowIn: !0,
                            allowCall: !0
                        })];
                        if (e.blocks) for (s = 0, o = e.blocks.length; s < o; s += 1) l = D(e.blocks[s], {
                            precedence: U.Sequence,
                            allowIn: !0,
                            allowCall: !0
                        }), n = E(n, l);
                        e.filter && (n = E(n, "if" + rt), l = D(e.filter, {
                            precedence: U.Sequence,
                            allowIn: !0,
                            allowCall: !0
                        }), at.moz.parenthesizedComprehensionBlock ? n = E(n, ["(", l, ")"]) : n = E(n, l)), n.push("]");
                        break;
                    case R.ComprehensionBlock:
                        e.left.type === R.VariableDeclaration ? l = [e.left.kind + " ", P(e.left.declarations[0], {
                            allowIn: !1
                        })] : l = D(e.left, {
                            precedence: U.Call,
                            allowIn: !0,
                            allowCall: !0
                        }), l = E(l, e.of ? "of" : "in"), l = E(l, D(e.right, {
                            precedence: U.Sequence,
                            allowIn: !0,
                            allowCall: !0
                        })), at.moz.parenthesizedComprehensionBlock ? n = ["for" + rt + "(", l, ")"] : n = E("for" + rt, l);
                        break;
                    default:
                        throw new Error("Unknown expression type: " + e.type)
                }
                return w(n, e)
            }
            function P(e, t) {
                var n, r, i, s, o, u, f, l, c;
                o = !0, c = ";", u = !1, f = !1, t && (o = t.allowIn === undefined || t.allowIn, !st && t.semicolonOptional === !0 && (c = ""), u = t.functionBody, f = t.directiveContext);
                switch (e.type) {
                    case R.BlockStatement:
                        i = ["{", nt], x(function() {
                            for (n = 0, r = e.body.length; n < r; n += 1) l = S(P(e.body[n], {
                                semicolonOptional: n === r - 1,
                                directiveContext: u
                            })), i.push(l), a(w(l).toString()) || i.push(nt)
                        }), i.push(S("}"));
                        break;
                    case R.BreakStatement:
                        e.label ? i = "break " + e.label.name + c : i = "break" + c;
                        break;
                    case R.ContinueStatement:
                        e.label ? i = "continue " + e.label.name + c : i = "continue" + c;
                        break;
                    case R.DirectiveStatement:
                        e.raw ? i = e.raw + c : i = v(e.directive) + c;
                        break;
                    case R.DoWhileStatement:
                        i = E("do", A(e.body)), i = O(e.body, i), i = E(i, ["while" + rt + "(", D(e.test, {
                            precedence: U.Sequence,
                            allowIn: !0,
                            allowCall: !0
                        }), ")" + c]);
                        break;
                    case R.CatchClause:
                        x(function() {
                            i = ["catch" + rt + "(", D(e.param, {
                                precedence: U.Sequence,
                                allowIn: !0,
                                allowCall: !0
                            }), ")"]
                        }), i.push(A(e.body));
                        break;
                    case R.DebuggerStatement:
                        i = "debugger" + c;
                        break;
                    case R.EmptyStatement:
                        i = ";";
                        break;
                    case R.ExpressionStatement:
                        i = [D(e.expression, {
                            precedence: U.Sequence,
                            allowIn: !0,
                            allowCall: !0
                        })], i.toString().charAt(0) === "{" || i.toString().slice(0, 8) === "function" && " (".indexOf(i.toString().charAt(8)) >= 0 || ut && f && e.expression.type === R.Literal && typeof e.expression.value == "string" ? i = ["(", i, ")" + c] : i.push(c);
                        break;
                    case R.VariableDeclarator:
                        e.init ? i = [D(e.id, {
                            precedence: U.Assignment,
                            allowIn: o,
                            allowCall: !0
                        }) + rt + "=" + rt, D(e.init, {
                            precedence: U.Assignment,
                            allowIn: o,
                            allowCall: !0
                        })] : i = e.id.name;
                        break;
                    case R.VariableDeclaration:
                        i = [e.kind], e.declarations.length === 1 && e.declarations[0].init && e.declarations[0].init.type === R.FunctionExpression ? i.push(" ", P(e.declarations[0], {
                            allowIn: o
                        })) : x(function() {
                            s = e.declarations[0], at.comment && s.leadingComments ? i.push("\n", S(P(s, {
                                allowIn: o
                            }))) : i.push(" ", P(s, {
                                allowIn: o
                            }));
                            for (n = 1, r = e.declarations.length; n < r; n += 1) s = e.declarations[n], at.comment && s.leadingComments ? i.push("," + nt, S(P(s, {
                                allowIn: o
                            }))) : i.push("," + rt, P(s, {
                                allowIn: o
                            }))
                        }), i.push(c);
                        break;
                    case R.ThrowStatement:
                        i = [E("throw", D(e.argument, {
                            precedence: U.Sequence,
                            allowIn: !0,
                            allowCall: !0
                        })), c];
                        break;
                    case R.TryStatement:
                        i = ["try", A(e.block)], i = O(e.block, i);
                        for (n = 0, r = e.handlers.length; n < r; n += 1) {
                            i = E(i, P(e.handlers[n]));
                            if (e.finalizer || n + 1 !== r) i = O(e.handlers[n].body, i)
                        }
                        e.finalizer && (i = E(i, ["finally", A(e.finalizer)]));
                        break;
                    case R.SwitchStatement:
                        x(function() {
                            i = ["switch" + rt + "(", D(e.discriminant, {
                                precedence: U.Sequence,
                                allowIn: !0,
                                allowCall: !0
                            }), ")" + rt + "{" + nt]
                        });
                        if (e.cases) for (n = 0, r = e.cases.length; n < r; n += 1) l = S(P(e.cases[n], {
                            semicolonOptional: n === r - 1
                        })), i.push(l), a(w(l).toString()) || i.push(nt);
                        i.push(S("}"));
                        break;
                    case R.SwitchCase:
                        x(function() {
                            e.test ? i = [E("case", D(e.test, {
                                precedence: U.Sequence,
                                allowIn: !0,
                                allowCall: !0
                            })), ":"] : i = ["default:"], n = 0, r = e.consequent.length, r && e.consequent[0].type === R.BlockStatement && (l = A(e.consequent[0]), i.push(l), n = 1), n !== r && !a(w(i).toString()) && i.push(nt);
                            for (; n < r; n += 1) l = S(P(e.consequent[n], {
                                semicolonOptional: n === r - 1 && c === ""
                            })), i.push(l), n + 1 !== r && !a(w(l).toString()) && i.push(nt)
                        });
                        break;
                    case R.IfStatement:
                        x(function() {
                            i = ["if" + rt + "(", D(e.test, {
                                precedence: U.Sequence,
                                allowIn: !0,
                                allowCall: !0
                            }), ")"]
                        }), e.alternate ? (i.push(A(e.consequent)), i = O(e.consequent, i), e.alternate.type === R.IfStatement ? i = E(i, ["else ", P(e.alternate, {
                            semicolonOptional: c === ""
                        })]) : i = E(i, E("else", A(e.alternate, c === "")))) : i.push(A(e.consequent, c === ""));
                        break;
                    case R.ForStatement:
                        x(function() {
                            i = ["for" + rt + "("], e.init ? e.init.type === R.VariableDeclaration ? i.push(P(e.init, {
                                allowIn: !1
                            })) : i.push(D(e.init, {
                                precedence: U.Sequence,
                                allowIn: !1,
                                allowCall: !0
                            }), ";") : i.push(";"), e.test ? i.push(rt, D(e.test, {
                                precedence: U.Sequence,
                                allowIn: !0,
                                allowCall: !0
                            }), ";") : i.push(";"), e.update ? i.push(rt, D(e.update, {
                                precedence: U.Sequence,
                                allowIn: !0,
                                allowCall: !0
                            }), ")") : i.push(")")
                        }), i.push(A(e.body, c === ""));
                        break;
                    case R.ForInStatement:
                        i = ["for" + rt + "("], x(function() {
                            e.left.type === R.VariableDeclaration ? x(function() {
                                i.push(e.left.kind + " ", P(e.left.declarations[0], {
                                    allowIn: !1
                                }))
                            }) : i.push(D(e.left, {
                                precedence: U.Call,
                                allowIn: !0,
                                allowCall: !0
                            })), i = E(i, "in"), i = [E(i, D(e.right, {
                                precedence: U.Sequence,
                                allowIn: !0,
                                allowCall: !0
                            })), ")"]
                        }), i.push(A(e.body, c === ""));
                        break;
                    case R.LabeledStatement:
                        i = [e.label.name + ":", A(e.body, c === "")];
                        break;
                    case R.Program:
                        r = e.body.length, i = [ot && r > 0 ? "\n" : ""];
                        for (n = 0; n < r; n += 1) l = S(P(e.body[n], {
                            semicolonOptional: !ot && n === r - 1,
                            directiveContext: !0
                        })), i.push(l), n + 1 < r && !a(w(l).toString()) && i.push(nt);
                        break;
                    case R.FunctionDeclaration:
                        i = [(e.generator && !at.moz.starlessGenerator ? "function* " : "function ") + e.id.name, _(e)];
                        break;
                    case R.ReturnStatement:
                        e.argument ? i = [E("return", D(e.argument, {
                            precedence: U.Sequence,
                            allowIn: !0,
                            allowCall: !0
                        })), c] : i = ["return" + c];
                        break;
                    case R.WhileStatement:
                        x(function() {
                            i = ["while" + rt + "(", D(e.test, {
                                precedence: U.Sequence,
                                allowIn: !0,
                                allowCall: !0
                            }), ")"]
                        }), i.push(A(e.body, c === ""));
                        break;
                    case R.WithStatement:
                        x(function() {
                            i = ["with" + rt + "(", D(e.object, {
                                precedence: U.Sequence,
                                allowIn: !0,
                                allowCall: !0
                            }), ")"]
                        }), i.push(A(e.body, c === ""));
                        break;
                    default:
                        throw new Error("Unknown statement type: " + e.type)
                }
                return at.comment && (i = k(e, i)), l = w(i).toString(), e.type === R.Program && !ot && nt === "" && l.charAt(l.length - 1) === "\n" && (i = w(i).replaceRight(/\s+$/, "")), w(i, e)
            }
            function H(t, i) {
                var u = r(),
                    a, f;
                i != null ? (typeof i.indent == "string" && (u.format.indent.style = i.indent), typeof i.base == "number" && (u.format.indent.base = i.base), i = c(u, i), Q = i.format.indent.style, typeof i.base == "string" ? K = i.base : K = s(Q, i.format.indent.base)) : (i = u, Q = i.format.indent.style, K = s(Q, i.format.indent.base)), G = i.format.json, Y = i.format.renumber, Z = G ? !1 : i.format.hexadecimal, et = G ? "double" : i.format.quotes, tt = i.format.escapeless, i.format.compact ? nt = rt = Q = K = "" : (nt = "\n", rt = " "), it = i.format.parentheses, st = i.format.semicolons, ot = i.format.safeConcatenation, ut = i.directive, ft = G ? null : i.parse, lt = i.sourceMap, at = i, lt ? typeof process != "undefined" ? $ = e("source-map").SourceNode : $ = n.sourceMap.SourceNode : $ = o;
                switch (t.type) {
                    case R.BlockStatement:
                    case R.BreakStatement:
                    case R.CatchClause:
                    case R.ContinueStatement:
                    case R.DirectiveStatement:
                    case R.DoWhileStatement:
                    case R.DebuggerStatement:
                    case R.EmptyStatement:
                    case R.ExpressionStatement:
                    case R.ForStatement:
                    case R.ForInStatement:
                    case R.FunctionDeclaration:
                    case R.IfStatement:
                    case R.LabeledStatement:
                    case R.Program:
                    case R.ReturnStatement:
                    case R.SwitchStatement:
                    case R.SwitchCase:
                    case R.ThrowStatement:
                    case R.TryStatement:
                    case R.VariableDeclaration:
                    case R.VariableDeclarator:
                    case R.WhileStatement:
                    case R.WithStatement:
                        a = P(t);
                        break;
                    case R.AssignmentExpression:
                    case R.ArrayExpression:
                    case R.ArrayPattern:
                    case R.BinaryExpression:
                    case R.CallExpression:
                    case R.ConditionalExpression:
                    case R.FunctionExpression:
                    case R.Identifier:
                    case R.Literal:
                    case R.LogicalExpression:
                    case R.MemberExpression:
                    case R.NewExpression:
                    case R.ObjectExpression:
                    case R.ObjectPattern:
                    case R.Property:
                    case R.SequenceExpression:
                    case R.ThisExpression:
                    case R.UnaryExpression:
                    case R.UpdateExpression:
                    case R.YieldExpression:
                        a = D(t, {
                            precedence: U.Sequence,
                            allowIn: !0,
                            allowCall: !0
                        });
                        break;
                    default:
                        throw new Error("Unknown node type: " + t.type)
                }
                return lt ? (f = a.toStringWithSourceMap({
                    file: i.sourceMap
                }), i.sourceMapWithCode ? f : f.map.toString()) : a.toString()
            }
            function B(e, t) {
                var n, r, i, s, o, u, a, f, l = {};
                n = [e], r = [null];
                while (n.length) {
                    i = n.pop();
                    if (i === l) {
                        i = r.pop(), t.leave ? s = t.leave(i, r[r.length - 1]) : s = undefined;
                        if (s === V.Break) return
                    } else if (i) {
                        t.enter ? s = t.enter(i, r[r.length - 1]) : s = undefined;
                        if (s === V.Break) return;
                        n.push(l), r.push(i);
                        if (s !== V.Skip) {
                            a = X[i.type], o = a.length;
                            while ((o -= 1) >= 0) {
                                f = i[a[o]];
                                if (f) if (J(f)) {
                                    u = f.length;
                                    while ((u -= 1) >= 0) f[u] && n.push(f[u])
                                } else n.push(f)
                            }
                        }
                    }
                }
            }
            function j(e, t) {
                var n, r, i, s;
                r = e.length, i = 0;
                while (r) n = r >>> 1, s = i + n, t(e[s]) ? r = n : (i = s + 1, r -= n + 1);
                return i
            }
            function F(e, t) {
                var n, r, i, s;
                r = e.length, i = 0;
                while (r) n = r >>> 1, s = i + n, t(e[s]) ? (i = s + 1, r -= n + 1) : r = n;
                return i
            }
            function I(e, t) {
                var n, r;
                return n = j(t, function(t) {
                    return t.range[0] > e.range[0]
                }), e.extendedRange = [e.range[0], e.range[1]], n !== t.length && (e.extendedRange[1] = t[n].range[0]), n -= 1, n >= 0 && (n < t.length ? e.extendedRange[0] = t[n].range[1] : r.length && (e.extendedRange[1] = t[t.length - 1].range[0])), e
            }
            function q(e, t, n) {
                var r = [],
                    i, s, o;
                if (!e.range) throw new Error("attachComments needs range information");
                if (!n.length) {
                    if (t.length) {
                        for (o = 0, s = t.length; o < s; o += 1) i = l(t[o]), i.extendedRange = [0, e.range[0]], r.push(i);
                        e.leadingComments = r
                    }
                    return e
                }
                for (o = 0, s = t.length; o < s; o += 1) r.push(I(l(t[o]), n));
                return B(e, {
                    cursor: 0,
                    enter: function(e) {
                        var t;
                        while (this.cursor < r.length) {
                            t = r[this.cursor];
                            if (t.extendedRange[1] > e.range[0]) break;
                            t.extendedRange[1] === e.range[0] ? (e.leadingComments || (e.leadingComments = []), e.leadingComments.push(t), r.splice(this.cursor, 1)) : this.cursor += 1
                        }
                        if (this.cursor === r.length) return V.Break;
                        if (r[this.cursor].extendedRange[0] > e.range[1]) return V.Skip
                    }
                }), B(e, {
                    cursor: 0,
                    leave: function(e) {
                        var t;
                        while (this.cursor < r.length) {
                            t = r[this.cursor];
                            if (e.range[1] < t.extendedRange[0]) break;
                            e.range[1] === t.extendedRange[0] ? (e.trailingComments || (e.trailingComments = []), e.trailingComments.push(t), r.splice(this.cursor, 1)) : this.cursor += 1
                        }
                        if (this.cursor === r.length) return V.Break;
                        if (r[this.cursor].extendedRange[0] > e.range[1]) return V.Skip
                    }
                }), e
            }
            var R, U, z, W, X, V, $, J, K, Q, G, Y, Z, et, tt, nt, rt, it, st, ot, ut, at, ft, lt;
            R = {
                AssignmentExpression: "AssignmentExpression",
                ArrayExpression: "ArrayExpression",
                ArrayPattern: "ArrayPattern",
                BlockStatement: "BlockStatement",
                BinaryExpression: "BinaryExpression",
                BreakStatement: "BreakStatement",
                CallExpression: "CallExpression",
                CatchClause: "CatchClause",
                ComprehensionBlock: "ComprehensionBlock",
                ComprehensionExpression: "ComprehensionExpression",
                ConditionalExpression: "ConditionalExpression",
                ContinueStatement: "ContinueStatement",
                DirectiveStatement: "DirectiveStatement",
                DoWhileStatement: "DoWhileStatement",
                DebuggerStatement: "DebuggerStatement",
                EmptyStatement: "EmptyStatement",
                ExpressionStatement: "ExpressionStatement",
                ForStatement: "ForStatement",
                ForInStatement: "ForInStatement",
                FunctionDeclaration: "FunctionDeclaration",
                FunctionExpression: "FunctionExpression",
                Identifier: "Identifier",
                IfStatement: "IfStatement",
                Literal: "Literal",
                LabeledStatement: "LabeledStatement",
                LogicalExpression: "LogicalExpression",
                MemberExpression: "MemberExpression",
                NewExpression: "NewExpression",
                ObjectExpression: "ObjectExpression",
                ObjectPattern: "ObjectPattern",
                Program: "Program",
                Property: "Property",
                ReturnStatement: "ReturnStatement",
                SequenceExpression: "SequenceExpression",
                SwitchStatement: "SwitchStatement",
                SwitchCase: "SwitchCase",
                ThisExpression: "ThisExpression",
                ThrowStatement: "ThrowStatement",
                TryStatement: "TryStatement",
                UnaryExpression: "UnaryExpression",
                UpdateExpression: "UpdateExpression",
                VariableDeclaration: "VariableDeclaration",
                VariableDeclarator: "VariableDeclarator",
                WhileStatement: "WhileStatement",
                WithStatement: "WithStatement",
                YieldExpression: "YieldExpression"
            }, U = {
                Sequence: 0,
                Assignment: 1,
                Conditional: 2,
                LogicalOR: 3,
                LogicalAND: 4,
                BitwiseOR: 5,
                BitwiseXOR: 6,
                BitwiseAND: 7,
                Equality: 8,
                Relational: 9,
                BitwiseSHIFT: 10,
                Additive: 11,
                Multiplicative: 12,
                Unary: 13,
                Postfix: 14,
                Call: 15,
                New: 16,
                Member: 17,
                Primary: 18
            }, z = {
                "||": U.LogicalOR,
                "&&": U.LogicalAND,
                "|": U.BitwiseOR,
                "^": U.BitwiseXOR,
                "&": U.BitwiseAND,
                "==": U.Equality,
                "!=": U.Equality,
                "===": U.Equality,
                "!==": U.Equality,
                is: U.Equality,
                isnt: U.Equality,
                "<": U.Relational,
                ">": U.Relational,
                "<=": U.Relational,
                ">=": U.Relational,
                "in": U.Relational,
                "instanceof": U.Relational,
                "<<": U.BitwiseSHIFT,
                ">>": U.BitwiseSHIFT,
                ">>>": U.BitwiseSHIFT,
                "+": U.Additive,
                "-": U.Additive,
                "*": U.Multiplicative,
                "%": U.Multiplicative,
                "/": U.Multiplicative
            }, W = {
                NonAsciiIdentifierPart: new RegExp("[ªµºÀ-ÖØ-öø-ˁˆ-ˑˠ-ˤˬˮ̀-ʹͶͷͺ-ͽΆΈ-ΊΌΎ-ΡΣ-ϵϷ-ҁ҃-҇Ҋ-ԧԱ-Ֆՙա-և֑-ׇֽֿׁׂׅׄא-תװ-ײؐ-ؚؠ-٩ٮ-ۓە-ۜ۟-۪ۨ-ۼۿܐ-݊ݍ-ޱ߀-ߵߺࠀ-࠭ࡀ-࡛ࢠࢢ-ࢬࣤ-ࣾऀ-ॣ०-९ॱ-ॷॹ-ॿঁ-ঃঅ-ঌএঐও-নপ-রলশ-হ়-ৄেৈো-ৎৗড়ঢ়য়-ৣ০-ৱਁ-ਃਅ-ਊਏਐਓ-ਨਪ-ਰਲਲ਼ਵਸ਼ਸਹ਼ਾ-ੂੇੈੋ-੍ੑਖ਼-ੜਫ਼੦-ੵઁ-ઃઅ-ઍએ-ઑઓ-નપ-રલળવ-હ઼-ૅે-ૉો-્ૐૠ-ૣ૦-૯ଁ-ଃଅ-ଌଏଐଓ-ନପ-ରଲଳଵ-ହ଼-ୄେୈୋ-୍ୖୗଡ଼ଢ଼ୟ-ୣ୦-୯ୱஂஃஅ-ஊஎ-ஐஒ-கஙசஜஞடணதந-பம-ஹா-ூெ-ைொ-்ௐௗ௦-௯ఁ-ఃఅ-ఌఎ-ఐఒ-నప-ళవ-హఽ-ౄె-ైొ-్ౕౖౘౙౠ-ౣ౦-౯ಂಃಅ-ಌಎ-ಐಒ-ನಪ-ಳವ-ಹ಼-ೄೆ-ೈೊ-್ೕೖೞೠ-ೣ೦-೯ೱೲംഃഅ-ഌഎ-ഐഒ-ഺഽ-ൄെ-ൈൊ-ൎൗൠ-ൣ൦-൯ൺ-ൿංඃඅ-ඖක-නඳ-රලව-ෆ්ා-ුූෘ-ෟෲෳก-ฺเ-๎๐-๙ກຂຄງຈຊຍດ-ທນ-ຟມ-ຣລວສຫອ-ູົ-ຽເ-ໄໆ່-ໍ໐-໙ໜ-ໟༀ༘༙༠-༩༹༵༷༾-ཇཉ-ཬཱ-྄྆-ྗྙ-ྼ࿆က-၉ၐ-ႝႠ-ჅჇჍა-ჺჼ-ቈቊ-ቍቐ-ቖቘቚ-ቝበ-ኈኊ-ኍነ-ኰኲ-ኵኸ-ኾዀዂ-ዅወ-ዖዘ-ጐጒ-ጕጘ-ፚ፝-፟ᎀ-ᎏᎠ-Ᏼᐁ-ᙬᙯ-ᙿᚁ-ᚚᚠ-ᛪᛮ-ᛰᜀ-ᜌᜎ-᜔ᜠ-᜴ᝀ-ᝓᝠ-ᝬᝮ-ᝰᝲᝳក-៓ៗៜ៝០-៩᠋-᠍᠐-᠙ᠠ-ᡷᢀ-ᢪᢰ-ᣵᤀ-ᤜᤠ-ᤫᤰ-᤻᥆-ᥭᥰ-ᥴᦀ-ᦫᦰ-ᧉ᧐-᧙ᨀ-ᨛᨠ-ᩞ᩠-᩿᩼-᪉᪐-᪙ᪧᬀ-ᭋ᭐-᭙᭫-᭳ᮀ-᯳ᰀ-᰷᱀-᱉ᱍ-ᱽ᳐-᳔᳒-ᳶᴀ-ᷦ᷼-ἕἘ-Ἕἠ-ὅὈ-Ὅὐ-ὗὙὛὝὟ-ώᾀ-ᾴᾶ-ᾼιῂ-ῄῆ-ῌῐ-ΐῖ-Ίῠ-Ῥῲ-ῴῶ-ῼ‌‍‿⁀⁔ⁱⁿₐ-ₜ⃐-⃥⃜⃡-⃰ℂℇℊ-ℓℕℙ-ℝℤΩℨK-ℭℯ-ℹℼ-ℿⅅ-ⅉⅎⅠ-ↈⰀ-Ⱞⰰ-ⱞⱠ-ⳤⳫ-ⳳⴀ-ⴥⴧⴭⴰ-ⵧⵯ⵿-ⶖⶠ-ⶦⶨ-ⶮⶰ-ⶶⶸ-ⶾⷀ-ⷆⷈ-ⷎⷐ-ⷖⷘ-ⷞⷠ-ⷿⸯ々-〇〡-〯〱-〵〸-〼ぁ-ゖ゙゚ゝ-ゟァ-ヺー-ヿㄅ-ㄭㄱ-ㆎㆠ-ㆺㇰ-ㇿ㐀-䶵一-鿌ꀀ-ꒌꓐ-ꓽꔀ-ꘌꘐ-ꘫꙀ-꙯ꙴ-꙽ꙿ-ꚗꚟ-꛱ꜗ-ꜟꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꠧꡀ-ꡳꢀ-꣄꣐-꣙꣠-ꣷꣻ꤀-꤭ꤰ-꥓ꥠ-ꥼꦀ-꧀ꧏ-꧙ꨀ-ꨶꩀ-ꩍ꩐-꩙ꩠ-ꩶꩺꩻꪀ-ꫂꫛ-ꫝꫠ-ꫯꫲ-꫶ꬁ-ꬆꬉ-ꬎꬑ-ꬖꬠ-ꬦꬨ-ꬮꯀ-ꯪ꯬꯭꯰-꯹가-힣ힰ-ퟆퟋ-ퟻ豈-舘並-龎ﬀ-ﬆﬓ-ﬗיִ-ﬨשׁ-זּטּ-לּמּנּסּףּפּצּ-ﮱﯓ-ﴽﵐ-ﶏﶒ-ﷇﷰ-ﷻ︀-️︠-︦︳︴﹍-﹏ﹰ-ﹴﹶ-ﻼ０-９Ａ-Ｚ＿ａ-ｚｦ-ﾾￂ-ￇￊ-ￏￒ-ￗￚ-ￜ]")
            }, J = Array.isArray, J || (J = function(e) {
                return Object.prototype.toString.call(e) === "[object Array]"
            }), o.prototype.toString = function() {
                var t = "",
                    n, r, i;
                for (n = 0, r = this.children.length; n < r; ++n) i = this.children[n], i instanceof o ? t += i.toString() : t += i;
                return t
            }, o.prototype.replaceRight = function(e, t) {
                var n = this.children[this.children.length - 1];
                return n instanceof o ? n.replaceRight(e, t) : typeof n == "string" ? this.children[this.children.length - 1] = n.replace(e, t) : this.children.push("".replace(e, t)), this
            }, o.prototype.join = function(e) {
                var t, n, r;
                r = [], n = this.children.length;
                if (n > 0) {
                    for (t = 0, n -= 1; t < n; ++t) r.push(this.children[t], e);
                    r.push(this.children[n]), this.children = r
                }
                return this
            }, X = {
                AssignmentExpression: ["left", "right"],
                ArrayExpression: ["elements"],
                ArrayPattern: ["elements"],
                BlockStatement: ["body"],
                BinaryExpression: ["left", "right"],
                BreakStatement: ["label"],
                CallExpression: ["callee", "arguments"],
                CatchClause: ["param", "body"],
                ConditionalExpression: ["test", "consequent", "alternate"],
                ContinueStatement: ["label"],
                DirectiveStatement: [],
                DoWhileStatement: ["body", "test"],
                DebuggerStatement: [],
                EmptyStatement: [],
                ExpressionStatement: ["expression"],
                ForStatement: ["init", "test", "update", "body"],
                ForInStatement: ["left", "right", "body"],
                FunctionDeclaration: ["id", "params", "body"],
                FunctionExpression: ["id", "params", "body"],
                Identifier: [],
                IfStatement: ["test", "consequent", "alternate"],
                Literal: [],
                LabeledStatement: ["label", "body"],
                LogicalExpression: ["left", "right"],
                MemberExpression: ["object", "property"],
                NewExpression: ["callee", "arguments"],
                ObjectExpression: ["properties"],
                ObjectPattern: ["properties"],
                Program: ["body"],
                Property: ["key", "value"],
                ReturnStatement: ["argument"],
                SequenceExpression: ["expressions"],
                SwitchStatement: ["discriminant", "cases"],
                SwitchCase: ["test", "consequent"],
                ThisExpression: [],
                ThrowStatement: ["argument"],
                TryStatement: ["block", "handlers", "finalizer"],
                UnaryExpression: ["argument"],
                UpdateExpression: ["argument"],
                VariableDeclaration: ["declarations"],
                VariableDeclarator: ["id", "init"],
                WhileStatement: ["test", "body"],
                WithStatement: ["object", "body"],
                YieldExpression: ["argument"]
            }, V = {
                Break: 1,
                Skip: 2
            }, t.version = "0.0.15", t.generate = H, t.traverse = B, t.attachComments = q
        }, this)
    }
}), montageDefine("4401746", "estraverse", {
    dependencies: [],
    factory: function(e, t, n) {
        (function(e) {
            "use strict";
            typeof define == "function" && define.amd ? define(["exports"], e) : typeof t != "undefined" ? e(t) : e(window.estraverse = {})
        })(function(e) {
            "use strict";

            function t(e, t) {
                var n, a, f, l, c, h, p, d, v, m = {};
                n = [e], a = [null];
                while (n.length) {
                    f = n.pop(), l = f.type;
                    if (f === m) {
                        f = a.pop(), t.leave ? c = t.leave(f, a[a.length - 1]) : c = undefined;
                        if (c === s.Break) return
                    } else if (f) {
                        u.hasOwnProperty(l) && (f = f.node, l = u[l]), t.enter ? c = t.enter(f, a[a.length - 1]) : c = undefined;
                        if (c === s.Break) return;
                        n.push(m), a.push(f);
                        if (c !== s.Skip) {
                            d = o[l], h = d.length;
                            while ((h -= 1) >= 0) {
                                v = f[d[h]];
                                if (v) if (i(v)) {
                                    p = v.length;
                                    while ((p -= 1) >= 0) v[p] && (l === r.ObjectExpression && "properties" === d[h] && null == d[h].type ? n.push({
                                        type: "PropertyWrapper",
                                        node: v[p]
                                    }) : n.push(v[p]))
                                } else n.push(v)
                            }
                        }
                    }
                }
            }
            function n(e, t) {
                function n(e) {
                    d = e
                }
                var a, f, l, c, h, p, d, v, m, g, y, b = {}, w;
                w = {
                    top: e
                }, p = [e, w, "top"], a = [p], f = [p];
                while (a.length) {
                    p = a.pop();
                    if (p === b) {
                        p = f.pop(), d = undefined, t.leave && (l = p[0], h = t.leave(p[0], f[f.length - 1][0], n), h !== undefined && (l = h), p[1][p[2]] = l);
                        if (d === s.Break) return w.top
                    } else if (p[0]) {
                        d = undefined, l = p[0], c = l.type, u.hasOwnProperty(c) && (p[0] = l = l.node, c = u[c]), t.enter && (h = t.enter(p[0], f[f.length - 1][0], n), h !== undefined && (l = h), p[1][p[2]] = l, p[0] = l);
                        if (d === s.Break) return w.top;
                        if (p[0]) {
                            a.push(b), f.push(p);
                            if (d !== s.Skip) {
                                g = o[c], v = g.length;
                                while ((v -= 1) >= 0) {
                                    y = l[g[v]];
                                    if (y) if (i(y)) {
                                        m = y.length;
                                        while ((m -= 1) >= 0) y[m] && (c === r.ObjectExpression && "properties" === g[v] && null == g[v].type ? a.push([{
                                            type: "PropertyWrapper",
                                            node: y[m]
                                        },
                                        y, m]) : a.push([y[m], y, m]))
                                    } else a.push([y, l, g[v]])
                                }
                            }
                        }
                    }
                }
                return w.top
            }
            var r, i, s, o, u;
            r = {
                AssignmentExpression: "AssignmentExpression",
                ArrayExpression: "ArrayExpression",
                BlockStatement: "BlockStatement",
                BinaryExpression: "BinaryExpression",
                BreakStatement: "BreakStatement",
                CallExpression: "CallExpression",
                CatchClause: "CatchClause",
                ConditionalExpression: "ConditionalExpression",
                ContinueStatement: "ContinueStatement",
                DebuggerStatement: "DebuggerStatement",
                DirectiveStatement: "DirectiveStatement",
                DoWhileStatement: "DoWhileStatement",
                EmptyStatement: "EmptyStatement",
                ExpressionStatement: "ExpressionStatement",
                ForStatement: "ForStatement",
                ForInStatement: "ForInStatement",
                FunctionDeclaration: "FunctionDeclaration",
                FunctionExpression: "FunctionExpression",
                Identifier: "Identifier",
                IfStatement: "IfStatement",
                Literal: "Literal",
                LabeledStatement: "LabeledStatement",
                LogicalExpression: "LogicalExpression",
                MemberExpression: "MemberExpression",
                NewExpression: "NewExpression",
                ObjectExpression: "ObjectExpression",
                Program: "Program",
                Property: "Property",
                ReturnStatement: "ReturnStatement",
                SequenceExpression: "SequenceExpression",
                SwitchStatement: "SwitchStatement",
                SwitchCase: "SwitchCase",
                ThisExpression: "ThisExpression",
                ThrowStatement: "ThrowStatement",
                TryStatement: "TryStatement",
                UnaryExpression: "UnaryExpression",
                UpdateExpression: "UpdateExpression",
                VariableDeclaration: "VariableDeclaration",
                VariableDeclarator: "VariableDeclarator",
                WhileStatement: "WhileStatement",
                WithStatement: "WithStatement"
            }, i = Array.isArray, i || (i = function(e) {
                return Object.prototype.toString.call(e) === "[object Array]"
            }), o = {
                AssignmentExpression: ["left", "right"],
                ArrayExpression: ["elements"],
                BlockStatement: ["body"],
                BinaryExpression: ["left", "right"],
                BreakStatement: ["label"],
                CallExpression: ["callee", "arguments"],
                CatchClause: ["param", "body"],
                ConditionalExpression: ["test", "consequent", "alternate"],
                ContinueStatement: ["label"],
                DebuggerStatement: [],
                DirectiveStatement: [],
                DoWhileStatement: ["body", "test"],
                EmptyStatement: [],
                ExpressionStatement: ["expression"],
                ForStatement: ["init", "test", "update", "body"],
                ForInStatement: ["left", "right", "body"],
                FunctionDeclaration: ["id", "params", "body"],
                FunctionExpression: ["id", "params", "body"],
                Identifier: [],
                IfStatement: ["test", "consequent", "alternate"],
                Literal: [],
                LabeledStatement: ["label", "body"],
                LogicalExpression: ["left", "right"],
                MemberExpression: ["object", "property"],
                NewExpression: ["callee", "arguments"],
                ObjectExpression: ["properties"],
                Program: ["body"],
                Property: ["key", "value"],
                ReturnStatement: ["argument"],
                SequenceExpression: ["expressions"],
                SwitchStatement: ["discriminant", "cases"],
                SwitchCase: ["test", "consequent"],
                ThisExpression: [],
                ThrowStatement: ["argument"],
                TryStatement: ["block", "handlers", "finalizer"],
                UnaryExpression: ["argument"],
                UpdateExpression: ["argument"],
                VariableDeclaration: ["declarations"],
                VariableDeclarator: ["id", "init"],
                WhileStatement: ["test", "body"],
                WithStatement: ["object", "body"]
            }, s = {
                Break: 1,
                Skip: 2
            }, u = {
                PropertyWrapper: "Property"
            }, e.version = "0.0.4", e.Syntax = r, e.traverse = t, e.replace = n, e.VisitorKeys = o, e.VisitorOption = s
        })
    }
}), montageDefine("7d54410", "escope", {
    dependencies: ["estraverse"],
    factory: function(e, t, n) {
        (function(n, r) {
            "use strict";

            function i(e, t) {
                var n, r, i, s;
                i = e.split(".");
                for (n = 0, r = i.length; n < r; ++n) s = i[n], t.hasOwnProperty(s) ? t = t[s] : t = t[s] = {};
                return t
            }
            typeof define == "function" && define.amd ? define("escope", ["exports", "estraverse"], function(e, t) {
                n(e, r, t)
            }) : typeof t != "undefined" ? n(t, r, e("estraverse")) : n(i("escope", r), r, r.estraverse)
        })(function(e, t, n) {
            "use strict";

            function r(e, t) {
                if (!e) throw new Error(t)
            }
            function i() {
                throw new Error("Unreachable point. logically broken.")
            }
            function s(e, t, n, r) {
                this.identifier = e, this.from = t, this.tainted = !1, this.resolved = null, this.flag = n, this.isWrite() && (this.writeExpr = r)
            }
            function o(e, t) {
                this.name = e, this.identifiers = [], this.references = [], this.defs = [], this.tainted = !1, this.stack = !0, this.scope = t
            }
            function u(e, t) {
                var n;
                this.type = e.type === l.CatchClause ? "catch" : e.type === l.WithStatement ? "with" : e.type === l.Program ? "global" : "function", this.set = new c, this.taints = new c, this.dynamic = this.type === "global" || this.type === "with", this.block = e, this.through = [], this.variables = [], this.references = [], this.left = [], this.variableScope = this.type === "global" || this.type === "function" ? this : h.variableScope, this.functionExpressionScope = !1, this.directCallToEvalScope = !1, this.thisFound = !1, t.naming ? (this.__define(e.id, {
                    type: o.FunctionName,
                    name: e.id,
                    node: e
                }), this.functionExpressionScope = !0) : (this.type === "function" && (n = new o("arguments", this), this.taints.set("arguments", !0), this.set.set("arguments", n), this.variables.push(n)), e.type === l.FunctionExpression && e.id && new u(e, {
                    naming: !0
                })), this.upper = h, h = this, p.push(this)
            }
            function a(e) {
                this.scopes = e, this.attached = !1
            }
            function f(e) {
                return p = [], h = null, n.traverse(e, {
                    enter: function(e, t) {
                        var n, r, i;
                        u.isScopeRequired(e) && new u(e, {});
                        switch (e.type) {
                            case l.AssignmentExpression:
                                h.__referencing(e.left, s.WRITE, e.right), h.__referencing(e.right);
                                break;
                            case l.ArrayExpression:
                                for (n = 0, r = e.elements.length; n < r; ++n) h.__referencing(e.elements[n]);
                                break;
                            case l.BlockStatement:
                                break;
                            case l.BinaryExpression:
                                h.__referencing(e.left), h.__referencing(e.right);
                                break;
                            case l.BreakStatement:
                                break;
                            case l.CallExpression:
                                h.__referencing(e.callee);
                                for (n = 0, r = e.arguments.length; n < r; ++n) h.__referencing(e.arguments[n]);
                                e.callee.type === l.Identifier && e.callee.name === "eval" && h.variableScope.__detectEval();
                                break;
                            case l.CatchClause:
                                h.__define(e.param, {
                                    type: o.CatchClause,
                                    name: e.param,
                                    node: e
                                });
                                break;
                            case l.ConditionalExpression:
                                h.__referencing(e.test), h.__referencing(e.consequent), h.__referencing(e.alternate);
                                break;
                            case l.ContinueStatement:
                                break;
                            case l.DirectiveStatement:
                                break;
                            case l.DoWhileStatement:
                                h.__referencing(e.test);
                                break;
                            case l.DebuggerStatement:
                                break;
                            case l.EmptyStatement:
                                break;
                            case l.ExpressionStatement:
                                h.__referencing(e.expression);
                                break;
                            case l.ForStatement:
                                h.__referencing(e.init), h.__referencing(e.test), h.__referencing(e.update);
                                break;
                            case l.ForInStatement:
                                e.left.type === l.VariableDeclaration ? h.__referencing(e.left.declarations[0].id, s.WRITE, null) : h.__referencing(e.left, s.WRITE, null), h.__referencing(e.right);
                                break;
                            case l.FunctionDeclaration:
                                h.upper.__define(e.id, {
                                    type: o.FunctionName,
                                    name: e.id,
                                    node: e
                                });
                                for (n = 0, r = e.params.length; n < r; ++n) h.__define(e.params[n], {
                                    type: o.Parameter,
                                    name: e.params[n],
                                    node: e,
                                    index: n
                                });
                                break;
                            case l.FunctionExpression:
                                for (n = 0, r = e.params.length; n < r; ++n) h.__define(e.params[n], {
                                    type: o.Parameter,
                                    name: e.params[n],
                                    node: e,
                                    index: n
                                });
                                break;
                            case l.Identifier:
                                break;
                            case l.IfStatement:
                                h.__referencing(e.test);
                                break;
                            case l.Literal:
                                break;
                            case l.LabeledStatement:
                                break;
                            case l.LogicalExpression:
                                h.__referencing(e.left), h.__referencing(e.right);
                                break;
                            case l.MemberExpression:
                                h.__referencing(e.object), e.computed && h.__referencing(e.property);
                                break;
                            case l.NewExpression:
                                h.__referencing(e.callee);
                                for (n = 0, r = e.arguments.length; n < r; ++n) h.__referencing(e.arguments[n]);
                                break;
                            case l.ObjectExpression:
                                break;
                            case l.Program:
                                break;
                            case l.Property:
                                h.__referencing(e.value);
                                break;
                            case l.ReturnStatement:
                                h.__referencing(e.argument);
                                break;
                            case l.SequenceExpression:
                                for (n = 0, r = e.expressions.length; n < r; ++n) h.__referencing(e.expressions[n]);
                                break;
                            case l.SwitchStatement:
                                h.__referencing(e.discriminant);
                                break;
                            case l.SwitchCase:
                                h.__referencing(e.test);
                                break;
                            case l.ThisExpression:
                                h.variableScope.__detectThis();
                                break;
                            case l.ThrowStatement:
                                h.__referencing(e.argument);
                                break;
                            case l.TryStatement:
                                break;
                            case l.UnaryExpression:
                                h.__referencing(e.argument);
                                break;
                            case l.UpdateExpression:
                                h.__referencing(e.argument, s.RW, null);
                                break;
                            case l.VariableDeclaration:
                                for (n = 0, r = e.declarations.length; n < r; ++n) i = e.declarations[n], h.variableScope.__define(i.id, {
                                    type: o.Variable,
                                    name: i.id,
                                    node: i,
                                    index: n,
                                    parent: e
                                }), i.init && (h.__referencing(i.id, s.WRITE, i.init), h.__referencing(i.init));
                                break;
                            case l.VariableDeclarator:
                                break;
                            case l.WhileStatement:
                                h.__referencing(e.test);
                                break;
                            case l.WithStatement:
                                h.upper.__referencing(e.object)
                        }
                    },
                    leave: function(e) {
                        while (h && e === h.block) h.__close()
                    }
                }), r(h === null), new a(p)
            }
            var n, l, c, h, p;
            l = n.Syntax, typeof t.Map != "undefined" ? c = t.Map : (c = function() {
                this.__data = {}
            }, c.prototype.get = function(e) {
                return e = "$" + e, this.__data.hasOwnProperty(e) ? this.__data[e] : undefined
            }, c.prototype.has = function(e) {
                return e = "$" + e, this.__data.hasOwnProperty(e)
            }, c.prototype.set = function(e, t) {
                e = "$" + e, this.__data[e] = t
            }, c.prototype["delete"] = function(e) {
                return e = "$" + e, delete this.__data[e]
            }), s.READ = 1, s.WRITE = 2, s.RW = 3, s.prototype.isStatic = function() {
                return !this.tainted && this.resolved && this.resolved.scope.isStatic()
            }, s.prototype.isWrite = function() {
                return this.flag & s.WRITE
            }, s.prototype.isRead = function() {
                return this.flag & s.READ
            }, s.prototype.isReadOnly = function() {
                return this.flag === s.READ
            }, s.prototype.isWriteOnly = function() {
                return this.flag === s.WRITE
            }, s.prototype.isReadWrite = function() {
                return this.flag === s.RW
            }, o.CatchClause = "CatchClause", o.Parameter = "Parameter", o.FunctionName = "FunctionName", o.Variable = "Variable", u.prototype.__close = function() {
                var e, t, n, r, i;
                if (!this.dynamic) for (e = 0, t = this.left.length; e < t; ++e) n = this.left[e], this.__resolve(n) || this.__delegateToUpperScope(n);
                else if (this.type === "with") for (e = 0, t = this.left.length; e < t; ++e) n = this.left[e], n.tainted = !0, this.__delegateToUpperScope(n);
                else for (e = 0, t = this.left.length; e < t; ++e) {
                    n = this.left[e], i = this;
                    do i.through.push(n), i = i.upper;
                    while (i)
                }
                this.left = null, h = this.upper
            }, u.prototype.__resolve = function(e) {
                var t, n, r, i;
                return i = e.identifier.name, this.set.has(i) ? (r = this.set.get(i), r.references.push(e), r.stack = r.stack && e.from.variableScope === this.variableScope, e.tainted && (r.tainted = !0, this.taints.set(r.name, !0)), e.resolved = r, !0) : !1
            }, u.prototype.__delegateToUpperScope = function(e) {
                r(this.upper, "upper should be here"), this.upper.left.push(e), this.through.push(e)
            }, u.prototype.__define = function(e, t) {
                var n, r;
                e && e.type === l.Identifier && (n = e.name, this.set.has(n) ? (r = this.set.get(n), r.identifiers.push(e), r.defs.push(t)) : (r = new o(n, this), r.identifiers.push(e), r.defs.push(t), this.set.set(n, r), this.variables.push(r)))
            }, u.prototype.__referencing = function(e, t, n) {
                var r;
                e && e.type === l.Identifier && (r = new s(e, this, t || s.READ, n), this.references.push(r), this.left.push(r))
            }, u.prototype.__detectEval = function() {
                var e;
                e = this, this.directCallToEvalScope = !0;
                do e.dynamic = !0, e = e.upper;
                while (e)
            }, u.prototype.__detectThis = function() {
                this.thisFound = !0
            }, u.prototype.__isClosed = function() {
                return this.left === null
            }, u.prototype.resolve = function(e) {
                var t, n, s;
                r(this.__isClosed(), "scope should be closed"), r(e.type === l.Identifier, "target should be identifier");
                for (n = 0, s = this.references.length; n < s; ++n) {
                    t = this.references[n];
                    if (t.identifier === e) return t
                }
                i()
            }, u.prototype.isStatic = function() {
                return !this.dynamic
            }, u.prototype.isArgumentsMaterialized = function() {
                var e;
                return this.type !== "function" ? !0 : this.isStatic() ? (e = this.set.get("arguments"), r(e, "always have arguments variable"), e.tainted || e.references.length !== 0) : !0
            }, u.prototype.isThisMaterialized = function() {
                return this.type !== "function" ? !0 : this.isStatic() ? this.thisFound : !0
            }, u.mangledName = "__$escope$__", u.prototype.attach = function() {
                this.functionExpressionScope || (this.block[u.mangledName] = this)
            }, u.prototype.detach = function() {
                this.functionExpressionScope || delete this.block[u.mangledName]
            }, u.prototype.isUsedName = function(e) {
                if (this.set.has(e)) return !0;
                for (var t = 0, n = this.through.length; t < n; ++t) if (this.through[t].identifier.name === e) return !0;
                return !1
            }, a.prototype.__get = function(e) {
                var t, n, r;
                if (this.attached) return e[u.mangledName] || null;
                if (u.isScopeRequired(e)) for (t = 0, n = this.scopes.length; t < n; ++t) {
                    r = this.scopes[t];
                    if (!r.functionExpressionScope && r.block === e) return r
                }
                return null
            }, a.prototype.acquire = function(e) {
                return this.__get(e)
            }, a.prototype.release = function(e) {
                var t = this.__get(e);
                if (t) {
                    t = t.upper;
                    while (t) {
                        if (!t.functionExpressionScope) return t;
                        t = t.upper
                    }
                }
                return null
            }, a.prototype.attach = function() {
                var e, t;
                for (e = 0, t = this.scopes.length; e < t; ++e) this.scopes[e].attach();
                this.attached = !0
            }, a.prototype.detach = function() {
                var e, t;
                for (e = 0, t = this.scopes.length; e < t; ++e) this.scopes[e].detach();
                this.attached = !1
            }, u.isScopeRequired = function(e) {
                return u.isVariableScopeRequired(e) || e.type === l.WithStatement || e.type === l.CatchClause
            }, u.isVariableScopeRequired = function(e) {
                return e.type === l.Program || e.type === l.FunctionExpression || e.type === l.FunctionDeclaration
            }, e.version = "0.0.13-dev", e.Reference = s, e.Variable = o, e.Scope = u, e.ScopeManager = a, e.analyze = f
        }, this)
    }
}), montageDefine("0bf699f", "lib/source-map", {
    dependencies: ["./source-map/source-map-generator", "./source-map/source-map-consumer", "./source-map/source-node"],
    factory: function(e, t, n) {
        t.SourceMapGenerator = e("./source-map/source-map-generator").SourceMapGenerator, t.SourceMapConsumer = e("./source-map/source-map-consumer").SourceMapConsumer, t.SourceNode = e("./source-map/source-node").SourceNode
    }
}), montageDefine("0bf699f", "lib/source-map/source-map-generator", {
    dependencies: ["amdefine", "./base64-vlq", "./util", "./array-set"],
    factory: function(e, t, n) {
        if (typeof r != "function") var r = e("amdefine")(n);
        r(function(e, t, n) {
            function r(e) {
                this._file = s.getArg(e, "file"), this._sourceRoot = s.getArg(e, "sourceRoot", null), this._sources = new o, this._names = new o, this._mappings = []
            }
            var i = e("./base64-vlq"),
                s = e("./util"),
                o = e("./array-set").ArraySet;
            r.prototype._version = 3, r.prototype.addMapping = function(e) {
                var t = s.getArg(e, "generated"),
                    n = s.getArg(e, "original", null),
                    r = s.getArg(e, "source", null),
                    i = s.getArg(e, "name", null);
                this._validateMapping(t, n, r, i), r && !this._sources.has(r) && this._sources.add(r), i && !this._names.has(i) && this._names.add(i), this._mappings.push({
                    generated: t,
                    original: n,
                    source: r,
                    name: i
                })
            }, r.prototype._validateMapping = function(e, t, n, r) {
                if (e && "line" in e && "column" in e && e.line > 0 && e.column >= 0 && !t && !n && !r) return;
                if (e && "line" in e && "column" in e && t && "line" in t && "column" in t && e.line > 0 && e.column >= 0 && t.line > 0 && t.column >= 0 && n) return;
                throw new Error("Invalid mapping.")
            }, r.prototype._serializeMappings = function() {
                var e = 0,
                    t = 1,
                    n = 0,
                    r = 0,
                    s = 0,
                    o = 0,
                    u = "",
                    a;
                this._mappings.sort(function(e, t) {
                    var n = e.generated.line - t.generated.line;
                    return n === 0 ? e.generated.column - t.generated.column : n
                });
                for (var f = 0, l = this._mappings.length; f < l; f++) {
                    a = this._mappings[f];
                    if (a.generated.line !== t) {
                        e = 0;
                        while (a.generated.line !== t) u += ";", t++
                    } else f > 0 && (u += ",");
                    u += i.encode(a.generated.column - e), e = a.generated.column, a.source && a.original && (u += i.encode(this._sources.indexOf(a.source) - o), o = this._sources.indexOf(a.source), u += i.encode(a.original.line - 1 - r), r = a.original.line - 1, u += i.encode(a.original.column - n), n = a.original.column, a.name && (u += i.encode(this._names.indexOf(a.name) - s), s = this._names.indexOf(a.name)))
                }
                return u
            }, r.prototype.toJSON = function() {
                var e = {
                    version: this._version,
                    file: this._file,
                    sources: this._sources.toArray(),
                    names: this._names.toArray(),
                    mappings: this._serializeMappings()
                };
                return this._sourceRoot && (e.sourceRoot = this._sourceRoot), e
            }, r.prototype.toString = function() {
                return JSON.stringify(this)
            }, t.SourceMapGenerator = r
        })
    }
}), montageDefine("0bf699f", "lib/source-map/source-map-consumer", {
    dependencies: ["amdefine", "./util", "./binary-search", "./array-set", "./base64-vlq"],
    factory: function(e, t, n) {
        if (typeof r != "function") var r = e("amdefine")(n);
        r(function(e, t, n) {
            function r(e) {
                var t = e;
                typeof e == "string" && (t = JSON.parse(e.replace(/^\)\]\}'/, "")));
                var n = i.getArg(t, "version"),
                    r = i.getArg(t, "sources"),
                    s = i.getArg(t, "names"),
                    u = i.getArg(t, "sourceRoot", null),
                    a = i.getArg(t, "mappings"),
                    f = i.getArg(t, "file");
                if (n !== this._version) throw new Error("Unsupported version: " + n);
                this._names = o.fromArray(s), this._sources = o.fromArray(r), this._sourceRoot = u, this.file = f, this._generatedMappings = [], this._originalMappings = [], this._parseMappings(a, u)
            }
            var i = e("./util"),
                s = e("./binary-search"),
                o = e("./array-set").ArraySet,
                u = e("./base64-vlq");
            r.prototype._version = 3, Object.defineProperty(r.prototype, "sources", {
                get: function() {
                    return this._sources.toArray().map(function(e) {
                        return this._sourceRoot ? i.join(this._sourceRoot, e) : e
                    }, this)
                }
            }), r.prototype._parseMappings = function(e, t) {
                var n = 1,
                    r = 0,
                    s = 0,
                    o = 0,
                    a = 0,
                    f = 0,
                    l = /^[,;]/,
                    c = e,
                    h, p;
                while (c.length > 0) if (c.charAt(0) === ";") n++, c = c.slice(1), r = 0;
                else if (c.charAt(0) === ",") c = c.slice(1);
                else {
                    h = {}, h.generatedLine = n, p = u.decode(c), h.generatedColumn = r + p.value, r = h.generatedColumn, c = p.rest;
                    if (c.length > 0 && !l.test(c.charAt(0))) {
                        p = u.decode(c), t ? h.source = i.join(t, this._sources.at(a + p.value)) : h.source = this._sources.at(a + p.value), a += p.value, c = p.rest;
                        if (c.length === 0 || l.test(c.charAt(0))) throw new Error("Found a source, but no line and column");
                        p = u.decode(c), h.originalLine = s + p.value, s = h.originalLine, h.originalLine += 1, c = p.rest;
                        if (c.length === 0 || l.test(c.charAt(0))) throw new Error("Found a source and line, but no column");
                        p = u.decode(c), h.originalColumn = o + p.value, o = h.originalColumn, c = p.rest, c.length > 0 && !l.test(c.charAt(0)) && (p = u.decode(c), h.name = this._names.at(f + p.value), f += p.value, c = p.rest)
                    }
                    this._generatedMappings.push(h), this._originalMappings.push(h)
                }
                this._originalMappings.sort(this._compareOriginalPositions)
            }, r.prototype._compareOriginalPositions = function(e, t) {
                if (e.source > t.source) return 1;
                if (e.source < t.source) return -1;
                var n = e.originalLine - t.originalLine;
                return n === 0 ? e.originalColumn - t.originalColumn : n
            }, r.prototype._compareGeneratedPositions = function(e, t) {
                var n = e.generatedLine - t.generatedLine;
                return n === 0 ? e.generatedColumn - t.generatedColumn : n
            }, r.prototype._findMapping = function(e, t, n, r, i) {
                if (e[n] <= 0) throw new TypeError("Line must be greater than or equal to 1, got " + e[n]);
                if (e[r] < 0) throw new TypeError("Column must be greater than or equal to 0, got " + e[r]);
                return s.search(e, t, i)
            }, r.prototype.originalPositionFor = function(e) {
                var t = {
                    generatedLine: i.getArg(e, "line"),
                    generatedColumn: i.getArg(e, "column")
                }, n = this._findMapping(t, this._generatedMappings, "generatedLine", "generatedColumn", this._compareGeneratedPositions);
                return n ? {
                    source: i.getArg(n, "source", null),
                    line: i.getArg(n, "originalLine", null),
                    column: i.getArg(n, "originalColumn", null),
                    name: i.getArg(n, "name", null)
                } : {
                    source: null,
                    line: null,
                    column: null,
                    name: null
                }
            }, r.prototype.generatedPositionFor = function(e) {
                var t = {
                    source: i.getArg(e, "source"),
                    originalLine: i.getArg(e, "line"),
                    originalColumn: i.getArg(e, "column")
                }, n = this._findMapping(t, this._originalMappings, "originalLine", "originalColumn", this._compareOriginalPositions);
                return n ? {
                    line: i.getArg(n, "generatedLine", null),
                    column: i.getArg(n, "generatedColumn", null)
                } : {
                    line: null,
                    column: null
                }
            }, r.GENERATED_ORDER = 1, r.ORIGINAL_ORDER = 2, r.prototype.eachMapping = function(e, t, n) {
                var i = t || null,
                    s = n || r.GENERATED_ORDER,
                    o;
                switch (s) {
                    case r.GENERATED_ORDER:
                        o = this._generatedMappings;
                        break;
                    case r.ORIGINAL_ORDER:
                        o = this._originalMappings;
                        break;
                    default:
                        throw new Error("Unknown order of iteration.")
                }
                o.forEach(e, i)
            }, t.SourceMapConsumer = r
        })
    }
}), montageDefine("0bf699f", "lib/source-map/source-node", {
    dependencies: ["amdefine", "./source-map-generator"],
    factory: function(e, t, n) {
        if (typeof r != "function") var r = e("amdefine")(n);
        r(function(e, t, n) {
            function r(e, t, n, r) {
                this.children = [], this.line = e, this.column = t, this.source = n, r != null && this.add(r)
            }
            var i = e("./source-map-generator").SourceMapGenerator;
            r.prototype.add = function(e) {
                if (Array.isArray(e)) e.forEach(function(e) {
                    this.add(e)
                }, this);
                else {
                    if (!(e instanceof r || typeof e == "string")) throw new TypeError("Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + e);
                    e && this.children.push(e)
                }
                return this
            }, r.prototype.prepend = function(e) {
                if (Array.isArray(e)) for (var t = e.length - 1; t >= 0; t--) this.prepend(e[t]);
                else {
                    if (!(e instanceof r || typeof e == "string")) throw new TypeError("Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + e);
                    this.children.unshift(e)
                }
                return this
            }, r.prototype.walk = function(e) {
                this.children.forEach(function(t) {
                    t instanceof r ? t.walk(e) : t !== "" && e(t, {
                        source: this.source,
                        line: this.line,
                        column: this.column
                    })
                }, this)
            }, r.prototype.join = function(e) {
                var t, n, r = this.children.length;
                if (r > 0) {
                    t = [];
                    for (n = 0; n < r - 1; n++) t.push(this.children[n]), t.push(e);
                    t.push(this.children[n]), this.children = t
                }
                return this
            }, r.prototype.replaceRight = function(e, t) {
                var n = this.children[this.children.length - 1];
                return n instanceof r ? n.replaceRight(e, t) : typeof n == "string" ? this.children[this.children.length - 1] = n.replace(e, t) : this.children.push("".replace(e, t)), this
            }, r.prototype.toString = function() {
                var e = "";
                return this.walk(function(t) {
                    e += t
                }), e
            }, r.prototype.toStringWithSourceMap = function(e) {
                var t = {
                    code: "",
                    line: 1,
                    column: 0
                }, n = new i(e);
                return this.walk(function(e, r) {
                    t.code += e, r.source != null && r.line != null && r.column != null && n.addMapping({
                        source: r.source,
                        original: {
                            line: r.line,
                            column: r.column
                        },
                        generated: {
                            line: t.line,
                            column: t.column
                        }
                    }), e.split("").forEach(function(e) {
                        e === "\n" ? (t.line++, t.column = 0) : t.column++
                    })
                }), {
                    code: t.code,
                    map: n
                }
            }, t.SourceNode = r
        })
    }
}), montageDefine("0bf699f", "lib/source-map/base64-vlq", {
    dependencies: ["amdefine", "./base64"],
    factory: function(e, t, n) {
        if (typeof r != "function") var r = e("amdefine")(n);
        r(function(e, t, n) {
            function r(e) {
                return e < 0 ? (-e << 1) + 1 : (e << 1) + 0
            }
            function i(e) {
                var t = (e & 1) === 1,
                    n = e >> 1;
                return t ? -n : n
            }
            var s = e("./base64"),
                o = 5,
                u = 1 << o,
                a = u - 1,
                f = u;
            t.encode = function(e) {
                var t = "",
                    n, i = r(e);
                do n = i & a, i >>>= o, i > 0 && (n |= f), t += s.encode(n);
                while (i > 0);
                return t
            }, t.decode = function(e) {
                var t = 0,
                    n = e.length,
                    r = 0,
                    u = 0,
                    l, c;
                do {
                    if (t >= n) throw new Error("Expected more digits in base 64 VLQ value.");
                    c = s.decode(e.charAt(t++)), l = !! (c & f), c &= a, r += c << u, u += o
                } while (l);
                return {
                    value: i(r),
                    rest: e.slice(t)
                }
            }
        })
    }
}), montageDefine("0bf699f", "lib/source-map/util", {
    dependencies: ["amdefine"],
    factory: function(e, t, n) {
        if (typeof r != "function") var r = e("amdefine")(n);
        r(function(e, t, n) {
            function r(e, t, n) {
                if (t in e) return e[t];
                if (arguments.length === 3) return n;
                throw new Error('"' + t + '" is a required argument.')
            }
            function i(e, t) {
                return t.charAt(0) === "/" ? t : e.replace(/\/*$/, "") + "/" + t
            }
            t.getArg = r, t.join = i
        })
    }
}), montageDefine("0bf699f", "lib/source-map/array-set", {
    dependencies: ["amdefine"],
    factory: function(e, t, n) {
        if (typeof r != "function") var r = e("amdefine")(n);
        r(function(e, t, n) {
            function r() {
                this._array = [], this._set = {}
            }
            r.fromArray = function(e) {
                var t = new r;
                for (var n = 0, i = e.length; n < i; n++) t.add(e[n]);
                return t
            }, r.prototype._toSetString = function(e) {
                return "$" + e
            }, r.prototype.add = function(e) {
                if (this.has(e)) return;
                var t = this._array.length;
                this._array.push(e), this._set[this._toSetString(e)] = t
            }, r.prototype.has = function(e) {
                return Object.prototype.hasOwnProperty.call(this._set, this._toSetString(e))
            }, r.prototype.indexOf = function(e) {
                if (this.has(e)) return this._set[this._toSetString(e)];
                throw new Error('"' + e + '" is not in the set.')
            }, r.prototype.at = function(e) {
                if (e >= 0 && e < this._array.length) return this._array[e];
                throw new Error("No element indexed by " + e)
            }, r.prototype.toArray = function() {
                return this._array.slice()
            }, t.ArraySet = r
        })
    }
}), montageDefine("0bf699f", "lib/source-map/binary-search", {
    dependencies: ["amdefine"],
    factory: function(e, t, n) {
        if (typeof r != "function") var r = e("amdefine")(n);
        r(function(e, t, n) {
            function r(e, t, n, i, s) {
                var o = Math.floor((t - e) / 2) + e,
                    u = s(n, i[o]);
                return u === 0 ? i[o] : u > 0 ? t - o > 1 ? r(o, t, n, i, s) : i[o] : o - e > 1 ? r(e, o, n, i, s) : e < 0 ? null : i[e]
            }
            t.search = function(e, t, n) {
                return t.length > 0 ? r(-1, t.length, e, t, n) : null
            }
        })
    }
}), montageDefine("0bf699f", "lib/source-map/base64", {
    dependencies: ["amdefine"],
    factory: function(e, t, n) {
        if (typeof r != "function") var r = e("amdefine")(n);
        r(function(e, t, n) {
            var r = {}, i = {};
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("").forEach(function(e, t) {
                r[e] = t, i[t] = e
            }), t.encode = function(e) {
                if (e in i) return i[e];
                throw new TypeError("Must be between 0 and 63: " + e)
            }, t.decode = function(e) {
                if (e in r) return r[e];
                throw new TypeError("Not a valid base 64 digit: " + e)
            }
        })
    }
})
