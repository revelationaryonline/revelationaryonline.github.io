#!/bin/bash

# Test script for Bible Reading API endpoints
# Uses the same auth approach as the frontend code in wordpress.ts

# Using subscriber credentials
USERNAME="revelationary03@gmail.com"
PASSWORD="GALAoro6HqH0yu5loaYu6FK3"

# Base URL for the API (matches the structure in the code)
BASE_URL="https://revelationary.org/wp-json/revelationary/v1"

# Encode credentials for Basic Auth (same way as frontend)
# Note: For Basic Auth, we need to handle the spaces correctly
AUTH_STRING=$(echo -n "${USERNAME}:${PASSWORD}" | base64)

echo "Using credentials from .env: ${USERNAME}"
echo "Authorization header configured"

# Test GET reading progress endpoint
echo -e "\nTesting GET reading-progress endpoint..."
curl -v -X GET "${BASE_URL}/reading-progress" \
  -H "Authorization: Basic ${AUTH_STRING}" \
  -H "Content-Type: application/json"

echo -e "\n\n"

# Test POST reading progress endpoint
echo -e "\nTesting POST reading-progress endpoint..."
curl -v -X POST "${BASE_URL}/reading-progress" \
  -H "Authorization: Basic ${AUTH_STRING}" \
  -H "Content-Type: application/json" \
  -d '{"book":"Genesis","chapter":1,"action":"mark_as_read"}'

echo -e "\n\n"

# Test GET subscription endpoint
echo -e "\nTesting GET subscription endpoint..."
curl -v -X GET "${BASE_URL}/subscription" \
  -H "Authorization: Basic ${AUTH_STRING}" \
  -H "Content-Type: application/json"
