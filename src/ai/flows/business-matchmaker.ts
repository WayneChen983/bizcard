
'use server';

/**
 * @fileOverview This flow implements an intelligent business matchmaking assistant.
 * It uses RAG to find the most suitable contacts from a user's collection based on their business needs.
 *
 * - businessMatchmaker - A function that handles the matchmaking process.
 * - BusinessMatchmakerInput - The input type for the businessMatchmaker function.
 * - BusinessMatchmakerOutput - The return type for the businessMatchmaker function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { Contact } from '@/lib/types';

// We define a simplified Contact schema for the AI prompt,
// as we don't need to pass all the raw data (like IDs or timestamps).
const SimplifiedContactSchema = z.object({
  name: z.string(),
  company: z.string().optional(),
  jobTitle: z.string().optional(),
  phone: z.string().optional(),
  mobilePhone: z.string().optional(),
  email: z.string().optional(),
  website: z.string().optional(),
  address: z.string().optional(),
  socialMedia: z.string().optional(),
  other: z.string().describe('User-defined notes about the contact.'),
  groups: z.array(z.string()).optional(),
});

const BusinessMatchmakerInputSchema = z.object({
  userNeed: z
    .string()
    .describe('The business need, goal, or task the user wants to accomplish.'),
  contacts: z
    .array(SimplifiedContactSchema)
    .describe("The user's collected business cards/contacts."),
});
export type BusinessMatchmakerInput = z.infer<
  typeof BusinessMatchmakerInputSchema
>;

const BusinessMatchmakerOutputSchema = z.object({
  analysis: z.string().describe("Analysis of the user's goal and what they want to achieve."),
  recommendations: z.array(z.object({
      name: z.string().describe("The full name of the recommended contact."),
      company: z.string().describe("The company of the recommended contact."),
      jobTitle: z.string().describe("The job title of the recommended contact."),
      reason: z.string().describe("The reason for recommending this person and how they can help the user."),
  })).describe("A list of the most suitable people to contact."),
  suggestions: z.string().describe("Additional suggestions or alternative strategies if no direct match is found."),
});
export type BusinessMatchmakerOutput = z.infer<
  typeof BusinessMatchmakerOutputSchema
>;

// Exported function to be called from the frontend
export async function businessMatchmaker(
  input: BusinessMatchmakerInput
): Promise<BusinessMatchmakerOutput> {
  return businessMatchmakerFlow(input);
}

const matchmakerPrompt = ai.definePrompt({
  name: 'businessMatchmakerPrompt',
  input: { schema: BusinessMatchmakerInputSchema },
  output: { schema: BusinessMatchmakerOutputSchema },
  system: `You are an "Intelligent Business Matchmaking Assistant" for a business card App.
Your task is:

1.  Understand the user's business needs, goals, or the task they want to accomplish.
2.  Use RAG (Retrieval-Augmented Generation) to query the user's collected business card information. The cards contain:
    - Name
    - Company
    - Job Title
    - Contact Information
    - User-defined notes
3.  Based on the retrieved card data, provide:
    - The most suitable person/people.
    - The reason for the recommendation.
    - How this person can help the user.
4.  If no direct match is found, provide possible alternative directions.

Your response style must be:
- Clear
- Professionally business-oriented
- Specific in its recommendations
- Prohibit hallucination. If the query results are insufficient to answer, state it honestly and provide feasible alternative suggestions.

Your response format is as follows:

【使用者需求分析】
(Analyze the user's goal and what they want to achieve)

【推薦人選】
(Provide a list of recommended individuals here. If no one is suitable, state "無符合條件的推薦人選")
- **姓名**：
- **公司**：
- **職稱**：
- **推薦原因**：

【補充建議】
(If there are other worthy considerations or strategies, provide them here)

Here is the user's request and their contact list.
User's Need:
{{{userNeed}}}

Contact List (in JSON format):
{{{json contacts}}}
`,
});

const businessMatchmakerFlow = ai.defineFlow(
  {
    name: 'businessMatchmakerFlow',
    inputSchema: BusinessMatchmakerInputSchema,
    outputSchema: BusinessMatchmakerOutputSchema,
  },
  async (input) => {
    const { output } = await matchmakerPrompt(input);
    // The prompt is configured to never return null for structured output,
    // so we can safely use the non-null assertion.
    return output!;
  }
);
