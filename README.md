# Easy Report Generator

This is a Next.js application that allows users to upload multiple .md files, provide a sample report format, and generate a new report using Gemini AI.

## Features

- Upload up to 5 .md reference documents
- Provide sample report via file upload or text input
- Custom prompts for report purpose and emphases
- Select output language (Korean, English, Chinese, Japanese)
- Choose report volume (short, medium, long)
- Options for including tables and graphs
- Settings for Gemini API key and model selection
- Download generated report as .md file

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/easyreport.git
   cd easyreport
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

1. Run the development server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:3000 in your browser.

3. Go to /settings to enter your Gemini API key and select model.

4. On the main page:
   - Upload reference .md files (max 5)
   - Provide sample report (file or text)
   - Enter report instructions
   - Select language, volume, and options
   - Click Generate to create and download the report

## Configuration

- API Key: Stored in sessionStorage for security (clears on tab close)
- Models: gemini-1.5-flash or gemini-1.5-pro

## Deployment

1. Push to GitHub.

2. Connect to Vercel and deploy.

For detailed deployment, see [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Gemini API](https://ai.google.dev/)
