import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "sonner";
import App from "./App";
import { PostHogProvider } from "posthog-js/react";
import "./src/index.css";

// Suppress PostHog network errors from ad blockers
if (typeof window !== "undefined") {
  const originalError = console.error;
  console.error = (...args: unknown[]) => {
    // Filter out PostHog blocked request errors
    const errorMessage = args.join(" ");
    if (
      errorMessage.includes("posthog.com") ||
      errorMessage.includes("ERR_BLOCKED_BY_CLIENT") ||
      errorMessage.includes("net::ERR_BLOCKED_BY_CLIENT")
    ) {
      // Silently ignore PostHog blocked requests
      return;
    }
    originalError.apply(console, args);
  };
}

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
