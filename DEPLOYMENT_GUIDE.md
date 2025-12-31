# Deployment & Release Guide

Complete guide for deploying the Meme Generator app to production.

## Table of Contents

1. [Pre-Release Checklist](#pre-release-checklist)
2. [Environment Setup](#environment-setup)
3. [Building for Production](#building-for-production)
4. [App Store Submission](#app-store-submission)
5. [Beta Testing](#beta-testing)
6. [Release Process](#release-process)
7. [Post-Release](#post-release)
8. [Troubleshooting](#troubleshooting)

---

## Pre-Release Checklist

### Code Quality

- [ ] All tests passing (`npm test`)
- [ ] No linting errors (`npm run lint`)
- [ ] Code formatted (`npm run format`)
- [ ] TypeScript compiles (`npm run type-check`)
- [ ] All features tested manually
- [ ] No console.log statements in production code
- [ ] Error handling implemented

### Configuration

- [ ] Environment variables configured (`.env.production`)
- [ ] API keys updated (AdMob, Firebase, Sentry)
- [ ] App version bumped in `package.json` and `app.config.ts`
- [ ] Build number incremented
- [ ] Privacy Policy reviewed and up-to-date
- [ ] Terms of Service reviewed
- [ ] About/Credits information updated

### Assets

- [ ] App icon (all sizes)
- [ ] Splash screen
- [ ] Screenshots (minimum 3)
- [ ] Feature graphic (Android)
- [ ] App Store listing text prepared

### Security

- [ ] Security audit completed
- [ ] Dependencies updated
- [ ] Vulnerabilities addressed
- [ ] Secrets not hardcoded
- [ ] SSL/TLS enforced

### Performance

- [ ] App tested on low-end devices
- [ ] Bundle size optimized
- [ ] Images optimized
- [ ] No memory leaks
- [ ] Smooth animations

---

## Environment Setup

### 1. Install Required Tools

```bash
# Install Node.js (v20+)
# Install Expo CLI
npm install -g eas-cli

# Login to Expo
eas login

# Login to your accounts
# - Apple Developer Account
# - Google Play Console
```

### 2. Configure Environment Variables

**Production Environment (`.env.production`):**

```bash
APP_ENV=production

# AdMob Production IDs
ADMOB_IOS_APP_ID=ca-app-pub-YOUR-ID~YOUR-APP-ID
ADMOB_ANDROID_APP_ID=ca-app-pub-YOUR-ID~YOUR-APP-ID
ADMOB_IOS_BANNER_ID=ca-app-pub-YOUR-ID/YOUR-BANNER-ID
# ... (see .env.example for all variables)

# Sentry
SENTRY_DSN=https://your-dsn@sentry.io/your-project-id

# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_API_KEY=your-api-key

# Feature Flags
ENABLE_ANALYTICS=true
ENABLE_CRASH_REPORTING=true
```

### 3. Initialize EAS

```bash
# First time only
eas init

# Link to existing project or create new one
# Follow the prompts
```

---

## Building for Production

### iOS Build

#### Prerequisites

1. **Apple Developer Account** ($99/year)
2. **iOS Distribution Certificate**
3. **App Store Provisioning Profile**

#### Build Command

```bash
# Production build for App Store
eas build --platform ios --profile production

# Wait for build to complete (15-30 minutes)
# Download build artifacts from EAS dashboard
```

#### Manual Xcode Build (Alternative)

```bash
# Prebuild iOS project
npx expo prebuild --platform ios

# Open in Xcode
open ios/meme-generator.xcworkspace

# In Xcode:
# 1. Select "Any iOS Device (arm64)" as target
# 2. Product > Archive
# 3. Distribute App > App Store Connect
# 4. Upload
```

### Android Build

#### Prerequisites

1. **Google Play Console Account** ($25 one-time)
2. **Keystore for signing**
3. **Service Account JSON** (for automated submission)

#### Build Command

```bash
# Production build for Play Store
eas build --platform android --profile production

# Wait for build to complete (10-20 minutes)
# Download .aab file
```

#### Manual Android Build (Alternative)

```bash
# Prebuild Android project
npx expo prebuild --platform android

# Build release AAB
cd android
./gradlew bundleRelease

# Output: android/app/build/outputs/bundle/release/app-release.aab
```

### Build Both Platforms

```bash
# Build iOS and Android simultaneously
eas build --platform all --profile production
```

### Build Profiles

**Development:**
```bash
eas build --profile development --platform ios
# Creates development client for testing
```

**Preview:**
```bash
eas build --profile preview --platform android
# Creates APK for internal testing
```

**Production:**
```bash
eas build --profile production --platform all
# Creates store-ready builds
```

---

## App Store Submission

### iOS - App Store Connect

#### 1. Create App Listing

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Click "My Apps" > "+" > "New App"
3. Fill in:
   - Platform: iOS
   - Name: Meme Generator
   - Primary Language: English
   - Bundle ID: com.memegen.app
   - SKU: MEMEGEN001

#### 2. Prepare App Information

**App Information:**
- Name: Meme Generator
- Subtitle: Create & Share Funny Memes
- Category: Photo & Video (Primary), Entertainment (Secondary)

**Privacy Policy:**
- URL: https://yourwebsite.com/privacy

**App Previews and Screenshots:**
- Upload at least 3 screenshots for required device sizes
- Optional: Upload app preview videos

**Description:**
```
Create viral memes in seconds! Easy-to-use meme maker with 20+ templates...
[See APP_STORE_ASSETS.md for full description]
```

**Keywords:**
```
meme,maker,generator,funny,memes,create,share,templates
```

**Support URL:**
- https://yourwebsite.com/support

**Marketing URL (optional):**
- https://yourwebsite.com

#### 3. Upload Build

```bash
# Via EAS (automatic)
eas submit --platform ios

# Or manually via Transporter app
# 1. Download .ipa from EAS
# 2. Open Transporter
# 3. Drag .ipa file
# 4. Deliver
```

#### 4. Configure TestFlight (Optional)

1. App Store Connect > TestFlight
2. Select your app
3. Internal Testing > Add Testers
4. External Testing > Create Group
5. Submit for Beta App Review

#### 5. Submit for Review

1. Select build version
2. Add "What's New in This Version"
3. Complete all required fields
4. Export Compliance: No (if no encryption beyond what iOS provides)
5. Advertising Identifier: Yes (if using AdMob)
6. Click "Submit for Review"

**Review Time:** Typically 1-3 days

### Android - Google Play Console

#### 1. Create App

1. Go to [Google Play Console](https://play.google.com/console)
2. Create app
3. Fill in:
   - App name: Meme Generator
   - Default language: English
   - App/Game: App
   - Free/Paid: Free

#### 2. Set Up Store Listing

**Main Store Listing:**
- Short description (80 chars):
  ```
  Easy meme maker with 20+ templates. Create, customize, and share instantly!
  ```

- Full description (4000 chars):
  ```
  [See APP_STORE_ASSETS.md for full description]
  ```

- App icon: 512x512 PNG
- Feature graphic: 1024x500 PNG
- Screenshots: Minimum 2, maximum 8 (1080x1920 recommended)

**Categorization:**
- App category: Photography
- Tags: meme, photo editor, funny

**Contact Details:**
- Email: support@memegenapp.com
- Website: https://yourwebsite.com
- Privacy policy: https://yourwebsite.com/privacy

#### 3. Configure App Content

**Privacy Policy:**
- URL: https://yourwebsite.com/privacy

**App Access:**
- All functionality is available without restrictions

**Ads:**
- Yes, contains ads (AdMob)

**Content Rating:**
- Complete questionnaire
- Expected rating: Everyone (ESRB: E)

**Target Audience:**
- Age group: 13+

**News App:**
- No

**COVID-19 Contact Tracing:**
- No

**Data Safety:**
- Data collected: Device identifiers, App activity
- Data shared: With advertising partners
- Data security: Encrypted in transit

#### 4. Upload Build

```bash
# Via EAS (automatic)
eas submit --platform android

# Or manually
# 1. Download .aab from EAS
# 2. Play Console > Production > Create Release
# 3. Upload .aab
# 4. Add release notes
# 5. Review > Start rollout
```

#### 5. Release

**Internal Testing (Optional):**
1. Testing > Internal Testing
2. Create release
3. Upload AAB
4. Add testers
5. Save and publish

**Production:**
1. Production > Create Release
2. Upload AAB or select from library
3. Release name: "1.0.0"
4. Release notes:
   ```
   Initial release!

   Features:
   - 20+ popular meme templates
   - Easy text editor
   - Voice-to-text support
   - Text recognition (OCR)
   - Save and share memes
   - Offline support
   ```
5. Review release
6. Start rollout (can be staged: 20% → 50% → 100%)

**Review Time:** Few hours to 1-2 days

---

## Beta Testing

### TestFlight (iOS)

**Setup:**
```bash
# Submit to TestFlight
eas submit --platform ios

# After approval:
# 1. App Store Connect > TestFlight
# 2. Add internal testers (up to 100)
# 3. Add external testers (up to 10,000)
```

**Invite Testers:**
1. Internal: Add by email (Apple ID required)
2. External: Public link or email invitation

**Collect Feedback:**
- Crashes automatically reported
- Testers can send screenshots and feedback
- Monitor in TestFlight dashboard

### Google Play Console (Android)

**Internal Testing:**
1. Upload AAB to Internal Testing track
2. Add up to 100 testers
3. Share testing link

**Closed Testing:**
1. Create closed track
2. Add testers (via email list or Google Group)
3. Share testing link

**Open Testing:**
1. Create open track
2. Publicly available (opt-in)
3. No tester limit

**Collect Feedback:**
- Reviews in Play Console
- Crash reports in Pre-launch reports
- Firebase Crashlytics integration

---

## Release Process

### Version Numbering

**Semantic Versioning:** MAJOR.MINOR.PATCH

- **MAJOR:** Breaking changes (2.0.0)
- **MINOR:** New features (1.1.0)
- **PATCH:** Bug fixes (1.0.1)

**Example:**
- Initial release: 1.0.0
- Bug fix: 1.0.1
- New feature: 1.1.0
- Major redesign: 2.0.0

### Release Checklist

**1. Code Freeze**
- [ ] Feature complete
- [ ] All bugs fixed
- [ ] Tests passing
- [ ] Code reviewed

**2. Version Bump**
```bash
# Update package.json
npm version patch  # or minor, or major

# Update app.config.ts
# Increment version and build number
```

**3. Build**
```bash
# Run tests
npm test

# Build for both platforms
eas build --profile production --platform all
```

**4. Test Build**
- [ ] Install on test devices
- [ ] Run through full user flow
- [ ] Test all features
- [ ] Verify analytics
- [ ] Check crash reporting

**5. Submit**
```bash
# Submit to stores
eas submit --platform ios
eas submit --platform android
```

**6. Monitor**
- [ ] Watch for crashes
- [ ] Monitor reviews
- [ ] Track analytics
- [ ] Prepare for hotfixes

### Rollback Plan

If critical issues found:

**iOS:**
1. Reject binary in App Store Connect
2. Fix issues
3. Rebuild and resubmit

**Android:**
1. Halt rollout in Play Console
2. Fix issues
3. Upload new build
4. Resume rollout

---

## Post-Release

### Monitoring (First 48 Hours)

**Crash Monitoring:**
```bash
# Check Sentry dashboard
# Review crash reports
# Prioritize by affected users
```

**Analytics:**
```bash
# Firebase Analytics
# Monitor DAU, session length
# Track feature usage
```

**Reviews:**
- Check App Store reviews hourly
- Respond to negative reviews within 24 hours
- Thank positive reviewers

### Hotfix Process

If critical bug found:

1. **Assess Severity:**
   - P0: Affects all users
   - P1: Affects most users
   - P2: Affects some users

2. **Fix:**
   ```bash
   # Create hotfix branch
   git checkout -b hotfix/1.0.1

   # Fix issue
   # Test thoroughly

   # Bump patch version
   npm version patch
   ```

3. **Fast-Track Release:**
   ```bash
   # Build
   eas build --profile production --platform all

   # Submit with expedited review request
   eas submit --platform ios
   eas submit --platform android
   ```

4. **Communicate:**
   - Notify users via social media
   - Update app description
   - Post in community forums

### Regular Updates

**Monthly:**
- New meme templates
- Bug fixes
- Performance improvements

**Quarterly:**
- New features
- UI/UX improvements
- Major optimizations

---

## Troubleshooting

### Build Failures

**iOS Certificate Issues:**
```bash
# Reset credentials
eas credentials

# Or manually configure in Xcode
```

**Android Keystore Issues:**
```bash
# Generate new keystore
eas credentials
```

### Submission Rejected

**Common iOS Rejections:**
1. Missing privacy descriptions
2. Broken links
3. Crashes during review
4. Incomplete app information
5. Guideline violations

**Fix:**
- Address reviewer feedback
- Update binary if needed
- Resubmit

**Common Android Rejections:**
1. Content policy violations
2. Privacy policy issues
3. Missing disclosures
4. Broken functionality

### Runtime Issues

**Crashes:**
1. Check Sentry for stack traces
2. Reproduce locally
3. Fix and release update

**Performance:**
1. Use React Native Debugger
2. Profile with Flipper
3. Optimize bottlenecks

---

## Support Resources

### Documentation

- [EAS Build Docs](https://docs.expo.dev/build/introduction/)
- [EAS Submit Docs](https://docs.expo.dev/submit/introduction/)
- [App Store Connect Help](https://developer.apple.com/support/app-store-connect/)
- [Play Console Help](https://support.google.com/googleplay/android-developer/)

### Communities

- [Expo Forums](https://forums.expo.dev/)
- [React Native Discord](https://discord.gg/react-native)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/expo)

### Tools

- [EAS CLI](https://github.com/expo/eas-cli)
- [Fastlane](https://fastlane.tools/) - Automation
- [App Center](https://appcenter.ms/) - Distribution

---

## Automation

### GitHub Actions Deployment

Already configured in `.github/workflows/eas-build.yml`

**Trigger Build:**
1. Go to GitHub Actions tab
2. Select "EAS Build" workflow
3. Click "Run workflow"
4. Select platform and profile

### Automated Releases

**Future Enhancement:**
```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build and submit
        run: |
          eas build --profile production --platform all --non-interactive
          eas submit --platform all --non-interactive
```

---

## Conclusion

Your app is now production-ready! Follow this guide for each release to ensure smooth deployments and happy users.

**Next Steps:**
1. Complete pre-release checklist
2. Build for production
3. Submit to stores
4. Monitor and iterate

Good luck with your launch! 🚀
