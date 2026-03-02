# Server Restart Instructions

## The Issue
The processor code has been fixed, but the server needs to be restarted to load the new code.

## How to Restart

### Option 1: If using nodemon (npm run dev)
1. Stop the server: Press `Ctrl+C` in the terminal where the server is running
2. Restart: Run `npm run dev` again

### Option 2: If using npm start
1. Stop the server: Press `Ctrl+C` in the terminal where the server is running
2. Restart: Run `npm start` again

### Option 3: Force Restart (if nodemon isn't detecting changes)
1. Stop the server: Press `Ctrl+C`
2. Clear node cache: `rm -rf node_modules/.cache` (if it exists)
3. Restart: `npm run dev`

## Verify It's Working

After restarting, test the endpoint:
```bash
curl -X POST http://localhost:3000/process-insurance-data \
  -H "Content-Type: application/json" \
  -d @examples/sampleInsuranceData.json | jq .processedData.generalLiabilityLimits
```

You should see:
```json
{
  "eachOccurrence": 1000000,
  "generalAggregate": 2000000,
  "personalAdvInjury": 1000000,
  "productsCompletedOps": 2000000
}
```

If you still see nulls, check the server console logs - they will show what's being processed.

