# 🚀 Quick Start Guide - TripSense AI

## Prerequisites

- Node.js >= 20.9.0
- npm or yarn
- OpenAI API key (required)

## Setup Instructions

### 1. Install Dependencies

```powershell
cd C:\work\KiiSIP\tripsense-ai
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

**Get your OpenAI API key:**
1. Visit [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Sign up or log in
3. Create a new API key
4. Copy and paste it into `.env.local`

**Note:** You'll need to add billing information to OpenAI (minimum $5). The app uses GPT-4o-mini which costs ~$0.10 per itinerary.

### 3. Run the Development Server

```powershell
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features & Usage

### Feature 1: Intelligent Onboarding Quiz 🎯

**Path:** `/onboarding`

- 5-step conversational form
- Collects destination, dates, budget, travelers, and vibe preferences
- Real-time validation and progress tracking
- Quick-select suggestions for common destinations and budgets

**User Flow:**
1. Step 1: Enter destination
2. Step 2: Select travel dates
3. Step 3: Set budget with slider
4. Step 4: Number of travelers and pace
5. Step 5: Vibe profile (adventure, culture, relaxation, etc.)

### Feature 2: AI Itinerary Engine 🤖

**Path:** `/generate` → `/itinerary`

- Generates personalized day-by-day itinerary using GPT-4o-mini
- Matches activities to user's vibe profile
- Includes timing, costs, locations, and insider tips
- Calculates vibe match score (how well itinerary matches personality)

**What's Generated:**
- Day-by-day schedule with 3-5 activities per day
- Activity details: name, description, cost, duration, energy level
- Location coordinates and addresses
- Insider tips for each activity
- Trip highlights summary

### Feature 3: Smart Budget Dashboard 💰

**Path:** `/itinerary` (Budget tab)

- Real-time budget breakdown by category
- 3-view budget flex: 70% / 100% / 130%
- Per-person and per-day cost calculations
- Visual progress bars for each category
- Money-saving tips specific to destination

**Budget Categories:**
- Attractions
- Food & Dining
- Transportation
- Entertainment
- Shopping
- Nature activities
- Culture & Museums
- Relaxation

### Feature 4: Interactive Map 🗺️

**Path:** `/itinerary` (Map tab)

- Lists all activities with Google Maps links
- Shows day number, time, and location for each activity
- Travel stats: total locations, cities visited, estimated travel time
- Click to open in Google Maps for navigation

**Note:** Full interactive map requires Mapbox token (optional).

### Feature 5: Shareable Itinerary 📤

**Features:**
- Share button with native share API (mobile-friendly)
- Export to PDF (coming soon)
- Public URL sharing
- Copy link to clipboard fallback

**How to Share:**
1. Click "Share" button in header
2. Use native share menu (mobile) or copy link
3. Recipients can view itinerary without login

### Feature 6: Budget Optimizer AI 💡

**Path:** `/itinerary` (Budget tab) - "Optimize My Budget" button

- AI finds cheaper alternatives while maintaining experience quality
- Shows savings breakdown
- Explains each substitution
- Maintains vibe match score

**API Endpoint:** `POST /api/optimize-budget`

```json
{
  "itinerary": { /* current itinerary */ },
  "targetBudget": 1200
}
```

### Feature 7: Plan B Generator 🔄

**Path:** `/itinerary` - "Show backup options" on each activity

- Generates 2-3 alternative activities
- Accounts for weather, closures, fatigue
- Maintains same time slot and vibe
- Suggests indoor/outdoor alternatives

**API Endpoint:** `POST /api/plan-b`

```json
{
  "activity": { /* activity object */ },
  "reason": "rain" | "closed" | "tired" | "expensive" | "crowded"
}
```

### Feature 8: Smart Packing List 🎒

**Path:** `/itinerary` (Packing tab)

- AI-generated based on activities and weather
- Categorized: Documents, Clothing, Electronics, Health, Activity-specific
- Checkable items with progress tracking
- Explains why each item is needed
- Essential items highlighted

**Smart Features:**
- Adds hiking gear if nature activities detected
- Includes swimwear for beach destinations
- Suggests modest clothing for cultural sites
- Weather-aware recommendations

## API Endpoints

### Generate Itinerary
```
POST /api/generate-itinerary
Body: TravelPreferences object
Response: { itinerary, vibeScore, success }
```

### Optimize Budget
```
POST /api/optimize-budget
Body: { itinerary, targetBudget }
Response: { optimizedItinerary, savings, changes }
```

### Generate Plan B
```
POST /api/plan-b
Body: { activity, reason }
Response: { alternatives[], explanation }
```

## Data Flow

```
User Input (Onboarding)
    ↓
localStorage (travelPreferences)
    ↓
API /generate-itinerary (OpenAI)
    ↓
localStorage (currentItinerary)
    ↓
Itinerary Page (Display & Edit)
```

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** Shadcn/ui + Radix UI
- **AI:** OpenAI GPT-4o-mini
- **State:** React useState + localStorage
- **Icons:** Lucide React

## Cost Breakdown

### Per Itinerary Generation:
- OpenAI API: ~$0.10-0.15
- Budget Optimizer: ~$0.05
- Plan B (per activity): ~$0.02

### For 1000 users:
- OpenAI: ~$100-150
- Hosting (Vercel): $0 (free tier)
- **Total: ~$100-150/month**

## Troubleshooting

### OpenAI API Errors

**Error:** "Missing OPENAI_API_KEY"
- Solution: Add key to `.env.local` and restart server

**Error:** "Insufficient funds"
- Solution: Add billing to OpenAI account (minimum $5)

**Error:** "Rate limit exceeded"
- Solution: Wait or upgrade OpenAI plan

### Build Errors

**Error:** "Module not found: tailwindcss-animate"
```powershell
npm install -D tailwindcss-animate
```

**Error:** "Cannot find module '@radix-ui/...'"
```powershell
npm install @radix-ui/react-slot @radix-ui/react-label @radix-ui/react-slider @radix-ui/react-progress
```

### Dev Server Issues

**Port 3000 already in use:**
```powershell
npm run dev -- -p 3001
```

**CSS not loading:**
- Clear `.next` folder and restart:
```powershell
Remove-Item -Recurse -Force .next
npm run dev
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Landing page
│   ├── onboarding/        # Quiz pages
│   ├── generate/          # Loading screen
│   ├── itinerary/         # Main itinerary view
│   └── api/               # API routes
│       ├── generate-itinerary/
│       ├── optimize-budget/
│       └── plan-b/
├── components/
│   ├── ui/                # Shadcn components
│   ├── budget/            # Budget dashboard
│   ├── itinerary/         # Day cards & activities
│   ├── map/               # Map view
│   └── packing/           # Packing list
├── lib/
│   ├── ai/                # OpenAI client & prompts
│   ├── db/                # Database utilities
│   └── utils.ts           # Helper functions
└── types/
    └── index.ts           # TypeScript types
```

## Next Steps

1. **Add Mapbox:** For interactive maps
   - Get token from mapbox.com
   - Add to `.env.local` as `NEXT_PUBLIC_MAPBOX_TOKEN`

2. **Add Supabase:** For persistence
   - Create project at supabase.com
   - Add credentials to `.env.local`
   - Implement save/load itineraries

3. **Deploy to Vercel:**
```powershell
npm install -g vercel
vercel --prod
```

## Support

- **OpenAI Docs:** https://platform.openai.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Tailwind Docs:** https://tailwindcss.com/docs

---

Built with ❤️ for travelers
