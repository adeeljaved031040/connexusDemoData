const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const InsuranceDataProcessor = require('./processors/insuranceDataProcessor');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// Endpoint to run a Java script
app.post('/run-java', (req, res) => {
  const { javaFile, className } = req.body;
  
  if (!javaFile) {
    return res.status(400).json({ error: 'Java file path is required' });
  }

  const javaFilePath = path.join(__dirname, javaFile);
  
  // Check if file exists
  if (!fs.existsSync(javaFilePath)) {
    return res.status(404).json({ error: `Java file not found: ${javaFile}` });
  }

  // Extract class name from file if not provided
  const classToRun = className || path.basename(javaFile, '.java');
  
  // Compile Java file
  exec(`javac ${javaFilePath}`, (compileError, compileStdout, compileStderr) => {
    if (compileError) {
      return res.status(500).json({ 
        error: 'Compilation failed', 
        details: compileStderr 
      });
    }

    // Get directory of Java file
    const javaDir = path.dirname(javaFilePath);
    
    // Run compiled Java class
    exec(`cd ${javaDir} && java ${classToRun}`, (runError, runStdout, runStderr) => {
      if (runError) {
        return res.status(500).json({ 
          error: 'Execution failed', 
          details: runStderr 
        });
      }

      res.json({ 
        success: true, 
        output: runStdout,
        stderr: runStderr || null
      });
    });
  });
});

// Endpoint to run a Java script by file name (simpler API)
app.get('/run-java/:filename', (req, res) => {
  const filename = req.params.filename;
  const javaFilePath = path.join(__dirname, filename);
  
  if (!fs.existsSync(javaFilePath)) {
    return res.status(404).json({ error: `Java file not found: ${filename}` });
  }

  const className = path.basename(filename, '.java');
  
  // Compile Java file
  exec(`javac ${javaFilePath}`, (compileError, compileStdout, compileStderr) => {
    if (compileError) {
      return res.status(500).json({ 
        error: 'Compilation failed', 
        details: compileStderr 
      });
    }

    const javaDir = path.dirname(javaFilePath);
    
    // Run compiled Java class
    exec(`cd ${javaDir} && java ${className}`, (runError, runStdout, runStderr) => {
      if (runError) {
        return res.status(500).json({ 
          error: 'Execution failed', 
          details: runStderr 
        });
      }

      res.json({ 
        success: true, 
        output: runStdout,
        stderr: runStderr || null
      });
    });
  });
});

// Endpoint to process insurance data according to business rules
app.post('/process-insurance-data', (req, res) => {
  try {
    const insuranceData = req.body;

    if (!insuranceData || typeof insuranceData !== 'object') {
      return res.status(400).json({ 
        error: 'Invalid request. Expected JSON object with insurance policy data.' 
      });
    }

    // Debug logging - see what we're receiving
    console.log('='.repeat(60));
    console.log('Received request body keys:', Object.keys(insuranceData));
    console.log('Has generalLiabilityLimits?', !!insuranceData.generalLiabilityLimits);
    console.log('Has otherCoverageLimits?', !!insuranceData.otherCoverageLimits);
    if (insuranceData.generalLiabilityLimits) {
      console.log('GL Limits in request:', JSON.stringify(insuranceData.generalLiabilityLimits));
    }
    if (insuranceData.otherCoverageLimits) {
      console.log('Other Coverage Limits count in request:', insuranceData.otherCoverageLimits.length);
    }
    console.log('='.repeat(60));

    // Process the data according to business rules
    const originalData = JSON.parse(JSON.stringify(insuranceData));
    
    // Create a fresh copy to avoid mutation issues
    const dataToProcess = JSON.parse(JSON.stringify(insuranceData));
    const processedData = InsuranceDataProcessor.process(dataToProcess);
    const summary = InsuranceDataProcessor.getProcessingSummary(originalData, processedData);

    // Debug logging (remove in production)
    console.log('Processing insurance data...');
    console.log('GL Limits before:', originalData.generalLiabilityLimits);
    console.log('GL Limits after:', processedData.generalLiabilityLimits);
    console.log('Other Coverage Limits count:', processedData.otherCoverageLimits?.length);

    res.json({
      success: true,
      processedData: processedData,
      summary: summary,
      message: 'Insurance data processed successfully according to business extraction rules'
    });
  } catch (error) {
    console.error('Error processing insurance data:', error);
    res.status(500).json({ 
      error: 'Failed to process insurance data', 
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Use POST /run-java or GET /run-java/:filename to execute Java scripts`);
  console.log(`Use POST /process-insurance-data to process insurance policy data`);
});

