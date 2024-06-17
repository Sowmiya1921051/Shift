const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const User = require('./models/User');
const app = express();
const port = 3000; 

// MongoDB connection URI
const mongoURI = 'mongodb://localhost:27017/Machine'; // Replace with your MongoDB URI

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

    const db = mongoose.connection;
    db.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    db.once('open', () => {
      console.log('Connected to MongoDB successfully');
    });
    
    // Middleware
    app.use(cors());
    app.use(bodyParser.json());
    
    // Routes
    app.get('/', (req, res) => {
      res.send('Hello World.💥..!');
    });
    
    app.post('/register', async (req, res) => {
      try {
        const { username, email, password } = req.body;
    
        if (!username || !email || !password) {
          return res.status(400).json({ message: 'All fields are required' });
        }
    
        const existingUser = await User.findOne({ username });
        if (existingUser) {
          return res.status(400).json({ message: 'Username already exists' });
        }
    
        const newUser = new User({ username, email, password });
        await newUser.save();
    
        console.log('User registered successfully with values:', { username, email, password });
        res.status(201).json({ message: 'User registered successfully!' });
      } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Server error' });
      }
    });
    
    app.post('/login', async (req, res) => {
      try {
        const { username, password } = req.body;
    
        if (!username || !password) {
          return res.status(400).json({ message: 'All fields are required' });
        }
     
        const user = await User.findOne({ username });
        if (!user || user.password !== password) {
          return res.status(401).json({ message: 'Username or password is incorrect' });
        }
    
        console.log('User logged in successfully with values:', { username, password });
        res.status(200).json({ message: 'Login successful!' });
      } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error' });
      }
    });
    

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
