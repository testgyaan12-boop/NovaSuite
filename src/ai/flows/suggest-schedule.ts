'use server';

/**
 * @fileOverview Suggests a weekly workout schedule.
 *
 * - suggestSchedule - A function that generates a workout schedule.
 * - SuggestScheduleInput - The input type for the suggestSchedule function.
 * - SuggestScheduleOutput - The return type for the suggestSchedule function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestScheduleInputSchema = z.object({
  goal: z
    .enum(['lose_weight', 'maintain_weight', 'gain_muscle'])
    .describe('The fitness goal of the user.'),
  daysPerWeek: z.number().min(1).max(7).describe('How many days per week the user wants to work out.'),
  availablePlans: z.array(z.object({
      id: z.string(),
      name: z.string(),
  })).describe('An array of available workout plans with their IDs and names.'),
});
export type SuggestScheduleInput = z.infer<typeof SuggestScheduleInputSchema>;


const DayScheduleSchema = z.object({
    dayOfWeek: z.enum(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]),
    planId: z.string().nullable().describe('The ID of the suggested workout plan for this day, or null for a rest day.'),
});

const SuggestScheduleOutputSchema = z.object({
    schedule: z.array(DayScheduleSchema).describe('The suggested workout schedule for the week.'),
    explanation: z.string().describe('A brief explanation of the suggested schedule.'),
});
export type SuggestScheduleOutput = z.infer<typeof SuggestScheduleOutputSchema>;


export async function suggestSchedule(input: SuggestScheduleInput): Promise<SuggestScheduleOutput> {
    return suggestScheduleFlow(input);
}


const prompt = ai.definePrompt({
    name: 'suggestSchedulePrompt',
    input: {schema: SuggestScheduleInputSchema},
    output: {schema: SuggestScheduleOutputSchema},
    prompt: `You are a world-class personal trainer creating a weekly workout schedule.

    Your task is to create an effective weekly workout schedule based on the user's goal, desired workout frequency, and the workout plans they have available.

    - Distribute the workout days evenly throughout the week.
    - Ensure there are adequate rest days based on the user's goal and frequency. For high-intensity goals like 'gain_muscle', more rest might be needed between sessions targeting the same muscle groups, though you can only assign full plan IDs.
    - Assign a planId from the available plans to each workout day. Assign null to rest days.
    - Provide a brief explanation for why you've structured the week this way.

    User Goal: {{{goal}}}
    Days Per Week: {{{daysPerWeek}}}
    Available Plans:
    {{#each availablePlans}}
    - ID: {{{this.id}}}, Name: {{{this.name}}}
    {{/each}}
    `,
});


const suggestScheduleFlow = ai.defineFlow(
    {
        name: 'suggestScheduleFlow',
        inputSchema: SuggestScheduleInputSchema,
        outputSchema: SuggestScheduleOutputSchema,
    },
    async (input) => {
        const { output } = await prompt(input);
        return output!;
    }
);
