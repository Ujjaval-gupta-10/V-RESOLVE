<?php
require_once __DIR__ . '/../db.php';
cors_headers();

if (strtoupper($_SERVER['REQUEST_METHOD']) !== 'POST') {
    json_response(['error' => 'Method Not Allowed'], 405);
}

$pdo = get_db_connection();
$data = get_json_input();
$complaintId = $data['complaintId'] ?? ($data['id'] ?? null);
$rating = (int)($data['rating'] ?? 5);
if ($rating < 1) $rating = 1;
if ($rating > 5) $rating = 5;
$feedback = trim($data['feedback'] ?? ($data['feedbackComment'] ?? 'Satisfied with resolution.'));

if (!$complaintId) {
    json_response(['error' => 'Complaint ID is required.'], 400);
}

$stmt = $pdo->prepare("SELECT * FROM complaints WHERE id = ?");
$stmt->execute([$complaintId]);
$c = $stmt->fetch();

if (!$c) {
    json_response(['error' => "Complaint not found: {$complaintId}"], 404);
}

$up = $pdo->prepare("UPDATE complaints SET status = 'CONFIRMED', rating = ?, feedback_comment = ? WHERE id = ?");
$up->execute([$rating, $feedback, $complaintId]);

$stmt->execute([$complaintId]);
$confirmed = format_complaint($stmt->fetch());

json_response($confirmed);
