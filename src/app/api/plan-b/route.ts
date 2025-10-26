import { NextRequest, NextResponse } from 'next/server';
import { generateJSONWithGemini } from '@/lib/ai/google';
import { generatePlanBPrompt } from '@/lib/ai/prompts';

export async function POST(request: NextRequest) {
  try {
    const { activity, reason } = await request.json();

    if (!activity || !reason) {
      return NextResponse.json(
        { error: 'Missing required fields: activity and reason' },
        { status: 400 }
      );
    }

    const prompt = generatePlanBPrompt(activity, reason);

    const planBResult = await generateJSONWithGemini(prompt);

    return NextResponse.json({
      success: true,
      ...planBResult,
    });
  } catch (error: any) {
    console.error('Error generating Plan B:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate Plan B' },
      { status: 500 }
    );
  }
}
