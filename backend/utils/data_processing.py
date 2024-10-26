def validate_params(params):
    # Check that required keys exist
    if 'order' not in params or 'seasonal_order' not in params:
        raise ValueError("Parameters must include 'order' and 'seasonal_order' keys.")

    # Check the 'order' parameter
    order = params['order']
    if not (isinstance(order, list) or isinstance(order, tuple)) or len(order) != 3:
        raise ValueError("'order' must be a list or tuple of three non-negative integers (p, d, q).")
    if not all(isinstance(x, int) and x >= 0 for x in order):
        raise ValueError("'order' elements must be non-negative integers.")

    # Check the 'seasonal_order' parameter
    seasonal_order = params['seasonal_order']
    if not (isinstance(seasonal_order, list) or isinstance(seasonal_order, tuple)) or len(seasonal_order) != 4:
        raise ValueError("'seasonal_order' must be a list or tuple of four non-negative integers (P, D, Q, m).")
    
    if not all(isinstance(x, int) and x >= 0 for x in seasonal_order[:3]):
        raise ValueError("The first three elements of 'seasonal_order' (P, D, Q) must be non-negative integers.")
    
    if not isinstance(seasonal_order[3], int) or seasonal_order[3] < 1:
        raise ValueError("The fourth element of 'seasonal_order' (m) must be a positive integer.")

    # If all checks pass, return True to indicate validation success
    return True
