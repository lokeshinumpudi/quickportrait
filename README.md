<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Quick Portrait

Professional AI-powered portrait editing tool. Transform your photos with powerful presets and custom prompts - no Photoshop required.

## Features

- 🎨 **10+ Professional Presets** - Portraitify, dress recoloring, background replacement, and more
- ✨ **Custom Prompts** - Full control over your edits with AI-powered prompt enhancement
- 🔐 **User API Keys** - Users can bring their own Gemini API keys (stored locally)
- 🚀 **Easy Deployment** - Ready to deploy to Vercel, Netlify, or any static host

## Run Locally

**Prerequisites:** Node.js 18+ or Bun

### Quick Start

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/quick-portrait.git
   cd quick-portrait
   ```

2. **Install dependencies:**

   ```bash
   # Using Bun (Recommended)
   bun install

   # Or using npm
   npm install
   ```

3. **Run the development server:**

   ```bash
   # Using Bun
   bun run dev

   # Or using npm
   npm run dev
   ```

   The app will be available at `http://localhost:3000`

   **Note:** Users will be prompted to enter their own Gemini API key in the app. The API key is stored locally in the browser and never sent to any servers.

### Development Scripts

```bash
# Development
bun run dev              # Start dev server
bun run build           # Build for production
bun run preview         # Preview production build

# Code Quality
bun run type-check      # Run TypeScript type checking
bun run lint            # Run linting (TypeScript check)

# Testing
bun run test            # Run all Playwright tests
bun run test:ui         # Run tests with Playwright UI
bun run test:report     # View test report
bun run test:manual     # Run tests with manually started server

# Utilities
bun run clean           # Clean build artifacts
```

### Local Configuration

#### File Size Limits

The app has a configurable file size limit (default: 10MB):

- Adjustable in Settings → General Settings
- Range: 1MB - 100MB
- Stored in browser `localStorage`

#### Browser Storage

The app uses browser `localStorage` for:

- API keys (`gemini_api_key`)
- Custom presets (`custom_presets`)
- File size limits (`max_file_size_mb`)

All data stays in your browser - never sent to any servers.

## Get Your Gemini API Key

Users need a Gemini API key to use the app. Get a free API key from:

- [Google AI Studio](https://aistudio.google.com/app/apikey)

The API key is stored locally in the browser and never sent to any servers.

## Deployment

This app can be deployed to any static hosting service. No backend required!

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Vercel will automatically detect the `vercel.json` configuration
4. Deploy!

**Build Settings:**

- Framework Preset: Vite
- Build Command: `bun run build` (or `npm run build`)
- Output Directory: `dist`
- Install Command: `bun install` (or `npm install`)

**Note:** No environment variables needed. Users provide their own Gemini API keys in the app.

### Deploy to Netlify

1. Push your code to GitHub
2. Import your repository in [Netlify](https://netlify.com)
3. Netlify will automatically detect the `netlify.toml` configuration
4. Deploy!

**Build Settings:**

- Build command: `bun run build` (or `npm run build`)
- Publish directory: `dist`

**Note:** No environment variables needed. Users provide their own Gemini API keys in the app.

### Deploy to Other Platforms

For other static hosting services (GitHub Pages, Cloudflare Pages, etc.):

1. Build the app:

   ```bash
   bun run build
   ```

2. Deploy the `dist` folder to your hosting service

3. Ensure your hosting service supports client-side routing (SPA redirects)

## How It Works

1. **Upload** - Users upload a photo
2. **Configure** - Choose a preset or write a custom prompt
3. **Edit** - The app uses Google's Gemini API to generate edited images
4. **Download** - Save your edited images

## 🔒 Privacy-First Architecture

**100% Client-Side Privacy Guaranteed**

Quick Portrait is built with privacy and security as foundational principles. The entire architecture is designed to ensure your data never leaves your device.

### Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Your Browser                          │
│  ┌───────────────────────────────────────────────────┐   │
│  │         Quick Portrait App (Client-Side)         │   │
│  │  • Image Processing (local)                      │   │
│  │  • API Key Storage (localStorage)                 │   │
│  │  • Preset Storage (localStorage)                  │   │
│  └───────────────────────────────────────────────────┘   │
│                          │                                │
│                          │ Direct API Calls               │
│                          ▼                                │
│  ┌───────────────────────────────────────────────────┐   │
│  │      Google Gemini API (External Service)        │   │
│  │  • Image Generation                                │   │
│  │  • Prompt Processing                               │   │
│  └───────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘

❌ No Backend Servers
❌ No Data Collection
❌ No Analytics
❌ No Tracking
```

### Privacy Guarantees

#### 🔐 API Key Storage

- **Browser localStorage Only**: Your API key is stored exclusively in your browser's `localStorage`
- **Never Transmitted**: Your API key never leaves your device and is never sent to our servers
- **Zero Server Access**: We have absolutely zero access to your API keys, images, or any user data
- **User Control**: You can view, update, or delete your API key anytime via browser developer tools or the app settings
- **Verifiable**: You can inspect browser DevTools to verify no data is sent to external servers (except Google's Gemini API)

#### 📸 Image Processing

- **Client-Side Only**: Images are processed entirely in your browser
- **No Upload to Our Servers**: Images never leave your device except for direct API calls to Google Gemini
- **Direct API Connection**: API calls go directly from your browser to Google's Gemini API servers
- **No Storage**: We don't store, cache, or log any images

#### 💾 Data Storage

- **Local Only**: All data (API keys, presets, settings) stored in browser `localStorage`
- **No Cloud Sync**: No cloud storage, no data synchronization
- **User Owned**: You have complete control over your data
- **Deletable**: Clear browser data to remove everything instantly

### Data Flow

1. **Image Upload**: Image stays in browser memory (never uploaded to our servers)
2. **API Call**: Direct connection from your browser → Google Gemini API
3. **Response**: Generated image returned directly to your browser
4. **Storage**: Results stored only in browser memory/localStorage

**No intermediaries. No data collection. No tracking.**

### What We Don't Have Access To

- ❌ Your API keys
- ❌ Your uploaded images
- ❌ Your edited images
- ❌ Your prompts or custom presets
- ❌ Any personal information
- ❌ Usage analytics
- ❌ Error logs (errors are logged only in your browser console)

### Privacy by Design Principles

1. **Zero Backend**: No server-side code means no server-side data collection
2. **Direct API Calls**: Your browser talks directly to Google's API
3. **Local Storage Only**: All data stays in your browser
4. **Open Source**: You can audit the code to verify privacy claims
5. **No Dependencies on Analytics**: No tracking libraries or analytics services

**Your data stays in your browser. Period.**

## API Key Management

- Users enter their Gemini API key directly in the app
- Keys are stored locally in browser `localStorage` (you can verify this in browser DevTools)
- Keys are only used to make direct API calls from your browser to Google's Gemini API
- Keys are never sent to any servers except Google's Gemini API
- Users can change or remove their API key anytime via the settings icon

## Development

### Tech Stack

- **Frontend Framework**: React 19.2.0
- **Language**: TypeScript 5.8.2
- **Build Tool**: Vite 6.2.0
- **Styling**: Tailwind CSS (via CDN)
- **API Client**: @google/genai (Google Gemini API)
- **Testing**: Playwright 1.56.1
- **Package Manager**: Bun (or npm)
- **Code Quality**: Husky + lint-staged

### Project Structure

```
quick-portrait/
├── components/          # React components
│   ├── settings/       # Settings-related components
│   └── *.tsx          # Feature components
├── services/          # API service layers
├── utils/             # Utility functions
├── tests/             # Playwright E2E tests
│   └── helpers.ts     # Test helper functions
├── types.ts           # TypeScript type definitions
├── constants.ts       # App constants and configuration
├── App.tsx            # Main application component
└── index.tsx          # Entry point
```

### Code Quality

The project includes automated code quality checks:

- **Pre-commit Hook**: Type-checks staged TypeScript files
- **Pre-push Hook**: Runs full type-check + all tests before allowing push
- **TypeScript**: Strict type checking enabled
- **Testing**: Comprehensive E2E tests with Playwright

### Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Ensure tests pass (`bun run test`)
5. Ensure type checking passes (`bun run type-check`)
6. Commit your changes (git hooks will run automatically)
7. Push to your branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## License

MIT
