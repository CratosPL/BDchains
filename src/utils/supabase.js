import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL; // Użyj tej zmiennej
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY; // Użyj tej zmiennej

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;