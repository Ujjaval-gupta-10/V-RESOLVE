<?php
/**
 * ==============================================================================
 * V-RESOLVE: REAL TELCO SMS GATEWAY SERVICE & DISPATCH ENGINE
 * Author: Ujjaval Gupta (Reg No: 25BAI11102) & Antigravity Agentic Engine
 * 
 * Supports:
 *  1. Fast2SMS (India Quick SMS / OTP / Transactional)
 *  2. Twilio (Global SMS)
 *  3. Textlocal (India)
 *  4. Custom HTTP Webhook / SMS Gateway Template
 *  5. Graceful Telco Simulation Fallback
 * ==============================================================================
 */

require_once __DIR__ . '/db.php';

/**
 * Normalizes phone numbers for SMS gateways
 * Extracts 10-digit Indian numbers or E.164 international format
 */
function clean_phone_for_sms(string $rawNumber, string $provider = 'fast2sms'): string {
    $digits = preg_replace('/\D/', '', $rawNumber);

    if ($provider === 'fast2sms' || $provider === 'textlocal') {
        // Fast2SMS and Textlocal primarily require 10-digit Indian numbers
        if (strlen($digits) === 12 && str_starts_with($digits, '91')) {
            return substr($digits, 2);
        }
        if (strlen($digits) === 11 && str_starts_with($digits, '0')) {
            return substr($digits, 1);
        }
        if (strlen($digits) === 10) {
            return $digits;
        }
        // Fallback: take the last 10 digits if longer
        if (strlen($digits) > 10) {
            return substr($digits, -10);
        }
        return $digits;
    }

    if ($provider === 'twilio') {
        // Twilio requires E.164 (+919876543210)
        if (str_starts_with($rawNumber, '+')) {
            return '+' . $digits;
        }
        if (strlen($digits) === 10) {
            return '+91' . $digits;
        }
        if (strlen($digits) === 12 && str_starts_with($digits, '91')) {
            return '+' . $digits;
        }
        return '+' . $digits;
    }

    return $digits;
}

/**
 * Send a real SMS via configured SMS gateway
 */
function send_real_sms(PDO $pdo, string $recipient, string $message, string $studentName = '', string $ticketId = '', string $type = 'LODGED'): array {
    $now = date('c');

    // 1. Determine active provider & credentials (check system_settings first, then .env/config)
    $dbProvider = get_system_setting($pdo, 'SMS_GATEWAY_PROVIDER', '');
    $fast2smsKey = get_system_setting($pdo, 'FAST2SMS_API_KEY', getenv('FAST2SMS_API_KEY') ?: '');
    $twilioSid = get_system_setting($pdo, 'TWILIO_ACCOUNT_SID', getenv('TWILIO_ACCOUNT_SID') ?: '');
    $twilioToken = get_system_setting($pdo, 'TWILIO_AUTH_TOKEN', getenv('TWILIO_AUTH_TOKEN') ?: '');
    $twilioFrom = get_system_setting($pdo, 'TWILIO_FROM', getenv('TWILIO_FROM') ?: '');
    $textlocalKey = get_system_setting($pdo, 'TEXTLOCAL_API_KEY', getenv('TEXTLOCAL_API_KEY') ?: '');
    $customUrl = get_system_setting($pdo, 'SMS_GATEWAY_URL', getenv('SMS_GATEWAY_URL') ?: '');

    // Auto-detect provider if not explicitly specified
    $provider = 'SIMULATION';
    if ($dbProvider !== '' && $dbProvider !== 'SIMULATION') {
        $provider = strtoupper($dbProvider);
    } elseif ($fast2smsKey !== '') {
        $provider = 'FAST2SMS';
    } elseif ($twilioSid !== '' && $twilioToken !== '') {
        $provider = 'TWILIO';
    } elseif ($textlocalKey !== '') {
        $provider = 'TEXTLOCAL';
    } elseif ($customUrl !== '') {
        $provider = 'CUSTOM';
    }

    $smsResult = [
        'sent' => false,
        'provider' => $provider,
        'recipient' => $recipient,
        'status' => 'SIMULATED',
        'message' => $message,
        'timestamp' => $now,
        'response' => null,
        'note' => ''
    ];

    // =========================================================================
    // PROVIDER 1: FAST2SMS (India Quick SMS)
    // =========================================================================
    if ($provider === 'FAST2SMS' && $fast2smsKey !== '') {
        $fast2smsKey = trim($fast2smsKey, " \t\n\r\0\x0B\"'");
        $cleanPhone = clean_phone_for_sms($recipient, 'fast2sms');

        if (strlen($cleanPhone) === 10) {
            $postData = json_encode([
                'route' => 'q',
                'message' => $message,
                'language' => 'english',
                'flash' => 0,
                'numbers' => $cleanPhone
            ]);

            $ch = curl_init('https://www.fast2sms.com/dev/bulkV2');
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'authorization: ' . $fast2smsKey,
                'Content-Type: application/json',
                'Accept: application/json'
            ]);
            curl_setopt($ch, CURLOPT_TIMEOUT, 10);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

            $rawResponse = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $curlError = curl_error($ch);
            curl_close($ch);

            $parsed = $rawResponse ? json_decode($rawResponse, true) : null;

            if ($httpCode === 200 && $parsed && !empty($parsed['return'])) {
                $smsResult['sent'] = true;
                $smsResult['status'] = 'DELIVERED_REAL_SMS';
                $smsResult['response'] = $parsed;
                $smsResult['note'] = 'Real SMS successfully dispatched to ' . $cleanPhone . ' via Fast2SMS.';
            } else {
                $smsResult['status'] = 'GATEWAY_ERROR';
                $smsResult['response'] = $parsed ?: $rawResponse ?: $curlError;
                $detail = '';
                if ($parsed && !empty($parsed['message'])) {
                    $detail = is_array($parsed['message']) ? implode(', ', $parsed['message']) : strval($parsed['message']);
                } elseif ($curlError) {
                    $detail = 'cURL Error: ' . $curlError;
                } elseif ($rawResponse) {
                    $detail = is_string($rawResponse) ? substr($rawResponse, 0, 150) : json_encode($rawResponse);
                }
                $smsResult['note'] = 'Fast2SMS Error: ' . ($detail ?: 'Invalid API Key or Insufficient Balance') . '. Check Dev API Key & wallet on fast2sms.com.';
            }
        } else {
            $smsResult['note'] = 'Recipient phone number must be exactly 10 digits for Fast2SMS. Given: ' . $recipient;
        }
    }

    // =========================================================================
    // PROVIDER 2: TWILIO (Global)
    // =========================================================================
    elseif ($provider === 'TWILIO' && $twilioSid !== '' && $twilioToken !== '' && $twilioFrom !== '') {
        $e164Phone = clean_phone_for_sms($recipient, 'twilio');

        $url = "https://api.twilio.com/2010-04-01/Accounts/{$twilioSid}/Messages.json";
        $postFields = http_build_query([
            'To' => $e164Phone,
            'From' => $twilioFrom,
            'Body' => $message
        ]);

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $postFields);
        curl_setopt($ch, CURLOPT_USERPWD, "{$twilioSid}:{$twilioToken}");
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

        $rawResponse = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        $parsed = $rawResponse ? json_decode($rawResponse, true) : null;

        if (($httpCode === 200 || $httpCode === 201) && $parsed && empty($parsed['error_code'])) {
            $smsResult['sent'] = true;
            $smsResult['status'] = 'DELIVERED_REAL_SMS';
            $smsResult['response'] = $parsed;
            $smsResult['note'] = 'Real SMS successfully dispatched to ' . $e164Phone . ' via Twilio.';
        } else {
            $smsResult['status'] = 'GATEWAY_ERROR';
            $smsResult['response'] = $parsed ?: $rawResponse;
            $err = $parsed['message'] ?? ($parsed['error_message'] ?? 'Twilio dispatch rejected');
            $smsResult['note'] = 'Twilio Error: ' . $err;
        }
    }

    // =========================================================================
    // PROVIDER 3: TEXTLOCAL (India)
    // =========================================================================
    elseif ($provider === 'TEXTLOCAL' && $textlocalKey !== '') {
        $cleanPhone = clean_phone_for_sms($recipient, 'textlocal');
        $sender = get_system_setting($pdo, 'TEXTLOCAL_SENDER', 'TXTLCL');

        $postFields = http_build_query([
            'apikey' => $textlocalKey,
            'numbers' => '91' . $cleanPhone,
            'message' => rawurlencode($message),
            'sender' => $sender
        ]);

        $ch = curl_init('https://api.textlocal.in/send/');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $postFields);
        curl_setopt($ch, CURLOPT_TIMEOUT, 8);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

        $rawResponse = curl_exec($ch);
        curl_close($ch);

        $parsed = $rawResponse ? json_decode($rawResponse, true) : null;

        if ($parsed && !empty($parsed['status']) && $parsed['status'] === 'success') {
            $smsResult['sent'] = true;
            $smsResult['status'] = 'DELIVERED_REAL_SMS';
            $smsResult['response'] = $parsed;
            $smsResult['note'] = 'Real SMS dispatched via Textlocal.';
        } else {
            $smsResult['status'] = 'GATEWAY_ERROR';
            $smsResult['response'] = $parsed ?: $rawResponse;
        }
    }

    // =========================================================================
    // PROVIDER 4: CUSTOM HTTP GATEWAY / WEBHOOK URL
    // =========================================================================
    elseif ($provider === 'CUSTOM' && $customUrl !== '') {
        $cleanPhone = clean_phone_for_sms($recipient, 'custom');
        $targetUrl = str_replace(
            ['{phone}', '{number}', '{message}', '{text}'],
            [urlencode($cleanPhone), urlencode($cleanPhone), urlencode($message), urlencode($message)],
            $customUrl
        );

        $ch = curl_init($targetUrl);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 8);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        $rawResponse = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode >= 200 && $httpCode < 300) {
            $smsResult['sent'] = true;
            $smsResult['status'] = 'DELIVERED_REAL_SMS';
            $smsResult['response'] = $rawResponse;
        } else {
            $smsResult['status'] = 'GATEWAY_ERROR';
            $smsResult['response'] = $rawResponse;
        }
    }

    // =========================================================================
    // FALLBACK SIMULATION (When API Key is not set or during testing)
    // =========================================================================
    if (!$smsResult['sent']) {
        if ($smsResult['status'] === 'SIMULATED') {
            $smsResult['note'] = 'Real SMS gateway not yet configured with an active API Key. Real-time browser simulation and Web Audio chime triggered.';
        }
    }

    // Record log in sms_logs table
    try {
        $logId = 'SMS' . round(microtime(true) * 1000) . rand(10, 99);
        $insLog = $pdo->prepare("INSERT INTO sms_logs (id, ticket_id, recipient, student_name, sms_type, message, provider, status, response_data) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $insLog->execute([
            $logId,
            $ticketId ?: null,
            $recipient,
            $studentName ?: null,
            $type,
            $message,
            $provider,
            $smsResult['status'],
            is_string($smsResult['response']) ? $smsResult['response'] : json_encode($smsResult['response'])
        ]);
    } catch (Exception $e) {}

    return $smsResult;
}
