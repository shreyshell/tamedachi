#!/bin/bash

# Tamedachi Pre-Deployment Check Script
# Run this before deploying to catch common issues

set -e

echo "🐾 Tamedachi Pre-Deployment Check"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env.local exists
echo "📋 Checking environment variables..."
if [ ! -f .env.local ]; then
    echo -e "${RED}❌ .env.local not found${NC}"
    echo "   Create it from .env.local.example"
    exit 1
else
    echo -e "${GREEN}✓ .env.local exists${NC}"
fi

# Check if required env vars are set
required_vars=(
    "NEXT_PUBLIC_SUPABASE_URL"
    "NEXT_PUBLIC_SUPABASE_ANON_KEY"
    "SUPABASE_SERVICE_ROLE_KEY"
    "OPENAI_API_KEY"
    "NEXT_PUBLIC_APP_URL"
)

source .env.local

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo -e "${RED}❌ $var is not set${NC}"
        exit 1
    else
        echo -e "${GREEN}✓ $var is set${NC}"
    fi
done

echo ""
echo "🧪 Running tests..."
if npm run test; then
    echo -e "${GREEN}✓ All tests passed${NC}"
else
    echo -e "${RED}❌ Tests failed${NC}"
    exit 1
fi

echo ""
echo "🔨 Building project..."
if npm run build; then
    echo -e "${GREEN}✓ Build successful${NC}"
else
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

echo ""
echo "🔍 Checking for common issues..."

# Check for console.log in production code
if grep -r "console.log" app/ lib/ components/ --exclude-dir=node_modules 2>/dev/null; then
    echo -e "${YELLOW}⚠️  Found console.log statements (consider removing for production)${NC}"
else
    echo -e "${GREEN}✓ No console.log statements found${NC}"
fi

# Check for TODO comments
todo_count=$(grep -r "TODO" app/ lib/ components/ --exclude-dir=node_modules 2>/dev/null | wc -l)
if [ "$todo_count" -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Found $todo_count TODO comments${NC}"
else
    echo -e "${GREEN}✓ No TODO comments found${NC}"
fi

# Check if .env.local is in .gitignore
if grep -q ".env\*" .gitignore; then
    echo -e "${GREEN}✓ .env files are in .gitignore${NC}"
else
    echo -e "${RED}❌ .env files not in .gitignore${NC}"
    exit 1
fi

echo ""
echo "=================================="
echo -e "${GREEN}🎉 Pre-deployment checks passed!${NC}"
echo ""
echo "Next steps:"
echo "1. Commit and push your code to GitHub"
echo "2. Go to Vercel and import your repository"
echo "3. Configure environment variables in Vercel"
echo "4. Deploy!"
echo ""
echo "See DEPLOYMENT.md for detailed instructions"
