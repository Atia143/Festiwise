# 🚀 DEPLOYMENT CHECKLIST - Phase 2: Viral Growth Engine

## Pre-Deployment Status: ✅ READY

```
✅ Build: PASS (No errors or warnings)
✅ Tests: All OG endpoints configured
✅ Git: All changes committed & pushed
✅ Vercel: vercel.json configured
✅ Dependencies: @vercel/og installed
✅ API Routes: @edge runtime compatible
✅ Cache Headers: Configured (no-store for /api/*)
```

---

## 📋 What's Being Deployed

### New Endpoints (Live Immediately)
```
GET  /api/og/quiz-results          → Dynamic social card for quiz
GET  /api/og/festival              → Dynamic social card for festivals
POST /api/quiz/share               → Track share events & generate referral IDs
```

### New Components
```
ViralQuizResults.tsx               → Beautiful share UI with preview
ogImageGenerator.ts                → Image URL generation utilities
hrefLang.ts                        → Multi-language SEO utilities
```

### New Assets
```
/src/messages/en.json              → English translations
/src/messages/es.json              → Spanish translations  
/src/messages/de.json              → German translations
/src/messages/fr.json              → French translations
```

### Cache Configuration
All new API endpoints have `no-store` cache headers (Vercel config).

---

## 🔧 DEPLOYMENT INSTRUCTIONS

### For GitHub Auto-Deploy (Most Common)
Vercel is likely already connected to your GitHub. Your changes will auto-deploy:

1. **Check Vercel Dashboard**
   ```
   🔗 https://vercel.com/dashboard
   ```
   Look for `festival-finder` project

2. **Monitor Build**
   - You should see a new deployment starting
   - Takes ~2-3 minutes to build + deploy
   - Check "Deployments" tab for status

3. **Verify Live**
   - Once "✅ Ready" appears next to deployment
   - Visit: `https://getfestiwise.com/api/og/quiz-results?festival=Tomorrowland&score=95&genre=Electronic&budget=%24500-1000`
   - You should see an image (beautiful gradient card)

### Alternative: Deploy via CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Login (first time only)
vercel login

# Deploy to production
vercel --prod

# Then test immediately
```

### Alternative: Force Redeploy from GitHub
```bash
# Make a small change
git commit --allow-empty -m "🚀 Trigger deployment"
git push origin main

# Vercel will detect push and auto-deploy
```

---

## 🧪 TESTING AFTER DEPLOYMENT

### Quick Visual Test (Easiest)
1. Open in browser (after deploy completes):
   ```
   https://getfestiwise.com/api/og/quiz-results?festival=Tomorrowland&score=95&genre=Electronic&budget=%24500-1000&country=Belgium
   ```
2. You should see a beautiful gradient image with:
   - "🎪 FestiWise" header
   - "Tomorrowland" in large text
   - "95% Match!" in gold
   - Genre/Budget/Country in grid
   - "Share on Instagram • TikTok • Twitter" footer

### Automated Testing
```bash
# After deployment, run this to verify everything
chmod +x test-deployment.sh
./test-deployment.sh https://getfestiwise.com

# Should output: ✅ ALL TESTS PASSED!
```

### Manual API Test
```bash
# Test the share tracking API
curl -X POST https://getfestiwise.com/api/quiz/share \
  -H "Content-Type: application/json" \
  -d '{
    "festivalId": "tomorrowland",
    "matchScore": 95,
    "platform": "twitter",
    "userGenre": "Electronic",
    "userBudget": "$500-1000"
  }'

# Expected response:
# {"success":true,"shareId":"a1b2c3d4","referralUrl":"/quiz?ref=a1b2c3d4","analytics":{...}}
```

### Social Media Preview Test
Go to these tools and paste your deployment URL:

**Twitter/X:**
- Open: https://cards-dev.twitter.com/validator
- Paste: `https://getfestiwise.com/quiz`
- Should show OG image preview

**Facebook:**
- Open: https://developers.facebook.com/tools/debug/sharing/
- Paste: `https://getfestiwise.com/quiz`
- Should show OG image preview

**WhatsApp:**
- Send link to yourself
- Should show preview card with image

---

## ⏱️ Timeline

| Step | Time | Status |
|------|------|--------|
| Commit & Push | Done ✅ | |
| Vercel detects push | <1 min | ⏳ Automatic |
| Build starts | <1 min | ⏳ Automatic |
| Build completes | 2-3 mins | ⏳ Typical |
| Deploy to Production | <1 min | ⏳ Automatic |
| **Total to Live** | **~3-4 mins** | ⏰ |

---

## 🎯 Monitoring Post-Deployment

### Google Analytics (Next 24 hours)
Look for new events in GA:
- `share_click` → Each time someone clicks share button
- `share_${platform}_${festivalId}` → Platform-specific tracking
- Referral traffic from social platforms

### Vercel Analytics
Dashboard shows:
- Response times for `/api/og/*` endpoints
- Error rates (should be 0%)
- Edge function execution time (< 100ms typical)

### Error Tracking
If issues occur, check:
```
Vercel Dashboard → Deployments → [Latest] → Logs
```

---

## 🚨 ROLLBACK (If Something's Wrong)

```bash
# Undo this deployment entirely
git revert HEAD~1
git push origin main

# Vercel auto-deploys the previous version immediately
# (~2 mins to rollback)
```

Or disable a feature temporarily:
```bash
# Comment out the ViralQuizResults import in the quiz page
# Push the change
# It redeploys within 2 mins with feature disabled
```

---

## 📞 Troubleshooting

**Problem:** OG image says "Couldn't find page"
```
→ Check URL parameters are URL-encoded (%20 for space, %24 for $)
→ Example: $500-1000 becomes %24500-1000
```

**Problem:** API returns 405 (Method Not Allowed)
```
→ Make sure you're using POST for /api/quiz/share
→ GET requests only work for OG image endpoints
```

**Problem:** Image doesn't render in social previews
```
→ Visit: https://www.opengraph.xyz/
→ Paste your URL
→ It will show you what's wrong with the OG tags
```

**Problem:** Build fails after pushing
```
→ Check Vercel logs: Vercel Dashboard → Deployments → Logs
→ Usually just missing dependency → npm install && git push
```

---

## ✅ Success Criteria

Deployment is successful when:
- [ ] Vercel shows "✅ Ready" status
- [ ] OG image endpoint returns PNG
- [ ] Share API accepts POST and returns shareId
- [ ] Main pages load without 500 errors
- [ ] No "Couldn't find page" errors in Vercel logs

---

## 🎉 NEXT: Phase 3 (After Validation)

Once you confirm Post-deployment testing passes:

**Phase 3: Technical SEO (30-45 minutes)**
- JSON-LD Event schema for festivals
- Multi-language XML sitemaps
- Core Web Vitals mobile optimization

This will be deployed immediately after Phase 2 validation.

---

**Status:** ✅ Ready to Deploy  
**Last Updated:** 2026-02-28  
**Deployment Branch:** main  
**Auto-Deploy:** Enabled (GitHub → Vercel)
