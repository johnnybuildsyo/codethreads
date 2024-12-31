'use server'

import { generateData } from '../actions';
import { z } from 'zod'

// Define the Zod schema for the response
const sessionIdeasSchema = z.object({
  sessionIdeas: z.array(z.string())
});

export async function generateSessionIdeas(codeChanges: string) {
  const prompt = `You are an API that is used to generate title ideas for post sessions from code changes. Analyze the following code changes as a whole then generate 6 title ideas that would make for compelling sessions to post on social media. They should not be cliche. Use the style of an effective post on Hacker News. Come up with ideas related specifically to the OVERALL code changes in their entirety. Do not include file names in your response: ${codeChanges}`;
  return await generateData(prompt, sessionIdeasSchema);
}