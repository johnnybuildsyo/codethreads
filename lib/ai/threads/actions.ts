'use server'

import { generateData } from '../actions';
import { z } from 'zod'

// Define the Zod schema for the response
const threadIdeasSchema = z.object({
  threadIdeas: z.array(z.string())
});

export async function generateThreadIdeas(codeChanges: string) {
  'use server'
  console.log(codeChanges)
  const prompt = `You are an API that is used to generate ideas for post threads from code changes. Analyze the following code changes as a whole then generate 3 or more ideas that would make for compelling threads to post on social media. Only come up with ideas related specifically to the code changes. Do not include file names in your response: ${codeChanges}`;
  return await generateData(prompt, threadIdeasSchema);
}