# 🚀 Quick Start Guide

Get your Meme Generator app running in 5 minutes!

## Step 1: Install Dependencies

```bash
npm install
```

**Wait for installation to complete** (this may take a few minutes)

## Step 2: Start the App

```bash
npx expo start
```

You'll see a QR code in the terminal.

## Step 3: Run on Your Device

### Option A: Physical Device (Recommended)

**iOS:**
1. Install "Expo Go" from App Store
2. Open Camera app and scan the QR code
3. App will open in Expo Go

**Android:**
1. Install "Expo Go" from Google Play Store
2. Open Expo Go app
3. Tap "Scan QR code" and scan the code from terminal

### Option B: Emulator/Simulator

**iOS Simulator (Mac only):**
- Press `i` in the terminal
- Xcode must be installed

**Android Emulator:**
- Press `a` in the terminal
- Android Studio must be installed

## Step 4: Test the App

1. **Complete Onboarding**: Swipe through 3 intro slides
2. **Choose Template**: Pick any meme template
3. **Add Text**: Type something funny in top/bottom fields
4. **Customize**: Change font size and color
5. **Save**: Tap "Save Meme" button
6. **View Gallery**: Check "My Memes" tab to see your creation

## 🎉 That's It!

Your app is now running with:
- ✅ 20+ meme templates
- ✅ Text editor with customization
- ✅ Save & share functionality
- ✅ AdMob test ads
- ✅ Full gallery

## 📱 Features to Test

### Home Screen
- Search for templates
- Filter by category
- Upload custom image
- Take a photo

### Editor Screen
- Add top and bottom text
- Adjust font size with slider
- Change text color (6 colors)
- Remove watermark (watch rewarded ad)
- Save meme
- Share meme

### Gallery Screen
- View all saved memes
- Tap to view full screen
- Share memes
- Delete memes

### Settings Screen
- Rate app
- Share app
- Privacy policy
- Clear cache
- About

## 🔧 Troubleshooting

**"Cannot find module" error:**
```bash
rm -rf node_modules
npm install
```

**Metro bundler issues:**
```bash
npx expo start -c
```

**App won't connect to Metro:**
- Make sure phone and computer are on the same WiFi
- Try typing `r` in terminal to reload
- Restart Expo Go app

**Ads not showing:**
- This is normal! Test ads can take time to load
- Check console for ad errors
- Ads work better on physical devices

## 🎨 Customization

Want to customize? Check these files:

**Change colors:**
```
src/constants/colors.ts
```

**Add templates:**
```
src/utils/memeTemplates.ts
```

**Modify ad settings:**
```
src/constants/config.ts
```

## 📚 Next Steps

1. **Read README.md** for full documentation
2. **Replace test AdMob IDs** with your own (for production)
3. **Customize branding** (colors, app name, icon)
4. **Build for production** using EAS Build

## ⚡ Quick Commands

```bash
# Start development server
npx expo start

# Start with cache cleared
npx expo start -c

# Run on iOS simulator
npx expo start --ios

# Run on Android emulator
npx expo start --android

# Check for TypeScript errors
npx tsc --noEmit
```

## 🆘 Need Help?

- Check the full **README.md**
- Review console logs for errors
- Make sure all dependencies installed correctly
- Verify you're running Node.js v16+

---

**Happy Meme Making! 🎨😂**
