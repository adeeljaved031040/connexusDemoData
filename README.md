# Connexus Demo Data - Java Script Runner

A Node.js server that can execute Java scripts.

## Setup

1. Install dependencies:
```bash
npm install
```

## Running the Server

### Development mode (with nodemon - auto-restart on changes):
```bash
npm run dev
```

Nodemon is configured via `nodemon.json` to:
- Watch JavaScript files (`.js`, `.json`)
- Auto-restart the server when files change
- Ignore `node_modules`, compiled Java files (`.class`), and logs
- Use a 1-second delay before restarting
- Run in development mode

### Production mode:
```bash
npm start
```

The server will run on `http://localhost:3000`

## API Endpoints

### POST /run-java
Run a Java script by providing the file path in the request body.

**Request:**
```json
{
  "javaFile": "path/to/YourClass.java",
  "className": "YourClass" // optional, defaults to filename without extension
}
```

**Response:**
```json
{
  "success": true,
  "output": "Program output...",
  "stderr": null
}
```

### GET /run-java/:filename
Run a Java script by filename (must be in the project root or subdirectories).

**Example:**
```
GET http://localhost:3000/run-java/HelloWorld.java
```

### POST /process-insurance-data
Process insurance policy JSON data according to strict business extraction rules.

**Request Body:**
```json
{
  "documentType": "insurance_policy",
  "policyNumber": "...",
  "generalLiabilityLimits": {...},
  "propertyLimits": {...},
  "otherCoverageLimits": [...],
  ...
}
```

**Response:**
```json
{
  "success": true,
  "processedData": { /* cleaned and validated insurance data */ },
  "summary": {
    "changes": ["list of changes made"],
    "warnings": ["any warnings"]
  },
  "message": "Insurance data processed successfully according to business extraction rules"
}
```

**Transformation Rules Applied:**
- **General Liability Cleanup**: Validates `eachOccurrence` and `generalAggregate` are present
- **Property Limit Filtering**: Excludes Terrorism, Business Interruption (BI), Extra Expense (EE), or Ordinance/Law from building limits
- **Other Coverage Limits Standardization**: 
  - D&O entries separated into Per Occurrence and Aggregate
  - Auto coverages mapped as single entry with "Each Occurrence"
  - Crime coverages (Employee Dishonesty, Forgery) properly categorized
- **Umbrella Validation**: Ensures D&O/E&O limits are not mistakenly mapped to umbrella
- **Package Policy Confirmation**: Verifies policy type when both Property and GL exist

**Example:**
```bash
curl -X POST http://localhost:3000/process-insurance-data \
  -H "Content-Type: application/json" \
  -d @examples/sampleInsuranceData.json
```

### GET /health
Health check endpoint.

## Testing

Test the insurance data processor locally:
```bash
node testProcessor.js
```

This will process the sample data in `examples/sampleInsuranceData.json` and display the results.

## Requirements

- Node.js installed
- Java JDK installed and available in PATH (for Java script execution)
- `javac` and `java` commands must be accessible from terminal (for Java script execution)

# connexusDemoData
