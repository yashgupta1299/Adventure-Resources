// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (modules, entry, mainEntry, parcelRequireName, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      return res === false ? {} : newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"hFizm":[function(require,module,exports) {
var HMR_HOST = null;
var HMR_PORT = 1234;
var HMR_SECURE = false;
var HMR_ENV_HASH = "6711683c4eaf4fa2";
module.bundle.HMR_BUNDLE_ID = "6fb421bbaf4698c8";
"use strict";
/* global HMR_HOST, HMR_PORT, HMR_ENV_HASH, HMR_SECURE, chrome, browser, globalThis, __parcel__import__, __parcel__importScripts__, ServiceWorkerGlobalScope */ /*::
import type {
  HMRAsset,
  HMRMessage,
} from '@parcel/reporter-dev-server/src/HMRServer.js';
interface ParcelRequire {
  (string): mixed;
  cache: {|[string]: ParcelModule|};
  hotData: mixed;
  Module: any;
  parent: ?ParcelRequire;
  isParcelRequire: true;
  modules: {|[string]: [Function, {|[string]: string|}]|};
  HMR_BUNDLE_ID: string;
  root: ParcelRequire;
}
interface ParcelModule {
  hot: {|
    data: mixed,
    accept(cb: (Function) => void): void,
    dispose(cb: (mixed) => void): void,
    // accept(deps: Array<string> | string, cb: (Function) => void): void,
    // decline(): void,
    _acceptCallbacks: Array<(Function) => void>,
    _disposeCallbacks: Array<(mixed) => void>,
  |};
}
interface ExtensionContext {
  runtime: {|
    reload(): void,
    getURL(url: string): string;
    getManifest(): {manifest_version: number, ...};
  |};
}
declare var module: {bundle: ParcelRequire, ...};
declare var HMR_HOST: string;
declare var HMR_PORT: string;
declare var HMR_ENV_HASH: string;
declare var HMR_SECURE: boolean;
declare var chrome: ExtensionContext;
declare var browser: ExtensionContext;
declare var __parcel__import__: (string) => Promise<void>;
declare var __parcel__importScripts__: (string) => Promise<void>;
declare var globalThis: typeof self;
declare var ServiceWorkerGlobalScope: Object;
*/ var OVERLAY_ID = "__parcel__error__overlay__";
var OldModule = module.bundle.Module;
function Module(moduleName) {
    OldModule.call(this, moduleName);
    this.hot = {
        data: module.bundle.hotData,
        _acceptCallbacks: [],
        _disposeCallbacks: [],
        accept: function(fn) {
            this._acceptCallbacks.push(fn || function() {});
        },
        dispose: function(fn) {
            this._disposeCallbacks.push(fn);
        }
    };
    module.bundle.hotData = undefined;
}
module.bundle.Module = Module;
var checkedAssets, acceptedAssets, assetsToAccept /*: Array<[ParcelRequire, string]> */ ;
function getHostname() {
    return HMR_HOST || (location.protocol.indexOf("http") === 0 ? location.hostname : "localhost");
}
function getPort() {
    return HMR_PORT || location.port;
} // eslint-disable-next-line no-redeclare
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== "undefined") {
    var hostname = getHostname();
    var port = getPort();
    var protocol = HMR_SECURE || location.protocol == "https:" && !/localhost|127.0.0.1|0.0.0.0/.test(hostname) ? "wss" : "ws";
    var ws = new WebSocket(protocol + "://" + hostname + (port ? ":" + port : "") + "/"); // Web extension context
    var extCtx = typeof chrome === "undefined" ? typeof browser === "undefined" ? null : browser : chrome; // Safari doesn't support sourceURL in error stacks.
    // eval may also be disabled via CSP, so do a quick check.
    var supportsSourceURL = false;
    try {
        (0, eval)('throw new Error("test"); //# sourceURL=test.js');
    } catch (err) {
        supportsSourceURL = err.stack.includes("test.js");
    } // $FlowFixMe
    ws.onmessage = async function(event) {
        checkedAssets = {} /*: {|[string]: boolean|} */ ;
        acceptedAssets = {} /*: {|[string]: boolean|} */ ;
        assetsToAccept = [];
        var data = JSON.parse(event.data);
        if (data.type === "update") {
            // Remove error overlay if there is one
            if (typeof document !== "undefined") removeErrorOverlay();
            let assets = data.assets.filter((asset)=>asset.envHash === HMR_ENV_HASH); // Handle HMR Update
            let handled = assets.every((asset)=>{
                return asset.type === "css" || asset.type === "js" && hmrAcceptCheck(module.bundle.root, asset.id, asset.depsByBundle);
            });
            if (handled) {
                console.clear(); // Dispatch custom event so other runtimes (e.g React Refresh) are aware.
                if (typeof window !== "undefined" && typeof CustomEvent !== "undefined") window.dispatchEvent(new CustomEvent("parcelhmraccept"));
                await hmrApplyUpdates(assets);
                for(var i = 0; i < assetsToAccept.length; i++){
                    var id = assetsToAccept[i][1];
                    if (!acceptedAssets[id]) hmrAcceptRun(assetsToAccept[i][0], id);
                }
            } else fullReload();
        }
        if (data.type === "error") {
            // Log parcel errors to console
            for (let ansiDiagnostic of data.diagnostics.ansi){
                let stack = ansiDiagnostic.codeframe ? ansiDiagnostic.codeframe : ansiDiagnostic.stack;
                console.error("\uD83D\uDEA8 [parcel]: " + ansiDiagnostic.message + "\n" + stack + "\n\n" + ansiDiagnostic.hints.join("\n"));
            }
            if (typeof document !== "undefined") {
                // Render the fancy html overlay
                removeErrorOverlay();
                var overlay = createErrorOverlay(data.diagnostics.html); // $FlowFixMe
                document.body.appendChild(overlay);
            }
        }
    };
    ws.onerror = function(e) {
        console.error(e.message);
    };
    ws.onclose = function() {
        console.warn("[parcel] \uD83D\uDEA8 Connection to the HMR server was lost");
    };
}
function removeErrorOverlay() {
    var overlay = document.getElementById(OVERLAY_ID);
    if (overlay) {
        overlay.remove();
        console.log("[parcel] ✨ Error resolved");
    }
}
function createErrorOverlay(diagnostics) {
    var overlay = document.createElement("div");
    overlay.id = OVERLAY_ID;
    let errorHTML = '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';
    for (let diagnostic of diagnostics){
        let stack = diagnostic.frames.length ? diagnostic.frames.reduce((p, frame)=>{
            return `${p}
<a href="/__parcel_launch_editor?file=${encodeURIComponent(frame.location)}" style="text-decoration: underline; color: #888" onclick="fetch(this.href); return false">${frame.location}</a>
${frame.code}`;
        }, "") : diagnostic.stack;
        errorHTML += `
      <div>
        <div style="font-size: 18px; font-weight: bold; margin-top: 20px;">
          🚨 ${diagnostic.message}
        </div>
        <pre>${stack}</pre>
        <div>
          ${diagnostic.hints.map((hint)=>"<div>\uD83D\uDCA1 " + hint + "</div>").join("")}
        </div>
        ${diagnostic.documentation ? `<div>📝 <a style="color: violet" href="${diagnostic.documentation}" target="_blank">Learn more</a></div>` : ""}
      </div>
    `;
    }
    errorHTML += "</div>";
    overlay.innerHTML = errorHTML;
    return overlay;
}
function fullReload() {
    if ("reload" in location) location.reload();
    else if (extCtx && extCtx.runtime && extCtx.runtime.reload) extCtx.runtime.reload();
}
function getParents(bundle, id) /*: Array<[ParcelRequire, string]> */ {
    var modules = bundle.modules;
    if (!modules) return [];
    var parents = [];
    var k, d, dep;
    for(k in modules)for(d in modules[k][1]){
        dep = modules[k][1][d];
        if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) parents.push([
            bundle,
            k
        ]);
    }
    if (bundle.parent) parents = parents.concat(getParents(bundle.parent, id));
    return parents;
}
function updateLink(link) {
    var newLink = link.cloneNode();
    newLink.onload = function() {
        if (link.parentNode !== null) // $FlowFixMe
        link.parentNode.removeChild(link);
    };
    newLink.setAttribute("href", link.getAttribute("href").split("?")[0] + "?" + Date.now()); // $FlowFixMe
    link.parentNode.insertBefore(newLink, link.nextSibling);
}
var cssTimeout = null;
function reloadCSS() {
    if (cssTimeout) return;
    cssTimeout = setTimeout(function() {
        var links = document.querySelectorAll('link[rel="stylesheet"]');
        for(var i = 0; i < links.length; i++){
            // $FlowFixMe[incompatible-type]
            var href = links[i].getAttribute("href");
            var hostname = getHostname();
            var servedFromHMRServer = hostname === "localhost" ? new RegExp("^(https?:\\/\\/(0.0.0.0|127.0.0.1)|localhost):" + getPort()).test(href) : href.indexOf(hostname + ":" + getPort());
            var absolute = /^https?:\/\//i.test(href) && href.indexOf(location.origin) !== 0 && !servedFromHMRServer;
            if (!absolute) updateLink(links[i]);
        }
        cssTimeout = null;
    }, 50);
}
function hmrDownload(asset) {
    if (asset.type === "js") {
        if (typeof document !== "undefined") {
            let script = document.createElement("script");
            script.src = asset.url + "?t=" + Date.now();
            if (asset.outputFormat === "esmodule") script.type = "module";
            return new Promise((resolve, reject)=>{
                var _document$head;
                script.onload = ()=>resolve(script);
                script.onerror = reject;
                (_document$head = document.head) === null || _document$head === void 0 || _document$head.appendChild(script);
            });
        } else if (typeof importScripts === "function") {
            // Worker scripts
            if (asset.outputFormat === "esmodule") return import(asset.url + "?t=" + Date.now());
            else return new Promise((resolve, reject)=>{
                try {
                    importScripts(asset.url + "?t=" + Date.now());
                    resolve();
                } catch (err) {
                    reject(err);
                }
            });
        }
    }
}
async function hmrApplyUpdates(assets) {
    global.parcelHotUpdate = Object.create(null);
    let scriptsToRemove;
    try {
        // If sourceURL comments aren't supported in eval, we need to load
        // the update from the dev server over HTTP so that stack traces
        // are correct in errors/logs. This is much slower than eval, so
        // we only do it if needed (currently just Safari).
        // https://bugs.webkit.org/show_bug.cgi?id=137297
        // This path is also taken if a CSP disallows eval.
        if (!supportsSourceURL) {
            let promises = assets.map((asset)=>{
                var _hmrDownload;
                return (_hmrDownload = hmrDownload(asset)) === null || _hmrDownload === void 0 ? void 0 : _hmrDownload.catch((err)=>{
                    // Web extension bugfix for Chromium
                    // https://bugs.chromium.org/p/chromium/issues/detail?id=1255412#c12
                    if (extCtx && extCtx.runtime && extCtx.runtime.getManifest().manifest_version == 3) {
                        if (typeof ServiceWorkerGlobalScope != "undefined" && global instanceof ServiceWorkerGlobalScope) {
                            extCtx.runtime.reload();
                            return;
                        }
                        asset.url = extCtx.runtime.getURL("/__parcel_hmr_proxy__?url=" + encodeURIComponent(asset.url + "?t=" + Date.now()));
                        return hmrDownload(asset);
                    }
                    throw err;
                });
            });
            scriptsToRemove = await Promise.all(promises);
        }
        assets.forEach(function(asset) {
            hmrApply(module.bundle.root, asset);
        });
    } finally{
        delete global.parcelHotUpdate;
        if (scriptsToRemove) scriptsToRemove.forEach((script)=>{
            if (script) {
                var _document$head2;
                (_document$head2 = document.head) === null || _document$head2 === void 0 || _document$head2.removeChild(script);
            }
        });
    }
}
function hmrApply(bundle, asset) {
    var modules = bundle.modules;
    if (!modules) return;
    if (asset.type === "css") reloadCSS();
    else if (asset.type === "js") {
        let deps = asset.depsByBundle[bundle.HMR_BUNDLE_ID];
        if (deps) {
            if (modules[asset.id]) {
                // Remove dependencies that are removed and will become orphaned.
                // This is necessary so that if the asset is added back again, the cache is gone, and we prevent a full page reload.
                let oldDeps = modules[asset.id][1];
                for(let dep in oldDeps)if (!deps[dep] || deps[dep] !== oldDeps[dep]) {
                    let id = oldDeps[dep];
                    let parents = getParents(module.bundle.root, id);
                    if (parents.length === 1) hmrDelete(module.bundle.root, id);
                }
            }
            if (supportsSourceURL) // Global eval. We would use `new Function` here but browser
            // support for source maps is better with eval.
            (0, eval)(asset.output);
             // $FlowFixMe
            let fn = global.parcelHotUpdate[asset.id];
            modules[asset.id] = [
                fn,
                deps
            ];
        } else if (bundle.parent) hmrApply(bundle.parent, asset);
    }
}
function hmrDelete(bundle, id) {
    let modules = bundle.modules;
    if (!modules) return;
    if (modules[id]) {
        // Collect dependencies that will become orphaned when this module is deleted.
        let deps = modules[id][1];
        let orphans = [];
        for(let dep in deps){
            let parents = getParents(module.bundle.root, deps[dep]);
            if (parents.length === 1) orphans.push(deps[dep]);
        } // Delete the module. This must be done before deleting dependencies in case of circular dependencies.
        delete modules[id];
        delete bundle.cache[id]; // Now delete the orphans.
        orphans.forEach((id)=>{
            hmrDelete(module.bundle.root, id);
        });
    } else if (bundle.parent) hmrDelete(bundle.parent, id);
}
function hmrAcceptCheck(bundle, id, depsByBundle) {
    if (hmrAcceptCheckOne(bundle, id, depsByBundle)) return true;
     // Traverse parents breadth first. All possible ancestries must accept the HMR update, or we'll reload.
    let parents = getParents(module.bundle.root, id);
    let accepted = false;
    while(parents.length > 0){
        let v = parents.shift();
        let a = hmrAcceptCheckOne(v[0], v[1], null);
        if (a) // If this parent accepts, stop traversing upward, but still consider siblings.
        accepted = true;
        else {
            // Otherwise, queue the parents in the next level upward.
            let p = getParents(module.bundle.root, v[1]);
            if (p.length === 0) {
                // If there are no parents, then we've reached an entry without accepting. Reload.
                accepted = false;
                break;
            }
            parents.push(...p);
        }
    }
    return accepted;
}
function hmrAcceptCheckOne(bundle, id, depsByBundle) {
    var modules = bundle.modules;
    if (!modules) return;
    if (depsByBundle && !depsByBundle[bundle.HMR_BUNDLE_ID]) {
        // If we reached the root bundle without finding where the asset should go,
        // there's nothing to do. Mark as "accepted" so we don't reload the page.
        if (!bundle.parent) return true;
        return hmrAcceptCheck(bundle.parent, id, depsByBundle);
    }
    if (checkedAssets[id]) return true;
    checkedAssets[id] = true;
    var cached = bundle.cache[id];
    assetsToAccept.push([
        bundle,
        id
    ]);
    if (!cached || cached.hot && cached.hot._acceptCallbacks.length) return true;
}
function hmrAcceptRun(bundle, id) {
    var cached = bundle.cache[id];
    bundle.hotData = {};
    if (cached && cached.hot) cached.hot.data = bundle.hotData;
    if (cached && cached.hot && cached.hot._disposeCallbacks.length) cached.hot._disposeCallbacks.forEach(function(cb) {
        cb(bundle.hotData);
    });
    delete bundle.cache[id];
    bundle(id);
    cached = bundle.cache[id];
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) cached.hot._acceptCallbacks.forEach(function(cb) {
        var assetsToAlsoAccept = cb(function() {
            return getParents(module.bundle.root, id);
        });
        if (assetsToAlsoAccept && assetsToAccept.length) // $FlowFixMe[method-unbinding]
        assetsToAccept.push.apply(assetsToAccept, assetsToAlsoAccept);
    });
    acceptedAssets[id] = true;
}

},{}],"6uYF5":[function(require,module,exports) {
/* eslint-disable */ // import '@babel/polyfill';
var _mapbox = require("./mapbox");
var _authentiication = require("./authentiication");
var _updateSettings = require("./updateSettings");
var _stripe = require("./stripe");
var _alerts = require("./alerts");
// DOM Elements
const mapBox = document.getElementById("map");
const reviewFormCreate = document.getElementById("review--form--create");
const reviewForm = document.getElementById("review--form");
const reviewDeleteBtns = document.querySelectorAll(".review__delete");
const reviewChangeBtns = document.querySelectorAll(".review__edit");
const loginForm = document.querySelector(".form--login");
const signupForm = document.querySelector(".form--signup");
const logoutBtn = document.querySelector(".nav__el--logout");
const dataForm = document.querySelector(".form-user-data");
const passwordForm = document.querySelector(".form-user-password");
const imageChange = document.querySelector(".form__upload");
const bookTourBTN = document.getElementById("book-tour");
const headAlertDataset = document.querySelector("body").dataset.alert;
const queryString = window.location.search;
// DELEGATION
if (mapBox) {
    const locations = JSON.parse(document.getElementById("map").dataset.locations);
    (0, _mapbox.displayMap)(locations);
}
if (reviewFormCreate) reviewFormCreate.addEventListener("submit", (event)=>{
    event.preventDefault();
    const tourid = document.getElementById("review--form--create").dataset.tourid;
    const review = document.getElementById("review-create").value;
    const rating = document.getElementById("rating-create").value;
    (0, _updateSettings.reviewCreate)(tourid, review, rating);
});
if (reviewForm) reviewForm.addEventListener("submit", (event)=>{
    event.preventDefault();
    const revid = document.getElementById("review--form").dataset.revid;
    const review = document.getElementById("review").value;
    const rating = document.getElementById("rating").value;
    (0, _updateSettings.reviewUpdate)(revid, review, rating);
});
if (reviewDeleteBtns) reviewDeleteBtns.forEach((button)=>{
    button.addEventListener("click", (event)=>{
        event.preventDefault();
        // `event.target` refers to the button that was clicked
        const reviewid = event.target.dataset.reviewid;
        (0, _updateSettings.reviewDelete)(reviewid);
    });
});
if (reviewChangeBtns) reviewChangeBtns.forEach((button)=>{
    button.addEventListener("click", (event)=>{
        event.preventDefault();
        // `event.target` refers to the button that was clicked
        const tourid = event.target.dataset.tourid;
        window.setTimeout(()=>{
            location.assign(tourid);
        }, 1500);
    });
});
if (loginForm) loginForm.addEventListener("submit", (event)=>{
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    (0, _authentiication.login)(email, password);
});
if (signupForm) signupForm.addEventListener("submit", (event)=>{
    event.preventDefault();
    const name = document.getElementById("name").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("passwordConfirm").value;
    (0, _authentiication.signup)(name, password, passwordConfirm);
});
if (logoutBtn) logoutBtn.addEventListener("click", (0, _authentiication.logout));
// without photo
if (dataForm) dataForm.addEventListener("submit", (event)=>{
    event.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    (0, _updateSettings.updateSettings)({
        name,
        email
    }, "data");
});
// with photo and all data submit at once i.e name email photo
//hence need to create form data object no need to change updateSettings
// if (dataForm) {
//     dataForm.addEventListener('submit', event => {
//         event.preventDefault();
//         const form = new FormData();
//         form.append('name', document.getElementById('name').value);
//         form.append('email', document.getElementById('email').value);
//         form.append('photo', document.getElementById('photo').files[0]);
//         updateSettings(form, 'data');
//     });
// };
if (imageChange) imageChange.addEventListener("change", async (event)=>{
    event.preventDefault();
    const form = new FormData();
    form.append("photo", document.getElementById("photo").files[0]);
    const newUserPhotoName = await (0, _updateSettings.updateSettings)(form, "photo");
    if (newUserPhotoName) {
        document.querySelector(".nav__user-img").setAttribute("src", `/img/users/${newUserPhotoName}`);
        document.querySelector(".form__user-photo").setAttribute("src", `/img/users/${newUserPhotoName}`);
    }
});
if (passwordForm) passwordForm.addEventListener("submit", async (event)=>{
    event.preventDefault();
    document.querySelector(".btn--save-password").textContent = "updating..";
    const currentPassword = document.getElementById("password-current").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("password-confirm").value;
    await (0, _updateSettings.updateSettings)({
        currentPassword,
        password,
        passwordConfirm
    }, "password");
    document.querySelector(".btn--save-password").textContent = "SAVE PASSWORD";
    document.getElementById("password-current").value = "";
    document.getElementById("password").value = "";
    document.getElementById("password-confirm").value = "";
});
if (bookTourBTN) bookTourBTN.addEventListener("click", (event)=>{
    event.target.textContent = "Processing...";
    // all can work same
    // const tourId = document.getElementById('book-tour').dataset.tourId;
    // const tourId = event.target.dataset.tourId;
    const { tourId  } = event.target.dataset; // destructuring way
    (0, _stripe.bookTour)(tourId);
});
if (headAlertDataset) (0, _alerts.showAlert)("success", headAlertDataset, 20);
if (queryString) {
    const urlParams = new URLSearchParams(queryString);
    const email = urlParams.get("email");
    const name = urlParams.get("name");
    if (email) document.getElementById("emailSignUP").value = email;
    console.log(name);
    if (name) document.querySelector(".nameSignup").value = decodeURI(name);
}
// if cookie is expired or if it is not present
// if someone externally modified (already considered)
if ((0, _authentiication.getCookie)("tm") < Date.now()) (0, _authentiication.getAccessToken)();

},{"./mapbox":"hfhF4","./updateSettings":"3LsIT","./stripe":"7svXG","./alerts":"l7zLi","./authentiication":"l8fZt"}],"hfhF4":[function(require,module,exports) {
/* eslint-disable */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "displayMap", ()=>displayMap);
const displayMap = (locations)=>{
    mapboxgl.accessToken = "pk.eyJ1IjoieWFzaGd1cHRhMTExMSIsImEiOiJjbGNjZzB2ZDUyazhwM3d0OHF0ZnhtcmhkIn0.S93xXiysZdlPuelZHk1Wdw";
    var map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/yashgupta1111/clcci2fmq002p14p2o4z1kvxy",
        scrollZoom: false
    });
    const bounds = new mapboxgl.LngLatBounds();
    locations.forEach((loc)=>{
        // Create marker
        const el = document.createElement("div");
        el.className = "marker";
        // Add marker
        new mapboxgl.Marker({
            element: el,
            anchor: "bottom"
        }).setLngLat(loc.coordinates).addTo(map);
        // Add popup
        new mapboxgl.Popup({
            offset: 30
        }).setLngLat(loc.coordinates).setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`).addTo(map);
        // Extend map bounds to include current location
        bounds.extend(loc.coordinates);
    });
    map.fitBounds(bounds, {
        padding: {
            top: 200,
            bottom: 150,
            left: 100,
            right: 100
        }
    });
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"edRoh"}],"edRoh":[function(require,module,exports) {
exports.interopDefault = function(a) {
    return a && a.__esModule ? a : {
        default: a
    };
};
exports.defineInteropFlag = function(a) {
    Object.defineProperty(a, "__esModule", {
        value: true
    });
};
exports.exportAll = function(source, dest) {
    Object.keys(source).forEach(function(key) {
        if (key === "default" || key === "__esModule" || dest.hasOwnProperty(key)) return;
        Object.defineProperty(dest, key, {
            enumerable: true,
            get: function() {
                return source[key];
            }
        });
    });
    return dest;
};
exports.export = function(dest, destName, get) {
    Object.defineProperty(dest, destName, {
        enumerable: true,
        get: get
    });
};

},{}],"3LsIT":[function(require,module,exports) {
/* eslint-disable */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "updateSettings", ()=>updateSettings);
parcelHelpers.export(exports, "reviewCreate", ()=>reviewCreate);
parcelHelpers.export(exports, "reviewUpdate", ()=>reviewUpdate);
parcelHelpers.export(exports, "reviewDelete", ()=>reviewDelete);
var _alerts = require("./alerts");
const updateSettings = async (data, type)=>{
    let res;
    try {
        const url = type === "password" ? "/api/v1/users/updateMyPassword" : "/api/v1/users/updateMe";
        res = await axios({
            method: "PATCH",
            url,
            data
        });
        if (res.data.status === "success") {
            if (type === "password") {
                (0, _alerts.showAlert)("success", `${type.toUpperCase()} updated successfully!`);
                window.setTimeout(()=>{
                    location.assign("/login");
                }, 2500);
            } else (0, _alerts.showAlert)("success", `${type.toUpperCase()} updated successfully!`);
            if (type === "photo") // note return also goes to catch block hence handle that case also
            return res.data.data.updatedUser.photo;
        }
    } catch (err) {
        if (type === "photo" && res.data.status === "success") return;
        (0, _alerts.showAlert)("error", err.response.data.message);
    }
};
const reviewCreate = async (tour, review, rating)=>{
    // tour is tourId here
    let res;
    try {
        const url = "/api/v1/reviews";
        res = await axios({
            method: "POST",
            url,
            data: {
                review,
                rating,
                tour
            }
        });
        if (res.data.status === "success") {
            (0, _alerts.showAlert)("success", `Review created successfully!`);
            window.setTimeout(()=>{
                location.reload(true);
            }, 3000);
        }
    } catch (err) {
        (0, _alerts.showAlert)("error", err.response.data.message);
    }
};
const reviewUpdate = async (revId, review, rating)=>{
    let res;
    try {
        const url = "/api/v1/reviews/" + revId;
        res = await axios({
            method: "PATCH",
            url,
            data: {
                review,
                rating
            }
        });
        if (res.data.status === "success") {
            (0, _alerts.showAlert)("success", `Review updated successfully!`);
            window.setTimeout(()=>{
                location.reload(true);
            }, 3000);
        }
    } catch (err) {
        (0, _alerts.showAlert)("error", err.response.data.message);
    }
};
const reviewDelete = async (reviewid)=>{
    let res;
    try {
        const url = "/api/v1/reviews/" + reviewid;
        res = await axios({
            method: "DELETE",
            url
        });
        (0, _alerts.showAlert)("success", `Review deleted successfully!`);
        window.setTimeout(()=>{
            location.reload(true);
        }, 3000);
    } catch (err) {
        (0, _alerts.showAlert)("error", err.response.data.message);
    }
};

},{"./alerts":"l7zLi","@parcel/transformer-js/src/esmodule-helpers.js":"edRoh"}],"l7zLi":[function(require,module,exports) {
/* eslint-disable */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "hideAlert", ()=>hideAlert);
parcelHelpers.export(exports, "showAlert", ()=>showAlert);
const hideAlert = ()=>{
    const el = document.querySelector(".alert");
    if (el) el.parentElement.removeChild(el);
};
const showAlert = (type, msg, time = 5)=>{
    hideAlert();
    const markup = `<div class="alert alert--${type}">${msg}</div>`;
    document.querySelector("body").insertAdjacentHTML("afterbegin", markup);
    window.setTimeout(hideAlert, time * 1000);
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"edRoh"}],"7svXG":[function(require,module,exports) {
/* eslint-disable */ // import axios from 'axios';
// const stripe = Stripe(
// 'pk_test_51MMH1cSCFIFH28nc81LgT8gYmaByQwiw8WKJebkBQGl3AVj6PMnGWSCfOUuBIMZIZKIegfGGkndDnrbCGh7pt6pg00u2RrwCsD'
// );
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "bookTour", ()=>bookTour);
var _alerts = require("./alerts");
const bookTour = async (tourId)=>{
    try {
        // get checkout session from API
        // by default get method in axios
        // console.log(tourId);
        const response = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
        // await stripe.redirectToCheckout({
        //     sessionId: response.data.session.id
        // });
        // we can also use directly url as it is given in response no need of stripe.redirecto function
        window.setTimeout(()=>{
            location.assign(response.data.session.url);
        }, 100);
    } catch (err) {
        (0, _alerts.showAlert)("error", err);
        console.log(err);
        console.log(error.response.request._response);
    }
};

},{"./alerts":"l7zLi","@parcel/transformer-js/src/esmodule-helpers.js":"edRoh"}],"l8fZt":[function(require,module,exports) {
/* eslint-disable */ // import axios from 'axios';
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "login", ()=>login);
parcelHelpers.export(exports, "getCookie", ()=>getCookie);
parcelHelpers.export(exports, "getAccessToken", ()=>getAccessToken);
parcelHelpers.export(exports, "signup", ()=>signup);
parcelHelpers.export(exports, "logout", ()=>logout);
var _alerts = require("./alerts");
// const urlDomain = '';
const urlDomain = "http://127.0.0.1:3000";
const login = async (email, password)=>{
    try {
        const res = await axios({
            method: "POST",
            url: urlDomain + "/user/login",
            data: {
                email,
                password
            },
            withCredentials: true
        });
        if (res.data.status === "success") {
            (0, _alerts.showAlert)("success", "Logged in successfully!");
            window.setTimeout(()=>{
                location.assign("/");
            }, 1500);
        }
    } catch (err) {
        (0, _alerts.showAlert)("error", err.response.data.message);
    }
};
const getCookie = (cname)=>{
    let name = cname + "=";
    let ca = document.cookie.split(";");
    for(let i = 0; i < ca.length; i++){
        let c = ca[i];
        while(c.charAt(0) == " ")c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
};
const getAccessToken = async ()=>{
    try {
        const res = await axios({
            method: "GET",
            url: urlDomain + "/user/getAccessToken",
            withCredentials: true
        });
    } catch (err) {}
};
const signup = async (name, password, passwordConfirm)=>{
    try {
        const res = await axios({
            method: "POST",
            url: "/api/v1/users/signup",
            data: {
                name,
                password,
                passwordConfirm
            },
            withCredentials: true
        });
        if (res.data.status === "success") {
            (0, _alerts.showAlert)("success", "Signup successfull!");
            window.setTimeout(()=>{
                location.assign("/login");
            }, 1500);
        }
    } catch (err) {
        (0, _alerts.showAlert)("error", err.response.data.message);
    }
};
const logout = async ()=>{
    try {
        const res = await axios({
            method: "GET",
            url: "/api/v1/users/logout",
            withCredentials: true
        });
        if (res.data.status === "success") {
            // location.reload(true);
            // my
            (0, _alerts.showAlert)("success", "Logged out successfully!");
            window.setTimeout(()=>{
                location.assign("/");
            }, 1500);
        }
    } catch (err) {
        (0, _alerts.showAlert)("error", "Error in logging out please try again!");
    }
};

},{"./alerts":"l7zLi","@parcel/transformer-js/src/esmodule-helpers.js":"edRoh"}]},["hFizm","6uYF5"], "6uYF5", "parcelRequire1248")

//# sourceMappingURL=index.js.map
