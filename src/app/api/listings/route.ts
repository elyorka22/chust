import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { Listing } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json(
        { error: 'Database configuration not found' },
        { status: 500 }
      );
    }

    const supabase = createServerClient();

    let query = supabase
      .from('listings')
      .select(`
        *,
        category:categories(*),
        user:users(*)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (category) {
      query = query.eq('categories.slug', category);
    }

    const { data: listings, error } = await query
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    return NextResponse.json({
      listings: listings || [],
      total: listings?.length || 0
    });

  } catch (error) {
    console.error('Error fetching listings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.price || !body.contact_phone) {
      return NextResponse.json(
        { error: 'Missing required fields: title, price, contact_phone' },
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

    // Get category ID based on slug
    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', body.category)
      .single();

    if (!category) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      );
    }

    // Create the listing
    const { data: listing, error } = await supabase
      .from('listings')
      .insert({
        title: body.title,
        description: body.description,
        price: parseFloat(body.price),
        currency: body.currency,
        property_type: body.property_type,
        area: body.area ? parseFloat(body.area) : null,
        rooms: body.rooms ? parseInt(body.rooms) : null,
        floor: body.floor ? parseInt(body.floor) : null,
        total_floors: body.total_floors ? parseInt(body.total_floors) : null,
        address: `Lat: ${body.latitude}, Lng: ${body.longitude}`, // Use coordinates as address
        latitude: body.latitude || 40.9977, // Use selected coordinates or default
        longitude: body.longitude || 71.2374,
        contact_phone: body.contact_phone,
        contact_email: null, // No email field anymore
        category_id: category.id,
        user_id: 'a4207bec-8d62-4e6d-926e-f67a1b6f5ed6', // Use the created demo user ID
        is_active: true
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to create listing' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      listing,
      message: 'Listing created successfully'
    });

  } catch (error) {
    console.error('Error creating listing:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 