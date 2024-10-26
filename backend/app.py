import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
from models.sarima_model import run_sarima
from services.file_service import process_csv
from utils.data_processing import validate_params

app = Flask(__name__)
CORS(app)  # Allow CORS for communication with React frontend

@app.route('/upload', methods=['POST'])
def upload_csv():
    file = request.files['file']
    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    data = process_csv(file)  # Process CSV file to DataFrame
    return jsonify({"message": "File uploaded successfully!", "data": data.to_dict()}), 200


@app.route('/predict', methods=['POST'])
def predict():
    request_data = request.json
    data = pd.DataFrame(request_data['data'])

    # Convert the 'value' column to numeric and handle errors
    if 'value' not in data.columns:
        return jsonify({"error": "Missing 'value' column in data"}), 400
    
    data['value'] = pd.to_numeric(data['value'], errors='coerce')
    data = data.dropna()  # Drop any rows with NaN values, if any

    params = request_data['params']

    try:
        # Validate parameters before running the model
        validate_params(params)

        # Run the SARIMA model with user-defined parameters
        predictions = run_sarima(data['value'], params)
        return jsonify({"predictions": predictions.tolist()}), 200
    except ValueError as e:
        return jsonify({"error": f"Parameter validation error: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": f"Prediction failed: {str(e)}"}), 500
