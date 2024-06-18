import React from 'react';

const HoursContainer = ({ hours, handleHoursChange, handleAddHourToDB }) => {
  return (
    <div className="bg-pink-200 rounded-lg p-6 w-full max-w-md">
      <div className="grid grid-cols-2 gap-4">
        {hours.map((hour, index) => (
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
  );
};

export default HoursContainer;
