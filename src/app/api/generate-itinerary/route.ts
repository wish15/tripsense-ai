import { NextRequest, NextResponse } from 'next/server';
import { generateJSONWithGemini } from '@/lib/ai/google';
import { generateItineraryPrompt } from '@/lib/ai/prompts';
import { TravelPreferences } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const preferences: TravelPreferences = await request.json();

    // Validate input
    if (!preferences.destination || !preferences.startDate || !preferences.endDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate itinerary using Google Gemini AI
    const prompt = generateItineraryPrompt(preferences);

    const aiResponse = await generateJSONWithGemini(prompt);

    // Enhance the response with additional data
    const itinerary = {
      id: crypto.randomUUID(),
      ...aiResponse,
      startDate: preferences.startDate,
      endDate: preferences.endDate,
      budget: preferences.budget,
      travelers: preferences.travelers,
      vibe: preferences.vibe,
      currency: preferences.currency || 'USD',
      shareToken: crypto.randomUUID(),
      isPublic: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Calculate vibe score (how well the itinerary matches user preferences)
    const vibeScore = calculateVibeScore(itinerary, preferences.vibe);

    return NextResponse.json({
      itinerary,
      vibeScore,
      success: true,
    });
  } catch (error: any) {
    console.error('Error generating itinerary:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate itinerary' },
      { status: 500 }
    );
  }
}

function calculateVibeScore(itinerary: any, userVibe: any): number {
  if (!itinerary.days || !Array.isArray(itinerary.days)) {
    return 75; // Default score
  }

  let totalMatch = 0;
  let activityCount = 0;

  itinerary.days.forEach((day: any) => {
    if (day.activities && Array.isArray(day.activities)) {
      day.activities.forEach((activity: any) => {
        if (activity.vibeMatch) {
          totalMatch += activity.vibeMatch;
          activityCount++;
        }
      });
    }
  });

  return activityCount > 0 ? Math.round(totalMatch / activityCount) : 75;
}
