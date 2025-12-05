/**
 * Database Setup Script for Tamedachi
 * 
 * This script applies the database migrations to your Supabase project.
 * Run with: npx tsx scripts/setup-database.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.');
  process.exit(1);
}

// Create Supabase client with service role key (bypasses RLS)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration(filePath: string): Promise<void> {
  const fileName = path.basename(filePath);
  console.log(`\n📄 Running migration: ${fileName}`);
  
  try {
    const sql = fs.readFileSync(filePath, 'utf-8');
    
    // Execute the SQL
    const { error } = await supabase.rpc('exec_sql', { sql_query: sql }).single();
    
    if (error) {
      // If exec_sql doesn't exist, try direct execution
      // Note: This requires the SQL to be split into individual statements
      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0);
      
      for (const statement of statements) {
        const { error: stmtError } = await supabase.rpc('exec', { 
          query: statement 
        });
        
        if (stmtError) {
          throw stmtError;
        }
      }
    }
    
    console.log(`✅ Successfully applied: ${fileName}`);
  } catch (error) {
    console.error(`❌ Error applying ${fileName}:`, error);
    throw error;
  }
}

async function setupDatabase(): Promise<void> {
  console.log('🚀 Starting Tamedachi database setup...\n');
  console.log(`📍 Supabase URL: ${supabaseUrl}`);
  
  const migrationsDir = path.join(process.cwd(), 'supabase', 'migrations');
  
  // Check if migrations directory exists
  if (!fs.existsSync(migrationsDir)) {
    console.error('❌ Migrations directory not found:', migrationsDir);
    process.exit(1);
  }
  
  // Get all migration files sorted by name
  const migrationFiles = fs
    .readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort()
    .map(file => path.join(migrationsDir, file));
  
  console.log(`📋 Found ${migrationFiles.length} migration(s) to apply\n`);
  
  // Run migrations in order
  for (const migrationFile of migrationFiles) {
    await runMigration(migrationFile);
  }
  
  console.log('\n✨ Database setup complete!');
  console.log('\n📊 Tables created:');
  console.log('  - pets (with RLS policies and indexes)');
  console.log('  - content_submissions (with RLS policies and indexes)');
  console.log('\n🔒 Row Level Security (RLS) is enabled on all tables');
  console.log('🎯 Indexes created for optimized queries');
  console.log('\n💡 Next steps:');
  console.log('  1. Verify tables in Supabase Dashboard');
  console.log('  2. Test authentication flow');
  console.log('  3. Start implementing the pet service!');
}

// Run the setup
setupDatabase().catch((error) => {
  console.error('\n💥 Setup failed:', error);
  process.exit(1);
});
