<?php
/**
 * ==============================================================================
 * V-RESOLVE: Master API Front-Controller & Dispatcher Router
 * Routes incoming REST requests to designated endpoint controllers.
 * ==============================================================================
 */

require_once __DIR__ . '/db.php';
cors_headers();

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$route = $_GET['route'] ?? '';

if ($route === '') {
    // Extract route after /api/
    $pos = strpos($uri, '/api/');
    if ($pos !== false) {
        $route = substr($uri, $pos + 5);
    } else {
        $route = trim($uri, '/');
    }
}

$route = trim($route, '/');

// Dispatch table
switch ($route) {
    case 'health':
        require __DIR__ . '/health.php';
        break;

    case 'auth/login':
        require __DIR__ . '/auth/login.php';
        break;

    case 'auth/verify':
        require __DIR__ . '/auth/verify.php';
        break;

    case 'auth/logout':
        require __DIR__ . '/auth/logout.php';
        break;

    case 'complaints':
        require __DIR__ . '/complaints/index.php';
        break;

    case 'complaints/progress':
        require __DIR__ . '/complaints/progress.php';
        break;

    case 'complaints/resolve':
        require __DIR__ . '/complaints/resolve.php';
        break;

    case 'complaints/confirm':
        require __DIR__ . '/complaints/confirm.php';
        break;

    case 'complaints/reopen':
        require __DIR__ . '/complaints/reopen.php';
        break;

    case 'complaints/purge':
        require __DIR__ . '/complaints/purge.php';
        break;

    case 'student/track':
        require __DIR__ . '/student/track.php';
        break;

    case 'wardens':
        require __DIR__ . '/wardens/index.php';
        break;

    case 'sms/config':
        require __DIR__ . '/sms/config.php';
        break;

    case 'sms/test':
        require __DIR__ . '/sms/test.php';
        break;

    case 'stats':
        require __DIR__ . '/stats/index.php';
        break;

    default:
        json_response([
            'error' => "Endpoint not found: {$route}",
            'availableEndpoints' => [
                'GET /api/health',
                'POST /api/auth/login',
                'GET /api/auth/verify',
                'POST /api/auth/logout',
                'GET /api/complaints',
                'POST /api/complaints',
                'GET /api/student/track?query=...',
                'POST /api/complaints/progress',
                'POST /api/complaints/resolve',
                'POST /api/complaints/confirm',
                'POST /api/complaints/reopen',
                'POST /api/complaints/purge',
                'GET /api/wardens',
                'POST /api/wardens',
                'GET /api/stats'
            ]
        ], 404);
}
