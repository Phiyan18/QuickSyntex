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
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
function activate(context) {
    console.log('Python Syntax Helper is now active!');
    // Create diagnostic collection for syntax errors
    const diagnosticCollection = vscode.languages.createDiagnosticCollection('pythonSyntaxHelper');
    context.subscriptions.push(diagnosticCollection);
    // Register syntax checker command
    const syntaxChecker = vscode.commands.registerCommand('pythonSyntaxHelper.checkSyntax', () => {
        const activeEditor = vscode.window.activeTextEditor;
        if (activeEditor && activeEditor.document.languageId === 'python') {
            checkPythonSyntax(activeEditor.document, diagnosticCollection);
            vscode.window.showInformationMessage('Python syntax check completed!');
        }
    });
    // Register code formatter command
    const codeFormatter = vscode.commands.registerCommand('pythonSyntaxHelper.formatCode', () => {
        const activeEditor = vscode.window.activeTextEditor;
        if (activeEditor && activeEditor.document.languageId === 'python') {
            formatPythonCode(activeEditor);
        }
    });
    // Real-time syntax checking on document change
    const onDocumentChange = vscode.workspace.onDidChangeTextDocument((event) => {
        if (event.document.languageId === 'python') {
            const config = vscode.workspace.getConfiguration('pythonSyntaxHelper');
            if (config.get('enableRealTimeChecking')) {
                // Debounce the syntax checking
                setTimeout(() => {
                    checkPythonSyntax(event.document, diagnosticCollection);
                }, 500);
            }
        }
    });
    // Hover provider for Python syntax help
    const hoverProvider = vscode.languages.registerHoverProvider('python', {
        provideHover(document, position) {
            const range = document.getWordRangeAtPosition(position);
            const word = document.getText(range);
            return getPythonSyntaxHelp(word);
        }
    });
    // Completion provider for Python keywords and patterns
    const completionProvider = vscode.languages.registerCompletionItemProvider('python', {
        provideCompletionItems(document, position) {
            return getPythonCompletions(document, position);
        }
    }, '.', ' ');
    context.subscriptions.push(syntaxChecker, codeFormatter, onDocumentChange, hoverProvider, completionProvider);
}
function checkPythonSyntax(document, diagnosticCollection) {
    const diagnostics = [];
    const text = document.getText();
    const lines = text.split('\n');
    lines.forEach((line, lineNumber) => {
        // Check for common Python syntax issues
        const issues = findSyntaxIssues(line, lineNumber);
        diagnostics.push(...issues);
    });
    diagnosticCollection.set(document.uri, diagnostics);
}
function findSyntaxIssues(line, lineNumber) {
    const diagnostics = [];
    // Check for indentation issues
    if (line.trim() !== '' && !line.match(/^[ \t]*/) && line.match(/^[^ \t]/)) {
        const match = line.match(/^(\s*)/);
        if (match && match[1].includes('\t') && match[1].includes(' ')) {
            diagnostics.push(createDiagnostic(lineNumber, 0, match[1].length, 'Mixed tabs and spaces in indentation', vscode.DiagnosticSeverity.Warning));
        }
    }
    // Check for missing colons
    const colonPatterns = [
        /^\s*(if|elif|else|for|while|def|class|try|except|finally|with)\s+.*[^:]$/,
        /^\s*(if|elif|for|while)\s+.*:\s*$/
    ];
    colonPatterns.forEach(pattern => {
        if (pattern.test(line) && !line.trim().endsWith(':')) {
            diagnostics.push(createDiagnostic(lineNumber, line.length - 1, line.length, 'Missing colon at end of statement', vscode.DiagnosticSeverity.Error));
        }
    });
    // Check for unmatched parentheses, brackets, braces
    const brackets = { '(': ')', '[': ']', '{': '}' };
    const stack = [];
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (Object.keys(brackets).includes(char)) {
            stack.push(char);
        }
        else if (Object.values(brackets).includes(char)) {
            const lastOpen = stack.pop();
            if (!lastOpen || brackets[lastOpen] !== char) {
                diagnostics.push(createDiagnostic(lineNumber, i, i + 1, 'Unmatched closing bracket', vscode.DiagnosticSeverity.Error));
            }
        }
    }
    // Check for undefined variables (simple heuristic)
    const variablePattern = /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?!=)/g;
    const definedVars = new Set();
    const assignmentPattern = /([a-zA-Z_][a-zA-Z0-9_]*)\s*=/g;
    let match;
    while ((match = assignmentPattern.exec(line)) !== null) {
        definedVars.add(match[1]);
    }
    return diagnostics;
}
function createDiagnostic(line, startChar, endChar, message, severity) {
    const range = new vscode.Range(line, startChar, line, endChar);
    return new vscode.Diagnostic(range, message, severity);
}
function formatPythonCode(editor) {
    const document = editor.document;
    const text = document.getText();
    const lines = text.split('\n');
    let formattedLines = [];
    let indentLevel = 0;
    const indentSize = 4; // Standard Python indentation
    lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed === '') {
            formattedLines.push('');
            return;
        }
        // Decrease indent for certain keywords
        if (trimmed.startsWith('except') || trimmed.startsWith('elif') ||
            trimmed.startsWith('else') || trimmed.startsWith('finally')) {
            indentLevel = Math.max(0, indentLevel - 1);
        }
        // Apply current indentation
        const indentedLine = ' '.repeat(indentLevel * indentSize) + trimmed;
        formattedLines.push(indentedLine);
        // Increase indent after certain keywords
        if (trimmed.endsWith(':') &&
            (trimmed.startsWith('if') || trimmed.startsWith('elif') ||
                trimmed.startsWith('else') || trimmed.startsWith('for') ||
                trimmed.startsWith('while') || trimmed.startsWith('def') ||
                trimmed.startsWith('class') || trimmed.startsWith('try') ||
                trimmed.startsWith('except') || trimmed.startsWith('finally') ||
                trimmed.startsWith('with'))) {
            indentLevel++;
        }
    });
    const formattedText = formattedLines.join('\n');
    const fullRange = new vscode.Range(0, 0, document.lineCount, 0);
    editor.edit(editBuilder => {
        editBuilder.replace(fullRange, formattedText);
    });
}
function getPythonSyntaxHelp(word) {
    const syntaxHelp = {
        'def': 'Define a function: `def function_name(parameters):`',
        'class': 'Define a class: `class ClassName:`',
        'if': 'Conditional statement: `if condition:`',
        'elif': 'Else if statement: `elif condition:`',
        'else': 'Else statement: `else:`',
        'for': 'For loop: `for item in iterable:`',
        'while': 'While loop: `while condition:`',
        'try': 'Try block for exception handling: `try:`',
        'except': 'Exception handler: `except ExceptionType:`',
        'finally': 'Finally block: `finally:`',
        'with': 'Context manager: `with expression as variable:`',
        'import': 'Import module: `import module_name`',
        'from': 'Import from module: `from module import item`',
        'return': 'Return value from function: `return value`',
        'yield': 'Yield value (generator): `yield value`',
        'lambda': 'Anonymous function: `lambda x: expression`',
        'pass': 'Null operation placeholder: `pass`',
        'break': 'Break out of loop: `break`',
        'continue': 'Continue to next iteration: `continue`'
    };
    if (syntaxHelp[word]) {
        return new vscode.Hover(new vscode.MarkdownString(`**${word}**: ${syntaxHelp[word]}`));
    }
    return undefined;
}
function getPythonCompletions(document, position) {
    const completions = [];
    // Python keywords
    const keywords = [
        'def', 'class', 'if', 'elif', 'else', 'for', 'while', 'try', 'except',
        'finally', 'with', 'import', 'from', 'return', 'yield', 'lambda',
        'pass', 'break', 'continue', 'and', 'or', 'not', 'in', 'is', 'None',
        'True', 'False', 'self', 'super', 'len', 'range', 'print', 'input'
    ];
    keywords.forEach(keyword => {
        const completion = new vscode.CompletionItem(keyword, vscode.CompletionItemKind.Keyword);
        completion.documentation = new vscode.MarkdownString(`Python keyword: **${keyword}**`);
        completions.push(completion);
    });
    // Common Python patterns
    const patterns = [
        {
            label: 'if __name__ == "__main__":',
            insertText: 'if __name__ == "__main__":\n    ${1:pass}',
            detail: 'Main guard pattern'
        },
        {
            label: 'for i in range():',
            insertText: 'for ${1:i} in range(${2:n}):\n    ${3:pass}',
            detail: 'For loop with range'
        },
        {
            label: 'try-except block',
            insertText: 'try:\n    ${1:pass}\nexcept ${2:Exception} as ${3:e}:\n    ${4:pass}',
            detail: 'Try-except error handling'
        }
    ];
    patterns.forEach(pattern => {
        const completion = new vscode.CompletionItem(pattern.label, vscode.CompletionItemKind.Snippet);
        completion.insertText = new vscode.SnippetString(pattern.insertText);
        completion.detail = pattern.detail;
        completions.push(completion);
    });
    return completions;
}
function deactivate() {
    console.log('Python Syntax Helper deactivated');
}
//# sourceMappingURL=extension.js.map