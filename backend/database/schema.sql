-- Database schema for Tampa Blades
-- Compatible with PostgreSQL (for production) and SQLite (for development)

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    verified BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date VARCHAR(50),
    start_time VARCHAR(50),
    end_time VARCHAR(50),
    location VARCHAR(255),
    event_type VARCHAR(100),
    skill_level VARCHAR(100),
    max_participants INTEGER,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    cost VARCHAR(100),
    equipment TEXT,
    event_photo VARCHAR(500),
    approved BOOLEAN DEFAULT false,
    submitted_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL,
    receiver_id INTEGER NOT NULL,
    message TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read BOOLEAN DEFAULT false,
    FOREIGN KEY (sender_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Skate spots table
CREATE TABLE IF NOT EXISTS skate_spots (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    difficulty VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    description TEXT,
    features TEXT,
    hours VARCHAR(100),
    rating DECIMAL(3, 2) DEFAULT 0,
    reviews INTEGER DEFAULT 0,
    crowd_level VARCHAR(50) DEFAULT 'medium',
    photos TEXT,
    submitted_by INTEGER,
    approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    google_places_id VARCHAR(255),
    weather_data TEXT,
    amenities TEXT,
    surface_type VARCHAR(100),
    FOREIGN KEY (submitted_by) REFERENCES users (id) ON DELETE SET NULL
);

-- Spot photos table
CREATE TABLE IF NOT EXISTS spot_photos (
    id SERIAL PRIMARY KEY,
    spot_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    photo_url VARCHAR(500) NOT NULL,
    caption TEXT,
    source VARCHAR(100) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (spot_id) REFERENCES skate_spots (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Gallery photos table
CREATE TABLE IF NOT EXISTS gallery_photos (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    photo_url VARCHAR(500) NOT NULL,
    caption TEXT,
    category VARCHAR(100) DEFAULT 'general',
    tags TEXT,
    location VARCHAR(255),
    is_public BOOLEAN DEFAULT true,
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Photo likes table
CREATE TABLE IF NOT EXISTS photo_likes (
    id SERIAL PRIMARY KEY,
    photo_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (photo_id) REFERENCES gallery_photos (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    UNIQUE(photo_id, user_id)
);

-- Spot reviews table
CREATE TABLE IF NOT EXISTS spot_reviews (
    id SERIAL PRIMARY KEY,
    spot_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (spot_id) REFERENCES skate_spots (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    UNIQUE(spot_id, user_id)
);

-- Admin logs table
CREATE TABLE IF NOT EXISTS admin_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    action VARCHAR(255) NOT NULL,
    details TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_approved ON events(approved);
CREATE INDEX IF NOT EXISTS idx_skate_spots_location ON skate_spots(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_skate_spots_approved ON skate_spots(approved);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_gallery_user ON gallery_photos(user_id);
CREATE INDEX IF NOT EXISTS idx_gallery_public ON gallery_photos(is_public);