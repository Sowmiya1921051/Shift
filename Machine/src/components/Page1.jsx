import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MachineForm = () => {
  const hours = Array.from({ length: 8 }, (_, i) => i + 1);
  const [formData, setFormData] = useState({
    selectedMachine: '',
    shift: '',
    totalWorking: '',
    date: '',
    hours: Array(8).fill(''),
    status: 'Incomplete',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/machines/${formData.selectedMachine}/${formData.shift}`);
        const machineData = response.data;
        if (machineData) {
          setFormData(machineData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (formData.selectedMachine && formData.shift) {
      fetchData();
    }
  }, [formData.selectedMachine, formData.shift]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleHourChange = (index, value) => {
    setFormData(prevData => {
      const newHours = [...prevData.hours];
      newHours[index] = value;

      const newStatus = newHours.every(hour => hour !== '') ? 'Complete' : 'Incomplete';

      return { ...prevData, hours: newHours, status: newStatus };
    });
  };

  const handleAdd = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/machines', formData);
      console.log('Server response:', response.data);
      alert('Form submitted successfully!');
      
      setFormData({
        selectedMachine: '',
        shift: '',
        totalWorking: '',
        date: '',
        hours: Array(8).fill(''),
        status: 'Incomplete',
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit form. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 flex flex-col lg:flex-row justify-center space-y-6 lg:space-y-0 lg:space-x-6">
      <div className="bg-white shadow-xl rounded-lg p-6 w-full max-w-md">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="selectedMachine">
              Select Machine
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="selectedMachine"
              name="selectedMachine"
              value={formData.selectedMachine}
              onChange={handleChange}
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
              onChange={handleChange}
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
              onChange={handleChange}
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
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Hours</label>
            {hours.map((hour, index) => (
              <div key={index} className="flex items-center space-x-4 mb-2">
                <label className="text-gray-700">{`Hour ${hour}`}</label>
                <input
                  className="shadow appearance-none border rounded w-80 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="text"
                  value={formData.hours[index]}
                  onChange={(e) => handleHourChange(index, e.target.value)}
                />
              </div>
            ))}
          </div>

          {/* <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
              Status
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="status"
              name="status"
              type="text"
              value={formData.status}
              readOnly
            />
          </div> */}

          <div className="flex justify-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={handleAdd}
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MachineForm;
