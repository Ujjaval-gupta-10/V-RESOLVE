<?php
require_once __DIR__ . '/../db.php';
cors_headers();

$pdo = get_db_connection();
$session = authenticate_bearer($pdo);
if (!$session) {
    json_response(['error' => 'Authentication required.'], 401);
}

$totalStmt = $pdo->query("SELECT COUNT(*) FROM complaints");
$total = (int)$totalStmt->fetchColumn();

$resStmt = $pdo->query("SELECT COUNT(*) FROM complaints WHERE status = 'RESOLVED' OR status = 'CONFIRMED'");
$resolved = (int)$resStmt->fetchColumn();

$inProgStmt = $pdo->query("SELECT COUNT(*) FROM complaints WHERE status = 'IN_PROGRESS'");
$inProgress = (int)$inProgStmt->fetchColumn();

$pendingStmt = $pdo->query("SELECT COUNT(*) FROM complaints WHERE status = 'ASSIGNED' OR status = 'SUBMITTED'");
$pending = (int)$pendingStmt->fetchColumn();

$escStmt = $pdo->query("SELECT COUNT(*) FROM complaints WHERE escalated = 1 OR status = 'ESCALATED'");
$escalated = (int)$escStmt->fetchColumn();

json_response([
    'total' => $total,
    'pending' => $pending,
    'inProgress' => $inProgress,
    'resolved' => $resolved,
    'escalated' => $escalated
]);
