import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MachineForm = () => {
  const [formData, setFormData] = useState({
    selectedMachine: '',
    shift: '',
    hours: Array(8).fill(''),
    date: '',
    totalWorking: '',
    status: null,
  });

  const [machineDataId, setMachineDataId] = useState(null); // Store the ID of the submitted data

  useEffect(() => {
    const filledHours = formData.hours.filter(hour => hour !== '');
    const status = filledHours.length === 8 ? 'completed' : null;
    setFormData(prevState => ({
      ...prevState,
      status: status,
    }));
  }, [formData.hours]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleHoursChange = (index, value) => {
    const newHours = [...formData.hours];
    newHours[index] = value;
    setFormData({
      ...formData,
      hours: newHours,
    });
  };

  const handleAddHourToDB = async (index) => {
  if (!machineDataId) {
    console.error('Machine data ID is not set');
    return;
  }

  try {
    const hourValue = formData.hours[index];

    await axios.put(`http://localhost:3000/api/machine-form/${machineDataId}/hour/${index}`, { hour: hourValue });

    console.log(`Hour ${index + 1} updated successfully`);
  } catch (error) {
    console.error('Error updating hour:', error);
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/machine-form', formData);
      console.log('Form data sent successfully');
      setMachineDataId(response.data._id); // Store the ID of the newly created machine data entry
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto mt-8 flex justify-center">
      <div className="bg-white shadow-md rounded-lg p-6 mr-4 w-full max-w-md">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="selectedMachine">
              Select Machine
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="selectedMachine"
              name="selectedMachine"
              value={formData.selectedMachine}
              onChange={handleInputChange}
            >
              <option value="">Select Machine</option>
              <option value="Machine 1">Machine 1</option>
              <option value="Machine 2">Machine 2</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="shift">
              Select Shift
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="shift"
              name="shift"
              value={formData.shift}
              onChange={handleInputChange}
            >
              <option value="">Select Shift</option>
              <option value="Morning">Morning</option>
              <option value="Evening">Evening</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="totalWorking">
              Total Working
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="totalWorking"
              name="totalWorking"
              type="text"
              value={formData.totalWorking}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
              Date
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex justify-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
      </div>

      <div className="bg-pink-200 rounded-lg p-6 w-full max-w-md">
      <select
        className="block appearance-none w-full bg-white border border-gray-300 
                   hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
      >
        <option>Option 1</option>
        <option>Option 2</option>
        <option>Option 3</option>
        <option>Option 4</option>
      </select>
        <div className="grid grid-cols-2 gap-4">
          {formData.hours.map((hour, index) => (
            <div key={index} className="flex flex-col items-center">
              <label className="block text-gray-700 text-sm font-bold mb-1">Hour {index + 1}</label>
              <div className="flex items-center">
                <input
                  className="shadow appearance-none border rounded w-20 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="number"
                  value={hour}
                  onChange={(e) => handleHoursChange(index, e.target.value)}
                />
                <button
                  className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                  onClick={() => handleAddHourToDB(index)}
                >
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MachineForm;