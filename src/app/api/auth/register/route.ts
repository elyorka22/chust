import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.telegram_id || !body.first_name) {
      return NextResponse.json(
        { error: 'Missing required fields: telegram_id, first_name' },
        { status: 400 }
      );
    }

    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: 'Database configuration not found' },
        { status: 500 }
      );
    }

    const supabase = createServerClient();

    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('telegram_id', body.telegram_id)
      .single();

    if (existingUser) {
      // User already exists, return existing user
      return NextResponse.json({
        success: true,
        user: existingUser,
        message: 'User already exists'
      });
    }

    // Create new user
    const { data: user, error } = await supabase
      .from('users')
      .insert({
        telegram_id: body.telegram_id,
        username: body.username || null,
        first_name: body.first_name,
        last_name: body.last_name || null,
        phone: body.phone || null,
        email: body.email || null,
        is_verified: true // Telegram users are considered verified
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
      message: 'User registered successfully'
    });

  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 