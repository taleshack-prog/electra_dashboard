import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://nhogtlycbbfvkdnzklyy.supabase.co',
  'sb_publishable_7UXE-1W8_4jPq9R5rr-Gig_WMdg1ZxV'
);

const { data, error } = await supabase.from('charging_stations').select('*');
console.log('Estações:', data?.length, 'registos');
if (data) console.log(data[0]);
console.log('Erro:', error);
