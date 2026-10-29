<?php
/**
 * ==============================================================================
 * V-RESOLVE: SMS GATEWAY CONFIGURATION ENDPOINT
 * Allows Deanery to view and update SMS provider settings
 * ==============================================================================
 */

require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../sms_service.php';
cors_headers();

$pdo = get_db_connection();
$method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');

// ==============================================================================
// GET: Current SMS Status & Gateway Settings
// ==============================================================================
if ($method === 'GET') {
    $session = authenticate_bearer($pdo);
    if (!$session || $session['role'] !== 'ADMIN') {
        json_response(['error' => 'Deanery authorization required to view SMS configuration.'], 403);
    }

    $provider = get_system_setting($pdo, 'SMS_GATEWAY_PROVIDER', 'FAST2SMS');
    $fast2smsKey = get_system_setting($pdo, 'FAST2SMS_API_KEY', getenv('FAST2SMS_API_KEY') ?: '');
    $twilioSid = get_system_setting($pdo, 'TWILIO_ACCOUNT_SID', getenv('TWILIO_ACCOUNT_SID') ?: '');
    $twilioFrom = get_system_setting($pdo, 'TWILIO_FROM', getenv('TWILIO_FROM') ?: '');
    $textlocalKey = get_system_setting($pdo, 'TEXTLOCAL_API_KEY', getenv('TEXTLOCAL_API_KEY') ?: '');
    $customUrl = get_system_setting($pdo, 'SMS_GATEWAY_URL', getenv('SMS_GATEWAY_URL') ?: '');

    // Get SMS dispatch statistics
    $stats = [
        'totalDispatched' => 0,
        'realDelivered' => 0,
        'simulated' => 0
    ];

    try {
        $stats['totalDispatched'] = (int)$pdo->query("SELECT COUNT(*) FROM sms_logs")->fetchColumn();
        $stats['realDelivered'] = (int)$pdo->query("SELECT COUNT(*) FROM sms_logs WHERE status = 'DELIVERED_REAL_SMS'")->fetchColumn();
        $stats['simulated'] = (int)$pdo->query("SELECT COUNT(*) FROM sms_logs WHERE status = 'SIMULATED'")->fetchColumn();
    } catch (Exception $e) {}

    // Mask secret keys for security
    $mask = function($str) {
        if (!$str || strlen($str) < 6) return $str ? '******' : '';
        return substr($str, 0, 4) . str_repeat('*', strlen($str) - 8) . substr($str, -4);
    };

    json_response([
        'success' => true,
        'config' => [
            'provider' => $provider,
            'hasFast2smsKey' => !empty($fast2smsKey),
            'fast2smsKeyMasked' => $mask($fast2smsKey),
            'hasTwilio' => (!empty($twilioSid) && !empty($twilioFrom)),
            'twilioSidMasked' => $mask($twilioSid),
            'twilioFrom' => $twilioFrom,
            'hasTextlocal' => !empty($textlocalKey),
            'textlocalKeyMasked' => $mask($textlocalKey),
            'customUrl' => $customUrl
        ],
        'stats' => $stats
    ]);
}

// ==============================================================================
// POST: Save SMS Gateway Configuration (Dean Only)
// ==============================================================================
if ($method === 'POST') {
    $session = authenticate_bearer($pdo);
    if (!$session || $session['role'] !== 'ADMIN') {
        json_response(['error' => 'Access Denied: Chief Administrator / Dean authorization required.'], 403);
    }

    $data = get_json_input();
    $provider = trim($data['provider'] ?? 'FAST2SMS');
    $fast2smsKey = trim($data['fast2smsKey'] ?? '');
    $twilioSid = trim($data['twilioSid'] ?? '');
    $twilioToken = trim($data['twilioToken'] ?? '');
    $twilioFrom = trim($data['twilioFrom'] ?? '');
    $textlocalKey = trim($data['textlocalKey'] ?? '');
    $customUrl = trim($data['customUrl'] ?? '');

    if ($provider) set_system_setting($pdo, 'SMS_GATEWAY_PROVIDER', $provider);
    if ($fast2smsKey !== '') set_system_setting($pdo, 'FAST2SMS_API_KEY', $fast2smsKey);
    if ($twilioSid !== '') set_system_setting($pdo, 'TWILIO_ACCOUNT_SID', $twilioSid);
    if ($twilioToken !== '') set_system_setting($pdo, 'TWILIO_AUTH_TOKEN', $twilioToken);
    if ($twilioFrom !== '') set_system_setting($pdo, 'TWILIO_FROM', $twilioFrom);
    if ($textlocalKey !== '') set_system_setting($pdo, 'TEXTLOCAL_API_KEY', $textlocalKey);
    if ($customUrl !== '') set_system_setting($pdo, 'SMS_GATEWAY_URL', $customUrl);

    json_response([
        'success' => true,
        'message' => 'Real SMS gateway settings saved successfully in system database.'
    ]);
}

json_response(['error' => 'Method Not Allowed'], 405);
