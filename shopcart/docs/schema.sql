-- ============================================================
--  ShopKart E-Commerce — MySQL Schema
--  Run this script OR let Spring Boot auto-create via ddl-auto=update
-- ============================================================

CREATE DATABASE IF NOT EXISTS shopkart_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE shopkart_db;

-- ── Users ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(255) NOT NULL,
  email       VARCHAR(255) NOT NULL UNIQUE,
  password    VARCHAR(255) NOT NULL,
  phone       VARCHAR(20),
  role        ENUM('USER','SELLER','ADMIN') NOT NULL DEFAULT 'USER',
  is_active   TINYINT(1) NOT NULL DEFAULT 1,
  created_at  DATETIME,
  updated_at  DATETIME,
  INDEX idx_users_email (email),
  INDEX idx_users_role  (role)
);

-- ── Categories ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  image_url   VARCHAR(500)
);

-- ── Products ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id               BIGINT AUTO_INCREMENT PRIMARY KEY,
  name             VARCHAR(500) NOT NULL,
  description      TEXT,
  price            DECIMAL(10,2) NOT NULL,
  original_price   DECIMAL(10,2),
  stock            INT NOT NULL DEFAULT 0,
  rating           DOUBLE DEFAULT 0.0,
  review_count     INT DEFAULT 0,
  category_id      BIGINT,
  seller_id        BIGINT NOT NULL,
  approval_status  ENUM('PENDING','APPROVED','REJECTED') NOT NULL DEFAULT 'PENDING',
  is_featured      TINYINT(1) DEFAULT 0,
  is_active        TINYINT(1) DEFAULT 1,
  created_at       DATETIME,
  updated_at       DATETIME,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  FOREIGN KEY (seller_id)   REFERENCES users(id)      ON DELETE CASCADE,
  INDEX idx_products_category  (category_id),
  INDEX idx_products_seller    (seller_id),
  INDEX idx_products_approval  (approval_status),
  INDEX idx_products_featured  (is_featured),
  FULLTEXT INDEX ft_products_name_desc (name, description)
);

-- ── Product Images ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS product_images (
  product_id  BIGINT NOT NULL,
  image_url   VARCHAR(500),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ── Carts ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS carts (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id     BIGINT NOT NULL UNIQUE,
  updated_at  DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ── Cart Items ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cart_items (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  cart_id     BIGINT NOT NULL,
  product_id  BIGINT NOT NULL,
  quantity    INT NOT NULL DEFAULT 1,
  price       DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (cart_id)    REFERENCES carts(id)    ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY uq_cart_product (cart_id, product_id)
);

-- ── Orders ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id                      BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id                 BIGINT NOT NULL,
  order_status            ENUM('PAYMENT_PENDING','CONFIRMED','PROCESSING','SHIPPED','DELIVERED','CANCELLED')
                            NOT NULL DEFAULT 'PAYMENT_PENDING',
  payment_method          ENUM('COD','UPI') NOT NULL,
  payment_status          ENUM('PENDING','VERIFIED','REJECTED') NOT NULL DEFAULT 'PENDING',
  transaction_id          VARCHAR(255),
  payment_screenshot_url  VARCHAR(500),
  total_amount            DECIMAL(10,2) NOT NULL,
  delivery_charge         DECIMAL(10,2) DEFAULT 0,
  -- Embedded delivery address
  full_name               VARCHAR(255),
  phone                   VARCHAR(20),
  address_line1           VARCHAR(500),
  address_line2           VARCHAR(500),
  city                    VARCHAR(100),
  state                   VARCHAR(100),
  pincode                 VARCHAR(10),
  country                 VARCHAR(100),
  admin_note              TEXT,
  created_at              DATETIME,
  updated_at              DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_orders_user           (user_id),
  INDEX idx_orders_status         (order_status),
  INDEX idx_orders_payment_status (payment_status),
  INDEX idx_orders_created        (created_at)
);

-- ── Order Items ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_items (
  id             BIGINT AUTO_INCREMENT PRIMARY KEY,
  order_id       BIGINT NOT NULL,
  product_id     BIGINT,
  product_name   VARCHAR(500) NOT NULL,
  seller_name    VARCHAR(255),
  image_url      VARCHAR(500),
  quantity       INT NOT NULL,
  price          DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  FOREIGN KEY (order_id)   REFERENCES orders(id)   ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

-- ── Seller Subscriptions ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS seller_subscriptions (
  id              BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id         BIGINT NOT NULL,
  transaction_id  VARCHAR(255) NOT NULL,
  screenshot_url  VARCHAR(500),
  amount          DECIMAL(8,2) NOT NULL DEFAULT 399.00,
  status          ENUM('PENDING','APPROVED','REJECTED') NOT NULL DEFAULT 'PENDING',
  admin_note      TEXT,
  approved_by     VARCHAR(255),
  approved_at     DATETIME,
  created_at      DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_subscriptions_user   (user_id),
  INDEX idx_subscriptions_status (status)
);

-- ── Seed: Admin User ──────────────────────────────────────────────
-- Password: admin123 (BCrypt encoded)
INSERT IGNORE INTO users (name, email, password, role, is_active, created_at, updated_at)
VALUES (
  'Admin',
  'admin@shopkart.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  'ADMIN',
  1,
  NOW(),
  NOW()
);

-- ── Seed: Default Categories ──────────────────────────────────────
INSERT IGNORE INTO categories (name) VALUES
  ('Electronics'),
  ('Fashion'),
  ('Home & Furniture'),
  ('Books'),
  ('Sports & Fitness'),
  ('Toys & Games'),
  ('Beauty & Personal Care'),
  ('Grocery'),
  ('Mobiles'),
  ('Appliances');
