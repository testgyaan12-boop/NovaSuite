'use server';

/**
 * @fileOverview Provides AI-driven workout plan modification suggestions based on user characteristics.
 *
 * - suggestWorkoutModifications - A function that generates workout modification suggestions.
 * - SuggestWorkoutModificationsInput - The input type for the suggestWorkoutModifications function.
 * - SuggestWorkoutModificationsOutput - The return type for the suggestWorkoutModifications function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestWorkoutModificationsInputSchema = z.object({
  age: z.number().describe('The age of the user in years.'),
  height: z.number().describe('The height of the user in centimeters.'),
  sex: z.enum(['male', 'female']).describe('The sex of the user.'),
  currentWorkoutPlan: z
    .string()
    .describe('The current workout plan of the user as a JSON string.'),
});
export type SuggestWorkoutModificationsInput = z.infer<
  typeof SuggestWorkoutModificationsInputSchema
>;

const SuggestWorkoutModificationsOutputSchema = z.object({
  suggestedWorkoutPlan: z
    .string()
    .describe(
      'The suggested workout plan modifications based on user characteristics as a JSON string.'
    ),
  explanation: z
    .string()
    .describe(
      'A detailed explanation of why the workout plan was modified in this way.'
    ),
});
export type SuggestWorkoutModificationsOutput = z.infer<
  typeof SuggestWorkoutModificationsOutputSchema
>;

export async function suggestWorkoutModifications(
  input: SuggestWorkoutModificationsInput
): Promise<SuggestWorkoutModificationsOutput> {
  return suggestWorkoutModificationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestWorkoutModificationsPrompt',
  model: 'googleai/gemini-1.5-flash',
  input: {schema: SuggestWorkoutModificationsInputSchema},
  output: {schema: SuggestWorkoutModificationsOutputSchema},
  prompt: `You are a personal trainer who suggests modifications to workout plans based on user characteristics. 

  Given the following information about the user, suggest modifications to their workout plan. Explain your reasoning for each modification. The user retains full control over the final plan and your suggestions will be used for informational purposes only. Do not include any preamble or conversational filler. Use a JSON format in your response.

  User Age: {{{age}}}
  User Height (cm): {{{height}}}
  User Sex: {{{sex}}}
  Current Workout Plan: {{{currentWorkoutPlan}}}
  `,
});

const suggestWorkoutModificationsFlow = ai.defineFlow(
  {
    name: 'suggestWorkoutModificationsFlow',
    inputSchema: SuggestWorkoutModificationsInputSchema,
    outputSchema: SuggestWorkoutModificationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
