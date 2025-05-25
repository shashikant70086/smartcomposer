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
  variants: z.array(z.string()).min(3).max(3).describe('An array of exactly three AI-generated notification variants.'),
});

export type GenerateNotificationVariantsOutput = z.infer<typeof GenerateNotificationVariantsOutputSchema>;

export async function generateNotificationVariants(input: GenerateNotificationVariantsInput): Promise<GenerateNotificationVariantsOutput> {
  return generateNotificationVariantsFlow(input);
}

const generateNotificationVariantsPrompt = ai.definePrompt({
  name: 'generateNotificationVariantsPrompt',
  input: {schema: GenerateNotificationVariantsInputSchema},
  output: {schema: GenerateNotificationVariantsOutputSchema},
  prompt: `You are an AI assistant specializing in crafting compelling notification messages.

Your task is to generate exactly three distinct notification variants based on the provided base message and desired tone.
Each variant should be a complete, ready-to-use notification message.

Base Message: {{{baseMessage}}}
Tone: {{{tone}}}

Ensure your output is a JSON object containing a key "variants" which holds an array of these three notification strings. For example:
{
  "variants": [
    "First notification variant text...",
    "Second notification variant text...",
    "Third notification variant text..."
  ]
}
`,
});

const generateNotificationVariantsFlow = ai.defineFlow(
  {
    name: 'generateNotificationVariantsFlow',
    inputSchema: GenerateNotificationVariantsInputSchema,
    outputSchema: GenerateNotificationVariantsOutputSchema,
  },
  async input => {
    const {output} = await generateNotificationVariantsPrompt(input);
    if (!output || !output.variants || output.variants.length !== 3) {
        // Fallback or error handling if the LLM doesn't return exactly 3 variants
        // For now, we'll attempt to provide some sensible defaults or log an error
        console.error("AI did not return the expected 3 variants. Input:", input, "Output:", output);
        // You could try to generate some generic variants or return an error
        // For simplicity, returning a placeholder if generation fails to meet criteria strictly.
        // A more robust solution might involve retries or more sophisticated error handling.
        return { variants: [
            `Notification regarding: ${input.baseMessage.substring(0,30)}... (Tone: ${input.tone}) - Variant 1`,
            `Notification regarding: ${input.baseMessage.substring(0,30)}... (Tone: ${input.tone}) - Variant 2`,
            `Notification regarding: ${input.baseMessage.substring(0,30)}... (Tone: ${input.tone}) - Variant 3`,
        ]};
    }
    return output;
  }
);
