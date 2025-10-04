# 🚀 Deployment Checklist - Veridian Private Concierge

## ✅ Completed Tasks

### Phase 1: Development & Testing
- [x] Domain merge completed
- [x] SEO optimization added
- [x] Browser testing completed
- [x] Old landing pages archived
- [x] sitemap.xml created
- [x] robots.txt created
- [x] .htaccess with redirects created

---

## 📋 Pre-Deployment Checklist

### 1. File Verification
- [ ] Verify all files are present:
  - [ ] index.html
  - [ ] unified-veridian-styles.css
  - [ ] unified-veridian-script.js
  - [ ] design-system-tokens.css
  - [ ] sitemap.xml
  - [ ] robots.txt
  - [ ] .htaccess

### 2. Configuration Updates
- [ ] Update domain in sitemap.xml (if different from veridianprivate.com)
- [ ] Update domain in .htaccess redirects
- [ ] Update domain in index.html meta tags
- [ ] Update contact email addresses
- [ ] Update phone numbers

### 3. Server Requirements
- [ ] Apache/Nginx web server
- [ ] PHP 7.4+ (if using PHP)
- [ ] SSL certificate installed
- [ ] mod_rewrite enabled (Apache)
- [ ] Gzip compression enabled
- [ ] Sufficient disk space (minimum 100MB)

---

## 🌐 Deployment Steps

### Step 1: Backup Current Site
```bash
# Create backup of current site
tar -czf backup-$(date +%Y%m%d).tar.gz /path/to/current/site
```

### Step 2: Upload Files
Upload these files to your web server:
```
/public_html/
├── index.html
├── unified-veridian-styles.css
├── unified-veridian-script.js
├── design-system-tokens.css
├── sitemap.xml
├── robots.txt
├── .htaccess
└── _archive/ (optional)
```

**Upload Methods:**
- FTP/SFTP (FileZilla, WinSCP)
- cPanel File Manager
- Git deployment
- SSH/SCP

### Step 3: Set File Permissions
```bash
# Set correct permissions
chmod 644 index.html
chmod 644 *.css
chmod 644 *.js
chmod 644 sitemap.xml
chmod 644 robots.txt
chmod 644 .htaccess
chmod 755 _archive/
```

### Step 4: Configure Domain Redirects

**For Apache (.htaccess already configured):**
- Ensure mod_rewrite is enabled
- Upload .htaccess file
- Test redirects

**For Nginx (add to nginx.conf):**
```nginx
# Redirect old domains to Veridian
server {
    server_name ontargetcouriers.co.uk www.ontargetcouriers.co.uk;
    return 301 https://veridianprivate.com/#courier;
}

server {
    server_name ontargetwebdesign.com www.ontargetwebdesign.com;
    return 301 https://veridianprivate.com/#web-design;
}

server {
    server_name velocities.ltd www.velocities.ltd;
    return 301 https://veridianprivate.com/#transportation;
}
```

### Step 5: SSL Certificate
```bash
# Using Let's Encrypt (free)
sudo certbot --apache -d veridianprivate.com -d www.veridianprivate.com
```

### Step 6: Test Deployment
- [ ] Visit https://veridianprivate.com
- [ ] Check all sections load correctly
- [ ] Test navigation menu
- [ ] Test contact form
- [ ] Test mobile responsiveness
- [ ] Check browser console for errors

---

## 🔍 Post-Deployment Testing

### Functionality Tests
- [ ] Homepage loads correctly
- [ ] All 9 service cards display
- [ ] Navigation menu works
- [ ] Mobile menu toggles
- [ ] Smooth scrolling works
- [ ] Contact form submits
- [ ] Chat widget appears
- [ ] All images load

### Domain Redirect Tests
Test each old domain redirects correctly:
```bash
# Test OnTarget Couriers redirect
curl -I https://ontargetcouriers.co.uk
# Should return: 301 Moved Permanently
# Location: https://veridianprivate.com/#courier

# Test OnTarget Web Design redirect
curl -I https://ontargetwebdesign.com
# Should return: 301 Moved Permanently
# Location: https://veridianprivate.com/#web-design

# Test Velocities redirect
curl -I https://velocities.ltd
# Should return: 301 Moved Permanently
# Location: https://veridianprivate.com/#transportation
```

### SEO Tests
- [ ] Visit https://veridianprivate.com/robots.txt
- [ ] Visit https://veridianprivate.com/sitemap.xml
- [ ] Check meta tags in page source
- [ ] Verify canonical URL
- [ ] Test social media preview (Facebook Debugger, Twitter Card Validator)

### Performance Tests
- [ ] Run Google PageSpeed Insights
- [ ] Run GTmetrix
- [ ] Check mobile performance
- [ ] Verify Gzip compression
- [ ] Check browser caching

### Security Tests
- [ ] Verify HTTPS works
- [ ] Check SSL certificate
- [ ] Test security headers
- [ ] Verify _archive directory is blocked
- [ ] Test for common vulnerabilities

---

## 📊 Analytics Setup

### Google Analytics 4
1. Create GA4 property
2. Get Measurement ID (G-XXXXXXXXXX)
3. Add tracking code to index.html:
```html
<!-- Add before </head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Google Search Console
1. Go to https://search.google.com/search-console
2. Add property: veridianprivate.com
3. Verify ownership (HTML file or DNS)
4. Submit sitemap: https://veridianprivate.com/sitemap.xml

### Google My Business
1. Create/claim business listing
2. Add business information
3. Upload photos
4. Verify business

---

## 📧 Email Integration

### Contact Form Setup
Choose one method:

**Option 1: FormSpree (Easiest)**
```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

**Option 2: PHP Mail**
Create `contact-handler.php`:
```php
<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['fullName'];
    $email = $_POST['email'];
    $service = $_POST['serviceInterest'];
    $message = $_POST['message'];

    $to = "concierge@veridianprivate.com";
    $subject = "New Contact Form Submission";
    $body = "Name: $name\nEmail: $email\nService: $service\nMessage: $message";

    mail($to, $subject, $body);

    header("Location: /thank-you.html");
}
?>
```

**Option 3: SendGrid/Mailgun API**
- Sign up for service
- Get API key
- Integrate with JavaScript

---

## 🔧 Troubleshooting

### Common Issues

**Issue: Redirects not working**
- Solution: Check mod_rewrite is enabled
- Solution: Verify .htaccess syntax
- Solution: Check file permissions

**Issue: CSS/JS not loading**
- Solution: Check file paths
- Solution: Clear browser cache
- Solution: Check file permissions

**Issue: Forms not submitting**
- Solution: Configure email handler
- Solution: Check SMTP settings
- Solution: Verify form action URL

**Issue: SSL errors**
- Solution: Renew SSL certificate
- Solution: Check certificate chain
- Solution: Force HTTPS in .htaccess

---

## 📱 Mobile Testing

Test on multiple devices:
- [ ] iPhone (Safari)
- [ ] Android (Chrome)
- [ ] iPad (Safari)
- [ ] Desktop (Chrome, Firefox, Safari, Edge)

---

## 🎯 Success Metrics

### Week 1 Goals
- [ ] Site live and accessible
- [ ] All redirects working
- [ ] Analytics tracking
- [ ] No critical errors

### Month 1 Goals
- [ ] 1,000+ page views
- [ ] 50+ form submissions
- [ ] Indexed by Google
- [ ] 5+ keyword rankings

### Month 3 Goals
- [ ] 5,000+ page views
- [ ] 200+ form submissions
- [ ] Top 20 for 10+ keywords
- [ ] 20+ backlinks

---

## 📞 Support Contacts

**Technical Support:**
- Web Host: [Your hosting provider]
- Domain Registrar: [Your registrar]
- SSL Provider: [Let's Encrypt/Other]

**Emergency Contacts:**
- Developer: [Your contact]
- System Admin: [Your contact]

---

## ✅ Final Checklist

Before going live:
- [ ] All files uploaded
- [ ] Domain redirects configured
- [ ] SSL certificate installed
- [ ] Analytics installed
- [ ] Search Console configured
- [ ] Email integration working
- [ ] All tests passed
- [ ] Backup created
- [ ] Team notified

---

## 🎉 Go Live!

Once all checks are complete:
1. Update DNS if needed
2. Clear CDN cache if using one
3. Announce on social media
4. Monitor for first 24 hours
5. Check analytics daily for first week

---

**Deployment Date:** _____________
**Deployed By:** _____________
**Version:** 1.0.0
**Status:** ⏳ Ready for Deployment
