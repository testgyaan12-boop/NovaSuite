'use server';

/**
 * @fileOverview Provides AI-driven diet plan suggestions based on user characteristics and goals.
 *
 * - suggestDietPlan - A function that generates diet plan suggestions.
 * - SuggestDietPlanInput - The input type for the suggestDietPlan function.
 * - SuggestDietPlanOutput - The return type for the suggestDietPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const SuggestDietPlanInputSchema = z.object({
  age: z.number().describe('The age of the user in years.'),
  height: z.number().describe('The height of the user in centimeters.'),
  weight: z.number().describe('The weight of the user in kilograms.'),
  sex: z.enum(['male', 'female']).describe('The sex of the user.'),
  activityLevel: z
    .enum(['sedentary', 'lightly_active', 'moderately_active', 'very_active'])
    .describe('The activity level of the user.'),
  goal: z
    .enum(['lose_weight', 'maintain_weight', 'gain_muscle'])
    .describe('The fitness goal of the user.'),
});
export type SuggestDietPlanInput = z.infer<typeof SuggestDietPlanInputSchema>;

export const SuggestDietPlanOutputSchema = z.object({
  calories: z.number().describe('The suggested daily calorie intake in kcal.'),
  protein: z.number().describe('The suggested daily protein intake in grams.'),
  carbohydrates: z
    .number()
    .describe('The suggested daily carbohydrates intake in grams.'),
  fat: z.number().describe('The suggested daily fat intake in grams.'),
  explanation: z
    .string()
    .describe(
      'A detailed explanation of why this diet plan was suggested based on the user profile and goals.'
    ),
});
export type SuggestDietPlanOutput = z.infer<typeof SuggestDietPlanOutputSchema>;

export async function suggestDietPlan(
  input: SuggestDietPlanInput
): Promise<SuggestDietPlanOutput> {
  return suggestDietPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestDietPlanPrompt',
  input: {schema: SuggestDietPlanInputSchema},
  output: {schema: SuggestDietPlanOutputSchema},
  prompt: `You are an expert nutritionist and personal trainer. Your task is to create a daily nutritional plan based on the user's profile and fitness goals.

  Calculate the required daily macros (calories, protein, carbohydrates, fat) and provide a brief explanation for your recommendations. Do not include any preamble or conversational filler.

  User Profile:
  - Age: {{{age}}} years
  - Height: {{{height}}} cm
  - Weight: {{{weight}}} kg
  - Sex: {{{sex}}}
  - Activity Level: {{{activityLevel}}}
  - Goal: {{{goal}}}
  `,
});

const suggestDietPlanFlow = ai.defineFlow(
  {
    name: 'suggestDietPlanFlow',
    inputSchema: SuggestDietPlanInputSchema,
    outputSchema: SuggestDietPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
