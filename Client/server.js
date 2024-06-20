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

app.use(bodyParser.json());

// Define schema and model
const machineDataSchema = new mongoose.Schema({
  selectedMachine: String,
  shift: String,
  date: String, // Date stored as string
  totalWorking: String,
  hours: [String],
  status: String,
});

machineDataSchema.index({ selectedMachine: 1, shift: 1, date: 1 }); 

const MachineData = mongoose.model('MachineData', machineDataSchema);

// GET endpoint to fetch existing machine data by selectedMachine and shift
app.get('/api/machineData', async (req, res) => {
  const { selectedMachine, shift } = req.query;

  try {
    const machineData = await MachineData.findOne({ selectedMachine, shift });
    res.json(machineData);
  } catch (error) {
    console.error('Error fetching machine data:', error);
    res.status(500).send('Error fetching machine data');
  }
});

// POST endpoint to create or update machine data
app.post('/api/machineData', async (req, res) => {
  const { selectedMachine, shift, date, totalWorking, hours } = req.body;

  try {
    // Check if machine data already exists for the selected machine, shift, and date
    let machineData = await MachineData.findOne({ selectedMachine, shift, date });

    if (machineData) {
      // Update existing machine data
      machineData.shift = shift; 
      machineData.date = date;
      machineData.totalWorking = totalWorking;
      machineData.hours = hours;
      machineData.completedHours = hours.reduce((acc, hour, index) => {
        if (hour !== '') {
          acc.push(index);
        }
        return acc;
      }, []);
      
      machineData.status = machineData.completedHours.length === 8 ? 'Completed' : 'Active';

      await machineData.save();
      res.status(200).send('Machine data updated successfully');
    } else {
      // Create new machine data entry
      const newMachineData = new MachineData({
        selectedMachine,
        shift,
        date,
        totalWorking,
        hours,
        completedHours: hours.reduce((acc, hour, index) => {
          if (hour !== '') {
            acc.push(index);
          }
          return acc;
        }, []),
        status: 'Active',
      });

      newMachineData.status = newMachineData.completedHours.length === 8 ? 'Completed' : 'Active';

      await newMachineData.save();
      res.status(201).send('Machine data saved successfully');
    }
  } catch (error) {
    console.error('Error saving or updating machine data:', error);
    res.status(400).send('Error saving or updating machine data');
  }
});

// PUT endpoint to update existing machine data by ID
app.put('/api/machineData/:id', async (req, res) => {
  const { id } = req.params;
  const { selectedMachine, shift, date, totalWorking, hours } = req.body;

  try {
    const updatedMachineData = await MachineData.findByIdAndUpdate(
      id,
      {
        selectedMachine,
        shift,
        date,
        totalWorking,
        hours,
        completedHours: hours.reduce((acc, hour, index) => {
          if (hour !== '') {
            acc.push(index);
          }
          return acc;
        }, []),
        status: hours.every(hour => hour !== '') ? 'Completed' : 'Active',
      },
      { new: true }
    );

    if (updatedMachineData) {
      res.status(200).send('Machine data updated successfully');
    } else {
      res.status(404).send('Machine data not found');
    }
  } catch (error) {
    console.error('Error updating machine data:', error);
    res.status(400).send('Error updating machine data');
  }
});

// API endpoint to update a specific hour in machine data
// app.put('/api/machine-form/:id/hour/:index', async (req, res) => {
//   const { id, index } = req.params;
//   const { hour } = req.body;

//   try {
//     const machineData = await MachineData.findById(id);
//     if (!machineData) {
//       return res.status(404).json({ error: 'Machine data not found' });
//     }

//     // Update the specific hour
//     machineData.hours[index] = hour;

//     // Check if all hours are filled
//     const allHoursFilled = machineData.hours.every(h => h !== '');
//     if (allHoursFilled) {
//       machineData.status = 'completed';
//     }

//     // Save the updated document
//     await machineData.save();
//     res.status(200).json({ message: 'Hour updated successfully', status: machineData.status });
//   } catch (error) {
//     console.error('Error updating hour:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// app.get('/api/machine-form', async (req, res) => {
//   const { selectedMachine, status } = req.query;

//   try {
//     const machineData = await MachineData.findOne({ selectedMachine, status });
//     if (!machineData) {
//       return res.status(404).json({ error: 'Machine data not found' });
//     }

//     res.status(200).json(machineData);
//   } catch (error) {
//     console.error('Error fetching machine data:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });


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
