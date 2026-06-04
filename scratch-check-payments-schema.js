const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Parse .env.local manually
const envContent = fs.readFileSync('.env.local', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const parts = trimmed.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const value = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
      env[key] = value;
    }
  }
});

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SECRET_KEY
);

async function run() {
  // Test insert with metadata
  console.log('Testing insert with metadata...');
  const { data: insertData, error: insertError } = await supabase
    .from('payments')
    .insert({
      flow_order: 'TEST-ORDER-123',
      amount: 1000,
      currency: 'CLP',
      status: 'pending',
      metadata: { test: 'value' }
    })
    .select();

  if (insertError) {
    console.error('Insert error:', insertError);
    return;
  }
  console.log('Insert success:', insertData);

  const paymentId = insertData[0].id;

  // Cleanup
  console.log('Cleaning up...');
  const { error: deleteError } = await supabase
    .from('payments')
    .delete()
    .eq('id', paymentId);
  console.log('Cleanup error (if any):', deleteError);
}

run();
