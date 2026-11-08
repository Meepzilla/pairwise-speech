'use server';

/**
 * @fileOverview A multiple opposition target generation AI agent.
 *
 * - generateMultipleOppositions - A function that handles the multiple opposition target generation process.
 * - GenerateMultipleOppositionsInput - The input type for the generateMultipleOppositions function.
 * - GenerateMultipleOppositionsOutput - The return type for the generateMultipleOppositions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMultipleOppositionsInputSchema = z.object({
  phonologicalError: z
    .string()
    .describe(
      'The phonological error or process observed in the childs speech.'
    ),
    stimulableSounds: z.array(z.string()).optional().describe('A list of sounds the child can produce with stimulation.'),
    phoneticInventory: z.array(z.string()).optional().describe('A list of sounds the child can produce spontaneously.'),
    syllableLength: z.string().optional().describe('The desired syllable length for the target words (e.g., "one syllable", "two syllables").'),
    phonemePosition: z.string().optional().describe('The desired position of the target sound in the word (e.g., "initial", "medial", "final").'),
});
export type GenerateMultipleOppositionsInput = z.infer<
  typeof GenerateMultipleOppositionsInputSchema
>;

const GenerateMultipleOppositionsOutputSchema = z.object({
  multipleOppositions: z
    .array(
      z.object({
        set: z.string().describe('The set of contrasting words, separated by hyphens.'),
        rationale: z.string().describe('A brief explanation of why this set was chosen, including the source for the logic.'),
      })
    )
    .describe(
      'A list of multiple opposition sets for therapy. Each string is a set of contrasting words.'
    ),
});
export type GenerateMultipleOppositionsOutput = z.infer<
  typeof GenerateMultipleOppositionsOutputSchema
>;

export async function generateMultipleOppositions(
  input: GenerateMultipleOppositionsInput
): Promise<GenerateMultipleOppositionsOutput> {
  return generateMultipleOppositionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMultipleOppositionsPrompt',
  input: {schema: GenerateMultipleOppositionsInputSchema},
  output: {schema: GenerateMultipleOppositionsOutputSchema},
  prompt: `You are an expert speech language pathologist specializing in phonological disorders and the multiple oppositions approach.

You will use the phonological error to generate a list of 5 multiple opposition sets for therapy.
The multiple oppositions approach contrasts a child's single phonemic collapse with multiple target sounds from across an entire sound class. For example, if a child substitutes /t/ for /s/, /k/, and /ch/, a word set might be 'tip-sip-kip-chip'.

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

When selecting targets, consider the child's phonetic inventory and stimulability. The target sounds should ideally be outside of the child's phonetic inventory to create the most system-wide change.

For each generated set, provide a brief 'rationale' explaining why it's a good choice and cite the source of the logic. For example: "This set contrasts the error /t/ with four target sounds (/s/, /k/, /f/, /l/) that are being collapsed, based on the Multiple Oppositions approach by Williams (2000)."
Format the output as an array of objects, each with a 'set' and a 'rationale'.`,
});

const generateMultipleOppositionsFlow = ai.defineFlow(
  {
    name: 'generateMultipleOppositionsFlow',
    inputSchema: GenerateMultipleOppositionsInputSchema,
    outputSchema: GenerateMultipleOppositionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
