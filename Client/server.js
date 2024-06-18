const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
// const Shift = require('./models/Shift'); // Import the Shift model
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

const ShiftSchema = new mongoose.Schema({
  shift: String,
  targetQuantity: Number,
  producedQuantity: Number,
  efficiency: Number,
});

const Shift = mongoose.model('Shift', ShiftSchema);
module.exports = Shift;


const machineDataSchema = new mongoose.Schema({
  selectedMachine: String,
  shift: String,
  date: String, // Date stored as string
  totalWorking: String,
  hours: [String],
  status: String,
});

const MachineData = mongoose.model('MachineData', machineDataSchema);

// API endpoint to handle form submissions
app.post('/api/machine-form', async (req, res) => {
  const { selectedMachine, shift, hours, date, totalWorking, status } = req.body;

  try {
    const newMachineData = new MachineData({
      selectedMachine,
      shift,
      date,
      totalWorking,
      hours,
      status,
    });

    const savedMachineData = await newMachineData.save();
    res.status(201).json({ message: 'Machine data saved successfully', _id: savedMachineData._id });
  } catch (error) {
    console.error('Error saving machine data:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// API endpoint to update a specific hour in machine data
app.put('/api/machine-form/:id/hour/:index', async (req, res) => {
  const { id, index } = req.params;
  const { hour } = req.body;

  try {
    const machineData = await MachineData.findById(id);
    if (!machineData) {
      return res.status(404).json({ error: 'Machine data not found' });
    }

    // Update the specific hour
    machineData.hours[index] = hour;

    // Check if all hours are filled
    const allHoursFilled = machineData.hours.every(h => h !== '');
    if (allHoursFilled) {
      machineData.status = 'completed';
    }

    // Save the updated document
    await machineData.save();
    res.status(200).json({ message: 'Hour updated successfully', status: machineData.status });
  } catch (error) {
    console.error('Error updating hour:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/machine-form', async (req, res) => {
  const { selectedMachine, status } = req.query;

  try {
    const machineData = await MachineData.findOne({ selectedMachine, status });
    if (!machineData) {
      return res.status(404).json({ error: 'Machine data not found' });
    }

    res.status(200).json(machineData);
  } catch (error) {
    console.error('Error fetching machine data:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


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

app.post('/api/saveShifts', async (req, res) => {
  try {
    const { previousShifts, currentShifts } = req.body;

    const allShifts = [...previousShifts, ...currentShifts];

    await Shift.insertMany(allShifts);

    console.log('Shifts saved to the database');
    res.status(200).json({ message: 'Shifts saved successfully' });
  } catch (error) {
    console.error('Error saving shifts:', error);
    res.status(500).json({ message: 'Server error' });
  }
});




// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
