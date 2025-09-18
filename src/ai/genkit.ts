import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

if (process.env.NODE_ENV === 'production' && !process.env.GEMINI_API_KEY) {
  console.warn(
    'GEMINI_API_KEY is not set. AI features will not work in production.'
  );
}

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY,
    }),
  ],
});
