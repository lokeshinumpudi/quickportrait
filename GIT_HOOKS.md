# Git Hooks Setup

This project uses [Husky](https://typicode.github.io/husky/) and [lint-staged](https://github.com/lint-staged/lint-staged) to enforce code quality before commits and pushes.

## 🎯 What's Protected

### Pre-commit Hook
- **Runs**: `lint-staged` (type checks staged TypeScript files)
- **Purpose**: Catch type errors before they're committed
- **Speed**: Fast - only checks staged files

### Pre-push Hook  
- **Runs**: 
  1. Full type check (`bun run type-check`)
  2. All tests (`bun run test`)
- **Purpose**: Ensure codebase is type-safe and all tests pass before pushing
- **Speed**: Slower but comprehensive

## 📦 Installation

Hooks are automatically installed when you run:
```bash
bun install
```

The `prepare` script in `package.json` sets up Husky automatically.

## 🔧 Manual Setup

If hooks aren't working, manually install them:
```bash
bunx husky install
```

## ✅ Testing the Hooks

### Test Pre-commit Hook
```bash
# Make a change
echo "test" >> test.txt

# Stage and commit (will trigger pre-commit)
git add test.txt
git commit -m "test commit"
```

### Test Pre-push Hook
```bash
# Try to push (will trigger pre-push)
git push
```

## 🚨 Bypassing Hooks

**⚠️ Only use in emergencies!**

```bash
# Skip pre-commit hook
git commit --no-verify -m "emergency fix"

# Skip pre-push hook  
git push --no-verify
```

**Warning**: Bypassing hooks can introduce broken code. Always fix issues properly.

## 📝 Configuration Files

- **`.husky/pre-commit`**: Pre-commit hook script
- **`.husky/pre-push`**: Pre-push hook script  
- **`.lintstagedrc.json`**: Lint-staged configuration
- **`package.json`**: Contains `prepare` script and hook dependencies

## 🔍 Troubleshooting

### Hooks not running?
1. Check if git is initialized: `git status`
2. Check if hooks are executable: `ls -la .husky/`
3. Reinstall hooks: `bunx husky install`

### Type check fails?
- Run manually: `bun run type-check`
- Fix TypeScript errors before committing

### Tests fail?
- Run manually: `bun run test`
- Fix failing tests before pushing
- For manual testing: `bun run test:manual` (requires dev server running)

## 💡 Best Practices

1. **Commit often**: Pre-commit hooks are fast, so commit frequently
2. **Push less often**: Pre-push hooks run all tests, so push when tests are green
3. **Fix issues immediately**: Don't bypass hooks - fix the root cause
4. **Run tests locally**: Use `bun run test:manual` during development

## 📚 Related Commands

```bash
# Type checking
bun run type-check    # Check all TypeScript files
bun run lint          # Alias for type-check

# Testing
bun run test          # Run all tests
bun run test:manual   # Run tests with manual dev server
bun run test:ui       # Run tests with UI
```

