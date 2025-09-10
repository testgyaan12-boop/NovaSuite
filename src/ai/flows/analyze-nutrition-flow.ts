'use server';

/**
 * @fileOverview Analyzes the nutritional content of a food item from an image.
 *
 * - analyzeNutrition - A function that analyzes a food image and returns nutritional information.
 * - AnalyzeNutritionInput - The input type for the analyzeNutrition function.
 * - AnalyzeNutritionOutput - The return type for the analyzeNutrition function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeNutritionInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "A photo of a food item, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeNutritionInput = z.infer<
  typeof AnalyzeNutritionInputSchema
>;

const AnalyzeNutritionOutputSchema = z.object({
  foodName: z.string().describe('The name of the food identified in the image.'),
  calories: z.number().describe('The estimated number of calories in the food.'),
  protein: z.number().describe('The estimated amount of protein in grams.'),
  carbohydrates: z
    .number()
    .describe('The estimated amount of carbohydrates in grams.'),
  fat: z.number().describe('The estimated amount of fat in grams.'),
  fiber: z.number().describe('The estimated amount of fiber in grams.'),
});
export type AnalyzeNutritionOutput = z.infer<
  typeof AnalyzeNutritionOutputSchema
>;

export async function analyzeNutrition(
  input: AnalyzeNutritionInput
): Promise<AnalyzeNutritionOutput> {
  return analyzeNutritionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeNutritionPrompt',
  input: {schema: AnalyzeNutritionInputSchema},
  output: {schema: AnalyzeNutritionOutputSchema},
  prompt: `You are an expert nutritionist. Analyze the food item in the provided image and return its estimated nutritional information. Identify the food and estimate its calories, protein, carbohydrates, fat, and fiber content.

Use the following as the source of information about the food.

Photo: {{media url=imageDataUri}}`,
});

const analyzeNutritionFlow = ai.defineFlow(
  {
    name: 'analyzeNutritionFlow',
    inputSchema: AnalyzeNutritionInputSchema,
    outputSchema: AnalyzeNutritionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
