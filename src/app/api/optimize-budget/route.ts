import { NextRequest, NextResponse } from 'next/server';
import { openai, MODELS } from '@/lib/ai/openai';
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

    const completion = await openai.chat.completions.create({
      model: MODELS.GPT4_MINI,
      messages: [
        {
          role: 'system',
          content: 'You are a budget optimization expert. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const responseContent = completion.choices[0].message.content;
    if (!responseContent) {
      throw new Error('No response from AI');
    }

    const optimizationResult = JSON.parse(responseContent);

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
