// src/ai/flows/generate-notification-variants.ts
'use server';

/**
 * @fileOverview This file defines the Genkit flow for generating notification variants based on a base message and selected tone.
 *
 * The flow takes a base message and tone as input, and returns multiple notification variants tailored to the specifications.
 *
 * @exports generateNotificationVariants - The main function to trigger the notification generation flow.
 * @exports GenerateNotificationVariantsInput - The input type for the generateNotificationVariants function.
 * @exports GenerateNotificationVariantsOutput - The output type for the generateNotificationVariants function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateNotificationVariantsInputSchema = z.object({
  baseMessage: z.string().describe('The base message for the notification.'),
  tone: z.string().describe('The desired tone for the notification (e.g., formal, informal, urgent, friendly).'),
});

export type GenerateNotificationVariantsInput = z.infer<typeof GenerateNotificationVariantsInputSchema>;

const GenerateNotificationVariantsOutputSchema = z.object({
  variants: z.array(z.string()).describe('An array of AI-generated notification variants.'),
});

export type GenerateNotificationVariantsOutput = z.infer<typeof GenerateNotificationVariantsOutputSchema>;

export async function generateNotificationVariants(input: GenerateNotificationVariantsInput): Promise<GenerateNotificationVariantsOutput> {
  return generateNotificationVariantsFlow(input);
}

const generateNotificationVariantsPrompt = ai.definePrompt({
  name: 'generateNotificationVariantsPrompt',
  input: {schema: GenerateNotificationVariantsInputSchema},
  output: {schema: GenerateNotificationVariantsOutputSchema},
  prompt: `You are an AI assistant specializing in generating notification variants.

  Based on the user's base message and selected tone, generate three different notification variants.

  Base Message: {{{baseMessage}}}
  Tone: {{{tone}}}

  Variants:
  {{#each variants}}
  - {{{this}}}
  {{/each}}`,
});

const generateNotificationVariantsFlow = ai.defineFlow(
  {
    name: 'generateNotificationVariantsFlow',
    inputSchema: GenerateNotificationVariantsInputSchema,
    outputSchema: GenerateNotificationVariantsOutputSchema,
  },
  async input => {
    const {output} = await generateNotificationVariantsPrompt({
      ...input,
      variants: [], // Initialize variants array (handlebars each block needs a list to iterate over.)
    });
    return output!;
  }
);
