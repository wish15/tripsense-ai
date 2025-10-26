import { TravelPreferences, VibeProfile } from '@/types';
import { format } from 'date-fns';

export function generateItineraryPrompt(preferences: TravelPreferences): string {
  const { destination, startDate, endDate, budget, travelers, vibe, pace } = preferences;
  
  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const vibeDescription = getVibeDescription(vibe);
  
  return `You are an expert travel planner AI. Create a detailed, personalized ${days}-day itinerary for ${destination}.

**Trip Details:**
- Destination: ${destination}
- Dates: ${format(startDate, 'MMM dd, yyyy')} to ${format(endDate, 'MMM dd, yyyy')} (${days} days)
- Budget: $${budget} USD (total for ${travelers} traveler${travelers > 1 ? 's' : ''})
- Travelers: ${travelers} person${travelers > 1 ? 's' : ''}
- Pace: ${pace}

**Traveler Personality (Vibe Profile):**
${vibeDescription}

**Requirements:**
1. Create a day-by-day itinerary with 3-5 activities per day
2. Balance energy levels throughout the trip (don't exhaust travelers!)
3. Include specific locations with addresses
4. Provide realistic time estimates and costs for each activity
5. Match activities to the traveler's vibe profile
6. Include meal recommendations (breakfast, lunch, dinner)
7. Add transportation between activities
8. Stay within the budget
9. Include local, authentic experiences (avoid pure tourist traps)
10. Add practical tips and insider knowledge

**For each activity, provide:**
- Name of the place/activity
- Detailed description (2-3 sentences)
- Full address with city
- Approximate coordinates (latitude, longitude)
- Start time and duration
- Cost per person (be realistic!)
- Category (attraction, food, transport, etc.)
- Energy level required (low/medium/high)
- Vibe match score (0-100, how well it matches their personality)
- 2-3 insider tips
- Whether booking is required

**For each day, provide:**
- A theme or focus for the day
- Weather considerations
- Overall energy level (chill/balanced/intense)
- Total estimated cost for the day

**Return ONLY valid JSON in this exact format:**
{
  "destination": "${destination}",
  "days": [
    {
      "day": 1,
      "date": "${format(startDate, 'yyyy-MM-dd')}",
      "theme": "Day theme here",
      "energyLevel": "balanced",
      "activities": [
        {
          "name": "Activity name",
          "description": "Detailed description",
          "location": {
            "lat": 0.0,
            "lng": 0.0,
            "address": "Full address",
            "city": "${destination}",
            "country": "Country name"
          },
          "startTime": "09:00",
          "endTime": "11:00",
          "duration": 120,
          "cost": 0,
          "currency": "USD",
          "category": "attraction",
          "bookingRequired": false,
          "energyLevel": "medium",
          "vibeMatch": 85,
          "tips": ["Tip 1", "Tip 2"]
        }
      ]
    }
  ],
  "highlights": ["Unique highlight 1", "Unique highlight 2", "Unique highlight 3"],
  "totalCost": 0
}

Make this itinerary special, personal, and memorable!`;
}

function getVibeDescription(vibe: VibeProfile): string {
  const traits = [];
  
  if (vibe.adventure >= 70) traits.push(`Highly adventurous (loves thrills and new experiences)`);
  else if (vibe.adventure >= 40) traits.push(`Moderately adventurous (open to some excitement)`);
  else traits.push(`Prefers safe, familiar experiences`);
  
  if (vibe.culture >= 70) traits.push(`Culture enthusiast (museums, history, local traditions)`);
  else if (vibe.culture >= 40) traits.push(`Some interest in cultural activities`);
  
  if (vibe.relaxation >= 70) traits.push(`Values relaxation and downtime`);
  else if (vibe.relaxation <= 30) traits.push(`Prefers packed schedules`);
  
  if (vibe.foodie >= 70) traits.push(`Passionate foodie (wants authentic local cuisine)`);
  else if (vibe.foodie >= 40) traits.push(`Enjoys good food but not the main focus`);
  
  if (vibe.nightlife >= 70) traits.push(`Loves nightlife and evening entertainment`);
  else if (vibe.nightlife <= 30) traits.push(`Prefers quiet evenings`);
  
  if (vibe.nature >= 70) traits.push(`Nature lover (parks, hiking, outdoor activities)`);
  else if (vibe.nature <= 30) traits.push(`Prefers urban environments`);
  
  return traits.join('\n- ');
}

export function generateBudgetOptimizerPrompt(
  currentItinerary: any,
  targetBudget: number
): string {
  return `You are a budget optimization AI. The traveler has an itinerary that costs $${currentItinerary.totalCost} but wants to reduce it to $${targetBudget}.

**Current Itinerary:**
${JSON.stringify(currentItinerary, null, 2)}

**Task:**
Optimize the itinerary to meet the target budget while:
1. Maintaining the same overall experience quality
2. Keeping the most important activities
3. Finding cheaper alternatives for expensive items
4. Suggesting free or low-cost alternatives
5. Maintaining the vibe and personality match

**Return JSON with:**
{
  "optimizedItinerary": { /* modified itinerary */ },
  "savings": 0,
  "changes": [
    {
      "original": "Original activity name",
      "replacement": "New activity name",
      "savedAmount": 0,
      "reason": "Why this change makes sense"
    }
  ],
  "savingsTips": ["Tip 1", "Tip 2"]
}`;
}

export function generatePlanBPrompt(activity: any, reason: string): string {
  return `Generate 2-3 alternative activities for this situation:

**Original Activity:**
${JSON.stringify(activity, null, 2)}

**Reason for change:** ${reason}

**Requirements:**
- Provide activities that can happen at the same time slot
- Keep similar vibe and energy level
- Stay in same location/area if possible
- Match or be cheaper than original cost
- Explain why each alternative is good

**Return JSON:**
{
  "alternatives": [
    {
      "name": "Alternative activity",
      "description": "Description",
      "location": { /* same format */ },
      "startTime": "same time",
      "duration": 0,
      "cost": 0,
      "category": "category",
      "energyLevel": "level",
      "vibeMatch": 0,
      "tips": []
    }
  ],
  "explanation": "Why these alternatives work well"
}`;
}

export function generatePackingListPrompt(itinerary: any, weather: any[]): string {
  return `Generate a smart, personalized packing list for this trip:

**Itinerary:**
${JSON.stringify(itinerary, null, 2)}

**Weather Forecast:**
${JSON.stringify(weather, null, 2)}

**Create a packing list with:**
1. Clothing (based on weather and activities)
2. Electronics (cameras, chargers, adapters)
3. Documents (passport, tickets, insurance)
4. Toiletries
5. Activity-specific items (hiking gear, swimwear, etc.)
6. Medicine and first aid
7. Miscellaneous

**For each item, explain why it's needed based on the itinerary.**

**Return JSON:**
{
  "categories": [
    {
      "name": "Category name",
      "essential": true/false,
      "items": [
        {
          "name": "Item name",
          "quantity": 1,
          "reason": "Why this is needed for this specific trip",
          "checked": false
        }
      ]
    }
  ]
}`;
}
