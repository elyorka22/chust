import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

// Демо-данные для fallback
const demoListings = [
  {
    id: 1,
    user_id: '1',
    category_id: 1,
    title: 'Уютная 2-комнатная квартира в центре',
    description: 'Современная квартира с ремонтом, мебелью и техникой',
    price: 500,
    currency: 'USD',
    property_type: 'Квартира',
    area: 65,
    rooms: 2,
    floor: 3,
    total_floors: 5,
    address: 'ул. Навои, 15',
    latitude: 40.9977,
    longitude: 71.2374,
    contact_phone: '+998 90 123 45 67',
    contact_email: 'owner1@example.com',
    is_active: true,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    category: { id: 1, name: 'Аренда', slug: 'rent' },
    user: { id: '1', telegram_id: 123456789, first_name: 'Алишер', last_name: 'Каримов', phone: '+998 90 123 45 67', email: 'owner1@example.com', is_verified: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' }
  },
  {
    id: 2,
    user_id: '2',
    category_id: 2,
    title: 'Дом с участком в тихом районе',
    description: 'Просторный дом с большим участком, гаражом и садом',
    price: 85000,
    currency: 'USD',
    property_type: 'Дом',
    area: 120,
    rooms: 4,
    floor: 1,
    total_floors: 1,
    address: 'ул. Мирзо Улугбека, 45',
    latitude: 40.9985,
    longitude: 71.2360,
    contact_phone: '+998 90 987 65 43',
    contact_email: 'owner2@example.com',
    is_active: true,
    created_at: '2024-01-14T14:30:00Z',
    updated_at: '2024-01-14T14:30:00Z',
    category: { id: 2, name: 'Продажа', slug: 'sale' },
    user: { id: '2', telegram_id: 987654321, first_name: 'Мадина', last_name: 'Ахмедова', phone: '+998 90 987 65 43', email: 'owner2@example.com', is_verified: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' }
  },
  {
    id: 3,
    user_id: '3',
    category_id: 1,
    title: '1-комнатная квартира для студентов',
    description: 'Компактная квартира рядом с университетом',
    price: 300,
    currency: 'USD',
    property_type: 'Квартира',
    area: 35,
    rooms: 1,
    floor: 2,
    total_floors: 4,
    address: 'ул. Алишера Навои, 78',
    latitude: 40.9965,
    longitude: 71.2385,
    contact_phone: '+998 90 555 12 34',
    contact_email: 'owner3@example.com',
    is_active: true,
    created_at: '2024-01-13T09:15:00Z',
    updated_at: '2024-01-13T09:15:00Z',
    category: { id: 1, name: 'Аренда', slug: 'rent' },
    user: { id: '3', telegram_id: 555666777, first_name: 'Дилшод', last_name: 'Рахимов', phone: '+998 90 555 12 34', email: 'owner3@example.com', is_verified: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' }
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Проверяем, настроен ли Supabase
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.log('Using demo data - Supabase not configured');
      
      // Фильтруем демо-данные по категории
      let filteredListings = demoListings;
      if (category) {
        filteredListings = demoListings.filter(listing => listing.category.slug === category);
      }
      
      return NextResponse.json({ 
        data: filteredListings,
        demo: true,
        message: 'Using demo data - Supabase not configured'
      });
    }

    // Используем Supabase
    const supabase = createServerClient();
    
    let query = supabase
      .from('listings')
      .select(`
        *,
        user:users(id, first_name, last_name, phone, email),
        category:categories(*),
        images:listing_images(*)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (category) {
      query = query.eq('category.slug', category);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      // Fallback на демо-данные при ошибке
      let filteredListings = demoListings;
      if (category) {
        filteredListings = demoListings.filter(listing => listing.category.slug === category);
      }
      
      return NextResponse.json({ 
        data: filteredListings,
        demo: true,
        error: 'Supabase error, using demo data'
      });
    }

    return NextResponse.json({ 
      data: data || [],
      demo: false
    });
  } catch (error) {
    console.error('Error fetching listings:', error);
    
    // Fallback на демо-данные при любой ошибке
    let filteredListings = demoListings;
    const category = new URL(request.url).searchParams.get('category');
    if (category) {
      filteredListings = demoListings.filter(listing => listing.category.slug === category);
    }
    
    return NextResponse.json({ 
      data: filteredListings,
      demo: true,
      error: 'Server error, using demo data'
    });
  }
} 