#!/bin/bash
# Test script to run the server and test the API

echo "=========================================="
echo "Testing Insurance Data Processor API"
echo "=========================================="
echo ""

# Check if server is already running
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "⚠️  Server is already running on port 3000"
    echo "Testing API endpoint..."
    echo ""
else
    echo "Starting server in background..."
    npm start > /tmp/server.log 2>&1 &
    SERVER_PID=$!
    echo "Server started (PID: $SERVER_PID)"
    echo "Waiting for server to be ready..."
    sleep 3
    echo ""
fi

echo "Testing /health endpoint:"
curl -s http://localhost:3000/health | jq . 2>/dev/null || curl -s http://localhost:3000/health
echo ""
echo ""

echo "Testing /process-insurance-data endpoint:"
echo "Processing sample insurance data..."
echo ""

RESPONSE=$(curl -s -X POST http://localhost:3000/process-insurance-data \
  -H "Content-Type: application/json" \
  -d @examples/sampleInsuranceData.json)

# Try to format with jq, fallback to raw output
if command -v jq &> /dev/null; then
    echo "$RESPONSE" | jq .
else
    echo "$RESPONSE"
    echo ""
    echo "💡 Tip: Install 'jq' for pretty JSON output: brew install jq"
fi

echo ""
echo "=========================================="
echo "Test completed!"
echo "=========================================="
echo ""
echo "To stop the server, run: pkill -f 'node server.js'"
echo "Or find the PID and kill it: ps aux | grep 'node server.js'"

