# Playwright Test Guide

## Quick Start (Recommended: Manual Mode)

**For reliable testing, use manual mode:**

1. **Start dev server** in a separate terminal:

   ```bash
   bun run dev
   ```

   Wait until you see: `VITE v6.x.x ready` and `Local: http://localhost:3000/`

2. **Run tests** (server already running):

   ```bash
   bun run test:manual
   ```

3. **Run tests with UI** (server already running):
   ```bash
   bun run test:ui:manual
   ```

## Alternative: Auto-Start Mode (May Have Issues)

1. **List all tests** (no server needed):

   ```bash
   bun run test:list
   ```

2. **Run all tests** (starts dev server automatically):

   ```bash
   bun run test
   ```

   ⚠️ **Warning**: This mode may timeout if the server doesn't start quickly enough.

3. **Run tests with UI** (interactive mode):

   ```bash
   bun run test:ui
   ```

4. **Run tests in headed mode** (see browser):

   ```bash
   bun run test:headed
   ```

5. **Run a single test file**:
   ```bash
   bun run test:single
   ```

## Setup

If you get browser errors, install Playwright browsers:

```bash
bun run test:install
```

## Troubleshooting

### Playwright UI Stuck on "Loading..."

**This is a known issue** - Playwright's webServer sometimes doesn't detect when Vite is ready.

**Quick Fix - Use Manual Mode:**

1. **Open a separate terminal** and start the dev server:

   ```bash
   bun run dev
   ```

2. **Wait for the server to be ready** - you should see output like:

   ```
   VITE v6.x.x  ready in xxx ms
   ➜  Local:   http://localhost:3000/
   ```

3. **In your original terminal**, run tests with manual config:

   ```bash
   bun run test:manual
   ```

   Or for UI mode:

   ```bash
   bun run test:ui --config=playwright.config.manual.ts
   ```

**Why this happens:** Vite needs to compile your React app before it can respond to HTTP requests. Playwright's auto-start feature sometimes checks the URL before Vite finishes compiling, causing it to hang.

### Tests Timing Out / Browser Shows `about:blank`

**If tests timeout and the browser shows `about:blank`:**

1. **Clear port 3000** first:

   ```bash
   lsof -ti:3000 | xargs kill -9
   ```

2. **Use manual mode** (see "Quick Start" section above) - this is the most reliable approach.

3. The auto-start mode may fail because:
   - Vite needs time to compile before responding
   - Port conflicts cause Vite to switch ports
   - Playwright checks readiness before Vite is ready

### Other Issues

- **"Nothing is happening"**: The dev server is starting in the background. Wait 10-30 seconds.
- **Port 3000 already in use**: Kill the process: `lsof -ti:3000 | xargs kill -9`
- **Browser not found**: Run `bun run test:install`
- **Server won't start**: Check if port 3000 is available and try `bun run dev` manually first

## Current Test Status

- **Total**: 17 tests across 5 files
- **Coverage**: Landing page, Navigation, Settings, Preset Management, Preset Selection
