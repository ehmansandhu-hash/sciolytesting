import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ykmqmhxinsjpnewaxhrl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrbXFtaHhpbnNqcG5ld2F4aHJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3OTY2ODgsImV4cCI6MjA4MDM3MjY4OH0.Fw_F2uxx8DyARV0PSGzG5nbiM8e-smX03rbKcZMPK6E';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_KEY) {
    console.error('Please run with SUPABASE_SERVICE_ROLE_KEY env var');
    process.exit(1);
}

const supabaseAnon = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function verify() {
    console.log('--- Starting Verification ---');

    // 1. Setup: Ensure we have at least one active and one inactive test
    console.log('Setting up test data...');

    // Get all tests
    const { data: allTests } = await supabaseAdmin.from('tests').select('id, title, is_active, is_published');

    if (!allTests || allTests.length < 2) {
        console.log('Not enough tests to verify. Please create at least 2 tests.');
        return;
    }

    const test1 = allTests[0];
    const test2 = allTests[1];

    // Make test1 ACTIVE
    await supabaseAdmin.from('tests').update({ is_active: true, is_published: false }).eq('id', test1.id);
    // Make test2 INACTIVE
    await supabaseAdmin.from('tests').update({ is_active: false, is_published: false }).eq('id', test2.id);

    console.log(`Test 1 (${test1.title}) set to ACTIVE`);
    console.log(`Test 2 (${test2.title}) set to INACTIVE`);

    // 2. Verify Anon Access
    console.log('\n--- Verifying Anon Access ---');

    // Try to fetch ACTIVE test
    const { data: activeData, error: activeError } = await supabaseAnon
        .from('tests')
        .select('*')
        .eq('id', test1.id)
        .single();

    if (activeData) {
        console.log('✅ SUCCESS: Anon CAN see active test.');
    } else {
        console.error('❌ FAILURE: Anon CANNOT see active test.', activeError);
    }

    // Try to fetch INACTIVE test
    const { data: inactiveData, error: inactiveError } = await supabaseAnon
        .from('tests')
        .select('*')
        .eq('id', test2.id)
        .single();

    if (!inactiveData) {
        console.log('✅ SUCCESS: Anon CANNOT see inactive test (Correct).');
    } else {
        console.error('❌ FAILURE: Anon CAN see inactive test (Security Breach).');
    }

    // Cleanup (Restore original states if needed, but for now we leave them)
    console.log('\nVerification Complete.');
}

verify();
