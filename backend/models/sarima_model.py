from statsmodels.tsa.statespace.sarimax import SARIMAX

def run_sarima(data, params):
    order = tuple(params['order'])
    seasonal_order = tuple(params['seasonal_order'])
    steps = params.get('steps', 10)  # Default to 10 if 'steps' is not provided
    model = SARIMAX(data, order=order, seasonal_order=seasonal_order).fit()
    predictions = model.forecast(steps)
    return predictions