'use server'

import { CoreMessage, streamText } from 'ai'
import { openai } from '@ai-sdk/openai'
import { createStreamableValue } from 'ai/rsc'
import { streamObject } from 'ai'
import { z } from 'zod'

async function createStreamingResponse(options: Parameters<typeof streamText>[0]) {
  const stream = createStreamableValue('');

  (async () => {
    try {
      const { textStream } = await streamText(options)

      for await (const delta of textStream) {
        stream.update(delta)
      }

      stream.done()
    } catch (error) {
      console.error('Streaming Error:', error)
      stream.error(error)
    }
  })()

  return { output: stream.value }
}

export async function generate(input: string) {
  'use server'
  return createStreamingResponse({
    model: openai('gpt-4o-mini'),
    prompt: input
  })
}

export async function generateFromMessages(messages: CoreMessage[], system?: string) {
  'use server'
  return createStreamingResponse({
    model: openai('gpt-4o'),
    messages,
    system
  })
}

export async function generateData<T, P>(prompt: string, schema: z.ZodSchema<T>) {
  const stream = createStreamableValue<T, P>();

  ;(async () => {
    try {
      const { partialObjectStream } = await streamObject({
        model: openai('gpt-4o'),
        prompt,
        schema
      });

      for await (const partialObject of partialObjectStream) {
        const result = schema.safeParse(partialObject);
        if (result.success) {
          stream.update(result.data);
        }
      }

      stream.done();
    } catch (error) {
      console.error('Error in generateData:', error);
      stream.error(error);
    }
  })();

  return { object: stream.value };
}