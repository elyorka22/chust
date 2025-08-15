import { createClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';

// Получаем переменные окружения
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Проверяем, что переменные окружения установлены
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase environment variables are required');
}

// Browser client для клиентской стороны
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

// Server client для API маршрутов
export const createServerClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey);
};

// Типы для базы данных
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          telegram_id: number;
          username?: string;
          first_name?: string;
          last_name?: string;
          phone?: string;
          email?: string;
          is_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          telegram_id: number;
          username?: string;
          first_name?: string;
          last_name?: string;
          phone?: string;
          email?: string;
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          telegram_id?: number;
          username?: string;
          first_name?: string;
          last_name?: string;
          phone?: string;
          email?: string;
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: number;
          name: string;
          slug: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          slug: string;
          created_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          slug?: string;
          created_at?: string;
        };
      };
      listings: {
        Row: {
          id: number;
          user_id: string;
          category_id: number;
          title: string;
          description?: string;
          price?: number;
          currency: string;
          property_type?: string;
          area?: number;
          rooms?: number;
          floor?: number;
          total_floors?: number;
          address?: string;
          latitude: number;
          longitude: number;
          contact_phone?: string;
          contact_email?: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          category_id: number;
          title: string;
          description?: string;
          price?: number;
          currency?: string;
          property_type?: string;
          area?: number;
          rooms?: number;
          floor?: number;
          total_floors?: number;
          address?: string;
          latitude: number;
          longitude: number;
          contact_phone?: string;
          contact_email?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          user_id?: string;
          category_id?: number;
          title?: string;
          description?: string;
          price?: number;
          currency?: string;
          property_type?: string;
          area?: number;
          rooms?: number;
          floor?: number;
          total_floors?: number;
          address?: string;
          latitude?: number;
          longitude?: number;
          contact_phone?: string;
          contact_email?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      listing_images: {
        Row: {
          id: number;
          listing_id: number;
          image_url: string;
          is_primary: boolean;
          created_at: string;
        };
        Insert: {
          id?: number;
          listing_id: number;
          image_url: string;
          is_primary?: boolean;
          created_at?: string;
        };
        Update: {
          id?: number;
          listing_id?: number;
          image_url?: string;
          is_primary?: boolean;
          created_at?: string;
        };
      };
    };
  };
}; 