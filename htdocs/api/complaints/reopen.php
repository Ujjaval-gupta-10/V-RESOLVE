<?php
require_once __DIR__ . '/../db.php';
cors_headers();

if (strtoupper($_SERVER['REQUEST_METHOD']) !== 'POST') {
    json_response(['error' => 'Method Not Allowed'], 405);
}

$pdo = get_db_connection();
$data = get_json_input();
$complaintId = $data['complaintId'] ?? ($data['id'] ?? null);
$reason = trim($data['reason'] ?? ($data['reopenReason'] ?? 'Student reported issue still persists.'));

if (!$complaintId) {
    json_response(['error' => 'Complaint ID is required.'], 400);
}

$stmt = $pdo->prepare("SELECT * FROM complaints WHERE id = ?");
$stmt->execute([$complaintId]);
$c = $stmt->fetch();

if (!$c) {
    json_response(['error' => "Complaint not found: {$complaintId}"], 404);
}

$up = $pdo->prepare("UPDATE complaints SET status = 'REOPENED', escalated = 1, reopen_reason = ? WHERE id = ?");
$up->execute([$reason, $complaintId]);

$stmt->execute([$complaintId]);
json_response(format_complaint($stmt->fetch()));
