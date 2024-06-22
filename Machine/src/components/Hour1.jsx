import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function MachineList() {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMachineFilter, setSelectedMachineFilter] = useState('');
  const [shiftFilter, setShiftFilter] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/machines'); // Adjust URL as per your backend API endpoint
        setMachines(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching machines:', error);
        setError('Error fetching data');
        setLoading(false);
      }
    };

    fetchMachines();
  }, []);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    if (name === 'selectedMachine') {
      setSelectedMachineFilter(value);
    } else if (name === 'shift') {
      setShiftFilter(value);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const filteredMachines = machines.filter((machine) => {
    if (selectedMachineFilter && machine.selectedMachine !== selectedMachineFilter) {
      return false;
    }
    if (shiftFilter && machine.shift !== shiftFilter) {
      return false;
    }
    if (selectedDate && new Date(machine.date).toISOString().slice(0, 10) !== selectedDate.toISOString().slice(0, 10)) {
      return false;
    }
    return true;
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const groupedMachines = filteredMachines.reduce((acc, machine) => {
    const key = `${machine.selectedMachine}_${machine.shift}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(machine);
    return acc;
  }, {});

  return (
    <div className="container mx-auto mt-8 border-2 border-gray-300 p-4">
      <h1 className="text-2xl font-bold mb-4">List of Machines</h1>

      <div className="flex mb-4 space-x-4">
        <div>
          <label className="block font-medium">Select Machine:</label>
          <select
            name="selectedMachine"
            value={selectedMachineFilter}
            onChange={handleFilterChange}
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">All Machines</option>
            <option value="Machine 1">Machine 1</option>
            <option value="Machine 2">Machine 2</option>
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
          </select>
        </div>

        <div>
          <label className="block font-medium">Select Date:</label>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            dateFormat="yyyy-MM-dd"
            placeholderText="Select date"
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
          />
        </div>
      </div>

      {Object.keys(groupedMachines).map((groupKey, groupIndex) => {
        const [selectedMachine, shift] = groupKey.split('_');
        const targetQuality = groupedMachines[groupKey][0]?.totalWorking || 0; // Get the target quality
        const targetQualityPerHour = parseFloat((targetQuality / 8).toFixed(2)); // Calculate target quality per hour

        return (
          <div key={groupKey} className={`mb-8 ${groupIndex > 0 ? 'mt-8' : ''} border-2 border-gray-400 p-4`}>
            <h2 className="text-xl font-semibold mb-4">{selectedMachine} - {shift}</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 border">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-lg font-bold text-black uppercase tracking-wider border">
                      Shift
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-lg font-bold text-black uppercase tracking-wider border">
                      Target Quality
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-lg font-bold text-black uppercase tracking-wider border">
                      Produced Quality
                    </th>
                    {/* <th scope="col" className="px-6 py-3 text-left text-lg font-bold text-black uppercase tracking-wider border">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-lg font-bold text-black uppercase tracking-wider border">
                      Status
                    </th> */}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {groupedMachines[groupKey].map((machine, index) => (
                    <tr key={machine._id} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                      <td className="px-6 py-4 whitespace-nowrap border">
                        <div className="text-sm text-gray-900">{machine.selectedMachine}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap border">
                        <div className="text-sm text-gray-900">{machine.totalWorking}</div>
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap border">
                        <div className="text-sm text-gray-900">{machine.date}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap border">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${machine.status === 'Complete' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {machine.status}
                        </span>
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <h3 className="text-lg font-semibold mt-4 mb-2">Hour Details</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 border">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-lg font-bold text-black uppercase tracking-wider border">
                      Current Shift
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-lg font-bold text-black uppercase tracking-wider border">
                     {targetQuality}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-lg font-bold text-black uppercase tracking-wider border">
                      
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-lg font-bold text-black uppercase tracking-wider border">
                     
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-lg font-bold text-black uppercase tracking-wider border">

                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {groupedMachines[groupKey].map((machine) => (
                    machine.hours.map((hour, index) => {
                      const percentage = parseFloat(((hour / targetQualityPerHour) * 100).toFixed(2)); // Calculate percentage of target quality for the hour
                      return (
                        <tr key={`${machine._id}-hour-${index}`} className="bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap border">
                            <div className="text-sm text-gray-900">Hour {index + 1}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap border">
                            <div className="text-sm text-gray-900">{targetQualityPerHour}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap border">
                            <div className="text-sm text-gray-900">{hour}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap border">
                            <div className="text-sm text-gray-900">{percentage} %</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap border">
                            <div className="flex items-center justify-center h-6 w-6 rounded-full">
                              <div
                                className="h-full w-full rounded-full"
                                style={{
                                  backgroundColor:
                                    percentage >= 80
                                      ? '#10B981' // Green color
                                      : percentage >= 70
                                        ? '#F59E0B' // Yellow color
                                        : '#EF4444' // Red color
                                }}
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ))}
                </tbody>
              </table >
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default MachineList;

