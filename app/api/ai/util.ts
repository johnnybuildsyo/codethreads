import { generate, generateFromMessages } from '@/lib/ai/actions';
import { readStreamableValue } from 'ai/rsc';
import { CoreMessage } from 'ai';

export async function getStreamingText(input: string, onUpdate: (output: string) => void) {
  try {
    const { output } = await generate(input);
    
    let accumulatedResponse = '';
    for await (const delta of readStreamableValue(output)) {
      if (delta) {
        accumulatedResponse += delta;
        onUpdate(accumulatedResponse);
      }
    }
    return accumulatedResponse;
  } catch (error) {
    console.error('AI Generation Error:', error);
    onUpdate("Failed to generate response. Please try again later.");
    throw error; // Re-throw to handle in the component
  }
}

export async function getStreamingTextFromMessages(
  messages: CoreMessage[],
  onUpdate: (output: string) => void,
  system?: string
) {
  const { output } = await generateFromMessages(messages, system);

  let accumulatedResponse = '';
  for await (const delta of readStreamableValue(output)) {
    if (delta) {
      accumulatedResponse += delta;
      onUpdate(accumulatedResponse);
    }
  }
  return accumulatedResponse;
}
