const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Use CORS middleware
app.use(cors());

// Middleware to parse JSON
app.use(bodyParser.json());

// Variable to store the last received data
let lastReceivedData = null;

// POST endpoint to receive data
app.post('/api/data', (req, res) => {
  const receivedData = req.body;

  console.log('Received data:', receivedData);

  // Store the data for later retrieval
  lastReceivedData = receivedData;

  res.status(200).json({
    message: 'Data received successfully!',
    receivedData: receivedData
  });
});

// GET endpoint to return last received data
app.get('/api/data', (req, res) => {
  if (lastReceivedData) {
    res.status(200).json({
      message: 'Here is the last received data',
      data: lastReceivedData
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
