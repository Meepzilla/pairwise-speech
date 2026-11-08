'use server';

/**
 * @fileOverview A maximal pair target generation AI agent.
 *
 * - generateMaximalPairTargets - A function that handles the maximal pair target generation process.
 * - GenerateMaximalPairTargetsInput - The input type for the generateMaximalPairTargets function.
 * - GenerateMaximalPairTargetsOutput - The return type for the generateMaximalPairTargets function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMaximalPairTargetsInputSchema = z.object({
  phonologicalError: z
    .string()
    .describe('The phonological error observed in the childs speech.'),
  stimulableSounds: z.array(z.string()).optional().describe('A list of sounds the child can produce with stimulation.'),
  phoneticInventory: z.array(z.string()).optional().describe('A list of sounds the child can produce spontaneously.'),
  syllableLength: z.string().optional().describe('The desired syllable length for the target words (e.g., "one syllable", "two syllables").'),
  phonemePosition: z.string().optional().describe('The desired position of the target sound in the word (e.g., "initial", "medial", "final").'),
});
export type GenerateMaximalPairTargetsInput = z.infer<
  typeof GenerateMaximalPairTargetsInputSchema
>;

const GenerateMaximalPairTargetsOutputSchema = z.object({
  maximalPairs: z
    .array(
      z.object({
        pair: z.string().describe('The maximal word pair, separated by a hyphen.'),
        rationale: z.string().describe('A brief explanation of why this pair was chosen, including the source for the logic.'),
      })
    )
    .describe('A list of maximal pair targets for therapy.'),
});
export type GenerateMaximalPairTargetsOutput = z.infer<
  typeof GenerateMaximalPairTargetsOutputSchema
>;

export async function generateMaximalPairTargets(
  input: GenerateMaximalPairTargetsInput
): Promise<GenerateMaximalPairTargetsOutput> {
  return generateMaximalPairTargetsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMaximalPairTargetsPrompt',
  input: {schema: GenerateMaximalPairTargetsInputSchema},
  output: {schema: GenerateMaximalPairTargetsOutputSchema},
  prompt: `You are an expert speech language pathologist specializing in phonological disorders.

You will use the phonological error to generate a list of 5 maximal pair targets for therapy.
Maximal pairs are pairs of words that differ by multiple phoneme features (place, manner, voicing).

Phonological Error: {{{phonologicalError}}}

{{#if syllableLength}}
The generated words should have {{syllableLength}}.
{{/if}}

{{#if phonemePosition}}
The target sounds should be in the {{phonemePosition}} position of the word.
{{/if}}

{{#if phoneticInventory}}
The child's phonetic inventory (sounds they can produce) includes: {{phoneticInventory}}.
{{/if}}

{{#if stimulableSounds}}
The child is stimulable for the following sounds: {{stimulableSounds}}.
{{/if}}

When selecting the two sounds for each maximal pair, aim to maximize the feature differences (place, manner, voicing) between them. Prioritize contrasting a sound the child CAN produce from their phonetic inventory with a target sound they CANNOT produce and is non-stimulable. The greater the difference in features, the more "maximal" the pair.

For each generated pair (e.g., "sea-key"), provide a brief 'rationale' explaining the specific feature differences (e.g., "Contrasts /s/ [alveolar, fricative, voiceless] with /k/ [velar, stop, voiceless], differing in place and manner"). Explain why this contrast is significant from a maximal opposition perspective and cite the source of the logic (e.g., based on the Maximal Oppositions approach by Gierut (1989)).
Format the output as an array of objects, each with a 'pair' and a 'rationale'.`
});

const generateMaximalPairTargetsFlow = ai.defineFlow(
  {
    name: 'generateMaximalPairTargetsFlow',
    inputSchema: GenerateMaximalPairTargetsInputSchema,
    outputSchema: GenerateMaximalPairTargetsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
