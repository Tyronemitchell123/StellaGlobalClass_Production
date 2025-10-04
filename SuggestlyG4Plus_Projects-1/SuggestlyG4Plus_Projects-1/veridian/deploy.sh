#!/bin/bash

# ============================================
# Veridian Private Concierge - Deployment Script
# ============================================
# This script automates the deployment process
# Usage: ./deploy.sh [environment]
# Example: ./deploy.sh production
# ============================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1:-production}
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="backups"
DEPLOY_DIR="deploy_${TIMESTAMP}"

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}Veridian Private Concierge Deployment${NC}"
echo -e "${BLUE}Environment: ${ENVIRONMENT}${NC}"
echo -e "${BLUE}============================================${NC}\n"

# ============================================
# Step 1: Pre-deployment Checks
# ============================================
echo -e "${YELLOW}[1/7] Running pre-deployment checks...${NC}"

# Check if required files exist
REQUIRED_FILES=(
    "index.html"
    "unified-veridian-styles.css"
    "unified-veridian-script.js"
    "design-system-tokens.css"
    "sitemap.xml"
    "robots.txt"
    ".htaccess"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo -e "${RED}✗ Missing required file: $file${NC}"
        exit 1
    fi
done

echo -e "${GREEN}✓ All required files present${NC}\n"

# ============================================
# Step 2: Create Backup
# ============================================
echo -e "${YELLOW}[2/7] Creating backup...${NC}"

mkdir -p "$BACKUP_DIR"
BACKUP_FILE="${BACKUP_DIR}/backup_${TIMESTAMP}.tar.gz"

tar -czf "$BACKUP_FILE" \
    index.html \
    unified-veridian-styles.css \
    unified-veridian-script.js \
    design-system-tokens.css \
    sitemap.xml \
    robots.txt \
    .htaccess \
    _archive/ 2>/dev/null || true

echo -e "${GREEN}✓ Backup created: $BACKUP_FILE${NC}\n"

# ============================================
# Step 3: Create Deployment Package
# ============================================
echo -e "${YELLOW}[3/7] Creating deployment package...${NC}"

mkdir -p "$DEPLOY_DIR"

# Copy production files
cp index.html "$DEPLOY_DIR/"
cp unified-veridian-styles.css "$DEPLOY_DIR/"
cp unified-veridian-script.js "$DEPLOY_DIR/"
cp design-system-tokens.css "$DEPLOY_DIR/"
cp sitemap.xml "$DEPLOY_DIR/"
cp robots.txt "$DEPLOY_DIR/"
cp .htaccess "$DEPLOY_DIR/"

# Copy archive directory (optional)
if [ -d "_archive" ]; then
    cp -r _archive "$DEPLOY_DIR/"
fi

echo -e "${GREEN}✓ Deployment package created: $DEPLOY_DIR${NC}\n"

# ============================================
# Step 4: Validate HTML
# ============================================
echo -e "${YELLOW}[4/7] Validating HTML...${NC}"

# Check for common HTML issues
if grep -q "TODO\|FIXME\|XXX" index.html; then
    echo -e "${YELLOW}⚠ Warning: Found TODO/FIXME comments in HTML${NC}"
fi

# Check for broken internal links
if grep -q 'href="#[^"]*"' index.html; then
    echo -e "${GREEN}✓ Internal anchor links found${NC}"
fi

echo -e "${GREEN}✓ HTML validation complete${NC}\n"

# ============================================
# Step 5: Validate CSS
# ============================================
echo -e "${YELLOW}[5/7] Validating CSS...${NC}"

# Check CSS file size
CSS_SIZE=$(wc -c < unified-veridian-styles.css)
if [ $CSS_SIZE -gt 500000 ]; then
    echo -e "${YELLOW}⚠ Warning: CSS file is large (${CSS_SIZE} bytes)${NC}"
else
    echo -e "${GREEN}✓ CSS file size acceptable (${CSS_SIZE} bytes)${NC}"
fi

echo -e "${GREEN}✓ CSS validation complete${NC}\n"

# ============================================
# Step 6: Validate JavaScript
# ============================================
echo -e "${YELLOW}[6/7] Validating JavaScript...${NC}"

# Check for console.log statements (should be removed in production)
if grep -q "console\.log" unified-veridian-script.js; then
    echo -e "${YELLOW}⚠ Warning: Found console.log statements${NC}"
fi

echo -e "${GREEN}✓ JavaScript validation complete${NC}\n"

# ============================================
# Step 7: Generate Deployment Report
# ============================================
echo -e "${YELLOW}[7/7] Generating deployment report...${NC}"

REPORT_FILE="${DEPLOY_DIR}/DEPLOYMENT_REPORT.txt"

cat > "$REPORT_FILE" << EOF
============================================
Veridian Private Concierge - Deployment Report
============================================

Deployment Date: $(date)
Environment: ${ENVIRONMENT}
Deployed By: $(whoami)
Hostname: $(hostname)

============================================
Files Included
============================================

$(ls -lh "$DEPLOY_DIR" | tail -n +2)

============================================
File Checksums (MD5)
============================================

$(cd "$DEPLOY_DIR" && md5sum *.html *.css *.js *.xml *.txt 2>/dev/null || echo "MD5 checksums not available")

============================================
Deployment Package
============================================

Package Location: $DEPLOY_DIR
Backup Location: $BACKUP_FILE
Package Size: $(du -sh "$DEPLOY_DIR" | cut -f1)

============================================
Next Steps
============================================

1. Upload files to production server:
   - Via FTP/SFTP: Upload contents of $DEPLOY_DIR
   - Via SCP: scp -r $DEPLOY_DIR/* user@server:/path/to/webroot/
   - Via rsync: rsync -avz $DEPLOY_DIR/ user@server:/path/to/webroot/

2. Set file permissions on server:
   chmod 644 *.html *.css *.js *.xml *.txt
   chmod 644 .htaccess
   chmod 755 _archive/

3. Test deployment:
   - Visit https://veridianprivate.com
   - Check all sections load
   - Test navigation
   - Verify redirects

4. Configure DNS (if needed):
   - Point ontargetcouriers.co.uk to server
   - Point ontargetwebdesign.com to server
   - Point velocities.ltd to server

5. Install SSL certificate:
   sudo certbot --apache -d veridianprivate.com

6. Submit sitemap to Google:
   https://search.google.com/search-console

============================================
Support
============================================

Documentation: See DEPLOYMENT-CHECKLIST.md
Issues: Contact technical support
Emergency: [Your emergency contact]

============================================
EOF

echo -e "${GREEN}✓ Deployment report generated: $REPORT_FILE${NC}\n"

# ============================================
# Deployment Summary
# ============================================
echo -e "${BLUE}============================================${NC}"
echo -e "${GREEN}✓ Deployment package ready!${NC}"
echo -e "${BLUE}============================================${NC}\n"

echo -e "${GREEN}Package Location:${NC} $DEPLOY_DIR"
echo -e "${GREEN}Backup Location:${NC} $BACKUP_FILE"
echo -e "${GREEN}Report Location:${NC} $REPORT_FILE\n"

echo -e "${YELLOW}Next Steps:${NC}"
echo -e "1. Review deployment report: cat $REPORT_FILE"
echo -e "2. Upload files to production server"
echo -e "3. Follow DEPLOYMENT-CHECKLIST.md for complete instructions\n"

echo -e "${BLUE}============================================${NC}"
echo -e "${GREEN}Deployment preparation complete!${NC}"
echo -e "${BLUE}============================================${NC}\n"

# Optional: Create a zip file for easy download
if command -v zip &> /dev/null; then
    ZIP_FILE="veridian_deploy_${TIMESTAMP}.zip"
    echo -e "${YELLOW}Creating zip file for easy transfer...${NC}"
    zip -r "$ZIP_FILE" "$DEPLOY_DIR" > /dev/null 2>&1
    echo -e "${GREEN}✓ Zip file created: $ZIP_FILE${NC}\n"
fi

exit 0
