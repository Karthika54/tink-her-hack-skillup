'use server';
/**
 * @fileOverview This file implements the SkillLink AI mentor chat flow.
 *
 * - aiMentorChat - A function that generates a chat response from an AI mentor.
 * - AiMentorChatInput - The input type for the aiMentorChat function.
 * - AiMentorChatOutput - The return type for the aiMentorChat function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ChatMessageSchema = z.object({
  text: z.string(),
  sender: z.enum(['user', 'mentor']),
});

const AiMentorChatInputSchema = z.object({
  mentorName: z.string().describe('The name of the mentor the AI is impersonating.'),
  mentorSkills: z.array(z.string()).describe("A list of the mentor's skills."),
  chatHistory: z.array(ChatMessageSchema).describe('The history of the conversation.'),
});
export type AiMentorChatInput = z.infer<typeof AiMentorChatInputSchema>;

const AiMentorChatOutputSchema = z.object({
  response: z.string().describe("The AI mentor's response."),
});
export type AiMentorChatOutput = z.infer<typeof AiMentorChatOutputSchema>;

export async function aiMentorChat(input: AiMentorChatInput): Promise<AiMentorChatOutput> {
  return aiMentorChatFlow(input);
}

// Internal schema for the prompt with a pre-formatted chat history string.
const PromptInputSchema = z.object({
    mentorName: z.string().describe('The name of the mentor the AI is impersonating.'),
    mentorSkills: z.array(z.string()).describe("A list of the mentor's skills."),
    formattedChatHistory: z.string().describe("The pre-formatted chat history as a single string.")
});

const mentorChatPrompt = ai.definePrompt({
  name: 'mentorChatPrompt',
  input: { schema: PromptInputSchema },
  output: { schema: AiMentorChatOutputSchema },
  prompt: `You are an AI impersonating a skill mentor on the SkillLink platform.

Your name is {{{mentorName}}}.
Your areas of expertise are:
{{#each mentorSkills}}
- {{{this}}}
{{/each}}

You are having a conversation with a user who wants to learn from you. Your persona should be helpful, encouraging, and knowledgeable in your areas of expertise. Keep your responses concise and focused on the user's questions.

Here is the conversation history so far. The last message is from the user you need to respond to.
{{{formattedChatHistory}}}

Based on this conversation, provide your next response as {{mentorName}}. Only output your response text.
`,
});

const aiMentorChatFlow = ai.defineFlow(
  {
    name: 'aiMentorChatFlow',
    inputSchema: AiMentorChatInputSchema,
    outputSchema: AiMentorChatOutputSchema,
  },
  async (input) => {
    const formattedChatHistory = input.chatHistory
      .map((message) => {
        if (message.sender === 'user') {
          return `User: ${message.text}`;
        } else {
          return `${input.mentorName}: ${message.text}`;
        }
      })
      .join('\n');
      
    const { output } = await mentorChatPrompt({
        mentorName: input.mentorName,
        mentorSkills: input.mentorSkills,
        formattedChatHistory: formattedChatHistory
    });

    if (!output) {
      throw new Error('AI Mentor chat prompt returned no output.');
    }
    return output;
  }
);
