const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// Middleware
app.use(bodyParser.json());

// Routes
const centerRoutes = require('./routes/centerRoutes');
app.use('/api', centerRoutes);

// Server
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});

