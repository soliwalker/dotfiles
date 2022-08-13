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
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const path = __importStar(require("path"));
const vscode = __importStar(require("vscode"));
const fs_1 = require("fs");
const groq_js_1 = require("groq-js");
const findConfig_1 = require("./config/findConfig");
const content_provider_1 = require("./providers/content-provider");
const groq_codelens_provider_1 = require("./providers/groq-codelens-provider");
const query_1 = require("./query");
function activate(context) {
    // Assigned by `readConfig()`
    let codelens;
    let useCodelens;
    let openJSONFile;
    let useCDN;
    // Read and listen for configuration updates
    readConfig();
    vscode.workspace.onDidChangeConfiguration(() => readConfig());
    let resultPanel;
    let disposable = vscode.commands.registerCommand('sanity.executeGroq', (groqQuery) => __awaiter(this, void 0, void 0, function* () {
        let config;
        let query = groqQuery;
        let params = {};
        try {
            config = yield loadSanityJson();
            if (!query) {
                query = yield loadGroqFromFile();
            }
            const variables = findVariablesInQuery(query);
            if (variables.length > 0) {
                params = yield readParamsFile();
            }
            // FIXME: Throw error object in webview?
            const { ms, result } = yield query_1.executeGroq(Object.assign(Object.assign({}, config), { query,
                params, useCdn: config.token ? false : useCDN }));
            vscode.window.setStatusBarMessage(`Query took ${ms}ms` + (useCDN ? ' with cdn' : ' without cdn'), 10000);
            if (!openJSONFile && !resultPanel) {
                resultPanel = vscode.window.createWebviewPanel('executionResultsWebView', 'GROQ Execution Result', vscode.ViewColumn.Beside, {});
                resultPanel.onDidDispose(() => {
                    resultPanel = undefined;
                });
            }
            if (openJSONFile) {
                yield openInUntitled(result, 'json');
            }
            else if (resultPanel) {
                const contentProvider = yield registerContentProvider(context, result || []);
                const html = yield contentProvider.getCurrentHTML();
                resultPanel.webview.html = html;
            }
        }
        catch (err) {
            vscode.window.showErrorMessage(err.message);
            return;
        }
    }));
    context.subscriptions.push(disposable);
    function readConfig() {
        const settings = vscode.workspace.getConfiguration('sanity');
        openJSONFile = settings.get('openJSONFile', false);
        useCodelens = settings.get('useCodelens', true);
        useCDN = settings.get('useCDN', false);
        if (useCodelens && !codelens) {
            codelens = vscode.languages.registerCodeLensProvider(['javascript', 'typescript', 'javascriptreact', 'typescriptreact', 'groq'], new groq_codelens_provider_1.GROQCodeLensProvider());
            context.subscriptions.push(codelens);
        }
        else if (!useCodelens && codelens) {
            const subIndex = context.subscriptions.indexOf(codelens);
            context.subscriptions.splice(subIndex, 1);
            codelens.dispose();
            codelens = undefined;
        }
    }
}
exports.activate = activate;
function loadSanityJson() {
    return __awaiter(this, void 0, void 0, function* () {
        const config = (yield findConfig_1.loadConfig(getRootPath())) || (yield findConfig_1.loadConfig(getWorkspacePath()));
        if (!config) {
            throw new Error('Could not resolve sanity.json configuration file');
        }
        return config;
    });
}
function loadGroqFromFile() {
    return __awaiter(this, void 0, void 0, function* () {
        const activeTextEditor = vscode.window.activeTextEditor;
        if (!activeTextEditor) {
            throw new Error('Nothing to execute');
        }
        return activeTextEditor.document.getText();
    });
}
function registerContentProvider(context, result) {
    return __awaiter(this, void 0, void 0, function* () {
        const contentProvider = new content_provider_1.GroqContentProvider(result);
        const registration = vscode.workspace.registerTextDocumentContentProvider('groq', contentProvider);
        context.subscriptions.push(registration);
        return contentProvider;
    });
}
function getRootPath() {
    const activeFile = getActiveFileName();
    const activeDir = path.dirname(activeFile);
    return activeDir;
}
function getWorkspacePath() {
    const folders = vscode.workspace.workspaceFolders || [];
    return folders.length > 0 ? folders[0].uri.fsPath : '';
}
function getActiveFileName() {
    var _a;
    return ((_a = vscode.window.activeTextEditor) === null || _a === void 0 ? void 0 : _a.document.fileName) || '';
}
function checkFileExists(file) {
    return __awaiter(this, void 0, void 0, function* () {
        return fs_1.promises
            .access(file, fs_1.constants.F_OK)
            .then(() => true)
            .catch(() => false);
    });
}
function findVariablesInQuery(query) {
    return findVariables(groq_js_1.parse(query), []);
}
function findVariables(node, found) {
    if (node && node.type === 'Parameter' && typeof node.name === 'string') {
        return found.concat(node.name);
    }
    if (Array.isArray(node)) {
        return node.reduce((acc, child) => findVariables(child, acc), found);
    }
    if (typeof node !== 'object') {
        return found;
    }
    return Object.keys(node).reduce((acc, key) => findVariables(node[key], acc), found);
}
function readParamsFile() {
    return __awaiter(this, void 0, void 0, function* () {
        let defaultParamFile, absoluteParamFile;
        const activeFile = getActiveFileName();
        if (activeFile && activeFile !== '') {
            var pos = activeFile.lastIndexOf('.');
            absoluteParamFile = activeFile.substr(0, pos < 0 ? activeFile.length : pos) + '.json';
            if (yield checkFileExists(absoluteParamFile)) {
                defaultParamFile = path.basename(absoluteParamFile);
            }
        }
        const paramsFile = yield vscode.window.showInputBox({ value: defaultParamFile });
        if (!paramsFile) {
            throw new Error('Invalid param file received');
        }
        const content = yield fs_1.promises.readFile(path.join(path.dirname(absoluteParamFile), paramsFile), 'utf8');
        return JSON.parse(content);
    });
}
function openInUntitled(content, language) {
    return __awaiter(this, void 0, void 0, function* () {
        const cs = JSON.stringify(content);
        yield vscode.workspace.openTextDocument({ content: cs }).then((document) => {
            vscode.window.showTextDocument(document, { viewColumn: vscode.ViewColumn.Beside });
            vscode.languages.setTextDocumentLanguage(document, language || 'json');
        });
    });
}
//# sourceMappingURL=extension.js.map