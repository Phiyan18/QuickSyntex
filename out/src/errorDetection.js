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
exports.AdvancedPythonAnalyzer = exports.PythonQuickFixProvider = exports.EnhancedPythonErrorDetector = void 0;
// Fixed Python Error Detection System for QuickSyntex
const vscode = __importStar(require("vscode"));
class EnhancedPythonErrorDetector {
    constructor() {
        this.diagnosticCollection = vscode.languages.createDiagnosticCollection('quicksyntex');
    }
    async analyzeDocument(document) {
        const errors = [];
        const text = document.getText();
        const lines = text.split('\n');
        // Run all error detection methods
        errors.push(...this.detectSyntaxErrors(lines, document));
        errors.push(...this.detectIndentationErrors(lines, document));
        errors.push(...this.detectNamingConventionErrors(lines, document));
        errors.push(...this.detectLogicalErrors(lines, document));
        errors.push(...this.detectPerformanceIssues(lines, document));
        errors.push(...this.detectSecurityIssues(lines, document));
        errors.push(...this.detectBestPracticeViolations(lines, document));
        errors.push(...this.detectTypeHintIssues(lines, document));
        errors.push(...this.detectImportIssues(lines, document));
        errors.push(...this.detectDocumentationIssues(lines, document));
        // Update diagnostics
        this.updateDiagnostics(document, errors);
        return errors;
    }
    detectSyntaxErrors(lines, document) {
        const errors = [];
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmed = line.trim();
            // Skip empty lines and comments
            if (trimmed === '' || trimmed.startsWith('#')) {
                continue;
            }
            // Missing colons in control structures
            const controlStructures = [
                { pattern: /^\s*(if|elif|else|for|while|def|class|try|except|finally|with)\b[^:]*$/, message: "Missing colon after control structure" },
                { pattern: /^\s*(if|elif|while)\s+[^:]+[^:]\s*$/, message: "Missing colon after condition" },
                { pattern: /^\s*def\s+\w+\([^)]*\)\s*$/, message: "Missing colon after function definition" },
                { pattern: /^\s*class\s+\w+(\([^)]*\))?\s*$/, message: "Missing colon after class definition" }
            ];
            for (const structure of controlStructures) {
                if (structure.pattern.test(line) && !line.includes('#')) {
                    errors.push({
                        line: i,
                        column: line.length,
                        severity: vscode.DiagnosticSeverity.Error,
                        message: structure.message,
                        code: 'missing-colon',
                        source: 'QuickSyntex',
                        quickFix: 'Add colon at the end of the line',
                        range: new vscode.Range(i, line.length, i, line.length)
                    });
                }
            }
            // Unmatched brackets
            const brackets = { '(': ')', '[': ']', '{': '}' };
            const stack = [];
            for (let j = 0; j < line.length; j++) {
                const char = line[j];
                if (char in brackets) {
                    stack.push(char);
                }
                else if (Object.values(brackets).includes(char)) {
                    const lastOpen = stack.pop();
                    if (!lastOpen || brackets[lastOpen] !== char) {
                        errors.push({
                            line: i,
                            column: j,
                            severity: vscode.DiagnosticSeverity.Error,
                            message: `Unmatched bracket: '${char}'`,
                            code: 'unmatched-bracket',
                            source: 'QuickSyntex',
                            quickFix: `Add matching opening bracket`,
                            range: new vscode.Range(i, j, i, j + 1)
                        });
                    }
                }
            }
            // Assignment in if conditions (common mistake)
            if (/^\s*if\s+.*=(?!=).*:/.test(line) && !/==|!=|<=|>=/.test(line)) {
                const assignmentIndex = line.indexOf('=');
                errors.push({
                    line: i,
                    column: assignmentIndex,
                    severity: vscode.DiagnosticSeverity.Warning,
                    message: "Assignment in if condition. Did you mean '==' for comparison?",
                    code: 'assignment-in-condition',
                    source: 'QuickSyntex',
                    quickFix: "Change '=' to '==' for comparison",
                    range: new vscode.Range(i, 0, i, line.length)
                });
            }
            // Missing parentheses in print statements (Python 2 to 3)
            if (/^\s*print\s+[^(]/.test(line)) {
                const printIndex = line.indexOf('print');
                errors.push({
                    line: i,
                    column: printIndex,
                    severity: vscode.DiagnosticSeverity.Error,
                    message: "print is a function in Python 3, use parentheses",
                    code: 'print-function',
                    source: 'QuickSyntex',
                    quickFix: "Add parentheses around print arguments",
                    range: new vscode.Range(i, 0, i, line.length)
                });
            }
            // Incorrect use of 'is' with literals
            if (/\bis\s+(True|False|None|\d+|['"][^'"]*['"]|\[\]|\{\})/.test(line)) {
                const isIndex = line.indexOf(' is ');
                if (isIndex !== -1) {
                    errors.push({
                        line: i,
                        column: isIndex,
                        severity: vscode.DiagnosticSeverity.Warning,
                        message: "Use '==' for equality comparison, 'is' for identity comparison",
                        code: 'incorrect-is-usage',
                        source: 'QuickSyntex',
                        quickFix: "Replace 'is' with '=='",
                        range: new vscode.Range(i, 0, i, line.length)
                    });
                }
            }
        }
        return errors;
    }
    detectIndentationErrors(lines, document) {
        const errors = [];
        const indentStack = [0];
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            // Skip empty lines and comments
            if (line.trim() === '' || line.trim().startsWith('#')) {
                continue;
            }
            // Mixed tabs and spaces
            if (line.includes('\t') && line.includes(' ')) {
                const firstNonSpace = line.search(/\S/);
                errors.push({
                    line: i,
                    column: 0,
                    severity: vscode.DiagnosticSeverity.Error,
                    message: "Mixed tabs and spaces in indentation",
                    code: 'mixed-indentation',
                    source: 'QuickSyntex',
                    quickFix: "Use consistent indentation (spaces or tabs)",
                    range: new vscode.Range(i, 0, i, firstNonSpace !== -1 ? firstNonSpace : 0)
                });
            }
            // Check for correct indentation after control structures
            if (i > 0) {
                const prevLine = lines[i - 1].trim();
                const currentIndent = line.search(/\S/);
                if (prevLine.endsWith(':') && currentIndent !== -1) {
                    const expectedIndentLevel = indentStack[indentStack.length - 1] + 4;
                    if (currentIndent !== expectedIndentLevel && currentIndent > 0) {
                        errors.push({
                            line: i,
                            column: 0,
                            severity: vscode.DiagnosticSeverity.Warning,
                            message: `Expected ${expectedIndentLevel} spaces, got ${currentIndent}`,
                            code: 'incorrect-indentation',
                            source: 'QuickSyntex',
                            quickFix: `Adjust indentation to ${expectedIndentLevel} spaces`,
                            range: new vscode.Range(i, 0, i, currentIndent)
                        });
                    }
                }
            }
        }
        return errors;
    }
    detectNamingConventionErrors(lines, document) {
        const errors = [];
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            // Function names should be snake_case
            const funcMatch = line.match(/^\s*def\s+([A-Z][a-zA-Z0-9_]*)/);
            if (funcMatch) {
                const funcName = funcMatch[1];
                const funcIndex = line.indexOf(funcName);
                const suggestion = funcName.replace(/([A-Z])/g, '_$1').toLowerCase().substring(1);
                errors.push({
                    line: i,
                    column: funcIndex,
                    severity: vscode.DiagnosticSeverity.Warning,
                    message: "Function names should be lowercase with underscores (snake_case)",
                    code: 'function-naming',
                    source: 'QuickSyntex',
                    quickFix: `Rename to ${suggestion}`,
                    range: new vscode.Range(i, 0, i, line.length)
                });
            }
            // Class names should be PascalCase
            const classMatch = line.match(/^\s*class\s+([a-z][a-zA-Z0-9_]*)/);
            if (classMatch) {
                const className = classMatch[1];
                const classIndex = line.indexOf(className);
                const suggestion = className.charAt(0).toUpperCase() + className.slice(1);
                errors.push({
                    line: i,
                    column: classIndex,
                    severity: vscode.DiagnosticSeverity.Warning,
                    message: "Class names should start with uppercase (PascalCase)",
                    code: 'class-naming',
                    source: 'QuickSyntex',
                    quickFix: `Rename to ${suggestion}`,
                    range: new vscode.Range(i, 0, i, line.length)
                });
            }
        }
        return errors;
    }
    detectLogicalErrors(lines, document) {
        const errors = [];
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmed = line.trim();
            // Unreachable code after return
            if (trimmed.startsWith('return') && i + 1 < lines.length) {
                const nextLine = lines[i + 1].trim();
                if (nextLine && !nextLine.startsWith('#') &&
                    !nextLine.startsWith('def') && !nextLine.startsWith('class') &&
                    line.search(/\S/) === lines[i + 1].search(/\S/)) {
                    errors.push({
                        line: i + 1,
                        column: 0,
                        severity: vscode.DiagnosticSeverity.Warning,
                        message: "Unreachable code after return statement",
                        code: 'unreachable-code',
                        source: 'QuickSyntex',
                        quickFix: "Remove unreachable code or restructure logic",
                        range: new vscode.Range(i + 1, 0, i + 1, lines[i + 1].length)
                    });
                }
            }
            // Bare except clauses
            if (/^\s*except\s*:/.test(line)) {
                const exceptIndex = line.indexOf('except');
                errors.push({
                    line: i,
                    column: exceptIndex,
                    severity: vscode.DiagnosticSeverity.Warning,
                    message: "Bare except clause catches all exceptions, specify exception type",
                    code: 'bare-except',
                    source: 'QuickSyntex',
                    quickFix: "Specify exception type (e.g., 'except ValueError:')",
                    range: new vscode.Range(i, 0, i, line.length)
                });
            }
            // Mutable default arguments
            const funcMatch = line.match(/def\s+\w+\([^)]*=\s*(\[\]|\{\})/);
            if (funcMatch) {
                const equalIndex = line.indexOf('=');
                errors.push({
                    line: i,
                    column: equalIndex,
                    severity: vscode.DiagnosticSeverity.Warning,
                    message: "Mutable default argument. Use None and initialize inside function",
                    code: 'mutable-default',
                    source: 'QuickSyntex',
                    quickFix: "Use None as default and initialize inside function",
                    range: new vscode.Range(i, 0, i, line.length)
                });
            }
            // Comparison with None using == instead of is
            if (/==\s*None|None\s*==/.test(line)) {
                const equalIndex = line.indexOf('==');
                errors.push({
                    line: i,
                    column: equalIndex,
                    severity: vscode.DiagnosticSeverity.Warning,
                    message: "Use 'is None' instead of '== None'",
                    code: 'none-comparison',
                    source: 'QuickSyntex',
                    quickFix: "Replace '== None' with 'is None'",
                    range: new vscode.Range(i, 0, i, line.length)
                });
            }
        }
        return errors;
    }
    detectPerformanceIssues(lines, document) {
        const errors = [];
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            // Using + for string concatenation in loops
            if (/for\s+\w+\s+in.*:/.test(line) && i + 1 < lines.length) {
                const nextLine = lines[i + 1];
                if (/\w+\s*\+=\s*['"]/.test(nextLine)) {
                    const plusIndex = nextLine.indexOf('+=');
                    errors.push({
                        line: i + 1,
                        column: plusIndex,
                        severity: vscode.DiagnosticSeverity.Information,
                        message: "String concatenation in loop is inefficient. Consider using join() or f-strings",
                        code: 'string-concat-loop',
                        source: 'QuickSyntex',
                        quickFix: "Use list comprehension with join() or f-strings",
                        range: new vscode.Range(i + 1, 0, i + 1, nextLine.length)
                    });
                }
            }
            // Using len() on range
            if (/len\(range\(/.test(line)) {
                const lenIndex = line.indexOf('len(range');
                errors.push({
                    line: i,
                    column: lenIndex,
                    severity: vscode.DiagnosticSeverity.Information,
                    message: "Using len(range()) is unnecessary, use range directly",
                    code: 'unnecessary-len-range',
                    source: 'QuickSyntex',
                    quickFix: "Remove len() and use range directly",
                    range: new vscode.Range(i, 0, i, line.length)
                });
            }
        }
        return errors;
    }
    detectSecurityIssues(lines, document) {
        const errors = [];
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            // Use of eval()
            if (/\beval\s*\(/.test(line)) {
                const evalIndex = line.indexOf('eval');
                errors.push({
                    line: i,
                    column: evalIndex,
                    severity: vscode.DiagnosticSeverity.Warning,
                    message: "Using eval() can be dangerous. Consider safer alternatives",
                    code: 'eval-usage',
                    source: 'QuickSyntex',
                    quickFix: "Use ast.literal_eval() for safe evaluation or find alternative approach",
                    range: new vscode.Range(i, 0, i, line.length)
                });
            }
            // Use of exec()
            if (/\bexec\s*\(/.test(line)) {
                const execIndex = line.indexOf('exec');
                errors.push({
                    line: i,
                    column: execIndex,
                    severity: vscode.DiagnosticSeverity.Warning,
                    message: "Using exec() can be dangerous. Consider safer alternatives",
                    code: 'exec-usage',
                    source: 'QuickSyntex',
                    quickFix: "Find alternative approach without dynamic code execution",
                    range: new vscode.Range(i, 0, i, line.length)
                });
            }
            // Hardcoded passwords or secrets
            const secretPatterns = [
                /password\s*=\s*['"][^'"]+['"]/i,
                /secret\s*=\s*['"][^'"]+['"]/i,
                /api_key\s*=\s*['"][^'"]+['"]/i,
                /token\s*=\s*['"][^'"]+['"]/i
            ];
            for (const pattern of secretPatterns) {
                if (pattern.test(line)) {
                    errors.push({
                        line: i,
                        column: 0,
                        severity: vscode.DiagnosticSeverity.Warning,
                        message: "Hardcoded secret detected. Use environment variables instead",
                        code: 'hardcoded-secret',
                        source: 'QuickSyntex',
                        quickFix: "Use os.environ.get() or environment variables",
                        range: new vscode.Range(i, 0, i, line.length)
                    });
                    break;
                }
            }
        }
        return errors;
    }
    detectBestPracticeViolations(lines, document) {
        const errors = [];
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            // Using global variables
            if (/^\s*global\s+\w+/.test(line)) {
                const globalIndex = line.indexOf('global');
                errors.push({
                    line: i,
                    column: globalIndex,
                    severity: vscode.DiagnosticSeverity.Information,
                    message: "Consider avoiding global variables. Use function parameters or class attributes",
                    code: 'global-usage',
                    source: 'QuickSyntex',
                    quickFix: "Refactor to avoid global variables",
                    range: new vscode.Range(i, 0, i, line.length)
                });
            }
            // Too many arguments in function definition
            const funcMatch = line.match(/def\s+\w+\(([^)]+)\)/);
            if (funcMatch) {
                const args = funcMatch[1].split(',').filter(arg => arg.trim().length > 0);
                if (args.length > 5) {
                    const defIndex = line.indexOf('def');
                    errors.push({
                        line: i,
                        column: defIndex,
                        severity: vscode.DiagnosticSeverity.Information,
                        message: `Function has ${args.length} parameters. Consider reducing complexity`,
                        code: 'too-many-args',
                        source: 'QuickSyntex',
                        quickFix: "Group related parameters into objects or reduce parameter count",
                        range: new vscode.Range(i, 0, i, line.length)
                    });
                }
            }
            // Long lines (>79 characters)
            if (line.length > 79) {
                errors.push({
                    line: i,
                    column: 79,
                    severity: vscode.DiagnosticSeverity.Information,
                    message: "Line too long (>79 characters). Consider breaking into multiple lines",
                    code: 'line-too-long',
                    source: 'QuickSyntex',
                    quickFix: "Break line into multiple lines",
                    range: new vscode.Range(i, 79, i, line.length)
                });
            }
        }
        return errors;
    }
    detectTypeHintIssues(lines, document) {
        const errors = [];
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            // Function without type hints
            if (/^\s*def\s+\w+\([^)]*\)\s*:/.test(line) && !line.includes('->')) {
                const funcMatch = line.match(/def\s+(\w+)/);
                if (funcMatch) {
                    const funcName = funcMatch[1];
                    if (!funcName.startsWith('_')) { // Skip private methods
                        const defIndex = line.indexOf('def');
                        errors.push({
                            line: i,
                            column: defIndex,
                            severity: vscode.DiagnosticSeverity.Information,
                            message: "Consider adding type hints for better code documentation",
                            code: 'missing-type-hints',
                            source: 'QuickSyntex',
                            quickFix: "Add type hints to function parameters and return type",
                            range: new vscode.Range(i, 0, i, line.length)
                        });
                    }
                }
            }
            // Using old-style type hints (Python < 3.9)
            if (/typing\.(List|Dict|Tuple|Set)\[/.test(line)) {
                const typingIndex = line.indexOf('typing.');
                errors.push({
                    line: i,
                    column: typingIndex,
                    severity: vscode.DiagnosticSeverity.Information,
                    message: "Consider using built-in generic types (list, dict, tuple, set) in Python 3.9+",
                    code: 'old-style-typing',
                    source: 'QuickSyntex',
                    quickFix: "Replace typing.List with list, typing.Dict with dict, etc.",
                    range: new vscode.Range(i, 0, i, line.length)
                });
            }
        }
        return errors;
    }
    detectImportIssues(lines, document) {
        const errors = [];
        const imports = [];
        let firstNonImport = -1;
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmed = line.trim();
            if (trimmed.startsWith('import ') || trimmed.startsWith('from ')) {
                imports.push(trimmed);
                // Import not at top of file
                if (firstNonImport !== -1 && firstNonImport < i) {
                    errors.push({
                        line: i,
                        column: 0,
                        severity: vscode.DiagnosticSeverity.Information,
                        message: "Imports should be at the top of the file",
                        code: 'import-position',
                        source: 'QuickSyntex',
                        quickFix: "Move import to top of file",
                        range: new vscode.Range(i, 0, i, line.length)
                    });
                }
                // Star imports
                if (trimmed.includes('import *')) {
                    const starIndex = line.indexOf('*');
                    errors.push({
                        line: i,
                        column: starIndex,
                        severity: vscode.DiagnosticSeverity.Warning,
                        message: "Avoid star imports. Import specific names instead",
                        code: 'star-import',
                        source: 'QuickSyntex',
                        quickFix: "Import specific names instead of using *",
                        range: new vscode.Range(i, 0, i, line.length)
                    });
                }
                // Unused imports (basic detection)
                const importMatch = trimmed.match(/import\s+(\w+)/);
                if (importMatch) {
                    const importName = importMatch[1];
                    const documentText = document.getText();
                    const regex = new RegExp(`\\b${importName}\\b`, 'g');
                    const matches = documentText.match(regex);
                    const usageCount = matches ? matches.length : 0;
                    if (usageCount === 1) { // Only appears in import statement
                        errors.push({
                            line: i,
                            column: 0,
                            severity: vscode.DiagnosticSeverity.Information,
                            message: `Unused import: ${importName}`,
                            code: 'unused-import',
                            source: 'QuickSyntex',
                            quickFix: "Remove unused import",
                            range: new vscode.Range(i, 0, i, line.length)
                        });
                    }
                }
            }
            else if (trimmed && !trimmed.startsWith('#') && firstNonImport === -1) {
                firstNonImport = i;
            }
        }
        return errors;
    }
    detectDocumentationIssues(lines, document) {
        const errors = [];
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            // Function without docstring
            if (/^\s*def\s+\w+\([^)]*\)\s*:/.test(line)) {
                const funcMatch = line.match(/def\s+(\w+)/);
                const nextLine = i + 1 < lines.length ? lines[i + 1].trim() : '';
                if (funcMatch) {
                    const funcName = funcMatch[1];
                    if (!funcName.startsWith('_') && !nextLine.startsWith('"""') && !nextLine.startsWith("'''")) {
                        const defIndex = line.indexOf('def');
                        errors.push({
                            line: i,
                            column: defIndex,
                            severity: vscode.DiagnosticSeverity.Information,
                            message: "Public function missing docstring",
                            code: 'missing-docstring',
                            source: 'QuickSyntex',
                            quickFix: "Add docstring describing function purpose, parameters, and return value",
                            range: new vscode.Range(i, 0, i, line.length)
                        });
                    }
                }
            }
            // Class without docstring
            if (/^\s*class\s+\w+/.test(line)) {
                const nextLine = i + 1 < lines.length ? lines[i + 1].trim() : '';
                if (!nextLine.startsWith('"""') && !nextLine.startsWith("'''")) {
                    const classIndex = line.indexOf('class');
                    errors.push({
                        line: i,
                        column: classIndex,
                        severity: vscode.DiagnosticSeverity.Information,
                        message: "Class missing docstring",
                        code: 'missing-class-docstring',
                        source: 'QuickSyntex',
                        quickFix: "Add docstring describing class purpose and usage",
                        range: new vscode.Range(i, 0, i, line.length)
                    });
                }
            }
        }
        return errors;
    }
    updateDiagnostics(document, errors) {
        const diagnostics = errors.map(error => {
            const diagnostic = new vscode.Diagnostic(error.range, error.message, error.severity);
            diagnostic.code = error.code;
            diagnostic.source = error.source;
            return diagnostic;
        });
        this.diagnosticCollection.set(document.uri, diagnostics);
    }
    dispose() {
        this.diagnosticCollection.dispose();
    }
}
exports.EnhancedPythonErrorDetector = EnhancedPythonErrorDetector;
// Code Action Provider for Quick Fixes
class PythonQuickFixProvider {
    provideCodeActions(document, range, context, token) {
        const actions = [];
        for (const diagnostic of context.diagnostics) {
            if (diagnostic.source === 'QuickSyntex') {
                const action = this.createQuickFix(document, diagnostic);
                if (action) {
                    actions.push(action);
                }
            }
        }
        return actions;
    }
    createQuickFix(document, diagnostic) {
        const line = document.lineAt(diagnostic.range.start.line);
        const lineText = line.text;
        switch (diagnostic.code) {
            case 'missing-colon':
                return this.fixMissingColon(document, diagnostic, lineText);
            case 'assignment-in-condition':
                return this.fixAssignmentInCondition(document, diagnostic, lineText);
            case 'print-function':
                return this.fixPrintFunction(document, diagnostic, lineText);
            case 'incorrect-is-usage':
                return this.fixIncorrectIsUsage(document, diagnostic, lineText);
            case 'mixed-indentation':
                return this.fixMixedIndentation(document, diagnostic);
            case 'function-naming':
                return this.fixFunctionNaming(document, diagnostic, lineText);
            case 'class-naming':
                return this.fixClassNaming(document, diagnostic, lineText);
            case 'bare-except':
                return this.fixBareExcept(document, diagnostic, lineText);
            case 'none-comparison':
                return this.fixNoneComparison(document, diagnostic, lineText);
            case 'unused-import':
                return this.fixUnusedImport(document, diagnostic);
            case 'star-import':
                return this.fixStarImport(document, diagnostic, lineText);
            default:
                return null;
        }
    }
    fixMissingColon(document, diagnostic, lineText) {
        const action = new vscode.CodeAction('Add missing colon', vscode.CodeActionKind.QuickFix);
        const edit = new vscode.WorkspaceEdit();
        const range = new vscode.Range(diagnostic.range.start.line, lineText.trimEnd().length, diagnostic.range.start.line, lineText.trimEnd().length);
        edit.replace(document.uri, range, ':');
        action.edit = edit;
        return action;
    }
    fixAssignmentInCondition(document, diagnostic, lineText) {
        const action = new vscode.CodeAction("Replace '=' with '=='", vscode.CodeActionKind.QuickFix);
        const edit = new vscode.WorkspaceEdit();
        const newText = lineText.replace(/\s*=\s*(?!=)/, ' == ');
        const range = new vscode.Range(diagnostic.range.start.line, 0, diagnostic.range.start.line, lineText.length);
        edit.replace(document.uri, range, newText);
        action.edit = edit;
        return action;
    }
    fixPrintFunction(document, diagnostic, lineText) {
        const action = new vscode.CodeAction('Add parentheses to print', vscode.CodeActionKind.QuickFix);
        const edit = new vscode.WorkspaceEdit();
        const newText = lineText.replace(/print\s+(.+)/, 'print($1)');
        const range = new vscode.Range(diagnostic.range.start.line, 0, diagnostic.range.start.line, lineText.length);
        edit.replace(document.uri, range, newText);
        action.edit = edit;
        return action;
    }
    fixIncorrectIsUsage(document, diagnostic, lineText) {
        const action = new vscode.CodeAction("Replace 'is' with '=='", vscode.CodeActionKind.QuickFix);
        const edit = new vscode.WorkspaceEdit();
        const newText = lineText.replace(/\bis\b/g, '==');
        const range = new vscode.Range(diagnostic.range.start.line, 0, diagnostic.range.start.line, lineText.length);
        edit.replace(document.uri, range, newText);
        action.edit = edit;
        return action;
    }
    fixMixedIndentation(document, diagnostic) {
        const action = new vscode.CodeAction('Convert tabs to spaces', vscode.CodeActionKind.QuickFix);
        const edit = new vscode.WorkspaceEdit();
        const line = document.lineAt(diagnostic.range.start.line);
        const newText = line.text.replace(/\t/g, '    ');
        edit.replace(document.uri, line.range, newText);
        action.edit = edit;
        return action;
    }
    fixFunctionNaming(document, diagnostic, lineText) {
        const action = new vscode.CodeAction('Convert to snake_case', vscode.CodeActionKind.QuickFix);
        const edit = new vscode.WorkspaceEdit();
        const match = lineText.match(/def\s+([A-Z][a-zA-Z0-9_]*)/);
        if (match) {
            const oldName = match[1];
            const newName = oldName.replace(/([A-Z])/g, '_$1').toLowerCase().substring(1);
            const newText = lineText.replace(oldName, newName);
            const range = new vscode.Range(diagnostic.range.start.line, 0, diagnostic.range.start.line, lineText.length);
            edit.replace(document.uri, range, newText);
        }
        action.edit = edit;
        return action;
    }
    fixClassNaming(document, diagnostic, lineText) {
        const action = new vscode.CodeAction('Convert to PascalCase', vscode.CodeActionKind.QuickFix);
        const edit = new vscode.WorkspaceEdit();
        const match = lineText.match(/class\s+([a-z][a-zA-Z0-9_]*)/);
        if (match) {
            const oldName = match[1];
            const newName = oldName.charAt(0).toUpperCase() + oldName.slice(1);
            const newText = lineText.replace(oldName, newName);
            const range = new vscode.Range(diagnostic.range.start.line, 0, diagnostic.range.start.line, lineText.length);
            edit.replace(document.uri, range, newText);
        }
        action.edit = edit;
        return action;
    }
    fixBareExcept(document, diagnostic, lineText) {
        const action = new vscode.CodeAction('Add Exception type', vscode.CodeActionKind.QuickFix);
        const edit = new vscode.WorkspaceEdit();
        const newText = lineText.replace(/except\s*:/, 'except Exception:');
        const range = new vscode.Range(diagnostic.range.start.line, 0, diagnostic.range.start.line, lineText.length);
        edit.replace(document.uri, range, newText);
        action.edit = edit;
        return action;
    }
    fixNoneComparison(document, diagnostic, lineText) {
        const action = new vscode.CodeAction("Use 'is None' instead", vscode.CodeActionKind.QuickFix);
        const edit = new vscode.WorkspaceEdit();
        const newText = lineText.replace(/==\s*None/, 'is None').replace(/None\s*==/, 'None is');
        const range = new vscode.Range(diagnostic.range.start.line, 0, diagnostic.range.start.line, lineText.length);
        edit.replace(document.uri, range, newText);
        action.edit = edit;
        return action;
    }
    fixUnusedImport(document, diagnostic) {
        const action = new vscode.CodeAction('Remove unused import', vscode.CodeActionKind.QuickFix);
        const edit = new vscode.WorkspaceEdit();
        const line = document.lineAt(diagnostic.range.start.line);
        edit.delete(document.uri, line.rangeIncludingLineBreak);
        action.edit = edit;
        return action;
    }
    fixStarImport(document, diagnostic, lineText) {
        const action = new vscode.CodeAction('Convert to specific imports', vscode.CodeActionKind.QuickFix);
        const edit = new vscode.WorkspaceEdit();
        const newText = `# TODO: Replace * import with specific imports\n${lineText}`;
        const range = new vscode.Range(diagnostic.range.start.line, 0, diagnostic.range.start.line, lineText.length);
        edit.replace(document.uri, range, newText);
        action.edit = edit;
        return action;
    }
}
exports.PythonQuickFixProvider = PythonQuickFixProvider;
// Additional Advanced Error Detection Methods
class AdvancedPythonAnalyzer {
    // Detect code complexity issues
    detectComplexityIssues(lines, document) {
        const errors = [];
        let cyclomaticComplexity = 1; // Base complexity
        let currentFunction = '';
        let functionStartLine = -1;
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            // Track function definitions
            const funcMatch = line.match(/^\s*def\s+(\w+)/);
            if (funcMatch) {
                // Report complexity of previous function if high
                if (cyclomaticComplexity > 10 && currentFunction && functionStartLine !== -1) {
                    errors.push({
                        line: functionStartLine,
                        column: 0,
                        severity: vscode.DiagnosticSeverity.Warning,
                        message: `Function '${currentFunction}' has high cyclomatic complexity (${cyclomaticComplexity}). Consider refactoring.`,
                        code: 'high-complexity',
                        source: 'QuickSyntex',
                        quickFix: 'Break function into smaller functions',
                        range: new vscode.Range(functionStartLine, 0, functionStartLine, lines[functionStartLine].length)
                    });
                }
                // Reset for new function
                currentFunction = funcMatch[1];
                functionStartLine = i;
                cyclomaticComplexity = 1;
            }
            // Count complexity-increasing constructs
            const complexityPatterns = [
                /\bif\b/, /\belif\b/, /\belse\b/, /\bfor\b/, /\bwhile\b/,
                /\btry\b/, /\bexcept\b/, /\band\b/, /\bor\b/
            ];
            for (const pattern of complexityPatterns) {
                if (pattern.test(line)) {
                    cyclomaticComplexity++;
                }
            }
            // Deeply nested code
            const indentLevel = Math.floor(line.search(/\S/) / 4); // Assuming 4-space indents
            if (indentLevel > 4) {
                errors.push({
                    line: i,
                    column: 0,
                    severity: vscode.DiagnosticSeverity.Information,
                    message: `Deep nesting level (${indentLevel}). Consider extracting to separate functions.`,
                    code: 'deep-nesting',
                    source: 'QuickSyntex',
                    quickFix: 'Extract nested code to separate functions',
                    range: new vscode.Range(i, 0, i, line.length)
                });
            }
        }
        return errors;
    }
    // Detect potential memory and resource leaks
    detectResourceIssues(lines, document) {
        const errors = [];
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            // File operations without context manager
            if (/open\s*\(/.test(line) && !/with\s+open/.test(line)) {
                const openIndex = line.indexOf('open');
                errors.push({
                    line: i,
                    column: openIndex,
                    severity: vscode.DiagnosticSeverity.Warning,
                    message: 'Use context manager (with statement) for file operations',
                    code: 'file-without-context',
                    source: 'QuickSyntex',
                    quickFix: 'Use "with open(...) as file:" pattern',
                    range: new vscode.Range(i, 0, i, line.length)
                });
            }
            // Large list comprehensions that could be generators
            if (/\[.{50,}for\s+.*in\s+.*\]/.test(line)) {
                errors.push({
                    line: i,
                    column: 0,
                    severity: vscode.DiagnosticSeverity.Information,
                    message: 'Large list comprehension. Consider using generator expression for memory efficiency',
                    code: 'large-list-comp',
                    source: 'QuickSyntex',
                    quickFix: 'Replace [] with () to create generator expression',
                    range: new vscode.Range(i, 0, i, line.length)
                });
            }
            // Memory-intensive operations in loops
            if (/for\s+.*in\s+range\(.*\):/.test(line) && i + 1 < lines.length) {
                const nextLine = lines[i + 1];
                if (/\.append\(/.test(nextLine) || /\+=/.test(nextLine)) {
                    errors.push({
                        line: i,
                        column: 0,
                        severity: vscode.DiagnosticSeverity.Information,
                        message: 'Consider using list comprehension or pre-allocating list size',
                        code: 'inefficient-loop',
                        source: 'QuickSyntex',
                        quickFix: 'Use list comprehension or pre-allocate list',
                        range: new vscode.Range(i, 0, i + 1, nextLine.length)
                    });
                }
            }
        }
        return errors;
    }
    // Detect testing and debugging issues
    detectTestingIssues(lines, document) {
        const errors = [];
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            // TODO comments that might indicate incomplete code
            const todoMatch = line.match(/(TODO|FIXME|HACK|XXX)/);
            if (todoMatch) {
                const todoIndex = line.indexOf(todoMatch[1]);
                errors.push({
                    line: i,
                    column: todoIndex,
                    severity: vscode.DiagnosticSeverity.Information,
                    message: 'TODO/FIXME comment found. Consider addressing before production',
                    code: 'todo-comment',
                    source: 'QuickSyntex',
                    quickFix: 'Address TODO item or remove comment',
                    range: new vscode.Range(i, 0, i, line.length)
                });
            }
            // Debug print statements
            const lowerLine = line.toLowerCase();
            if (/print\s*\(\s*['"].*debug.*['"]/.test(lowerLine) ||
                /print\s*\(\s*f['"].*{.*}.*['"]/.test(line)) {
                const printIndex = line.indexOf('print');
                errors.push({
                    line: i,
                    column: printIndex,
                    severity: vscode.DiagnosticSeverity.Information,
                    message: 'Debug print statement found. Consider using logging instead',
                    code: 'debug-print',
                    source: 'QuickSyntex',
                    quickFix: 'Replace with proper logging or remove',
                    range: new vscode.Range(i, 0, i, line.length)
                });
            }
            // Magic numbers (numbers other than 0, 1, -1)
            const numberMatches = line.match(/\b(\d{2,})\b/g);
            if (numberMatches) {
                for (const match of numberMatches) {
                    const num = parseInt(match, 10);
                    if (num > 1 && !line.includes('range(') && !line.includes('len(')) {
                        const numIndex = line.indexOf(match);
                        errors.push({
                            line: i,
                            column: numIndex,
                            severity: vscode.DiagnosticSeverity.Information,
                            message: `Magic number detected: ${match}. Consider using named constant`,
                            code: 'magic-number',
                            source: 'QuickSyntex',
                            quickFix: 'Replace with named constant',
                            range: new vscode.Range(i, numIndex, i, numIndex + match.length)
                        });
                    }
                }
            }
        }
        return errors;
    }
}
exports.AdvancedPythonAnalyzer = AdvancedPythonAnalyzer;
//# sourceMappingURL=errorDetection.js.map