import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

// Demo data for fallback
const demoListings = [
  {
    id: 1,
    user_id: '1',
    category_id: 1,
    title: 'Markazdagi 2 xonali kvartira',
    description: 'Zamonaviy jihozlangan va mebellangan kvartira',
    price: 500,
    currency: 'USD',
    property_type: 'Kvartira',
    area: 65,
    rooms: 2,
    floor: 3,
    total_floors: 5,
    address: 'Navoiy ko\'chasi, 15',
    latitude: 40.9977,
    longitude: 71.2374,
    contact_phone: '+998 90 123 45 67',
    contact_email: 'owner1@example.com',
    is_active: true,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    category: { id: 1, name: 'Ijara', slug: 'rent', created_at: '2024-01-01T00:00:00Z' },
    user: { id: '1', telegram_id: 123456789, first_name: 'Alisher', last_name: 'Karimov', phone: '+998 90 123 45 67', email: 'owner1@example.com', is_verified: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' }
  },
  {
    id: 2,
    user_id: '2',
    category_id: 2,
    title: 'Hovli va bog\'li uy',
    description: 'Katta hovli va garajli uy, bog\' bilan',
    price: 85000,
    currency: 'USD',
    property_type: 'Uy',
    area: 120,
    rooms: 4,
    floor: 1,
    total_floors: 1,
    address: 'Mirzo Ulug\'bek ko\'chasi, 45',
    latitude: 40.9985,
    longitude: 71.2360,
    contact_phone: '+998 90 987 65 43',
    contact_email: 'owner2@example.com',
    is_active: true,
    created_at: '2024-01-14T14:30:00Z',
    updated_at: '2024-01-14T14:30:00Z',
    category: { id: 2, name: 'Sotish', slug: 'sale', created_at: '2024-01-01T00:00:00Z' },
    user: { id: '2', telegram_id: 987654321, first_name: 'Madina', last_name: 'Axmedova', phone: '+998 90 987 65 43', email: 'owner2@example.com', is_verified: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' }
  },
  {
    id: 3,
    user_id: '3',
    category_id: 1,
    title: 'Talabalar uchun 1 xonali kvartira',
    description: 'Universitet yonida joylashgan ixcham kvartira',
    price: 300,
    currency: 'USD',
    property_type: 'Kvartira',
    area: 35,
    rooms: 1,
    floor: 2,
    total_floors: 4,
    address: 'Alisher Navoiy ko\'chasi, 78',
    latitude: 40.9965,
    longitude: 71.2385,
    contact_phone: '+998 90 555 12 34',
    contact_email: 'owner3@example.com',
    is_active: true,
    created_at: '2024-01-13T09:15:00Z',
    updated_at: '2024-01-13T09:15:00Z',
    category: { id: 1, name: 'Ijara', slug: 'rent', created_at: '2024-01-01T00:00:00Z' },
    user: { id: '3', telegram_id: 555666777, first_name: 'Dilshod', last_name: 'Raximov', phone: '+998 90 555 12 34', email: 'owner3@example.com', is_verified: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' }
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.warn('Supabase environment variables not found, using demo data');
      
      let filteredListings = demoListings;
      if (category) {
        filteredListings = demoListings.filter(listing => listing.category.slug === category);
      }
      
      return NextResponse.json({
        listings: filteredListings.slice(offset, offset + limit),
        total: filteredListings.length
      });
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
      console.warn('Supabase environment variables not found, using demo mode');
      
      // In demo mode, just return success
      const newListing = {
        id: Math.floor(Math.random() * 10000) + 1000,
        ...body,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        latitude: 40.9977, // Default Chust coordinates
        longitude: 71.2374,
        user_id: 'demo_user',
        category_id: body.category === 'rent' ? 1 : 2
      };
      
      return NextResponse.json({
        success: true,
        listing: newListing,
        message: 'Demo mode: Listing would be saved in production'
      });
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
        user_id: 'demo_user', // TODO: Get from authenticated user
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