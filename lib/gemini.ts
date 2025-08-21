import { GoogleGenerativeAI } from '@google/generative-ai';

export async function generateReport(apiKey: string, model: string, filesContents: string[], sample: string, prompt: string, language: string, pages: number, needsTable: boolean, needsGraph: boolean): Promise<string> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const selectedModel = genAI.getGenerativeModel({ model });

  const combinedContent = filesContents.join('\n\n');

  const fullPrompt = `
    Generate a report in ${language}.
    Report length: approximately ${pages} A4 pages.
    Include tables: ${needsTable ? 'yes' : 'no'}.
    Include graphs: ${needsGraph ? 'yes' : 'no'}.
    Follow this sample format strictly: ${sample}.
    Based on the following content: ${combinedContent}.
    Additional instructions: ${prompt}.
  `;

  const result = await selectedModel.generateContent(fullPrompt);
  return result.response.text();
}