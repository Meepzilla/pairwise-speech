'use server';

/**
 * @fileOverview A flow to calculate the sonority difference between the initial sounds of two words.
 *
 * - calculateSonorityDifference - A function that calculates the sonority difference.
 * - CalculateSonorityDifferenceInput - The input type for the calculateSonorityDifference function.
 * - CalculateSonorityDifferenceOutput - The return type for the calculateSonorityDifference function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CalculateSonorityDifferenceInputSchema = z.object({
  word1: z.string().describe('The first word in the pair.'),
  word2: z.string().describe('The second word in the pair.'),
});
export type CalculateSonorityDifferenceInput = z.infer<
  typeof CalculateSonorityDifferenceInputSchema
>;

const CalculateSonorityDifferenceOutputSchema = z.object({
  difference: z
    .number()
    .nullish()
    .describe(
      'The calculated sonority difference. Null if not applicable (e.g., for vowels).'
    ),
  rationale: z
    .string()
    .describe('An explanation of how the sonority was calculated.'),
});
export type CalculateSonorityDifferenceOutput = z.infer<
  typeof CalculateSonorityDifferenceOutputSchema
>;

export async function calculateSonorityDifference(
  input: CalculateSonorityDifferenceInput
): Promise<CalculateSonorityDifferenceOutput> {
  return calculateSonorityDifferenceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'calculateSonorityDifferencePrompt',
  input: {schema: CalculateSonorityDifferenceInputSchema},
  output: {schema: CalculateSonorityDifferenceOutputSchema},
  prompt: `You are an expert linguist specializing in phonology and sonority. Your task is to calculate the sonority difference for the initial sounds of a given word pair.

**Sonority Hierarchy Scale (IMPORTANT - Use these exact values):**
- Vowels = 4
- Glides (/w/, /j/) = 3
- Liquids (/l/, /r/) = 2
- Nasals (/m/, /n/, /ŋ/) = 1
- Obstruents (Stops, Fricatives, Affricates like /s/, /t/, /p/, /g/, etc.) = 0

**Instructions:**
1.  **Identify Initial Sounds:** For each word ('{{{word1}}}' and '{{{word2}}}'), determine the initial phoneme or consonant cluster.
2.  **Calculate Sonority:**
    *   For a single initial consonant, find its value on the sonority scale.
    *   For an initial consonant cluster (e.g., /bl/, /spr/), you must calculate the sonority for *each consonant in the cluster individually* and then sum their values. **Crucially, do not assign 0 to all consonants in a cluster.** For example, for the cluster /gl/, the sonority of /g/ (an obstruent) is 0 and the sonority of /l/ (a liquid) is 2. The total sonority for the cluster /gl/ is 0 + 2 = 2.
3.  **Calculate the Difference:** Subtract the sonority of the simpler word's initial sound from the sonority of the more complex word's initial sound/cluster. The result is the sonority distance.
4.  **Handle Vowel-Initial Words:** If a word starts with a vowel, the sonority difference calculation is not applicable. In this case, the difference should be null.
5.  **Provide Rationale:** Briefly explain your calculation. For example: "For 'go' vs 'glow', the difference is 2. 'go' begins with /g/ (sonority 0). 'glow' begins with the cluster /gl/. /g/ has a sonority of 0 and /l/ has a sonority of 2. The cluster's sonority is 2 (0+2). The difference is 2-0=2."
6.  **Format Output:** Your response must be structured according to the output schema.

Calculate the sonority difference for the pair: **{{{word1}}} - {{{word2}}}**`,
});

const calculateSonorityDifferenceFlow = ai.defineFlow(
  {
    name: 'calculateSonorityDifferenceFlow',
    inputSchema: CalculateSonorityDifferenceInputSchema,
    outputSchema: CalculateSonorityDifferenceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
