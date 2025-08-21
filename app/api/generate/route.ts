import { NextRequest, NextResponse } from 'next/server';
import { generateReport } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { apiKey, model, filesContents, sample, prompt, language, volume, needsTable, needsGraph } = body;

    if (!apiKey || !model) {
      return NextResponse.json({ error: 'API key and model are required' }, { status: 400 });
    }

    const report = await generateReport(apiKey, model, filesContents, sample, prompt, language, volume, needsTable, needsGraph);

    return NextResponse.json({ report });
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}