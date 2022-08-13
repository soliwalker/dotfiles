"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroqContentProvider = void 0;
const react_1 = __importDefault(require("react"));
const server_1 = __importDefault(require("react-dom/server"));
const ResultView_1 = require("../resultView/ResultView");
class GroqContentProvider {
    constructor(data) {
        this.html = '';
        this.html = `
    <html>
      <head>
        <title>GROQ result</title>
        <style>
          html, body, h1 {margin: 0; padding: 0;}
          body {padding: 10px;}
        </style>
      </head>
      <body>${this.render(data)}</body>
    </html>
`;
    }
    provideTextDocumentContent(_) {
        return this.html;
    }
    getCurrentHTML() {
        return new Promise((resolve) => {
            resolve(this.html);
        });
    }
    render(result) {
        return server_1.default.renderToStaticMarkup(react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(ResultView_1.ResultView, { result: result })));
    }
}
exports.GroqContentProvider = GroqContentProvider;
//# sourceMappingURL=content-provider.js.map