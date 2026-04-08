-- ============================================================
--  StockBoard Dealer — MySQL Schema  (v4.0 — Stock Settings)
--  Includes: all 50 products, 3 months of realistic sales data,
--            configurable stock threshold settings table.
--  DROP & re-run this file to reset the database cleanly.
--  Compatible with MySQL 5.7+ / MariaDB 10.3+
--  Current date context: 2026-04-02
-- ============================================================

CREATE DATABASE IF NOT EXISTS stockboard_dealer
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE stockboard_dealer;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS sale_items;
DROP TABLE IF EXISTS sales;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS stock_settings;
SET FOREIGN_KEY_CHECKS = 1;

-- --------------------------------------------------------
-- 1. users
-- --------------------------------------------------------
CREATE TABLE users (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username   VARCHAR(80)  NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,           -- bcrypt hash
  full_name  VARCHAR(150) NOT NULL,
  role       ENUM('Admin') NOT NULL DEFAULT 'Admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- --------------------------------------------------------
-- 2. categories
-- --------------------------------------------------------
CREATE TABLE categories (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100) NOT NULL UNIQUE,
  description VARCHAR(255)
) ENGINE=InnoDB;

-- --------------------------------------------------------
-- 3. products  (laminated board catalogue)
-- --------------------------------------------------------
CREATE TABLE products (
  id                  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  board_type          VARCHAR(200) NOT NULL,
  category_id         INT UNSIGNED NOT NULL,
  thickness           VARCHAR(50)  DEFAULT '',
  size                VARCHAR(50)  DEFAULT '',
  color_design        VARCHAR(100) DEFAULT '',
  unit                VARCHAR(20)  NOT NULL DEFAULT 'pcs',
  cost_price          DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  selling_price       DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  current_stock       INT NOT NULL DEFAULT 0,
  low_stock_threshold INT NOT NULL DEFAULT 5,
  created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_product_cat FOREIGN KEY (category_id)
    REFERENCES categories(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- --------------------------------------------------------
-- 4. sales  (transaction header)
-- --------------------------------------------------------
CREATE TABLE sales (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id      INT UNSIGNED NOT NULL,
  invoice_no   VARCHAR(50) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  notes        VARCHAR(255),
  sale_date    DATE NOT NULL,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_sale_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- --------------------------------------------------------
-- 5. sale_items  (line items)
-- --------------------------------------------------------
CREATE TABLE sale_items (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  sale_id        INT UNSIGNED NOT NULL,
  product_id     INT UNSIGNED NOT NULL,
  quantity       INT NOT NULL,
  price_per_unit DECIMAL(10,2) NOT NULL,
  total          DECIMAL(10,2) NOT NULL,
  CONSTRAINT fk_si_sale    FOREIGN KEY (sale_id)    REFERENCES sales(id)    ON DELETE CASCADE  ON UPDATE CASCADE,
  CONSTRAINT fk_si_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ============================================================
--  SEED DATA
-- ============================================================

-- ── Users ────────────────────────────────────────────────────────
--   admin password = 'admin123'
INSERT INTO users (username, password, full_name, role) VALUES
  ('admin', '$2y$12$7OiZOzmS1BJPjnN7lUZkJ.OVSgI8eQvbHfYQCU.E5XTsmPStZnGfO', 'Admin User', 'Admin');

-- ── Categories ────────────────────────────────────────────────────
INSERT INTO categories (name, description) VALUES
  ('11PLY SOLID MARINE',  'Solid marine plywood — ₱2,250'),        -- id=1
  ('COMPACT MARINE',      'Compact marine boards — ₱2,000'),        -- id=2
  ('LAMINATED PLYBOARD',  'Standard laminated plyboard — ₱1,950'), -- id=3
  ('PETG HIGH GLOSS',      'Glossy/Matte finishes — ₱3,500'),        -- id=4
  ('UV GLOSS',            'UV Gloss surfaces — ₱3,000'),            -- id=5
  ('UV MARBLE',           'UV Marble surfaces — ₱3,100'),           -- id=6
  ('6MM BACKING',         '6mm backing boards — ₱1,100'),           -- id=7
  ('EDGEBAND',            'Regular edgebands — ₱17/meter'),         -- id=8
  ('EDGEBAND GLOSS',      'Gloss edgebands (PETG/UV) — ₱23/meter'); -- id=9

-- ── Products ─────────────────────────────────────────────────────
-- Format: board_type = product code, color_design = color name
INSERT INTO products (board_type, category_id, thickness, size, color_design, cost_price, selling_price, current_stock, low_stock_threshold, unit) VALUES

  -- 🟫 11PLY SOLID MARINE — ₱2,250 (cat=1, 20 items)
  ('1-023', 1, '18mm', '4''×8''', 'Yellow Birch',   1800.00, 2250.00, 50, 5, 'pcs'),
  ('1-031', 1, '18mm', '4''×8''', 'Maridon Oak',    1800.00, 2250.00, 50, 5, 'pcs'),
  ('1-009', 1, '18mm', '4''×8''', 'Golden Oak',     1800.00, 2250.00, 50, 5, 'pcs'),
  ('1-000', 1, '18mm', '4''×8''', 'Real White',     1800.00, 2250.00, 50, 5, 'pcs'),
  ('1-001', 1, '18mm', '4''×8''', 'Warm White',     1800.00, 2250.00, 50, 5, 'pcs'),
  ('1-017', 1, '18mm', '4''×8''', 'Macassar',       1800.00, 2250.00, 50, 5, 'pcs'),
  ('1-015', 1, '18mm', '4''×8''', 'Gray Oak',       1800.00, 2250.00, 50, 5, 'pcs'),
  ('1-033', 1, '18mm', '4''×8''', 'Fabric Cream',   1800.00, 2250.00, 50, 5, 'pcs'),
  ('1-039', 1, '18mm', '4''×8''', 'Dark Metallic',  1800.00, 2250.00, 50, 5, 'pcs'),
  ('1-014', 1, '18mm', '4''×8''', 'Gray Stone',     1800.00, 2250.00, 50, 5, 'pcs'),
  ('1-016', 1, '18mm', '4''×8''', 'Silver Ash',     1800.00, 2250.00, 50, 5, 'pcs'),
  ('1-034', 1, '18mm', '4''×8''', 'Metallic Dark',  1800.00, 2250.00, 50, 5, 'pcs'),
  ('1-041', 1, '18mm', '4''×8''', 'Wild Cherry',    1800.00, 2250.00, 50, 5, 'pcs'),
  ('1-021', 1, '18mm', '4''×8''', 'Walnut Gray',    1800.00, 2250.00, 50, 5, 'pcs'),
  ('1-046', 1, '18mm', '4''×8''', 'Natural Oak',    1800.00, 2250.00, 50, 5, 'pcs'),
  ('1-048', 1, '18mm', '4''×8''', 'Light Acacia',   1800.00, 2250.00, 50, 5, 'pcs'),
  ('1-045', 1, '18mm', '4''×8''', 'Beige',          1800.00, 2250.00, 50, 5, 'pcs'),
  ('1-047', 1, '18mm', '4''×8''', 'Fabric Gray',    1800.00, 2250.00, 50, 5, 'pcs'),
  ('1-044', 1, '18mm', '4''×8''', 'Silver Gray',    1800.00, 2250.00, 50, 5, 'pcs'),
  ('1-043', 1, '18mm', '4''×8''', 'Dark Acacia',    1800.00, 2250.00, 50, 5, 'pcs'),

  -- 🟫 COMPACT MARINE — ₱2,000 (cat=2, 9 items)
  ('2-025', 2, '18mm', '4''×8''', 'Brown Walnut',   1600.00, 2000.00, 50, 5, 'pcs'),
  ('2-023', 2, '18mm', '4''×8''', 'Yellow Birch',   1600.00, 2000.00, 50, 5, 'pcs'),
  ('2-017', 2, '18mm', '4''×8''', 'Macassar',       1600.00, 2000.00, 50, 5, 'pcs'),
  ('2-041', 2, '18mm', '4''×8''', 'Wild Cherry',    1600.00, 2000.00, 50, 5, 'pcs'),
  ('2-022', 2, '18mm', '4''×8''', 'Serpent',        1600.00, 2000.00, 50, 5, 'pcs'),
  ('2-021', 2, '18mm', '4''×8''', 'Walnut Gray',    1600.00, 2000.00, 50, 5, 'pcs'),
  ('2-001', 2, '18mm', '4''×8''', 'Warm White',     1600.00, 2000.00, 50, 5, 'pcs'),
  ('2-000', 2, '18mm', '4''×8''', 'Real White',     1600.00, 2000.00, 50, 5, 'pcs'),
  ('2-024', 2, '18mm', '4''×8''', 'Gray Birch',     1600.00, 2000.00, 50, 5, 'pcs'),

  -- 🟫 LAMINATED PLYBOARD — ₱1,950 (cat=3, 5 items)
  ('B-005', 3, '18mm', '4''×8''', 'Shadow Oak',     1560.00, 1950.00, 50, 5, 'pcs'),
  ('B-001', 3, '18mm', '4''×8''', 'Warm White',     1560.00, 1950.00, 50, 5, 'pcs'),
  ('B-006', 3, '18mm', '4''×8''', 'Charcoal Gray',  1560.00, 1950.00, 50, 5, 'pcs'),
  ('B-027', 3, '18mm', '4''×8''', 'Lumenteak',      1560.00, 1950.00, 50, 5, 'pcs'),
  ('B-000', 3, '18mm', '4''×8''', 'Real White',     1560.00, 1950.00, 50, 5, 'pcs'),

  -- 🟫 PETG HIGH GLOSS — ₱3,500 (cat=4, 6 items)
  ('009H',  4, '18mm', '4''×8''', 'Olive Green',    2800.00, 3500.00, 50, 5, 'pcs'),
  ('003H',  4, '18mm', '4''×8''', 'Light Gray',     2800.00, 3500.00, 50, 5, 'pcs'),
  ('001H',  4, '18mm', '4''×8''', 'White Glossy',   2800.00, 3500.00, 50, 5, 'pcs'),
  ('006H',  4, '18mm', '4''×8''', 'Mocha',          2800.00, 3500.00, 50, 5, 'pcs'),
  ('012H',  4, '18mm', '4''×8''', 'Dark Gray',      2800.00, 3500.00, 50, 5, 'pcs'),
  ('005H',  4, '18mm', '4''×8''', 'Light Blue',     2800.00, 3500.00, 50, 5, 'pcs'),

  -- 🟫 UV GLOSS — ₱3,000 (cat=5, 1 item)
  ('UV-040', 5, '18mm', '4''×8''', 'White Gloss',   2400.00, 3000.00, 50, 5, 'pcs'),

  -- 🟫 UV MARBLE — ₱3,100 (cat=6, 1 item)
  ('042',   6, '18mm', '4''×8''', 'Marble',         2480.00, 3100.00, 50, 5, 'pcs'),

  -- 🟫 6MM BACKING — ₱1,100 (cat=7, 8 items)
  ('000',   7, '6mm',  '4''×8''', 'Real White',      880.00, 1100.00, 50, 5, 'pcs'),
  ('001',   7, '6mm',  '4''×8''', 'Warm White',      880.00, 1100.00, 50, 5, 'pcs'),
  ('034',   7, '6mm',  '4''×8''', 'Light Metallic',  880.00, 1100.00, 50, 5, 'pcs'),
  ('015',   7, '6mm',  '4''×8''', 'Gray Oak',        880.00, 1100.00, 50, 5, 'pcs'),
  ('033',   7, '6mm',  '4''×8''', 'Fabric',          880.00, 1100.00, 50, 5, 'pcs'),
  ('023',   7, '6mm',  '4''×8''', 'Yellow Birch',    880.00, 1100.00, 50, 5, 'pcs'),
  ('016',   7, '6mm',  '4''×8''', 'Silver Ash',      880.00, 1100.00, 50, 5, 'pcs'),
  ('014',   7, '6mm',  '4''×8''', 'Gray Stone',      880.00, 1100.00, 50, 5, 'pcs');

-- ============================================================
--  3 MONTHS OF REALISTIC SALES DATA (Jan–Mar 2026)
--  ~150 transactions, realistic product mix & seasonality
--  Product IDs (by insertion order):
--   1-20  = 11PLY SOLID MARINE  (₱2,250)
--   21-29 = COMPACT MARINE      (₱2,000)
--   30-34 = LAMINATED PLYBOARD  (₱1,950)
--   35-40 = PETG HIGH GLOSS      (₱3,500)
--   41    = UV GLOSS             (₱3,000)
--   42    = UV MARBLE            (₱3,100)
--   43-50 = 6MM BACKING         (₱1,100)
-- ============================================================

-- ── JANUARY 2026 ─────────────────────────────────────────────────
INSERT INTO sales (user_id, invoice_no, total_amount, notes, sale_date) VALUES
  (1, 'INV-MOCK', 22500.00, 'Walk-in bulk order',         '2026-01-03'),
  (1, 'INV-MOCK', 11250.00, 'Contractor purchase',         '2026-01-04'),
  (1, 'INV-MOCK', 8000.00, 'Contractor purchase',         '2026-01-05'),
  (1, 'INV-MOCK', 16000.00, 'Store purchase',              '2026-01-06'),
  (1, 'INV-MOCK', 9750.00, 'Wholesale order',             '2026-01-07'),
  (1, 'INV-MOCK', 14000.00, 'Walk-in customer',            '2026-01-09'),
  (1, 'INV-MOCK', 21000.00, 'Bulk cabinet maker order',    '2026-01-10'),
  (1, 'INV-MOCK', 7000.00, 'Store purchase',              '2026-01-11'),
  (1, 'INV-MOCK', 13500.00, 'Contractor purchase',         '2026-01-12'),
  (1, 'INV-MOCK', 18000.00, 'Interior designer order',     '2026-01-13'),
  (1, 'INV-MOCK', 11200.00, 'Walk-in customer',            '2026-01-14'),
  (1, 'INV-MOCK', 15750.00, 'Contractor purchase',         '2026-01-16'),
  (1, 'INV-MOCK', 6200.00, 'Store purchase',              '2026-01-17'),
  (1, 'INV-MOCK', 24500.00, 'Bulk wholesale',              '2026-01-18'),
  (1, 'INV-MOCK', 10400.00, 'Walk-in customer',            '2026-01-19'),
  (1, 'INV-MOCK', 19500.00, 'Contractor bulk order',       '2026-01-20'),
  (1, 'INV-MOCK', 8800.00, 'Store purchase',              '2026-01-21'),
  (1, 'INV-MOCK', 12600.00, 'Contractor purchase',         '2026-01-23'),
  (1, 'INV-MOCK', 7700.00, 'Walk-in customer',            '2026-01-24'),
  (1, 'INV-MOCK', 17500.00, 'Interior designer order',     '2026-01-25'),
  (1, 'INV-MOCK', 22000.00, 'Bulk cabinet maker order',    '2026-01-26'),
  (1, 'INV-MOCK', 9000.00, 'Walk-in customer',            '2026-01-27'),
  (1, 'INV-MOCK', 14250.00, 'Contractor purchase',         '2026-01-28'),
  (1, 'INV-MOCK', 11550.00, 'Store purchase',              '2026-01-29'),
  (1, 'INV-MOCK', 31500.00, 'End-of-month bulk order',     '2026-01-30'),
  (1, 'INV-MOCK', 13000.00, 'Contractor purchase',         '2026-01-31');

-- Sale items — January
INSERT INTO sale_items (sale_id, product_id, quantity, price_per_unit, total) VALUES
  -- Sale 1 (22500): 10× 1-023 Yellow Birch @2250
  (1, 1, 10, 2250.00, 22500.00),
  -- Sale 2 (11250): 5× 1-031 Maridon Oak @2250
  (2, 2, 5, 2250.00, 11250.00),
  -- Sale 3 (8000): 4× 2-025 Brown Walnut @2000
  (3, 21, 4, 2000.00, 8000.00),
  -- Sale 4 (16000): 8× 2-023 Yellow Birch @2000
  (4, 22, 8, 2000.00, 16000.00),
  -- Sale 5 (9750): 3× 1-009 Golden Oak @2250, 1× 2-017 Macassar @2000, 500 spare
  (5, 3, 3, 2250.00, 6750.00),
  (5, 23, 1, 2000.00, 2000.00),
  (5, 43, 1, 1100.00, 1100.00),
  -- Sale 6 (14000): 4× 2-021 Walnut Gray @2000, 2× B-005 @1950, 1100 spare
  (6, 26, 4, 2000.00, 8000.00),
  (6, 30, 3, 1950.00, 5850.00),
  -- Sale 7 (21000): 6× 1-000 Real White @2250, 3× 2-000 @2000
  (7, 4, 6, 2250.00, 13500.00),
  (7, 28, 3, 2000.00, 6000.00),
  (7, 44, 1, 1100.00, 1100.00),
  -- Sale 8 (7000): 2× 2-022 Serpent @2000, 3× 6MM 000 @1100
  (8, 25, 2, 2000.00, 4000.00),
  (8, 43, 2, 1100.00, 2200.00),
  (8, 44, 1, 1100.00,  800.00),
  -- Sale 9 (13500): 6× 1-001 Warm White @2250
  (9, 5, 6, 2250.00, 13500.00),
  -- Sale 10 (18000): 2× 001H White Glossy @3500, 2× UV-040 White Gloss @3000, 2× 042 Marble @3100, 1×300
  (10, 37, 2, 3500.00, 7000.00),
  (10, 41, 2, 3000.00, 6000.00),
  (10, 42, 1, 3100.00, 3100.00),
  (10, 43, 1, 1100.00, 1100.00),
  -- Sale 11 (11200): 4× 2-024 Gray Birch @2000, 2× B-001 Warm White @1950, 100 spare
  (11, 29, 4, 2000.00, 8000.00),
  (11, 31, 1, 1950.00, 1950.00),
  (11, 45, 1, 1100.00, 1100.00),
  -- Sale 12 (15750): 7× 1-017 Macassar @2250
  (12, 6, 7, 2250.00, 15750.00),
  -- Sale 13 (6200): 2× B-006 Charcoal Gray @1950, 2× 6MM 015 Gray Oak @1100
  (13, 32, 2, 1950.00, 3900.00),
  (13, 46, 2, 1100.00, 2200.00),
  -- Sale 14 (24500): 5× 009H Olive Green @3500, 3× 003H Light Gray @3500
  (14, 35, 5, 3500.00, 17500.00),
  (14, 36, 2, 3500.00, 7000.00),
  -- Sale 15 (10400): 4× 2-041 Wild Cherry @2000, 2× 6MM 033 Fabric @1100
  (15, 24, 4, 2000.00, 8000.00),
  (15, 47, 2, 1100.00, 2200.00),
  -- Sale 16 (19500): 6× 1-015 Gray Oak @2250, 2× 2-017 Macassar @2000
  (16, 7, 6, 2250.00, 13500.00),
  (16, 23, 3, 2000.00, 6000.00),
  -- Sale 17 (8800): 4× 1-033 Fabric Cream @2250
  (17, 8, 4, 2250.00, 9000.00),
  -- Sale 18 (12600): 3× 012H Dark Gray @3500, 1× 005H Light Blue @3500, 1× UV-040 @3000, spare
  (18, 39, 3, 3500.00, 10500.00),
  (18, 40, 1, 3500.00, 3500.00),
  -- Sale 19 (7700): 3× B-027 Lumenteak @1950, 1× B-000 Real White @1950
  (19, 33, 3, 1950.00, 5850.00),
  (19, 34, 1, 1950.00, 1950.00),
  -- Sale 20 (17500): 5× 1-039 Dark Metallic @2250, 2× 2-025 Brown Walnut @2000
  (20, 9, 5, 2250.00, 11250.00),
  (20, 21, 3, 2000.00, 6000.00),
  -- Sale 21 (22000): 4× 006H Mocha @3500, 3× 042 Marble @3100
  (21, 38, 4, 3500.00, 14000.00),
  (21, 42, 2, 3100.00, 6200.00),
  (21, 43, 1, 1100.00, 1100.00),
  -- Sale 22 (9000): 4× 2-001 Warm White @2000, 1× 6MM 023 @1100
  (22, 27, 4, 2000.00, 8000.00),
  (22, 48, 1, 1100.00, 1000.00),
  -- Sale 23 (14250): 4× 1-014 Gray Stone @2250, 2× 6MM 016 @1100
  (23, 10, 4, 2250.00, 9000.00),
  (23, 49, 2, 1100.00, 2200.00),
  (23, 44, 2, 1100.00, 2200.00),
  -- Sale 24 (11550): 3× 1-016 Silver Ash @2250, 3× 6MM 014 @1100
  (24, 11, 3, 2250.00, 6750.00),
  (24, 50, 3, 1100.00, 3300.00),
  (24, 43, 1, 1100.00, 1100.00),
  -- Sale 25 (31500): 6× 009H Olive Green @3500, 3× UV-040 @3000, 2× 042 Marble @3100
  (25, 35, 6, 3500.00, 21000.00),
  (25, 41, 3, 3000.00, 9000.00),
  (25, 42, 1, 3100.00, 1500.00),
  -- Sale 26 (13000): 2× 1-034 Metallic Dark @2250, 3× 2-025 Brown Walnut @2000, 2× 6MM 000 @1100
  (26, 12, 2, 2250.00, 4500.00),
  (26, 21, 3, 2000.00, 6000.00),
  (26, 43, 2, 1100.00, 2200.00);

-- ── FEBRUARY 2026 ────────────────────────────────────────────────
INSERT INTO sales (user_id, invoice_no, total_amount, notes, sale_date) VALUES
  (1, 'INV-MOCK', 19800.00, 'Contractor bulk purchase',    '2026-02-02'),
  (1, 'INV-MOCK', 7800.00, 'Walk-in customer',            '2026-02-03'),
  (1, 'INV-MOCK', 16100.00, 'Interior designer order',     '2026-02-04'),
  (1, 'INV-MOCK', 11000.00, 'Store purchase',              '2026-02-05'),
  (1, 'INV-MOCK', 24000.00, 'Wholesale order',             '2026-02-06'),
  (1, 'INV-MOCK', 8700.00, 'Walk-in customer',            '2026-02-09'),
  (1, 'INV-MOCK', 14700.00, 'Contractor purchase',         '2026-02-10'),
  (1, 'INV-MOCK', 21600.00, 'Bulk cabinet maker',          '2026-02-11'),
  (1, 'INV-MOCK', 9200.00, 'Store purchase',              '2026-02-12'),
  (1, 'INV-MOCK', 17500.00, 'Walk-in customer',            '2026-02-13'),
  (1, 'INV-MOCK', 12950.00, 'Contractor purchase',         '2026-02-14'),
  (1, 'INV-MOCK', 28000.00, 'Valentine season bulk',       '2026-02-16'),
  (1, 'INV-MOCK', 6600.00, 'Store purchase',              '2026-02-17'),
  (1, 'INV-MOCK', 15400.00, 'Interior designer order',     '2026-02-18'),
  (1, 'INV-MOCK', 10800.00, 'Walk-in customer',            '2026-02-19'),
  (1, 'INV-MOCK', 22400.00, 'Wholesale order',             '2026-02-20'),
  (1, 'INV-MOCK', 8250.00, 'Contractor purchase',         '2026-02-23'),
  (1, 'INV-MOCK', 13750.00, 'Walk-in customer',            '2026-02-24'),
  (1, 'INV-MOCK', 19200.00, 'Bulk cabinet order',          '2026-02-25'),
  (1, 'INV-MOCK', 11700.00, 'Store purchase',              '2026-02-26'),
  (1, 'INV-MOCK', 33600.00, 'End-month wholesale',         '2026-02-27'),
  (1, 'INV-MOCK', 16500.00, 'Contractor purchase',         '2026-02-28');

-- Sale items — February (sales IDs 27-48)
INSERT INTO sale_items (sale_id, product_id, quantity, price_per_unit, total) VALUES
  -- Sale 27 (19800): 4× 1-041 Wild Cherry @2250, 3× 2-025 Brown Walnut @2000, 3× 6MM 000 @1100
  (27, 13, 4, 2250.00, 9000.00),
  (27, 21, 3, 2000.00, 6000.00),
  (27, 43, 3, 1100.00, 3300.00),
  (27, 44, 1, 1100.00, 1100.00),
  -- Sale 28 (7800): 3× B-005 Shadow Oak @1950, 3× 6MM 001 @1100
  (28, 30, 3, 1950.00, 5850.00),
  (28, 44, 1, 1100.00, 1100.00),
  (28, 45, 1, 1100.00,  850.00),
  -- Sale 29 (16100): 2× 009H Olive Green @3500, 2× 001H White Glossy @3500, 1× UV-040 @3000, 1× 042 @3100
  (29, 35, 2, 3500.00, 7000.00),
  (29, 37, 2, 3500.00, 7000.00),
  (29, 41, 1, 3000.00, 3000.00),
  (29, 42, 0, 3100.00,  100.00),
  -- Sale 30 (11000): 2× 1-021 Walnut Gray @2250, 3× 2-021 Walnut Gray @2000
  (30, 14, 2, 2250.00, 4500.00),
  (30, 26, 3, 2000.00, 6000.00),
  -- Sale 31 (24000): 8× 1-046 Natural Oak @2250, 3× 6MM 015 @1100
  (31, 15, 8, 2250.00, 18000.00),
  (31, 46, 3, 1100.00, 3300.00),
  (31, 47, 2, 1100.00, 2200.00),
  -- Sale 32 (8700): 3× 2-022 Serpent @2000, 2× B-001 Warm White @1950
  (32, 25, 3, 2000.00, 6000.00),
  (32, 31, 1, 1950.00, 1950.00),
  (32, 45, 1, 1100.00,  750.00),
  -- Sale 33 (14700): 2× 006H Mocha @3500, 2× 012H Dark Gray @3500, 1× 042 Marble @3100
  (33, 38, 2, 3500.00, 7000.00),
  (33, 39, 2, 3500.00, 7000.00),
  (33, 42, 0, 3100.00,  700.00),
  -- Sale 34 (21600): 8× 1-048 Light Acacia @2250, 2× 2-017 Macassar @2000
  (34, 16, 8, 2250.00, 18000.00),
  (34, 23, 1, 2000.00, 2000.00),
  (34, 44, 1, 1100.00, 1100.00),
  (34, 43, 1, 1100.00,  500.00),
  -- Sale 35 (9200): 2× B-006 Charcoal Gray @1950, 3× 6MM 034 Light Metallic @1100
  (35, 32, 2, 1950.00, 3900.00),
  (35, 45, 3, 1100.00, 3300.00),
  (35, 46, 1, 1100.00, 1100.00),
  -- Sale 36 (17500): 5× 1-045 Beige @2250, 2× 2-023 Yellow Birch @2000, 2× 6MM 023 @1100
  (36, 17, 5, 2250.00, 11250.00),
  (36, 22, 2, 2000.00, 4000.00),
  (36, 48, 2, 1100.00, 2200.00),
  -- Sale 37 (12950): 2× 003H Light Gray @3500, 2× UV-040 @3000, 1× 042 @3100, spare
  (37, 36, 2, 3500.00, 7000.00),
  (37, 41, 2, 3000.00, 6000.00),
  -- Sale 38 (28000): 5× 009H Olive Green @3500, 3× 001H White Glossy @3500, 1× 042 @3100
  (38, 35, 5, 3500.00, 17500.00),
  (38, 37, 3, 3500.00, 10500.00),
  -- Sale 39 (6600): 2× B-027 Lumenteak @1950, 2× B-000 Real White @1950
  (39, 33, 2, 1950.00, 3900.00),
  (39, 34, 2, 1950.00, 3900.00),
  -- Sale 40 (15400): 4× 1-047 Fabric Gray @2250, 3× 2-041 Wild Cherry @2000
  (40, 18, 4, 2250.00, 9000.00),
  (40, 24, 3, 2000.00, 6000.00),
  (40, 43, 1, 1100.00,  400.00),
  -- Sale 41 (10800): 4× 2-000 Real White @2000, 1× 2-024 Gray Birch @2000, 4× 6MM 001 @1100
  (41, 28, 4, 2000.00, 8000.00),
  (41, 29, 1, 2000.00, 2000.00),
  (41, 44, 1, 1100.00,  800.00),
  -- Sale 42 (22400): 4× 005H Light Blue @3500, 3× 006H Mocha @3500
  (42, 40, 4, 3500.00, 14000.00),
  (42, 38, 3, 3500.00, 10500.00),
  -- Sale 43 (8250): 3× 1-044 Silver Gray @2250, 1× 6MM 016 @1100
  (43, 19, 3, 2250.00, 6750.00),
  (43, 49, 1, 1100.00, 1100.00),
  -- Sale 44 (13750): 3× 1-043 Dark Acacia @2250, 3× 6MM 014 @1100
  (44, 20, 3, 2250.00, 6750.00),
  (44, 50, 3, 1100.00, 3300.00),
  (44, 43, 1, 1100.00, 1100.00),
  -- Sale 45 (19200): 6× 2-025 Brown Walnut @2000, 2× B-006 Charcoal Gray @1950, 2× 6MM 033 @1100
  (45, 21, 6, 2000.00, 12000.00),
  (45, 32, 2, 1950.00, 3900.00),
  (45, 47, 3, 1100.00, 3300.00),
  -- Sale 46 (11700): 2× 012H Dark Gray @3500, 1× UV-040 @3000, 2× 6MM 015 @1100
  (46, 39, 2, 3500.00, 7000.00),
  (46, 41, 1, 3000.00, 3000.00),
  (46, 46, 1, 1100.00, 1100.00),
  -- Sale 47 (33600): 6× 001H White Glossy @3500, 4× UV-040 @3000, 2× 042 @3100
  (47, 37, 6, 3500.00, 21000.00),
  (47, 41, 4, 3000.00, 12000.00),
  (47, 42, 0, 3100.00,  600.00),
  -- Sale 48 (16500): 4× 1-023 Yellow Birch @2250, 4× 2-001 Warm White @2000
  (48, 1, 4, 2250.00, 9000.00),
  (48, 27, 4, 2000.00, 8000.00),
  (48, 43, 1, 1100.00,  500.00);

-- ── MARCH 2026 ───────────────────────────────────────────────────
INSERT INTO sales (user_id, invoice_no, total_amount, notes, sale_date) VALUES
  (1, 'INV-MOCK', 25200.00, 'March opening bulk order',   '2026-03-02'),
  (1, 'INV-MOCK', 13500.00, 'Walk-in customer',            '2026-03-03'),
  (1, 'INV-MOCK', 18700.00, 'Contractor purchase',         '2026-03-04'),
  (1, 'INV-MOCK', 9900.00, 'Store purchase',              '2026-03-05'),
  (1, 'INV-MOCK', 21000.00, 'Interior designer order',     '2026-03-06'),
  (1, 'INV-MOCK', 11550.00, 'Walk-in customer',            '2026-03-07'),
  (1, 'INV-MOCK', 31500.00, 'Wholesale bulk order',        '2026-03-09'),
  (1, 'INV-MOCK', 14000.00, 'Contractor purchase',         '2026-03-10'),
  (1, 'INV-MOCK', 8100.00, 'Store purchase',              '2026-03-11'),
  (1, 'INV-MOCK', 22500.00, 'Cabinet maker order',         '2026-03-12'),
  (1, 'INV-MOCK', 15750.00, 'Contractor purchase',         '2026-03-13'),
  (1, 'INV-MOCK', 26250.00, 'Interior designer bulk',      '2026-03-14'),
  (1, 'INV-MOCK', 7150.00, 'Walk-in customer',            '2026-03-16'),
  (1, 'INV-MOCK', 19600.00, 'Wholesale order',             '2026-03-17'),
  (1, 'INV-MOCK', 12100.00, 'Store purchase',              '2026-03-18'),
  (1, 'INV-MOCK', 28000.00, 'Bulk contractor order',       '2026-03-19'),
  (1, 'INV-MOCK', 9300.00, 'Walk-in customer',            '2026-03-20'),
  (1, 'INV-MOCK', 17100.00, 'Contractor purchase',         '2026-03-21'),
  (1, 'INV-MOCK', 24500.00, 'Interior designer order',     '2026-03-23'),
  (1, 'INV-MOCK', 11000.00, 'Store purchase',              '2026-03-24'),
  (1, 'INV-MOCK', 35000.00, 'Month-end wholesale bulk',    '2026-03-25'),
  (1, 'INV-MOCK', 16200.00, 'Contractor purchase',         '2026-03-26'),
  (1, 'INV-MOCK', 13650.00, 'Walk-in customer',            '2026-03-27'),
  (1, 'INV-MOCK', 22050.00, 'Cabinet maker order',         '2026-03-28'),
  (1, 'INV-MOCK', 18000.00, 'Contractor purchase',         '2026-03-29'),
  (1, 'INV-MOCK', 41000.00, 'Quarter-end mega order',      '2026-03-30'),
  (1, 'INV-MOCK', 14400.00, 'Store purchase',              '2026-03-31');

-- Sale items — March (sales IDs 49-75)
INSERT INTO sale_items (sale_id, product_id, quantity, price_per_unit, total) VALUES
  -- Sale 49 (25200): 8× 1-023 Yellow Birch @2250, 4× 2-025 Brown Walnut @2000
  (49, 1, 8, 2250.00, 18000.00),
  (49, 21, 4, 2000.00, 8000.00),
  (49, 44, 1, 1100.00, 1100.00),
  -- Sale 50 (13500): 6× 1-031 Maridon Oak @2250
  (50, 2, 6, 2250.00, 13500.00),
  -- Sale 51 (18700): 3× 005H Light Blue @3500, 2× UV-040 @3000, 1× 042 @3100
  (51, 40, 3, 3500.00, 10500.00),
  (51, 41, 2, 3000.00, 6000.00),
  (51, 42, 1, 3100.00, 3100.00),
  -- Sale 52 (9900): 3× 2-022 Serpent @2000, 3× B-005 Shadow Oak @1950
  (52, 25, 3, 2000.00, 6000.00),
  (52, 30, 2, 1950.00, 3900.00),
  -- Sale 53 (21000): 6× 006H Mocha @3500
  (53, 38, 6, 3500.00, 21000.00),
  -- Sale 54 (11550): 3× 1-015 Gray Oak @2250, 3× 6MM 000 @1100
  (54, 7, 3, 2250.00, 6750.00),
  (54, 43, 3, 1100.00, 3300.00),
  (54, 44, 1, 1100.00, 1100.00),
  -- Sale 55 (31500): 6× 009H Olive Green @3500, 3× 001H White Glossy @3500, 1× UV-040 @3000, 2× 042 @3100
  (55, 35, 6, 3500.00, 21000.00),
  (55, 37, 3, 3500.00, 10500.00),
  -- Sale 56 (14000): 4× 2-017 Macassar @2000, 3× B-001 Warm White @1950
  (56, 23, 4, 2000.00, 8000.00),
  (56, 31, 3, 1950.00, 5850.00),
  -- Sale 57 (8100): 3× B-006 Charcoal Gray @1950, 3× 6MM 015 @1100
  (57, 32, 3, 1950.00, 5850.00),
  (57, 46, 2, 1100.00, 2200.00),
  -- Sale 58 (22500): 10× 1-000 Real White @2250
  (58, 4, 10, 2250.00, 22500.00),
  -- Sale 59 (15750): 7× 1-001 Warm White @2250
  (59, 5, 7, 2250.00, 15750.00),
  -- Sale 60 (26250): 5× 009H Olive Green @3500, 2× UV-040 @3000, 2× 042 @3100
  (60, 35, 5, 3500.00, 17500.00),
  (60, 41, 2, 3000.00, 6000.00),
  (60, 42, 1, 3100.00, 3100.00),
  -- Sale 61 (7150): 1× 2-024 Gray Birch @2000, 3× 6MM 023 @1100, 1× B-027 @1950
  (61, 29, 1, 2000.00, 2000.00),
  (61, 48, 3, 1100.00, 3300.00),
  (61, 33, 1, 1950.00, 1950.00),
  -- Sale 62 (19600): 2× 012H Dark Gray @3500, 2× 006H Mocha @3500, 2× UV-040 @3000
  (62, 39, 2, 3500.00, 7000.00),
  (62, 38, 2, 3500.00, 7000.00),
  (62, 41, 2, 3000.00, 6000.00),
  -- Sale 63 (12100): 4× 2-041 Wild Cherry @2000, 4× 6MM 033 @1100
  (63, 24, 4, 2000.00, 8000.00),
  (63, 47, 4, 1100.00, 4400.00),
  -- Sale 64 (28000): 4× 001H White Glossy @3500, 4× 003H Light Gray @3500
  (64, 37, 4, 3500.00, 14000.00),
  (64, 36, 4, 3500.00, 14000.00),
  -- Sale 65 (9300): 3× B-027 Lumenteak @1950, 3× 6MM 016 @1100
  (65, 33, 3, 1950.00, 5850.00),
  (65, 49, 3, 1100.00, 3300.00),
  -- Sale 66 (17100): 4× 1-046 Natural Oak @2250, 3× 2-021 Walnut Gray @2000
  (66, 15, 4, 2250.00, 9000.00),
  (66, 26, 3, 2000.00, 6000.00),
  (66, 43, 2, 1100.00, 2100.00),
  -- Sale 67 (24500): 4× 009H Olive Green @3500, 2× 005H Light Blue @3500, 2× 042 @3100
  (67, 35, 4, 3500.00, 14000.00),
  (67, 40, 2, 3500.00, 7000.00),
  (67, 42, 1, 3100.00, 3100.00),
  (67, 43, 1, 1100.00,  400.00),
  -- Sale 68 (11000): 2× 1-048 Light Acacia @2250, 3× 2-023 Yellow Birch @2000
  (68, 16, 2, 2250.00, 4500.00),
  (68, 22, 3, 2000.00, 6000.00),
  (68, 44, 1, 1100.00,  500.00),
  -- Sale 69 (35000): 5× 001H White Glossy @3500, 5× UV-040 @3000, 2× 042 @3100
  (69, 37, 5, 3500.00, 17500.00),
  (69, 41, 5, 3000.00, 15000.00),
  (69, 42, 1, 3100.00, 2500.00),
  -- Sale 70 (16200): 4× 1-017 Macassar @2250, 3× 6MM 034 @1100, 2× B-000 @1950
  (70, 6, 4, 2250.00, 9000.00),
  (70, 45, 3, 1100.00, 3300.00),
  (70, 34, 2, 1950.00, 3900.00),
  -- Sale 71 (13650): 3× 1-033 Fabric Cream @2250, 3× 2-000 Real White @2000
  (71, 8, 3, 2250.00, 6750.00),
  (71, 28, 3, 2000.00, 6000.00),
  (71, 44, 1, 1100.00,  900.00),
  -- Sale 72 (22050): 3× 006H Mocha @3500, 2× UV-040 @3000, 2× 042 @3100, 3× 6MM 001 @1100
  (72, 38, 3, 3500.00, 10500.00),
  (72, 41, 2, 3000.00, 6000.00),
  (72, 42, 1, 3100.00, 3100.00),
  (72, 44, 2, 1100.00, 2200.00),
  -- Sale 73 (18000): 4× 2-025 Brown Walnut @2000, 4× 1-039 Dark Metallic @2250
  (73, 21, 4, 2000.00, 8000.00),
  (73, 9, 4, 2250.00, 9000.00),
  (73, 43, 1, 1100.00, 1000.00),
  -- Sale 74 (41000): 6× 001H White Glossy @3500, 4× 005H Light Blue @3500, 4× UV-040 @3000, 3× 042 @3100
  (74, 37, 6, 3500.00, 21000.00),
  (74, 40, 4, 3500.00, 14000.00),
  (74, 41, 2, 3000.00, 6000.00),
  -- Sale 75 (14400): 4× 1-009 Golden Oak @2250, 2× 2-022 Serpent @2000, 2× 6MM 014 @1100
  (75, 3, 4, 2250.00, 9000.00),
  (75, 25, 2, 2000.00, 4000.00),
  (75, 50, 2, 1100.00, 2200.00);

-- ============================================================
--  Update current_stock to reflect sales deductions
--  (50 initial - qty sold per product, min 5)
-- ============================================================

-- 11PLY SOLID MARINE stock adjustments
UPDATE products SET current_stock = GREATEST(5, current_stock -
  (SELECT COALESCE(SUM(si.quantity),0) FROM sale_items si WHERE si.product_id = products.id))
WHERE category_id = 1;

-- COMPACT MARINE stock adjustments
UPDATE products SET current_stock = GREATEST(5, current_stock -
  (SELECT COALESCE(SUM(si.quantity),0) FROM sale_items si WHERE si.product_id = products.id))
WHERE category_id = 2;

-- LAMINATED PLYBOARD stock adjustments
UPDATE products SET current_stock = GREATEST(5, current_stock -
  (SELECT COALESCE(SUM(si.quantity),0) FROM sale_items si WHERE si.product_id = products.id))
WHERE category_id = 3;

-- PETG HIGH GLOSS stock adjustments
UPDATE products SET current_stock = GREATEST(5, current_stock -
  (SELECT COALESCE(SUM(si.quantity),0) FROM sale_items si WHERE si.product_id = products.id))
WHERE category_id = 4;

-- UV GLOSS stock adjustments
UPDATE products SET current_stock = GREATEST(5, current_stock -
  (SELECT COALESCE(SUM(si.quantity),0) FROM sale_items si WHERE si.product_id = products.id))
WHERE category_id = 5;

-- UV MARBLE stock adjustments
UPDATE products SET current_stock = GREATEST(5, current_stock -
  (SELECT COALESCE(SUM(si.quantity),0) FROM sale_items si WHERE si.product_id = products.id))
WHERE category_id = 6;

-- 6MM BACKING stock adjustments
UPDATE products SET current_stock = GREATEST(low_stock_threshold, current_stock -
  (SELECT COALESCE(SUM(si.quantity),0) FROM sale_items si WHERE si.product_id = products.id))
WHERE category_id = 7;

-- EDGEBAND stock adjustments (threshold = 100 meters = 1 roll)
UPDATE products SET current_stock = GREATEST(low_stock_threshold, current_stock -
  (SELECT COALESCE(SUM(si.quantity),0) FROM sale_items si WHERE si.product_id = products.id))
WHERE category_id = 8;

-- EDGEBAND GLOSS stock adjustments
UPDATE products SET current_stock = GREATEST(low_stock_threshold, current_stock -
  (SELECT COALESCE(SUM(si.quantity),0) FROM sale_items si WHERE si.product_id = products.id))
WHERE category_id = 9;

-- ── Edgeband products (Regular ₱17/m, cat=8; Gloss ₱23/m, cat=9) ──────
-- 26 regular + 8 gloss = 34 edgebands total
INSERT INTO products (board_type, category_id, color_design, cost_price, selling_price, current_stock, low_stock_threshold, unit) VALUES
  -- Regular Edgebands (cat=8, ₱17/m, 500m initial, thr=100m)
  ('EB-000', 8, 'Real White',    10.00, 17.00, 500, 100, 'meter'),
  ('EB-001', 8, 'Warm White',    10.00, 17.00, 500, 100, 'meter'),
  ('EB-005', 8, 'Shadow Oak',    10.00, 17.00, 500, 100, 'meter'),
  ('EB-006', 8, 'Charcoal Gray', 10.00, 17.00, 500, 100, 'meter'),
  ('EB-009', 8, 'Golden Oak',    10.00, 17.00, 500, 100, 'meter'),
  ('EB-014', 8, 'Gray Stone',    10.00, 17.00, 500, 100, 'meter'),
  ('EB-015', 8, 'Gray Oak',      10.00, 17.00, 500, 100, 'meter'),
  ('EB-016', 8, 'Silver Ash',    10.00, 17.00, 500, 100, 'meter'),
  ('EB-017', 8, 'Macassar',      10.00, 17.00, 500, 100, 'meter'),
  ('EB-021', 8, 'Walnut Gray',   10.00, 17.00, 500, 100, 'meter'),
  ('EB-022', 8, 'Serpent',       10.00, 17.00, 500, 100, 'meter'),
  ('EB-023', 8, 'Yellow Birch',  10.00, 17.00, 500, 100, 'meter'),
  ('EB-024', 8, 'Gray Birch',    10.00, 17.00, 500, 100, 'meter'),
  ('EB-025', 8, 'Brown Walnut',  10.00, 17.00, 500, 100, 'meter'),
  ('EB-027', 8, 'Lumenteak',     10.00, 17.00, 500, 100, 'meter'),
  ('EB-031', 8, 'Maridon Oak',   10.00, 17.00, 500, 100, 'meter'),
  ('EB-033', 8, 'Fabric Cream',  10.00, 17.00, 500, 100, 'meter'),
  ('EB-034', 8, 'Metallic Dark', 10.00, 17.00, 500, 100, 'meter'),
  ('EB-039', 8, 'Dark Metallic', 10.00, 17.00, 500, 100, 'meter'),
  ('EB-041', 8, 'Wild Cherry',   10.00, 17.00, 500, 100, 'meter'),
  ('EB-043', 8, 'Dark Acacia',   10.00, 17.00, 500, 100, 'meter'),
  ('EB-044', 8, 'Silver Gray',   10.00, 17.00, 500, 100, 'meter'),
  ('EB-045', 8, 'Beige',         10.00, 17.00, 500, 100, 'meter'),
  ('EB-046', 8, 'Natural Oak',   10.00, 17.00, 500, 100, 'meter'),
  ('EB-047', 8, 'Fabric Gray',   10.00, 17.00, 500, 100, 'meter'),
  ('EB-048', 8, 'Light Acacia',  10.00, 17.00, 500, 100, 'meter'),
  -- Gloss Edgebands (cat=9, ₱23/m, PETG & UV colors only)
  ('EBG-009H', 9, 'Olive Green',  16.00, 23.00, 500, 100, 'meter'),
  ('EBG-003H', 9, 'Light Gray',   16.00, 23.00, 500, 100, 'meter'),
  ('EBG-001H', 9, 'White Glossy', 16.00, 23.00, 500, 100, 'meter'),
  ('EBG-006H', 9, 'Mocha',        16.00, 23.00, 500, 100, 'meter'),
  ('EBG-012H', 9, 'Dark Gray',    16.00, 23.00, 500, 100, 'meter'),
  ('EBG-005H', 9, 'Light Blue',   16.00, 23.00, 500, 100, 'meter'),
  ('EBG-040',  9, 'White Gloss',  16.00, 23.00, 500, 100, 'meter'),
  ('EBG-042',  9, 'Marble',       16.00, 23.00, 500, 100, 'meter');

-- ============================================================
-- 6. sales_by_period (Analytics View)
-- ============================================================
DROP VIEW IF EXISTS sales_by_period;
CREATE VIEW sales_by_period AS
SELECT 
    DATE(s.sale_date) AS day_val,
    YEARWEEK(s.sale_date, 1) AS week_val,
    DATE_FORMAT(s.sale_date, '%Y-%m') AS month_val,
    YEAR(s.sale_date) AS year_val,
    p.category_id,
    c.name AS category_name,
    SUM(si.quantity) AS total_qty,
    SUM(si.total) AS total_amount
FROM sales s
JOIN sale_items si ON s.id = si.sale_id
JOIN products p ON p.id = si.product_id
JOIN categories c ON c.id = p.category_id
GROUP BY day_val, week_val, month_val, year_val, p.category_id, c.name;
