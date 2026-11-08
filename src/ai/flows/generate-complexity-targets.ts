'use server';

/**
 * @fileOverview A Complexity Approach target generation AI agent.
 *
 * - generateComplexityTargets - A function that handles the Complexity Approach target generation process.
 * - GenerateComplexityTargetsInput - The input type for the generateComplexityTargets function.
 * - GenerateComplexityTargetsOutput - The return type for the generateComplexityTargets function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateComplexityTargetsInputSchema = z.object({
  phonologicalError: z
    .string()
    .describe('The phonological error or a description of the sound system.'),
  stimulableSounds: z.array(z.string()).optional().describe('A list of sounds the child can produce with stimulation.'),
  phoneticInventory: z.array(z.string()).optional().describe('A list of sounds the child can produce spontaneously.'),
  syllableLength: z.string().optional().describe('The desired syllable length for the target words (e.g., "one syllable", "two syllables").'),
  phonemePosition: z.string().optional().describe('The desired position of the target sound in the word (e.g., "initial", "medial", "final").'),
});
export type GenerateComplexityTargetsInput = z.infer<
  typeof GenerateComplexityTargetsInputSchema
>;

const GenerateComplexityTargetsOutputSchema = z.object({
  complexityPairs: z
    .array(
      z.object({
        pair: z.string().describe('The complex word pair, separated by a hyphen.'),
        rationale: z.string().describe('A brief explanation of why this pair was chosen, including the source for the logic.'),
      })
    )
    .describe('A list of word pairs based on the Complexity Approach.'),
});
export type GenerateComplexityTargetsOutput = z.infer<
  typeof GenerateComplexityTargetsOutputSchema
>;

export async function generateComplexityTargets(
  input: GenerateComplexityTargetsInput
): Promise<GenerateComplexityTargetsOutput> {
  return generateComplexityTargetsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateComplexityTargetsPrompt',
  input: {schema: GenerateComplexityTargetsInputSchema},
  output: {schema: GenerateComplexityTargetsOutputSchema},
  prompt: `You are an expert speech language pathologist specializing in the Complexity Approach for phonological disorders.

You will use the provided information to generate a list of word pairs for therapy. The Complexity Approach targets sounds that are more complex, later-developing, and non-stimulable for the child. The goal is to promote widespread generalization to the entire sound system.

**Information about the child:**
- Phonological Error/System: {{{phonologicalError}}}
{{#if phoneticInventory}}
- Phonetic Inventory (sounds they CAN produce): {{phoneticInventory}}.
{{/if}}
{{#if stimulableSounds}}
- Stimulable Sounds (sounds they CAN produce with help): These should be AVOIDED as targets.
{{/if}}

**Word Generation Constraints:**
{{#if syllableLength}}
- The words should have {{syllableLength}}.
{{/if}}
{{#if phonemePosition}}
- The target sounds should be in the {{phonemePosition}} position of the word.
{{/if}}

**Your Task:**
1.  **Analyze Child's System:** Carefully analyze the child's phonological error/system, phonetic inventory, and stimulable sounds. Identify sounds and clusters that are ABSENT from their inventory and are NOT stimulable.
2.  **Select Complex Targets:** From the absent and non-stimulable sounds, select 1-3 target sounds or clusters that are considered highly complex and later-developing based on principles of markedness and the sonority sequencing principle. Prioritize consonant clusters over singletons if appropriate.
3.  **Generate Word Pairs:** For each selected complex target sound/cluster, generate 5 word pairs. Each pair should consist of:
    *   Word 1: Contains a known sound from the child's phonetic inventory that contrasts minimally or maximally in features with the target sound/cluster.
    *   Word 2: Contains the complex target sound/cluster.
    Ensure the words are functional and appropriate for a child.
4.  **Format Pairs and Rationale:** Combine each pair into a single string separated by a hyphen (e.g., "key-skree"). For each pair, provide a brief 'rationale' explaining its value from a complexity perspective, specifically mentioning the contrasting features or complexity principles addressed (e.g., markedness, sonority). Cite the source of the logic (e.g., Gierut, 2001).
5.  **Format Output:** The output should be an array of objects, with each object containing the 'pair' and its 'rationale'.

Your response must be structured according to the output schema.`,
});

const generateComplexityTargetsFlow = ai.defineFlow(
  {
    name: 'generateComplexityTargetsFlow', // Consistent naming
    inputSchema: GenerateComplexityTargetsInputSchema,
    outputSchema: GenerateComplexityTargetsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
