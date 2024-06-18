import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DisplayData = () => {
  const [dataList, setDataList] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/machine1');
      setDataList(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to fetch data. Please try again.');
    }
  };

  return (
    <div className="max-w-lg w-full bg-white p-4 rounded-lg shadow-lg">
      <h2 className="text-lg font-medium text-gray-800 mb-4">Stored Data</h2>
      {dataList.length === 0 ? (
        <p>No data available</p>
      ) : (
        <ul>
          {dataList.map((data, index) => (
            <li key={index} className="mb-2">
              <p><span className="font-semibold">Shift:</span> {data.shift}</p>
              <hr className="my-2" />
            </li>
          ))}
          {dataList.map((data, index) => (
            <li key={index} className="mb-2">
              <p><span className="font-semibold">Machine:</span> {data.selectedMachine}</p>
              <p><span className="font-semibold">Total Working:</span> {data.totalWorking}</p>
              <p><span className="font-semibold">Day:</span> {data.day}</p>
              <p><span className="font-semibold">Shift:</span> {data.shift}</p>
              <p><span className="font-semibold">Hours:</span> {data.hours.join(', ')}</p>
              <hr className="my-2" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DisplayData;