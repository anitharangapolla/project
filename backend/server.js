const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes'); // Import auth routes
const cors = require('cors');

// Initialize Express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
// Database Connection
const MONGO_URI = "mongodb+srv://admin:admin@cluster0.bynnm.mongodb.net/crud?retryWrites=true&w=majority&appName=Cluster0"; 
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err));

// Routes
app.use('/api/auth', authRoutes); // Authentication routes
// app.use('/signup', authRoutes); // Authentication routes
// app.use('/login',authRoutes);
// Test Protected Route
// Root Route
app.get('/', (req, res) => {
  res.send('Welcome to the Learning Path Generator API!');
});

// Start Server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
