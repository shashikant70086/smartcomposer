'use server';

/**
 * @fileOverview Summarizes past notifications using GenAI.
 *
 * - summarizePastNotifications - A function that handles the summarization of past notifications.
 * - SummarizePastNotificationsInput - The input type for the summarizePastNotifications function.
 * - SummarizePastNotificationsOutput - The return type for the summarizePastNotifications function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizePastNotificationsInputSchema = z.object({
  pastNotifications: z
    .string()
    .describe('A list of past notifications to summarize.'),
});
export type SummarizePastNotificationsInput = z.infer<
  typeof SummarizePastNotificationsInputSchema
>;

const SummarizePastNotificationsOutputSchema = z.object({
  summary: z.string().describe('A summary of the past notifications.'),
});
export type SummarizePastNotificationsOutput = z.infer<
  typeof SummarizePastNotificationsOutputSchema
>;

export async function summarizePastNotifications(
  input: SummarizePastNotificationsInput
): Promise<SummarizePastNotificationsOutput> {
  return summarizePastNotificationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizePastNotificationsPrompt',
  input: {schema: SummarizePastNotificationsInputSchema},
  output: {schema: SummarizePastNotificationsOutputSchema},
  prompt: `You are an expert at summarizing notifications.

  Given the following list of past notifications, create a concise summary of what worked and what didn't.

  Past Notifications: {{{pastNotifications}}} `,
});

const summarizePastNotificationsFlow = ai.defineFlow(
  {
    name: 'summarizePastNotificationsFlow',
    inputSchema: SummarizePastNotificationsInputSchema,
    outputSchema: SummarizePastNotificationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
