<?php
require_once __DIR__ . '/../db.php';
cors_headers();

if (strtoupper($_SERVER['REQUEST_METHOD']) !== 'POST') {
    json_response(['error' => 'Method Not Allowed'], 405);
}

$pdo = get_db_connection();
$session = authenticate_bearer($pdo);
if (!$session || $session['role'] !== 'ADMIN') {
    json_response(['error' => 'Deanery Administrator clearance required to purge archives.'], 403);
}

$data = get_json_input();
$days = (int)($data['days'] ?? 7);
if ($days < 1) $days = 7;

// Calculate cutoff ISO string
$cutoffTime = time() - ($days * 86400);
$cutoffIso = date('c', $cutoffTime);

$del = $pdo->prepare("DELETE FROM complaints WHERE (status = 'CONFIRMED' OR rating > 0) AND resolved_at != '' AND resolved_at IS NOT NULL AND resolved_at < ?");
$del->execute([$cutoffIso]);
$purgedCount = $del->rowCount();

json_response([
    'success' => true,
    'purgedCount' => $purgedCount,
    'message' => "Removed solved and rated complaints older than {$days} days (1 week)."
]);
