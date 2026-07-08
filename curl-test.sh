#!/bin/bash
#
# End-to-end test of the timeline_post API using curl:
#   1. POST a random timeline post
#   2. GET the timeline and confirm the post was added
#   3. DELETE the post to clean up, then confirm it's gone (bonus)
#
# Usage: ./curl-test.sh [base_url]      # default: http://localhost:5000

set -u

BASE_URL="${1:-http://localhost:5000}"
ENDPOINT="$BASE_URL/api/timeline_post"

# Unique content so we can find exactly our post in the GET response.
STAMP="$(date +%s)-$RANDOM"
NAME="Test User $RANDOM"
EMAIL="test+$STAMP@example.com"
CONTENT="curl-test post $STAMP"

fail() { echo "FAIL: $1"; exit 1; }

echo "==> POST $ENDPOINT"
POST_RESPONSE="$(curl -s -X POST "$ENDPOINT" \
  --data-urlencode "name=$NAME" \
  --data-urlencode "email=$EMAIL" \
  --data-urlencode "content=$CONTENT")"
echo "$POST_RESPONSE"

# Extract the new post's id from the JSON response.
POST_ID="$(printf '%s' "$POST_RESPONSE" | grep -oE '"id"[[:space:]]*:[[:space:]]*[0-9]+' | grep -oE '[0-9]+' | head -1)"
[ -n "$POST_ID" ] || fail "no id returned from POST"
echo "created post id=$POST_ID"

echo "==> GET $ENDPOINT (expect our post present)"
curl -s "$ENDPOINT" | grep -qF "$CONTENT" || fail "posted content not found in GET response"
echo "OK: found our post in the timeline"

echo "==> DELETE $ENDPOINT/$POST_ID (cleanup)"
curl -s -X DELETE "$ENDPOINT/$POST_ID"
echo

echo "==> GET again (expect our post gone)"
curl -s "$ENDPOINT" | grep -qF "$CONTENT" && fail "post still present after DELETE"
echo "OK: post removed"

echo "ALL TESTS PASSED"
