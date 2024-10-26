import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import ParamInput from './components/ParamInput';
import PredictionChart from './components/PredictionChart';
import axios from 'axios';

function App() {
    const [data, setData] = useState(null);
    const [predictions, setPredictions] = useState([]);

    const handleRunPrediction = async (params) => {
        if (!data) {
            alert("Please upload a CSV file first.");
            return;
        }

        try {
            const response = await axios.post('http://127.0.0.1:5000/predict', {
                data: data,
                params: params
            });
            setPredictions(response.data.predictions);
        } catch (error) {
            alert("Prediction failed.");
            console.error(error);
        }
    };

    const formatDataForChart = () => {
        if (data && typeof data.date === 'object' && typeof data.value === 'object') {
            const dates = Object.values(data.date);
            const values = Object.values(data.value);

            return dates.map((date, index) => ({
                date: date,
                value: values[index]
            }));
        }
        return [];
    };

    return (
        <div className="min-h-screen bg-gray-100 text-gray-800 p-8 flex items-center justify-center">
            <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
                
                {/* Hero Section */}
                <header className="relative isolate overflow-hidden rounded-lg">
                    <div className="absolute inset-x-0 -top-20 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-40">
                        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
                    </div>
                    <div className="text-center px-6 py-16">
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">SARIMAnshu</h1>
                        <p className="mt-4 text-lg leading-7 text-gray-600">
                            Predict your time series data using SARIMA, with options to customize parameters for seasonal trends.
                        </p>
                    </div>
                    <div className="absolute inset-x-0 top-[calc(100%-10rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-20rem)]">
                        <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"></div>
                    </div>
                </header>

                {/* File Upload Section */}
                <div className="mt-8" id="upload-section">
                    <FileUpload setData={setData} />
                </div>

                {/* Conditionally Rendered Sections */}
                {data && (
                    <>
                        <div className="mt-8">
                            <ParamInput onSubmit={handleRunPrediction} />
                        </div>
                        {predictions.length > 0 && (
                            <PredictionChart predictions={predictions} originalData={formatDataForChart()} />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default App;
