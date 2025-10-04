<?php
/**
 * Veridian Private Concierge - Contact Form Handler
 * Handles form submissions and sends emails to tye3to1@outlook.com
 *
 * @version 1.0.0
 * @author Veridian Development Team
 */

// Security headers
header('Content-Type: application/json');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');

// CORS configuration (adjust domain in production)
$allowed_origins = [
    'https://veridianprivate.com',
    'https://www.veridianprivate.com',
    'http://localhost:3000',
    'http://localhost:8000'
];

$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Allow-Credentials: true');
}

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed. Please use POST.'
    ]);
    exit();
}

// Rate limiting (simple implementation)
session_start();
$rate_limit_key = 'form_submission_' . $_SERVER['REMOTE_ADDR'];
$rate_limit_time = 60; // 1 minute between submissions

if (isset($_SESSION[$rate_limit_key]) && (time() - $_SESSION[$rate_limit_key]) < $rate_limit_time) {
    http_response_code(429);
    echo json_encode([
        'success' => false,
        'message' => 'Please wait before submitting another request.'
    ]);
    exit();
}

// Get and validate input
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    $input = $_POST;
}

// Validation function
function validateInput($data) {
    $errors = [];

    // Full Name validation
    if (empty($data['fullName'])) {
        $errors[] = 'Full name is required';
    } elseif (strlen($data['fullName']) < 2) {
        $errors[] = 'Full name must be at least 2 characters';
    } elseif (strlen($data['fullName']) > 100) {
        $errors[] = 'Full name must not exceed 100 characters';
    }

    // Email validation
    if (empty($data['email'])) {
        $errors[] = 'Email is required';
    } elseif (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Invalid email format';
    }

    // Service Interest validation
    if (empty($data['serviceInterest'])) {
        $errors[] = 'Service interest is required';
    }

    // Message validation
    if (empty($data['message'])) {
        $errors[] = 'Message is required';
    } elseif (strlen($data['message']) < 10) {
        $errors[] = 'Message must be at least 10 characters';
    } elseif (strlen($data['message']) > 5000) {
        $errors[] = 'Message must not exceed 5000 characters';
    }

    return $errors;
}

// Sanitize input
function sanitizeInput($data) {
    return [
        'fullName' => htmlspecialchars(strip_tags(trim($data['fullName'] ?? '')), ENT_QUOTES, 'UTF-8'),
        'email' => filter_var(trim($data['email'] ?? ''), FILTER_SANITIZE_EMAIL),
        'serviceInterest' => htmlspecialchars(strip_tags(trim($data['serviceInterest'] ?? '')), ENT_QUOTES, 'UTF-8'),
        'message' => htmlspecialchars(strip_tags(trim($data['message'] ?? '')), ENT_QUOTES, 'UTF-8'),
        'phone' => htmlspecialchars(strip_tags(trim($data['phone'] ?? '')), ENT_QUOTES, 'UTF-8')
    ];
}

// Validate input
$errors = validateInput($input);
if (!empty($errors)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Validation failed',
        'errors' => $errors
    ]);
    exit();
}

// Sanitize input
$data = sanitizeInput($input);

// Email configuration
$to = 'tye3to1@outlook.com';
$subject = 'New Contact Form Submission - Veridian Private Concierge';
$headers = [
    'From: noreply@veridianprivate.com',
    'Reply-To: ' . $data['email'],
    'X-Mailer: PHP/' . phpversion(),
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8'
];

// Create HTML email
$emailBody = '
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Form Submission</title>
    <style>
        body {
            font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #0A1628 0%, #1a2942 100%);
            color: #D4AF37;
            padding: 20px;
            border-radius: 8px 8px 0 0;
            margin: -30px -30px 30px -30px;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-family: "Playfair Display", serif;
        }
        .header p {
            margin: 5px 0 0 0;
            color: #ffffff;
            font-size: 14px;
        }
        .field {
            margin-bottom: 20px;
            padding-bottom: 20px;
            border-bottom: 1px solid #e0e0e0;
        }
        .field:last-child {
            border-bottom: none;
        }
        .label {
            font-weight: 600;
            color: #0A1628;
            margin-bottom: 5px;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .value {
            color: #333;
            font-size: 16px;
            word-wrap: break-word;
        }
        .message-box {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 4px;
            border-left: 4px solid #D4AF37;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #D4AF37;
            text-align: center;
            color: #666;
            font-size: 12px;
        }
        .badge {
            display: inline-block;
            background-color: #D4AF37;
            color: #0A1628;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
            margin-top: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>👑 Veridian Private Concierge</h1>
            <p>New Contact Form Submission</p>
        </div>

        <div class="field">
            <div class="label">Full Name</div>
            <div class="value">' . $data['fullName'] . '</div>
        </div>

        <div class="field">
            <div class="label">Email Address</div>
            <div class="value"><a href="mailto:' . $data['email'] . '" style="color: #D4AF37; text-decoration: none;">' . $data['email'] . '</a></div>
        </div>

        ' . (!empty($data['phone']) ? '
        <div class="field">
            <div class="label">Phone Number</div>
            <div class="value">' . $data['phone'] . '</div>
        </div>
        ' : '') . '

        <div class="field">
            <div class="label">Service Interest</div>
            <div class="value">
                ' . $data['serviceInterest'] . '
                <span class="badge">Priority Lead</span>
            </div>
        </div>

        <div class="field">
            <div class="label">Message</div>
            <div class="message-box">
                ' . nl2br($data['message']) . '
            </div>
        </div>

        <div class="footer">
            <p><strong>Submission Details</strong></p>
            <p>Date: ' . date('F j, Y') . ' at ' . date('g:i A T') . '</p>
            <p>IP Address: ' . $_SERVER['REMOTE_ADDR'] . '</p>
            <p>User Agent: ' . htmlspecialchars($_SERVER['HTTP_USER_AGENT']) . '</p>
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
            <p style="color: #999;">This email was sent from the Veridian Private Concierge contact form.</p>
            <p style="color: #999;">Please respond to the client within 24 hours for optimal service.</p>
        </div>
    </div>
</body>
</html>
';

// Send email
$emailSent = mail($to, $subject, $emailBody, implode("\r\n", $headers));

if ($emailSent) {
    // Update rate limit
    $_SESSION[$rate_limit_key] = time();

    // Log submission (optional - create logs directory)
    $logDir = __DIR__ . '/../logs';
    if (!file_exists($logDir)) {
        mkdir($logDir, 0755, true);
    }

    $logFile = $logDir . '/contact-submissions.log';
    $logEntry = date('Y-m-d H:i:s') . ' | ' . $data['email'] . ' | ' . $data['serviceInterest'] . ' | SUCCESS' . PHP_EOL;
    file_put_contents($logFile, $logEntry, FILE_APPEND);

    // Success response
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Thank you for your inquiry! Our concierge team will contact you within 24 hours.',
        'submissionId' => uniqid('VPC-', true)
    ]);
} else {
    // Log error
    $logDir = __DIR__ . '/../logs';
    if (!file_exists($logDir)) {
        mkdir($logDir, 0755, true);
    }

    $logFile = $logDir . '/contact-errors.log';
    $logEntry = date('Y-m-d H:i:s') . ' | ' . $data['email'] . ' | EMAIL_SEND_FAILED' . PHP_EOL;
    file_put_contents($logFile, $logEntry, FILE_APPEND);

    // Error response
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'We apologize, but there was an error sending your message. Please try again or contact us directly at concierge@veridianprivate.com'
    ]);
}
?>
