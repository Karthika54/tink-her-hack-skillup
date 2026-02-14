'use server';
/**
 * @fileOverview This file implements the SkillLink AI skill recommendation flow.
 *
 * - aiSkillRecommendations - A function that generates skill recommendations based on user interests.
 * - AiSkillRecommendationsInput - The input type for the aiSkillRecommendations function.
 * - AiSkillRecommendationsOutput - The return type for the aiSkillRecommendations function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Input Schema
const AiSkillRecommendationsInputSchema = z.object({
  learningInterests: z.array(z.string()).describe("A list of the user's current learning interests."),
  // Optional field to encourage slight variations in recommendations on each call
  randomSeed: z.number().optional().describe("An optional seed to encourage slight variations in recommendations."),
});
export type AiSkillRecommendationsInput = z.infer<typeof AiSkillRecommendationsInputSchema>;

// Output Schema
const AiSkillRecommendationsOutputSchema = z.object({
  recommendedSkills: z.array(z.string()).describe("A list of recommended skills based on the user's learning interests."),
});
export type AiSkillRecommendationsOutput = z.infer<typeof AiSkillRecommendationsOutputSchema>;

// Wrapper function to call the Genkit flow
export async function aiSkillRecommendations(input: AiSkillRecommendationsInput): Promise<AiSkillRecommendationsOutput> {
  return aiSkillRecommendationsFlow(input);
}

// Prompt definition
const skillRecommendationPrompt = ai.definePrompt({
  name: 'skillRecommendationPrompt',
  input: { schema: AiSkillRecommendationsInputSchema },
  output: { schema: AiSkillRecommendationsOutputSchema },
  prompt: `You are SkillLink AI, an intelligent assistant designed to recommend skills to users based on their learning interests.
Given the user's learning interests, your task is to suggest 3-5 skills that are closely related, complementary, or next steps to their existing interests.
Aim for practical and actionable skill suggestions.
Include the provided random seed (if available) as a factor to slightly vary suggestions between requests.

User's Learning Interests:
{{#each learningInterests}}
- {{{this}}}
{{/each}}

{{#if randomSeed}}
Randomness factor: {{{randomSeed}}}
{{/if}}

Please provide your recommendations as a JSON array of strings in the 'recommendedSkills' field.
For example, if the interest is "Guitar", suggestions could include "Advanced Guitar", "Music Theory", "Song Composition".
If the interest is "Photography", suggestions could include "Portrait Photography", "Editing Basics", "Lighting Techniques".`,
});

// Flow definition
const aiSkillRecommendationsFlow = ai.defineFlow(
  {
    name: 'aiSkillRecommendationsFlow',
    inputSchema: AiSkillRecommendationsInputSchema,
    outputSchema: AiSkillRecommendationsOutputSchema,
  },
  async (input) => {
    const { output } = await skillRecommendationPrompt(input);
    // Ensure output is not null and has the expected structure
    if (!output) {
      throw new Error('Skill recommendation prompt returned no output.');
    }
    return output;
  }
);
