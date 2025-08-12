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

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // Проверяем, настроен ли Supabase
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.log('Using demo data - Supabase not configured');
      
      // Ищем объявление в демо-данных
      const demoListing = demoListings.find(listing => listing.id === parseInt(id));
      
      if (!demoListing) {
        return NextResponse.json(
          { error: 'Listing not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({ 
        data: demoListing,
        demo: true,
        message: 'Using demo data - Supabase not configured'
      });
    }

    // Используем Supabase
    const supabase = createServerClient();
    
    const { data, error } = await supabase
      .from('listings')
      .select(`
        *,
        user:users(id, first_name, last_name, phone, email),
        category:categories(*),
        images:listing_images(*)
      `)
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      
      if (error.code === 'PGRST116') {
        // Fallback на демо-данные при отсутствии записи
        const demoListing = demoListings.find(listing => listing.id === parseInt(id));
        
        if (demoListing) {
          return NextResponse.json({ 
            data: demoListing,
            demo: true,
            error: 'Supabase error, using demo data'
          });
        }
        
        return NextResponse.json(
          { error: 'Listing not found' },
          { status: 404 }
        );
      }
      
      // Fallback на демо-данные при ошибке
      const demoListing = demoListings.find(listing => listing.id === parseInt(id));
      
      if (demoListing) {
        return NextResponse.json({ 
          data: demoListing,
          demo: true,
          error: 'Supabase error, using demo data'
        });
      }
      
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      data: data || null,
      demo: false
    });
  } catch (error) {
    console.error('Error fetching listing:', error);
    
    // Fallback на демо-данные при любой ошибке
    try {
      const { id } = await context.params;
      const demoListing = demoListings.find(listing => listing.id === parseInt(id));
      
      if (demoListing) {
        return NextResponse.json({ 
          data: demoListing,
          demo: true,
          error: 'Server error, using demo data'
        });
      }
    } catch (fallbackError) {
      console.error('Fallback error:', fallbackError);
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 