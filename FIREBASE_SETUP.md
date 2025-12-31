# Firebase Analytics Setup Guide

This guide explains how to set up Firebase Analytics for the Meme Generator app.

## Prerequisites

- Google account
- Firebase project
- iOS/Android app registered in Firebase

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `meme-generator` (or your preferred name)
4. Enable/disable Google Analytics (recommended: enable)
5. Select or create a Google Analytics account
6. Click "Create project"

## Step 2: Register Your Apps

### iOS App

1. In Firebase Console, click the iOS icon
2. Enter iOS bundle ID: `com.memegen.app` (must match app.config.ts)
3. Enter app nickname: "Meme Generator iOS"
4. Download `GoogleService-Info.plist`
5. Place the file in your project root (it will be copied during build)

### Android App

1. In Firebase Console, click the Android icon
2. Enter Android package name: `com.memegen.app` (must match app.config.ts)
3. Enter app nickname: "Meme Generator Android"
4. Download `google-services.json`
5. Place the file in your project root (it will be copied during build)

## Step 3: Configure App

### Update .env.production

Add your Firebase credentials to `.env.production`:

```bash
# Firebase Analytics
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_API_KEY=your-api-key
FIREBASE_APP_ID=your-app-id
ENABLE_ANALYTICS=true
```

### Get Firebase Credentials

**Project ID:**
- Found in Firebase Console > Project Settings > General

**API Key (Web):**
- Firebase Console > Project Settings > General > Web API Key

**App ID:**
- iOS: Firebase Console > Project Settings > General > Your apps > iOS app > App ID
- Android: Firebase Console > Project Settings > General > Your apps > Android app > App ID

## Step 4: Add Config Files to Project

### iOS (GoogleService-Info.plist)

```bash
# Place in project root
cp ~/Downloads/GoogleService-Info.plist ./ios/GoogleService-Info.plist
```

The file will be automatically included in the iOS build by the Firebase plugin.

### Android (google-services.json)

```bash
# Place in project root
cp ~/Downloads/google-services.json ./android/app/google-services.json
```

The file will be automatically included in the Android build.

## Step 5: Update app.config.ts

The app.config.ts already includes Firebase configuration via environment variables. No changes needed if you've updated `.env.production`.

## Step 6: Initialize Analytics in App

Analytics initialization is already set up in the app. The `App.tsx` file should initialize analytics on startup:

```typescript
import { initializeAnalytics } from './src/services/analytics';

// In initializeApp()
await initializeAnalytics();
```

## Step 7: Test Analytics

### Development Testing

1. Set `ENABLE_ANALYTICS=true` in `.env.development`
2. Run the app: `npm start`
3. Open Firebase Console > Analytics > DebugView
4. Enable debug mode:

**iOS:**
```bash
adb shell setprop debug.firebase.analytics.app com.memegen.app.dev
```

**Android:**
```bash
adb shell setprop debug.firebase.analytics.app com.memegen.app.dev
```

5. Use the app and watch events appear in DebugView

### Production Testing

1. Build and release app with production config
2. Wait 24 hours for data to appear in Firebase Console
3. Check Analytics > Events for tracked events

## Step 8: Verify Installation

### Using Firebase Console

1. Go to Firebase Console > Analytics > Events
2. Select your app
3. Within 24 hours, you should see these automatic events:
   - `first_open`
   - `app_open`
   - `screen_view`
   - `user_engagement`

### Using Custom Events

The app logs custom events for:
- `meme_created` - When a meme is created
- `meme_saved` - When a meme is saved
- `meme_shared` - When a meme is shared
- `feature_used` - When a feature is used
- `ad_impression` - When an ad is shown
- `purchase` - When premium is unlocked

Check Analytics > Events to see these custom events.

## Available Analytics Functions

### Screen Tracking

```typescript
import { logScreenView } from '@/services/analytics';

// Track screen view
await logScreenView('HomeScreen');
```

### Event Tracking

```typescript
import Analytics from '@/services/analytics';

// Meme created
await Analytics.logMemeCreated('drake-template', false);

// Meme shared
await Analytics.logMemeShared('instagram');

// Feature used
await Analytics.logFeatureUsed('voice-to-text');

// Premium unlock
await Analytics.logPremiumUnlock('in-app-purchase', 4.99);

// Custom event
await Analytics.logEvent('custom_event', {
  param1: 'value1',
  param2: 123,
});
```

### User Properties

```typescript
import { setUserId, setUserProperty } from '@/services/analytics';

// Set user ID (for signed-in users)
await setUserId('user-123');

// Set user property
await setUserProperty('user_type', 'premium');
await setUserProperty('app_version', '1.0.0');
```

## Firebase Analytics Dashboard

### Key Metrics to Monitor

1. **Active Users**
   - Analytics > Dashboard > Active users
   - Track DAU (Daily Active Users)
   - Track MAU (Monthly Active Users)

2. **User Engagement**
   - Analytics > Engagement
   - Average engagement time
   - Sessions per user

3. **User Retention**
   - Analytics > Retention
   - Day 1 retention
   - Day 7 retention
   - Day 30 retention

4. **Events**
   - Analytics > Events
   - Custom event tracking
   - Event parameters

5. **Conversions**
   - Analytics > Conversions
   - Mark `purchase` as conversion event
   - Track conversion funnel

### Custom Reports

Create custom reports for:
- Meme creation by template
- Share method distribution
- Feature usage statistics
- Premium conversion rate
- Ad revenue per user

## Privacy & Compliance

### GDPR Compliance

Analytics respects user privacy:
- Analytics collection can be disabled
- No personally identifiable information (PII) is collected
- User can opt-out in settings

### Opt-Out Implementation

```typescript
import analytics from '@react-native-firebase/analytics';

// Disable analytics collection
await analytics().setAnalyticsCollectionEnabled(false);

// Re-enable
await analytics().setAnalyticsCollectionEnabled(true);
```

### Data Deletion

Users can request data deletion via:
1. Firebase Console > Analytics > Data Deletion
2. Or through your privacy policy contact

## Troubleshooting

### Events Not Appearing

**Issue:** Events not showing in Firebase Console

**Solutions:**
1. Wait 24 hours for data processing
2. Use DebugView for real-time testing
3. Check if analytics is enabled in config
4. Verify `google-services.json` / `GoogleService-Info.plist` are correct
5. Check network connectivity

### Build Errors

**Issue:** Build fails with Firebase errors

**Solutions:**
1. Ensure config files are in correct locations
2. Run `npx expo prebuild --clean`
3. Check Firebase SDK versions are compatible
4. Verify app bundle IDs match Firebase project

### Debug Mode Not Working

**Issue:** Events not appearing in DebugView

**Solutions:**
1. Verify debug mode is enabled:
   ```bash
   adb shell setprop debug.firebase.analytics.app YOUR_PACKAGE_NAME
   ```
2. Restart the app
3. Check device is connected to internet
4. Verify you're looking at the correct project in Firebase Console

## Best Practices

1. **Event Naming**
   - Use snake_case for event names
   - Keep names descriptive but concise
   - Follow Google's naming conventions

2. **Event Parameters**
   - Limit to 25 unique parameters per event
   - Use consistent parameter names
   - Don't include PII in parameters

3. **User Properties**
   - Limit to 25 unique user properties
   - Update when user state changes
   - Use for segmentation

4. **Performance**
   - Batch events when possible
   - Don't track too many events
   - Use sampling for high-volume events

5. **Testing**
   - Always test in development first
   - Use DebugView for verification
   - Monitor for data quality issues

## Additional Resources

- [Firebase Analytics Documentation](https://firebase.google.com/docs/analytics)
- [React Native Firebase Docs](https://rnfirebase.io/analytics/usage)
- [GA4 Best Practices](https://firebase.google.com/docs/analytics/measure-ad-revenue)
- [Privacy Guidelines](https://firebase.google.com/support/privacy)

## Support

For issues or questions:
- Check Firebase Console > Support
- Visit [Stack Overflow](https://stackoverflow.com/questions/tagged/firebase-analytics)
- Review [GitHub Issues](https://github.com/invertase/react-native-firebase/issues)
