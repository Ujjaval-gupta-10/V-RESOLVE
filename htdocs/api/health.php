<?php
require_once __DIR__ . '/db.php';
cors_headers();

try {
    $pdo = get_db_connection();
    $driver = $pdo->getAttribute(PDO::ATTR_DRIVER_NAME);
    json_response([
        'status' => 'UP',
        'database' => 'CONNECTED',
        'engine' => strtoupper($driver),
        'timestamp' => date('c'),
        'service' => 'VIT Bhopal Hostel Grievance & SLA Management System'
    ]);
} catch (Exception $e) {
    json_response([
        'status' => 'DEGRADED',
        'database' => 'ERROR',
        'error' => $e->getMessage()
    ], 500);
}
