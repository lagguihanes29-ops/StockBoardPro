<?php
/**
 * includes/stock_status.php
 *
 * Computes a standard stock status for every product.
 * Warning is double the low threshold.
 */

function getDynamicStockStatuses(PDO $db): array
{
    $stmt = $db->query("
        SELECT id, current_stock, low_stock_threshold
        FROM products
    ");
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $result = [];
    foreach ($rows as $r) {
        $stock   = (int) $r['current_stock'];
        $lowThr  = (int) $r['low_stock_threshold'];
        $warnThr = $lowThr * 2;

        if ($stock <= $lowThr) {
            $risk = 'low';
        } elseif ($stock <= $warnThr) {
            $risk = 'warning';
        } else {
            $risk = 'ok';
        }

        $statusLabel = match ($risk) {
            'low'     => '🔴 Low Stock',
            'warning' => '🟡 Warning',
            default   => '🟢 OK',
        };

        $badgeClass = match ($risk) {
            'low'     => 'b-low',
            'warning' => 'b-warn',
            default   => 'b-ok',
        };

        $result[$r['id']] = [
            'dynamic_threshold' => $lowThr,
            'warn_threshold'    => $warnThr,
            'monthly_avg'       => 0.0,
            'avg_daily'         => 0.0,
            'days_left'         => null,
            'risk'              => $risk,
            'status_label'      => $statusLabel,
            'badge_class'       => $badgeClass,
            'setting_name'      => 'Hardcoded',
        ];
    }

    return $result;
}
