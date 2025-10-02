# Veridian Private Concierge - Contact Form API

Real-time contact form backend that sends submissions to **tye3to1@outlook.com**

## 🚀 Features

- ✅ Real-time email notifications to tye3to1@outlook.com
- ✅ Server-side validation
- ✅ Rate limiting (1 request per minute)
- ✅ CORS configuration
- ✅ Security headers
- ✅ Request logging
- ✅ Beautiful HTML email templates
- ✅ Both PHP and Node.js implementations

## 📦 Installation

### Option 1: Node.js Backend (Recommended)

```bash
cd api
npm install
```

### Option 2: PHP Backend

Requires PHP 7.4+ with mail() function configured.

## ⚙️ Configuration

### Node.js Setup

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Edit `.env` and configure:
```env
PORT=3001
EMAIL_USER=noreply@veridianprivate.com
EMAIL_PASSWORD=your-password-here
RECIPIENT_EMAIL=tye3to1@outlook.com
```

3. Start the server:
```bash
npm start
```

### PHP Setup

1. Ensure PHP mail() is configured on your server
2. Upload `contact-form.php` to your server
3. Update CORS origins if needed (lines 16-21)

## 🔌 API Endpoints

### POST /api/contact (Node.js)
### POST /api/contact-form.php (PHP)

Send a contact form submission.

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "serviceInterest": "Luxury Transportation",
  "message": "I'm interested in your services",
  "phone": "+1234567890" // optional
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Thank you for your inquiry! Our concierge team will contact you within 24 hours.",
  "submissionId": "VPC-1234567890-abc123"
}
```

**Error Response (400/500):**
```json
{
  "success": false,
  "message": "Error message here",
  "errors": ["Validation error 1", "Validation error 2"]
}
```

### GET /api/health (Node.js only)

Health check endpoint.

**Response (200):**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-10T12:00:00.000Z",
  "service": "Veridian Contact Form API"
}
```

## 🔒 Security Features

- **Rate Limiting:** 1 request per minute per IP
- **Input Validation:** Server-side validation for all fields
- **Input Sanitization:** XSS protection
- **CORS:** Configured allowed origins
- **Security Headers:** Helmet.js (Node.js) / Custom headers (PHP)
- **Session Management:** Prevents spam submissions

## 📧 Email Configuration

### Node.js (Nodemailer)

Uses Outlook SMTP:
- Host: smtp-mail.outlook.com
- Port: 587
- Secure: false (STARTTLS)

### PHP (mail())

Uses server's configured mail() function.

## 📝 Validation Rules

- **Full Name:** 2-100 characters, required
- **Email:** Valid email format, required
- **Service Interest:** Non-empty string, required
- **Message:** 10-5000 characters, required
- **Phone:** Optional, sanitized if provided

## 🎨 Email Template

Submissions are sent with a beautiful HTML email template featuring:
- Veridian branding
- Luxury gold and navy color scheme
- Organized field display
- Submission metadata (date, IP, user agent)
- Priority lead badge
- Mobile-responsive design

## 🔧 Frontend Integration

The frontend (`unified-veridian-script.js`) automatically tries multiple endpoints:

1. `/api/contact-form.php` (PHP backend)
2. `http://localhost:3001/api/contact` (Node.js development)
3. `/api/contact` (Node.js production)

## 📊 Logging

### Node.js
Logs to console with timestamps:
```
[2025-01-10T12:00:00.000Z] Contact form submission from john@example.com - Luxury Transportation
```

### PHP
Logs to `../logs/contact-submissions.log`:
```
2025-01-10 12:00:00 | john@example.com | Luxury Transportation | SUCCESS
```

Error logs to `../logs/contact-errors.log`

## 🚀 Deployment

### Node.js Production

1. Install dependencies:
```bash
npm install --production
```

2. Set environment variables
3. Use PM2 for process management:
```bash
npm install -g pm2
pm2 start contact-form.js --name veridian-api
pm2 save
pm2 startup
```

### PHP Production

1. Upload `contact-form.php` to server
2. Ensure PHP mail() is configured
3. Set correct file permissions (644)
4. Update CORS origins for production domain

## 🧪 Testing

### Test with cURL (Node.js):

```bash
curl -X POST http://localhost:3001/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "serviceInterest": "Luxury Transportation",
    "message": "This is a test message"
  }'
```

### Test with cURL (PHP):

```bash
curl -X POST https://yourdomain.com/api/contact-form.php \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "serviceInterest": "Luxury Transportation",
    "message": "This is a test message"
  }'
```

## 📱 Frontend Notification System

The frontend includes a beautiful notification system that shows:
- ✅ Success notifications (green)
- ❌ Error notifications (red)
- ℹ️ Info notifications (blue)

Notifications auto-dismiss after 8 seconds and are mobile-responsive.

## 🔍 Troubleshooting

### Node.js Issues

**Port already in use:**
```bash
# Find process
netstat -ano | findstr :3001
# Kill process
taskkill /PID <process_id> /F
```

**Email not sending:**
- Check EMAIL_USER and EMAIL_PASSWORD in .env
- Verify Outlook SMTP settings
- Check firewall allows port 587

### PHP Issues

**mail() not working:**
- Check PHP mail configuration
- Verify sendmail is installed
- Check server mail logs

**CORS errors:**
- Update allowed origins in contact-form.php (lines 16-21)
- Ensure proper headers are sent

## 📞 Support

For issues or questions:
- Email: concierge@veridianprivate.com
- Phone: +1 (888) VERIDIAN

## 📄 License

MIT License - See main project LICENSE file

---

**Version:** 1.0.0
**Last Updated:** January 2025
**Recipient Email:** tye3to1@outlook.com
