import React, { useState } from 'react';
import axios from 'axios';

const MyForm = () => {
  const [selectMachine, setSelectMachine] = useState('');
  const [selectShift, setSelectShift] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [notification, setNotification] = useState('');

  const handleSelectChangeMachine = (e) => setSelectMachine(e.target.value);
  const handleSelectChangeShift = (e) => setSelectShift(e.target.value);
  const handleDateChange = (e) => setDateInput(e.target.value);
  const handleTextChange = (e) => setTextInput(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      machine: selectMachine,
      shift: selectShift,
      date: dateInput,
      totalWorking: textInput,
    };

    axios.post('http://localhost:3000/submit', formData)
      .then(response => {
        console.log('Data submitted:', response.data);
        setNotification('Form submitted successfully!');

        // Clear form fields
        setSelectMachine('');
        setSelectShift('');
        setDateInput('');
        setTextInput('');

        // Reload the page after a short delay
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      })
      .catch(error => {
        console.error('Error submitting data:', error);
        setNotification('Failed to submit form. Please try again.');
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Form</h2>
        {notification && (
          <div className="mb-4 text-green-500 text-center">
            {notification}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="selectMachine">
              Select Machine
            </label>
            <select
              id="selectMachine"
              value={selectMachine}
              onChange={handleSelectChangeMachine}
              className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Choose the Machine</option>
              <option value="machine1">Machine 1</option>
              <option value="machine2">Machine 2</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="selectShift">
              Select Shift
            </label>
            <select
              id="selectShift"
              value={selectShift}
              onChange={handleSelectChangeShift}
              className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Choose the Shift</option>
              <option value="morning">Morning</option>
              <option value="evening">Evening</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="dateInput">
              Date
            </label>
            <input
              id="dateInput"
              type="date"
              value={dateInput}
              onChange={handleDateChange}
              className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="textInput">
              Total Working
            </label>
            <input
              id="textInput"
              type="text"
              value={textInput}
              onChange={handleTextChange}
              className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter total working hours"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Form</h2>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="selectInput">
              Select Option
            </label>
            <select
              id="selectInput"
              className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Choose the Machine</option>
              <option value="option1">Machine 1</option>
              <option value="option2">Machine 2</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="selectInput">
              Select Option
            </label>
            <select
              id="selectInput"
              className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Choose the Shift</option>
              <option value="option1">Shift 1</option>
              <option value="option2">Shift 2</option>
            </select>
          </div>
          {Array.from({ length: 8 }).map((_, index) => (
            <div className="mb-4 flex items-center" key={index}>
              <label className="block text-gray-700 font-bold mb-2" htmlFor={`input${index + 1}`}>
                hour{index + 1}
              </label>
              <input
                type="text"
                id={`input${index + 1}`}
                className="w-60 ml-8 px-3 py-2 border border-gray-300 rounded-lg text-center focus:outline-none focus:border-blue-500"
                placeholder={`Input ${index + 1}`}
              />
              <button
                type="button"
                className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Add
              </button>
            </div>
          ))}
          <div className="flex justify-center">
            <button
              type="submit"
              className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
};

export default MyForm;
