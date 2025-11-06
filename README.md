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

### Using Bun (Recommended)

1. Install dependencies:

   ```bash
   bun install
   ```

2. (Optional) Set `GEMINI_API_KEY` in `.env.local` for development:

   ```bash
   GEMINI_API_KEY=your_api_key_here
   ```

   Note: If not set, users will be prompted to enter their own API key in the app.

3. Run the app:
   ```bash
   bun run dev
   ```

### Using npm

1. Install dependencies:

   ```bash
   npm install
   ```

2. (Optional) Set `GEMINI_API_KEY` in `.env.local` for development

3. Run the app:
   ```bash
   npm run dev
   ```

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

**Environment Variables (Optional):**

- `GEMINI_API_KEY` - Only needed if you want to provide a default API key. Users can still use their own.

### Deploy to Netlify

1. Push your code to GitHub
2. Import your repository in [Netlify](https://netlify.com)
3. Netlify will automatically detect the `netlify.toml` configuration
4. Deploy!

**Build Settings:**

- Build command: `bun run build` (or `npm run build`)
- Publish directory: `dist`

**Environment Variables (Optional):**

- `GEMINI_API_KEY` - Only needed if you want to provide a default API key. Users can still use their own.

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

## 🔒 Privacy & Security

**100% Client-Side Privacy Guaranteed**

Quick Portrait is designed with privacy and security as core principles:

### API Key Storage

- **Browser localStorage Only**: Your API key is stored exclusively in your browser's `localStorage`
- **Never Transmitted**: Your API key never leaves your device and is never sent to our servers
- **Zero Server Access**: We have absolutely zero access to your API keys, images, or any user data
- **User Control**: You can view, update, or delete your API key anytime via browser developer tools or the app settings

### Data Flow

- **Direct Connection**: API calls go directly from your browser to Google's Gemini API servers
- **No Backend**: This app has no backend servers - it's 100% client-side
- **No Data Collection**: We don't collect, store, or transmit any user data, images, or API keys
- **Privacy by Design**: Your privacy is guaranteed by the application architecture itself

### What We Don't Have Access To

- ❌ Your API keys
- ❌ Your uploaded images
- ❌ Your edited images
- ❌ Your prompts or custom presets
- ❌ Any personal information

**Your data stays in your browser. Period.**

## API Key Management

- Users enter their Gemini API key directly in the app
- Keys are stored locally in browser `localStorage` (you can verify this in browser DevTools)
- Keys are only used to make direct API calls from your browser to Google's Gemini API
- Keys are never sent to any servers except Google's Gemini API
- Users can change or remove their API key anytime via the settings icon

## Development

The app is built with:

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Google Gemini API

## License

MIT
// Git hooks configured in package.json

Git hooks configured in package.json
