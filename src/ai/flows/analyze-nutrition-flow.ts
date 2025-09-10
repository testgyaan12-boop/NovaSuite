'use server';

/**
 * @fileOverview Analyzes the nutritional content of a food item from an image or text.
 *
 * - analyzeNutrition - A function that analyzes a food image/name and returns nutritional information.
 * - AnalyzeNutritionInput - The input type for the analyzeNutrition function.
 * - AnalyzeNutritionOutput - The return type for the analyzeNutrition function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeNutritionInputSchema = z.object({
  imageDataUri: z
    .string()
    .optional()
    .describe(
      "A photo of a food item, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  foodName: z
    .string()
    .optional()
    .describe('The name of the food item.'),
});
export type AnalyzeNutritionInput = z.infer<
  typeof AnalyzeNutritionInputSchema
>;

const AnalyzeNutritionOutputSchema = z.object({
  foodName: z.string().describe('The name of the food identified.'),
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
  input: {
    schema: z.object({
      imageDataUri: z.string().optional(),
      foodName: z.string().optional(),
    }),
  },
  output: {schema: AnalyzeNutritionOutputSchema},
  prompt: `You are an expert nutritionist. Analyze the food item based on the provided image and/or name and return its estimated nutritional information. Identify the food and estimate its calories, protein, carbohydrates, fat, and fiber content.

If both an image and a name are provided, the image is the primary source of information. If only a name is provided, use that.

{{#if foodName}}Food Name: {{{foodName}}}{{/if}}
{{#if imageDataUri}}Photo: {{media url=imageDataUri}}{{/if}}`,
});

const analyzeNutritionFlow = ai.defineFlow(
  {
    name: 'analyzeNutritionFlow',
    inputSchema: AnalyzeNutritionInputSchema,
    outputSchema: AnalyzeNutritionOutputSchema,
  },
  async input => {
    if (!input.imageDataUri && !input.foodName) {
        throw new Error("Either an image or a food name must be provided.");
    }
    
    const promptInput: AnalyzeNutritionInput = {};
    if (input.foodName) {
      promptInput.foodName = input.foodName;
    }
    // Only include imageDataUri if it's a non-empty string and a valid data URI
    if (input.imageDataUri && input.imageDataUri.startsWith('data:image')) {
      promptInput.imageDataUri = input.imageDataUri;
    }

    const {output} = await prompt(promptInput);
    return output!;
  }
);
