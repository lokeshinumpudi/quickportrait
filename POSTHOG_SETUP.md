# PostHog Analytics Setup Guide

## Quick Setup

PostHog is now integrated into Quick Portrait using the official PostHog React SDK! Here's how to set it up:

### 1. Get Your PostHog API Key

1. Sign up for a free account at [PostHog](https://posthog.com)
2. Create a new project
3. Go to **Project Settings** → **Project API Key**
4. Copy your API key (it looks like `phc_xxxxxxxxxxxxxxxxxxxx`)

### 2. Configure Environment Variables

#### For Local Development

Create or update `.env.local` in your project root:

```bash
# .env.local
VITE_PUBLIC_POSTHOG_KEY=phc_your_api_key_here
VITE_PUBLIC_POSTHOG_HOST=https://app.posthog.com  # Optional, defaults to this
```

**Important**: The variable name must be `VITE_PUBLIC_POSTHOG_KEY` (with `PUBLIC` prefix) for Vite to expose it to the client.

#### For Production (Vercel/Netlify/etc.)

Add the environment variable in your hosting platform:

- **Vercel**: Project Settings → Environment Variables
- **Netlify**: Site Settings → Environment Variables
- **Other platforms**: Add `VITE_PUBLIC_POSTHOG_KEY` to your environment variables

### 3. Restart Your Dev Server

After adding the environment variable, restart your development server:

```bash
bun run dev
# or
npm run dev
```

### 4. Verify It's Working

1. Open your app in the browser
2. Open browser DevTools → Console
3. You should see PostHog initialization messages
4. Go to Settings → Advanced Settings
5. You should see "PostHog Analytics" toggle (if configured)

## How It Works

### Dual Analytics System

- **Local Analytics**: Always stores events in browser localStorage (if enabled)
- **PostHog Analytics**: Sends events to PostHog service (if configured and enabled)

### Privacy Features

- ✅ **User Control**: Users can disable PostHog in Settings → Advanced Settings
- ✅ **Anonymous IDs**: No PII collected, uses anonymous user IDs
- ✅ **Respects DNT**: Honors Do Not Track browser setting
- ✅ **No Auto-capture**: Disabled automatic event capture for privacy
- ✅ **Opt-in by Default**: PostHog is enabled by default if configured, but users can opt out

### Tracked Events

The following events are automatically tracked:

- `app_loaded` - When app first loads
- `image_uploaded` - When user uploads an image
- `edit_generated` - When an edit is successfully generated
- `preset_selected` - When user selects a preset
- `settings_opened` - When settings modal is opened
- `share_clicked` - When user shares an image
- `download_clicked` - When user downloads an image
- `error_occurred` - When an error occurs

### Viewing Analytics

1. Log into your PostHog dashboard
2. Go to **Insights** to see event analytics
3. Go to **Persons** to see user activity (anonymous IDs)
4. Create custom dashboards and funnels

## Troubleshooting

### PostHog Not Initializing

- Check that `VITE_PUBLIC_POSTHOG_KEY` is set correctly (note the `PUBLIC` prefix)
- Check browser console for errors
- Verify the API key is valid in PostHog dashboard
- Make sure you restarted the dev server after adding env vars

### Events Not Showing Up

- Check that PostHog is enabled in Settings → Advanced Settings
- Check browser console for PostHog errors
- Verify network requests to PostHog in Network tab
- Check PostHog dashboard for any rate limits or errors

### Privacy Concerns

- Users can disable PostHog anytime in Settings
- All tracking respects user preferences
- No personal information is collected
- Anonymous IDs are used for user identification

## Advanced Configuration

### Custom PostHog Host

If you're using PostHog Cloud or self-hosted:

```bash
VITE_PUBLIC_POSTHOG_HOST=https://your-posthog-instance.com
```

### Disable PostHog for Development

Simply don't set `VITE_PUBLIC_POSTHOG_KEY` in your `.env.local` file. PostHog will only initialize if the key is present.

## Next Steps

1. Set up your PostHog project
2. Add the API key to your environment variables (remember: `VITE_PUBLIC_POSTHOG_KEY`)
3. Deploy and watch the analytics roll in! 📊

For more PostHog features, check out their [documentation](https://posthog.com/docs).
