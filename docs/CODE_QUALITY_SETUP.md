# Code Quality & Pre-commit Hooks Setup Guide

## Table of Contents

1. [Overview](#overview)
2. [Tools Architecture](#tools-architecture)
3. [Installation](#installation)
4. [Configuration Files](#configuration-files)
5. [Running Commands Locally](#running-commands-locally)
6. [Workflow & Flow](#workflow--flow)
7. [Pre-commit Hooks with Husky](#pre-commit-hooks-with-husky)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)

---

## Overview

This project uses a comprehensive code quality setup with four complementary tools:

- **Prettier**: Code formatter (enforces consistent code style)
- **ESLint**: JavaScript/TypeScript linter (finds and fixes code quality issues)
- **Oxlint**: Fast linting tool (catches common mistakes, complements ESLint)
- **Husky**: Git hooks manager (runs checks before commits)

These tools work together to maintain code quality, consistency, and catch issues before they're committed.

---

## Tools Architecture

### Tool Interaction Diagram

```
┌─────────────────────────────────────────────┐
│         Developer writes code               │
└──────────────────────┬──────────────────────┘
                       │
                       ▼
         ┌─────────────────────────┐
         │   Git pre-commit hook   │ (Husky)
         │   (triggered on commit) │
         └────────────┬────────────┘
                      │
         ┌────────────┴────────────┐
         │                         │
         ▼                         ▼
    ┌─────────────┐          ┌──────────────┐
    │   Prettier  │          │  ESLint +    │
    │             │          │  Oxlint      │
    │ Format code │          │              │
    │             │          │ Lint & check │
    │ - Tabs      │          │              │
    │ - Spaces    │          │ - Quality    │
    │ - Quotes    │          │ - Patterns   │
    │ - Semicolons│          │ - Security   │
    └─────────────┘          └──────────────┘
         │                         │
         └────────────┬────────────┘
                      │
                      ▼
         ┌─────────────────────────┐
         │  Pass / Fail checks     │
         │  - If fail: block commit│
         │  - If pass: proceed     │
         └─────────────────────────┘
```

### Tool Responsibilities

| Tool         | Purpose        | Scope                                         |
| ------------ | -------------- | --------------------------------------------- |
| **Prettier** | Code formatter | Style consistency (quotes, spacing, brackets) |
| **ESLint**   | Linter & fixer | Code quality (unused vars, logic errors)      |
| **Oxlint**   | Fast linter    | Catches common mistakes quickly               |
| **Husky**    | Git hooks      | Automates checks on git events                |

---

## Installation

### Step 1: Verify Dependencies

All required dependencies should already be installed. Check `package.json`:

```json
{
  "devDependencies": {
    "prettier": "^3.x.x",
    "eslint": "^8.x.x or ^9.x.x",
    "oxlint": "^0.x.x",
    "husky": "^9.x.x",
    "@typescript-eslint/eslint-plugin": "^6.x.x",
    "@typescript-eslint/parser": "^6.x.x",
    "eslint-plugin-react": "^7.x.x",
    "eslint-plugin-react-hooks": "^4.x.x"
  }
}
```

### Step 2: Install Dependencies

If not already installed:

```bash
# Using pnpm (recommended for monorepo)
pnpm install

# Or using npm
npm install

# Or using yarn
yarn install
```

### Step 3: Initialize Husky (One-time setup)

```bash
# Initialize Husky git hooks
pnpm dlx husky install

# Or if already installed
husky install
```

### Step 4: Verify Installation

```bash
# Check if tools are available
pnpm prettier --version
pnpm eslint --version
pnpm oxlint --version
pnpm husky --version
```

---

## Configuration Files

### 1. Prettier Configuration (`.prettierrc.json`)

Controls code formatting rules:

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100
}
```

**Key Settings:**

- `semi`: Add semicolons at end of statements
- `singleQuote`: Use single quotes instead of double
- `trailingComma`: Add trailing commas in all cases (arrays, objects, function parameters)
- `printWidth`: Line length limit (100 characters)

### 2. Prettier Ignore File (`.prettierignore`)

Files/folders to skip formatting:

```
node_modules
dist
build
.next
coverage
*.min.js
```

### 3. ESLint Configuration (`.eslintrc.cjs` or `eslint.config.js`)

Code quality rules:

```javascript
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'import'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/recommended',
    'prettier',
  ],
  settings: {
    react: { version: 'detect' },
  },
  rules: {
    '@typescript-eslint/no-unused-vars': 'warn',
    'react/react-in-jsx-scope': 'off',
    'no-console': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    'react-refresh/only-export-components': 'warn',
    'react-hooks/exhaustive-deps': 'warn',
    'react-hooks/incompatible-library': 'warn',
  },
};
```

### 4. Oxlint Configuration (`.oxlintrc.json`)

Fast linting configuration:

```json
{
  "rules": {
    "no-debugger": "warn",
    "no-unreachable": "warn",
    "no-duplicate-case": "warn",
    "no-unsafe-finally": "warn",
    "no-cond-assign": "warn",
    "no-unused-vars": "warn",
    "no-console": "warn",
    "no-duplicate-imports": "warn",
    "no-var": "warn",
    "prefer-const": "warn",
    "eqeqeq": "warn",
    "no-empty": "warn",
    "no-fallthrough": "warn",
    "no-eval": "warn",
    "no-implied-eval": "warn",
    "no-useless-return": "warn",
    "no-useless-catch": "warn",
    "no-self-import": "warn"
  }
}
```

### 5. Husky Hooks

Located in `.husky/` directory:

#### `.husky/pre-commit`

Runs before each commit in this order:

```bash
pnpm test
pnpm lint:fast
pnpm lint
pnpm format
pnpm typecheck
```

**Execution Order:**

1. **pnpm test** - Run test suite (can fail)
2. **pnpm lint:fast** - Run Oxlint for fast linting (can fail)
3. **pnpm lint** - Run ESLint for comprehensive linting (can fail)
4. **pnpm format** - Auto-format code with Prettier (always succeeds, applies formatting)
5. **pnpm typecheck** - Run TypeScript type checking (can fail)

**Notes:**

- Tests run first to catch logical errors early
- Oxlint and ESLint can fail if issues are found
- Format always succeeds - it automatically applies Prettier rules to format code
- Type checking ensures TypeScript compatibility
- If test, lint, or typecheck fails, commit is blocked
- Format step modifies files but never blocks the commit (just applies formatting)

#### `.husky/pre-push`

Runs before pushing to remote (optional):

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "🚀 Running pre-push checks..."

# Run tests before push
pnpm test || (
  echo "❌ Tests failed. Fix them before pushing."
  exit 1
)

echo "✅ Ready to push!"
```

---

## Running Commands Locally

### Formatting Commands

#### Auto-format code (applied in pre-commit hook):

```bash
pnpm format
```

**Note:** This command auto-formats all files according to Prettier rules. It modifies files in-place and **always succeeds** (never fails). The formatted changes are then staged and included in your commit.

Defined in `package.json`:

```json
{
  "scripts": {
    "format": "prettier --write ."
  }
}
```

---

### Linting Commands

#### Check code quality with ESLint:

```bash
pnpm lint
```

This command should be defined in `package.json`:

```json
{
  "scripts": {
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx"
  }
}
```

#### ESLint Issues:

ESLint runs as part of the pre-commit hook via `pnpm lint`. ESLint in your setup reports issues but doesn't have a direct auto-fix script configured. Issues must be fixed manually in the code.

#### Run Oxlint for quick linting:

Oxlint runs as part of the pre-commit hook via `pnpm lint:fast`:

```bash
pnpm lint:fast
```

This is defined in `package.json`:

```json
{
  "scripts": {
    "lint:fast": "oxlint ."
  }
}
```

---

### Type Checking

#### Run TypeScript type checker:

```bash
pnpm typecheck
```

Define in `package.json`:

```json
{
  "scripts": {
    "typecheck": "tsc --noEmit"
  }
}
```

---

### Combined Commands

#### Run all quality checks locally (before committing):

```bash
pnpm test && \
pnpm lint:fast && \
pnpm lint && \
pnpm format && \
pnpm typecheck
```

#### Run all fixes:

```bash
pnpm format && \
pnpm lint && \
pnpm typecheck
```

#### Complete pre-commit simulation:

```bash
pnpm test && pnpm lint:fast && pnpm lint && pnpm format && pnpm typecheck
```

---

## Workflow & Flow

### Typical Developer Workflow

```
┌──────────────────────────────────────────────────────────┐
│ 1. Developer edits files                                  │
│    - Creates/modifies *.ts, *.tsx, *.js, *.json files   │
└─────────────────────┬──────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────────────┐
│ 2. Run checks locally (optional but recommended)          │
│    pnpm format && pnpm lint && pnpm typecheck            │
└─────────────────────┬──────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────────────┐
│ 3. Stage files for commit                                 │
│    git add .                                               │
└─────────────────────┬──────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────────────┐
│ 4. Attempt commit                                         │
│    git commit -m "message"                                │
└─────────────────────┬──────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────────────┐
│ 5. Husky Pre-commit Hook Triggered                        │
│                                                            │
│    ┌──────────────────────────────────────────┐          │
│    │ a) Run tests                              │          │
│    │    pnpm test                              │          │
│    │    ✓ Pass / ✗ Fail                        │          │
│    └──────────────────────────────────────────┘          │
│                      │                                    │
│                      ▼                                    │
│    ┌──────────────────────────────────────────┐          │
│    │ b) Fast linting with Oxlint              │          │
│    │    pnpm lint:fast                         │          │
│    │    ✓ Pass / ✗ Fail                        │          │
│    └──────────────────────────────────────────┘          │
│                      │                                    │
│                      ▼                                    │
│    ┌──────────────────────────────────────────┐          │
│    │ c) ESLint quality check                   │          │
│    │    pnpm lint                              │          │
│    │    ✓ Pass / ✗ Fail                        │          │
│    └──────────────────────────────────────────┘          │
│                      │                                    │
│                      ▼                                    │
│    ┌──────────────────────────────────────────┐          │
│    │ d) Auto-format code (always succeeds)     │          │
│    │    pnpm format                            │          │
│    │    ✓ Success (applies Prettier rules)     │          │
│    └──────────────────────────────────────────┘          │
│                      │                                    │
│                      ▼                                    │
│    ┌──────────────────────────────────────────┐          │
│    │ e) TypeScript type check                  │          │
│    │    pnpm typecheck                         │          │
│    │    ✓ Pass / ✗ Fail                        │          │
│    └──────────────────────────────────────────┘          │
└─────────────────────┬──────────────────────────────────┘
                      │
        ┌─────────────┴──────────────┐
        │                            │
        ▼                            ▼
    ✅ ALL PASS              ❌ ANY FAILS
        │                            │
        ▼                            ▼
  ┌──────────────┐          ┌──────────────────┐
  │ Commit       │          │ Commit blocked   │
  │ Successful   │          │ Fix issues and   │
  │              │          │ try again        │
  └──────────────┘          └──────────────────┘
        │
        ▼
  ┌──────────────────────────────────────────────────────────┐
  │ 6. Push to remote (optional pre-push hook)               │
  │    git push                                               │
  │                                                            │
  │    (Runs pre-push hook if configured)                    │
  └──────────────────────────────────────────────────────────┘
```

### Real-World Example

**Step 1: Make changes**

```bash
# Edit file
echo 'const  x  =  5;' > src/test.ts
git add src/test.ts
```

**Step 2: Attempt commit**

```bash
git commit -m "Add test variable"
```

**Step 3: Husky runs hooks**

1. **pnpm test**: Tests pass ✅
2. **pnpm lint:fast**: Oxlint finds no issues ✅
3. **pnpm lint**: ESLint finds no issues ✅
4. **pnpm format**: Auto-formats the code (always succeeds) ✅
5. **pnpm typecheck**: Type check passes ✅

**Step 4: Commit succeeds**

All steps passed, commit is created with properly formatted code.

---

## Pre-commit Hooks with Husky

### How Husky Works

Husky installs Git hooks that automatically run scripts at specific Git events:

- `pre-commit`: Before commit is created
- `pre-push`: Before code is pushed
- `commit-msg`: Before commit message is saved

### Bypassing Husky (use with caution!)

Sometimes you need to bypass pre-commit checks (though not recommended):

```bash
# Skip all hooks
git commit --no-verify -m "message"

# Or use shorthand
git commit -n -m "message"
```

---

## Best Practices

### 1. **Format Before Committing**

Always run format before committing:

```bash
pnpm format && git add . && git commit -m "message"
```

### 2. **Fix Linting Issues Manually**

ESLint issues need to be fixed manually. ESLint runs as part of the pre-commit hook via `pnpm lint`. If linting fails, you must fix the issues in your code before committing.

### 3. **Check Locally First**

Run full check suite before pushing:

```bash
pnpm test && pnpm lint:fast && pnpm lint && pnpm format && pnpm typecheck
```

### 4. **Don't Bypass Hooks**

Avoid using `--no-verify` unless absolutely necessary.

### 5. **Keep Configuration Consistent**

- Prettier and ESLint should have compatible rules
- Share configuration across the monorepo
- Document any rule overrides

### 6. **Type Checking**

Always run type checks:

```bash
pnpm typecheck
```

Before pushing large changes.

### 7. **Review Husky Output**

Read error messages carefully:

```
❌ Prettier check failed. Run 'pnpm format' to fix.
```

Follow the suggestions to fix issues.

### 8. **Configure IDE Integration**

Set up your editor to run Prettier on save:

**VS Code (.vscode/settings.json):**

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

**Enable ESLint in VS Code:**

Install ESLint extension and add to settings:

```json
{
  "eslint.validate": ["javascript", "typescript"]
}
```

---

## Troubleshooting

### Prettier Issues

**Issue:** Inconsistent code formatting

```bash
# Format code locally before committing (not required in this setup, but good practice)
pnpm format

# The pre-commit hook will also auto-format any files
```

**Note:** The `pnpm format` command in the pre-commit hook always succeeds. It doesn't fail - it automatically applies Prettier rules to format your code. The formatted code is then included in your commit.

### ESLint Issues

**Issue:** "ESLint check failed"

```bash
# Run ESLint to see detailed errors
pnpm lint
```

Fix the reported issues directly in your code. ESLint doesn't have an auto-fix script configured in your setup.

### Oxlint Issues

**Issue:** "Oxlint check failed"

```bash
# View detailed errors from Oxlint
pnpm lint:fast
```

Fix the reported issues directly in your code. Oxlint runs as part of the pre-commit hook.

### TypeScript Issues

**Issue:** "Type check failed"

```bash
# Show detailed errors
pnpm typecheck

# Check specific file
pnpm tsc src/App.tsx --noEmit
```

### Husky Issues

**Issue:** "pre-commit hook not running"

```bash
# Reinstall Husky
husky install

# Make hooks executable
chmod +x .husky/*

# Verify installation
cat .husky/pre-commit
```

**Issue:** "Permission denied" error

```bash
# Fix file permissions
chmod +x .husky/pre-commit
chmod +x .husky/pre-push
```

### Monorepo Issues

**Issue:** Commands not working in monorepo

```bash
# Use pnpm for monorepo support
pnpm format
pnpm lint

# Not npm install (use pnpm install)
pnpm install
```

---

## Command Reference

| Command                                                                     | Purpose                                     | Auto-fix |
| --------------------------------------------------------------------------- | ------------------------------------------- | -------- |
| `pnpm format`                                                               | Auto-format code with Prettier              | ✅ Yes   |
| `pnpm lint`                                                                 | Check code quality with ESLint              | ❌ No    |
| `pnpm lint:fast`                                                            | Fast linting with Oxlint                    | ❌ No    |
| `pnpm typecheck`                                                            | Check types with TypeScript                 | ❌ No    |
| `pnpm test`                                                                 | Run test suite                              | ❌ No    |
| `pnpm test && pnpm lint:fast && pnpm lint && pnpm format && pnpm typecheck` | Run all pre-commit checks (mimics git hook) | Partial  |

---


### When to use **ESLint vs Oxlint**

**Use ESLint when:**

1. You need React/Next.js/framework lint rules.
2. You need ESLint plugins.
3. You need custom lint rules.
4. You need strong auto-fix support.
5. Your project or CI already uses ESLint.
6. You need detailed rule configuration.
7. IDE integration relies on ESLint.

**Use Oxlint when:**

1. You want very fast linting.
2. You have a large monorepo and lint speed matters.
3. You mainly need core JS/TS correctness checks.
4. You want fast pre-commit lint checks.
5. Your project doesn't need many plugins or custom rules.

### Quick rule

* **Feature-rich & ecosystem support → ESLint**
* **Speed & basic linting → Oxlint**

## Resources

- [Prettier Documentation](https://prettier.io/docs/en/)
- [ESLint Documentation](https://eslint.org/docs/rules/)
- [Oxlint Repository](https://github.com/oxc-project/oxc)
- [Husky Documentation](https://typicode.github.io/husky/)
- [Git Hooks Guide](https://git-scm.com/docs/githooks)

---

**Last Updated:** February 9, 2026
**Version:** 1.0
**Maintained By:** Development Team
