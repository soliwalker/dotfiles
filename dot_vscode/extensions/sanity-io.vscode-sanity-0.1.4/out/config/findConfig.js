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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadConfig = void 0;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const os_1 = __importDefault(require("os"));
const fs_1 = require("fs");
const osenv_1 = __importDefault(require("osenv"));
const xdg_basedir_1 = __importDefault(require("xdg-basedir"));
function loadConfig(basePath) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        let dir = basePath;
        while (!(yield hasConfig(dir))) {
            const parent = path.dirname(dir);
            if (!dir || parent === dir) {
                // last ditch effort, check if we are in a studio monorepo
                const folders = ((_a = vscode === null || vscode === void 0 ? void 0 : vscode.workspace) === null || _a === void 0 ? void 0 : _a.workspaceFolders) || [];
                dir = (folders.length && folders[0].uri.fsPath + '/studio') || '/';
                if (!(yield hasConfig(dir))) {
                    return false;
                }
            }
            else {
                dir = parent;
            }
        }
        const configContent = yield fs_1.promises.readFile(path.join(dir, 'sanity.json'), 'utf8');
        const config = parseJson(configContent);
        if (!config || !config.api || !config.api.projectId) {
            return false;
        }
        const cliConfigContent = yield fs_1.promises.readFile(getGlobalConfigLocation(), 'utf8');
        const cliConfig = parseJson(cliConfigContent);
        return cliConfig ? Object.assign(Object.assign({}, config.api), { token: cliConfig.authToken }) : config.api;
    });
}
exports.loadConfig = loadConfig;
function hasConfig(dir) {
    return __awaiter(this, void 0, void 0, function* () {
        return fs_1.promises
            .stat(path.join(dir, 'sanity.json'))
            .then(() => true)
            .catch(() => false);
    });
}
function parseJson(content) {
    try {
        return JSON.parse(content);
    }
    catch (err) {
        return false;
    }
}
function getGlobalConfigLocation() {
    const user = (osenv_1.default.user() || 'user').replace(/\\/g, '');
    const configDir = xdg_basedir_1.default.config || path.join(os_1.default.tmpdir(), user, '.config');
    return path.join(configDir, 'sanity', 'config.json');
}
//# sourceMappingURL=findConfig.js.map