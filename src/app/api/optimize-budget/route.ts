import { NextRequest, NextResponse } from 'next/server';
import { generateJSONWithGemini } from '@/lib/ai/google';
import { generateBudgetOptimizerPrompt } from '@/lib/ai/prompts';

export async function POST(request: NextRequest) {
  try {
    const { itinerary, targetBudget } = await request.json();

    if (!itinerary || !targetBudget) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const prompt = generateBudgetOptimizerPrompt(itinerary, targetBudget);

    const optimizationResult = await generateJSONWithGemini(prompt);

    return NextResponse.json({
      success: true,
      ...optimizationResult,
    });
  } catch (error: any) {
    console.error('Error optimizing budget:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to optimize budget' },
      { status: 500 }
    );
  }
}
