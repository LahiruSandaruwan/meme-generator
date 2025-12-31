/**
 * Error Tracking Service
 * Centralized error tracking and crash reporting using Sentry
 */

import * as Sentry from '@sentry/react-native';
import { ENV_CONFIG, isSentryEnabled } from '../config/env';
import Constants from 'expo-constants';

/**
 * Initialize Sentry error tracking
 * Call this once at app startup
 */
export const initializeErrorTracking = () => {
  if (!isSentryEnabled()) {
    console.log('⚠️  Sentry disabled in this environment');
    return;
  }

  try {
    Sentry.init({
      dsn: ENV_CONFIG.sentry.dsn,

      // Set environment (development, production)
      environment: ENV_CONFIG.environment,

      // Enable/disable based on environment
      enabled: ENV_CONFIG.sentry.enabled,

      // Set app version from expo config
      release: `${Constants.expoConfig?.slug}@${Constants.expoConfig?.version}`,
      dist: Constants.expoConfig?.version,

      // Performance monitoring
      enableAutoSessionTracking: true,
      sessionTrackingIntervalMillis: 30000, // 30 seconds

      // Sample rate for error events (1.0 = 100%)
      sampleRate: ENV_CONFIG.isDevelopment ? 1.0 : 0.8,

      // Trace sample rate for performance monitoring
      tracesSampleRate: ENV_CONFIG.isDevelopment ? 1.0 : 0.2,

      // Attach stack traces to error events
      attachStacktrace: true,

      // Enable auto breadcrumbs
      enableAutoPerformanceTracing: true,

      // Before send hook to filter sensitive data
      beforeSend(event, hint) {
        // Filter out console.log breadcrumbs in production
        if (!ENV_CONFIG.isDevelopment && event.breadcrumbs) {
          event.breadcrumbs = event.breadcrumbs.filter(
            (breadcrumb) => breadcrumb.category !== 'console'
          );
        }

        // Remove sensitive data from context
        if (event.contexts?.app) {
          // Remove any sensitive app data
          delete event.contexts.app.sensitive_data;
        }

        return event;
      },

      // Integrations
      integrations: [
        new Sentry.ReactNativeTracing({
          // Trace navigation events
          routingInstrumentation: new Sentry.ReactNavigationInstrumentation(),

          // Enable tracing for network requests
          tracingOrigins: ['localhost', /^\//],
        }),
      ],
    });

    console.log('✅ Sentry initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize Sentry:', error);
  }
};

/**
 * Log an error to Sentry
 * @param error - Error object or string
 * @param context - Additional context data
 */
export const logError = (error: Error | string, context?: Record<string, any>) => {
  if (!isSentryEnabled()) {
    console.error('Error:', error, context);
    return;
  }

  try {
    if (typeof error === 'string') {
      Sentry.captureMessage(error, {
        level: 'error',
        contexts: context ? { additional: context } : undefined,
      });
    } else {
      if (context) {
        Sentry.setContext('additional', context);
      }
      Sentry.captureException(error);
    }
  } catch (err) {
    console.error('Failed to log error to Sentry:', err);
  }
};

/**
 * Log a warning to Sentry
 * @param message - Warning message
 * @param context - Additional context data
 */
export const logWarning = (message: string, context?: Record<string, any>) => {
  if (!isSentryEnabled()) {
    console.warn('Warning:', message, context);
    return;
  }

  try {
    Sentry.captureMessage(message, {
      level: 'warning',
      contexts: context ? { additional: context } : undefined,
    });
  } catch (error) {
    console.error('Failed to log warning to Sentry:', error);
  }
};

/**
 * Log an info message to Sentry
 * @param message - Info message
 * @param context - Additional context data
 */
export const logInfo = (message: string, context?: Record<string, any>) => {
  if (!isSentryEnabled()) {
    console.log('Info:', message, context);
    return;
  }

  try {
    Sentry.captureMessage(message, {
      level: 'info',
      contexts: context ? { additional: context } : undefined,
    });
  } catch (error) {
    console.error('Failed to log info to Sentry:', error);
  }
};

/**
 * Add breadcrumb for debugging
 * @param message - Breadcrumb message
 * @param category - Breadcrumb category (e.g., 'navigation', 'user', 'network')
 * @param data - Additional data
 */
export const addBreadcrumb = (
  message: string,
  category: string = 'app',
  data?: Record<string, any>
) => {
  if (!isSentryEnabled()) {
    return;
  }

  try {
    Sentry.addBreadcrumb({
      message,
      category,
      data,
      level: 'info',
      timestamp: Date.now() / 1000,
    });
  } catch (error) {
    console.error('Failed to add breadcrumb:', error);
  }
};

/**
 * Set user context for error tracking
 * @param userId - User identifier
 * @param email - User email (optional)
 * @param username - Username (optional)
 */
export const setUser = (userId: string, email?: string, username?: string) => {
  if (!isSentryEnabled()) {
    return;
  }

  try {
    Sentry.setUser({
      id: userId,
      email,
      username,
    });
  } catch (error) {
    console.error('Failed to set user context:', error);
  }
};

/**
 * Clear user context (e.g., on logout)
 */
export const clearUser = () => {
  if (!isSentryEnabled()) {
    return;
  }

  try {
    Sentry.setUser(null);
  } catch (error) {
    console.error('Failed to clear user context:', error);
  }
};

/**
 * Set custom tag for filtering in Sentry
 * @param key - Tag key
 * @param value - Tag value
 */
export const setTag = (key: string, value: string) => {
  if (!isSentryEnabled()) {
    return;
  }

  try {
    Sentry.setTag(key, value);
  } catch (error) {
    console.error('Failed to set tag:', error);
  }
};

/**
 * Set custom context data
 * @param key - Context key
 * @param data - Context data
 */
export const setContext = (key: string, data: Record<string, any>) => {
  if (!isSentryEnabled()) {
    return;
  }

  try {
    Sentry.setContext(key, data);
  } catch (error) {
    console.error('Failed to set context:', error);
  }
};

/**
 * Measure performance of a function
 * @param name - Transaction name
 * @param operation - Operation name (e.g., 'http', 'db.query', 'render')
 * @param callback - Function to measure
 */
export const measurePerformance = async <T>(
  name: string,
  operation: string,
  callback: () => Promise<T> | T
): Promise<T> => {
  if (!isSentryEnabled()) {
    return callback();
  }

  const transaction = Sentry.startTransaction({ name, op: operation });

  try {
    const result = await callback();
    transaction.finish();
    return result;
  } catch (error) {
    transaction.setStatus('internal_error');
    transaction.finish();
    throw error;
  }
};

/**
 * Track a screen view
 * @param screenName - Name of the screen
 */
export const trackScreenView = (screenName: string) => {
  addBreadcrumb(`Screen: ${screenName}`, 'navigation');
  setTag('current_screen', screenName);
};

/**
 * Export Sentry for direct access if needed
 */
export { Sentry };

/**
 * Error tracking utilities
 */
export const ErrorTracking = {
  init: initializeErrorTracking,
  logError,
  logWarning,
  logInfo,
  addBreadcrumb,
  setUser,
  clearUser,
  setTag,
  setContext,
  measurePerformance,
  trackScreenView,
};

export default ErrorTracking;
