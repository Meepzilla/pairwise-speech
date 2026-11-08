'use server';

/**
 * @fileOverview A flow to transcribe a word into its International Phonetic Alphabet (IPA) representation.
 *
 * - transcribeToIpa - A function that transcribes a word to IPA.
 * - TranscribeToIpaInput - The input type for the transcribeToIpa function.
 * - TranscribeToIpaOutput - The return type for the transcribeToIpa function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranscribeToIpaInputSchema = z.string().describe('The word to transcribe.');
export type TranscribeToIpaInput = z.infer<typeof TranscribeToIpaInputSchema>;

const TranscribeToIpaOutputSchema = z.string().describe('The IPA transcription of the word.');
export type TranscribeToIpaOutput = z.infer<typeof TranscribeToIpaOutputSchema>;

export async function transcribeToIpa(
  input: TranscribeToIpaInput
): Promise<TranscribeToIpaOutput> {
  return transcribeToIpaFlow(input);
}

const prompt = ai.definePrompt({
  name: 'transcribeToIpaPrompt',
  input: {schema: TranscribeToIpaInputSchema},
  output: {schema: TranscribeToIpaOutputSchema},
  prompt: `Transcribe the following English word into its International Phonetic Alphabet (IPA) representation using American English pronunciation.

Return ONLY the IPA transcription, enclosed in slashes. For example, for the word "water", you should return "/wɔtər/".

Word: {{{json input}}}`,
});

const transcribeToIpaFlow = ai.defineFlow(
  {
    name: 'transcribeToIpaFlow',
    inputSchema: TranscribeToIpaInputSchema,
    outputSchema: TranscribeToIpaOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
