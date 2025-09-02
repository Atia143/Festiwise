#!/bin/bash

# FestiWise Pre-Launch Validation Script
# This script checks for common issues before deploying to production

echo "🚀 FestiWise Pre-Launch Validation"
echo "===================================="

# Directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR/.."
PROJECT_ROOT=$(pwd)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# Counter for issues
ISSUES_COUNT=0
WARNINGS_COUNT=0

# Function to check if a file exists
check_file() {
  if [ -f "$1" ]; then
    echo -e "${GREEN}✓${NC} $2 exists"
    return 0
  else
    echo -e "${RED}✗${NC} $2 does not exist"
    ISSUES_COUNT=$((ISSUES_COUNT + 1))
    return 1
  fi
}

# Function to check if a directory exists
check_directory() {
  if [ -d "$1" ]; then
    echo -e "${GREEN}✓${NC} $2 exists"
    return 0
  else
    echo -e "${RED}✗${NC} $2 does not exist"
    ISSUES_COUNT=$((ISSUES_COUNT + 1))
    return 1
  fi
}

# Function to check for a string in a file
check_string_in_file() {
  if grep -q "$2" "$1"; then
    echo -e "${GREEN}✓${NC} $3"
    return 0
  else
    echo -e "${RED}✗${NC} $3"
    ISSUES_COUNT=$((ISSUES_COUNT + 1))
    return 1
  fi
}

# Check for environment variables in a sample file
check_env_var() {
  if grep -q "$1" .env.production.sample; then
    echo -e "${GREEN}✓${NC} Environment variable $1 is defined in sample"
    return 0
  else
    echo -e "${YELLOW}⚠${NC} Environment variable $1 is not defined in sample"
    WARNINGS_COUNT=$((WARNINGS_COUNT + 1))
    return 1
  fi
}

echo ""
echo "1. Checking essential files..."
check_file "$PROJECT_ROOT/public/robots.txt" "robots.txt"
check_file "$PROJECT_ROOT/public/favicon.png" "Favicon"
check_file "$PROJECT_ROOT/src/app/sitemap.ts" "Sitemap generator"
check_file "$PROJECT_ROOT/public/site.webmanifest" "Web manifest"

echo ""
echo "2. Checking environment variables..."
check_file "$PROJECT_ROOT/.env.production.sample" ".env.production.sample file"
check_env_var "NEXT_PUBLIC_GA_ID"
check_env_var "ADMIN_ANALYTICS_TOKEN"
check_env_var "NEXT_PUBLIC_ENABLE_SOCIAL_PROOF"

echo ""
echo "3. Checking components..."
check_file "$PROJECT_ROOT/src/components/CookieConsent.tsx" "Cookie consent component"
check_file "$PROJECT_ROOT/src/components/ClientStructuredData.tsx" "Structured data component"
check_file "$PROJECT_ROOT/src/components/ErrorBoundary.tsx" "Error boundary component"

echo ""
echo "4. Checking API endpoints..."
check_directory "$PROJECT_ROOT/src/app/api/health" "Health check API endpoint"
check_directory "$PROJECT_ROOT/src/app/api/analytics" "Analytics API endpoint"

echo ""
echo "5. Checking SEO configuration..."
check_string_in_file "$PROJECT_ROOT/src/app/layout.tsx" "metadataBase" "Metadata base URL is set"
check_string_in_file "$PROJECT_ROOT/src/app/layout.tsx" "canonical" "Canonical URL is configured"

echo ""
echo "6. Checking feature flags..."
check_string_in_file "$PROJECT_ROOT/src/components/SocialProof.tsx" "FeatureFlag" "Social proof has feature flag"
check_string_in_file "$PROJECT_ROOT/src/components/LiveActivityTicker.tsx" "FeatureFlag" "Live activity has feature flag" || echo -e "${YELLOW}⚠${NC} Couldn't validate live activity feature flag"

echo ""
echo "===================================="
if [ $ISSUES_COUNT -eq 0 ] && [ $WARNINGS_COUNT -eq 0 ]; then
  echo -e "${GREEN}✓ All checks passed! Ready for launch.${NC}"
elif [ $ISSUES_COUNT -eq 0 ]; then
  echo -e "${YELLOW}⚠ All critical checks passed, but there are $WARNINGS_COUNT warnings to review.${NC}"
else
  echo -e "${RED}✗ Found $ISSUES_COUNT issues that need to be fixed before launch.${NC}"
  echo -e "${YELLOW}⚠ Also found $WARNINGS_COUNT warnings to review.${NC}"
  exit 1
fi
