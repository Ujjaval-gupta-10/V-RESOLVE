<?php
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../sms_service.php';
cors_headers();

if (strtoupper($_SERVER['REQUEST_METHOD']) !== 'POST') {
    json_response(['error' => 'Method Not Allowed'], 405);
}

$pdo = get_db_connection();
$session = authenticate_bearer($pdo);
if (!$session) {
    json_response(['error' => 'Staff clearance required to mark complaint resolved.'], 401);
}

$data = get_json_input();
$complaintId = $data['complaintId'] ?? ($data['id'] ?? null);
$notes = trim($data['resolutionNotes'] ?? ($data['notes'] ?? ''));

if (!$complaintId) {
    json_response(['error' => 'Complaint ID is required.'], 400);
}

$stmt = $pdo->prepare("SELECT * FROM complaints WHERE id = ?");
$stmt->execute([$complaintId]);
$c = $stmt->fetch();

if (!$c) {
    json_response(['error' => "Complaint not found: {$complaintId}"], 404);
}

$now = date('c');
$up = $pdo->prepare("UPDATE complaints SET resolution_notes = ?, status = 'RESOLVED', resolved_at = ? WHERE id = ?");
$up->execute([$notes, $now, $complaintId]);

$stmt->execute([$complaintId]);
$updated = format_complaint($stmt->fetch());

// Real Telco SMS Dispatch & Simulation Fallback
$studentContact = $updated['student']['contactNumber'] ?? ($updated['student']['contact'] ?? '');
$studentName = $updated['student']['name'] ?? 'Resident';
$room = $updated['student']['roomNumber'] ?? '';
$wardenName = $session['name'] ?? ($updated['assignedWarden']['name'] ?? 'Hostel Office');

$smsText = "VIT Bhopal V-RESOLVE: Dear {$studentName}, your grievance [{$complaintId}] (Room {$room}) has been marked RESOLVED by {$wardenName}. Notes: {$notes}. Please rate resolution quality: v-resolve.kesug.com/#track";

$smsResult = send_real_sms($pdo, $studentContact, $smsText, $studentName, $complaintId, 'RESOLVED');

$updated['smsNotification'] = [
    'recipient' => $studentContact,
    'studentName' => $studentName,
    'type' => 'RESOLVED',
    'message' => $smsText,
    'timestamp' => $now,
    'status' => $smsResult['sent'] ? 'DELIVERED_REAL_SMS' : 'DELIVERED',
    'realSms' => $smsResult
];

json_response($updated);
