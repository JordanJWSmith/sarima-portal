import pandas as pd
from io import StringIO

def process_csv(file):
    # Convert the uploaded file to a pandas DataFrame
    try:
        data = pd.read_csv(file)
    except Exception as e:
        raise ValueError("Invalid CSV file format.")
    return data
