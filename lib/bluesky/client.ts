import { BskyAgent } from '@atproto/api'

const BLUESKY_SERVICE = 'https://bsky.social'

export interface BlueskyCredentials {
  did: string
  handle: string
  accessJwt: string
  refreshJwt: string
}

export async function loginWithBluesky(identifier: string, password: string): Promise<BlueskyCredentials> {
  const agent = new BskyAgent({ service: BLUESKY_SERVICE })
  
  try {
    const { data: { did, handle }, data } = await agent.login({
      identifier,
      password,
    })

    return {
      did,
      handle,
      accessJwt: data.accessJwt,
      refreshJwt: data.refreshJwt,
    }
  } catch (error) {
    console.error('Bluesky login error:', error)
    throw new Error('Failed to login to Bluesky')
  }
}

export async function createBskyAgent(credentials: BlueskyCredentials) {
  const agent = new BskyAgent({ service: BLUESKY_SERVICE })
  await agent.resumeSession({ did: credentials.did, handle: credentials.handle, accessJwt: credentials.accessJwt, refreshJwt: credentials.refreshJwt })
  return agent
} 