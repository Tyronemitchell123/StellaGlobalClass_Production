const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname));

// Mock login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'password') {
    res.json({ success: true, token: 'mock-veridian-token-123' });
  } else {
    res.json({ success: false });
  }
});

// Mock API endpoints for dashboard functionality
app.get('/api/cameras', (req, res) => {
  res.json({
    cameras: [
      { id: 1, name: 'Front Entrance', status: 'active' },
      { id: 2, name: 'Back Garden', status: 'active' },
      { id: 3, name: 'Garage Access', status: 'inactive' }
    ]
  });
});

app.get('/api/ai-status', (req, res) => {
  res.json({ status: { model: 'Neural Network v2.1', accuracy: 98.7, status: 'active' } });
});

app.get('/api/weather/:city', (req, res) => {
  const { city } = req.params;
  res.json({ city, temperature: 22, condition: 'Clear', humidity: 60 });
});

app.post('/api/chat', (req, res) => {
  const { message } = req.body;
  // Mock response
  res.json({ response: `Thank you for your message: "${message}". Your concierge is attending to it.` });
});

app.post('/api/contact', (req, res) => {
  const data = req.body;
  res.json({ message: 'Your request has been submitted successfully. A concierge will contact you shortly.' });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'concierge-landing.html'));
});

app.get('/concierge', (req, res) => {
  res.sendFile(path.join(__dirname, 'concierge-landing.html'));
});

app.listen(8000, () => {
  console.log('Server running at http://127.0.0.1:8000/');
});
