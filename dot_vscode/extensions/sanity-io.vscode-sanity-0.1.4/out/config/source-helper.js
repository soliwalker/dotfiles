"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractAllTemplateLiterals = void 0;
function extractAllTemplateLiterals(document) {
    const documents = [];
    const text = document.getText();
    const regExpGQL = new RegExp('groq\\s*`([\\s\\S]+?)`', 'mg');
    let result;
    while ((result = regExpGQL.exec(text)) !== null) {
        const content = result[1];
        documents.push({
            content: content,
            uri: document.uri.path,
            position: document.positionAt(text.indexOf(content) + content.length),
        });
    }
    return documents;
}
exports.extractAllTemplateLiterals = extractAllTemplateLiterals;
//# sourceMappingURL=source-helper.js.map