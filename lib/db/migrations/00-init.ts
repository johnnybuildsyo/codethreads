import { schema } from '../schema'
import { adminClient } from '@/lib/supabase/admin'

async function main() {
  console.log('Running initial migration...')
  
  const { error } = await adminClient.from('profiles').select('id').limit(1)
  
  if (error?.message.includes('relation "profiles" does not exist')) {
    const { error: migrationError } = await adminClient.rpc('exec_sql', {
      query: schema.profiles
    })
    if (migrationError) {
      throw migrationError
    }
    console.log('Created profiles table')
  } else {
    console.log('Profiles table already exists')
  }
}

main().catch(console.error) 