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
