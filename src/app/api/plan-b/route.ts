import { NextRequest, NextResponse } from 'next/server';
import { openai, MODELS } from '@/lib/ai/openai';
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

    const completion = await openai.chat.completions.create({
      model: MODELS.GPT4_MINI,
      messages: [
        {
          role: 'system',
          content: 'You are a travel planning expert who provides backup alternatives. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      response_format: { type: 'json_object' },
    });

    const responseContent = completion.choices[0].message.content;
    if (!responseContent) {
      throw new Error('No response from AI');
    }

    const planBResult = JSON.parse(responseContent);

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
