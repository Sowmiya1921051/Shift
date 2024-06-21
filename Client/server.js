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




// // Define a schema and model
// const formSchema = new mongoose.Schema({
//   machine: String,
//   shift: String,
//   date: String,
//   totalWorking: String,
//   status: { type: String, enum: ['active', 'completed'], default: 'active' } 
// });

// const Form = mongoose.model('Form', formSchema);

// // Routes
// app.post('/submit', async (req, res) => {
//   try {
//     const formData = new Form(req.body);
//     const savedForm = await formData.save();
//     res.status(200).send(savedForm);
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });














// Define Schema and Model (Assuming you have a Machine schema)
const machineSchema = new mongoose.Schema({
  selectedMachine: String,
  shift: String,
  totalWorking: String,
  date: String,
  hours: [String],
  status: {
    type: String,
    default: 'Incomplete', // Default status
  },
});


const Machine = mongoose.model('Machine', machineSchema);

// Assuming you have already defined your machineSchema and Machine model

app.post('/api/machines', async (req, res) => {
  const { selectedMachine, shift, totalWorking, date, hours } = req.body;

  try {
    // Find the latest document with the same machine and shift
    let existingMachine = await Machine.findOne({ selectedMachine, shift }).sort({ _id: -1 });

    if (existingMachine) {
      if (existingMachine.status === 'Incomplete') {
        // Update the existing document if status is Incomplete
        existingMachine.totalWorking = totalWorking;
        existingMachine.date = date;
        existingMachine.hours = hours;
        
        // Calculate status based on filled hours
        const completedHours = hours.filter(hour => hour !== '').length;
        existingMachine.status = completedHours === 8 ? 'Complete' : 'Incomplete';

        const updatedMachine = await existingMachine.save();
        return res.status(200).json(updatedMachine);
      } else {
        // Create a new document if status is Complete
        const newMachine = new Machine({
          selectedMachine,
          shift,
          totalWorking,
          date,
          hours,
          status: hours.every(hour => hour !== '') ? 'Complete' : 'Incomplete',
        });

        const savedMachine = await newMachine.save();
        return res.status(201).json(savedMachine);
      }
    } else {
      // Create a new document if no existing document found
      const newMachine = new Machine({
        selectedMachine,
        shift,
        totalWorking,
        date,
        hours,
        status: hours.every(hour => hour !== '') ? 'Complete' : 'Incomplete',
      });

      const savedMachine = await newMachine.save();
      return res.status(201).json(savedMachine);
    }
  } catch (err) {
    console.error('Error saving machine:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});



app.get('/api/machines/:selectedMachine/:shift', async (req, res) => {
  const { selectedMachine, shift } = req.params;

  try {
    const machine = await Machine.findOne({ selectedMachine, shift, status: 'Incomplete' });
    if (!machine) {
      return res.status(404).json({ message: 'Machine not found' });
    }
    res.json(machine);
  } catch (err) {
    res.status(500).json({ message: err.message });
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
