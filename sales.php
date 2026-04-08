<?php
/**
 * sales.php — Accessible by Admin and Staff.
 *
 * Features:
 *  - New sale form:
 *    • Board Type (searchable select with all 7 types)
 *    • Thickness + Size (auto-filled from product data)
 *    • Quantity
 *    • Price per piece (₱) — initialized from selling_price but EDITABLE
 *    • Total (₱) auto-calculated
 *  - Sale items list inside a current session (client-side cart before final submit)
 *  - Recent sales history table with search and date filter
 *  - Prices stored as DECIMAL(10,2), displayed with ₱ symbol
 */
define('BASE_URL', '/stockboard_dealer/');
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/db.php';
requireLogin();

$db   = getDB();
$user = currentUser();
$flash = null;

// ── Handle POST: record_sale ────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_POST['action']??'') === 'record_sale') {
    // Expect JSON-encoded items array from JS
    $items   = json_decode($_POST['items'] ?? '[]', true);
    $notes   = trim($_POST['notes'] ?? '');
    $saleDate = $_POST['sale_date'] ?? date('Y-m-d');

    if (empty($items)) {
        $flash = ['type'=>'err','msg'=>'Add at least one item before submitting.'];
    } else {
        $total = 0;
        $errors = [];

        // Validate stock
        foreach ($items as $item) {
            $pid = (int)$item['product_id'];
            $qty = (int)$item['quantity'];
            $row = $db->prepare('SELECT board_type, current_stock FROM products WHERE id=?');
            $row->execute([$pid]);
            $prod = $row->fetch();
            if (!$prod)           { $errors[] = "Invalid product ID $pid."; continue; }
            if ($qty > $prod['current_stock']) {
                $errors[] = "Insufficient stock for {$prod['board_type']}: only {$prod['current_stock']} pcs available.";
            }
            $total += round($qty * (float)$item['price_per_unit'], 2);
        }

        if ($errors) {
            $flash = ['type'=>'err','msg'=>implode(' ', $errors)];
        } else {
            // Insert sale header
            $sh = $db->prepare('INSERT INTO sales (user_id, total_amount, notes, sale_date) VALUES (?,?,?,?)');
            $sh->execute([$user['id'], $total, $notes, $saleDate]);
            $saleId = (int)$db->lastInsertId();

            // Insert items + deduct stock
            $si = $db->prepare('INSERT INTO sale_items (sale_id,product_id,quantity,price_per_unit,total) VALUES (?,?,?,?,?)');
            foreach ($items as $item) {
                $pid   = (int)$item['product_id'];
                $qty   = (int)$item['quantity'];
                $ppu   = round((float)$item['price_per_unit'], 2);
                $lineT = round($qty * $ppu, 2);
                $si->execute([$saleId,$pid,$qty,$ppu,$lineT]);
                $db->prepare('UPDATE products SET current_stock = current_stock - ? WHERE id=?')
                   ->execute([$qty,$pid]);
            }
            $flash = ['type'=>'ok','msg'=>"Sale #$saleId recorded — Total: ₱" . number_format($total,2)];
        }
    }
}
if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_POST['action']??'') === 'edit_sale') {
    $si_id = (int)$_POST['sale_item_id'];
    $newQty = (int)$_POST['edit_qty'];
    $newPrice = round((float)$_POST['edit_price'], 2);

    $row = $db->prepare('SELECT sale_id, product_id, quantity, price_per_unit, total FROM sale_items WHERE id=?');
    $row->execute([$si_id]);
    $old_si = $row->fetch();

    if ($old_si && $newQty > 0 && $newPrice >= 0) {
        $diffQty = $newQty - $old_si['quantity'];
        $newTotal = round($newQty * $newPrice, 2);
        $diffTotal = $newTotal - $old_si['total'];

        $prod = $db->prepare('SELECT current_stock, board_type FROM products WHERE id=?');
        $prod->execute([$old_si['product_id']]);
        $p = $prod->fetch();

        if ($diffQty > 0 && $diffQty > $p['current_stock']) {
            $flash = ['type'=>'err','msg'=>'Insufficient stock to increase quantity.'];
        } else {
            if ($diffQty != 0) {
                $db->prepare('UPDATE products SET current_stock = current_stock - ? WHERE id=?')->execute([$diffQty, $old_si['product_id']]);
            }
            $db->prepare('UPDATE sale_items SET quantity=?, price_per_unit=?, total=? WHERE id=?')->execute([$newQty, $newPrice, $newTotal, $si_id]);
            if ($diffTotal != 0) {
                $db->prepare('UPDATE sales SET total_amount = total_amount + ? WHERE id=?')->execute([$diffTotal, $old_si['sale_id']]);
            }
            $flash = ['type'=>'ok','msg'=>'Sale item updated successfully.'];
        }
    } else {
        $flash = ['type'=>'err','msg'=>'Invalid edit data.'];
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_POST['action']??'') === 'delete_sale') {
    $si_id = (int)$_POST['sale_item_id'];
    $row = $db->prepare('SELECT sale_id, product_id, quantity, total FROM sale_items WHERE id=?');
    $row->execute([$si_id]);
    $old_si = $row->fetch();
    
    if ($old_si) {
        $db->prepare('UPDATE products SET current_stock = current_stock + ? WHERE id=?')->execute([$old_si['quantity'], $old_si['product_id']]);
        $db->prepare('UPDATE sales SET total_amount = total_amount - ? WHERE id=?')->execute([$old_si['total'], $old_si['sale_id']]);
        $db->prepare('DELETE FROM sale_items WHERE id=?')->execute([$si_id]);
        
        $countRow = $db->prepare('SELECT COUNT(*) FROM sale_items WHERE sale_id=?');
        $countRow->execute([$old_si['sale_id']]);
        if ($countRow->fetchColumn() == 0) {
            $db->prepare('DELETE FROM sales WHERE id=?')->execute([$old_si['sale_id']]);
        }
        $flash = ['type'=>'ok','msg'=>'Sale item deleted successfully. Analytics updated.'];
    } else {
        $flash = ['type'=>'err','msg'=>'Sale item not found.'];
    }
}

// ── Fetch products ────────────────────────────────────────────────
$products = $db->query("
    SELECT id, board_type, color_design, thickness, size, unit, selling_price, current_stock
    FROM products ORDER BY board_type")->fetchAll();

// ── Recent sales ──────────────────────────────────────────────────
$from = $_GET['from'] ?? date('Y-m-01');
$to   = $_GET['to']   ?? date('Y-m-d');

$recentSql = $db->prepare("
    SELECT s.id, s.sale_date, s.created_at, u.full_name AS staff,
           p.board_type, c.name AS category, p.color_design, p.thickness, p.size, p.unit,
           si.quantity, si.price_per_unit, si.total, si.id AS item_id
    FROM sales s
    JOIN sale_items si ON si.sale_id = s.id
    JOIN products p    ON p.id = si.product_id
    JOIN categories c  ON c.id = p.category_id
    JOIN users u       ON u.id = s.user_id
    WHERE s.sale_date BETWEEN ? AND ?
    ORDER BY s.created_at DESC LIMIT 150");
$recentSql->execute([$from, $to]);
$recentSales = $recentSql->fetchAll();

$totalRevenue = array_sum(array_column($recentSales,'total'));
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Sales — StockBoard Pro</title>
  <link rel="stylesheet" href="css/style.css"/>
</head>
<body>
<div class="layout">
  <?php include __DIR__ . '/includes/sidebar.php'; ?>
  <div class="main">
    <div class="topbar">
      <div><div class="topbar-title">Sales</div><div class="topbar-sub">Record board sales and view history</div></div>
    </div>
    <div class="page-body">

      <?php if ($flash): ?>
        <div class="flash flash-<?= $flash['type'] ?>"><?= htmlspecialchars($flash['msg']) ?></div>
      <?php endif; ?>

      <!-- ── NEW SALE FORM ── -->
      <div class="card mb-2">
        <div class="card-title">🛒 New Sale Entry</div>

        <form id="saleForm" method="post" action="sales.php">
          <input type="hidden" name="action" value="record_sale"/>
          <input type="hidden" name="items" id="cartJSON" value="[]"/>

          <div class="form-grid-2" style="align-items:end;">
            <div class="form-group">
              <label>Product Name *</label>
              <select id="prodSel" class="form-control" onchange="fillProduct()">
                <option value="">— Select product —</option>
                <?php foreach ($products as $p): ?>
                  <option value="<?= $p['id'] ?>"
                    data-th="<?= htmlspecialchars($p['thickness']) ?>"
                    data-sz="<?= htmlspecialchars($p['size']) ?>"
                    data-pr="<?= $p['selling_price'] ?>"
                    data-st="<?= $p['current_stock'] ?>">
                    <?= htmlspecialchars($p['board_type']) ?>
                  </option>
                <?php endforeach; ?>
              </select>
            </div>
            <div class="form-grid-2">
              <div class="form-group">
                <label>Thickness</label>
                <input type="text" id="dispThick" class="form-control" readonly placeholder="Auto-filled" style="background:var(--surface);"/>
              </div>
              <div class="form-group">
                <label>Size</label>
                <input type="text" id="dispSize" class="form-control" readonly placeholder="Auto-filled" style="background:var(--surface);"/>
              </div>
            </div>
          </div>

          <div class="form-grid-3" style="align-items:end;">
            <div class="form-group">
              <label>Quantity * <span id="qtyUnit" class="muted" style="font-size:0.8rem;"></span></label>
              <input type="number" id="qty" class="form-control" min="1" placeholder="0" oninput="calcTotal()"/>
            </div>
            <div class="form-group">
              <label>Price per unit (₱) <span style="color:var(--accent-lt);font-size:.72rem;">(editable)</span></label>
              <input type="number" step="0.01" min="0" id="ppu" class="form-control" placeholder="0.00" oninput="calcTotal()"/>
            </div>
            <div class="form-group">
              <label>Line Total (₱)</label>
              <div id="lineTotal" style="font-size:1.15rem;font-weight:700;color:#4ade80;padding:.52rem 0;">₱0.00</div>
            </div>
          </div>

          <div style="display:flex;gap:.5rem;align-items:center;flex-wrap:wrap;margin-bottom:1rem;">
            <button type="button" class="btn btn-success" onclick="addToCart()">+ Add to Sale</button>
            <span class="muted" style="font-size:.8rem;">Add multiple products before submitting.</span>
          </div>

          <!-- Cart table -->
          <div id="cartBox" class="items-box hidden">
            <table id="cartTbl">
              <thead><tr><th>Product Name</th><th>Color/Design</th><th>Thickness</th><th>Size</th><th>Qty</th><th>Unit</th><th>Price/unit (₱)</th><th>Total (₱)</th><th></th></tr></thead>
              <tbody id="cartBody"></tbody>
              <tfoot>
                <tr style="font-weight:700;">
                  <td colspan="7" class="tr" style="padding:.6rem .9rem;">Grand Total:</td>
                  <td id="grandTotal" style="padding:.6rem .9rem;color:#4ade80;">₱0.00</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div class="form-grid-2" style="margin-top:.75rem;">
            <div class="form-group">
              <label>Sale Date</label>
              <input type="date" name="sale_date" class="form-control" value="<?= date('Y-m-d') ?>"/>
            </div>
            <div class="form-group">
              <label>Notes (optional)</label>
              <input type="text" name="notes" class="form-control" placeholder="e.g. Walk-in customer"/>
            </div>
          </div>

          <button type="submit" class="btn btn-primary" id="submitBtn">✅ Submit Sale</button>
        </form>
      </div>

      <!-- ── RECENT SALES TABLE ── -->
      <div class="card">
        <div class="card-title">📄 Recent Sales History</div>
        <form method="get" action="sales.php" class="toolbar mb-2">
          <div class="toolbar-left">
            <input type="text" id="saleSrch" class="search-box" placeholder="🔍 Search product / staff…"/>
            <label class="muted" style="font-size:.78rem;">From</label>
            <input type="date" name="from" class="form-control" style="width:145px;" value="<?= htmlspecialchars($from) ?>"/>
            <label class="muted" style="font-size:.78rem;">To</label>
            <input type="date" name="to"   class="form-control" style="width:145px;" value="<?= htmlspecialchars($to) ?>"/>
            <button type="submit" class="btn btn-ghost">Filter</button>
          </div>
          <div class="toolbar-right">
            <span class="muted" style="font-size:.82rem;">Total Revenue: <strong class="green">₱<?= number_format($totalRevenue,2) ?></strong></span>
          </div>
        </form>

        <div class="tbl-wrap">
          <table id="saleTbl">
            <thead>
              <tr><th>#</th><th>Date</th><th>Product Name</th><th>Category</th><th>Color/Design</th><th>Thickness</th><th>Size</th><th>Qty</th><th>Unit</th><th>Price/unit (₱)</th><th>Total (₱)</th><th>Actions</th></tr>
            </thead>
            <tbody>
              <?php foreach ($recentSales as $r): ?>
                <tr data-srch="<?= strtolower(htmlspecialchars($r['board_type'].' '.$r['color_design'])) ?>">
                  <td class="muted"><?= $r['id'] ?></td>
                  <td><?= htmlspecialchars($r['sale_date']) ?></td>
                  <td class="fw7"><?= htmlspecialchars($r['board_type']) ?></td>
                  <td><span class="muted" style="font-size:0.85rem"><?= htmlspecialchars($r['category']) ?></span></td>
                  <td><?= htmlspecialchars($r['color_design'] ?: '—') ?></td>
                  <td><?= htmlspecialchars($r['thickness'] ?: '—') ?></td>
                  <td><?= htmlspecialchars($r['size'] ?: '—') ?></td>
                  <td><?= $r['quantity'] ?></td>
                  <td><span class="muted"><?= htmlspecialchars($r['unit']) ?></span></td>
                  <td>₱<?= number_format($r['price_per_unit'],2) ?></td>
                  <td class="green fw7">₱<?= number_format($r['total'],2) ?></td>
                  <td>
                    <button class="btn btn-ghost btn-sm" onclick="openEditSale(<?= $r['item_id'] ?>, <?= $r['quantity'] ?>, <?= $r['price_per_unit'] ?>, '<?= addslashes($r['board_type']) ?>')">✏️</button>
                    <form method="post" style="display:inline" onsubmit="return confirm('Are you sure you want to delete this sale? Stock and analytics will be updated.')">
                      <input type="hidden" name="action" value="delete_sale"/>
                      <input type="hidden" name="sale_item_id" value="<?= $r['item_id'] ?>"/>
                      <button class="btn btn-danger btn-sm" type="submit">🗑</button>
                    </form>
                  </td>
                </tr>
              <?php endforeach; ?>
              <?php if (empty($recentSales)): ?>
                <tr><td colspan="10" class="tc muted" style="padding:2rem;">No sales found for this period.</td></tr>
              <?php endif; ?>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </div>
</div>

<!-- Edit Sale Modal -->
<div class="overlay" id="editSaleModal">
  <div class="modal" style="max-width:400px;">
    <div class="modal-header">
      <div class="modal-title">Edit Sale Item — <span id="esName"></span></div>
      <button class="modal-close" onclick="document.getElementById('editSaleModal').classList.remove('open')">✕</button>
    </div>
    <form method="post" action="sales.php">
      <input type="hidden" name="action" value="edit_sale"/>
      <input type="hidden" name="sale_item_id" id="esId"/>
      <div class="form-grid-2">
        <div class="form-group">
          <label>Quantity (pcs) *</label>
          <input type="number" name="edit_qty" id="esQty" class="form-control" min="1" required/>
        </div>
        <div class="form-group">
          <label>Price per piece (₱) *</label>
          <input type="number" step="0.01" min="0" name="edit_price" id="esPrice" class="form-control" required/>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-ghost" onclick="document.getElementById('editSaleModal').classList.remove('open')">Cancel</button>
        <button type="submit" class="btn btn-success">✅ Save Changes</button>
      </div>
    </form>
  </div>
</div>

<script>
// ── Product map from PHP ─────────────────────────────────────────
const PRODUCTS = {
  <?php foreach ($products as $p): ?>
  "<?= $p['id'] ?>": {
    name: "<?= addslashes($p['board_type']) ?>",
    color: "<?= addslashes($p['color_design']) ?>",
    thick: "<?= addslashes($p['thickness']) ?>",
    size:  "<?= addslashes($p['size']) ?>",
    unit:  "<?= addslashes($p['unit']) ?>",
    price: <?= $p['selling_price'] ?>,
    stock: <?= $p['current_stock'] ?>
  },
  <?php endforeach; ?>
};

let cart = [];   // { product_id, name, thick, size, quantity, price_per_unit }

function fillProduct() {
  const pid = document.getElementById('prodSel').value;
  if (pid && PRODUCTS[pid]) {
    const p = PRODUCTS[pid];
    document.getElementById('dispThick').value = p.thick;
    document.getElementById('dispSize').value  = p.size;
    document.getElementById('qtyUnit').textContent = '(' + p.unit + ')';
    document.getElementById('ppu').value       = p.price.toFixed(2);
    calcTotal();
  } else {
    document.getElementById('dispThick').value = '';
    document.getElementById('dispSize').value  = '';
    document.getElementById('qtyUnit').textContent = '';
    document.getElementById('ppu').value       = '';
    document.getElementById('lineTotal').textContent = '₱0.00';
  }
}

function calcTotal() {
  const q = parseFloat(document.getElementById('qty').value) || 0;
  const p = parseFloat(document.getElementById('ppu').value) || 0;
  document.getElementById('lineTotal').textContent = '₱' + (q * p).toLocaleString('en-PH', {minimumFractionDigits:2});
}

function addToCart() {
  const pid = document.getElementById('prodSel').value;
  const qty = parseInt(document.getElementById('qty').value);
  const ppu = parseFloat(document.getElementById('ppu').value);
  if (!pid)         { alert('Select a product.'); return; }
  if (!qty || qty<1){ alert('Enter a valid quantity.'); return; }
  if (!ppu || ppu<=0){ alert('Enter a valid price per piece.'); return; }
  const prod = PRODUCTS[pid];
  if (qty > prod.stock) { alert('Only ' + prod.stock + ' pcs in stock for ' + prod.name); return; }

  // Update existing or push new
  const existing = cart.find(c => c.product_id === pid);
  if (existing) { existing.quantity += qty; existing.price_per_unit = ppu; }
  else cart.push({ product_id: pid, name: prod.name, color: prod.color, thick: prod.thick, size: prod.size, unit: prod.unit, quantity: qty, price_per_unit: ppu });

  renderCart();
  // Reset inputs
  document.getElementById('prodSel').value = '';
  document.getElementById('dispThick').value = '';
  document.getElementById('dispSize').value  = '';
  document.getElementById('qtyUnit').textContent = '';
  document.getElementById('qty').value = '';
  document.getElementById('ppu').value = '';
  document.getElementById('lineTotal').textContent = '₱0.00';
}

function removeFromCart(pid) {
  cart = cart.filter(c => c.product_id !== pid);
  renderCart();
}

function renderCart() {
  const box   = document.getElementById('cartBox');
  const tbody = document.getElementById('cartBody');
  tbody.innerHTML = '';
  let grand = 0;
  cart.forEach(c => {
    const total = c.quantity * c.price_per_unit;
    grand += total;
    tbody.insertAdjacentHTML('beforeend', `
      <tr>
        <td class="fw7">${c.name}</td>
        <td>${c.color || '—'}</td>
        <td>${c.thick || '—'}</td>
        <td>${c.size || '—'}</td>
        <td>${c.quantity}</td>
        <td><span class="muted">${c.unit}</span></td>
        <td>₱${c.price_per_unit.toLocaleString('en-PH',{minimumFractionDigits:2})}</td>
        <td class="green">₱${total.toLocaleString('en-PH',{minimumFractionDigits:2})}</td>
        <td><button class="btn btn-danger btn-sm" onclick="removeFromCart('${c.product_id}')">✕</button></td>
      </tr>`);
  });
  document.getElementById('grandTotal').textContent = '₱' + grand.toLocaleString('en-PH',{minimumFractionDigits:2});
  box.classList.toggle('hidden', cart.length === 0);
  document.getElementById('cartJSON').value = JSON.stringify(cart);
}

// Submit guard
document.getElementById('saleForm').addEventListener('submit', function(e) {
  if (cart.length === 0) { e.preventDefault(); alert('Add at least one item to the sale.'); }
  else { document.getElementById('cartJSON').value = JSON.stringify(cart); }
});

// Recent sales search
document.getElementById('saleSrch').addEventListener('input', function() {
  const q = this.value.toLowerCase();
  document.querySelectorAll('#saleTbl tbody tr').forEach(r => {
    r.style.display = (r.dataset.srch && r.dataset.srch.includes(q)) ? '' : 'none';
  });
});

function openEditSale(id, qty, price, name) {
  document.getElementById('esId').value = id;
  document.getElementById('esQty').value = qty;
  document.getElementById('esPrice').value = price;
  document.getElementById('esName').textContent = name;
  document.getElementById('editSaleModal').classList.add('open');
}
</script>
</body>
</html>
