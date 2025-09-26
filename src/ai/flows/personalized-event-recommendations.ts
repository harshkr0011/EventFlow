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
  prompt: `You are an expert event recommendation system. Your task is to recommend events to a user based on their stated preferences.

You will be provided with:
1.  A list of the user's preferred event categories (userPreferences).
2.  A list of all available events (allEvents).

Your goal is to return a list of event titles from the \`allEvents\` list that you think the user will be interested in.

-   User Preferences: {{userPreferences}}
-   All Available Events: {{allEvents}}

Carefully review the user's preferences. Then, from the "All Available Events" list, select the events that best match those interests.
Your response MUST only contain a JSON object with a key "recommendedEvents" which is an array of strings, where each string is an event title from the provided "All Available Events" list.
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
