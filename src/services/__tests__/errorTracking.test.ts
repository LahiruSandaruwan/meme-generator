/**
 * Error Tracking Service Tests
 * Tests for Sentry error tracking functions
 */

import * as Sentry from '@sentry/react-native';
import {
  initializeErrorTracking,
  logError,
  logWarning,
  logInfo,
  addBreadcrumb,
  setUser,
  clearUser,
  setTag,
  setContext,
  trackScreenView,
} from '../errorTracking';

// Mock Sentry
jest.mock('@sentry/react-native');

describe('Error Tracking Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('initializeErrorTracking', () => {
    it('should not initialize Sentry when disabled', () => {
      initializeErrorTracking();

      // Sentry should not be initialized in test environment (disabled in jest.setup.js)
      expect(Sentry.init).not.toHaveBeenCalled();
    });
  });

  describe('logError', () => {
    it('should log error object to console when Sentry is disabled', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation();
      const error = new Error('Test error');

      logError(error);

      expect(consoleError).toHaveBeenCalledWith('Error:', error, undefined);
      consoleError.mockRestore();
    });

    it('should log error string to console when Sentry is disabled', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation();

      logError('Test error message');

      expect(consoleError).toHaveBeenCalledWith('Error:', 'Test error message', undefined);
      consoleError.mockRestore();
    });

    it('should log error with context', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation();
      const context = { userId: '123', action: 'test' };

      logError('Test error', context);

      expect(consoleError).toHaveBeenCalledWith('Error:', 'Test error', context);
      consoleError.mockRestore();
    });
  });

  describe('logWarning', () => {
    it('should log warning to console when Sentry is disabled', () => {
      const consoleWarn = jest.spyOn(console, 'warn').mockImplementation();

      logWarning('Test warning');

      expect(consoleWarn).toHaveBeenCalledWith('Warning:', 'Test warning', undefined);
      consoleWarn.mockRestore();
    });

    it('should log warning with context', () => {
      const consoleWarn = jest.spyOn(console, 'warn').mockImplementation();
      const context = { feature: 'test' };

      logWarning('Test warning', context);

      expect(consoleWarn).toHaveBeenCalledWith('Warning:', 'Test warning', context);
      consoleWarn.mockRestore();
    });
  });

  describe('logInfo', () => {
    it('should log info to console when Sentry is disabled', () => {
      const consoleLog = jest.spyOn(console, 'log').mockImplementation();

      logInfo('Test info');

      expect(consoleLog).toHaveBeenCalledWith('Info:', 'Test info', undefined);
      consoleLog.mockRestore();
    });
  });

  describe('addBreadcrumb', () => {
    it('should not throw when Sentry is disabled', () => {
      expect(() => {
        addBreadcrumb('Test breadcrumb', 'navigation');
      }).not.toThrow();
    });

    it('should handle breadcrumb with data', () => {
      expect(() => {
        addBreadcrumb('User action', 'user', { button: 'save' });
      }).not.toThrow();
    });
  });

  describe('setUser', () => {
    it('should not throw when Sentry is disabled', () => {
      expect(() => {
        setUser('user-123', 'test@example.com', 'testuser');
      }).not.toThrow();
    });

    it('should handle setting user without email and username', () => {
      expect(() => {
        setUser('user-123');
      }).not.toThrow();
    });
  });

  describe('clearUser', () => {
    it('should not throw when Sentry is disabled', () => {
      expect(() => {
        clearUser();
      }).not.toThrow();
    });
  });

  describe('setTag', () => {
    it('should not throw when Sentry is disabled', () => {
      expect(() => {
        setTag('environment', 'test');
      }).not.toThrow();
    });
  });

  describe('setContext', () => {
    it('should not throw when Sentry is disabled', () => {
      expect(() => {
        setContext('device', { model: 'iPhone', os: 'iOS' });
      }).not.toThrow();
    });
  });

  describe('trackScreenView', () => {
    it('should track screen view with breadcrumb and tag', () => {
      expect(() => {
        trackScreenView('HomeScreen');
      }).not.toThrow();
    });
  });
});
