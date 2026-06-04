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
  console.log('Testing select with metadata and payer_email...');
  const { data: selectData1, error: selectError1 } = await supabase
    .from('payments')
    .select('id, user_id, course_id, status, metadata, payer_email, amount, flow_order')
    .limit(1);

  console.log('Select with all columns - Error:', selectError1);

  console.log('Testing select with ONLY standard columns...');
  const { data: selectData2, error: selectError2 } = await supabase
    .from('payments')
    .select('id, user_id, course_id, status, amount, flow_order')
    .limit(1);

  console.log('Select with only standard columns - Error:', selectError2);
}

run();
