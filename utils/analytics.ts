/**
 * Analytics utilities
 * Tracks events locally and sends to PostHog if configured
 */

import posthog from "posthog-js";

interface AnalyticsEvent {
  event: string;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

const ANALYTICS_KEY = "qp_analytics";
const MAX_EVENTS = 100; // Keep only last 100 events

/**
 * Check if local analytics is enabled (user preference)
 */
export const isAnalyticsEnabled = (): boolean => {
  const setting = localStorage.getItem("qp_analytics_enabled");
  // Default to enabled, but user can opt out
  return setting !== "false";
};

/**
 * Enable or disable local analytics
 */
export const setAnalyticsEnabled = (enabled: boolean): void => {
  localStorage.setItem("qp_analytics_enabled", enabled ? "true" : "false");
};

/**
 * Check if PostHog is configured
 */
export const isPostHogConfigured = (): boolean => {
  return !!import.meta.env.VITE_PUBLIC_POSTHOG_KEY;
};

/**
 * Track an event
 * - Always stores locally if local analytics is enabled
 * - Always sends to PostHog if configured (no opt-out)
 */
export const trackEvent = (
  eventName: string,
  metadata?: Record<string, unknown>
): void => {
  // Store locally if enabled
  if (isAnalyticsEnabled()) {
    try {
      const events: AnalyticsEvent[] = JSON.parse(
        localStorage.getItem(ANALYTICS_KEY) || "[]"
      );

      events.push({
        event: eventName,
        timestamp: Date.now(),
        metadata,
      });

      // Keep only last MAX_EVENTS
      if (events.length > MAX_EVENTS) {
        events.splice(0, events.length - MAX_EVENTS);
      }

      localStorage.setItem(ANALYTICS_KEY, JSON.stringify(events));
    } catch (error) {
      // Silently fail - analytics should never break the app
      if (import.meta.env.MODE === "development") {
        console.warn("Local analytics tracking failed:", error);
      }
    }
  }

  // Always send to PostHog if configured (mandatory tracking)
  if (isPostHogConfigured()) {
    try {
      if (posthog && typeof posthog.capture === "function") {
        posthog.capture(eventName, {
          ...metadata,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (error) {
      // Silently fail - PostHog errors shouldn't break the app
      if (import.meta.env.MODE === "development") {
        console.debug("PostHog tracking failed:", error);
      }
    }
  }
};

/**
 * Get analytics summary (for user to see their own local data)
 */
export const getAnalyticsSummary = (): {
  totalEvents: number;
  eventsByType: Record<string, number>;
  lastEventTime: number | null;
} => {
  try {
    const events: AnalyticsEvent[] = JSON.parse(
      localStorage.getItem(ANALYTICS_KEY) || "[]"
    );

    const eventsByType: Record<string, number> = {};
    let lastEventTime: number | null = null;

    events.forEach((event) => {
      eventsByType[event.event] = (eventsByType[event.event] || 0) + 1;
      if (!lastEventTime || event.timestamp > lastEventTime) {
        lastEventTime = event.timestamp;
      }
    });

    return {
      totalEvents: events.length,
      eventsByType,
      lastEventTime,
    };
  } catch (error) {
    return {
      totalEvents: 0,
      eventsByType: {},
      lastEventTime: null,
    };
  }
};

/**
 * Clear all local analytics data
 */
export const clearAnalytics = (): void => {
  localStorage.removeItem(ANALYTICS_KEY);
};

/**
 * Common event names
 */
export const AnalyticsEvents = {
  APP_LOADED: "app_loaded",
  IMAGE_UPLOADED: "image_uploaded",
  EDIT_GENERATED: "edit_generated",
  PRESET_SELECTED: "preset_selected",
  SETTINGS_OPENED: "settings_opened",
  API_KEY_SET: "api_key_set",
  SHARE_CLICKED: "share_clicked",
  DOWNLOAD_CLICKED: "download_clicked",
  ERROR_OCCURRED: "error_occurred",
} as const;
