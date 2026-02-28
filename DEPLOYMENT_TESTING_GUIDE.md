# 🚀 DEPLOYMENT & LIVE TESTING GUIDE
# FestiWise Viral Growth Engine - Phase 2

## ✅ Pre-Deployment Checklist

### Build Status
- ✓ Clean production build succeeds
- ✓ All OG image endpoints compile
- ✓ API routes configured (no-store cache headers)
- ✓ Vercel.json configuration ready

### New Features Deployed
```
📁 /src/app/api/og/quiz-results/ → Dynamic quiz result images
📁 /src/app/api/og/festival/ → Dynamic festival images  
📁 /src/app/api/quiz/share/ → Share tracking & referral system
📁 /src/components/ViralQuizResults.tsx → Shareable UI component
📁 /src/lib/ogImageGenerator.ts → OG image utilities
📁 /src/messages/ → Multi-language dictionaries (EN/ES/DE/FR)
```

---

## 🎯 DEPLOYMENT OPTIONS

### Option 1: Auto-Deploy via GitHub (RECOMMENDED)
Since changes are pushed to `main` branch:
1. Go to https://vercel.com/dashboard
2. Select `festival-finder` project
3. New deployment will auto-trigger
4. Wait ~2 minutes for production build
5. Live at: https://getfestiwise.com

### Option 2: Deploy via CLI
```bash
npm install -g vercel
vercel --prod  # Deploy to production
```

### Option 3: Manual GitHub Trigger
Push any small change (e.g., update README):
```bash
git commit --allow-empty -m "trigger deployment"
git push origin main
```

---

## 🧪 LIVE TESTING CHECKLIST

### ✨ Test OG Image Generation
After deployment goes live:

**1. Quiz Result Image**
```
https://getfestiwise.com/api/og/quiz-results?festival=Tomorrowland&score=95&genre=Electronic&budget=%24500-1000&country=Belgium

Expected: Beautiful gradient purple/pink card with:
- Festival name (Tomorrowland)
- 95% Match score (gold)
- Genre/Budget/Country grid
- CTA text "← Tap to discover more festivals"
```

**2. Festival Preview Image**
```
https://getfestiwise.com/api/og/festival?name=Coachella&genre=Indie&country=USA&month=April&price=%24400

Expected: Gradient pink/red card with:
- Festival name
- Genre/Country/Month/Price
- Musical emoji decorations
```

### 🔄 Test Social Sharing Components

**1. Tweet Simulation**
- Open Quiz page → Complete 5-question quiz
- Click "Share Results" → Select Twitter
- Verify the social card preview renders
- Tweet should show the OG image

**2. Facebook Share**
- Use Facebook Sharing Debugger:
  ```
  https://developers.facebook.com/tools/debug/sharing/
  ```
- Paste: `https://getfestiwise.com/quiz?festival=tomorrowland&score=95`
- Verify OG image displays correctly

**3. WhatsApp Test**
- Send link to yourself on WhatsApp
- Verify preview card appears with image

### 📊 Analytics to Track
Post-deployment, monitor in Google Analytics:
- Event: `share_click` → Tracks sharing actions
- Event: `share_${platform}_${festivalId}_${score}`
- Check Referrals section for inbound traffic from shared links

---

## 🎪 FEATURE TESTING MATRIX

| Feature | Test | Expected | Status |
|---------|------|----------|--------|
| Quiz Results OG | Visit `/api/og/quiz-results?festival=...` | PNG image renders | 🔄 |
| Festival OG | Visit `/api/og/festival?name=...` | PNG image renders | 🔄 |
| Share API | POST `/api/quiz/share` with JSON | Returns shareId | 🔄 |
| No-Cache Headers | Check Response Headers | `Cache-Control: no-store` | 🔄 |
| Edge Runtime | Deploy & check regions | Image generation <100ms | 🔄 |
| Mobile Rendering | Test on iPhone/Android | Images scale properly | 🔄 |

---

## 🔧 TROUBLESHOOTING

### If OG images don't render:
1. Check Vercel logs: `vercel logs https://getfestiwise.com/api/og/quiz-results`
2. Verify `@vercel/og` is in dependencies: `npm list @vercel/og`
3. Check edge runtime compatibility (should work on Vercel Free tier)

### If sharing doesn't track:
1. POST to `/api/quiz/share` with test data:
   ```bash
   curl -X POST https://getfestiwise.com/api/quiz/share \
     -H "Content-Type: application/json" \
     -d '{"festivalId":"tomorrowland","matchScore":95,"platform":"twitter"}'
   ```
2. Should return `{ success: true, shareId: "..." }`

---

## 📱 MOBILE TESTING

Critical for 90% festival-goer mobile traffic:

- [ ] Test quiz sharing on iPhone
- [ ] Test quiz sharing on Android
- [ ] Verify OG image dimensions (1200x630) scale correctly
- [ ] Check share buttons work on mobile
- [ ] Test WhatsApp integration
- [ ] Verify no layout shifts on share UI

---

## 🎯 SUCCESS METRICS (24-48 hours post-deployment)

Track these in Google Analytics:
- [ ] Shared results count > 10
- [ ] Traffic from social referrals detected
- [ ] OG image appears in Twitter/Facebook previews
- [ ] No 404 errors on OG endpoints
- [ ] Page load time remains <3s (CWV)
- [ ] Share API response time <500ms

---

## 🚀 NEXT STEPS AFTER VALIDATION

1. **Phase 3 Immediately After**: Deploy JSON-LD Event schema
   - Makes festival structured data searchable
   - Enables Google rich snippets
   - Should take 30 mins

2. **A/B Test Sharing UI**: 
   - Version A: Current share buttons
   - Version B: "Invite a friend" vs "Share your match"
   - Measure CTR improvement

3. **Setup Referral Tracking Database**:
   - Currently API returns shareId but doesn't persist
   - Add Supabase (free PostgreSQL) or similar
   - Track conversions from referral links

---

## 📞 SUPPORT / ROLLBACK

If issues occur:
```bash
git revert HEAD~1  # Undo Phase 2 completely
git push origin main
# Vercel will auto-deploy previous version
```

Or disable specific feature:
```bash
# Comment out ViralQuizResults in quiz page
# Push change → Auto-redeployed within 2 mins
```

---

Generated: 2026-02-28
Deployment Ready: ✅
Build Status: ✅ SUCCESS (No errors)
