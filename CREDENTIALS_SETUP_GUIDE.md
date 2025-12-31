# Production Credentials Setup Guide

Complete step-by-step guide to obtain and configure all production credentials.

## Table of Contents

1. [AdMob Setup](#admob-setup)
2. [Sentry Setup](#sentry-setup)
3. [Firebase Setup](#firebase-setup)
4. [Developer Accounts](#developer-accounts)
5. [Final Configuration](#final-configuration)

---

## AdMob Setup

### Step 1: Create AdMob Account

1. Go to [AdMob](https://admob.google.com/)
2. Sign in with your Google account
3. Click **"Get Started"**
4. Accept terms and conditions
5. Select your country and timezone

### Step 2: Create Your App

**For iOS:**

1. Click **"Apps"** in left sidebar
2. Click **"Add App"**
3. Select **"iOS"**
4. Choose **"No"** (app not published yet)
5. Enter app name: **"Meme Generator"**
6. Select category: **"Photo & Video"**
7. Click **"Add"**
8. **Copy the App ID** (format: `ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX`)
9. Save it as `ADMOB_IOS_APP_ID`

**For Android:**

1. Click **"Add App"** again
2. Select **"Android"**
3. Choose **"No"** (app not published yet)
4. Enter app name: **"Meme Generator"**
5. Select category: **"Photography"**
6. Click **"Add"**
7. **Copy the App ID** (format: `ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX`)
8. Save it as `ADMOB_ANDROID_APP_ID`

### Step 3: Create Ad Units

For **EACH app** (iOS and Android), create 3 ad units:

#### Banner Ad Unit

1. Go to your app > **"Ad units"** tab
2. Click **"Add ad unit"**
3. Select **"Banner"**
4. Ad unit name: **"Home Banner"**
5. Click **"Create ad unit"**
6. **Copy the Ad unit ID** (format: `ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX`)
7. Save it as:
   - iOS: `ADMOB_IOS_BANNER_ID`
   - Android: `ADMOB_ANDROID_BANNER_ID`

#### Interstitial Ad Unit

1. Click **"Add ad unit"** again
2. Select **"Interstitial"**
3. Ad unit name: **"Meme Created Interstitial"**
4. Click **"Create ad unit"**
5. **Copy the Ad unit ID**
6. Save it as:
   - iOS: `ADMOB_IOS_INTERSTITIAL_ID`
   - Android: `ADMOB_ANDROID_INTERSTITIAL_ID`

#### Rewarded Ad Unit

1. Click **"Add ad unit"** again
2. Select **"Rewarded"**
3. Ad unit name: **"Premium Unlock Reward"**
4. Reward amount: **1**
5. Reward item: **"Premium Features"**
6. Click **"Create ad unit"**
7. **Copy the Ad unit ID**
8. Save it as:
   - iOS: `ADMOB_IOS_REWARDED_ID`
   - Android: `ADMOB_ANDROID_REWARDED_ID`

### Total AdMob IDs Needed

- ✅ ADMOB_IOS_APP_ID
- ✅ ADMOB_ANDROID_APP_ID
- ✅ ADMOB_IOS_BANNER_ID
- ✅ ADMOB_ANDROID_BANNER_ID
- ✅ ADMOB_IOS_INTERSTITIAL_ID
- ✅ ADMOB_ANDROID_INTERSTITIAL_ID
- ✅ ADMOB_IOS_REWARDED_ID
- ✅ ADMOB_ANDROID_REWARDED_ID

**Estimated Time:** 15-20 minutes

---

## Sentry Setup

### Step 1: Create Sentry Account

1. Go to [Sentry.io](https://sentry.io/)
2. Click **"Get Started"**
3. Sign up with email or GitHub
4. Verify your email

### Step 2: Create Organization

1. Organization name: **"YourName"** or **"YourCompany"**
2. Click **"Create Organization"**
3. **Copy the org slug** (e.g., `your-org-name`)
4. Save it as `SENTRY_ORG`

### Step 3: Create Project

1. Click **"Create Project"**
2. Select platform: **"React Native"**
3. Project name: **"meme-generator"**
4. Save it as `SENTRY_PROJECT`
5. Click **"Create Project"**

### Step 4: Get DSN

1. After project creation, you'll see the **DSN** on the screen
2. Format: `https://XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX@o123456.ingest.sentry.io/1234567`
3. **Copy the DSN**
4. Save it as `SENTRY_DSN`

### Step 5: Create Auth Token

1. Go to **Settings** (gear icon) > **Developer Settings**
2. Click **"New Token"**
3. Token name: **"Meme Generator CI/CD"**
4. Scopes: Select:
   - `project:read`
   - `project:releases`
   - `org:read`
5. Click **"Create Token"**
6. **Copy the token** (shown only once!)
7. Save it as `SENTRY_AUTH_TOKEN`

### Total Sentry Credentials Needed

- ✅ SENTRY_DSN
- ✅ SENTRY_AUTH_TOKEN
- ✅ SENTRY_PROJECT (usually "meme-generator")
- ✅ SENTRY_ORG (your org slug)

**Estimated Time:** 10 minutes

---

## Firebase Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Project name: **"Meme Generator"**
4. Click **"Continue"**
5. Enable Google Analytics: **Yes** (recommended)
6. Select or create Analytics account
7. Click **"Create project"**
8. Wait for project creation (1-2 minutes)

### Step 2: Get Firebase Config

**For iOS:**

1. In Firebase console, click **"Add app"** > iOS icon
2. iOS bundle ID: `com.memegen.app` (or your chosen bundle ID)
3. App nickname: **"Meme Generator iOS"**
4. Click **"Register app"**
5. Download **GoogleService-Info.plist**
6. From the plist file, copy:
   - `GOOGLE_APP_ID` → Save as `FIREBASE_APP_ID`
   - `API_KEY` → Save as `FIREBASE_API_KEY`
   - `PROJECT_ID` → Save as `FIREBASE_PROJECT_ID`

**For Android:**

1. Click **"Add app"** > Android icon
2. Android package name: `com.memegen.app`
3. App nickname: **"Meme Generator Android"**
4. Click **"Register app"**
5. Download **google-services.json**
6. Place file in: `android/app/google-services.json`

### Step 3: Enable Analytics

1. In Firebase console, go to **Analytics** > **Events**
2. Analytics is automatically enabled
3. Review default events being tracked

### Total Firebase Credentials Needed

- ✅ FIREBASE_PROJECT_ID
- ✅ FIREBASE_API_KEY
- ✅ FIREBASE_APP_ID
- ✅ GoogleService-Info.plist (iOS)
- ✅ google-services.json (Android)

**Estimated Time:** 15 minutes

---

## Developer Accounts

### Apple Developer Program

**Cost:** $99/year

1. Go to [Apple Developer](https://developer.apple.com/programs/)
2. Click **"Enroll"**
3. Sign in with Apple ID
4. Choose **"Individual"** (or Company if applicable)
5. Fill out personal information
6. Pay $99 USD
7. Wait for approval (usually 24-48 hours)

**What you get:**
- Ability to publish to App Store
- TestFlight beta testing
- Distribution certificates
- Push notification certificates

### Google Play Console

**Cost:** $25 (one-time)

1. Go to [Google Play Console](https://play.google.com/console/signup)
2. Sign in with Google account
3. Accept Developer Distribution Agreement
4. Pay $25 registration fee
5. Complete account details
6. Verify identity (if required)

**What you get:**
- Ability to publish to Play Store
- Internal/closed/open testing tracks
- App analytics and reports
- Revenue and statistics

**Estimated Time:** 1 hour (+ approval wait time)

---

## Final Configuration

### Step 1: Update .env.production

Once you have all credentials, update `.env.production`:

```bash
# Open the file
nano .env.production

# Or use VS Code
code .env.production
```

Replace all placeholder values with your actual credentials:

```bash
# AdMob Production IDs
ADMOB_IOS_APP_ID=ca-app-pub-1234567890123456~1234567890
ADMOB_ANDROID_APP_ID=ca-app-pub-1234567890123456~0987654321

# AdMob Ad Unit IDs
ADMOB_IOS_BANNER_ID=ca-app-pub-1234567890123456/1111111111
ADMOB_ANDROID_BANNER_ID=ca-app-pub-1234567890123456/2222222222
ADMOB_IOS_INTERSTITIAL_ID=ca-app-pub-1234567890123456/3333333333
ADMOB_ANDROID_INTERSTITIAL_ID=ca-app-pub-1234567890123456/4444444444
ADMOB_IOS_REWARDED_ID=ca-app-pub-1234567890123456/5555555555
ADMOB_ANDROID_REWARDED_ID=ca-app-pub-1234567890123456/6666666666

# Sentry Configuration
SENTRY_DSN=https://abc123def456@o123456.ingest.sentry.io/7654321
SENTRY_AUTH_TOKEN=sntrys_abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
SENTRY_PROJECT=meme-generator
SENTRY_ORG=your-org-name

# Firebase Analytics
FIREBASE_PROJECT_ID=meme-generator-abc123
FIREBASE_API_KEY=AIzaSyAaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQq
FIREBASE_APP_ID=1:123456789012:ios:abc123def456ghi789
```

### Step 2: Update GitHub Secrets

For CI/CD to work, add these secrets to GitHub:

1. Go to your GitHub repo
2. Settings > Secrets and variables > Actions
3. Click **"New repository secret"**
4. Add each secret:

```
EXPO_TOKEN - Get from: npx expo login && npx expo whoami --auth
SENTRY_AUTH_TOKEN - From Sentry setup above
SENTRY_ORG - Your Sentry organization slug
```

### Step 3: Verify Configuration

Run the validation script:

```bash
npm run validate
```

This will:
- ✅ Check all environment variables are set
- ✅ Run TypeScript compilation
- ✅ Run ESLint
- ✅ Run all tests
- ✅ Check for security vulnerabilities

### Step 4: Test with Production Config

```bash
# Set production environment
export APP_ENV=production

# Start development server
npm start

# Verify:
# - AdMob test ads appear (or real ads if approved)
# - Analytics events are sent
# - Error tracking works
```

---

## Credentials Checklist

Before proceeding to build and deploy, ensure you have:

### AdMob (8 IDs)
- [ ] ADMOB_IOS_APP_ID
- [ ] ADMOB_ANDROID_APP_ID
- [ ] ADMOB_IOS_BANNER_ID
- [ ] ADMOB_ANDROID_BANNER_ID
- [ ] ADMOB_IOS_INTERSTITIAL_ID
- [ ] ADMOB_ANDROID_INTERSTITIAL_ID
- [ ] ADMOB_IOS_REWARDED_ID
- [ ] ADMOB_ANDROID_REWARDED_ID

### Sentry (4 values)
- [ ] SENTRY_DSN
- [ ] SENTRY_AUTH_TOKEN
- [ ] SENTRY_PROJECT
- [ ] SENTRY_ORG

### Firebase (3 values + 2 files)
- [ ] FIREBASE_PROJECT_ID
- [ ] FIREBASE_API_KEY
- [ ] FIREBASE_APP_ID
- [ ] GoogleService-Info.plist (iOS)
- [ ] google-services.json (Android)

### Developer Accounts
- [ ] Apple Developer Program ($99/year)
- [ ] Google Play Console ($25 one-time)

---

## Quick Reference Sheet

Print this and fill in as you go:

```
=== AdMob ===
iOS App ID: ca-app-pub-________________~__________
Android App ID: ca-app-pub-________________~__________

iOS Banner: ca-app-pub-________________/__________
Android Banner: ca-app-pub-________________/__________

iOS Interstitial: ca-app-pub-________________/__________
Android Interstitial: ca-app-pub-________________/__________

iOS Rewarded: ca-app-pub-________________/__________
Android Rewarded: ca-app-pub-________________/__________

=== Sentry ===
DSN: https://________________________________@sentry.io/________
Auth Token: sntrys_________________________________________________
Project: meme-generator
Org: ____________________

=== Firebase ===
Project ID: _______________________
API Key: AIzaSy______________________________
App ID: 1:____________:ios:__________________

=== Accounts ===
Apple Developer: [ ] Enrolled [ ] Approved
Google Play Console: [ ] Registered [ ] Verified
```

---

## Troubleshooting

### AdMob ads not showing

- Make sure you're using test ad unit IDs in development
- Production ads take 24 hours to activate after app approval
- Check AdMob account is approved (can take 24-48 hours)

### Sentry not receiving errors

- Verify `ENABLE_CRASH_REPORTING=true` in .env
- Check DSN format is correct
- Ensure internet connection available
- Test with: `logError('Test error from production')`

### Firebase Analytics not tracking

- Verify `ENABLE_ANALYTICS=true` in .env
- Check Firebase console > Analytics > DebugView
- Wait 24 hours for initial data to appear
- Enable debug mode: `adb shell setprop debug.firebase.analytics.app com.memegen.app`

### Environment variables not loading

- Restart Metro bundler after changing .env files
- Clear cache: `npx expo start -c`
- Verify app.config.ts is reading from correct .env file
- Check no typos in variable names

---

## Next Steps

After completing all credential setup:

1. ✅ All credentials configured in `.env.production`
2. ✅ GitHub secrets added
3. ✅ Validation passes: `npm run validate`
4. → **Next:** Create app store screenshots ([SCREENSHOT_CREATION_GUIDE.md](SCREENSHOT_CREATION_GUIDE.md))
5. → **Next:** Host legal pages online
6. → **Next:** Build production apps: `eas build --platform all --profile production`

---

**Total Setup Time:** 1-2 hours
**Cost:** $124 (Apple $99 + Google $25)

Good luck with your launch! 🚀
