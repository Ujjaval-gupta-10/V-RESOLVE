<?php
require_once __DIR__ . '/../db.php';
cors_headers();

if (strtoupper($_SERVER['REQUEST_METHOD']) !== 'POST') {
    json_response(['error' => 'Method Not Allowed'], 405);
}

$pdo = get_db_connection();
$session = authenticate_bearer($pdo);
if (!$session) {
    json_response(['error' => 'Authentication required to update ticket progress.'], 401);
}

$data = get_json_input();
$complaintId = $data['complaintId'] ?? ($data['id'] ?? null);
$remarks = trim($data['remarks'] ?? ($data['progressRemarks'] ?? ''));

if (!$complaintId) {
    json_response(['error' => 'Complaint ID is required.'], 400);
}

$stmt = $pdo->prepare("SELECT * FROM complaints WHERE id = ?");
$stmt->execute([$complaintId]);
$c = $stmt->fetch();

if (!$c) {
    json_response(['error' => "Complaint not found: {$complaintId}"], 404);
}

$up = $pdo->prepare("UPDATE complaints SET progress_remarks = ?, status = 'IN_PROGRESS' WHERE id = ?");
$up->execute([$remarks, $complaintId]);

$stmt->execute([$complaintId]);
json_response(format_complaint($stmt->fetch()));
