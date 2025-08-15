import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: 'Database configuration not found' },
        { status: 500 }
      );
    }

    const supabase = createServerClient();

    // Create a policy that allows service role to insert
    const { error: policyError } = await supabase
      .rpc('exec_sql', { 
        sql: `
          DROP POLICY IF EXISTS "Users can insert their own listings" ON listings;
          CREATE POLICY "Service role can insert listings" ON listings
          FOR INSERT WITH CHECK (true);
        ` 
      });

    // Check categories
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*');

    // Check existing users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*');

    // Check if we can insert into listings
    const { data: testInsert, error: insertError } = await supabase
      .from('listings')
      .insert({
        title: 'Test',
        price: 100,
        currency: 'USD',
        latitude: 40.9977,
        longitude: 71.2374,
        contact_phone: '123456789',
        category_id: 1,
        user_id: users && users.length > 0 ? users[0].id : '00000000-0000-0000-0000-000000000000',
        is_active: true
      })
      .select()
      .single();

    return NextResponse.json({
      policyError: policyError,
      categories: categories || [],
      categoriesError: categoriesError,
      users: users || [],
      usersError: usersError,
      testInsert: testInsert,
      insertError: insertError,
      message: 'Debug info'
    });

  } catch (error) {
    console.error('Error in debug:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error },
      { status: 500 }
    );
  }
} 