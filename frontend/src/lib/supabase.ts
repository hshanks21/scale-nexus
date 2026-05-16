import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wfgzsqquvocfyzhlydfu.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmZ3pzcXF1dm9jZnl6aGx5ZGZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2NjMyMjEsImV4cCI6MjA1ODIzOTIyMX0.hokMuZikRFyPVNVahDzMSgCupJFpOFBOOqAqDR6O-Mc'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
