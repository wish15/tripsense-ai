import { NextRequest, NextResponse } from 'next/server';
import { generateJSONWithGemini } from '@/lib/ai/google';
import { Itinerary } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { currentItinerary, changeDescription } = await request.json();

    if (!currentItinerary || !changeDescription) {
      return NextResponse.json(
        { error: 'Current itinerary and change description are required' },
        { status: 400 }
      );
    }

    const prompt = generateModifyItineraryPrompt(currentItinerary, changeDescription);
    const modifiedItinerary = await generateJSONWithGemini<Itinerary>(prompt);

    return NextResponse.json(modifiedItinerary);
  } catch (error) {
    console.error('Modify Itinerary Error:', error);
    return NextResponse.json(
      { error: 'Failed to modify itinerary' },
      { status: 500 }
    );
  }
}

function generateModifyItineraryPrompt(currentItinerary: Itinerary, changeDescription: string): string {
  return `You are an expert travel planner AI. The traveler has requested changes to their itinerary.

**Current Itinerary:**
${JSON.stringify(currentItinerary, null, 2)}

**Requested Changes:**
"${changeDescription}"

**Your Task:**
Modify the itinerary based on the traveler's request. Be intelligent about:
1. Understanding what they want (add activities, remove activities, change timing, swap locations, adjust pace, etc.)
2. Maintaining consistency (keep activities in logical order, respect time constraints)
3. Preserving the overall vibe and personality match
4. Keeping costs reasonable unless they explicitly ask for budget changes
5. Only modifying what's necessary - keep good activities that aren't affected
6. Adding realistic details for any new activities (locations, times, costs, tips)

**Important Guidelines:**
- If they want to add something, find the best day/time slot for it
- If they want to remove something, suggest what to do with the freed time
- If they want to change pace, adjust duration and number of activities
- If they want different types of activities, swap similar-category items
- If they mention specific places/experiences, incorporate them properly
- Keep all the JSON structure and fields intact

**Return the COMPLETE modified itinerary in this exact JSON format:**
{
  "destination": "${currentItinerary.destination}",
  "days": [
    {
      "day": 1,
      "date": "YYYY-MM-DD",
      "theme": "Day theme",
      "energyLevel": "balanced",
      "activities": [
        {
          "name": "Activity name",
          "description": "Detailed description",
          "location": {
            "lat": 0.0,
            "lng": 0.0,
            "address": "Full address",
            "city": "City",
            "country": "Country"
          },
          "startTime": "HH:MM",
          "endTime": "HH:MM",
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
  "highlights": ["Highlight 1", "Highlight 2", "Highlight 3"],
  "totalCost": 0
}

Make the changes thoughtfully and maintain a high-quality, personalized travel experience!`;
}
