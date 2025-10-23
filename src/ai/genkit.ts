import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;

if (!apiKey) {
  // Fail fast on the server if the API key is missing so users get a clear error
  throw new Error('Missing GOOGLE_API_KEY or GEMINI_API_KEY. Please set it in your .env.local file.');
}

export const ai = genkit({
  plugins: [googleAI({ apiKey })],
  model: 'googleai/gemini-2.5-flash',
});
