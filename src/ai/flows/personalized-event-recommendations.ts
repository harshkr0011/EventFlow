'use server';

/**
 * @fileOverview A personalized event recommendation AI agent.
 *
 * - personalizedEventRecommendations - A function that handles the event recommendation process.
 * - PersonalizedEventRecommendationsInput - The input type for the personalizedEventRecommendations function.
 * - PersonalizedEventRecommendationsOutput - The return type for the personalizedEventRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedEventRecommendationsInputSchema = z.object({
  userPreferences: z
    .array(z.string())
    .describe('An array of the user preferred event categories.'),
  pastBookingHistory: z
    .array(z.string())
    .describe('An array of the user past booked event categories.'),
  allEvents: z.array(z.string()).describe('An array of all available events.'),
});
export type PersonalizedEventRecommendationsInput = z.infer<
  typeof PersonalizedEventRecommendationsInputSchema
>;

const PersonalizedEventRecommendationsOutputSchema = z.object({
  recommendedEvents: z
    .array(z.string())
    .describe('An array of recommended events based on user preferences. This should be a subset of the list of all available events provided.'),
});
export type PersonalizedEventRecommendationsOutput = z.infer<
  typeof PersonalizedEventRecommendationsOutputSchema
>;

export async function personalizedEventRecommendations(
  input: PersonalizedEventRecommendationsInput
): Promise<PersonalizedEventRecommendationsOutput> {
  return personalizedEventRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedEventRecommendationsPrompt',
  input: {schema: PersonalizedEventRecommendationsInputSchema},
  output: {schema: PersonalizedEventRecommendationsOutputSchema},
  prompt: `You are an expert event recommendation system.

You will use the user preferences and past booking history to recommend events that the user is likely to be interested in.

User Preferences: {{userPreferences}}
Past Booking History: {{pastBookingHistory}}
All Available Events: {{allEvents}}

Based on the user preferences and past booking history, recommend events from the list of all available events. Your response should only include event titles from the "All Available Events" list.
`,
});

const personalizedEventRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedEventRecommendationsFlow',
    inputSchema: PersonalizedEventRecommendationsInputSchema,
    outputSchema: PersonalizedEventRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
