"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GROQCodeLensProvider = void 0;
const vscode_1 = require("vscode");
function extractAllTemplateLiterals(document) {
    const documents = [];
    const text = document.getText();
    const regExpGQL = new RegExp('groq\\s*`([\\s\\S]+?)`', 'mg');
    let prevIndex = 0;
    let result;
    while ((result = regExpGQL.exec(text)) !== null) {
        const content = result[1];
        const queryPosition = text.indexOf(content, prevIndex);
        documents.push({
            content: content,
            uri: document.uri.path,
            position: document.positionAt(queryPosition),
        });
        prevIndex = queryPosition + 1;
    }
    return documents;
}
class GROQCodeLensProvider {
    constructor() { }
    provideCodeLenses(document, _token) {
        if (document.languageId === 'groq') {
            return [
                new vscode_1.CodeLens(new vscode_1.Range(new vscode_1.Position(0, 0), new vscode_1.Position(0, 0)), {
                    title: 'Execute Query',
                    command: 'sanity.executeGroq',
                    arguments: [document.getText()],
                }),
            ];
        }
        // find all lines where "groq" exists
        const literals = extractAllTemplateLiterals(document);
        // add a button above each line that has groq
        return literals.map((literal) => {
            return new vscode_1.CodeLens(new vscode_1.Range(new vscode_1.Position(literal.position.line, 0), new vscode_1.Position(literal.position.line, 0)), {
                title: 'Execute Query',
                command: 'sanity.executeGroq',
                arguments: [literal.content],
            });
        });
    }
}
exports.GROQCodeLensProvider = GROQCodeLensProvider;
//# sourceMappingURL=groq-codelens-provider.js.map