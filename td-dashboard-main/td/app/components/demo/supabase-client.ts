import { createClient } from '@supabase/supabase-js';

// You can find your project settings in the Supabase Dashboard
// Replace 'YOUR_SUPABASE_URL' and 'YOUR_SUPABASE_ANON_KEY' with your project's URL and anon key.
const supabaseUrl = 'https://swotuqvovmsbqfjfnxzq.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3b3R1cXZvdm1zYnFmamZueHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODM5MzYyOTUsImV4cCI6MTk5OTUxMjI5NX0.7xzGeTE9CuBsc0_EYk55VauAXt1Xv5oL6WZuo7X8PP4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
