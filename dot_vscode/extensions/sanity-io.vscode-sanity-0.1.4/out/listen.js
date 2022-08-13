"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupListener = void 0;
const client_1 = __importDefault(require("@sanity/client"));
const vscode = __importStar(require("vscode"));
const operators_1 = require("rxjs/operators");
function setupListener(options) {
    const { query, params } = options, clientOptions = __rest(options, ["query", "params"]);
    const { token } = clientOptions, noTokenClientOptions = __rest(clientOptions, ["token"]);
    return client_1.default(Object.assign(Object.assign({}, clientOptions), { useCdn: false }))
        .listen(query, params, { includeResult: true, events: ['mutation', 'welcome'] })
        .pipe(operators_1.catchError((err) => {
        if (err.statusCode !== 401) {
            throw err;
        }
        vscode.window.showInformationMessage(err.message + '. Falling back to public dataset.');
        return client_1.default(Object.assign(Object.assign({}, noTokenClientOptions), { useCdn: false })).listen(query, params, {
            includeResult: true,
            events: ['mutation', 'welcome'],
        });
    }));
}
exports.setupListener = setupListener;
//# sourceMappingURL=listen.js.map