<?php
/**
 * ==============================================================================
 * V-RESOLVE: WARDENS DIRECTORY & WORKLOAD MANAGEMENT API
 * Supports Appointment, Real-Time Details Modification, and De-Allotment
 * Executive Governance: Dean Ujjaval Gupta & Central Administration
 * ==============================================================================
 */

require_once __DIR__ . '/../db.php';
cors_headers();

$pdo = get_db_connection();
$method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');

// ==============================================================================
// GET: Retrieve All Appointed Wardens
// ==============================================================================
if ($method === 'GET') {
    $count = (int)$pdo->query("SELECT COUNT(*) FROM wardens")->fetchColumn();
    if ($count === 0) {
        $insW = $pdo->prepare("INSERT INTO wardens (id, name, assigned_block, contact) VALUES (?, ?, ?, ?)");
        $insW->execute(['W1', 'Mr. Verma', 'Block C', '+91-98765-00001']);
        $insW->execute(['W2', 'Mrs. Rao', 'Block A', '+91-98765-00002']);
        $insW->execute(['W3', 'Mr. Khan', 'Block B', '+91-98765-00003']);
        $insW->execute(['W4', 'Dr. Suresh Patel', 'Block D', '+91 98765 43219']);
    }

    $stmt = $pdo->query("SELECT id, name, assigned_block AS assignedBlock, contact AS contactNumber FROM wardens ORDER BY id ASC");
    $list = $stmt->fetchAll();
    json_response($list);
}

// ==============================================================================
// DELETE: De-Allot / Remove Warden (Dean Clearance Required)
// ==============================================================================
if ($method === 'DELETE') {
    $session = authenticate_bearer($pdo);
    if (!$session || $session['role'] !== 'ADMIN') {
        json_response(['error' => 'Access Denied: Chief Administrator / Dean authorization required.'], 403);
    }

    $data = get_json_input();
    $id = trim($_GET['id'] ?? ($data['id'] ?? ($data['wardenId'] ?? '')));

    if ($id === '') {
        json_response(['error' => 'Warden ID is required to remove appointment.'], 400);
    }

    $delW = $pdo->prepare("DELETE FROM wardens WHERE id = ?");
    $delW->execute([$id]);

    $delS = $pdo->prepare("DELETE FROM staff_accounts WHERE id = ? OR warden_id = ?");
    $delS->execute([$id, $id]);

    json_response([
        'success' => true,
        'message' => "Warden [{$id}] successfully removed from active directory."
    ]);
}

// ==============================================================================
// POST / PUT: Appoint New Warden OR Modify Existing Warden Details
// ==============================================================================
if ($method === 'POST' || $method === 'PUT') {
    $session = authenticate_bearer($pdo);
    if (!$session || $session['role'] !== 'ADMIN') {
        json_response(['error' => 'Access Denied: Chief Administrator / Dean authorization required.'], 403);
    }

    $data = get_json_input();
    $action = strtolower(trim($data['action'] ?? ($data['type'] ?? '')));
    $isUpdate = ($method === 'PUT') || ($action === 'update') || (!empty($data['isUpdate']));
    $isDelete = ($action === 'delete') || (!empty($data['isDelete']));

    // Support DELETE via POST action
    if ($isDelete) {
        $id = trim($data['id'] ?? ($data['wardenId'] ?? ''));
        if ($id === '') {
            json_response(['error' => 'Warden ID is required to remove appointment.'], 400);
        }
        $delW = $pdo->prepare("DELETE FROM wardens WHERE id = ?");
        $delW->execute([$id]);
        $delS = $pdo->prepare("DELETE FROM staff_accounts WHERE id = ? OR warden_id = ?");
        $delS->execute([$id, $id]);

        json_response([
            'success' => true,
            'message' => "Warden [{$id}] successfully removed from active directory."
        ]);
    }

    $id = trim($data['id'] ?? ($data['wardenId'] ?? ''));
    $name = trim($data['name'] ?? '');
    $block = trim($data['assignedBlock'] ?? ($data['block'] ?? ''));
    $contact = trim($data['contactNumber'] ?? ($data['contact'] ?? ($data['phone'] ?? '+91-98765-00000')));
    $rawPass = trim($data['password'] ?? '');

    if ($id === '' || $name === '' || $block === '') {
        json_response(['error' => 'Missing required warden fields: id, name, and block are mandatory.'], 400);
    }

    // Check if warden already exists in table
    $checkStmt = $pdo->prepare("SELECT * FROM wardens WHERE id = ?");
    $checkStmt->execute([$id]);
    $existingWarden = $checkStmt->fetch();

    // ==========================================================================
    // ACTION: MODIFY EXISTING WARDEN DETAILS
    // ==========================================================================
    if ($isUpdate) {
        // 1. Update wardens table (case-insensitive)
        $upW = $pdo->prepare("UPDATE wardens SET name = ?, assigned_block = ?, contact = ? WHERE LOWER(id) = LOWER(?)");
        $upW->execute([$name, $block, $contact, $id]);

        // If record did not exist in SQL yet, insert it directly
        if ($upW->rowCount() === 0) {
            $insW = $pdo->prepare("INSERT INTO wardens (id, name, assigned_block, contact) VALUES (?, ?, ?, ?)");
            $insW->execute([$id, $name, $block, $contact]);
        }

        // 2. Update staff_accounts table
        if ($rawPass !== '') {
            $passHash = hash('sha256', $rawPass);
            $upS = $pdo->prepare("UPDATE staff_accounts SET name = ?, assigned_block = ?, password_hash = ? WHERE LOWER(id) = LOWER(?) OR LOWER(warden_id) = LOWER(?)");
            $upS->execute([$name, $block, $passHash, $id, $id]);
        } else {
            $upS = $pdo->prepare("UPDATE staff_accounts SET name = ?, assigned_block = ? WHERE LOWER(id) = LOWER(?) OR LOWER(warden_id) = LOWER(?)");
            $upS->execute([$name, $block, $id, $id]);
        }

        // 3. Update any active sessions for this warden
        $upSess = $pdo->prepare("UPDATE sessions SET name = ?, assigned_block = ? WHERE LOWER(user_id) = LOWER(?)");
        $upSess->execute([$name, $block, $id]);

        // 4. Update assigned complaints to reflect new name/block
        $upComp = $pdo->prepare("UPDATE complaints SET warden_name = ?, warden_block = ? WHERE LOWER(warden_id) = LOWER(?)");
        $upComp->execute([$name, $block, $id]);

        json_response([
            'success' => true,
            'action' => 'update',
            'message' => "Warden {$name} ({$id}) details updated successfully.",
            'warden' => [
                'id' => $id,
                'name' => $name,
                'assignedBlock' => $block,
                'contactNumber' => $contact
            ]
        ]);
    }

    // ==========================================================================
    // ACTION: APPOINT NEW WARDEN (CREATE ONLY - NEVER OVERWRITES PREVIOUS WARDENS)
    // ==========================================================================
    // Check if warden ID already exists; if so, auto-assign next unique ID (W5, W6, etc.)
    $checkStmt = $pdo->prepare("SELECT id FROM wardens WHERE LOWER(id) = LOWER(?)");
    $checkStmt->execute([$id]);
    if ($checkStmt->fetch()) {
        $allWardens = $pdo->query("SELECT id FROM wardens")->fetchAll(PDO::FETCH_COLUMN);
        $maxNum = 4;
        foreach ($allWardens as $wid) {
            if (preg_match('/^W(\d+)$/i', $wid, $m)) {
                $num = intval($m[1]);
                if ($num > $maxNum) $maxNum = $num;
            }
        }
        $id = 'W' . ($maxNum + 1);
    }

    $defaultPass = defined('STAFF_UNIVERSAL_PASSWORD') ? STAFF_UNIVERSAL_PASSWORD : 'vitbhopal';
    if ($rawPass === '') $rawPass = $defaultPass;

    // 1. Insert into wardens table
    if ($pdo->getAttribute(PDO::ATTR_DRIVER_NAME) === 'sqlite') {
        $insW = $pdo->prepare("INSERT OR REPLACE INTO wardens (id, name, assigned_block, contact) VALUES (?, ?, ?, ?)");
    } else {
        $insW = $pdo->prepare("INSERT INTO wardens (id, name, assigned_block, contact) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE name=VALUES(name), assigned_block=VALUES(assigned_block), contact=VALUES(contact)");
    }
    $insW->execute([$id, $name, $block, $contact]);

    // 2. Register staff login credentials in staff_accounts
    $passHash = hash('sha256', $rawPass);
    $usernames = [strtolower($id)];
    if (strtoupper($id) !== strtolower($id)) {
        $usernames[] = strtoupper($id);
    }

    foreach ($usernames as $u) {
        if ($pdo->getAttribute(PDO::ATTR_DRIVER_NAME) === 'sqlite') {
            $insS = $pdo->prepare("INSERT OR REPLACE INTO staff_accounts (id, username, password_hash, name, role, assigned_block, warden_id) VALUES (?, ?, ?, ?, 'WARDEN', ?, ?)");
        } else {
            $insS = $pdo->prepare("INSERT INTO staff_accounts (id, username, password_hash, name, role, assigned_block, warden_id) VALUES (?, ?, ?, ?, 'WARDEN', ?, ?) ON DUPLICATE KEY UPDATE password_hash=VALUES(password_hash), name=VALUES(name), assigned_block=VALUES(assigned_block)");
        }
        $insS->execute([$id, $u, $passHash, $name, $block, $id]);
    }

    json_response([
        'success' => true,
        'action' => 'create',
        'message' => "Warden {$name} ({$id}) successfully appointed and registered.",
        'warden' => [
            'id' => $id,
            'name' => $name,
            'assignedBlock' => $block,
            'contactNumber' => $contact
        ],
        'credentials' => [
            'username' => strtolower($id),
            'password' => $rawPass
        ]
    ], 201);
}

json_response(['error' => 'Method Not Allowed'], 405);
