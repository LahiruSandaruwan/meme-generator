# Environment Configuration Guide

This guide explains how to configure environment variables for different build environments.

## Overview

The app uses environment-specific configuration files to manage API keys, feature flags, and build settings:

- **`.env.example`** - Template with all available variables (committed to git)
- **`.env.development`** - Development configuration with test IDs (committed to git)
- **`.env.production`** - Production configuration with real IDs (**NOT committed to git**)

## Quick Start

### For Development

The `.env.development` file is already configured with test AdMob IDs and safe defaults. You can start developing immediately:

```bash
npm start
```

### For Production

1. Copy the production template:
```bash
cp .env.production .env.production.local
```

2. Edit `.env.production.local` and replace placeholder values with your actual credentials:
   - AdMob App IDs and Ad Unit IDs
   - Sentry DSN and authentication tokens
   - Firebase project credentials
   - Any other production-specific values

3. Build for production:
```bash
# Using EAS Build
eas build --profile production --platform ios
eas build --profile production --platform android
```

## Configuration Files

### app.config.ts

Dynamic Expo configuration that reads environment variables and generates the app config. This replaces the static `app.json` file.

**Key features:**
- Loads environment-specific variables
- Configures platform-specific settings (iOS/Android)
- Sets up plugins (AdMob, Sentry, etc.)
- Makes variables available via `expo-constants`

### eas.json

EAS Build configuration defining build profiles:

- **`development`** - Development builds with debugging enabled
- **`preview`** - Internal testing builds (APK for Android)
- **`production`** - Production builds for app stores (AAB/IPA)

### src/config/env.ts

Type-safe environment configuration utilities. Import this in your app code:

```typescript
import ENV_CONFIG, {
  isProduction,
  isDevelopment,
  isSentryEnabled
} from '@/config/env';

// Access configuration
const bannerId = ENV_CONFIG.admob.bannerId;
const apiUrl = ENV_CONFIG.api.baseUrl;

// Use helper functions
if (isSentryEnabled()) {
  // Initialize Sentry
}
```

## Environment Variables Reference

### App Configuration

| Variable | Description | Example |
|----------|-------------|---------|
| `APP_ENV` | Environment name | `development`, `production` |
| `APP_NAME` | App display name | `Meme Generator` |
| `APP_VERSION` | App version | `1.0.0` |
| `APP_BUNDLE_ID_IOS` | iOS bundle identifier | `com.memegen.app` |
| `APP_BUNDLE_ID_ANDROID` | Android package name | `com.memegen.app` |

### AdMob Configuration

Get your AdMob credentials from [AdMob Console](https://admob.google.com):

| Variable | Description | Format |
|----------|-------------|--------|
| `ADMOB_IOS_APP_ID` | iOS AdMob App ID | `ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX` |
| `ADMOB_ANDROID_APP_ID` | Android AdMob App ID | `ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX` |
| `ADMOB_IOS_BANNER_ID` | iOS Banner Ad Unit ID | `ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX` |
| `ADMOB_ANDROID_BANNER_ID` | Android Banner Ad Unit ID | `ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX` |
| `ADMOB_IOS_INTERSTITIAL_ID` | iOS Interstitial Ad Unit ID | `ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX` |
| `ADMOB_ANDROID_INTERSTITIAL_ID` | Android Interstitial Ad Unit ID | `ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX` |
| `ADMOB_IOS_REWARDED_ID` | iOS Rewarded Ad Unit ID | `ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX` |
| `ADMOB_ANDROID_REWARDED_ID` | Android Rewarded Ad Unit ID | `ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX` |

**Note:** Development builds use test AdMob IDs by default. Never use test IDs in production.

### Sentry Configuration

Get your Sentry credentials from [Sentry.io](https://sentry.io):

| Variable | Description | Example |
|----------|-------------|---------|
| `SENTRY_DSN` | Sentry Data Source Name | `https://xxx@sentry.io/xxx` |
| `SENTRY_AUTH_TOKEN` | Sentry authentication token | `sntrys_xxx...` |
| `SENTRY_PROJECT` | Sentry project name | `meme-generator` |
| `SENTRY_ORG` | Sentry organization slug | `your-org-name` |

### Firebase Analytics

Get your Firebase credentials from [Firebase Console](https://console.firebase.google.com):

| Variable | Description |
|----------|-------------|
| `FIREBASE_PROJECT_ID` | Firebase project ID |
| `FIREBASE_API_KEY` | Firebase API key |
| `FIREBASE_APP_ID` | Firebase app ID |

### Feature Flags

| Variable | Description | Values |
|----------|-------------|--------|
| `ENABLE_ANALYTICS` | Enable Firebase Analytics | `true`, `false` |
| `ENABLE_CRASH_REPORTING` | Enable Sentry crash reporting | `true`, `false` |
| `ENABLE_ADS` | Enable AdMob ads | `true`, `false` |

### Premium Features

| Variable | Description | Default |
|----------|-------------|---------|
| `FREEMIUM_MEME_LIMIT` | Free meme creation limit | `5` |
| `PREMIUM_PRICE_USD` | Premium unlock price (USD) | `4.99` |

## Build Profiles

### Development Build

For local development and debugging:

```bash
# iOS Simulator
eas build --profile development --platform ios

# Android Emulator/Device
eas build --profile development --platform android
```

**Characteristics:**
- Uses `.env.development` configuration
- Development client enabled
- Debug symbols included
- Faster build times
- Hot reloading enabled

### Preview Build

For internal testing (QA, beta testers):

```bash
# iOS (requires Apple Developer account)
eas build --profile preview --platform ios

# Android (APK for easy sharing)
eas build --profile preview --platform android
```

**Characteristics:**
- Uses `.env.development` or custom configuration
- Optimized build
- Internal distribution
- APK format (Android) for easy installation

### Production Build

For app store submission:

```bash
# iOS App Store
eas build --profile production --platform ios

# Google Play Store
eas build --profile production --platform android
```

**Characteristics:**
- Uses `.env.production` configuration
- Full optimization
- Auto-increments version numbers
- AAB format (Android) for Play Store
- Code signing required

## Security Best Practices

### 1. Never Commit Secrets

The `.gitignore` file is configured to exclude:
- `.env.production` (production secrets)
- `.env.local` (local overrides)
- `google-play-service-account.json` (Play Store credentials)
- `*.p12` (iOS certificates)
- `*.mobileprovision` (iOS provisioning profiles)

### 2. Use Test IDs in Development

Always use AdMob test IDs during development to avoid account suspension:

```
iOS Banner: ca-app-pub-3940256099942544/2435281174
Android Banner: ca-app-pub-3940256099942544/6300978111
```

### 3. Rotate Credentials Regularly

Change your production API keys and tokens periodically, especially if:
- A team member leaves
- Credentials may have been compromised
- You suspect unauthorized access

### 4. Use EAS Secrets for CI/CD

For automated builds, store secrets in EAS:

```bash
# Set a secret
eas secret:create --scope project --name ADMOB_IOS_APP_ID --value "ca-app-pub-xxx"

# List secrets
eas secret:list

# Delete a secret
eas secret:delete --name ADMOB_IOS_APP_ID
```

Reference secrets in `eas.json`:

```json
{
  "build": {
    "production": {
      "env": {
        "ADMOB_IOS_APP_ID": "@admob-ios-app-id"
      }
    }
  }
}
```

## Troubleshooting

### Issue: Environment variables not loading

**Solution:** Ensure `expo-constants` is installed:
```bash
npm install expo-constants
```

### Issue: Wrong AdMob IDs in production

**Solution:** Check `APP_ENV` is set to `production` in your build profile:
```json
{
  "build": {
    "production": {
      "env": {
        "APP_ENV": "production"
      }
    }
  }
}
```

### Issue: App crashes on launch after adding Sentry

**Solution:** Verify Sentry DSN format and ensure the Sentry plugin is only enabled in production:
```typescript
// app.config.ts
...(sentryDsn && !isDevelopment
  ? [
      [
        '@sentry/react-native/expo',
        { organization: sentryOrg, project: sentryProject }
      ]
    ]
  : [])
```

### Issue: Cannot access environment variables in code

**Solution:** Use the `ENV_CONFIG` utility instead of `process.env`:

```typescript
// ❌ Wrong - process.env not available at runtime
const apiUrl = process.env.API_BASE_URL;

// ✅ Correct - use ENV_CONFIG
import ENV_CONFIG from '@/config/env';
const apiUrl = ENV_CONFIG.api.baseUrl;
```

## Migration from app.json

The app now uses `app.config.ts` instead of `app.json`. The old `app.json` can be kept for reference but won't be used. To switch back to static config:

1. Rename `app.config.ts` to `app.config.ts.backup`
2. Rename `app.json` to match your desired configuration
3. Manually set all configuration values (no environment variables)

**Note:** Using `app.config.ts` is recommended for production apps as it provides:
- Environment-specific configurations
- Type safety
- Dynamic value generation
- Better secret management

## Next Steps

1. **Setup AdMob Account**: Create your AdMob account and app at [admob.google.com](https://admob.google.com)
2. **Setup Sentry**: Create a Sentry project at [sentry.io](https://sentry.io)
3. **Setup Firebase**: Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
4. **Configure EAS**: Run `eas init` to set up EAS Build
5. **Update .env.production**: Add all your production credentials
6. **Test Build**: Create a preview build to test the configuration

## Support

For issues or questions:
- Check the [Expo documentation](https://docs.expo.dev)
- Review [EAS Build docs](https://docs.expo.dev/build/introduction/)
- Check the [troubleshooting guide](./FEATURE_TROUBLESHOOTING_GUIDE.md)
