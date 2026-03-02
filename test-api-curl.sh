#!/bin/bash
# Test the API with the correct sample data

echo "Testing API endpoint with sample insurance data..."
echo ""

curl -X POST http://localhost:3000/process-insurance-data \
  -H "Content-Type: application/json" \
  -d @examples/sampleInsuranceData.json \
  | python3 -m json.tool 2>/dev/null || \
  curl -X POST http://localhost:3000/process-insurance-data \
  -H "Content-Type: application/json" \
  -d @examples/sampleInsuranceData.json

echo ""
echo ""
echo "Check the server logs above to see what was received."

