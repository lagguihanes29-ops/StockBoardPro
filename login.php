<?php
/**
 * login.php — Session-based authentication for StockBoard Dealer.
 *
 * Flow:
 *   1. User submits username + password.
 *   2. Fetch user by username; verify bcrypt hash.
 *   3. On success: set session → redirect Admin→dashboard, Staff→sales.
 *   4. On failure: re-render form with error.
 *
 * Default demo credentials (from schema.sql):
 *   Admin: admin / admin123
 *   Staff: staff1 / staff123
 */
define('BASE_URL', '/stockboard_dealer/');
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/db.php';

if (isLoggedIn()) {
    header('Location: dashboard.php'); exit;
}

// Removed staff auto-insert logic as role is being deprecated.

$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $uname = trim($_POST['username'] ?? '');
    $pass  = $_POST['password'] ?? '';

    if ($uname === '' || $pass === '') {
        $error = 'Please enter both username and password.';
    } else {
        $stmt = getDB()->prepare('SELECT id, password, full_name, role FROM users WHERE username = ? LIMIT 1');
        $stmt->execute([$uname]);
        $user = $stmt->fetch();

        if ($user && password_verify($pass, $user['password'])) {
            session_regenerate_id(true);
            $_SESSION['user_id']   = $user['id'];
            $_SESSION['username']  = $uname;
            $_SESSION['full_name'] = $user['full_name'];
            $_SESSION['role']      = $user['role'];
            header('Location: dashboard.php'); exit;
        } else {
            $error = 'Incorrect username or password.';
        }
    }
}
$loggedOut = isset($_GET['msg']) && $_GET['msg'] === 'out';
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Login — StockBoard Pro</title>
  <link rel="stylesheet" href="css/style.css"/>
</head>
<body>
<div class="login-wrap">
  <div class="login-card">
    <div class="login-logo">
      <div class="icon-board">🪵</div>
      <div class="company-name">StockBoard Pro</div>
      <div class="system-name">Laminated Boards Dealer — Inventory System</div>
    </div>

    <?php if ($loggedOut): ?>
      <div class="flash flash-ok">✅ You have been signed out.</div>
    <?php endif; ?>
    <?php if ($error): ?>
      <div class="flash flash-err">⛔ <?= htmlspecialchars($error) ?></div>
    <?php endif; ?>

    <form method="post" action="login.php">
      <label for="un">Username</label>
      <input id="un" name="username" type="text" class="form-control"
             placeholder="Enter username" value="<?= htmlspecialchars($_POST['username'] ?? '') ?>"
             autofocus autocomplete="username" required/>

      <label for="pw">Password</label>
      <div style="position:relative; margin-bottom:.85rem;">
        <input id="pw" name="password" type="password" class="form-control"
               placeholder="Enter password" autocomplete="current-password" required style="padding-right: 40px; margin-bottom: 0;"/>
        <span id="togglePw" style="position:absolute; right:12px; top:50%; transform:translateY(-50%); cursor:pointer; user-select:none; opacity:0.6; display:flex; align-items:center; color:var(--text-muted);">
          <svg id="iconClosed" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
          <svg id="iconOpen" style="display:none;" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
        </span>
      </div>

      <button type="submit" class="btn btn-primary btn-full" style="margin-top:.4rem">Sign In →</button>
    </form>
    
    <script>
      document.getElementById('togglePw').addEventListener('click', function() {
        const pw = document.getElementById('pw');
        const iconClosed = document.getElementById('iconClosed');
        const iconOpen = document.getElementById('iconOpen');
        if (pw.type === 'password') {
          pw.type = 'text';
          iconClosed.style.display = 'none';
          iconOpen.style.display = 'block';
          this.style.opacity = '1';
        } else {
          pw.type = 'password';
          iconClosed.style.display = 'block';
          iconOpen.style.display = 'none';
          this.style.opacity = '0.6';
        }
      });
    </script>

    <div style="margin-top:1.2rem; background:rgba(59,130,246,.08); border:1px solid rgba(59,130,246,.25); border-radius:7px; padding:.65rem .8rem; font-size:.76rem; color:#93c5fd;">
      <strong>Demo credentials</strong><br>
      Admin: <code>admin</code> / <code>admin123</code>
    </div>
  </div>
</div>
</body>
</html>
