'use server';

/**
 * @fileOverview A conversational AI chatbot for the EventFlow application.
 *
 * - chat - A function that handles the chatbot conversation.
 * - ChatbotInput - The input type for the chat function.
 * - ChatbotOutput - The return type for the chat function.
 */

import { ai } from '@/ai/genkit';
import { allEvents } from '@/lib/events';
import { z } from 'genkit';

const ChatbotInputSchema = z.object({
  message: z.string().describe('The user\'s message to the chatbot.'),
});
export type ChatbotInput = z.infer<typeof ChatbotInputSchema>;

const ChatbotOutputSchema = z.object({
  response: z.string().describe('The chatbot\'s response to the user.'),
});
export type ChatbotOutput = z.infer<typeof ChatbotOutputSchema>;

export async function chat(input: ChatbotInput): Promise<ChatbotOutput> {
  return chatbotFlow(input);
}

const eventDetails = allEvents.map(event => {
    return `Title: ${event.title}\nDescription: ${event.description}\nDate: ${new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric'})}\nVenue: ${event.venue}\nPrice: ${event.price}\nCategory: ${event.category}`;
}).join('\n\n---\n\n');


const prompt = ai.definePrompt({
  name: 'chatbotPrompt',
  input: { schema: ChatbotInputSchema },
  output: { schema: ChatbotOutputSchema },
  prompt: `You are a friendly and helpful chatbot for an event management platform called "EventFlow".
Your goal is to assist users with their questions about events. Your knowledge is strictly limited to the event data provided below. You cannot and must not access any external information or make up details.

Here is a list of all available events:
---
${eventDetails}
---

Current date: ${new Date().toLocaleDateString()}

When a user asks a question, use ONLY the event information provided above to answer them.
- If a user asks for details about a specific event, provide the information from the list.
- When providing a date, make sure it is in a readable format (e.g., "October 26, 2024"). The dates in the data are already formatted correctly for you to use.
- If a user asks a general question or something you don't know from the provided data, be honest and state that you don't have that information.
- Keep your responses concise and friendly.
- ABSOLUTELY DO NOT MAKE UP INFORMATION. If the information is not in the list, you do not know it. For example, do not invent new events or details.

User's message: {{{message}}}
`,
});

const chatbotFlow = ai.defineFlow(
  {
    name: 'chatbotFlow',
    inputSchema: ChatbotInputSchema,
    outputSchema: ChatbotOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
