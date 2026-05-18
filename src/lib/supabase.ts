import { createClient } from '@supabase/supabase-js'

export const PANEL_URL = 'https://solarproof-api.maxone.one'
export const ANON_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzc5MTMzMDYxLCJleHAiOjE5MzY4MTMwNjF9.Ku7K_pxpNNI-7_t5c3wPfUBsRsDc_qXPFBcqLSC48yM'

export const supabase = createClient(PANEL_URL, ANON_KEY)
