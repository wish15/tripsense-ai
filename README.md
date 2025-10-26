# 🌍 TripSense AI - AI-Powered Travel Planner

> Your perfect trip, planned in minutes. Get personalized itineraries that match your vibe, budget, and travel style.

## ✨ Features

- **🎯 Intelligent Onboarding Quiz** - 5-step conversational form
- **🤖 AI Itinerary Engine** - GPT-powered with vibe matching
- **💰 Smart Budget Dashboard** - 70%/100%/130% flex views
- **🗺️ Interactive Map View** - Visualize your journey
- **📤 Shareable Itinerary** - Share links & export PDF
- **💡 Budget Optimizer** - AI finds cheaper alternatives
- **🔄 Plan B Generator** - Backup options ready
- **🎒 Smart Packing List** - Personalized for your trip

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment Variables
Create `.env.local` file:
```env
OPENAI_API_KEY=your_key_here
```

Get free OpenAI API key: [platform.openai.com](https://platform.openai.com)

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📦 Tech Stack

- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** + Shadcn/ui
- **OpenAI GPT-4o-mini** (AI generation)
- **Supabase** (Database - optional)
- **Mapbox** (Maps - optional)

## 🎯 MVP Features Checklist

- [x] Landing page
- [x] Onboarding quiz (5 steps)
- [x] AI itinerary generation
- [x] Budget dashboard
- [x] Map view
- [x] Packing list
- [x] Share functionality
- [ ] Budget optimizer API
- [ ] Plan B generator API
- [ ] PDF export

## 💰 Cost Estimate

For 1000 users:
- Hosting: $0 (Vercel free tier)
- OpenAI API: ~$100-150
- Total: ~$100-150/month

## 🚢 Deploy to Vercel

```bash
npm install -g vercel
vercel --prod
```

Add environment variables in Vercel dashboard.

## 📝 Project Structure

```
src/
├── app/              # Pages & API routes
├── components/       # React components
├── lib/             # Utilities & API clients
└── types/           # TypeScript types
```

## 🐛 Troubleshooting

**"Module not found"**
```bash
npm install
```

**OpenAI errors**
- Check API key in `.env.local`
- Ensure billing is set up

**Port in use**
```bash
npm run dev -- -p 3001
```

## 📚 Documentation

See full documentation in [docs/DOCUMENTATION.md](./docs/DOCUMENTATION.md)

## 🤝 Case Study Submission

This project is built for a Product Management case study.

**Features implemented:**
1. Problem understanding & assumptions
2. MVP scope clearly defined  
3. Success metrics tracked
4. Technical feasibility demonstrated
5. Rollout plan ready

---

**Built with ❤️ for travelers**
