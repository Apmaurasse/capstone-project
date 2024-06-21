-- Drop tables if they already exist to ensure a clean slate
DROP TABLE IF EXISTS UserLikes;
DROP TABLE IF EXISTS UserCollections;
DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS CardBacks;

-- Create the Users table
CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_admin BOOLEAN DEFAULT FALSE
);

-- Create the CardBacks table
CREATE TABLE CardBacks (
    id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    text TEXT,
    image_url VARCHAR(255) NOT NULL,
    sort_category INT NOT NULL,
    slug VARCHAR(100) NOT NULL
);

-- Create the UserLikes table
CREATE TABLE UserLikes (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    card_back_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (card_back_id) REFERENCES CardBacks(id) ON DELETE CASCADE,
    UNIQUE(user_id, card_back_id)
);

-- Create the UserCollections table
CREATE TABLE UserCollections (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    card_back_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (card_back_id) REFERENCES CardBacks(id) ON DELETE CASCADE,
    UNIQUE(user_id, card_back_id)
);