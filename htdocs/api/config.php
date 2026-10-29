<?php
/**
 * ==============================================================================
 * V-RESOLVE: Central Environment Configuration & Secret Key Loader
 * Supports .env files for InfinityFree / Apache / Shared Hosting / Localhost
 * Lead Software Architect: Ujjaval Gupta (Reg No: 25BAI11102)
 * ==============================================================================
 */

// Function to load and parse .env files if present
function load_env_variables() {
    $searchPaths = [
        __DIR__ . '/.env',          // web/api/.env
        __DIR__ . '/../.env',       // web/.env (recommended for InfinityFree htdocs)
        __DIR__ . '/../../.env'     // project root .env
    ];

    foreach ($searchPaths as $path) {
        if (file_exists($path) && is_readable($path)) {
            $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            foreach ($lines as $line) {
                $line = trim($line);
                if ($line === '' || str_starts_with($line, '#')) {
                    continue;
                }
                if (strpos($line, '=') !== false) {
                    list($name, $value) = explode('=', $line, 2);
                    $name = trim($name);
                    $value = trim($value);

                    // Strip surrounding quotes if present
                    if ((str_starts_with($value, '"') && str_ends_with($value, '"')) ||
                        (str_starts_with($value, "'") && str_ends_with($value, "'"))) {
                        $value = substr($value, 1, -1);
                    }

                    if (getenv($name) === false) {
                        putenv("{$name}={$value}");
                        $_ENV[$name] = $value;
                        $_SERVER[$name] = $value;
                    }
                }
            }
            break; // Stop after first valid .env file found
        }
    }
}

// Load environment variables from .env
load_env_variables();

// ==============================================================================
// DATABASE CREDENTIALS (from .env or defaults)
// ==============================================================================
define('DB_HOST', getenv('DB_HOST') ?: 'sql103.infinityfree.com');
define('DB_NAME', getenv('DB_NAME') ?: 'if0_42855609_grievance');
define('DB_USER', getenv('DB_USER') ?: 'if0_42855609');
define('DB_PASS', getenv('DB_PASS') !== false && getenv('DB_PASS') !== '' ? getenv('DB_PASS') : 'Linux9060');
define('DB_PORT', (int)(getenv('DB_PORT') ?: 3306));
define('DB_CHARSET', getenv('DB_CHARSET') ?: 'utf8mb4');

// Fallback SQLite Database file
define('SQLITE_FILE', __DIR__ . '/../../data/grievances.db');

// ==============================================================================
// SECRET KEYS & SECURITY TOKENS (from .env)
// ==============================================================================
define('APP_SECRET', getenv('APP_SECRET') ?: 'c8e6a1f4b2389d4e5f7a0123c89bdf145890abce3412567890abcdef12345678');
define('JWT_SECRET', getenv('JWT_SECRET') ?: 'vitbhopal_vresolve_jwt_secret_key_2026_ujjaval_gupta');

// Staff Universal Access Password (Default: vitbhopal)
define('STAFF_UNIVERSAL_PASSWORD', getenv('STAFF_UNIVERSAL_PASSWORD') ?: 'vitbhopal');
define('STAFF_PASSWORD_HASH', getenv('STAFF_PASSWORD_HASH') ?: '624f7275f7b6c227b94e2632b0be1d880cd4cbe1e483203d655d351f89b83422');

// SLA & Lifecycle
define('SLA_CRITICAL_HOURS', (int)(getenv('SLA_CRITICAL_HOURS') ?: 24));
define('PURGE_RESOLVED_AFTER_DAYS', (int)(getenv('PURGE_RESOLVED_AFTER_DAYS') ?: 7));
