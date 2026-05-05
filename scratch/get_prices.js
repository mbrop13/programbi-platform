const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const content = fs.readFileSync('.env.local', 'utf8');
const env = {};
content.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    env[match[1]] = match[2].trim().replace(/^['"]|['"]$/g, '');
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = env.SUPABASE_SECRET_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixPrices() {
  const { data: overrides } = await supabase.from('price_overrides').select('*');
  console.log('Price Overrides:', overrides);

  const { data: promos } = await supabase.from('promotions').select('*');
  console.log('Promos:', promos);
  
  const adOverrides = overrides?.filter(o => o.item_id === 'analisis-de-datos');
  if (adOverrides && adOverrides.length > 0) {
    console.log('Deleting all overrides for analisis-de-datos...');
    await supabase.from('price_overrides').delete().eq('item_id', 'analisis-de-datos');
  }

  const adPromos = promos?.filter(p => p.target_id === 'analisis-de-datos');
  if (adPromos && adPromos.length > 0) {
    console.log('Deactivating promos for analisis-de-datos...');
    for (const p of adPromos) {
      await supabase.from('promotions').update({ is_active: false }).eq('id', p.id);
    }
  }

  // Also wait, if there's a 10% promo active for "all" or "courses", it will discount the 299000!
  // 299000 * 0.9 = 269100. Does the user want EXACTLY 299.000, or is 269.100 okay?
  // Let's check promos to see if there's a global 10% discount.
}

fixPrices().then(() => console.log('Done')).catch(console.error);
