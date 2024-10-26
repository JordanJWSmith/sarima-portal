import React from 'react';

function PredictionDisplay({ predictions }) {
    return (
        <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Predictions</h2>
            {predictions && predictions.length > 0 ? (
                <ul className="list-disc list-inside bg-gray-50 p-4 rounded shadow-inner">
                    {predictions.map((pred, index) => (
                        <li key={index} className="text-gray-700">{pred}</li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-600 italic">No predictions to display.</p>
            )}
        </div>
    );
}
export default PredictionDisplay;
