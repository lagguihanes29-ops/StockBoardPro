<?php
/**
 * includes/sidebar.php — shared sidebar nav partial.
 * Depends on auth.php being included and BASE_URL defined.
 */
$page = basename($_SERVER['PHP_SELF'], '.php');
$u    = currentUser();
?>
<nav class="sidebar">
  <div class="sidebar-brand">
    <div class="company">🪵 StockBoard Pro</div>
    <div class="tagline">Laminated Boards Dealer</div>
    <span class="badge-role"><?= htmlspecialchars($u['role']) ?></span>
  </div>

  <div class="sidebar-nav">
    <?php if (isAdmin()): ?>
    <div class="nav-group-label">Overview</div>
    <a href="dashboard.php"  class="nav-link <?= $page==='dashboard'  ? 'active':'' ?>"><span class="icon">🏠</span><span>Dashboard</span></a>
    <a href="inventory.php"  class="nav-link <?= $page==='inventory'  ? 'active':'' ?>"><span class="icon">📦</span><span>Inventory</span></a>
    <div class="nav-group-label" style="margin-top:.5rem">Sales</div>
    <?php endif; ?>
    <a href="sales.php"      class="nav-link <?= $page==='sales'      ? 'active':'' ?>"><span class="icon">🛒</span><span>Sales</span></a>
    <?php if (isAdmin()): ?>
    <div class="nav-group-label" style="margin-top:.5rem">Analytics</div>
    <a href="reports.php"    class="nav-link <?= $page==='reports'    ? 'active':'' ?>"><span class="icon">📊</span><span>Reports</span></a>
    <a href="prediction.php" class="nav-link <?= $page==='prediction' ? 'active':'' ?>"><span class="icon">🔮</span><span>Prediction</span></a>
    <?php endif; ?>
  </div>

  <div class="sidebar-bottom">
    <div class="user-row">
      <div class="avatar"><?= strtoupper(substr($u['full_name'],0,1)) ?></div>
      <div class="user-details">
        <div class="uname"><?= htmlspecialchars($u['full_name']) ?></div>
        <div class="urole"><?= htmlspecialchars($u['role']) ?></div>
      </div>
    </div>
    <a href="logout.php" class="btn-signout" onclick="return confirm('Are you sure you want to log out?');">🚪 Sign Out</a>
  </div>
</nav>
