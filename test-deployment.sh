#!/bin/bash

# 🧪 Live Deployment Testing Script
# Run after deployment to verify all OG endpoints work
# Usage: chmod +x test-deployment.sh && ./test-deployment.sh https://getfestiwise.com

DOMAIN=${1:-"https://getfestiwise.com"}
echo "🧪 Testing FestiWise Deployment at: $DOMAIN"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Counter
TESTS=0
PASSED=0
FAILED=0

# Test function
test_endpoint() {
    local name=$1
    local url=$2
    local expected=$3
    
    TESTS=$((TESTS + 1))
    echo "✓ Test $TESTS: $name"
    
    response=$(curl -s -w "\n%{http_code}" "$url")
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [[ "$http_code" == "200" ]]; then
        PASSED=$((PASSED + 1))
        echo "  ✅ HTTP 200 OK"
        echo "  📦 Response size: ${#body} bytes"
        return 0
    else
        FAILED=$((FAILED + 1))
        echo "  ❌ HTTP $http_code (Expected 200)"
        return 1
    fi
}

echo ""
echo "🎨 Testing OG Image Endpoints (Edge Runtime)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test Quiz Results OG Image
test_endpoint \
    "Quiz Results OG (Tomorrowland)" \
    "$DOMAIN/api/og/quiz-results?festival=Tomorrowland&score=95&genre=Electronic&budget=%24500-1000&country=Belgium"

# Test Festival OG Image  
test_endpoint \
    "Festival OG (Coachella)" \
    "$DOMAIN/api/og/festival?name=Coachella&genre=Indie&country=USA&month=April&price=%24400"

# Test Festival OG with special chars
test_endpoint \
    "Festival OG (Glastonbury)" \
    "$DOMAIN/api/og/festival?name=Glastonbury&genre=Rock&country=UK&month=June&price=%24250"

echo ""
echo "📡 Testing API Endpoints"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test Share API
TESTS=$((TESTS + 1))
echo "✓ Test $TESTS: POST /api/quiz/share"
response=$(curl -s -X POST "$DOMAIN/api/quiz/share" \
  -H "Content-Type: application/json" \
  -d '{
    "festivalId": "tomorrowland",
    "matchScore": 95,
    "platform": "twitter",
    "userGenre": "Electronic",
    "userBudget": "$500-1000"
  }' \
  -w "\n%{http_code}")

http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [[ "$http_code" == "200" ]]; then
    PASSED=$((PASSED + 1))
    echo "  ✅ HTTP 200 OK"
    echo "  Response: $body"
    if echo "$body" | grep -q "shareId"; then
        echo "  ✅ Share ID generated successfully"
    fi
else
    FAILED=$((FAILED + 1))
    echo "  ❌ HTTP $http_code"
fi

echo ""
echo "🌍 Testing Main Pages Load"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test main page
test_endpoint "Homepage" "$DOMAIN/"
test_endpoint "Quiz Page" "$DOMAIN/quiz"
test_endpoint "Festivals Page" "$DOMAIN/festivals"
test_endpoint "About Page" "$DOMAIN/about"

echo ""
echo "📊 Test Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Total Tests:  $TESTS"
echo "Passed:       $PASSED ✅"
echo "Failed:       $FAILED ❌"
echo ""

if [[ $FAILED -eq 0 ]]; then
    echo "✅ ALL TESTS PASSED! Deployment successful!"
    exit 0
else
    echo "❌ Some tests failed. Check logs above."
    exit 1
fi
