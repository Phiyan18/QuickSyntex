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
// Enhanced QuickSyntex Extension Main File
const vscode = __importStar(require("vscode"));
const errorDetection_js_1 = require("./errorDetection.js");
function activate(context) {
    console.log('QuickSyntex Enhanced Python Extension is now active!');
    // Initialize error detector and analyzer
    const errorDetector = new errorDetection_js_1.EnhancedPythonErrorDetector();
    const quickFixProvider = new errorDetection_js_1.PythonQuickFixProvider();
    const advancedAnalyzer = new errorDetection_js_1.AdvancedPythonAnalyzer();
    // Register code action provider for quick fixes
    const codeActionProvider = vscode.languages.registerCodeActionsProvider({ language: 'python', scheme: 'file' }, quickFixProvider);
    // Real-time error detection on document change
    const onDidChangeTextDocument = vscode.workspace.onDidChangeTextDocument(async (event) => {
        if (event.document.languageId === 'python') {
            await analyzeDocument(event.document, errorDetector, advancedAnalyzer);
        }
    });
    // Error detection on document open
    const onDidOpenTextDocument = vscode.workspace.onDidOpenTextDocument(async (document) => {
        if (document.languageId === 'python') {
            await analyzeDocument(document, errorDetector, advancedAnalyzer);
        }
    });
    // Command to manually check syntax
    const checkSyntaxCommand = vscode.commands.registerCommand('quicksyntex.checkSyntax', async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor && editor.document.languageId === 'python') {
            await analyzeDocument(editor.document, errorDetector, advancedAnalyzer);
            vscode.window.showInformationMessage('Python syntax check completed!');
        }
        else {
            vscode.window.showWarningMessage('Please open a Python file first.');
        }
    });
    // Command to format Python code
    const formatCodeCommand = vscode.commands.registerCommand('quicksyntex.formatCode', async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor && editor.document.languageId === 'python') {
            await formatPythonCode(editor);
            vscode.window.showInformationMessage('Python code formatted!');
        }
        else {
            vscode.window.showWarningMessage('Please open a Python file first.');
        }
    });
    // Command to generate comprehensive error report
    const generateReportCommand = vscode.commands.registerCommand('quicksyntex.generateReport', async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor && editor.document.languageId === 'python') {
            await generateErrorReport(editor.document, errorDetector, advancedAnalyzer);
        }
        else {
            vscode.window.showWarningMessage('Please open a Python file first.');
        }
    });
    // Command to apply all quick fixes
    const applyAllFixesCommand = vscode.commands.registerCommand('quicksyntex.applyAllFixes', async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor && editor.document.languageId === 'python') {
            await applyAllQuickFixes(editor.document, quickFixProvider);
        }
        else {
            vscode.window.showWarningMessage('Please open a Python file first.');
        }
    });
    // Enhanced hover provider
    const hoverProvider = vscode.languages.registerHoverProvider('python', {
        provideHover(document, position, token) {
            return providePythonHover(document, position);
        }
    });
    // Enhanced completion provider
    const completionProvider = vscode.languages.registerCompletionItemProvider('python', {
        provideCompletionItems(document, position, token, context) {
            return providePythonCompletions(document, position);
        }
    }, '.', ' ');
    // Signature help provider
    const signatureProvider = vscode.languages.registerSignatureHelpProvider('python', {
        provideSignatureHelp(document, position, token, context) {
            return providePythonSignatureHelp(document, position);
        }
    }, '(', ',');
    // Add all disposables to context
    context.subscriptions.push(codeActionProvider, onDidChangeTextDocument, onDidOpenTextDocument, checkSyntaxCommand, formatCodeCommand, generateReportCommand, applyAllFixesCommand, hoverProvider, completionProvider, signatureProvider, errorDetector);
    // Initialize for already open Python documents
    vscode.workspace.textDocuments.forEach(async (document) => {
        if (document.languageId === 'python') {
            await analyzeDocument(document, errorDetector, advancedAnalyzer);
        }
    });
}
async function analyzeDocument(document, errorDetector, advancedAnalyzer) {
    try {
        // Get configuration
        const config = vscode.workspace.getConfiguration('quicksyntex');
        const enableRealTime = config.get('enableRealTimeChecking', true);
        if (!enableRealTime)
            return;
        // Run comprehensive analysis
        const errors = await errorDetector.analyzeDocument(document);
        const lines = document.getText().split('\n');
        // Add advanced analysis
        const complexityErrors = advancedAnalyzer.detectComplexityIssues(lines, document);
        const resourceErrors = advancedAnalyzer.detectResourceIssues(lines, document);
        const testingErrors = advancedAnalyzer.detectTestingIssues(lines, document);
        // Combine all errors
        const allErrors = [...errors, ...complexityErrors, ...resourceErrors, ...testingErrors];
        // Update status bar
        updateStatusBar(allErrors);
    }
    catch (error) {
        console.error('Error analyzing document:', error);
    }
}
async function formatPythonCode(editor) {
    const document = editor.document;
    const text = document.getText();
    const lines = text.split('\n');
    // Basic formatting improvements
    const formattedLines = lines.map((line, index) => {
        let formatted = line;
        // Fix spacing around operators
        formatted = formatted.replace(/([a-zA-Z0-9_])\s*=\s*([a-zA-Z0-9_])/g, '$1 = $2');
        formatted = formatted.replace(/([a-zA-Z0-9_])\s*([+\-*/])\s*([a-zA-Z0-9_])/g, '$1 $2 $3');
        // Fix spacing after commas
        formatted = formatted.replace(/,(?!\s)/g, ', ');
        // Remove trailing whitespace
        formatted = formatted.trimEnd();
        return formatted;
    });
    const formattedText = formattedLines.join('\n');
    const fullRange = new vscode.Range(0, 0, document.lineCount, 0);
    await editor.edit(editBuilder => {
        editBuilder.replace(fullRange, formattedText);
    });
}
async function generateErrorReport(document, errorDetector, advancedAnalyzer) {
    const errors = await errorDetector.analyzeDocument(document);
    const lines = document.getText().split('\n');
    const complexityErrors = advancedAnalyzer.detectComplexityIssues(lines, document);
    const resourceErrors = advancedAnalyzer.detectResourceIssues(lines, document);
    const testingErrors = advancedAnalyzer.detectTestingIssues(lines, document);
    const allErrors = [...errors, ...complexityErrors, ...resourceErrors, ...testingErrors];
    // Group errors by type
    const errorGroups = {};
    allErrors.forEach(error => {
        if (!errorGroups[error.code]) {
            errorGroups[error.code] = [];
        }
        errorGroups[error.code].push(error);
    });
    // Generate report content
    let reportContent = `# QuickSyntex Error Report\n\n`;
    reportContent += `**File:** ${document.fileName}\n`;
    reportContent += `**Generated:** ${new Date().toLocaleString()}\n\n`;
    reportContent += `**Total Issues:** ${allErrors.length}\n\n`;
    // Summary by severity
    const errorCount = allErrors.filter(e => e.severity === vscode.DiagnosticSeverity.Error).length;
    const warningCount = allErrors.filter(e => e.severity === vscode.DiagnosticSeverity.Warning).length;
    const infoCount = allErrors.filter(e => e.severity === vscode.DiagnosticSeverity.Information).length;
    reportContent += `## Summary\n\n`;
    reportContent += `- 🔴 Errors: ${errorCount}\n`;
    reportContent += `- 🟡 Warnings: ${warningCount}\n`;
    reportContent += `- 🔵 Info: ${infoCount}\n\n`;
    // Detailed breakdown
    reportContent += `## Detailed Issues\n\n`;
    Object.entries(errorGroups).forEach(([code, groupErrors]) => {
        reportContent += `### ${code.replace('-', ' ').toUpperCase()}\n\n`;
        groupErrors.forEach(error => {
            const severityIcon = error.severity === vscode.DiagnosticSeverity.Error ? '🔴' :
                error.severity === vscode.DiagnosticSeverity.Warning ? '🟡' : '🔵';
            reportContent += `${severityIcon} **Line ${error.line + 1}:** ${error.message}\n`;
            if (error.quickFix) {
                reportContent += `   *Quick Fix:* ${error.quickFix}\n`;
            }
            reportContent += `\n`;
        });
    });
    // Show report in new document
    const reportDoc = await vscode.workspace.openTextDocument({
        content: reportContent,
        language: 'markdown'
    });
    await vscode.window.showTextDocument(reportDoc);
}
async function applyAllQuickFixes(document, quickFixProvider) {
    const diagnostics = vscode.languages.getDiagnostics(document.uri);
    const quickSyntexDiagnostics = diagnostics.filter(d => d.source === 'QuickSyntex');
    if (quickSyntexDiagnostics.length === 0) {
        vscode.window.showInformationMessage('No quick fixes available.');
        return;
    }
    const editor = vscode.window.activeTextEditor;
    if (!editor)
        return;
    let fixesApplied = 0;
    // Apply fixes in reverse order (bottom to top) to avoid line number shifts
    const sortedDiagnostics = quickSyntexDiagnostics.sort((a, b) => b.range.start.line - a.range.start.line);
    for (const diagnostic of sortedDiagnostics) {
        const context = {
            diagnostics: [diagnostic],
            only: undefined,
        };
        const actions = quickFixProvider.provideCodeActions(document, diagnostic.range, context, new vscode.CancellationTokenSource().token);
        if (actions && actions.length > 0) {
            const action = actions[0];
            if (action.edit) {
                await vscode.workspace.applyEdit(action.edit);
                fixesApplied++;
            }
        }
    }
    vscode.window.showInformationMessage(`Applied ${fixesApplied} quick fixes.`);
}
function providePythonHover(document, position) {
    const range = document.getWordRangeAtPosition(position);
    if (!range)
        return undefined;
    const word = document.getText(range);
    // Python keyword documentation
    const keywordDocs = {
        'def': 'Defines a function\n\n```python\ndef function_name(parameters):\n    """Optional docstring"""\n    # function body\n    return value\n```',
        'class': 'Defines a class\n\n```python\nclass ClassName(BaseClass):\n    """Optional docstring"""\n    def __init__(self, parameters):\n        # constructor\n```',
        'if': 'Conditional statement\n\n```python\nif condition:\n    # execute if true\nelif other_condition:\n    # execute if other_condition is true\nelse:\n    # execute if all conditions are false\n```',
        'for': 'For loop iteration\n\n```python\nfor item in iterable:\n    # process item\n\n# With range\nfor i in range(10):\n    # i goes from 0 to 9\n```',
        'while': 'While loop\n\n```python\nwhile condition:\n    # execute while condition is true\n    # remember to update condition to avoid infinite loop\n```',
        'try': 'Exception handling\n\n```python\ntry:\n    # code that might raise exception\nexcept SpecificException as e:\n    # handle specific exception\nexcept Exception as e:\n    # handle any other exception\nfinally:\n    # always executed\n```',
        'import': 'Import modules\n\n```python\n# Import entire module\nimport module_name\n\n# Import specific functions/classes\nfrom module_name import function_name, ClassName\n\n# Import with alias\nimport module_name as alias\n```',
        'lambda': 'Anonymous function\n\n```python\n# Basic lambda\nlambda x: x * 2\n\n# Lambda with multiple parameters\nlambda x, y: x + y\n\n# Used with map, filter, etc.\nmap(lambda x: x**2, [1, 2, 3, 4])\n```',
        'yield': 'Generator function\n\n```python\ndef generator_function():\n    yield value1\n    yield value2\n    # Creates an iterator\n```',
        'async': 'Asynchronous function\n\n```python\nasync def async_function():\n    result = await some_async_operation()\n    return result\n```',
        'with': 'Context manager\n\n```python\nwith open("file.txt") as f:\n    content = f.read()\n    # file automatically closed\n\nwith resource_manager() as resource:\n    # use resource\n    # resource automatically cleaned up\n```'
    };
    if (keywordDocs[word]) {
        return new vscode.Hover(new vscode.MarkdownString(keywordDocs[word]));
    }
    // Built-in function documentation
    const builtinDocs = {
        'print': 'Print objects to stdout\n\n```python\nprint(*values, sep=" ", end="\\n", file=sys.stdout, flush=False)\n```',
        'len': 'Return the length of an object\n\n```python\nlen(sequence)  # Returns integer length\n```',
        'range': 'Create a sequence of numbers\n\n```python\nrange(stop)\nrange(start, stop)\nrange(start, stop, step)\n```',
        'enumerate': 'Add counter to iterable\n\n```python\nfor index, value in enumerate(iterable, start=0):\n    # index starts from start (default 0)\n```',
        'zip': 'Combine multiple iterables\n\n```python\nfor item1, item2 in zip(list1, list2):\n    # process pairs\n```',
        'isinstance': 'Check if object is instance of class\n\n```python\nisinstance(obj, class_or_tuple)\n# Returns True/False\n```',
        'hasattr': 'Check if object has attribute\n\n```python\nhasattr(obj, "attribute_name")\n# Returns True/False\n```'
    };
    if (builtinDocs[word]) {
        return new vscode.Hover(new vscode.MarkdownString(builtinDocs[word]));
    }
    return undefined;
}
function providePythonCompletions(document, position) {
    const completions = [];
    // Get current line text
    const lineText = document.lineAt(position).text;
    const lineTillCursor = lineText.substr(0, position.character);
    // Enhanced completions based on context
    if (lineTillCursor.trim() === '') {
        // At beginning of line - suggest control structures
        completions.push(createSnippetCompletion('def', 'Function definition', 'def ${1:function_name}(${2:parameters}):\n    """${3:Description}\n    \n    Args:\n        ${2:parameters}: ${4:Description}\n        \n    Returns:\n        ${5:Description}\n    """\n    ${0:pass}'), createSnippetCompletion('class', 'Class definition', 'class ${1:ClassName}${2:(${3:BaseClass})}:\n    """${4:Class description}\n    \n    Attributes:\n        ${5:attribute}: ${6:Description}\n    """\n    \n    def __init__(self${7:, parameters}):\n        """Initialize ${1:ClassName}\n        \n        Args:\n            ${7:parameters}: ${8:Description}\n        """\n        ${0:pass}'), createSnippetCompletion('if', 'If statement', 'if ${1:condition}:\n    ${0:pass}'), createSnippetCompletion('for', 'For loop', 'for ${1:item} in ${2:iterable}:\n    ${0:pass}'), createSnippetCompletion('while', 'While loop', 'while ${1:condition}:\n    ${0:pass}'), createSnippetCompletion('try', 'Try-except block', 'try:\n    ${1:pass}\nexcept ${2:Exception} as ${3:e}:\n    ${4:pass}\n${0}'));
    }
    // Context-aware completions
    if (lineTillCursor.includes('import ')) {
        // Common imports
        const commonImports = [
            'os', 'sys', 'json', 'datetime', 'collections', 'itertools',
            'functools', 'pathlib', 'typing', 'dataclasses', 'enum',
            'logging', 'unittest', 'pytest', 'numpy', 'pandas', 'requests'
        ];
        commonImports.forEach(imp => {
            const item = new vscode.CompletionItem(imp, vscode.CompletionItemKind.Module);
            item.detail = `Import ${imp} module`;
            completions.push(item);
        });
    }
    if (lineTillCursor.includes('.')) {
        // Method completions for common objects
        const commonMethods = [
            { name: 'append', detail: 'Add item to end of list', kind: vscode.CompletionItemKind.Method },
            { name: 'extend', detail: 'Extend list with iterable', kind: vscode.CompletionItemKind.Method },
            { name: 'insert', detail: 'Insert item at index', kind: vscode.CompletionItemKind.Method },
            { name: 'remove', detail: 'Remove first occurrence of item', kind: vscode.CompletionItemKind.Method },
            { name: 'pop', detail: 'Remove and return item at index', kind: vscode.CompletionItemKind.Method },
            { name: 'index', detail: 'Find index of item', kind: vscode.CompletionItemKind.Method },
            { name: 'count', detail: 'Count occurrences of item', kind: vscode.CompletionItemKind.Method },
            { name: 'sort', detail: 'Sort list in place', kind: vscode.CompletionItemKind.Method },
            { name: 'reverse', detail: 'Reverse list in place', kind: vscode.CompletionItemKind.Method },
            { name: 'split', detail: 'Split string into list', kind: vscode.CompletionItemKind.Method },
            { name: 'join', detail: 'Join list into string', kind: vscode.CompletionItemKind.Method },
            { name: 'strip', detail: 'Remove whitespace', kind: vscode.CompletionItemKind.Method },
            { name: 'replace', detail: 'Replace substring', kind: vscode.CompletionItemKind.Method },
            { name: 'startswith', detail: 'Check if starts with substring', kind: vscode.CompletionItemKind.Method },
            { name: 'endswith', detail: 'Check if ends with substring', kind: vscode.CompletionItemKind.Method }
        ];
        commonMethods.forEach(method => {
            const item = new vscode.CompletionItem(method.name, method.kind);
            item.detail = method.detail;
            completions.push(item);
        });
    }
    // Add Python keywords
    const keywords = [
        'and', 'as', 'assert', 'break', 'continue', 'def', 'del', 'elif', 'else',
        'except', 'False', 'finally', 'for', 'from', 'global', 'if', 'import',
        'in', 'is', 'lambda', 'None', 'nonlocal', 'not', 'or', 'pass', 'raise',
        'return', 'True', 'try', 'while', 'with', 'yield'
    ];
    keywords.forEach(keyword => {
        const item = new vscode.CompletionItem(keyword, vscode.CompletionItemKind.Keyword);
        completions.push(item);
    });
    // Add built-in functions
    const builtins = [
        'abs', 'all', 'any', 'bin', 'bool', 'bytearray', 'bytes', 'callable',
        'chr', 'classmethod', 'compile', 'complex', 'delattr', 'dict', 'dir',
        'divmod', 'enumerate', 'eval', 'exec', 'filter', 'float', 'format',
        'frozenset', 'getattr', 'globals', 'hasattr', 'hash', 'help', 'hex',
        'id', 'input', 'int', 'isinstance', 'issubclass', 'iter', 'len',
        'list', 'locals', 'map', 'max', 'memoryview', 'min', 'next', 'object',
        'oct', 'open', 'ord', 'pow', 'print', 'property', 'range', 'repr',
        'reversed', 'round', 'set', 'setattr', 'slice', 'sorted', 'staticmethod',
        'str', 'sum', 'super', 'tuple', 'type', 'vars', 'zip'
    ];
    builtins.forEach(builtin => {
        const item = new vscode.CompletionItem(builtin, vscode.CompletionItemKind.Function);
        completions.push(item);
    });
    return completions;
}
function createSnippetCompletion(label, detail, snippet) {
    const item = new vscode.CompletionItem(label, vscode.CompletionItemKind.Snippet);
    item.detail = detail;
    item.insertText = new vscode.SnippetString(snippet);
    return item;
}
function providePythonSignatureHelp(document, position) {
    const line = document.lineAt(position.line).text;
    const beforeCursor = line.substring(0, position.character);
    // Find function call
    const match = beforeCursor.match(/(\w+)\s*\(/);
    if (!match)
        return undefined;
    const functionName = match[1];
    // Built-in function signatures
    const signatures = {
        'print': new vscode.SignatureInformation('print(*values, sep=" ", end="\\n", file=sys.stdout, flush=False)', 'Print values to stdout'),
        'len': new vscode.SignatureInformation('len(obj)', 'Return the number of items in a container'),
        'range': new vscode.SignatureInformation('range(start, stop[, step])', 'Create an arithmetic progression of integers'),
        'enumerate': new vscode.SignatureInformation('enumerate(iterable, start=0)', 'Return an enumerate object'),
        'zip': new vscode.SignatureInformation('zip(*iterables)', 'Return a zip object whose __next__ method returns a tuple'),
        'open': new vscode.SignatureInformation('open(file, mode="r", buffering=-1, encoding=None, errors=None, newline=None, closefd=True, opener=None)', 'Open file and return a stream')
    };
    if (signatures[functionName]) {
        const signatureHelp = new vscode.SignatureHelp();
        signatureHelp.signatures = [signatures[functionName]];
        signatureHelp.activeSignature = 0;
        // Try to determine active parameter
        const commaCount = (beforeCursor.match(/,/g) || []).length;
        signatureHelp.activeParameter = commaCount;
        return signatureHelp;
    }
    return undefined;
}
function updateStatusBar(errors) {
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    const errorCount = errors.filter(e => e.severity === vscode.DiagnosticSeverity.Error).length;
    const warningCount = errors.filter(e => e.severity === vscode.DiagnosticSeverity.Warning).length;
    const infoCount = errors.filter(e => e.severity === vscode.DiagnosticSeverity.Information).length;
    if (errorCount > 0) {
        statusBarItem.text = `$(error) ${errorCount} $(warning) ${warningCount}`;
        statusBarItem.color = new vscode.ThemeColor('errorForeground');
    }
    else if (warningCount > 0) {
        statusBarItem.text = `$(warning) ${warningCount} $(info) ${infoCount}`;
        statusBarItem.color = new vscode.ThemeColor('warningForeground');
    }
    else if (infoCount > 0) {
        statusBarItem.text = `$(info) ${infoCount}`;
        statusBarItem.color = new vscode.ThemeColor('foreground');
    }
    else {
        statusBarItem.text = `$(check) No issues`;
        statusBarItem.color = new vscode.ThemeColor('foreground');
    }
    statusBarItem.tooltip = 'QuickSyntex: Click to generate report';
    statusBarItem.command = 'quicksyntex.generateReport';
    statusBarItem.show();
}
function deactivate() {
    console.log('QuickSyntex Enhanced Python Extension is now deactivated!');
}
//# sourceMappingURL=extension.js.map