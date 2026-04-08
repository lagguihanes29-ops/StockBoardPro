-- ============================================================
--  SEED DATA: 3 Months of Sales (Jan 2026 - Mar 2026)
-- ============================================================

-- ── 1. Create SQL View for Analytics ───────────────────────────────
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

-- ── 2. Clear Existing Sales ──────────────────────────────────────────
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE sale_items;
TRUNCATE TABLE sales;
SET FOREIGN_KEY_CHECKS = 1;

-- ── 3. Insert Sales & Items ──────────────────────────────────────────
-- JANUARY
INSERT INTO sales (id, sale_date, customer_name, total_amount) VALUES 
(1, '2026-01-05 10:30:00', 'Walk-in', 4500.00),
(2, '2026-01-12 14:15:00', 'Corp A', 14000.00),
(3, '2026-01-20 09:00:00', 'Walk-in', 2000.00),
(4, '2026-01-28 16:45:00', 'Builder LLC', 9000.00);

-- FEBRUARY
INSERT INTO sales (id, sale_date, customer_name, total_amount) VALUES 
(5, '2026-02-03 11:20:00', 'Walk-in', 6000.00),
(6, '2026-02-14 13:00:00', 'Corp B', 18000.00),
(7, '2026-02-22 15:30:00', 'Walk-in', 2250.00),
(8, '2026-02-28 10:10:00', 'Furniture Co', 10500.00);

-- MARCH
INSERT INTO sales (id, sale_date, customer_name, total_amount) VALUES 
(9, '2026-03-02 08:45:00', 'Walk-in', 3500.00),
(10, '2026-03-10 11:15:00', 'Corp C', 24000.00),
(11, '2026-03-18 14:40:00', 'Walk-in', 2000.00),
(12, '2026-03-25 16:30:00', 'Builder LLC', 12000.00),
(13, '2026-03-31 09:50:00', 'Walk-in', 6750.00);

-- SALE ITEMS
INSERT INTO sale_items (sale_id, product_id, quantity, price_per_unit, total) VALUES
-- Jan
(1, 1, 2, 2250.00, 4500.00),
(2, 4, 4, 3500.00, 14000.00),
(3, 2, 1, 2000.00, 2000.00),
(4, 5, 3, 3000.00, 9000.00),
-- Feb
(5, 5, 2, 3000.00, 6000.00),
(6, 1, 8, 2250.00, 18000.00),
(7, 1, 1, 2250.00, 2250.00),
(8, 4, 3, 3500.00, 10500.00),
-- Mar
(9, 4, 1, 3500.00, 3500.00),
(10, 5, 8, 3000.00, 24000.00),
(11, 2, 1, 2000.00, 2000.00),
(12, 5, 4, 3000.00, 12000.00),
(13, 1, 3, 2250.00, 6750.00);
