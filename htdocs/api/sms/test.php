<?php
/**
 * ==============================================================================
 * V-RESOLVE: REAL SMS TEST DISPATCH ENDPOINT
 * Allows Deanery to send a real test SMS to verify phone delivery
 * ==============================================================================
 */

require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../sms_service.php';
cors_headers();

$pdo = get_db_connection();
$method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');

if ($method !== 'POST') {
    json_response(['error' => 'Method Not Allowed'], 405);
}

$session = authenticate_bearer($pdo);
if (!$session || $session['role'] !== 'ADMIN') {
    json_response(['error' => 'Access Denied: Chief Administrator / Dean authorization required.'], 403);
}

$data = get_json_input();
$phone = trim($data['phoneNumber'] ?? ($data['phone'] ?? ($data['recipient'] ?? '')));
$customMessage = trim($data['message'] ?? '');

// Auto-persist credentials submitted during test
$submittedProvider = trim($data['provider'] ?? '');
$submittedFastKey = trim($data['fast2smsKey'] ?? ($data['apiKey'] ?? ''));
$submittedTwilioSid = trim($data['twilioSid'] ?? '');
$submittedTwilioToken = trim($data['twilioToken'] ?? '');
$submittedTwilioFrom = trim($data['twilioFrom'] ?? '');
$submittedTextlocalKey = trim($data['textlocalKey'] ?? '');
$submittedCustomUrl = trim($data['customUrl'] ?? '');

if ($submittedProvider !== '') {
    set_system_setting($pdo, 'SMS_GATEWAY_PROVIDER', $submittedProvider);
}
if ($submittedFastKey !== '') {
    set_system_setting($pdo, 'FAST2SMS_API_KEY', $submittedFastKey);
}
if ($submittedTwilioSid !== '') {
    set_system_setting($pdo, 'TWILIO_ACCOUNT_SID', $submittedTwilioSid);
}
if ($submittedTwilioToken !== '') {
    set_system_setting($pdo, 'TWILIO_AUTH_TOKEN', $submittedTwilioToken);
}
if ($submittedTwilioFrom !== '') {
    set_system_setting($pdo, 'TWILIO_FROM', $submittedTwilioFrom);
}
if ($submittedTextlocalKey !== '') {
    set_system_setting($pdo, 'TEXTLOCAL_API_KEY', $submittedTextlocalKey);
}
if ($submittedCustomUrl !== '') {
    set_system_setting($pdo, 'SMS_GATEWAY_URL', $submittedCustomUrl);
}

if ($phone === '') {
    json_response(['error' => 'Please provide a valid recipient phone number.'], 400);
}

$cleanDigits = preg_replace('/\D/', '', $phone);
if (strlen($cleanDigits) < 10) {
    json_response(['error' => 'Phone number must have at least 10 digits. Provided: ' . $phone], 400);
}

$testMsg = $customMessage !== '' ? $customMessage : "VIT Bhopal V-RESOLVE: Test notification dispatched by Dean Ujjaval Gupta to verify real SMS delivery. Your hostel grievance alert system is active.";

$result = send_real_sms($pdo, $phone, $testMsg, 'Dean Administrator', 'TEST', 'TEST');

json_response([
    'success' => $result['sent'],
    'provider' => $result['provider'],
    'status' => $result['status'],
    'message' => $result['sent']
        ? "Real SMS successfully dispatched to {$phone} via {$result['provider']}!"
        : ($result['note'] ?: "SMS dispatch simulated."),
    'result' => $result
]);
