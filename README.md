# CodeThreads

## Setup

1. Install dependencies:
```bash
pnpm install
```

2. Start Supabase locally:
```bash
pnpm supabase start
```

3. Reset database and generate types:
```bash
pnpm db:dev
```

## Running locally

1. Start the development server:
```bash
pnpm dev
```

2. Open [http://localhost:3000](http://localhost:3000)

## Development Commands

- Reset database: `pnpm db:local:reset`
- Generate types: `pnpm db:local:types`
- Create new migration: `pnpm db:local:new <migration_name>`
- Check Supabase status: `pnpm db:local:status`

## Environment Variables

Make sure you have the following in your `.env.local`:
```bash
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_local_anon_key
```

## Testing

Thread title:
Building the Publishing Platform for Live Coding

Intro:
I came up with the idea for Code Threads when I was [live posting to Bluesky](https://bsky.app/profile/johnnybuilds.bsky.social/post/3lct4orsaqc25) some code for a project. Sharing my coding process in real-time was a lot of fun. It got me thinking...

What if there was a platform that allowed me to share what I was working on while I was working on it, but didn't get in the way? A place where I could showcase my work and get immediate feedback. 

Notes:

V0 makes it really easy to spin up UI so I gave it a prompt:

> Landing page for Code Threads, a site for live coding in post thread format. Share and learn with the community as you build in public.

It spit out a landing page with Header, Hero, Features, HowItWorks, CommunityShowcase, CallToAction and Footer composed of Shadcn UI components.


I'm thinking about Code Threads as a code-first writing and publishing platform, a place to build projects starting from zero to launch and beyond. 