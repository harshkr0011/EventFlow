'use server';

/**
 * @fileOverview A flow for analyzing and saving event comments.
 *
 * - processComment - A function that analyzes sentiment and saves a comment.
 * - CommentInput - The input type for the processComment function.
 */

import { ai } from '@/ai/genkit';
import { addComment } from '@/lib/firebase-service';
import { z } from 'genkit';

const CommentInputSchema = z.object({
  eventId: z.string().describe('The ID of the event being commented on.'),
  userId: z.string().describe('The ID of the user posting the comment.'),
  userEmail: z.string().email().describe("The user's email for display."),
  text: z.string().min(1).describe('The content of the comment.'),
});
export type CommentInput = z.infer<typeof CommentInputSchema>;

const CommentSentimentSchema = z.object({
  sentiment: z
    .enum(['positive', 'negative', 'neutral'])
    .describe('The sentiment of the comment.'),
});

export async function processComment(input: CommentInput) {
  return await commentFlow(input);
}

const sentimentPrompt = ai.definePrompt({
  name: 'sentimentAnalysisPrompt',
  input: { schema: z.object({ text: z.string() }) },
  output: { schema: CommentSentimentSchema },
  prompt: `Analyze the sentiment of the following comment and classify it as positive, negative, or neutral.

Comment: {{{text}}}

Your response MUST only contain a JSON object with a key "sentiment" which can be 'positive', 'negative', or 'neutral'.`,
});

const commentFlow = ai.defineFlow(
  {
    name: 'commentFlow',
    inputSchema: CommentInputSchema,
    outputSchema: z.void(),
  },
  async (input) => {
    const { output } = await sentimentPrompt({ text: input.text });
    const sentiment = output?.sentiment || 'neutral';

    await addComment(input.eventId, {
      userId: input.userId,
      userEmail: input.userEmail,
      text: input.text,
      sentiment: sentiment,
      createdAt: new Date(),
    });
  }
);
