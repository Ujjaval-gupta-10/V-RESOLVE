<?php
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../sms_service.php';
cors_headers();

$pdo = get_db_connection();
$method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');

// ==============================================================================
// GET: Restricted to Staff (Warden / Dean)
// ==============================================================================
if ($method === 'GET') {
    $session = authenticate_bearer($pdo);
    if (!$session) {
        json_response(['error' => 'Authentication required to view master grievances register.'], 401);
    }

    $assignedBlock = $session['assigned_block'];
    $role = $session['role'];
    $wardenId = $session['warden_id'] ?? ($session['user_id'] ?? '');

    // Wardens only see tickets within their jurisdiction
    if ($role === 'WARDEN' && $assignedBlock !== 'All Blocks') {
        $cleanBlock = trim($assignedBlock);
        $blockLetter = trim(str_ireplace('Block', '', $cleanBlock));
        $prefix = $blockLetter . '%';
        $roomLike = '%' . $blockLetter . '%';

        $stmt = $pdo->prepare("SELECT * FROM complaints WHERE 
            LOWER(warden_block) = LOWER(?) 
            OR warden_id = ? 
            OR student_room LIKE ? 
            OR student_room LIKE ? 
            ORDER BY submitted_at DESC");
        $stmt->execute([$cleanBlock, $wardenId, $prefix, $roomLike]);
    } else {
        // Admin / Dean sees all complaints
        $stmt = $pdo->query("SELECT * FROM complaints ORDER BY submitted_at DESC");
    }

    $rows = $stmt->fetchAll();
    $list = array_map('format_complaint', $rows);
    json_response($list);
}

// ==============================================================================
// POST: Public Student Grievance Submission
// ==============================================================================
if ($method === 'POST') {
    $data = get_json_input();

    $name = trim($data['studentName'] ?? '');
    $roll = trim($data['studentId'] ?? '');
    $room = trim($data['studentRoom'] ?? '');
    $contact = trim($data['studentContact'] ?? '');
    $category = trim($data['category'] ?? 'GENERAL');
    $description = trim($data['description'] ?? '');

    if ($name === '' || $roll === '' || $room === '' || $description === '') {
        json_response(['error' => 'Missing required fields: studentName, studentId, studentRoom, and description are mandatory.'], 400);
    }

    // Dynamically match room to appointed block wardens
    $upperRoom = strtoupper($room);
    $allWardens = $pdo->query("SELECT * FROM wardens ORDER BY id ASC")->fetchAll();
    $targetBlock = 'Block C';
    $matchedWarden = null;

    foreach ($allWardens as $w) {
        $wBlock = $w['assigned_block'];
        $wLetter = trim(str_ireplace('Block', '', $wBlock));
        if ($wLetter !== '' && (
            str_starts_with($upperRoom, $wLetter) ||
            str_contains($upperRoom, 'BLOCK ' . strtoupper($wLetter)) ||
            str_contains($upperRoom, strtoupper($wBlock)) ||
            str_starts_with($upperRoom, strtoupper($wBlock))
        )) {
            $matchedWarden = $w;
            $targetBlock = $wBlock;
            break;
        }
    }

    if (!$matchedWarden && count($allWardens) > 0) {
        $matchedWarden = $allWardens[0];
        $targetBlock = $matchedWarden['assigned_block'];
    }

    $wardenId = $matchedWarden ? $matchedWarden['id'] : 'W1';
    $wardenName = $matchedWarden ? $matchedWarden['name'] : 'Mr. Verma';
    $wardenBlock = $targetBlock;

    $id = generate_complaint_id($pdo);
    $now = date('c');

    $ins = $pdo->prepare("INSERT INTO complaints (
        id, student_id, student_name, student_room, student_contact,
        category, description, status, submitted_at,
        warden_id, warden_name, warden_block, escalated,
        progress_remarks, resolution_notes, rating, feedback_comment, reopen_reason
    ) VALUES (?, ?, ?, ?, ?, ?, ?, 'ASSIGNED', ?, ?, ?, ?, 0, '', '', 0, '', '')");

    $ins->execute([
        $id, $roll, $name, $room, $contact,
        $category, $description, $now,
        $wardenId, $wardenName, $wardenBlock
    ]);

    // Fetch created record
    $fetchStmt = $pdo->prepare("SELECT * FROM complaints WHERE id = ?");
    $fetchStmt->execute([$id]);
    $created = format_complaint($fetchStmt->fetch());

    // Real Telco SMS Dispatch & Simulation Fallback
    $smsText = "VIT Bhopal V-RESOLVE: Dear {$name}, your grievance [{$id}] for {$category} in Room {$room} has been registered under 24h SLA. Assigned: {$wardenName} ({$wardenBlock}). Track: v-resolve.kesug.com/#track";
    $smsResult = send_real_sms($pdo, $contact, $smsText, $name, $id, 'LODGED');

    json_response([
        'complaint' => $created,
        'smsNotification' => [
            'recipient' => $contact,
            'studentName' => $name,
            'type' => 'LODGED',
            'message' => $smsText,
            'timestamp' => $now,
            'status' => $smsResult['sent'] ? 'DELIVERED_REAL_SMS' : 'DELIVERED',
            'realSms' => $smsResult
        ]
    ], 201);
}

json_response(['error' => 'Method Not Allowed'], 405);
