# Android Studio Setup Guide

This guide will help you open and run the Meme Generator app in Android Studio.

## Prerequisites

1. **Android Studio** installed (latest stable version recommended)
   - Download from: https://developer.android.com/studio

2. **Java Development Kit (JDK) 17 or higher**
   - Android Studio usually includes this

3. **Android SDK** with the following components:
   - Android SDK Platform 35
   - Android SDK Build-Tools 35.0.0
   - Android SDK Platform-Tools
   - Android SDK Tools
   - Android Emulator (for testing without a physical device)

## Step-by-Step Instructions

### 1. Install Dependencies

First, ensure all npm packages are installed:

```bash
npm install
```

### 2. Generate Native Android Project

If the `android/` folder doesn't exist or needs to be regenerated:

```bash
npx expo prebuild --platform android --clean
```

This command creates the native Android project with all necessary configurations including:
- AdMob integration
- Expo modules
- React Native dependencies
- Gradle build scripts

### 3. Open Project in Android Studio

**IMPORTANT:** Open the `android` folder, NOT the root project folder.

1. Launch Android Studio
2. Click "Open" (not "New Project")
3. Navigate to your project directory
4. Select the `android` folder (the one containing `build.gradle` and `settings.gradle`)
5. Click "OK"

### 4. Wait for Gradle Sync

Android Studio will automatically:
- Sync Gradle files
- Download dependencies
- Index the project

This may take 5-10 minutes on first run. Watch the progress bar at the bottom of the screen.

### 5. Configure Android Emulator (Optional)

If you don't have a physical device:

1. Click "Device Manager" in the toolbar (or Tools > Device Manager)
2. Click "Create Device"
3. Select a phone (e.g., Pixel 6)
4. Select a system image (e.g., Android 14 - API 34)
5. Click "Finish"

### 6. Run the App

1. Ensure your emulator is running or physical device is connected
2. In Android Studio toolbar, select your device from the dropdown
3. Click the green "Run" button (▶️) or press Shift+F10
4. Select "app" as the module to run

The app will build and launch on your device/emulator.

## Troubleshooting

### Gradle Build Fails

**Problem:** "Could not resolve all dependencies"

**Solution:**
```bash
cd android
./gradlew clean
./gradlew build
```

### Metro Bundler Not Starting

**Problem:** App builds but shows "Unable to connect to Metro"

**Solution:** Start Metro bundler manually:
```bash
# In project root (not android folder)
npx expo start
```

Then rebuild in Android Studio.

### SDK Not Found

**Problem:** "Android SDK path not found"

**Solution:**
1. Open Android Studio Settings (File > Settings on Windows/Linux, Android Studio > Preferences on Mac)
2. Go to Appearance & Behavior > System Settings > Android SDK
3. Note the SDK location (e.g., `/Users/yourname/Library/Android/sdk`)
4. In your `local.properties` file (in the `android/` folder), add:
   ```
   sdk.dir=/path/to/your/android/sdk
   ```

### Build Tools Version Error

**Problem:** "Failed to find Build Tools revision X.X.X"

**Solution:**
1. Open SDK Manager in Android Studio
2. Go to SDK Tools tab
3. Check "Show Package Details"
4. Install the required Build Tools version (35.0.0)

### Memory Issues

**Problem:** "Java heap space" or "Out of memory"

**Solution:** The `gradle.properties` file is already configured with:
```properties
org.gradle.jvmargs=-Xmx2048m -XX:MaxMetaspaceSize=512m
```

If issues persist, increase to:
```properties
org.gradle.jvmargs=-Xmx4096m -XX:MaxMetaspaceSize=1024m
```

### AdMob Errors

**Problem:** AdMob test ads not showing

**Note:** The app uses AdMob test IDs by default:
- Android App ID: `ca-app-pub-3940256099942544~3347511713`
- Banner Test ID: `ca-app-pub-3940256099942544/6300978111`
- Interstitial Test ID: `ca-app-pub-3940256099942544/1033173712`
- Rewarded Test ID: `ca-app-pub-3940256099942544/5224254917`

Before releasing, replace these with your real AdMob IDs in:
- `app.json` (plugins configuration)
- `src/utils/adManager.ts`

### Clean Build

If all else fails, do a complete clean build:

```bash
# Clean node modules
rm -rf node_modules
npm install

# Clean Android
cd android
./gradlew clean
cd ..

# Regenerate native project
npx expo prebuild --platform android --clean

# Open in Android Studio again
```

## Development Workflow

### Recommended Workflow

1. **Code changes in JavaScript/TypeScript:** Use your preferred code editor (VS Code, etc.)
2. **Run Metro bundler:** `npx expo start`
3. **Build and run from Android Studio:** Use the Run button in Android Studio
4. **Hot reload:** Shake the device/emulator and select "Reload" or press R twice in Metro terminal

### Building Release APK

```bash
cd android
./gradlew assembleRelease
```

The APK will be in: `android/app/build/outputs/apk/release/app-release.apk`

### Building Release AAB (for Google Play)

```bash
cd android
./gradlew bundleRelease
```

The AAB will be in: `android/app/build/outputs/bundle/release/app-release.aab`

## Project Structure

```
android/
├── app/
│   ├── build.gradle              # App-level build configuration
│   └── src/
│       └── main/
│           ├── AndroidManifest.xml   # App manifest with permissions
│           ├── java/com/memegen/app/
│           │   ├── MainActivity.kt   # Main React Native activity
│           │   └── MainApplication.kt # Application entry point
│           └── res/                  # Resources (icons, etc.)
├── build.gradle                  # Project-level build configuration
├── gradle.properties             # Gradle settings (memory, features)
└── settings.gradle               # Module settings
```

## Key Configuration Files

### gradle.properties
- `newArchEnabled=false` - Using stable React Native architecture
- `hermesEnabled=true` - Using Hermes JavaScript engine for better performance
- `edgeToEdgeEnabled=true` - Modern edge-to-edge UI

### AndroidManifest.xml
Contains all necessary permissions and AdMob configuration.

### app/build.gradle
Contains React Native and Expo configuration, including autolinking.

## Next Steps

Once the app runs successfully:

1. Test all features (meme creation, templates, gallery, sharing)
2. Test AdMob ads (should show test ads)
3. Test on multiple devices/screen sizes
4. Review IMPLEMENTATION_GUIDE.md for implementing remaining features
5. Review COMPLETION_SUMMARY.md for deployment checklist

## Need Help?

- Check the main README.md for project overview
- Review IMPLEMENTATION_GUIDE.md for feature implementation
- Check React Native docs: https://reactnative.dev/docs/getting-started
- Check Expo docs: https://docs.expo.dev/
- Check AdMob docs: https://developers.google.com/admob/android/quick-start
