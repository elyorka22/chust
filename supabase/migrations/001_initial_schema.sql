-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    telegram_id BIGINT UNIQUE NOT NULL,
    username VARCHAR(255),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create listings table
CREATE TABLE IF NOT EXISTS listings (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    property_type VARCHAR(100),
    area DECIMAL(8,2),
    rooms INTEGER,
    floor INTEGER,
    total_floors INTEGER,
    address TEXT,
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    contact_phone VARCHAR(20),
    contact_email VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create listing_images table
CREATE TABLE IF NOT EXISTS listing_images (
    id SERIAL PRIMARY KEY,
    listing_id INTEGER NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_telegram_id ON users(telegram_id);
CREATE INDEX IF NOT EXISTS idx_listings_user_id ON listings(user_id);
CREATE INDEX IF NOT EXISTS idx_listings_category_id ON listings(category_id);
CREATE INDEX IF NOT EXISTS idx_listings_is_active ON listings(is_active);
CREATE INDEX IF NOT EXISTS idx_listings_location ON listings(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_listing_images_listing_id ON listing_images(listing_id);

-- Insert initial categories
INSERT INTO categories (name, slug) VALUES 
    ('Аренда', 'rent'),
    ('Продажа', 'sale')
ON CONFLICT (slug) DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_listings_updated_at BEFORE UPDATE ON listings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_images ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Categories are viewable by everyone" ON categories
    FOR SELECT USING (true);

CREATE POLICY "Active listings are viewable by everyone" ON listings
    FOR SELECT USING (is_active = true);

CREATE POLICY "Listing images are viewable by everyone" ON listing_images
    FOR SELECT USING (true);

-- Create policies for authenticated users
CREATE POLICY "Users can view their own data" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can insert their own listings" ON listings
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own listings" ON listings
    FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert images for their listings" ON listing_images
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM listings 
            WHERE id = listing_id 
            AND user_id::text = auth.uid()::text
        )
    );

-- Create function to get listings with related data
CREATE OR REPLACE FUNCTION get_listings_with_details(
    p_category_slug VARCHAR DEFAULT NULL,
    p_limit INTEGER DEFAULT 50,
    p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
    id INTEGER,
    user_id UUID,
    category_id INTEGER,
    title VARCHAR,
    description TEXT,
    price DECIMAL,
    currency VARCHAR,
    property_type VARCHAR,
    area DECIMAL,
    rooms INTEGER,
    floor INTEGER,
    total_floors INTEGER,
    address TEXT,
    latitude DECIMAL,
    longitude DECIMAL,
    contact_phone VARCHAR,
    contact_email VARCHAR,
    is_active BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    user_first_name VARCHAR,
    user_last_name VARCHAR,
    user_phone VARCHAR,
    category_name VARCHAR,
    category_slug VARCHAR,
    primary_image_url VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        l.id,
        l.user_id,
        l.category_id,
        l.title,
        l.description,
        l.price,
        l.currency,
        l.property_type,
        l.area,
        l.rooms,
        l.floor,
        l.total_floors,
        l.address,
        l.latitude,
        l.longitude,
        l.contact_phone,
        l.contact_email,
        l.is_active,
        l.created_at,
        l.updated_at,
        u.first_name,
        u.last_name,
        u.phone,
        c.name,
        c.slug,
        li.image_url
    FROM listings l
    LEFT JOIN users u ON l.user_id = u.id
    LEFT JOIN categories c ON l.category_id = c.id
    LEFT JOIN listing_images li ON l.id = li.listing_id AND li.is_primary = true
    WHERE l.is_active = true
    AND (p_category_slug IS NULL OR c.slug = p_category_slug)
    ORDER BY l.created_at DESC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$ LANGUAGE plpgsql; 