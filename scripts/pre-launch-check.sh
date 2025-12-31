#!/bin/bash

# Pre-Launch Validation Script
# Checks all critical items before production submission

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
PASSED=0
FAILED=0
WARNINGS=0

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   MEME GENERATOR - PRE-LAUNCH VALIDATION SCRIPT       ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# Function to print check result
check_pass() {
    echo -e "${GREEN}✓${NC} $1"
    ((PASSED++))
}

check_fail() {
    echo -e "${RED}✗${NC} $1"
    ((FAILED++))
}

check_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
    ((WARNINGS++))
}

echo -e "${BLUE}[1/10] Checking Environment Configuration...${NC}"
if [ -f ".env.production" ]; then
    check_pass "Production environment file exists"

    # Check for placeholder values
    if grep -q "XXXXXXXX" .env.production; then
        check_fail "Production .env contains placeholder values - Update with real credentials"
    else
        check_pass "Production credentials appear to be configured"
    fi

    # Check required variables
    required_vars=("ADMOB_IOS_APP_ID" "ADMOB_ANDROID_APP_ID" "SENTRY_DSN" "FIREBASE_PROJECT_ID")
    for var in "${required_vars[@]}"; do
        if grep -q "^${var}=" .env.production; then
            check_pass "  ↳ $var is set"
        else
            check_fail "  ↳ $var is missing"
        fi
    done
else
    check_fail "Production environment file missing"
fi
echo ""

echo -e "${BLUE}[2/10] Checking Dependencies...${NC}"
if [ -f "package.json" ]; then
    check_pass "package.json exists"

    # Check if node_modules exists
    if [ -d "node_modules" ]; then
        check_pass "Dependencies installed"
    else
        check_fail "Dependencies not installed - Run: npm install"
    fi

    # Check for security vulnerabilities
    echo -e "  ${YELLOW}Running security audit...${NC}"
    if npm audit --production --audit-level=high 2>&1 | grep -q "found 0"; then
        check_pass "No high/critical vulnerabilities in production dependencies"
    else
        check_warn "Security vulnerabilities detected - Review: npm audit"
    fi
else
    check_fail "package.json missing"
fi
echo ""

echo -e "${BLUE}[3/10] Checking Code Quality...${NC}"
# TypeScript compilation
if command -v npx &> /dev/null; then
    echo -e "  ${YELLOW}Compiling TypeScript...${NC}"
    if npx tsc --noEmit; then
        check_pass "TypeScript compiles without errors"
    else
        check_fail "TypeScript compilation failed"
    fi
else
    check_warn "npx not found - Skipping TypeScript check"
fi

# ESLint
if [ -f ".eslintrc.js" ]; then
    echo -e "  ${YELLOW}Running ESLint...${NC}"
    if npx eslint . --ext .ts,.tsx --max-warnings 0 2>&1 | grep -q "0 problems"; then
        check_pass "ESLint passed with no errors"
    else
        check_warn "ESLint warnings/errors detected - Run: npm run lint"
    fi
else
    check_warn ".eslintrc.js not found"
fi
echo ""

echo -e "${BLUE}[4/10] Checking Tests...${NC}"
if [ -d "src/__tests__" ] || [ -d "src/*/__tests__" ]; then
    echo -e "  ${YELLOW}Running test suite...${NC}"
    if npm test -- --passWithNoTests; then
        check_pass "All tests passing"
    else
        check_fail "Tests failing - Fix before launch"
    fi
else
    check_warn "No test files found"
fi
echo ""

echo -e "${BLUE}[5/10] Checking Build Configuration...${NC}"
if [ -f "eas.json" ]; then
    check_pass "EAS configuration exists"

    # Check for production profile
    if grep -q '"production"' eas.json; then
        check_pass "Production build profile configured"
    else
        check_fail "Production build profile missing from eas.json"
    fi
else
    check_fail "eas.json missing - Run: eas build:configure"
fi

if [ -f "app.config.ts" ] || [ -f "app.json" ]; then
    check_pass "App configuration exists"
else
    check_fail "App configuration missing"
fi
echo ""

echo -e "${BLUE}[6/10] Checking Assets...${NC}"
# App icon
if [ -f "assets/icon.png" ]; then
    check_pass "App icon exists"
    # Check dimensions (should be 1024x1024)
    if command -v identify &> /dev/null; then
        dimensions=$(identify -format "%wx%h" assets/icon.png)
        if [ "$dimensions" = "1024x1024" ]; then
            check_pass "  ↳ App icon is correct size (1024x1024)"
        else
            check_warn "  ↳ App icon size is $dimensions (should be 1024x1024)"
        fi
    fi
else
    check_fail "App icon missing"
fi

# Adaptive icon
if [ -f "assets/adaptive-icon.png" ]; then
    check_pass "Adaptive icon exists (Android)"
else
    check_warn "Adaptive icon missing (Android)"
fi

# Splash screen
if [ -f "assets/splash.png" ]; then
    check_pass "Splash screen exists"
else
    check_warn "Splash screen missing"
fi
echo ""

echo -e "${BLUE}[7/10] Checking Legal Pages...${NC}"
if [ -f "docs/privacy-policy.html" ]; then
    check_pass "Privacy Policy HTML exists"
else
    check_fail "Privacy Policy HTML missing - Create in docs/"
fi

if [ -f "docs/terms-of-service.html" ]; then
    check_pass "Terms of Service HTML exists"
else
    check_fail "Terms of Service HTML missing - Create in docs/"
fi

if [ -d "docs" ]; then
    check_pass "Docs directory exists for GitHub Pages"
else
    check_fail "Docs directory missing - Create it for legal pages hosting"
fi
echo ""

echo -e "${BLUE}[8/10] Checking Git Status...${NC}"
if git rev-parse --git-dir > /dev/null 2>&1; then
    check_pass "Git repository initialized"

    # Check for uncommitted changes
    if git diff-index --quiet HEAD --; then
        check_pass "No uncommitted changes"
    else
        check_warn "Uncommitted changes detected - Commit before building"
    fi

    # Check current branch
    current_branch=$(git branch --show-current)
    if [ "$current_branch" = "production" ]; then
        check_pass "On production branch"
    elif [ "$current_branch" = "master" ] || [ "$current_branch" = "main" ]; then
        check_warn "On $current_branch branch (consider using production branch)"
    else
        check_warn "On $current_branch branch (not production)"
    fi

    # Check if remote exists
    if git remote -v | grep -q origin; then
        check_pass "Git remote configured"
    else
        check_warn "No git remote - Changes won't be backed up"
    fi
else
    check_fail "Not a git repository"
fi
echo ""

echo -e "${BLUE}[9/10] Checking Documentation...${NC}"
required_docs=("README.md" "DEPLOYMENT_GUIDE.md" "PRODUCTION_CHECKLIST.md")
for doc in "${required_docs[@]}"; do
    if [ -f "$doc" ]; then
        check_pass "$doc exists"
    else
        check_warn "$doc missing"
    fi
done
echo ""

echo -e "${BLUE}[10/10] Checking Production Readiness...${NC}"

# Check .gitignore
if [ -f ".gitignore" ]; then
    if grep -q ".env.production" .gitignore; then
        check_pass ".env.production is in .gitignore (secrets protected)"
    else
        check_fail ".env.production not in .gitignore - Add it to protect secrets"
    fi
else
    check_warn ".gitignore missing"
fi

# Check for sensitive files that shouldn't be committed
sensitive_files=("google-services.json" "GoogleService-Info.plist")
for file in "${sensitive_files[@]}"; do
    if git ls-files --error-unmatch "$file" &> /dev/null; then
        check_warn "$file is tracked by git - Consider removing (contains secrets)"
    fi
done

# Check node_modules is ignored
if [ -d "node_modules" ] && ! git ls-files --error-unmatch "node_modules" &> /dev/null 2>&1; then
    check_pass "node_modules is not tracked by git"
else
    if [ -d "node_modules" ]; then
        check_warn "node_modules might be tracked - Check .gitignore"
    fi
fi
echo ""

# Summary
echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                    SUMMARY                             ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}✓ Passed:${NC}   $PASSED"
echo -e "${RED}✗ Failed:${NC}   $FAILED"
echo -e "${YELLOW}⚠ Warnings:${NC} $WARNINGS"
echo ""

if [ $FAILED -eq 0 ]; then
    if [ $WARNINGS -eq 0 ]; then
        echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${GREEN}          🎉 ALL CHECKS PASSED! 🎉${NC}"
        echo -e "${GREEN}         Your app is ready for production!${NC}"
        echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo ""
        echo -e "${BLUE}Next steps:${NC}"
        echo "  1. Build production apps: eas build --platform all --profile production"
        echo "  2. Test builds on real devices"
        echo "  3. Submit to App Store and Play Store"
        echo "  4. Monitor for crashes and user feedback"
        exit 0
    else
        echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${YELLOW}        ⚠ CHECKS PASSED WITH WARNINGS ⚠${NC}"
        echo -e "${YELLOW}  Review warnings above before proceeding to production${NC}"
        echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        exit 0
    fi
else
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${RED}           ✗ CHECKS FAILED ✗${NC}"
    echo -e "${RED}   Fix the issues above before building for production${NC}"
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "${YELLOW}Need help? Check these guides:${NC}"
    echo "  • CREDENTIALS_SETUP_GUIDE.md - Set up production credentials"
    echo "  • DEPLOYMENT_GUIDE.md - Complete deployment instructions"
    echo "  • PRODUCTION_CHECKLIST.md - Full pre-launch checklist"
    exit 1
fi
