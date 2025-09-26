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

const eventDetails = allEvents.map(event => ({
    title: event.title,
    description: event.description,
    date: event.date,
    venue: event.venue,
    price: event.price,
    category: event.category,
})).join('\n---\n');

const prompt = ai.definePrompt({
  name: 'chatbotPrompt',
  input: { schema: ChatbotInputSchema },
  output: { schema: ChatbotOutputSchema },
  prompt: `You are a friendly and helpful chatbot for an event management platform called "EventFlow".
Your goal is to assist users with their questions about events.

Here is a list of all available events:
---
${eventDetails}
---

Current date: ${new Date().toLocaleDateString()}

When a user asks a question, use the event information provided above to answer them.
- If a user asks about what events are available, you can suggest a few based on their query or popular ones.
- If a user asks for details about a specific event, provide the information from the list.
- If a user asks a general question or something you don't know, be honest and say you don't have that information.
- Keep your responses concise and friendly.
- Do not make up information. Only use the data provided.

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
