import React, { useState } from 'react';
import axios from 'axios'; // Import Axios for making HTTP requests

const OptionsDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [totalWorking, setTotalWorking] = useState('');
  const [day, setDay] = useState('');
  const [shift, setShift] = useState('');
  const [hours, setHours] = useState(Array(8).fill(''));
  const [isEditing, setIsEditing] = useState(false);

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  
  const handleSelectMachine = (machineNumber) => {
    setSelectedMachine(machineNumber);
    setIsOpen(false);
  };

  const handleInputChange = (index, value) => {
    const newHours = [...hours];
    newHours[index] = value;
    setHours(newHours);
  };

  const handleShiftChange = (e) => {
    setShift(e.target.value);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsEditing(false);
    try {
      // Send POST request to your Node.js server
      await axios.post('http://localhost:3000/api/machine1', {
        selectedMachine,
        totalWorking,
        day,
        shift,
        hours
      });
      alert('Data saved successfully!');
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Failed to save data. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="max-w-lg w-full bg-white p-4 rounded-lg shadow-lg">
        <div className="relative inline-block text-left">
          <div>
            <p>Machine Number :</p>
            <button
              onClick={handleToggleDropdown}
              className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100 mt-2"
              aria-expanded={isOpen ? 'true' : 'false'}
            >
              {selectedMachine || 'Select Machine'}
              <svg
                className={`ml-2 h-5 w-5 ${isOpen ? 'transform rotate-180' : ''}`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M6.293 7.293a1 1 0 011.414 0L10 9.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {/* Dropdown panel, conditional rendering based on isOpen state */}
          {isOpen && (
            <div
              className="origin-top absolute mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100"
              style={{ left: '50%', transform: 'translateX(-50%)' }}
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="options-menu"
            >
              <div className="py-1">
                <div className="flex justify-between px-4 py-2">
                  <span onClick={() => handleSelectMachine('Machine 1')}>Machine CNC-01</span>
                </div>
                <div className="flex justify-between px-4 py-2">
                  <span onClick={() => handleSelectMachine('Machine 2')}>Machine CNC-02</span>
                </div>
                {/* Add more machine numbers and corresponding options as needed */}
              </div>
            </div>
          )}
        </div>

        {/* Input values */}
        <div className="mt-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Working:</label>
            <input
              type="text"
              value={totalWorking}
              onChange={(e) => setTotalWorking(e.target.value)}
              className={`border ${isEditing ? 'border-gray-300' : 'border-transparent'} rounded-md px-3 py-2 w-full`}
              readOnly={!isEditing}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Day:</label>
            <input
              type="date"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              className={`border ${isEditing ? 'border-gray-300' : 'border-transparent'} rounded-md px-3 py-2 w-full`}
              readOnly={!isEditing}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Shift:</label>
            <select
              value={shift}
              onChange={handleShiftChange}
              className={`border ${isEditing ? 'border-gray-300' : 'border-transparent'} rounded-md px-3 py-2 w-full`}
              disabled={!isEditing}
            >
              <option value="">Select Shift</option>
              <option value="Morning">Previour shift - 1</option>
              <option value="Evening">Previour shift - 2</option>
            </select>
          </div>
          {hours.map((hour, index) => (
            <div className="mb-4" key={index}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{`Hour - ${index + 1}:`}</label>
              <input
                type="text"
                value={hour}
                onChange={(e) => handleInputChange(index, e.target.value)}
                className={`border ${isEditing ? 'border-gray-300' : 'border-transparent'} rounded-md px-3 py-2 w-full`}
                readOnly={!isEditing}
              />
            </div>
          ))}
        </div>

        {/* Edit and Save buttons */}
        <div className="flex justify-end mt-4">
          {!isEditing && (
            <button
              onClick={handleEdit}
              className="px-4 py-2 mr-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Edit
            </button>
          )}
          {isEditing && (
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OptionsDropdown;
