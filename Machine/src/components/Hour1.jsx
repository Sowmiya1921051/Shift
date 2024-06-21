// src/MachineList.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MachineList() {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMachineFilter, setSelectedMachineFilter] = useState('');
  const [shiftFilter, setShiftFilter] = useState('');

  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/machines'); // Adjust URL as per your backend API endpoint
        setMachines(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching machines:', error);
        setError('Error fetching data'); // Handle error state
        setLoading(false);
      }
    };

    fetchMachines();
  }, []);

  // Function to handle filter change
  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    if (name === 'selectedMachine') {
      setSelectedMachineFilter(value);
    } else if (name === 'shift') {
      setShiftFilter(value);
    }
  };

  // Apply filters and get filtered machines
  const filteredMachines = machines.filter((machine) => {
    if (selectedMachineFilter && machine.selectedMachine !== selectedMachineFilter) {
      return false;
    }
    if (shiftFilter && machine.shift !== shiftFilter) {
      return false;
    }
    return true;
  });

  if (loading) {
    return <div>Loading...</div>; // Render loading state while fetching data
  }

  if (error) {
    return <div>Error: {error}</div>; // Render error message if fetch fails
  }

  // Function to group machines by selectedMachine and shift
  const groupedMachines = filteredMachines.reduce((acc, machine) => {
    const key = `${machine.selectedMachine}_${machine.shift}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(machine);
    return acc;
  }, {});

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">List of Machines</h1>

      {/* Filter Options */}
      <div className="flex mb-4">
        <div className="mr-4">
          <label className="block font-medium">Select Machine:</label>
          <select
            name="selectedMachine"
            value={selectedMachineFilter}
            onChange={handleFilterChange}
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">All Machines</option>
            {/* Replace with actual machine options fetched from backend if needed */}
            <option value="Machine 1">Machine 1</option>
            <option value="Machine 2">Machine 2</option>
            {/* Add more options as needed */}
          </select>
        </div>

        <div>
          <label className="block font-medium">Select Shift:</label>
          <select
            name="shift"
            value={shiftFilter}
            onChange={handleFilterChange}
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">All Shifts</option>
            <option value="Morning">Morning</option>
            <option value="Evening">Evening</option>
            {/* Add more options as needed */}
          </select>
        </div>
      </div>

      {/* Render filtered and grouped machines */}
      {Object.keys(groupedMachines).map((groupKey) => {
        const [selectedMachine, shift] = groupKey.split('_');
        return (
          <div key={groupKey} className="mb-8">
            <h2 className="text-xl font-semibold mb-4">{selectedMachine} - {shift}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {groupedMachines[groupKey].map((machine) => (
                <div key={machine._id} className="border p-4 rounded shadow">
                  <h3 className="text-lg font-semibold">{machine.selectedMachine}</h3>
                  <p>Date: {machine.date}</p>
                  <p>Shift: {machine.shift}</p>
                  <p>Total Working: {machine.totalWorking}</p>
                  <p>Status: {machine.status}</p>
                  <ul className="mt-2">
                    {machine.hours.map((hour, index) => (
                      <li key={index}>Hour {index + 1}: {hour}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default MachineList;
