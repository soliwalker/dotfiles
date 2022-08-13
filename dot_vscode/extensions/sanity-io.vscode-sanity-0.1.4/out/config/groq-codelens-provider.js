"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GROQCodeLensProvider = void 0;
const vscode_1 = require("vscode");
const source_helper_1 = require("./source-helper");
class GROQCodeLensProvider {
    constructor() { }
    provideCodeLenses(document, _token) {
        // find all lines where "groq" exists
        const literals = source_helper_1.extractAllTemplateLiterals(document);
        // add a button above each line that has groq
        return literals.map((literal) => {
            return new vscode_1.CodeLens(new vscode_1.Range(new vscode_1.Position(literal.position.line + 1, 0), new vscode_1.Position(literal.position.line + 1, 0)), {
                title: `Execute Query`,
                command: 'sanity.executeGroq',
                arguments: [literal.content],
            });
        });
    }
}
exports.GROQCodeLensProvider = GROQCodeLensProvider;
//# sourceMappingURL=groq-codelens-provider.js.map