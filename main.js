const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Enable CORS
app.use(cors());

// Middleware to handle various types of body content
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.raw({ type: '*/*' }));

// Variable to store last received data
let lastReceivedDataString = null;

// POST endpoint to receive data in any format
app.post('/api/data', (req, res) => {
  let receivedString;

  if (typeof req.body === 'string') {
    receivedString = req.body;
  } else if (Buffer.isBuffer(req.body)) {
    receivedString = req.body.toString('utf-8');
  } else if (typeof req.body === 'object') {
    receivedString = JSON.stringify(req.body);
  } else {
    receivedString = 'Unsupported data format';
  }

  lastReceivedDataString = receivedString;

  console.log('Received via POST:', receivedString);

  res.status(200).json({
    message: 'Data received via POST',
    receivedData: receivedString
  });
});

// GET endpoint to receive data via query parameters (link)
app.get('/api/data', (req, res) => {
  if (Object.keys(req.query).length > 0) {
    // Received data via query string
    const queryDataString = JSON.stringify(req.query);
    lastReceivedDataString = queryDataString;

    console.log('Received via GET (link):', queryDataString);

    return res.status(200).json({
      message: 'Data received via GET query parameters',
      receivedData: queryDataString
    });
  }

  // No query params; just return last POSTed data if any
  if (lastReceivedDataString) {
    return res.status(200).json({
      message: 'Previously received data',
      receivedData: lastReceivedDataString
    });
  }

  // No data at all
  res.status(404).json({
    message: 'No data has been received yet'
  });
});

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
