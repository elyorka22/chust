import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: 'Database configuration not found' },
        { status: 500 }
      );
    }

    const supabase = createServerClient();

    // Create a demo user
    const { data: user, error } = await supabase
      .from('users')
      .insert({
        telegram_id: 123456789,
        username: 'demo_user',
        first_name: 'Demo',
        last_name: 'User',
        phone: '+998901234567',
        is_verified: true
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating user:', error);
      return NextResponse.json(
        { error: 'Failed to create user', details: error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      user,
      message: 'User created successfully'
    });

  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 