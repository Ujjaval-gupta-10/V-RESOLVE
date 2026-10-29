<?php
require_once __DIR__ . '/../db.php';
cors_headers();

$pdo = get_db_connection();
$authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
if (preg_match('/Bearer\s+(\S+)/i', $authHeader, $m)) {
    $token = $m[1];
    $stmt = $pdo->prepare("DELETE FROM sessions WHERE token = ?");
    $stmt->execute([$token]);
}

json_response(['success' => true, 'message' => 'Logged out successfully.']);
