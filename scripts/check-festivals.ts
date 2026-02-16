import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
)

async function checkTable() {
  const { data, error } = await supabase
    .from('festivals')
    .select('*')
    .limit(1)

  if (error) {
    console.log('Festivals table not found or error:', error.message)
  } else {
    console.log('Festivals table exists. Sample data:', data)
  }
}

checkTable()
