const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Enable CORS for all origins
app.use(cors());

// Middleware to handle all data types
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.raw({ type: '*/*' }));

// Variable to store last received data as a string
let lastReceivedDataString = null;

// POST endpoint to receive any kind of data
app.post('/api/data', (req, res) => {
  let receivedString;

  if (typeof req.body === 'string') {
    // Text or raw string
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

  lastReceivedDataString = receivedString;

  console.log('Received via POST:', receivedString);

  res.status(200).send('Data received successfully');
});

// GET endpoint to receive data via query string or return stored string
app.get('/api/data', (req, res) => {
  if (Object.keys(req.query).length > 0) {
    const queryDataString = JSON.stringify(req.query);
    lastReceivedDataString = queryDataString;

    console.log('Received via GET (query params):', queryDataString);

    return res.status(200).send(queryDataString); // Return as plain text
  }

  if (lastReceivedDataString) {
    console.log('Returned stored data:', lastReceivedDataString);
    return res.status(200).send(lastReceivedDataString); // Return as plain text
  }

  res.status(404).send('No data has been received yet');
});

// Start the server
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
