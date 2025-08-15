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

    // Create a demo user if it doesn't exist
    const { data: existingUser, error: userCheckError } = await supabase
      .from('users')
      .select('id')
      .eq('telegram_id', 123456789) // Demo telegram ID
      .single();

    let userId;
    
    if (userCheckError && userCheckError.code === 'PGRST116') {
      // User doesn't exist, create it
      const { data: newUser, error: createUserError } = await supabase
        .from('users')
        .insert({
          telegram_id: 123456789,
          username: 'demo_user',
          first_name: 'Demo',
          last_name: 'User',
          phone: '+998901234567',
          is_verified: true
        })
        .select('id')
        .single();

      if (createUserError) {
        console.error('Error creating user:', createUserError);
        return NextResponse.json(
          { error: 'Failed to create demo user' },
          { status: 500 }
        );
      }

      userId = newUser.id;
    } else if (existingUser) {
      userId = existingUser.id;
    } else {
      return NextResponse.json(
        { error: 'Failed to get or create user' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      userId,
      message: 'Setup completed successfully'
    });

  } catch (error) {
    console.error('Error in setup:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 