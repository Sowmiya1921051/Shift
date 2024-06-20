import React, { useState, useEffect } from 'react';

const MachineForm = () => {
  const hours = Array.from({ length: 8 }, (_, i) => i + 1);
  const [formData, setFormData] = useState({
    selectedMachine: '',
    shift: '',
    totalWorking: '',
    date: '',
    hours: Array(8).fill(''),
    status: '',
  });

  useEffect(() => {
    const fetchMachineData = async () => {
      if (formData.selectedMachine) {
        try {
          const response = await fetch(`http://localhost:3000/api/machineData?selectedMachine=${formData.selectedMachine}`);
          if (response.ok) {
            const data = await response.json();
            if (data && data.status !== 'Completed') {
              setFormData({
                selectedMachine: data.selectedMachine,
                shift: data.shift,
                totalWorking: data.totalWorking,
                date: data.date,
                hours: data.hours,
                status: data.status,
              });
            }
          } else {
            console.error('Failed to fetch machine data');
          }
        } catch (error) {
          console.error('Error fetching machine data:', error);
        }
      }
    };

    fetchMachineData();
  }, [formData.selectedMachine]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleHourChange = (index, value) => {
    setFormData((prevData) => {
      const newHours = [...prevData.hours];
      newHours[index] = value;
      return { ...prevData, hours: newHours };
    });
  };

  const handleAdd = async () => {
    const { selectedMachine, shift, totalWorking, date, hours } = formData;

    try {
      const response = await fetch('http://localhost:3000/api/machineData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedMachine,
          shift,
          totalWorking,
          date,
          hours,
        }),
      });

      if (response.ok) {
        const result = await response.text();
        alert(result);
        setFormData({
          selectedMachine: '',
          shift: '',
          totalWorking: '',
          date: '',
          hours: Array(8).fill(''),
          status: '',
        });
      } else {
        alert('Failed to submit data');
      }
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 flex flex-col lg:flex-row justify-center space-y-6 lg:space-y-0 lg:space-x-6">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
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

          <div className="grid grid-cols-1 gap-4">
            {hours.map((hour, index) => (
              <div key={hour} className="flex items-center space-x-2">
                <label className="block text-gray-700 text-sm font-bold text-center w-20">{`Hour - ${hour}`}</label>
                <input
                  className="shadow appearance-none text-center border rounded flex-grow py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="text"
                  placeholder={`Hour ${hour}`}
                  value={formData.hours[index]}
                  onChange={(e) => handleHourChange(index, e.target.value)}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-4">
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
