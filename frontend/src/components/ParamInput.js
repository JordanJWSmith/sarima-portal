import React, { useState } from 'react';

function ParamInput({ onSubmit }) {
    const [params, setParams] = useState({
        order: { p: 1, d: 1, q: 1 },
        seasonal_order: { P: 1, D: 1, Q: 1, m: 12 },
        steps: 10 // Default number of steps
    });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value, dataset } = e.target;
        const section = dataset.section;

        setParams((prevParams) => ({
            ...prevParams,
            [section]: {
                ...prevParams[section],
                [name]: parseInt(value, 10) || 0
            }
        }));

        setError("");  // Clear error message when the user changes input
    };

    const handleStepsChange = (e) => {
        setParams((prevParams) => ({
            ...prevParams,
            steps: parseInt(e.target.value, 10) || 10
        }));
    };

    const validateParams = () => {
        const { p, d, q } = params.order;
        const { P, D, Q, m } = params.seasonal_order;

        // Check if values are within a reasonable range
        if (p < 0 || d < 0 || q < 0 || P < 0 || D < 0 || Q < 0 || m <= 0) {
            return "Parameters cannot be negative, and m must be positive.";
        }

        if (p > 5 || d > 2 || q > 5 || P > 5 || D > 2 || Q > 5) {
            return "Parameters p, q, P and Q should typically be between 0 and 5. Parameters d and D should typically be between 0 and 2.";
        }

        if (q >= m && Q > 0) {
            return `Invalid model: moving average lag(s) ${m} are in both the seasonal and non-seasonal moving average components.`;
        }

        return ""; // No errors
    };

    const handleSubmit = () => {
        const validationError = validateParams();
        if (validationError) {
            setError(validationError);
        } else {
            setError("");
            const formattedParams = {
                order: [params.order.p, params.order.d, params.order.q],
                seasonal_order: [params.seasonal_order.P, params.seasonal_order.D, params.seasonal_order.Q, params.seasonal_order.m],
                steps: params.steps
            };
            onSubmit(formattedParams);
        }
    };

    return (
        <div className="mb-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Set SARIMA Parameters</h3>

            {error && (
                <p className="text-red-600 mb-4">{error}</p>
            )}

            {/* Grid Layout for Order and Seasonal Order */}
            <div className="grid grid-cols-4 gap-4 mb-4">
                <div>
                    <label className="block text-sm font-medium text-gray-600">p (AR)</label>
                    <input
                        type="number"
                        name="p"
                        value={params.order.p}
                        data-section="order"
                        onChange={handleChange}
                        className="w-full p-1 text-gray-700 border border-gray-300 rounded-md"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600">d (I)</label>
                    <input
                        type="number"
                        name="d"
                        value={params.order.d}
                        data-section="order"
                        onChange={handleChange}
                        className="w-full p-1 text-gray-700 border border-gray-300 rounded-md"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600">q (MA)</label>
                    <input
                        type="number"
                        name="q"
                        value={params.order.q}
                        data-section="order"
                        onChange={handleChange}
                        className="w-full p-1 text-gray-700 border border-gray-300 rounded-md"
                    />
                </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-600">P (Seasonal AR)</label>
                    <input
                        type="number"
                        name="P"
                        value={params.seasonal_order.P}
                        data-section="seasonal_order"
                        onChange={handleChange}
                        className="w-full p-1 text-gray-700 border border-gray-300 rounded-md"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600">D (Seasonal I)</label>
                    <input
                        type="number"
                        name="D"
                        value={params.seasonal_order.D}
                        data-section="seasonal_order"
                        onChange={handleChange}
                        className="w-full p-1 text-gray-700 border border-gray-300 rounded-md"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600">Q (Seasonal MA)</label>
                    <input
                        type="number"
                        name="Q"
                        value={params.seasonal_order.Q}
                        data-section="seasonal_order"
                        onChange={handleChange}
                        className="w-full p-1 text-gray-700 border border-gray-300 rounded-md"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600">m (Season Length)</label>
                    <input
                        type="number"
                        name="m"
                        value={params.seasonal_order.m}
                        data-section="seasonal_order"
                        onChange={handleChange}
                        className="w-full p-1 text-gray-700 border border-gray-300 rounded-md"
                    />
                </div>
            </div>

            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-600">Forecast Steps</label>
                <input
                    type="number"
                    name="steps"
                    value={params.steps}
                    onChange={handleStepsChange}
                    className="w-full p-1 text-gray-700 border border-gray-300 rounded-md"
                    min="1"
                />
            </div>

            {/* Styled Run Prediction Button */}
            <button
                onClick={handleSubmit}
                className="mt-6 bg-purple-600 text-white px-6 py-3 rounded-full flex items-center justify-center mx-auto hover:bg-purple-700 focus:outline-none"
            >
                Run Prediction
                <svg
                    className="ml-2 -mr-1 w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fillRule="evenodd"
                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>
        </div>
    );
}

export default ParamInput;
