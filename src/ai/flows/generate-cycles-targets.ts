'use server';

/**
 * @fileOverview A Cycles Approach target generation AI agent.
 *
 * - generateCyclesTargets - A function that handles the Cycles Approach target generation process.
 * - GenerateCyclesTargetsInput - The input type for the generateCyclesTargets function.
 * - GenerateCyclesTargetsOutput - The return type for the generateCyclesTargets function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCyclesTargetsInputSchema = z.object({
  phonologicalError: z
    .string()
    .describe('The phonological error or process observed in the childs speech.'),
  stimulableSounds: z.array(z.string()).optional().describe('A list of sounds the child can produce with stimulation.'),
  phoneticInventory: z.array(z.string()).optional().describe('A list of sounds the child can produce spontaneously.'),
  syllableLength: z.string().optional().describe('The desired syllable length for the target words (e.g., "one syllable", "two syllables").'),
  cycleStage: z.enum(["primary", "secondary", "advanced"]).optional().describe('The stage of the cycles approach to target.'),
  phonemePosition: z.string().optional().describe('The desired position of the target sound in the word (e.g., "initial", "medial", "final").'),
});
export type GenerateCyclesTargetsInput = z.infer<
  typeof GenerateCyclesTargetsInputSchema
>;

const GenerateCyclesTargetsOutputSchema = z.object({
  primaryProcess: z.string().describe('The phonological process or pattern identified for intervention.'),
  targetPhoneme: z.string().describe('The specific phoneme or structure chosen as the optimal target for the cycle.'),
  targetWords: z
    .array(
      z.object({
        word: z.string().describe('A carefully selected target word.'),
        rationale: z.string().describe('A brief explanation of why this word was chosen, including the source for the logic.'),
        imageUrl: z.string().optional().describe('Optional: The URL of an image representing the target word.'), // Added imageUrl field
      })
    )
    .describe('A list of 5-7 carefully selected target words with rationales.'),
});
export type GenerateCyclesTargetsOutput = z.infer<
  typeof GenerateCyclesTargetsOutputSchema
>;

export async function generateCyclesTargets(
  input: GenerateCyclesTargetsInput
): Promise<GenerateCyclesTargetsOutput> {
  return generateCyclesTargetsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCyclesTargetsPrompt',
  input: {schema: GenerateCyclesTargetsInputSchema},
  output: {schema: GenerateCyclesTargetsOutputSchema},
  prompt: `You are an expert speech language pathologist specializing in the Cycles Approach for phonological disorders.

You will use the provided information to plan a cycle of intervention based on the selected cycle stage. The default stage is 'Primary'.

**Information about the child:**
- Phonological Error: {{{phonologicalError}}}
{{#if phoneticInventory}}
- Phonetic Inventory (sounds they can produce): {{phoneticInventory}}.
{{/if}}
{{#if stimulableSounds}}
- Stimulable Sounds: {{stimulableSounds}}. This is crucial for selecting targets.
{{/if}}

**Word Generation Constraints:**
{{#if syllableLength}}
- The words should have {{syllableLength}}.
{{else}}
- The words should be at a syllable shape the child can handle (e.g., CVC).
{{/if}}
{{#if phonemePosition}}
- The target sound should appear in the {{phonemePosition}} position of the word.
{{/if}}

**Cycle Stages:**
- **Primary Patterns:** Includes early syllable structure patterns (e.g., Final Consonant Deletion), s-clusters, and anterior/posterior contrasts (velars/alveolars). Targets should generally be stimulable sounds.
- **Secondary Patterns:** Includes palatal sounds (/ʃ/, /tʃ/, /dʒ/), other consonant sequences, singleton stridents (/f/, /s/), and voicing contrasts. These are targeted after primary patterns emerge.
- **Advanced Patterns:** Includes complex multisyllabic words and complex consonant sequences (e.g., 3-element clusters like /str/, /skr/). For older children with remaining intelligibility issues.

**Your Task:**
Based on the child's information and the selected cycle stage ('{{#if cycleStage}}{{cycleStage}}{{else}}Primary{{/if}}'), perform the following:
1.  **Identify the Target Pattern:** Determine the most appropriate phonological process or pattern to target within the selected stage.
2.  **Select the Target Phoneme/Structure:** Choose a specific phoneme or word structure as the focus. For primary patterns, prioritize stimulable sounds.
3.  **Generate Target Words:** Create a list of 5-7 functional and engaging target words. For each word, provide a 'rationale' explaining why it is a suitable target and cite the source of the logic. For example: "Targets final /t/ in a simple CVC structure to address Final Consonant Deletion, based on the Cycles approach by Hodson & Paden (1991)."

Your response must be structured according to the output schema. The 'primaryProcess' field should clearly state the targeted pattern (e.g., "Final Consonant Deletion", "S-Cluster Reduction", "Palatal Sibilants"). The 'targetPhoneme' field should contain the specific sound or structure being targeted (e.g., "/k/", "/st/ blends", "3-syllable words").`,
});

const generateCyclesTargetsFlow = ai.defineFlow(
  {
    name: 'generateCyclesTargetsFlow',
    inputSchema: GenerateCyclesTargetsInputSchema,
    outputSchema: GenerateCyclesTargetsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
