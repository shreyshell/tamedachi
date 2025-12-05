/**
 * Database Verification Script for Tamedachi
 * 
 * This script checks if the database tables are properly set up.
 * Run with: node scripts/verify-database.mjs
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

// Load environment variables from .env.local
const envFile = readFileSync('.env.local', 'utf-8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim();
  }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verifyDatabase() {
  console.log('🔍 Verifying Tamedachi database setup...\n');
  console.log(`📍 Supabase URL: ${supabaseUrl}\n`);

  let allGood = true;

  // Check pets table
  console.log('Checking pets table...');
  try {
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ pets table error:', error.message);
      allGood = false;
    } else {
      console.log('✅ pets table exists and is accessible');
    }
  } catch (error) {
    console.error('❌ pets table error:', error.message);
    allGood = false;
  }

  // Check content_submissions table
  console.log('Checking content_submissions table...');
  try {
    const { data, error } = await supabase
      .from('content_submissions')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ content_submissions table error:', error.message);
      allGood = false;
    } else {
      console.log('✅ content_submissions table exists and is accessible');
    }
  } catch (error) {
    console.error('❌ content_submissions table error:', error.message);
    allGood = false;
  }

  console.log('\n' + '='.repeat(50));
  
  if (allGood) {
    console.log('✨ Database setup verified successfully!');
    console.log('\n🎉 Your Tamedachi database is ready to go!');
    console.log('\nNext steps:');
    console.log('  1. Start implementing authentication');
    console.log('  2. Create the PetService');
    console.log('  3. Build the UI components');
  } else {
    console.log('⚠️  Database setup incomplete');
    console.log('\nPlease run the migrations:');
    console.log('  1. Open Supabase Dashboard SQL Editor');
    console.log('  2. Run supabase/migrations/20241206000001_create_pets_table.sql');
    console.log('  3. Run supabase/migrations/20241206000002_create_content_submissions_table.sql');
    console.log('\nSee SUPABASE_SETUP.md for detailed instructions');
  }
}

verifyDatabase().catch((error) => {
  console.error('\n💥 Verification failed:', error);
  process.exit(1);
});
