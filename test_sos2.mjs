import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://nhogtlycbbfvkdnzklyy.supabase.co',
  'sb_publishable_7UXE-1W8_4jPq9R5rr-Gig_WMdg1ZxV'
);

const { data, error } = await supabase
  .from('rescue_requests')
  .insert([{
    latitude: -23.5614,
    longitude: -46.6558,
    endereco: 'Av. Paulista, 1000, São Paulo',
    veiculo: 'BYD Seal 03',
    bateria_nivel: 8,
    status: 'aguardando',
    valor: 85.00,
  }])
  .select()
  .single();

console.log('Resultado:', data);
console.log('Erro:', error);
