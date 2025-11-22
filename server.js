const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tinylink', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// Health check
app.get('/healthz', async (req, res) => {
  try {
    // Check database connectivity
    await mongoose.connection.db.admin().ping();
    res.json({
      ok: true,
      version: '1.0.0',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      ok: false,
      version: '1.0.0',
      database: 'disconnected',
      error: 'Database connection failed',
      timestamp: new Date().toISOString()
    });
  }
});

// Stats page
app.get('/code/:code', (req, res) => {
  res.sendFile(__dirname + '/public/stats.html');
});

// Redirect route - only match codes without file extensions
app.get('/:code', async (req, res) => {
  const code = req.params.code;

  // Skip if the code contains a dot (file extension) or is a known route
  if (code.includes('.') || ['api', 'code', 'healthz'].includes(code)) {
    return res.status(404).send('Not found');
  }

  try {
    const Link = require('./models/Link');
    const link = await Link.findOne({ shortCode: code });

    if (!link) {
      return res.status(404).send('Link not found');
    }

    // Increment click count and update last clicked
    link.clicks += 1;
    link.lastClicked = new Date();
    await link.save();

    // Redirect to original URL
    res.redirect(302, link.originalUrl);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Routes will be added here

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});