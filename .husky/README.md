# Git Hooks

This directory contains git hooks managed by [Husky](https://typicode.github.io/husky/).

## Hooks

- **pre-commit**: Runs lint-staged to type-check staged files
- **pre-push**: Runs full type check and all tests before allowing push

## Setup

Hooks are automatically installed when you run `bun install` (via the `prepare` script).

## Manual Setup

If hooks aren't working, run:

```bash
bunx husky install
```

## Testing Hooks

To test if hooks are working:

```bash
# Test pre-commit (will run on next commit)
git add .
git commit -m "test"

# Test pre-push (will run on next push)
git push
```

## Bypassing Hooks

**Only use in emergencies:**

```bash
git commit --no-verify  # Skip pre-commit
git push --no-verify    # Skip pre-push
```
