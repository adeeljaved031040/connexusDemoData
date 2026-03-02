# How to Run the Code and See Output

## Option 1: Test the Insurance Data Processor (Quick Test)

Run the test script to see the processor in action:

```bash
npm test
```

Or directly:
```bash
node testProcessor.js
```

This will:
- Load the sample insurance data
- Process it according to business rules
- Display the results in your terminal

---

## Option 2: Run the Server and Use API Endpoints

### Step 1: Start the Server

**Development mode (auto-restarts on file changes):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

You should see:
```
Server is running on http://localhost:3000
Use POST /run-java or GET /run-java/:filename to execute Java scripts
Use POST /process-insurance-data to process insurance policy data
```

### Step 2: Test the Insurance Data Processor API

**Using curl:**
```bash
curl -X POST http://localhost:3000/process-insurance-data \
  -H "Content-Type: application/json" \
  -d @examples/sampleInsuranceData.json
```

**Using a new terminal window** (keep server running in first terminal):
```bash
# In a new terminal
cd /Users/adeeljaved/Desktop/Projects/connexusDemoData
curl -X POST http://localhost:3000/process-insurance-data \
  -H "Content-Type: application/json" \
  -d @examples/sampleInsuranceData.json | jq
```

(Install `jq` for pretty JSON: `brew install jq`)

### Step 3: Test Health Endpoint

```bash
curl http://localhost:3000/health
```

---

## Option 3: Use the Test Script (Easiest)

I've created a simple test script. Run:

```bash
./test-api.sh
```

This will start the server, test the endpoint, and show you the output.

---

## Viewing Output

### Terminal Output
All output will appear in your terminal where you run the commands.

### JSON Output
For better formatted JSON output, pipe to `jq`:
```bash
curl -X POST http://localhost:3000/process-insurance-data \
  -H "Content-Type: application/json" \
  -d @examples/sampleInsuranceData.json | jq
```

### Browser
You can also test endpoints using:
- Postman
- Insomnia
- Or visit: http://localhost:3000/health

---

## Quick Start Commands

```bash
# 1. Test the processor directly (no server needed)
npm test

# 2. Start the server
npm run dev

# 3. In another terminal, test the API
curl -X POST http://localhost:3000/process-insurance-data \
  -H "Content-Type: application/json" \
  -d @examples/sampleInsuranceData.json
```

