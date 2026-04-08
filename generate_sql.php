<?php
// Run this via CLI: php generate_sql.php
date_default_timezone_set('Asia/Manila');

$startDate = new DateTime('2026-01-01');
$endDate   = new DateTime('2026-04-02');

$sql = "-- ============================================================\n";
$sql .= "--  SEED DATA: 3 Months of Sales (Jan 2026 - Apr 2026)\n";
$sql .= "-- ============================================================\n\n";

// Ensure view is created
$sql .= "-- ── 1. Create SQL View for Analytics ───────────────────────────────\n";
$sql .= "DROP VIEW IF EXISTS sales_by_period;\n";
$sql .= "CREATE VIEW sales_by_period AS\n";
$sql .= "SELECT \n";
$sql .= "    DATE(s.sale_date) AS day_val,\n";
$sql .= "    YEARWEEK(s.sale_date, 1) AS week_val,\n";
$sql .= "    DATE_FORMAT(s.sale_date, '%Y-%m') AS month_val,\n";
$sql .= "    YEAR(s.sale_date) AS year_val,\n";
$sql .= "    p.category_id,\n";
$sql .= "    c.name AS category_name,\n";
$sql .= "    SUM(si.quantity) AS total_qty,\n";
$sql .= "    SUM(si.total) AS total_amount\n";
$sql .= "FROM sales s\n";
$sql .= "JOIN sale_items si ON s.id = si.sale_id\n";
$sql .= "JOIN products p ON p.id = si.product_id\n";
$sql .= "JOIN categories c ON c.id = p.category_id\n";
$sql .= "GROUP BY day_val, week_val, month_val, year_val, p.category_id, c.name;\n\n";

$sql .= "-- ── 2. Clear Existing Sales ──────────────────────────────────────────\n";
$sql .= "SET FOREIGN_KEY_CHECKS = 0;\n";
$sql .= "TRUNCATE TABLE sale_items;\n";
$sql .= "TRUNCATE TABLE sales;\n";
$sql .= "SET FOREIGN_KEY_CHECKS = 1;\n\n";

$sql .= "-- ── 3. Insert Sales & Items ──────────────────────────────────────────\n";

// We will assume product IDs 1 to 48 exist based on previous seed data.
$productPrices = [
    1 => 2250, 5 => 2250, 10 => 2250, // 11PLY Marine
    21 => 2000, 25 => 2000, 29 => 2000, // Compact Marine
    30 => 1950, 31 => 1950, 34 => 1950, // Laminated
    35 => 3500, 36 => 3500, // PETG
    40 => 3000, 41 => 3000, // UV Gloss
    45 => 17, 46 => 17, // Edgeband
    47 => 23, 48 => 23, // Edgeband Gloss
];

// Map product IDs to arrays to pick random easily
$pids = array_keys($productPrices);

$saleId = 1;
$interval = new DateInterval('P1D');
for ($dt = clone $startDate; $dt <= $endDate; $dt->add($interval)) {
    // Generate 1 to 5 sales per day
    $numSales = rand(1, 5);
    for ($s = 0; $s < $numSales; $s++) {
        $hour = str_pad(rand(8, 17), 2, '0', STR_PAD_LEFT);
        $min  = str_pad(rand(0, 59), 2, '0', STR_PAD_LEFT);
        $dateStr = $dt->format('Y-m-d') . " $hour:$min:00";
        $customer = "Walk-in Customer " . rand(100, 999);
        
        // Items
        $numItems = rand(1, 4);
        $items = [];
        $totalAmt = 0;
        
        for ($i = 0; $i < $numItems; $i++) {
            $pid = $pids[array_rand($pids)];
            $price = $productPrices[$pid];
            $qty = ($price < 100) ? rand(10, 50) : rand(1, 10); // More qty for edgebands
            $lineTotal = $price * $qty;
            $items[] = "($saleId, $pid, $qty, $price, $lineTotal)";
            $totalAmt += $lineTotal;
        }
        
        $sql .= "INSERT INTO sales (id, sale_date, customer_name, total_amount) VALUES ($saleId, '$dateStr', '$customer', $totalAmt);\n";
        $sql .= "INSERT INTO sale_items (sale_id, product_id, quantity, price_per_unit, total) VALUES " . implode(", ", $items) . ";\n";
        
        $saleId++;
    }
}

file_put_contents('seed_sales_3months.sql', $sql);
echo "SQL File Generated!\n";
