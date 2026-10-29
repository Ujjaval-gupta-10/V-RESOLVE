<?php
require_once __DIR__ . '/../db.php';
cors_headers();

$pdo = get_db_connection();
$session = authenticate_bearer($pdo);

if (!$session) {
    json_response(['valid' => false, 'error' => 'Unauthenticated or session expired.'], 401);
}

json_response([
    'valid' => true,
    'user' => [
        'id' => $session['user_id'],
        'username' => $session['username'],
        'name' => $session['name'],
        'role' => $session['role'],
        'assignedBlock' => $session['assigned_block']
    ]
]);
