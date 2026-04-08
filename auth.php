<?php
/**
 * includes/auth.php — Session-based authentication helpers.
 *
 * Include at the TOP of every protected page:
 *   require_once __DIR__ . '/../includes/auth.php';
 *   requireLogin();          // any authenticated user
 *   requireRole('Admin');    // Admin only
 */
if (session_status() === PHP_SESSION_NONE) session_start();

function requireLogin(): void
{
    if (empty($_SESSION['user_id'])) {
        header('Location: ' . BASE_URL . 'login.php'); exit;
    }
}

function requireRole(string $role): void
{
    requireLogin();
    if ($_SESSION['role'] !== $role) {
        header('Location: ' . BASE_URL . 'dashboard.php?error=access_denied'); exit;
    }
}

function isAdmin(): bool  { return isset($_SESSION['role']) && $_SESSION['role'] === 'Admin'; }
function isLoggedIn(): bool { return !empty($_SESSION['user_id']); }

function currentUser(): array
{
    return [
        'id'        => $_SESSION['user_id']   ?? null,
        'username'  => $_SESSION['username']  ?? '',
        'full_name' => $_SESSION['full_name'] ?? '',
        'role'      => $_SESSION['role']      ?? '',
    ];
}
