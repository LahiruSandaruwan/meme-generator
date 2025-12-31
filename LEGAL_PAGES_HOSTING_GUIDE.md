# Legal Pages Hosting Guide

Quick guide to host your Privacy Policy and Terms of Service online for app store submission.

## Why You Need This

Both App Store and Play Store **require public URLs** for:
- Privacy Policy (REQUIRED)
- Terms of Service (recommended)

These must be accessible to anyone without authentication.

---

## Quick Options (Free)

### Option 1: GitHub Pages (Recommended - FREE)

**Pros:**
- Free hosting
- Easy to update
- Professional look
- Version controlled
- No ads

**Setup Time:** 5-10 minutes

#### Step-by-Step:

1. **Create a new public repository** (or use existing)

```bash
# In your project root
mkdir docs
cd docs
```

2. **Create HTML files**

I'll create these files for you in a moment.

3. **Enable GitHub Pages**

```bash
# Commit and push
git add docs/
git commit -m "Add legal pages for app store submission"
git push origin development
```

4. **Enable GitHub Pages in repo settings:**
   - Go to your GitHub repo
   - Settings > Pages
   - Source: Deploy from branch
   - Branch: `development` (or `main`)
   - Folder: `/docs`
   - Save

5. **Your URLs will be:**
   - Privacy Policy: `https://yourusername.github.io/meme-generator/privacy-policy.html`
   - Terms of Service: `https://yourusername.github.io/meme-generator/terms-of-service.html`

---

### Option 2: Netlify (Easy - FREE)

**Pros:**
- Free hosting
- Custom domain support
- Instant deployment
- SSL included

**Setup Time:** 10 minutes

#### Step-by-Step:

1. Go to [Netlify.com](https://www.netlify.com/)
2. Sign up with GitHub
3. Click "Add new site" > "Import an existing project"
4. Connect to your GitHub repo
5. Build settings:
   - Build command: (leave empty)
   - Publish directory: `docs`
6. Deploy

**Your URLs:**
- Privacy: `https://your-app-name.netlify.app/privacy-policy.html`
- Terms: `https://your-app-name.netlify.app/terms-of-service.html`

---

### Option 3: Google Sites (Easiest - FREE)

**Pros:**
- Super easy drag-and-drop
- No coding required
- Free hosting

**Setup Time:** 15 minutes

#### Step-by-Step:

1. Go to [Google Sites](https://sites.google.com/)
2. Click "Blank" to create new site
3. Add two pages:
   - Page 1: "Privacy Policy"
   - Page 2: "Terms of Service"
4. Copy-paste content from your app screens
5. Click "Publish"
6. Choose URL: `meme-generator-app`

**Your URLs:**
- Privacy: `https://sites.google.com/view/meme-generator-app/privacy-policy`
- Terms: `https://sites.google.com/view/meme-generator-app/terms-of-service`

---

### Option 4: Notion (Quick - FREE)

**Pros:**
- Very easy
- Clean design
- Can update easily

**Setup Time:** 5 minutes

#### Step-by-Step:

1. Go to [Notion.so](https://www.notion.so/)
2. Create new page: "Privacy Policy"
3. Paste content
4. Click "Share" > "Share to web"
5. Copy public URL
6. Repeat for Terms of Service

**Your URLs:**
- Privacy: `https://notion.so/Privacy-Policy-abc123...`
- Terms: `https://notion.so/Terms-of-Service-def456...`

---

## Recommended: GitHub Pages Setup

I'll create the HTML files for you. Here's what I'll generate:

### Files to Create:

```
docs/
├── index.html           (Landing page)
├── privacy-policy.html  (Privacy Policy)
└── terms-of-service.html (Terms of Service)
```

### What the pages will include:

**Privacy Policy:**
- Data collection disclosure
- Third-party services (AdMob, Firebase, Sentry)
- User rights (GDPR compliant)
- Contact information
- Last updated date

**Terms of Service:**
- User agreement
- Acceptable use policy
- Content ownership
- Liability disclaimers
- Governing law

---

## HTML Template Features

- ✅ Mobile-responsive design
- ✅ Clean, professional layout
- ✅ Easy to read typography
- ✅ Print-friendly
- ✅ SEO optimized
- ✅ Fast loading
- ✅ Accessible (WCAG compliant)

---

## After Hosting

### Update Your App

Update these files with your URLs:

**1. Update .env.production:**

```bash
# Add these variables
PRIVACY_POLICY_URL=https://yourusername.github.io/meme-generator/privacy-policy.html
TERMS_URL=https://yourusername.github.io/meme-generator/terms-of-service.html
SUPPORT_EMAIL=support@yourdomain.com
```

**2. Update app.config.ts:**

Add to extra config:

```typescript
extra: {
  // ... existing config
  privacyPolicyUrl: process.env.PRIVACY_POLICY_URL,
  termsUrl: process.env.TERMS_URL,
  supportEmail: process.env.SUPPORT_EMAIL,
}
```

**3. Update SettingsScreen.tsx:**

```typescript
import Constants from 'expo-constants';

const privacyPolicyUrl = Constants.expoConfig?.extra?.privacyPolicyUrl;
const termsUrl = Constants.expoConfig?.extra?.termsUrl;

// Open in browser instead of in-app screen
<Pressable onPress={() => Linking.openURL(privacyPolicyUrl)}>
  <Text>Privacy Policy</Text>
</Pressable>
```

---

## App Store Submission

### iOS App Store Connect

1. Go to App Information
2. **Privacy Policy URL:** `https://your-url/privacy-policy.html`
3. Click Save

### Google Play Console

1. Go to Store presence > Store listing
2. Scroll to **Privacy policy**
3. **Privacy policy URL:** `https://your-url/privacy-policy.html`
4. Click Save

**Note:** Both stores will verify the URL is accessible before approval!

---

## Updating Legal Pages

### If You Need to Update:

**GitHub Pages:**
1. Edit HTML files in `docs/` folder
2. Commit and push
3. Changes live in ~1 minute

**Netlify:**
1. Edit files and push to GitHub
2. Auto-deploys in ~30 seconds

**Google Sites:**
1. Edit directly on sites.google.com
2. Click "Publish" again
3. Changes live immediately

**Notion:**
1. Edit page directly
2. Changes live immediately

---

## Custom Domain (Optional)

Want a professional URL like `https://memegenapp.com/privacy`?

### GitHub Pages with Custom Domain:

1. Buy domain from [Namecheap](https://www.namecheap.com/) (~$10/year)
2. In GitHub repo Settings > Pages
3. Add custom domain: `memegenapp.com`
4. Update DNS records at your domain registrar
5. Wait 24 hours for DNS propagation

### Netlify with Custom Domain:

1. Buy domain
2. In Netlify: Domain settings > Add custom domain
3. Follow instructions
4. SSL certificate added automatically

---

## Legal Pages Checklist

Before submitting to app stores:

- [ ] Privacy Policy URL is live and accessible
- [ ] Terms of Service URL is live and accessible (optional but recommended)
- [ ] URLs are HTTPS (secure)
- [ ] Pages load quickly (<2 seconds)
- [ ] Mobile-responsive (readable on phones)
- [ ] No broken links
- [ ] Contact email is valid
- [ ] Last updated date is current
- [ ] Tested URL in private/incognito browser
- [ ] URLs added to .env.production
- [ ] URLs added to app store listings

---

## Compliance Notes

### Privacy Policy Must Include:

- ✅ What data you collect (device IDs, usage data)
- ✅ Why you collect it (analytics, ads, crash reports)
- ✅ Third-party services used (AdMob, Firebase, Sentry)
- ✅ How users can request data deletion
- ✅ COPPA compliance (if app is for children)
- ✅ GDPR compliance (if serving EU users)
- ✅ Contact information

### Terms of Service Should Include:

- ✅ User responsibilities
- ✅ Prohibited uses
- ✅ Content ownership
- ✅ Liability disclaimers
- ✅ Termination rights
- ✅ Governing law

---

## Quick Setup Commands

I'll create the HTML files for you now. After I create them:

```bash
# Review the files
ls -la docs/

# Commit and push
git add docs/
git commit -m "Add legal pages for app store submission

- Privacy Policy (GDPR compliant)
- Terms of Service
- Mobile-responsive HTML
- Ready for GitHub Pages hosting

🤖 Generated with Claude Code"

git push origin development

# Then enable GitHub Pages in repo settings
```

---

## Support Email Setup

You need a support email for app stores. Options:

### Free Options:

1. **Gmail:**
   - Create: `memegenapp@gmail.com`
   - Free, reliable
   - Professional enough

2. **Proton Mail:**
   - More private
   - Professional
   - Free tier available

3. **Outlook:**
   - `memegenapp@outlook.com`
   - Free, Microsoft-backed

### Paid Options (More Professional):

1. **Google Workspace:**
   - `support@yourdomain.com`
   - $6/month
   - Professional email with custom domain

2. **Zoho Mail:**
   - Custom domain email
   - Free for 5 users
   - Professional

---

## Next Steps

After hosting legal pages:

1. ✅ Privacy Policy URL live
2. ✅ Terms of Service URL live
3. ✅ Support email created
4. → Add URLs to app store listings
5. → Update app to link to external URLs
6. → Test all links work

---

## Troubleshooting

### "Privacy Policy URL not accessible"

- Check URL is HTTPS (not HTTP)
- Test in incognito/private browser
- Verify GitHub Pages is enabled
- Wait 5-10 minutes after first deployment

### "URL shows 404"

- Check file name is correct (lowercase, with .html)
- Verify GitHub Pages is pointing to /docs folder
- Check branch is correct

### "URL too long for App Store field"

- Use a URL shortener (not recommended)
- Or set up custom domain
- Or use shorter hosting platform

---

**I'll create the HTML files for you next!**

Would you like me to:
1. Create the HTML files for GitHub Pages hosting?
2. Set up Netlify deployment?
3. Both?

Let me know and I'll proceed!
