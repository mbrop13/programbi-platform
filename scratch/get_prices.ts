import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Parse .env.local manually
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      process.env[match[1]] = match[2].trim().replace(/^['"]|['"]$/g, '');
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixPrices() {
  const { data: overrides } = await supabase.from('price_overrides').select('*');
  console.log('Price Overrides:', overrides);

  // Let's delete the Básico override for analisis-de-datos so it falls back to the hardcoded 299.000, 
  // or update it to 299000 if the user prefers that. 
  // Wait, if it has a 10% promo, we need to handle that.
  const { data: promos } = await supabase.from('promotions').select('*');
  console.log('Promos:', promos);
  
  const bOverride = overrides?.find(o => o.item_id === 'analisis-de-datos' && o.level_name === 'Básico');
  if (bOverride) {
    console.log('Found override for Básico. Updating to 299000');
    await supabase.from('price_overrides').update({ price: 299000 }).eq('id', bOverride.id);
  } else {
    console.log('No Básico override found.');
  }
}

fixPrices().then(() => console.log('Done')).catch(console.error);
