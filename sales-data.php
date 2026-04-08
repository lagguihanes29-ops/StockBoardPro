<?php
/**
 * api/sales-data.php
 * Fetches JSON aggregated sales data for charts.
 * 
 * Query Params:
 * - period: 'daily', 'weekly', 'monthly', 'yearly' (default: daily)
 * - start_date: YYYY-MM-DD
 * - end_date: YYYY-MM-DD 
 * - category_id: optional int
 */
require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/auth.php';
requireRole('Admin'); // Protect API endpoint

$db = getDB();

$period    = in_array($_GET['period'] ?? '', ['daily','weekly','monthly','yearly']) ? $_GET['period'] : 'monthly';
$endDate   = $_GET['end_date'] ?? date('Y-m-d');

if (isset($_GET['start_date']) && !empty($_GET['start_date'])) {
    $startDate = $_GET['start_date'];
} else {
    $startDate = match($period) {
        'daily'   => date('Y-m-d', strtotime('-30 days')),
        'weekly'  => date('Y-m-d', strtotime('-12 weeks')),
        'monthly' => date('Y-m-d', strtotime('-12 months')),
        'yearly'  => date('Y-m-d', strtotime('-5 years')),
    };
}
$catId     = $_GET['category_id'] ?? '';

// Determine grouping column from the view
$groupCol = match($period) {
    'daily'   => 'day_val',
    'weekly'  => 'week_val',
    'monthly' => 'month_val',
    'yearly'  => 'year_val',
};

$params = [$startDate, $endDate];
$catSql = "";
if ($catId !== '') {
    $catSql = " AND category_id = ?";
    $params[] = $catId;
}

// 1. Fetch grouped trends for Line/Bar chart
$stmt = $db->prepare("
    SELECT $groupCol AS period_label, SUM(total_amount) AS total_revenue
    FROM sales_by_period
    WHERE day_val BETWEEN ? AND ? $catSql
    GROUP BY $groupCol
    ORDER BY MIN(day_val) ASC
");
$stmt->execute($params);
$trendRows = $stmt->fetchAll(PDO::FETCH_ASSOC);

$trendLabels = array_column($trendRows, 'period_label');
$trendData   = array_column($trendRows, 'total_revenue');

// Format the labels for Weekly readability (e.g. "2026 Week 04" instead of "202604")
if ($period === 'weekly') {
    foreach ($trendLabels as &$lbl) {
        if (strlen($lbl) === 6) {
            $lbl = substr($lbl, 0, 4) . ' W' . substr($lbl, 4, 2);
        }
    }
}

// 2. Fetch categories for Pie Chart (aggregated over the whole period)
$stmt2 = $db->prepare("
    SELECT category_name, SUM(total_amount) AS total_revenue
    FROM sales_by_period
    WHERE day_val BETWEEN ? AND ? $catSql
    GROUP BY category_id, category_name
    ORDER BY total_revenue DESC
");
$stmt2->execute($params);
$catRows = $stmt2->fetchAll(PDO::FETCH_ASSOC);

$catLabels = array_column($catRows, 'category_name');
$catData   = array_column($catRows, 'total_revenue');

// 3. Fetch stacked bar data (category breakdown PER period)
$stmt3 = $db->prepare("
    SELECT $groupCol AS period_label, category_name, SUM(total_amount) AS total_revenue
    FROM sales_by_period
    WHERE day_val BETWEEN ? AND ? $catSql
    GROUP BY $groupCol, category_id, category_name
    ORDER BY MIN(day_val) ASC, total_revenue DESC
");
$stmt3->execute($params);
$stackedRows = $stmt3->fetchAll(PDO::FETCH_ASSOC);

// Structure stacked data for Chart.js
// We need { categoryName: [revenueForPeriod1, revenueForPeriod2, ...] }
// Ensure the arrays match the length of $trendLabels exactly.
$stackedDatasets = [];
foreach ($catLabels as $catLabel) {
    $stackedDatasets[$catLabel] = array_fill(0, count($trendLabels), 0);
}

foreach ($stackedRows as $row) {
    $rawPeriodIdx = $row['period_label'];
    if ($period === 'weekly' && strlen($rawPeriodIdx) === 6) {
         $rawPeriodIdx = substr($rawPeriodIdx, 0, 4) . ' W' . substr($rawPeriodIdx, 4, 2);
    }

    $pIndex = array_search($rawPeriodIdx, $trendLabels);
    if ($pIndex !== false && isset($stackedDatasets[$row['category_name']])) {
        $stackedDatasets[$row['category_name']][$pIndex] = (float)$row['total_revenue'];
    }
}

header('Content-Type: application/json');
echo json_encode([
    'trends' => [
        'labels' => $trendLabels,
        'data'   => array_map('floatval', $trendData)
    ],
    'categories' => [
        'labels' => $catLabels,
        'data'   => array_map('floatval', $catData)
    ],
    'stacked' => $stackedDatasets
]);
exit;
