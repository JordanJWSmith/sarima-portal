import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
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

// Register required Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function FileUpload({ setData, setFilename }) {
    const [uploadedFile, setUploadedFile] = useState(null);
    const [previewData, setPreviewData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("Chart");  // Active tab state

    const onDrop = async (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
            const formData = new FormData();
            formData.append("file", file);

            setIsLoading(true);

            try {
                const response = await axios.post("http://127.0.0.1:5000/upload", formData);
                setData(response.data.data);
                setPreviewData(response.data.data);
                setUploadedFile(file);
                setFilename(file.name);  // Pass filename to parent
                setIsLoading(false);
            } catch (error) {
                console.error("File upload failed.", error);
                setIsLoading(false);
            }
        }
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    const resetUpload = () => {
        setUploadedFile(null);
        setPreviewData(null);
        setFilename("");
    };

    // Prepare data for the chart
    const getChartData = () => {
        const dates = Object.values(previewData.date);
        const values = Object.values(previewData.value);

        return {
            labels: dates,
            datasets: [
                {
                    label: 'Uploaded Data',
                    data: values,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    fill: false,
                }
            ]
        };
    };

    return (
        <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Upload CSV File</h2>

            {uploadedFile ? (
                <div className="flex items-center justify-between">
                    <p className="text-green-600 text-lg">
                        ✅ {uploadedFile.name}
                    </p>
                    <button
                        onClick={resetUpload}
                        className="text-sm font-semibold text-indigo-600 hover:underline"
                    >
                        Upload a different file
                    </button>
                </div>
            ) : (
                <div
                    {...getRootProps()}
                    className="border-2 border-dashed border-gray-400 rounded-lg p-6 text-center cursor-pointer bg-gray-100 hover:bg-gray-200"
                >
                    <input {...getInputProps()} />
                    <p className="text-gray-600">Drag and drop a CSV file here, or click to select a file</p>
                </div>
            )}

            {isLoading && <p>Uploading...</p>}

            {previewData && (
                <>
                    <h3 className="text-md font-semibold mb-2 mt-4">Preview of Uploaded Data</h3>
                    
                    {/* Tab buttons */}
                    <div className="flex border-b border-gray-300">
                    <button
                            onClick={() => setActiveTab("Chart")}
                            className={`w-1/2 py-2 font-semibold ${
                                activeTab === "Chart"
                                    ? "text-indigo-600 border-b-2 border-indigo-600"
                                    : "text-gray-600 hover:text-indigo-600"
                            }`}
                        >
                            Chart
                        </button>
                        <button
                            onClick={() => setActiveTab("Table")}
                            className={`w-1/2 py-2 font-semibold ${
                                activeTab === "Table"
                                    ? "text-indigo-600 border-b-2 border-indigo-600"
                                    : "text-gray-600 hover:text-indigo-600"
                            }`}
                        >
                            Table
                        </button>
                    </div>

                    {/* Conditional rendering of Table or Chart */}
                    {activeTab === "Table" ? (
                        <div className="max-h-80 overflow-y-auto border border-gray-300 rounded-lg mt-4">
                            <table className="min-w-full bg-white">
                                <thead>
                                    <tr>
                                        {Object.keys(previewData).slice(0, 5).map((key) => (
                                            <th key={key} className="py-2 px-4 border-b font-medium text-gray-600">
                                                {key}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.keys(previewData[Object.keys(previewData)[0]]).map((_, index) => (
                                        <tr key={index}>
                                            {Object.keys(previewData).slice(0, 5).map((key) => (
                                                <td key={key} className="py-2 px-4 border-b text-gray-700">
                                                    {previewData[key][index]}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        // Chart View
                        <div className="border border-gray-300 rounded-lg p-4 bg-white mt-4">
                            <Line data={getChartData()} options={{ responsive: true }} />
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default FileUpload;
