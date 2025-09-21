"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const assert = __importStar(require("assert"));
const vscode = __importStar(require("vscode"));
suite('Extension Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');
    test('Extension should be present', () => {
        assert.ok(vscode.extensions.getExtension('your-publisher.quicksyntex'));
    });
    test('Extension should activate', async () => {
        const ext = vscode.extensions.getExtension('your-publisher.quicksyntex');
        if (ext) {
            await ext.activate();
            assert.ok(ext.isActive);
        }
    });
    test('Should register commands', async () => {
        const commands = await vscode.commands.getCommands(true);
        assert.ok(commands.includes('pythonSyntaxHelper.checkSyntax'));
        assert.ok(commands.includes('pythonSyntaxHelper.formatCode'));
    });
    test('Should provide hover information', async () => {
        // Create a test document
        const document = await vscode.workspace.openTextDocument({
            content: 'def test_function():\n    pass',
            language: 'python'
        });
        const position = new vscode.Position(0, 0);
        const hovers = await vscode.commands.executeCommand('vscode.executeHoverProvider', document.uri, position);
        assert.ok(hovers.length > 0);
    });
    test('Should provide completions', async () => {
        const document = await vscode.workspace.openTextDocument({
            content: 'def',
            language: 'python'
        });
        const position = new vscode.Position(0, 3);
        const completions = await vscode.commands.executeCommand('vscode.executeCompletionItemProvider', document.uri, position);
        assert.ok(completions.items.length > 0);
    });
    test('Should detect syntax errors', async () => {
        const document = await vscode.workspace.openTextDocument({
            content: 'if True\n    print("missing colon[:]")',
            language: 'python'
        });
        // Wait for diagnostics to be computed
        await new Promise(resolve => setTimeout(resolve, 1000));
        const diagnostics = vscode.languages.getDiagnostics(document.uri);
        assert.ok(diagnostics.length > 0);
        assert.ok(diagnostics.some(d => d.message.includes('colon')));
    });
    test('Should format code correctly', async () => {
        const document = await vscode.workspace.openTextDocument({
            content: 'def test():\nprint("hello")',
            language: 'python'
        });
        const editor = await vscode.window.showTextDocument(document);
        await vscode.commands.executeCommand('pythonSyntaxHelper.formatCode');
        const formattedText = editor.document.getText();
        assert.ok(formattedText.includes('    print("hello")'));
    });
    test('Should handle indentation correctly', async () => {
        const document = await vscode.workspace.openTextDocument({
            content: 'if True:\n\tprint("tab")\n    print("space")',
            language: 'python'
        });
        await new Promise(resolve => setTimeout(resolve, 1000));
        const diagnostics = vscode.languages.getDiagnostics(document.uri);
        const indentationWarnings = diagnostics.filter(d => d.message.includes('indentation') || d.message.includes('tab'));
        assert.ok(indentationWarnings.length > 0);
    });
});
//# sourceMappingURL=extension.test.js.map