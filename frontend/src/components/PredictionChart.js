import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';

// Register required Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function PredictionChart({ predictions, originalData, filename }) {
    const [showTable, setShowTable] = useState(false); // Toggle between table and chart view

    // Helper function to calculate future dates
    const getFutureDates = (startDateObj, numDates) => {
        const startDate = startDateObj.date;  // Extract the date string from the object
        const futureDates = [];
        for (let i = 1; i <= numDates; i++) {
            futureDates.push(dayjs(startDate).add(i, 'day').format('YYYY-MM-DD'));
        }
        return futureDates;
    };

    // Combine original data and predictions for chart
    const getChartData = () => {
        const originalDates = originalData.map((data) => data.date);
        const futureDates = getFutureDates(originalData[originalData.length - 1], predictions.length);

        const dates = [...originalDates, ...futureDates];
        const originalValues = originalData.map((data) => data.value);
        const predictedValues = Array(originalData.length).fill(null).concat(predictions);

        return {
            labels: dates,
            datasets: [
                {
                    label: 'Original Data',
                    data: originalValues,
                    borderColor: 'rgba(54, 162, 235, 1)', // Blue
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    fill: false,
                },
                {
                    label: 'Predicted Data',
                    data: predictedValues,
                    borderColor: 'rgba(255, 99, 132, 1)', // Pink
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    fill: false,
                },
            ]
        };
    };

    // Combine original data and predictions for the table and reverse order
    const combinedData = [
        ...originalData.map((data) => ({ date: data.date, value: data.value, isPrediction: false })),
        ...predictions.map((pred, index) => ({
            date: getFutureDates(originalData[originalData.length - 1], predictions.length)[index],
            value: pred,
            isPrediction: true
        }))
    ].reverse(); // Reverse the combined data to show the most recent dates at the top

    // Function to download the data as an .xlsx file
    const downloadExcel = () => {
        // Prepare data for each sheet
        const originalDataSheet = originalData.map((data) => ({ Date: data.date, Value: data.value }));
        const predictedDataSheet = predictions.map((pred, index) => ({
            Date: getFutureDates(originalData[originalData.length - 1], predictions.length)[index],
            PredictedValue: pred
        }));
        const combinedDataSheet = combinedData.map((data) => ({
            Date: data.date,
            Value: data.value,
            Source: data.isPrediction ? "Predicted" : "Original"
        }));

        // Create a new workbook and add sheets
        const workbook = XLSX.utils.book_new();
        const originalSheet = XLSX.utils.json_to_sheet(originalDataSheet);
        const predictedSheet = XLSX.utils.json_to_sheet(predictedDataSheet);
        const combinedSheet = XLSX.utils.json_to_sheet(combinedDataSheet);

        XLSX.utils.book_append_sheet(workbook, originalSheet, "Original Data");
        XLSX.utils.book_append_sheet(workbook, predictedSheet, "Predicted Data");
        XLSX.utils.book_append_sheet(workbook, combinedSheet, "Combined Data");

        // Generate the filename based on the original filename
        const baseFilename = filename.replace(/\.[^/.]+$/, ""); // Remove extension if present
        const excelFilename = `${baseFilename}_predicted_data.xlsx`;

        // Trigger file download
        XLSX.writeFile(workbook, excelFilename);
    };

    return (
        <div className="mt-8">
            <h3 className="text-md font-semibold mb-2">Prediction Results</h3>
            
            {/* Tabs for switching views */}
            <div className="flex border-b border-gray-300">
                <button
                    onClick={() => setShowTable(false)}
                    className={`w-1/2 py-2 font-semibold ${
                        !showTable
                            ? "text-indigo-600 border-b-2 border-indigo-600"
                            : "text-gray-600 hover:text-indigo-600"
                    }`}
                >
                    Chart
                </button>
                <button
                    onClick={() => setShowTable(true)}
                    className={`w-1/2 py-2 font-semibold ${
                        showTable
                            ? "text-indigo-600 border-b-2 border-indigo-600"
                            : "text-gray-600 hover:text-indigo-600"
                    }`}
                >
                    Table
                </button>
            </div>

            {/* Conditionally render table or chart based on active tab */}
            {showTable ? (
                <div className="overflow-y-auto max-h-80 border border-gray-300 rounded-lg mt-4">
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b font-medium text-gray-600">Date</th>
                                <th className="py-2 px-4 border-b font-medium text-gray-600">Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {combinedData.map((data, index) => (
                                <tr
                                    key={index}
                                    className={
                                        data.isPrediction
                                            ? 'bg-pink-100 border border-pink-300 rounded-lg'
                                            : ''
                                    }
                                >
                                    <td className="py-2 px-4 border-b text-gray-700">{data.date}</td>
                                    <td className="py-2 px-4 border-b text-gray-700">{data.value}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="border border-gray-300 rounded-lg p-4 bg-white mt-4">
                    <Line data={getChartData()} options={{ responsive: true }} />
                </div>
            )}

            {/* Download Button */}
            <button
                onClick={downloadExcel}
                className="mt-6 border border-purple-600 text-purple-600 px-6 py-2 rounded-full flex items-center justify-start hover:bg-purple-100 focus:outline-none"
            >
                Download Results
                <svg
                    className="ml-2 w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fillRule="evenodd"
                        d="M16.707 10.293a1 1 0 00-1.414 0L11 14.586V3a1 1 0 10-2 0v11.586l-4.293-4.293a1 1 0 10-1.414 1.414l6 6a1 1 0 001.414 0l6-6a1 1 0 000-1.414z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>

        </div>
    );
}

export default PredictionChart;
