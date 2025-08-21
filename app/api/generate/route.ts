import { NextRequest, NextResponse } from 'next/server';
import { generateReport } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { apiKey: clientApiKey, model, filesContents, sample, prompt, language, pages, needsTable, needsGraph } = body;

    const apiKey = clientApiKey || process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;

    if (!apiKey || !model) {
      return NextResponse.json({ error: 'API key and model are required' }, { status: 400 });
    }

    // Always return the generated report to the client for download on the browser side.
    // Do not attempt to write files on the serverless filesystem.
    const report = await generateReport(apiKey, model, filesContents, sample, prompt, language, pages, needsTable, needsGraph);
    return NextResponse.json({ report });
  } catch (error) {
    console.error('Error generating report:', error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: 'Failed to generate report', message }, { status: 500 });
  }
}