import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "sonner";
import App from "./App";
import { PostHogProvider } from "posthog-js/react";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <PostHogProvider
      apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY || ""}
      options={{
        api_host:
          import.meta.env.VITE_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
        defaults: "2025-05-24",
        // Disable features that cause issues with ad blockers
        capture_exceptions: false, // Disable exception autocapture to avoid blocked script errors
        autocapture: false, // Disable automatic event capture
        capture_pageview: false, // We'll manually track pageviews if needed
        capture_pageleave: false, // Disable page leave tracking
        disable_session_recording: true, // Disable session recording
        disable_persistence: false, // Keep persistence for user preferences
        disable_surveys: true, // Disable surveys
        loaded: (posthog) => {
          // Only log in development
          if (import.meta.env.MODE === "development") {
            console.log("[PostHog] Initialized successfully");
          }
        },
        // Suppress errors from blocked requests
        request_batching: true,
        // Reduce console noise - disable debug mode
        debug: false,
      }}
    >
      <App />
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          className: "font-mono",
          style: {
            fontFamily: "var(--font-family-mono)",
          },
        }}
      />
    </PostHogProvider>
  </React.StrictMode>
);
