// src/components/ShiftTable.js
import React from 'react';

const ShiftTable = () => {
  const shifts = [
    { shift: '1. Previous shift - 1', targetQuantity: 100, producedQuantity: 90, efficiency: 90, remark: '' },
    { shift: '2. Previous shift - 2', targetQuantity: 100, producedQuantity: 85, efficiency: 85, remark: '' },
  ];

  const currentShifts = [
    { shift: 'Hour - 1', targetQuantity: 12.5, producedQuantity: 10, efficiency: 80, remark: '' },
    { shift: 'Hour - 2', targetQuantity: 12.5, producedQuantity: 10, efficiency: 75, remark: '' },
    { shift: 'Hour - 3', targetQuantity: 12.5, producedQuantity: 10, efficiency: 70, remark: '' },
    { shift: 'Hour - 4', targetQuantity: 12.5, producedQuantity: 10, efficiency: 95, remark: '' },
    { shift: 'Hour - 5', targetQuantity: 12.5, producedQuantity: 10, efficiency: 90, remark: '' },
    { shift: 'Hour - 6', targetQuantity: 12.5, producedQuantity: 10, efficiency: 80, remark: '' },
    { shift: 'Hour - 7', targetQuantity: 12.5, producedQuantity: 10, efficiency: 85, remark: '' },
    { shift: 'Hour - 8', targetQuantity: 12.5, producedQuantity: 10, efficiency: 88, remark: '' },
  ];

  const getRemarkColor = (efficiency) => {
    if (efficiency >= 90) {
      return 'bg-green-500'; // Green background for efficiency >= 90%
    } else if (efficiency >= 80) {
      return 'bg-yellow-500'; // Yellow background for efficiency >= 80% and < 90%
    } else {
      return 'bg-red-500'; // Red background for efficiency < 80%
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col">
        {/* First Table: Previous Shifts */}
        <table className="min-w-full bg-white border border-gray-200 mb-6">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-2 px-4 border-r border-gray-200">Shift</th>
              <th className="py-2 px-4 border-r border-gray-200">Target Quantity</th>
              <th className="py-2 px-4 border-r border-gray-200">Produced Quantity</th>
              <th className="py-2 px-4 border-r border-gray-200">Efficiency</th>
              <th className="py-2 px-4">Remark</th>
            </tr>
          </thead>
          <tbody>
            {shifts.map((shift, index) => (
              <tr key={index} className="text-center border-b border-gray-200">
                <td className="py-2 px-4 border-r border-gray-200">{shift.shift}</td>
                <td className="py-2 px-4 border-r border-gray-200">{shift.targetQuantity}</td>
                <td className="py-2 px-4 border-r border-gray-200">{shift.producedQuantity}</td>
                <td className="py-2 px-4 border-r border-gray-200">{shift.efficiency}%</td>
                <td className="py-2 px-4">
                  <span className={`w-6 h-6 rounded-full inline-block ${getRemarkColor(shift.efficiency)}`}></span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Second Table: Current Shift */}
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-2 px-4 border-r border-gray-200">Shift</th>
              <th className="py-2 px-4 border-r border-gray-200">Target Quantity</th>
              <th className="py-2 px-4 border-r border-gray-200">Produced Quantity</th>
              <th className="py-2 px-4 border-r border-gray-200">Efficiency</th>
              <th className="py-2 px-4">Remark</th>
            </tr>
          </thead>
          <tbody>
            {currentShifts.map((currentShift, index) => (
              <tr key={index} className="text-center border-b border-gray-200">
                <td className="py-2 px-4 border-r border-gray-200">{currentShift.shift}</td>
                <td className="py-2 px-4 border-r border-gray-200">{currentShift.targetQuantity}</td>
                <td className="py-2 px-4 border-r border-gray-200">{currentShift.producedQuantity}</td>
                <td className="py-2 px-4 border-r border-gray-200">{currentShift.efficiency}%</td>
                <td className="py-2 px-4">
                  <span className={`w-6 h-6 rounded-full inline-block ${getRemarkColor(currentShift.efficiency)}`}></span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShiftTable;
