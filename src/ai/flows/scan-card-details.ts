
'use server';

/**
 * @fileOverview This flow takes an image of a business card and extracts contact information to populate contact fields.
 * It uses a single multimodal prompt to directly extract and structure information from the image.
 *
 * - scanCardDetails - A function that handles the business card scanning process.
 * - ScanCardDetailsInput - The input type for the scanCarddetails function.
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

const scanCardDetailsFlow = ai.defineFlow(
  {
    name: 'scanCardDetailsFlow',
    inputSchema: ScanCardDetailsInputSchema,
    outputSchema: ScanCardDetailsOutputSchema,
  },
  async (input) => {

    // Extract MIME type from Data URI
    const match = input.cardImageDataUri.match(/^data:(.*?);base64,/);
    if (!match) {
        throw new Error("Invalid data URI format. Could not extract MIME type.");
    }
    const contentType = match[1];

    const result = await ai.generate({
        model: 'googleai/gemini-pro',
        prompt: [
            {
                text: `You are an intelligent assistant that structures contact information from a business card image.
Your task is to analyze the image and populate the fields of the provided JSON schema.
CRITICAL RULE: If a field's information is not present in the image, you MUST return an empty string "" for that field. DO NOT HALLUCINATE, GUESS, or INVENT information. This is a strict requirement.
Extract the following fields: name, company, jobTitle, phone, mobilePhone, email, website, address, socialMedia, other.
Only return the structured JSON data. Do not add any conversational text.`
            },
            {
                media: {
                    url: input.cardImageDataUri,
                    contentType: contentType,
                },
            },
        ],
        output: {
            schema: ScanCardDetailsOutputSchema,
        },
    });

    return result.output!;
  }
);
