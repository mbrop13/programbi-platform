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
  const { data: courses, error: errCourses } = await supabase.from('courses').select('slug, title').limit(5);
  console.log('Courses:', courses, 'Error:', errCourses);

  const { data: enrollments, error: errEnrollments } = await supabase.from('enrollments').select('*').limit(5);
  console.log('Enrollments:', enrollments, 'Error:', errEnrollments);

  const { data: profiles, error: errProfiles } = await supabase.from('profiles').select('email, full_name').limit(5);
  console.log('Profiles:', profiles, 'Error:', errProfiles);
}

run();
