# TripSense AI - Deployment Guide

## 🚀 Deploy to Vercel (Recommended - FREE)

### Prerequisites
- GitHub account
- Vercel account (sign up at https://vercel.com)

### Step-by-Step Deployment

#### 1. Push Your Code to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Ready for deployment"

# Create a new repository on GitHub
# Then connect your local repo to GitHub
git remote add origin https://github.com/YOUR_USERNAME/tripsense-ai.git
git branch -M main
git push -u origin main
```

#### 2. Deploy on Vercel

**Option A: Using Vercel Website (Easiest)**
1. Go to https://vercel.com
2. Click "Sign Up" (use your GitHub account)
3. Click "New Project"
4. Import your `tripsense-ai` repository from GitHub
5. Vercel will auto-detect Next.js settings
6. Add Environment Variable:
   - Key: `GOOGLE_API_KEY`
   - Value: ``
7. Click "Deploy"
8. Wait 2-3 minutes for deployment to complete
9. Your app will be live at: `https://tripsense-ai.vercel.app`

**Option B: Using Vercel CLI**
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? tripsense-ai
# - Directory? ./
# - Override settings? No

# Add environment variable
vercel env add GOOGLE_API_KEY
# Paste your API key when prompted

# Deploy to production
vercel --prod
```

#### 3. Your App is Live! 🎉
Your app will be available at: `https://tripsense-ai-[random].vercel.app`

You can set up a custom domain later in Vercel settings.

---

## Alternative: Deploy to Netlify (FREE)

### Step-by-Step

1. Push code to GitHub (same as above)
2. Go to https://netlify.com
3. Sign up with GitHub
4. Click "Add new site" → "Import an existing project"
5. Choose GitHub and select your repository
6. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
7. Add environment variable:
   - Key: `GOOGLE_API_KEY`
   - Value: Your API key
8. Click "Deploy site"

---

## ⚠️ Important Security Note

**DO NOT commit `.env.local` to GitHub!**

Make sure `.env.local` is in your `.gitignore` file:

```bash
# Check if it's ignored
cat .gitignore | grep .env.local

# If not, add it
echo ".env.local" >> .gitignore
```

Then add the environment variable in Vercel/Netlify dashboard instead.

---

## 📝 Post-Deployment Checklist

- [ ] App loads successfully
- [ ] Onboarding flow works
- [ ] AI generates itineraries
- [ ] All tabs work (Itinerary, Budget, Map, Packing)
- [ ] Environment variables are set
- [ ] No errors in browser console

---

## 🔧 Troubleshooting

**Build Fails:**
- Check that all dependencies are in `package.json`
- Verify Node version is 20.9.0 or higher
- Check build logs in Vercel/Netlify dashboard

**API Key Issues:**
- Verify environment variable is set correctly
- Make sure variable name is exactly `GOOGLE_API_KEY`
- Try redeploying after setting the variable

**App Loads But Features Don't Work:**
- Check browser console for errors
- Verify API routes are working at `/api/generate-itinerary`
- Test API key on Google AI Studio

---

## 🎯 Next Steps

1. Set up custom domain (optional)
2. Enable analytics in Vercel/Netlify
3. Set up continuous deployment (auto-deploy on git push)
4. Add more features!

---

Need help? Check Vercel docs: https://vercel.com/docs
