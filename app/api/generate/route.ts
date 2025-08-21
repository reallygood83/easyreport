import { NextRequest, NextResponse } from 'next/server';
import { generateReport } from '@/lib/gemini';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { apiKey, model, filesContents, sample, prompt, language, pages, needsTable, needsGraph, downloadFolder } = body;

    if (!apiKey || !model) {
      return NextResponse.json({ error: 'API key and model are required' }, { status: 400 });
    }

    const report = await generateReport(apiKey, model, filesContents, sample, prompt, language, pages, needsTable, needsGraph);
    if (downloadFolder) {
      const filePath = path.join(downloadFolder, 'generated_report.md');
      fs.writeFileSync(filePath, report);
      return NextResponse.json({ savedPath: filePath });
    } else {
      return NextResponse.json({ report });
    }
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}