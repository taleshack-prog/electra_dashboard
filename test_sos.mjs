import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://nhogtlycbbfvkdnzklyy.supabase.co',
  'sb_publishable_7UXE-1W8_4jPq9R5rr-Gig_WMdg1ZxV'
);

const { data, error } = await supabase.from('rescue_requests').select('*').order('created_at', { ascending: false });
console.log('SOS registos:', data?.length);
if (data?.length > 0) console.log('Último SOS:', data[0]);
console.log('Erro:', error);
