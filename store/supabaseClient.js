import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://mtgvdotkhgwbvsmxgjol.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10Z3Zkb3RraGd3YnZzbXhnam9sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY2ODIwNTEsImV4cCI6MjA1MjI1ODA1MX0.2xge0HNLemsvL5jGTedk_4hDE2bLlyeidTVnerzCXxw";

export const supabase = createClient(supabaseUrl, supabaseKey);
