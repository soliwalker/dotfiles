"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultView = void 0;
const react_1 = __importDefault(require("react"));
const react_jason_1 = require("react-jason");
function ResultView({ result }) {
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("h2", null, "Query result"),
        react_1.default.createElement(react_jason_1.ReactJason, { value: result })));
}
exports.ResultView = ResultView;
//# sourceMappingURL=ResultView.js.map