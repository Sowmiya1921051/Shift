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
        const response = await axios.get('https://localhost:3000/api/machines'); // Adjust URL as per your backend API endpoint
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

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-lg font-bold text-black uppercase tracking-wider border">
                Machine
              </th>
              <th scope="col" className="px-6 py-3 text-left text-lg font-bold text-black uppercase tracking-wider border">
                Shift
              </th>
              <th scope="col" className="px-6 py-3 text-left text-lg font-bold text-black uppercase tracking-wider border">
                Target Quality
              </th>
              <th scope="col" className="px-6 py-3 text-left text-lg font-bold text-black uppercase tracking-wider border">
                Produced Quality
              </th>
              <th scope="col" className="px-6 py-3 text-left text-lg font-bold text-black uppercase tracking-wider border">
                Efficiency
              </th>
              <th scope="col" className="px-6 py-3 text-left text-lg font-bold text-black uppercase tracking-wider border">
                Remark
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredMachines.map((machine, index) => {
              const workedHours = machine.hours.filter(hour => parseInt(hour) > 0);
              const producedQuality = workedHours.length > 0 ? workedHours.reduce((sum, hour) => sum + parseInt(hour), 0) : 0;
              const efficiency = machine.totalWorking > 0 ? Math.round((producedQuality / machine.totalWorking) * 100) : 0;

              return (
                <tr key={machine._id} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                  <td className="px-6 py-4 whitespace-nowrap border">
                    <div className="text-sm text-gray-900">{machine.selectedMachine}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border">
                    <div className="text-sm text-gray-900">{machine.shift}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border">
                    <div className="text-sm text-gray-900">{machine.totalWorking}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border">
                    <div className="text-sm text-gray-900">{producedQuality}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border">
                    <div className="text-sm text-gray-900">{efficiency}%</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border">
                    <div className="flex items-center justify-center h-6 w-6 rounded-full">
                      <div
                        className="h-full w-full rounded-full"
                        style={{
                          backgroundColor:
                            efficiency >= 80
                              ? '#10B981' // Green color
                              : efficiency >= 70
                                ? '#F59E0B' // Yellow color
                                : '#EF4444' // Red color
                        }}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredMachines.some(machine => machine.status === 'Incomplete') && (
        <>
          <h3 className="text-lg font-semibold mt-4 mb-2">Hour Details</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-lg font-bold text-black uppercase tracking-wider border">
                    Hour
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-lg font-bold text-black uppercase tracking-wider border">
                    Target Quality Per Hour
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-lg font-bold text-black uppercase tracking-wider border">
                    Produced Quality Per Hour
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-lg font-bold text-black uppercase tracking-wider border">
                    Efficiency
                  </th> 
                  <th scope="col" className="px-6 py-3 text-left text-lg font-bold text-black uppercase tracking-wider border">
                    Remark
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMachines.map(machine => (
                  machine.status === 'Incomplete' && machine.hours.map((hourValue, hourIndex) => {
                    const producedQualityPerHour = parseInt(hourValue) || 0;
                    const targetQualityPerHour = parseFloat((machine.totalWorking / 8).toFixed(2));
                    const efficiencyPerHour = targetQualityPerHour > 0 ? Math.round((producedQualityPerHour / targetQualityPerHour) * 100) : 0;

                    return (
                      <tr key={`${machine._id}_${hourIndex}`} className={hourIndex % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                      <td className="px-6 py-4 whitespace-nowrap border">
                        <div className="text-sm text-gray-900">{hourIndex + 1}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap border">
                        <div className="text-sm text-gray-900">{targetQualityPerHour}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap border">
                        <div className="text-sm text-gray-900">{producedQualityPerHour}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap border">
                        <div className="text-sm text-gray-900">{efficiencyPerHour}%</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap border">
                        <div className="flex items-center justify-center h-6 w-6 rounded-full">
                          <div
                            className="h-full w-full rounded-full"
                            style={{
                              backgroundColor:
                                efficiencyPerHour >= 80
                                  ? '#10B981' // Green color
                                  : efficiencyPerHour >= 70
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
          </table>
        </div>
      </>
    )}
  </div>
);
}

export default MachineList;

