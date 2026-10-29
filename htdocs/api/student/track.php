<?php
require_once __DIR__ . '/../db.php';
cors_headers();

$pdo = get_db_connection();
$query = trim($_GET['query'] ?? '');

if ($query === '') {
    json_response([]);
}

$like = '%' . strtolower($query) . '%';
$cutoffIso = date('c', time() - (7 * 86400));
$isTicketSearch = (bool)preg_match('/^CMP/i', $query);

if ($isTicketSearch) {
    // Direct ticket ID search: Show ticket regardless of age
    $stmt = $pdo->prepare("SELECT * FROM complaints WHERE 
        LOWER(id) LIKE ? OR LOWER(student_id) LIKE ? OR LOWER(student_room) LIKE ?
        ORDER BY submitted_at DESC LIMIT 50");
    $stmt->execute([$like, $like, $like]);
} else {
    // General student search by Roll number, Name, Room, or Phone
    $stmt = $pdo->prepare("SELECT * FROM complaints WHERE 
        (LOWER(id) LIKE ? OR LOWER(student_id) LIKE ? OR LOWER(student_name) LIKE ? OR LOWER(student_room) LIKE ? OR student_contact LIKE ?)
        AND NOT ((status = 'CONFIRMED' OR rating > 0) AND resolved_at IS NOT NULL AND resolved_at != '' AND resolved_at < ?)
        ORDER BY submitted_at DESC LIMIT 50");
    $stmt->execute([$like, $like, $like, $like, $like, $cutoffIso]);
}

$rows = $stmt->fetchAll();
$list = array_map('format_complaint', $rows);

json_response($list);
