
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

const SuggestDietPlanInputSchema = z.object({
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

const MealSchema = z.object({
  time: z.string().describe('The time of the meal (e.g., Breakfast, Lunch, Dinner, Snack).'),
  foodName: z.string().describe('The name of the food for the meal.'),
  calories: z.number().describe('Estimated calories for the meal.'),
  protein: z.number().describe('Estimated protein in grams for the meal.'),
  carbohydrates: z.number().describe('Estimated carbohydrates in grams for the meal.'),
  fat: z.number().describe('Estimated fat in grams for the meal.'),
});

const SuggestDietPlanOutputSchema = z.object({
  dailySummary: z.object({
    calories: z.number().describe('The suggested total daily calorie intake in kcal.'),
    protein: z.number().describe('The suggested total daily protein intake in grams.'),
    carbohydrates: z
      .number()
      .describe('The suggested total daily carbohydrates intake in grams.'),
    fat: z.number().describe('The suggested total daily fat intake in grams.'),
  }),
  explanation: z
    .string()
    .describe(
      'A detailed explanation of why this diet plan was suggested based on the user profile and goals.'
    ),
  mealPlan: z.array(MealSchema).describe("A sample one-day meal plan with suggestions for breakfast, lunch, dinner, and snacks."),
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
  model: 'googleai/gemini-1.5-pro',
  prompt: `You are an expert nutritionist and personal trainer. Your task is to create a daily nutritional plan based on the user's profile and fitness goals.

  First, calculate the required daily macros (calories, protein, carbohydrates, fat) and provide a brief explanation for your recommendations.
  
  Second, create a sample one-day meal plan with specific food suggestions for breakfast, lunch, dinner, and one or two snacks. For each meal, provide an estimated breakdown of its calories, protein, carbohydrates, and fat.

  Do not include any preamble or conversational filler. Structure the entire response according to the output schema.

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
