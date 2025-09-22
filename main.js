const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Use CORS middleware
app.use(cors());

// Middleware to accept all types of data and convert to string
app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.urlencoded({ extended: true })); // for form data
app.use(bodyParser.text({ type: 'text/plain' }));
app.use(bodyParser.raw({ type: '*/*' })); // fallback for anything else

// Store last received data as a string
let lastReceivedDataString = null;

// POST endpoint to receive any data
app.post('/api/data', (req, res) => {
  let receivedString;

  if (typeof req.body === 'string') {
    // Text or raw data
    receivedString = req.body;
  } else if (Buffer.isBuffer(req.body)) {
    // Raw binary data
    receivedString = req.body.toString('utf-8');
  } else if (typeof req.body === 'object') {
    // JSON or form data
    receivedString = JSON.stringify(req.body);
  } else {
    receivedString = 'Unsupported data format';
  }

  // Store the stringified data
  lastReceivedDataString = receivedString;

  console.log('Received data as string:', receivedString);

  res.status(200).json({
    message: 'Data received successfully!',
    receivedData: receivedString
  });
});

// GET endpoint to return last received string
app.get('/api/data', (req, res) => {
  if (lastReceivedDataString) {
    res.status(200).json({
      message: 'Here is the last received data (as string)',
      data: lastReceivedDataString
    });
  } else {
    res.status(404).json({
      message: 'No data has been received yet'
    });
  }
});

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
