
'use server';

/**
 * @fileOverview This flow takes an image of a business card and extracts contact information to populate contact fields.
 *
 * - scanCardDetails - A function that handles the business card scanning process.
 * - ScanCardDetailsInput - The input type for the scanCardDetails function.
 * - ScanCardDetailsOutput - The return type for the scanCardDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ScanCardDetailsInputSchema = z.object({
  cardImageDataUri: z
    .string()
    .describe(
      "A photo of a business card, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ScanCardDetailsInput = z.infer<typeof ScanCardDetailsInputSchema>;

const ScanCardDetailsOutputSchema = z.object({
  name: z.string().describe('The name of the contact.'),
  company: z.string().describe('The company of the contact.'),
  jobTitle: z.string().describe('The job title of the contact.'),
  phone: z.string().describe('The phone number of the contact.'),
  mobilePhone: z.string().describe('The mobile phone number of the contact.'),
  email: z.string().describe('The email address of the contact.'),
  website: z.string().describe('The website of the contact.'),
  address: z.string().describe('The address of the contact.'),
  socialMedia: z.string().describe('The social media links of the contact.'),
  other: z.string().describe('Other relevant information about the contact.'),
});
export type ScanCardDetailsOutput = z.infer<typeof ScanCardDetailsOutputSchema>;

export async function scanCardDetails(input: ScanCardDetailsInput): Promise<ScanCardDetailsOutput> {
  return scanCardDetailsFlow(input);
}

const scanCardDetailsPrompt = ai.definePrompt({
  name: 'scanCardDetailsPrompt',
  input: {schema: ScanCardDetailsInputSchema},
  output: {schema: ScanCardDetailsOutputSchema},
  prompt: `You are a highly precise OCR assistant that extracts information from business cards.

You are given an image of a business card and you must extract the contact details.

**CRITICAL RULE: If a field is not present on the business card, you MUST return an empty string "" for that field. DO NOT HALLUCINATE, GUESS, or INVENT information. This is a strict requirement.**

Extract the following fields:
- Name
- Company
- Job Title
- Phone Number
- Mobile Phone Number
- Email Address
- Website
- Address
- Social Media Links
- Other relevant information

Business Card Image: {{media url=cardImageDataUri}}

Only return the structured data. Do not add any conversational text.
`,
});

const scanCardDetailsFlow = ai.defineFlow(
  {
    name: 'scanCardDetailsFlow',
    inputSchema: ScanCardDetailsInputSchema,
    outputSchema: ScanCardDetailsOutputSchema,
  },
  async input => {
    const {output} = await scanCardDetailsPrompt(input);
    return output!;
  }
);
