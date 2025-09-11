'use server';

/**
 * @fileOverview Suggests exercises based on a muscle group.
 *
 * - suggestExercises - A function that generates exercise suggestions.
 * - SuggestExercisesInput - The input type for the suggestExercises function.
 * - SuggestExercisesOutput - The return type for the suggestExercises function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EXERCISE_CATEGORIES = [
  'Chest',
  'Back',
  'Shoulders',
  'Biceps',
  'Triceps',
  'Legs',
  'Abs',
  'Cardio',
] as const;

const SuggestExercisesInputSchema = z.object({
  category: z.enum(EXERCISE_CATEGORIES).describe('The muscle group or category to suggest exercises for.'),
});
export type SuggestExercisesInput = z.infer<typeof SuggestExercisesInputSchema>;

const ExerciseSuggestionSchema = z.object({
    name: z.string().describe('The name of the suggested exercise.'),
    description: z.string().describe('A brief description of how to perform the exercise and its benefits.'),
    equipment: z.string().describe('The equipment needed for the exercise (e.g., Dumbbells, Barbell, None).')
});

const SuggestExercisesOutputSchema = z.object({
    exercises: z.array(ExerciseSuggestionSchema).describe('A list of suggested exercises.'),
});
export type SuggestExercisesOutput = z.infer<typeof SuggestExercisesOutputSchema>;


export async function suggestExercises(input: SuggestExercisesInput): Promise<SuggestExercisesOutput> {
    return suggestExercisesFlow(input);
}


const prompt = ai.definePrompt({
    name: 'suggestExercisesPrompt',
    model: 'googleai/gemini-pro',
    input: {schema: SuggestExercisesInputSchema},
    output: {schema: SuggestExercisesOutputSchema},
    prompt: `You are an expert personal trainer.

    Your task is to suggest a list of 5 diverse exercises for a specific muscle group or category.
    
    For each exercise, provide:
    1. A clear name.
    2. A brief but effective description of how to perform it.
    3. The equipment required.

    Do not include any preamble or conversational filler.

    Category: {{{category}}}
    `,
});


const suggestExercisesFlow = ai.defineFlow(
    {
        name: 'suggestExercisesFlow',
        inputSchema: SuggestExercisesInputSchema,
        outputSchema: SuggestExercisesOutputSchema,
    },
    async (input) => {
        const { output } = await prompt(input);
        return output!;
    }
);
