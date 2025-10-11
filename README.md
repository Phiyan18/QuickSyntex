# Python Syntax Helper
<img width="409" height="424" alt="ELEMENTS_PVT_LTD_LOGO" src="https://github.com/user-attachments/assets/963d2c14-0924-4ff8-a13b-b3ef3903109c" />

A powerful Visual Studio Code extension that enhances Python development with advanced syntax assistance, error detection, and intelligent code completion.

## Features

### 🔍 Real-time Syntax Checking
- Detects common Python syntax errors as you type
- Highlights indentation issues (mixed tabs/spaces)
- Identifies missing colons in control structures
- Catches unmatched brackets, parentheses, and braces

### ✨ Enhanced Code Completion
- Intelligent keyword suggestions
- Common Python patterns and snippets
- Context-aware completions
- Built-in Python constructs

### 🛠️ Code Formatting
- Automatic indentation correction
- Consistent code style enforcement
- Smart formatting for Python control structures

### 📚 Syntax Help
- Hover over keywords for syntax reminders
- Inline documentation for Python constructs
- Quick reference for common patterns

### 🎯 Code Snippets
- Comprehensive collection of Python snippets
- Function and class templates with docstrings
- Control flow structures (if/else, loops, try/except)
- List/dictionary comprehensions
- Property decorators and more

## Installation

1. Open Visual Studio Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "Python Syntax Helper"
4. Click Install

Or install from the command line:
```bash
code --install-extension QuickSyntex
```

## Usage

### Commands

- **Check Python Syntax** (`Ctrl+Shift+P`): Manually check syntax for the current file
- **Format Python Code**: Auto-format the current Python file

### Configuration

Access settings via File → Preferences → Settings, then search for "Python Syntax Helper":

- `pythonSyntaxHelper.enableRealTimeChecking`: Enable/disable real-time syntax checking (default: true)
- `pythonSyntaxHelper.highlightLevel`: Set syntax highlighting level (basic/enhanced/detailed)

### Snippets

Type the following prefixes and press Tab to expand:

| Prefix | Description |
|--------|-------------|
| `def` | Function definition with docstring |
| `class` | Class definition with constructor |
| `if` | If statement |
| `ifelse` | If-else statement |
| `for` | For loop |
| `forr` | For loop with range |
| `while` | While loop |
| `try` | Try-except block |
| `tryf` | Try-except-finally block |
| `with` | With statement |
| `lc` | List comprehension |
| `dc` | Dictionary comprehension |
| `lambda` | Lambda function |
| `main` | Main execution guard |
| `f` | F-string formatting |
| `doc` | Function docstring template |
| `prop` | Property decorator |
| `setter` | Setter decorator |

## Syntax Error Detection

The extension automatically detects and highlights:

- **Indentation Issues**: Mixed tabs and spaces
- **Missing Colons**: After if, for, while, def, class statements
- **Unmatched Brackets**: Parentheses, square brackets, curly braces
- **Common Syntax Patterns**: Identifies potential issues in real-time

## Development

### Prerequisites
- Node.js (v16 or higher)
- Visual Studio Code
- TypeScript

### Setup
```bash
# Clone the repository
git clone <repository-url>
cd QuickSyntex

# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Watch for changes during development
npm run watch
```

### Testing
1. Press F5 to open a new Extension Development Host window
2. Open a Python file
3. Test the extension features

### Building
```bash
# Compile for production
npm run vscode:prepublish

# Package the extension
vsce package
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Changelog

### 1.0.0
- Initial release
- Real-time syntax checking
- Code completion and snippets
- Hover help for Python keywords
- Auto-formatting capabilities
- Comprehensive error detection

## Support

If you encounter any issues or have suggestions:
- Open an issue on GitHub
- Contact support via email

---

**Enjoy coding with Python Syntax Helper!** 🐍✨
