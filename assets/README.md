# Assets Directory

This directory contains all static assets for the Meme Generator app.

## Required Files

The following asset files are required for the app to build properly:

### App Icons
- `icon.png` - App icon (1024x1024px)
- `adaptive-icon.png` - Android adaptive icon (1024x1024px)
- `favicon.png` - Web favicon (48x48px or larger)

### Splash Screen
- `splash.png` - Splash screen image (1284x2778px recommended)

## Creating Assets

### Quick Setup with Expo

Expo will use default assets if custom ones aren't provided. To create custom assets:

1. **Generate default assets:**
```bash
npx expo prebuild --clean
```

2. **Or use Expo's asset generator:**
   - Visit: https://www.appicon.co/
   - Create your icon design
   - Download and place in this directory

### Recommended Sizes

**icon.png:**
- Size: 1024x1024px
- Format: PNG with transparency
- Background: Your brand color or transparent

**adaptive-icon.png (Android):**
- Size: 1024x1024px
- Format: PNG with transparency
- Safe zone: Keep important content in center 66% (684x684px)

**splash.png:**
- Size: 1284x2778px (iPhone 14 Pro Max size)
- Format: PNG
- Background: Match your brand color (#FF6B6B recommended)
- Content: Center your logo or app name

**favicon.png:**
- Size: 48x48px minimum
- Format: PNG
- For web version of the app

## Default Assets

For development, you can use these placeholder approaches:

1. **Use Expo defaults** - Expo provides default blue icons
2. **Simple colored backgrounds** - Create solid color PNG files
3. **Free icon generators** - Use online tools to generate basic icons

## Folder Structure

```
assets/
├── icon.png
├── adaptive-icon.png
├── splash.png
├── favicon.png
└── README.md (this file)
```

## Testing Assets

After adding assets:

1. Clear the build cache:
```bash
npx expo start -c
```

2. Rebuild the app:
```bash
npx expo prebuild --clean
```

3. Test on a device to see the new icons and splash screen

## Notes

- Keep file names exactly as specified above
- PNG format is required
- Transparent backgrounds work best for icons
- Optimize images to reduce app size
- Test on both iOS and Android devices

---

For now, the app will use Expo's default assets if these files are not present.
